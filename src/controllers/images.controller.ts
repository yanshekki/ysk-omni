import type { Request, Response } from 'express';
import type {
  CreateImageEditDto,
  CreateImageGenerationDto,
} from '../dto/images.dto';
import { createImageEditSchema } from '../dto/images.dto';
import { ExceptionFactory } from '../exceptions/exception.factory';
import { mediaOrchestratorService } from '../services/media/media-orchestrator.service';
import { asyncHandler } from '../utils/async-handler';
import { requestIp } from '../utils/client-ip';

function requestBaseUrl(req: Request): string {
  const host = req.get('host') || '127.0.0.1';
  const proto = req.protocol || 'http';
  return `${proto}://${host}`;
}

export class ImagesController {
  createGeneration = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const dto = req.body as CreateImageGenerationDto;

    const result = await mediaOrchestratorService.generateImages({
      apiKey: req.apiKey,
      prompt: dto.prompt,
      model: dto.model,
      n: dto.n,
      size: dto.size,
      aspectRatio: dto.aspect_ratio,
      responseFormat: dto.response_format,
      baseUrl: requestBaseUrl(req),
      ip: requestIp(req),
    });

    res.status(200).json(result);
  });

  createEdit = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const files = req.files as
      | { [field: string]: Express.Multer.File[] }
      | undefined;
    const image = files?.image?.[0];
    if (!image?.buffer?.length) {
      throw ExceptionFactory.validation('Multipart field "image" is required');
    }
    const parsed = createImageEditSchema.safeParse(req.body);
    if (!parsed.success) {
      throw ExceptionFactory.validation('Invalid image edit body', parsed.error.issues);
    }
    const dto = parsed.data as CreateImageEditDto;
    const mask = files?.mask?.[0];

    const result = await mediaOrchestratorService.editImages({
      apiKey: req.apiKey,
      prompt: dto.prompt,
      imageBytes: image.buffer,
      imageMime: image.mimetype,
      maskBytes: mask?.buffer,
      model: dto.model,
      n: dto.n,
      size: dto.size,
      aspectRatio: dto.aspect_ratio,
      responseFormat: dto.response_format,
      baseUrl: requestBaseUrl(req),
      ip: requestIp(req),
    });

    res.status(200).json(result);
  });
}

export const imagesController = new ImagesController();
