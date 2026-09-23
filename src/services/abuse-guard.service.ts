import {
  AUDIT_ACTIONS,
  BAN_SOURCES,
  type BanSource,
} from '../config/constants';
import type { AutoBanEvent } from '../interfaces/auto-ban-event.interface';
import { ddosPolicyService } from './ddos-policy.service';
import { auditService } from './audit.service';
import { normalizeIp } from '../utils/ip-match';

/** Lazy to avoid cycle: connection-tracker → abuse-guard → ip-blacklist → connection-tracker */
async function getIpBlacklist() {
  const m = await import('./ip-blacklist.service');
  return m.ipBlacklistService;
}


const MAX_EVENTS = 50;
const events: AutoBanEvent[] = [];
let autoBanTotal = 0;

/** Sliding window of timestamps per key. */
class SlidingWindow {
  private hits = new Map<string, number[]>();

  count(key: string, windowMs: number, now = Date.now()): number {
    const arr = (this.hits.get(key) || []).filter((t) => now - t < windowMs);
    this.hits.set(key, arr);
    return arr.length;
  }

  hit(key: string, windowMs: number, now = Date.now()): number {
    const arr = (this.hits.get(key) || []).filter((t) => now - t < windowMs);
    arr.push(now);
    this.hits.set(key, arr);
    return arr.length;
  }

  clear(key: string): void {
    this.hits.delete(key);
  }
}

const failedAuth = new SlidingWindow();
const rateHits = new SlidingWindow();
const velocity = new SlidingWindow();
const concurrent = new Map<string, number>();
/** Recent auto-ban timestamps for escalation. */
const banHistory = new Map<string, number[]>();

function skipPath(path: string): boolean {
  if (path === '/health' || path === '/ready') return true;
  // Admin SPA static + soft-refresh should not trip velocity/conn auto-ban
  if (path.startsWith('/admin') && !path.startsWith('/admin/api/ddos')) {
    // Still protect ddos endpoints themselves from flood; skip other admin noise
    if (!path.startsWith('/admin/api')) return true;
  }
  return false;
}

/** Soft-skip velocity for general admin API to avoid self-ban while operating panel. */
function skipVelocityPath(path: string): boolean {
  if (skipPath(path)) return true;
  if (path.startsWith('/admin/api')) return true;
  return false;
}

export class AbuseGuardService {
  getEvents(limit = 50): AutoBanEvent[] {
    return events.slice(0, Math.min(limit, MAX_EVENTS));
  }

  getAutoBanTotal(): number {
    return autoBanTotal;
  }

  getConcurrent(ip: string): number {
    return concurrent.get(normalizeIp(ip)) || 0;
  }

  /** Call when a request starts. Returns whether over concurrent limit (should reject). */
  onRequestStart(ipRaw: string, path: string): {
    overConcurrent: boolean;
    concurrent: number;
  } {
    if (skipPath(path)) {
      return { overConcurrent: false, concurrent: 0 };
    }
    const ip = normalizeIp(ipRaw);
    const policy = ddosPolicyService.getSync();
    const n = (concurrent.get(ip) || 0) + 1;
    concurrent.set(ip, n);

    if (
      policy.autoBanEnabled &&
      policy.autoConnEnabled &&
      n > policy.maxConcurrentPerIp &&
      !ddosPolicyService.isWhitelisted(ip)
    ) {
      void this.maybeAutoBan(
        ip,
        `Concurrent connections ${n} > ${policy.maxConcurrentPerIp}`,
        BAN_SOURCES.AUTO_CONN,
        policy.connBanDurationMs,
      );
      return { overConcurrent: true, concurrent: n };
    }
    return { overConcurrent: false, concurrent: n };
  }

  onRequestEnd(ipRaw: string, path: string, statusCode?: number): void {
    const ip = normalizeIp(ipRaw);
    if (!skipPath(path)) {
      const cur = concurrent.get(ip) || 0;
      if (cur <= 1) concurrent.delete(ip);
      else concurrent.set(ip, cur - 1);
    }

    const policy = ddosPolicyService.getSync();

    // Velocity (skip admin API soft-refresh)
    if (
      !skipVelocityPath(path) &&
      policy.autoBanEnabled &&
      policy.autoVelocityEnabled
    ) {
      const n = velocity.hit(ip, policy.velocityWindowMs);
      if (n > policy.velocityMaxRequests) {
        void this.maybeAutoBan(
          ip,
          `Request velocity ${n} > ${policy.velocityMaxRequests} / ${policy.velocityWindowMs}ms`,
          BAN_SOURCES.AUTO_VELOCITY,
          policy.velocityBanDurationMs,
        );
      }
    }

    // 429 abuse
    if (statusCode === 429) {
      this.recordRateHit(ip);
    }
  }

