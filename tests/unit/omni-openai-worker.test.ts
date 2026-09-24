import { spawn, type ChildProcess } from 'node:child_process';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const script = path.resolve(process.cwd(), 'scripts/omni-openai-worker.mjs');

describe('omni-openai-worker', () => {
  let child: ChildProcess | null = null;
  let base = '';

  beforeAll(async () => {
    child = spawn(process.execPath, [script], {
      env: { ...process.env, OMNI_WORKER_PORT: '0' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    base = await new Promise<string>((resolve, reject) => {
      const t = setTimeout(() => reject(new Error('worker start timeout')), 15_000);
      child!.stdout?.on('data', (buf: Buffer) => {
        const line = buf.toString('utf8');
        const m = line.match(/http:\/\/127\.0\.0\.1:\d+/);
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
  }, 20_000);

  afterAll(() => {
    if (child?.pid) {
      try {
        child.kill('SIGTERM');
      } catch {
        /* ignore */
      }
    }
  });

  it('serves OpenAI-shaped image, speech, stt, and video fixtures', async () => {
    const img = await fetch(`${base}/v1/images/generations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'red' }),
    });
    expect(img.ok).toBe(true);
    const imgJson = (await img.json()) as { data: Array<{ b64_json?: string }> };
    expect(imgJson.data[0]?.b64_json).toBeTruthy();
    const png = Buffer.from(imgJson.data[0]!.b64_json!, 'base64');
    expect(png.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');

    const tts = await fetch(`${base}/v1/audio/speech`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: 'hi', voice: 'alloy' }),
    });
    expect(tts.ok).toBe(true);
    const wav = Buffer.from(await tts.arrayBuffer());
    expect(wav.subarray(0, 4).toString('ascii')).toBe('RIFF');

    const stt = await fetch(`${base}/v1/audio/transcriptions`, {
      method: 'POST',
      body: new FormData(),
    });
    expect(stt.ok).toBe(true);
    const sttJson = (await stt.json()) as { text?: string };
    expect(sttJson.text).toBe('ysk-omni-stt-fixture');

    const vid = await fetch(`${base}/v1/videos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'cat' }),
    });
    expect(vid.ok).toBe(true);
    const mp4 = Buffer.from(await vid.arrayBuffer());
    expect(mp4.includes(Buffer.from('ftyp')) || mp4.includes(Buffer.from('ysk-omni-video-fixture'))).toBe(
      true,
    );
  });
});
