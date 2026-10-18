#!/usr/bin/env bash
# PreToolUse[Bash|PowerShell] guard: never commit on the main branch.
#
# Both shell tools: on Windows, wherever Claude Code's PowerShell tool is on,
# Claude routes shell commands through it, and a hook that matches only Bash
# never sees them (code.claude.com/docs/en/hooks, "PowerShell"). The hook itself
# always runs in bash (Git Bash on Windows); it reads a PowerShell command with
# the same rules, plus PowerShell's own ways of changing the directory.
#
# AGENTS.md section 3 is explicit - work happens on a short-lived branch, never
# straight on main. This hook is the code that makes that a rule instead of a
# request, for one tool: Claude Code. Codex, Cursor and a human typing in a
# terminal never run it - for them the rule binds by being read. Honesty about
# what a guard actually covers is part of the guard.
#
# WHICH REPOSITORY A COMMIT TARGETS. A guard must enumerate every syntactic form
# of the operation it restricts: `cd <dir> && git commit`, `git -C <dir> commit`,
# `git --git-dir=<dir>/.git --work-tree=<dir> commit` and a bare `git commit`;
# in PowerShell also `Set-Location <dir>; git commit` and its aliases.
# Only the commit's own invocation and a `cd` before it choose the repository
# (`git -C <other> status && git commit` judges the commit, not the status), and
# git itself resolves those options. Everything is judged from the SESSION's
# directory, which the event carries as `cwd`. The hook process itself runs in the project folder, and in a desktop
# app session that is not where the session works (each session has its own
# worktree), so judging the process directory refuses honest work.
#
# EXIT CODES MATTER: in Claude Code hooks, ONLY exit 2 blocks the action.
# Exit 1 is a non-blocking error and the action proceeds. Fails OPEN by design:
# an unparseable payload, or a directory the hook cannot resolve (a shell
# variable such as "$DIR"), must never become an unexplained refusal. On Windows
# without Git Bash this script cannot run at all, and Claude Code would then
# block every shell command; `"onFailure": "continue"` in settings.json keeps
# that failure open as well (code.claude.com/docs/en/hooks, "Failed hooks on
# Windows without Git Bash").
# Fixtures: tests/hooks/no-main-commit.test.ts.

set -uo pipefail

input=$(cat)

# Everything is judged from the session's directory. Without it (no jq, an
# event without cwd, a payload that is not JSON) nothing can be judged honestly,
# so the hook lets the commit through rather than judge its own directory.
session_dir=$(printf '%s' "$input" | jq -r '.cwd // empty' 2>/dev/null | tr -d '\r')
[ -n "$session_dir" ] && [ -d "$session_dir" ] || exit 0

# Fast reject only - NOT the decision: "commit" somewhere after "git". Read-only
# commands that merely contain the word (`git cat-file -e <sha>^{commit}`,
# `git log --grep=commit`, `git commit-graph`) are filtered out below, where
# "commit" must be the actual subcommand. Quotes may stand in between, so
# `git -C "<dir>" commit` reaches the decision.
printf '%s' "$input" | grep -qE '\bgit\b[^;|&]*\bcommit\b' || exit 0

# The decision reads two fields of the event, the command and the session's
# cwd, never the tool's description. jq unescapes the JSON string, so a quoted
# path arrives as written. (The fast reject above only skips events with no
# "git ... commit" anywhere in them; it never refuses anything.)
command_line=$(printf '%s' "$input" | jq -r '.tool_input.command // empty' 2>/dev/null | tr -d '\r')
[ -n "$command_line" ] || exit 0

