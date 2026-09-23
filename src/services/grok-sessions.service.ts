import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import execa from 'execa';
import { env } from '../config/env';
import { isUuid } from '../utils/grok-session';
import { logger } from '../utils/logger';
import { grokCliService } from './grok-cli.service';

export type GrokSessionRow = {
  id: string;
  cwd: string | null;
  title: string;
  summary: string;
  model: string | null;
  updatedAt: string | null;
  createdAt: string | null;
  messageCount: number | null;
  agentName: string | null;
};

export function resolveGrokHome(): string {
  return process.env.GROK_HOME || path.join(os.homedir(), '.grok');
}

function asString(v: unknown): string | null {
  return typeof v === 'string' && v.trim() ? v : null;
}

function asTime(v: unknown): string | null {
  if (typeof v === 'string' && v) return v;
  return null;
}

export function parseSessionSummary(
  raw: unknown,
  fallbackId: string,
): GrokSessionRow | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const info =
    o.info && typeof o.info === 'object'
      ? (o.info as Record<string, unknown>)
      : {};
  const id = asString(info.id) || (isUuid(fallbackId) ? fallbackId : null);
  if (!id) return null;
  const title =
    asString(o.generated_title) ||
    asString(o.session_summary) ||
    id.slice(0, 8);
  return {
    id,
    cwd: asString(info.cwd),
    title,
    summary: asString(o.session_summary) || title,
    model: asString(o.current_model_id),
    updatedAt: asTime(o.last_active_at) || asTime(o.updated_at),
    createdAt: asTime(o.created_at),
    messageCount:
      typeof o.num_chat_messages === 'number'
        ? o.num_chat_messages
        : typeof o.num_messages === 'number'
          ? o.num_messages
          : null,
    agentName: asString(o.agent_name),
  };
}

export class GrokSessionsService {
  async list(opts?: {
    q?: string;
    cwd?: string;
    limit?: number;
    offset?: number;
    grokHome?: string;
  }): Promise<{ data: GrokSessionRow[]; total: number }> {
    const home = opts?.grokHome || resolveGrokHome();
    const root = path.join(home, 'sessions');
    const rows: GrokSessionRow[] = [];
    let groups: string[] = [];
    try {
      groups = await fs.readdir(root);
    } catch {
      return { data: [], total: 0 };
    }

    for (const group of groups) {
      const groupDir = path.join(root, group);
      let children: string[] = [];
      try {
        const st = await fs.stat(groupDir);
        if (!st.isDirectory()) continue;
        children = await fs.readdir(groupDir);
      } catch {
        continue;
      }
      for (const name of children) {
        if (!isUuid(name)) continue;
        const summaryPath = path.join(groupDir, name, 'summary.json');
        try {
          const raw = JSON.parse(await fs.readFile(summaryPath, 'utf8'));
          const row = parseSessionSummary(raw, name);
          if (row) rows.push(row);
        } catch {
          /* skip corrupt */
        }
      }
    }

    const q = (opts?.q || '').trim().toLowerCase();
    const cwd = (opts?.cwd || '').trim();
    let filtered = rows;
    if (cwd) {
      filtered = filtered.filter((r) => r.cwd === cwd);
    }
    if (q) {
      filtered = filtered.filter((r) => {
        const hay = `${r.title} ${r.summary} ${r.id} ${r.cwd || ''}`.toLowerCase();
        return hay.includes(q);
      });
    }
    filtered.sort((a, b) => {
      const ta = a.updatedAt || a.createdAt || '';
      const tb = b.updatedAt || b.createdAt || '';
      return tb.localeCompare(ta);
    });

    const total = filtered.length;
    const offset = Math.max(0, opts?.offset ?? 0);
    const limit = Math.min(200, Math.max(1, opts?.limit ?? 40));
    return { data: filtered.slice(offset, offset + limit), total };
  }

  async delete(id: string): Promise<{ id: string; deleted: boolean }> {
    if (!isUuid(id)) {
      throw new Error('Session id must be a UUID');
    }
    const result = await execa(env.GROK_BIN, ['sessions', 'delete', id], {
      timeout: 20_000,
      reject: false,
      env: grokCliService.sanitizedEnv(),
    });
    if (result.exitCode !== 0) {
      const stderr = (result.stderr || result.stdout || '').slice(0, 500);
      logger.warn({ id, stderr, exitCode: result.exitCode }, 'grok sessions delete failed');
      throw new Error(stderr || `grok sessions delete exited ${result.exitCode}`);
    }
    return { id, deleted: true };
  }
}

export const grokSessionsService = new GrokSessionsService();
