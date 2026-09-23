import { escapeHtml } from './dom';
import { t } from '../i18n';

export type ConfirmOpts = {
  title?: string;
  message: string;
  variant?: 'info' | 'confirm' | 'danger';
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  input?: boolean;
  defaultValue?: string;
  placeholder?: string;
  maxLength?: number;
};

let uiDialogRoot: HTMLElement | null = null;
let uiDialogResolve: ((v: boolean | string | null) => void) | null = null;

function closeUiDialog(result: boolean | string | null): void {
  const resolve = uiDialogResolve;
  uiDialogResolve = null;
  if (uiDialogRoot) {
    uiDialogRoot.remove();
    uiDialogRoot = null;
  }
  document.body.classList.remove('ui-dialog-open');
  document.removeEventListener('keydown', onUiDialogKeydown, true);
  if (resolve) resolve(result);
}

function onUiDialogKeydown(e: KeyboardEvent): void {
  if (!uiDialogRoot) return;
  if (e.key === 'Escape') {
    e.preventDefault();
    e.stopPropagation();
    const cancelable = uiDialogRoot.dataset.cancelable !== '0';
    closeUiDialog(
      cancelable ? (uiDialogRoot.dataset.prompt === '1' ? null : false) : true,
    );
  }
}

export function openUiDialog(
  opts: ConfirmOpts,
): Promise<boolean | string | null> {
  if (uiDialogRoot) closeUiDialog(false);

  const variant =
    opts.variant || (opts.showCancel === false ? 'info' : 'confirm');
  const showCancel = opts.showCancel !== false;
  const isPrompt = Boolean(opts.input);
  const title =
    opts.title ||
    (variant === 'danger' ? t('common.dangerTitle') : t('common.confirm'));
  const confirmText =
    opts.confirmText ||
    (variant === 'danger' ? t('common.confirm') : t('common.confirm'));
  const cancelText = opts.cancelText || t('common.cancel');

  const root = document.createElement('div');
  root.className = `ui-dialog-root is-${variant}`;
  root.dataset.cancelable = showCancel ? '1' : '0';
  root.dataset.prompt = isPrompt ? '1' : '0';
  root.innerHTML = `
    <div class="ui-dialog-backdrop" data-ui-dismiss></div>
    <div class="ui-dialog" role="dialog" aria-modal="true">
      <div class="ui-dialog-h">${escapeHtml(title)}</div>
      <div class="ui-dialog-b">
        <p class="ui-dialog-msg">${escapeHtml(opts.message)}</p>
        ${
          isPrompt
            ? `<input class="input" id="ui-dialog-input" value="${escapeHtml(opts.defaultValue || '')}" placeholder="${escapeHtml(opts.placeholder || '')}" maxlength="${opts.maxLength ?? 500}" />`
            : ''
        }
      </div>
      <div class="ui-dialog-f">
        ${showCancel ? `<button type="button" class="btn secondary sm" data-ui-cancel>${escapeHtml(cancelText)}</button>` : ''}
        <button type="button" class="btn sm ${variant === 'danger' ? 'danger' : ''}" data-ui-ok>${escapeHtml(confirmText)}</button>
      </div>
    </div>`;

  document.body.appendChild(root);
  document.body.classList.add('ui-dialog-open');
  uiDialogRoot = root;
  document.addEventListener('keydown', onUiDialogKeydown, true);

  return new Promise((resolve) => {
    uiDialogResolve = resolve;
    root.querySelector('[data-ui-ok]')?.addEventListener('click', () => {
      if (isPrompt) {
        const input = document.getElementById(
          'ui-dialog-input',
        ) as HTMLInputElement | null;
        closeUiDialog(input?.value ?? '');
      } else {
        closeUiDialog(true);
      }
    });
    root.querySelector('[data-ui-cancel]')?.addEventListener('click', () => {
      closeUiDialog(isPrompt ? null : false);
    });
    root.querySelector('[data-ui-dismiss]')?.addEventListener('click', () => {
      if (showCancel) closeUiDialog(isPrompt ? null : false);
    });
    if (isPrompt) {
      const input = document.getElementById(
        'ui-dialog-input',
      ) as HTMLInputElement | null;
      input?.focus();
      input?.select();
    } else {
      (root.querySelector('[data-ui-ok]') as HTMLButtonElement | null)?.focus();
    }
  });
}

export async function uiConfirm(
  msg: string | ConfirmOpts,
): Promise<boolean> {
  const opts: ConfirmOpts =
    typeof msg === 'string'
      ? { message: msg, showCancel: true, variant: 'confirm' }
      : {
          title: msg.title,
          message: msg.message,
          showCancel: true,
          variant: msg.variant || 'confirm',
          confirmText: msg.confirmText,
          cancelText: msg.cancelText,
        };
  return Boolean(await openUiDialog(opts));
}

export async function uiAlert(message: string, title?: string): Promise<void> {
  await openUiDialog({
    title: title || t('common.confirm'),
    message,
    showCancel: false,
    variant: 'info',
  });
}
