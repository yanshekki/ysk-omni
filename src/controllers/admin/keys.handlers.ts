import type { Request, Response } from 'express';
import type { AdminListQueryDto } from '../../dto/admin.dto';
import type { CreateKeyBody, UpdateKeyBody } from './types';
import { ExceptionFactory } from '../../exceptions/exception.factory';
import { asyncHandler } from '../../utils/async-handler';
import { apiKeyService } from '../../services/api-key.service';
import type { ApiKeyMode } from '../../interfaces';
import {
  normalizeApiKeyMode,
  normalizeApiKeyRole,
} from '../../utils/role-normalize';
import { requestIp } from '../../utils/client-ip';

/** Admin handlers: keys */
export const adminKeysHandlers = {
  listKeys: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as AdminListQueryDto & {
      role?: string;
      mode?: string;
      isActive?: string;
      all?: string;
    };
    const isActiveRaw = query.isActive;
    let isActive: boolean | undefined;
    if (isActiveRaw === 'true' || isActiveRaw === '1') isActive = true;
    if (isActiveRaw === 'false' || isActiveRaw === '0') isActive = false;
    const all =
      query.all === '1' || query.all === 'true' || query.all === 'yes';
    const result = await apiKeyService.list({
      q: query.q,
      role: query.role,
      mode: query.mode,
      isActive,
      limit: query.limit,
      offset: query.offset,
      all,
      sortBy: query.sortBy,
      sortDir: query.sortDir,
    });
    res.json({
      object: 'list',
      total: result.total,
      limit: result.limit,
      offset: result.offset,
      data: result.data,
    });
  }),

  createKey: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const body = req.body as CreateKeyBody;
    const role = normalizeApiKeyRole(body.role);
    const created = await apiKeyService.create({
      name: body.name,
      role,
      mode: normalizeApiKeyMode(role, body.mode),
      rateLimit: body.rateLimit,
      maxTurns: body.maxTurns,
      timeoutMs: body.timeoutMs,
      ipWhitelist: body.ipWhitelist,
      actorApiKeyId: req.apiKey.id,
      ip: requestIp(req),
    });
    res.status(201).json({ object: 'api_key', data: created });
  }),

  updateKey: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const body = req.body as UpdateKeyBody;
    const data = await apiKeyService.update(
      String(req.params.id),
      {
        name: body.name,
        role:
          body.role !== undefined
            ? normalizeApiKeyRole(body.role)
            : undefined,
        mode: body.mode as ApiKeyMode | undefined,
        rateLimit: body.rateLimit,
        isActive: body.isActive,
        maxTurns: body.maxTurns,
        timeoutMs: body.timeoutMs,
        ipWhitelist: body.ipWhitelist,
      },
      req.apiKey.id,
      requestIp(req),
    );
    res.json({ object: 'api_key', data });
  }),

  revokeKey: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    await apiKeyService.revoke(String(req.params.id), req.apiKey.id, requestIp(req));
    res.json({ object: 'api_key.deleted', id: req.params.id, deleted: true });
  }),

};
