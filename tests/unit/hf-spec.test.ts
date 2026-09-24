import { describe, expect, it } from 'vitest';
import {
  parseHfSpec,
  pickGgufFile,
  pickPullFiles,
  inferRuntimeFromFilenames,
  listQuants,
} from '../../src/services/hf/spec';
import { encodeRepoId } from '../../src/services/hf/client';

describe('parseHfSpec', () => {
  it('parses org/repo', () => {
    expect(parseHfSpec('Qwen/Qwen2.5-0.5B-Instruct-GGUF')).toEqual({
      repoId: 'Qwen/Qwen2.5-0.5B-Instruct-GGUF',
    });
  });

  it('parses org/repo:Q4_K_M', () => {
    expect(parseHfSpec('Qwen/Qwen2.5-0.5B-Instruct-GGUF:Q4_K_M')).toEqual({
      repoId: 'Qwen/Qwen2.5-0.5B-Instruct-GGUF',
      quant: 'Q4_K_M',
    });
  });

  it('parses hf.co/org/repo:quant', () => {
    expect(parseHfSpec('hf.co/Qwen/Qwen2.5-7B-Instruct:Q8_0')).toEqual({
      repoId: 'Qwen/Qwen2.5-7B-Instruct',
      quant: 'Q8_0',
    });
  });
});

describe('encodeRepoId', () => {
  it('keeps the slash between org and repo', () => {
    expect(encodeRepoId('Qwen/Qwen2.5-0.5B-Instruct-GGUF')).toBe(
      'Qwen/Qwen2.5-0.5B-Instruct-GGUF',
    );
    expect(encodeRepoId('Qwen/Qwen2.5-0.5B-Instruct-GGUF')).not.toContain('%2F');
  });
});

describe('pickGgufFile', () => {
  const files = [
    { path: 'model-Q5_K_M.gguf' },
    { path: 'model-Q4_K_M.gguf' },
    { path: 'model-Q8_0.gguf' },
    { path: 'config.json' },
  ];

  it('prefers Q4_K_M when no quant given', () => {
    expect(pickGgufFile(files)?.quant).toBe('Q4_K_M');
    expect(pickGgufFile(files)?.path).toBe('model-Q4_K_M.gguf');
  });

  it('honors requested quant', () => {
    expect(pickGgufFile(files, 'Q8_0')?.path).toBe('model-Q8_0.gguf');
  });

  it('lists unique quants', () => {
    expect(listQuants(files)).toEqual(['Q5_K_M', 'Q4_K_M', 'Q8_0']);
  });
});

describe('pickPullFiles / inferRuntimeFromFilenames', () => {
  it('keeps GGUF when present', () => {
    const picked = pickPullFiles([
      { path: 'model-Q4_K_M.gguf', size: 100 },
      { path: 'config.json', size: 10 },
    ]);
    expect(picked).toEqual([{ path: 'model-Q4_K_M.gguf', size: 100 }]);
  });

  it('snapshots faster-whisper weights', () => {
    const picked = pickPullFiles([
      { path: 'README.md', size: 10 },
      { path: 'model.bin', size: 75_000_000 },
      { path: 'tokenizer.json', size: 2000 },
      { path: 'vocabulary.txt', size: 500 },
      { path: 'config.json', size: 80 },
    ]);
    expect(picked.map((f) => f.path).sort()).toEqual([
      'config.json',
      'model.bin',
      'tokenizer.json',
      'vocabulary.txt',
    ]);
    expect(
      inferRuntimeFromFilenames('Systran/faster-whisper-tiny', picked.map((f) => f.path))
        .runtime,
    ).toBe('whisper');
  });

  it('snapshots tiny-sd diffusion files', () => {
    const names = [
      'model_index.json',
      'unet/diffusion_pytorch_model.bin',
      'text_encoder/pytorch_model.bin',
      'vae/config.json',
      'grid_tiny.png',
    ];
    const picked = pickPullFiles(names.map((path) => ({ path, size: 100 })));
    expect(picked.some((f) => f.path === 'model_index.json')).toBe(true);
    expect(picked.some((f) => f.path.endsWith('.png'))).toBe(false);
    expect(inferRuntimeFromFilenames('segmind/tiny-sd', names).runtime).toBe(
      'diffusion',
    );
  });

  it('drops SDXL root safetensors dumps when unet/ exists', () => {
    const picked = pickPullFiles([
      { path: 'model_index.json', size: 100 },
      { path: 'sd_xl_turbo_1.0_fp16.safetensors', size: 6_900_000_000 },
      { path: 'unet/diffusion_pytorch_model.fp16.safetensors', size: 5_000_000_000 },
      { path: 'text_encoder/model.fp16.safetensors', size: 200_000_000 },
    ]);
    expect(picked.some((f) => f.path.startsWith('sd_xl'))).toBe(false);
    expect(picked.some((f) => f.path.startsWith('unet/'))).toBe(true);
  });
});
