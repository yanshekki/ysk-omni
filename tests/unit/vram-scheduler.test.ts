import { describe, expect, it } from 'vitest';
import { planFit, usedVram, type LoadedModel } from '../../src/services/vram-scheduler';

function m(
  id: string,
  vramMb: number,
  lastUsedAt: number,
): LoadedModel {
  return { id, vramMb, lastUsedAt };
}

describe('vram planFit', () => {
  it('unloads LRU when the next job does not fit', () => {
    const loaded = [m('a', 8000, 1), m('b', 8000, 2), m('c', 4000, 3)];
    const plan = planFit(loaded, { id: 'd', vramMb: 10000 }, 24000);
    expect(plan.accept).toBe(true);
    expect(plan.unload).toEqual(['a']);
    expect(plan.usedMb).toBe(8000 + 4000 + 10000);
  });

  it('unloads every model for an exclusive video job', () => {
    const loaded = [m('a', 8000, 1), m('b', 8000, 2)];
    const plan = planFit(loaded, { id: 'vid', vramMb: 12000, exclusive: true }, 24000);
    expect(plan.accept).toBe(true);
    expect(plan.unload.sort()).toEqual(['a', 'b']);
    expect(plan.usedMb).toBe(12000);
  });

  it('rejects when even an empty GPU cannot fit', () => {
    const plan = planFit([], { id: 'huge', vramMb: 48000 }, 24000);
    expect(plan.accept).toBe(false);
    expect(usedVram([])).toBe(0);
  });
});
