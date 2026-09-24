import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { buildRuntimesReport } from '../../services/runtimes/runtime-catalog';

export const adminRuntimesHandlers = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    res.status(200).json(buildRuntimesReport());
  }),
};
