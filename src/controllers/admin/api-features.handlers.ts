import type { Request, Response } from 'express';
import { AUDIT_ACTIONS } from '../../config/constants';
import { ExceptionFactory } from '../../exceptions/exception.factory';
import { asyncHandler } from '../../utils/async-handler';
import { auditService } from '../../services/audit.service';
import { apiFeaturesService } from '../../services/api-features.service';
import {
  DEFAULT_API_FEATURES,
  type ApiFeatures,
} from '../../interfaces/api-features.type';
import { requestIp } from '../../utils/client-ip';

export const adminApiFeaturesHandlers = {
  get: asyncHandler(async (_req: Request, res: Response) => {
    const data = await apiFeaturesService.get();
    res.json({
      object: 'admin.api_features',
      data,
      defaults: DEFAULT_API_FEATURES,
      flags: Object.keys(DEFAULT_API_FEATURES),
    });
  }),

  put: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const body = (req.body || {}) as Partial<ApiFeatures>;
    const partial: Partial<ApiFeatures> = {};
    for (const key of Object.keys(DEFAULT_API_FEATURES) as (keyof ApiFeatures)[]) {
      if (typeof body[key] === 'boolean') {
        partial[key] = body[key];
      }
    }
    if (!Object.keys(partial).length) {
      throw ExceptionFactory.validation('No valid boolean feature flags in body');
    }
    const data = await apiFeaturesService.update(partial);
    await auditService.log({
      apiKeyId: req.apiKey.id,
      action: AUDIT_ACTIONS.API_FEATURES_UPDATE,
      resource: 'api_features',
      meta: partial as Record<string, unknown>,
      ip: requestIp(req),
    });
    res.json({ object: 'admin.api_features', data });
  }),

  preset: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const name = String((req.body as { name?: string })?.name || '').toLowerCase();
    if (name !== 'open' && name !== 'locked' && name !== 'dev') {
      throw ExceptionFactory.validation('name must be open | locked | dev');
    }
    const data = await apiFeaturesService.applyPreset(name);
    await auditService.log({
      apiKeyId: req.apiKey.id,
      action: AUDIT_ACTIONS.API_FEATURES_UPDATE,
      resource: 'api_features',
      meta: { preset: name },
      ip: requestIp(req),
    });
    res.json({ object: 'admin.api_features', data, preset: name });
  }),
};
