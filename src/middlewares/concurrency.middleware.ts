import type { NextFunction, Request, Response } from 'express';
import { ExceptionFactory } from '../exceptions/exception.factory';
import { engineSlotService } from '../services/engine-slot.service';

/**
 * Soft check before entering chat handler. Hard acquire still happens in ChatService.
 */
export function concurrencyGuard(_req: Request, _res: Response, next: NextFunction): void {
  if (engineSlotService.activeCount >= engineSlotService.maxConcurrent) {
    next(ExceptionFactory.concurrencyLimit());
    return;
  }
  next();
}
