import type { ApiKeyMode } from './api-key-mode.type';

/** Fully resolved execution policy for a chat run. */
export interface ResolvedPolicy {
  mode: ApiKeyMode;
  alwaysApprove: boolean;
  cwd: string;
  timeoutMs: number;
  maxTurns: number | null;
  /** If set, passed as --tools allowlist */
  toolsAllowlist: string | null;
  /** If set, passed as --disallowed-tools */
  toolsDenylist: string | null;
  sandboxForced: boolean;
}
