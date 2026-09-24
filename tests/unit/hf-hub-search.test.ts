import { describe, expect, it } from 'vitest';
import {
  buildHubSearchUrl,
  classifyHubModel,
  parseLinkCursor,
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
});
