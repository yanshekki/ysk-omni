import { DEFAULT_PORT, resolveRuntimePaths } from '../lib/paths';
import { readEnvFile } from '../lib/env-file';
import { baseUrls, info } from '../lib/print';

export async function cmdOpen(opts: {
  home?: string;
  forceHome?: boolean;
  admin?: boolean;
  port?: number;
}): Promise<void> {
  const paths = resolveRuntimePaths({
    home: opts.home,
    forceHome: opts.forceHome ?? Boolean(opts.home),
  });
  const env = readEnvFile(paths.envFile);
  const port = Number(opts.port || env.PORT || DEFAULT_PORT);
  const urls = baseUrls(port);
  if (opts.admin) {
    info(urls.admin);
  } else {
    info(`API:   ${urls.api}`);
    info(`Admin: ${urls.admin}`);
    info(`Health:${urls.health}`);
  }
}
