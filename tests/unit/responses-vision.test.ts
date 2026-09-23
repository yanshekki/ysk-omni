import { describe, expect, it } from 'vitest';
import {
  createResponseSchema,
  extractMessagesFromResponsesInput,
} from '../../src/dto/responses.dto';

describe('Responses vision / input mapping', () => {
  it('accepts input_image as content parts', () => {
    const msgs = extractMessagesFromResponsesInput([
      {
        role: 'user',
        content: [
          { type: 'input_text', text: 'describe' },
          {
            type: 'input_image',
            image_url: 'data:image/png;base64,xxx',
          },
        ],
      },
    ]);
    expect(msgs).toHaveLength(1);
    expect(Array.isArray(msgs[0]?.content)).toBe(true);
    const parts = msgs[0]!.content as Array<Record<string, unknown>>;
    expect(parts.some((p) => p.type === 'image_url')).toBe(true);
  });

  it('schema transform keeps image parts', () => {
    const parsed = createResponseSchema.parse({
      model: 'grok-4.5',
      input: [
        {
          role: 'user',
          content: [
            { type: 'input_text', text: 'see' },
            { type: 'input_image', image_url: { url: 'https://example.com/a.png' } },
          ],
        },
      ],
    });
    expect(parsed.messages.length).toBeGreaterThan(0);
    const last = parsed.messages[parsed.messages.length - 1]!;
    expect(Array.isArray(last.content)).toBe(true);
  });
});
