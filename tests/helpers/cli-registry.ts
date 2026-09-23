/**
 * CLI command registry for unit tests.
 * Parses `gctoac --help` / `gctoac help <cmd>` output (requires dist/cli).
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

export const CLI_BIN = path.join(process.cwd(), 'dist/cli/index.js');

export function cliBuilt(): boolean {
  return fs.existsSync(CLI_BIN);
}

export function runCliHelp(args: string[]): string {
  return execFileSync(process.execPath, [CLI_BIN, ...args], {
    encoding: 'utf8',
    env: { ...process.env, FORCE_COLOR: '0' },
    timeout: 30_000,
    maxBuffer: 2 * 1024 * 1024,
  });
}

/** Parse Commander help lines like `  start [options]  Description` */
export function parseHelpCommandNames(helpText: string): string[] {
  const names: string[] = [];
  for (const line of helpText.split('\n')) {
    // Commands section entries are indented, start with a word, not Options
    const m = line.match(/^\s{2}([a-z][a-z0-9_-]*)(?:\s|$)/i);
    if (!m?.[1]) continue;
    const name = m[1];
    // skip option flags rows (start with -)
    if (name.startsWith('-')) continue;
    // common non-command noise
    if (
      ['Commands', 'Options', 'Usage', 'Arguments', 'Examples'].includes(name)
    ) {
      continue;
    }
    names.push(name);
  }
  return [...new Set(names)];
}

/**
 * Expected top-level + important leaf commands (canonical registry).
 * Every entry must appear in help (top-level or `help <parent>`).
 */
export const CLI_EXPECTED_TOP_LEVEL = [
  'setup',
  'start',
  'stop',
  'restart',
  'status',
  'migrate',
  'seed',
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
  'grok',
  'api',
  'doctor',
  'open',
  'logs',
  'version',
  'update',
] as const;

/** Leaf paths as space-separated command chains for help checks */
export const CLI_EXPECTED_LEAVES = [
  'setup',
  'start',
  'stop',
  'restart',
  'status',
  'migrate',
  'seed',
  'key create',
  'key list',
  'key revoke',
  'key activate',
  'key show',
  'key update',
  'key admin',
  'admin status',
  'admin on',
  'admin off',
  'admin otp',
  'admin sessions',
  'settings get',
  'settings set',
  'settings preset',
  'queue stats',
  'queue policy',
  'queue pause',
  'queue resume',
  'queue drain',
  'queue undrain',
  'queue jobs',
  'queue job',
  'queue cancel',
  'queue requeue',
  'queue priority',
  'queue purge-dead',
  'ddos policy',
  'ddos ban',
  'docs',
  'chats',
  'conversations',
  'audit',
  'stats',
  'models',
  'grok inspect',
  'grok sessions',
  'grok sessions list',
  'grok sessions delete',
  'api features',
  'doctor',
  'open',
  'logs',
  'version',
  'update',
] as const;
