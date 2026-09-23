import type { Request, Response } from 'express';
import type { ListDocumentsDto } from '../dto/document.dto';
import { ExceptionFactory } from '../exceptions/exception.factory';
import { documentService } from '../services/document.service';
import { asyncHandler } from '../utils/async-handler';
import { requestIp } from '../utils/client-ip';

export class DocumentController {
  upload = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) {
      throw ExceptionFactory.unauthorized();
    }
    if (!req.file) {
      throw ExceptionFactory.validation('File field "file" is required');
    }

    const doc = await documentService.upload({
      apiKeyId: req.apiKey.id,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      buffer: req.file.buffer,
      ip: requestIp(req),
    });

    res.status(201).json({ object: 'document', data: doc });
  });

  list = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) {
      throw ExceptionFactory.unauthorized();
    }
    const query = req.query as unknown as ListDocumentsDto;
    const result = await documentService.list(
      req.apiKey.id,
      query.limit,
      query.offset,
    );
    res.status(200).json({
      object: 'list',
      data: result.items,
      total: result.total,
    });
  });

  get = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) {
      throw ExceptionFactory.unauthorized();
    }
    const doc = await documentService.getPublic(req.apiKey.id, String(req.params.id));
    res.status(200).json({ object: 'document', data: doc });
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) {
      throw ExceptionFactory.unauthorized();
    }
    await documentService.softDelete(req.apiKey.id, String(req.params.id), requestIp(req));
    res.status(200).json({ object: 'document.deleted', id: req.params.id, deleted: true });
  });
}

export const documentController = new DocumentController();
