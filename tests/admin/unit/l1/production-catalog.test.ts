import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const PACK_IDS = [
  'Qwen/Qwen2.5-0.5B-Instruct-GGUF',
  'Qwen/Qwen2.5-7B-Instruct',
  'Z-Image-Turbo',
  'FLUX.2 Klein 4B',
  'LTX-2.5',
  'Wan 2.2',
];

describe('production Admin Catalog entry', () => {
  it('public/admin/boot.js lists curated packs and Pull/Load/Unload', () => {
    const boot = fs.readFileSync(
      path.resolve(process.cwd(), 'public/admin/boot.js'),
      'utf8',
    );
    for (const id of PACK_IDS) {
      expect(boot, id).toContain(id);
    }
    expect(boot).toContain('Pull');
    expect(boot).toContain('Load');
    expect(boot).toContain('Unload');
    expect(boot).toContain('Local models');
    expect(boot).toContain('catalog-kpi-grid');
    expect(boot).toContain('data-catalog-tab');
    expect(boot).toContain('catalog/hub');
    expect(boot).toContain('Hugging Face');
    expect(boot).toContain('Sync popular');
    expect(boot).toContain('catalog/sync');
    expect(boot).toContain('catalog/rm');
    expect(boot).toContain('cat-spec');
    expect(boot).toContain('catalog-hub-stack');
    expect(boot).toContain('cat-hub-go');
    expect(boot).toContain('cat-hub-pager');
    expect(boot).toContain('data-pager');
    expect(boot).toContain('runtimes');
    expect(boot).toContain('data-nav="runtimes"');
    expect(boot).toContain('執行環境');
    expect(boot).toContain('Copy install command');
    expect(boot).toContain('data-rt-install');
    expect(boot).toContain('runtimes/install');
    expect(boot).toContain('data-rt-uninstall');
    expect(boot).toContain('runtimes/uninstall');
    expect(boot).toContain('catalog-pull-bar');
    expect(boot).toContain('cat-dl-dock');
    expect(boot).toContain('Download queue');
    expect(boot).toContain('data-mg-mode="speech"');
    expect(boot).toContain('data-mg-mode="transcribe"');
    expect(boot).toContain('piper/lessac-high');
    expect(boot).toContain('/media/speech');
    expect(boot).toContain('/media/videos');
    expect(boot).toContain('mediaBusy_image');
    expect(boot).toContain('whisper');
    expect(boot).toContain('diffusion');
    expect(boot).toContain('media/speech');
    expect(boot).toContain('media/transcribe');
    expect(boot).toContain('catalog.colSize');
    expect(boot).toContain('keys.allowedModels');
    expect(boot).toContain('data-k-model');
    expect(boot).toContain('Allowed models');
    expect(boot).toContain('可用模型');
  });
});
