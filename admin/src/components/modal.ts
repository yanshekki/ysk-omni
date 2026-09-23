import { escapeHtml } from '../lib/dom';
import { t } from '../i18n';
import { patchState } from '../state/store';

export type AppModalOpts = {
  title: string;
  /** Already-safe HTML or plain text (will NOT be re-escaped if contains tags from caller) */
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
  bodyHtml: string;
  footerHtml?: string;
};

/**
 * In-app modal — class names match public/admin/styles.css (.modal-back / .modal)
 */
export function openAppModal(opts: AppModalOpts): void {
  closeAppModal();
  const size = opts.size || 'md';
  const html = `
    <div class="modal-back" id="modal-back">
      <div class="modal modal--${escapeHtml(size)}" role="dialog" aria-modal="true">
        <div class="modal-h">
          <div class="modal-title-block">
            <strong>${escapeHtml(opts.title || '')}</strong>
            ${opts.subtitle ? `<div class="muted">${opts.subtitle}</div>` : ''}
          </div>
          <button type="button" class="modal-x" id="modal-close" aria-label="${escapeHtml(t('common.cancel'))}">×</button>
        </div>
        <div class="modal-b">${opts.bodyHtml || ''}</div>
        ${opts.footerHtml ? `<div class="modal-f">${opts.footerHtml}</div>` : ''}
      </div>
    </div>`;
  patchState({ modal: html });
  const app = document.getElementById('app');
  if (app) {
    app.insertAdjacentHTML('beforeend', html);
    bindModalClose();
  }
}

function bindModalClose(): void {
  const close = () => closeAppModal();
  document.getElementById('modal-close')?.addEventListener('click', close);
  document.getElementById('modal-back')?.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).id === 'modal-back') close();
  });
  const onEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      close();
      document.removeEventListener('keydown', onEsc);
    }
  };
  document.addEventListener('keydown', onEsc);
}

export function closeAppModal(): void {
  patchState({ modal: null });
  document.getElementById('modal-back')?.remove();
  document.getElementById('app-modal-root')?.remove();
}
