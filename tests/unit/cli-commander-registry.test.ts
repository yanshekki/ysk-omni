import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const cli = path.join(process.cwd(), 'dist/cli/index.js');

function help(args: string[]): string {
  return execFileSync(process.execPath, [cli, ...args], {
    encoding: 'utf8',
    env: process.env,
  });
}

describe('cli commander registry (help matrix)', () => {
  it('top-level help lists core commands', () => {
    const out = help(['--help']);
    for (const cmd of [
      'setup',
      'start',
      'stop',
      'restart',
      'status',
      'key',
      'admin',
      'settings',
      'queue',
      'ddos',
      'docs',
      'chats',
      'conversations',
      'audit',
      'stats',
      'models',
      'api',
      'doctor',
      'open',
      'logs',
      'version',
      'update',
    ]) {
      expect(out).toContain(cmd);
    }
  });

  it('key help lists subcommands', () => {
    const out = help(['help', 'key']);
    for (const sub of [
      'create',
      'list',
      'revoke',
      'activate',
      'show',
      'update',
      'admin',
    ]) {
      expect(out).toContain(sub);
    }
  });

  it('queue help lists job ops', () => {
    const out = help(['help', 'queue']);
    for (const sub of [
      'stats',
      'policy',
      'pause',
      'resume',
      'drain',
      'jobs',
      'cancel',
      'purge-dead',
    ]) {
      expect(out).toContain(sub);
    }
  });

  it('api features help exists', () => {
    const out = help(['help', 'api']);
    expect(out).toContain('features');
  });
});
