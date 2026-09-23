import type { Request, Response } from 'express';
import type { CreateResponseDto } from '../dto/responses.dto';
import { ExceptionFactory } from '../exceptions/exception.factory';
import { chatService } from '../services/chat.service';
import { apiFeaturesService } from '../services/api-features.service';
import { responseStoreService } from '../services/response-store.service';
import {
  chatCompletionToResponse,
  responsesDtoToChatDto,
} from '../utils/responses-mapper';
import { asyncHandler } from '../utils/async-handler';
import { requestIp } from '../utils/client-ip';
import { createResponseId } from '../utils/id';
import { readIdempotencyKeyScoped } from '../utils/request-meta';

export class ResponsesController {
  create = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    await apiFeaturesService.assertAnyProtocol('openaiResponses');

    const body = req.body as CreateResponseDto & {
      previous_response_id?: string;
      store?: boolean;
    };

    // Chain previous response output as context
    if (body.previous_response_id) {
      const prev = await responseStoreService.getPreviousOutputText(
        body.previous_response_id,
        req.apiKey.id,
      );
      if (prev) {
        body.messages = [
          {
            role: 'system',
            content: `Previous assistant output:\n${prev}`,
          },
          ...body.messages,
        ];
      }
    }

    const dto = responsesDtoToChatDto(body);
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
        wireFormat: 'responses',
        suppressQueueEvents: true,
        idempotencyKey: readIdempotencyKeyScoped(req, req.apiKey.id),
      },
    );

    if (!stream && result) {
      const responseId = createResponseId();
      const mapped = chatCompletionToResponse(result, { responseId });
      // Always store non-stream completions for GET /v1/responses/:id
      try {
        await responseStoreService.save({
          id: responseId,
          apiKeyId: req.apiKey.id,
          model: result.model,
          body: mapped,
          previousId: body.previous_response_id || null,
        });
      } catch {
        /* best-effort store */
      }
      res.status(200).json(mapped);
    }
  });

  get = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    await apiFeaturesService.assertAnyProtocol('openaiResponses');
    const id = String(req.params.id);
    const data = await responseStoreService.get(id, req.apiKey.id);
    res.status(200).json(data);
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    await apiFeaturesService.assertAnyProtocol('openaiResponses');
    const id = String(req.params.id);
    await responseStoreService.softDelete(id, req.apiKey.id);
    res.status(200).json({ id, object: 'response', deleted: true });
  });
}

export const responsesController = new ResponsesController();
