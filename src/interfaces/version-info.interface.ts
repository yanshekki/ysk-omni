import type { InstallChannel } from './install-channel.type';
import type { VersionStatus } from './version-status.type';

export interface VersionInfo {
  current: string;
  latestNpm: string | null;
  latestGithub: string | null;
  latest: string | null;
  /** True only when a published version is strictly newer than local */
  updateAvailable: boolean;
  /**
   * update_available — registry newer than local
   * up_to_date — matches latest known release
   * ahead — local newer than npm/GitHub (common on git/dev)
   * unknown — could not fetch remote versions
   */
  versionStatus: VersionStatus;
  channel: InstallChannel;
  packageRoot: string;
  installSource: string;
}
