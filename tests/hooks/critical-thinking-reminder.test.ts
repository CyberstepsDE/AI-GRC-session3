// The critical-thinking reminder, run from each tool's configuration exactly as
// written, in the shell that tool uses on this operating system. It catches what
// running the script alone cannot: a command that names a shell the system does
// not have (/bin/sh on Windows) or builds the script's path wrongly.
//
// Claude Code runs a hook with `sh -c` on macOS and Linux and with Git Bash on
// Windows (code.claude.com/docs/en/hooks, "Exec form and shell form"). Codex
// runs it in the session's shell: `-c` of the user's shell on macOS and Linux,
// PowerShell with -NoProfile -Command on Windows (openai/codex,
// codex-rs/core/src/session/mod.rs, build_hooks_config).

import { execFileSync, spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

const ROOT = process.cwd()
const WINDOWS = process.platform === 'win32'
const PAYLOAD = JSON.stringify({ hook_event_name: 'UserPromptSubmit', prompt: 'hello' })

// Git exports GIT_DIR into the hooks it runs; inside one, `git rev-parse`
// below would answer for that repository instead of the folder it runs in.
const ENV: NodeJS.ProcessEnv = { ...process.env }
for (const name of Object.keys(ENV)) {
  if (name.startsWith('GIT_')) delete ENV[name]
}

/**
 * The PATH a new PowerShell has after a default Git for Windows install: Git's
 * cmd folder, which holds git.exe but no sh or bash, and Windows' own folders.
 * The windows CI job runs npm from Git Bash, whose PATH has sh and bash, which
 * would hide a command that only works there.
 */
function defaultWindowsEnv(): NodeJS.ProcessEnv {
  const gitRoot = resolve(execFileSync('git', ['--exec-path'], { encoding: 'utf8' }).trim(), '../../..')
  const system = process.env.SystemRoot ?? 'C:\\Windows'
  const env: NodeJS.ProcessEnv = {}
  for (const [name, value] of Object.entries(ENV)) {
    if (name.toLowerCase() !== 'path') env[name] = value
  }
  env.Path = [
    join(gitRoot, 'cmd'),
    join(system, 'System32'),
    join(system, 'System32', 'WindowsPowerShell', 'v1.0'),
  ].join(';')
  return env
}

// Each case starts real shells and git; on Windows one spawn takes about a second.
describe('critical-thinking reminder, as configured', { timeout: 30_000 }, () => {
  it('Claude Code: prints the reminder', () => {
    const settings = JSON.parse(readFileSync(join(ROOT, '.claude/settings.json'), 'utf8'))
    const command: string = settings.hooks.UserPromptSubmit[0].hooks[0].command
    const run = spawnSync(WINDOWS ? 'bash' : 'sh', ['-c', command], {
      cwd: ROOT,
      env: { ...ENV, CLAUDE_PROJECT_DIR: ROOT },
      input: PAYLOAD,
      encoding: 'utf8',
    })
    expect(run.status, run.stderr).toBe(0)
    expect(run.stdout).toContain('CRITICAL THINKING:')
  })

  it('Codex: prints the reminder, also when started in a subfolder', () => {
    const codex = JSON.parse(readFileSync(join(ROOT, '.codex/hooks.json'), 'utf8'))
    const hook: { command: string; commandWindows?: string } = codex.hooks.UserPromptSubmit[0].hooks[0]
    const cwd = join(ROOT, 'src')
    const run = WINDOWS
      ? spawnSync(
          join(process.env.SystemRoot ?? 'C:\\Windows', 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe'),
          ['-NoProfile', '-Command', hook.commandWindows ?? hook.command],
          { cwd, env: defaultWindowsEnv(), input: PAYLOAD, encoding: 'utf8' },
        )
      : spawnSync('sh', ['-c', hook.command], { cwd, env: ENV, input: PAYLOAD, encoding: 'utf8' })
    expect(run.status, run.stderr).toBe(0)
    expect(run.stdout).toContain('CRITICAL THINKING:')
  })
})
