import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  apiFetch,
  startHarness,
  stopHarness,
  type Harness,
} from '../helpers/api-harness';
import { SETTING_KEYS } from '../../src/config/constants';
import { prisma } from '../../src/config/database';
import {
  defaultQueuePolicy,
  queuePolicyService,
} from '../../src/services/queue/queue-policy.service';
import { chatWorkerService } from '../../src/services/queue/chat-worker.service';
import { upsertEntry } from '../../src/services/hf/registry';
import { engineManager } from '../../src/services/runtimes/engine-manager';
import { vramScheduler } from '../../src/services/vram-scheduler';

const helper = path.resolve(process.cwd(), 'tests/helpers/fake-llama-server.mjs');

describe('v1 queued llama chat', () => {
  let h: Harness | null = null;
  let prevHome = '';
  let prevLlama = '';
  let home = '';

  beforeAll(async () => {
    prevHome = process.env.OMNI_HOME || '';
    prevLlama = process.env.OMNI_LLAMA_SERVER || '';
    home = fs.mkdtempSync(path.join(os.tmpdir(), 'ysk-omni-qllama-'));
    const binDir = path.join(home, 'bin');
    fs.mkdirSync(binDir, { recursive: true });
    const bin = path.join(binDir, 'llama-server');
    fs.copyFileSync(helper, bin);
    fs.chmodSync(bin, 0o755);
    const gguf = path.join(home, 'model.gguf');
    fs.writeFileSync(gguf, 'GGUF');
    process.env.OMNI_HOME = home;
    process.env.OMNI_LLAMA_SERVER = bin;
    const id = 'test/queued-gguf:Q4_K_M';
    upsertEntry(
      {
        id,
        repoId: 'test/queued-gguf',
        filename: 'model.gguf',
        path: gguf,
        quant: 'Q4_K_M',
        modality: 'text',
        runtime: 'llamacpp',
        vramMb: 256,
        pulledAt: new Date().toISOString(),
        sha256: '',
      },
      path.join(home, 'registry.json'),
    );

    h = await startHarness('qllama');
    if (!h) return;
    const policy = { ...defaultQueuePolicy(), enabled: true, paused: false };
    await prisma.setting.upsert({
      where: { key: SETTING_KEYS.QUEUE_POLICY },
      create: {
        key: SETTING_KEYS.QUEUE_POLICY,
        value: JSON.stringify(policy),
      },
      update: { value: JSON.stringify(policy) },
    });
    await queuePolicyService.load();
    chatWorkerService.start();
  }, 60_000);

  afterAll(async () => {
    chatWorkerService.stop();
    await engineManager.unloadAll();
    vramScheduler.reset();
    if (prevHome) process.env.OMNI_HOME = prevHome;
    else delete process.env.OMNI_HOME;
    if (prevLlama) process.env.OMNI_LLAMA_SERVER = prevLlama;
    else delete process.env.OMNI_LLAMA_SERVER;
    await stopHarness(h);
    if (home) fs.rmSync(home, { recursive: true, force: true });
  });

  it('POST /v1/chat/completions goes through the queue to llama-server', async () => {
    if (!h) return;
    const res = await apiFetch(h.baseUrl, '/v1/chat/completions', {
      method: 'POST',
      key: h.adminKey,
      body: {
        model: 'test/queued-gguf:Q4_K_M',
        messages: [{ role: 'user', content: 'hi' }],
      },
    });
    expect(res.status).toBe(200);
    const body = res.json as {
      object: string;
      choices: Array<{ message?: { content?: string | null } }>;
    };
    expect(body.object).toBe('chat.completion');
    expect(body.choices[0]?.message?.content).toBe('llama-proxy-ok');
  });

  it('queued stream writes llama SSE after the queue event', async () => {
    if (!h) return;
    const res = await apiFetch(h.baseUrl, '/v1/chat/completions', {
      method: 'POST',
      key: h.adminKey,
      body: {
        model: 'test/queued-gguf:Q4_K_M',
        stream: true,
        messages: [{ role: 'user', content: 'hi' }],
      },
    });
    expect(res.status).toBe(200);
    expect(res.text).toContain('gog.queue');
    expect(res.text).not.toContain('queue_error');
    expect(res.text).toContain('llama-proxy-ok');
    expect(res.text).toContain('chat.completion.chunk');
  });
});
