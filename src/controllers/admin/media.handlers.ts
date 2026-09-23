import type { Request, Response } from 'express';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../config/database';
import { env } from '../../config/env';
import { AUDIT_ACTIONS } from '../../config/constants';
import type { CreateImageEditDto, CreateImageGenerationDto } from '../../dto/images.dto';
import { createImageEditSchema } from '../../dto/images.dto';
import { ExceptionFactory } from '../../exceptions/exception.factory';
import { asyncHandler } from '../../utils/async-handler';
import { apiKeyService } from '../../services/api-key.service';
import { auditService } from '../../services/audit.service';
import { documentService } from '../../services/document.service';
import { mediaJobsService } from '../../services/media/media-jobs.service';
import { mediaOrchestratorService } from '../../services/media/media-orchestrator.service';
import { requestIp } from '../../utils/client-ip';
import type { AuthenticatedApiKey } from '../../interfaces';
import { resolveScalarOrderBy } from '../../utils/list-sort';

const MEDIA_ASSET_SORT_FIELDS = [
  'createdAt',
  'kind',
  'mime',
  'byteSize',
  'provider',
  'originalName',
] as const;

const MEDIA_JOB_SORT_FIELDS = [
  'createdAt',
  'status',
  'kind',
  'completedAt',
] as const;

function mediaRoot(): string {
  return path.join(env.storageDir, 'media');
}

