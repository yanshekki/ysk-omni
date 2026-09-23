import { execFile, spawn } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import { env } from '../config/env';
import {
  clearPid,
  findPidsOnPort,
  isProcessRunning,
  killPid,
  readPid,
  stopGateway,
} from '../cli/lib/process-mgr';
import { getDefaultHome, resolveRuntimePaths } from '../cli/lib/paths';
import { DEFAULT_PORT } from '../cli/lib/paths';
import { readEnvFile, upsertEnvFile } from '../cli/lib/env-file';
import type { Pm2RuntimeConfig } from '../interfaces/pm2-runtime-config.interface';
import type { RunnerMode } from '../interfaces/runner-mode.type';
import {
  defaultPm2Config,
  normalizePm2Config,
  packageRoot,
  pm2RuntimeConfigPath,
  readPm2Config,
  writePm2Config,
} from './pm2-config';
import { ExceptionFactory } from '../exceptions/exception.factory';

const execFileAsync = promisify(execFile);


function gctoacPidFile(): string {
  const home = process.env.GCTOAC_HOME?.trim() || getDefaultHome();
  const candidates = [
    path.join(process.cwd(), 'gctoac.pid'),
    path.join(packageRoot(), 'gctoac.pid'),
    path.join(home, 'gctoac.pid'),
  ];
  for (const f of candidates) {
    if (fs.existsSync(f)) return f;
  }
  return candidates[0]!;
}

async function whichPm2(): Promise<string | null> {
  try {
    const { stdout } = await execFileAsync('which', ['pm2'], {
      timeout: 5000,
      env: process.env,
    });
    const p = stdout.trim();
    return p || null;
  } catch {
    return null;
  }
}

async function runPm2(args: string[]): Promise<{ stdout: string; stderr: string }> {
  const bin = await whichPm2();
  if (!bin) {
    throw new Error('pm2 not found on PATH. Install: npm i -g pm2');
  }
  try {
    const { stdout, stderr } = await execFileAsync(bin, args, {
      timeout: 60_000,
      maxBuffer: 5 * 1024 * 1024,
      env: process.env,
      cwd: packageRoot(),
    });
    return { stdout: stdout || '', stderr: stderr || '' };
  } catch (e) {
    const err = e as { stdout?: string; stderr?: string; message?: string };
    const msg = [err.stderr, err.stdout, err.message].filter(Boolean).join('\n');
    throw new Error(msg || 'pm2 command failed');
  }
}

/** Auto-trim when a log file exceeds this size (default 5 MiB). */
const LOG_MAX_BYTES = 5 * 1024 * 1024;
/** After auto-trim, keep the last N bytes. */
const LOG_KEEP_BYTES = 512 * 1024;

function resolveLogPath(file: string): string {
  if (path.isAbsolute(file)) return file;
  return path.join(packageRoot(), file);
}

function managedLogPaths(): { label: string; path: string }[] {
  const root = packageRoot();
  const cfg = readPm2Config();
  const list: { label: string; path: string }[] = [
    {
      label: path.basename(cfg.error_file || 'pm2-error.log'),
      path: resolveLogPath(cfg.error_file || 'logs/pm2-error.log'),
    },
    {
      label: path.basename(cfg.out_file || 'pm2-out.log'),
      path: resolveLogPath(cfg.out_file || 'logs/pm2-out.log'),
    },
    { label: 'gctoac.err.log', path: path.join(root, 'logs', 'gctoac.err.log') },
    { label: 'gctoac.out.log', path: path.join(root, 'logs', 'gctoac.out.log') },
  ];
  // de-dupe by absolute path
  const seen = new Set<string>();
  return list.filter((x) => {
    if (seen.has(x.path)) return false;
    seen.add(x.path);
    return true;
  });
}

/**
 * If file is larger than LOG_MAX_BYTES, keep only the tail (LOG_KEEP_BYTES).
 * Returns bytes removed (0 if no trim).
 */
