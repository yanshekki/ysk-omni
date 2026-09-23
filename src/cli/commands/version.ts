import fs from 'node:fs';
import path from 'node:path';
import { getPackageRoot } from '../lib/paths';
import { info } from '../lib/print';

export function cmdVersion(): void {
  const pkgPath = path.join(getPackageRoot(), 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as {
    name: string;
    version: string;
  };
  info(`${pkg.name} v${pkg.version}`);
}
