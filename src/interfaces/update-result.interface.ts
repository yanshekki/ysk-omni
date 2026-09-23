import type { InstallChannel } from './install-channel.type';

export interface UpdateResult {
  ok: boolean;
  channel: InstallChannel;
  fromVersion: string;
  toVersion: string | null;
  log: string[];
  restartRequired: boolean;
  message: string;
}
