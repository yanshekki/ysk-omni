import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { randomBytes, randomUUID } from 'node:crypto';
import { execSync } from 'node:child_process';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { createApp } from '../../src/app';
import { prisma } from '../../src/config/database';
import { encryptionService } from '../../src/services/encryption.service';
import { scryptHash, apiKeyPrefix } from '../../src/utils/api-key-crypto';

function hashApiKey(rawKey: string): string {
  return scryptHash(rawKey);
}

 
function toBytes(buf: Buffer): any {
  return Buffer.from(buf);
}

describe('admin routes', () => {
  let server: Server;
  let baseUrl: string;
  let adminKey = '';
  let clientKeyId = '';
  let chatId = '';
  let dbOk = false;

  beforeAll(async () => {
    try {
      await prisma.$connect();
      await prisma.$queryRaw`SELECT 1`;
      // Ensure schema exists on test.db
      execSync('npx prisma migrate deploy', {
        stdio: 'pipe',
        env: process.env,
        cwd: process.cwd(),
      });
      dbOk = true;
    } catch {
      dbOk = false;
      return;
    }

    adminKey = `gk_live_${randomBytes(24).toString('base64url')}`;
    const adminHash = hashApiKey(adminKey);
    await prisma.apiKey.create({
      data: {
        id: randomUUID(),
        name: 'itest-admin',
        keyPrefix: apiKeyPrefix(adminKey),
        keyHash: adminHash,
        role: 'admin',
        mode: 'agent',
        rateLimit: 120,
      },
    });

    clientKeyId = randomUUID();
    const clientRaw = `gk_live_${randomBytes(16).toString('hex')}`;
    await prisma.apiKey.create({
      data: {
        id: clientKeyId,
        name: 'itest-client',
        keyPrefix: apiKeyPrefix(clientRaw),
        keyHash: hashApiKey(clientRaw),
        role: 'client',
        mode: 'safe',
        rateLimit: 30,
      },
    });

    const promptEnc = encryptionService.encrypt('hello prompt in');
    const responseEnc = encryptionService.encrypt(
      JSON.stringify({ content: 'hello out', reasoning_content: 'think' }),
    );
    chatId = randomUUID();
    await prisma.chatRequest.create({
      data: {
        id: chatId,
        requestId: `req_${randomBytes(8).toString('hex')}`,
        apiKeyId: clientKeyId,
        model: 'grok-4.5',
        stream: false,
        status: 'success',
        durationMs: 12,
        policyMode: 'safe',
        promptCiphertext: toBytes(promptEnc.ciphertext),
        promptIv: toBytes(promptEnc.iv),
        promptTag: toBytes(promptEnc.tag),
        responseCiphertext: toBytes(responseEnc.ciphertext),
        responseIv: toBytes(responseEnc.iv),
        responseTag: toBytes(responseEnc.tag),
      },
    });

    const app = createApp();
    await new Promise<void>((resolve) => {
      server = app.listen(0, '127.0.0.1', () => resolve());
    });
    const addr = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${addr.port}`;
  });

  afterAll(async () => {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      });
    }
    if (dbOk) {
      await prisma.chatRequest.deleteMany({ where: { id: chatId } }).catch(() => undefined);
      await prisma.apiKey
        .deleteMany({ where: { name: { in: ['itest-admin', 'itest-client'] } } })
        .catch(() => undefined);
    }
    await prisma.$disconnect().catch(() => undefined);
  });

  it('rejects unauthenticated admin API', async () => {
    if (!dbOk) return;
    const res = await fetch(`${baseUrl}/admin/api/me`);
    expect(res.status).toBe(401);
  });

  it('returns me and stats for admin', async () => {
    if (!dbOk) return;
    const me = await fetch(`${baseUrl}/admin/api/me`, {
      headers: { Authorization: `Bearer ${adminKey}` },
    });
    expect(me.status).toBe(200);
    const meBody = (await me.json()) as { data: { role: string } };
    expect(meBody.data.role).toBe('admin');

    const stats = await fetch(`${baseUrl}/admin/api/stats`, {
      headers: { Authorization: `Bearer ${adminKey}` },
    });
    expect(stats.status).toBe(200);
  });

  it('decrypts full chat prompt and response for admin', async () => {
    if (!dbOk) return;
    const res = await fetch(`${baseUrl}/admin/api/chats/${chatId}`, {
      headers: { Authorization: `Bearer ${adminKey}` },
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      data: {
        prompt: string;
        response: { content: string | null; reasoning_content: string | null };
      };
    };
    expect(body.data.prompt).toBe('hello prompt in');
    expect(body.data.response.content).toBe('hello out');
    expect(body.data.response.reasoning_content).toBe('think');
  });

  it('serves admin UI static assets', async () => {
    if (!dbOk) return;
    const ui = await fetch(`${baseUrl}/admin/`);
    expect(ui.status).toBe(200);
    const html = await ui.text();
    expect(html).toContain('Grok Gateway Admin');
    const css = await fetch(`${baseUrl}/admin/styles.css`);
    expect(css.status).toBe(200);
  });

  it('updates settings', async () => {
    if (!dbOk) return;
    const res = await fetch(`${baseUrl}/admin/api/settings`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${adminKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ safeMaxTurns: 5 }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { data: { safeMaxTurns: number } };
    expect(body.data.safeMaxTurns).toBe(5);
  });
});
