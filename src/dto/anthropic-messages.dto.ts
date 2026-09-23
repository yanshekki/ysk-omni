import { z } from 'zod';
import { MAX_MESSAGE_CHARS, MAX_MESSAGES } from '../config/constants';

/**
 * Anthropic content is accepted as string or content-block array.
 * tool_use / tool_result / image are preserved for the mapper (not rejected).
 */
const contentSchema = z.union([
  z.string().max(MAX_MESSAGE_CHARS),
  z.array(z.record(z.unknown())).min(1).max(50),
]);

const systemSchema = z
  .union([
    z.string().max(MAX_MESSAGE_CHARS),
    z.array(z.record(z.unknown())),
  ])
  .optional()
  .transform((s) => {
    if (s == null) return undefined;
    if (typeof s === 'string') return s;
    return s
      .map((b) => {
        if (!b || typeof b !== 'object') return '';
        if (b.type === 'text' && typeof b.text === 'string') return b.text;
        if (typeof b.text === 'string') return b.text;
        return '';
      })
      .filter(Boolean)
      .join('\n');
  });

export const anthropicMessagesSchema = z.object({
  model: z.string().min(1).max(128),
  max_tokens: z.number().int().positive().max(1_000_000),
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: contentSchema,
      }),
    )
    .min(1)
    .max(MAX_MESSAGES),
  system: systemSchema,
  stream: z.boolean().optional().default(false),
  temperature: z.number().min(0).max(2).optional(),
  top_p: z.number().min(0).max(1).optional(),
  stop_sequences: z.array(z.string()).max(8).optional(),
  metadata: z.record(z.unknown()).optional(),
  tools: z.array(z.unknown()).optional(),
  tool_choice: z.unknown().optional(),
  thinking: z
    .object({
      type: z.enum(['enabled', 'disabled']).optional(),
      budget_tokens: z.number().int().optional(),
    })
    .optional(),
  /** Extension: include Grok reasoning (default false for Anthropic shape) */
  include_reasoning: z.boolean().optional().default(false),
});

export type AnthropicMessagesDto = z.infer<typeof anthropicMessagesSchema>;
