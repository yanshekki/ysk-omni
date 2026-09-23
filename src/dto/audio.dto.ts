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
