#!/usr/bin/env node
/**
 * Demo OpenAI-shaped media worker for YSK Omni.
 * Point OMNI_IMAGE_URL / OMNI_TTS_URL / OMNI_STT_URL / OMNI_VIDEO_URL here.
 * Not a real diffusion / whisper / Comfy process.
 */
import http from 'node:http';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

function wavBytes() {
  const samples = 800;
  const dataSize = samples * 2;
  const buf = Buffer.alloc(44 + dataSize);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + dataSize, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(8000, 24);
  buf.writeUInt32LE(16000, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(dataSize, 40);
  return buf;
}

let mp4Cache = null;
function mp4Bytes() {
  if (mp4Cache) return mp4Cache;
  const tmp = path.join(os.tmpdir(), 'ysk-omni-openai-worker.mp4');
  const ff = spawnSync(
    'ffmpeg',
    [
      '-y',
      '-f',
      'lavfi',
      '-i',
      'color=c=0x1a1a2e:s=32x32:d=0.2',
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-t',
      '0.2',
      '-movflags',
      '+faststart',
      '-metadata',
      'comment=ysk-omni-video-fixture',
      tmp,
    ],
    { encoding: 'utf8' },
  );
  if (ff.status === 0 && fs.existsSync(tmp)) {
    mp4Cache = fs.readFileSync(tmp);
    return mp4Cache;
  }
  mp4Cache = Buffer.from('ftypisomysk-omni-video-fixture');
  return mp4Cache;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = req.url || '/';
  try {
    if (req.method === 'GET' && (url === '/health' || url === '/')) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: true, worker: 'ysk-omni-openai-worker' }));
      return;
    }
    if (req.method === 'POST' && url.includes('/v1/images/generations')) {
      await readBody(req);
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          created: Math.floor(Date.now() / 1000),
          data: [{ b64_json: PNG_1X1.toString('base64') }],
        }),
      );
      return;
    }
    if (req.method === 'POST' && url.includes('/v1/images/edits')) {
      await readBody(req);
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          created: Math.floor(Date.now() / 1000),
          data: [{ b64_json: PNG_1X1.toString('base64') }],
        }),
      );
      return;
    }
    if (req.method === 'POST' && url.includes('/v1/audio/speech')) {
      await readBody(req);
      const wav = wavBytes();
      res.setHeader('Content-Type', 'audio/wav');
      res.end(wav);
      return;
    }
    if (req.method === 'POST' && url.includes('/v1/audio/transcriptions')) {
      await readBody(req);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ text: 'ysk-omni-stt-fixture' }));
      return;
    }
    if (req.method === 'POST' && url.includes('/v1/videos')) {
      await readBody(req);
      const mp4 = mp4Bytes();
      res.setHeader('Content-Type', 'video/mp4');
      res.end(mp4);
      return;
    }
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'not found' }));
  } catch (err) {
    res.statusCode = 500;
    res.end(String(err instanceof Error ? err.message : err));
  }
});

const port = Number(process.env.OMNI_WORKER_PORT || 3860);
server.listen(port, '127.0.0.1', () => {
  const addr = server.address();
  const p = addr && typeof addr === 'object' ? addr.port : port;
  process.stdout.write(`ysk-omni-openai-worker http://127.0.0.1:${p}\n`);
});
