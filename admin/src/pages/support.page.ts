import { appRoot, escapeHtml } from '../lib/dom';
import { bindShell, shell } from '../components/shell';
import { t } from '../i18n';
import type { RenderCtx } from '../router';

const SUPPORT_EMAIL = 'email@ysk.hk';
const SUPPORT_SPONSORS = 'https://github.com/sponsors/yanshekki';
const SUPPORT_LINKTREE = 'https://linktr.ee/yanshekki';
const SUPPORT_SITE = 'https://ysk.hk/';
const SUPPORT_DOCS =
  'https://github.com/yanshekki/Grok-Cli-to-OpenAI-compatible#readme';

const WALLETS = [
  { labelKey: 'support.netEvm', addr: 'yanshekki.eth' },
  { labelKey: 'support.netNear', addr: 'yanshekki.near' },
  { labelKey: 'support.netAda', addr: '$yanshekki' },
] as const;

export async function renderSupportPage(ctx: RenderCtx): Promise<void> {
  const walletRows = WALLETS.map(
    (w) => `
      <tr>
        <td>${escapeHtml(t(w.labelKey))}</td>
        <td><code class="cell-code">${escapeHtml(w.addr)}</code></td>
        <td><button type="button" class="btn secondary sm" data-copy="${escapeHtml(w.addr)}">${escapeHtml(t('support.copy'))}</button></td>
      </tr>`,
  ).join('');

  appRoot().innerHTML = shell(`
    <div class="topbar">
      <h2>${escapeHtml(t('support.title'))}</h2>
    </div>
    <div class="page-meta" role="status"><span>${escapeHtml(t('support.subtitle'))}</span></div>
    <div class="support-pills" role="navigation">
      <button type="button" class="seg-tab is-active" data-jump="support-creator">${escapeHtml(t('support.pillSupport'))}</button>
      <button type="button" class="seg-tab" data-jump="support-sponsor">${escapeHtml(t('support.pillSponsor'))}</button>
      <a class="seg-tab" href="mailto:${SUPPORT_EMAIL}">${escapeHtml(t('support.pillHelp'))}</a>
    </div>
    <div class="support-stack">
      <section class="panel support-panel" id="support-creator">
        <div class="panel-h"><strong>${escapeHtml(t('support.creatorTitle'))}</strong></div>
        <div class="panel-pad"><p class="support-prose">${escapeHtml(t('support.creatorBody'))}</p></div>
      </section>
      <section class="panel support-panel" id="support-sponsor">
        <div class="panel-h"><strong>${escapeHtml(t('support.sponsorTitle'))}</strong></div>
        <div class="panel-pad">
          <p class="support-prose">${escapeHtml(t('support.sponsorBody'))}</p>
          <div class="support-actions">
            <a class="btn" href="${SUPPORT_SPONSORS}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('support.githubSponsors'))}</a>
            <a class="btn secondary" href="${SUPPORT_LINKTREE}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('support.linktree'))}</a>
          </div>
          <div class="support-wallets">
            <div class="support-wallets-h">
              <strong>${escapeHtml(t('support.walletsTitle'))}</strong>
              <span class="muted">${escapeHtml(t('support.walletsHint'))}</span>
            </div>
            <table class="data-table">
              <thead><tr>
                <th>${escapeHtml(t('support.net'))}</th>
                <th>${escapeHtml(t('support.addr'))}</th>
                <th></th>
              </tr></thead>
              <tbody>${walletRows}</tbody>
            </table>
          </div>
        </div>
      </section>
      <section class="panel support-panel" id="support-ysk">
        <div class="panel-h"><strong>${escapeHtml(t('support.yskTitle'))}</strong></div>
        <div class="panel-pad">
          <p class="support-prose">${escapeHtml(t('support.yskBody'))}</p>
          <ul class="support-list">
            <li>${escapeHtml(t('support.yskLi1'))}</li>
            <li>${escapeHtml(t('support.yskLi2'))}</li>
            <li>${escapeHtml(t('support.yskLi3'))}</li>
            <li>${escapeHtml(t('support.yskLi4'))}</li>
          </ul>
          <p class="muted">${escapeHtml(t('support.yskPrice'))}</p>
          <a class="btn secondary sm" href="${SUPPORT_SITE}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('support.site'))}</a>
        </div>
      </section>
      <section class="panel support-panel" id="support-help">
        <div class="panel-h"><strong>${escapeHtml(t('support.helpTitle'))}</strong></div>
        <div class="panel-pad">
          <p class="support-prose">${escapeHtml(t('support.helpBody'))}</p>
          <a class="btn support-email-btn" href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>
          <p class="support-docs"><a href="${SUPPORT_DOCS}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('support.docs'))}</a></p>
        </div>
      </section>
    </div>
  `);
  bindShell(ctx.rerender);
  document.querySelectorAll('[data-jump]').forEach((btn) => {
    (btn as HTMLElement).onclick = () => {
      const id = (btn as HTMLElement).dataset.jump;
      if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
  });
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    (btn as HTMLElement).onclick = async () => {
      const v = (btn as HTMLElement).dataset.copy || '';
      try {
        await navigator.clipboard.writeText(v);
      } catch {
        /* ignore */
      }
      const el = btn as HTMLElement;
      el.textContent = t('chat.copied');
      setTimeout(() => {
        el.textContent = t('support.copy');
      }, 1400);
    };
  });
}
