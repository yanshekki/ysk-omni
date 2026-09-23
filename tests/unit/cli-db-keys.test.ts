import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  activateKey,
  createKey,
  getKey,
  listKeys,
  revokeKey,
  updateKey,
} from '../../src/cli/lib/db-keys';
import { verifyApiKey } from '../../src/utils/api-key-crypto';
import { PrismaClient } from '@prisma/client';

describe('cli db-keys', () => {
  let databaseUrl = '';
  let home = '';
  let ready = false;

  beforeAll(() => {
    home = fs.mkdtempSync(path.join(os.tmpdir(), 'gctoac-keys-'));
    const dataDir = path.join(home, 'data');
    fs.mkdirSync(dataDir, { recursive: true });
    const dbFile = path.join(dataDir, 'gateway.db');
    databaseUrl = `file:${dbFile}`;
    try {
      execSync('npx prisma@6.5.0 migrate deploy', {
        cwd: process.cwd(),
        env: { ...process.env, DATABASE_URL: databaseUrl },
        stdio: 'pipe',
      });
      ready = true;
    } catch {
      ready = false;
    }
  });

  afterAll(() => {
    try {
      fs.rmSync(home, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  });

  it('creates scrypt-hashed key; list/show/update/revoke/activate', async () => {
    if (!ready) return;

    const created = await createKey({
      databaseUrl,
      name: 'unit-client',
      role: 'user', // legacy alias
      mode: 'safe',
      rateLimit: 42,
    });
    expect(created.role).toBe('client');
    expect(created.mode).toBe('safe');
    expect(created.rawKey.startsWith('gk_live_')).toBe(true);

    const prisma = new PrismaClient({
      datasources: { db: { url: databaseUrl } },
    });
    try {
      const row = await prisma.apiKey.findUnique({ where: { id: created.id } });
      expect(row?.keyHash.startsWith('scrypt$')).toBe(true);
      expect(verifyApiKey(created.rawKey, row!.keyHash)).toBe(true);
    } finally {
      await prisma.$disconnect();
    }

    const listed = await listKeys(databaseUrl);
    expect(listed.some((k) => k.id === created.id)).toBe(true);

    const shown = await getKey(databaseUrl, created.id);
    expect(shown?.name).toBe('unit-client');

    const updated = await updateKey(databaseUrl, created.id, {
      name: 'renamed',
      rateLimit: 99,
    });
    expect(updated?.name).toBe('renamed');
    expect(updated?.rateLimit).toBe(99);

    expect(await revokeKey(databaseUrl, created.id)).toBe(true);
    const afterRevoke = await getKey(databaseUrl, created.id);
    expect(afterRevoke?.isActive).toBe(false);

    expect(await activateKey(databaseUrl, created.id)).toBe(true);
    const afterAct = await getKey(databaseUrl, created.id);
    expect(afterAct?.isActive).toBe(true);
  });

  it('admin keys are always agent mode', async () => {
    if (!ready) return;
    const admin = await createKey({
      databaseUrl,
      name: 'unit-admin',
      role: 'admin',
      mode: 'safe', // should be forced to agent
    });
    expect(admin.role).toBe('admin');
    expect(admin.mode).toBe('agent');
  });
});
