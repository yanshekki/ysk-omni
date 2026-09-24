import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { engineManager } from '../../src/services/runtimes/engine-manager';
import { resolveVllmLaunch } from '../../src/services/runtimes/vllm';
import { upsertEntry } from '../../src/services/hf/registry';
import { vramScheduler } from '../../src/services/vram-scheduler';

const helper = path.resolve(process.cwd(), 'tests/helpers/fake-vllm-server.mjs');

describe('vllm persistent engine', () => {
  const dirs: string[] = [];
  let prevPath = '';
  let prevHome = '';
  let prevOverride = '';
  let prevModule = '';

  beforeEach(() => {
    prevPath = process.env.PATH || '';
    prevHome = process.env.OMNI_HOME || '';
    prevOverride = process.env.OMNI_VLLM || '';
    prevModule = process.env.OMNI_VLLM_MODULE || '';
  });

  afterEach(async () => {
    await engineManager.unloadAll();
    vramScheduler.reset();
    process.env.PATH = prevPath;
    if (prevHome) process.env.OMNI_HOME = prevHome;
    else delete process.env.OMNI_HOME;
    if (prevOverride) process.env.OMNI_VLLM = prevOverride;
    else delete process.env.OMNI_VLLM;
    if (prevModule) process.env.OMNI_VLLM_MODULE = prevModule;
    else delete process.env.OMNI_VLLM_MODULE;
    for (const d of dirs.splice(0)) fs.rmSync(d, { recursive: true, force: true });
  });

  it('loadVllm serves OpenAI chat JSON', async () => {
    const home = fs.mkdtempSync(path.join(os.tmpdir(), 'ysk-omni-vllm-'));
    dirs.push(home);
    const binDir = path.join(home, 'bin');
    fs.mkdirSync(binDir, { recursive: true });
    const bin = path.join(binDir, 'vllm');
    fs.copyFileSync(helper, bin);
    fs.chmodSync(bin, 0o755);
    process.env.PATH = `${binDir}${path.delimiter}${prevPath}`;
    process.env.OMNI_HOME = home;
    process.env.OMNI_VLLM = bin;
    const id = 'Qwen/Qwen2.5-7B-Instruct';
    upsertEntry(
      {
        id,
        repoId: id,
        filename: '',
        path: '',
        quant: '',
        modality: 'text',
        runtime: 'vllm',
        vramMb: 16000,
        pulledAt: new Date().toISOString(),
        sha256: '',
      },
      path.join(home, 'registry.json'),
    );
    const out = await engineManager.chatJson(id, [{ role: 'user', content: 'hi' }]);
    expect(out.choices[0]?.message?.content).toBe('vllm-proxy-ok');
    expect(engineManager.list()[0]?.kind).toBe('vllm');
  });

  it('resolveVllmLaunch uses vllm serve for a vllm binary', () => {
    process.env.OMNI_VLLM = '/opt/vllm/bin/vllm';
    delete process.env.OMNI_VLLM_MODULE;
    const launch = resolveVllmLaunch('Qwen/Qwen2.5-7B-Instruct', 20042);
    expect(launch.command).toBe('/opt/vllm/bin/vllm');
    expect(launch.args).toEqual([
      'serve',
      'Qwen/Qwen2.5-7B-Instruct',
      '--host',
      '127.0.0.1',
      '--port',
      '20042',
    ]);
  });

  it('resolveVllmLaunch uses python -m OpenAI API server for a python binary', () => {
    process.env.OMNI_VLLM = '/usr/bin/python3';
    const launch = resolveVllmLaunch('Qwen/Qwen2.5-7B-Instruct', 20043);
    expect(launch.command).toBe('/usr/bin/python3');
    expect(launch.args).toEqual([
      '-m',
      'vllm.entrypoints.openai.api_server',
      '--model',
      'Qwen/Qwen2.5-7B-Instruct',
      '--host',
      '127.0.0.1',
      '--port',
      '20043',
    ]);
  });

  it('OMNI_VLLM_MODULE=1 forces the python module argv on a vllm binary', () => {
    process.env.OMNI_VLLM = '/opt/vllm/bin/vllm';
    process.env.OMNI_VLLM_MODULE = '1';
    const launch = resolveVllmLaunch('org/repo', 20044);
    expect(launch.args[0]).toBe('-m');
    expect(launch.args[1]).toBe('vllm.entrypoints.openai.api_server');
  });
});
