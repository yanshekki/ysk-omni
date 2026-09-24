import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import {
  buildRuntimesReport,
  hostOs,
  installArgv,
  uninstallArgv,
} from '../../services/runtimes/runtime-catalog';
import {
  abortInstall,
  isInstallRunning,
  runPackageAction,
  type PackageAction,
} from '../../services/runtimes/runtime-install';
import { ExceptionFactory } from '../../exceptions/exception.factory';

async function streamPackageAction(
  req: Request,
  res: Response,
  action: PackageAction,
): Promise<void> {
  const id = String((req.body as { id?: string })?.id || '')
    .trim()
    .toLowerCase();
  if (!/^[a-z][a-z0-9]*$/.test(id)) {
    throw ExceptionFactory.validation('id is required');
  }
  const os = hostOs();
  const steps = action === 'uninstall' ? uninstallArgv(id, os) : installArgv(id, os);
  if (!steps.length) {
    throw ExceptionFactory.validation(
      `No one-click ${action} for ${id} on ${os}`,
    );
  }
  if (isInstallRunning()) {
    throw ExceptionFactory.serviceUnavailable(
      'A runtime install or uninstall is already running',
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
    await runPackageAction(id, action, write);
  } finally {
    req.removeListener('close', onClose);
    if (!res.writableEnded) res.end();
  }
}

export const adminRuntimesHandlers = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    res.status(200).json(buildRuntimesReport());
  }),

  install: asyncHandler(async (req: Request, res: Response) => {
    await streamPackageAction(req, res, 'install');
  }),

  uninstall: asyncHandler(async (req: Request, res: Response) => {
    await streamPackageAction(req, res, 'uninstall');
  }),
};
