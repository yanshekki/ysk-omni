import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { afterEach, describe, expect, it } from 'vitest';
import {
  recordPullIfOk,
  sha256File,
  shouldRecordPull,
} from '../../src/services/hf/record-pull';
import { loadRegistry } from '../../src/services/hf/registry';

describe('recordPullIfOk', () => {
  const dirs: string[] = [];
  afterEach(() => {
    for (const d of dirs.splice(0)) fs.rmSync(d, { recursive: true, force: true });
  });

  it('hashes a pulled file and writes sha256', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ysk-omni-rec-'));
    dirs.push(dir);
    const file = path.join(dir, 'w.gguf');
    fs.writeFileSync(file, 'gguf-bytes');
    const want = crypto.createHash('sha256').update('gguf-bytes').digest('hex');
    expect(sha256File(file)).toBe(want);
    const entry = recordPullIfOk(
      'Org/Repo:Q4_K_M',
      { status: 'done', model: 'Org/Repo:Q4_K_M', file: 'w.gguf', path: file },
      path.join(dir, 'registry.json'),
    );
    expect(entry?.sha256).toBe(want);
    expect(loadRegistry(path.join(dir, 'registry.json')).models).toHaveLength(1);
  });

  it('does not record Hub list failures', () => {
    expect(
      shouldRecordPull({
        status: 'skipped',
        model: 'x/y',
        reason: 'Hugging Face list failed: HF 401',
      }),
    ).toBe(false);
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ysk-omni-rec-'));
    dirs.push(dir);
    const entry = recordPullIfOk(
      'x/y',
      {
        status: 'skipped',
        model: 'x/y',
        reason: 'Hugging Face list failed: HF 401',
      },
      path.join(dir, 'registry.json'),
    );
    expect(entry).toBeNull();
    expect(loadRegistry(path.join(dir, 'registry.json')).models).toHaveLength(0);
  });

  it('records a faster-whisper snapshot directory as whisper/stt', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ysk-omni-rec-'));
    dirs.push(dir);
    const snap = path.join(dir, 'Systran__faster-whisper-tiny');
    fs.mkdirSync(snap);
    fs.writeFileSync(path.join(snap, 'model.bin'), 'ctranslate2');
    fs.writeFileSync(path.join(snap, 'config.json'), '{}');
    fs.writeFileSync(path.join(snap, 'tokenizer.json'), '{}');
    const entry = recordPullIfOk(
      'Systran/faster-whisper-tiny',
      {
        status: 'done',
        model: 'Systran/faster-whisper-tiny',
        file: 'model.bin',
        path: snap,
      },
      path.join(dir, 'registry.json'),
    );
    expect(entry?.runtime).toBe('whisper');
    expect(entry?.modality).toBe('stt');
    expect(entry?.path).toBe(snap);
  });

  it('does not record repos with no GGUF file', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ysk-omni-rec-'));
    dirs.push(dir);
    const entry = recordPullIfOk(
      'Qwen/Qwen2.5-7B-Instruct',
      {
        status: 'skipped',
        model: 'Qwen/Qwen2.5-7B-Instruct',
        reason: 'no GGUF file in repo',
      },
      path.join(dir, 'registry.json'),
    );
    expect(entry).toBeNull();
    expect(loadRegistry(path.join(dir, 'registry.json')).models).toHaveLength(0);
  });
});