function autoTrimLogFile(filePath: string): number {
  try {
    if (!fs.existsSync(filePath)) return 0;
    const st = fs.statSync(filePath);
    if (st.size <= LOG_MAX_BYTES) return 0;
    const fd = fs.openSync(filePath, 'r');
    try {
      const keep = Math.min(LOG_KEEP_BYTES, st.size);
      const start = st.size - keep;
      const buf = Buffer.alloc(keep);
      fs.readSync(fd, buf, 0, keep, start);
      // Prefer starting at a newline so we don't keep a partial line
      let slice = buf;
      const nl = buf.indexOf(0x0a);
      if (nl > 0 && nl < buf.length - 1) {
        slice = buf.subarray(nl + 1);
      }
      const header = Buffer.from(
        `[log auto-trimmed ${new Date().toISOString()} — kept last ~${Math.round(slice.length / 1024)}KB of ${Math.round(st.size / 1024)}KB]\n`,
        'utf8',
      );
      fs.writeFileSync(filePath, Buffer.concat([header, slice]));
      return st.size - (header.length + slice.length);
    } finally {
      fs.closeSync(fd);
    }
  } catch {
    return 0;
  }
}

function autoTrimAllLogs(): { path: string; removed: number }[] {
  const out: { path: string; removed: number }[] = [];
  for (const f of managedLogPaths()) {
    const removed = autoTrimLogFile(f.path);
    if (removed > 0) out.push({ path: f.path, removed });
  }
  return out;
}

function tailErrorLog(lines = 40): string {
  const cfg = readPm2Config();
  const errPath = resolveLogPath(cfg.error_file || 'logs/pm2-error.log');
  try {
    autoTrimLogFile(errPath);
    if (!fs.existsSync(errPath)) return '';
    const raw = fs.readFileSync(errPath, 'utf8');
    return raw.split('\n').slice(-lines).join('\n');
  } catch {
    return '';
  }
}

function detectPortHolders(port: number): {
  pids: number[];
  gctoacPid: number | null;
  gctoacRunning: boolean;
} {
  const pids = findPidsOnPort(port);
  const gctoacPid = readPid(gctoacPidFile());
  const gctoacRunning = gctoacPid != null && isProcessRunning(gctoacPid);
  return {
    pids,
    gctoacPid: gctoacRunning ? gctoacPid : null,
    gctoacRunning,
  };
}

/** Free port by stopping known gctoac/pm2 gateway processes only (never kill strangers). */
async function freePortForPm2(port: number): Promise<string[]> {
  const notes: string[] = [];
  const pidFile = gctoacPidFile();
  const gctoacPid = readPid(pidFile);
  if (gctoacPid && isProcessRunning(gctoacPid)) {
    await killPid(gctoacPid);
    clearPid(pidFile);
    notes.push(`stopped gctoac pid ${gctoacPid}`);
  }
  // Try stop/delete our PM2 app if it holds the port
  try {
    const cfg = readPm2Config();
    await runPm2(['stop', cfg.name]).catch(() => undefined);
    notes.push(`pm2 stop ${cfg.name}`);
  } catch {
    /* ignore */
  }
  const holders = findPidsOnPort(port);
  if (holders.length) {
    notes.push(
      `port ${port} still held by pid(s) ${holders.join(',')}; not killing unknown processes`,
    );
  }
  await new Promise((r) => setTimeout(r, 500));
  return notes;
}

async function stopPm2App(appName: string): Promise<string[]> {
  const notes: string[] = [];
  try {
    await runPm2(['stop', appName]);
    notes.push(`pm2 stop ${appName}`);
  } catch {
    /* not running */
  }
  try {
    await runPm2(['delete', appName]);
    notes.push(`pm2 delete ${appName}`);
  } catch {
    /* not in list */
  }
  return notes;
}

export class Pm2Service {
  isEnabled(): boolean {
    return env.PM2_ADMIN_ENABLED !== false;
  }

  getConfig(): Pm2RuntimeConfig {
    return readPm2Config();
  }

