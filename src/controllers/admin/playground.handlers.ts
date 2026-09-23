import type { Request, Response } from 'express';
import { AUDIT_ACTIONS } from '../../config/constants';
import type { AdminPlaygroundChatDto } from '../../dto/chat.dto';
import { ExceptionFactory } from '../../exceptions/exception.factory';
import { asyncHandler } from '../../utils/async-handler';
import { apiKeyService } from '../../services/api-key.service';
import { auditService } from '../../services/audit.service';
import { chatService } from '../../services/chat.service';
import { documentService } from '../../services/document.service';
import { requestIp } from '../../utils/client-ip';

/** Admin handlers: playground */
export const adminPlaygroundHandlers = {
  playgroundChat: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const body = req.body as AdminPlaygroundChatDto;
    const { apiKeyId, ...dto } = body;

    let actor = req.apiKey;
    if (apiKeyId && apiKeyId !== req.apiKey.id) {
      actor = await apiKeyService.getByIdForAuth(apiKeyId);
    }

    const stream = Boolean(dto.stream);
    await auditService.log({
      apiKeyId: req.apiKey.id,
      action: AUDIT_ACTIONS.PLAYGROUND_CHAT,
      resource: 'playground',
      resourceId: actor.id,
      meta: {
        asKeyId: actor.id,
        asKeyName: actor.name,
        model: dto.model,
        stream,
      },
      ip: requestIp(req),
    });

    const result = await chatService.createCompletion(
      dto,
      {
        apiKey: actor,
        requestId: req.requestId,
        ip: requestIp(req),
        userAgent: req.header('user-agent') ?? undefined,
      },
      stream ? res : undefined,
      { source: 'playground' },
    );

    if (!stream && result) {
      res.status(200).json(result);
    }
  }),

  playgroundUpload: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    if (!req.file) {
      throw ExceptionFactory.validation('File field "file" is required');
    }
    const asKeyId = String(
      (req.body && (req.body as { apiKeyId?: string }).apiKeyId) ||
        req.apiKey.id,
    );
    const actor =
      asKeyId === req.apiKey.id
        ? req.apiKey
        : await apiKeyService.getByIdForAuth(asKeyId);

    const doc = await documentService.upload({
      apiKeyId: actor.id,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      buffer: req.file.buffer,
      ip: requestIp(req),
    });

    await auditService.log({
      apiKeyId: req.apiKey.id,
      action: AUDIT_ACTIONS.PLAYGROUND_UPLOAD,
      resource: 'document',
      resourceId: doc.id,
      meta: { asKeyId: actor.id, originalName: doc.originalName },
      ip: requestIp(req),
    });

    res.status(201).json({ object: 'document', data: doc });
  }),

};
