import type { Request, Response } from 'express';
import type { CreateChatCompletionDto } from '../dto/chat.dto';
import { ExceptionFactory } from '../exceptions/exception.factory';
import { chatService } from '../services/chat.service';
import { apiFeaturesService } from '../services/api-features.service';
import { asyncHandler } from '../utils/async-handler';
import { requestIp } from '../utils/client-ip';
import { readIdempotencyKeyScoped } from '../utils/request-meta';

export class ChatController {
  createCompletion = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) {
      throw ExceptionFactory.unauthorized();
    }

    await apiFeaturesService.assertAnyProtocol('openaiChat');

    const dto = req.body as CreateChatCompletionDto;
    const stream = Boolean(dto.stream);

    const result = await chatService.createCompletion(
      dto,
      {
        apiKey: req.apiKey,
        requestId: req.requestId,
        ip: requestIp(req),
        userAgent: req.header('user-agent') ?? undefined,
      },
      stream ? res : undefined,
      {
        source: 'v1',
        idempotencyKey: readIdempotencyKeyScoped(req, req.apiKey.id),
      },
    );

    if (!stream && result) {
      res.status(200).json(result);
    }
  });
}

export const chatController = new ChatController();
