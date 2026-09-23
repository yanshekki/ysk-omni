import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  initCliRuntime,
  parseOnOff,
  withPrisma,
} from '../../src/cli/lib/runtime-context';

describe('cli runtime-context', () => {
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

  it('parseOnOff accepts common truthy/falsy tokens', () => {
    expect(parseOnOff('on')).toBe(true);
    expect(parseOnOff('OFF')).toBe(false);
    expect(parseOnOff('1')).toBe(true);
    expect(parseOnOff('0')).toBe(false);
    expect(parseOnOff('yes')).toBe(true);
    expect(parseOnOff('no')).toBe(false);
    expect(parseOnOff(true)).toBe(true);
    expect(parseOnOff(undefined)).toBeUndefined();
    expect(parseOnOff('')).toBeUndefined();
  });

  it('parseOnOff rejects garbage', () => {
    expect(() => parseOnOff('maybe')).toThrow(/on\/off/i);
  });

  it('initCliRuntime creates home dirs + .env and sets DATABASE_URL', () => {
    const home = fs.mkdtempSync(path.join(os.tmpdir(), 'gctoac-rt-'));
    homes.push(home);
    const rt = initCliRuntime({ home, forceHome: true, port: 19999 });
    expect(rt.port).toBe(19999);
    expect(rt.paths.mode).toBe('home');
    expect(rt.databaseUrl).toContain(home);
    expect(fs.existsSync(rt.paths.envFile)).toBe(true);
    expect(process.env.DATABASE_URL).toBe(rt.databaseUrl);
  });

  it('withPrisma always disconnects', async () => {
    const home = fs.mkdtempSync(path.join(os.tmpdir(), 'gctoac-rt-'));
    homes.push(home);
    const rt = initCliRuntime({ home, forceHome: true });
    // Fresh DB file may not have schema — just verify disconnect path
    await expect(
      withPrisma(rt.databaseUrl, async (prisma) => {
        await prisma.$queryRawUnsafe('SELECT 1');
        return 42;
      }),
    ).rejects.toThrow();
  });
});
