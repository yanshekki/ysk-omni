import { randomUUID } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import type { ApiKeyMode, ApiKeyRole } from '../../interfaces';
import {
  apiKeyPrefix,
  createApiKeySecret,
  hashApiKey,
} from '../../utils/api-key-crypto';
import {
  normalizeApiKeyMode,
  normalizeApiKeyRole,
} from '../../utils/role-normalize';
import {
  parseModelList,
  serializeModelList,
} from '../../utils/model-allowlist';

/** @deprecated Use normalizeApiKeyRole from utils/role-normalize */
export const normalizeKeyRole = normalizeApiKeyRole;

export type { ApiKeyRole, ApiKeyMode };

export interface CreatedKey {
  id: string;
  name: string;
  role: ApiKeyRole;
  mode: ApiKeyMode;
  keyPrefix: string;
  rawKey: string;
  rateLimit: number;
  allowedModels: string[];
}

export interface ListedKey {
  id: string;
  name: string;
  role: string;
  mode: string;
  keyPrefix: string;
  isActive: boolean;
  rateLimit: number;
  createdAt: Date;
  lastUsedAt: Date | null;
  allowedModels: string[];
}

function openPrisma(databaseUrl: string): PrismaClient {
  return new PrismaClient({
    datasources: { db: { url: databaseUrl } },
  });
}

export async function createKey(options: {
  databaseUrl: string;
  name?: string;
  role?: ApiKeyRole | string;
  mode?: ApiKeyMode;
  rateLimit?: number;
  rawKey?: string;
  allowedModels?: string[];
}): Promise<CreatedKey> {
  const role = normalizeApiKeyRole(options.role);
  const mode = normalizeApiKeyMode(role, options.mode);
  const name =
    options.name?.trim() ||
    (role === 'admin'
      ? `admin-${new Date().toISOString().slice(0, 10)}`
      : 'client');
  const rateLimit = options.rateLimit ?? 120;
  const rawKey = options.rawKey?.trim() || createApiKeySecret();
  const keyHash = hashApiKey(rawKey);
  const keyPrefix = apiKeyPrefix(rawKey);

  const prisma = openPrisma(options.databaseUrl);
  try {
    await prisma.apiKey.updateMany({
      where: { role: 'user' },
      data: { role: 'client' },
    });

    const existing = await prisma.apiKey.findUnique({ where: { keyHash } });
    if (existing) {
      throw new Error('Generated key collides with an existing hash — retry');
    }

    const created = await prisma.apiKey.create({
      data: {
        id: randomUUID(),
        name,
        keyPrefix,
        keyHash,
        role,
        mode,
        rateLimit,
        isActive: true,
        allowedModels: serializeModelList(options.allowedModels),
      },
    });

    return {
      id: created.id,
      name: created.name,
      role,
      mode,
      keyPrefix: created.keyPrefix,
      rawKey,
      rateLimit: created.rateLimit,
      allowedModels: parseModelList(created.allowedModels),
    };
  } finally {
    await prisma.$disconnect();
  }
}

function mapListed(row: {
  id: string;
  name: string;
  role: string;
  mode: string;
  keyPrefix: string;
  isActive: boolean;
  rateLimit: number;
  createdAt: Date;
  lastUsedAt: Date | null;
  allowedModels?: string | null;
}): ListedKey {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    mode: row.mode,
    keyPrefix: row.keyPrefix,
    isActive: row.isActive,
    rateLimit: row.rateLimit,
    createdAt: row.createdAt,
    lastUsedAt: row.lastUsedAt,
    allowedModels: parseModelList(row.allowedModels),
  };
}

const listedSelect = {
  id: true,
  name: true,
  role: true,
  mode: true,
  keyPrefix: true,
  isActive: true,
  rateLimit: true,
  createdAt: true,
  lastUsedAt: true,
  allowedModels: true,
} as const;

export async function listKeys(databaseUrl: string): Promise<ListedKey[]> {
  const prisma = openPrisma(databaseUrl);
  try {
    const rows = await prisma.apiKey.findMany({
      orderBy: { createdAt: 'desc' },
      select: listedSelect,
    });
    return rows.map(mapListed);
  } finally {
    await prisma.$disconnect();
  }
}

export async function revokeKey(
  databaseUrl: string,
  id: string,
): Promise<boolean> {
  const prisma = openPrisma(databaseUrl);
  try {
    const row = await prisma.apiKey.findUnique({ where: { id } });
    if (!row) return false;
    if (row.isActive && row.role === 'admin') {
      const others = await prisma.apiKey.count({
        where: { isActive: true, role: 'admin', id: { not: id } },
      });
      if (others === 0) {
        throw new Error('Cannot revoke the last active admin API key');
      }
    }
    await prisma.apiKey.update({
      where: { id },
      data: { isActive: false },
    });
    return true;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getKey(
  databaseUrl: string,
  id: string,
): Promise<ListedKey | null> {
  const prisma = openPrisma(databaseUrl);
  try {
    const row = await prisma.apiKey.findUnique({
      where: { id },
      select: listedSelect,
    });
    return row ? mapListed(row) : null;
  } finally {
    await prisma.$disconnect();
  }
}

export async function updateKey(
  databaseUrl: string,
  id: string,
  input: {
    name?: string;
    role?: ApiKeyRole | string;
    mode?: ApiKeyMode;
    rateLimit?: number;
    isActive?: boolean;
    maxTurns?: number | null;
    timeoutMs?: number | null;
    allowedModels?: string[] | null;
  },
): Promise<ListedKey | null> {
  const prisma = openPrisma(databaseUrl);
  try {
    const existing = await prisma.apiKey.findUnique({ where: { id } });
    if (!existing) return null;

    const data: Record<string, unknown> = {};
    if (input.name !== undefined) data.name = input.name.trim();
    if (input.role !== undefined) data.role = normalizeApiKeyRole(input.role);
    if (input.mode !== undefined) {
      const role = (data.role as string) || existing.role;
      data.mode = normalizeApiKeyMode(role, input.mode);
    } else if (
      input.role !== undefined &&
      normalizeApiKeyRole(input.role) === 'admin'
    ) {
      data.mode = 'agent';
    }
    if (input.rateLimit !== undefined) data.rateLimit = input.rateLimit;
    if (input.isActive !== undefined) data.isActive = input.isActive;
    if (input.maxTurns !== undefined) data.maxTurns = input.maxTurns;
    if (input.timeoutMs !== undefined) data.timeoutMs = input.timeoutMs;
    if (input.allowedModels !== undefined) {
      data.allowedModels = serializeModelList(
        input.allowedModels === null ? [] : input.allowedModels,
      );
    }

    if (!Object.keys(data).length) {
      return mapListed(existing);
    }

    const updated = await prisma.apiKey.update({
      where: { id },
      data,
      select: listedSelect,
    });
    return mapListed(updated);
  } finally {
    await prisma.$disconnect();
  }
}

export async function activateKey(
  databaseUrl: string,
  id: string,
): Promise<boolean> {
  const prisma = openPrisma(databaseUrl);
  try {
    const row = await prisma.apiKey.findUnique({ where: { id } });
    if (!row) return false;
    await prisma.apiKey.update({
      where: { id },
      data: { isActive: true },
    });
    return true;
  } finally {
    await prisma.$disconnect();
  }
}
