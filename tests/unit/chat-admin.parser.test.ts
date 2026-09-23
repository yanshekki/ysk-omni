import { describe, expect, it } from 'vitest';
import { parseStoredResponse } from '../../src/services/chat-admin.service';

describe('parseStoredResponse', () => {
  it('parses plain text', () => {
    const r = parseStoredResponse('hello');
    expect(r.content).toBe('hello');
    expect(r.reasoning_content).toBeNull();
  });

  it('parses JSON with reasoning', () => {
    const r = parseStoredResponse(
      JSON.stringify({ content: 'ans', reasoning_content: 'think' }),
    );
    expect(r.content).toBe('ans');
    expect(r.reasoning_content).toBe('think');
  });
});
