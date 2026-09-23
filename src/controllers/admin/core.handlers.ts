import type { Request, Response } from 'express';
import { prisma } from '../../config/database';
import { env } from '../../config/env';
import { AUDIT_ACTIONS } from '../../config/constants';
import type { UpdateSettingsBody } from './types';
import { ExceptionFactory } from '../../exceptions/exception.factory';
import { asyncHandler } from '../../utils/async-handler';
import { auditService } from '../../services/audit.service';
import { settingsService } from '../../services/settings.service';
import { statsService } from '../../services/stats.service';
import { updateService } from '../../services/update.service';
import { usageService } from '../../services/usage.service';
import { modelsService } from '../../services/models.service';
import { systemHealthService } from '../../services/system-health.service';
import { grokInspectService } from '../../services/grok-inspect.service';
import { grokSessionsService } from '../../services/grok-sessions.service';
import { grokCliService } from '../../services/grok-cli.service';
import { encryptionService } from '../../services/encryption.service';
import { requestIp } from '../../utils/client-ip';

/** Admin handlers: core */
export const adminCoreHandlers = {
  me: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    res.json({
      object: 'admin.me',
      data: {
        id: req.apiKey.id,
        name: req.apiKey.name,
        keyPrefix: req.apiKey.keyPrefix,
        role: req.apiKey.role,
        mode: req.apiKey.mode,
      },
    });
  }),

  stats: asyncHandler(async (_req: Request, res: Response) => {
    const data = await statsService.getDashboard();
    res.json({ object: 'admin.stats', data });
  }),

  usage: asyncHandler(async (req: Request, res: Response) => {
    const fromRaw = typeof req.query.from === 'string' ? req.query.from : undefined;
    const toRaw = typeof req.query.to === 'string' ? req.query.to : undefined;
    const from = fromRaw ? new Date(fromRaw) : undefined;
    const to = toRaw ? new Date(toRaw) : undefined;
    const sortBy =
      typeof req.query.sortBy === 'string' ? req.query.sortBy : undefined;
    const sortDirRaw =
      typeof req.query.sortDir === 'string' ? req.query.sortDir : undefined;
    const sortDir =
      sortDirRaw === 'asc' || sortDirRaw === 'desc' ? sortDirRaw : undefined;
    const modelSortBy =
      typeof req.query.modelSortBy === 'string'
        ? req.query.modelSortBy
        : undefined;
    const modelSortDirRaw =
      typeof req.query.modelSortDir === 'string'
        ? req.query.modelSortDir
        : undefined;
    const modelSortDir =
      modelSortDirRaw === 'asc' || modelSortDirRaw === 'desc'
        ? modelSortDirRaw
        : undefined;
    const data = await usageService.getSummary({
      from: from && !Number.isNaN(from.getTime()) ? from : undefined,
      to: to && !Number.isNaN(to.getTime()) ? to : undefined,
      sortBy,
      sortDir,
      modelSortBy,
      modelSortDir,
    });
    res.json({ object: 'admin.usage', data });
  }),

  models: asyncHandler(async (req: Request, res: Response) => {
    const refreshRaw = req.query.refresh;
    const refresh =
      refreshRaw === '1' || refreshRaw === 'true' || refreshRaw === 'yes';
    const data = await modelsService.getModelCatalog(refresh);
    const settings = await settingsService.getAll();
    res.json({
      object: 'admin.models',
      data: {
        ...data,
        defaultModel: settings.defaultModel || data.defaultModel,
      },
    });
  }),

  getSettings: asyncHandler(async (_req: Request, res: Response) => {
    const data = await settingsService.getAll();
    res.json({ object: 'admin.settings', data });
  }),

  updateSettings: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const body = req.body as UpdateSettingsBody;
    // Admin UI may only turn the panel OFF. Re-enable requires: gctoac admin on
    if (body.adminPanelEnabled === true) {
      throw ExceptionFactory.validation(
        'Cannot enable Admin panel from UI. Use CLI: gctoac admin on',
      );
    }
    const data = await settingsService.update(body);
    await auditService.log({
      apiKeyId: req.apiKey.id,
      action: AUDIT_ACTIONS.SETTINGS_UPDATE,
      resource: 'settings',
      meta: body as Record<string, unknown>,
      ip: requestIp(req),
    });
    res.json({ object: 'admin.settings', data });
  }),

  system: asyncHandler(async (_req: Request, res: Response) => {
    let dbOk = false;
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbOk = true;
    } catch {
      dbOk = false;
    }
    const grokOk = await grokCliService.isAvailable();
    let version = null as Awaited<
      ReturnType<typeof updateService.getVersionInfo>
    > | null;
    try {
      version = await updateService.getVersionInfo();
    } catch {
      version = null;
    }
    let software = null as Awaited<
      ReturnType<typeof systemHealthService.getSoftwareReport>
    > | null;
    try {
      software = await systemHealthService.getSoftwareReport();
    } catch {
      software = null;
    }
    let grokInspect = null as Awaited<
      ReturnType<typeof grokInspectService.snapshot>
    > | null;
    try {
      grokInspect = await grokInspectService.snapshot();
    } catch {
      grokInspect = null;
    }
    res.json({
      object: 'admin.system',
      data: {
        database: dbOk ? 'up' : 'down',
        grokCli: grokOk ? 'up' : 'down',
        grokInspect,
        concurrency: {
          active: grokCliService.activeCount,
          max: grokCliService.maxConcurrent,
        },
        version,
        software,
        updating: updateService.isUpdating(),
        env: {
          nodeEnv: env.NODE_ENV,
          grokSafeModeEnv: env.GROK_SAFE_MODE,
          grokDefaultModel: env.GROK_DEFAULT_MODEL,
          storageDir: env.storageDir,
          adminPanelEnabled: env.ADMIN_PANEL_ENABLED,
          port: env.PORT,
        },
        encryption: {
          ready: Boolean(encryptionService),
        },
      },
    });
  }),

  grokInspect: asyncHandler(async (_req: Request, res: Response) => {
    const data = await grokInspectService.snapshot();
    res.json({ object: 'admin.grok_inspect', data });
  }),

  grokSessionsList: asyncHandler(async (req: Request, res: Response) => {
    const q = typeof req.query.q === 'string' ? req.query.q : '';
    const cwd = typeof req.query.cwd === 'string' ? req.query.cwd : '';
    const limit = Number(req.query.limit);
    const offset = Number(req.query.offset);
    const result = await grokSessionsService.list({
      q,
      cwd,
      limit: Number.isFinite(limit) ? limit : undefined,
      offset: Number.isFinite(offset) ? offset : undefined,
    });
    res.json({
      object: 'admin.grok_sessions',
      data: result.data,
      total: result.total,
    });
  }),

  grokSessionsDelete: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const id = String(req.params.id || '');
    let data: { id: string; deleted: boolean };
    try {
      data = await grokSessionsService.delete(id);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      throw ExceptionFactory.validation(msg);
    }
    await auditService.log({
      apiKeyId: req.apiKey.id,
      action: AUDIT_ACTIONS.GROK_SESSION_DELETE,
      resource: 'grok_session',
      resourceId: id,
      ip: requestIp(req),
    });
    res.json({ object: 'admin.grok_session_deleted', data });
  }),

  checkUpdate: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const data = await updateService.getVersionInfo();
    await auditService.log({
      apiKeyId: req.apiKey.id,
      action: AUDIT_ACTIONS.SYSTEM_UPDATE_CHECK,
      resource: 'system',
      meta: {
        current: data.current,
        latest: data.latest,
        updateAvailable: data.updateAvailable,
      },
      ip: requestIp(req),
    });
    res.json({ object: 'admin.update_check', data });
  }),

  runUpdate: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const body = (req.body || {}) as {
      restart?: boolean;
      channel?: 'auto' | 'git' | 'npm-global' | 'npm-local';
    };
    const restart = body.restart !== false;

    await auditService.log({
      apiKeyId: req.apiKey.id,
      action: AUDIT_ACTIONS.SYSTEM_UPDATE,
      resource: 'system',
      meta: { restart, channel: body.channel || 'auto' },
      ip: requestIp(req),
    });

    if (restart) {
      const scheduled = updateService.scheduleUpdateAndRestart({
        home: process.env.GCTOAC_HOME,
        port: env.PORT,
      });
      res.json({
        object: 'admin.update',
        data: {
          ...scheduled,
          mode: 'scheduled_restart',
        },
      });
      return;
    }

    const result = await updateService.performUpdate({
      channel: body.channel || 'auto',
    });
    res.json({ object: 'admin.update', data: result });
  }),

};
