import { z } from 'zod';
import { MAX_MESSAGES, MAX_MESSAGE_CHARS } from '../config/constants';

const conversationMessageSchema = z.object({
  role: z.string().min(1).max(32),
  content: z.string().max(MAX_MESSAGE_CHARS),
  reasoning: z.string().max(MAX_MESSAGE_CHARS).optional(),
  docs: z
    .array(
      z.object({
        id: z.string().max(64),
        name: z.string().max(512),
      }),
    )
    .max(20)
    .optional(),
  error: z.boolean().optional(),
  /** Legacy marker — ignored for display going forward */
  compressed: z.boolean().optional(),
});

export const contextModeSchema = z.enum(['full', 'summary', 'recent']);

/** Nullable for create/update; OTP session ids → null */
const conversationApiKeyIdSchema = z
  .union([
    z.string().uuid(),
    z.string().regex(/^admin-session:[A-Za-z0-9_-]+$/),
    z.literal(''),
    z.null(),
  ])
  .optional()
  .nullable()
  .transform((v) => {
    if (v == null || v === '' || String(v).startsWith('admin-session:')) {
      return null;
    }
    return v as string;
  });

export const conversationListQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
  offset: z.coerce.number().int().min(0).optional().default(0),
  q: z.string().max(200).optional(),
  apiKeyId: z.string().uuid().optional(),
});

export type ConversationListQueryDto = z.infer<typeof conversationListQuerySchema>;

const contextFields = {
  contextMode: contextModeSchema.optional(),
  contextRecentN: z.number().int().min(2).max(40).optional(),
  summaryText: z.string().max(MAX_MESSAGE_CHARS).optional(),
  summaryAt: z.string().datetime().nullable().optional(),
  summarySourceCount: z.number().int().min(0).optional(),
};

export const createConversationSchema = z.object({
  title: z.string().max(120).optional().default(''),
  model: z.string().max(128).optional().nullable(),
  systemPrompt: z.string().max(MAX_MESSAGE_CHARS).optional().default(''),
  apiKeyId: conversationApiKeyIdSchema,
  messages: z.array(conversationMessageSchema).max(MAX_MESSAGES).default([]),
  ...contextFields,
});

export type CreateConversationDto = z.infer<typeof createConversationSchema>;

export const updateConversationSchema = z
  .object({
    title: z.string().max(120).optional(),
    model: z.string().max(128).optional().nullable(),
    systemPrompt: z.string().max(MAX_MESSAGE_CHARS).optional(),
    apiKeyId: conversationApiKeyIdSchema,
    messages: z.array(conversationMessageSchema).max(MAX_MESSAGES).optional(),
    ...contextFields,
  })
  .refine(
    (v) =>
      v.title !== undefined ||
      v.model !== undefined ||
      v.systemPrompt !== undefined ||
      v.apiKeyId !== undefined ||
      v.messages !== undefined ||
      v.contextMode !== undefined ||
      v.contextRecentN !== undefined ||
      v.summaryText !== undefined ||
      v.summaryAt !== undefined ||
      v.summarySourceCount !== undefined,
    { message: 'At least one field is required' },
  );

export type UpdateConversationDto = z.infer<typeof updateConversationSchema>;

export type ConversationMessage = z.infer<typeof conversationMessageSchema>;
