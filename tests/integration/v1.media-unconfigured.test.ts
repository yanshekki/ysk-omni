import http from 'node:http';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  apiFetch,
  startHarness,
  stopHarness,
  type Harness,
} from '../helpers/api-harness';
import { apiFeaturesService } from '../../src/services/api-features.service';
import { setMediaProviderForTests } from '../../src/services/media/media-orchestrator.service';

const PNG_1X1 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

describe('unconfigured image/audio = 501 engine_unconfigured', () => {
  let h: Harness | null = null;

  beforeAll(async () => {
    delete process.env.OMNI_IMAGE_URL;
    delete process.env.OMNI_TTS_URL;
    delete process.env.OMNI_STT_URL;
    delete process.env.MEDIA_PROVIDER;
    setMediaProviderForTests(null);
    h = await startHarness('media501');
    await apiFeaturesService.update({ imagesApi: true, audioApi: true, tools: true });
  }, 60_000);

  afterAll(async () => {
    await stopHarness(h);
  });

  it('POST /v1/images/generations unconfigured', async () => {
    if (!h) return;
    const res = await apiFetch(h.baseUrl, '/v1/images/generations', {
      method: 'POST',
      key: h.clientKey,
      body: { prompt: 'a cat' },
    });
    expect(res.status).toBe(501);
    const body = res.json as { error?: { code?: string } };
    expect(body.error?.code).toBe('engine_unconfigured');
  });

  it('POST /v1/audio/speech unconfigured', async () => {
    if (!h) return;
    const res = await apiFetch(h.baseUrl, '/v1/audio/speech', {
      method: 'POST',
      key: h.clientKey,
      body: { model: 'tts', input: 'hello', voice: 'alloy' },
    });
    expect(res.status).toBe(501);
    const body = res.json as { error?: { code?: string } };
    expect(body.error?.code).toBe('engine_unconfigured');
  });
});

describe('configured OMNI_IMAGE_URL proxies a fixture', () => {
  let h: Harness | null = null;
  let worker: http.Server | null = null;
  let workerUrl = '';

  beforeAll(async () => {
    worker = http.createServer((req, res) => {
      if (req.url?.includes('/v1/images/generations')) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ data: [{ b64_json: PNG_1X1 }] }));
        return;
      }
      res.statusCode = 404;
      res.end();
    });
    await new Promise<void>((resolve) => {
      worker!.listen(0, '127.0.0.1', () => resolve());
    });
    const addr = worker.address();
    if (!addr || typeof addr === 'string') throw new Error('no worker port');
    workerUrl = `http://127.0.0.1:${addr.port}`;
    process.env.OMNI_IMAGE_URL = workerUrl;
    setMediaProviderForTests(null);
    h = await startHarness('imgurl');
    await apiFeaturesService.update({ imagesApi: true, tools: true });
  }, 60_000);

  afterAll(async () => {
    delete process.env.OMNI_IMAGE_URL;
    setMediaProviderForTests(null);
    await stopHarness(h);
    await new Promise<void>((resolve) => worker?.close(() => resolve()));
  });

  it('returns an image from the worker', async () => {
    if (!h) return;
    const res = await apiFetch(h.baseUrl, '/v1/images/generations', {
      method: 'POST',
      key: h.adminKey,
      body: { prompt: 'fixture', n: 1, response_format: 'b64_json' },
    });
    expect(res.status).toBe(200);
    const body = res.json as { data: Array<{ b64_json?: string }> };
    expect(body.data[0]?.b64_json).toBe(PNG_1X1);
  });
});

describe('configured OMNI_STT_URL forwards the audio file', () => {
  let h: Harness | null = null;
  let worker: http.Server | null = null;

  beforeAll(async () => {
    worker = http.createServer((req, res) => {
      if (!req.url?.includes('/v1/audio/transcriptions')) {
        res.statusCode = 404;
        res.end();
        return;
      }
      const chunks: Buffer[] = [];
      req.on('data', (c) => chunks.push(c as Buffer));
      req.on('end', () => {
        const raw = Buffer.concat(chunks).toString('latin1');
        const ct = String(req.headers['content-type'] || '');
        const heard =
          ct.includes('multipart') && raw.includes('hello-audio');
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ text: heard ? 'heard' : 'missing' }));
      });
    });
    await new Promise<void>((resolve) => {
      worker!.listen(0, '127.0.0.1', () => resolve());
    });
    const addr = worker.address();
    if (!addr || typeof addr === 'string') throw new Error('no worker port');
    process.env.OMNI_STT_URL = `http://127.0.0.1:${addr.port}`;
    h = await startHarness('stturl');
    await apiFeaturesService.update({ audioApi: true });
  }, 60_000);

  afterAll(async () => {
    delete process.env.OMNI_STT_URL;
    await stopHarness(h);
    await new Promise<void>((resolve) => worker?.close(() => resolve()));
  });

  it('sends multipart audio bytes to the worker', async () => {
    if (!h) return;
    const form = new FormData();
    form.append(
      'file',
      new Blob([Buffer.from('hello-audio')], { type: 'audio/wav' }),
      'clip.wav',
    );
    const res = await apiFetch(h.baseUrl, '/v1/audio/transcriptions', {
      method: 'POST',
      key: h.clientKey,
      formData: form,
    });
    expect(res.status).toBe(200);
    expect((res.json as { text?: string }).text).toBe('heard');
  });
});
