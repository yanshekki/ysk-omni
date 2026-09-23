import type { Request } from 'express';
import { ROLES } from '../config/constants';
import { ExceptionFactory } from '../exceptions/exception.factory';
import {
  clearFailedAuth,
  recordFailedAuth,
} from './rate-limit.middleware';
import { apiKeyService } from '../services/api-key.service';
import {
  adminAuthService,
  isSessionToken,
} from '../services/admin-auth.service';
import { asyncHandler } from '../utils/async-handler';
import { ipAllowed } from '../utils/ip-match';
import { requestIp } from '../utils/client-ip';
import { normalizeApiKeyRole } from '../utils/role-normalize';

function extractBearer(req: Request): string | null {
  const header = req.header('authorization');
  if (!header) return null;
  const [scheme, token] = header.split(/\s+/);
  if (!scheme || !token) return null;
  if (scheme.toLowerCase() !== 'bearer') return null;
  return token.trim();
}

/** OpenAI Bearer or Anthropic x-api-key (same gk_live_ keys). */
function extractApiKeyToken(req: Request): string | null {
  const bearer = extractBearer(req);
  if (bearer) return bearer;
  const xApiKey = req.header('x-api-key') || req.header('X-Api-Key');
  if (xApiKey?.trim()) return xApiKey.trim();
  return null;
}

function clientIp(req: Request): string {
  return requestIp(req);
}

export const requireApiKey = asyncHandler(async (req, _res, next) => {
  const token = extractApiKeyToken(req);
  if (!token) {
    recordFailedAuth(req);
    throw ExceptionFactory.unauthorized(
      'Missing API key. Use Authorization: Bearer <api_key> or x-api-key: <api_key>',
    );
  }
  // Session tokens are admin-panel only — not valid for /v1 public API
  if (isSessionToken(token)) {
    recordFailedAuth(req);
    throw ExceptionFactory.unauthorized('Use an API key for this endpoint');
  }
  try {
    req.apiKey = await apiKeyService.authenticate(token);
    clearFailedAuth(req);
  } catch (err) {
    recordFailedAuth(req);
    throw err;
  }

  const wl = req.apiKey.ipWhitelist;
  if (Array.isArray(wl) && wl.length > 0) {
    const ip = clientIp(req);
    if (!ipAllowed(ip, wl)) {
      throw ExceptionFactory.forbidden(
        `API key not allowed from IP ${ip} (whitelist enforced). Clear whitelist or add this IP.`,
      );
    }
  }

  next();
});

export const requireAdmin = asyncHandler(async (req, _res, next) => {
  if (!req.apiKey) {
    throw ExceptionFactory.unauthorized();
  }
  if (normalizeApiKeyRole(req.apiKey.role) !== ROLES.ADMIN) {
    throw ExceptionFactory.forbidden(
      `Admin role required (this key has role "${req.apiKey.role}"). Create an admin key: gctoac key create`,
    );
  }
  next();
});

/**
 * Admin panel / admin API auth:
 * - Bearer gog_sess_* → OTP session (preferred for SPA)
 * - Bearer gk_live_* → admin API key (automation / CLI)
 */
export const requireAdminAuth = asyncHandler(async (req, _res, next) => {
  const token = extractBearer(req);
  if (!token) {
    recordFailedAuth(req);
    throw ExceptionFactory.unauthorized(
      'Missing Authorization. Log in with a one-time code (gctoac admin otp) or use an admin API key.',
    );
  }

  if (isSessionToken(token)) {
    try {
      const actor = await adminAuthService.resolveSessionToken(token);
      if (!actor) {
        recordFailedAuth(req);
        throw ExceptionFactory.unauthorized('Session expired or invalid. Run: gctoac admin otp');
      }
      req.apiKey = actor;
      clearFailedAuth(req);
      next();
      return;
    } catch (err) {
      recordFailedAuth(req);
      throw err;
    }
  }

  try {
    req.apiKey = await apiKeyService.authenticate(token);
    clearFailedAuth(req);
  } catch (err) {
    recordFailedAuth(req);
    throw err;
  }

  if (normalizeApiKeyRole(req.apiKey.role) !== ROLES.ADMIN) {
    throw ExceptionFactory.forbidden('Admin role required');
  }

  const wl = req.apiKey.ipWhitelist;
  if (Array.isArray(wl) && wl.length > 0) {
    const ip = clientIp(req);
    if (!ipAllowed(ip, wl)) {
      throw ExceptionFactory.forbidden(
        `API key not allowed from IP ${ip} (whitelist enforced).`,
      );
    }
  }

  next();
});

/**
 * Attach apiKey when Bearer present; otherwise continue unauthenticated.
 */
export const optionalApiKey = asyncHandler(async (req, _res, next) => {
  const token = extractBearer(req);
  if (!token) {
    next();
    return;
  }
  if (isSessionToken(token)) {
    const actor = await adminAuthService.resolveSessionToken(token);
    if (actor) req.apiKey = actor;
    next();
    return;
  }
  try {
    req.apiKey = await apiKeyService.authenticate(token);
    clearFailedAuth(req);
  } catch {
    /* optional */
  }
  next();
});
