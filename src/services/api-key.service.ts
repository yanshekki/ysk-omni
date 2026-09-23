import { prisma } from '../config/database';
import { AUDIT_ACTIONS, ROLES } from '../config/constants';
import type { ApiKeyCreatedEntity, ApiKeyPublicEntity } from '../entities';
import type {
  AuthenticatedApiKey,
  ApiKeyMode,
  ApiKeyRole,
} from '../interfaces';
import { ExceptionFactory } from '../exceptions/exception.factory';
import {
  apiKeyPrefix,
  createApiKeySecret,
  createId,
} from '../utils/id';
import {
  hashApiKeySha256,
  scryptHash,
  verifyApiKey,
} from '../utils/api-key-crypto';
import {
  normalizeApiKeyMode,
  normalizeApiKeyRole,
} from '../utils/role-normalize';
import { parseIpList, serializeIpList } from '../utils/ip-match';
import { auditService } from './audit.service';
import { resolveScalarOrderBy } from '../utils/list-sort';

const API_KEY_SORT_FIELDS = [
  'createdAt',
  'name',
  'role',
  'mode',
  'rateLimit',
  'isActive',
  'lastUsedAt',
] as const;

/** Re-export crypto helpers for callers that imported from this service. */
export {
  hashApiKey,
  hashApiKeySha256,
  scryptHash,
  verifyApiKey,
} from '../utils/api-key-crypto';

function mapPublic(r: {
  id: string;
  name: string;
  keyPrefix: string;
  role: string;
  mode: string;
  isActive: boolean;
  rateLimit: number;
  maxTurns: number | null;
  timeoutMs: number | null;
  ipWhitelist?: string | null;
  createdAt: Date;
  lastUsedAt: Date | null;
}): ApiKeyPublicEntity {
  return {
    id: r.id,
    name: r.name,
    keyPrefix: r.keyPrefix,
    role: normalizeApiKeyRole(r.role),
    mode: normalizeApiKeyMode(r.role, r.mode),
    isActive: r.isActive,
    rateLimit: r.rateLimit,
    maxTurns: r.maxTurns,
    timeoutMs: r.timeoutMs,
    ipWhitelist: parseIpList(r.ipWhitelist),
    createdAt: r.createdAt,
    lastUsedAt: r.lastUsedAt,
  };
}

export class ApiKeyService {
  async authenticate(rawKey: string): Promise<AuthenticatedApiKey> {
    if (!rawKey || rawKey.length < 16) {
      throw ExceptionFactory.unauthorized();
    }

    // Prefer O(1) legacy SHA-256 lookup; scrypt rows match via keyPrefix + verify
    const shaHash = hashApiKeySha256(rawKey);
    let record = await prisma.apiKey.findUnique({ where: { keyHash: shaHash } });

    if (!record) {
      const prefix = apiKeyPrefix(rawKey);
      const candidates = await prisma.apiKey.findMany({
        where: { keyPrefix: prefix, isActive: true },
        take: 20,
      });
      for (const row of candidates) {
        if (verifyApiKey(rawKey, row.keyHash)) {
          record = row;
          break;
        }
      }
    }

    if (!record || !record.isActive) {
      throw ExceptionFactory.unauthorized();
    }

    // Opportunistic migrate legacy SHA-256 → scrypt
    if (!record.keyHash.startsWith('scrypt$')) {
      const upgraded = scryptHash(rawKey);
      void prisma.apiKey
        .update({
          where: { id: record.id },
          data: { keyHash: upgraded, lastUsedAt: new Date() },
        })
        .catch(() => undefined);
    } else {
      void prisma.apiKey
        .update({
          where: { id: record.id },
          data: { lastUsedAt: new Date() },
        })
        .catch(() => undefined);
    }

    return {
      id: record.id,
      name: record.name,
      keyPrefix: record.keyPrefix,
      role: normalizeApiKeyRole(record.role),
      mode: normalizeApiKeyMode(record.role, record.mode),
      rateLimit: record.rateLimit,
      isActive: record.isActive,
      maxTurns: record.maxTurns,
      timeoutMs: record.timeoutMs,
      ipWhitelist: parseIpList(record.ipWhitelist),
    };
  }

