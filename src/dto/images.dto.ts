import { z } from 'zod';
import {
  ASPECT_RATIOS,
  MAX_MESSAGE_CHARS,
  OPENAI_IMAGE_SIZES,
} from '../config/constants';

/** Accept OpenAI pixel sizes or aspect ratios in `size`. */
const sizeOrAspectEnum = z.enum([
  ...OPENAI_IMAGE_SIZES,
  ...ASPECT_RATIOS,
] as unknown as [string, ...string[]]);

const aspectRatioEnum = z.enum(
  ASPECT_RATIOS as unknown as [string, ...string[]],
);

export const createImageGenerationSchema = z.object({
  prompt: z.string().min(1).max(MAX_MESSAGE_CHARS),
  model: z.string().min(1).max(128).optional(),
  /** image generation has no batch `n`; gateway may loop (1–4). */
  n: z.number().int().min(1).max(4).optional().default(1),
  /**
   * OpenAI-compat size (`1024x1024`) **or** aspect (`16:9`).
   * Prefer `aspect_ratio` when calling image generation.
   */
  size: sizeOrAspectEnum.optional(),
  /** image generation aspect_ratio — preferred over pixel sizes. */
  aspect_ratio: aspectRatioEnum.optional(),
  response_format: z.enum(['url', 'b64_json']).optional().default('b64_json'),
  format: z.enum(['png', 'jpeg', 'jpg', 'webp']).optional(),
  user: z.string().max(128).optional(),
});

export type CreateImageGenerationDto = z.infer<
  typeof createImageGenerationSchema
>;

/** Multipart edits: prompt + response_format as form fields */
export const createImageEditSchema = z.object({
  prompt: z.string().min(1).max(MAX_MESSAGE_CHARS),
  model: z.string().min(1).max(128).optional(),
  n: z.coerce.number().int().min(1).max(4).optional().default(1),
  size: sizeOrAspectEnum.optional(),
  aspect_ratio: aspectRatioEnum.optional(),
  response_format: z.enum(['url', 'b64_json']).optional().default('b64_json'),
});

export type CreateImageEditDto = z.infer<typeof createImageEditSchema>;

export const mediaAssetIdParamSchema = z.object({
  id: z.string().uuid(),
});
