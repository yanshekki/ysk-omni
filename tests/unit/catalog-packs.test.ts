import { describe, expect, it } from 'vitest';
import { loadCuratedPacks } from '../../src/catalog/curated';

describe('curated catalog packs', () => {
  it('lists required text, image, audio, and video packs', () => {
    const ids = loadCuratedPacks().map((p) => p.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        'Qwen/Qwen2.5-0.5B-Instruct-GGUF',
        'Qwen/Qwen2.5-7B-Instruct',
        'Tongyi-MAI/Z-Image-Turbo',
        'black-forest-labs/FLUX.2-klein-4B',
        'Lightricks/LTX-2.5',
        'Wan-AI/Wan2.2',
      ]),
    );
    const modalities = new Set(loadCuratedPacks().map((p) => p.modality));
    expect(modalities.has('text')).toBe(true);
    expect(modalities.has('image')).toBe(true);
    expect(modalities.has('tts') || modalities.has('stt')).toBe(true);
    expect(modalities.has('video')).toBe(true);
  });
});
