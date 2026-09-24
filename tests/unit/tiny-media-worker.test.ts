import { spawn, type ChildProcess } from 'node:child_process';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const script = path.resolve(process.cwd(), 'scripts/tiny-media-worker.py');
const PORT = 13972;

function pythonBin(): string {
  return process.env.TINY_MEDIA_PYTHON || 'python3';
}

describe('tiny media worker (fake, no weights)', () => {
  let child: ChildProcess | null = null;
  const base = `http://127.0.0.1:${PORT}`;

  beforeAll(async () => {
    child = spawn(pythonBin(), [script], {
      env: {
        ...process.env,
        TINY_MEDIA_FAKE: '1',
        TINY_WORKER_PORT: String(PORT),
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    await new Promise<void>((resolve, reject) => {
      const t = setTimeout(() => reject(new Error('tiny worker start timeout')), 15_000);
      child!.stdout?.on('data', (buf: Buffer) => {
        if (buf.toString('utf8').includes(`127.0.0.1:${PORT}`)) {
          clearTimeout(t);
          resolve();
        }
      });
      child!.on('exit', (code) => {
        clearTimeout(t);
        reject(new Error(`tiny worker exited ${code}`));
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

  it('GET /health reports fake mode', async () => {
    const res = await fetch(`${base}/health`);
    expect(res.status).toBe(200);
    const body = (await res.json()) as { status: string; fake: boolean };
    expect(body.status).toBe('ok');
    expect(body.fake).toBe(true);
  });

  it('POST /v1/audio/speech returns a wav', async () => {
    const res = await fetch(`${base}/v1/audio/speech`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: 'hello tiny' }),
    });
    expect(res.status).toBe(200);
    const buf = Buffer.from(await res.arrayBuffer());
    expect(buf.subarray(0, 4).toString('ascii')).toBe('RIFF');
    expect(buf.length).toBeGreaterThan(100);
  });

  it('POST /v1/audio/transcriptions returns text', async () => {
    const wav = await fetch(`${base}/v1/audio/speech`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: 'hello' }),
    }).then((r) => r.arrayBuffer());
    const form = new FormData();
    form.append(
      'file',
      new Blob([new Uint8Array(wav)], { type: 'audio/wav' }),
      'clip.wav',
    );
    const res = await fetch(`${base}/v1/audio/transcriptions`, {
      method: 'POST',
      body: form,
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { text: string };
    expect(body.text.length).toBeGreaterThan(0);
  });

  it('POST /v1/images/generations returns png b64', async () => {
    const res = await fetch(`${base}/v1/images/generations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'a red square' }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { data: Array<{ b64_json: string }> };
    const png = Buffer.from(body.data[0].b64_json, 'base64');
    expect(png.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
    expect(png.length).toBeGreaterThan(32);
  });
});
