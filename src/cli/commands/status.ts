import {
  DEFAULT_PORT,
  resolveRuntimePaths,
} from '../lib/paths';
import { readEnvFile } from '../lib/env-file';
import { detectRunner } from '../lib/runner-info';
import { baseUrls, fail, info, ok, warn } from '../lib/print';

export async function cmdStatus(opts: {
  home?: string;
  forceHome?: boolean;
  port?: number;
}): Promise<void> {
  const paths = resolveRuntimePaths({
    home: opts.home,
    forceHome: opts.forceHome ?? Boolean(opts.home),
  });
  const env = readEnvFile(paths.envFile);
  const port = Number(opts.port || env.PORT || DEFAULT_PORT);
  const urls = baseUrls(port);
  const det = detectRunner(paths, port);

  info(`Home:       ${paths.home} (${paths.mode})`);
  info(`NODE_ENV:   ${env.NODE_ENV || '(unset → production default)'}`);
  info(`Port:       ${port}${opts.port ? ' (--port)' : ''}`);
  info(
    `Trust proxy:${env.TRUST_PROXY ?? '(default 1)'}  IP source: ${env.PROXY_IP_SOURCE || 'auto'}`,
  );
  info(`Preferred:  ${det.preferred ?? '(none)'}`);
  info(`Runner:     ${det.runner}`);

  if (det.gctoacRunning) {
    ok(`gctoac:     pid ${det.gctoacPid}`);
  } else {
    info('gctoac:     not running');
  }

  if (det.pm2.available) {
    if (det.pm2.online) {
      ok(
        `PM2:        ${det.pm2.name} ${det.pm2.status}${det.pm2.pid ? ` (pid ${det.pm2.pid})` : ''}`,
      );
    } else {
      info(
        `PM2:        ${det.pm2.name} — ${det.pm2.status || 'not running'}`,
      );
    }
  } else {
    info('PM2:        binary not found');
  }

  if (det.runner === 'mixed') {
    warn(
      'Both gctoac and PM2 look online — risk of EADDRINUSE. Run: gctoac stop && gctoac start [--pm2]',
    );
  }
  if (det.portPids.length && det.runner === 'unknown') {
    warn(
      `Port ${port} held by pid(s) ${det.portPids.join(', ')} (unknown process)`,
    );
  }

  info(`API:        ${urls.api}`);
  info(`Admin:      ${urls.admin}`);

  let code = 0;
  try {
    const res = await fetch(urls.health, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const body = (await res.json()) as { status?: string };
      ok(`Health:     ${body.status ?? res.status}`);
    } else {
      fail(`Health:     HTTP ${res.status}`);
      code = 1;
    }
  } catch {
    fail('Health:     unreachable');
    code = det.runner !== 'none' ? 1 : 0;
  }

  if (det.runner === 'none') {
    code = code || 1;
  }

  // Hard-exit: undici keep-alive after fetch can leave the process hanging
  process.exit(code);
}