/** Admin: browse / download / delete generated media + video jobs */
export const adminMediaHandlers = {
  listAssets: asyncHandler(async (req: Request, res: Response) => {
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 200);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    const kind =
      typeof req.query.kind === 'string' && req.query.kind
        ? String(req.query.kind)
        : undefined;
    const provider =
      typeof req.query.provider === 'string' && req.query.provider
        ? String(req.query.provider)
        : undefined;
    const q =
      typeof req.query.q === 'string' && req.query.q.trim()
        ? String(req.query.q).trim()
        : undefined;
    const fromRaw =
      typeof req.query.from === 'string' ? req.query.from : undefined;
    const toRaw = typeof req.query.to === 'string' ? req.query.to : undefined;
    const sortBy =
      typeof req.query.sortBy === 'string' ? req.query.sortBy : undefined;
    const sortDir =
      typeof req.query.sortDir === 'string' ? req.query.sortDir : undefined;

    const createdAt: { gte?: Date; lte?: Date } = {};
    if (fromRaw) {
      const d = new Date(fromRaw);
      if (!Number.isNaN(d.getTime())) createdAt.gte = d;
    }
    if (toRaw) {
      const d = new Date(toRaw);
      if (!Number.isNaN(d.getTime())) createdAt.lte = d;
    }

    const where: Prisma.MediaAssetWhereInput = {
      deletedAt: null,
      ...(kind ? { kind } : {}),
      ...(provider ? { provider: { contains: provider } } : {}),
      ...(Object.keys(createdAt).length ? { createdAt } : {}),
      ...(q
        ? {
            OR: [
              { prompt: { contains: q } },
              { originalName: { contains: q } },
              { mime: { contains: q } },
              { provider: { contains: q } },
              { id: { contains: q } },
              { source: { contains: q } },
            ],
          }
        : {}),
    };

    const orderBy = resolveScalarOrderBy(
      sortBy,
      sortDir,
      MEDIA_ASSET_SORT_FIELDS,
      'createdAt',
    ) as Prisma.MediaAssetOrderByWithRelationInput;

    const [rows, total] = await Promise.all([
      prisma.mediaAsset.findMany({
        where,
        orderBy,
        take: limit,
        skip: offset,
        select: {
          id: true,
          kind: true,
          mime: true,
          byteSize: true,
          originalName: true,
          source: true,
          provider: true,
          prompt: true,
          createdAt: true,
          apiKeyId: true,
          apiKey: { select: { name: true, keyPrefix: true } },
        },
      }),
      prisma.mediaAsset.count({ where }),
    ]);
    res.json({
      object: 'list',
      total,
      limit,
      offset,
      data: rows.map((r) => ({
        id: r.id,
        kind: r.kind,
        mime: r.mime,
        bytes: r.byteSize,
        filename: r.originalName,
        source: r.source,
        provider: r.provider,
        prompt: r.prompt,
        created_at: r.createdAt.toISOString(),
        apiKeyId: r.apiKeyId,
        apiKeyName: r.apiKey?.name,
        apiKeyPrefix: r.apiKey?.keyPrefix,
      })),
    });
  }),

  getAsset: asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id);
    const row = await prisma.mediaAsset.findFirst({
      where: { id, deletedAt: null },
      include: { apiKey: { select: { name: true, keyPrefix: true } } },
    });
    if (!row) throw ExceptionFactory.notFound('Media asset');
    res.json({
      object: 'admin.media_asset',
      data: {
        id: row.id,
        kind: row.kind,
        mime: row.mime,
        bytes: row.byteSize,
        filename: row.originalName,
        source: row.source,
        provider: row.provider,
        prompt: row.prompt,
        meta: row.metaJson,
        created_at: row.createdAt.toISOString(),
        apiKeyId: row.apiKeyId,
        apiKeyName: row.apiKey?.name,
        apiKeyPrefix: row.apiKey?.keyPrefix,
      },
    });
  }),

  downloadAsset: asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id);
    const row = await prisma.mediaAsset.findFirst({
      where: { id, deletedAt: null },
    });
    if (!row) throw ExceptionFactory.notFound('Media asset');
    const full = path.join(mediaRoot(), row.storagePath);
    const bytes = await fs.readFile(full);
    res.setHeader('Content-Type', row.mime);
    if (row.originalName) {
      res.setHeader(
        'Content-Disposition',
        `inline; filename="${row.originalName.replace(/"/g, '')}"`,
      );
    }
    res.setHeader('Content-Length', String(bytes.length));
    res.status(200).send(bytes);
  }),

  deleteAsset: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const id = String(req.params.id);
    const row = await prisma.mediaAsset.findFirst({
      where: { id, deletedAt: null },
    });
    if (!row) throw ExceptionFactory.notFound('Media asset');
    await prisma.mediaAsset.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    await auditService.log({
      apiKeyId: req.apiKey.id,
      action: AUDIT_ACTIONS.MEDIA_DELETE,
      resource: 'media_asset',
      resourceId: id,
      ip: requestIp(req),
    });
    res.json({ object: 'admin.media_asset.deleted', id, deleted: true });
  }),

  listJobs: asyncHandler(async (req: Request, res: Response) => {
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 200);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    const sortBy =
      typeof req.query.sortBy === 'string' ? req.query.sortBy : undefined;
    const sortDir =
      typeof req.query.sortDir === 'string' ? req.query.sortDir : undefined;
    const orderBy = resolveScalarOrderBy(
      sortBy,
      sortDir,
      MEDIA_JOB_SORT_FIELDS,
      'createdAt',
    ) as Prisma.MediaJobOrderByWithRelationInput;
    const [rows, total] = await Promise.all([
      prisma.mediaJob.findMany({
        orderBy,
        take: limit,
        skip: offset,
      }),
      prisma.mediaJob.count(),
    ]);
    res.json({
      object: 'list',
      total,
      data: rows.map((r) => ({
        id: r.id,
        kind: r.kind,
        status: r.status,
        prompt: r.prompt,
        model: r.model,
        provider: r.provider,
        result_asset_id: r.resultAssetId,
        error: r.errorMessage,
        created_at: r.createdAt.toISOString(),
        completed_at: r.completedAt?.toISOString() ?? null,
      })),
    });
  }),

  /**
   * Admin SPA image generation (uses session admin actor or optional agent apiKeyId).
   * Body mirrors POST /v1/images/generations + optional apiKeyId + aspect_ratio.
   */
  generateImage: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const body = req.body as CreateImageGenerationDto & { apiKeyId?: string };
    const actor = await resolveMediaActor(req, body.apiKeyId);

    const host = req.get('host') || '127.0.0.1';
    const proto = req.protocol || 'http';
    const baseUrl = `${proto}://${host}`;

    const result = await mediaOrchestratorService.generateImages({
      apiKey: actor,
      prompt: body.prompt,
      model: body.model,
      n: body.n ?? 1,
      size: body.size,
      aspectRatio: body.aspect_ratio,
      responseFormat: body.response_format || 'url',
      baseUrl,
      ip: requestIp(req),
    });

    await auditService.log({
      apiKeyId: req.apiKey.id,
      action: AUDIT_ACTIONS.MEDIA_GENERATE,
      resource: 'media_asset',
      resourceId: result.grok?.asset_ids?.[0],
      meta: {
        via: 'admin.media.generate',
        asKeyId: actor.id,
        asKeyName: actor.name,
        count: result.grok?.asset_ids?.length ?? 0,
        aspect_ratio: body.aspect_ratio || body.size || null,
      },
      ip: requestIp(req),
    });

    res.status(200).json({
      object: 'admin.media.generate',
      data: result,
    });
  }),

  /**
   * Admin SPA image edit.
   * Source (any one): multipart `image`, `sourceAssetId` (media), or `sourceDocumentId` (documents).
   */
  editImage: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const files = req.files as
      | { [field: string]: Express.Multer.File[] }
      | undefined;
    const image = files?.image?.[0];
    const parsed = createImageEditSchema
      .extend({
        apiKeyId: z.string().uuid().optional(),
        sourceAssetId: z.string().uuid().optional(),
        sourceDocumentId: z.string().uuid().optional(),
        // form fields may arrive as snake_case from multipart
        source_asset_id: z.string().uuid().optional(),
        source_document_id: z.string().uuid().optional(),
      })
      .safeParse(req.body);
    if (!parsed.success) {
      throw ExceptionFactory.validation(
        'Invalid image edit body',
        parsed.error.issues,
      );
    }
    const body = parsed.data as CreateImageEditDto & {
      apiKeyId?: string;
      sourceAssetId?: string;
      sourceDocumentId?: string;
      source_asset_id?: string;
      source_document_id?: string;
    };
    const actor = await resolveMediaActor(req, body.apiKeyId);
    const mask = files?.mask?.[0];

    const source = await resolveMediaSourceBytes({
      file: image,
      sourceAssetId: body.sourceAssetId || body.source_asset_id,
      sourceDocumentId: body.sourceDocumentId || body.source_document_id,
      requireImage: true,
    });

    const host = req.get('host') || '127.0.0.1';
    const proto = req.protocol || 'http';
    const baseUrl = `${proto}://${host}`;

    const result = await mediaOrchestratorService.editImages({
      apiKey: actor,
      prompt: body.prompt,
      imageBytes: source.bytes,
      imageMime: source.mime,
      maskBytes: mask?.buffer,
      model: body.model,
      n: body.n ?? 1,
      size: body.size,
      aspectRatio: body.aspect_ratio,
      responseFormat: body.response_format || 'url',
      baseUrl,
      ip: requestIp(req),
    });

    await auditService.log({
      apiKeyId: req.apiKey.id,
      action: AUDIT_ACTIONS.MEDIA_GENERATE,
      resource: 'media_asset',
      resourceId: result.grok?.asset_ids?.[0],
      meta: {
        via: 'admin.media.edit',
        asKeyId: actor.id,
        count: result.grok?.asset_ids?.length ?? 0,
        sourceKind: source.kind,
        sourceId: source.id,
      },
      ip: requestIp(req),
    });

    res.status(200).json({
      object: 'admin.media.edit',
      data: result,
    });
  }),

  /**
   * Admin SPA: enqueue video job.
   * Source frame (optional): multipart `image`, media asset id, or document id.
   * If none, a frame is generated from the prompt first (Grok image_to_video).
   */
  createVideo: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const files = req.files as
      | { [field: string]: Express.Multer.File[] }
      | undefined;
    const image = files?.image?.[0];

    // Body may be JSON or multipart form fields (all strings)
    const raw = req.body || {};
    const prompt = String(raw.prompt || '').trim();
    if (!prompt) {
      throw ExceptionFactory.validation('prompt is required');
    }
    const secondsRaw = raw.seconds !== undefined ? Number(raw.seconds) : 6;
    const seconds =
      Number.isFinite(secondsRaw) && secondsRaw >= 1 && secondsRaw <= 15
        ? Math.round(secondsRaw)
        : 6;
    const voicesRaw = raw.voices;
    const voices = Array.isArray(voicesRaw)
      ? voicesRaw.map(String).filter(Boolean)
      : typeof voicesRaw === 'string' && voicesRaw.trim()
        ? voicesRaw.split(',').map((s: string) => s.trim()).filter(Boolean)
        : undefined;
    if (voices?.length) {
      const { GROK_VIDEO_VOICES } = await import('../../config/constants');
      const allowed = new Set<string>(GROK_VIDEO_VOICES);
      const bad = voices.filter((v) => !allowed.has(v));
      if (bad.length) {
        throw ExceptionFactory.validation(
          `Unknown video voice(s): ${bad.join(', ')}. Allowed: ${GROK_VIDEO_VOICES.join(', ')}`,
        );
      }
    }
    const model =
      typeof raw.model === 'string' && raw.model.trim()
        ? raw.model.trim()
        : undefined;
    const aspectRatio =
      typeof raw.aspect_ratio === 'string' && raw.aspect_ratio.trim()
        ? raw.aspect_ratio.trim()
        : undefined;
    const apiKeyId =
      typeof raw.apiKeyId === 'string' && raw.apiKeyId
        ? raw.apiKeyId
        : undefined;
    const sourceAssetId =
      (typeof raw.source_asset_id === 'string' && raw.source_asset_id) ||
      (typeof raw.sourceAssetId === 'string' && raw.sourceAssetId) ||
      undefined;
    const sourceDocumentId =
      (typeof raw.source_document_id === 'string' && raw.source_document_id) ||
      (typeof raw.sourceDocumentId === 'string' && raw.sourceDocumentId) ||
      undefined;

    const actor = await resolveMediaActor(req, apiKeyId);

    let sourceBytes: Buffer | undefined;
    if (image?.buffer?.length || sourceAssetId || sourceDocumentId) {
      const src = await resolveMediaSourceBytes({
        file: image,
        sourceAssetId: sourceAssetId || undefined,
        sourceDocumentId: sourceDocumentId || undefined,
        requireImage: true,
      });
      sourceBytes = src.bytes;
    }

    const job = await mediaJobsService.createVideo({
      apiKey: actor,
      prompt,
      model,
      seconds,
      aspectRatio,
      sourceAssetId: sourceBytes ? undefined : sourceAssetId || undefined,
      sourceDocumentId: sourceBytes ? undefined : sourceDocumentId || undefined,
      sourceBytes,
      voices,
    });

    await auditService.log({
      apiKeyId: req.apiKey.id,
      action: AUDIT_ACTIONS.MEDIA_GENERATE,
      resource: 'media_job',
      resourceId: job.id,
      meta: {
        via: 'admin.media.video',
        asKeyId: actor.id,
        seconds,
        hasUpload: Boolean(image?.buffer?.length),
        source_asset_id: sourceAssetId || null,
        source_document_id: sourceDocumentId || null,
      },
      ip: requestIp(req),
    });

    res.status(200).json({
      object: 'admin.media.video',
      data: job,
    });
  }),
};

