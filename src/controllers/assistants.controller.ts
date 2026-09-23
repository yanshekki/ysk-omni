import type { Request, Response } from 'express';
import { ExceptionFactory } from '../exceptions/exception.factory';
import { assistantsService } from '../services/assistants.service';
import { asyncHandler } from '../utils/async-handler';
import { requestIp } from '../utils/client-ip';

export class AssistantsController {
  createAssistant = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const body = req.body as {
      name?: string;
      model?: string;
      instructions?: string;
      tools?: unknown[];
      metadata?: Record<string, string>;
    };
    const data = await assistantsService.createAssistant(req.apiKey.id, body);
    res.status(200).json(data);
  });

  getAssistant = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const data = await assistantsService.getAssistant(
      req.apiKey.id,
      String(req.params.id),
    );
    res.status(200).json(data);
  });

  listAssistants = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const limit = Number(req.query.limit) || 20;
    const data = await assistantsService.listAssistants(req.apiKey.id, limit);
    res.status(200).json(data);
  });

  deleteAssistant = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const data = await assistantsService.deleteAssistant(
      req.apiKey.id,
      String(req.params.id),
    );
    res.status(200).json(data);
  });

  createThread = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const data = await assistantsService.createThread(req.apiKey.id, req.body);
    res.status(200).json(data);
  });

  getThread = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const data = await assistantsService.getThread(
      req.apiKey.id,
      String(req.params.id),
    );
    res.status(200).json(data);
  });

  createMessage = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const body = req.body as { role?: string; content?: string };
    const content =
      typeof body.content === 'string'
        ? body.content
        : Array.isArray(body.content)
          ? JSON.stringify(body.content)
          : String(body.content ?? '');
    const data = await assistantsService.addMessage(
      req.apiKey.id,
      String(req.params.threadId),
      { role: body.role || 'user', content },
    );
    res.status(200).json(data);
  });

  listMessages = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const limit = Number(req.query.limit) || 50;
    const data = await assistantsService.listMessages(
      req.apiKey.id,
      String(req.params.threadId),
      limit,
    );
    res.status(200).json(data);
  });

  createRun = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const data = await assistantsService.createAndRun(
      req.apiKey,
      String(req.params.threadId),
      req.body || {},
      req.requestId,
      requestIp(req),
    );
    res.status(200).json(data);
  });
}

export const assistantsController = new AssistantsController();
