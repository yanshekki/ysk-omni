import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { env } from '../config/env';
import {
  HttpException,
  toProtocolErrorBody,
} from '../exceptions/http.exception';
import { ExceptionFactory } from '../exceptions/exception.factory';
import { logger } from '../utils/logger';

function toHttpException(err: unknown): HttpException | undefined {
  if (err instanceof HttpException) return err;
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return ExceptionFactory.documentTooLarge(env.UPLOAD_MAX_BYTES);
    }
    return ExceptionFactory.validation(err.message);
  }
  return undefined;
}

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

  const httpErr = toHttpException(err);
  if (httpErr) {
    if (httpErr.statusCode >= 500) {
      logger.error(
        { err, requestId: req.requestId, path: req.path },
        httpErr.message,
      );
    } else {
      logger.warn(
        { code: httpErr.code, requestId: req.requestId, path: req.path },
        httpErr.message,
      );
    }

    if (res.headersSent) {
      return;
    }

    res.status(httpErr.statusCode).json(toProtocolErrorBody(httpErr, path));
    return;
  }

  logger.error({ err, requestId: req.requestId, path: req.path }, 'Unhandled error');

  if (res.headersSent) {
    return;
  }

  const fallback = ExceptionFactory.internal();
  res.status(fallback.statusCode).json(toProtocolErrorBody(fallback, path));
}
