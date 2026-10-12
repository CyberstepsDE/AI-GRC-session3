// Fixtures for the review verdict reader and the pre-push refusal of main.
//
// The verdict reader decides whether a review said SHIP. A loose reading turns
// a NO-SHIP into a pass, so each way a transcript can mislead is pinned here.

import { execFileSync, spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterAll, describe, expect, it } from 'vitest'

const READER = join(process.cwd(), 'scripts/read-review-verdict.sh')
const PRE_PUSH = join(process.cwd(), '.githooks/pre-push')
const temps: string[] = []

function transcript(text: string): string {
  const dir = mkdtempSync(join(tmpdir(), 'verdict-'))
  temps.push(dir)
  const file = join(dir, 'review.txt')
  writeFileSync(file, text)
  return file
}

function verdict(file: string): string {
  return execFileSync('sh', [READER, file], { encoding: 'utf8' }).trim()
}

afterAll(() => {
  for (const dir of temps) rmSync(dir, { recursive: true, force: true })
})

// Each case starts real shells and git; on Windows (Git Bash) one spawn takes
// about a second, so a case with several runs needs more than the 5 s default.
const SPAWN_TIMEOUT = { timeout: 30_000 }

describe('read-review-verdict.sh', SPAWN_TIMEOUT, () => {
  it('reads SHIP and NO-SHIP from the last line', () => {
    expect(verdict(transcript('All good.\n\nVERDICT: SHIP\n'))).toBe('SHIP')
    expect(verdict(transcript('One blocker.\nVERDICT: NO-SHIP\n\n'))).toBe('NO-SHIP')
  })

  it('never reads a pass out of a transcript that also says NO-SHIP', () => {
    expect(verdict(transcript('VERDICT: SHIP\nthen five blockers\nVERDICT: NO-SHIP\n'))).toBe('INVALID')
  })

  it('is INVALID when the verdict is not the last line, or missing', () => {
    expect(verdict(transcript('VERDICT: SHIP\nbut one more thought\n'))).toBe('INVALID')
    expect(verdict(transcript('no verdict at all\n'))).toBe('INVALID')
    expect(verdict(join(tmpdir(), 'does-not-exist.txt'))).toBe('INVALID')
  })
})

// Git exports GIT_DIR into hooks; the throwaway repository below must never be
// confused with the real one.
const ENV: NodeJS.ProcessEnv = { ...process.env }
for (const name of Object.keys(ENV)) {
  if (name.startsWith('GIT_')) delete ENV[name]
}
ENV.GIT_CONFIG_GLOBAL = '/dev/null'
ENV.GIT_CONFIG_NOSYSTEM = '1'

describe('.githooks/pre-push', SPAWN_TIMEOUT, () => {
  it('does not vouch for a commit while an untracked file sits beside it', () => {
    const dir = mkdtempSync(join(tmpdir(), 'pre-push-'))
    temps.push(dir)
    const git = (...args: string[]) =>
      execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8', env: ENV }).trim()
    git('init', '--quiet', '--initial-branch', 'feature')
    git('config', 'user.email', 'test@example.com')
    git('config', 'user.name', 'test')
    git('commit', '--quiet', '--allow-empty', '-m', 'root')
    writeFileSync(join(dir, 'helper.ts'), 'export const forgotten = true\n')
    const sha = git('rev-parse', 'HEAD')

    const run = spawnSync('sh', [PRE_PUSH, 'origin', 'url'], {
      cwd: dir,
      env: ENV,
      input: `refs/heads/feature ${sha} refs/heads/feature ${'0'.repeat(40)}\n`,
      encoding: 'utf8',
    })

    expect(run.status).toBe(0)
    expect(run.stderr).toContain('NOT VERIFIED')
  })

  it('refuses a push to main and names the way forward', () => {
    const sha = 'a'.repeat(40)
    let status = 0
    let stderr = ''
    try {
      execFileSync('sh', [PRE_PUSH, 'origin', 'url'], {
        input: `refs/heads/feature ${sha} refs/heads/main ${'0'.repeat(40)}\n`,
        stdio: 'pipe',
      })
    } catch (err) {
      status = (err as { status?: number }).status ?? 1
      stderr = String((err as { stderr?: Buffer }).stderr ?? '')
    }
    expect(status).toBe(1)
    expect(stderr).toContain('pull request')
  })
})
