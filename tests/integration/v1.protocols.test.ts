import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  apiFetch,
  mockGrokStream,
  startHarness,
  stopHarness,
  type Harness,
} from '../helpers/api-harness';
import { apiFeaturesService } from '../../src/services/api-features.service';

describe('v1 multi-protocol (chat / messages / responses)', () => {
  let h: Harness | null = null;

  beforeAll(async () => {
    h = await startHarness('v1p');
    mockGrokStream('protocol-pong');
  }, 60_000);

  afterAll(async () => {
    if (h) await apiFeaturesService.applyPreset('open').catch(() => undefined);
    await stopHarness(h);
  });

  it('POST /v1/chat/completions (non-stream, mocked Grok)', async () => {
    if (!h) return;
    const res = await apiFetch(h.baseUrl, '/v1/chat/completions', {
      method: 'POST',
      key: h.clientKey,
      body: {
        model: 'grok-4.5',
        messages: [{ role: 'user', content: 'say pong' }],
        stream: false,
      },
      headers: { 'Idempotency-Key': `itest-${Date.now()}` },
    });
    expect(res.status).toBe(200);
    const body = res.json as {
      object: string;
      choices: Array<{ message: { content: string | null } }>;
    };
    expect(body.object).toBe('chat.completion');
    expect(body.choices[0]?.message?.content).toContain('protocol-pong');
  });

  it('POST /v1/messages with x-api-key (Anthropic)', async () => {
    if (!h) return;
    const res = await apiFetch(h.baseUrl, '/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': h.clientKey,
        'Content-Type': 'application/json',
      },
      body: {
        model: 'grok-4.5',
        max_tokens: 64,
        messages: [{ role: 'user', content: 'hi' }],
      },
    });
    expect(res.status).toBe(200);
    const body = res.json as {
      type: string;
      role: string;
      content: Array<{ type: string; text: string }>;
    };
    expect(body.type).toBe('message');
    expect(body.role).toBe('assistant');
    expect(body.content[0]?.text).toContain('protocol-pong');
  });

  it('Anthropic error envelope on 401 for /v1/messages', async () => {
    if (!h) return;
    const res = await apiFetch(h.baseUrl, '/v1/messages', {
      method: 'POST',
      body: {
        model: 'grok-4.5',
        max_tokens: 16,
        messages: [{ role: 'user', content: 'x' }],
      },
    });
    expect(res.status).toBe(401);
    const body = res.json as { type: string; error: { type: string } };
    expect(body.type).toBe('error');
    expect(body.error?.type).toMatch(/auth|authentication/i);
  });

  it('Responses create + get + delete', async () => {
    if (!h) return;
    const created = await apiFetch(h.baseUrl, '/v1/responses', {
      method: 'POST',
      key: h.clientKey,
      body: {
        model: 'grok-4.5',
        input: 'hello responses',
        stream: false,
      },
    });
    expect(created.status).toBe(200);
    const cBody = created.json as { id: string; object: string; status: string };
    expect(cBody.object).toBe('response');
    expect(cBody.status).toBe('completed');
    expect(cBody.id).toMatch(/^resp_/);

    const got = await apiFetch(h.baseUrl, `/v1/responses/${cBody.id}`, {
      key: h.clientKey,
    });
    expect(got.status).toBe(200);

    const del = await apiFetch(h.baseUrl, `/v1/responses/${cBody.id}`, {
      method: 'DELETE',
      key: h.clientKey,
    });
    expect(del.status).toBe(200);
    const dBody = del.json as { deleted: boolean };
    expect(dBody.deleted).toBe(true);
  });

  it('feature gate disables openaiChat', async () => {
    if (!h) return;
    await apiFeaturesService.update({ openaiChat: false });
    const res = await apiFetch(h.baseUrl, '/v1/chat/completions', {
      method: 'POST',
      key: h.clientKey,
      body: {
        messages: [{ role: 'user', content: 'x' }],
      },
    });
    expect(res.status).toBe(403);
    await apiFeaturesService.update({ openaiChat: true });
  });

  it('feature gate disables anthropicMessages', async () => {
    if (!h) return;
    await apiFeaturesService.update({ anthropicMessages: false });
    const res = await apiFetch(h.baseUrl, '/v1/messages', {
      method: 'POST',
      key: h.clientKey,
      body: {
        model: 'grok-4.5',
        max_tokens: 16,
        messages: [{ role: 'user', content: 'x' }],
      },
    });
    expect(res.status).toBe(403);
    await apiFeaturesService.update({ anthropicMessages: true });
  });
});