  saveConfig(input: Partial<Pm2RuntimeConfig> | Record<string, unknown>): Pm2RuntimeConfig {
    const current = readPm2Config();
    return writePm2Config(normalizePm2Config(input, current));
  }

  /** Env files that may hold PORT for this install (project + gctoac home). */
  private envFilesForPort(): string[] {
    const files = new Set<string>();
    const root = packageRoot();
    files.add(path.join(root, '.env'));
    files.add(path.join(process.cwd(), '.env'));
    try {
      const paths = resolveRuntimePaths({
        home: process.env.GCTOAC_HOME,
      });
      files.add(paths.envFile);
    } catch {
      /* ignore */
    }
    return [...files];
  }

  /**
   * Persist listen port to .env (and soft-update CORS_ORIGINS host:port).
   * Takes effect after restart / runner switch.
   */
  updateListenPort(port: number): {
    port: number;
    previous: number;
    files: string[];
    defaultPort: number;
  } {
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      throw ExceptionFactory.validation(
        'PORT must be an integer between 1 and 65535',
      );
    }
    const previous = env.PORT;
    const portStr = String(port);
    const touched: string[] = [];
    for (const file of this.envFilesForPort()) {
      try {
        const dir = path.dirname(file);
        if (!fs.existsSync(dir)) continue;
        // Only write where a .env already exists, or package root
        const isRootEnv = file === path.join(packageRoot(), '.env');
        if (!fs.existsSync(file) && !isRootEnv) continue;

        const cur = readEnvFile(file);
        const updates: Record<string, string> = { PORT: portStr };
        if (cur.CORS_ORIGINS) {
          // Rewrite localhost/127.0.0.1 entries that used the old port
          updates.CORS_ORIGINS = cur.CORS_ORIGINS.replace(
            new RegExp(`(https?://(?:localhost|127\\.0\\.0\\.1)):${previous}\\b`, 'g'),
            `$1:${port}`,
          );
          // If no localhost origins at all, ensure defaults exist for admin SPA
          if (
            !/localhost|127\.0\.0\.1/.test(updates.CORS_ORIGINS) &&
            !updates.CORS_ORIGINS.includes(`:${port}`)
          ) {
            updates.CORS_ORIGINS = [
              updates.CORS_ORIGINS,
              `http://localhost:${port}`,
              `http://127.0.0.1:${port}`,
            ]
              .filter(Boolean)
              .join(',');
          }
        } else {
          updates.CORS_ORIGINS = `http://localhost:${port},http://127.0.0.1:${port}`;
        }
        upsertEnvFile(file, updates);
        touched.push(file);
      } catch {
        /* skip unwritable paths */
      }
    }
    if (!touched.length) {
      // Force write package root .env
      const file = path.join(packageRoot(), '.env');
      upsertEnvFile(file, {
        PORT: portStr,
        CORS_ORIGINS: `http://localhost:${port},http://127.0.0.1:${port}`,
      });
      touched.push(file);
    }
    // Process-local so subsequent scheduleSwitch uses the new port in this request
    process.env.PORT = portStr;
    return {
      port,
      previous,
      files: touched,
      defaultPort: DEFAULT_PORT,
    };
  }

  resetConfig(): Pm2RuntimeConfig {
    const file = pm2RuntimeConfigPath();
    try {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    } catch {
      /* ignore */
    }
    return defaultPm2Config();
  }

  async status() {
    const port = env.PORT;
    const holders = detectPortHolders(port);
    const cfg = readPm2Config();
    const appName = cfg.name;

    const gctoacInfo = {
      running: holders.gctoacRunning,
      pid: holders.gctoacPid,
      pidFile: gctoacPidFile(),
    };

    if (!this.isEnabled()) {
      return {
        enabled: false,
        available: false,
        message: 'PM2 admin disabled (PM2_ADMIN_ENABLED=false)',
        messageKey: 'pm2.msgDisabled',
        messageParams: {},
        app: null,
        appName,
        port,
        runner: this.inferRunner(null, holders) as RunnerMode,
        gctoac: gctoacInfo,
        config: cfg,
        portHolders: holders,
      };
    }

    const bin = await whichPm2();
    if (!bin) {
      return {
        enabled: true,
        available: false,
        message: 'pm2 binary not found — run: npm install -g pm2',
        messageKey: 'pm2.msgBinaryMissing',
        messageParams: {},
        app: null,
        appName,
        port,
        runner: this.inferRunner(null, holders) as RunnerMode,
        gctoac: gctoacInfo,
        config: cfg,
        portHolders: holders,
      };
    }

    try {
      const { stdout } = await runPm2(['jlist']);
      const list = JSON.parse(stdout || '[]') as Array<Record<string, unknown>>;
      const app =
        list.find((p) => p.name === appName) ||
        list.find((p) => String(p.name || '').includes('grok'));

      if (!app) {
        let messageKey = 'pm2.msgNotInList';
        let messageParams: Record<string, string | number> = { app: appName };
        let message = `App "${appName}" not in PM2 list — Start with PM2 or Switch to PM2.`;
        if (holders.pids.length) {
          if (holders.gctoacRunning) {
            messageKey = 'pm2.msgPortGctoac';
            messageParams = {
              port,
              pid: holders.gctoacPid ?? 0,
            };
            message = `Port ${port} is served by gctoac (pid ${holders.gctoacPid}). Use “Switch to PM2” to hand over.`;
          } else {
            messageKey = 'pm2.msgPortBusy';
            messageParams = {
              port,
              pids: holders.pids.join(', '),
            };
            message = `Port ${port} is in use (pid ${holders.pids.join(', ')}).`;
          }
        }
        return {
          enabled: true,
          available: true,
          message,
          messageKey,
          messageParams,
          app: null,
          appName,
          port,
          runner: this.inferRunner(null, holders) as RunnerMode,
          gctoac: gctoacInfo,
          config: cfg,
          portHolders: holders,
          lastError: '',
        };
      }

      const envPm2 = app.pm2_env as Record<string, unknown> | undefined;
      const monit = app.monit as Record<string, number> | undefined;
      const status = String(envPm2?.status ?? 'unknown');
      const restarts = Number(envPm2?.restart_time ?? 0);
      const pmPid = Number(envPm2?.pm_pid || app.pid || 0);
      const errored = status === 'errored' || status === 'stopped';

      let message = 'ok';
      let messageKey = 'pm2.msgOk';
      let messageParams: Record<string, string | number> = {};
      if (status === 'errored') {
        messageKey = 'pm2.msgErrored';
        message =
          'PM2 process errored — check logs / config, then Restart or fix port conflicts.';
      } else if (
        status === 'online' &&
        holders.gctoacRunning &&
        holders.gctoacPid &&
        holders.gctoacPid !== pmPid
      ) {
        messageKey = 'pm2.msgBothRunners';
        messageParams = { pid: holders.gctoacPid };
        message = `Both runners detected; gctoac pid ${holders.gctoacPid} also holds resources. Prefer one runner via Switch.`;
      }

      return {
        enabled: true,
        available: true,
        message,
        messageKey,
        messageParams,
        appName,
        app: {
          name: app.name,
          pm_id: app.pm_id,
          pid: pmPid || null,
          status,
          restarts,
          uptime: envPm2?.pm_uptime ?? null,
          memory: monit?.memory ?? null,
          cpu: monit?.cpu ?? null,
          exec_mode: envPm2?.exec_mode ?? cfg.exec_mode,
          instances: envPm2?.instances ?? cfg.instances,
          max_memory_restart: envPm2?.max_memory_restart ?? cfg.max_memory_restart,
          watch: envPm2?.watch ?? cfg.watch,
          autorestart: envPm2?.autorestart ?? cfg.autorestart,
        },
        port,
        runner: this.inferRunner(
          { status, pid: pmPid },
          holders,
        ) as RunnerMode,
        gctoac: gctoacInfo,
        config: cfg,
        portHolders: holders,
        lastError: errored || restarts > 5 ? tailErrorLog(25) : '',
      };
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : String(e);
      return {
        enabled: true,
        available: true,
        message: errMsg,
        messageKey: 'pm2.msgError',
        messageParams: { error: errMsg },
        app: null,
        appName,
        port,
        runner: this.inferRunner(null, holders) as RunnerMode,
        gctoac: gctoacInfo,
        config: cfg,
        portHolders: holders,
        lastError: tailErrorLog(25),
      };
    }
  }

  private inferRunner(
    pm2App: { status: string; pid: number } | null,
    holders: { gctoacRunning: boolean; gctoacPid: number | null; pids: number[] },
  ): RunnerMode {
    const pm2Online =
      pm2App &&
      (pm2App.status === 'online' || pm2App.status === 'launching') &&
      pm2App.pid > 0;
    if (pm2Online && !holders.gctoacRunning) return 'pm2';
    if (holders.gctoacRunning && !pm2Online) return 'gctoac';
    if (pm2Online && holders.gctoacRunning) return 'unknown';
    if (holders.pids.length > 0) return 'unknown';
    return 'none';
  }

  async start() {
    const cfg = readPm2Config();
    const notes = await freePortForPm2(env.PORT);
    try {
      await runPm2(['delete', cfg.name]);
    } catch {
      /* not running */
    }
    const eco = path.join(packageRoot(), 'ecosystem.config.cjs');
    const result = fs.existsSync(eco)
      ? await runPm2(['start', eco])
      : await runPm2([
          'start',
          path.join(packageRoot(), 'dist', 'server.js'),
          '--name',
          cfg.name,
        ]);
    // Remember preference
    writePm2Config({ ...cfg, preferred_runner: 'pm2' });
    return {
      ...result,
      notes: notes.length
        ? `Prepared port then started PM2: ${notes.join('; ')}`
        : 'Started via PM2',
    };
  }

  async stop() {
    const cfg = readPm2Config();
    try {
      return await runPm2(['stop', cfg.name]);
    } catch (e) {
      await freePortForPm2(env.PORT);
      throw e;
    }
  }

  async restart() {
    const cfg = readPm2Config();
    const notes = await freePortForPm2(env.PORT);
    try {
      const { stdout } = await runPm2(['jlist']);
      const list = JSON.parse(stdout || '[]') as Array<{
        name?: string;
        pm2_env?: { status?: string };
      }>;
      const app = list.find((p) => p.name === cfg.name);
      if (!app) {
        const started = await this.start();
        return { ...started, notes: `${notes.join('; ')}; started fresh` };
      }
      if (app.pm2_env?.status === 'errored') {
        await runPm2(['delete', cfg.name]);
        const started = await this.start();
        return {
          ...started,
          notes: `${notes.join('; ')}; deleted errored app and started`,
        };
      }
    } catch {
      /* fall through */
    }
    const result = await runPm2(['restart', cfg.name]);
    return {
      ...result,
      notes: notes.length ? notes.join('; ') : 'restarted',
    };
  }

  async reload() {
    const cfg = readPm2Config();
    return runPm2(['reload', cfg.name]);
  }

  /**
   * Apply saved config: rewrite runtime json; if PM2 app is online, schedule
   * a clean restart so the HTTP response can finish first.
   */
  async applyConfig(
    input?: Partial<Pm2RuntimeConfig> | Record<string, unknown>,
    opts?: { restart?: boolean; port?: number },
  ) {
    const raw = { ...(input || {}) } as Record<string, unknown>;
    const bodyPort =
      opts?.port != null
        ? Number(opts.port)
        : raw.port != null
          ? Number(raw.port)
          : undefined;
    delete raw.port;
    delete raw.restart;

    let portChange: ReturnType<Pm2Service['updateListenPort']> | null = null;
    if (
      bodyPort != null &&
      Number.isFinite(bodyPort) &&
      bodyPort !== env.PORT
    ) {
      portChange = this.updateListenPort(bodyPort);
    }

    const saved =
      Object.keys(raw).length > 0
        ? this.saveConfig(raw)
        : readPm2Config();

    const effectivePort =
      portChange?.port ??
      (Number(process.env.PORT) || env.PORT || DEFAULT_PORT);
    const shouldRestart = opts?.restart !== false;
    let scheduled: ReturnType<Pm2Service['scheduleSwitch']> | null = null;

    if (shouldRestart) {
      let pm2Online = false;
      try {
        const { stdout } = await runPm2(['jlist']);
        const list = JSON.parse(stdout || '[]') as Array<{
          name?: string;
          pm2_env?: { status?: string };
        }>;
        const app = list.find((p) => p.name === saved.name);
        pm2Online = Boolean(
          app &&
            (app.pm2_env?.status === 'online' ||
              app.pm2_env?.status === 'launching' ||
              app.pm2_env?.status === 'errored'),
        );
      } catch {
        pm2Online = false;
      }

      if (pm2Online || portChange) {
        const mode =
          pm2Online || saved.preferred_runner === 'pm2' ? 'pm2' : 'gctoac';
        scheduled = this.scheduleSwitch(mode, {
          home: process.env.GCTOAC_HOME,
          port: effectivePort,
        });
      }
    }

    return {
      config: saved,
      applied: true,
      restarted: Boolean(scheduled),
      scheduled,
      port: effectivePort,
      portChange,
      defaultPort: DEFAULT_PORT,
    };
  }

  /**
   * Switch active runner. Schedules work so HTTP can respond first when
   * the current process will be killed.
   */
  scheduleSwitch(mode: 'pm2' | 'gctoac', options?: { home?: string; port?: number }) {
    if (mode !== 'pm2' && mode !== 'gctoac') {
      throw ExceptionFactory.validation('mode must be pm2 or gctoac');
    }

    const root = packageRoot();
    const cli = path.join(root, 'dist', 'cli', 'index.js');
    const home = options?.home || process.env.GCTOAC_HOME || '';
    const port = options?.port || env.PORT || DEFAULT_PORT;
    const homeFlag = home ? ` --home ${JSON.stringify(home)}` : '';
    const portFlag = ` --port ${port}`;

    // Persist preference immediately
    const cfg = readPm2Config();
    writePm2Config({ ...cfg, preferred_runner: mode });

    let script: string;
    if (mode === 'pm2') {
      script = [
        'sleep 1.5',
        `node ${JSON.stringify(cli)} stop${homeFlag}${portFlag} || true`,
        // stop may free gctoac; also stop pm2 cleanly then start
        `node ${JSON.stringify(cli)} start --pm2${homeFlag}${portFlag} || true`,
      ].join(' && ');
    } else {
      script = [
        'sleep 1.5',
        // stop both then start detached gctoac
        `node ${JSON.stringify(cli)} stop${homeFlag}${portFlag} || true`,
        `node ${JSON.stringify(cli)} start${homeFlag}${portFlag} || true`,
      ].join(' && ');
    }

    const child = spawn('bash', ['-lc', script], {
      detached: true,
      stdio: 'ignore',
      env: process.env,
      cwd: root,
    });
    child.unref();

    return {
      scheduled: true as const,
      mode,
      port: env.PORT,
      /** Admin SPA localizes via this key — do not display English `message` raw */
      messageKey:
        mode === 'pm2' ? 'pm2.msgSwitchPm2' : 'pm2.msgSwitchGctoac',
      messageParams: { port: env.PORT },
      // English fallback for CLI / non-i18n clients only
      message:
        mode === 'pm2'
          ? `Switching to PM2… gateway restarts under PM2 shortly (port ${env.PORT}).`
          : `Switching to gctoac… gateway restarts as a detached process shortly (port ${env.PORT}).`,
    };
  }

  /**
   * Stop PM2 app if present (used by gctoac stop).
   */
  async stopPm2IfRunning(): Promise<string[]> {
    const cfg = readPm2Config();
    return stopPm2App(cfg.name);
  }

  async logs(lines = 100) {
    const n = Math.min(Math.max(lines, 10), 500);
    const trimmed = autoTrimAllLogs();
    const files = managedLogPaths();
    const meta: Array<{
      label: string;
      path: string;
      size: number;
      exists: boolean;
    }> = [];
    const chunks: string[] = [];
    for (const f of files) {
      let size = 0;
      let exists = false;
      try {
        if (fs.existsSync(f.path)) {
          exists = true;
          size = fs.statSync(f.path).size;
          const raw = fs.readFileSync(f.path, 'utf8');
          const tail = raw.split('\n').slice(-n).join('\n');
          chunks.push(
            `===== ${f.label} (${Math.round(size / 1024)} KB) =====\n${tail || '(empty)'}`,
          );
        }
      } catch {
        /* skip unreadable */
      }
      meta.push({ label: f.label, path: f.path, size, exists });
    }
    if (chunks.length) {
      return {
        stdout: chunks.join('\n\n'),
        stderr: '',
        files: meta,
        autoTrimmed: trimmed,
        maxBytes: LOG_MAX_BYTES,
        keepBytes: LOG_KEEP_BYTES,
      };
    }
    try {
      const r = await runPm2([
        'logs',
        readPm2Config().name,
        '--nostream',
        '--lines',
        String(n),
      ]);
      return {
        ...r,
        files: meta,
        autoTrimmed: trimmed,
        maxBytes: LOG_MAX_BYTES,
        keepBytes: LOG_KEEP_BYTES,
      };
    } catch (e) {
      return {
        stdout: '',
        stderr: e instanceof Error ? e.message : String(e),
        files: meta,
        autoTrimmed: trimmed,
        maxBytes: LOG_MAX_BYTES,
        keepBytes: LOG_KEEP_BYTES,
      };
    }
  }

  /**
   * Truncate managed log files (pm2-error/out + gctoac logs).
   * Safe while process is running (open FD keeps writing from offset 0 after truncate on most Unix).
   */
  async clearLogs(opts?: { which?: 'all' | 'error' | 'out' }): Promise<{
    cleared: Array<{ label: string; path: string; previousSize: number }>;
    maxBytes: number;
  }> {
    const which = opts?.which || 'all';
    const cleared: Array<{
      label: string;
      path: string;
      previousSize: number;
    }> = [];
    for (const f of managedLogPaths()) {
      const isErr =
        f.label.includes('error') ||
        f.label.includes('err') ||
        f.path.includes('error') ||
        f.path.includes('err');
      const isOut = !isErr;
      if (which === 'error' && !isErr) continue;
      if (which === 'out' && !isOut) continue;
      try {
        let previousSize = 0;
        if (fs.existsSync(f.path)) {
          previousSize = fs.statSync(f.path).size;
          fs.writeFileSync(
            f.path,
            `[log cleared ${new Date().toISOString()}]\n`,
            'utf8',
          );
        } else {
          fs.mkdirSync(path.dirname(f.path), { recursive: true });
          fs.writeFileSync(
            f.path,
            `[log cleared ${new Date().toISOString()}]\n`,
            'utf8',
          );
        }
        cleared.push({
          label: f.label,
          path: f.path,
          previousSize,
        });
      } catch {
        /* skip */
      }
    }
    return { cleared, maxBytes: LOG_MAX_BYTES };
  }

  async freeEverything(port?: number): Promise<string[]> {
    const p = port ?? env.PORT;
    const notes = [...(await this.stopPm2IfRunning())];
    const g = await stopGateway({ pidFile: gctoacPidFile(), port: p });
    if (g.stoppedPid) notes.push('stopped gctoac');
    if (g.freedPort.length) notes.push(`freed pids ${g.freedPort.join(',')}`);
    return notes;
  }
}

export const pm2Service = new Pm2Service();
// re-export name for callers
export { PM2_APP_NAME_DEFAULT as PM2_APP_NAME } from './pm2-config';
