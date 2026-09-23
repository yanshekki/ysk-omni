import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  apiFetch,
  startHarness,
  stopHarness,
  type Harness,
} from '../helpers/api-harness';

describe('v1 echo chat and models', () => {
  let h: Harness | null = null;

  beforeAll(async () => {
    h = await startHarness('echo');
  }, 60_000);

  afterAll(async () => {
    await stopHarness(h);
  });

  it('GET /v1/models includes echo and no Grok ids', async () => {
    if (!h) return;
    const res = await apiFetch(h.baseUrl, '/v1/models', { key: h.clientKey });
    expect(res.status).toBe(200);
    const body = res.json as { data: Array<{ id: string }> };
    const ids = body.data.map((m) => m.id);
    expect(ids).toContain('echo');
    expect(ids.some((id) => /^grok/i.test(id))).toBe(false);
  });

  it('POST /v1/chat/completions model=echo returns OpenAI JSON', async () => {
    if (!h) return;
    const res = await apiFetch(h.baseUrl, '/v1/chat/completions', {
      method: 'POST',
      key: h.clientKey,
      body: {
        model: 'echo',
        messages: [{ role: 'user', content: 'ping-echo' }],
      },
    });
    expect(res.status).toBe(200);
    const body = res.json as {
      object: string;
      choices: Array<{ message?: { content?: string | null } }>;
    };
    expect(body.object).toBe('chat.completion');
    const content = body.choices[0]?.message?.content;
    expect(typeof content).toBe('string');
    expect(content && content.length).toBeGreaterThan(0);
    expect(content).toContain('ping-echo');
  });

  it('POST /v1/models/pull streams NDJSON', async () => {
    if (!h) return;
    const res = await apiFetch(h.baseUrl, '/v1/models/pull', {
      method: 'POST',
      key: h.clientKey,
      body: { model: 'ysk-omni/not-a-real-repo-xyz' },
    });
    expect(res.status).toBe(200);
    expect(res.text.length).toBeGreaterThan(0);
    const lines = res.text
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    expect(lines.length).toBeGreaterThan(0);
    const last = JSON.parse(lines[lines.length - 1]!) as { status?: string };
    expect(['done', 'skipped', 'error', 'starting', 'downloading']).toContain(
      last.status,
    );
  });
});
