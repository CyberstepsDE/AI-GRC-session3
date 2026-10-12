# Cybersteps Training Starter

A template for a **way of working with an AI coding agent**. It is not an
application - there is no product code here yet, and that is the point. What is
checked in is everything that stays true no matter what you build: the rules the
agent reads, the review agents that check its work, the commands that verify every
change, and the automation that runs those commands for you.

You bring the idea. The agent asks you questions about it, writes a short plan,
and builds it inside this structure, one verified step at a time.

## This copy: AI for Cybersecurity, session 3 (GRC)

This repository is the VibeEngineering template plus the data for the Compliance
Guard lab, so the agent has everything it needs to build the app:

- `prompts.md` - the brief for the building agent and the prompts in reserve
- `agent/assessor.md` - the instructions of the app's assessment agent
- `standards/` - ISO/IEC 27001:2022, ISO/IEC 27002:2022, the BSI Act (BSIG), the
  NIS2 Directive and Implementing Regulation (EU) 2024/2690 as Markdown
- `sample-company/` - the made-up company Beispiel IT-Services GmbH: profile,
  questionnaire, answers, and `manifest.json`, which marks it as made-up

Get your copy with
`git clone https://github.com/CyberstepsDE/AI-GRC-session3.git compliance-guard`,
then continue with step 2 below.

## What is inside

Every tracked file, and why it is there:

```text
.
├── AGENTS.md                          - the contract: rules an AI agent reads before doing anything
├── CLAUDE.md                          - a stub that points Claude Code at AGENTS.md
├── README.md                          - this file
├── LICENSE                            - MIT
├── rules/                             - the detail behind AGENTS.md, one topic per file
│   ├── less-is-more.md                - gate 1: not a single unnecessary character
│   ├── facts-only.md                  - gate 2: no claim without a citation
│   ├── critical-thinking.md           - trust nothing until checked; the lenses every change is checked with
│   ├── do-exactly-what-was-asked.md   - build what was asked; a doubt is a question, not an improvement
│   ├── coding-standards.md            - shape of the code: one module, one job, one home per rule
│   ├── secrets.md                     - nothing secret ever touches version control
│   ├── review-calibration.md          - what a review finding is worth, and how to decline one
│   └── what-checks-prove.md           - what a green check does and does not tell you
├── .claude/
│   ├── settings.json                  - hook wiring (session reminder, commit guard, critical-thinking reminder), force-push denied
│   ├── agents/                        - the team of subagents
│   │   ├── reviewer.md                - review pass 1 of 2: attacks the logic
│   │   ├── security-reviewer.md       - review pass 2 of 2: security holes only
│   │   ├── researcher.md              - checks facts against live sources before they get written
│   │   └── ux-reviewer.md             - walks a UI change as a first-time user
│   ├── hooks/
│   │   ├── no-main-commit.sh          - blocks a commit on the main branch (Claude Code only)
│   │   └── critical-thinking-reminder.sh - a short reminder on every message (Claude Code and Codex)
│   └── skills/                        - named routines you trigger by typing their name
│       ├── onboarding/SKILL.md        - /onboarding: a guided first session for somebody new here
│       ├── start/SKILL.md             - /start: load context before acting
│       ├── grill-me/SKILL.md          - /grill-me: the agent interviews you before building
│       ├── cross-review/SKILL.md      - /cross-review: the two review passes on the committed branch
│       ├── save/SKILL.md              - /save: write down what happened for the next session
│       ├── grill-with-docs/, grilling/ - interview that also records decisions and terms
│       ├── codebase-design/           - vocabulary for designing deep modules
│       ├── domain-modeling/           - glossary and decision records
│       ├── improve-codebase-architecture/ - find modules worth deepening
│       ├── diagnosing-bugs/           - a reproducible failing loop before any theory, then the fix, with a regression test where one can reach the bug
│       └── THIRD_PARTY.md             - the six skills above come from mattpocock/skills (MIT)
├── .agents                            - a symlink to .claude, so other agent tools find the same config
├── .codex/hooks.json                  - the same critical-thinking reminder for Codex (trust it once with /hooks)
├── .githooks/                         - git hooks for every tool and person, enabled by npm ci in a git checkout
│   ├── pre-commit                     - scans staged changes for secrets (when gitleaks is installed)
│   └── pre-push                       - refuses a push to main or a red clean checkout; warns when unreviewed
├── scripts/
│   ├── review.sh                      - runs both review passes on the other tool, records the verdicts
│   ├── check-reviews.sh               - does this commit carry two SHIP verdicts
│   └── read-review-verdict.sh         - reads one verdict, strictly
├── .github/
│   ├── workflows/ci.yml               - CI: typecheck, lint, test, build, audit and a secret scan on every pull request
│   └── pull_request_template.md       - what a pull request here must say
├── docs/
│   ├── DEPLOYMENT.md                  - for the agent: putting a project online, when the person wants it (any host)
│   └── LAB.md                         - a worked example: one app built stage by stage, taken online with Vercel
├── src/                               - the application (today: a one-page placeholder to delete)
│   ├── main.tsx
│   ├── ui/App.tsx
│   └── styles.css
├── tests/                             - one placeholder test per harness, named as something to delete
│   ├── placeholder.test.ts            - unit (Vitest)
│   ├── placeholder.browser.test.ts    - browser (Playwright)
│   └── hooks/                         - fixtures for the commit guard, the push hook and the verdict reader; keep them
├── index.html, vite.config.ts         - Vite app shell
├── tsconfig*.json, eslint.config.js   - TypeScript strict + ESLint, zero warnings allowed
├── playwright.config.ts               - browser test setup
├── package.json, package-lock.json    - scripts and pinned dependencies
├── .nvmrc                             - the Node version, picked up by nvm automatically
└── .gitignore                         - what never gets committed (.env files above all)
```

