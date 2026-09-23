import type { NextFunction, Request, Response } from 'express';
import { ExceptionFactory } from '../exceptions/exception.factory';
import { grokCliService } from '../services/grok-cli.service';

/**
 * Soft check before entering chat handler. Hard acquire still happens in ChatService.
 */
export function concurrencyGuard(_req: Request, _res: Response, next: NextFunction): void {
  if (grokCliService.activeCount >= grokCliService.maxConcurrent) {
    next(ExceptionFactory.concurrencyLimit());
    return;
  }
  next();
}
