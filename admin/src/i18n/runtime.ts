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

/** English name shown as a second line so users can find their language. */
export const LOCALE_EN: Record<LocaleId, string> = {
  en: 'English',
  'zh-Hant': 'Traditional Chinese',
  'zh-Hans': 'Simplified Chinese',
  hi: 'Hindi',
  es: 'Spanish',
  ar: 'Arabic',
  fr: 'French',
  bn: 'Bengali',
  pt: 'Portuguese',
  ru: 'Russian',
  id: 'Indonesian',
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

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const GLOBE_SVG = `<svg class="lang-switch-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.8 3.8 6 3.8 9s-1.3 6.2-3.8 9c-2.5-2.8-3.8-6-3.8-9s1.3-6.2 3.8-9z"/></svg>`;

const CHEVRON_SVG = `<svg class="lang-switch-chevron" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>`;

const CHECK_SVG = `<svg class="lang-switch-check" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 12.5l4.2 4.2L19 7.5"/></svg>`;

export function langSwitchHtml(): string {
  const aria =
    t('common.language') === 'common.language' ? 'Language' : t('common.language');
  const current = LOCALE_NATIVE[locale];
  const items = LOCALE_IDS.map((id) => {
    const selected = locale === id;
    return `<li>
      <button type="button" class="lang-switch-option${selected ? ' is-selected' : ''}" role="option" data-lang="${id}" aria-selected="${selected}">
        <span class="lang-switch-option-text">
          <span class="lang-switch-native">${esc(LOCALE_NATIVE[id])}</span>
          <span class="lang-switch-en">${esc(LOCALE_EN[id])}</span>
        </span>
        ${selected ? CHECK_SVG : ''}
      </button>
    </li>`;
  }).join('');
  return `
  <div class="lang-switch" data-lang-switch>
    <button type="button" class="lang-switch-btn" aria-haspopup="listbox" aria-expanded="false" aria-label="${esc(aria)}">
      ${GLOBE_SVG}
      <span class="lang-switch-current">${esc(current)}</span>
      ${CHEVRON_SVG}
    </button>
    <div class="lang-switch-panel" hidden>
      <div class="lang-switch-heading">${esc(aria)}</div>
      <ul class="lang-switch-list" role="listbox" aria-label="${esc(aria)}">${items}</ul>
    </div>
  </div>`;
}

function closeAllLangSwitch(): void {
  document.querySelectorAll('[data-lang-switch]').forEach((root) => {
    root.classList.remove('is-open');
    const btn = root.querySelector('.lang-switch-btn');
    const panel = root.querySelector('.lang-switch-panel');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    if (panel) panel.setAttribute('hidden', '');
  });
}

function placeLangPanel(root: Element): void {
  const btn = root.querySelector('.lang-switch-btn') as HTMLElement | null;
  const panel = root.querySelector('.lang-switch-panel') as HTMLElement | null;
  if (!btn || !panel) return;
  const r = btn.getBoundingClientRect();
  const width = Math.min(280, Math.max(r.width, 228));
  const left = Math.min(
    Math.max(8, r.left),
    Math.max(8, window.innerWidth - width - 8),
  );
  panel.style.width = `${width}px`;
  panel.style.left = `${left}px`;
  const spaceBelow = window.innerHeight - r.bottom;
  if (spaceBelow < 260 && r.top > spaceBelow) {
    panel.style.top = 'auto';
    panel.style.bottom = `${window.innerHeight - r.top + 6}px`;
  } else {
    panel.style.top = `${r.bottom + 6}px`;
    panel.style.bottom = 'auto';
  }
}

export function bindLangSwitch(onChange: () => void): void {
  document.querySelectorAll('[data-lang-switch]').forEach((root) => {
    const btn = root.querySelector('.lang-switch-btn') as HTMLElement | null;
    const panel = root.querySelector('.lang-switch-panel') as HTMLElement | null;
    if (!btn || !panel) return;

    const open = () => {
      closeAllLangSwitch();
      root.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      panel.removeAttribute('hidden');
      placeLangPanel(root);
    };
    const close = () => {
      root.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      panel.setAttribute('hidden', '');
    };

    panel.addEventListener('click', (ev) => ev.stopPropagation());
    btn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      if (root.classList.contains('is-open')) close();
      else open();
    });

    root.querySelectorAll('[data-lang]').forEach((opt) => {
      (opt as HTMLElement).addEventListener('click', (ev) => {
        ev.stopPropagation();
        const id = (opt as HTMLElement).getAttribute('data-lang') || '';
        if (!isLocaleId(id) || id === locale) {
          close();
          return;
        }
        setLocale(id);
        onChange();
      });
    });
  });

  if (!(window as { __yskLangSwitchBound?: boolean }).__yskLangSwitchBound) {
    (window as { __yskLangSwitchBound?: boolean }).__yskLangSwitchBound = true;
    document.addEventListener('click', () => closeAllLangSwitch());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllLangSwitch();
    });
    window.addEventListener('resize', () => closeAllLangSwitch());
  }
}

applyDocumentLocale(locale);
