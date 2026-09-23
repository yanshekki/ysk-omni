/** Admin SPA constants — mirrors backend config spirit */

export const API_BASE = '/admin/api';

/** Session token storage key (OTP login only — never long-lived API keys) */
export const KEY_STORAGE = 'gog_admin_session';

export const LANG_KEY = 'gog_admin_lang';

export type PageId =
  | 'login'
  | 'dashboard'
  | 'chat'
  | 'chats'
  | 'keys'
  | 'documents'
  | 'media'
  | 'audit'
  | 'settings'
  | 'apiFeatures'
  | 'usage'
  | 'ddos'
  | 'queue'
  | 'pm2'
  | 'system'
  | 'support';

/** Hash-route map: #/media → page id */
export const PAGE_HASH: Record<string, PageId> = {
  login: 'login',
  dashboard: 'dashboard',
  chat: 'chat',
  chats: 'chats',
  keys: 'keys',
  documents: 'documents',
  media: 'media',
  audit: 'audit',
  settings: 'settings',
  'api-features': 'apiFeatures',
  apifeatures: 'apiFeatures',
  usage: 'usage',
  ddos: 'ddos',
  queue: 'queue',
  pm2: 'pm2',
  system: 'system',
  support: 'support',
};

export function pageToHash(page: PageId): string {
  if (page === 'apiFeatures') return 'api-features';
  if (page === 'login') return 'login';
  return page;
}

export const NAV_ITEMS: { id: PageId; labelKey: string }[] = [
  { id: 'dashboard', labelKey: 'nav.dashboard' },
  { id: 'chat', labelKey: 'nav.chat' },
  { id: 'chats', labelKey: 'nav.chats' },
  { id: 'keys', labelKey: 'nav.keys' },
  { id: 'documents', labelKey: 'nav.documents' },
  { id: 'media', labelKey: 'nav.media' },
  { id: 'audit', labelKey: 'nav.audit' },
  { id: 'settings', labelKey: 'nav.settings' },
  { id: 'apiFeatures', labelKey: 'nav.apiFeatures' },
  { id: 'usage', labelKey: 'nav.usage' },
  { id: 'ddos', labelKey: 'nav.ddos' },
  { id: 'queue', labelKey: 'nav.queue' },
  { id: 'pm2', labelKey: 'nav.pm2' },
  { id: 'system', labelKey: 'nav.system' },
  { id: 'support', labelKey: 'nav.support' },
];

/** Pages with no Admin API — skip pagePrimaryGetPath / route matrix. */
export const STATIC_NAV_PAGES: readonly PageId[] = ['support'];
