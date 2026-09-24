import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  chatLlamaServer,
  llamaGpuLayers,
  llamaServerArgs,
  llamaServerBin,
} from '../../src/services/runtimes/llama-server';
import {
  engineManager,
  readEnginesState,
} from '../../src/services/runtimes/engine-manager';
import { findEntry, upsertEntry } from '../../src/services/hf/registry';
import { vramScheduler } from '../../src/services/vram-scheduler';

const helper = path.resolve(process.cwd(), 'tests/helpers/fake-llama-server.mjs');

describe('llama-server spawn/proxy', () => {
  const dirs: string[] = [];
  let prevPath = '';
  let prevHome = '';
  let prevOverride = '';
  let prevGpu = '';

  beforeEach(() => {
    prevPath = process.env.PATH || '';
    prevHome = process.env.OMNI_HOME || '';
    prevOverride = process.env.OMNI_LLAMA_SERVER || '';
    prevGpu = process.env.OMNI_LLAMA_N_GPU_LAYERS || '';
  });

  afterEach(async () => {
    await engineManager.unloadAll();
    vramScheduler.reset();
    process.env.PATH = prevPath;
    if (prevHome) process.env.OMNI_HOME = prevHome;
    else delete process.env.OMNI_HOME;
    if (prevOverride) process.env.OMNI_LLAMA_SERVER = prevOverride;
    else delete process.env.OMNI_LLAMA_SERVER;
    if (prevGpu) process.env.OMNI_LLAMA_N_GPU_LAYERS = prevGpu;
    else delete process.env.OMNI_LLAMA_N_GPU_LAYERS;
    for (const d of dirs.splice(0)) {
      fs.rmSync(d, { recursive: true, force: true });
    }
  });

  function installFakeBin(): { bin: string; home: string; gguf: string } {
    const home = fs.mkdtempSync(path.join(os.tmpdir(), 'ysk-omni-llama-'));
    dirs.push(home);
    const binDir = path.join(home, 'bin');
    fs.mkdirSync(binDir, { recursive: true });
    const bin = path.join(binDir, 'llama-server');
    fs.copyFileSync(helper, bin);
    fs.chmodSync(bin, 0o755);
    const gguf = path.join(home, 'model.gguf');
    fs.writeFileSync(gguf, 'GGUF');
    process.env.PATH = `${binDir}${path.delimiter}${prevPath}`;
    process.env.OMNI_HOME = home;
    process.env.OMNI_LLAMA_SERVER = bin;
    return { bin, home, gguf };
  }

  it('llamaServerBin finds the binary on PATH / OMNI_LLAMA_SERVER', () => {
    const { bin } = installFakeBin();
    expect(llamaServerBin()).toBe(bin);
  });

  it('llamaServerArgs includes --n-gpu-layers from env (default -1)', () => {
    delete process.env.OMNI_LLAMA_N_GPU_LAYERS;
    expect(llamaGpuLayers()).toBe(-1);
    const args = llamaServerArgs('/tmp/model.gguf', 19001);
    expect(args).toContain('--n-gpu-layers');
    expect(args[args.indexOf('--n-gpu-layers') + 1]).toBe('-1');
    process.env.OMNI_LLAMA_N_GPU_LAYERS = '0';
    expect(llamaGpuLayers()).toBe(0);
    expect(llamaServerArgs('/tmp/model.gguf', 19001)).toContain('0');
  });

  it('chatLlamaServer spawns the binary and proxies OpenAI chat JSON', async () => {
    const { gguf } = installFakeBin();
    const out = await chatLlamaServer({
      modelPath: gguf,
      model: 'local-gguf',
      messages: [{ role: 'user', content: 'hi' }],
    });
    expect(out?.object).toBe('chat.completion');
    expect(out?.choices[0]?.message?.content).toBe('llama-proxy-ok');
  });

  it('engineManager keeps llama-server running across two chats', async () => {
    const { home, gguf } = installFakeBin();
    const id = 'test/tiny-gguf:Q4_K_M';
    upsertEntry(
      {
        id,
        repoId: 'test/tiny-gguf',
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
    const first = await engineManager.chatJson(id, [{ role: 'user', content: 'hi' }]);
    const port = engineManager.get(id)?.port;
    const second = await engineManager.chatJson(id, [{ role: 'user', content: 'again' }]);
    expect(first.choices[0]?.message?.content).toBe('llama-proxy-ok');
    expect(second.choices[0]?.message?.content).toBe('llama-proxy-ok');
    expect(engineManager.get(id)?.port).toBe(port);
    expect(engineManager.list()).toHaveLength(1);
    const st = readEnginesState();
    expect(st.loaded.some((e) => e.id === id && (e.pid || 0) > 0)).toBe(true);
  });

  it('chatStream proxies SSE tokens from llama-server', async () => {
    const { home, gguf } = installFakeBin();
    const id = 'test/tiny-gguf:Q4_K_M';
    upsertEntry(
      {
        id,
        repoId: 'test/tiny-gguf',
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
    const res = await engineManager.chatStream(id, [{ role: 'user', content: 'hi' }]);
    const text = await res.text();
    expect(text).toContain('llama-proxy-ok');
    expect(text).toContain('chat.completion.chunk');
  });

  it('loadGguf errors when llama-server is missing', async () => {
    const home = fs.mkdtempSync(path.join(os.tmpdir(), 'ysk-omni-nollama-'));
    dirs.push(home);
    process.env.OMNI_HOME = home;
    delete process.env.OMNI_LLAMA_SERVER;
    process.env.PATH = '/usr/bin';
    const gguf = path.join(home, 'model.gguf');
    fs.writeFileSync(gguf, 'GGUF');
    const id = 'test/missing-bin:Q4_K_M';
    const entry = {
      id,
      repoId: 'test/missing-bin',
      filename: 'model.gguf',
      path: gguf,
      quant: 'Q4_K_M',
      modality: 'text' as const,
      runtime: 'llamacpp' as const,
      vramMb: 256,
      pulledAt: new Date().toISOString(),
      sha256: '',
    };
    upsertEntry(entry, path.join(home, 'registry.json'));
    await expect(engineManager.loadGguf(entry)).rejects.toMatchObject({
      code: 'engine_unconfigured',
    });
  });

  it('engineManager.unload kills the process', async () => {
    const { home, gguf } = installFakeBin();
    const id = 'test/tiny-gguf:Q4_K_M';
    upsertEntry(
      {
        id,
        repoId: 'test/tiny-gguf',
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
    await engineManager.loadGguf(findEntry(id)!);
    expect(engineManager.list()).toHaveLength(1);
    await engineManager.unload(id);
    expect(engineManager.list()).toHaveLength(0);
  });
});

