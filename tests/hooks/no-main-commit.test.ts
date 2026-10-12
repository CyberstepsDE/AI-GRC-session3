// Fixtures for the PreToolUse[Bash] guard in .claude/hooks/no-main-commit.sh.
//
// A static guard must enumerate every syntactic form of the operation it
// restricts, proven by positive AND negative fixtures, not by reading the
// script. Each case builds a throwaway git repository, so the result never
// depends on the branch this suite happens to run from.

import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterAll, describe, expect, it } from 'vitest'

const HOOK = join(process.cwd(), '.claude/hooks/no-main-commit.sh')
const temps: string[] = []

// Git exports GIT_DIR and friends into the hooks it runs, and they outrank
// `git -C <dir>`. When these tests run inside a git hook (a pre-push gate that
// runs `npm run verify`, for example), every throwaway commit below would
// otherwise land in the REAL repository, and its config would get the test
// identity.
const ENV: NodeJS.ProcessEnv = { ...process.env }
for (const name of Object.keys(ENV)) {
  if (name.startsWith('GIT_')) delete ENV[name]
}
ENV.GIT_CONFIG_GLOBAL = '/dev/null'
ENV.GIT_CONFIG_NOSYSTEM = '1'

function repoOnBranch(branch: string): string {
  const dir = mkdtempSync(join(tmpdir(), 'main-guard-'))
  temps.push(dir)
  const git = (...args: string[]) =>
    execFileSync('git', ['-C', dir, ...args], { stdio: 'pipe', env: ENV })
  git('init', '--quiet', '--initial-branch', branch)
  git('config', 'user.email', 'test@example.com')
  git('config', 'user.name', 'test')
  git('commit', '--quiet', '--allow-empty', '-m', 'root')
  return dir
}

/**
 * Runs the hook with a PreToolUse payload and returns its exit code (2 = blocked).
 * `cwd` is the hook PROCESS's directory; `eventCwd`, when given, is the session's
 * directory the event carries. In a desktop app session the two differ.
 */
function runHook(
  command: string,
  cwd: string,
  eventCwd?: string,
  description?: string,
): number {
  try {
    execFileSync('bash', [HOOK], {
      input: JSON.stringify({
        // Claude Code always sends the session's cwd; default it to the process's.
        cwd: eventCwd ?? cwd,
        tool_input: { command, ...(description ? { description } : {}) },
      }),
      cwd,
      stdio: 'pipe',
      env: ENV,
    })
    return 0
  } catch (err) {
    return (err as { status?: number }).status ?? 1
  }
}

afterAll(() => {
  for (const dir of temps) rmSync(dir, { recursive: true, force: true })
})

// Each case starts real shells and git; on Windows (Git Bash) one spawn takes
// about a second, so a case with several runs needs more than the 5 s default.
const SPAWN_TIMEOUT = { timeout: 30_000 }

