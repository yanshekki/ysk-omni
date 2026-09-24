import os from 'node:os';
import path from 'node:path';

/** Data home: OMNI_HOME if set, otherwise ~/.ysk-omni. */
export function omniHome(): string {
  const env = process.env.OMNI_HOME?.trim();
  if (env) return path.resolve(env);
  return path.join(os.homedir(), '.ysk-omni');
}
