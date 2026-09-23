import { z } from 'zod';
import {
  MAX_MESSAGES,
  MAX_MESSAGE_CHARS,
  MAX_DOCUMENTS_PER_CHAT,
} from '../config/constants';

/** OpenAI-style content part (text or image_url). Kept as structure for vision path. */
const contentPartSchema = z.record(z.unknown());

const messageContentSchema = z.union([
  z.string().max(MAX_MESSAGE_CHARS),
  z.array(contentPartSchema).min(1).max(50),
  z.null().transform(() => ''),
]);

const chatMessageSchema = z
  .object({
    role: z.string().min(1).max(32),
    content: messageContentSchema,
    name: z.string().max(64).optional(),
    /** OpenAI tool result messages */
    tool_call_id: z.string().max(128).optional(),
    /** OpenAI assistant tool_calls */
    tool_calls: z.array(z.unknown()).optional(),
  })
  .passthrough();

const chatCompletionObjectSchema = z.object({
  model: z.string().min(1).max(128).optional(),
  messages: z.array(chatMessageSchema).min(1).max(MAX_MESSAGES),
  stream: z.boolean().optional().default(false),
  /** Grok CLI has no sampling knobs — accepted; ignored unless strictSampling */
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().int().positive().optional(),
  top_p: z.number().min(0).max(1).optional(),
  n: z.number().int().positive().max(1).optional(),
  stop: z.union([z.string(), z.array(z.string())]).optional(),
  user: z.string().max(128).optional(),
  cwd: z.string().max(1024).optional(),
  session_id: z.string().max(128).optional(),
  document_ids: z
    .array(z.string().uuid())
    .max(MAX_DOCUMENTS_PER_CHAT)
    .optional(),
  include_reasoning: z.boolean().optional().default(true),

  // OpenAI tools (mapped to Grok --tools when apiFeatures.tools)
  tools: z.array(z.unknown()).optional(),
  tool_choice: z.unknown().optional(),
  functions: z.array(z.unknown()).optional(),
  function_call: z.unknown().optional(),

  response_format: z
    .object({
      type: z.enum(['text', 'json_object', 'json_schema']).optional(),
      json_schema: z
        .object({
          name: z.string().optional(),
          schema: z.unknown().optional(),
          strict: z.boolean().optional(),
        })
        .passthrough()
        .optional(),
    })
    .optional(),
  stream_options: z
    .object({
      include_usage: z.boolean().optional(),
    })
    .optional(),

  // Grok CLI capability passthroughs
  reasoning_effort: z.string().max(32).optional(),
  effort: z.string().max(32).optional(),
  system_prompt_override: z.string().max(MAX_MESSAGE_CHARS).optional(),
  rules: z.string().max(MAX_MESSAGE_CHARS).optional(),
  permission_mode: z
    .enum([
      'default',
      'acceptEdits',
      'auto',
      'dontAsk',
      'bypassPermissions',
      'plan',
    ])
    .optional(),
  sandbox: z.string().max(64).optional(),
  allow: z.array(z.string().max(256)).max(50).optional(),
  deny: z.array(z.string().max(256)).max(50).optional(),
  disable_web_search: z.boolean().optional(),
  no_subagents: z.boolean().optional(),
  no_plan: z.boolean().optional(),
  no_memory: z.boolean().optional(),
  experimental_memory: z.boolean().optional(),
  best_of_n: z.number().int().min(1).max(16).optional(),
  check: z.boolean().optional(),
  verbatim: z.boolean().optional(),
  agent: z.string().max(256).optional(),
  agents: z.unknown().optional(),
  resume: z.string().max(128).optional(),
  continue: z.boolean().optional(),
  fork_session: z.boolean().optional(),
  json_schema: z.unknown().optional(),
});

export const createChatCompletionSchema = chatCompletionObjectSchema;

export type CreateChatCompletionDto = z.infer<typeof createChatCompletionSchema>;

export const optionalApiKeyRefSchema = z
  .union([
    z.string().uuid(),
    z.string().regex(/^admin-session:[A-Za-z0-9_-]+$/),
    z.literal(''),
    z.null(),
  ])
  .optional()
  .transform((v) => {
    if (v == null || v === '' || String(v).startsWith('admin-session:')) {
      return undefined;
    }
    return v as string;
  });

export const adminPlaygroundChatSchema = chatCompletionObjectSchema.extend({
  apiKeyId: optionalApiKeyRefSchema,
});

export type AdminPlaygroundChatDto = z.infer<typeof adminPlaygroundChatSchema>;
