/**
 * Shared in-process HTTP harness for API integration tests.
 */
import { randomBytes, randomUUID } from 'node:crypto';
import { execSync } from 'node:child_process';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { createApp } from '../../src/app';
import { prisma } from '../../src/config/database';
import { SETTING_KEYS } from '../../src/config/constants';
import { scryptHash, apiKeyPrefix } from '../../src/utils/api-key-crypto';
import { defaultQueuePolicy } from '../../src/services/queue/queue-policy.service';
import { queuePolicyService } from '../../src/services/queue/queue-policy.service';
import { apiFeaturesService } from '../../src/services/api-features.service';
import { settingsService } from '../../src/services/settings.service';
import { grokCliService } from '../../src/services/grok-cli.service';
import { vi } from 'vitest';

export type Harness = {
  baseUrl: string;
  server: Server;
  adminKey: string;
  adminKeyId: string;
  clientKey: string;
  clientKeyId: string;
  prefix: string;
};

export async function ensureMigrated(): Promise<boolean> {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    execSync('npx prisma@6.5.0 migrate deploy', {
      stdio: 'pipe',
      env: process.env,
      cwd: process.cwd(),
    });
    return true;
  } catch {
    return false;
  }
}

export async function seedApiKey(input: {
  name: string;
  role: 'admin' | 'client';
  mode?: 'safe' | 'agent';
  rateLimit?: number;
  rawKey?: string;
}): Promise<{ id: string; rawKey: string }> {
  const rawKey =
    input.rawKey || `gk_live_${randomBytes(24).toString('base64url')}`;
  const id = randomUUID();
  await prisma.apiKey.create({
    data: {
      id,
      name: input.name,
      keyPrefix: apiKeyPrefix(rawKey),
      keyHash: scryptHash(rawKey),
      role: input.role,
      mode: input.role === 'admin' ? 'agent' : input.mode || 'safe',
      rateLimit: input.rateLimit ?? 1000,
      isActive: true,
    },
  });
  return { id, rawKey };
}

/** Disable durable queue so chat runs in-process (with mocked Grok). */
export async function disableQueue(): Promise<void> {
  const policy = { ...defaultQueuePolicy(), enabled: false };
  await prisma.setting.upsert({
    where: { key: SETTING_KEYS.QUEUE_POLICY },
    create: { key: SETTING_KEYS.QUEUE_POLICY, value: JSON.stringify(policy) },
    update: { value: JSON.stringify(policy) },
  });
  await queuePolicyService.load();
}

export async function ensureAdminPanelOn(): Promise<void> {
  await prisma.setting.upsert({
    where: { key: SETTING_KEYS.ADMIN_PANEL_ENABLED },
    create: { key: SETTING_KEYS.ADMIN_PANEL_ENABLED, value: 'true' },
    update: { value: 'true' },
  });
  // settings service caches
  try {
    await settingsService.getAll();
  } catch {
    /* ignore */
  }
}

/** Mock Grok CLI stream so chat/messages/responses don't call the real binary. */
export function mockGrokStream(text = 'mock-assistant-reply'): void {
  vi.spyOn(grokCliService, 'tryAcquire').mockReturnValue(true);
  vi.spyOn(grokCliService, 'release').mockImplementation(() => undefined);
  vi.spyOn(grokCliService, 'stream').mockImplementation(async function* () {
    yield { type: 'text' as const, data: text };
    yield {
      type: 'end' as const,
      stopReason: 'end_turn',
      sessionId: 'sess_mock',
      requestId: 'req_mock',
      usage: { input_tokens: 3, output_tokens: 5, total_tokens: 8 },
    };
  });
  vi.spyOn(grokCliService, 'listModelsFromCli').mockResolvedValue([
    'grok-4.5',
    'grok-mock',
  ]);
  vi.spyOn(grokCliService, 'isAvailable').mockResolvedValue(true);
}

export function restoreGrokMocks(): void {
  vi.restoreAllMocks();
}

export async function startHarness(
  tag = 'api',
): Promise<Harness | null> {
  const ok = await ensureMigrated();
  if (!ok) return null;

  const prefix = `${tag}-${randomBytes(4).toString('hex')}`;
  await ensureAdminPanelOn();
  await disableQueue();

  const admin = await seedApiKey({
    name: `${prefix}-admin`,
    role: 'admin',
  });
  const client = await seedApiKey({
    name: `${prefix}-client`,
    role: 'client',
    mode: 'safe',
  });

  // Reset feature flags to defaults for isolation
  await apiFeaturesService.applyPreset('open');

  const app = createApp();
  const server = await new Promise<Server>((resolve) => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s));
  });
  const addr = server.address() as AddressInfo;
  return {
    baseUrl: `http://127.0.0.1:${addr.port}`,
    server,
    adminKey: admin.rawKey,
    adminKeyId: admin.id,
    clientKey: client.rawKey,
    clientKeyId: client.id,
    prefix,
  };
}

export async function stopHarness(h: Harness | null): Promise<void> {
  if (!h) {
    await prisma.$disconnect().catch(() => undefined);
    return;
  }
  await new Promise<void>((resolve, reject) => {
    h.server.close((err) => (err ? reject(err) : resolve()));
  });
  await prisma.apiKey
    .deleteMany({ where: { name: { startsWith: h.prefix } } })
    .catch(() => undefined);
  await prisma.$disconnect().catch(() => undefined);
  restoreGrokMocks();
}

export type FetchOpts = {
  method?: string;
  key?: string | null;
  body?: unknown;
  headers?: Record<string, string>;
  formData?: FormData;
};

export async function apiFetch(
  baseUrl: string,
  path: string,
  opts: FetchOpts = {},
): Promise<{ status: number; json: unknown; text: string; headers: Headers }> {
  const headers: Record<string, string> = { ...(opts.headers || {}) };
  if (opts.key) {
    headers.Authorization = `Bearer ${opts.key}`;
  }
  let body: BodyInit | undefined;
  if (opts.formData) {
    body = opts.formData;
  } else if (opts.body !== undefined) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    body = JSON.stringify(opts.body);
  }
  const res = await fetch(`${baseUrl}${path}`, {
    method: opts.method || 'GET',
    headers,
    body,
  });
  const text = await res.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  return { status: res.status, json, text, headers: res.headers };
}
