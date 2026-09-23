import type { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import type { TrackedConnection } from '../interfaces/tracked-connection.interface';
import { getClientIp } from '../utils/client-ip';
import { abuseGuardService } from '../services/abuse-guard.service';
import { ExceptionFactory } from '../exceptions/exception.factory';

const MAX_RECENT = 200;
const active = new Map<string, TrackedConnection>();
const recent: TrackedConnection[] = [];
let blockedHits = 0;
let rateLimitedHits = 0;

function clientIp(req: Request): string {
  return req.clientIp || getClientIp(req);
}

export function connectionTrackerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // Skip static admin assets noise
  const url = req.originalUrl || req.url || '';
  if (
    url.startsWith('/admin/') &&
    !url.startsWith('/admin/api') &&
    (url.includes('.') || url === '/admin/' || url === '/admin')
  ) {
    next();
    return;
  }
  if (url === '/health' || url === '/ready') {
    next();
    return;
  }

  const pathOnly = url.split('?')[0] || '/';
  const ip = clientIp(req);

  const { overConcurrent } = abuseGuardService.onRequestStart(ip, pathOnly);
  if (overConcurrent) {
    // End tracking immediately (do not pass 429 — that would double-count rate-abuse)
    abuseGuardService.onRequestEnd(ip, pathOnly);
    next(
      ExceptionFactory.rateLimited(
        'Too many concurrent connections from this IP',
      ),
    );
    return;
  }

  const id = randomUUID();
  const entry: TrackedConnection = {
    id,
    ip,
    method: req.method,
    path: pathOnly,
    userAgent: String(req.headers['user-agent'] || '').slice(0, 200),
    startedAt: Date.now(),
    state: 'active',
  };
  active.set(id, entry);

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    if (!active.has(id)) return;
    active.delete(id);
    entry.finishedAt = Date.now();
    entry.durationMs = entry.finishedAt - entry.startedAt;
    entry.statusCode = res.statusCode;
    entry.state = 'finished';
    if (req.apiKey) {
      entry.apiKeyId = req.apiKey.id;
      entry.apiKeyPrefix = req.apiKey.keyPrefix;
      entry.apiKeyName = req.apiKey.name;
    }
    if (res.statusCode === 429) rateLimitedHits += 1;
    abuseGuardService.onRequestEnd(ip, pathOnly, res.statusCode);
    recent.unshift({ ...entry });
    if (recent.length > MAX_RECENT) recent.length = MAX_RECENT;
  };

  res.on('finish', finish);
  res.on('close', finish);
  next();
}

export function getConnectionsSnapshot() {
  const activeList = Array.from(active.values()).map((e) => ({ ...e }));
  return {
    active: activeList,
    recent: recent.slice(0, 100),
    counts: {
      active: activeList.length,
      recent: recent.length,
      rateLimitedHits,
      blockedHits,
    },
  };
}

export function recordBlockedHit(): void {
  blockedHits += 1;
}

export function getAbuseCounters() {
  return { rateLimitedHits, blockedHits };
}
