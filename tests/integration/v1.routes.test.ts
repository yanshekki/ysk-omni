import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  apiFetch,
  mockGrokStream,
  startHarness,
  stopHarness,
  type Harness,
} from '../helpers/api-harness';

describe('v1 routes (auth, models, documents, api-keys)', () => {
  let h: Harness | null = null;

  beforeAll(async () => {
    h = await startHarness('v1r');
    mockGrokStream();
  }, 60_000);

  afterAll(async () => {
    await stopHarness(h);
  });

  it('rejects missing auth on protected routes', async () => {
    if (!h) return;
    for (const path of [
      '/v1/models',
      '/v1/documents',
      '/v1/chat/completions',
      '/v1/api-keys',
    ]) {
      const res = await apiFetch(h.baseUrl, path, {
        method: path.includes('chat') || path.includes('api-keys') ? 'POST' : 'GET',
        body:
          path.includes('chat')
            ? { messages: [{ role: 'user', content: 'x' }] }
            : path.includes('api-keys')
              ? { name: 'x' }
              : undefined,
      });
      expect(res.status).toBe(401);
    }
  });

  it('rejects bad API key', async () => {
    if (!h) return;
    const res = await apiFetch(h.baseUrl, '/v1/models', {
      key: 'gk_live_this_is_not_a_real_key_xx',
    });
    expect(res.status).toBe(401);
  });

  it('lists models for client key', async () => {
    if (!h) return;
    const res = await apiFetch(h.baseUrl, '/v1/models', { key: h.clientKey });
    expect(res.status).toBe(200);
    const body = res.json as { object: string; data: Array<{ id: string }> };
    expect(body.object).toBe('list');
    expect(body.data.length).toBeGreaterThan(0);
  });

  it('gets one model', async () => {
    if (!h) return;
    const res = await apiFetch(h.baseUrl, '/v1/models/grok-4.5', {
      key: h.clientKey,
    });
    expect(res.status).toBe(200);
    const body = res.json as { id: string; object: string };
    expect(body.id).toBe('grok-4.5');
    expect(body.object).toBe('model');
  });

  it('404 unknown model', async () => {
    if (!h) return;
    const res = await apiFetch(h.baseUrl, '/v1/models/not-a-model-xyz', {
      key: h.clientKey,
    });
    expect(res.status).toBe(404);
  });

  it('documents upload list get delete', async () => {
    if (!h) return;
    const fd = new FormData();
    fd.append(
      'file',
      new Blob(['hello document content'], { type: 'text/plain' }),
      'hello.txt',
    );
    const up = await apiFetch(h.baseUrl, '/v1/documents', {
      method: 'POST',
      key: h.clientKey,
      formData: fd,
    });
    expect(up.status).toBe(201);
    const upBody = up.json as { data: { id: string; originalName: string } };
    expect(upBody.data.originalName).toBe('hello.txt');
    const id = upBody.data.id;

    const list = await apiFetch(h.baseUrl, '/v1/documents', {
      key: h.clientKey,
    });
    expect(list.status).toBe(200);
    const listBody = list.json as { data: unknown[] };
    expect(listBody.data.length).toBeGreaterThan(0);

    const get = await apiFetch(h.baseUrl, `/v1/documents/${id}`, {
      key: h.clientKey,
    });
    expect(get.status).toBe(200);

    const del = await apiFetch(h.baseUrl, `/v1/documents/${id}`, {
      method: 'DELETE',
      key: h.clientKey,
    });
    expect(del.status).toBe(200);
  });

  it('api-keys requires admin; client forbidden', async () => {
    if (!h) return;
    const forbidden = await apiFetch(h.baseUrl, '/v1/api-keys', {
      key: h.clientKey,
    });
    expect(forbidden.status).toBe(403);

    const list = await apiFetch(h.baseUrl, '/v1/api-keys', {
      key: h.adminKey,
    });
    expect(list.status).toBe(200);

    const created = await apiFetch(h.baseUrl, '/v1/api-keys', {
      method: 'POST',
      key: h.adminKey,
      body: { name: `${h.prefix}-via-api`, role: 'client', mode: 'safe' },
    });
    expect(created.status).toBe(201);
    const cBody = created.json as { data: { id: string; key?: string } };
    expect(cBody.data.id).toBeTruthy();

    const rev = await apiFetch(h.baseUrl, `/v1/api-keys/${cBody.data.id}`, {
      method: 'DELETE',
      key: h.adminKey,
    });
    expect(rev.status).toBe(200);
  });

  it('validation error on empty chat messages', async () => {
    if (!h) return;
    const res = await apiFetch(h.baseUrl, '/v1/chat/completions', {
      method: 'POST',
      key: h.clientKey,
      body: { messages: [] },
    });
    expect(res.status).toBe(400);
    const body = res.json as { error: { message: string } };
    expect(body.error?.message).toBeTruthy();
  });

  it('404 unknown route OpenAI shape', async () => {
    if (!h) return;
    const res = await apiFetch(h.baseUrl, '/v1/does-not-exist', {
      key: h.clientKey,
    });
    expect(res.status).toBe(404);
    const body = res.json as { error: { message: string } };
    expect(body.error?.message).toMatch(/not found|Route/i);
  });
});
