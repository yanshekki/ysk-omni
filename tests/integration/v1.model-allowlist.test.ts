import { randomBytes, randomUUID } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { prisma } from '../../src/config/database';
import { apiKeyPrefix, scryptHash } from '../../src/utils/api-key-crypto';
import {
  apiFetch,
  startHarness,
  stopHarness,
  type Harness,
} from '../helpers/api-harness';

describe('v1 API key model allowlist', () => {
  let h: Harness | null = null;
  let echoOnlyKey = '';

  beforeAll(async () => {
    h = await startHarness('allow');
    if (!h) return;
    echoOnlyKey = `omni_live_${randomBytes(24).toString('base64url')}`;
    await prisma.apiKey.create({
      data: {
        id: randomUUID(),
        name: `${h.prefix}-echo-only`,
        keyPrefix: apiKeyPrefix(echoOnlyKey),
        keyHash: scryptHash(echoOnlyKey),
        role: 'client',
        mode: 'safe',
        rateLimit: 1000,
        isActive: true,
        allowedModels: JSON.stringify(['echo']),
      },
    });
  }, 60_000);

  afterAll(async () => {
    await stopHarness(h);
  });

  it('GET /v1/models for unrestricted key includes echo', async () => {
    if (!h) return;
    const res = await apiFetch(h.baseUrl, '/v1/models', { key: h.clientKey });
    expect(res.status).toBe(200);
    const ids = (res.json as { data: Array<{ id: string }> }).data.map(
      (m) => m.id,
    );
    expect(ids).toContain('echo');
    expect(ids.length).toBeGreaterThan(0);
  });

  it('GET /v1/models for restricted key only returns allowlisted ids', async () => {
    if (!h) return;
    const res = await apiFetch(h.baseUrl, '/v1/models', { key: echoOnlyKey });
    expect(res.status).toBe(200);
    const ids = (res.json as { data: Array<{ id: string }> }).data.map(
      (m) => m.id,
    );
    expect(ids).toEqual(['echo']);
  });

  it('POST /v1/chat/completions other model is 403 model_not_allowed', async () => {
    if (!h) return;
    const res = await apiFetch(h.baseUrl, '/v1/chat/completions', {
      method: 'POST',
      key: echoOnlyKey,
      body: {
        model: 'not-on-this-key',
        messages: [{ role: 'user', content: 'nope' }],
      },
    });
    expect(res.status).toBe(403);
    const body = res.json as { error?: { code?: string } };
    expect(body.error?.code).toBe('model_not_allowed');
  });

  it('POST /v1/chat/completions model=echo still works', async () => {
    if (!h) return;
    const res = await apiFetch(h.baseUrl, '/v1/chat/completions', {
      method: 'POST',
      key: echoOnlyKey,
      body: {
        model: 'echo',
        messages: [{ role: 'user', content: 'allowlist-ping' }],
      },
    });
    expect(res.status).toBe(200);
    const body = res.json as {
      choices: Array<{ message?: { content?: string | null } }>;
    };
    expect(body.choices[0]?.message?.content).toContain('allowlist-ping');
  });

  it('admin create key stores allowedModels', async () => {
    if (!h) return;
    const created = await apiFetch(h.baseUrl, '/admin/api/keys', {
      method: 'POST',
      key: h.adminKey,
      body: {
        name: `${h.prefix}-models`,
        role: 'client',
        mode: 'agent',
        rateLimit: 30,
        allowedModels: ['echo', 'piper/lessac-high'],
      },
    });
    expect(created.status).toBe(201);
    const data = (created.json as { data: { allowedModels?: string[] } }).data;
    expect(data.allowedModels).toEqual(['echo', 'piper/lessac-high']);
  });
});
