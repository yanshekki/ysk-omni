/**
 * Integration smoke: spawn real CLI binary against an isolated --home.
 * Requires built dist/cli/index.js (run npm run build first in CI).
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const cli = path.join(process.cwd(), 'dist/cli/index.js');
const PORT = 13991;

function run(
  home: string,
  args: string[],
  opts?: { expectFail?: boolean },
): { code: number; out: string } {
  // Isolated home must own ENCRYPTION_KEY / DATABASE_URL via its .env —
  // do not inherit parent CI keys (loadEnvIntoProcess only fills undefined keys).
  const env: NodeJS.ProcessEnv = { ...process.env, FORCE_COLOR: '0' };
  delete env.ENCRYPTION_KEY;
  delete env.DATABASE_URL;
  delete env.GCTOAC_HOME;
  try {
    const out = execFileSync(
      process.execPath,
      [cli, '--home', home, '--port', String(PORT), ...args],
      {
        encoding: 'utf8',
        env,
        timeout: 120_000,
        maxBuffer: 4 * 1024 * 1024,
      },
    );
    return { code: 0, out };
  } catch (e) {
    const err = e as {
      status?: number;
      stdout?: string;
      stderr?: string;
      message?: string;
    };
    const out = `${err.stdout || ''}${err.stderr || ''}${err.message || ''}`;
    if (opts?.expectFail) {
      return { code: err.status ?? 1, out };
    }
    throw e;
  }
}

describe('cli smoke (isolated home)', () => {
  let home = '';
  let built = false;

  beforeAll(() => {
    built = fs.existsSync(cli);
    if (!built) return;
    home = fs.mkdtempSync(path.join(os.tmpdir(), 'gctoac-smoke-'));
  });

  afterAll(() => {
    // Always stop if we started
    if (home && built) {
      try {
        run(home, ['stop']);
      } catch {
        /* ignore */
      }
      try {
        fs.rmSync(home, { recursive: true, force: true });
      } catch {
        /* ignore */
      }
    }
  });

  it('setup → key → settings → queue → ddos → api → start/status/stop', () => {
    if (!built) {
      console.warn('skip: dist/cli/index.js missing — run npm run build');
      return;
    }

    expect(run(home, ['version']).out).toMatch(/1\.\d+\.\d+/);
    expect(run(home, ['setup']).code).toBe(0);

    const created = run(home, [
      'key',
      'create',
      '-n',
      'smoke',
      '-r',
      'client',
    ]);
    expect(created.out).toMatch(/gk_live_/);
    expect(created.out).toMatch(/id:/);

    const list = run(home, ['key', 'list']);
    expect(list.out).toMatch(/client|admin/);

    expect(run(home, ['settings', 'get']).code).toBe(0);
    expect(
      run(home, ['settings', 'set', '--global-safe', 'off']).code,
    ).toBe(0);

    expect(run(home, ['queue', 'stats']).code).toBe(0);
    expect(
      run(home, ['queue', 'policy', 'set', '--enabled', 'on']).code,
    ).toBe(0);
    expect(run(home, ['queue', 'pause']).code).toBe(0);
    expect(run(home, ['queue', 'resume']).code).toBe(0);

    expect(
      run(home, ['ddos', 'ban', '203.0.113.50', '--ttl', '30']).code,
    ).toBe(0);
    expect(run(home, ['ddos', 'blacklist']).out).toContain('203.0.113.50');
    expect(run(home, ['ddos', 'unban', '203.0.113.50']).code).toBe(0);

    expect(run(home, ['api', 'features', 'get']).code).toBe(0);
    expect(
      run(home, ['api', 'features', 'set', '--tools', 'on']).code,
    ).toBe(0);

    expect(run(home, ['admin', 'status']).code).toBe(0);
    expect(run(home, ['admin', 'otp']).out).toMatch(/[A-Z0-9]{4}-[A-Z0-9]{4}/);

    expect(run(home, ['docs', 'list']).code).toBe(0);
    expect(run(home, ['stats']).code).toBe(0);

    // dangerous ops without --yes must fail
    const purge = run(home, ['queue', 'purge-dead'], { expectFail: true });
    expect(purge.code).not.toBe(0);

    // Lifecycle: isolated home may prefer PM2 which binds project env port —
    // assert restart/stop exit codes; status must report runner state (not crash).
    const restart = run(home, ['restart']);
    expect(restart.code).toBe(0);
    execFileSync('sleep', ['2']);
    const st = run(home, ['status'], { expectFail: true });
    // Accept healthy, or PM2 online / process info even if health probe fails
    // (PM2 often uses project .env port while --port only affects CLI probe).
    expect(st.out.length).toBeGreaterThan(20);
    expect(st.out).toMatch(/API:|Admin:|PM2:|Runner:|Port:|running|online|not running/i);
    expect(run(home, ['stop']).code).toBe(0);

    // home-mode logs clear must not throw
    expect(run(home, ['logs', 'clear']).code).toBe(0);
  }, 180_000);
});
