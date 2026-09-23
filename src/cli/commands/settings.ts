import { SETTING_KEYS } from '../../config/constants';
import {
  emitJson,
  initCliRuntime,
  parseOnOff,
  withPrisma,
  type CliOpts,
} from '../lib/runtime-context';
import { fail, info, ok } from '../lib/print';

type SettingsRow = {
  globalSafeMode: boolean;
  safeToolsMode: string;
  safeMaxTurns: number;
  safeTimeoutMs: number;
  defaultModel: string;
  adminPanelEnabled: boolean;
};

const PRESETS: Record<
  string,
  Pick<SettingsRow, 'globalSafeMode' | 'safeToolsMode' | 'safeMaxTurns' | 'safeTimeoutMs'>
> = {
  local: {
    globalSafeMode: false,
    safeToolsMode: 'none',
    safeMaxTurns: 16,
    safeTimeoutMs: 180_000,
  },
  prod: {
    globalSafeMode: true,
    safeToolsMode: 'none',
    safeMaxTurns: 10,
    safeTimeoutMs: 120_000,
  },
  code: {
    globalSafeMode: false,
    safeToolsMode: 'none',
    safeMaxTurns: 20,
    safeTimeoutMs: 300_000,
  },
  read: {
    globalSafeMode: true,
    safeToolsMode: 'readonly',
    safeMaxTurns: 12,
    safeTimeoutMs: 150_000,
  },
  chat: {
    globalSafeMode: true,
    safeToolsMode: 'none',
    safeMaxTurns: 5,
    safeTimeoutMs: 60_000,
  },
  long: {
    globalSafeMode: true,
    safeToolsMode: 'none',
    safeMaxTurns: 40,
    safeTimeoutMs: 600_000,
  },
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

async function readSettings(
  databaseUrl: string,
  envDefaultModel: string,
): Promise<SettingsRow> {
  return withPrisma(databaseUrl, async (prisma) => {
    const rows = await prisma.setting.findMany();
    const map = new Map(rows.map((r) => [r.key, r.value]));
    return {
      globalSafeMode: parseBool(map.get(SETTING_KEYS.GLOBAL_SAFE_MODE), false),
      safeToolsMode: map.get(SETTING_KEYS.SAFE_TOOLS_MODE) || 'readonly',
      safeMaxTurns: parseIntOr(map.get(SETTING_KEYS.SAFE_MAX_TURNS), 4),
      safeTimeoutMs: parseIntOr(map.get(SETTING_KEYS.SAFE_TIMEOUT_MS), 120_000),
      defaultModel: map.get(SETTING_KEYS.DEFAULT_MODEL) || envDefaultModel || 'grok-4.6',
      adminPanelEnabled: parseBool(map.get(SETTING_KEYS.ADMIN_PANEL_ENABLED), true),
    };
  });
}

async function writeSettings(
  databaseUrl: string,
  partial: Partial<SettingsRow>,
): Promise<void> {
  const entries: Array<[string, string]> = [];
  if (partial.globalSafeMode !== undefined) {
    entries.push([SETTING_KEYS.GLOBAL_SAFE_MODE, String(partial.globalSafeMode)]);
  }
  if (partial.safeToolsMode !== undefined) {
    entries.push([SETTING_KEYS.SAFE_TOOLS_MODE, partial.safeToolsMode]);
  }
  if (partial.safeMaxTurns !== undefined) {
    entries.push([SETTING_KEYS.SAFE_MAX_TURNS, String(partial.safeMaxTurns)]);
  }
  if (partial.safeTimeoutMs !== undefined) {
    entries.push([SETTING_KEYS.SAFE_TIMEOUT_MS, String(partial.safeTimeoutMs)]);
  }
  if (partial.defaultModel !== undefined) {
    entries.push([SETTING_KEYS.DEFAULT_MODEL, partial.defaultModel]);
  }
  if (partial.adminPanelEnabled !== undefined) {
    entries.push([SETTING_KEYS.ADMIN_PANEL_ENABLED, String(partial.adminPanelEnabled)]);
  }
  if (!entries.length) return;
  await withPrisma(databaseUrl, async (prisma) => {
    for (const [key, value] of entries) {
      await prisma.setting.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      });
    }
  });
}

function printSettings(s: SettingsRow): void {
  info('Safety / gateway settings');
  info(`  globalSafeMode:     ${s.globalSafeMode ? 'ON' : 'OFF'}`);
  info(`  safeToolsMode:      ${s.safeToolsMode}`);
  info(`  safeMaxTurns:       ${s.safeMaxTurns}`);
  info(`  safeTimeoutMs:      ${s.safeTimeoutMs} (${Math.round(s.safeTimeoutMs / 1000)}s)`);
  info(`  defaultModel:       ${s.defaultModel}`);
  info(`  adminPanelEnabled:  ${s.adminPanelEnabled ? 'ON' : 'OFF'}`);
  info('');
  info('Tip: panel on/off → gctoac admin on|off');
}

export async function cmdSettingsGet(opts: CliOpts): Promise<void> {
  const rt = initCliRuntime(opts);
  const s = await readSettings(rt.databaseUrl, rt.env.GROK_DEFAULT_MODEL || '');
  if (rt.json) emitJson(s);
  else printSettings(s);
}

export async function cmdSettingsSet(
  opts: CliOpts & {
    globalSafe?: string;
    tools?: string;
    maxTurns?: number;
    timeoutMs?: number;
    defaultModel?: string;
  },
): Promise<void> {
  const rt = initCliRuntime(opts);
  const partial: Partial<SettingsRow> = {};
  try {
    if (opts.globalSafe !== undefined) {
      partial.globalSafeMode = parseOnOff(opts.globalSafe);
    }
  } catch (e) {
    fail(e instanceof Error ? e.message : String(e));
    process.exitCode = 1;
    return;
  }
  if (opts.tools !== undefined) {
    const t = String(opts.tools).toLowerCase();
    if (t !== 'none' && t !== 'readonly') {
      fail('tools must be none | readonly');
      process.exitCode = 1;
      return;
    }
    partial.safeToolsMode = t;
  }
  if (opts.maxTurns !== undefined) partial.safeMaxTurns = opts.maxTurns;
  if (opts.timeoutMs !== undefined) partial.safeTimeoutMs = opts.timeoutMs;
  if (opts.defaultModel !== undefined) partial.defaultModel = opts.defaultModel.trim();

  if (!Object.keys(partial).length) {
    fail('No changes. Pass --global-safe / --tools / --max-turns / --timeout-ms / --default-model');
    process.exitCode = 1;
    return;
  }

  await writeSettings(rt.databaseUrl, partial);
  const s = await readSettings(rt.databaseUrl, rt.env.GROK_DEFAULT_MODEL || '');
  ok('Settings updated (gateway reloads policy within ~2s)');
  if (rt.json) emitJson(s);
  else printSettings(s);
}

export async function cmdSettingsPreset(
  opts: CliOpts & { name: string },
): Promise<void> {
  const rt = initCliRuntime(opts);
  const name = String(opts.name || '').toLowerCase();
  const preset = PRESETS[name];
  if (!preset) {
    fail(`Unknown preset: ${opts.name}`);
    info(`Available: ${Object.keys(PRESETS).join(', ')}`);
    process.exitCode = 1;
    return;
  }
  await writeSettings(rt.databaseUrl, preset);
  const s = await readSettings(rt.databaseUrl, rt.env.GROK_DEFAULT_MODEL || '');
  ok(`Applied safety preset: ${name}`);
  if (rt.json) emitJson({ preset: name, ...s });
  else printSettings(s);
}
