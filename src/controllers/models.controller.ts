import type { Request, Response } from 'express';
import path from 'node:path';
import os from 'node:os';
import { modelsService } from '../services/models.service';
import { asyncHandler } from '../utils/async-handler';
import { pullModel } from '../services/hf/client';
import { recordPullIfOk } from '../services/hf/record-pull';
import { ExceptionFactory } from '../exceptions/exception.factory';

export class ModelsController {
  list = asyncHandler(async (_req: Request, res: Response) => {
    const body = await modelsService.list();
    res.status(200).json(body);
  });

  get = asyncHandler(async (req: Request, res: Response) => {
    const model = await modelsService.get(String(req.params.model));
    res.status(200).json(model);
  });

  pull = asyncHandler(async (req: Request, res: Response) => {
    const model = String(
      (req.body as { model?: string })?.model || '',
    ).trim();
    if (!model) {
      throw ExceptionFactory.validation('model is required');
    }
    res.status(200);
    res.setHeader('Content-Type', 'application/x-ndjson');
    const home = process.env.OMNI_HOME?.trim()
      ? path.resolve(process.env.OMNI_HOME.trim())
      : path.join(os.homedir(), '.ysk-omni');
    const destDir = path.join(home, 'models');
    const write = (obj: unknown) => {
      res.write(`${JSON.stringify(obj)}\n`);
    };
    const result = await pullModel(model, destDir, (p) => write(p));
    const entry = recordPullIfOk(
      model,
      result,
      path.join(home, 'registry.json'),
    );
    modelsService.clearCache();
    write({ status: result.status, entry, reason: result.reason });
    res.end();
  });
}

export const modelsController = new ModelsController();
