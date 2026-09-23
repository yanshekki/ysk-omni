import { prisma } from '../config/database';
import { env } from '../config/env';
import { SETTING_KEYS, SAFE_TOOLS_MODES } from '../config/constants';
import type { AppSettings } from '../interfaces/app-settings.type';

const DEFAULTS: AppSettings = {
  globalSafeMode: false,
  safeMaxTurns: 4,
  safeTimeoutMs: 120_000,
  /** Strongest default: readonly tools only in safe mode */
  safeToolsMode: SAFE_TOOLS_MODES.READONLY,
  defaultModel: 'grok-4.6',
  adminPanelEnabled: true,
};

function parseBool(v: string | undefined, fallback: boolean): boolean {
  if (v === undefined) return fallback;
  return v === 'true' || v === '1';
}

function parseIntOr(v: string | undefined, fallback: number): number {
  if (v === undefined) return fallback;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

export class SettingsService {
  async getAll(): Promise<AppSettings> {
    const rows = await prisma.setting.findMany();
    const map = new Map(rows.map((r) => [r.key, r.value]));

    const envDefaults: AppSettings = {
      globalSafeMode: env.GROK_SAFE_MODE,
      safeMaxTurns: env.GROK_SAFE_MAX_TURNS,
      safeTimeoutMs: env.GROK_SAFE_TIMEOUT_MS,
      safeToolsMode: SAFE_TOOLS_MODES.READONLY,
      defaultModel: env.GROK_DEFAULT_MODEL,
      adminPanelEnabled: env.ADMIN_PANEL_ENABLED,
    };

    const toolsMode = map.get(SETTING_KEYS.SAFE_TOOLS_MODE);
    return {
      globalSafeMode: parseBool(
        map.get(SETTING_KEYS.GLOBAL_SAFE_MODE),
        envDefaults.globalSafeMode,
      ),
      safeMaxTurns: parseIntOr(
        map.get(SETTING_KEYS.SAFE_MAX_TURNS),
        envDefaults.safeMaxTurns,
      ),
      safeTimeoutMs: parseIntOr(
        map.get(SETTING_KEYS.SAFE_TIMEOUT_MS),
        envDefaults.safeTimeoutMs,
      ),
      safeToolsMode:
        toolsMode === SAFE_TOOLS_MODES.READONLY
          ? SAFE_TOOLS_MODES.READONLY
          : toolsMode === SAFE_TOOLS_MODES.NONE
            ? SAFE_TOOLS_MODES.NONE
            : envDefaults.safeToolsMode,
      defaultModel: map.get(SETTING_KEYS.DEFAULT_MODEL) || envDefaults.defaultModel,
      adminPanelEnabled: parseBool(
        map.get(SETTING_KEYS.ADMIN_PANEL_ENABLED),
        envDefaults.adminPanelEnabled,
      ),
    };
  }

  async update(
    partial: Partial<AppSettings>,
  ): Promise<AppSettings> {
    const entries: Array<[string, string]> = [];
    if (partial.globalSafeMode !== undefined) {
      entries.push([SETTING_KEYS.GLOBAL_SAFE_MODE, String(partial.globalSafeMode)]);
    }
    if (partial.safeMaxTurns !== undefined) {
      entries.push([SETTING_KEYS.SAFE_MAX_TURNS, String(partial.safeMaxTurns)]);
    }
    if (partial.safeTimeoutMs !== undefined) {
      entries.push([SETTING_KEYS.SAFE_TIMEOUT_MS, String(partial.safeTimeoutMs)]);
    }
    if (partial.safeToolsMode !== undefined) {
      entries.push([SETTING_KEYS.SAFE_TOOLS_MODE, partial.safeToolsMode]);
    }
    if (partial.defaultModel !== undefined) {
      entries.push([SETTING_KEYS.DEFAULT_MODEL, partial.defaultModel]);
    }
    if (partial.adminPanelEnabled !== undefined) {
      entries.push([SETTING_KEYS.ADMIN_PANEL_ENABLED, String(partial.adminPanelEnabled)]);
    }

    for (const [key, value] of entries) {
      await prisma.setting.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      });
    }

    return this.getAll();
  }
}

export const settingsService = new SettingsService();

// silence unused DEFAULTS warning if any
void DEFAULTS;
