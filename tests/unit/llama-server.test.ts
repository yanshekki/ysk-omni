import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  chatLlamaServer,
  llamaServerBin,
  tryLlamaChat,
} from '../../src/services/runtimes/llama-server';
import { upsertEntry } from '../../src/services/hf/registry';

const helper = path.resolve(process.cwd(), 'tests/helpers/fake-llama-server.mjs');

describe('llama-server spawn/proxy', () => {
  const dirs: string[] = [];
  let prevPath = '';
  let prevHome = '';
  let prevOverride = '';

  beforeEach(() => {
    prevPath = process.env.PATH || '';
    prevHome = process.env.OMNI_HOME || '';
    prevOverride = process.env.OMNI_LLAMA_SERVER || '';
  });

  afterEach(() => {
    process.env.PATH = prevPath;
    if (prevHome) process.env.OMNI_HOME = prevHome;
    else delete process.env.OMNI_HOME;
    if (prevOverride) process.env.OMNI_LLAMA_SERVER = prevOverride;
    else delete process.env.OMNI_LLAMA_SERVER;
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

  it('tryLlamaChat uses a pulled GGUF from the registry', async () => {
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
    const out = await tryLlamaChat(id, [{ role: 'user', content: 'hi' }]);
    expect(out?.choices[0]?.message?.content).toBe('llama-proxy-ok');
  });
});