  async create(input: {
    name: string;
    role?: ApiKeyRole;
    mode?: ApiKeyMode;
    rateLimit?: number;
    maxTurns?: number | null;
    timeoutMs?: number | null;
    ipWhitelist?: string[];
    actorApiKeyId?: string;
    ip?: string;
    rawKey?: string;
  }): Promise<ApiKeyCreatedEntity> {
    const key = input.rawKey ?? createApiKeySecret();
    const keyHash = scryptHash(key);
    const prefix = apiKeyPrefix(key);

    const existing = await prisma.apiKey.findUnique({ where: { keyHash } });
    if (existing) {
      throw ExceptionFactory.validation('API key already exists');
    }

    const id = createId();
    const role = normalizeApiKeyRole(input.role ?? ROLES.CLIENT);
    const mode = normalizeApiKeyMode(role, input.mode);

    const wl = input.ipWhitelist ? parseIpList(input.ipWhitelist) : [];

    const created = await prisma.apiKey.create({
      data: {
        id,
        name: input.name,
        keyPrefix: prefix,
        keyHash,
        role,
        mode,
        rateLimit: input.rateLimit ?? 60,
        maxTurns: input.maxTurns ?? null,
        timeoutMs: input.timeoutMs ?? null,
        ipWhitelist: serializeIpList(wl),
      },
    });

    await auditService.log({
      apiKeyId: input.actorApiKeyId ?? created.id,
      action: AUDIT_ACTIONS.API_KEY_CREATE,
      resource: 'api_key',
      resourceId: created.id,
      meta: {
        name: created.name,
        role: created.role,
        mode: created.mode,
        keyPrefix: prefix,
        ipWhitelist: wl,
      },
      ip: input.ip,
    });

    return { ...mapPublic(created), key };
  }

  async list(query?: {
    q?: string;
    role?: string;
    mode?: string;
    isActive?: boolean;
    limit?: number;
    offset?: number;
    all?: boolean;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
  }): Promise<{ data: ApiKeyPublicEntity[]; total: number; limit: number; offset: number }> {
    const where: {
      role?: string;
      mode?: string;
      isActive?: boolean;
      OR?: Array<Record<string, unknown>>;
    } = {};
    if (query?.role) where.role = query.role;
    if (query?.mode) where.mode = query.mode;
    if (query?.isActive !== undefined) where.isActive = query.isActive;
    const q = query?.q?.trim();
    if (q) {
      where.OR = [
        { name: { contains: q } },
        { keyPrefix: { contains: q } },
      ];
    }

    const orderBy = resolveScalarOrderBy(
      query?.sortBy,
      query?.sortDir,
      API_KEY_SORT_FIELDS,
      'createdAt',
    );

    const total = await prisma.apiKey.count({ where });
    if (query?.all) {
      const rows = await prisma.apiKey.findMany({
        where,
        orderBy,
      });
      return {
        data: rows.map(mapPublic),
        total,
        limit: total,
        offset: 0,
      };
    }

    const limit = Math.min(Math.max(query?.limit ?? 20, 1), 200);
    const offset = Math.max(query?.offset ?? 0, 0);
    const rows = await prisma.apiKey.findMany({
      where,
      orderBy,
      take: limit,
      skip: offset,
    });
    return {
      data: rows.map(mapPublic),
      total,
      limit,
      offset,
    };
  }

