import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  KEY_MODES,
  SAFE_DISALLOWED_TOOLS,
  SAFE_READONLY_TOOLS,
  SAFE_TOOLS_MODES,
} from '../config/constants';
import { env } from '../config/env';
import type { AuthenticatedApiKey } from '../interfaces/authenticated-api-key.interface';
import type { ApiKeyMode } from '../interfaces/api-key-mode.type';
import type { ResolvedPolicy } from '../interfaces/resolved-policy.interface';
import { resolveSafeCwd } from '../utils/path-safe';
import { normalizeApiKeyMode } from '../utils/role-normalize';
import { settingsService } from './settings.service';

export class PolicyService {
  async resolve(
    apiKey: AuthenticatedApiKey,
    clientCwd?: string | null,
  ): Promise<ResolvedPolicy> {
    const settings = await settingsService.getAll();
    const keyMode = normalizeApiKeyMode(apiKey.role, apiKey.mode);
    const forcedSafe = settings.globalSafeMode || env.GROK_SAFE_MODE;
    const mode: ApiKeyMode = forcedSafe ? KEY_MODES.SAFE : keyMode;

    if (mode === KEY_MODES.SAFE) {
      const sandbox = await this.ensureSandbox(apiKey.id);
      const maxTurns = apiKey.maxTurns ?? settings.safeMaxTurns;
      const timeoutMs = apiKey.timeoutMs ?? settings.safeTimeoutMs;

      if (settings.safeToolsMode === SAFE_TOOLS_MODES.READONLY) {
        return {
          mode,
          alwaysApprove: false,
          cwd: sandbox,
          timeoutMs,
          maxTurns,
          toolsAllowlist: SAFE_READONLY_TOOLS,
          toolsDenylist: null,
          sandboxForced: true,
        };
      }

      return {
        mode,
        alwaysApprove: false,
        cwd: sandbox,
        timeoutMs,
        maxTurns,
        toolsAllowlist: null,
        toolsDenylist: SAFE_DISALLOWED_TOOLS,
        sandboxForced: true,
      };
    }

    return {
      mode,
      alwaysApprove: env.GROK_ALWAYS_APPROVE,
      cwd: resolveSafeCwd(clientCwd),
      timeoutMs: apiKey.timeoutMs ?? env.GROK_TIMEOUT_MS,
      maxTurns: apiKey.maxTurns ?? null,
      toolsAllowlist: null,
      toolsDenylist: null,
      sandboxForced: false,
    };
  }

  async ensureSandbox(apiKeyId: string): Promise<string> {
    // OTP sessions use synthetic ids — share sandbox with the persistent owner
    // so attachments/materialized files stay under a stable path across requests.
    let id = apiKeyId;
    try {
      const { isSyntheticApiKeyId, toPersistentApiKeyId } = await import(
        '../utils/api-key-id'
      );
      if (isSyntheticApiKeyId(apiKeyId)) {
        id = await toPersistentApiKeyId(apiKeyId);
      }
    } catch {
      /* keep original id */
    }
    const safeId = id.replace(/[^a-zA-Z0-9\-_]/g, '');
    const dir = path.join(env.storageDir, 'sandboxes', safeId || 'unknown');
    await fs.mkdir(dir, { recursive: true });
    return dir;
  }
}

export const policyService = new PolicyService();
