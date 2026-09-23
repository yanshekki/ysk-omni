import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export type ModelModality = 'text' | 'image' | 'video' | 'tts' | 'stt';
export type ModelRuntime = 'llamacpp' | 'vllm' | 'echo' | 'diffusion' | 'whisper';

export type RegistryEntry = {
  id: string;
  repoId: string;
  filename: string;
  path: string;
  quant: string;
  modality: ModelModality;
  runtime: ModelRuntime;
  vramMb: number;
  pulledAt: string;
  sha256: string;
};

export type ModelRegistry = {
  models: RegistryEntry[];
};

function defaultRegistryPath(): string {
  const home = process.env.OMNI_HOME?.trim()
    ? path.resolve(process.env.OMNI_HOME.trim())
    : path.join(os.homedir(), '.ysk-omni');
  return path.join(home, 'registry.json');
}

export function registryPath(override?: string): string {
  return override || defaultRegistryPath();
}

export function emptyRegistry(): ModelRegistry {
  return { models: [] };
}

export function loadRegistry(file = registryPath()): ModelRegistry {
  try {
    const raw = fs.readFileSync(file, 'utf8');
    const parsed = JSON.parse(raw) as ModelRegistry;
    if (!parsed || !Array.isArray(parsed.models)) return emptyRegistry();
    return parsed;
  } catch {
    return emptyRegistry();
  }
}

export function saveRegistry(reg: ModelRegistry, file = registryPath()): void {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(reg, null, 2) + '\n', 'utf8');
}

export function upsertEntry(
  entry: RegistryEntry,
  file = registryPath(),
): RegistryEntry {
  const reg = loadRegistry(file);
  const idx = reg.models.findIndex((m) => m.id === entry.id);
  if (idx >= 0) {
    reg.models[idx] = entry;
  } else {
    reg.models.push(entry);
  }
  saveRegistry(reg, file);
  return entry;
}

export function removeEntry(id: string, file = registryPath()): boolean {
  const reg = loadRegistry(file);
  const next = reg.models.filter((m) => m.id !== id);
  if (next.length === reg.models.length) return false;
  saveRegistry({ models: next }, file);
  return true;
}

export function findEntry(id: string, file = registryPath()): RegistryEntry | undefined {
  return loadRegistry(file).models.find((m) => m.id === id || m.repoId === id);
}

export function makeEntryId(repoId: string, quant?: string): string {
  return quant ? `${repoId}:${quant}` : repoId;
}
