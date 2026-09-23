import { z } from 'zod';
import {
  GROK_ASPECT_RATIOS,
  GROK_VIDEO_MAX_SECONDS,
  GROK_VIDEO_MIN_SECONDS,
  GROK_VIDEO_VOICES,
  MAX_MESSAGE_CHARS,
} from '../config/constants';

const aspectRatioEnum = z.enum(
  GROK_ASPECT_RATIOS as unknown as [string, ...string[]],
);

/** Snap to Grok image_to_video / reference_to_video duration (1–15s since 1.0.1). */
function snapVideoSeconds(v: unknown): number {
  if (v === undefined || v === null || v === '') return 6;
  const n = Number(v);
  if (!Number.isFinite(n)) return 6;
  return Math.min(
    GROK_VIDEO_MAX_SECONDS,
    Math.max(GROK_VIDEO_MIN_SECONDS, Math.round(n)),
  );
}

export const createVideoSchema = z.object({
  prompt: z.string().min(1).max(MAX_MESSAGE_CHARS),
  model: z.string().min(1).max(128).optional(),
  /** Grok video duration in seconds (1–15, default 6). */
  seconds: z.preprocess(
    snapVideoSeconds,
    z.number().int().min(GROK_VIDEO_MIN_SECONDS).max(GROK_VIDEO_MAX_SECONDS),
  ),
  aspect_ratio: aspectRatioEnum.optional(),
  /** Optional media-library asset id (image) for image_to_video */
  source_asset_id: z.string().uuid().optional(),
  /** Extra reference images for reference_to_video (max 7 including source). */
  source_asset_ids: z.array(z.string().uuid()).max(7).optional(),
  /** Optional documents-library id (image file) for image_to_video */
  source_document_id: z.string().uuid().optional(),
  /** Preset Imagine voices (max 3). Presence selects reference_to_video. */
  voices: z
    .array(z.enum(GROK_VIDEO_VOICES as unknown as [string, ...string[]]))
    .max(3)
    .optional(),
});

export type CreateVideoDto = z.infer<typeof createVideoSchema>;

export const videoIdParamSchema = z.object({
  id: z.string().uuid(),
});
