import type { Request, Response } from 'express';
import { prisma } from '../config/database';
import { grokCliService } from '../services/grok-cli.service';
import { asyncHandler } from '../utils/async-handler';

export class HealthController {
  health = asyncHandler(async (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      service: 'grok-openai-gateway',
      timestamp: new Date().toISOString(),
    });
  });

  ready = asyncHandler(async (_req: Request, res: Response) => {
    let dbOk = false;
    let grokOk = false;

    try {
      await prisma.$queryRaw`SELECT 1`;
      dbOk = true;
    } catch {
      dbOk = false;
    }

    grokOk = await grokCliService.isAvailable();

    const ready = dbOk;
    res.status(ready ? 200 : 503).json({
      status: ready ? 'ready' : 'not_ready',
      checks: {
        database: dbOk ? 'up' : 'down',
        grok_cli: grokOk ? 'up' : 'down',
      },
      timestamp: new Date().toISOString(),
    });
  });
}

export const healthController = new HealthController();
