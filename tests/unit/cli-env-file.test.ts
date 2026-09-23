import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  ensureEnvFile,
  readEnvFile,
  setEnvPort,
  writeEnvFile,
} from '../../src/cli/lib/env-file';
import type { RuntimePaths } from '../../src/cli/lib/paths';

function makePaths(home: string): RuntimePaths {
  return {
    mode: 'home',
    home,
    packageRoot: process.cwd(),
    envFile: path.join(home, '.env'),
    dataDir: path.join(home, 'data'),
    storageDir: path.join(home, 'storage'),
    logsDir: path.join(home, 'logs'),
    pidFile: path.join(home, 'gctoac.pid'),
    databaseUrl: `file:${path.join(home, 'data', 'gateway.db')}`,
  };
}

describe('cli env-file', () => {
  const homes: string[] = [];

  afterEach(() => {
    for (const h of homes.splice(0)) {
      try {
        fs.rmSync(h, { recursive: true, force: true });
      } catch {
        /* ignore */
      }
    }
  });

  it('ensureEnvFile creates ENCRYPTION_KEY and DATABASE_URL', () => {
    const home = fs.mkdtempSync(path.join(os.tmpdir(), 'gctoac-env-'));
    homes.push(home);
    fs.mkdirSync(path.join(home, 'data'), { recursive: true });
    const paths = makePaths(home);
    const env = ensureEnvFile(paths, 5555);
    expect(env.ENCRYPTION_KEY).toBeTruthy();
    expect(env.PORT).toBe('5555');
    expect(env.DATABASE_URL).toBe(paths.databaseUrl);
    const again = ensureEnvFile(paths, 5555);
    // Does not rotate encryption key
    expect(again.ENCRYPTION_KEY).toBe(env.ENCRYPTION_KEY);
  });

  it('setEnvPort updates PORT and CORS localhost entries', () => {
    const home = fs.mkdtempSync(path.join(os.tmpdir(), 'gctoac-env-'));
    homes.push(home);
    const file = path.join(home, '.env');
    writeEnvFile(file, {
      PORT: '3847',
      CORS_ORIGINS: 'http://localhost:3847,http://127.0.0.1:3847',
    });
    const next = setEnvPort(file, 9999);
    expect(next.PORT).toBe('9999');
    expect(next.CORS_ORIGINS).toContain(':9999');
    expect(next.CORS_ORIGINS).not.toContain(':3847');
    expect(readEnvFile(file).PORT).toBe('9999');
  });
});
