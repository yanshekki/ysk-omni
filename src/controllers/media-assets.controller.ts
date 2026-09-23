import type { Request, Response } from 'express';
import { ExceptionFactory } from '../exceptions/exception.factory';
import { mediaOrchestratorService } from '../services/media/media-orchestrator.service';
import { asyncHandler } from '../utils/async-handler';
import { AUDIT_ACTIONS } from '../config/constants';
import { auditService } from '../services/audit.service';
import { requestIp } from '../utils/client-ip';

export class MediaAssetsController {
  get = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const id = String(req.params.id);
    const meta = await mediaOrchestratorService.getAsset(req.apiKey.id, id);
    res.status(200).json({
      object: 'media.asset',
      data: {
        id: meta.id,
        kind: meta.kind,
        mime: meta.mime,
        bytes: meta.byteSize,
        filename: meta.originalName,
        provider: meta.provider,
        created_at: Math.floor(meta.createdAt.getTime() / 1000),
      },
    });
  });

  content = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const id = String(req.params.id);
    const { bytes, mime, originalName } =
      await mediaOrchestratorService.getAssetContent(req.apiKey.id, id);

    await auditService.log({
      apiKeyId: req.apiKey.id,
      action: AUDIT_ACTIONS.MEDIA_READ,
      resource: 'media_asset',
      resourceId: id,
      ip: requestIp(req),
    });

    res.setHeader('Content-Type', mime);
    if (originalName) {
      res.setHeader(
        'Content-Disposition',
        `inline; filename="${originalName.replace(/"/g, '')}"`,
      );
    }
    res.setHeader('Content-Length', String(bytes.length));
    res.status(200).send(bytes);
  });
}

export const mediaAssetsController = new MediaAssetsController();