# Is "commit" the git SUBCOMMAND - the first token after "git" that does not
# start with "-"? -C, -c, --git-dir, --work-tree and --namespace may take their
# value as a separate next token, so that token is skipped too.
is_commit_invocation() {
  local segment="$1"
  local -a tokens
  read -ra tokens <<< "$segment"
  local n=${#tokens[@]}
  [ "${tokens[0]:-}" = "git" ] || return 1
  local i=1
  while [ "$i" -lt "$n" ]; do
    case "${tokens[$i]}" in
      # These print something and exit: `git --help commit` is not a commit.
      -h | --help | -v | --version | --exec-path | --html-path | --man-path | --info-path | --list-cmds=*) return 1 ;;
      -C | -c | --git-dir | --work-tree | --namespace) i=$((i + 2)) ;;
      -*) i=$((i + 1)) ;;
      *) break ;;
    esac
  done
  [ "${tokens[$i]:-}" = "commit" ] || return 1
  # A commit that only prints and writes nothing is not a commit either. The
  # complete list from `git help commit`: --dry-run, and --short, --porcelain,
  # --long and -z/--null, each of which implies it; plus -h and --help.
  local j=$((i + 1))
  while [ "$j" -lt "$n" ]; do
    case "${tokens[$j]}" in
      -h | --help | --dry-run | --short | --porcelain | --long | -z | --null) return 1 ;;
    esac
    j=$((j + 1))
  done
  return 0
}

unquote() {
  local t="$1"
  t=${t#\"}; t=${t%\"}; t=${t#\'}; t=${t%\'}
  printf '%s' "$t"
}

# A path the shell would still expand ($VAR, $(...), `...`, ~) cannot be judged.
opaque() {
  case "$1" in *'$'* | *'`'* | '~'*) return 0 ;; esac
  return 1
}

# Words that change the directory: cd and pushd in both shells, and PowerShell's
# Set-Location (also sl and chdir) and Push-Location. PowerShell ignores case.
changes_dir() {
  local r=1
  shopt -s nocasematch
  case "$1" in cd | pushd | sl | chdir | set-location | push-location) r=0 ;; esac
  shopt -u nocasematch
  return "$r"
}

# PowerShell may name the path: `Set-Location -Path <dir>` or `-LiteralPath`.
names_path() {
  local r=1
  shopt -s nocasematch
  case "$1" in -path | -literalpath) r=0 ;; esac
  shopt -u nocasematch
  return "$r"
}

# Walk the invocations (`cd x && git commit` is two). Remember the last `cd`
# before the commit; read the repository options ONLY from the commit's own
# invocation, so `git -C <other> status && git commit` judges the commit, not
# the status. The options are handed to git itself to resolve.
cd_target=""
opts=()
found=0
while read -r seg; do
  read -ra tokens <<< "$seg"
  if changes_dir "${tokens[0]:-}"; then
    p=1
    names_path "${tokens[1]:-}" && p=2
    cd_target=$(unquote "${tokens[$p]:-~}")
    continue
  fi
  is_commit_invocation "$seg" || continue
  found=1
  n=${#tokens[@]}
  i=1
  while [ "$i" -lt "$n" ]; do
    t=${tokens[$i]}
    case "$t" in
      -C | --git-dir | --work-tree)
        v=$(unquote "${tokens[$((i + 1))]:-}")
        opaque "$v" && exit 0
        if [ "$t" = "-C" ]; then opts+=("-C" "$v"); else opts+=("$t=$v"); fi
        i=$((i + 2)) ;;
      --git-dir=* | --work-tree=*)
        v=$(unquote "${t#*=}")
        opaque "$v" && exit 0
        opts+=("${t%%=*}=$v")
        i=$((i + 1)) ;;
      -c) i=$((i + 2)) ;;
      -*) i=$((i + 1)) ;;
      *) break ;;
    esac
  done
  break
done < <(printf '%s\n' "$command_line" | sed -E 's/(&&|\|\||;|\|)/\n/g')

[ "$found" = 1 ] || exit 0

start=$session_dir
if [ -n "$cd_target" ]; then
  opaque "$cd_target" && exit 0
  start=$(cd "$session_dir" 2>/dev/null && cd "$cd_target" 2>/dev/null && pwd) || exit 0
fi

branch=$(cd "$start" && git "${opts[@]+"${opts[@]}"}" symbolic-ref --quiet --short HEAD 2>/dev/null) || exit 0

if [ "$branch" = "main" ]; then
  where=$(cd "$start" && git "${opts[@]+"${opts[@]}"}" rev-parse --show-toplevel 2>/dev/null) || where=$start
  echo "BLOCKED (AGENTS.md section 3): HEAD in $where is on 'main' - work belongs on a branch. Run: git switch -c <branch-name>, then commit." 1>&2
  exit 2
fi

exit 0
