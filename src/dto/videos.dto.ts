import { z } from 'zod';
import {
  ASPECT_RATIOS,
  VIDEO_MAX_SECONDS,
  VIDEO_MIN_SECONDS,
  VIDEO_VOICES,
  MAX_MESSAGE_CHARS,
} from '../config/constants';

const aspectRatioEnum = z.enum(
  ASPECT_RATIOS as unknown as [string, ...string[]],
);

/** Snap to image-to-video / reference_to_video duration (1–15s since 1.0.1). */
function snapVideoSeconds(v: unknown): number {
  if (v === undefined || v === null || v === '') return 6;
  const n = Number(v);
  if (!Number.isFinite(n)) return 6;
  return Math.min(
    VIDEO_MAX_SECONDS,
    Math.max(VIDEO_MIN_SECONDS, Math.round(n)),
  );
}

export const createVideoSchema = z.object({
  prompt: z.string().min(1).max(MAX_MESSAGE_CHARS),
  model: z.string().min(1).max(128).optional(),
  /** Video duration in seconds (1–15, default 6). */
  seconds: z.preprocess(
    snapVideoSeconds,
    z.number().int().min(VIDEO_MIN_SECONDS).max(VIDEO_MAX_SECONDS),
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
    .array(z.enum(VIDEO_VOICES as unknown as [string, ...string[]]))
    .max(3)
    .optional(),
  format: z.enum(['mp4', 'webm', 'mov']).optional(),
});

export type CreateVideoDto = z.infer<typeof createVideoSchema>;

export const videoIdParamSchema = z.object({
  id: z.string().uuid(),
});
