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

describe.skipIf(!built)('cli key commands help', () => {
  it('key help lists CRUD subs', () => {
    const out = help(['help', 'key']);
    for (const s of [
      'create',
      'list',
      'revoke',
      'activate',
      'show',
      'update',
      'admin',
    ]) {
      expect(out).toContain(s);
    }
  });

  it('key create help shows options', () => {
    const out = help(['help', 'key', 'create']);
    expect(out.toLowerCase()).toMatch(/name|role|mode|rate/);
  });
});
