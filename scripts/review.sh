#!/bin/sh
# The two review passes from AGENTS.md section 3, run by a mind that did not
# write the change, on the exact commit you are about to push.
#
#   scripts/review.sh <claude|codex|other> <base-ref> "<user outcome>"
#
# The first argument names who WROTE the change (`other` for another agent or a
# person working in THIS repository).
#
# TRUST: the script runs the branch's own `npm run verify` on this machine. Run it
# on your own work and your own agents' work only. A branch from somebody you do
# not trust (a pull request from a fork) is never checked out locally, because
# switching to a branch runs the git hooks it carries; CI runs it on GitHub's machines without access to your secrets.
#
# Routing: the logic pass runs on the tool that did not write the change (Codex
# for `claude` and `other`, Claude for `codex`), because a different model has
# different blind spots. The security pass runs on Codex, or on Claude when Codex
# wrote the change. When the other tool is not installed, both passes fall back
# to the one you have, and the record says so: a same-tool review is better than
# none, and worse than an independent one.
#
# Each pass follows its instructions in .claude/agents/ (reviewer.md and
# security-reviewer.md), so the agents and this script never disagree.
#
# Evidence goes to <git common dir>/review-evidence/<sha>/ - outside the working
# tree, shared by every worktree, never committed. Any new commit has a new SHA
# and therefore no evidence: the review is of a commit, not of a branch.
#
# Environment: REVIEW_CODEX_MODEL and REVIEW_CLAUDE_MODEL pick a model (default:
# each tool's own default); REVIEW_DEADLINE_SECONDS (default 2400) turns a hung
# reviewer into a named failure instead of silence.
set -eu

usage='Usage: scripts/review.sh <claude|codex|other> <base-ref> "<user outcome>"'
author=${1:?$usage}
base_ref=${2:?$usage}
outcome=${3:?$usage}

# `other` is another agent or a person: neither tool wrote it, so either one is
# an independent reviewer. Anything else is a typo, refused rather than guessed.
case "$author" in
  claude | codex | other) ;;
  *) echo "The author must be claude, codex or other (another agent or a person)." >&2; exit 1 ;;
esac
command -v jq >/dev/null 2>&1 || { echo "BLOCKED: jq is required (Windows: winget install --id jqlang.jq -e; macOS: brew install jq; Linux: apt install jq)." >&2; exit 1; }

repo_root=$(git rev-parse --show-toplevel)
cd "$repo_root"
test -z "$(git status --porcelain)" || { echo "BLOCKED: commit or stash your changes first; a review is of a commit." >&2; exit 1; }

base_sha=$(git rev-parse "$base_ref")
head_sha=$(git rev-parse HEAD)
git merge-base --is-ancestor "$base_sha" "$head_sha" || { echo "BLOCKED: $base_ref is not an ancestor of HEAD. Rebase first." >&2; exit 1; }

common_dir=$(git rev-parse --path-format=absolute --git-common-dir)
evidence="$common_dir/review-evidence/$head_sha"
mkdir -p "$evidence"

# The gate runs first, on this exact commit. "I ran the tests" is not evidence;
# a recorded exit code is.
if ! npm run verify > "$evidence/gate.txt" 2>&1; then
  echo "BLOCKED: npm run verify failed on $head_sha. Fix it and commit before review. Log: $evidence/gate.txt" >&2
  exit 1
fi

deadline=${REVIEW_DEADLINE_SECONDS:-2400}
run_with_deadline() {
  "$@" &
  pid=$!
  ( sleep "$deadline"; kill -TERM "$pid" 2>/dev/null ) &
  watchdog=$!
  if wait "$pid" 2>/dev/null; then status=0; else status=$?; fi
  kill -TERM "$watchdog" 2>/dev/null || true
  wait "$watchdog" 2>/dev/null || true
  return "$status"
}

