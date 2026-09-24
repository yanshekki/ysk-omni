import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { upsertEntry } from '../../src/services/hf/registry';
import { deleteLocalModel } from '../../src/services/hf/delete-local';

describe('deleteLocalModel', () => {
  const homes: string[] = [];
  afterEach(() => {
    for (const h of homes.splice(0)) {
      fs.rmSync(h, { recursive: true, force: true });
    }
    delete process.env.OMNI_HOME;
  });

  it('removes registry row and GGUF under models/', async () => {
    const home = fs.mkdtempSync(path.join(os.tmpdir(), 'ysk-omni-del-'));
    homes.push(home);
    process.env.OMNI_HOME = home;
    const models = path.join(home, 'models');
    fs.mkdirSync(models, { recursive: true });
    const gguf = path.join(models, 'demo.gguf');
    fs.writeFileSync(gguf, 'GGUF');
    upsertEntry(
      {
        id: 'demo/gguf:Q4',
        repoId: 'demo/gguf',
        filename: 'demo.gguf',
        path: gguf,
        quant: 'Q4',
        modality: 'text',
        runtime: 'llamacpp',
        vramMb: 1,
        pulledAt: new Date().toISOString(),
        sha256: '',
      },
      path.join(home, 'registry.json'),
    );
    const out = await deleteLocalModel('demo/gguf:Q4');
    expect(out.removed).toBe('demo/gguf:Q4');
    expect(out.file).toBe(gguf);
    expect(fs.existsSync(gguf)).toBe(false);
  });
});

describe('pruneMissingFiles', () => {
  it('drops registry rows without a file on disk', async () => {
    const { pruneMissingFiles, upsertEntry, loadRegistry } = await import(
      '../../src/services/hf/registry'
    );
    const fs = await import('node:fs');
    const os = await import('node:os');
    const path = await import('node:path');
    const home = fs.mkdtempSync(path.join(os.tmpdir(), 'ysk-omni-prune-'));
    process.env.OMNI_HOME = home;
    const file = path.join(home, 'registry.json');
    upsertEntry(
      {
        id: 'ghost/model',
        repoId: 'ghost/model',
        filename: '',
        path: '',
        quant: 'Q4_K_M',
        modality: 'text',
        runtime: 'vllm',
        vramMb: 0,
        pulledAt: new Date().toISOString(),
        sha256: '',
      },
      file,
    );
    const kept = pruneMissingFiles(file);
    expect(kept.models).toHaveLength(0);
    expect(loadRegistry(file).models).toHaveLength(0);
    fs.rmSync(home, { recursive: true, force: true });
  });
});
