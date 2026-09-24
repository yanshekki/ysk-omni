/**
 * Live tiny-model smoke against a running gateway.
 * Skip unless OMNI_LIVE_TINY=1 and OMNI_LIVE_KEY is set.
 *
 * Expected: llama-server GGUF loaded for chat; tiny-media-worker on
 * OMNI_IMAGE_URL / OMNI_TTS_URL / OMNI_STT_URL / OMNI_VIDEO_URL (not fixture).
 */
import { describe, expect, it } from 'vitest';

const live = process.env.OMNI_LIVE_TINY === '1';
const key = process.env.OMNI_LIVE_KEY || '';
const base = (process.env.OMNI_LIVE_URL || 'http://127.0.0.1:3850').replace(
  /\/$/,
  '',
);
const chatModel =
  process.env.OMNI_LIVE_CHAT_MODEL ||
  'Qwen/Qwen2.5-0.5B-Instruct-GGUF:Q2_K';

const go = live && Boolean(key);

async function api(
  path: string,
  init: RequestInit = {},
): Promise<{ status: number; json: unknown; buf: Buffer; headers: Headers }> {
  const headers = new Headers(init.headers);
  if (!headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${key}`);
  }
  const res = await fetch(`${base}${path}`, { ...init, headers });
  const ab = await res.arrayBuffer();
  const buf = Buffer.from(ab);
  let json: unknown = null;
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('json')) {
    try {
      json = JSON.parse(buf.toString('utf8'));
    } catch {
      json = null;
    }
  }
  return { status: res.status, json, buf, headers: res.headers };
}

describe.skipIf(!go)('live tiny modalities (real weights)', () => {
  it(
    'text chat completions replies',
    async () => {
      const res = await api('/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: chatModel,
          temperature: 0,
          max_tokens: 32,
          messages: [
            {
              role: 'user',
              content: 'Reply with exactly the word pong and nothing else.',
            },
          ],
        }),
      });
      expect(res.status).toBe(200);
      const body = res.json as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const text = body.choices?.[0]?.message?.content || '';
      expect(text.toLowerCase()).toMatch(/pong|yes|ok|hello|hi/);
    },
    180_000,
  );

  it(
    'TTS speech returns audio',
    async () => {
      const res = await api('/v1/audio/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'tts-1',
          voice: 'alloy',
          input: 'Hello from YSK Omni tiny test.',
        }),
      });
      expect(res.status).toBe(200);
      expect(res.buf.length).toBeGreaterThan(1000);
    },
    120_000,
  );

  it(
    'STT transcribes TTS audio',
    async () => {
      const speech = await api('/v1/audio/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'tts-1',
          voice: 'alloy',
          input: 'hello world',
        }),
      });
      expect(speech.status).toBe(200);
      const form = new FormData();
      form.append(
        'file',
        new Blob([new Uint8Array(speech.buf)], { type: 'audio/wav' }),
        'speech.wav',
      );
      form.append('model', 'whisper-1');
      const res = await api('/v1/audio/transcriptions', {
        method: 'POST',
        body: form,
      });
      expect(res.status).toBe(200);
      const body = res.json as { text?: string };
      expect(String(body.text || '').trim().length).toBeGreaterThan(0);
    },
    180_000,
  );

  it(
    'image generations returns a PNG',
    async () => {
      const res = await api('/v1/images/generations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'a red apple on a table',
          size: '256x256',
        }),
      });
      expect(res.status).toBe(200);
      const body = res.json as { data?: Array<{ b64_json?: string }> };
      const b64 = body.data?.[0]?.b64_json || '';
      expect(b64.length).toBeGreaterThan(80);
      const png = Buffer.from(b64, 'base64');
      expect(png.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
    },
    180_000,
  );

  it(
    'video job completes with an mp4',
    async () => {
      const created = await api('/v1/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'a red square', seconds: 1 }),
      });
      expect(created.status).toBe(200);
      const job = created.json as { id?: string; status?: string };
      expect(job.id).toBeTruthy();
      let status = job.status || '';
      for (let i = 0; i < 60 && !['completed', 'failed'].includes(status); i += 1) {
        await new Promise((r) => setTimeout(r, 1000));
        const poll = await api(`/v1/videos/${job.id}`);
        status = String((poll.json as { status?: string }).status || '');
      }
      expect(status).toBe('completed');
      const content = await api(`/v1/videos/${job.id}/content`);
      expect(content.status).toBe(200);
      expect(content.buf.length).toBeGreaterThan(32);
      expect(content.buf.includes(Buffer.from('ysk-omni-video-fixture'))).toBe(
        false,
      );
    },
    180_000,
  );
});
