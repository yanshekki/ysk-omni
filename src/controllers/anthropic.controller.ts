import type { Request, Response } from 'express';
import type { AnthropicMessagesDto } from '../dto/anthropic-messages.dto';
import { ExceptionFactory } from '../exceptions/exception.factory';
import { chatService } from '../services/chat.service';
import { apiFeaturesService } from '../services/api-features.service';
import {
  anthropicToChatDto,
  chatCompletionToAnthropicMessage,
} from '../utils/anthropic-mapper';
import { asyncHandler } from '../utils/async-handler';
import { requestIp } from '../utils/client-ip';
import { readIdempotencyKeyScoped } from '../utils/request-meta';

export class AnthropicController {
  createMessage = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    await apiFeaturesService.assertAnyProtocol('anthropicMessages');

    const body = req.body as AnthropicMessagesDto;
    const dto = anthropicToChatDto(body);
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
        wireFormat: 'anthropic',
        suppressQueueEvents: true,
        idempotencyKey: readIdempotencyKeyScoped(req, req.apiKey.id),
      },
    );

    if (!stream && result) {
      res.status(200).json(chatCompletionToAnthropicMessage(result));
    }
  });
}

export const anthropicController = new AnthropicController();
