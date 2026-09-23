import { cmdStart } from './start';
import { cmdStop } from './stop';
import { resolveRuntimePaths } from '../lib/paths';
import { pm2AppStatus, readPreferredRunner } from '../lib/runner-info';
import { info, warn } from '../lib/print';

export async function cmdRestart(opts: {
  home?: string;
  port?: number;
  foreground?: boolean;
  pm2?: boolean;
  forceHome?: boolean;
}): Promise<void> {
  // Stop may find nothing — that is OK for restart; do not leave exitCode=1
  process.exitCode = 0;
  await cmdStop({ ...opts, quietIfNotRunning: true }).catch(() => undefined);
  process.exitCode = 0;
  await new Promise((r) => setTimeout(r, 400));

  // Honor preferred_runner unless user explicitly chose --pm2 / --foreground
  let pm2 = opts.pm2;
  if (pm2 == null && !opts.foreground) {
    const paths = resolveRuntimePaths({
      home: opts.home,
      forceHome: opts.forceHome ?? Boolean(opts.home),
    });
    const preferred = readPreferredRunner(paths.packageRoot);
    if (preferred === 'pm2') {
      if (pm2AppStatus(paths.packageRoot).available) {
        pm2 = true;
        info('Preferred runner is PM2 — restarting under PM2');
      } else {
        warn('Preferred runner is PM2 but pm2 is not on PATH — starting with gctoac');
        pm2 = false;
      }
    }
  }

  await cmdStart({ ...opts, pm2 });
}
