import { execFileSync, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import type { RuntimePaths } from './paths';
import {
  clearPid,
  findPidsOnPort,
  isProcessRunning,
  killPid,
  readPid,
} from './process-mgr';
import { fail, info, ok, warn } from './print';

const DEFAULT_APP = 'grok-openai-gateway';

function whichPm2(): string | null {
  try {
    return execFileSync('which', ['pm2'], { encoding: 'utf8' }).trim() || null;
  } catch {
    return null;
  }
}

function readAppName(packageRoot: string): string {
  try {
    const p = path.join(packageRoot, 'pm2.runtime.json');
    if (fs.existsSync(p)) {
      const j = JSON.parse(fs.readFileSync(p, 'utf8')) as { name?: string };
      if (j.name) return j.name;
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_APP;
}

function writePreferredRunner(packageRoot: string, runner: 'pm2' | 'gctoac'): void {
  const p = path.join(packageRoot, 'pm2.runtime.json');
  let cur: Record<string, unknown> = {};
  try {
    if (fs.existsSync(p)) {
      cur = JSON.parse(fs.readFileSync(p, 'utf8')) as Record<string, unknown>;
    }
  } catch {
    cur = {};
  }
  cur.preferred_runner = runner;
  if (!cur.name) cur.name = DEFAULT_APP;
  fs.writeFileSync(p, `${JSON.stringify(cur, null, 2)}\n`, 'utf8');
}

async function freePort(paths: RuntimePaths, port: number): Promise<void> {
  const gctoacPid = readPid(paths.pidFile);
  if (gctoacPid && isProcessRunning(gctoacPid)) {
    await killPid(gctoacPid);
    clearPid(paths.pidFile);
    info(`Stopped gctoac pid ${gctoacPid}`);
  }
  for (const p of findPidsOnPort(port)) {
    await killPid(p);
    info(`Freed port listener pid ${p}`);
  }
  await new Promise((r) => setTimeout(r, 400));
}

function runPm2(args: string[], cwd: string): void {
  const bin = whichPm2();
  if (!bin) {
    throw new Error('pm2 not found. Install: npm install -g pm2');
  }
  execFileSync(bin, args, {
    cwd,
    stdio: 'inherit',
    env: process.env,
    timeout: 60_000,
  });
}

/**
 * Start gateway under PM2 (CLI path — no server env module).
 */
export async function startGatewayWithPm2(opts: {
  paths: RuntimePaths;
  port: number;
  env: Record<string, string>;
}): Promise<void> {
  const { paths, port } = opts;
  if (!whichPm2()) {
    fail('pm2 not found on PATH');
    info('Install: npm install -g pm2');
    process.exitCode = 1;
    return;
  }

  const serverJs = path.join(paths.packageRoot, 'dist', 'server.js');
  if (!fs.existsSync(serverJs)) {
    fail(`Server not built: ${serverJs}. Run npm run build first.`);
    process.exitCode = 1;
    return;
  }

  await freePort(paths, port);

  const appName = readAppName(paths.packageRoot);
  try {
    runPm2(['delete', appName], paths.packageRoot);
  } catch {
    /* not in list */
  }

  // Ensure PORT in process env for ecosystem / app
  process.env.PORT = String(port);
  process.env.GCTOAC_HOME = paths.home;
  for (const [k, v] of Object.entries(opts.env)) {
    if (v !== undefined) process.env[k] = v;
  }

  const eco = path.join(paths.packageRoot, 'ecosystem.config.cjs');
  info(`Starting via PM2 (app: ${appName}, port ${port})…`);
  if (fs.existsSync(eco)) {
    runPm2(['start', eco], paths.packageRoot);
  } else {
    runPm2(
      ['start', serverJs, '--name', appName, '--cwd', paths.packageRoot],
      paths.packageRoot,
    );
  }

  writePreferredRunner(paths.packageRoot, 'pm2');
  // Clear gctoac pid — process is under PM2 now
  clearPid(paths.pidFile);

  await new Promise((r) => setTimeout(r, 600));
  try {
    const jlist = execFileSync(whichPm2()!, ['jlist'], {
      encoding: 'utf8',
      cwd: paths.packageRoot,
      timeout: 10_000,
    });
    const list = JSON.parse(jlist || '[]') as Array<{
      name?: string;
      pm2_env?: { status?: string; pm_pid?: number };
    }>;
    const app = list.find((a) => a.name === appName);
    const st = app?.pm2_env?.status || 'unknown';
    const pid = app?.pm2_env?.pm_pid;
    if (st === 'online') {
      ok(`PM2 online${pid ? ` (pid ${pid})` : ''}`);
    } else {
      warn(`PM2 status: ${st}`);
    }
  } catch {
    ok('PM2 start issued');
  }

  info(`  API:   http://127.0.0.1:${port}/v1`);
  info(`  Admin: http://127.0.0.1:${port}/admin/`);
  info(`  Logs:  pm2 logs ${appName}`);
  info(`  Stop:  gctoac stop   (or pm2 stop ${appName})`);
}

/**
 * Stop PM2 app if present. Returns true if something was stopped.
 */
export async function stopPm2App(paths: RuntimePaths): Promise<boolean> {
  const bin = whichPm2();
  if (!bin) return false;
  const appName = readAppName(paths.packageRoot);
  let stopped = false;
  try {
    execSync(`${JSON.stringify(bin)} stop ${JSON.stringify(appName)}`, {
      cwd: paths.packageRoot,
      stdio: 'ignore',
      timeout: 20_000,
    });
    stopped = true;
  } catch {
    /* not running */
  }
  try {
    execSync(`${JSON.stringify(bin)} delete ${JSON.stringify(appName)}`, {
      cwd: paths.packageRoot,
      stdio: 'ignore',
      timeout: 20_000,
    });
    stopped = true;
  } catch {
    /* not in list */
  }
  return stopped;
}
