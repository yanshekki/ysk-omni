import { buildRuntimesReport } from '../../services/runtimes/runtime-catalog';
import { initCliRuntime, emitJson, type CliOpts } from '../lib/runtime-context';
import { info, ok, warn } from '../lib/print';

export async function cmdRuntimes(opts: CliOpts): Promise<void> {
  initCliRuntime(opts);
  const report = buildRuntimesReport();
  if (opts.json) {
    emitJson(report);
    return;
  }
  ok(`Host ${report.host.platform}`);
  for (const it of report.items) {
    const mark =
      it.status === 'installed' || it.status === 'configured' ? 'ok' : it.status;
    const line = `${it.name.padEnd(22)} [${it.modalities.join(',')}]  ${mark}${it.path ? `  ${it.path}` : ''}`;
    if (it.status === 'installed' || it.status === 'configured') info(`  ${line}`);
    else warn(`  ${line}`);
    const cmd = it.install[report.host.os];
    if (it.status === 'missing' || it.status === 'unsupported') {
      info(`    ${cmd.split('\n')[0]}`);
    }
  }
}
