import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import {
  DEFAULT_PORT,
  resolveRuntimePaths,
} from '../lib/paths';
import { ensureEnvFile, readEnvFile } from '../lib/env-file';
import { findPidsOnPort } from '../lib/process-mgr';
import { detectRunner } from '../lib/runner-info';
import { fail, info, ok, warn } from '../lib/print';

export async function cmdDoctor(opts: {
  home?: string;
  forceHome?: boolean;
  port?: number;
}): Promise<void> {
  let issues = 0;
  const paths = resolveRuntimePaths({
    home: opts.home,
    forceHome: opts.forceHome ?? Boolean(opts.home),
  });

  info(`Node: ${process.version}`);
  if (Number(process.versions.node.split('.')[0]) < 20) {
    fail('Node >= 20 required');
    issues += 1;
  } else {
    ok('Node version OK');
  }

  info(`Package root: ${paths.packageRoot}`);
  info(`Home (${paths.mode}): ${paths.home}`);

  try {
    const { loadRegistry } = await import('../../services/hf/registry');
    const { readEnginesState } = await import('../../services/runtimes/engine-manager');
    const { llamaServerBin } = await import('../../services/runtimes/llama-server');
    const { describeVllmRuntime } = await import('../../services/runtimes/vllm');
    const { ECHO_MODEL_ID } = await import('../../services/runtimes/echo');
    const st = readEnginesState();
    const local = loadRegistry().models;
    ok(`Echo engine: ${ECHO_MODEL_ID}`);
    info(`llama-server: ${llamaServerBin() || 'not on PATH'}`);
    info(`vllm: ${describeVllmRuntime()}`);
    if (!st.loaded.length) {
      info('Loaded engines: (none) — start the gateway and Load a model in Admin');
    } else {
      ok(
        `Loaded engines: ${st.loaded.map((m) => `${m.id} (${m.kind} :${m.port}, ${m.vramMb} MB)`).join(', ')}`,
      );
    }
    info(`Estimated VRAM: ${st.usedMb} MB / ${st.budgetMb} MB budget`);
    if (local.length) {
      info(`Registry: ${local.map((m) => m.id).join(', ')}`);
    }
  } catch (err) {
    warn(
      `Could not read model registry: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  if (!fs.existsSync(paths.envFile)) {
    // Missing setup is a real issue for production, but report as warn-level
    // diagnostic (still increments issues so doctor exits non-zero).
    fail(`.env missing — run: ysk-omni setup`);
    issues += 1;
  } else {
    ok(`.env found: ${paths.envFile}`);
    // Backfill missing modern keys (TRUST_PROXY, PROXY_IP_SOURCE, …)
    ensureEnvFile(paths, opts.port ?? DEFAULT_PORT);
    const env = readEnvFile(paths.envFile);

    if (!env.ENCRYPTION_KEY) {
      fail('ENCRYPTION_KEY missing in .env');
      issues += 1;
    } else {
      ok('ENCRYPTION_KEY set');
    }

    const port = Number(opts.port || env.PORT || DEFAULT_PORT);
    info(`PORT: ${port} (default ${DEFAULT_PORT})`);
    info(`NODE_ENV: ${env.NODE_ENV || '(unset → production default)'}`);
    if (env.NODE_ENV === 'development') {
      warn(
        'NODE_ENV=development (pretty logs). For installed / long-running use: NODE_ENV=production',
      );
    } else {
      ok('NODE_ENV=production (or production default)');
    }

    const cwd = env.OMNI_DEFAULT_CWD || '(storage/workspaces/default)';
    const allow = env.OMNI_CWD_ALLOWLIST || cwd;
    info(`OMNI_DEFAULT_CWD: ${cwd}`);
    const envDir = path.dirname(paths.envFile);
    const roots = String(allow)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const dangerous = [paths.packageRoot, envDir];
    if (
      roots.some((r) =>
        dangerous.some(
          (d) => r === d || r.startsWith(`${d}${path.sep}`) || d.startsWith(`${r}${path.sep}`),
        ),
      )
    ) {
      warn(
        'OMNI_CWD_ALLOWLIST / OMNI_DEFAULT_CWD includes the gateway root or .env directory — agent keys can read ENCRYPTION_KEY',
      );
    }

    // Proxy / reverse proxy
    const trust = env.TRUST_PROXY ?? '1';
    const src = env.PROXY_IP_SOURCE || 'auto';
    ok(`Trust proxy hops: ${trust}  |  PROXY_IP_SOURCE: ${src}`);
    if (trust === 'false' || trust === '0') {
      warn(
        'TRUST_PROXY=0/false — client IP ignores X-Forwarded-For / CF headers (OK for direct only)',
      );
    }

    // Rate-limit related (informational)
    info(
      `Rate limits: key ${env.RATE_LIMIT_MAX || '120'}/win · IP ${env.RATE_LIMIT_IP_MAX || '60'} · burst ${env.CHAT_BURST_MAX || '20'}`,
    );
    info(
      '  (Admin → DDoS policy overrides these at runtime when saved)',
    );

    // Dual runner / port conflict
    const det = detectRunner(paths, port);
    info(`Runner: ${det.runner}  preferred: ${det.preferred ?? '—'}`);
    if (det.runner === 'mixed') {
      fail('Both ysk-omni and PM2 appear online — fix with: ysk-omni stop && ysk-omni start [--pm2]');
      issues += 1;
    } else if (det.omniRunning) {
      ok(`ysk-omni running (pid ${det.omniPid})`);
    } else if (det.pm2.online) {
      ok(`PM2 online (${det.pm2.name}, ${det.pm2.status})`);
    } else {
      info('Server not running');
    }

    const pids = findPidsOnPort(port);
    if (pids.length > 1) {
      warn(`Multiple listeners on :${port}: ${pids.join(', ')} — EADDRINUSE risk`);
      issues += 1;
    } else if (pids.length === 1 && det.runner === 'none') {
      warn(`Port ${port} held by pid ${pids[0]} but runner not detected`);
    }

    // Log sizes
    const logFiles = [
      path.join(paths.logsDir, 'pm2-error.log'),
      path.join(paths.logsDir, 'pm2-out.log'),
      path.join(paths.logsDir, 'ysk-omni.err.log'),
      path.join(paths.logsDir, 'ysk-omni.out.log'),
    ];
    for (const f of logFiles) {
      try {
        if (fs.existsSync(f)) {
          const kb = Math.round(fs.statSync(f).size / 1024);
          if (kb > 5 * 1024) {
            warn(`Large log ${path.basename(f)}: ${kb} KB (Admin auto-trims >5MB on read; or Clear logs)`);
          }
        }
      } catch {
        /* ignore */
      }
    }
  }

  const serverJs = path.join(paths.packageRoot, 'dist', 'server.js');
  if (fs.existsSync(serverJs)) {
    ok('dist/server.js built');
  } else {
    warn('dist/server.js missing — run npm run build');
    issues += 1;
  }

  try {
    const which = execSync('which pm2', { encoding: 'utf8' }).trim();
    ok(`pm2: ${which}`);
  } catch {
    warn('pm2 not found — Admin PM2 page needs it. Install: npm install -g pm2');
    warn('Or run: ysk-omni update (may install pm2)');
  }

  if (issues === 0) {
    ok('Doctor: all checks passed');
  } else {
    fail(`Doctor: ${issues} issue(s)`);
    process.exitCode = 1;
  }
}
