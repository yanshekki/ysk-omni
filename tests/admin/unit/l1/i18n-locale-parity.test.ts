import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { describe, expect, it } from 'vitest';

function loadDict(file: string): { en: Record<string, unknown>; 'zh-Hant': Record<string, unknown> } {
  const src = fs.readFileSync(file, 'utf8');
  const start = src.indexOf('const dict = ');
  if (start < 0) throw new Error(`no dict in ${file}`);
  const rest = src.slice(start + 'const dict = '.length);
  const end = rest.search(/\nfunction detectLocale/);
  const objSrc = rest.slice(0, end).trim().replace(/;$/, '');
  return vm.runInNewContext(`(${objSrc})`) as {
    en: Record<string, unknown>;
    'zh-Hant': Record<string, unknown>;
  };
}

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

const I18N = path.resolve(process.cwd(), 'admin/src/full/i18n.js');

describe('Admin locale parity (en / zh-Hant)', () => {
  const dict = loadDict(I18N);
  const en = new Map(flatten(dict.en));
  const zh = new Map(flatten(dict['zh-Hant']));

  it('en and zh-Hant have the same key paths', () => {
    const missingZh = [...en.keys()].filter((k) => !zh.has(k));
    const missingEn = [...zh.keys()].filter((k) => !en.has(k));
    expect(missingZh, `missing zh-Hant:\n${missingZh.join('\n')}`).toEqual([]);
    expect(missingEn, `missing en:\n${missingEn.join('\n')}`).toEqual([]);
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