  /** Load key identity for admin playground (no raw secret). */
  async getByIdForAuth(id: string): Promise<AuthenticatedApiKey> {
    const record = await prisma.apiKey.findUnique({ where: { id } });
    if (!record || !record.isActive) {
      throw ExceptionFactory.notFound('API key');
    }
    return {
      id: record.id,
      name: record.name,
      keyPrefix: record.keyPrefix,
      role: normalizeApiKeyRole(record.role),
      mode: normalizeApiKeyMode(record.role, record.mode),
      rateLimit: record.rateLimit,
      isActive: record.isActive,
      maxTurns: record.maxTurns,
      timeoutMs: record.timeoutMs,
      ipWhitelist: parseIpList(record.ipWhitelist),
    };
  }

  async update(
    id: string,
    input: {
      name?: string;
      role?: ApiKeyRole;
      mode?: ApiKeyMode;
      rateLimit?: number;
      isActive?: boolean;
      maxTurns?: number | null;
      timeoutMs?: number | null;
      ipWhitelist?: string[] | null;
    },
    actorApiKeyId: string,
    ip?: string,
  ): Promise<ApiKeyPublicEntity> {
    const existing = await prisma.apiKey.findUnique({ where: { id } });
    if (!existing) {
      throw ExceptionFactory.notFound('API key');
    }

    const nextRole =
      input.role !== undefined
        ? normalizeApiKeyRole(input.role)
        : normalizeApiKeyRole(existing.role);
    const willRemainAdmin =
      nextRole === ROLES.ADMIN && input.isActive !== false && existing.isActive;
    if (
      existing.isActive &&
      normalizeApiKeyRole(existing.role) === ROLES.ADMIN &&
      !willRemainAdmin
    ) {
      await assertNotLastActiveAdmin(existing.id);
    }
    const nextMode =
      input.mode !== undefined || input.role !== undefined
        ? normalizeApiKeyMode(nextRole, input.mode ?? existing.mode)
        : undefined;

    const data: Record<string, unknown> = {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.role !== undefined ? { role: nextRole } : {}),
      ...(nextMode !== undefined ? { mode: nextMode } : {}),
      ...(input.rateLimit !== undefined ? { rateLimit: input.rateLimit } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
      ...(input.maxTurns !== undefined ? { maxTurns: input.maxTurns } : {}),
      ...(input.timeoutMs !== undefined ? { timeoutMs: input.timeoutMs } : {}),
    };
    if (input.ipWhitelist !== undefined) {
      data.ipWhitelist = serializeIpList(
        input.ipWhitelist === null ? [] : parseIpList(input.ipWhitelist),
      );
    }

    const updated = await prisma.apiKey.update({
      where: { id },
      data,
    });

    await auditService.log({
      apiKeyId: actorApiKeyId,
      action: AUDIT_ACTIONS.API_KEY_UPDATE,
      resource: 'api_key',
      resourceId: id,
      meta: input as Record<string, unknown>,
      ip,
    });

    return mapPublic(updated);
  }

  async revoke(id: string, actorApiKeyId: string, ip?: string): Promise<void> {
    const existing = await prisma.apiKey.findUnique({ where: { id } });
    if (!existing) {
      throw ExceptionFactory.notFound('API key');
    }
    if (
      existing.isActive &&
      normalizeApiKeyRole(existing.role) === ROLES.ADMIN
    ) {
      await assertNotLastActiveAdmin(existing.id);
    }

    await prisma.apiKey.update({
      where: { id },
      data: { isActive: false },
    });

    await auditService.log({
      apiKeyId: actorApiKeyId,
      action: AUDIT_ACTIONS.API_KEY_DELETE,
      resource: 'api_key',
      resourceId: id,
      meta: { keyPrefix: existing.keyPrefix },
      ip,
    });
  }
}

async function assertNotLastActiveAdmin(exceptId: string): Promise<void> {
  const others = await prisma.apiKey.count({
    where: {
      isActive: true,
      role: ROLES.ADMIN,
      id: { not: exceptId },
    },
  });
  if (others === 0) {
    throw ExceptionFactory.validation(
      'Cannot revoke or demote the last active admin API key',
    );
  }
}

export const apiKeyService = new ApiKeyService();
