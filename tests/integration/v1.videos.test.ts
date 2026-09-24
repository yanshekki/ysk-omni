import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  apiFetch,
  startHarness,
  stopHarness,
  type Harness,
} from '../helpers/api-harness';
import { apiFeaturesService } from '../../src/services/api-features.service';
import { vramScheduler } from '../../src/services/vram-scheduler';

describe('v1 video jobs', () => {
  let h: Harness | null = null;

  beforeAll(async () => {
    h = await startHarness('vid');
    await apiFeaturesService.update({ videoApi: true, tools: true });
  }, 60_000);

  afterAll(async () => {
    await stopHarness(h);
  });

  it('exclusive video job unloads models already in the VRAM scheduler', async () => {
    if (!h) return;
    vramScheduler.reset();
    vramScheduler.load({ id: 'text-a', vramMb: 8000 });
    vramScheduler.load({ id: 'text-b', vramMb: 8000 });
    expect(vramScheduler.snapshot().loaded.map((m) => m.id).sort()).toEqual([
      'text-a',
      'text-b',
    ]);
    const created = await apiFetch(h.baseUrl, '/v1/videos', {
      method: 'POST',
      key: h.adminKey,
      body: { prompt: 'exclusive vram', seconds: 6 },
    });
    expect(created.status).toBe(200);
    const job = created.json as { id: string };
    for (let i = 0; i < 40; i += 1) {
      const poll = await apiFetch(h.baseUrl, `/v1/videos/${job.id}`, {
        key: h.adminKey,
      });
      const status = (poll.json as { status: string }).status;
      if (status === 'completed' || status === 'failed') break;
      await new Promise((r) => setTimeout(r, 50));
    }
    const ids = vramScheduler.snapshot().loaded.map((m) => m.id);
    expect(ids).not.toContain('text-a');
    expect(ids).not.toContain('text-b');
  });

  it('create is queued then completes with fixture content', async () => {
    if (!h) return;
    const created = await apiFetch(h.baseUrl, '/v1/videos', {
      method: 'POST',
      key: h.adminKey,
      body: { prompt: 'a walking cat', seconds: 6 },
    });
    expect(created.status).toBe(200);
    const job = created.json as { id: string; object: string; status: string };
    expect(job.object).toBe('video');
    expect(job.status).toBe('queued');
    expect(job.id).toBeTruthy();

    let status = job.status;
    let last: { status: string } = job;
    for (let i = 0; i < 40; i += 1) {
      const poll = await apiFetch(h.baseUrl, `/v1/videos/${job.id}`, {
        key: h.adminKey,
      });
      expect(poll.status).toBe(200);
      last = poll.json as { status: string };
      status = last.status;
      if (status === 'completed' || status === 'failed') break;
      await new Promise((r) => setTimeout(r, 50));
    }
    expect(['in_progress', 'completed', 'failed']).toContain(status);
    expect(status).toBe('completed');

    const content = await apiFetch(h.baseUrl, `/v1/videos/${job.id}/content`, {
      key: h.adminKey,
    });
    expect(content.status).toBe(200);
    expect(content.text.includes('ysk-omni-video-fixture')).toBe(true);
    expect(content.text.includes('ftyp') || content.text.includes('isom')).toBe(
      true,
    );
    expect(content.text.includes('moov')).toBe(true);
    expect(content.text.length).toBeGreaterThan(1000);
  });
});
