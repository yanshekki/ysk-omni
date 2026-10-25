import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import express from 'express';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { errorMiddleware } from '../../src/middlewares/error.middleware';
import { uploadImageEdit } from '../../src/middlewares/upload-images.middleware';
import { uploadSingle } from '../../src/middlewares/upload.middleware';

async function listen(app: express.Express): Promise<{ server: Server; url: string }> {
  return new Promise((resolve) => {
    const server = app.listen(0, '127.0.0.1', () => {
      const { port } = server.address() as AddressInfo;
      resolve({ server, url: `http://127.0.0.1:${port}` });
    });
  });
}

describe('multer 2 memoryStorage upload middlewares', () => {
  let server: Server;
  let url: string;

  beforeAll(async () => {
    const app = express();
    app.post('/file', uploadSingle, (req, res) => {
      res.status(200).json({
        name: req.file?.originalname,
        size: req.file?.buffer?.length,
      });
    });
    app.post('/image', uploadImageEdit, (req, res) => {
      const files = req.files as
        | { [field: string]: Express.Multer.File[] }
        | undefined;
      res.status(200).json({
        image: files?.image?.[0]?.originalname,
        mask: files?.mask?.[0]?.originalname,
        prompt: req.body?.prompt,
      });
    });
    app.use(errorMiddleware);
    ({ server, url } = await listen(app));
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  });

  it('accepts a single memoryStorage file', async () => {
    const fd = new FormData();
    fd.append(
      'file',
      new Blob(['hello multer 2'], { type: 'text/plain' }),
      'hello.txt',
    );
    const res = await fetch(`${url}/file`, { method: 'POST', body: fd });
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ name: 'hello.txt', size: 14 });
  });

  it('accepts image edit fields plus prompt', async () => {
    const fd = new FormData();
    fd.append('prompt', 'make blue');
    fd.append(
      'image',
      new Blob([Uint8Array.from([137, 80, 78, 71])], { type: 'image/png' }),
      'a.png',
    );
    const res = await fetch(`${url}/image`, { method: 'POST', body: fd });
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({
      image: 'a.png',
      prompt: 'make blue',
    });
  });

  it('rejects an oversized originalname with 400', async () => {
    const fd = new FormData();
    fd.append(
      'file',
      new Blob(['x'], { type: 'text/plain' }),
      `${'a'.repeat(501)}.txt`,
    );
    const res = await fetch(`${url}/file`, { method: 'POST', body: fd });
    expect(res.status).toBe(400);
  });

  it('rejects files over UPLOAD_MAX_BYTES with 413', async () => {
    const fd = new FormData();
    fd.append(
      'file',
      new Blob([new Uint8Array(1_048_577)], { type: 'application/octet-stream' }),
      'big.bin',
    );
    const res = await fetch(`${url}/file`, { method: 'POST', body: fd });
    expect(res.status).toBe(413);
  });

  it('rejects oversized multipart field names with 400', async () => {
    const fd = new FormData();
    fd.append(
      'x'.repeat(200),
      new Blob(['hi'], { type: 'text/plain' }),
      'a.txt',
    );
    const res = await fetch(`${url}/file`, { method: 'POST', body: fd });
    expect(res.status).toBe(400);
  });
});