describe('no-main-commit hook', SPAWN_TIMEOUT, () => {
  describe('target repository on main', () => {
    it('blocks `cd <dir> && git commit`', () => {
      const dir = repoOnBranch('main')
      const elsewhere = repoOnBranch('feat/elsewhere')
      expect(runHook(`cd ${dir} && git commit -m x`, elsewhere)).toBe(2)
    })

    it('blocks `git -C <dir> commit`', () => {
      const dir = repoOnBranch('main')
      const elsewhere = repoOnBranch('feat/elsewhere')
      expect(runHook(`git -C ${dir} commit -m x`, elsewhere)).toBe(2)
    })

    it('blocks `git --git-dir=... --work-tree=... commit`', () => {
      const dir = repoOnBranch('main')
      const elsewhere = repoOnBranch('feat/elsewhere')
      expect(runHook(`git --git-dir=${dir}/.git --work-tree=${dir} commit -m x`, elsewhere)).toBe(2)
    })

    it('blocks a bare `git commit` run from inside the repository', () => {
      expect(runHook('git commit -m x', repoOnBranch('main'))).toBe(2)
    })

    it('blocks a global flag or a -c value placed before commit', () => {
      const dir = repoOnBranch('main')
      expect(runHook('git --no-pager commit -m x', dir)).toBe(2)
      expect(runHook('git -c user.name=x commit -m x', dir)).toBe(2)
    })

    it('blocks a quoted path, with -C and with cd', () => {
      const dir = repoOnBranch('main')
      const session = repoOnBranch('feat/elsewhere')
      expect(runHook(`git -C "${dir}" commit -m x`, session, session)).toBe(2)
      expect(runHook(`cd '${dir}' && git commit -m x`, session, session)).toBe(2)
    })
  })

  describe("judges the session's directory, not the hook process's", () => {
    it('allows a bare commit in a feature worktree while the hook process sits on main', () => {
      const projectFolder = repoOnBranch('main')
      const worktree = repoOnBranch('feat/some-scope')
      expect(runHook('git commit -m x', projectFolder, worktree)).toBe(0)
    })

    it("blocks a bare commit when the session's directory is on main", () => {
      const session = repoOnBranch('main')
      const elsewhere = repoOnBranch('feat/elsewhere')
      expect(runHook('git commit -m x', elsewhere, session)).toBe(2)
    })

    it('lets a commit through when the named directory is a shell variable it cannot resolve', () => {
      const projectFolder = repoOnBranch('main')
      const worktree = repoOnBranch('feat/some-scope')
      expect(runHook('git -C "$DIR" commit -m x', projectFolder, worktree)).toBe(0)
      expect(runHook('cd "$DIR" && git commit -m x', projectFolder, worktree)).toBe(0)
    })

    it('reads only the command, never the description', () => {
      const projectFolder = repoOnBranch('main')
      const worktree = repoOnBranch('feat/some-scope')
      const command = `git -C ${worktree} commit -m x`
      expect(runHook(command, projectFolder, worktree, 'Commit with explicit -C path')).toBe(0)
    })

    it("resolves a relative cd from the session's directory", () => {
      const dir = repoOnBranch('main')
      const session = repoOnBranch('feat/elsewhere')
      const parent = join(dir, '..')
      const name = dir.slice(parent.length + 1)
      expect(runHook(`cd ${name} && git commit -m x`, session, parent)).toBe(2)
    })
  })

  describe('reads the target from the commit itself', () => {
    it('takes no -C from another command in the chain', () => {
      const mainRepo = repoOnBranch('main')
      const worktree = repoOnBranch('feat/some-scope')
      expect(runHook(`git -C ${mainRepo} status && git commit -m x`, worktree)).toBe(0)
      expect(runHook(`git -C ${worktree} log -1 && git -C ${mainRepo} commit -m x`, worktree)).toBe(2)
    })

    it('reads --git-dir and --work-tree written as separate arguments', () => {
      const mainRepo = repoOnBranch('main')
      const elsewhere = repoOnBranch('feat/elsewhere')
      expect(
        runHook(`git --git-dir ${mainRepo}/.git --work-tree ${mainRepo} commit -m x`, elsewhere),
      ).toBe(2)
    })

    it('lets the commit through when the event has no cwd', () => {
      const mainRepo = repoOnBranch('main')
      let code = 0
      try {
        execFileSync('bash', [HOOK], {
          input: JSON.stringify({ tool_input: { command: 'git commit -m x' } }),
          cwd: mainRepo,
          stdio: 'pipe',
          env: ENV,
        })
      } catch (err) {
        code = (err as { status?: number }).status ?? 1
      }
      expect(code).toBe(0)
    })
  })

  describe('does not refuse legitimate work', () => {
    it('allows a commit on a feature branch', () => {
      expect(runHook('git commit -m x', repoOnBranch('feat/some-scope'))).toBe(0)
    })

    it('ignores commands that only contain the word commit', () => {
      const dir = repoOnBranch('main')
      expect(runHook('git status', dir)).toBe(0)
      expect(runHook('git log --oneline --grep=commit -5', dir)).toBe(0)
      expect(runHook('git rev-parse HEAD^{commit}', dir)).toBe(0)
      expect(runHook('git diff -- commit-notes.md', dir)).toBe(0)
      expect(runHook('git --help commit', dir)).toBe(0)
      expect(runHook('git --exec-path commit', dir)).toBe(0)
      expect(runHook('git --list-cmds=main commit', dir)).toBe(0)
      expect(runHook('git commit --help', dir)).toBe(0)
      expect(runHook('git commit -h', dir)).toBe(0)
      expect(runHook('git commit --dry-run -m x', dir)).toBe(0)
      expect(runHook('git commit --short', dir)).toBe(0)
      expect(runHook('git commit --porcelain', dir)).toBe(0)
      expect(runHook('git commit --long', dir)).toBe(0)
      expect(runHook('git commit -z', dir)).toBe(0)
      expect(runHook('git commit --null', dir)).toBe(0)
    })

    it('fails open on a payload that is not JSON', () => {
      const dir = repoOnBranch('feat/some-scope')
      let code = 0
      try {
        execFileSync('bash', [HOOK], { input: 'not json at all', cwd: dir, stdio: 'pipe', env: ENV })
      } catch (err) {
        code = (err as { status?: number }).status ?? 1
      }
      expect(code).toBe(0)
    })
  })
})
