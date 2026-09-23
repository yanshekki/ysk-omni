import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  apiFetch,
  startHarness,
  stopHarness,
  type Harness,
} from '../helpers/api-harness';
import { setMediaProviderForTests } from '../../src/services/media/media-orchestrator.service';
import { mockMediaProvider } from '../../src/services/media/providers/mock.provider';
import { apiFeaturesService } from '../../src/services/api-features.service';
import { prisma } from '../../src/config/database';
import { scryptHash, apiKeyPrefix } from '../../src/utils/api-key-crypto';
import { randomBytes, randomUUID } from 'node:crypto';

describe('v1 images API (OpenAI-compatible)', () => {
  let h: Harness | null = null;
  let agentKey = '';

  beforeAll(async () => {
    h = await startHarness('img');
    setMediaProviderForTests(mockMediaProvider);
    await apiFeaturesService.update({
      imagesApi: true,
      tools: true,
    });

    // Agent-mode client key for generation
    agentKey = `gk_live_${randomBytes(20).toString('base64url')}`;
    await prisma.apiKey.create({
      data: {
        id: randomUUID(),
        name: `${h!.prefix}-agent`,
        keyPrefix: apiKeyPrefix(agentKey),
        keyHash: scryptHash(agentKey),
        role: 'client',
        mode: 'agent',
        rateLimit: 1000,
        isActive: true,
      },
    });
  }, 60_000);

  afterAll(async () => {
    setMediaProviderForTests(null);
    await stopHarness(h);
  });

  it('generates b64_json for agent key', async () => {
    if (!h) return;
    const res = await apiFetch(h.baseUrl, '/v1/images/generations', {
      method: 'POST',
      key: agentKey,
      body: {
        prompt: 'a red pixel',
        n: 1,
        response_format: 'b64_json',
      },
    });
    expect(res.status).toBe(200);
    const body = res.json as {
      created: number;
      data: Array<{ b64_json?: string }>;
      grok?: { asset_ids: string[] };
    };
    expect(body.data[0]?.b64_json).toBeTruthy();
    expect(body.grok?.asset_ids?.length).toBe(1);

    const assetId = body.grok!.asset_ids[0]!;
    const meta = await apiFetch(h.baseUrl, `/v1/media/assets/${assetId}`, {
      key: agentKey,
    });
    expect(meta.status).toBe(200);

    const content = await apiFetch(
      h.baseUrl,
      `/v1/media/assets/${assetId}/content`,
      { key: agentKey },
    );
    expect(content.status).toBe(200);
    expect(content.headers.get('content-type')).toMatch(/image\//);
  });

  it('safe client key is forbidden', async () => {
    if (!h) return;
    const res = await apiFetch(h.baseUrl, '/v1/images/generations', {
      method: 'POST',
      key: h.clientKey,
      body: { prompt: 'nope' },
    });
    expect(res.status).toBe(403);
  });

  it('imagesApi off → 501', async () => {
    if (!h) return;
    await apiFeaturesService.update({ imagesApi: false });
    const res = await apiFetch(h.baseUrl, '/v1/images/generations', {
      method: 'POST',
      key: agentKey,
      body: { prompt: 'x' },
    });
    expect(res.status).toBe(501);
    await apiFeaturesService.update({ imagesApi: true });
  });

  it('admin key can generate', async () => {
    if (!h) return;
    const res = await apiFetch(h.baseUrl, '/v1/images/generations', {
      method: 'POST',
      key: h.adminKey,
      body: { prompt: 'admin image', response_format: 'url' },
    });
    expect(res.status).toBe(200);
    const body = res.json as { data: Array<{ url?: string }> };
    expect(body.data[0]?.url).toMatch(/\/v1\/media\/assets\//);
  });
});
