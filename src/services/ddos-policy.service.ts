import { prisma } from '../config/database';
import { env } from '../config/env';
import { SETTING_KEYS } from '../config/constants';
import {
  ddosPolicySchema,
  type DdosPolicyDto,
  type DdosPolicyUpdateDto,
} from '../dto/ddos.dto';
import { ipAllowed, normalizeIp, parseIpList } from '../utils/ip-match';
import {
  DEFAULT_TRUSTED_PROXIES,
  setProxyIpConfig,
  type ProxyIpSource,
} from '../utils/client-ip';

export type DdosPolicy = DdosPolicyDto;

function envProxySource(): ProxyIpSource {
  const s = env.PROXY_IP_SOURCE;
  if (
    s === 'cloudflare' ||
    s === 'nginx' ||
    s === 'x-forwarded-for' ||
    s === 'socket' ||
    s === 'auto'
  ) {
    return s;
  }
  return 'auto';
}

/** Env-backed balanced defaults (first boot / reset). */
export function defaultDdosPolicyFromEnv(): DdosPolicy {
  return {
    autoBanEnabled: true,

    rateLimitWindowMs: env.RATE_LIMIT_WINDOW_MS,
    rateLimitMax: env.RATE_LIMIT_MAX,
    rateLimitIpMax: env.RATE_LIMIT_IP_MAX,
    chatBurstWindowMs: 10_000,
    chatBurstMax: env.CHAT_BURST_MAX,

    autoAuthEnabled: true,
    failedAuthThreshold: env.BLOCK_FAILED_AUTH_THRESHOLD,
    failedAuthWindowMs: env.BLOCK_FAILED_AUTH_WINDOW_MS,
    authBanDurationMs: env.BLOCK_DURATION_MS,

    autoRateEnabled: true,
    rateHitThreshold: 30,
    rateHitWindowMs: 60_000,
    rateBanDurationMs: 900_000,

    autoConnEnabled: true,
    maxConcurrentPerIp: 20,
    connBanDurationMs: env.BLOCK_DURATION_MS,

    autoVelocityEnabled: true,
    velocityMaxRequests: 200,
    velocityWindowMs: 60_000,
    velocityBanDurationMs: env.BLOCK_DURATION_MS,

    escalateEnabled: true,
    escalateAfterBans: 3,
    escalateDurationMs: 24 * 60 * 60 * 1000,

    whitelist: ['127.0.0.1', '::1'],

    proxyTrustHops: env.trustProxyHops,
    proxyIpSource: envProxySource(),
    // Only loopback by default — remote nginx/CF edge must be listed explicitly
    trustedProxies: [...DEFAULT_TRUSTED_PROXIES],
  };
}

function applyProxyRuntime(policy: DdosPolicy): void {
  setProxyIpConfig({
    trustHops: policy.proxyTrustHops,
    source: policy.proxyIpSource,
    trustedProxies: policy.trustedProxies?.length
      ? policy.trustedProxies
      : [...DEFAULT_TRUSTED_PROXIES],
  });
}

export function ddosPreset(name: 'relaxed' | 'balanced' | 'strict'): DdosPolicy {
  const base = defaultDdosPolicyFromEnv();
  if (name === 'relaxed') {
    return {
      ...base,
      rateLimitMax: Math.max(base.rateLimitMax, 300),
      rateLimitIpMax: Math.max(base.rateLimitIpMax, 150),
      chatBurstMax: Math.max(base.chatBurstMax, 40),
      failedAuthThreshold: 50,
      authBanDurationMs: 5 * 60_000,
      rateHitThreshold: 80,
      rateBanDurationMs: 10 * 60_000,
      maxConcurrentPerIp: 50,
      connBanDurationMs: 5 * 60_000,
      velocityMaxRequests: 500,
      velocityBanDurationMs: 5 * 60_000,
      escalateEnabled: false,
      escalateAfterBans: 5,
    };
  }
  if (name === 'strict') {
    return {
      ...base,
      rateLimitMax: Math.min(base.rateLimitMax, 60),
      rateLimitIpMax: Math.min(base.rateLimitIpMax, 30),
      chatBurstMax: Math.min(base.chatBurstMax, 8),
      failedAuthThreshold: 8,
      failedAuthWindowMs: 10 * 60_000,
      authBanDurationMs: 60 * 60_000,
      rateHitThreshold: 10,
      rateHitWindowMs: 60_000,
      rateBanDurationMs: 2 * 60 * 60_000,
      maxConcurrentPerIp: 8,
      connBanDurationMs: 60 * 60_000,
      velocityMaxRequests: 80,
      velocityWindowMs: 60_000,
      velocityBanDurationMs: 60 * 60_000,
      escalateEnabled: true,
      escalateAfterBans: 2,
      escalateDurationMs: 7 * 24 * 60 * 60_000,
    };
  }
  return base;
}

function sanitizeWhitelist(list: string[] | undefined): string[] {
  if (!list) return [];
  return parseIpList(list);
}

