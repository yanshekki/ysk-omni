import { z } from 'zod';

const ms = (min: number, max: number) => z.number().int().min(min).max(max);
const count = (min: number, max: number) => z.number().int().min(min).max(max);

/** Full DDoS / abuse-protection policy (runtime, Admin-editable). */
export const ddosPolicySchema = z.object({
  autoBanEnabled: z.boolean(),

  rateLimitWindowMs: ms(1_000, 3_600_000),
  rateLimitMax: count(1, 100_000),
  rateLimitIpMax: count(1, 100_000),
  chatBurstWindowMs: ms(1_000, 600_000),
  chatBurstMax: count(1, 10_000),

  autoAuthEnabled: z.boolean(),
  failedAuthThreshold: count(1, 10_000),
  failedAuthWindowMs: ms(1_000, 3_600_000),
  authBanDurationMs: ms(1_000, 30 * 24 * 3_600_000),

  autoRateEnabled: z.boolean(),
  rateHitThreshold: count(1, 10_000),
  rateHitWindowMs: ms(1_000, 3_600_000),
  rateBanDurationMs: ms(1_000, 30 * 24 * 3_600_000),

  autoConnEnabled: z.boolean(),
  maxConcurrentPerIp: count(1, 10_000),
  connBanDurationMs: ms(1_000, 30 * 24 * 3_600_000),

  autoVelocityEnabled: z.boolean(),
  velocityMaxRequests: count(1, 1_000_000),
  velocityWindowMs: ms(1_000, 3_600_000),
  velocityBanDurationMs: ms(1_000, 30 * 24 * 3_600_000),

  escalateEnabled: z.boolean(),
  escalateAfterBans: count(1, 100),
  escalateDurationMs: ms(1_000, 90 * 24 * 3_600_000),

  whitelist: z.array(z.string().min(1).max(64)).max(200),

  /**
   * Reverse proxy / CDN (nginx, Cloudflare).
   * trustHops 0 = ignore proxy headers; 1 = typical nginx or CF→app; 2 = CF→nginx→app.
   */
  proxyTrustHops: z.number().int().min(0).max(10),
  proxyIpSource: z.enum([
    'auto',
    'cloudflare',
    'nginx',
    'x-forwarded-for',
    'socket',
  ]),
  /**
   * IPs/CIDRs of reverse proxies allowed to set CF-Connecting-IP / X-Real-IP / XFF.
   * Default loopback only — direct clients cannot spoof headers.
   */
  trustedProxies: z.array(z.string().min(1).max(64)).max(200),
});

export type DdosPolicyDto = z.infer<typeof ddosPolicySchema>;

/** Partial update — all fields optional. */
export const ddosPolicyUpdateSchema = ddosPolicySchema.partial().extend({
  whitelist: z.array(z.string().min(1).max(64)).max(200).optional(),
  trustedProxies: z.array(z.string().min(1).max(64)).max(200).optional(),
});

export type DdosPolicyUpdateDto = z.infer<typeof ddosPolicyUpdateSchema>;
