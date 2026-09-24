import { describe, expect, it } from 'vitest';
import {
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
});
