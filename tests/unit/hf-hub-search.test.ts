import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  buildHubSearchUrl,
  classifyHubModel,
  HUB_POPULAR_LIMIT,
  keepRunnableHits,
  loadPopularCache,
  parseLinkCursor,
  parseParamBillions,
  estimateDiskVram,
  savePopularCache,
} from '../../src/services/hf/hub-search';

describe('Hugging Face Hub search helpers', () => {
  it('classifies GGUF text-generation as llamacpp', () => {
    const hit = classifyHubModel({
      id: 'Qwen/Qwen2.5-7B-Instruct-GGUF',
      pipeline_tag: 'text-generation',
      tags: ['gguf', 'qwen'],
      downloads: 10,
    });
    expect(hit.runtime).toBe('llamacpp');
    expect(hit.modality).toBe('text');
    expect(hit.supported).toBe(true);
    expect(hit.paramsB).toBe(7);
    expect(hit.sizeMb).toBeGreaterThan(3000);
    expect(hit.vramMb).toBeGreaterThan(hit.sizeMb);
  });

  it('parses parameter counts and estimates Q4 disk/VRAM', () => {
    expect(parseParamBillions('unsloth/Qwen3-Coder-30B-A3B-Instruct-GGUF')).toBe(30);
    expect(parseParamBillions('unsloth/Qwen3.8-27B-GGUF')).toBe(27);
    expect(parseParamBillions('Qwen/Qwen3-0.6B')).toBe(0.6);
    const est = estimateDiskVram('unsloth/Qwen3-Coder-30B-A3B-Instruct-GGUF', 'llamacpp');
    expect(est.sizeLabel).toBe('Q4_K_M est.');
    expect(est.sizeMb).toBeGreaterThan(10000);
    expect(est.vramMb).toBeGreaterThan(est.sizeMb);
  });

  it('classifies diffusion image models', () => {
    const hit = classifyHubModel({
      id: 'stabilityai/sdxl',
      pipeline_tag: 'text-to-image',
      tags: ['diffusers'],
    });
    expect(hit.runtime).toBe('diffusion');
    expect(hit.modality).toBe('image');
  });

  it('marks unknown pipelines unsupported', () => {
    const hit = classifyHubModel({
      id: 'org/mystery',
      pipeline_tag: 'feature-extraction',
      tags: [],
    });
    expect(hit.runtime).toBe('unknown');
    expect(hit.supported).toBe(false);
  });

  it('drops unsupported hits from Hub lists', () => {
    const kept = keepRunnableHits([
      classifyHubModel({
        id: 'Qwen/Qwen3-VL-8B-Instruct',
        pipeline_tag: 'image-text-to-text',
        tags: [],
      }),
      classifyHubModel({
        id: 'unsloth/Qwen3-Coder-30B-A3B-Instruct-GGUF',
        pipeline_tag: 'text-generation',
        tags: ['gguf'],
      }),
    ]);
    expect(kept.map((h) => h.id)).toEqual([
      'unsloth/Qwen3-Coder-30B-A3B-Instruct-GGUF',
    ]);
  });

  it('builds Hub REST URLs (no RSS)', () => {
    const gguf = buildHubSearchUrl({ modality: 'text', limit: 24 });
    expect(gguf).toContain('huggingface.co/api/models');
    expect(gguf).toContain('filter=gguf');
    expect(gguf).toContain('sort=downloads');
    const q = buildHubSearchUrl({ q: 'flux', modality: 'image' });
    expect(q).toContain('search=flux');
    expect(q).toContain('pipeline_tag=text-to-image');
  });

  it('parses Link rel=next cursor', () => {
    const link =
      '<https://huggingface.co/api/models?limit=3&cursor=abc123>; rel="next"';
    expect(parseLinkCursor(link)).toBe('abc123');
    expect(parseLinkCursor(null)).toBeNull();
  });

  it('requests 50 GGUF by downloads for popular sync', () => {
    const url = buildHubSearchUrl({ modality: 'text', limit: HUB_POPULAR_LIMIT });
    expect(url).toContain('limit=50');
    expect(url).toContain('filter=gguf');
    expect(url).toContain('sort=downloads');
  });

  it('persists popular metadata without model files', () => {
    const prev = process.env.OMNI_HOME;
    const home = fs.mkdtempSync(path.join(os.tmpdir(), 'ysk-omni-pop-'));
    process.env.OMNI_HOME = home;
    try {
      const cache = savePopularCache([
        {
          id: 'Qwen/demo-GGUF',
          pipelineTag: 'text-generation',
          downloads: 9,
          likes: 1,
          tags: ['gguf'],
          modality: 'text',
          runtime: 'llamacpp',
          supported: true,
          vramMb: 4096,
          sizeMb: 400,
          paramsB: 0.5,
          sizeLabel: 'Q4_K_M est.',
        },
      ]);
      expect(cache.hits).toHaveLength(1);
      expect(loadPopularCache()?.hits[0]?.id).toBe('Qwen/demo-GGUF');
      expect(fs.existsSync(path.join(home, 'models'))).toBe(false);
    } finally {
      if (prev === undefined) delete process.env.OMNI_HOME;
      else process.env.OMNI_HOME = prev;
      fs.rmSync(home, { recursive: true, force: true });
    }
  });
});
