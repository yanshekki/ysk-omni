import type { Request, Response } from 'express';
import type { CreateFileDto } from '../dto/files.dto';
import { ExceptionFactory } from '../exceptions/exception.factory';
import { apiFeaturesService } from '../services/api-features.service';
import { documentService } from '../services/document.service';
import { mediaStoreService } from '../services/media/media-store.service';
import { asyncHandler } from '../utils/async-handler';
import { requestIp } from '../utils/client-ip';

function assertFilesAlias() {
  return apiFeaturesService.get().then((f) => {
    if (!f.filesOpenAiAlias) {
      throw ExceptionFactory.featureDisabled(
        'filesOpenAiAlias',
        'OpenAI /v1/files alias is disabled (Admin → API features → filesOpenAiAlias)',
      );
    }
  });
}

function toOpenAiFile(doc: {
  id: string;
  originalName: string;
  sizeBytes: number;
  createdAt: Date;
  mimeType?: string;
}, purpose: string) {
  return {
    id: doc.id,
    object: 'file' as const,
    bytes: doc.sizeBytes,
    created_at: Math.floor(doc.createdAt.getTime() / 1000),
    filename: doc.originalName,
    purpose,
    status: 'processed' as const,
  };
}

/**
 * OpenAI-compatible Files API — backed by documents (+ optional media listing).
 */
export class FilesController {
  create = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    await assertFilesAlias();
    if (!req.file) {
      throw ExceptionFactory.validation('Multipart field "file" is required');
    }
    const purpose =
      (req.body as CreateFileDto)?.purpose ||
      String(req.body?.purpose || 'user_data');

    const doc = await documentService.upload({
      apiKeyId: req.apiKey.id,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      buffer: req.file.buffer,
      ip: requestIp(req),
    });

    res.status(200).json(
      toOpenAiFile(
        {
          id: doc.id,
          originalName: doc.originalName,
          sizeBytes: doc.sizeBytes,
          createdAt: doc.createdAt,
        },
        purpose,
      ),
    );
  });

  list = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    await assertFilesAlias();
    const purpose = String(req.query.purpose || 'user_data');
    const result = await documentService.list(req.apiKey.id, 100, 0);
    res.status(200).json({
      object: 'list',
      data: result.items.map((d) =>
        toOpenAiFile(
          {
            id: d.id,
            originalName: d.originalName,
            sizeBytes: d.sizeBytes,
            createdAt: d.createdAt,
          },
          purpose,
        ),
      ),
    });
  });

  get = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    await assertFilesAlias();
    const id = String(req.params.id);
    // Prefer document; fall back to media asset
    try {
      const doc = await documentService.getPublic(req.apiKey.id, id);
      res.status(200).json(
        toOpenAiFile(
          {
            id: doc.id,
            originalName: doc.originalName,
            sizeBytes: doc.sizeBytes,
            createdAt: doc.createdAt,
          },
          'user_data',
        ),
      );
      return;
    } catch {
      /* try media */
    }
    const meta = await mediaStoreService.getMeta(id, req.apiKey.id);
    res.status(200).json({
      id: meta.id,
      object: 'file',
      bytes: meta.byteSize,
      created_at: Math.floor(meta.createdAt.getTime() / 1000),
      filename: meta.originalName || `${meta.id}.bin`,
      purpose: 'assistants_output',
      status: 'processed',
    });
  });

  content = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    await assertFilesAlias();
    const id = String(req.params.id);
    try {
      const buf = await documentService.readDecryptedContent(
        req.apiKey.id,
        id,
      );
      const doc = await documentService.getPublic(req.apiKey.id, id);
      res.setHeader('Content-Type', doc.mimeType || 'application/octet-stream');
      res.setHeader('Content-Length', String(buf.length));
      res.status(200).send(buf);
      return;
    } catch {
      /* media */
    }
    const { bytes, mime, originalName } = await mediaStoreService.readBytes(
      id,
      req.apiKey.id,
    );
    res.setHeader('Content-Type', mime);
    if (originalName) {
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${originalName.replace(/"/g, '')}"`,
      );
    }
    res.setHeader('Content-Length', String(bytes.length));
    res.status(200).send(bytes);
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    await assertFilesAlias();
    const id = String(req.params.id);
    try {
      await documentService.softDelete(
        req.apiKey.id,
        id,
        requestIp(req),
      );
      res.status(200).json({ id, object: 'file', deleted: true });
      return;
    } catch {
      /* media */
    }
    await mediaStoreService.softDelete(id, req.apiKey.id);
    res.status(200).json({ id, object: 'file', deleted: true });
  });
}

export const filesController = new FilesController();
