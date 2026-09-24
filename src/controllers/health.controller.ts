import type { Request, Response } from 'express';
import { prisma } from '../config/database';
import { llamaServerBin } from '../services/runtimes/llama-server';
import { asyncHandler } from '../utils/async-handler';

export class HealthController {
  health = asyncHandler(async (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      service: 'ysk-omni',
      timestamp: new Date().toISOString(),
    });
  });

  ready = asyncHandler(async (_req: Request, res: Response) => {
    let dbOk = false;
    let textEngineOk = false;

    try {
      await prisma.$queryRaw`SELECT 1`;
      dbOk = true;
    } catch {
      dbOk = false;
    }

    textEngineOk = Boolean(llamaServerBin());

    const ready = dbOk;
    res.status(ready ? 200 : 503).json({
      status: ready ? 'ready' : 'not_ready',
      checks: {
        database: dbOk ? 'up' : 'down',
        text_engine: textEngineOk ? 'up' : 'down',
      },
      timestamp: new Date().toISOString(),
    });
  });
}

export const healthController = new HealthController();
