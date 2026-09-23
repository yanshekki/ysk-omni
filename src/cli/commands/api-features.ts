import { SETTING_KEYS } from '../../config/constants';
import {
  API_FEATURE_PRESETS,
  DEFAULT_API_FEATURES,
  type ApiFeatures,
} from '../../interfaces/api-features.type';
import {
  emitJson,
  initCliRuntime,
  parseOnOff,
  withPrisma,
  type CliOpts,
} from '../lib/runtime-context';
import { fail, info, ok } from '../lib/print';

async function loadFeatures(databaseUrl: string): Promise<ApiFeatures> {
  return withPrisma(databaseUrl, async (prisma) => {
    const row = await prisma.setting.findUnique({
      where: { key: SETTING_KEYS.API_FEATURES },
    });
    if (!row?.value) return { ...DEFAULT_API_FEATURES };
    try {
      return { ...DEFAULT_API_FEATURES, ...JSON.parse(row.value) };
    } catch {
      return { ...DEFAULT_API_FEATURES };
    }
  });
}

async function saveFeatures(
  databaseUrl: string,
  features: ApiFeatures,
): Promise<void> {
  await withPrisma(databaseUrl, async (prisma) => {
    await prisma.setting.upsert({
      where: { key: SETTING_KEYS.API_FEATURES },
      create: {
        key: SETTING_KEYS.API_FEATURES,
        value: JSON.stringify(features),
      },
      update: { value: JSON.stringify(features) },
    });
  });
}

function printFeatures(f: ApiFeatures): void {
  info('API features / Grok capability gates');
  info('');
  info('Protocols:');
  info(`  openaiChat:          ${f.openaiChat}`);
  info(`  openaiResponses:     ${f.openaiResponses}`);
  info(`  anthropicMessages:   ${f.anthropicMessages}`);
  info('');
  info('Capabilities:');
  for (const key of [
    'tools',
    'structuredOutput',
    'vision',
    'reasoningEffort',
    'webSearch',
    'subagents',
    'planMode',
    'memory',
    'sessionResume',
    'bestOfN',
    'checkLoop',
    'systemOverride',
    'rules',
    'permissionMode',
    'sandbox',
  ] as const) {
    info(`  ${key.padEnd(20)} ${f[key]}`);
  }
  info('');
  info('Emulation:');
  info(`  usageEstimate:       ${f.usageEstimate}`);
  info(`  assistantsEmulation: ${f.assistantsEmulation}`);
  info(`  strictSampling:      ${f.strictSampling}`);
  info(`  forceDisableToolsInSafe: ${f.forceDisableToolsInSafe}`);
  info('');
  info('Media APIs (OpenAI-compatible):');
  info(`  imagesApi:           ${f.imagesApi}`);
  info(`  audioApi:            ${f.audioApi}`);
  info(`  videoApi:            ${f.videoApi}`);
  info(`  filesOpenAiAlias:    ${f.filesOpenAiAlias}`);
}

export async function cmdApiFeaturesGet(opts: CliOpts): Promise<void> {
  const rt = initCliRuntime(opts);
  const f = await loadFeatures(rt.databaseUrl);
  if (rt.json) emitJson(f);
  else printFeatures(f);
}

export async function cmdApiFeaturesSet(
  opts: CliOpts & Partial<Record<keyof ApiFeatures, string>>,
): Promise<void> {
  const rt = initCliRuntime(opts);
  const cur = await loadFeatures(rt.databaseUrl);
  const partial: Partial<ApiFeatures> = {};
  const keys = Object.keys(DEFAULT_API_FEATURES) as (keyof ApiFeatures)[];
  try {
    for (const key of keys) {
      const raw = opts[key];
      if (raw !== undefined && raw !== null && String(raw) !== '') {
        partial[key] = parseOnOff(String(raw));
      }
    }
  } catch (e) {
    fail(e instanceof Error ? e.message : String(e));
    process.exitCode = 1;
    return;
  }
  if (!Object.keys(partial).length) {
    fail('No flags. Example: gctoac api features set --tools on --vision off');
    process.exitCode = 1;
    return;
  }
  const next = { ...cur, ...partial };
  await saveFeatures(rt.databaseUrl, next);
  ok('API features updated (live within ~2s)');
  if (rt.json) emitJson(next);
  else printFeatures(next);
}

export async function cmdApiFeaturesPreset(
  opts: CliOpts & { name: string },
): Promise<void> {
  const rt = initCliRuntime(opts);
  const name = String(opts.name || '').toLowerCase();
  if (name !== 'open' && name !== 'locked' && name !== 'dev') {
    fail('Preset must be open | locked | dev');
    process.exitCode = 1;
    return;
  }
  const next = {
    ...DEFAULT_API_FEATURES,
    ...API_FEATURE_PRESETS[name],
  };
  await saveFeatures(rt.databaseUrl, next);
  ok(`Applied API features preset: ${name}`);
  if (rt.json) emitJson(next);
  else printFeatures(next);
}
