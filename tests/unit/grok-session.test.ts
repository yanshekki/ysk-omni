import { describe, expect, it } from 'vitest';
import {
  isSessionAlreadyExistsError,
  isUuid,
  namespacedGrokSessionId,
  resolveGrokSessionBinding,
  uuidV5,
} from '../../src/utils/grok-session';

describe('grok-session', () => {
  it('uuidV5 is stable and RFC version 5', () => {
    const a = uuidV5('gctoac:key:chat-1');
    const b = uuidV5('gctoac:key:chat-1');
    expect(a).toBe(b);
    expect(isUuid(a)).toBe(true);
    expect(a.charAt(14)).toBe('5');
  });

  it('namespaces per API key', () => {
    const one = namespacedGrokSessionId('key-a', 'room');
    const two = namespacedGrokSessionId('key-b', 'room');
    expect(one).not.toBe(two);
    expect(isUuid(one)).toBe(true);
    expect(one.startsWith('gog_')).toBe(false);
  });

  it('creates on first bind and resumes when known', () => {
    const created = resolveGrokSessionBinding({
      apiKeyId: 'key-a',
      clientSessionId: 'room',
    });
    expect(created.mode).toBe('create');
    expect(isUuid(created.grokSessionId)).toBe(true);

    const resumed = resolveGrokSessionBinding({
      apiKeyId: 'key-a',
      clientSessionId: 'room',
      knownGrokSessionId: created.grokSessionId,
    });
    expect(resumed.mode).toBe('resume');
    expect(resumed.grokSessionId).toBe(created.grokSessionId);
  });

  it('resumes when client sends back the Grok UUID', () => {
    const grokId = namespacedGrokSessionId('key-a', 'room');
    const r = resolveGrokSessionBinding({
      apiKeyId: 'key-a',
      clientSessionId: grokId,
      knownByGrokId: grokId,
    });
    expect(r.mode).toBe('resume');
    expect(r.grokSessionId).toBe(grokId);
  });

  it('detects already-exists errors from stderr details', () => {
    expect(isSessionAlreadyExistsError('already in use')).toBe(true);
    expect(
      isSessionAlreadyExistsError({
        message: 'Grok CLI exited with code 1',
        details: { stderr: 'Error: session must not already exist' },
      }),
    ).toBe(true);
    expect(isSessionAlreadyExistsError('timeout')).toBe(false);
  });
});