# Runs one pass on one tool and writes its final message to $2.
run_pass() {
  tool=$1 out=$2 prompt=$3
  if [ "$tool" = codex ]; then
    set -- codex exec --ephemeral --sandbox read-only --json
    [ -n "${REVIEW_CODEX_MODEL:-}" ] && set -- "$@" --model "$REVIEW_CODEX_MODEL"
    run_with_deadline "$@" "$prompt" > "$out.raw" 2>/dev/null || return 1
    jq -r 'select(.type == "item.completed" and .item.type == "agent_message") | .item.text' "$out.raw" | tr -d '\r' > "$out"
  else
    set -- claude -p --permission-mode plan --output-format json
    [ -n "${REVIEW_CLAUDE_MODEL:-}" ] && set -- "$@" --model "$REVIEW_CLAUDE_MODEL"
    run_with_deadline "$@" "$prompt" > "$out.raw" 2>/dev/null || return 1
    jq -r '.result // empty' "$out.raw" | tr -d '\r' > "$out"
  fi
  rm -f "$out.raw"
  test -s "$out"
}

has() { command -v "$1" >/dev/null 2>&1; }
if [ "$author" = other ]; then
  logic_tool=codex
  has codex || logic_tool=claude
else
  logic_tool=codex
  [ "$author" = codex ] && logic_tool=claude
  has "$logic_tool" || logic_tool=$author
fi
# Security on Codex, unless Codex wrote the change and Claude is there to read it.
security_tool=codex
[ "$author" = codex ] && has claude && security_tool=claude
has "$security_tool" || security_tool=$logic_tool
has "$logic_tool" || { echo "BLOCKED: neither claude nor codex is installed." >&2; exit 1; }
independence=independent
{ [ "$logic_tool" = "$author" ] || [ "$security_tool" = "$author" ]; } && independence=same-tool

scope="Review the immutable diff $base_sha...$head_sha in this repository. Stay read-only: change no file and run nothing that writes."
logic_prompt="Follow .claude/agents/reviewer.md. The author states the intended outcome: \"$outcome\". Judge that outcome FIRST: does the diff deliver it for an ordinary user on the plain path, and is it the simplest mechanism that does? $scope Say explicitly whether any part defends a scenario nobody has observed. The last line of your answer must be exactly VERDICT: SHIP or VERDICT: NO-SHIP."
security_prompt="Follow .claude/agents/security-reviewer.md. $scope The last line of your answer must be exactly VERDICT: SHIP or VERDICT: NO-SHIP."

run_pass "$logic_tool" "$evidence/logic.txt" "$logic_prompt" \
  || { echo "BLOCKED: the logic pass ($logic_tool) returned nothing within ${deadline}s. Check that the tool is logged in and its model is available (REVIEW_CODEX_MODEL / REVIEW_CLAUDE_MODEL)." >&2; exit 1; }
run_pass "$security_tool" "$evidence/security.txt" "$security_prompt" \
  || { echo "BLOCKED: the security pass ($security_tool) returned nothing within ${deadline}s. Check that the tool is logged in and its model is available." >&2; exit 1; }

logic_verdict=$(scripts/read-review-verdict.sh "$evidence/logic.txt")
security_verdict=$(scripts/read-review-verdict.sh "$evidence/security.txt")

jq -n --arg base "$base_sha" --arg head "$head_sha" --arg author "$author" \
  --arg logic_tool "$logic_tool" --arg security_tool "$security_tool" --arg independence "$independence" \
  --arg logic "$logic_verdict" --arg security "$security_verdict" --arg outcome "$outcome" \
  --arg at "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  '{base_sha: $base, head_sha: $head, author: $author, logic_tool: $logic_tool, security_tool: $security_tool,
    independence: $independence, logic_verdict: $logic, security_verdict: $security, gate: "PASS",
    outcome: $outcome, created_at: $at}' > "$evidence/manifest.json"

echo "logic ($logic_tool): $logic_verdict   security ($security_tool): $security_verdict   [$independence]"
echo "evidence: $evidence"
[ "$logic_verdict" = SHIP ] && [ "$security_verdict" = SHIP ] || exit 1