async function resolveMediaActor(
  req: Request,
  apiKeyId?: string,
): Promise<AuthenticatedApiKey> {
  if (!req.apiKey) throw ExceptionFactory.unauthorized();
  let actor = req.apiKey;
  if (apiKeyId && apiKeyId !== req.apiKey.id) {
    if (!String(apiKeyId).startsWith('admin-session:')) {
      actor = await apiKeyService.getByIdForAuth(apiKeyId);
    }
  }
  return actor;
}

/**
 * Resolve image bytes from upload, media asset, or documents library.
 * Admin may read any non-deleted system file.
 */
async function resolveMediaSourceBytes(input: {
  file?: Express.Multer.File;
  sourceAssetId?: string;
  sourceDocumentId?: string;
  requireImage?: boolean;
}): Promise<{
  bytes: Buffer;
  mime: string;
  kind: 'upload' | 'asset' | 'document';
  id?: string;
  name?: string;
}> {
  if (input.file?.buffer?.length) {
    return {
      bytes: input.file.buffer,
      mime: input.file.mimetype || 'application/octet-stream',
      kind: 'upload',
      name: input.file.originalname,
    };
  }

  if (input.sourceAssetId) {
    const row = await prisma.mediaAsset.findFirst({
      where: { id: input.sourceAssetId, deletedAt: null },
    });
    if (!row) throw ExceptionFactory.notFound('Media asset');
    if (input.requireImage && !String(row.mime || '').startsWith('image/')) {
      throw ExceptionFactory.validation(
        'Source media asset must be an image for image_edit / image_to_video',
        { reason: 'source_must_be_image' },
      );
    }
    const full = path.join(mediaRoot(), row.storagePath);
    const bytes = await fs.readFile(full);
    return {
      bytes,
      mime: row.mime,
      kind: 'asset',
      id: row.id,
      name: row.originalName || row.id,
    };
  }

  if (input.sourceDocumentId) {
    const doc = await prisma.document.findFirst({
      where: { id: input.sourceDocumentId, deletedAt: null },
    });
    if (!doc) throw ExceptionFactory.notFound('Document');
    if (input.requireImage && !String(doc.mimeType || '').startsWith('image/')) {
      throw ExceptionFactory.validation(
        'Source document must be an image for image_edit / image_to_video',
        { reason: 'source_must_be_image' },
      );
    }
    const bytes = await documentService.readDecryptedContent(
      doc.apiKeyId,
      doc.id,
    );
    return {
      bytes,
      mime: doc.mimeType,
      kind: 'document',
      id: doc.id,
      name: doc.originalName,
    };
  }

  throw ExceptionFactory.validation(
    'Provide an image file, sourceAssetId, or sourceDocumentId',
    { reason: 'source_required' },
  );
}
