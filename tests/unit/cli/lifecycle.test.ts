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

describe.skipIf(!built)('cli lifecycle + utility help', () => {
  for (const cmd of [
    'setup',
    'start',
    'stop',
    'restart',
    'status',
    'migrate',
    'seed',
    'doctor',
    'open',
    'logs',
    'version',
    'update',
    'docs',
    'chats',
    'conversations',
    'audit',
    'stats',
    'models',
  ]) {
    it(`${cmd} has help`, () => {
      const out = help(['help', cmd]);
      expect(out.length).toBeGreaterThan(15);
    });
  }
});
