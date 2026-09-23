/**
 * Dependency bridge for chat playground (legacy port).
 * Keeps playground.ts free of direct cross-layer imports sprawl.
 */
import { appRoot, escapeHtml } from '../../lib/dom';
import { fmtBytes, fmtTime } from '../../lib/format';
import { uiConfirm } from '../../lib/confirm';
import { openAppModal, closeAppModal } from '../../components/modal';
import { shell, bindShell } from '../../components/shell';
import { t, tf, getLocale } from '../../i18n';
import {
  getState,
  getToken,
  patchState,
  showError,
  onErr,
} from '../../state/store';
import { apiSend } from '../../lib/http';
import type { RenderCtx } from '../../router';

export type { RenderCtx };
export {
  appRoot,
  escapeHtml,
  fmtBytes,
  fmtTime,
  uiConfirm,
  openAppModal,
  closeAppModal,
  shell,
  bindShell,
  t,
  tf,
  getLocale,
  getToken,
  showError,
  onErr,
};

/** Allowed upload extensions — mirror public/admin/allowed-extensions.js */
export const CHAT_ALLOWED_EXTENSIONS = new Set([
  '.txt',
  '.md',
  '.markdown',
  '.csv',
  '.json',
  '.xml',
  '.html',
  '.htm',
  '.js',
  '.ts',
  '.tsx',
  '.jsx',
  '.py',
  '.java',
  '.go',
  '.rs',
  '.c',
  '.cpp',
  '.h',
  '.hpp',
  '.css',
  '.yml',
  '.yaml',
  '.toml',
  '.ini',
  '.env',
  '.sh',
  '.sql',
  '.log',
  '.pdf',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
]);

export const CHAT_FILE_ACCEPT = [...CHAT_ALLOWED_EXTENSIONS].join(',');

export function getMe() {
  return getState().me;
}

export function getKeys(): Array<Record<string, unknown>> {
  return getState().keys as Array<Record<string, unknown>>;
}

export function setKeys(v: Array<Record<string, unknown>>): void {
  patchState({ keys: v });
}

export function getModels(): string[] {
  return getState().models;
}

export function setModels(v: string[]): void {
  patchState({ models: v });
}

export function getPage(): string {
  return getState().page;
}

/**
 * Legacy-shaped admin API: api(path, { method, body: JSON string, headers })
 */
export async function adminApi(
  path: string,
  options: {
    method?: string;
    body?: string;
    headers?: Record<string, string>;
  } = {},
): Promise<unknown> {
  let body: unknown = undefined;
  if (options.body !== undefined) {
    try {
      body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
    } catch {
      body = options.body;
    }
  }
  return apiSend(path, {
    method: options.method || (body !== undefined ? 'POST' : 'GET'),
    body,
    headers: options.headers,
  });
}

/** marked + DOMPurify from global vendor scripts (index.html) */
export function formatChatMarkdown(src: string): string {
  if (!src) return '';
  const w = window as unknown as {
    marked?: {
      parse?: (s: string, o?: object) => string;
      setOptions?: (o: object) => void;
      __gogConfigured?: boolean;
      marked?: { parse?: (s: string, o?: object) => string; setOptions?: (o: object) => void };
    };
    DOMPurify?: { sanitize: (h: string, o?: object) => string };
    dompurify?: { sanitize: (h: string, o?: object) => string };
  };
  const markedApi = w.marked;
  if (markedApi && !markedApi.__gogConfigured) {
    try {
      if (typeof markedApi.setOptions === 'function') {
        markedApi.setOptions({ gfm: true, breaks: true });
      } else if (markedApi.marked?.setOptions) {
        markedApi.marked.setOptions({ gfm: true, breaks: true });
      }
    } catch {
      /* ignore */
    }
    markedApi.__gogConfigured = true;
  }
  if (!markedApi) return escapeHtml(src);

  let html = '';
  try {
    if (typeof markedApi.parse === 'function') {
      html = markedApi.parse(src, { gfm: true, breaks: true });
    } else if (typeof (markedApi as unknown as (s: string) => string) === 'function') {
      html = (markedApi as unknown as (s: string, o?: object) => string)(src, {
        gfm: true,
        breaks: true,
      });
    } else if (markedApi.marked?.parse) {
      html = markedApi.marked.parse(src, { gfm: true, breaks: true });
    } else {
      return escapeHtml(src);
    }
  } catch {
    return escapeHtml(src);
  }
  if (typeof html !== 'string') html = String(html ?? '');

  const purify = w.DOMPurify || w.dompurify;
  if (purify && typeof purify.sanitize === 'function') {
    html = purify.sanitize(html, {
      USE_PROFILES: { html: true },
      ADD_ATTR: ['target', 'rel'],
    });
    try {
      html = html.replace(
        /<a\s+([^>]*href=)/gi,
        '<a target="_blank" rel="noopener noreferrer" $1',
      );
    } catch {
      /* ignore */
    }
    return html;
  }
  return escapeHtml(src);
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  const value = String(text ?? '');
  if (!value) return false;
  try {
    if (navigator.clipboard && window.isSecureContext !== false) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    /* fallback */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = value;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}
