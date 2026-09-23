import { NAV_ITEMS, type PageId } from '../config/constants';
import { escapeHtml } from '../lib/dom';
import { t, langSwitchHtml, setLocale } from '../i18n';
import {
  getState,
  logout,
  setPage,
  onErr,
} from '../state/store';

function pageTitle(page: PageId): string {
  const item = NAV_ITEMS.find((n) => n.id === page);
  return item ? t(item.labelKey) : t('brand');
}

function navBtn(id: PageId, label: string, current: PageId): string {
  return `<button type="button" class="nav-btn ${current === id ? 'active' : ''}" data-nav="${id}">${escapeHtml(label)}</button>`;
}

export function poweredByFooter(): string {
  return `
  <footer class="site-footer">
    <a class="powered-by" href="https://ysk.hk/" target="_blank" rel="noopener noreferrer">
      <img src="/admin/assets/logo.svg" alt="" width="22" height="22" />
      <span>${escapeHtml(t('common.powered'))} <strong>YSK Limited</strong></span>
    </a>
  </footer>`;
}

/** App chrome — sidebar + main content slot */
export function shell(content: string): string {
  const st = getState();
  const navHtml = NAV_ITEMS.map((n) =>
    navBtn(n.id, t(n.labelKey), st.page),
  ).join('');

  return `
  <div class="app-shell">
    <header class="mobile-bar">
      <button type="button" class="icon-btn" id="nav-open" aria-label="${escapeHtml(t('shell.menu'))}">☰</button>
      <div class="mobile-title">${escapeHtml(pageTitle(st.page))}</div>
      ${langSwitchHtml()}
      <button type="button" class="btn ghost sm" id="btn-logout-mobile">${escapeHtml(t('logout'))}</button>
    </header>
    <div class="layout">
      <button type="button" class="sidebar-backdrop" id="nav-backdrop" aria-label="${escapeHtml(t('shell.closeMenu'))}"></button>
      <aside class="sidebar" id="sidebar">
        <div class="brand">
          <img class="brand-logo" src="/admin/assets/logo.svg" alt="YSK" width="40" height="40" />
          <div class="brand-text">
            <strong>${escapeHtml(t('brand'))}</strong>
            <small>${escapeHtml(t('brandSub'))}</small>
          </div>
        </div>
        ${langSwitchHtml()}
        ${navHtml}
        <div class="sidebar-foot">
          <button class="btn secondary sm logout-btn" id="btn-logout">${escapeHtml(t('logout'))}</button>
        </div>
      </aside>
      <main class="main">
        <div id="flash-error" class="error-box" ${st.error ? '' : 'hidden'}>${escapeHtml(st.error)}</div>
        ${content}
      </main>
    </div>
    ${poweredByFooter()}
  </div>
  ${st.modal || ''}
  `;
}

function closeNav(): void {
  document.body.classList.remove('nav-open');
}

function openNav(): void {
  document.body.classList.add('nav-open');
}

/** Bind shell chrome events after render. `rerender` re-runs full app render. */
export function bindShell(rerender: () => void): void {
  closeNav();
  document.querySelectorAll('[data-nav]').forEach((b) => {
    (b as HTMLElement).onclick = () => {
      closeNav();
      const id = (b as HTMLElement).dataset.nav as PageId;
      if (id) setPage(id);
    };
  });
  const logoutHandler = () => logout(true);
  document.getElementById('btn-logout')?.addEventListener('click', logoutHandler);
  document
    .getElementById('btn-logout-mobile')
    ?.addEventListener('click', logoutHandler);
  document.getElementById('nav-open')?.addEventListener('click', openNav);
  document.getElementById('nav-backdrop')?.addEventListener('click', closeNav);
  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Escape') closeNav();
    },
    { once: true },
  );
  document.querySelectorAll('[data-lang]').forEach((b) => {
    (b as HTMLElement).onclick = () => {
      const lang = (b as HTMLElement).dataset.lang;
      if (lang === 'en' || lang === 'zh-Hant') {
        setLocale(lang);
        try {
          rerender();
        } catch (e) {
          onErr(e);
        }
      }
    };
  });
}
