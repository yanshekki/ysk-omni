import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import {
  buildRuntimesReport,
  hostOs,
  installArgv,
} from '../../services/runtimes/runtime-catalog';
import {
  abortInstall,
  isInstallRunning,
  runInstall,
} from '../../services/runtimes/runtime-install';
import { ExceptionFactory } from '../../exceptions/exception.factory';

export const adminRuntimesHandlers = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    res.status(200).json(buildRuntimesReport());
  }),

  install: asyncHandler(async (req: Request, res: Response) => {
    const id = String((req.body as { id?: string })?.id || '')
      .trim()
      .toLowerCase();
    if (!/^[a-z][a-z0-9]*$/.test(id)) {
      throw ExceptionFactory.validation('id is required');
    }
    const steps = installArgv(id, hostOs());
    if (!steps.length) {
      throw ExceptionFactory.validation(
        `No one-click install for ${id} on ${hostOs()}`,
      );
    }
    if (isInstallRunning()) {
      throw ExceptionFactory.serviceUnavailable(
        'A runtime install is already running',
      );
    }
    res.status(200);
    res.setHeader('Content-Type', 'application/x-ndjson');
    const write = (obj: unknown) => {
      if (!res.writableEnded) res.write(`${JSON.stringify(obj)}\n`);
    };
    const onClose = () => {
      if (!res.writableEnded) abortInstall();
    };
    req.on('close', onClose);
    try {
      await runInstall(id, write);
    } finally {
      req.removeListener('close', onClose);
      if (!res.writableEnded) res.end();
    }
  }),
};
