# Compliance Guard: AI for Cybersecurity, session 3 (GRC)

## What we build

Compliance Guard is a web app on the auditor's laptop. It helps an auditor check
whether a company meets ISO/IEC 27001:2022 and the German BSI Act (BSIG), the law
that implements NIS2 in Germany, or how ready it is. The NIS2 Directive stays the
common EU reference.

- **Standards library**: every reference in the app (for example A.8.13 or
  § 30(2) Nr. 3 BSIG) opens its exact text.
- **Two ways to collect answers**: a live interview, department by department, or
  a questionnaire exported as a PDF and uploaded back with the company's answers.
- **Assessment agent**: a cloud model reached through OpenRouter and configured
  like an experienced auditor. For every requirement it proposes a status
  (conformity, minor nonconformity, major nonconformity or open), quotes the
  evidence with where it was found, and suggests follow-up questions.
- **Interactive report**: the auditor filters, adds notes, asks for a new
  assessment, confirms or changes every verdict and exports the report.

The app prepares, the agent proposes, the auditor decides. You build it in the lab
with an AI coding agent, from the brief in `prompts.md`.

## Where the files are

| File | What it is | How the project uses it |
| --- | --- | --- |
| `prompts.md` | The brief (main prompt) and the prompts in reserve | You paste the brief the class agreed on into the agent; the reserve prompts come after the first working version |
| `agent/assessor.md` | The instructions of the app's assessment agent | The app sends them with every assessment request |
| `standards/ISO-IEC-27001-2022.md` | ISO/IEC 27001:2022 with Amendment 1:2024: clauses 4 to 10 and Annex A | Standards library |
| `standards/ISO-IEC-27002-2022.md` | ISO/IEC 27002:2022: guidance for each of the 93 controls | Standards library |
| `standards/BSIG-2025.md` | The German BSI Act (BSIG), in German | Standards library: the binding law |
| `standards/NIS2-Directive-2022-2555.md` | Directive (EU) 2022/2555 (NIS2) | Standards library: the EU reference |
| `standards/NIS2-Implementing-Regulation-2024-2690.md` | Implementing Regulation (EU) 2024/2690: detailed rules for digital providers such as managed service providers | Standards library, where the company type is in its scope |
| `sample-company/company-profile.md` | The made-up company Beispiel IT-Services GmbH, a managed IT service provider | The scenario: context for the assessment |
| `sample-company/questionnaire.md` | 24 audit questions, each with what an auditor asks to see and its references | Seeds the question catalogue |
| `sample-company/questionnaire-answers.md` | The same questions, answered by the company's head of IT | What the app assesses in the test |
| `sample-company/manifest.json` | Marks the case as made-up | Only cases marked as made-up go to the cloud |
| `sample-company/README.md` | More about the sample company and its sources | Background |

Everything in `sample-company/` is invented. Never put a real company's documents in
this repository.

## How to start

1. Prepare your laptop once, before the lab: see "Requirements" below (on Windows,
   the PowerShell commands under "Windows"). Have your OpenRouter key ready.
2. Clone this repository and open Claude Code in it. On Windows, in PowerShell:
   ```powershell
   cd $HOME
   git clone https://github.com/CyberstepsDE/AI-GRC-session3.git compliance-guard
   cd compliance-guard
   claude
   ```
   Clone it, do not download it as a ZIP: the way of working needs git. Keep it
   outside OneDrive or other synced folders.
3. The first time, type `/onboarding`. The agent checks your tools, sets up the
   `.env` file for your OpenRouter key (you paste the key yourself, never into the
   chat), runs the checks and starts the app once. After that, start every session
   with `/start`.
4. Paste the brief the class agreed on (`prompts.md`), answer the agent's
   questions, approve its plan and let it build in small steps. Work lands on a
   branch, gets two review passes (`/cross-review`) and merges into `main`.
