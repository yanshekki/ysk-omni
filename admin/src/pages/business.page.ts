import { appRoot, escapeHtml } from '../lib/dom';
import { bindShell, shell } from '../components/shell';
import { getLocale, t } from '../i18n';
import type { RenderCtx } from '../router';

const SUPPORT_EMAIL = 'email@ysk.hk';
const SUPPORT_SITE = 'https://ysk.hk/';

function businessMailto(): string {
  const subject =
    getLocale() === 'zh-Hant'
      ? 'YSK Omni 商務合作'
      : 'YSK Omni business partnership';
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

export async function renderBusinessPage(ctx: RenderCtx): Promise<void> {
  const app = appRoot();
  const mail = businessMailto();
  app.innerHTML = shell(`
    <div class="topbar">
      <h2>${escapeHtml(t('business.title'))}</h2>
    </div>
    <div class="page-meta" role="status"><span>${escapeHtml(t('business.subtitle'))}</span></div>
    <div class="support-pills" role="navigation">
      <button type="button" class="seg-tab is-active" data-jump="biz-deploy">${escapeHtml(t('business.pillDeploy'))}</button>
      <button type="button" class="seg-tab" data-jump="biz-oem">${escapeHtml(t('business.pillOem'))}</button>
      <button type="button" class="seg-tab" data-jump="biz-integrate">${escapeHtml(t('business.pillIntegrate'))}</button>
      <button type="button" class="seg-tab" data-jump="biz-partner">${escapeHtml(t('business.pillPartner'))}</button>
      <a class="seg-tab" href="${escapeHtml(mail)}">${escapeHtml(t('business.pillContact'))}</a>
    </div>
    <div class="support-stack">
      <section class="panel support-panel" id="biz-deploy">
        <div class="panel-h"><strong>${escapeHtml(t('business.deployTitle'))}</strong></div>
        <div class="panel-pad">
          <p class="support-prose">${escapeHtml(t('business.deployBody'))}</p>
          <ul class="support-list">
            <li>${escapeHtml(t('business.deployLi1'))}</li>
            <li>${escapeHtml(t('business.deployLi2'))}</li>
            <li>${escapeHtml(t('business.deployLi3'))}</li>
            <li>${escapeHtml(t('business.deployLi4'))}</li>
          </ul>
        </div>
      </section>
      <section class="panel support-panel" id="biz-oem">
        <div class="panel-h"><strong>${escapeHtml(t('business.oemTitle'))}</strong></div>
        <div class="panel-pad">
          <p class="support-prose">${escapeHtml(t('business.oemBody'))}</p>
          <ul class="support-list">
            <li>${escapeHtml(t('business.oemLi1'))}</li>
            <li>${escapeHtml(t('business.oemLi2'))}</li>
            <li>${escapeHtml(t('business.oemLi3'))}</li>
          </ul>
        </div>
      </section>
      <section class="panel support-panel" id="biz-integrate">
        <div class="panel-h"><strong>${escapeHtml(t('business.integrateTitle'))}</strong></div>
        <div class="panel-pad">
          <p class="support-prose">${escapeHtml(t('business.integrateBody'))}</p>
          <ul class="support-list">
            <li>${escapeHtml(t('business.integrateLi1'))}</li>
            <li>${escapeHtml(t('business.integrateLi2'))}</li>
            <li>${escapeHtml(t('business.integrateLi3'))}</li>
            <li>${escapeHtml(t('business.integrateLi4'))}</li>
          </ul>
        </div>
      </section>
      <section class="panel support-panel" id="biz-partner">
        <div class="panel-h"><strong>${escapeHtml(t('business.partnerTitle'))}</strong></div>
        <div class="panel-pad">
          <p class="support-prose">${escapeHtml(t('business.partnerBody'))}</p>
          <ul class="support-list">
            <li>${escapeHtml(t('business.partnerLi1'))}</li>
            <li>${escapeHtml(t('business.partnerLi2'))}</li>
          </ul>
        </div>
      </section>
      <section class="panel support-panel" id="biz-contact">
        <div class="panel-h"><strong>${escapeHtml(t('business.contactTitle'))}</strong></div>
        <div class="panel-pad">
          <p class="support-prose">${escapeHtml(t('business.contactBody'))}</p>
          <a class="btn support-email-btn" href="${escapeHtml(mail)}">${escapeHtml(t('business.contactCta'))}</a>
          <p class="support-docs"><a href="${SUPPORT_SITE}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('business.site'))}</a></p>
        </div>
      </section>
    </div>
  `);
  bindShell(ctx.rerender);
  document.querySelectorAll('[data-jump]').forEach((btn) => {
    (btn as HTMLElement).onclick = () => {
      const id = (btn as HTMLElement).dataset.jump;
      if (id)
        document.getElementById(id)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
    };
  });
}
