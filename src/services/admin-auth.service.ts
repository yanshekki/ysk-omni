import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { prisma } from '../config/database';
import { AUDIT_ACTIONS, KEY_MODES, ROLES } from '../config/constants';
import type { AuthenticatedApiKey } from '../interfaces';
import { ExceptionFactory } from '../exceptions/exception.factory';
import { createId } from '../utils/id';
import { auditService } from './audit.service';

const OTP_TTL_MS = 5 * 60 * 1000;
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const SESSION_PREFIX = 'gog_sess_';
const SCRYPT_KEYLEN = 32;

function scryptHash(plaintext: string, salt?: Buffer): string {
  const s = salt ?? randomBytes(16);
  const hash = scryptSync(plaintext, s, SCRYPT_KEYLEN);
  return `scrypt$${s.toString('hex')}$${hash.toString('hex')}`;
}

function scryptVerify(plaintext: string, stored: string): boolean {
  try {
    const parts = stored.split('$');
    if (parts[0] !== 'scrypt' || parts.length !== 3) return false;
    const salt = Buffer.from(parts[1]!, 'hex');
    const expected = Buffer.from(parts[2]!, 'hex');
    const actual = scryptSync(plaintext, salt, expected.length);
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

function sha256Hex(s: string): string {
  return createHash('sha256').update(s, 'utf8').digest('hex');
}

/** Human-friendly OTP: ABCD-EFGH (no ambiguous 0/O/1/I). */
function generateOtpCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = randomBytes(8);
  let out = '';
  for (let i = 0; i < 8; i++) {
    out += alphabet[bytes[i]! % alphabet.length];
    if (i === 3) out += '-';
  }
  return out;
}

export function isSessionToken(token: string): boolean {
  return token.startsWith(SESSION_PREFIX);
}

/** Synthetic admin identity for session-authenticated Admin SPA requests. */
export function sessionActor(sessionId: string): AuthenticatedApiKey {
  return {
    id: `admin-session:${sessionId}`,
    name: 'Admin (OTP session)',
    keyPrefix: 'otp_sess',
    role: ROLES.ADMIN,
    mode: KEY_MODES.AGENT,
    rateLimit: 1000,
    isActive: true,
    maxTurns: null,
    timeoutMs: null,
    ipWhitelist: [],
  };
}

export class AdminAuthService {
  /**
   * CLI: create a one-time login code (plaintext returned once).
   */
  async createOtp(meta?: { ip?: string }): Promise<{
    code: string;
    expiresAt: Date;
    id: string;
  }> {
    // One live code only: drop used, expired, and previous unused OTPs.
    await prisma.adminOtp.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { usedAt: { not: null } },
          { usedAt: null },
        ],
      },
    });

    const code = generateOtpCode();
    const id = createId();
    const expiresAt = new Date(Date.now() + OTP_TTL_MS);
    await prisma.adminOtp.create({
      data: {
        id,
        codeHash: scryptHash(code.toUpperCase().replace(/-/g, '')),
        expiresAt,
        createdIp: meta?.ip ?? null,
      },
    });

    return { code, expiresAt, id };
  }

  /**
   * Exchange a valid unused OTP for a session bearer token.
   */
  async loginWithOtp(
    rawCode: string,
    meta?: { ip?: string; userAgent?: string },
  ): Promise<{ token: string; expiresAt: Date }> {
    const normalized = String(rawCode || '')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');
    if (normalized.length < 6) {
      throw ExceptionFactory.unauthorized('Invalid or expired login code');
    }

    const candidates = await prisma.adminOtp.findMany({
      where: { usedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });

    let matched: (typeof candidates)[0] | null = null;
    for (const row of candidates) {
      if (scryptVerify(normalized, row.codeHash)) {
        matched = row;
        break;
      }
    }

    if (!matched) {
      throw ExceptionFactory.unauthorized('Invalid or expired login code');
    }

    // One-time: mark used before issuing session
    const used = await prisma.adminOtp.updateMany({
      where: { id: matched.id, usedAt: null },
      data: { usedAt: new Date() },
    });
    if (used.count !== 1) {
      throw ExceptionFactory.unauthorized('Invalid or expired login code');
    }

    const tokenRaw = SESSION_PREFIX + randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
    const sessionId = createId();
    await prisma.adminSession.create({
      data: {
        id: sessionId,
        tokenHash: sha256Hex(tokenRaw),
        expiresAt,
        ip: meta?.ip ?? null,
        userAgent: meta?.userAgent?.slice(0, 500) ?? null,
        lastUsedAt: new Date(),
      },
    });

    await auditService.log({
      apiKeyId: null,
      action: AUDIT_ACTIONS.ADMIN_LOGIN,
      resource: 'admin_session',
      resourceId: sessionId,
      meta: { via: 'otp' },
      ip: meta?.ip,
    });

    return { token: tokenRaw, expiresAt };
  }

  async resolveSessionToken(token: string): Promise<AuthenticatedApiKey | null> {
    if (!isSessionToken(token)) return null;
    const tokenHash = sha256Hex(token);
    const row = await prisma.adminSession.findUnique({ where: { tokenHash } });
    if (!row) return null;
    if (row.expiresAt.getTime() <= Date.now()) {
      await prisma.adminSession.delete({ where: { id: row.id } }).catch(() => undefined);
      return null;
    }

    // Touch lastUsed (best-effort)
    void prisma.adminSession
      .update({
        where: { id: row.id },
        data: { lastUsedAt: new Date() },
      })
      .catch(() => undefined);

    return sessionActor(row.id);
  }

  async logout(token: string, ip?: string): Promise<void> {
    if (!isSessionToken(token)) return;
    const tokenHash = sha256Hex(token);
    const row = await prisma.adminSession.findUnique({ where: { tokenHash } });
    if (!row) return;
    await prisma.adminSession.delete({ where: { id: row.id } }).catch(() => undefined);
    await auditService.log({
      apiKeyId: null,
      action: AUDIT_ACTIONS.ADMIN_LOGOUT,
      resource: 'admin_session',
      resourceId: row.id,
      ip,
    });
  }

  /** Housekeeping */
  async purgeExpired(): Promise<void> {
    const now = new Date();
    await prisma.adminOtp.deleteMany({
      where: {
        OR: [{ expiresAt: { lt: now } }, { usedAt: { not: null } }],
      },
    });
    await prisma.adminSession.deleteMany({ where: { expiresAt: { lt: now } } });
  }
}

export const adminAuthService = new AdminAuthService();
