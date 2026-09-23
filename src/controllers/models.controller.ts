import type { Request, Response } from 'express';
import { modelsService } from '../services/models.service';
import { asyncHandler } from '../utils/async-handler';

export class ModelsController {
  list = asyncHandler(async (_req: Request, res: Response) => {
    const body = await modelsService.list();
    res.status(200).json(body);
  });

  get = asyncHandler(async (req: Request, res: Response) => {
    const model = await modelsService.get(String(req.params.model));
    res.status(200).json(model);
  });
}

export const modelsController = new ModelsController();
