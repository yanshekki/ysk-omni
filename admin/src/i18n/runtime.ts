import en from './locales/en.json';
import zhHant from './locales/zh-Hant.json';
import zhHans from './locales/zh-Hans.json';
import hi from './locales/hi.json';
import es from './locales/es.json';
import ar from './locales/ar.json';
import fr from './locales/fr.json';
import bn from './locales/bn.json';
import pt from './locales/pt.json';
import ru from './locales/ru.json';
import id from './locales/id.json';

export const LANG_KEY = 'gog_admin_lang';

export const LOCALE_IDS = [
  'en',
  'zh-Hant',
  'zh-Hans',
  'hi',
  'es',
  'ar',
  'fr',
  'bn',
  'pt',
  'ru',
  'id',
] as const;

export type LocaleId = (typeof LOCALE_IDS)[number];

export const LOCALE_NATIVE: Record<LocaleId, string> = {
  en: 'English',
  'zh-Hant': '繁體中文',
  'zh-Hans': '简体中文',
  hi: 'हिन्दी',
  es: 'Español',
  ar: 'العربية',
  fr: 'Français',
  bn: 'বাংলা',
  pt: 'Português',
  ru: 'Русский',
  id: 'Bahasa Indonesia',
};

const dict: Record<LocaleId, Record<string, unknown>> = {
  en: en as Record<string, unknown>,
  'zh-Hant': zhHant as Record<string, unknown>,
  'zh-Hans': zhHans as Record<string, unknown>,
  hi: hi as Record<string, unknown>,
  es: es as Record<string, unknown>,
  ar: ar as Record<string, unknown>,
  fr: fr as Record<string, unknown>,
  bn: bn as Record<string, unknown>,
  pt: pt as Record<string, unknown>,
  ru: ru as Record<string, unknown>,
  id: id as Record<string, unknown>,
};

export function isLocaleId(v: string | null | undefined): v is LocaleId {
  return !!v && (LOCALE_IDS as readonly string[]).includes(v);
}

function prefixLocale(tag: string): LocaleId | null {
  const n = tag.toLowerCase().replace('_', '-');
  if (n.startsWith('zh-hant') || n.startsWith('zh-tw') || n.startsWith('zh-hk') || n.startsWith('zh-mo')) {
    return 'zh-Hant';
  }
  if (n.startsWith('zh-hans') || n.startsWith('zh-cn') || n.startsWith('zh-sg') || n === 'zh') {
    return 'zh-Hans';
  }
  if (n.startsWith('zh')) return 'zh-Hant';
  if (n.startsWith('hi')) return 'hi';
  if (n.startsWith('es')) return 'es';
  if (n.startsWith('ar')) return 'ar';
  if (n.startsWith('fr')) return 'fr';
  if (n.startsWith('bn')) return 'bn';
  if (n.startsWith('pt')) return 'pt';
  if (n.startsWith('ru')) return 'ru';
  if (n.startsWith('id') || n.startsWith('ms')) return 'id';
  if (n.startsWith('en')) return 'en';
  return null;
}

export function detectLocale(): LocaleId {
  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(LANG_KEY);
      if (isLocaleId(saved)) return saved;
    }
  } catch {
    /* ignore */
  }
  const list: string[] = [];
  try {
    if (typeof navigator !== 'undefined') {
      if (Array.isArray(navigator.languages)) list.push(...navigator.languages);
      const nav = navigator.language || (navigator as { userLanguage?: string }).userLanguage;
      if (nav) list.push(nav);
    }
  } catch {
    /* ignore */
  }
  for (const tag of list) {
    const hit = prefixLocale(String(tag || ''));
    if (hit) return hit;
  }
  return 'en';
}

let locale: LocaleId = detectLocale();

export function applyDocumentLocale(next: LocaleId = locale): void {
  if (typeof document === 'undefined') return;
  document.documentElement.lang =
    next === 'zh-Hant' ? 'zh-Hant' : next === 'zh-Hans' ? 'zh-CN' : next;
  document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
}

export function getLocale(): LocaleId {
  return locale;
}

export function setLocale(next: string): void {
  if (!isLocaleId(next)) return;
  locale = next;
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(LANG_KEY, next);
  } catch {
    /* ignore */
  }
  applyDocumentLocale(next);
}

function lookup(tree: Record<string, unknown>, parts: string[]): string | null {
  let cur: unknown = tree;
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in (cur as object)) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return null;
    }
  }
  return typeof cur === 'string' ? cur : null;
}

export function t(path: string): string {
  const parts = path.split('.');
  const hit =
    lookup(dict[locale] || dict.en, parts) || lookup(dict.en, parts);
  return hit ?? path;
}

export function hasT(path: string): boolean {
  return t(path) !== path;
}

export function tf(path: string, vars: Record<string, unknown> = {}): string {
  let s = t(path);
  for (const [k, v] of Object.entries(vars)) {
    s = s.replaceAll(`{${k}}`, String(v));
  }
  return s;
}

export function langSwitchHtml(): string {
  const aria = t('common.language') === 'common.language' ? 'Language' : t('common.language');
  const opts = LOCALE_IDS.map(
    (id) =>
      `<option value="${id}" ${locale === id ? 'selected' : ''}>${LOCALE_NATIVE[id]}</option>`,
  ).join('');
  return `
  <div class="lang-switch" role="group" aria-label="${aria}">
    <select class="lang-select" aria-label="${aria}">${opts}</select>
  </div>`;
}

applyDocumentLocale(locale);
