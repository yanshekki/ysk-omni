import type { Request, Response } from 'express';
import { env } from '../../config/env';
import { AUDIT_ACTIONS } from '../../config/constants';
import { ExceptionFactory } from '../../exceptions/exception.factory';
import { asyncHandler } from '../../utils/async-handler';
import { auditService } from '../../services/audit.service';
import { pm2Service } from '../../services/pm2.service';
import { requestIp } from '../../utils/client-ip';

/** Admin handlers: pm2 */
export const adminPm2Handlers = {
  pm2Status: asyncHandler(async (_req: Request, res: Response) => {
    const data = await pm2Service.status();
    res.json({ object: 'admin.pm2.status', data });
  }),

  pm2Start: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    // Prefer scheduled switch so this process can hand off cleanly
    const scheduled = pm2Service.scheduleSwitch('pm2', {
      home: process.env.GCTOAC_HOME,
      port: env.PORT,
    });
    await auditService.log({
      apiKeyId: req.apiKey.id,
      action: AUDIT_ACTIONS.PM2_START,
      resource: 'pm2',
      meta: { scheduled: true },
      ip: requestIp(req),
    });
    res.json({ object: 'admin.pm2.start', data: scheduled });
  }),

  pm2Stop: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const out = await pm2Service.stop();
    await auditService.log({
      apiKeyId: req.apiKey.id,
      action: AUDIT_ACTIONS.PM2_STOP,
      resource: 'pm2',
      ip: requestIp(req),
    });
    res.json({ object: 'admin.pm2.stop', data: out });
  }),

  pm2Restart: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const out = await pm2Service.restart();
    await auditService.log({
      apiKeyId: req.apiKey.id,
      action: AUDIT_ACTIONS.PM2_RESTART,
      resource: 'pm2',
      ip: requestIp(req),
    });
    res.json({ object: 'admin.pm2.restart', data: out });
  }),

  pm2Reload: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const out = await pm2Service.reload();
    await auditService.log({
      apiKeyId: req.apiKey.id,
      action: AUDIT_ACTIONS.PM2_RELOAD,
      resource: 'pm2',
      ip: requestIp(req),
    });
    res.json({ object: 'admin.pm2.reload', data: out });
  }),

  pm2Logs: asyncHandler(async (req: Request, res: Response) => {
    const raw = Number(req.query.lines);
    const lines = Number.isFinite(raw)
      ? Math.min(2000, Math.max(1, Math.floor(raw)))
      : 100;
    const out = await pm2Service.logs(lines);
    res.json({ object: 'admin.pm2.logs', data: out });
  }),

  pm2ClearLogs: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const body = (req.body || {}) as { which?: string };
    const which =
      body.which === 'error' || body.which === 'out' ? body.which : 'all';
    const out = await pm2Service.clearLogs({ which });
    await auditService.log({
      apiKeyId: req.apiKey.id,
      action: AUDIT_ACTIONS.PM2_CONFIG,
      resource: 'pm2_logs',
      meta: {
        cleared: out.cleared.map((c) => c.label),
        which,
      },
      ip: requestIp(req),
    });
    res.json({ object: 'admin.pm2.logs.clear', data: out });
  }),

  pm2GetConfig: asyncHandler(async (_req: Request, res: Response) => {
    res.json({
      object: 'admin.pm2.config',
      data: { config: pm2Service.getConfig() },
    });
  }),

  pm2SaveConfig: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const body = (req.body || {}) as Record<string, unknown>;
    const restart = body.restart !== false;
    const port =
      body.port != null && body.port !== ''
        ? Number(body.port)
        : undefined;
    const { restart: _r, port: _p, ...cfgBody } = body;
    const out = await pm2Service.applyConfig(cfgBody, { restart, port });
    await auditService.log({
      apiKeyId: req.apiKey.id,
      action: AUDIT_ACTIONS.PM2_CONFIG,
      resource: 'pm2',
      meta: {
        restart,
        name: out.config.name,
        port: out.port,
        portChanged: Boolean(out.portChange),
      },
      ip: requestIp(req),
    });
    res.json({ object: 'admin.pm2.config', data: out });
  }),

  pm2ResetConfig: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const config = pm2Service.resetConfig();
    await auditService.log({
      apiKeyId: req.apiKey.id,
      action: AUDIT_ACTIONS.PM2_CONFIG,
      resource: 'pm2',
      meta: { reset: true },
      ip: requestIp(req),
    });
    res.json({ object: 'admin.pm2.config', data: { config, reset: true } });
  }),

  pm2Switch: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const body = (req.body || {}) as { mode?: string };
    const mode = body.mode === 'pm2' ? 'pm2' : body.mode === 'gctoac' ? 'gctoac' : null;
    if (!mode) {
      throw ExceptionFactory.validation('mode must be "pm2" or "gctoac"');
    }
    const scheduled = pm2Service.scheduleSwitch(mode, {
      home: process.env.GCTOAC_HOME,
      port: env.PORT,
    });
    await auditService.log({
      apiKeyId: req.apiKey.id,
      action: AUDIT_ACTIONS.PM2_SWITCH,
      resource: 'pm2',
      meta: { mode },
      ip: requestIp(req),
    });
    res.json({ object: 'admin.pm2.switch', data: scheduled });
  }),

};
