import { z } from 'zod';
import { MAX_MESSAGE_CHARS, MAX_MESSAGES } from '../config/constants';

export type ResponseMessage = {
  role: string;
  content: string | Array<Record<string, unknown>>;
};

/**
 * Extract OpenAI-style messages from Responses API `input`.
 * Images become content parts (vision path via chat builder).
 */
export function extractMessagesFromResponsesInput(
  input: string | unknown[],
  instructions?: string,
): ResponseMessage[] {
  const messages: ResponseMessage[] = [];
  if (instructions?.trim()) {
    messages.push({ role: 'system', content: instructions.trim() });
  }

  if (typeof input === 'string') {
    messages.push({ role: 'user', content: input });
    return messages;
  }

  for (const item of input) {
    if (typeof item === 'string') {
      if (item.trim()) messages.push({ role: 'user', content: item });
      continue;
    }
    if (!item || typeof item !== 'object') continue;
    const o = item as Record<string, unknown>;

    // Easy input message: { role, content }
    if (o.role != null && o.content != null) {
      const role = String(o.role);
      if (typeof o.content === 'string') {
        if (o.content.trim()) messages.push({ role, content: o.content });
        continue;
      }
      if (Array.isArray(o.content)) {
        const parts: Array<Record<string, unknown>> = [];
        for (const p of o.content) {
          if (typeof p === 'string') {
            parts.push({ type: 'text', text: p });
            continue;
          }
          if (!p || typeof p !== 'object') continue;
          const part = p as Record<string, unknown>;
          if (part.type === 'input_text' || part.type === 'text') {
            parts.push({ type: 'text', text: String(part.text ?? '') });
          } else if (part.type === 'input_image' || part.type === 'image_url') {
            const url =
              typeof part.image_url === 'object' && part.image_url
                ? (part.image_url as { url?: string }).url
                : typeof part.image_url === 'string'
                  ? part.image_url
                  : typeof part.image === 'string'
                    ? part.image
                    : typeof part.url === 'string'
                      ? part.url
                      : '';
            if (url) {
              parts.push({
                type: 'image_url',
                image_url: { url },
              });
            }
          } else if (part.type === 'image') {
            parts.push(part);
          }
        }
        if (parts.length) messages.push({ role, content: parts });
        continue;
      }
    }

    if (o.type === 'message') {
      const nested = extractMessagesFromResponsesInput(
        [{ role: o.role || 'user', content: o.content }],
      );
      messages.push(...nested.filter((m) => m.role !== 'system'));
      continue;
    }

    if (o.type === 'input_text' && typeof o.text === 'string') {
      messages.push({ role: 'user', content: o.text });
      continue;
    }

    if (o.type === 'input_image') {
      const url =
        typeof o.image_url === 'string'
          ? o.image_url
          : typeof (o.image_url as { url?: string })?.url === 'string'
            ? (o.image_url as { url: string }).url
            : typeof o.url === 'string'
              ? o.url
              : '';
      if (url) {
        messages.push({
          role: 'user',
          content: [{ type: 'image_url', image_url: { url } }],
        });
      }
    }
  }

  if (!messages.length) {
    throw new Error('input produced no messages');
  }
  return messages;
}

export const createResponseSchema = z
  .object({
    model: z.string().min(1).max(128).optional(),
    input: z.union([
      z.string().max(MAX_MESSAGE_CHARS),
      z.array(z.unknown()).min(1).max(MAX_MESSAGES),
    ]),
    instructions: z.string().max(MAX_MESSAGE_CHARS).optional(),
    stream: z.boolean().optional().default(false),
    temperature: z.number().min(0).max(2).optional(),
    max_output_tokens: z.number().int().positive().optional(),
    store: z.boolean().optional(),
    tools: z.array(z.unknown()).optional(),
    previous_response_id: z.string().optional(),
    metadata: z.record(z.unknown()).optional(),
    include_reasoning: z.boolean().optional().default(true),
    reasoning_effort: z.string().max(32).optional(),
  })
  .transform((val) => {
    const messages = extractMessagesFromResponsesInput(
      val.input,
      val.instructions,
    );
    return {
      model: val.model,
      messages,
      stream: Boolean(val.stream),
      include_reasoning: val.include_reasoning !== false,
      store: val.store,
      temperature: val.temperature,
      max_output_tokens: val.max_output_tokens,
      tools: val.tools,
      previous_response_id: val.previous_response_id,
      reasoning_effort: val.reasoning_effort,
    };
  });

export type CreateResponseDto = z.infer<typeof createResponseSchema>;