Three words worth defining once:

- **Agent** - the AI tool doing the typing (Claude Code, Codex CLI, or similar).
  You talk to it in plain language; it reads and writes the files above.
- **Skill** - a routine in `.claude/skills/` you trigger by typing its name, like
  `/start`. It is instructions in plain English for the agent, not a program.
- **CI** (Continuous Integration) - a robot on GitHub that repeats the same checks
  on every pull request, so nobody has to remember to run them by hand. It runs
  only once the project is on GitHub; a local project has none.

## Requirements

- [Node.js](https://nodejs.org) 22.12 or newer. With `nvm`, run `nvm use` in this
  folder and it picks the right version from `.nvmrc`.
- An AI coding agent: [Claude Code](https://code.claude.com), Codex CLI, or
  similar. The template is written for any of them. Having BOTH Claude Code and
  Codex makes the review independent (one writes, the other reviews).
- `jq`, used by the commit hook (and so by its tests in `npm run verify`) and by
  the review script (`brew install jq`; preinstalled on recent macOS).
- Recommended: [gitleaks](https://github.com/gitleaks/gitleaks), so a secret is
  caught on your machine before it is pushed (`brew install gitleaks`). Without it
  the commit hook warns and CI still scans.
- Optional: a [GitHub](https://github.com) account, once you want the project on
  GitHub (pull requests and CI). A local project needs none.

## How to use it, step by step

1. **Get a copy onto your machine** with git, one folder per project:
   ```bash
   git clone https://github.com/CyberstepsDE/VibeEngineering.git my-project
   ```
   That is all a local project needs. If you want the project on GitHub from
   the start, press "Use this template" -> "Create a new repository" instead and
   clone your new repository; later works too, the agent can connect it for you.
2. **Open the folder in your AI coding agent.** The project's dependencies are
   installed by the agent, not typed by you.
3. **Type `/onboarding` the first time** - the agent walks you through the setup
   and the way of working, one step at a time. After that, **start every session
   with `/start`.** It installs the dependencies (`npm ci`, which also switches on
   the git hooks in `.githooks/`), reads `AGENTS.md`, checks that the project
   still runs, and reports what it found instead of guessing.
4. **Work.** Tell the agent in your own words what you want to build. It will
   interview you before writing code (`/grill-me` forces this when it does not
   happen on its own). Work lands on a branch, gets reviewed (next section), and
   merges into `main`: on your machine for a local project, through a pull
   request once the project is on GitHub.
5. **Online, only when you want it.** A local project needs no server and no
   staging. When you decide to put it online, the agent follows
   `docs/DEPLOYMENT.md`: you choose the host, and a project people rely on gets
   a staging environment before production.

For the next idea, start again from a fresh copy - every project gets its own
folder and history. The rules, agents and checks come with it; `src/` and
`tests/` are placeholders you replace. `docs/LAB.md` is one worked example that
builds an app stage by stage and takes it online with GitHub and Vercel; your
own project needs neither.

## The two review passes

Nothing merges here on the word of the mind that wrote it. Before a change
merges, it gets **two review passes**, each by a reviewer that did not write
the code:

1. **Logic** - does the change do the right thing, and what did the author not
   think to check.
2. **Security** - only holes: user input reaching a request or the page
   unescaped, a secret in code or config, data sent where the user did not ask,
   a public endpoint a stranger could abuse.

Run them with `/cross-review` (the script `scripts/review.sh`), after committing and
before merging:

- **With both Claude Code and Codex**, the logic pass runs on the tool that did
  NOT write the change and the security pass runs on Codex (on Claude when Codex
  wrote it). A different model has
  different blind spots than the model that wrote the code - that independence is
  the value.
- **With only one tool**, both passes run on it. The record says `same-tool`
  when that tool also wrote the change, and `independent` when the author is
  `other` (a person or another agent), since neither pass ran on the author.
  With no CLI at all, open a fresh agent session on the branch and run
  `.claude/agents/reviewer.md`, then `.claude/agents/security-reviewer.md`.

The verdicts are stored for the exact commit, outside the repository files; a new
commit needs a new review. The script runs the branch's own checks on your machine,
so it is for your own work and your agents' work. A pull request from somebody you
do not trust is read on GitHub and checked by CI, never checked out locally: with
this repository's git hooks switched on, merely switching to a branch runs any
hook it carries.

Both passes return **SHIP** or **NO-SHIP** with findings. NO-SHIP findings go
back to the author; the reviewer re-reads the fix. Both verdicts, and the reason
for any declined finding, go where the merge is recorded: the pull request, or
the merge commit message of a local project. Two more agents help but gate
nothing: `researcher.md` checks a fact against the live source before it gets
written down, and `ux-reviewer.md` walks a UI change as a person seeing the
screen for the first time.

## What is enforced, and what is convention

An instruction file is context, not a mechanism - an agent can drift past it.
Honesty about which rules have teeth:

| Rule | What actually holds it | Honest label |
| --- | --- | --- |
| No commit on `main` | `.claude/hooks/no-main-commit.sh` exits 2 | **Blocks, in Claude Code only.** Codex, Cursor and a human terminal never run it. It fails open on any parse error, by design. |
| No push to `main` | `.githooks/pre-push` | **Blocks, for every tool**, once `npm ci` has enabled the hooks (in a git checkout; a ZIP download has no git and no hooks). `git push --no-verify` skips it. |
| `npm run verify` green before a push | `.githooks/pre-push` | **Blocks** a red commit when it is your clean checkout. A local project never pushes, so there the agent runs `npm run verify` before each commit instead. When the pushed commit is another branch or the tree has uncommitted or untracked files, it prints NOT VERIFIED and lets the push through; CI runs the same check on the pull request. Same `--no-verify` caveat. |
| No secret in a commit | `.githooks/pre-commit` (gitleaks) and the CI `secrets` job | **Blocks locally only when gitleaks is installed**; otherwise it warns, and `git commit --no-verify` skips it. CI scans the whole history on every pull request - but a secret that reached GitHub is already exposed and must be replaced. |
| Two review passes before merge | `scripts/review.sh` records verdicts; `.githooks/pre-push` checks them | **Warns only.** It never blocks. Merging unreviewed work is a choice you make, not something the tooling prevents. |
| `npm run verify` green on every change | `.github/workflows/ci.yml` runs it on every pull request | **Runs server-side, once the project is on GitHub; a local project has no CI.** A red check is a visible signal on the PR; whether it may merge anyway depends on your repository's branch protection settings. |
| Load context before acting | SessionStart hook prints "run /start first" | **Reminds only.** |
| Think before changing anything | A short reminder on every message, in Claude Code (`settings.json`) and Codex (`.codex/hooks.json`) | **Reminds only.** Codex runs it after you trust the project's hooks once with `/hooks`. |
| No force push | `.claude/settings.json` denies `git push --force ...` | **Blocks in Claude Code**, for that spelling only. `--force-with-lease` (your own branch, after a rebase) stays allowed. |
| Everything else in `AGENTS.md` and `rules/` | The agent reading it | **Convention.** It binds by being read, which is why `AGENTS.md` is short. |

## The finished example

The `example` branch was never stripped down. It holds a small, complete
application - a phishing-report triage queue - built through this exact workflow
from start to finish. Look there to see what a finished change, reviewed and
passing every check, actually looks like:

```bash
git switch example
npm run verify
```

## License

[MIT](LICENSE). Use it, fork it, teach with it.