  recordFailedAuth(ipRaw: string): void {
    const ip = normalizeIp(ipRaw);
    const policy = ddosPolicyService.getSync();
    if (!policy.autoBanEnabled || !policy.autoAuthEnabled) return;
    if (ddosPolicyService.isWhitelisted(ip)) return;

    const n = failedAuth.hit(ip, policy.failedAuthWindowMs);
    if (n >= policy.failedAuthThreshold) {
      failedAuth.clear(ip);
      void this.maybeAutoBan(
        ip,
        `Repeated failed authentication (${n} in window)`,
        BAN_SOURCES.AUTO_AUTH,
        policy.authBanDurationMs,
      );
    }
  }

  clearFailedAuth(ipRaw: string): void {
    failedAuth.clear(normalizeIp(ipRaw));
  }

  recordRateHit(ipRaw: string): void {
    const ip = normalizeIp(ipRaw);
    const policy = ddosPolicyService.getSync();
    if (!policy.autoBanEnabled || !policy.autoRateEnabled) return;
    if (ddosPolicyService.isWhitelisted(ip)) return;

    const n = rateHits.hit(ip, policy.rateHitWindowMs);
    if (n >= policy.rateHitThreshold) {
      rateHits.clear(ip);
      void this.maybeAutoBan(
        ip,
        `Repeated rate-limit hits (${n} in window)`,
        BAN_SOURCES.AUTO_RATE,
        policy.rateBanDurationMs,
      );
    }
  }

  async maybeAutoBan(
    ipRaw: string,
    reason: string,
    source: BanSource,
    durationMs: number,
  ): Promise<boolean> {
    const ip = normalizeIp(ipRaw);
    if (!ip || ip === 'unknown') return false;

    const policy = ddosPolicyService.getSync();
    if (!policy.autoBanEnabled) return false;
    if (ddosPolicyService.isWhitelisted(ip)) return false;

    const ipBlacklistService = await getIpBlacklist();
    await ipBlacklistService.ensureLoaded();
    if (ipBlacklistService.isBlocked(ip)) return false;

    let finalDuration = durationMs;
    let finalSource = source;
    let escalated = false;

    const now = Date.now();
    const hist = (banHistory.get(ip) || []).filter(
      (t) => now - t < policy.escalateDurationMs * 2,
    );
    if (
      policy.escalateEnabled &&
      hist.length + 1 >= policy.escalateAfterBans
    ) {
      finalDuration = Math.max(finalDuration, policy.escalateDurationMs);
      finalSource = BAN_SOURCES.AUTO_ESCALATE;
      escalated = true;
    }

    try {
      await ipBlacklistService.ban({
        ip,
        reason: escalated ? `[escalated] ${reason}` : reason,
        source: finalSource,
        expiresAt: new Date(now + finalDuration),
      });
    } catch {
      return false;
    }

    hist.push(now);
    banHistory.set(ip, hist.slice(-20));
    autoBanTotal += 1;

    const ev: AutoBanEvent = {
      id: `${now}-${ip}`,
      ip,
      reason: escalated ? `[escalated] ${reason}` : reason,
      source: finalSource,
      durationMs: finalDuration,
      escalated,
      at: now,
    };
    events.unshift(ev);
    if (events.length > MAX_EVENTS) events.length = MAX_EVENTS;

    void auditService
      .log({
        apiKeyId: null,
        action: AUDIT_ACTIONS.IP_BAN,
        resource: 'ip_blacklist',
        meta: {
          ip,
          reason: ev.reason,
          source: finalSource,
          durationMs: finalDuration,
          auto: true,
          escalated,
        },
      })
      .catch(() => undefined);

    return true;
  }
}

export const abuseGuardService = new AbuseGuardService();
