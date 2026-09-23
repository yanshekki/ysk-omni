import { prisma } from '../config/database';
import { ipMatchesExact, normalizeIp } from '../utils/ip-match';
import { recordBlockedHit } from '../middlewares/connection-tracker.middleware';
import { env } from '../config/env';
import { createId } from '../utils/id';
import { BAN_SOURCES } from '../config/constants';
import { resolveScalarOrderBy } from '../utils/list-sort';
import { ddosPolicyService } from './ddos-policy.service';

const IP_BAN_SORT_FIELDS = [
  'createdAt',
  'ip',
  'source',
  'expiresAt',
  'reason',
] as const;

/** Memory set of currently banned IPs (exact). */
const memoryBan = new Map<string, { expiresAt: number | null; reason?: string }>();

/** CLI may ban/unban via DB; refresh memory set so live gateway sees it. */
const BLACKLIST_TTL_MS = 5_000;

export class IpBlacklistService {
  private loaded = false;
  private loadedAt = 0;
  private loadPromise: Promise<void> | null = null;

  async ensureLoaded(): Promise<void> {
    if (this.loaded && Date.now() - this.loadedAt <= BLACKLIST_TTL_MS) return;
    if (!this.loadPromise) {
      this.loadPromise = this.reload()
        .then(() => {
          this.loaded = true;
          this.loadedAt = Date.now();
        })
        .finally(() => {
          this.loadPromise = null;
        });
    }
    await this.loadPromise;
  }

  async reload(): Promise<void> {
    const now = new Date();
    const rows = await prisma.ipBlacklist.findMany();
    memoryBan.clear();
    for (const r of rows) {
      if (r.expiresAt && r.expiresAt <= now) {
        void prisma.ipBlacklist.delete({ where: { id: r.id } }).catch(() => undefined);
        continue;
      }
      memoryBan.set(normalizeIp(r.ip), {
        expiresAt: r.expiresAt ? r.expiresAt.getTime() : null,
        reason: r.reason ?? undefined,
      });
    }
    this.loaded = true;
    this.loadedAt = Date.now();
  }

  isBlocked(ip: string): boolean {
    // Best-effort soft refresh when TTL expired (sync path; fire-and-forget reload)
    if (this.loaded && Date.now() - this.loadedAt > BLACKLIST_TTL_MS) {
      void this.ensureLoaded();
    }
    const now = Date.now();
    for (const [banned, hit] of memoryBan.entries()) {
      if (hit.expiresAt != null && now >= hit.expiresAt) {
        memoryBan.delete(banned);
        void prisma.ipBlacklist.deleteMany({ where: { ip: banned } }).catch(() => undefined);
        continue;
      }
      if (ipMatchesExact(ip, banned)) return true;
    }
    return false;
  }

  checkAndRecord(ip: string): boolean {
    const blocked = this.isBlocked(ip);
    if (blocked) recordBlockedHit();
    return blocked;
  }

  async ban(input: {
    ip: string;
    reason?: string;
    source?: string;
    expiresAt?: Date | null;
    createdBy?: string;
  }) {
    const ip = normalizeIp(input.ip);
    if (!ip || ip === 'unknown') {
      throw new Error('Invalid IP');
    }
    const expiresAt = input.expiresAt ?? null;
    const row = await prisma.ipBlacklist.upsert({
      where: { ip },
      create: {
        id: createId(),
        ip,
        reason: input.reason ?? null,
        source: input.source ?? 'manual',
        expiresAt,
        createdBy: input.createdBy ?? null,
      },
      update: {
        reason: input.reason ?? null,
        source: input.source ?? 'manual',
        expiresAt,
        createdBy: input.createdBy ?? null,
      },
    });
    memoryBan.set(ip, {
      expiresAt: expiresAt ? expiresAt.getTime() : null,
      reason: input.reason,
    });
    return row;
  }

  async unban(ip: string) {
    const key = normalizeIp(ip);
    memoryBan.delete(key);
    await prisma.ipBlacklist.deleteMany({ where: { ip: key } });
  }

  async list(query?: { sortBy?: string; sortDir?: 'asc' | 'desc' }) {
    await this.ensureLoaded();
    const now = new Date();
    const orderBy = resolveScalarOrderBy(
      query?.sortBy,
      query?.sortDir,
      IP_BAN_SORT_FIELDS,
      'createdAt',
    );
    const rows = await prisma.ipBlacklist.findMany({
      orderBy,
    });
    return rows.filter((r) => !r.expiresAt || r.expiresAt > now);
  }

  /**
   * Auto temporary ban.
   * Duration: explicit ms, else current DDoS policy auth ban duration, else env.
   */
  async autoBan(
    ip: string,
    reason: string,
    source: string = BAN_SOURCES.AUTO_AUTH,
    durationMs?: number,
  ): Promise<void> {
    const policy = ddosPolicyService.getSync();
    const ms =
      durationMs ??
      policy.authBanDurationMs ??
      env.BLOCK_DURATION_MS;
    const expiresAt = new Date(Date.now() + ms);
    await this.ban({
      ip,
      reason,
      source,
      expiresAt,
    });
  }
}

export const ipBlacklistService = new IpBlacklistService();
