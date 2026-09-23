import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  loadRegistry,
  upsertEntry,
  removeEntry,
  findEntry,
  type RegistryEntry,
} from '../../src/services/hf/registry';

describe('hf registry upsert', () => {
  const files: string[] = [];
  afterEach(() => {
    for (const f of files.splice(0)) {
      try {
        fs.rmSync(path.dirname(f), { recursive: true, force: true });
      } catch {
        /* ignore */
      }
    }
  });

  function tmpFile(): string {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ysk-omni-reg-'));
    const file = path.join(dir, 'registry.json');
    files.push(file);
    return file;
  }

  const sample = (): RegistryEntry => ({
    id: 'Qwen/Qwen2.5-0.5B-Instruct-GGUF:Q4_K_M',
    repoId: 'Qwen/Qwen2.5-0.5B-Instruct-GGUF',
    filename: 'model-Q4_K_M.gguf',
    path: '/tmp/model-Q4_K_M.gguf',
    quant: 'Q4_K_M',
    modality: 'text',
    runtime: 'llamacpp',
    vramMb: 512,
    pulledAt: '2026-01-01T00:00:00.000Z',
    sha256: 'abc',
  });

  it('inserts then updates the same id', () => {
    const file = tmpFile();
    upsertEntry(sample(), file);
    const updated = upsertEntry({ ...sample(), sha256: 'def' }, file);
    expect(updated.sha256).toBe('def');
    const loaded = loadRegistry(file);
    expect(loaded.models).toHaveLength(1);
    expect(loaded.models[0]?.sha256).toBe('def');
  });

  it('finds and removes by id', () => {
    const file = tmpFile();
    const e = sample();
    upsertEntry(e, file);
    expect(findEntry(e.id, file)?.filename).toBe(e.filename);
    expect(removeEntry(e.id, file)).toBe(true);
    expect(loadRegistry(file).models).toHaveLength(0);
  });
});
