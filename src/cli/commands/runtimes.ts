import {
  buildRuntimesReport,
  hostOs,
  installArgv,
  uninstallArgv,
} from '../../services/runtimes/runtime-catalog';
import {
  runInstall,
  runUninstall,
} from '../../services/runtimes/runtime-install';
import { initCliRuntime, emitJson, type CliOpts } from '../lib/runtime-context';
import { fail, info, ok, warn } from '../lib/print';

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

export async function cmdRuntimesInstall(
  opts: CliOpts & { id: string },
): Promise<void> {
  initCliRuntime(opts);
  const id = String(opts.id || '')
    .trim()
    .toLowerCase();
  const steps = installArgv(id, hostOs());
  if (!steps.length) {
    fail(`No one-click install for ${id} on ${hostOs()}`);
    process.exitCode = 1;
    return;
  }
  const result = await runInstall(id, (ev) => {
    if (opts.json) {
      console.log(JSON.stringify(ev));
      return;
    }
    if (ev.type === 'step') info(`$ ${ev.argv.join(' ')}`);
    else if (ev.type === 'log') info(ev.line);
    else if (ev.type === 'error') fail(ev.message);
    else if (ev.type === 'done' && ev.code === 0) ok(`Installed ${id}`);
  });
  if (!result.ok) process.exitCode = 1;
}

export async function cmdRuntimesUninstall(
  opts: CliOpts & { id: string },
): Promise<void> {
  initCliRuntime(opts);
  const id = String(opts.id || '')
    .trim()
    .toLowerCase();
  const steps = uninstallArgv(id, hostOs());
  if (!steps.length) {
    fail(`No one-click uninstall for ${id} on ${hostOs()}`);
    process.exitCode = 1;
    return;
  }
  const result = await runUninstall(id, (ev) => {
    if (opts.json) {
      console.log(JSON.stringify(ev));
      return;
    }
    if (ev.type === 'step') info(`$ ${ev.argv.join(' ')}`);
    else if (ev.type === 'log') info(ev.line);
    else if (ev.type === 'error') fail(ev.message);
    else if (ev.type === 'done' && ev.code === 0) ok(`Uninstalled ${id}`);
  });
  if (!result.ok) process.exitCode = 1;
}
