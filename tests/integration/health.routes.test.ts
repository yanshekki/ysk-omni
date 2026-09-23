import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { createApp } from '../../src/app';
import { prisma } from '../../src/config/database';

describe('health routes', () => {
  let server: Server;
  let baseUrl: string;
  let dbAvailable = false;

  beforeAll(async () => {
    try {
      await prisma.$connect();
      await prisma.$queryRaw`SELECT 1`;
      dbAvailable = true;
    } catch {
      dbAvailable = false;
    }

    const app = createApp();
    await new Promise<void>((resolve) => {
      server = app.listen(0, '127.0.0.1', () => resolve());
    });
    const addr = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${addr.port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
    await prisma.$disconnect().catch(() => undefined);
  });

  it('GET /health returns ok without DB', async () => {
    const res = await fetch(`${baseUrl}/health`);
    expect(res.status).toBe(200);
    const body = (await res.json()) as { status: string };
    expect(body.status).toBe('ok');
  });

  it('GET /ready reflects database connectivity', async () => {
    const res = await fetch(`${baseUrl}/ready`);
    const body = (await res.json()) as {
      status: string;
      checks: { database: string };
    };
    if (dbAvailable) {
      expect(res.status).toBe(200);
      expect(body.checks.database).toBe('up');
    } else {
      expect(res.status).toBe(503);
      expect(body.checks.database).toBe('down');
    }
  });

  it('protected route rejects missing auth', async () => {
    const res = await fetch(`${baseUrl}/v1/models`);
    expect(res.status).toBe(401);
    const body = (await res.json()) as { error: { code: string } };
    expect(body.error.code).toBe('unauthorized');
  });
});
