import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  apiFetch,
  mockGrokStream,
  startHarness,
  stopHarness,
  type Harness,
} from '../helpers/api-harness';
import { apiFeaturesService } from '../../src/services/api-features.service';

describe('v1 assistants-lite + threads', () => {
  let h: Harness | null = null;

  beforeAll(async () => {
    h = await startHarness('v1a');
    mockGrokStream('assistant-run-ok');
    await apiFeaturesService.update({ assistantsEmulation: true });
  }, 60_000);

  afterAll(async () => {
    await stopHarness(h);
  });

  it('CRUD assistant + thread messages + run', async () => {
    if (!h) return;

    const a = await apiFetch(h.baseUrl, '/v1/assistants', {
      method: 'POST',
      key: h.clientKey,
      body: {
        name: 'test-asst',
        model: 'grok-4.5',
        instructions: 'Be brief',
      },
    });
    expect(a.status).toBe(200);
    const aBody = a.json as { id: string; object: string };
    expect(aBody.object).toBe('assistant');
    const assistantId = aBody.id;

    const list = await apiFetch(h.baseUrl, '/v1/assistants', {
      key: h.clientKey,
    });
    expect(list.status).toBe(200);

    const getA = await apiFetch(h.baseUrl, `/v1/assistants/${assistantId}`, {
      key: h.clientKey,
    });
    expect(getA.status).toBe(200);

    const thr = await apiFetch(h.baseUrl, '/v1/threads', {
      method: 'POST',
      key: h.clientKey,
      body: {},
    });
    expect(thr.status).toBe(200);
    const thrBody = thr.json as { id: string };
    const threadId = thrBody.id;

    const msg = await apiFetch(
      h.baseUrl,
      `/v1/threads/${threadId}/messages`,
      {
        method: 'POST',
        key: h.clientKey,
        body: { role: 'user', content: 'hello thread' },
      },
    );
    expect(msg.status).toBe(200);

    const msgs = await apiFetch(
      h.baseUrl,
      `/v1/threads/${threadId}/messages`,
      { key: h.clientKey },
    );
    expect(msgs.status).toBe(200);

    const run = await apiFetch(h.baseUrl, `/v1/threads/${threadId}/runs`, {
      method: 'POST',
      key: h.clientKey,
      body: { assistant_id: assistantId },
    });
    // run may return 200 with completed status when mocked
    expect([200, 201]).toContain(run.status);

    const del = await apiFetch(h.baseUrl, `/v1/assistants/${assistantId}`, {
      method: 'DELETE',
      key: h.clientKey,
    });
    expect(del.status).toBe(200);
  });

  it('disabled assistantsEmulation → 403', async () => {
    if (!h) return;
    await apiFeaturesService.update({ assistantsEmulation: false });
    const res = await apiFetch(h.baseUrl, '/v1/assistants', {
      method: 'POST',
      key: h.clientKey,
      body: { name: 'x' },
    });
    expect(res.status).toBe(403);
    await apiFeaturesService.update({ assistantsEmulation: true });
  });
});
