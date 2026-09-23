import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { resolveLogFiles } from '../../src/cli/commands/logs';
import type { RuntimePaths } from '../../src/cli/lib/paths';

describe('cli resolveLogFiles', () => {
  it('home mode only uses home logsDir (never packageRoot pm2 paths)', () => {
    const home = '/tmp/fake-gctoac-home';
    const paths: RuntimePaths = {
      mode: 'home',
      home,
      packageRoot: '/tmp/package-root-should-not-appear',
      envFile: path.join(home, '.env'),
      dataDir: path.join(home, 'data'),
      storageDir: path.join(home, 'storage'),
      logsDir: path.join(home, 'logs'),
      pidFile: path.join(home, 'gctoac.pid'),
      databaseUrl: 'file:/tmp/x.db',
    };
    const files = resolveLogFiles(paths);
    expect(files.every((f) => f.startsWith(path.join(home, 'logs')))).toBe(
      true,
    );
    expect(files.some((f) => f.includes('package-root'))).toBe(false);
  });

  it('project mode includes packageRoot pm2 logs', () => {
    const root = process.cwd();
    const paths: RuntimePaths = {
      mode: 'project',
      home: root,
      packageRoot: root,
      envFile: path.join(root, '.env'),
      dataDir: path.join(root, 'data'),
      storageDir: path.join(root, 'storage'),
      logsDir: path.join(root, 'logs'),
      pidFile: path.join(root, 'gctoac.pid'),
      databaseUrl: 'file:x',
    };
    const files = resolveLogFiles(paths);
    expect(files.some((f) => f.includes('pm2'))).toBe(true);
    expect(files.some((f) => f.includes('gctoac.out.log'))).toBe(true);
  });
});
