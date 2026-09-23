import fs from 'node:fs';
import path from 'node:path';
import type { Pm2RuntimeConfig } from '../interfaces/pm2-runtime-config.interface';


export const PM2_APP_NAME_DEFAULT = 'grok-openai-gateway';

export function packageRoot(): string {
  return path.resolve(__dirname, '../..');
}

export function pm2RuntimeConfigPath(): string {
  return path.join(packageRoot(), 'pm2.runtime.json');
}

export function defaultPm2Config(): Pm2RuntimeConfig {
  return {
    name: PM2_APP_NAME_DEFAULT,
    script: 'dist/server.js',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    max_restarts: 10,
    min_uptime: '5s',
    restart_delay: 2000,
    exp_backoff_restart_delay: 1000,
    merge_logs: true,
    time: true,
    error_file: 'logs/pm2-error.log',
    out_file: 'logs/pm2-out.log',
    env_extra: {},
    preferred_runner: 'gctoac',
  };
}

function asString(v: unknown, fallback: string): string {
  if (v == null || v === '') return fallback;
  return String(v);
}

function asBool(v: unknown, fallback: boolean): boolean {
  if (typeof v === 'boolean') return v;
  if (v === 'true' || v === '1') return true;
  if (v === 'false' || v === '0') return false;
  return fallback;
}

function asNumber(v: unknown, fallback: number): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function asInstances(v: unknown, fallback: number | string): number | string {
  if (v === 'max' || v === 'Max') return 'max';
  if (typeof v === 'string' && v.trim() === 'max') return 'max';
  const n = Number(v);
  if (Number.isFinite(n) && n >= 1) return Math.floor(n);
  return fallback;
}

function asExecMode(v: unknown): 'fork' | 'cluster' {
  return v === 'cluster' ? 'cluster' : 'fork';
}

function asEnvExtra(v: unknown): Record<string, string> {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return {};
  const out: Record<string, string> = {};
  for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
    if (!k || val == null) continue;
    out[k] = String(val);
  }
  return out;
}

/** Normalize partial user input into a full config */
export function normalizePm2Config(
  input: Partial<Pm2RuntimeConfig> | Record<string, unknown> | null | undefined,
  base?: Pm2RuntimeConfig,
): Pm2RuntimeConfig {
  const d = base || defaultPm2Config();
  const raw = (input || {}) as Record<string, unknown>;
  return {
    name: asString(raw.name, d.name).trim() || d.name,
    script: asString(raw.script, d.script).trim() || d.script,
    cwd: raw.cwd != null && String(raw.cwd).trim() ? String(raw.cwd).trim() : d.cwd,
    instances: asInstances(raw.instances, d.instances),
    exec_mode: asExecMode(raw.exec_mode ?? d.exec_mode),
    autorestart: asBool(raw.autorestart, d.autorestart),
    watch: asBool(raw.watch, d.watch),
    max_memory_restart: asString(raw.max_memory_restart, d.max_memory_restart),
    max_restarts: Math.max(0, asNumber(raw.max_restarts, d.max_restarts)),
    min_uptime: raw.min_uptime != null ? raw.min_uptime as string | number : d.min_uptime,
    restart_delay: Math.max(0, asNumber(raw.restart_delay, d.restart_delay)),
    exp_backoff_restart_delay: Math.max(
      0,
      asNumber(raw.exp_backoff_restart_delay, d.exp_backoff_restart_delay),
    ),
    merge_logs: asBool(raw.merge_logs, d.merge_logs),
    time: asBool(raw.time, d.time),
    error_file: asString(raw.error_file, d.error_file),
    out_file: asString(raw.out_file, d.out_file),
    env_extra: asEnvExtra(raw.env_extra ?? d.env_extra),
    preferred_runner:
      raw.preferred_runner === 'pm2' ? 'pm2' : 'gctoac',
  };
}

export function readPm2Config(): Pm2RuntimeConfig {
  const file = pm2RuntimeConfigPath();
  try {
    if (fs.existsSync(file)) {
      const raw = JSON.parse(fs.readFileSync(file, 'utf8')) as Record<string, unknown>;
      return normalizePm2Config(raw);
    }
  } catch {
    /* fall through */
  }
  return defaultPm2Config();
}

export function writePm2Config(cfg: Pm2RuntimeConfig): Pm2RuntimeConfig {
  const normalized = normalizePm2Config(cfg);
  const file = pm2RuntimeConfigPath();
  fs.writeFileSync(file, `${JSON.stringify(normalized, null, 2)}\n`, 'utf8');
  return normalized;
}

/** Shape expected by PM2 ecosystem apps[] entry (minus env from .env loader) */
export function toPm2AppOptions(
  cfg: Pm2RuntimeConfig,
  root: string,
  fileEnv: Record<string, string>,
): Record<string, unknown> {
  return {
    name: cfg.name,
    script: cfg.script,
    cwd: cfg.cwd || root,
    instances: cfg.instances,
    exec_mode: cfg.exec_mode,
    autorestart: cfg.autorestart,
    watch: cfg.watch,
    max_memory_restart: cfg.max_memory_restart,
    max_restarts: cfg.max_restarts,
    min_uptime: cfg.min_uptime,
    restart_delay: cfg.restart_delay,
    exp_backoff_restart_delay: cfg.exp_backoff_restart_delay,
    merge_logs: cfg.merge_logs,
    time: cfg.time,
    error_file: cfg.error_file,
    out_file: cfg.out_file,
    env: {
      NODE_ENV: fileEnv.NODE_ENV || 'production',
      ...fileEnv,
      ...cfg.env_extra,
    },
  };
}
