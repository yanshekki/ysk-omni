import path from 'node:path';
import {
  ensureHomeDirs,
  resolveRuntimePaths,
  DEFAULT_PORT,
} from '../lib/paths';
import {
  ensureEnvFile,
  loadEnvIntoProcess,
  setEnvPort,
} from '../lib/env-file';
import fs from 'node:fs';
import {
  clearPid,
  findPidsOnPort,
  isProcessRunning,
  readPid,
  startDetached,
  stopGateway,
} from '../lib/process-mgr';
import { startGatewayWithPm2, stopPm2App } from '../lib/pm2-runner';
import { tryAutoMigrate } from '../lib/auto-migrate';
import { baseUrls, fail, info, ok, warn } from '../lib/print';

function tailLog(file: string, maxLines = 30): string {
  try {
    if (!fs.existsSync(file)) return '';
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    return lines.slice(-maxLines).join('\n').trim();
  } catch {
    return '';
  }
}

export async function cmdStart(opts: {
  home?: string;
  port?: number;
  foreground?: boolean;
  /** Start under PM2 instead of detached node */
  pm2?: boolean;
  forceHome?: boolean;
}): Promise<void> {
  const paths = resolveRuntimePaths({
    home: opts.home,
    forceHome: opts.forceHome ?? Boolean(opts.home),
  });
  ensureHomeDirs(paths);

  let envFile = ensureEnvFile(paths, opts.port ?? DEFAULT_PORT);
  // Persist --port into .env so Admin / next restart / open use the same port
  if (opts.port != null && Number.isFinite(opts.port) && opts.port > 0) {
    envFile = setEnvPort(paths.envFile, opts.port);
  }
  loadEnvIntoProcess(paths.envFile);

  const migrated = tryAutoMigrate({
    packageRoot: paths.packageRoot,
    databaseUrl: envFile.DATABASE_URL || paths.databaseUrl,
  });
  if (migrated.ok) {
    ok('Database migrations applied');
  } else {
    warn(
      `Auto-migrate skipped/failed: ${migrated.error || 'unknown'}. Run: gctoac migrate`,
    );
  }

  const port = Number(opts.port || envFile.PORT || DEFAULT_PORT);

  if (opts.foreground && opts.pm2) {
    fail('Cannot combine --foreground and --pm2');
    process.exitCode = 1;
    return;
  }

  // PM2 mode: stop any previous runner, start under PM2
  if (opts.pm2) {
    await startGatewayWithPm2({ paths, port, env: envFile });
    return;
  }

  const existing = readPid(paths.pidFile);
  if (existing && isProcessRunning(existing)) {
    fail(`Already running (pid ${existing}). Use: gctoac stop`);
    process.exitCode = 1;
    return;
  }
  if (existing && !isProcessRunning(existing)) {
    clearPid(paths.pidFile);
  }

  // If PM2 holds the port, stop it first (switch to gctoac)
  const orphans = findPidsOnPort(port);
  if (orphans.length) {
    warn(
      `Port ${port} already in use (pid ${orphans.join(', ')}). Cleaning up…`,
    );
    await stopPm2App(paths).catch(() => undefined);
    await stopGateway({ pidFile: paths.pidFile, port });
    await new Promise((r) => setTimeout(r, 400));
    const still = findPidsOnPort(port);
    if (still.length) {
      fail(
        `Port ${port} still in use (pid ${still.join(', ')}). Kill manually: kill ${still.join(' ')}`,
      );
      process.exitCode = 1;
      return;
    }
    ok(`Port ${port} freed`);
  }

  const env: NodeJS.ProcessEnv = {
    ...process.env,
    ...envFile,
    PORT: String(port),
    DATABASE_URL: envFile.DATABASE_URL || paths.databaseUrl,
    STORAGE_DIR: envFile.STORAGE_DIR || paths.storageDir,
    GCTOAC_HOME: paths.home,
  };

  if (opts.foreground) {
    info(`Starting foreground on port ${port}…`);
    for (const [k, v] of Object.entries(env)) {
      if (v !== undefined) process.env[k] = v;
    }
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require(path.join(paths.packageRoot, 'dist', 'server.js'));
    return;
  }

  // Remember preferred runner
  try {
    const p = path.join(paths.packageRoot, 'pm2.runtime.json');
    let cur: Record<string, unknown> = {};
    if (fs.existsSync(p)) {
      cur = JSON.parse(fs.readFileSync(p, 'utf8')) as Record<string, unknown>;
    }
    cur.preferred_runner = 'gctoac';
    fs.writeFileSync(p, `${JSON.stringify(cur, null, 2)}\n`, 'utf8');
  } catch {
    /* ignore */
  }

  const pid = startDetached(paths, env);
  await new Promise((r) => setTimeout(r, 800));
  if (!isProcessRunning(pid)) {
    clearPid(paths.pidFile);
    const errLog = path.join(paths.logsDir, 'gctoac.err.log');
    fail(`Server exited immediately (pid ${pid}).`);
    info(`  Logs: ${errLog}`);
    const tail = tailLog(errLog);
    if (tail) {
      info('--- last error log ---');
      console.error(tail);
      info('----------------------');
    }
    if (tail.includes('EADDRINUSE')) {
      warn(`Port still busy. Try: gctoac stop && gctoac start`);
    }
    process.exitCode = 1;
    return;
  }

  ok(`Started pid ${pid} (gctoac detached)`);
  const urls = baseUrls(port);
  info(`  API:   ${urls.api}`);
  info(`  Admin: ${urls.admin}`);
  info(`  Logs:  ${path.join(paths.logsDir, 'gctoac.out.log')}`);
  info(`  Tip:   gctoac start --pm2  to run under PM2 instead`);
}
