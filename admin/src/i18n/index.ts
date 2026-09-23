/**
 * i18n façade — messages ported from public/admin/i18n.js
 * Pages use only t / tf / tx / getLocale / setLocale / langSwitchHtml
 */
export {
  t,
  tf,
  hasT,
  getLocale,
  setLocale,
  langSwitchHtml,
} from './messages';

import { t as tRaw } from './messages';

/**
 * t() with fallback — t() returns the key path when missing, so `t(k) || fb` never works.
 */
export function tx(path: string, fallback: string): string {
  const v = tRaw(path);
  return v === path || v == null || v === '' ? fallback : v;
}
