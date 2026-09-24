import { z } from 'zod';
import { MAX_MESSAGE_CHARS } from '../config/constants';

export const createSpeechSchema = z.object({
  model: z.string().min(1).max(128).optional().default('tts-1'),
  input: z.string().min(1).max(MAX_MESSAGE_CHARS),
  voice: z.string().min(1).max(64).optional().default('alloy'),
  response_format: z
    .enum(['mp3', 'opus', 'aac', 'flac', 'wav', 'pcm'])
    .optional()
    .default('mp3'),
  speed: z.number().min(0.25).max(4).optional(),
});

export type CreateSpeechDto = z.infer<typeof createSpeechSchema>;

export const adminSpeechSchema = z
  .object({
    input: z.string().min(1).max(MAX_MESSAGE_CHARS).optional(),
    prompt: z.string().min(1).max(MAX_MESSAGE_CHARS).optional(),
    voice: z.string().min(1).max(64).optional(),
    model: z.string().min(1).max(128).optional(),
    apiKeyId: z.string().uuid().optional(),
    format: z.enum(['wav', 'mp3', 'opus', 'flac', 'aac']).optional(),
    response_format: z.enum(['mp3', 'opus', 'aac', 'flac', 'wav', 'pcm']).optional(),
  })
  .refine((d) => Boolean(String(d.input || d.prompt || '').trim()), {
    message: 'input is required',
  });

export type AdminSpeechDto = z.infer<typeof adminSpeechSchema>;
