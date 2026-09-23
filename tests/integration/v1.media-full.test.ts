/**
 * M2–M4 media surfaces (mock providers).
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { randomBytes, randomUUID } from 'node:crypto';
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

const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

describe('v1 media full (images edits, files, video, audio)', () => {
  let h: Harness | null = null;
  let agentKey = '';

  beforeAll(async () => {
    h = await startHarness('mfull');
    setMediaProviderForTests(mockMediaProvider);
    process.env.MEDIA_PROVIDER = 'mock';
    process.env.AUDIO_TTS_PROVIDER = 'mock';
    process.env.AUDIO_STT_PROVIDER = 'mock';

    await apiFeaturesService.update({
      imagesApi: true,
      tools: true,
      videoApi: true,
      audioApi: true,
      filesOpenAiAlias: true,
    });

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
  }, 90_000);

  afterAll(async () => {
    setMediaProviderForTests(null);
    delete process.env.AUDIO_TTS_PROVIDER;
    delete process.env.AUDIO_STT_PROVIDER;
    await stopHarness(h);
  });

  it('POST /v1/images/edits', async () => {
    if (!h) return;
    const fd = new FormData();
    fd.append('prompt', 'make it blue');
    fd.append('response_format', 'b64_json');
    fd.append('image', new Blob([PNG_1X1], { type: 'image/png' }), 'in.png');
    const res = await apiFetch(h.baseUrl, '/v1/images/edits', {
      method: 'POST',
      key: agentKey,
      formData: fd,
    });
    expect(res.status).toBe(200);
    const body = res.json as { data: Array<{ b64_json?: string }> };
    expect(body.data[0]?.b64_json).toBeTruthy();
  });

  it('OpenAI /v1/files alias', async () => {
    if (!h) return;
    const fd = new FormData();
    fd.append('purpose', 'user_data');
    fd.append(
      'file',
      new Blob(['hello files'], { type: 'text/plain' }),
      'note.txt',
    );
    const up = await apiFetch(h.baseUrl, '/v1/files', {
      method: 'POST',
      key: agentKey,
      formData: fd,
    });
    expect(up.status).toBe(200);
    const file = up.json as { id: string; object: string; filename: string };
    expect(file.object).toBe('file');
    expect(file.filename).toBe('note.txt');

    const list = await apiFetch(h.baseUrl, '/v1/files', { key: agentKey });
    expect(list.status).toBe(200);

    const get = await apiFetch(h.baseUrl, `/v1/files/${file.id}`, {
      key: agentKey,
    });
    expect(get.status).toBe(200);

    const content = await apiFetch(h.baseUrl, `/v1/files/${file.id}/content`, {
      key: agentKey,
    });
    expect(content.status).toBe(200);
    expect(content.text).toContain('hello files');

    const del = await apiFetch(h.baseUrl, `/v1/files/${file.id}`, {
      method: 'DELETE',
      key: agentKey,
    });
    expect(del.status).toBe(200);
  });

  it('video job create → poll → content', async () => {
    if (!h) return;
    const created = await apiFetch(h.baseUrl, '/v1/videos', {
      method: 'POST',
      key: agentKey,
      body: { prompt: 'a short clip of rain' },
    });
    expect(created.status).toBe(200);
    const job = created.json as { id: string; status: string };
    expect(job.id).toBeTruthy();

    let status = job.status;
    let resultAsset: string | null = null;
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 50));
      const polled = await apiFetch(h.baseUrl, `/v1/videos/${job.id}`, {
        key: agentKey,
      });
      expect(polled.status).toBe(200);
      const body = polled.json as {
        status: string;
        result_asset_id: string | null;
      };
      status = body.status;
      resultAsset = body.result_asset_id;
      if (status === 'completed' || status === 'failed') break;
    }
    expect(status).toBe('completed');
    expect(resultAsset).toBeTruthy();

    const content = await apiFetch(
      h.baseUrl,
      `/v1/videos/${job.id}/content`,
      { key: agentKey },
    );
    expect(content.status).toBe(200);
  });

  it('audio speech mock + transcriptions mock', async () => {
    if (!h) return;
    const speech = await apiFetch(h.baseUrl, '/v1/audio/speech', {
      method: 'POST',
      key: agentKey,
      body: { input: 'hello world', model: 'tts-1', voice: 'alloy' },
    });
    expect(speech.status).toBe(200);

    const fd = new FormData();
    fd.append(
      'file',
      new Blob([new Uint8Array([0, 1, 2, 3])], { type: 'audio/mpeg' }),
      'a.mp3',
    );
    fd.append('model', 'whisper-1');
    const tr = await apiFetch(h.baseUrl, '/v1/audio/transcriptions', {
      method: 'POST',
      key: agentKey,
      formData: fd,
    });
    expect(tr.status).toBe(200);
    const body = tr.json as { text: string };
    expect(body.text).toMatch(/mock/i);
  });

  it('feature gates: files/video/audio off → 501', async () => {
    if (!h) return;
    await apiFeaturesService.update({
      filesOpenAiAlias: false,
      videoApi: false,
      audioApi: false,
    });
    const f = await apiFetch(h.baseUrl, '/v1/files', { key: agentKey });
    expect(f.status).toBe(501);
    const v = await apiFetch(h.baseUrl, '/v1/videos', {
      method: 'POST',
      key: agentKey,
      body: { prompt: 'x' },
    });
    expect(v.status).toBe(501);
    const a = await apiFetch(h.baseUrl, '/v1/audio/speech', {
      method: 'POST',
      key: agentKey,
      body: { input: 'x' },
    });
    expect(a.status).toBe(501);
    await apiFeaturesService.update({
      filesOpenAiAlias: true,
      videoApi: true,
      audioApi: true,
    });
  });
});