function mergePolicy(raw: unknown, fallback: DdosPolicy): DdosPolicy {
  if (!raw || typeof raw !== 'object') return fallback;
  const merged = { ...fallback, ...(raw as Record<string, unknown>) };
  if (Array.isArray((raw as { whitelist?: unknown }).whitelist)) {
    merged.whitelist = sanitizeWhitelist(
      (raw as { whitelist: string[] }).whitelist,
    );
  }
  if (Array.isArray((raw as { trustedProxies?: unknown }).trustedProxies)) {
    merged.trustedProxies = sanitizeWhitelist(
      (raw as { trustedProxies: string[] }).trustedProxies,
    );
    if (!(merged.trustedProxies as string[]).length) {
      merged.trustedProxies = [...DEFAULT_TRUSTED_PROXIES];
    }
  }
  // Older saved policies without trustedProxies keep fallback (loopback)
  if (!Array.isArray(merged.trustedProxies)) {
    merged.trustedProxies = [...DEFAULT_TRUSTED_PROXIES];
  }
  const parsed = ddosPolicySchema.safeParse(merged);
  return parsed.success ? parsed.data : fallback;
}

type RebuildHook = () => void;

/** CLI may write policy to DB; reload so live gateway picks it up without restart. */
const POLICY_TTL_MS = 2_000;

export class DdosPolicyService {
  private cache: DdosPolicy | null = null;
  private loaded = false;
  private loadedAt = 0;
  private rebuildHooks: RebuildHook[] = [];

  onRebuild(hook: RebuildHook): void {
    this.rebuildHooks.push(hook);
  }

  private fireRebuild(): void {
    if (this.cache) applyProxyRuntime(this.cache);
    for (const h of this.rebuildHooks) {
      try {
        h();
      } catch {
        /* ignore */
      }
    }
  }

  /** Sync snapshot (env defaults until load completes). */
  getSync(): DdosPolicy {
    return this.cache ?? defaultDdosPolicyFromEnv();
  }

  async load(): Promise<DdosPolicy> {
    const fallback = defaultDdosPolicyFromEnv();
    try {
      const row = await prisma.setting.findUnique({
        where: { key: SETTING_KEYS.DDOS_POLICY },
      });
      if (row?.value) {
        try {
          this.cache = mergePolicy(JSON.parse(row.value), fallback);
        } catch {
          this.cache = fallback;
        }
      } else {
        this.cache = fallback;
      }
    } catch {
      this.cache = fallback;
    }
    this.loaded = true;
    this.loadedAt = Date.now();
    applyProxyRuntime(this.cache);
    this.fireRebuild();
    return this.cache;
  }

  async get(): Promise<DdosPolicy> {
    if (!this.loaded || !this.cache || Date.now() - this.loadedAt > POLICY_TTL_MS) {
      return this.load();
    }
    return this.cache;
  }

  async update(partial: DdosPolicyUpdateDto): Promise<DdosPolicy> {
    const current = await this.get();
    let trustedProxies = current.trustedProxies;
    if (partial.trustedProxies !== undefined) {
      trustedProxies = sanitizeWhitelist(partial.trustedProxies);
      if (!trustedProxies.length) {
        trustedProxies = [...DEFAULT_TRUSTED_PROXIES];
      }
    }
    const nextRaw = {
      ...current,
      ...partial,
      whitelist:
        partial.whitelist !== undefined
          ? sanitizeWhitelist(partial.whitelist)
          : current.whitelist,
      trustedProxies,
    };
    const parsed = ddosPolicySchema.parse(nextRaw);
    await prisma.setting.upsert({
      where: { key: SETTING_KEYS.DDOS_POLICY },
      create: {
        key: SETTING_KEYS.DDOS_POLICY,
        value: JSON.stringify(parsed),
      },
      update: { value: JSON.stringify(parsed) },
    });
    this.cache = parsed;
    this.loaded = true;
    this.loadedAt = Date.now();
    this.fireRebuild();
    return parsed;
  }

  async resetToEnvDefaults(): Promise<DdosPolicy> {
    return this.update(defaultDdosPolicyFromEnv());
  }

  isWhitelisted(ip: string): boolean {
    const policy = this.getSync();
    const list = policy.whitelist || [];
    if (!list.length) return false;
    // ipAllowed treats empty as allow-all; we want empty = nobody special
    return ipAllowed(ip, list);
  }

  summary(policy?: DdosPolicy) {
    const p = policy ?? this.getSync();
    return {
      autoBanEnabled: p.autoBanEnabled,
      autoAuthEnabled: p.autoAuthEnabled,
      autoRateEnabled: p.autoRateEnabled,
      autoConnEnabled: p.autoConnEnabled,
      autoVelocityEnabled: p.autoVelocityEnabled,
      escalateEnabled: p.escalateEnabled,
      whitelistCount: p.whitelist?.length ?? 0,
      rateLimitMax: p.rateLimitMax,
      rateLimitIpMax: p.rateLimitIpMax,
      maxConcurrentPerIp: p.maxConcurrentPerIp,
      velocityMaxRequests: p.velocityMaxRequests,
      proxyTrustHops: p.proxyTrustHops,
      proxyIpSource: p.proxyIpSource,
    };
  }
}

export const ddosPolicyService = new DdosPolicyService();

/** Normalize client IP for policy checks. */
export function policyClientIp(ip: string | undefined): string {
  return normalizeIp(ip || 'unknown');
}
