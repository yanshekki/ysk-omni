import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PORT,
  getDefaultHome,
  getPackageRoot,
  resolveRuntimePaths,
} from '../../src/cli/lib/paths';

describe('cli paths', () => {
  it('exports unique default port 3847', () => {
    expect(DEFAULT_PORT).toBe(3847);
  });

  it('resolves package root containing package.json', () => {
    const root = getPackageRoot();
    expect(root.length).toBeGreaterThan(0);
  });

  it('default home is ~/.gctoac', () => {
    const prev = process.env.GCTOAC_HOME;
    delete process.env.GCTOAC_HOME;
    expect(getDefaultHome()).toBe(path.join(os.homedir(), '.gctoac'));
    if (prev !== undefined) process.env.GCTOAC_HOME = prev;
  });

  it('force home uses absolute database file URL', () => {
    const home = path.join(os.tmpdir(), 'gctoac-test-home');
    const paths = resolveRuntimePaths({ home, forceHome: true });
    expect(paths.mode).toBe('home');
    expect(paths.home).toBe(path.resolve(home));
    expect(paths.databaseUrl.startsWith('file:')).toBe(true);
    expect(paths.databaseUrl).toContain('gateway.db');
  });
});
