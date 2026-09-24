import { ExceptionFactory } from '../exceptions/exception.factory';

export const MODEL_ID_MAX = 128;
/** OpenAI / Hub ids: echo, tts-1, piper/lessac-high, org/repo:Q4_K_M */
export const MODEL_ID_RE = /^[A-Za-z0-9][A-Za-z0-9._:/-]{0,127}$/;

export type ModelAllowlistSource = {
  allowedModels?: string[] | null;
};

export function isValidModelId(id: string): boolean {
  const s = id.trim();
  return s.length > 0 && s.length <= MODEL_ID_MAX && MODEL_ID_RE.test(s);
}

export function parseModelList(input: unknown): string[] {
  const raw: string[] = [];
  if (input == null) return [];
  if (Array.isArray(input)) {
    for (const x of input) {
      const s = String(x).trim();
      if (s) raw.push(s);
    }
  } else if (typeof input === 'string') {
    const trimmed = input.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed)) return parseModelList(parsed);
    } catch {
      /* csv / lines */
    }
    for (const part of trimmed.split(/[\n,]+/)) {
      const s = part.trim();
      if (s) raw.push(s);
    }
  }
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of raw) {
    if (!isValidModelId(id) || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

export function serializeModelList(
  list: string[] | null | undefined,
): string | null {
  const parsed = parseModelList(list ?? []);
  if (!parsed.length) return null;
  return JSON.stringify(parsed);
}

/** Empty / missing list = all models. Restricted keys must name an allowed id. */
export function isModelAllowed(
  apiKey: ModelAllowlistSource,
  modelId: string | null | undefined,
): boolean {
  const list = apiKey.allowedModels;
  if (!list || list.length === 0) return true;
  const id = (modelId || '').trim();
  if (!id) return false;
  return list.includes(id);
}

export function assertModelAllowed(
  apiKey: ModelAllowlistSource,
  modelId: string | null | undefined,
): void {
  if (!isModelAllowed(apiKey, modelId)) {
    throw ExceptionFactory.modelNotAllowed(modelId);
  }
}

export function filterAllowedModels(
  ids: string[],
  allowed?: string[] | null,
): string[] {
  if (!allowed || allowed.length === 0) return ids;
  const set = new Set(allowed);
  return ids.filter((id) => set.has(id));
}