5. Test on the sample company: ask the agent to start the app (`npm run dev`) and
   open http://127.0.0.1:4173 in your browser. Run an interview, upload the
   company's answers, and check every verdict and quote against the standards.

## The way of working: the VibeEngineering template

This repository is a copy of the VibeEngineering template, a **way of working with
an AI coding agent**. Besides the lab files, what is checked in stays true no matter
what you build: the rules the agent reads, the review agents that check its work, the
commands that verify every change, and the automation that runs those commands for
you. `src/` and `tests/` hold placeholders that the app replaces.

### What is inside

Every tracked file of the template and the lab, and why it is there:

```text
.
├── AGENTS.md                          - the contract: rules an AI agent reads before doing anything
├── CLAUDE.md                          - a stub that points Claude Code at AGENTS.md
├── README.md                          - this file
├── LICENSE                            - MIT
├── prompts.md                         - the brief and the prompts in reserve for the lab
├── agent/assessor.md                  - the instructions of the app's assessment agent
├── standards/                         - ISO/IEC 27001 and 27002, BSIG, NIS2, Regulation 2024/2690 as Markdown
├── sample-company/                    - the made-up company the app is tested on
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
│   ├── workflows/ci.yml               - CI: typecheck, lint, test, build, audit and a secret scan on every pull request, on Linux and on Windows
│   └── pull_request_template.md       - what a pull request here must say
├── docs/
│   └── DEPLOYMENT.md                  - for the agent: putting a project online, when the person wants it (any host)
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
├── .env.example                       - the name of the one key the app needs (OPENROUTER_API_KEY), without a value
├── .gitattributes                     - LF line endings on every machine, Windows included
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

### Requirements

- **Git, Node.js 22.12 or newer, and jq.** Git clones the repository and keeps its
  history; Node.js runs the app and its checks (`.nvmrc`); jq is used by the commit
  hook (and so by its tests in `npm run verify`) and by the review script.
- **Claude Code** ([setup](https://code.claude.com/docs/en/setup)), with a Claude
  plan that includes it. The template also works with Codex CLI.
- Optional: **Codex CLI** as well. With both tools, one writes and the other
  reviews; without Codex, both review passes run on Claude and are recorded as
  `same-tool`. The lab does not need it.
- Recommended: [gitleaks](https://github.com/gitleaks/gitleaks), so a secret is
  caught on your machine before it leaves it. Without it the commit hook warns and
  CI still scans.
- An [OpenRouter](https://openrouter.ai) API key for the app's assessment agent. It
  goes in a local `.env` file, copied from `.env.example`
  (`OPENROUTER_API_KEY=...`), which git ignores; never in a committed file and
  never under a `VITE_` name (`rules/secrets.md`).
- Optional: a [GitHub](https://github.com) account, once you want the project on
  GitHub (pull requests and CI). A local project needs none.

#### Windows

Run these once in PowerShell. Windows may ask for administrator approval for
Node.js; only you can give it. Skip what you already have (check with
`git --version`, `node --version`, `jq --version`, `claude --version`).

```powershell
winget install --id Git.Git -e --source winget
winget install --id OpenJS.NodeJS.LTS -e
winget install --id jqlang.jq -e
winget install --id Gitleaks.Gitleaks -e
irm https://claude.ai/install.ps1 | iex
```

Then **close every terminal and open a new PowerShell**, so Windows finds the new
tools. Git for Windows matters twice: Claude Code runs its commands and this
template's hooks through its Git Bash. Use Node.js LTS from the installer above
rather than a version manager.

#### macOS

`brew install node jq gitleaks` (git comes with the Xcode command line tools), and
Claude Code from its [setup page](https://code.claude.com/docs/en/setup). With
`nvm`, run `nvm use` in this folder and it picks the version from `.nvmrc`.

### The two review passes

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

### What is enforced, and what is convention

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

## License

[MIT](LICENSE). Use it, fork it, teach with it.
