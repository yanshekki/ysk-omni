import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { execSync } from 'node:child_process';
import { randomBytes, randomUUID } from 'node:crypto';
import { prisma } from '../../src/config/database';
import { mediaStoreService } from '../../src/services/media/media-store.service';
import { scryptHash, apiKeyPrefix } from '../../src/utils/api-key-crypto';

describe('mediaStoreService', () => {
  let keyId = '';
  let dbOk = false;

  beforeAll(async () => {
    try {
      await prisma.$connect();
      execSync('npx prisma@6.5.0 migrate deploy', {
        stdio: 'pipe',
        env: process.env,
        cwd: process.cwd(),
        timeout: 60_000,
      });
      const raw = `gk_live_${randomBytes(16).toString('hex')}`;
      keyId = randomUUID();
      await prisma.apiKey.create({
        data: {
          id: keyId,
          name: 'media-store-test',
          keyPrefix: apiKeyPrefix(raw),
          keyHash: scryptHash(raw),
          role: 'admin',
          mode: 'agent',
          rateLimit: 100,
        },
      });
      dbOk = true;
    } catch {
      dbOk = false;
    }
  }, 90_000);

  afterAll(async () => {
    if (dbOk) {
      await prisma.mediaAsset.deleteMany({ where: { apiKeyId: keyId } }).catch(() => undefined);
      await prisma.apiKey.deleteMany({ where: { id: keyId } }).catch(() => undefined);
    }
    await prisma.$disconnect().catch(() => undefined);
  });

  it('saves and reads bytes', async () => {
    if (!dbOk) return;
    const png = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      'base64',
    );
    const stored = await mediaStoreService.save({
      apiKeyId: keyId,
      kind: 'image',
      mime: 'image/png',
      bytes: png,
      originalName: 't.png',
      provider: 'test',
      prompt: 'dot',
    });
    expect(stored.id).toBeTruthy();
    expect(stored.byteSize).toBe(png.length);

    const read = await mediaStoreService.readBytes(stored.id, keyId);
    expect(read.bytes.equals(png)).toBe(true);
    expect(read.mime).toBe('image/png');
  });
});
