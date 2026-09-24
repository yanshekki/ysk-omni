import { describe, expect, it } from 'vitest';
import {
  isSessionAlreadyExistsError,
  isUuid,
  namespacedEngineSessionId,
  resolveEngineSessionBinding,
  uuidV5,
} from '../../src/utils/engine-session';

describe('engine-session', () => {
  it('uuidV5 is stable and RFC version 5', () => {
    const a = uuidV5('ysk-omni:key:chat-1');
    const b = uuidV5('ysk-omni:key:chat-1');
    expect(a).toBe(b);
    expect(isUuid(a)).toBe(true);
    expect(a.charAt(14)).toBe('5');
  });

  it('namespaces per API key', () => {
    const one = namespacedEngineSessionId('key-a', 'room');
    const two = namespacedEngineSessionId('key-b', 'room');
    expect(one).not.toBe(two);
    expect(isUuid(one)).toBe(true);
    expect(one.startsWith('gog_')).toBe(false);
  });

  it('creates on first bind and resumes when known', () => {
    const created = resolveEngineSessionBinding({
      apiKeyId: 'key-a',
      clientSessionId: 'room',
    });
    expect(created.mode).toBe('create');
    expect(isUuid(created.engineSessionId)).toBe(true);

    const resumed = resolveEngineSessionBinding({
      apiKeyId: 'key-a',
      clientSessionId: 'room',
      knownEngineSessionId: created.engineSessionId,
    });
    expect(resumed.mode).toBe('resume');
    expect(resumed.engineSessionId).toBe(created.engineSessionId);
  });

  it('resumes when client sends back the Grok UUID', () => {
    const grokId = namespacedEngineSessionId('key-a', 'room');
    const r = resolveEngineSessionBinding({
      apiKeyId: 'key-a',
      clientSessionId: grokId,
      knownByEngineId: grokId,
    });
    expect(r.mode).toBe('resume');
    expect(r.engineSessionId).toBe(grokId);
  });

  it('detects already-exists errors from stderr details', () => {
    expect(isSessionAlreadyExistsError('already in use')).toBe(true);
    expect(
      isSessionAlreadyExistsError({
        message: 'local engine exited with code 1',
        details: { stderr: 'Error: session must not already exist' },
      }),
    ).toBe(true);
    expect(isSessionAlreadyExistsError('timeout')).toBe(false);
  });
});
