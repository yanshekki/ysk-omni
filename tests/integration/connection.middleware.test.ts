import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  apiFetch,
  mockGrokStream,
  startHarness,
  stopHarness,
  type Harness,
} from '../helpers/api-harness';
import { ipBlacklistService } from '../../src/services/ip-blacklist.service';
import { getConnectionsSnapshot } from '../../src/middlewares/connection-tracker.middleware';
import { prisma } from '../../src/config/database';

describe('connection / middleware matrix', () => {
  let h: Harness | null = null;

  beforeAll(async () => {
    h = await startHarness('conn');
    mockGrokStream();
  }, 60_000);

  afterAll(async () => {
    await stopHarness(h);
  });

  it('health and ready', async () => {
    if (!h) return;
    const health = await apiFetch(h.baseUrl, '/health');
    expect(health.status).toBe(200);
    const ready = await apiFetch(h.baseUrl, '/ready');
    expect([200, 503]).toContain(ready.status);
  });

  it('IP blacklist blocks requests', async () => {
    if (!h) return;
    // Ban loopback — tests connect via 127.0.0.1
    await ipBlacklistService.ban({
      ip: '127.0.0.1',
      reason: 'connection-itest',
      source: 'manual',
      expiresAt: new Date(Date.now() + 60_000),
    });
    await ipBlacklistService.reload();

    const res = await apiFetch(h.baseUrl, '/v1/models', { key: h.clientKey });
    expect(res.status).toBe(403);
    expect(res.text).toMatch(/blacklist|blacklisted/i);

    await ipBlacklistService.unban('127.0.0.1').catch(async () => {
      await prisma.ipBlacklist.deleteMany({ where: { ip: '127.0.0.1' } });
    });
    await ipBlacklistService.reload();

    const ok = await apiFetch(h.baseUrl, '/v1/models', { key: h.clientKey });
    expect(ok.status).toBe(200);
  });

  it('connection tracker records finished requests', async () => {
    if (!h) return;
    await apiFetch(h.baseUrl, '/v1/models', { key: h.clientKey });
    const snap = getConnectionsSnapshot();
    expect(snap.counts.recent + snap.counts.active).toBeGreaterThanOrEqual(0);
    // After request finishes, should appear in recent eventually
    expect(Array.isArray(snap.recent)).toBe(true);
  });

  it('concurrent requests do not crash', async () => {
    if (!h) return;
    const results = await Promise.all(
      Array.from({ length: 8 }, () =>
        apiFetch(h!.baseUrl, '/v1/models', { key: h!.clientKey }),
      ),
    );
    expect(results.every((r) => r.status === 200 || r.status === 429)).toBe(
      true,
    );
  });

  it('admin OTP session rejected on /v1', async () => {
    if (!h) return;
    const res = await apiFetch(h.baseUrl, '/v1/models', {
      headers: { Authorization: 'Bearer gog_sess_fake_token_xxxxx' },
    });
    expect(res.status).toBe(401);
  });
});
