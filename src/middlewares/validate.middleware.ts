import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';
import { ExceptionFactory } from '../exceptions/exception.factory';

type Target = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, target: Target = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      const details = result.error.issues.map((i) => ({
        path: i.path.join('.'),
        message: i.message,
      }));
      next(ExceptionFactory.validation('Request validation failed', details));
      return;
    }

    // Replace untyped input with Zod-parsed data
    if (target === 'body') {
      req.body = result.data;
    } else if (target === 'query') {
      // Express query is read-only in types; assign via index for validated data
      Object.defineProperty(req, 'query', {
        value: result.data,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    } else {
      Object.defineProperty(req, 'params', {
        value: result.data,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    }
    next();
  };
}
