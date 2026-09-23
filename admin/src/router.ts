/**
 * Page registry — mirrors backend admin.routes.ts domain split.
 * Each page module owns render + event bind for its surface.
 */
import type { PageId } from './config/constants';
import { renderLoginPage } from './pages/login.page';
import { renderDashboardPage } from './pages/dashboard.page';
import { renderMediaPage } from './pages/media.page';
import { renderApiFeaturesPage } from './pages/api-features.page';
import { renderKeysPage } from './pages/keys.page';
import { renderDocumentsPage } from './pages/documents.page';
import { renderChatsPage } from './pages/chats.page';
import { renderChatPage } from './pages/chat.page';
import { makeApiExplorerPage } from './pages/generic-api.page';
import { renderSupportPage } from './pages/support.page';
import { endpoints } from './config/endpoints';
import { t } from './i18n';

export type RenderCtx = {
  rerender: () => void;
};

export type PageRenderer = (ctx: RenderCtx) => Promise<void>;

const renderAudit = makeApiExplorerPage({
  titleKey: 'nav.audit',
  path: endpoints.audit,
  hint: 'Audit log list — full filters in A2',
});

const renderSettings = makeApiExplorerPage({
  titleKey: 'nav.settings',
  path: endpoints.settings,
  hint: 'Safety / settings — full editor in A2',
});

const renderUsage = makeApiExplorerPage({
  titleKey: 'nav.usage',
  path: endpoints.usage,
  hint: 'Usage & limits — full tables in A2',
});

const renderDdos = makeApiExplorerPage({
  titleKey: 'nav.ddos',
  path: endpoints.ddos,
  hint: 'DDoS center — full live UI in A2',
});

const renderQueue = makeApiExplorerPage({
  titleKey: 'nav.queue',
  path: endpoints.queue,
  hint: 'Chat queue — full controls in A2',
});

const renderPm2 = makeApiExplorerPage({
  titleKey: 'nav.pm2',
  path: endpoints.pm2,
  hint: 'PM2 process control — full UI in A2',
});

const renderSystem = makeApiExplorerPage({
  titleKey: 'nav.system',
  path: endpoints.system,
  hint: 'System info & updates — full UI in A2',
});

export const pageRegistry: Record<Exclude<PageId, 'login'>, PageRenderer> = {
  dashboard: renderDashboardPage,
  chat: renderChatPage,
  chats: renderChatsPage,
  keys: renderKeysPage,
  documents: renderDocumentsPage,
  media: renderMediaPage,
  audit: renderAudit,
  settings: renderSettings,
  apiFeatures: renderApiFeaturesPage,
  usage: renderUsage,
  ddos: renderDdos,
  queue: renderQueue,
  pm2: renderPm2,
  system: renderSystem,
  support: renderSupportPage,
};

export async function renderPage(
  page: PageId,
  ctx: RenderCtx,
): Promise<void> {
  if (page === 'login') {
    await renderLoginPage();
    return;
  }
  const fn = pageRegistry[page] || pageRegistry.dashboard;
  await fn(ctx);
}

export function pageLabel(page: PageId): string {
  if (page === 'login') return t('loginTitle');
  return t(`nav.${page === 'apiFeatures' ? 'apiFeatures' : page}`);
}
