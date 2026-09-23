import type { Request, Response } from 'express';
import type { CreateVideoDto } from '../dto/videos.dto';
import { ExceptionFactory } from '../exceptions/exception.factory';
import { mediaJobsService } from '../services/media/media-jobs.service';
import { asyncHandler } from '../utils/async-handler';

export class VideosController {
  create = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const dto = req.body as CreateVideoDto;
    const job = await mediaJobsService.createVideo({
      apiKey: req.apiKey,
      prompt: dto.prompt,
      model: dto.model,
      seconds: dto.seconds,
      aspectRatio: dto.aspect_ratio,
      sourceAssetId: dto.source_asset_id,
      sourceAssetIds: dto.source_asset_ids,
      sourceDocumentId: dto.source_document_id,
      voices: dto.voices,
    });
    res.status(200).json(job);
  });

  get = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const job = await mediaJobsService.getJob(
      req.apiKey.id,
      String(req.params.id),
    );
    res.status(200).json(job);
  });

  content = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const { bytes, mime, originalName } = await mediaJobsService.getJobContent(
      req.apiKey.id,
      String(req.params.id),
    );
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

export const videosController = new VideosController();
