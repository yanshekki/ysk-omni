import type { NextFunction, Request, Response } from 'express';
import {
  HttpException,
  toProtocolErrorBody,
} from '../exceptions/http.exception';
import { ExceptionFactory } from '../exceptions/exception.factory';
import { logger } from '../utils/logger';

function requestPath(req: Request): string {
  return req.originalUrl || req.url || req.path || '';
}

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(ExceptionFactory.notFound(`Route ${req.method} ${req.path}`));
}

export function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const path = requestPath(req);

  // CORS errors from cors package
  if (err instanceof Error && err.message.startsWith('CORS origin not allowed')) {
    const httpErr = ExceptionFactory.forbidden(err.message);
    res.status(httpErr.statusCode).json(toProtocolErrorBody(httpErr, path));
    return;
  }

  if (err instanceof HttpException) {
    if (err.statusCode >= 500) {
      logger.error(
        { err, requestId: req.requestId, path: req.path },
        err.message,
      );
    } else {
      logger.warn(
        { code: err.code, requestId: req.requestId, path: req.path },
        err.message,
      );
    }

    if (res.headersSent) {
      return;
    }

    res.status(err.statusCode).json(toProtocolErrorBody(err, path));
    return;
  }

  logger.error({ err, requestId: req.requestId, path: req.path }, 'Unhandled error');

  if (res.headersSent) {
    return;
  }

  const httpErr = ExceptionFactory.internal();
  res.status(httpErr.statusCode).json(toProtocolErrorBody(httpErr, path));
}
