import fs from 'node:fs';
import path from 'node:path';
import type { ModelModality, ModelRuntime } from '../services/hf/registry';

export type CuratedPack = {
  id: string;
  repoId: string;
  modality: ModelModality;
  runtime: ModelRuntime;
  quants: string[];
  vramMb: number;
  flag?: string;
};

type CuratedFile = { packs: CuratedPack[] };

let cached: CuratedPack[] | null = null;

export function curatedCatalogPath(): string {
  const nextToJs = path.resolve(__dirname, 'curated.json');
  if (fs.existsSync(nextToJs)) return nextToJs;
  return path.resolve(__dirname, '..', '..', 'src', 'catalog', 'curated.json');
}

export function loadCuratedPacks(): CuratedPack[] {
  if (cached) return cached;
  const raw = fs.readFileSync(curatedCatalogPath(), 'utf8');
  const parsed = JSON.parse(raw) as CuratedFile;
  cached = Array.isArray(parsed.packs) ? parsed.packs : [];
  return cached;
}

export function findCuratedPack(specId: string): CuratedPack | undefined {
  const packs = loadCuratedPacks();
  return packs.find(
    (p) => p.id === specId || p.repoId === specId || specId.startsWith(`${p.repoId}:`),
  );
}
