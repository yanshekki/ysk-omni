import type { NextFunction, Request, Response } from 'express';
import { createRequestId } from '../utils/id';

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const incoming = req.header('x-request-id');
  const requestId =
    incoming && /^[a-zA-Z0-9_-]{8,128}$/.test(incoming) ? incoming : createRequestId();
  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
}
