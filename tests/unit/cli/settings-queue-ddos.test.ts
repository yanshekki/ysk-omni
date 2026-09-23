import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const cli = path.join(process.cwd(), 'dist/cli/index.js');
const built = fs.existsSync(cli);

function help(args: string[]): string {
  return execFileSync(process.execPath, [cli, ...args], {
    encoding: 'utf8',
    env: { ...process.env, FORCE_COLOR: '0' },
  });
}

describe.skipIf(!built)('cli settings / queue / ddos / api help', () => {
  it('settings subs', () => {
    const out = help(['help', 'settings']);
    expect(out).toContain('get');
    expect(out).toContain('set');
    expect(out).toContain('preset');
  });

  it('queue subs', () => {
    const out = help(['help', 'queue']);
    for (const s of [
      'stats',
      'policy',
      'pause',
      'resume',
      'drain',
      'jobs',
      'cancel',
      'purge-dead',
    ]) {
      expect(out).toContain(s);
    }
  });

  it('ddos subs', () => {
    const out = help(['help', 'ddos']);
    expect(out).toMatch(/policy|ban/i);
  });

  it('api features', () => {
    const out = help(['help', 'api']);
    expect(out).toContain('features');
  });

  it('admin panel + otp', () => {
    const out = help(['help', 'admin']);
    expect(out).toMatch(/status|otp|on|off|sessions/i);
  });
});
