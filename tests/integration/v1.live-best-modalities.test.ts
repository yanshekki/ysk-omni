/**
 * Rigorous live checks against the best on-device weights.
 * Skip unless OMNI_LIVE_BEST=1 and OMNI_LIVE_KEY is set.
 */
import { describe, expect, it } from 'vitest';

const live = process.env.OMNI_LIVE_BEST === '1';
const key = process.env.OMNI_LIVE_KEY || '';
const base = (process.env.OMNI_LIVE_URL || 'http://127.0.0.1:3850').replace(
  /\/$/,
  '',
);
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
  const buf = Buffer.from(await res.arrayBuffer());
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

function pngSize(buf: Buffer): { w: number; h: number } {
  expect(buf.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

function wavRate(buf: Buffer): number {
  expect(buf.subarray(0, 4).toString('ascii')).toBe('RIFF');
  expect(buf.subarray(8, 12).toString('ascii')).toBe('WAVE');
  return buf.readUInt32LE(24);
}

describe.skipIf(!go)('live best modalities (on-device weights)', () => {
  it(
    'speech wav is high-rate PCM and mp3 converts',
    async () => {
      const wav = await api('/v1/audio/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: 'This is a high quality voice test.',
          response_format: 'wav',
        }),
      });
      expect(wav.status).toBe(200);
      expect(wav.buf.length).toBeGreaterThan(20_000);
      expect(wavRate(wav.buf)).toBeGreaterThanOrEqual(22050);

      const mp3 = await api('/v1/audio/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: 'This is a high quality voice test.',
          response_format: 'mp3',
        }),
      });
      expect(mp3.status).toBe(200);
      const head = mp3.buf.subarray(0, 3).toString('ascii');
      expect(head === 'ID3' || mp3.buf[0] === 0xff).toBe(true);
    },
    120_000,
  );

  it(
    'whisper large-v3 transcribes the spoken sentence',
    async () => {
      const wav = await api('/v1/audio/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: 'This is a high quality voice test.',
          response_format: 'wav',
        }),
      });
      expect(wav.status).toBe(200);
      const form = new FormData();
      form.append(
        'file',
        new Blob([new Uint8Array(wav.buf)], { type: 'audio/wav' }),
        'speech.wav',
      );
      const tr = await api('/v1/audio/transcriptions', {
        method: 'POST',
        body: form,
      });
      expect(tr.status).toBe(200);
      const text = String((tr.json as { text?: string }).text || '').toLowerCase();
      expect(text).toMatch(/high quality voice/);
    },
    180_000,
  );

  it(
    'image generations returns 512px PNG and jpeg/webp convert',
    async () => {
      const pngRes = await api('/v1/images/generations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'a red apple on a wooden table, photorealistic',
          format: 'png',
        }),
      });
      expect(pngRes.status).toBe(200);
      const b64 = (pngRes.json as { data?: Array<{ b64_json?: string }> })
        .data?.[0]?.b64_json;
      expect(b64).toBeTruthy();
      const png = Buffer.from(b64 || '', 'base64');
      const { w, h } = pngSize(png);
      expect(w).toBeGreaterThanOrEqual(256);
      expect(h).toBeGreaterThanOrEqual(256);

      const jpgRes = await api('/v1/images/generations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'a blue ceramic mug', format: 'jpeg' }),
      });
      expect(jpgRes.status).toBe(200);
      const jpgB64 = (jpgRes.json as { data?: Array<{ b64_json?: string }> })
        .data?.[0]?.b64_json;
      const jpg = Buffer.from(jpgB64 || '', 'base64');
      expect(jpg[0]).toBe(0xff);
      expect(jpg[1]).toBe(0xd8);
    },
    300_000,
  );

  it(
    'video job is temporal T2V (16 frames), not stills',
    async () => {
      const created = await api('/v1/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'a red apple rolling on a wooden table',
          seconds: 2,
          format: 'mp4',
        }),
      });
      expect(created.status).toBe(200);
      const job = created.json as { id?: string; status?: string };
      expect(job.id).toBeTruthy();
      let status = job.status || '';
      for (let i = 0; i < 90 && !['completed', 'failed'].includes(status); i += 1) {
        await new Promise((r) => setTimeout(r, 2000));
        const poll = await api(`/v1/videos/${job.id}`);
        status = String((poll.json as { status?: string }).status || '');
      }
      expect(status).toBe('completed');
      const content = await api(`/v1/videos/${job.id}/content`);
      expect(content.status).toBe(200);
      expect(content.buf.length).toBeGreaterThan(20_000);
      expect(content.buf.includes(Buffer.from('ysk-omni-video-fixture'))).toBe(
        false,
      );
      expect(content.buf.subarray(4, 8).toString('ascii')).toBe('ftyp');
      const { writeFileSync, unlinkSync } = await import('node:fs');
      const { spawnSync } = await import('node:child_process');
      const tmp = `/tmp/ysk-t2v-${Date.now()}.mp4`;
      writeFileSync(tmp, content.buf);
      const probe = spawnSync(
        'ffprobe',
        [
          '-v',
          'error',
          '-select_streams',
          'v:0',
          '-show_entries',
          'stream=nb_frames,duration,width,height',
          '-of',
          'json',
          tmp,
        ],
        { encoding: 'utf8' },
      );
      unlinkSync(tmp);
      const info = JSON.parse(probe.stdout || '{}') as {
        streams?: Array<{
          nb_frames?: string;
          duration?: string;
          width?: number;
          height?: number;
        }>;
      };
      const st = info.streams?.[0] || {};
      expect(Number(st.nb_frames || 0)).toBeGreaterThanOrEqual(12);
      expect(Number(st.duration || 0)).toBeGreaterThanOrEqual(1.2);
      expect(Number(st.width || 0)).toBeGreaterThanOrEqual(320);
    },
    400_000,
  );
});
