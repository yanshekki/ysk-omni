import { describe, expect, it } from 'vitest';
import {
  BUILTIN_USABLE_MODELS,
  buildUsableCatalog,
  orderModelIds,
  preferredChatModel,
} from '../../src/services/models.service';

describe('model list order', () => {
  it('puts loaded GGUFs first and echo last', () => {
    const ids = orderModelIds({
      echoId: 'echo',
      registryIds: ['echo', 'org/a:Q4', 'org/b:Q4'],
      loadedIds: ['org/b:Q4'],
    });
    expect(ids[0]).toBe('org/b:Q4');
    expect(ids[ids.length - 1]).toBe('echo');
    expect(ids.filter((id) => id === 'echo')).toHaveLength(1);
  });

  it('prefers a loaded/registry id over echo', () => {
    expect(preferredChatModel(['org/a:Q2', 'echo'], 'echo')).toBe('org/a:Q2');
    expect(preferredChatModel(['echo'], 'echo')).toBe('echo');
  });

  it('usable catalog lists registry, builtins, echo last', () => {
    const rows = buildUsableCatalog({
      echoId: 'echo',
      registry: [
        {
          id: 'stabilityai/sdxl-turbo',
          modality: 'image',
          runtime: 'diffusion',
        },
      ],
      loaded: [{ id: 'org/a:Q4', kind: 'llamacpp' }],
    });
    const ids = rows.map((r) => r.id);
    expect(ids[0]).toBe('org/a:Q4');
    expect(ids).toContain('stabilityai/sdxl-turbo');
    expect(ids).toContain('piper/lessac-high');
    expect(ids).toContain('tts-1');
    expect(ids).toContain('whisper-1');
    expect(ids[ids.length - 1]).toBe('echo');
    expect(rows.find((r) => r.id === 'piper/lessac-high')?.modality).toBe(
      'tts',
    );
    expect(BUILTIN_USABLE_MODELS.some((b) => b.id === 'tts-1')).toBe(true);
  });
});
