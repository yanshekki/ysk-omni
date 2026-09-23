import { describe, expect, it } from 'vitest';
import {
  apiKeyPrefix,
  createApiKeySecret,
  createChatCompletionId,
  createId,
  createRequestId,
} from '../../src/utils/id';

describe('id utils', () => {
  it('creates uuid-like ids', () => {
    expect(createId()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
  });

  it('creates request and completion ids with prefixes', () => {
    expect(createRequestId().startsWith('req_')).toBe(true);
    expect(createChatCompletionId().startsWith('chatcmpl_')).toBe(true);
  });

  it('creates api keys with prefix', () => {
    const key = createApiKeySecret();
    expect(key.startsWith('gk_live_')).toBe(true);
    expect(apiKeyPrefix(key)).toBe(key.slice(0, 16));
  });
});
