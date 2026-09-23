import rateLimit, { type RateLimitRequestHandler } from 'express-rate-limit';
import type { NextFunction, Request, Response } from 'express';
import { ExceptionFactory } from '../exceptions/exception.factory';
import { ipBlacklistService } from '../services/ip-blacklist.service';
import { ddosPolicyService } from '../services/ddos-policy.service';
import { abuseGuardService } from '../services/abuse-guard.service';
import { getClientIp } from '../utils/client-ip';

function clientIp(req: Request): string {
  return req.clientIp || getClientIp(req);
}

export function recordFailedAuth(req: Request): void {
  abuseGuardService.recordFailedAuth(clientIp(req));
}

export function clearFailedAuth(req: Request): void {
  abuseGuardService.clearFailedAuth(clientIp(req));
}

export function ipBlockMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  // Always wait for load so first requests after boot cannot bypass bans
  void ipBlacklistService
    .ensureLoaded()
    .then(() => {
      const ip = clientIp(req);
      if (ipBlacklistService.checkAndRecord(ip)) {
        next(
          ExceptionFactory.forbidden(
            `IP ${ip} is blacklisted. Unban via Admin → DDoS Center, or: remove from ip_blacklist table.`,
          ),
        );
        return;
      }
      next();
    })
    .catch(next);
}

function onRateLimited(req: Request, message?: string): never {
  abuseGuardService.recordRateHit(clientIp(req));
  throw ExceptionFactory.rateLimited(message);
}

function buildGlobalLimiter(): RateLimitRequestHandler {
  const p = ddosPolicyService.getSync();
  return rateLimit({
    windowMs: p.rateLimitWindowMs,
    max: (req: Request) => {
      const pol = ddosPolicyService.getSync();
      if (!req.apiKey) return pol.rateLimitIpMax;
      return pol.rateLimitMax;
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: Request) => {
      if (req.apiKey?.id) return `key:${req.apiKey.id}`;
      return `ip:${clientIp(req)}`;
    },
    handler: (req) => {
      onRateLimited(req);
    },
    validate: { xForwardedForHeader: false },
  });
}

function buildChatLimiter(): RateLimitRequestHandler {
  return rateLimit({
    windowMs: 60_000,
    max: (req: Request) => req.apiKey?.rateLimit ?? 60,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: Request) => {
      if (req.apiKey?.id) return `chat:${req.apiKey.id}`;
      return `chat-ip:${clientIp(req)}`;
    },
    handler: (req) => {
      onRateLimited(req, 'Chat rate limit exceeded for this API key');
    },
    validate: { xForwardedForHeader: false },
  });
}

function buildAdminLimiter(): RateLimitRequestHandler {
  return rateLimit({
    windowMs: 60_000,
    max: 180,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: Request) => `admin-ip:${clientIp(req)}`,
    handler: (req) => {
      onRateLimited(req, 'Admin API rate limit exceeded');
    },
    validate: { xForwardedForHeader: false },
  });
}

function buildBurstLimiter(): RateLimitRequestHandler {
  const p = ddosPolicyService.getSync();
  return rateLimit({
    windowMs: p.chatBurstWindowMs,
    max: () => ddosPolicyService.getSync().chatBurstMax,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: Request) => {
      if (req.apiKey?.id) return `burst:${req.apiKey.id}`;
      return `burst-ip:${clientIp(req)}`;
    },
    handler: (req) => {
      onRateLimited(req, 'Chat burst rate limit exceeded');
    },
    validate: { xForwardedForHeader: false },
  });
}

let _global: RateLimitRequestHandler = buildGlobalLimiter();
let _chat: RateLimitRequestHandler = buildChatLimiter();
let _burst: RateLimitRequestHandler = buildBurstLimiter();
let _admin: RateLimitRequestHandler = buildAdminLimiter();

export function rebuildRateLimiters(): void {
  _global = buildGlobalLimiter();
  _chat = buildChatLimiter();
  _burst = buildBurstLimiter();
  _admin = buildAdminLimiter();
}

/** Wrappers so app.use / routes always hit the latest limiter instances. */
export function globalRateLimiter(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // Admin SPA polls many endpoints; auth is OTP/session (not public API).
  // Global IP limiter runs *before* requireAdminAuth, so every admin call
  // was counted under the strict IP budget → 429 and flaky UI.
  // Public OTP login still has chatRateLimiter on that route.
  const path = req.originalUrl || req.url || req.path || '';
  if (path.startsWith('/admin/api')) {
    next();
    return;
  }
  _global(req, res, next);
}

export function chatRateLimiter(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  _chat(req, res, next);
}

export function chatBurstLimiter(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  _burst(req, res, next);
}

export function adminApiLimiter(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  _admin(req, res, next);
}

// Rebuild when Admin saves policy
ddosPolicyService.onRebuild(rebuildRateLimiters);
