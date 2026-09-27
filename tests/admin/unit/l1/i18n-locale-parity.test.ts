import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { LOCALE_IDS, LOCALE_NATIVE } from '../../../../admin/src/i18n/runtime';

function flatten(
  obj: unknown,
  prefix = '',
): Array<[string, unknown]> {
  const out: Array<[string, unknown]> = [];
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      const p = prefix ? `${prefix}.${k}` : k;
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        out.push(...flatten(v, p));
      } else {
        out.push([p, v]);
      }
    }
  }
  return out;
}

const LOCALE_DIR = path.resolve(process.cwd(), 'admin/src/i18n/locales');

function loadLocale(id: string): Record<string, unknown> {
  return JSON.parse(
    fs.readFileSync(path.join(LOCALE_DIR, `${id}.json`), 'utf8'),
  ) as Record<string, unknown>;
}

describe('Admin locale parity (top 10 languages)', () => {
  const en = new Map(flatten(loadLocale('en')));
  const zh = new Map(flatten(loadLocale('zh-Hant')));

  it('every locale has the same key paths as en', () => {
    for (const id of LOCALE_IDS) {
      const m = new Map(flatten(loadLocale(id)));
      const missing = [...en.keys()].filter((k) => !m.has(k));
      expect(missing, `${id} missing:\n${missing.join('\n')}`).toEqual([]);
    }
  });

  it('loads in Node without a document element', async () => {
    const { getLocale } = await import('../../../../admin/src/i18n/runtime');
    expect(getLocale()).toBeTruthy();
  });

  it('native names cover ten locales', () => {
    expect(LOCALE_IDS).toHaveLength(11);
    expect(LOCALE_NATIVE.ar).toBe('العربية');
    expect(LOCALE_NATIVE['zh-Hant']).toBe('繁體中文');
    expect(LOCALE_NATIVE['zh-Hans']).toBe('简体中文');
    expect(LOCALE_NATIVE.id).toBe('Bahasa Indonesia');
  });

  it('zh-Hant uses Hong Kong written Chinese glossary', () => {
    const banned =
      /稽核日誌|揀圖像|用戶端以 GET|准用清單|軟體|網路|默認|歷史殘留|Grok CLI/;
    const hits: string[] = [];
    for (const [k, v] of zh) {
      if (typeof v === 'string' && banned.test(v)) hits.push(`${k}: ${v}`);
    }
    expect(hits, hits.join('\n')).toEqual([]);
    expect(zh.get('nav.audit')).toBe('審計日誌');
    expect(zh.get('nav.support')).toBe('支援');
    expect(String(zh.get('chat.emptyHint'))).toContain('選擇圖像');
    expect(String(zh.get('keys.allowedModelsHint'))).toContain(
      'GET /v1/models',
    );
    expect(String(zh.get('keys.allowedModelsHint'))).toContain('可用模型清單');
  });

  it('en keys.allowedModelsHint matches zh meaning', () => {
    expect(String(en.get('keys.allowedModelsHint'))).toContain('GET /v1/models');
    expect(String(en.get('keys.allowedModelsHint'))).toContain('Users list');
  });
});

const TARGET_LANGS = ['hi', 'es', 'ar', 'fr', 'bn', 'pt', 'ru', 'id'] as const;
const PLACEHOLDER = /\{[^{}]+\}/g;

function uniqueLeaves(obj: unknown): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const walk = (v: unknown): void => {
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      for (const child of Object.values(v as Record<string, unknown>)) walk(child);
      return;
    }
    if (typeof v !== 'string' || !v.trim()) return;
    if (seen.has(v)) return;
    seen.add(v);
    out.push(v);
  };
  walk(obj);
  return out;
}

function loadUniqueJsonl(): Map<string, Record<string, string>> {
  const raw = fs.readFileSync(path.join(LOCALE_DIR, 'unique.jsonl'), 'utf8');
  const map = new Map<string, Record<string, string>>();
  for (const line of raw.split('\n')) {
    if (!line.trim()) continue;
    const row = JSON.parse(line) as Record<string, string>;
    map.set(row.en, row);
  }
  return map;
}

describe('unique.jsonl covers every Admin English leaf', () => {
  const leaves = uniqueLeaves(loadLocale('en'));
  const rows = loadUniqueJsonl();

  it('maps every unique non-empty en.json leaf into unique.jsonl', () => {
    const missing = leaves.filter((s) => !rows.has(s));
    expect(missing, missing.slice(0, 20).join('\n')).toEqual([]);
  });

  it('each mapped row has non-empty hi/es/ar/fr/bn/pt/ru/id and matching placeholders', () => {
    const bad: string[] = [];
    for (const en of leaves) {
      const row = rows.get(en);
      if (!row) continue;
      const enPh = en.match(PLACEHOLDER) ?? [];
      for (const lang of TARGET_LANGS) {
        const tr = row[lang];
        if (typeof tr !== 'string' || !tr.trim()) {
          bad.push(`${lang} empty for: ${en.slice(0, 80)}`);
          continue;
        }
        const trPh = tr.match(PLACEHOLDER) ?? [];
        if (trPh.join('\0') !== enPh.join('\0')) {
          bad.push(`${lang} placeholders ${trPh.join(',')} vs ${enPh.join(',')} for: ${en.slice(0, 80)}`);
        }
      }
    }
    expect(bad, bad.slice(0, 20).join('\n')).toEqual([]);
  });
});

