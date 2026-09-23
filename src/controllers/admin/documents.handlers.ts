import type { Request, Response } from 'express';
import { prisma } from '../../config/database';
import { AUDIT_ACTIONS, isImageMime, isTextualMime } from '../../config/constants';
import type { AdminListQueryDto } from '../../dto/admin.dto';
import { ExceptionFactory } from '../../exceptions/exception.factory';
import { asyncHandler } from '../../utils/async-handler';
import { auditService } from '../../services/audit.service';
import { documentService } from '../../services/document.service';
import { env } from '../../config/env';
import { requestIp } from '../../utils/client-ip';
import { resolveScalarOrderBy } from '../../utils/list-sort';

const DOC_SORT_FIELDS = [
  'createdAt',
  'originalName',
  'mimeType',
  'sizeBytes',
  'storageType',
] as const;

/** Admin handlers: documents */
export const adminDocumentsHandlers = {
  listDocuments: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as AdminListQueryDto & {
      storageType?: string;
    };
    const where: Record<string, unknown> = { deletedAt: null };
    if (query.apiKeyId) where.apiKeyId = query.apiKeyId;
    if (query.storageType === 'db' || query.storageType === 'filesystem') {
      where.storageType = query.storageType;
    }
    const q = query.q?.trim();
    if (q) {
      where.OR = [
        { originalName: { contains: q } },
        { mimeType: { contains: q } },
        { checksumSha256: { contains: q } },
      ];
    }
    const createdAt: { gte?: Date; lte?: Date } = {};
    if (query.from) {
      const d = new Date(query.from);
      if (!Number.isNaN(d.getTime())) createdAt.gte = d;
    }
    if (query.to) {
      const d = new Date(query.to);
      if (!Number.isNaN(d.getTime())) createdAt.lte = d;
    }
    if (Object.keys(createdAt).length) where.createdAt = createdAt;

    const orderBy = resolveScalarOrderBy(
      query.sortBy,
      query.sortDir,
      DOC_SORT_FIELDS,
      'createdAt',
    );

    const [rows, total] = await Promise.all([
      prisma.document.findMany({
        where,
        orderBy,
        take: query.limit,
        skip: query.offset,
        include: {
          apiKey: { select: { id: true, name: true, keyPrefix: true } },
        },
      }),
      prisma.document.count({ where }),
    ]);
    res.json({
      object: 'list',
      total,
      limit: query.limit,
      offset: query.offset,
      meta: {
        // Do not expose host storageDir (path disclosure)
        documentDbMaxBytes: env.DOCUMENT_DB_MAX_BYTES,
        uploadMaxBytes: env.UPLOAD_MAX_BYTES,
      },
      data: rows.map((d) => ({
        id: d.id,
        originalName: d.originalName,
        mimeType: d.mimeType,
        sizeBytes: d.sizeBytes,
        storageType: d.storageType,
        storagePath: d.storagePath,
        checksumSha256: d.checksumSha256,
        createdAt: d.createdAt,
        apiKey: d.apiKey,
      })),
    });
  }),

  getDocument: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const doc = await prisma.document.findFirst({
      where: { id: String(req.params.id), deletedAt: null },
      include: {
        apiKey: { select: { id: true, name: true, keyPrefix: true } },
      },
    });
    if (!doc) throw ExceptionFactory.notFound('Document');

    let contentPreview: string | null = null;
    let imageDataUrl: string | null = null;
    let isBinary = false;
    const isImage = isImageMime(doc.mimeType);
    /** Inline base64 preview cap — larger images use authenticated download in UI */
    const IMAGE_INLINE_MAX_BYTES = 3 * 1024 * 1024;
    try {
      if (isImage) {
        if (doc.sizeBytes <= IMAGE_INLINE_MAX_BYTES) {
          const buf = await documentService.readDecryptedContent(
            doc.apiKeyId,
            doc.id,
          );
          const mime = doc.mimeType || 'image/jpeg';
          imageDataUrl = `data:${mime};base64,${buf.toString('base64')}`;
          contentPreview = null;
          isBinary = false;
        } else {
          // Too large for JSON inline — client should load /download with auth
          isBinary = false;
          contentPreview = null;
          imageDataUrl = null;
        }
      } else {
        const buf = await documentService.readDecryptedContent(doc.apiKeyId, doc.id);
        if (
          doc.mimeType === 'application/pdf' ||
          buf.includes(0) ||
          !isTextualMime(doc.mimeType)
        ) {
          isBinary = true;
          contentPreview = null;
        } else {
          const text = buf.toString('utf8');
          if (text.includes('\u0000')) {
            isBinary = true;
            contentPreview = null;
          } else {
            contentPreview = text.slice(0, 50_000);
          }
        }
      }
    } catch {
      contentPreview = '[decrypt_failed]';
    }

    await auditService.log({
      apiKeyId: req.apiKey.id,
      action: AUDIT_ACTIONS.DOCUMENT_READ,
      resource: 'document',
      resourceId: doc.id,
      ip: requestIp(req),
    });

    res.json({
      object: 'admin.document',
      data: {
        id: doc.id,
        originalName: doc.originalName,
        mimeType: doc.mimeType,
        sizeBytes: doc.sizeBytes,
        storageType: doc.storageType,
        // omit storagePath (host path disclosure)
        checksumSha256: doc.checksumSha256,
        createdAt: doc.createdAt,
        apiKey: doc.apiKey,
        content: contentPreview,
        imageDataUrl,
        isImage,
        isBinary,
        downloadAvailable: true,
      },
    });
  }),

  downloadDocument: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const doc = await prisma.document.findFirst({
      where: { id: String(req.params.id), deletedAt: null },
    });
    if (!doc) throw ExceptionFactory.notFound('Document');

    const buf = await documentService.readDecryptedContent(doc.apiKeyId, doc.id);

    await auditService.log({
      apiKeyId: req.apiKey.id,
      action: AUDIT_ACTIONS.DOCUMENT_DOWNLOAD,
      resource: 'document',
      resourceId: doc.id,
      meta: { originalName: doc.originalName, sizeBytes: doc.sizeBytes },
      ip: requestIp(req),
    });

    const safeName = doc.originalName.replace(/[\r\n"]/g, '_');
    const encoded = encodeURIComponent(doc.originalName);
    res.setHeader('Content-Type', doc.mimeType || 'application/octet-stream');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${safeName}"; filename*=UTF-8''${encoded}`,
    );
    res.setHeader('Content-Length', String(buf.length));
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.status(200).send(buf);
  }),

  deleteDocument: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const doc = await prisma.document.findFirst({
      where: { id: String(req.params.id), deletedAt: null },
    });
    if (!doc) throw ExceptionFactory.notFound('Document');
    await documentService.softDelete(doc.apiKeyId, doc.id, requestIp(req));
    res.json({ object: 'document.deleted', id: doc.id, deleted: true });
  }),

};
