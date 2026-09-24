import { spawn, type ChildProcess } from 'node:child_process';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  apiFetch,
  startHarness,
  stopHarness,
  type Harness,
} from '../helpers/api-harness';
import { apiFeaturesService } from '../../src/services/api-features.service';
import { setMediaProviderForTests } from '../../src/services/media/media-orchestrator.service';

const script = path.resolve(process.cwd(), 'scripts/omni-openai-worker.mjs');

describe('gateway proxies the bundled OpenAI media worker', () => {
  let h: Harness | null = null;
  let child: ChildProcess | null = null;
  let prevImage = '';
  let prevTts = '';
  let prevStt = '';
  let prevVideo = '';

  beforeAll(async () => {
    prevImage = process.env.OMNI_IMAGE_URL || '';
    prevTts = process.env.OMNI_TTS_URL || '';
    prevStt = process.env.OMNI_STT_URL || '';
    prevVideo = process.env.OMNI_VIDEO_URL || '';
    child = spawn(process.execPath, [script], {
      env: { ...process.env, OMNI_WORKER_PORT: '0' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const base = await new Promise<string>((resolve, reject) => {
      const t = setTimeout(() => reject(new Error('worker start timeout')), 15_000);
      child!.stdout?.on('data', (buf: Buffer) => {
        const m = buf.toString('utf8').match(/http:\/\/127\.0\.0\.1:\d+/);
        if (m) {
          clearTimeout(t);
          resolve(m[0]);
        }
      });
      child!.on('exit', (code) => {
        clearTimeout(t);
        reject(new Error(`worker exited ${code}`));
      });
    });
    process.env.OMNI_IMAGE_URL = base;
    process.env.OMNI_TTS_URL = base;
    process.env.OMNI_STT_URL = base;
    process.env.OMNI_VIDEO_URL = base;
    setMediaProviderForTests(null);
    h = await startHarness('omniw');
    await apiFeaturesService.update({
      imagesApi: true,
      audioApi: true,
      videoApi: true,
      tools: true,
    });
  }, 60_000);

  afterAll(async () => {
    if (prevImage) process.env.OMNI_IMAGE_URL = prevImage;
    else delete process.env.OMNI_IMAGE_URL;
    if (prevTts) process.env.OMNI_TTS_URL = prevTts;
    else delete process.env.OMNI_TTS_URL;
    if (prevStt) process.env.OMNI_STT_URL = prevStt;
    else delete process.env.OMNI_STT_URL;
    if (prevVideo) process.env.OMNI_VIDEO_URL = prevVideo;
    else delete process.env.OMNI_VIDEO_URL;
    if (child?.pid) {
      try {
        child.kill('SIGTERM');
      } catch {
        /* ignore */
      }
    }
    await stopHarness(h);
  });

  it('POST /v1/images/generations returns png b64', async () => {
    if (!h) return;
    const res = await apiFetch(h.baseUrl, '/v1/images/generations', {
      method: 'POST',
      key: h.adminKey,
      body: { prompt: 'a red pixel', n: 1, response_format: 'b64_json' },
    });
    expect(res.status).toBe(200);
    const body = res.json as { data: Array<{ b64_json?: string }> };
    expect(body.data[0]?.b64_json).toBeTruthy();
  });

  it('POST /v1/audio/speech returns wav', async () => {
    if (!h) return;
    const res = await apiFetch(h.baseUrl, '/v1/audio/speech', {
      method: 'POST',
      key: h.adminKey,
      body: { input: 'hello', voice: 'alloy', response_format: 'wav' },
    });
    expect(res.status).toBe(200);
    expect(res.text.includes('RIFF') || res.text.includes('WAVE')).toBe(true);
  });

  it('POST /admin/api/media/speech stores a wav asset', async () => {
    if (!h) return;
    const res = await apiFetch(h.baseUrl, '/admin/api/media/speech', {
      method: 'POST',
      key: h.adminKey,
      body: { input: 'hello from studio' },
    });
    expect(res.status).toBe(200);
    const body = res.json as { data?: { asset_id?: string; mime?: string } };
    expect(body.data?.asset_id).toBeTruthy();
    expect(String(body.data?.mime || '')).toMatch(/audio\//);
    const dl = await apiFetch(
      h.baseUrl,
      `/admin/api/media/assets/${body.data?.asset_id}/download`,
      { key: h.adminKey },
    );
    expect(dl.status).toBe(200);
    expect(dl.text.includes('RIFF') || dl.text.includes('WAVE')).toBe(true);
  });

  it('POST /admin/api/media/transcribe stores transcript text', async () => {
    if (!h) return;
    const fd = new FormData();
    fd.append(
      'file',
      new Blob([Buffer.from('RIFF')], { type: 'audio/wav' }),
      'a.wav',
    );
    const res = await apiFetch(h.baseUrl, '/admin/api/media/transcribe', {
      method: 'POST',
      key: h.adminKey,
      formData: fd,
    });
    expect(res.status).toBe(200);
    const body = res.json as { data?: { text?: string; asset_id?: string } };
    expect(body.data?.text).toBe('ysk-omni-stt-fixture');
    expect(body.data?.asset_id).toBeTruthy();
  });

  it('POST /v1/audio/transcriptions returns fixture text', async () => {
    if (!h) return;
    const fd = new FormData();
    fd.append('file', new Blob([Buffer.from('RIFF')], { type: 'audio/wav' }), 'a.wav');
    const res = await apiFetch(h.baseUrl, '/v1/audio/transcriptions', {
      method: 'POST',
      key: h.adminKey,
      formData: fd,
    });
    expect(res.status).toBe(200);
    const body = res.json as { text?: string };
    expect(body.text).toBe('ysk-omni-stt-fixture');
  });
});
