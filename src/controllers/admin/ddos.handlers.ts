import type { Request, Response } from 'express';
import { AUDIT_ACTIONS } from '../../config/constants';
import type { IpBanBody } from './types';
import { ExceptionFactory } from '../../exceptions/exception.factory';
import { asyncHandler } from '../../utils/async-handler';
import { auditService } from '../../services/audit.service';
import { ipBlacklistService } from '../../services/ip-blacklist.service';
import {
  ddosPolicyService,
  defaultDdosPolicyFromEnv,
  ddosPreset,
} from '../../services/ddos-policy.service';
import { abuseGuardService } from '../../services/abuse-guard.service';
import {
  getAbuseCounters,
  getConnectionsSnapshot,
} from '../../middlewares/connection-tracker.middleware';
import type { DdosPolicyUpdateDto } from '../../dto/ddos.dto';
import { normalizeIp } from '../../utils/ip-match';
import { requestIp } from '../../utils/client-ip';
import { sortInMemory } from '../../utils/list-sort';

function parseSortQuery(req: Request): {
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
} {
  const sortBy =
    typeof req.query.sortBy === 'string' ? req.query.sortBy : undefined;
  const raw =
    typeof req.query.sortDir === 'string' ? req.query.sortDir : undefined;
  const sortDir = raw === 'asc' || raw === 'desc' ? raw : undefined;
  return { sortBy, sortDir };
}

/** Admin handlers: ddos */
export const adminDdosHandlers = {
  ddosConnections: asyncHandler(async (req: Request, res: Response) => {
    const { sortBy, sortDir } = parseSortQuery(req);
    const snap = getConnectionsSnapshot();
    const active = sortInMemory(
      snap.active,
      sortBy,
      sortDir,
      {
        startedAt: (r) => r.startedAt,
        ip: (r) => r.ip,
        method: (r) => r.method,
        path: (r) => r.path,
        durationMs: (r) =>
          r.durationMs ??
          (r.startedAt ? Date.now() - r.startedAt : 0),
      },
      'startedAt',
    );
    const recent = sortInMemory(
      snap.recent,
      sortBy,
      sortDir,
      {
        startedAt: (r) => r.startedAt,
        finishedAt: (r) => r.finishedAt ?? r.startedAt,
        ip: (r) => r.ip,
        method: (r) => r.method,
        path: (r) => r.path,
        durationMs: (r) => r.durationMs ?? 0,
        statusCode: (r) => r.statusCode ?? 0,
      },
      'startedAt',
    );
    res.json({
      object: 'admin.ddos.connections',
      data: { ...snap, active, recent },
    });
  }),

  ddosBlacklist: asyncHandler(async (req: Request, res: Response) => {
    const { sortBy, sortDir } = parseSortQuery(req);
    const items = await ipBlacklistService.list({ sortBy, sortDir });
    res.json({ object: 'list', data: items });
  }),

  ddosBan: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const body = req.body as IpBanBody;
    const ip = normalizeIp(body.ip);
    let expiresAt: Date | null = null;
    if (body.ttlSeconds != null && body.ttlSeconds > 0) {
      expiresAt = new Date(Date.now() + body.ttlSeconds * 1000);
    }
    const row = await ipBlacklistService.ban({
      ip,
      reason: body.reason,
      source: 'manual',
      expiresAt,
      createdBy: req.apiKey.id,
    });
    await auditService.log({
      apiKeyId: req.apiKey.id,
      action: AUDIT_ACTIONS.IP_BAN,
      resource: 'ip_blacklist',
      resourceId: row.id,
      meta: { ip, reason: body.reason, expiresAt },
      ip: requestIp(req),
    });
    res.status(201).json({ object: 'admin.ddos.ban', data: row });
  }),

  ddosUnban: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const ip = normalizeIp(decodeURIComponent(String(req.params.ip || '')));
    await ipBlacklistService.unban(ip);
    await auditService.log({
      apiKeyId: req.apiKey.id,
      action: AUDIT_ACTIONS.IP_UNBAN,
      resource: 'ip_blacklist',
      meta: { ip },
      ip: requestIp(req),
    });
    res.json({ object: 'admin.ddos.unban', ip, deleted: true });
  }),

  ddosStats: asyncHandler(async (_req: Request, res: Response) => {
    const counters = getAbuseCounters();
    const snap = getConnectionsSnapshot();
    const policy = await ddosPolicyService.get();
    // top IPs from recent
    const counts = new Map<string, number>();
    for (const c of snap.recent) {
      counts.set(c.ip, (counts.get(c.ip) || 0) + 1);
    }
    const topIps = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([ip, n]) => ({
        ip,
        requests: n,
        concurrent: abuseGuardService.getConcurrent(ip),
      }));
    res.json({
      object: 'admin.ddos.stats',
      data: {
        ...counters,
        activeConnections: snap.counts.active,
        topIps,
        autoBanTotal: abuseGuardService.getAutoBanTotal(),
        policySummary: ddosPolicyService.summary(policy),
      },
    });
  }),

  ddosPolicyGet: asyncHandler(async (_req: Request, res: Response) => {
    const policy = await ddosPolicyService.get();
    res.json({
      object: 'admin.ddos.policy',
      data: policy,
      defaults: defaultDdosPolicyFromEnv(),
      presets: {
        relaxed: ddosPreset('relaxed'),
        balanced: ddosPreset('balanced'),
        strict: ddosPreset('strict'),
      },
    });
  }),

  ddosPolicyPut: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const body = req.body as DdosPolicyUpdateDto;
    const policy = await ddosPolicyService.update(body);
    await auditService.log({
      apiKeyId: req.apiKey.id,
      action: AUDIT_ACTIONS.DDOS_POLICY_UPDATE,
      resource: 'ddos_policy',
      meta: { keys: Object.keys(body || {}) },
      ip: requestIp(req),
    });
    res.json({ object: 'admin.ddos.policy', data: policy });
  }),

  ddosPolicyReset: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const policy = await ddosPolicyService.resetToEnvDefaults();
    await auditService.log({
      apiKeyId: req.apiKey.id,
      action: AUDIT_ACTIONS.DDOS_POLICY_UPDATE,
      resource: 'ddos_policy',
      meta: { reset: true },
      ip: requestIp(req),
    });
    res.json({ object: 'admin.ddos.policy', data: policy, reset: true });
  }),

  ddosEvents: asyncHandler(async (req: Request, res: Response) => {
    const { sortBy, sortDir } = parseSortQuery(req);
    const events = sortInMemory(
      abuseGuardService.getEvents(100),
      sortBy,
      sortDir,
      {
        at: (r) => r.at,
        createdAt: (r) => r.at,
        ip: (r) => r.ip,
        source: (r) => r.source,
        reason: (r) => r.reason,
        durationMs: (r) => r.durationMs ?? 0,
      },
      'at',
    );
    res.json({
      object: 'list',
      data: events.slice(0, 50),
      total: abuseGuardService.getAutoBanTotal(),
    });
  }),

};
