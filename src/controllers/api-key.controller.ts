import type { Request, Response } from 'express';
import type { CreateApiKeyDto } from '../dto/api-key.dto';
import { AUDIT_ACTIONS } from '../config/constants';
import { ExceptionFactory } from '../exceptions/exception.factory';
import { apiKeyService } from '../services/api-key.service';
import { auditService } from '../services/audit.service';
import { asyncHandler } from '../utils/async-handler';
import {
  normalizeApiKeyMode,
  normalizeApiKeyRole,
} from '../utils/role-normalize';
import { requestIp } from '../utils/client-ip';

export class ApiKeyController {
  create = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) {
      throw ExceptionFactory.unauthorized();
    }
    const dto = req.body as CreateApiKeyDto;
    const role = normalizeApiKeyRole(dto.role);
    const created = await apiKeyService.create({
      name: dto.name,
      role,
      mode: normalizeApiKeyMode(role, dto.mode),
      rateLimit: dto.rateLimit,
      actorApiKeyId: req.apiKey.id,
      ip: requestIp(req),
    });
    res.status(201).json({ object: 'api_key', data: created });
  });

  list = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) {
      throw ExceptionFactory.unauthorized();
    }
    const items = await apiKeyService.list();
    await auditService.log({
      apiKeyId: req.apiKey.id,
      action: AUDIT_ACTIONS.API_KEY_LIST,
      resource: 'api_key',
      ip: requestIp(req),
    });
    res.status(200).json({ object: 'list', data: items });
  });

  revoke = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) {
      throw ExceptionFactory.unauthorized();
    }
    await apiKeyService.revoke(String(req.params.id), req.apiKey.id, requestIp(req));
    res.status(200).json({ object: 'api_key.deleted', id: req.params.id, deleted: true });
  });
}

export const apiKeyController = new ApiKeyController();
