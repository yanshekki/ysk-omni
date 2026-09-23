import { describe, expect, it } from 'vitest';
import { createChatCompletionSchema } from '../../src/dto/chat.dto';
import {
  flattenMessageContent,
  messageHasImageParts,
} from '../../src/utils/message-content';

describe('createChatCompletionSchema', () => {
  it('accepts minimal valid body', () => {
    const parsed = createChatCompletionSchema.parse({
      messages: [{ role: 'user', content: 'hi' }],
    });
    expect(parsed.stream).toBe(false);
    expect(parsed.messages[0]?.content).toBe('hi');
  });

  it('preserves array content parts for vision path (flatten later)', () => {
    const parts = [
      { type: 'text', text: 'hello' },
      { type: 'text', text: 'world' },
    ];
    const parsed = createChatCompletionSchema.parse({
      messages: [
        {
          role: 'user',
          content: parts,
        },
      ],
    });
    expect(Array.isArray(parsed.messages[0]?.content)).toBe(true);
    const flat = flattenMessageContent(
      parsed.messages[0]?.content as Array<Record<string, unknown>>,
    );
    expect(flat).toContain('hello');
    expect(flat).toContain('world');
  });

  it('detects image parts for feature gate', () => {
    expect(
      messageHasImageParts([
        { type: 'text', text: 'see' },
        { type: 'image_url', image_url: { url: 'data:image/png;base64,xx' } },
      ]),
    ).toBe(true);
    expect(messageHasImageParts([{ type: 'text', text: 'no' }])).toBe(false);
  });

  it('rejects empty messages', () => {
    expect(() => createChatCompletionSchema.parse({ messages: [] })).toThrow();
  });

  it('accepts document_ids and session_id extensions', () => {
    const parsed = createChatCompletionSchema.parse({
      messages: [{ role: 'user', content: 'x' }],
      session_id: 'abc',
      document_ids: ['550e8400-e29b-41d4-a716-446655440000'],
    });
    expect(parsed.session_id).toBe('abc');
    expect(parsed.document_ids).toHaveLength(1);
  });

  it('defaults include_reasoning to true', () => {
    const parsed = createChatCompletionSchema.parse({
      messages: [{ role: 'user', content: 'x' }],
    });
    expect(parsed.include_reasoning).toBe(true);
  });

  it('allows disabling include_reasoning', () => {
    const parsed = createChatCompletionSchema.parse({
      messages: [{ role: 'user', content: 'x' }],
      include_reasoning: false,
    });
    expect(parsed.include_reasoning).toBe(false);
  });
});
