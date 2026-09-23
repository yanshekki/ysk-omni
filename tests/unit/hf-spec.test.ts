import { describe, expect, it } from 'vitest';
import {
  parseHfSpec,
  pickGgufFile,
  listQuants,
} from '../../src/services/hf/spec';

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
