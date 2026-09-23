import { t, tf, hasT, getLocale, setLocale, langSwitchHtml } from './i18n.js';
import { CHAT_ALLOWED_EXTENSIONS, CHAT_FILE_ACCEPT } from './allowed-extensions.js';

const API = '/admin/api';
/** Admin SPA session token (OTP login) — never store long-lived API keys here */
const KEY_STORAGE = 'gog_admin_session';

/** @type {ReturnType<typeof setInterval> | null} */
let ddosTimer = null;
let ddosPaused = false;

/**
 * Map OpenAI-style API error envelope → localized Admin message.
 * Prefers error.code + details.feature / details.reason; falls back to message fingerprints.
 * @param {any} data  parsed JSON body
 * @param {string} [statusText]
 */
function formatApiError(data, statusText) {
  const err = data?.error && typeof data.error === 'object' ? data.error : data || {};
  const code = typeof err.code === 'string' ? err.code : '';
  const details =
    err.details && typeof err.details === 'object' ? err.details : {};
  const feature =
    typeof details.feature === 'string'
      ? details.feature
      : typeof details.flag === 'string'
        ? details.flag
        : '';
  const reason = typeof details.reason === 'string' ? details.reason : '';
  const rawMsg = String(err.message || data?.message || statusText || '');

  // Feature flags (videoApi / imagesApi / tools / …)
  if (
    feature &&
    (code === 'feature_disabled' ||
      code === 'media_not_supported' ||
      code === 'forbidden')
  ) {
    const key = `errors.feature.${feature}`;
    if (hasT(key)) return t(key);
  }
  if (code === 'feature_disabled' && hasT('errors.feature_disabled')) {
    // try fingerprint from message if feature missing
    const fp = fingerprintFeature(rawMsg);
    if (fp && hasT(`errors.feature.${fp}`)) return t(`errors.feature.${fp}`);
    return t('errors.feature_disabled');
  }

  // Media / validation reason codes
  if (reason && hasT(`errors.media.${reason}`)) {
    return t(`errors.media.${reason}`);
  }
  if (code === 'media_generation_failed' && reason && hasT(`errors.media.${reason}`)) {
    return t(`errors.media.${reason}`);
  }
  if (code === 'media_forbidden' && hasT('errors.media_forbidden')) {
    return t('errors.media_forbidden');
  }

  // Legacy English bodies often use media_not_supported without details.feature
  const fpEarly = fingerprintFeature(rawMsg);
  if (fpEarly && hasT(`errors.feature.${fpEarly}`)) {
    return t(`errors.feature.${fpEarly}`);
  }

  // Generic error.code map
  if (code) {
    const key = `errors.${code}`;
    if (hasT(key)) return t(key);
  }

  // Legacy English server messages (before code/details were standardized)
  const fp = fingerprintFeature(rawMsg);
  if (fp && hasT(`errors.feature.${fp}`)) return t(`errors.feature.${fp}`);
  if (/agent-mode|agent mode|Safe keys cannot/i.test(rawMsg)) {
    return t('errors.media.agent_or_admin_required');
  }
  if (/no image file was found/i.test(rawMsg)) {
    return t('errors.media.no_image_in_sandbox');
  }
  if (/no video file was found/i.test(rawMsg)) {
    return t('errors.media.no_video_in_sandbox');
  }
  if (/does not support image edits/i.test(rawMsg)) {
    return t('errors.media.provider_no_edit');
  }
  if (/Provide an image file|sourceAssetId|sourceDocumentId/i.test(rawMsg)) {
    return t('errors.media.source_required');
  }
  if (/must be an image/i.test(rawMsg)) {
    return t('errors.media.source_must_be_image');
  }

  return rawMsg || t('common.requestFailed');
}

function fingerprintFeature(msg) {
  const m = String(msg || '');
  if (/videoApi/i.test(m) || /Video API is disabled/i.test(m)) return 'videoApi';
  if (/imagesApi/i.test(m) || /Images API is disabled/i.test(m)) return 'imagesApi';
  if (/audioApi/i.test(m) || /Audio API is disabled/i.test(m)) return 'audioApi';
  if (/filesOpenAiAlias/i.test(m) || /Files API alias/i.test(m))
    return 'filesOpenAiAlias';
  if (
    /Tools are disabled/i.test(m) ||
    (/\btools\b/i.test(m) && /disabled/i.test(m) && /image/i.test(m))
  ) {
    return 'tools';
  }
  return '';
}

const state = {
  key: sessionStorage.getItem(KEY_STORAGE) || '',
  page: 'dashboard',
  me: null,
  error: '',
  modal: null,
  chatFilter: {
    q: '',
    status: '',
    model: '',
    apiKeyId: '',
    from: '',
    to: '',
    policyMode: '',
    hasDocuments: '',
    limit: 50,
    offset: 0,
  },
  docFilter: {
    q: '',
    apiKeyId: '',
    storageType: '',
    from: '',
    to: '',
    limit: 20,
    offset: 0,
  },
  keyFilter: {
    q: '',
    role: '',
    mode: '',
    isActive: '',
    limit: 20,
    offset: 0,
  },
  auditFilter: {
    q: '',
    action: '',
    apiKeyId: '',
    from: '',
    to: '',
    limit: 50,
    offset: 0,
  },
  usageFilter: {
    tab: 'model', // 'model' | 'key'
    modelQ: '',
    keyQ: '',
    keyActive: '',
    modelPage: 0,
    keyPage: 0,
    pageSize: 10,
  },
  ddosFilter: {
    /** 'policy' | 'live' | 'blacklist' | 'events' */
    tab: 'policy',
    liveQ: '',
    banQ: '',
    banSource: '',
    livePage: 0,
    banPage: 0,
    pageSize: 15,
  },
  mediaFilter: {
    /** 'studio' | 'assets' | 'jobs' — same tab pattern as chat queue */
    tab: 'studio',
    q: '',
    kind: '',
    provider: '',
    from: '',
    to: '',
    limit: 20,
    offset: 0,
  },
  /** System page tab: 'software' | 'package' | 'env' */
  systemTab: 'software',
  /** PM2 page tab: 'runner' | 'port' | 'config' | 'logs' */
  pm2Tab: 'runner',
  /** API features tab: 'protocols' | 'media' | 'caps' | 'emu' */
  apiFeaturesTab: 'protocols',
  models: [],
  keys: [],
};

/** Hash routes: #/dashboard, #/media, #/api-features … */
const PAGE_FROM_HASH = {
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
};

function pageToHash(page) {
  if (page === 'apiFeatures') return 'api-features';
  return page || 'dashboard';
}

function hashToPage(hash) {
  const raw = String(hash || '')
    .replace(/^#\/?/, '')
    .split('?')[0]
    .split('/')[0]
    .toLowerCase();
  if (!raw) return null;
  return PAGE_FROM_HASH[raw] || null;
}

function writePageHash(page) {
  const h = `#/${pageToHash(page)}`;
  if (location.hash !== h) {
    // push so browser Back works between admin pages
    history.pushState(null, '', h);
  }
}

function readInitialPage() {
  const fromHash = hashToPage(location.hash);
  if (fromHash) return fromHash;
  return state.key ? 'dashboard' : 'login';
}

async function api(path, options = {}) {
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(state.key ? { Authorization: `Bearer ${state.key}` } : {}),
    ...(options.headers || {}),
  };
  const res = await fetch(`${API}${path}`, { ...options, headers });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { error: { message: text } };
  }
  if (!res.ok) {
    const msg = formatApiError(data, res.statusText);
    const code = data?.error?.code || '';
    if (res.status === 401) {
      if (state.page !== 'login') logout(false);
    } else if (res.status === 403) {
      // Keep session for permission / feature errors (not bad credentials)
      const keepSession = [
        'media_forbidden',
        'feature_disabled',
        'forbidden',
        'media_not_supported',
      ].includes(code);
      if (!keepSession && state.page !== 'login') logout(false);
    }
    const e = new Error(msg);
    e.status = res.status;
    e.code = code;
    e.details = data?.error?.details;
    throw e;
  }
  return data;
}

/** Parse fetch Response as JSON and throw localized Error if !ok */
async function parseApiResponse(res) {
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { error: { message: text } };
  }
  if (!res.ok) {
    const msg = formatApiError(data, res.statusText);
    const e = new Error(msg);
    e.status = res.status;
    e.code = data?.error?.code;
    e.details = data?.error?.details;
    throw e;
  }
  return data;
}

function logout(clear = true) {
  const token = state.key;
  if (clear && token && String(token).startsWith('gog_sess_')) {
    fetch('/admin/api/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  }
  if (clear) sessionStorage.removeItem(KEY_STORAGE);
  state.key = '';
  state.me = null;
  state.page = 'login';
  writePageHash('login');
  render();
}

function setPage(page) {
  applyPageChange(page, { writeHash: true });
}

/**
 * @param {string} page
 * @param {{ writeHash?: boolean }} [opts]
 */
function applyPageChange(page, opts = {}) {
  const next = page || 'dashboard';
  state.page = next;
  state.modal = null;
  state.error = '';
  if (next === 'chats') state.chatFilter.offset = 0;
  if (next === 'documents') state.docFilter.offset = 0;
  if (next === 'keys') state.keyFilter.offset = 0;
  if (next === 'audit') state.auditFilter.offset = 0;
  if (next === 'media') state.mediaFilter.offset = 0;
  if (next !== 'ddos' && ddosTimer) {
    clearInterval(ddosTimer);
    ddosTimer = null;
  }
  // leave chat → close mobile history drawer
  if (next !== 'chat') {
    document.body.classList.remove('chat-history-open');
  }
  if (opts.writeHash !== false) writePageHash(next);
  render();
}

function escapeHtml(s) {
  return String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

/** @type {HTMLElement | null} */
let uiDialogRoot = null;
/** @type {((v: unknown) => void) | null} */
let uiDialogResolve = null;

function closeUiDialog(result) {
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

function onUiDialogKeydown(e) {
  if (!uiDialogRoot) return;
  if (e.key === 'Escape') {
    e.preventDefault();
    e.stopPropagation();
    const cancelable = uiDialogRoot.dataset.cancelable !== '0';
    // alert-only: Escape dismisses as OK; confirm/prompt: cancel
    closeUiDialog(cancelable ? (uiDialogRoot.dataset.prompt === '1' ? null : false) : true);
  }
}

/**
 * In-app dialog (replaces window.alert / confirm / prompt).
 * @param {{
 *   title?: string,
 *   message: string,
 *   variant?: 'info' | 'confirm' | 'danger',
 *   confirmText?: string,
 *   cancelText?: string,
 *   showCancel?: boolean,
 *   input?: boolean,
 *   defaultValue?: string,
 *   placeholder?: string,
 *   maxLength?: number,
 * }} opts
 * @returns {Promise<boolean | string | null>}
 *   confirm/alert → boolean; prompt → string | null (null = cancel)
 */
function openUiDialog(opts) {
  // Replace any open dialog
  if (uiDialogRoot) closeUiDialog(false);

  const variant = opts.variant || (opts.showCancel === false ? 'info' : 'confirm');
  const showCancel = opts.showCancel !== false;
  const isPrompt = Boolean(opts.input);
  const title =
    opts.title ||
    (variant === 'danger'
      ? t('common.dangerTitle')
      : showCancel
        ? t('common.confirmTitle')
        : t('common.notice'));
  const confirmText =
    opts.confirmText ||
    (showCancel ? t('common.confirm') : t('common.ok'));
  const cancelText = opts.cancelText || t('common.cancel');
  const icon =
    variant === 'danger' ? '!' : variant === 'info' && !showCancel ? 'i' : '?';

  const root = document.createElement('div');
  root.className = 'ui-dialog-back';
  root.id = 'ui-dialog-back';
  root.dataset.cancelable = showCancel || isPrompt ? '1' : '0';
  root.dataset.prompt = isPrompt ? '1' : '0';
  root.setAttribute('role', 'presentation');
  root.innerHTML = `
    <div class="ui-dialog ui-dialog--${escapeHtml(variant)}${isPrompt ? '' : ''}" role="alertdialog" aria-modal="true" aria-labelledby="ui-dialog-title" aria-describedby="ui-dialog-msg">
      <div class="ui-dialog-h">
        <div class="ui-dialog-icon" aria-hidden="true">${icon}</div>
        <h3 class="ui-dialog-title" id="ui-dialog-title">${escapeHtml(title)}</h3>
      </div>
      <div class="ui-dialog-body" id="ui-dialog-msg">${escapeHtml(opts.message || '')}</div>
      ${
        isPrompt
          ? `<div class="ui-dialog-input-wrap">
              <input type="text" class="ui-dialog-input" id="ui-dialog-input" value="${escapeHtml(opts.defaultValue || '')}" placeholder="${escapeHtml(opts.placeholder || '')}" maxlength="${opts.maxLength || 500}" autocomplete="off" />
            </div>`
          : ''
      }
      <div class="ui-dialog-actions">
        ${
          showCancel || isPrompt
            ? `<button type="button" class="btn secondary sm" id="ui-dialog-cancel">${escapeHtml(cancelText)}</button>`
            : ''
        }
        <button type="button" class="btn ${variant === 'danger' ? 'danger' : ''} sm" id="ui-dialog-ok">${escapeHtml(confirmText)}</button>
      </div>
    </div>`;

  document.body.appendChild(root);
  document.body.classList.add('ui-dialog-open');
  uiDialogRoot = root;
  document.addEventListener('keydown', onUiDialogKeydown, true);

  const okBtn = root.querySelector('#ui-dialog-ok');
  const cancelBtn = root.querySelector('#ui-dialog-cancel');
  const input = root.querySelector('#ui-dialog-input');

  const finish = (ok) => {
    if (isPrompt) {
      if (!ok) {
        closeUiDialog(null);
        return;
      }
      const val = input instanceof HTMLInputElement ? input.value : '';
      closeUiDialog(val);
      return;
    }
    closeUiDialog(Boolean(ok));
  };

  okBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    finish(true);
  });
  cancelBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    finish(false);
  });
  root.addEventListener('click', (e) => {
    if (e.target === root && (showCancel || isPrompt)) finish(false);
  });
  if (input instanceof HTMLInputElement) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        finish(true);
      }
    });
  }

  requestAnimationFrame(() => {
    if (input instanceof HTMLInputElement) {
      input.focus();
      input.select();
    } else {
      okBtn?.focus();
    }
  });

  return new Promise((resolve) => {
    uiDialogResolve = resolve;
  });
}

/** @param {string | { title?: string, message: string, variant?: string, confirmText?: string }} msg */
async function uiAlert(msg) {
  const opts =
    typeof msg === 'string'
      ? { message: msg, showCancel: false, variant: 'info' }
      : {
          title: msg.title,
          message: msg.message,
          showCancel: false,
          variant: msg.variant || 'info',
          confirmText: msg.confirmText || t('common.ok'),
        };
  await openUiDialog(opts);
}

/**
 * @param {string | { title?: string, message: string, variant?: 'confirm'|'danger', confirmText?: string, cancelText?: string }} msg
 * @returns {Promise<boolean>}
 */
async function uiConfirm(msg) {
  const opts =
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

/**
 * @param {string | { title?: string, message?: string, defaultValue?: string, placeholder?: string, maxLength?: number }} msg
 * @returns {Promise<string | null>}
 */
async function uiPrompt(msg) {
  const opts =
    typeof msg === 'string'
      ? { message: msg, input: true, showCancel: true, variant: 'confirm' }
      : {
          title: msg.title,
          message: msg.message || '',
          input: true,
          showCancel: true,
          variant: 'confirm',
          defaultValue: msg.defaultValue,
          placeholder: msg.placeholder,
          maxLength: msg.maxLength,
        };
  const result = await openUiDialog(opts);
  return result === null || result === false ? null : String(result);
}

/** Configure marked once (GFM tables, soft line breaks). */
function ensureMarkedConfigured() {
  const api = typeof window !== 'undefined' ? window.marked : null;
  if (!api || api.__gogConfigured) return api;
  try {
    if (typeof api.setOptions === 'function') {
      api.setOptions({ gfm: true, breaks: true });
    } else if (api.marked && typeof api.marked.setOptions === 'function') {
      api.marked.setOptions({ gfm: true, breaks: true });
    }
  } catch {
    /* ignore */
  }
  api.__gogConfigured = true;
  return api;
}

/**
 * Render assistant Markdown → sanitized HTML. Fallback to escaped plain text.
 * @param {string} src
 */
function formatChatMarkdown(src) {
  if (!src) return '';
  const markedApi = ensureMarkedConfigured();
  const purify =
    typeof window !== 'undefined' ? window.DOMPurify || window.dompurify : null;
  if (!markedApi) return escapeHtml(src);

  let html = '';
  try {
    if (typeof markedApi.parse === 'function') {
      html = markedApi.parse(src, { gfm: true, breaks: true });
    } else if (typeof markedApi === 'function') {
      html = markedApi(src, { gfm: true, breaks: true });
    } else if (markedApi.marked && typeof markedApi.marked.parse === 'function') {
      html = markedApi.marked.parse(src, { gfm: true, breaks: true });
    } else {
      return escapeHtml(src);
    }
  } catch {
    return escapeHtml(src);
  }
  if (typeof html !== 'string') html = String(html ?? '');

  if (purify && typeof purify.sanitize === 'function') {
    html = purify.sanitize(html, {
      USE_PROFILES: { html: true },
      ADD_ATTR: ['target', 'rel'],
    });
    // Secure external links
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
  // No DOMPurify: refuse raw HTML path — safe plain fallback
  return escapeHtml(src);
}

/**
 * @param {string} text
 * @returns {Promise<boolean>}
 */
async function copyTextToClipboard(text) {
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

function fmtTime(iso) {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleString(getLocale() === 'zh-Hant' ? 'zh-HK' : 'en-US');
  } catch {
    return iso;
  }
}

function fmtBytes(n) {
  if (n == null) return '—';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return tf('common.mb', { n: (n / 1024 / 1024).toFixed(1) });
}

function fmtMs(ms) {
  if (ms == null || ms === '') return '—';
  return tf('common.ms', { n: ms });
}

function fmtPerMin(n) {
  if (n == null || n === '') return '—';
  return tf('common.perMin', { n });
}

function showError(msg) {
  state.error = msg;
  const box = document.querySelector('#flash-error');
  if (box) {
    box.hidden = !msg;
    box.textContent = msg;
  }
}

function badgeStatus(s) {
  const c =
    s === 'success' ? 'success' : s === 'error' || s === 'timeout' ? 'error' : 'pending';
  const label =
    s === 'success'
      ? t('status.success')
      : s === 'error'
        ? t('status.error')
        : s === 'timeout'
          ? t('status.timeout')
          : s === 'pending'
            ? t('status.pending')
            : s || '-';
  return `<span class="badge ${c}">${escapeHtml(label)}</span>`;
}

/** Job status badges for durable chat queue */
function badgeQueueStatus(s) {
  const map = {
    queued: { cls: 'pending', label: t('queue.stQueued') },
    leased: { cls: 'info', label: t('queue.stLeased') },
    running: { cls: 'success', label: t('queue.stRunning') },
    succeeded: { cls: 'success', label: t('queue.stSucceeded') },
    failed: { cls: 'error', label: t('queue.stFailed') },
    dead: { cls: 'error', label: t('queue.stDead') },
    cancelled: { cls: 'muted', label: t('queue.stCancelled') },
  };
  const m = map[s] || { cls: 'pending', label: s || '—' };
  return `<span class="badge ${m.cls}">${escapeHtml(m.label)}</span>`;
}

function badgeQueueSource(src) {
  const label =
    src === 'playground'
      ? t('queue.srcPlayground')
      : src === 'v1'
        ? t('queue.srcV1')
        : src || '—';
  return `<span class="badge muted">${escapeHtml(label)}</span>`;
}

function badgeMode(m) {
  const mode = m === 'agent' ? 'agent' : m === 'safe' ? 'safe' : m || 'safe';
  const label =
    mode === 'agent'
      ? t('keys.modeAgentBadge')
      : mode === 'safe'
        ? t('keys.modeSafeBadge')
        : mode;
  return `<span class="badge ${mode === 'agent' ? 'agent' : 'safe'}">${escapeHtml(label)}</span>`;
}

function badgeRole(r) {
  const role = String(r || '').toLowerCase();
  const label =
    role === 'admin'
      ? t('keys.roleAdminBadge')
      : role === 'client' || role === 'user'
        ? t('keys.roleClientBadge')
        : r || '-';
  return escapeHtml(label);
}

function isImageMime(m) {
  return String(m || '').toLowerCase().startsWith('image/');
}

/**
 * Browser-native preview kinds for Media library.
 * @returns {'image'|'video'|'audio'|'pdf'|'text'|null}
 */
function mediaPreviewKind(mime, filename = '') {
  const m = String(mime || '').toLowerCase().trim();
  const name = String(filename || '').toLowerCase();
  const ext = (name.match(/\.([a-z0-9]+)$/) || [])[1] || '';

  if (m.startsWith('image/') || ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'avif', 'ico'].includes(ext)) {
    return 'image';
  }
  if (
    m.startsWith('video/') ||
    ['mp4', 'webm', 'ogg', 'ogv', 'mov', 'm4v'].includes(ext)
  ) {
    // browsers typically play mp4/webm/ogg; still offer <video> for others
    return 'video';
  }
  if (
    m.startsWith('audio/') ||
    ['mp3', 'wav', 'ogg', 'oga', 'm4a', 'aac', 'flac', 'opus'].includes(ext)
  ) {
    return 'audio';
  }
  if (m === 'application/pdf' || ext === 'pdf') return 'pdf';
  if (
    m.startsWith('text/') ||
    m === 'application/json' ||
    m === 'application/xml' ||
    m === 'application/javascript' ||
    ['txt', 'md', 'csv', 'json', 'xml', 'html', 'htm', 'css', 'js', 'log', 'svg'].includes(ext)
  ) {
    // svg already image; skip if image handled
    if (ext === 'svg') return 'image';
    return 'text';
  }
  return null;
}

function isBrowserPreviewable(mime, filename = '') {
  return mediaPreviewKind(mime, filename) != null;
}

/** @type {string | null} */
let mediaPreviewObjectUrl = null;

function revokeMediaPreviewUrl() {
  if (mediaPreviewObjectUrl) {
    try {
      URL.revokeObjectURL(mediaPreviewObjectUrl);
    } catch {
      /* ignore */
    }
    mediaPreviewObjectUrl = null;
  }
}

/**
 * Build lightbox stage HTML for a blob: object URL.
 * @param {'image'|'video'|'audio'|'pdf'|'text'|string} kind
 * @param {string} url
 * @param {string} filename
 */
function mediaLightboxStageHtml(kind, url, filename) {
  if (kind === 'image') {
    return `<img class="media-lb-media media-lb-img" src="${url}" alt="${escapeHtml(filename)}" />`;
  }
  if (kind === 'video') {
    return `<video class="media-lb-media media-lb-video" src="${url}" controls playsinline preload="metadata"></video>`;
  }
  if (kind === 'audio') {
    return `
      <div class="media-lb-audio-wrap">
        <div class="media-lb-audio-icon" aria-hidden="true">♪</div>
        <audio class="media-lb-media media-lb-audio" src="${url}" controls preload="metadata"></audio>
      </div>`;
  }
  if (kind === 'pdf') {
    return `<iframe class="media-lb-media media-lb-pdf" src="${url}#toolbar=1" title="${escapeHtml(filename)}"></iframe>`;
  }
  if (kind === 'text') {
    return `<div class="media-lb-text-loading muted">${escapeHtml(t('common.loading') || '…')}</div>`;
  }
  return `<div class="data-empty"><strong>${escapeHtml(t('media.previewUnsupported'))}</strong></div>`;
}

/**
 * Professional lightbox modal for media assets (image / video / audio / pdf / text).
 *
 * IMPORTANT: create the blob: object URL *after* openAppModal().
 * openAppModal → closeAppModal → revokeMediaPreviewUrl would otherwise
 * kill the URL immediately (empty / broken preview for every kind).
 *
 * @param {{ id: string, mime?: string, filename?: string, prompt?: string, kind?: string, bytes?: number }} meta
 * @param {Blob} blob
 */
function openMediaPreviewLightbox(meta, blob) {
  const mime = meta.mime || blob.type || '';
  const filename = meta.filename || meta.id || 'asset';
  const kind = mediaPreviewKind(mime, filename) || 'image';
  const title = t('media.preview');
  const subParts = [
    filename,
    mime || '—',
    meta.bytes != null ? fmtBytes(meta.bytes) : '',
    meta.kind || '',
  ].filter(Boolean);
  const subtitle = escapeHtml(subParts.join(' · '));

  const promptHtml = meta.prompt
    ? `<div class="media-lb-prompt"><span class="muted">${escapeHtml(t('media.prompt'))}</span><p>${escapeHtml(meta.prompt)}</p></div>`
    : '';

  // Open shell first (this revokes any previous preview URL via closeAppModal)
  openAppModal({
    title,
    subtitle,
    size: 'xl',
    bodyHtml: `
      <div class="media-lightbox" data-preview-kind="${escapeHtml(kind)}">
        <div class="media-lb-stage">
          <div class="media-lb-text-loading muted">${escapeHtml(t('common.loading') || '…')}</div>
        </div>
        ${promptHtml}
      </div>`,
    footerHtml: `
      <button type="button" class="btn secondary sm" id="media-lb-download">${escapeHtml(t('media.download'))}</button>
      <button type="button" class="btn sm" id="media-lb-close">${escapeHtml(t('common.cancel'))}</button>`,
  });

  // Mark modal shell for lightbox styling
  const modal = document.querySelector('#modal-back .modal');
  if (modal) modal.classList.add('modal--media-preview');

  // Create object URL only after modal open — never before openAppModal
  const url = URL.createObjectURL(blob);
  mediaPreviewObjectUrl = url;

  const stage = document.querySelector('#modal-back .media-lb-stage');
  if (stage) {
    stage.innerHTML = mediaLightboxStageHtml(kind, url, filename);
  }

  const close = () => {
    document.querySelectorAll('#modal-back video, #modal-back audio').forEach((el) => {
      try {
        el.pause();
      } catch {
        /* ignore */
      }
    });
    revokeMediaPreviewUrl();
    closeAppModal();
  };

  // Bind close / download (openAppModal already wires modal-x + backdrop; re-bind to revoke)
  document.getElementById('modal-close')?.addEventListener('click', (e) => {
    e.preventDefault();
    close();
  });
  document.getElementById('media-lb-close')?.addEventListener('click', (e) => {
    e.preventDefault();
    close();
  });
  document.getElementById('modal-back')?.addEventListener('click', (e) => {
    if (e.target?.id === 'modal-back') close();
  });
  document.getElementById('media-lb-download')?.addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `media-${String(meta.id || '').slice(0, 8)}`;
    a.click();
  });

  if (kind === 'text') {
    blob
      .text()
      .then((text) => {
        const el = document.querySelector('#modal-back .media-lb-stage');
        if (!el) return;
        const max = 400_000;
        const clipped =
          text.length > max
            ? text.slice(0, max) + `\n… (${t('media.previewTruncated')})`
            : text;
        el.innerHTML = `<pre class="media-lb-text">${escapeHtml(clipped)}</pre>`;
      })
      .catch(() => {
        const el = document.querySelector('#modal-back .media-lb-stage');
        if (el) {
          el.innerHTML = `<div class="error-box">${escapeHtml(t('media.previewFail'))}</div>`;
        }
      });
  }
}

function poweredByFooter() {
  return `
  <footer class="site-footer">
    <a class="powered-by" href="https://ysk.hk/" target="_blank" rel="noopener noreferrer">
      <img src="/admin/assets/logo.svg" alt="" width="22" height="22" />
      <span>${escapeHtml(t('common.powered'))} <strong>YSK Limited</strong></span>
    </a>
  </footer>`;
}

function pageTitle() {
  const map = {
    dashboard: t('nav.dashboard'),
    chat: t('nav.chat'),
    chats: t('nav.chats'),
    keys: t('nav.keys'),
    documents: t('nav.documents'),
    audit: t('nav.audit'),
    settings: t('nav.settings'),
    apiFeatures: t('nav.apiFeatures'),
    media: t('nav.media'),
    usage: t('nav.usage'),
    ddos: t('nav.ddos'),
    queue: t('nav.queue'),
    pm2: t('nav.pm2'),
    system: t('nav.system'),
  };
  return map[state.page] || t('brand');
}

function closeNav() {
  document.body.classList.remove('nav-open');
}

function openNav() {
  document.body.classList.add('nav-open');
}

function shell(content) {
  return `
  <div class="app-shell">
    <header class="mobile-bar">
      <button type="button" class="icon-btn" id="nav-open" aria-label="${escapeHtml(t('shell.menu'))}">☰</button>
      <div class="mobile-title">${escapeHtml(pageTitle())}</div>
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
        ${nav('dashboard', t('nav.dashboard'))}
        ${nav('chat', t('nav.chat'))}
        ${nav('chats', t('nav.chats'))}
        ${nav('keys', t('nav.keys'))}
        ${nav('documents', t('nav.documents'))}
        ${nav('media', t('nav.media'))}
        ${nav('audit', t('nav.audit'))}
        ${nav('settings', t('nav.settings'))}
        ${nav('apiFeatures', t('nav.apiFeatures'))}
        ${nav('usage', t('nav.usage'))}
        ${nav('ddos', t('nav.ddos'))}
        ${nav('queue', t('nav.queue'))}
        ${nav('pm2', t('nav.pm2'))}
        ${nav('system', t('nav.system'))}
        <div class="sidebar-foot">
          <button class="btn secondary sm logout-btn" id="btn-logout">${escapeHtml(t('logout'))}</button>
        </div>
      </aside>
      <main class="main">
        <div id="flash-error" class="error-box" ${state.error ? '' : 'hidden'}>${escapeHtml(state.error)}</div>
        ${content}
      </main>
    </div>
    ${poweredByFooter()}
  </div>
  ${state.modal || ''}
  `;
}

function nav(id, label) {
  return `<button type="button" class="nav-btn ${state.page === id ? 'active' : ''}" data-nav="${id}">${escapeHtml(label)}</button>`;
}

function bindShell() {
  closeNav();
  document.querySelectorAll('[data-nav]').forEach((b) => {
    b.onclick = () => {
      closeNav();
      setPage(b.dataset.nav);
    };
  });
  const logoutHandler = () => logout(true);
  document.getElementById('btn-logout')?.addEventListener('click', logoutHandler);
  document.getElementById('btn-logout-mobile')?.addEventListener('click', logoutHandler);
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
    b.onclick = () => {
      setLocale(b.dataset.lang);
      render().catch(onErr);
    };
  });
}

function onErr(e) {
  console.error(e);
  showError(e.message || String(e));
}

async function ensureMe() {
  if (!state.key) return false;
  const data = await api('/me');
  state.me = data.data;
  return true;
}

async function loadModels(refresh = false) {
  try {
    const res = await api(`/models${refresh ? '?refresh=1' : ''}`);
    state.models = res.data?.models || [];
    return res.data;
  } catch {
    state.models = [];
    return { models: [], source: 'fallback', defaultModel: '' };
  }
}

async function loadKeys() {
  try {
    // Full list for selects / playground (unpaginated)
    const res = await api('/keys?all=1');
    state.keys = res.data || [];
  } catch {
    state.keys = [];
  }
}

/* ——— Shared list UI helpers ——— */

/**
 * Secondary line under topbar (hints, totals). Never put totals in topbar right.
 * @param {string|string[]} parts  plain text segments joined with ·
 */
function pageMetaHtml(parts) {
  const list = (Array.isArray(parts) ? parts : [parts]).filter(Boolean);
  if (!list.length) return '';
  const body = list
    .map((p) => `<span>${typeof p === 'string' ? escapeHtml(p) : p}</span>`)
    .join('<span class="page-meta-sep" aria-hidden="true">·</span>');
  return `<div class="page-meta" role="status">${body}</div>`;
}

function filterPanelHtml({ title, hint, meta, searchHtml, gridHtml }) {
  return `
    <div class="panel data-filter-panel">
      <div class="panel-h">
        <div class="panel-h-text">
          <strong>${escapeHtml(title)}</strong>
          ${hint ? `<span class="muted">${escapeHtml(hint)}</span>` : ''}
        </div>
        ${meta ? `<span class="panel-h-meta muted">${typeof meta === 'string' ? escapeHtml(meta) : meta}</span>` : ''}
      </div>
      <div class="data-filter">
        ${searchHtml || ''}
        ${gridHtml ? `<div class="data-filter-grid">${gridHtml}</div>` : ''}
        <div class="data-filter-actions">
          <button type="button" class="btn secondary sm" data-filter-reset>${escapeHtml(t('common.reset'))}</button>
          <button type="button" class="btn sm" data-filter-apply>${escapeHtml(t('common.apply'))}</button>
        </div>
      </div>
    </div>`;
}

function dataTablePanelHtml({ headHtml, bodyHtml, colSpan, emptyText, pagerHtml: pager }) {
  const body =
    bodyHtml ||
    `<tr class="empty-row"><td colspan="${colSpan || 6}">
      <div class="data-empty">
        <div class="data-empty-icon">∅</div>
        <strong>${escapeHtml(emptyText || t('common.empty'))}</strong>
      </div>
    </td></tr>`;
  return `
    <div class="panel data-table-panel">
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr>${headHtml}</tr></thead>
          <tbody>${body}</tbody>
        </table>
      </div>
      ${pager || ''}
    </div>`;
}

function pagerHtml({ total, limit, offset, idPrefix }) {
  const pages = Math.max(1, Math.ceil((total || 0) / limit) || 1);
  const page = Math.floor(offset / limit) + 1;
  const canPrev = offset > 0;
  const canNext = offset + limit < total;
  return `
    <div class="data-pager" id="${idPrefix}-pager">
      <div class="data-pager-meta">
        <span>${escapeHtml(tf('common.pagerTotal', { n: total || 0 }))}</span>
        <span>${escapeHtml(tf('common.pagerPage', { n: page, total: pages }))}</span>
        <label class="muted">${escapeHtml(t('common.perPage'))}
          <select id="${idPrefix}-limit">
            ${[10, 20, 50, 100]
              .map(
                (n) =>
                  `<option value="${n}" ${limit === n ? 'selected' : ''}>${n}</option>`,
              )
              .join('')}
          </select>
        </label>
      </div>
      <div class="data-pager-actions">
        <button type="button" class="btn secondary sm" id="${idPrefix}-prev" ${canPrev ? '' : 'disabled'}>${escapeHtml(t('common.prev'))}</button>
        <button type="button" class="btn secondary sm" id="${idPrefix}-next" ${canNext ? '' : 'disabled'}>${escapeHtml(t('common.next'))}</button>
      </div>
    </div>`;
}

function bindPager(idPrefix, filterRef, reload) {
  document.getElementById(`${idPrefix}-prev`)?.addEventListener('click', () => {
    filterRef.offset = Math.max(0, filterRef.offset - filterRef.limit);
    reload();
  });
  document.getElementById(`${idPrefix}-next`)?.addEventListener('click', () => {
    filterRef.offset = filterRef.offset + filterRef.limit;
    reload();
  });
  document.getElementById(`${idPrefix}-limit`)?.addEventListener('change', (e) => {
    filterRef.limit = Number(e.target.value) || 20;
    filterRef.offset = 0;
    reload();
  });
}

function closeAppModal() {
  document.querySelectorAll('#modal-back video, #modal-back audio').forEach((el) => {
    try {
      el.pause();
    } catch {
      /* ignore */
    }
  });
  revokeMediaPreviewUrl();
  document.getElementById('modal-back')?.remove();
  state.modal = null;
}

function openAppModal({ title, subtitle, bodyHtml, footerHtml, size = 'md' }) {
  closeAppModal();
  const html = `
    <div class="modal-back" id="modal-back">
      <div class="modal modal--${escapeHtml(size)}" role="dialog" aria-modal="true">
        <div class="modal-h">
          <div class="modal-title-block">
            <strong>${escapeHtml(title || '')}</strong>
            ${subtitle ? `<div class="muted">${subtitle}</div>` : ''}
          </div>
          <button type="button" class="modal-x" id="modal-close" aria-label="${escapeHtml(t('common.cancel'))}">×</button>
        </div>
        <div class="modal-b">${bodyHtml || ''}</div>
        ${footerHtml ? `<div class="modal-f">${footerHtml}</div>` : ''}
      </div>
    </div>`;
  document.getElementById('app').insertAdjacentHTML('beforeend', html);
  const close = () => closeAppModal();
  document.getElementById('modal-close').onclick = close;
  document.getElementById('modal-back').onclick = (e) => {
    if (e.target.id === 'modal-back') close();
  };
  const onEsc = (e) => {
    if (e.key === 'Escape') {
      close();
      document.removeEventListener('keydown', onEsc);
    }
  };
  document.addEventListener('keydown', onEsc);
}

async function renderLogin() {
  const cmd = 'gctoac admin otp';
  document.getElementById('app').innerHTML = `
    <div class="login-wrap">
      <div class="login-stage">
        <div class="login-card">
          <div class="login-brand">
            <img src="/admin/assets/logo.svg" alt="YSK" width="48" height="48" />
            <h1 class="brand-title">${escapeHtml(t('loginTitle'))}</h1>
          </div>
          ${langSwitchHtml()}
          <div id="flash-error" class="error-box" ${state.error ? '' : 'hidden'}>${escapeHtml(state.error)}</div>
          <label for="login-key">${escapeHtml(t('loginOtpLabel'))}</label>
          <input id="login-key" type="text" inputmode="text" autocomplete="one-time-code" placeholder="ABCD-EFGH" autofocus spellcheck="false" />
          <button class="btn" id="btn-login">${escapeHtml(t('loginBtn'))}</button>
        </div>
        <p class="login-cmd-hint">${escapeHtml(t('loginOtpHint'))}</p>
        <div class="login-cmd">
          <code id="login-cmd-text">${escapeHtml(cmd)}</code>
          <button type="button" class="btn-copy" id="btn-copy-cmd">${escapeHtml(t('loginCopy'))}</button>
        </div>
        <p class="login-cmd-hint">${escapeHtml(t('loginOtpExpiry'))}</p>
      </div>
      ${poweredByFooter()}
    </div>
  `;
  document.querySelectorAll('[data-lang]').forEach((b) => {
    b.onclick = () => {
      setLocale(b.dataset.lang);
      renderLogin().catch(onErr);
    };
  });
  document.getElementById('btn-copy-cmd').onclick = async () => {
    try {
      await navigator.clipboard.writeText(cmd);
      const btn = document.getElementById('btn-copy-cmd');
      btn.textContent = t('loginCopied');
      setTimeout(() => {
        btn.textContent = t('loginCopy');
      }, 1500);
    } catch {
      /* ignore */
    }
  };
  document.getElementById('btn-login').onclick = async () => {
    const code = document.getElementById('login-key').value.trim();
    if (!code) return showError(t('needOtp'));
    try {
      const res = await fetch('/admin/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          data?.error?.message || data?.message || t('loginOtpFail'),
        );
      }
      const token = data?.data?.token;
      if (!token) throw new Error(t('loginOtpFail'));
      state.key = token;
      sessionStorage.setItem(KEY_STORAGE, token);
      await ensureMe();
      state.error = '';
      setPage('dashboard');
    } catch (e) {
      state.key = '';
      sessionStorage.removeItem(KEY_STORAGE);
      showError(e.message || t('loginOtpFail'));
    }
  };
  document.getElementById('login-key').onkeydown = (e) => {
    if (e.key === 'Enter') document.getElementById('btn-login').click();
  };
}

function dashKpiCard({ label, value, sub, tone, href, valueId, subId }) {
  const toneCls = tone ? ` dash-kpi--${tone}` : '';
  const valueAttr = valueId ? ` id="${escapeHtml(valueId)}"` : '';
  const subAttr = subId ? ` id="${escapeHtml(subId)}"` : '';
  const inner = `
    <div class="label">${escapeHtml(label)}</div>
    <div class="value"${valueAttr}>${value}</div>
    ${sub != null && sub !== '' ? `<div class="dash-kpi-sub muted"${subAttr}>${sub}</div>` : ''}`;
  if (href) {
    return `<button type="button" class="card dash-kpi${toneCls}" data-nav="${escapeHtml(href)}">${inner}</button>`;
  }
  return `<div class="card dash-kpi${toneCls}">${inner}</div>`;
}

function dashStatusPill(ok, okText, badText) {
  return ok
    ? `<span class="badge success">${escapeHtml(okText)}</span>`
    : `<span class="badge warn">${escapeHtml(badText)}</span>`;
}

/**
 * Page-level master switch for the topbar (not a form checkbox).
 * @param {{ id: string, on: boolean, onLabel: string, offLabel: string, title?: string }} opts
 */
function masterToggleBtnHtml({ id, on, onLabel, offLabel, title }) {
  return `<button type="button"
    class="master-toggle ${on ? 'is-on' : 'is-off'}"
    id="${escapeHtml(id)}"
    aria-pressed="${on ? 'true' : 'false'}"
    title="${escapeHtml(title || '')}">
    <span class="master-toggle-track" aria-hidden="true"><span class="master-toggle-knob"></span></span>
    <span class="master-toggle-label">${escapeHtml(on ? onLabel : offLabel)}</span>
  </button>`;
}

function isMasterToggleOn(id) {
  const btn = document.getElementById(id);
  return btn ? btn.classList.contains('is-on') : false;
}

function setMasterToggle(id, on, onLabel, offLabel) {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.classList.toggle('is-on', Boolean(on));
  btn.classList.toggle('is-off', !on);
  btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  const lab = btn.querySelector('.master-toggle-label');
  if (lab && onLabel != null && offLabel != null) {
    lab.textContent = on ? onLabel : offLabel;
  }
}

function featureOffBannerHtml(id, message) {
  return `<div class="feature-off-banner" id="${escapeHtml(id)}" hidden role="status">
    <strong>${escapeHtml(t('common.featureOff'))}</strong>
    <span>${escapeHtml(message)}</span>
  </div>`;
}

function setFeatureOffBanner(id, off) {
  const el = document.getElementById(id);
  if (el) el.hidden = !off;
}

function setFeatureRootOff(rootId, off) {
  const root = document.getElementById(rootId);
  if (root) root.classList.toggle('is-feature-off', Boolean(off));
}

function proxySourceShort(src) {
  const map = {
    auto: t('ddos.proxySrcAuto'),
    cloudflare: t('ddos.proxySrcCf'),
    nginx: t('ddos.proxySrcNginx'),
    'x-forwarded-for': t('ddos.proxySrcXff'),
    socket: t('ddos.proxySrcSocket'),
  };
  return map[src] || src || '—';
}

async function renderDashboard() {
  const res = await api('/stats');
  const d = res.data || {};
  const tot = d.totals || {};
  const prot = d.protection || {};
  const rt = d.runtime || {};
  const conc = d.concurrency || {};
  const q = d.queue || null;
  const safety = d.safety || null;
  const models = d.models24h || [];
  const rate24 = tot.successRate24h ?? 0;
  const rateAll = tot.successRate ?? 0;
  const genAt = d.generatedAt ? fmtTime(d.generatedAt) : '—';

  let queueKpiValue = '—';
  let queueKpiSub = t('dash.kpiQueueSub');
  let queueTone = '';
  if (q) {
    if (!q.enabled) {
      queueKpiValue = t('dash.kpiQueueOff');
      queueTone = 'warn';
    } else if (q.paused) {
      queueKpiValue = t('dash.kpiQueuePaused');
      queueTone = 'warn';
    } else if (q.drainMode) {
      queueKpiValue = t('dash.kpiQueueDrain');
      queueTone = 'warn';
    } else {
      queueKpiValue = `${q.depth ?? 0}`;
    }
    const waitS =
      q.oldestQueuedAgeMs > 0
        ? ` · wait ${Math.round(q.oldestQueuedAgeMs / 1000)}s`
        : '';
    queueKpiSub = tf('dash.kpiQueueSubLive', {
      run: q.running ?? 0,
      max: q.globalConcurrency ?? '—',
      dead: q.dead ?? 0,
      wait: waitS,
    });
    if ((q.dead || 0) > 0 || (q.depth || 0) > 20) queueTone = queueTone || 'warn';
  }

  const safeOn = Boolean(safety?.globalSafeMode);
  const safeKpiValue = safety
    ? safeOn
      ? t('dash.kpiSafeOn')
      : t('dash.kpiSafeOff')
    : '—';
  const safeKpiSub = safety
    ? tf('dash.kpiSafeSub', {
        tools: safety.safeToolsMode || '—',
        turns: safety.safeMaxTurns ?? '—',
        model: safety.defaultModel || '—',
      })
    : t('dash.kpiSafeSubEmpty');

  const bodyHtml = (d.recentChats || [])
    .map(
      (c) => `
    <tr>
      <td><button class="linkish cell-primary" data-chat="${c.id}">${escapeHtml(c.requestId)}</button>
        <div class="cell-sub">${escapeHtml(c.apiKey?.name || '')}</div></td>
      <td>${escapeHtml(c.model)}</td>
      <td>${badgeStatus(c.status)}</td>
      <td>${badgeMode(c.policyMode || '-')}</td>
      <td>${fmtMs(c.durationMs)}</td>
      <td>${fmtTime(c.createdAt)}</td>
    </tr>`,
    )
    .join('');

  const recentTable = dataTablePanelHtml({
    headHtml: `
      <th>${escapeHtml(t('chats.request'))}</th>
      <th>${escapeHtml(t('chats.model'))}</th>
      <th>${escapeHtml(t('chats.status'))}</th>
      <th>${escapeHtml(t('chats.mode'))}</th>
      <th>${escapeHtml(t('chats.duration'))}</th>
      <th>${escapeHtml(t('chats.time'))}</th>`,
    bodyHtml,
    colSpan: 6,
    emptyText: t('dash.empty'),
  });

  const modelMax = Math.max(1, ...models.map((m) => m.requests || 0));
  const modelBars = models.length
    ? models
        .map((m) => {
          const pct = Math.round(((m.requests || 0) / modelMax) * 100);
          return `
          <div class="dash-bar-row">
            <div class="dash-bar-label" title="${escapeHtml(m.model)}">${escapeHtml(m.model)}</div>
            <div class="dash-bar-track"><span style="width:${pct}%"></span></div>
            <div class="dash-bar-n">${m.requests}</div>
          </div>`;
        })
        .join('')
    : `<div class="data-empty" style="padding:20px"><strong>${escapeHtml(t('dash.emptyModels'))}</strong></div>`;

  const ruleChip = (on, label) =>
    `<span class="dash-rule-chip ${on ? 'is-on' : 'is-off'}">${escapeHtml(label)}</span>`;

  const queueDetailHtml = q
    ? `
      <div class="dash-stat-grid">
        <div><div class="label">${escapeHtml(t('dash.qQueued'))}</div><div class="value value-sm">${q.queued ?? 0}</div></div>
        <div><div class="label">${escapeHtml(t('dash.qRunning'))}</div><div class="value value-sm">${q.running ?? 0}<span class="dash-kpi-den">/${q.globalConcurrency ?? '—'}</span></div></div>
        <div><div class="label">${escapeHtml(t('dash.qDead'))}</div><div class="value value-sm">${q.dead ?? 0}</div></div>
        <div><div class="label">${escapeHtml(t('dash.qSucceeded'))}</div><div class="value value-sm">${q.succeeded ?? 0}</div></div>
      </div>
      <div class="dash-prot-meta muted">
        ${escapeHtml(t('dash.qWorker'))}: ${escapeHtml(q.workerId || '—')}
        · ${escapeHtml(t('dash.qWorkerActive'))}: ${q.workerActive ?? 0}
        ${
          q.oldestQueuedAgeMs > 0
            ? ` · ${escapeHtml(t('dash.qOldest'))}: ${Math.round(q.oldestQueuedAgeMs / 1000)}s`
            : ''
        }
      </div>`
    : `<div class="data-empty" style="padding:12px 0"><strong>${escapeHtml(t('dash.qUnavailable'))}</strong></div>`;

  document.getElementById('app').innerHTML = shell(`
    <div class="dash-hero">
      <div class="dash-hero-text">
        <h2>${escapeHtml(t('dash.title'))}</h2>
        <p class="muted">${escapeHtml(t('dash.subtitle'))}</p>
      </div>
      <div class="dash-hero-meta">
        <span class="muted">${escapeHtml(t('dash.updated'))}: ${escapeHtml(genAt)}</span>
        <button type="button" class="btn secondary sm" id="dash-refresh">${escapeHtml(t('dash.refresh'))}</button>
      </div>
    </div>

    <div class="dash-kpi-grid">
      ${dashKpiCard({
        label: t('dash.kpi24h'),
        value: tot.chats24h ?? 0,
        sub: tf('dash.kpi24hSub', {
          ok: tot.success24h ?? 0,
          err: tot.error24h ?? 0,
        }),
        tone: 'primary',
        href: 'chats',
      })}
      ${dashKpiCard({
        label: t('dash.kpiSuccessRate'),
        value: `${rate24}%`,
        sub: tf('dash.kpiSuccessRateSub', { all: rateAll }),
        tone: rate24 >= 90 ? 'ok' : rate24 >= 70 ? 'warn' : 'danger',
        href: 'usage',
      })}
      ${dashKpiCard({
        label: t('dash.kpiErrors'),
        value: tot.error24h ?? 0,
        sub: tf('dash.kpiErrorsSub', { all: tot.errors ?? 0 }),
        tone: (tot.error24h || 0) > 0 ? 'warn' : 'ok',
        href: 'chats',
      })}
      ${dashKpiCard({
        label: t('dash.kpiQueue'),
        value: queueKpiValue,
        sub: queueKpiSub,
        tone: queueTone,
        href: 'queue',
      })}
      ${dashKpiCard({
        label: t('dash.kpiSafe'),
        value: safeKpiValue,
        sub: safeKpiSub,
        tone: safety ? (safeOn ? 'ok' : 'warn') : '',
        href: 'settings',
      })}
      ${dashKpiCard({
        label: t('dash.kpiKeys'),
        value: `${tot.activeKeys ?? 0}<span class="dash-kpi-den">/${tot.totalKeys ?? 0}</span>`,
        sub: t('dash.kpiKeysSub'),
        href: 'keys',
      })}
      ${dashKpiCard({
        label: t('dash.kpiDocs'),
        value: tot.documents ?? 0,
        sub: t('dash.kpiDocsSub'),
        href: 'documents',
      })}
      ${dashKpiCard({
        label: t('dash.kpiMedia') || 'Media',
        value: tot.mediaAssets ?? 0,
        sub: tf('dash.kpiMediaSub', { n: tot.mediaAssets24h ?? 0 }),
        href: 'media',
      })}
      ${dashKpiCard({
        label: t('dash.kpiConv'),
        value: tot.conversations ?? 0,
        sub: tf('dash.kpiConvSub', { n: tot.conversations24h ?? 0 }),
        href: 'chat',
      })}
      ${dashKpiCard({
        label: t('dash.kpiSessions'),
        value: tot.adminSessions ?? rt.adminSessions ?? 0,
        sub: t('dash.kpiSessionsSub'),
      })}
      ${dashKpiCard({
        label: t('dash.kpiConcurrent'),
        value: `${conc.active ?? 0}<span class="dash-kpi-den">/${conc.max ?? 0}</span>`,
        sub: t('dash.kpiConcurrentSub'),
        tone: (conc.active || 0) >= (conc.max || 1) ? 'warn' : '',
      })}
    </div>

    <div class="dash-layout">
      <div class="dash-main">
        <div class="panel dash-panel">
          <div class="panel-h">
            <strong>${escapeHtml(t('dash.recent'))}</strong>
            <button type="button" class="btn secondary sm" data-nav="chats">${escapeHtml(t('dash.viewAll'))}</button>
          </div>
          ${recentTable.replace('data-table-panel', 'data-table-panel dash-embed-table')}
        </div>

        <div class="panel dash-panel">
          <div class="panel-h">
            <strong>${escapeHtml(t('dash.queuePanel'))}</strong>
            <button type="button" class="btn secondary sm" data-nav="queue">${escapeHtml(t('dash.openQueue'))}</button>
          </div>
          <div class="panel-pad dash-prot">
            <div class="dash-prot-row">
              <span>${escapeHtml(t('dash.queueState'))}</span>
              ${
                !q
                  ? `<span class="badge warn">${escapeHtml(t('dash.kpiQueueOff'))}</span>`
                  : !q.enabled
                    ? `<span class="badge warn">${escapeHtml(t('dash.kpiQueueOff'))}</span>`
                    : q.paused
                      ? `<span class="badge warn">${escapeHtml(t('dash.kpiQueuePaused'))}</span>`
                      : q.drainMode
                        ? `<span class="badge warn">${escapeHtml(t('dash.kpiQueueDrain'))}</span>`
                        : `<span class="badge success">${escapeHtml(t('dash.queueLive'))}</span>`
              }
            </div>
            ${queueDetailHtml}
          </div>
        </div>
      </div>

      <aside class="dash-side">
        <div class="panel dash-panel">
          <div class="panel-h">
            <strong>${escapeHtml(t('dash.safety'))}</strong>
            <button type="button" class="btn secondary sm" data-nav="settings">${escapeHtml(t('dash.openSettings'))}</button>
          </div>
          <div class="panel-pad dash-prot">
            <div class="dash-prot-row">
              <span>${escapeHtml(t('dash.globalSafe'))}</span>
              ${dashStatusPill(safeOn, t('dash.on'), t('dash.off'))}
            </div>
            <div class="dash-stat-grid">
              <div><div class="label">${escapeHtml(t('dash.safeTools'))}</div><div class="value value-sm">${escapeHtml(safety?.safeToolsMode || '—')}</div></div>
              <div><div class="label">${escapeHtml(t('dash.safeTurns'))}</div><div class="value value-sm">${safety?.safeMaxTurns ?? '—'}</div></div>
              <div><div class="label">${escapeHtml(t('dash.safeTimeout'))}</div><div class="value value-sm">${safety?.safeTimeoutMs != null ? Math.round(safety.safeTimeoutMs / 1000) + 's' : '—'}</div></div>
              <div><div class="label">${escapeHtml(t('dash.defaultModel'))}</div><div class="value value-sm" style="font-size:0.95rem!important">${escapeHtml(safety?.defaultModel || '—')}</div></div>
            </div>
            <div class="dash-prot-meta muted">${escapeHtml(t('dash.safetyHint'))}</div>
          </div>
        </div>

        <div class="panel dash-panel">
          <div class="panel-h">
            <strong>${escapeHtml(t('dash.protection'))}</strong>
            <button type="button" class="btn secondary sm" data-nav="ddos">${escapeHtml(t('dash.openDdos'))}</button>
          </div>
          <div class="panel-pad dash-prot">
            <div class="dash-prot-row">
              <span>${escapeHtml(t('dash.autoBan'))}</span>
              ${dashStatusPill(
                Boolean(prot.autoBanEnabled),
                t('dash.on'),
                t('dash.off'),
              )}
            </div>
            <div class="dash-rule-row">
              ${ruleChip(prot.autoAuthEnabled, t('dash.ruleAuth'))}
              ${ruleChip(prot.autoRateEnabled, t('dash.ruleRate'))}
              ${ruleChip(prot.autoConnEnabled, t('dash.ruleConn'))}
              ${ruleChip(prot.autoVelocityEnabled, t('dash.ruleVelocity'))}
            </div>
            <div class="dash-stat-grid">
              <div><div class="label">${escapeHtml(t('dash.bans'))}</div><div class="value value-sm">${prot.bans ?? 0}</div></div>
              <div><div class="label">${escapeHtml(t('dash.blocked'))}</div><div class="value value-sm">${prot.blockedHits ?? 0}</div></div>
              <div><div class="label">${escapeHtml(t('dash.rateHits'))}</div><div class="value value-sm">${prot.rateLimitedHits ?? 0}</div></div>
              <div><div class="label">${escapeHtml(t('dash.liveConn'))}</div><div class="value value-sm">${prot.activeConnections ?? 0}</div></div>
            </div>
            <div class="dash-prot-meta muted">
              ${escapeHtml(t('dash.proxy'))}: ${escapeHtml(proxySourceShort(prot.proxyIpSource))}
              · ${escapeHtml(t('dash.hops'))}: ${prot.proxyTrustHops ?? 0}
              · ${escapeHtml(t('dash.limits'))}: ${prot.rateLimitMax ?? '—'}/${prot.rateLimitIpMax ?? '—'}
            </div>
          </div>
        </div>

        <div class="panel dash-panel">
          <div class="panel-h"><strong>${escapeHtml(t('dash.models24h'))}</strong></div>
          <div class="panel-pad">${modelBars}</div>
        </div>

        <div class="panel dash-panel">
          <div class="panel-h"><strong>${escapeHtml(t('dash.runtime'))}</strong></div>
          <div class="panel-pad dash-runtime">
            <div class="dash-prot-row">
              <span>${escapeHtml(t('dash.port'))}</span>
              <strong>${rt.port ?? '—'}<span class="muted" style="font-weight:500"> (${escapeHtml(t('dash.defaultPort'))} ${rt.defaultPort ?? 3847})</span></strong>
            </div>
            <div class="dash-prot-row">
              <span>${escapeHtml(t('dash.env'))}</span>
              <strong>${escapeHtml(rt.env || '—')}</strong>
            </div>
            <div class="dash-prot-row">
              <span>${escapeHtml(t('dash.authMode'))}</span>
              <strong>${escapeHtml(t('dash.authOtp'))}</strong>
            </div>
            <div class="dash-prot-row">
              <span>${escapeHtml(t('dash.encryption'))}</span>
              ${dashStatusPill(
                Boolean(rt.encryptionReady),
                t('dash.ready'),
                t('dash.notReady'),
              )}
            </div>
            <div class="dash-quick">
              <button type="button" class="btn secondary sm" data-nav="chat">${escapeHtml(t('nav.chat'))}</button>
              <button type="button" class="btn secondary sm" data-nav="queue">${escapeHtml(t('dash.openQueue'))}</button>
              <button type="button" class="btn secondary sm" data-nav="settings">${escapeHtml(t('nav.settings'))}</button>
              <button type="button" class="btn secondary sm" data-nav="usage">${escapeHtml(t('nav.usage'))}</button>
              <button type="button" class="btn secondary sm" data-nav="pm2">${escapeHtml(t('nav.pm2'))}</button>
              <button type="button" class="btn secondary sm" data-nav="system">${escapeHtml(t('nav.system'))}</button>
              <button type="button" class="btn secondary sm" data-nav="audit">${escapeHtml(t('nav.audit'))}</button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  `);
  bindShell();
  document.getElementById('dash-refresh')?.addEventListener('click', () =>
    renderDashboard().catch(onErr),
  );
  document.querySelectorAll('[data-nav]').forEach((b) => {
    b.onclick = () => {
      const page = b.dataset.nav;
      if (page) setPage(page);
    };
  });
  document.querySelectorAll('[data-chat]').forEach((b) => {
    b.onclick = () => openChat(b.dataset.chat);
  });
}

function attachChips(docs) {
  if (!docs?.length) return `<span class="muted">—</span>`;
  return docs
    .map((d) => {
      const img = isImageMime(d.mimeType);
      return `<span class="chip ${img ? 'img' : ''}" title="${escapeHtml(d.mimeType)}">${escapeHtml(d.originalName || t('chats.file'))}</span>`;
    })
    .join(' ');
}

/**
 * Split stored prompt (from messagesToPrompt) into system vs body.
 * Multi-turn format: "role: content" blocks joined by \\n
 */
function parseStoredPrompt(prompt) {
  const raw = String(prompt || '');
  if (!raw.trim()) {
    return { system: '', body: '', hasRoles: false };
  }
  // Single-turn stores raw content without "role: " prefix
  if (!/^(system|user|assistant|tool): /m.test(raw)) {
    return { system: '', body: raw, hasRoles: false };
  }
  const re = /(^|\n)(system|user|assistant|tool): /g;
  const matches = [];
  let m;
  while ((m = re.exec(raw)) !== null) {
    matches.push({
      role: m[2],
      contentStart: m.index + m[0].length,
      // content ends at next match index (join separator is \n before next role)
      index: m.index,
    });
  }
  if (!matches.length) {
    return { system: '', body: raw, hasRoles: false };
  }
  const blocks = matches.map((hit, i) => {
    const end = i + 1 < matches.length ? matches[i + 1].index : raw.length;
    return {
      role: hit.role,
      content: raw.slice(hit.contentStart, end),
    };
  });
  const systemParts = blocks.filter((b) => b.role === 'system').map((b) => b.content);
  const bodyParts = blocks
    .filter((b) => b.role !== 'system')
    .map((b) => `${b.role}: ${b.content}`);
  return {
    system: systemParts.join('\n\n').trim(),
    body: bodyParts.length ? bodyParts.join('\n') : raw,
    hasRoles: true,
    blocks,
  };
}

async function renderChats() {
  await Promise.all([loadModels(), loadKeys()]);
  const f = state.chatFilter;
  const q = new URLSearchParams();
  q.set('limit', String(f.limit));
  q.set('offset', String(f.offset));
  if (f.status) q.set('status', f.status);
  if (f.model) q.set('model', f.model);
  if (f.apiKeyId) q.set('apiKeyId', f.apiKeyId);
  if (f.q) q.set('q', f.q);
  if (f.from) q.set('from', new Date(f.from).toISOString());
  if (f.to) {
    const end = new Date(f.to);
    end.setHours(23, 59, 59, 999);
    q.set('to', end.toISOString());
  }
  if (f.policyMode) q.set('policyMode', f.policyMode);
  if (f.hasDocuments !== '') q.set('hasDocuments', f.hasDocuments);

  const data = await api(`/chats?${q}`);
  const total = data.total || 0;

  const modelOpts = [
    `<option value="">${escapeHtml(t('chats.allModels'))}</option>`,
    ...state.models.map(
      (m) =>
        `<option value="${escapeHtml(m)}" ${f.model === m ? 'selected' : ''}>${escapeHtml(m)}</option>`,
    ),
  ].join('');

  const keyOpts = [
    `<option value="">${escapeHtml(t('chats.allKeys'))}</option>`,
    ...state.keys.map(
      (k) =>
        `<option value="${k.id}" ${f.apiKeyId === k.id ? 'selected' : ''}>${escapeHtml(k.name)} (${escapeHtml(k.keyPrefix)})</option>`,
    ),
  ].join('');

  const bodyHtml = (data.items || [])
    .map((c) => {
      const parsed = parseStoredPrompt(c.promptPreview || '');
      const hasSys = Boolean(parsed.system);
      const previewBody = hasSys
        ? parsed.body.slice(0, 160)
        : c.promptPreview || '';
      return `
    <tr>
      <td><button class="linkish cell-primary" data-chat="${c.id}">${escapeHtml(c.requestId)}</button></td>
      <td><div class="cell-primary">${escapeHtml(c.apiKey?.name || '')}</div><div class="cell-sub">${escapeHtml(c.apiKey?.keyPrefix || '')}</div></td>
      <td>${escapeHtml(c.model)}</td>
      <td>${badgeStatus(c.status)} ${badgeMode(c.policyMode || '-')}</td>
      <td>${attachChips(c.documents)} ${c.documentCount ? `<span class="muted">×${c.documentCount}</span>` : ''}</td>
      <td class="chats-preview-cell">
        ${hasSys ? `<span class="chip sys-chip" title="${escapeHtml(parsed.system.slice(0, 400))}">${escapeHtml(t('chats.hasSystem'))}</span>` : ''}
        <div class="muted preview-text">${escapeHtml(previewBody)}</div>
      </td>
      <td class="chats-preview-cell"><div class="muted preview-text">${escapeHtml(c.contentPreview)}</div></td>
      <td>${fmtTime(c.createdAt)}</td>
    </tr>`;
    })
    .join('');

  const filter = filterPanelHtml({
    title: t('chats.filterTitle') || t('common.filterTitle'),
    hint: t('chats.filterHint') || t('common.filterHint'),
    meta: tf('common.pagerTotal', { n: total }),
    searchHtml: `
      <div class="data-filter-search">
        <label for="f-q">${escapeHtml(t('chats.search'))}</label>
        <input type="search" id="f-q" value="${escapeHtml(f.q)}" placeholder="${escapeHtml(t('chats.searchPh'))}" />
      </div>`,
    gridHtml: `
      <label>${escapeHtml(t('chats.status'))}
        <select id="f-status">
          <option value="">${escapeHtml(t('chats.allStatus'))}</option>
          ${['success', 'error', 'timeout', 'pending']
            .map(
              (s) =>
                `<option value="${s}" ${f.status === s ? 'selected' : ''}>${escapeHtml(t(`status.${s}`))}</option>`,
            )
            .join('')}
        </select>
      </label>
      <label>${escapeHtml(t('chats.model'))}
        <select id="f-model">${modelOpts}</select>
      </label>
      <label>${escapeHtml(t('chats.apiKey'))}
        <select id="f-key">${keyOpts}</select>
      </label>
      <label>${escapeHtml(t('chats.mode'))}
        <select id="f-mode">
          <option value="">${escapeHtml(t('chats.allModes'))}</option>
          <option value="safe" ${f.policyMode === 'safe' ? 'selected' : ''}>${escapeHtml(t('keys.modeSafeBadge'))}</option>
          <option value="agent" ${f.policyMode === 'agent' ? 'selected' : ''}>${escapeHtml(t('keys.modeAgentBadge'))}</option>
        </select>
      </label>
      <label>${escapeHtml(t('chats.from'))}
        <input type="date" id="f-from" value="${escapeHtml(f.from)}" />
      </label>
      <label>${escapeHtml(t('chats.to'))}
        <input type="date" id="f-to" value="${escapeHtml(f.to)}" />
      </label>
      <label class="data-filter-check">
        <input type="checkbox" id="f-docs" ${f.hasDocuments === 'true' ? 'checked' : ''} />
        <span>${escapeHtml(t('chats.hasDocs'))}</span>
      </label>`,
  });

  const table = dataTablePanelHtml({
    headHtml: `
      <th>${escapeHtml(t('chats.request'))}</th>
      <th>${escapeHtml(t('chats.apiKey'))}</th>
      <th>${escapeHtml(t('chats.model'))}</th>
      <th>${escapeHtml(t('chats.status'))}</th>
      <th>${escapeHtml(t('chats.attachments'))}</th>
      <th>${escapeHtml(t('chats.prompt'))}</th>
      <th>${escapeHtml(t('chats.response'))}</th>
      <th>${escapeHtml(t('chats.time'))}</th>`,
    bodyHtml,
    colSpan: 8,
    emptyText: t('common.empty'),
    pagerHtml: pagerHtml({
      total,
      limit: f.limit,
      offset: f.offset,
      idPrefix: 'chats',
    }),
  });

  document.getElementById('app').innerHTML = shell(`
    <div class="topbar">
      <h2>${escapeHtml(t('chats.title'))}</h2>
    </div>
    ${pageMetaHtml([t('chats.decrypt')])}
    ${filter}
    ${table}
  `);
  bindShell();
  bindPager('chats', state.chatFilter, () => renderChats().catch(onErr));

  const applyFilter = () => {
    state.chatFilter.q = document.getElementById('f-q').value.trim();
    state.chatFilter.status = document.getElementById('f-status').value;
    state.chatFilter.model = document.getElementById('f-model').value;
    state.chatFilter.apiKeyId = document.getElementById('f-key').value;
    state.chatFilter.policyMode = document.getElementById('f-mode').value;
    state.chatFilter.from = document.getElementById('f-from').value;
    state.chatFilter.to = document.getElementById('f-to').value;
    state.chatFilter.hasDocuments = document.getElementById('f-docs').checked
      ? 'true'
      : '';
    state.chatFilter.offset = 0;
    renderChats().catch(onErr);
  };

  document.querySelector('[data-filter-apply]').onclick = applyFilter;
  document.getElementById('f-q').onkeydown = (e) => {
    if (e.key === 'Enter') applyFilter();
  };
  document.querySelector('[data-filter-reset]').onclick = () => {
    state.chatFilter = {
      q: '',
      status: '',
      model: '',
      apiKeyId: '',
      from: '',
      to: '',
      policyMode: '',
      hasDocuments: '',
      limit: 50,
      offset: 0,
    };
    renderChats().catch(onErr);
  };
  document.querySelectorAll('[data-chat]').forEach((b) => {
    b.onclick = () => openChat(b.dataset.chat);
  });
}

async function openChat(id) {
  const { data } = await api(`/chats/${id}`);
  const r = data.response || {};
  const docs = data.documents || [];

  let attachHtml = `<p class="muted">${escapeHtml(t('chats.noAttach'))}</p>`;
  if (docs.length) {
    const parts = [];
    for (const d of docs) {
      let preview = '';
      if (isImageMime(d.mimeType)) {
        try {
          const full = await api(`/documents/${d.id}`);
          const img = await resolveDocumentImageSrc(full.data || { id: d.id, isImage: true, mimeType: d.mimeType });
          if (img?.src) {
            preview = `<img class="preview" src="${img.src}" alt="${escapeHtml(d.originalName)}" />`;
          }
        } catch {
          preview = `<span class="muted">${escapeHtml(t('chats.previewFailed'))}</span>`;
        }
      }
      parts.push(`
        <div class="attach-item">
          <div style="flex:1;min-width:0">
            <strong>${escapeHtml(d.originalName)}</strong>
            <div class="muted">${escapeHtml(d.mimeType)} · ${fmtBytes(d.sizeBytes)}</div>
            ${preview}
          </div>
          <button class="btn secondary sm" data-open-doc="${d.id}">${escapeHtml(t('chats.openFile'))}</button>
        </div>`);
    }
    attachHtml = `<div class="attach-list">${parts.join('')}</div>`;
  }

  const parsed = parseStoredPrompt(data.prompt || '');
  const systemHtml = parsed.system
    ? `<div class="block block-system">
        <div class="block-head">
          <h4>${escapeHtml(t('chats.systemPrompt'))}</h4>
          <button class="btn secondary sm" data-copy="system">${escapeHtml(t('chats.copySystem'))}</button>
        </div>
        <p class="hint">${escapeHtml(t('chats.systemHint'))}</p>
        <div class="pre pre-system">${escapeHtml(parsed.system)}</div>
      </div>`
    : `<div class="block block-system muted-block">
        <h4>${escapeHtml(t('chats.systemPrompt'))}</h4>
        <p class="muted">${escapeHtml(t('chats.noSystem'))}</p>
      </div>`;

  const bodyHtml = `
    <div class="grid modal-meta-grid">
      <div class="card"><div class="label">${escapeHtml(t('chats.model'))}</div><div class="value value-sm">${escapeHtml(data.model)}</div></div>
      <div class="card"><div class="label">${escapeHtml(t('chats.duration'))}</div><div class="value value-sm">${fmtMs(data.durationMs)}</div></div>
      <div class="card"><div class="label">${escapeHtml(t('chats.apiKey'))}</div><div class="value value-sm">${escapeHtml(data.apiKey?.name || '')}</div></div>
      <div class="card"><div class="label">${escapeHtml(t('chats.stream'))}</div><div class="value value-sm">${data.stream ? t('common.yes') : t('common.no')}</div></div>
    </div>
    ${data.errorMessage ? `<div class="error-box">${escapeHtml(data.errorMessage)}</div>` : ''}
    ${systemHtml}
    <div class="block">
      <h4>${escapeHtml(t('chats.attachments'))}</h4>
      ${attachHtml}
    </div>
    <div class="block">
      <div class="block-head">
        <h4>${escapeHtml(t('chats.userPrompt'))}</h4>
        <button class="btn secondary sm" data-copy="prompt">${escapeHtml(t('chats.copyPrompt'))}</button>
      </div>
      <div class="pre">${escapeHtml(parsed.body || data.prompt || t('chats.none'))}</div>
    </div>
    <div class="block">
      <h4>${escapeHtml(t('chats.reasoning'))}</h4>
      <div class="pre">${escapeHtml(r.reasoning_content || t('chats.none'))}</div>
    </div>
    <div class="block">
      <div class="block-head">
        <h4>${escapeHtml(t('chats.content'))}</h4>
        <button class="btn secondary sm" data-copy="content">${escapeHtml(t('chats.copyContent'))}</button>
      </div>
      <div class="pre">${escapeHtml(r.content || t('chats.none'))}</div>
    </div>
    <div class="block">
      <div class="block-head">
        <h4>${escapeHtml(t('chats.rawPrompt'))}</h4>
        <button class="btn secondary sm" data-copy="raw-prompt">${escapeHtml(t('chats.copyRawPrompt'))}</button>
      </div>
      <div class="pre">${escapeHtml(data.prompt || t('chats.none'))}</div>
    </div>
    <div class="block">
      <h4>${escapeHtml(t('chats.raw'))}</h4>
      <div class="pre">${escapeHtml(r.raw || '')}</div>
    </div>
    <div class="modal-meta-foot muted">${escapeHtml(t('common.ipLabel'))}: ${escapeHtml(data.ip || '—')} · ${escapeHtml(t('common.uaLabel'))}: ${escapeHtml(data.userAgent || '—')} · ${fmtTime(data.createdAt)}</div>`;

  openAppModal({
    title: t('chats.detail'),
    subtitle: `${escapeHtml(data.requestId)} · ${badgeStatus(data.status)} ${badgeMode(data.policyMode || '-')}`,
    bodyHtml,
    size: 'xl',
    footerHtml: `<button type="button" class="btn secondary sm" id="modal-ok">${escapeHtml(t('chats.close'))}</button>`,
  });
  document.getElementById('modal-ok')?.addEventListener('click', () => closeAppModal());
  document.querySelector('[data-copy="system"]')?.addEventListener('click', () => {
    navigator.clipboard.writeText(parsed.system || '');
  });
  document.querySelector('[data-copy="prompt"]')?.addEventListener('click', () => {
    navigator.clipboard.writeText(parsed.body || data.prompt || '');
  });
  document.querySelector('[data-copy="raw-prompt"]')?.addEventListener('click', () => {
    navigator.clipboard.writeText(data.prompt || '');
  });
  document.querySelector('[data-copy="content"]')?.addEventListener('click', () => {
    navigator.clipboard.writeText(r.content || '');
  });
  document.querySelectorAll('[data-open-doc]').forEach((b) => {
    b.onclick = () => openDocument(b.dataset.openDoc);
  });
}

async function renderKeys() {
  const f = state.keyFilter;
  let usageMap = {};
  try {
    const u = await api('/usage');
    for (const row of u.data?.perKey || []) {
      usageMap[row.apiKeyId] = row;
    }
  } catch {
    /* ignore */
  }
  const q = new URLSearchParams();
  q.set('limit', String(f.limit));
  q.set('offset', String(f.offset));
  if (f.q) q.set('q', f.q);
  if (f.role) q.set('role', f.role);
  if (f.mode) q.set('mode', f.mode);
  if (f.isActive !== '') q.set('isActive', f.isActive);
  const res = await api(`/keys?${q}`);
  const data = res.data || [];
  const total = res.total ?? data.length;

  const bodyHtml = data
    .map((k) => {
      const u = usageMap[k.id];
      const reqs = u?.requests ?? '—';
      const util = u ? Math.round((u.utilization || 0) * 100) : 0;
      const wl = k.ipWhitelist || [];
      const wlLabel = wl.length
        ? tf('keys.ipCount', { n: wl.length })
        : t('keys.ipAll');
      return `
    <tr>
      <td><div class="cell-primary">${escapeHtml(k.name)}</div><div class="cell-sub">${escapeHtml(k.keyPrefix)}…</div></td>
      <td>${badgeRole(k.role)}</td>
      <td>${badgeMode(k.mode)}</td>
      <td>${fmtPerMin(k.rateLimit)}</td>
      <td title="${escapeHtml(wl.join(', '))}">${escapeHtml(wlLabel)}</td>
      <td>
        <div>${reqs} <span class="muted">(${escapeHtml(t('keys.usage24'))})</span></div>
        <div class="usage-bar ${util > 80 ? 'warn' : ''}"><span style="width:${util}%"></span></div>
      </td>
      <td>${k.isActive ? `<span class="badge success">${escapeHtml(t('common.active'))}</span>` : `<span class="badge error">${escapeHtml(t('common.revoked'))}</span>`}</td>
      <td>${fmtTime(k.createdAt)}</td>
      <td><div class="row-actions">
        <button class="btn secondary sm" data-edit="${k.id}">${escapeHtml(t('keys.edit'))}</button>
        ${k.isActive ? `<button class="btn danger sm" data-revoke="${k.id}">${escapeHtml(t('keys.revoke'))}</button>` : ''}
      </div></td>
    </tr>`;
    })
    .join('');

  const filter = filterPanelHtml({
    title: t('common.filterTitle'),
    hint: t('common.filterHint'),
    meta: tf('common.pagerTotal', { n: total }),
    searchHtml: `
      <div class="data-filter-search">
        <label for="kf-q">${escapeHtml(t('common.search'))}</label>
        <input type="search" id="kf-q" value="${escapeHtml(f.q)}" placeholder="${escapeHtml(t('keys.searchPh'))}" />
      </div>`,
    gridHtml: `
      <label>${escapeHtml(t('keys.role'))}
        <select id="kf-role">
          <option value="">${escapeHtml(t('common.all'))}</option>
          <option value="client" ${f.role === 'client' ? 'selected' : ''}>${escapeHtml(t('keys.roleClient'))}</option>
          <option value="admin" ${f.role === 'admin' ? 'selected' : ''}>${escapeHtml(t('keys.roleAdmin'))}</option>
        </select>
      </label>
      <label>${escapeHtml(t('keys.mode'))}
        <select id="kf-mode">
          <option value="">${escapeHtml(t('common.all'))}</option>
          <option value="safe" ${f.mode === 'safe' ? 'selected' : ''}>${escapeHtml(t('keys.modeSafeBadge'))}</option>
          <option value="agent" ${f.mode === 'agent' ? 'selected' : ''}>${escapeHtml(t('keys.modeAgentBadge'))}</option>
        </select>
      </label>
      <label>${escapeHtml(t('keys.status'))}
        <select id="kf-active">
          <option value="">${escapeHtml(t('common.all'))}</option>
          <option value="true" ${f.isActive === 'true' ? 'selected' : ''}>${escapeHtml(t('common.active'))}</option>
          <option value="false" ${f.isActive === 'false' ? 'selected' : ''}>${escapeHtml(t('common.revoked'))}</option>
        </select>
      </label>`,
  });

  const table = dataTablePanelHtml({
    headHtml: `
      <th>${escapeHtml(t('keys.name'))}</th><th>${escapeHtml(t('keys.role'))}</th>
      <th>${escapeHtml(t('keys.mode'))}</th><th>${escapeHtml(t('keys.rate'))}</th>
      <th>${escapeHtml(t('keys.ipWhitelistCol'))}</th>
      <th>${escapeHtml(t('keys.usage24'))}</th><th>${escapeHtml(t('keys.status'))}</th>
      <th>${escapeHtml(t('keys.created'))}</th><th>${escapeHtml(t('common.actions'))}</th>`,
    bodyHtml,
    colSpan: 9,
    emptyText: t('keys.empty'),
    pagerHtml: pagerHtml({
      total,
      limit: f.limit,
      offset: f.offset,
      idPrefix: 'keys',
    }),
  });

  document.getElementById('app').innerHTML = shell(`
    <div class="topbar">
      <h2>${escapeHtml(t('keys.title'))}</h2>
      <div class="toolbar">
        <button class="btn" id="btn-new-key">${escapeHtml(t('keys.new'))}</button>
      </div>
    </div>
    ${filter}
    ${table}
  `);
  bindShell();
  bindPager('keys', state.keyFilter, () => renderKeys().catch(onErr));
  document.querySelector('[data-filter-apply]').onclick = () => {
    state.keyFilter.q = document.getElementById('kf-q').value.trim();
    state.keyFilter.role = document.getElementById('kf-role').value;
    state.keyFilter.mode = document.getElementById('kf-mode').value;
    state.keyFilter.isActive = document.getElementById('kf-active').value;
    state.keyFilter.offset = 0;
    renderKeys().catch(onErr);
  };
  document.querySelector('[data-filter-reset]').onclick = () => {
    state.keyFilter = {
      q: '',
      role: '',
      mode: '',
      isActive: '',
      limit: 20,
      offset: 0,
    };
    renderKeys().catch(onErr);
  };
  document.getElementById('btn-new-key').onclick = () => showKeyForm();
  document.querySelectorAll('[data-edit]').forEach((b) => {
    const key = data.find((x) => x.id === b.dataset.edit);
    b.onclick = () => showKeyForm(key);
  });
  document.querySelectorAll('[data-revoke]').forEach((b) => {
    b.onclick = async () => {
      if (
        !(await uiConfirm({
          message: t('keys.confirmRevoke'),
          variant: 'danger',
          confirmText: t('keys.revoke'),
        }))
      )
        return;
      await api(`/keys/${b.dataset.revoke}`, { method: 'DELETE' });
      renderKeys().catch(onErr);
    };
  });
}

function showKeyForm(existing) {
  const isEdit = Boolean(existing);
  const wlText = (existing?.ipWhitelist || []).join('\n');
  openAppModal({
    title: isEdit ? t('keys.edit') : t('keys.new'),
    subtitle: isEdit
      ? `${escapeHtml(existing?.name || '')} · ${escapeHtml(existing?.keyPrefix || '')}…`
      : '',
    size: 'md',
    bodyHtml: `
      <div class="form-grid">
        <label class="full">${escapeHtml(t('keys.name'))}<input id="k-name" value="${escapeHtml(existing?.name || '')}" /></label>
        <label>${escapeHtml(t('keys.role'))}
          <select id="k-role">
            <option value="client">${escapeHtml(t('keys.roleClient'))}</option>
            <option value="admin">${escapeHtml(t('keys.roleAdmin'))}</option>
          </select>
        </label>
        <label>${escapeHtml(t('keys.mode'))}
          <select id="k-mode">
            <option value="safe">${escapeHtml(t('keys.modeSafe'))}</option>
            <option value="agent">${escapeHtml(t('keys.modeAgent'))}</option>
          </select>
        </label>
        <label>${escapeHtml(t('keys.rate'))}<input id="k-rate" type="number" value="${existing?.rateLimit ?? 60}" /></label>
        <label>${escapeHtml(t('keys.maxTurns'))}<input id="k-turns" type="number" value="${existing?.maxTurns ?? ''}" /></label>
        <label>${escapeHtml(t('keys.timeoutMs'))}<input id="k-timeout" type="number" value="${existing?.timeoutMs ?? ''}" /></label>
        <label class="full">${escapeHtml(t('keys.ipWhitelist'))}
          <textarea id="k-ip" rows="4" placeholder="${escapeHtml(t('keys.ipPlaceholder'))}">${escapeHtml(wlText)}</textarea>
          <span class="field-hint">${escapeHtml(t('keys.ipWhitelistHint'))}</span>
        </label>
        ${
          isEdit
            ? `<label class="full">${escapeHtml(t('keys.status'))}
          <select id="k-active"><option value="true">${escapeHtml(t('common.active'))}</option><option value="false">${escapeHtml(t('common.revoked'))}</option></select>
        </label>`
            : ''
        }
      </div>
      <pre id="k-created" class="pre key-once-box" hidden></pre>`,
    footerHtml: `
      <button type="button" class="btn secondary sm" id="k-cancel">${escapeHtml(t('common.cancel'))}</button>
      <button type="button" class="btn sm" id="k-save">${escapeHtml(t('common.save'))}</button>`,
  });
  document.getElementById('k-role').value = existing?.role || 'client';
  document.getElementById('k-mode').value = existing?.mode || 'safe';
  if (isEdit) document.getElementById('k-active').value = String(existing.isActive);
  document.getElementById('k-cancel').onclick = () => closeAppModal();
  document.getElementById('k-save').onclick = async () => {
    const ipWhitelist = document
      .getElementById('k-ip')
      .value.split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const body = {
      name: document.getElementById('k-name').value.trim(),
      role: document.getElementById('k-role').value,
      mode: document.getElementById('k-mode').value,
      rateLimit: Number(document.getElementById('k-rate').value || 60),
      maxTurns: document.getElementById('k-turns').value
        ? Number(document.getElementById('k-turns').value)
        : null,
      timeoutMs: document.getElementById('k-timeout').value
        ? Number(document.getElementById('k-timeout').value)
        : null,
      ipWhitelist,
    };
    try {
      if (isEdit) {
        body.isActive = document.getElementById('k-active').value === 'true';
        await api(`/keys/${existing.id}`, { method: 'PATCH', body: JSON.stringify(body) });
        closeAppModal();
        renderKeys().catch(onErr);
      } else {
        const res = await api('/keys', { method: 'POST', body: JSON.stringify(body) });
        const box = document.getElementById('k-created');
        if (box) {
          box.hidden = false;
          box.textContent = `${t('keys.keyOnce')}\n${res.data?.key || JSON.stringify(res.data)}`;
        }
        const saveBtn = document.getElementById('k-save');
        if (saveBtn) {
          saveBtn.textContent = t('chats.close');
          saveBtn.onclick = () => {
            closeAppModal();
            renderKeys().catch(onErr);
          };
        }
      }
    } catch (e) {
      onErr(e);
    }
  };
}

function storageTypeLabel(type) {
  if (type === 'filesystem') return t('docs.storageFs');
  return t('docs.storageDb');
}

async function downloadDocument(id, originalName) {
  try {
    const res = await fetch(`${API}/documents/${id}/download`, {
      headers: state.key ? { Authorization: `Bearer ${state.key}` } : {},
    });
    if (!res.ok) {
      const text = await res.text();
      let msg = text;
      try {
        const j = JSON.parse(text);
        msg = j.error?.message || text;
      } catch {
        /* */
      }
      throw new Error(msg || t('docs.downloadFail'));
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = originalName || 'download';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (e) {
    showError(e.message || t('docs.downloadFail'));
  }
}

async function renderDocuments() {
  await loadKeys();
  const f = state.docFilter;
  const params = new URLSearchParams({
    limit: String(f.limit),
    offset: String(f.offset),
  });
  if (f.q) params.set('q', f.q);
  if (f.apiKeyId) params.set('apiKeyId', f.apiKeyId);
  if (f.storageType) params.set('storageType', f.storageType);
  if (f.from) params.set('from', new Date(f.from).toISOString());
  if (f.to) {
    const end = new Date(f.to);
    end.setHours(23, 59, 59, 999);
    params.set('to', end.toISOString());
  }
  const data = await api(`/documents?${params}`);
  const total = data.total ?? 0;
  const meta = data.meta || {};
  const storageHint = tf('docs.storageHint', {
    dir: meta.storageDir || '—',
    dbMax: fmtBytes(meta.documentDbMaxBytes),
    upMax: fmtBytes(meta.uploadMaxBytes),
  });

  const keyOpts = [
    `<option value="">${escapeHtml(t('common.all'))}</option>`,
    ...state.keys.map(
      (k) =>
        `<option value="${k.id}" ${f.apiKeyId === k.id ? 'selected' : ''}>${escapeHtml(k.name)}</option>`,
    ),
  ].join('');

  const bodyHtml = (data.data || [])
    .map(
      (d) => `
    <tr>
      <td><button class="linkish cell-primary" data-doc="${d.id}">${escapeHtml(d.originalName)}</button>
        ${isImageMime(d.mimeType) ? `<span class="chip img">${escapeHtml(t('chats.img'))}</span>` : ''}</td>
      <td>${escapeHtml(d.apiKey?.name || '')}</td>
      <td>${escapeHtml(d.mimeType)}</td>
      <td>${fmtBytes(d.sizeBytes)}</td>
      <td>
        <span title="${escapeHtml(d.storagePath || '')}">${escapeHtml(storageTypeLabel(d.storageType))}</span>
        ${d.storagePath ? `<div class="cell-sub">${escapeHtml(d.storagePath)}</div>` : ''}
      </td>
      <td>${fmtTime(d.createdAt)}</td>
      <td><div class="row-actions">
        <button class="btn secondary sm" data-dl="${d.id}" data-name="${escapeHtml(d.originalName)}">${escapeHtml(t('docs.download'))}</button>
        <button class="btn danger sm" data-del="${d.id}">${escapeHtml(t('docs.delete'))}</button>
      </div></td>
    </tr>`,
    )
    .join('');

  const filter = filterPanelHtml({
    title: t('common.filterTitle'),
    hint: t('common.filterHint'),
    meta: tf('common.pagerTotal', { n: total }),
    searchHtml: `
      <div class="data-filter-search">
        <label for="df-q">${escapeHtml(t('common.search'))}</label>
        <input type="search" id="df-q" value="${escapeHtml(f.q)}" placeholder="${escapeHtml(t('docs.searchPh'))}" />
      </div>`,
    gridHtml: `
      <label>${escapeHtml(t('chats.apiKey'))}
        <select id="df-key">${keyOpts}</select>
      </label>
      <label>${escapeHtml(t('docs.storage'))}
        <select id="df-storage">
          <option value="">${escapeHtml(t('common.all'))}</option>
          <option value="db" ${f.storageType === 'db' ? 'selected' : ''}>${escapeHtml(t('docs.storageDb'))}</option>
          <option value="filesystem" ${f.storageType === 'filesystem' ? 'selected' : ''}>${escapeHtml(t('docs.storageFs'))}</option>
        </select>
      </label>
      <label>${escapeHtml(t('chats.from'))}<input type="date" id="df-from" value="${escapeHtml(f.from)}" /></label>
      <label>${escapeHtml(t('chats.to'))}<input type="date" id="df-to" value="${escapeHtml(f.to)}" /></label>`,
  });

  const table = dataTablePanelHtml({
    headHtml: `
      <th>${escapeHtml(t('docs.file'))}</th>
      <th>${escapeHtml(t('chats.apiKey'))}</th>
      <th>${escapeHtml(t('docs.mime'))}</th>
      <th>${escapeHtml(t('docs.size'))}</th>
      <th>${escapeHtml(t('docs.storage'))}</th>
      <th>${escapeHtml(t('docs.time'))}</th>
      <th>${escapeHtml(t('common.actions'))}</th>`,
    bodyHtml,
    colSpan: 7,
    emptyText: t('docs.empty'),
    pagerHtml: pagerHtml({
      total,
      limit: f.limit,
      offset: f.offset,
      idPrefix: 'docs',
    }),
  });

  document.getElementById('app').innerHTML = shell(`
    <div class="topbar">
      <h2>${escapeHtml(t('docs.title'))}</h2>
    </div>
    ${pageMetaHtml([storageHint])}
    ${filter}
    ${table}
  `);
  bindShell();
  bindPager('docs', state.docFilter, () => renderDocuments().catch(onErr));
  document.querySelector('[data-filter-apply]').onclick = () => {
    state.docFilter.q = document.getElementById('df-q').value.trim();
    state.docFilter.apiKeyId = document.getElementById('df-key').value;
    state.docFilter.storageType = document.getElementById('df-storage').value;
    state.docFilter.from = document.getElementById('df-from').value;
    state.docFilter.to = document.getElementById('df-to').value;
    state.docFilter.offset = 0;
    renderDocuments().catch(onErr);
  };
  document.querySelector('[data-filter-reset]').onclick = () => {
    state.docFilter = {
      q: '',
      apiKeyId: '',
      storageType: '',
      from: '',
      to: '',
      limit: 20,
      offset: 0,
    };
    renderDocuments().catch(onErr);
  };
  document.querySelectorAll('[data-doc]').forEach((b) => {
    b.onclick = () => openDocument(b.dataset.doc);
  });
  document.querySelectorAll('[data-dl]').forEach((b) => {
    b.onclick = () =>
      downloadDocument(b.getAttribute('data-dl'), b.getAttribute('data-name') || 'file');
  });
  document.querySelectorAll('[data-del]').forEach((b) => {
    b.onclick = async () => {
      if (
        !(await uiConfirm({
          message: t('docs.confirmDel'),
          variant: 'danger',
          confirmText: t('docs.delete'),
        }))
      )
        return;
      await api(`/documents/${b.dataset.del}`, { method: 'DELETE' });
      renderDocuments().catch(onErr);
    };
  });
}

/** Fetch decrypted document bytes with admin session/key (for image preview). */
async function fetchDocumentBlobUrl(id) {
  const res = await fetch(`${API}/documents/${id}/download`, {
    headers: state.key ? { Authorization: `Bearer ${state.key}` } : {},
  });
  if (!res.ok) {
    const text = await res.text();
    let msg = text;
    try {
      msg = JSON.parse(text)?.error?.message || text;
    } catch {
      /* */
    }
    throw new Error(msg || t('docs.downloadFail'));
  }
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

async function resolveDocumentImageSrc(doc) {
  if (doc?.imageDataUrl) return { src: doc.imageDataUrl, revoke: null };
  if (doc?.isImage || isImageMime(doc?.mimeType)) {
    const src = await fetchDocumentBlobUrl(doc.id);
    return { src, revoke: src };
  }
  return null;
}

async function openDocument(id) {
  const { data: doc } = await api(`/documents/${id}`);
  let preview;
  let revokeUrl = null;
  try {
    const img = await resolveDocumentImageSrc(doc);
    if (img) {
      revokeUrl = img.revoke;
      preview = `<img class="preview doc-preview-img" src="${img.src}" alt="${escapeHtml(doc.originalName || '')}" />`;
    } else if (doc.isBinary || doc.content == null) {
      preview = `<div class="data-empty"><div class="data-empty-icon">⧉</div><strong>${escapeHtml(t('docs.binaryPreview'))}</strong></div>`;
    } else {
      preview = `<div class="pre" id="doc-content">${escapeHtml(doc.content || t('chats.none'))}</div>`;
    }
  } catch {
    preview = `<div class="data-empty"><div class="data-empty-icon">⧉</div><strong>${escapeHtml(t('chats.previewFailed') || t('docs.binaryPreview'))}</strong></div>`;
  }
  const storageLine = `${storageTypeLabel(doc.storageType)}${
    doc.storagePath ? ` · ${doc.storagePath}` : ''
  }`;
  openAppModal({
    title: t('docs.detail'),
    subtitle: `${escapeHtml(doc.originalName)} · ${escapeHtml(doc.mimeType)} · ${fmtBytes(doc.sizeBytes)}<br/><span class="muted">${escapeHtml(t('docs.storage'))}: ${escapeHtml(storageLine)}</span>`,
    size: 'lg',
    bodyHtml: `
      <div class="block">
        <h4>${escapeHtml(t('docs.preview'))}</h4>
        ${preview}
      </div>`,
    footerHtml: `
      ${
        !doc.imageDataUrl &&
        !(doc.isImage || isImageMime(doc.mimeType)) &&
        doc.content &&
        !doc.isBinary
          ? `<button type="button" class="btn secondary sm" id="doc-copy">${escapeHtml(t('docs.copy'))}</button>`
          : ''
      }
      <button type="button" class="btn sm" id="doc-download">${escapeHtml(t('docs.download'))}</button>
      <button type="button" class="btn secondary sm" id="doc-close">${escapeHtml(t('chats.close'))}</button>`,
  });
  const closeAndRevoke = () => {
    if (revokeUrl) {
      try {
        URL.revokeObjectURL(revokeUrl);
      } catch {
        /* */
      }
    }
    closeAppModal();
  };
  document.getElementById('doc-close')?.addEventListener('click', closeAndRevoke);
  document.getElementById('doc-download').onclick = () =>
    downloadDocument(doc.id, doc.originalName);
  document.getElementById('doc-copy')?.addEventListener('click', async () => {
    const ok = await copyTextToClipboard(doc.content || '');
    if (ok) {
      const b = document.getElementById('doc-copy');
      if (b) b.textContent = t('chat.copied');
    }
  });
}

function auditActionLabel(action) {
  if (!action) return '-';
  // i18n keys use _ (t() splits on .)
  const key = `audit.actions.${String(action).replace(/\./g, '_')}`;
  const label = t(key);
  return label === key ? action : label;
}

function auditResourceLabel(resource) {
  if (!resource) return '';
  const key = `audit.resources.${String(resource).replace(/\./g, '_')}`;
  const label = t(key);
  return label === key ? resource : label;
}

/** Pretty-print meta JSON with light field name hints for zh users */
function formatAuditMeta(metaJson) {
  if (!metaJson) return '';
  try {
    const obj = typeof metaJson === 'string' ? JSON.parse(metaJson) : metaJson;
    if (!obj || typeof obj !== 'object') return String(metaJson);
    return Object.entries(obj)
      .map(([k, v]) => {
        const field =
          {
            originalName: t('docs.file'),
            mimeType: t('docs.mime'),
            sizeBytes: t('docs.size'),
            storageType: t('audit.metaStorage'),
            asKeyId: t('audit.metaAsKey'),
            asKeyName: t('audit.metaAsKeyName'),
            model: t('chats.model'),
            stream: t('chats.stream'),
          }[k] || k;
        const val =
          typeof v === 'object' ? JSON.stringify(v) : String(v ?? '');
        return `${field}: ${val}`;
      })
      .join(' · ');
  } catch {
    return String(metaJson);
  }
}

async function renderAudit() {
  await loadKeys();
  const f = state.auditFilter;
  const q = new URLSearchParams();
  q.set('limit', String(f.limit));
  q.set('offset', String(f.offset));
  if (f.q) q.set('q', f.q);
  if (f.action) q.set('action', f.action);
  if (f.apiKeyId) q.set('apiKeyId', f.apiKeyId);
  if (f.from) q.set('from', new Date(f.from).toISOString());
  if (f.to) {
    const end = new Date(f.to);
    end.setHours(23, 59, 59, 999);
    q.set('to', end.toISOString());
  }
  const data = await api(`/audit-logs?${q}`);
  const total = data.total ?? 0;
  const actions = [
    '',
    'chat.create',
    'document.upload',
    'document.delete',
    'document.download',
    'api_key.create',
    'api_key.update',
    'api_key.delete',
    'settings.update',
    'playground.chat',
    'ip.ban',
    'ip.unban',
    'ddos.policy_update',
    'pm2.switch',
    'system.update',
  ];
  const keyOpts = [
    `<option value="">${escapeHtml(t('common.all'))}</option>`,
    ...state.keys.map(
      (k) =>
        `<option value="${k.id}" ${f.apiKeyId === k.id ? 'selected' : ''}>${escapeHtml(k.name)}</option>`,
    ),
  ].join('');
  const actionOpts = actions
    .map((a) => {
      if (!a)
        return `<option value="">${escapeHtml(t('common.all'))}</option>`;
      return `<option value="${escapeHtml(a)}" ${f.action === a ? 'selected' : ''}>${escapeHtml(auditActionLabel(a))}</option>`;
    })
    .join('');

  const bodyHtml = (data.data || [])
    .map(
      (a) => `
    <tr>
      <td>${fmtTime(a.createdAt)}</td>
      <td title="${escapeHtml(a.action || '')}"><span class="cell-primary">${escapeHtml(auditActionLabel(a.action))}</span></td>
      <td>
        <div>${escapeHtml(auditResourceLabel(a.resource))}</div>
        ${a.resourceId ? `<div class="cell-sub audit-id" title="${escapeHtml(a.resourceId)}">${escapeHtml(a.resourceId)}</div>` : ''}
      </td>
      <td>${escapeHtml(a.apiKey?.name || '-')}</td>
      <td class="muted audit-meta">${escapeHtml(formatAuditMeta(a.metaJson))}</td>
    </tr>`,
    )
    .join('');

  const filter = filterPanelHtml({
    title: t('common.filterTitle'),
    hint: t('common.filterHint'),
    meta: tf('common.pagerTotal', { n: total }),
    searchHtml: `
      <div class="data-filter-search">
        <label for="af-q">${escapeHtml(t('common.search'))}</label>
        <input type="search" id="af-q" value="${escapeHtml(f.q)}" placeholder="${escapeHtml(t('audit.searchPh'))}" />
      </div>`,
    gridHtml: `
      <label>${escapeHtml(t('audit.action'))}
        <select id="af-action">${actionOpts}</select>
      </label>
      <label>${escapeHtml(t('audit.key'))}
        <select id="af-key">${keyOpts}</select>
      </label>
      <label>${escapeHtml(t('chats.from'))}<input type="date" id="af-from" value="${escapeHtml(f.from)}" /></label>
      <label>${escapeHtml(t('chats.to'))}<input type="date" id="af-to" value="${escapeHtml(f.to)}" /></label>`,
  });

  const table = dataTablePanelHtml({
    headHtml: `
      <th>${escapeHtml(t('audit.time'))}</th>
      <th>${escapeHtml(t('audit.action'))}</th>
      <th>${escapeHtml(t('audit.resource'))}</th>
      <th>${escapeHtml(t('audit.key'))}</th>
      <th>${escapeHtml(t('audit.meta'))}</th>`,
    bodyHtml,
    colSpan: 5,
    emptyText: t('audit.empty'),
    pagerHtml: pagerHtml({
      total,
      limit: f.limit,
      offset: f.offset,
      idPrefix: 'audit',
    }),
  });

  document.getElementById('app').innerHTML = shell(`
    <div class="topbar">
      <h2>${escapeHtml(t('audit.title'))}</h2>
    </div>
    ${filter}
    ${table}
  `);
  bindShell();
  bindPager('audit', state.auditFilter, () => renderAudit().catch(onErr));
  document.querySelector('[data-filter-apply]').onclick = () => {
    state.auditFilter.q = document.getElementById('af-q').value.trim();
    state.auditFilter.action = document.getElementById('af-action').value;
    state.auditFilter.apiKeyId = document.getElementById('af-key').value;
    state.auditFilter.from = document.getElementById('af-from').value;
    state.auditFilter.to = document.getElementById('af-to').value;
    state.auditFilter.offset = 0;
    renderAudit().catch(onErr);
  };
  document.querySelector('[data-filter-reset]').onclick = () => {
    state.auditFilter = {
      q: '',
      action: '',
      apiKeyId: '',
      from: '',
      to: '',
      limit: 50,
      offset: 0,
    };
    renderAudit().catch(onErr);
  };
}

/** Presets for Safety settings guide (apply confirms + persists immediately). */
function settingsPresets() {
  return [
    {
      id: 'local',
      titleKey: 'settings.scLocalTitle',
      descKey: 'settings.scLocalDesc',
      detailKey: 'settings.scLocalDetail',
      // Off global — safe fields unused but set sensible defaults if re-enabled
      values: {
        globalSafeMode: false,
        safeToolsMode: 'none',
        safeMaxTurns: 16,
        safeTimeoutMs: 180000,
      },
    },
    {
      id: 'prod',
      titleKey: 'settings.scProdTitle',
      descKey: 'settings.scProdDesc',
      detailKey: 'settings.scProdDetail',
      values: {
        globalSafeMode: true,
        safeToolsMode: 'none',
        safeMaxTurns: 10,
        safeTimeoutMs: 120000,
      },
    },
    {
      id: 'code',
      titleKey: 'settings.scCodeTitle',
      descKey: 'settings.scCodeDesc',
      detailKey: 'settings.scCodeDetail',
      values: {
        globalSafeMode: false,
        safeToolsMode: 'none',
        safeMaxTurns: 20,
        safeTimeoutMs: 300000,
      },
    },
    {
      id: 'read',
      titleKey: 'settings.scReadTitle',
      descKey: 'settings.scReadDesc',
      detailKey: 'settings.scReadDetail',
      values: {
        globalSafeMode: true,
        safeToolsMode: 'readonly',
        safeMaxTurns: 12,
        safeTimeoutMs: 150000,
      },
    },
    {
      id: 'chat',
      titleKey: 'settings.scChatTitle',
      descKey: 'settings.scChatDesc',
      detailKey: 'settings.scChatDetail',
      values: {
        globalSafeMode: true,
        safeToolsMode: 'none',
        safeMaxTurns: 5,
        safeTimeoutMs: 60000,
      },
    },
    {
      id: 'long',
      titleKey: 'settings.scLongTitle',
      descKey: 'settings.scLongDesc',
      detailKey: 'settings.scLongDetail',
      values: {
        globalSafeMode: true,
        safeToolsMode: 'none',
        safeMaxTurns: 40,
        safeTimeoutMs: 600000,
      },
    },
  ];
}

function readSettingsFormValues() {
  return {
    globalSafeMode: document.getElementById('s-master-global')
      ? isMasterToggleOn('s-master-global')
      : false,
    safeToolsMode: document.getElementById('s-tools')?.value || 'none',
    safeMaxTurns: Number(document.getElementById('s-turns')?.value),
    safeTimeoutMs: Number(document.getElementById('s-timeout')?.value),
  };
}

function presetMatchesForm(values) {
  const cur = readSettingsFormValues();
  if (!Number.isFinite(cur.safeMaxTurns) || !Number.isFinite(cur.safeTimeoutMs)) {
    return false;
  }
  return (
    cur.globalSafeMode === Boolean(values.globalSafeMode) &&
    cur.safeToolsMode === values.safeToolsMode &&
    cur.safeMaxTurns === Number(values.safeMaxTurns) &&
    cur.safeTimeoutMs === Number(values.safeTimeoutMs)
  );
}

function refreshSettingsPresetUi() {
  for (const p of settingsPresets()) {
    const card = document.querySelector(`[data-preset="${p.id}"]`);
    const btn = document.querySelector(`[data-apply-preset="${p.id}"]`);
    if (!card || !btn) continue;
    const active = presetMatchesForm(p.values);
    card.classList.toggle('is-applied', active);
    btn.textContent = active
      ? t('settings.guideActive')
      : t('settings.guideApply');
    btn.disabled = active;
    btn.classList.toggle('is-applied', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  }
}

function applySettingsPresetToForm(values) {
  const tools = document.getElementById('s-tools');
  const turns = document.getElementById('s-turns');
  const timeout = document.getElementById('s-timeout');
  const on = Boolean(values.globalSafeMode);
  setMasterToggle(
    's-master-global',
    on,
    t('settings.masterOn'),
    t('settings.masterOff'),
  );
  setFeatureRootOff('settings-root', !on);
  setFeatureOffBanner('settings-disabled-banner', !on);
  if (tools && values.safeToolsMode) tools.value = values.safeToolsMode;
  if (turns && values.safeMaxTurns != null) turns.value = String(values.safeMaxTurns);
  if (timeout && values.safeTimeoutMs != null) {
    timeout.value = String(values.safeTimeoutMs);
  }
  refreshSettingsPresetUi();
}

/** Confirm → fill form → PUT /settings so “Applied” reflects saved state. */
async function applySettingsPreset(preset) {
  if (!preset?.values) return;
  if (
    !(await uiConfirm({
      title: t(preset.titleKey),
      message: tf('settings.guideApplyConfirm', { name: t(preset.titleKey) }),
      variant: 'confirm',
      confirmText: t('settings.guideApply'),
    }))
  ) {
    return;
  }
  applySettingsPresetToForm(preset.values);
  try {
    await api('/settings', {
      method: 'PUT',
      body: JSON.stringify({
        globalSafeMode: Boolean(preset.values.globalSafeMode),
        safeToolsMode: preset.values.safeToolsMode,
        safeMaxTurns: Number(preset.values.safeMaxTurns),
        safeTimeoutMs: Number(preset.values.safeTimeoutMs),
        defaultModel: document.getElementById('s-model')?.value?.trim() || '',
      }),
    });
    refreshSettingsPresetUi();
    const bar = document.querySelector('#flash-error');
    if (bar) {
      bar.hidden = false;
      bar.classList.add('flash-ok');
      bar.textContent = t('settings.guideApplied');
      setTimeout(() => {
        if (bar.textContent === t('settings.guideApplied')) {
          bar.hidden = true;
          bar.classList.remove('flash-ok');
          bar.textContent = '';
        }
      }, 2500);
    }
  } catch (e) {
    onErr(e);
  }
}

async function renderSettings() {
  const [{ data }, catalog] = await Promise.all([api('/settings'), loadModels()]);
  const modelOpts = (catalog.models || state.models || [])
    .map(
      (m) =>
        `<option value="${escapeHtml(m)}" ${data.defaultModel === m ? 'selected' : ''}>${escapeHtml(m)}</option>`,
    )
    .join('');

  const guideCards = settingsPresets()
    .map(
      (p) => `
      <article class="settings-guide-card" data-preset="${escapeHtml(p.id)}">
        <div class="settings-guide-card-h">
          <strong>${escapeHtml(t(p.titleKey))}</strong>
          <button type="button" class="btn secondary sm" data-apply-preset="${escapeHtml(p.id)}">${escapeHtml(t('settings.guideApply'))}</button>
        </div>
        <p class="settings-guide-desc">${escapeHtml(t(p.descKey))}</p>
        <p class="settings-guide-detail muted">${escapeHtml(t(p.detailKey))}</p>
        <div class="settings-guide-chips">
          <span class="chip">${escapeHtml(p.values.globalSafeMode ? t('settings.chipGlobalOn') : t('settings.chipGlobalOff'))}</span>
          <span class="chip">${escapeHtml(p.values.safeToolsMode)}</span>
          <span class="chip">turns ${p.values.safeMaxTurns}</span>
          <span class="chip">${Math.round(p.values.safeTimeoutMs / 1000)}s</span>
        </div>
      </article>`,
    )
    .join('');

  const safeOn = Boolean(data.globalSafeMode);

  document.getElementById('app').innerHTML = shell(`
    <div id="settings-root" class="${safeOn ? '' : 'is-feature-off'}">
    <div class="topbar">
      <h2>${escapeHtml(t('settings.title'))}</h2>
      <div class="toolbar">
        ${masterToggleBtnHtml({
          id: 's-master-global',
          on: safeOn,
          onLabel: t('settings.masterOn'),
          offLabel: t('settings.masterOff'),
          title: t('settings.globalSafeHint'),
        })}
        <button class="btn secondary sm" id="btn-refresh-models">${escapeHtml(t('settings.refreshModels'))}</button>
      </div>
    </div>
    <div class="feature-off-banner" id="settings-disabled-banner" ${safeOn ? 'hidden' : ''} role="status">
      <strong>${escapeHtml(t('common.featureOff'))}</strong>
      <span>${escapeHtml(t('settings.disabledBanner'))}</span>
    </div>
    ${pageMetaHtml([t('settings.globalSafeHint')])}
    <div class="panel">
      <div class="modal-b">
        <div class="form-grid settings-safe-fields">
          <label>${escapeHtml(t('settings.tools'))}
            <select id="s-tools">
              <option value="none">${escapeHtml(t('settings.toolsNone'))}</option>
              <option value="readonly">${escapeHtml(t('settings.toolsReadonly'))}</option>
            </select>
            <span class="hint">${escapeHtml(t('settings.toolsHint'))}</span>
          </label>
          <label>${escapeHtml(t('settings.maxTurns'))}
            <input id="s-turns" type="number" min="1" max="50" value="${data.safeMaxTurns}" />
            <span class="hint">${escapeHtml(t('settings.maxTurnsHint'))}</span>
          </label>
          <label>${escapeHtml(t('settings.timeout'))}
            <input id="s-timeout" type="number" min="1000" step="1000" value="${data.safeTimeoutMs}" />
            <span class="hint">${escapeHtml(t('settings.timeoutHint'))}</span>
          </label>
          <label class="full">${escapeHtml(t('settings.defaultModel'))}
            <select id="s-model">${modelOpts || `<option value="${escapeHtml(data.defaultModel)}">${escapeHtml(data.defaultModel)}</option>`}</select>
            <span class="hint">${escapeHtml(t('settings.defaultModelHint'))}${catalog.source ? ` · ${escapeHtml(catalog.source)}` : ''}</span>
          </label>
        </div>
        <div class="toolbar settings-save-bar">
          <button class="btn" id="s-save">${escapeHtml(t('settings.save'))}</button>
        </div>
      </div>
    </div>
    <div class="panel settings-guide">
      <div class="panel-h">
        <strong>${escapeHtml(t('settings.guideTitle'))}</strong>
        <span class="muted panel-h-sub">${escapeHtml(t('settings.guideIntro'))}</span>
      </div>
      <div class="modal-b">
        <div class="settings-guide-grid">${guideCards}</div>
      </div>
    </div>
    <div class="danger-zone">
      <h3>${escapeHtml(t('settings.dangerTitle'))}</h3>
      <p class="muted">${escapeHtml(t('settings.panelOffHint'))} · ${escapeHtml(t('settings.panelStatus'))}: <strong>${data.adminPanelEnabled ? t('settings.panelOn') : t('settings.panelOff')}</strong></p>
      <button class="btn danger sm" id="s-disable-panel" ${!data.adminPanelEnabled ? 'disabled' : ''}>${escapeHtml(t('settings.disablePanel'))}</button>
    </div>
    </div>
  `);
  bindShell();
  document.getElementById('s-tools').value = data.safeToolsMode || 'none';

  const syncPresetUi = () => refreshSettingsPresetUi();
  ['s-tools', 's-turns', 's-timeout'].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('change', syncPresetUi);
    el.addEventListener('input', syncPresetUi);
  });
  refreshSettingsPresetUi();

  document.getElementById('s-master-global')?.addEventListener('click', async () => {
    const next = !isMasterToggleOn('s-master-global');
    setMasterToggle(
      's-master-global',
      next,
      t('settings.masterOn'),
      t('settings.masterOff'),
    );
    setFeatureRootOff('settings-root', !next);
    setFeatureOffBanner('settings-disabled-banner', !next);
    refreshSettingsPresetUi();
    // Immediate save of master switch + current form values
    try {
      await api('/settings', {
        method: 'PUT',
        body: JSON.stringify({
          globalSafeMode: next,
          safeToolsMode: document.getElementById('s-tools').value,
          safeMaxTurns: Number(document.getElementById('s-turns').value),
          safeTimeoutMs: Number(document.getElementById('s-timeout').value),
          defaultModel: document.getElementById('s-model').value.trim(),
        }),
      });
    } catch (e) {
      setMasterToggle(
        's-master-global',
        !next,
        t('settings.masterOn'),
        t('settings.masterOff'),
      );
      setFeatureRootOff('settings-root', next);
      setFeatureOffBanner('settings-disabled-banner', next);
      onErr(e);
    }
  });

  document.getElementById('btn-refresh-models').onclick = async () => {
    await loadModels(true);
    renderSettings().catch(onErr);
  };
  document.getElementById('s-save').onclick = async () => {
    try {
      await api('/settings', {
        method: 'PUT',
        body: JSON.stringify({
          globalSafeMode: isMasterToggleOn('s-master-global'),
          safeToolsMode: document.getElementById('s-tools').value,
          safeMaxTurns: Number(document.getElementById('s-turns').value),
          safeTimeoutMs: Number(document.getElementById('s-timeout').value),
          defaultModel: document.getElementById('s-model').value.trim(),
        }),
      });
      refreshSettingsPresetUi();
      const bar = document.querySelector('#flash-error');
      if (bar) {
        bar.hidden = false;
        bar.classList.add('flash-ok');
        bar.textContent = t('settings.saved');
        setTimeout(() => {
          bar.hidden = true;
          bar.classList.remove('flash-ok');
          bar.textContent = '';
        }, 2000);
      }
    } catch (e) {
      onErr(e);
    }
  };
  document.querySelectorAll('[data-apply-preset]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (btn.disabled) return;
      const id = btn.getAttribute('data-apply-preset');
      const preset = settingsPresets().find((p) => p.id === id);
      if (preset) await applySettingsPreset(preset);
    });
  });
  document.getElementById('s-disable-panel').onclick = async () => {
    if (
      !(await uiConfirm({
        message: t('settings.disablePanelConfirm'),
        variant: 'danger',
        confirmText: t('settings.disablePanel'),
      }))
    )
      return;
    try {
      await api('/settings', {
        method: 'PUT',
        body: JSON.stringify({ adminPanelEnabled: false }),
      });
      await uiAlert({
        message: t('settings.disablePanelDone'),
        title: t('common.notice'),
      });
      logout(false);
    } catch (e) {
      onErr(e);
    }
  };
}

/** Admin: Grok CLI capability + protocol feature flags — tab layout matches other pages */
async function renderApiFeatures() {
  const res = await api('/api-features');
  if (state.page !== 'apiFeatures') return;
  const data = res.data || {};

  const groups = [
    {
      id: 'protocols',
      title: t('apiFeatures.groupProtocols'),
      tabLabel: t('apiFeatures.tabProtocols'),
      keys: ['openaiChat', 'openaiResponses', 'anthropicMessages'],
    },
    {
      id: 'media',
      title: t('apiFeatures.groupMedia'),
      tabLabel: t('apiFeatures.tabMedia'),
      keys: ['imagesApi', 'filesOpenAiAlias', 'videoApi', 'audioApi'],
    },
    {
      id: 'caps',
      title: t('apiFeatures.groupCaps'),
      tabLabel: t('apiFeatures.tabCaps'),
      keys: [
        'tools',
        'structuredOutput',
        'vision',
        'reasoningEffort',
        'webSearch',
        'subagents',
        'planMode',
        'memory',
        'sessionResume',
        'bestOfN',
        'checkLoop',
        'systemOverride',
        'rules',
        'permissionMode',
        'sandbox',
      ],
    },
    {
      id: 'emu',
      title: t('apiFeatures.groupEmu'),
      tabLabel: t('apiFeatures.tabEmu'),
      keys: [
        'usageEstimate',
        'assistantsEmulation',
        'strictSampling',
        'forceDisableToolsInSafe',
      ],
    },
  ];

  const tab =
    state.apiFeaturesTab === 'media' ||
    state.apiFeaturesTab === 'caps' ||
    state.apiFeaturesTab === 'emu' ||
    state.apiFeaturesTab === 'protocols'
      ? state.apiFeaturesTab
      : 'protocols';
  state.apiFeaturesTab = tab;

  const flagLabel = (k) => t(`apiFeatures.flag.${k}`) || k;
  const flagHint = (k) => t(`apiFeatures.hint.${k}`) || '';

  const groupOnCount = (keys) => keys.filter((k) => Boolean(data[k])).length;

  const flagRowsHtml = (keys) =>
    keys
      .map((k) => {
        const on = Boolean(data[k]);
        return `
          <div class="dash-prot-row api-feat-row" data-feat="${escapeHtml(k)}">
            <div>
              <strong>${escapeHtml(flagLabel(k))}</strong>
              <div class="muted api-feat-hint">${escapeHtml(flagHint(k))}</div>
            </div>
            <button type="button" class="master-toggle ${on ? 'is-on' : 'is-off'}" data-feat-toggle="${escapeHtml(k)}" aria-pressed="${on ? 'true' : 'false'}">
              <span class="master-toggle-track" aria-hidden="true"><span class="master-toggle-knob"></span></span>
              <span class="master-toggle-label">${escapeHtml(on ? t('dash.on') : t('dash.off'))}</span>
            </button>
          </div>`;
      })
      .join('');

  const totalKeys = groups.reduce((n, g) => n + g.keys.length, 0);
  const totalOn = groups.reduce((n, g) => n + groupOnCount(g.keys), 0);

  const kpiGrid = `
    <div class="grid api-feat-kpi-grid">
      <div class="card">
        <div class="label">${escapeHtml(t('apiFeatures.kpiEnabled'))}</div>
        <div class="value value-sm">${totalOn}<span class="dash-kpi-den">/${totalKeys}</span></div>
        <div class="muted card-sub">${escapeHtml(t('apiFeatures.kpiEnabledSub'))}</div>
      </div>
      ${groups
        .map((g) => {
          const on = groupOnCount(g.keys);
          return `
        <div class="card">
          <div class="label">${escapeHtml(g.tabLabel)}</div>
          <div class="value value-sm">${on}<span class="dash-kpi-den">/${g.keys.length}</span></div>
          <div class="muted card-sub">${escapeHtml(g.title)}</div>
        </div>`;
        })
        .join('')}
    </div>`;

  const tabButtons = groups
    .map((g) => {
      const on = groupOnCount(g.keys);
      return `
        <button type="button" role="tab" class="seg-tab ${tab === g.id ? 'is-active' : ''}" data-feat-tab="${escapeHtml(g.id)}" aria-selected="${tab === g.id}">
          ${escapeHtml(g.tabLabel)}
          <span class="seg-tab-count">${on}/${g.keys.length}</span>
        </button>`;
    })
    .join('');

  const tabPanes = groups
    .map((g) => {
      return `
        <div class="usage-tab-pane api-feat-tab-pane" id="api-feat-tab-${escapeHtml(g.id)}" ${tab === g.id ? '' : 'hidden'}>
          <div class="panel data-table-panel api-feat-panel">
            <div class="panel-h">
              <div class="panel-h-text">
                <strong>${escapeHtml(g.title)}</strong>
                <span class="muted panel-h-sub">${escapeHtml(tf('apiFeatures.groupMeta', { on: groupOnCount(g.keys), n: g.keys.length }))}</span>
              </div>
            </div>
            <div class="panel-pad api-feat-list">${flagRowsHtml(g.keys)}</div>
          </div>
        </div>`;
    })
    .join('');

  document.getElementById('app').innerHTML = shell(`
    <div class="topbar">
      <h2>${escapeHtml(t('apiFeatures.title'))}</h2>
      <div class="toolbar">
        <button type="button" class="btn secondary sm" data-feat-preset="open">${escapeHtml(t('apiFeatures.presetOpen'))}</button>
        <button type="button" class="btn secondary sm" data-feat-preset="locked">${escapeHtml(t('apiFeatures.presetLocked'))}</button>
        <button type="button" class="btn secondary sm" data-feat-preset="dev">${escapeHtml(t('apiFeatures.presetDev'))}</button>
      </div>
    </div>
    ${pageMetaHtml([t('apiFeatures.intro')])}
    ${kpiGrid}

    <div class="usage-tabs-panel panel api-feat-tabs-panel">
      <div class="seg-tabs" role="tablist" aria-label="${escapeHtml(t('apiFeatures.title'))}">
        ${tabButtons}
      </div>
      <div class="usage-tab-body">
        ${tabPanes}
      </div>
    </div>
  `);
  bindShell();

  document.querySelectorAll('[data-feat-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const raw = btn.getAttribute('data-feat-tab') || 'protocols';
      const next =
        raw === 'media' || raw === 'caps' || raw === 'emu' || raw === 'protocols'
          ? raw
          : 'protocols';
      if (state.apiFeaturesTab === next) return;
      state.apiFeaturesTab = next;
      renderApiFeatures().catch(onErr);
    });
  });

  document.querySelectorAll('[data-feat-toggle]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const key = btn.getAttribute('data-feat-toggle');
      if (!key) return;
      const next = !btn.classList.contains('is-on');
      try {
        await api('/api-features', {
          method: 'PUT',
          body: JSON.stringify({ [key]: next }),
        });
        await renderApiFeatures();
      } catch (e) {
        onErr(e);
      }
    });
  });

  document.querySelectorAll('[data-feat-preset]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const name = btn.getAttribute('data-feat-preset');
      if (
        !(await uiConfirm({
          message: tf('apiFeatures.presetConfirm', { name }),
          confirmText: t('common.confirm'),
        }))
      )
        return;
      try {
        await api('/api-features/preset', {
          method: 'POST',
          body: JSON.stringify({ name }),
        });
        await renderApiFeatures();
      } catch (e) {
        onErr(e);
      }
    });
  });
}

/** Admin: media studio + assets + jobs — tab layout matches chat queue */
async function renderMedia() {
  if (!state.mediaFilter) {
    state.mediaFilter = {
      tab: 'studio',
      q: '',
      kind: '',
      provider: '',
      from: '',
      to: '',
      limit: 20,
      offset: 0,
    };
  }
  if (!state.mediaFilter.tab) state.mediaFilter.tab = 'studio';
  const f = state.mediaFilter;
  const tab =
    f.tab === 'assets' || f.tab === 'jobs' || f.tab === 'studio'
      ? f.tab
      : 'studio';
  f.tab = tab;

  const params = new URLSearchParams({
    limit: String(f.limit),
    offset: String(f.offset),
  });
  if (f.q) params.set('q', f.q);
  if (f.kind) params.set('kind', f.kind);
  if (f.provider) params.set('provider', f.provider);
  if (f.from) params.set('from', new Date(f.from).toISOString());
  if (f.to) {
    const end = new Date(f.to);
    end.setHours(23, 59, 59, 999);
    params.set('to', end.toISOString());
  }

  // Keys + full model catalog (all Grok models + system default) + assets/jobs
  const [catalog, , assetsRes, jobsRes] = await Promise.all([
    loadModels(false).catch(() => ({
      models: state.models || [],
      defaultModel: '',
    })),
    loadKeys().catch(() => {}),
    api(`/media/assets?${params}`),
    api('/media/jobs?limit=50').catch(() => ({ data: [], total: 0 })),
  ]);
  const assets = assetsRes.data || [];
  const assetsTotal = assetsRes.total ?? assets.length;
  const jobs = jobsRes.data || [];
  const jobsTotal = jobsRes.total ?? jobs.length;

  const agentKeys = (state.keys || []).filter(
    (k) => k.isActive !== false && (k.mode === 'agent' || k.role === 'admin'),
  );
  const genKeyOpts = [
    `<option value="">${escapeHtml(t('media.generateKeySession'))}</option>`,
    ...agentKeys.map(
      (k) =>
        `<option value="${escapeHtml(k.id)}">${escapeHtml(k.name || k.id)} · ${escapeHtml(k.keyPrefix || '')}… · ${escapeHtml(k.mode || '')}</option>`,
    ),
  ].join('');
  const modelList = catalog.models?.length
    ? catalog.models
    : state.models || [];
  const defaultModel =
    catalog.defaultModel || modelList[0] || '';
  // All Grok CLI models; system default selected
  const genModelOpts = modelList.length
    ? modelList
        .map(
          (m) =>
            `<option value="${escapeHtml(m)}" ${m === defaultModel ? 'selected' : ''}>${escapeHtml(m)}${m === defaultModel ? ` · ${escapeHtml(t('media.modelDefault'))}` : ''}</option>`,
        )
        .join('')
    : `<option value="">${escapeHtml(defaultModel || t('media.modelEmpty'))}</option>`;

  // Grok Imagine aspect_ratio (not OpenAI pixel sizes)
  const aspectOpts = [
    ['1:1', '1:1 · square'],
    ['16:9', '16:9 · landscape'],
    ['9:16', '9:16 · portrait / story'],
    ['4:3', '4:3'],
    ['3:4', '3:4'],
    ['3:2', '3:2'],
    ['2:3', '2:3'],
    ['auto', 'auto'],
  ]
    .map(
      ([v, label], i) =>
        `<option value="${v}" ${i === 0 ? 'selected' : ''}>${escapeHtml(label)}</option>`,
    )
    .join('');

  const bodyHtml = assets
    .map((a) => {
      const mime = a.mime || '';
      const fname = a.filename || a.originalName || '';
      const canPreview = isBrowserPreviewable(mime, fname);
      const pKind = mediaPreviewKind(mime, fname) || '';
      const preview = canPreview
        ? `<button type="button" class="btn ghost sm" data-media-preview="${escapeHtml(a.id)}" data-media-mime="${escapeHtml(mime)}" data-media-name="${escapeHtml(fname)}" data-media-kind="${escapeHtml(a.kind || '')}" data-media-bytes="${escapeHtml(String(a.bytes ?? ''))}" data-media-prompt="${escapeHtml(a.prompt || '')}" data-preview-kind="${escapeHtml(pKind)}" title="${escapeHtml(t('media.preview'))}">${escapeHtml(t('media.preview'))}</button>`
        : '';
      return `
    <tr>
      <td>
        <div class="cell-primary mono" title="${escapeHtml(a.id)}">${escapeHtml(String(a.id).slice(0, 8))}…</div>
        <div class="cell-sub">${escapeHtml(fname || a.source || '—')}</div>
      </td>
      <td>${escapeHtml(a.kind || '—')}</td>
      <td class="muted">${escapeHtml(mime || '—')}</td>
      <td>${fmtBytes(a.bytes)}</td>
      <td>${escapeHtml(a.provider || '—')}</td>
      <td class="muted" title="${escapeHtml(a.prompt || '')}">${escapeHtml((a.prompt || '—').slice(0, 48))}</td>
      <td>${fmtTime(a.created_at)}</td>
      <td><div class="row-actions">
        ${preview}
        <button type="button" class="btn ghost sm" data-media-dl="${escapeHtml(a.id)}" data-media-name="${escapeHtml(fname)}">${escapeHtml(t('media.download'))}</button>
        <button type="button" class="btn danger sm" data-media-del="${escapeHtml(a.id)}">${escapeHtml(t('media.delete'))}</button>
      </div></td>
    </tr>`;
    })
    .join('');

  const filter = filterPanelHtml({
    title: t('common.filterTitle'),
    hint: t('common.filterHint'),
    meta: tf('common.pagerTotal', { n: assetsTotal }),
    searchHtml: `
      <div class="data-filter-search">
        <label for="mf-q">${escapeHtml(t('common.search'))}</label>
        <input type="search" id="mf-q" value="${escapeHtml(f.q)}" placeholder="${escapeHtml(t('media.searchPh'))}" />
      </div>`,
    gridHtml: `
      <label>${escapeHtml(t('media.kind'))}
        <select id="mf-kind">
          <option value="">${escapeHtml(t('media.allKinds'))}</option>
          <option value="image" ${f.kind === 'image' ? 'selected' : ''}>image</option>
          <option value="video" ${f.kind === 'video' ? 'selected' : ''}>video</option>
          <option value="audio" ${f.kind === 'audio' ? 'selected' : ''}>audio</option>
        </select>
      </label>
      <label>${escapeHtml(t('media.provider'))}
        <input type="text" id="mf-provider" value="${escapeHtml(f.provider)}" placeholder="${escapeHtml(t('media.providerPh'))}" />
      </label>
      <label>${escapeHtml(t('media.from'))}
        <input type="date" id="mf-from" value="${escapeHtml(f.from)}" />
      </label>
      <label>${escapeHtml(t('media.to'))}
        <input type="date" id="mf-to" value="${escapeHtml(f.to)}" />
      </label>`,
  });

  const assetsTable = dataTablePanelHtml({
    headHtml: `
      <th>ID</th>
      <th>${escapeHtml(t('media.kind'))}</th>
      <th>MIME</th>
      <th>${escapeHtml(t('media.bytes'))}</th>
      <th>${escapeHtml(t('media.provider'))}</th>
      <th>${escapeHtml(t('media.prompt'))}</th>
      <th>${escapeHtml(t('media.created'))}</th>
      <th>${escapeHtml(t('common.actions'))}</th>`,
    bodyHtml,
    colSpan: 8,
    emptyText: t('media.empty'),
    pagerHtml: pagerHtml({
      total: assetsTotal,
      limit: f.limit,
      offset: f.offset,
      idPrefix: 'media',
    }),
  });

  const jobRows = jobs
    .map(
      (j) => `
    <tr>
      <td>
        <div class="cell-primary mono" title="${escapeHtml(j.id)}">${escapeHtml(String(j.id).slice(0, 8))}…</div>
      </td>
      <td>${escapeHtml(j.status || '—')}</td>
      <td class="muted" title="${escapeHtml(j.prompt || '')}">${escapeHtml((j.prompt || '—').slice(0, 64))}</td>
      <td class="mono">${escapeHtml(j.result_asset_id ? String(j.result_asset_id).slice(0, 8) + '…' : '—')}</td>
      <td>${fmtTime(j.created_at)}</td>
    </tr>`,
    )
    .join('');

  const jobsTable = dataTablePanelHtml({
    headHtml: `
      <th>ID</th>
      <th>${escapeHtml(t('media.status'))}</th>
      <th>${escapeHtml(t('media.prompt'))}</th>
      <th>Asset</th>
      <th>${escapeHtml(t('media.created'))}</th>`,
    bodyHtml: jobRows,
    colSpan: 5,
    emptyText: t('media.jobsEmpty'),
  });

  const studioPane = `
    <div class="panel media-studio-panel data-table-panel">
      <div class="panel-h">
        <div class="panel-h-text">
          <strong>${escapeHtml(t('media.studioTitle'))}</strong>
          <span class="muted panel-h-sub">${escapeHtml(t('media.studioHint'))}</span>
        </div>
      </div>
      <div class="panel-pad">
        <div class="seg-tabs media-mode-tabs" role="tablist" aria-label="${escapeHtml(t('media.studioTitle'))}">
          <button type="button" class="seg-tab is-active" data-mg-mode="generate" role="tab" aria-selected="true">${escapeHtml(t('media.modeGenerate'))}</button>
          <button type="button" class="seg-tab" data-mg-mode="edit" role="tab" aria-selected="false">${escapeHtml(t('media.modeEdit'))}</button>
          <button type="button" class="seg-tab" data-mg-mode="video" role="tab" aria-selected="false">${escapeHtml(t('media.modeVideo'))}</button>
        </div>
        <div class="form-grid">
          <label class="full">${escapeHtml(t('media.generatePrompt'))}
            <textarea id="mg-prompt" rows="3" placeholder="${escapeHtml(t('media.generatePromptPh'))}"></textarea>
          </label>
          <label>${escapeHtml(t('media.generateKey'))}
            <select id="mg-key">${genKeyOpts}</select>
          </label>
          <label>${escapeHtml(t('chats.model'))}
            <select id="mg-model">${genModelOpts}</select>
            <span class="hint">${escapeHtml(t('media.modelHint'))}</span>
          </label>
          <label id="mg-aspect-wrap">${escapeHtml(t('media.aspectRatio'))}
            <select id="mg-aspect">${aspectOpts}</select>
            <span class="hint">${escapeHtml(t('media.aspectHint'))}</span>
          </label>
          <label id="mg-n-wrap">${escapeHtml(t('media.generateN'))}
            <input type="number" id="mg-n" min="1" max="4" value="1" />
            <span class="hint">${escapeHtml(t('media.nHint'))}</span>
          </label>
          <label id="mg-duration-wrap" hidden>${escapeHtml(t('media.videoDuration'))}
            <select id="mg-duration">
              <option value="6" selected>6s</option>
              <option value="10">10s</option>
            </select>
            <span class="hint">${escapeHtml(t('media.videoDurationHint'))}</span>
          </label>
        </div>
        <div id="mg-source-section" class="media-source-section" hidden>
          <div class="media-source-head">
            <strong>${escapeHtml(t('media.sourceTitle'))}</strong>
            <span class="muted hint">${escapeHtml(t('media.sourceHint'))}</span>
          </div>
          <div class="media-dropzone" id="mg-dropzone" tabindex="0" role="button" aria-label="${escapeHtml(t('media.dropzoneAria'))}">
            <input type="file" id="mg-file" accept="image/*" hidden />
            <div class="media-dropzone-inner" id="mg-drop-inner">
              <div class="media-dropzone-icon" aria-hidden="true">📎</div>
              <strong id="mg-drop-title">${escapeHtml(t('media.dropTitle'))}</strong>
              <span class="muted" id="mg-drop-hint">${escapeHtml(t('media.dropHint'))}</span>
              <div class="media-dropzone-actions">
                <button type="button" class="btn secondary sm" id="mg-pick-file">${escapeHtml(t('media.pickFile'))}</button>
                <button type="button" class="btn secondary sm" id="mg-pick-lib">${escapeHtml(t('media.pickLibrary'))}</button>
                <button type="button" class="btn ghost sm" id="mg-clear-source" hidden>${escapeHtml(t('media.clearSource'))}</button>
              </div>
              <div class="media-source-chip" id="mg-source-chip" hidden></div>
            </div>
          </div>
        </div>
        <div class="media-gen-actions toolbar">
          <button type="button" class="btn" id="mg-submit">${escapeHtml(t('media.generateSubmit'))}</button>
          <span id="mg-status" class="muted" hidden></span>
        </div>
      </div>
    </div>`;

  // KPI strip (always visible) — same pattern as queue / usage / ddos
  const kpiGrid = `
    <div class="grid media-kpi-grid" id="media-kpi-grid">
      <div class="card">
        <div class="label">${escapeHtml(t('media.assets'))}</div>
        <div class="value value-sm">${assetsTotal}</div>
        <div class="muted card-sub">${escapeHtml(t('media.kpiAssetsSub'))}</div>
      </div>
      <div class="card">
        <div class="label">${escapeHtml(t('media.jobs'))}</div>
        <div class="value value-sm">${jobsTotal}</div>
        <div class="muted card-sub">${escapeHtml(t('media.kpiJobsSub'))}</div>
      </div>
      <div class="card">
        <div class="label">${escapeHtml(t('media.tabStudio'))}</div>
        <div class="value value-sm">${escapeHtml(t('media.modeGenerate'))} / ${escapeHtml(t('media.modeEdit'))} / ${escapeHtml(t('media.modeVideo'))}</div>
        <div class="muted card-sub">${escapeHtml(t('media.kpiStudioSub'))}</div>
      </div>
    </div>`;

  document.getElementById('app').innerHTML = shell(`
    <div class="topbar">
      <h2>${escapeHtml(t('media.title'))}</h2>
    </div>
    ${pageMetaHtml([t('media.intro')])}
    ${kpiGrid}
    <div class="usage-tabs-panel panel media-tabs-panel queue-tabs-panel">
      <div class="seg-tabs" role="tablist" aria-label="${escapeHtml(t('media.title'))}">
        <button type="button" role="tab" class="seg-tab ${tab === 'studio' ? 'is-active' : ''}" data-media-tab="studio" aria-selected="${tab === 'studio'}">
          ${escapeHtml(t('media.tabStudio'))}
        </button>
        <button type="button" role="tab" class="seg-tab ${tab === 'assets' ? 'is-active' : ''}" data-media-tab="assets" aria-selected="${tab === 'assets'}">
          ${escapeHtml(t('media.tabAssets'))}
          <span class="seg-tab-count">${assetsTotal}</span>
        </button>
        <button type="button" role="tab" class="seg-tab ${tab === 'jobs' ? 'is-active' : ''}" data-media-tab="jobs" aria-selected="${tab === 'jobs'}">
          ${escapeHtml(t('media.tabJobs'))}
          <span class="seg-tab-count">${jobsTotal}</span>
        </button>
      </div>
      <div class="usage-tab-body">
        <div class="usage-tab-pane media-tab-pane-studio" id="media-tab-studio" ${tab === 'studio' ? '' : 'hidden'}>
          ${studioPane}
        </div>
        <div class="usage-tab-pane media-tab-pane-assets" id="media-tab-assets" ${tab === 'assets' ? '' : 'hidden'}>
          ${filter}
          ${assetsTable}
        </div>
        <div class="usage-tab-pane media-tab-pane-jobs" id="media-tab-jobs" ${tab === 'jobs' ? '' : 'hidden'}>
          ${jobsTable}
        </div>
      </div>
    </div>
  `);
  bindShell();

  document.querySelectorAll('[data-media-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const raw = btn.getAttribute('data-media-tab') || 'studio';
      const next =
        raw === 'assets' || raw === 'jobs' || raw === 'studio' ? raw : 'studio';
      if (state.mediaFilter.tab === next) return;
      state.mediaFilter.tab = next;
      renderMedia().catch(onErr);
    });
  });

  // ——— Studio: mode, source (drop / library), submit ———
  async function fetchMediaBlob(id) {
    const r = await fetch(`/admin/api/media/assets/${id}/download`, {
      headers: { Authorization: `Bearer ${state.key}` },
    });
    if (!r.ok) throw new Error(await r.text());
    return r.blob();
  }

  {
    let mediaMode = 'generate';
    /** @type {{ kind: 'file'|'asset'|'document', file?: File, id?: string, name?: string, mime?: string } | null} */
    let mediaSource = null;

    const paintSourceChip = () => {
      const chip = document.getElementById('mg-source-chip');
      const clearBtn = document.getElementById('mg-clear-source');
      if (!chip) return;
      if (!mediaSource) {
        chip.hidden = true;
        chip.innerHTML = '';
        if (clearBtn) clearBtn.hidden = true;
        return;
      }
      const kindLabel =
        mediaSource.kind === 'file'
          ? t('media.sourceKindUpload')
          : mediaSource.kind === 'asset'
            ? t('media.sourceKindAsset')
            : t('media.sourceKindDocument');
      chip.hidden = false;
      chip.innerHTML = `<span class="chip">${escapeHtml(kindLabel)}</span> <span class="mono">${escapeHtml(mediaSource.name || mediaSource.id || '')}</span>`;
      if (clearBtn) clearBtn.hidden = false;
    };

    const setMediaSource = (src) => {
      mediaSource = src;
      const input = document.getElementById('mg-file');
      if (input && src?.kind !== 'file') input.value = '';
      paintSourceChip();
    };

    const setMediaMode = (mode) => {
      mediaMode = mode === 'edit' || mode === 'video' ? mode : 'generate';
      document.querySelectorAll('[data-mg-mode]').forEach((b) => {
        const on = b.getAttribute('data-mg-mode') === mediaMode;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      const srcSec = document.getElementById('mg-source-section');
      const nWrap = document.getElementById('mg-n-wrap');
      const durWrap = document.getElementById('mg-duration-wrap');
      const submit = document.getElementById('mg-submit');
      if (srcSec) srcSec.hidden = mediaMode === 'generate';
      if (nWrap) nWrap.hidden = mediaMode === 'video';
      if (durWrap) durWrap.hidden = mediaMode !== 'video';
      if (submit) {
        submit.textContent =
          mediaMode === 'edit'
            ? t('media.editSubmit')
            : mediaMode === 'video'
              ? t('media.videoSubmit')
              : t('media.generateSubmit');
      }
      const ta = document.getElementById('mg-prompt');
      if (ta) {
        ta.placeholder =
          mediaMode === 'edit'
            ? t('media.editPromptPh')
            : mediaMode === 'video'
              ? t('media.videoPromptPh')
              : t('media.generatePromptPh');
      }
      const dropTitle = document.getElementById('mg-drop-title');
      const dropHint = document.getElementById('mg-drop-hint');
      if (dropTitle) {
        dropTitle.textContent =
          mediaMode === 'video' ? t('media.dropTitleVideo') : t('media.dropTitle');
      }
      if (dropHint) {
        dropHint.textContent =
          mediaMode === 'video' ? t('media.dropHintVideo') : t('media.dropHint');
      }
    };

    document.querySelectorAll('[data-mg-mode]').forEach((btn) => {
      btn.addEventListener('click', () =>
        setMediaMode(btn.getAttribute('data-mg-mode') || 'generate'),
      );
    });
    setMediaMode('generate');

    const zone = document.getElementById('mg-dropzone');
    const fileInput = document.getElementById('mg-file');
    const acceptImageFile = (file) => {
      if (!file) return false;
      if (file.type && file.type.startsWith('image/')) return true;
      return /\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(file.name || '');
    };
    const takeFiles = (fileList) => {
      const file = [...(fileList || [])].find(acceptImageFile);
      if (!file) {
        showError(t('media.sourceNeedImage'));
        return;
      }
      setMediaSource({
        kind: 'file',
        file,
        name: file.name,
        mime: file.type || 'image/*',
      });
      showError('');
    };

    document.getElementById('mg-pick-file')?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      fileInput?.click();
    });
    fileInput?.addEventListener('change', () => {
      if (fileInput.files?.length) takeFiles(fileInput.files);
    });
    document.getElementById('mg-clear-source')?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      setMediaSource(null);
    });
    document.getElementById('mg-pick-lib')?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openMediaSourceLibraryPicker({
        imagesOnly: true,
        onPick: (item) => {
          setMediaSource({
            kind: item.kind,
            id: item.id,
            name: item.name,
            mime: item.mime,
          });
          showError('');
        },
      }).catch((err) => showError(err.message || t('media.libraryLoadFail')));
    });

    if (zone) {
      zone.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        fileInput?.click();
      });
      zone.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          fileInput?.click();
        }
      });
      ;['dragenter', 'dragover'].forEach((ev) => {
        zone.addEventListener(ev, (e) => {
          e.preventDefault();
          e.stopPropagation();
          zone.classList.add('is-dragover');
        });
      });
      ;['dragleave', 'drop'].forEach((ev) => {
        zone.addEventListener(ev, (e) => {
          e.preventDefault();
          e.stopPropagation();
          zone.classList.remove('is-dragover');
        });
      });
      zone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        if (dt?.files?.length) takeFiles(dt.files);
      });
    }

    // Page-level drag highlight (abort previous listeners on re-render)
    if (state._mediaDragAbort) {
      try {
        state._mediaDragAbort.abort();
      } catch {
        /* ignore */
      }
    }
    state._mediaDragAbort = new AbortController();
    const dragSig = { signal: state._mediaDragAbort.signal };
    const mediaPage = document.getElementById('app');
    let dragDepth = 0;
    window.addEventListener(
      'dragenter',
      (e) => {
        if (mediaMode === 'generate') return;
        if (![...(e.dataTransfer?.types || [])].includes('Files')) return;
        dragDepth += 1;
        mediaPage?.classList.add('is-media-file-drag');
      },
      dragSig,
    );
    window.addEventListener(
      'dragleave',
      () => {
        dragDepth = Math.max(0, dragDepth - 1);
        if (dragDepth === 0) mediaPage?.classList.remove('is-media-file-drag');
      },
      dragSig,
    );
    window.addEventListener(
      'drop',
      (e) => {
        dragDepth = 0;
        mediaPage?.classList.remove('is-media-file-drag');
        if (mediaMode === 'generate') return;
        if (e.dataTransfer?.files?.length) {
          e.preventDefault();
          takeFiles(e.dataTransfer.files);
        }
      },
      dragSig,
    );
    window.addEventListener(
      'dragover',
      (e) => {
        if (mediaMode === 'generate') return;
        if ([...(e.dataTransfer?.types || [])].includes('Files')) {
          e.preventDefault();
        }
      },
      dragSig,
    );

    document.getElementById('mg-submit')?.addEventListener('click', async () => {
      const prompt = document.getElementById('mg-prompt')?.value?.trim() || '';
      if (!prompt) {
        showError(t('media.generateNeedPrompt'));
        return;
      }
      const apiKeyId = document.getElementById('mg-key')?.value || '';
      const model = document.getElementById('mg-model')?.value || undefined;
      const aspect = document.getElementById('mg-aspect')?.value || '1:1';
      const n = Math.min(
        4,
        Math.max(1, Number(document.getElementById('mg-n')?.value) || 1),
      );
      const btn = document.getElementById('mg-submit');
      const st = document.getElementById('mg-status');
      const busyLabel =
        mediaMode === 'video'
          ? t('media.videoBusy')
          : mediaMode === 'edit'
            ? t('media.editBusy')
            : t('media.generateBusy');
      if (btn) {
        btn.disabled = true;
        btn.textContent = busyLabel;
      }
      if (st) {
        st.hidden = false;
        st.textContent = busyLabel;
      }
      showError('');
      try {
        if (mediaMode === 'edit') {
          if (!mediaSource) {
            throw new Error(t('media.editNeedImage'));
          }
          const fd = new FormData();
          fd.append('prompt', prompt);
          fd.append('aspect_ratio', aspect);
          fd.append('n', String(n));
          fd.append('response_format', 'url');
          if (model) fd.append('model', model);
          if (apiKeyId) fd.append('apiKeyId', apiKeyId);
          if (mediaSource.kind === 'file' && mediaSource.file) {
            fd.append('image', mediaSource.file);
          } else if (mediaSource.kind === 'asset' && mediaSource.id) {
            fd.append('sourceAssetId', mediaSource.id);
          } else if (mediaSource.kind === 'document' && mediaSource.id) {
            fd.append('sourceDocumentId', mediaSource.id);
          }
          await parseApiResponse(
            await fetch('/admin/api/media/edit', {
              method: 'POST',
              headers: { Authorization: `Bearer ${state.key}` },
              body: fd,
            }),
          );
          if (st) st.textContent = t('media.editOk');
          state.mediaFilter.tab = 'assets';
          state.mediaFilter.offset = 0;
          await renderMedia();
          return;
        }

        if (mediaMode === 'video') {
          const fd = new FormData();
          fd.append('prompt', prompt);
          fd.append('aspect_ratio', aspect);
          fd.append(
            'seconds',
            String(document.getElementById('mg-duration')?.value || 6),
          );
          if (model) fd.append('model', model);
          if (apiKeyId) fd.append('apiKeyId', apiKeyId);
          if (mediaSource?.kind === 'file' && mediaSource.file) {
            fd.append('image', mediaSource.file);
          } else if (mediaSource?.kind === 'asset' && mediaSource.id) {
            fd.append('source_asset_id', mediaSource.id);
          } else if (mediaSource?.kind === 'document' && mediaSource.id) {
            fd.append('source_document_id', mediaSource.id);
          }
          await parseApiResponse(
            await fetch('/admin/api/media/videos', {
              method: 'POST',
              headers: { Authorization: `Bearer ${state.key}` },
              body: fd,
            }),
          );
          if (st) st.textContent = t('media.videoOk');
          state.mediaFilter.tab = 'jobs';
          await renderMedia();
          return;
        }

        const body = {
          prompt,
          aspect_ratio: aspect,
          n,
          response_format: 'url',
        };
        if (model) body.model = model;
        if (apiKeyId) body.apiKeyId = apiKeyId;
        const res = await api('/media/generate', {
          method: 'POST',
          body: JSON.stringify(body),
        });
        const ids = res?.data?.grok?.asset_ids || [];
        if (st) st.textContent = t('media.generateOk');
        state.mediaFilter.tab = 'assets';
        state.mediaFilter.offset = 0;
        await renderMedia();
        if (ids[0]) {
          try {
            const blob = await fetchMediaBlob(ids[0]);
            openMediaPreviewLightbox(
              {
                id: ids[0],
                mime: blob.type || 'image/png',
                filename: `generated-${String(ids[0]).slice(0, 8)}`,
                kind: 'image',
                bytes: blob.size,
                prompt,
              },
              blob,
            );
          } catch {
            /* ignore */
          }
        }
      } catch (e) {
        onErr(e);
        if (st) st.textContent = e.message || t('media.generateFail');
        if (btn) {
          btn.disabled = false;
          setMediaMode(mediaMode);
        }
      }
    });
  }

  if (tab === 'assets') {
    bindPager('media', state.mediaFilter, () => renderMedia().catch(onErr));

    document
      .querySelector('#media-tab-assets [data-filter-apply]')
      ?.addEventListener('click', () => {
        state.mediaFilter.q =
          document.getElementById('mf-q')?.value.trim() || '';
        state.mediaFilter.kind =
          document.getElementById('mf-kind')?.value || '';
        state.mediaFilter.provider =
          document.getElementById('mf-provider')?.value.trim() || '';
        state.mediaFilter.from =
          document.getElementById('mf-from')?.value || '';
        state.mediaFilter.to = document.getElementById('mf-to')?.value || '';
        state.mediaFilter.offset = 0;
        renderMedia().catch(onErr);
      });
    document
      .querySelector('#media-tab-assets [data-filter-reset]')
      ?.addEventListener('click', () => {
        const keepTab = state.mediaFilter.tab;
        state.mediaFilter = {
          tab: keepTab,
          q: '',
          kind: '',
          provider: '',
          from: '',
          to: '',
          limit: 20,
          offset: 0,
        };
        renderMedia().catch(onErr);
      });

    document.querySelectorAll('[data-media-preview]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        try {
          const id = btn.getAttribute('data-media-preview');
          if (!id) return;
          const mime = btn.getAttribute('data-media-mime') || '';
          const filename = btn.getAttribute('data-media-name') || '';
          const kind = btn.getAttribute('data-media-kind') || '';
          const bytesRaw = btn.getAttribute('data-media-bytes') || '';
          const prompt = btn.getAttribute('data-media-prompt') || '';
          const blob = await fetchMediaBlob(id);
          // Prefer server mime; fall back to blob.type
          openMediaPreviewLightbox(
            {
              id,
              mime: mime || blob.type || '',
              filename,
              kind,
              bytes: bytesRaw ? Number(bytesRaw) : blob.size,
              prompt,
            },
            blob,
          );
        } catch (e) {
          onErr(e);
        }
      });
    });

    document.querySelectorAll('[data-media-dl]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        try {
          const id = btn.getAttribute('data-media-dl');
          const name = btn.getAttribute('data-media-name') || '';
          const blob = await fetchMediaBlob(id);
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = name || `media-${String(id).slice(0, 8)}`;
          a.click();
          setTimeout(() => URL.revokeObjectURL(a.href), 30_000);
        } catch (e) {
          onErr(e);
        }
      });
    });

    document.querySelectorAll('[data-media-del]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-media-del');
        if (
          !(await uiConfirm({
            message: t('media.deleteConfirm'),
            variant: 'danger',
            confirmText: t('media.delete'),
          }))
        )
          return;
        try {
          await api(`/media/assets/${id}`, { method: 'DELETE' });
          await renderMedia();
        } catch (e) {
          onErr(e);
        }
      });
    });
  }
}

/**
 * Pick a source image from Documents library or Media assets (admin-wide).
 * @param {{ imagesOnly?: boolean, onPick: (item: { kind: 'asset'|'document', id: string, name: string, mime: string }) => void }} opts
 */
async function openMediaSourceLibraryPicker(opts) {
  const imagesOnly = opts.imagesOnly !== false;
  let libTab = 'documents'; // 'documents' | 'assets'
  let loadSeq = 0;
  /** @type {{ kind: 'asset'|'document', id: string, name: string, mime: string } | null} */
  let selected = null;

  openAppModal({
    title: t('media.libraryTitle'),
    subtitle: escapeHtml(t('media.librarySubtitle')),
    size: 'md',
    bodyHtml: `
      <div class="chat-lib media-lib">
        <div class="seg-tabs" role="tablist" style="margin-bottom:0.75rem">
          <button type="button" class="seg-tab is-active" data-mlib-tab="documents">${escapeHtml(t('media.libraryTabDocs'))}</button>
          <button type="button" class="seg-tab" data-mlib-tab="assets">${escapeHtml(t('media.libraryTabAssets'))}</button>
        </div>
        <div class="chat-lib-toolbar">
          <input type="search" id="mlib-q" class="chat-lib-search" placeholder="${escapeHtml(t('media.librarySearch'))}" autocomplete="off" />
          <span class="muted chat-lib-count" id="mlib-count"></span>
        </div>
        <div class="muted chat-lib-formats">${escapeHtml(t('media.libraryFormats'))}</div>
        <div id="mlib-list" class="chat-lib-list" role="listbox">
          <div class="muted chat-lib-status">${escapeHtml(t('common.loading') || '…')}</div>
        </div>
      </div>`,
    footerHtml: `
      <button type="button" class="btn secondary sm" id="mlib-cancel">${escapeHtml(t('common.cancel'))}</button>
      <button type="button" class="btn sm" id="mlib-add" disabled>${escapeHtml(t('media.librarySelect'))}</button>`,
  });

  const listEl = document.getElementById('mlib-list');
  const qEl = document.getElementById('mlib-q');
  const addBtn = document.getElementById('mlib-add');
  document.getElementById('mlib-cancel')?.addEventListener('click', () => closeAppModal());

  const paintSelection = () => {
    if (addBtn) {
      addBtn.disabled = !selected;
      addBtn.textContent = selected
        ? `${t('media.librarySelect')} · ${selected.name.slice(0, 24)}`
        : t('media.librarySelect');
    }
  };

  const isImageMime = (m) => String(m || '').startsWith('image/');
  const isImageName = (n) =>
    /\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(String(n || ''));

  const renderRows = (items) => {
    if (!listEl) return;
    if (!items.length) {
      listEl.innerHTML = `<div class="data-empty chat-lib-empty"><strong>${escapeHtml(t('media.libraryEmpty'))}</strong></div>`;
      return;
    }
    listEl.innerHTML = items
      .map((it) => {
        const checked = selected?.id === it.id && selected?.kind === it.kind;
        return `
          <label class="chat-lib-row ${checked ? 'is-selected' : ''}" data-kind="${escapeHtml(it.kind)}" data-id="${escapeHtml(it.id)}">
            <input type="radio" name="mlib-pick" ${checked ? 'checked' : ''} />
            <span class="chat-lib-meta">
              <span class="chat-lib-name" title="${escapeHtml(it.name)}">${escapeHtml(it.name)}</span>
              <span class="muted">${escapeHtml(it.kindLabel)} · ${escapeHtml(it.mime || '—')}${it.size != null ? ` · ${fmtBytes(it.size)}` : ''}</span>
            </span>
          </label>`;
      })
      .join('');

    listEl.querySelectorAll('.chat-lib-row').forEach((row) => {
      row.addEventListener('click', () => {
        const kind = row.getAttribute('data-kind');
        const id = row.getAttribute('data-id');
        const it = items.find((x) => x.id === id && x.kind === kind);
        if (!it) return;
        selected = {
          kind: it.kind,
          id: it.id,
          name: it.name,
          mime: it.mime,
        };
        listEl.querySelectorAll('.chat-lib-row').forEach((r) => {
          r.classList.toggle(
            'is-selected',
            r.getAttribute('data-id') === id &&
              r.getAttribute('data-kind') === kind,
          );
          const inp = r.querySelector('input');
          if (inp) {
            inp.checked =
              r.getAttribute('data-id') === id &&
              r.getAttribute('data-kind') === kind;
          }
        });
        paintSelection();
      });
    });
  };

  const load = async () => {
    const seq = ++loadSeq;
    if (listEl) {
      listEl.innerHTML = `<div class="muted chat-lib-status">${escapeHtml(t('common.loading') || '…')}</div>`;
    }
    try {
      const q = (qEl?.value || '').trim();
      let items = [];
      if (libTab === 'assets') {
        const params = new URLSearchParams({ limit: '80', offset: '0' });
        if (q) params.set('q', q);
        if (imagesOnly) params.set('kind', 'image');
        const res = await api(`/media/assets?${params}`);
        items = (res.data || [])
          .filter(
            (a) =>
              !imagesOnly ||
              isImageMime(a.mime) ||
              isImageName(a.filename),
          )
          .map((a) => ({
            kind: 'asset',
            kindLabel: t('media.sourceKindAsset'),
            id: a.id,
            name: a.filename || a.prompt || a.id,
            mime: a.mime || '',
            size: a.bytes,
          }));
      } else {
        const params = new URLSearchParams({ limit: '80', offset: '0' });
        if (q) params.set('q', q);
        const res = await api(`/documents?${params}`);
        items = (res.data || [])
          .filter(
            (d) =>
              !imagesOnly ||
              isImageMime(d.mimeType) ||
              isImageName(d.originalName),
          )
          .map((d) => ({
            kind: 'document',
            kindLabel: t('media.sourceKindDocument'),
            id: d.id,
            name: d.originalName || d.id,
            mime: d.mimeType || '',
            size: d.sizeBytes,
          }));
      }
      if (seq !== loadSeq) return;
      renderRows(items);
    } catch (e) {
      if (seq !== loadSeq) return;
      if (listEl) {
        listEl.innerHTML = `<div class="error-box">${escapeHtml(e.message || t('media.libraryLoadFail'))}</div>`;
      }
    }
  };

  document.querySelectorAll('[data-mlib-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      libTab =
        btn.getAttribute('data-mlib-tab') === 'assets' ? 'assets' : 'documents';
      document.querySelectorAll('[data-mlib-tab]').forEach((b) => {
        b.classList.toggle(
          'is-active',
          b.getAttribute('data-mlib-tab') === libTab,
        );
      });
      selected = null;
      paintSelection();
      load();
    });
  });

  let searchTimer = null;
  qEl?.addEventListener('input', () => {
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => load(), 280);
  });

  addBtn?.addEventListener('click', () => {
    if (!selected) return;
    opts.onPick(selected);
    closeAppModal();
  });

  paintSelection();
  await load();
}

async function renderUsage() {
  const { data } = await api('/usage');
  const tot = data.totals || {};
  const limits = data.limits || {};
  const uf = state.usageFilter;
  const ps = uf.pageSize || 10;

  let models = data.byModel || [];
  if (uf.modelQ.trim()) {
    const qq = uf.modelQ.trim().toLowerCase();
    models = models.filter((m) => String(m.model || '').toLowerCase().includes(qq));
  }
  const modelTotal = models.length;
  const modelSlice = models.slice(uf.modelPage * ps, uf.modelPage * ps + ps);
  const modelRows = modelSlice
    .map(
      (m) =>
        `<tr><td class="cell-primary">${escapeHtml(m.model)}</td><td>${m.requests}</td></tr>`,
    )
    .join('');

  let keys = data.perKey || [];
  if (uf.keyQ.trim()) {
    const qq = uf.keyQ.trim().toLowerCase();
    keys = keys.filter(
      (k) =>
        String(k.name || '').toLowerCase().includes(qq) ||
        String(k.keyPrefix || '').toLowerCase().includes(qq),
    );
  }
  if (uf.keyActive === 'true') keys = keys.filter((k) => k.isActive);
  if (uf.keyActive === 'false') keys = keys.filter((k) => !k.isActive);
  const keyTotal = keys.length;
  const keySlice = keys.slice(uf.keyPage * ps, uf.keyPage * ps + ps);
  const keyRows = keySlice
    .map((k) => {
      const util = Math.round((k.utilization || 0) * 100);
      return `<tr>
        <td><div class="cell-primary">${escapeHtml(k.name)}</div><div class="cell-sub">${escapeHtml(k.keyPrefix)}</div></td>
        <td>${k.requests}</td>
        <td>${fmtPerMin(k.rateLimit)}</td>
        <td>
          <div>${tf('common.percent', { n: util })}</div>
          <div class="usage-bar ${util > 80 ? 'warn' : ''}"><span style="width:${util}%"></span></div>
        </td>
        <td>${k.isActive ? `<span class="badge success">${escapeHtml(t('common.active'))}</span>` : `<span class="badge error">${escapeHtml(t('common.revoked'))}</span>`}</td>
      </tr>`;
    })
    .join('');

  const modelPager = pagerHtml({
    total: modelTotal,
    limit: ps,
    offset: uf.modelPage * ps,
    idPrefix: 'umodel',
  });
  const keyPager = pagerHtml({
    total: keyTotal,
    limit: ps,
    offset: uf.keyPage * ps,
    idPrefix: 'ukey',
  });

  const tab = uf.tab === 'key' ? 'key' : 'model';
  const modelFilter = filterPanelHtml({
    title: t('usage.byModel'),
    hint: t('common.filterHint'),
    searchHtml: `<div class="data-filter-search"><label>${escapeHtml(t('common.search'))}<input type="search" id="uf-model" value="${escapeHtml(uf.modelQ)}" placeholder="${escapeHtml(t('chats.model'))}" /></label></div>`,
    gridHtml: '',
  });
  const modelTable = dataTablePanelHtml({
    headHtml: `<th>${escapeHtml(t('chats.model'))}</th><th>${escapeHtml(t('usage.requests'))}</th>`,
    bodyHtml: modelRows,
    colSpan: 2,
    emptyText: t('common.empty'),
    pagerHtml: modelPager,
  });
  const keyFilter = filterPanelHtml({
    title: t('usage.byKey'),
    hint: t('common.filterHint'),
    searchHtml: `<div class="data-filter-search"><label>${escapeHtml(t('common.search'))}<input type="search" id="uf-key" value="${escapeHtml(uf.keyQ)}" placeholder="${escapeHtml(t('keys.name'))}" /></label></div>`,
    gridHtml: `<label>${escapeHtml(t('keys.status'))}
      <select id="uf-active">
        <option value="">${escapeHtml(t('common.all'))}</option>
        <option value="true" ${uf.keyActive === 'true' ? 'selected' : ''}>${escapeHtml(t('common.active'))}</option>
        <option value="false" ${uf.keyActive === 'false' ? 'selected' : ''}>${escapeHtml(t('common.revoked'))}</option>
      </select>
    </label>`,
  });
  const keyTable = dataTablePanelHtml({
    headHtml: `
      <th>${escapeHtml(t('keys.name'))}</th>
      <th>${escapeHtml(t('usage.requests'))}</th>
      <th>${escapeHtml(t('usage.rateLimit'))}</th>
      <th>${escapeHtml(t('usage.util'))}</th>
      <th>${escapeHtml(t('keys.status'))}</th>`,
    bodyHtml: keyRows,
    colSpan: 5,
    emptyText: t('common.empty'),
    pagerHtml: keyPager,
  });

  document.getElementById('app').innerHTML = shell(`
    <div class="topbar">
      <h2>${escapeHtml(t('usage.title'))}</h2>
      <button class="btn secondary sm" id="btn-usage-refresh">${escapeHtml(t('usage.refresh'))}</button>
    </div>
    ${pageMetaHtml([
      `${t('usage.window')}: ${fmtTime(data.from)} → ${fmtTime(data.to)} (${tf('common.minutes', { n: data.windowMinutes })})`,
    ])}
    <div class="grid">
      <div class="card"><div class="label">${escapeHtml(t('usage.requests'))}</div><div class="value">${tot.requests ?? 0}</div></div>
      <div class="card"><div class="label">${escapeHtml(t('usage.success'))}</div><div class="value">${tot.success ?? 0}</div></div>
      <div class="card"><div class="label">${escapeHtml(t('usage.errors'))}</div><div class="value">${tot.errors ?? 0}</div></div>
      <div class="card"><div class="label">${escapeHtml(t('usage.errorRate'))}</div><div class="value">${Math.round((tot.errorRate || 0) * 100)}%</div></div>
    </div>
    <div class="panel data-table-panel" style="margin-bottom:14px">
      <div class="panel-h"><strong>${escapeHtml(t('usage.limits'))}</strong></div>
      <div class="panel-pad">
        <div class="grid">
          <div class="card"><div class="label">${escapeHtml(t('usage.global'))}</div><div class="value value-sm">${limits.globalMax} / ${limits.globalWindowMs}ms</div></div>
          <div class="card"><div class="label">${escapeHtml(t('usage.ipMax'))}</div><div class="value value-sm">${limits.ipMax}</div></div>
          <div class="card"><div class="label">${escapeHtml(t('usage.burst'))}</div><div class="value value-sm">${limits.chatBurstMax}</div></div>
          <div class="card"><div class="label">${escapeHtml(t('usage.block'))}</div><div class="value value-sm">${limits.blockFailedAuthThreshold}</div></div>
          <div class="card"><div class="label">${escapeHtml(t('usage.concurrent'))}</div><div class="value value-sm">${limits.grokMaxConcurrent}</div></div>
        </div>
      </div>
    </div>

    <div class="usage-tabs-panel panel">
      <div class="seg-tabs" role="tablist" aria-label="${escapeHtml(t('usage.title'))}">
        <button type="button" role="tab" class="seg-tab ${tab === 'model' ? 'is-active' : ''}" data-usage-tab="model" aria-selected="${tab === 'model'}">
          ${escapeHtml(t('usage.byModel'))}
          <span class="seg-tab-count">${modelTotal}</span>
        </button>
        <button type="button" role="tab" class="seg-tab ${tab === 'key' ? 'is-active' : ''}" data-usage-tab="key" aria-selected="${tab === 'key'}">
          ${escapeHtml(t('usage.byKey'))}
          <span class="seg-tab-count">${keyTotal}</span>
        </button>
      </div>
      <div class="usage-tab-body">
        <div class="usage-tab-pane" id="usage-tab-model" ${tab === 'model' ? '' : 'hidden'}>
          ${modelFilter}
          ${modelTable}
        </div>
        <div class="usage-tab-pane" id="usage-tab-key" ${tab === 'key' ? '' : 'hidden'}>
          ${keyFilter}
          ${keyTable}
        </div>
      </div>
    </div>
  `);
  bindShell();
  document.getElementById('btn-usage-refresh').onclick = () =>
    renderUsage().catch(onErr);

  document.querySelectorAll('[data-usage-tab]').forEach((btn) => {
    btn.onclick = () => {
      const next = btn.dataset.usageTab === 'key' ? 'key' : 'model';
      if (state.usageFilter.tab === next) return;
      state.usageFilter.tab = next;
      renderUsage().catch(onErr);
    };
  });

  // Model pager (client-side pages)
  document.getElementById('umodel-prev')?.addEventListener('click', () => {
    state.usageFilter.modelPage = Math.max(0, uf.modelPage - 1);
    renderUsage().catch(onErr);
  });
  document.getElementById('umodel-next')?.addEventListener('click', () => {
    if ((uf.modelPage + 1) * ps < modelTotal) {
      state.usageFilter.modelPage += 1;
      renderUsage().catch(onErr);
    }
  });
  document.getElementById('umodel-limit')?.addEventListener('change', (e) => {
    state.usageFilter.pageSize = Number(e.target.value) || 10;
    state.usageFilter.modelPage = 0;
    renderUsage().catch(onErr);
  });
  document.getElementById('ukey-prev')?.addEventListener('click', () => {
    state.usageFilter.keyPage = Math.max(0, uf.keyPage - 1);
    renderUsage().catch(onErr);
  });
  document.getElementById('ukey-next')?.addEventListener('click', () => {
    if ((uf.keyPage + 1) * ps < keyTotal) {
      state.usageFilter.keyPage += 1;
      renderUsage().catch(onErr);
    }
  });
  document.getElementById('ukey-limit')?.addEventListener('change', (e) => {
    state.usageFilter.pageSize = Number(e.target.value) || 10;
    state.usageFilter.keyPage = 0;
    renderUsage().catch(onErr);
  });

  // Filters only affect the active tab's pane
  document.querySelectorAll('#usage-tab-model [data-filter-apply]').forEach((btn) => {
    btn.onclick = () => {
      state.usageFilter.modelQ = document.getElementById('uf-model')?.value?.trim() || '';
      state.usageFilter.modelPage = 0;
      renderUsage().catch(onErr);
    };
  });
  document.querySelectorAll('#usage-tab-model [data-filter-reset]').forEach((btn) => {
    btn.onclick = () => {
      state.usageFilter.modelQ = '';
      state.usageFilter.modelPage = 0;
      renderUsage().catch(onErr);
    };
  });
  document.querySelectorAll('#usage-tab-key [data-filter-apply]').forEach((btn) => {
    btn.onclick = () => {
      state.usageFilter.keyQ = document.getElementById('uf-key')?.value?.trim() || '';
      state.usageFilter.keyActive = document.getElementById('uf-active')?.value || '';
      state.usageFilter.keyPage = 0;
      renderUsage().catch(onErr);
    };
  });
  document.querySelectorAll('#usage-tab-key [data-filter-reset]').forEach((btn) => {
    btn.onclick = () => {
      state.usageFilter.keyQ = '';
      state.usageFilter.keyActive = '';
      state.usageFilter.keyPage = 0;
      renderUsage().catch(onErr);
    };
  });
}

function versionStatusMeta(v) {
  const status =
    v.versionStatus ||
    (v.updateAvailable ? 'update_available' : v.latest ? 'up_to_date' : 'unknown');
  if (status === 'update_available') {
    return {
      badge: `<span class="badge warn" title="${escapeHtml(t('system.statusHintUpdate'))}">${escapeHtml(t('system.badgeUpdate'))}</span>`,
      hint: t('system.statusHintUpdate'),
    };
  }
  if (status === 'ahead') {
    return {
      badge: `<span class="badge pending" title="${escapeHtml(t('system.statusHintAhead'))}">${escapeHtml(t('system.badgeAhead'))}</span>`,
      hint: t('system.statusHintAhead'),
    };
  }
  if (status === 'up_to_date') {
    return {
      badge: `<span class="badge success" title="${escapeHtml(t('system.statusHintOk'))}">${escapeHtml(t('system.badgeOk'))}</span>`,
      hint: t('system.statusHintOk'),
    };
  }
  return {
    badge: `<span class="badge pending" title="${escapeHtml(t('system.statusHintUnknown'))}">${escapeHtml(t('system.badgeUnknown'))}</span>`,
    hint: t('system.statusHintUnknown'),
  };
}

function channelLabel(channel) {
  if (channel === 'git') return t('system.channelGit');
  if (channel === 'npm-global') return t('system.channelNpmGlobal');
  if (channel === 'npm-local') return t('system.channelNpmLocal');
  return t('system.channelUnknown');
}

function softwareLevelLabel(level) {
  if (level === 'required') return t('system.levelRequired');
  if (level === 'recommended') return t('system.levelRecommended');
  if (level === 'optional') return t('system.levelOptional');
  if (level === 'bundled') return t('system.levelBundled');
  return level || '—';
}

function softwareStatusBadge(c) {
  if (!c.installed) {
    return c.level === 'required' || c.level === 'bundled'
      ? `<span class="badge error">${escapeHtml(t('system.softMissing'))}</span>`
      : `<span class="badge pending">${escapeHtml(t('system.softMissing'))}</span>`;
  }
  if (!c.ok) {
    return `<span class="badge warn">${escapeHtml(t('system.softWarn'))}</span>`;
  }
  return `<span class="badge success">${escapeHtml(t('system.softOk'))}</span>`;
}

function runtimeBadge(state) {
  if (state === 'up') return `<span class="badge success">${escapeHtml(t('system.up'))}</span>`;
  return `<span class="badge error">${escapeHtml(t('system.down'))}</span>`;
}

async function renderSystem() {
  const { data } = await api('/system');
  if (state.page !== 'system') return;

  const v = data.version || {};
  const vs = versionStatusMeta(v);
  const soft = data.software || { checks: [], allRequiredOk: true };
  const checks = soft.checks || [];
  const tab =
    state.systemTab === 'package' || state.systemTab === 'env'
      ? state.systemTab
      : 'software';
  state.systemTab = tab;

  const softBody = checks
    .map(
      (c) => `
      <tr>
        <td><div class="cell-primary">${escapeHtml(c.name || c.id)}</div>${c.requiredVersion ? `<div class="cell-sub">${escapeHtml(c.requiredVersion)}</div>` : ''}</td>
        <td>${escapeHtml(softwareLevelLabel(c.level))}</td>
        <td>${escapeHtml(c.installed ? t('system.yes') : t('system.no'))}${c.path ? `<div class="cell-sub soft-path">${escapeHtml(c.path)}</div>` : ''}</td>
        <td><code class="cell-code">${escapeHtml(c.version || '—')}</code></td>
        <td>${softwareStatusBadge(c)}</td>
        <td class="muted">${escapeHtml(c.detail || '')}</td>
      </tr>`,
    )
    .join('');

  const softSummary = soft.allRequiredOk
    ? `<span class="badge success">${escapeHtml(t('system.allRequiredOk'))}</span>`
    : `<span class="badge error">${escapeHtml(t('system.requiredMissing'))}</span>`;

  const encReady = data.encryption && data.encryption.ready;
  const channelText = channelLabel(v.channel);
  const installText = v.installSource
    ? `${channelText} · ${v.installSource}`
    : channelText;

  const softTable = dataTablePanelHtml({
    headHtml: `
      <th>${escapeHtml(t('system.softName'))}</th>
      <th>${escapeHtml(t('system.softLevel'))}</th>
      <th>${escapeHtml(t('system.softInstalled'))}</th>
      <th>${escapeHtml(t('system.softVersion'))}</th>
      <th>${escapeHtml(t('system.softStatus'))}</th>
      <th>${escapeHtml(t('system.softDetail'))}</th>`,
    bodyHtml: softBody,
    colSpan: 6,
    emptyText: t('common.empty'),
  });

  // KPI strip — same pattern as queue / media
  const kpiGrid = `
    <div class="grid system-kpi-grid" id="system-kpi-grid">
      <div class="card">
        <div class="label">${escapeHtml(t('system.database'))}</div>
        <div class="value value-sm">${runtimeBadge(data.database)}</div>
        <div class="muted card-sub">${escapeHtml(t('system.runtime'))}</div>
      </div>
      <div class="card">
        <div class="label">${escapeHtml(t('system.grokCli'))}</div>
        <div class="value value-sm">${runtimeBadge(data.grokCli)}</div>
        <div class="muted card-sub">${escapeHtml(t('system.runtime'))}</div>
      </div>
      <div class="card">
        <div class="label">${escapeHtml(t('system.concurrency'))}</div>
        <div class="value value-sm">${data.concurrency?.active ?? 0}<span class="dash-kpi-den">/${data.concurrency?.max ?? '—'}</span></div>
        <div class="muted card-sub">${escapeHtml(t('system.concurrency'))}</div>
      </div>
      <div class="card">
        <div class="label">${escapeHtml(t('system.encryption'))}</div>
        <div class="value value-sm">${
          encReady
            ? `<span class="badge success">${escapeHtml(t('system.ready'))}</span>`
            : `<span class="badge error">${escapeHtml(t('system.notReady'))}</span>`
        }</div>
        <div class="muted card-sub">${escapeHtml(t('system.runtime'))}</div>
      </div>
    </div>`;

  const softwarePane = `
    <div class="system-tab-toolbar">
      <span class="muted">${escapeHtml(t('system.softwareHint'))}</span>
      ${softSummary}
    </div>
    ${softTable}`;

  const packagePane = `
    <div class="panel data-table-panel system-package-panel">
      <div class="panel-h">
        <div class="panel-h-text">
          <strong>${escapeHtml(t('system.selfUpdate'))}</strong>
          <span class="muted panel-h-sub">${escapeHtml(vs.hint)}</span>
        </div>
        ${vs.badge}
      </div>
      <div class="panel-pad">
        <div class="grid">
          <div class="card"><div class="label">${escapeHtml(t('system.current'))}</div><div class="value value-sm">${escapeHtml(v.current || '-')} ${vs.badge}</div></div>
          <div class="card"><div class="label">${escapeHtml(t('system.npm'))}</div><div class="value value-sm">${escapeHtml(v.latestNpm || 'n/a')}</div></div>
          <div class="card"><div class="label">${escapeHtml(t('system.github'))}</div><div class="value value-sm">${escapeHtml(v.latestGithub || 'n/a')}</div></div>
          <div class="card"><div class="label">${escapeHtml(t('system.install'))}</div><div class="value value-sm">${escapeHtml(installText)}</div></div>
        </div>
        <pre id="update-log" class="pre" style="display:none;margin-top:12px"></pre>
      </div>
    </div>`;

  const envPane = `
    <div class="panel data-table-panel system-env-panel">
      <div class="panel-h">
        <div class="panel-h-text">
          <strong>${escapeHtml(t('system.envTitle'))}</strong>
          <span class="muted panel-h-sub">${escapeHtml(t('system.envHint'))}</span>
        </div>
      </div>
      <div class="panel-pad">
        <pre class="pre system-env-pre">${escapeHtml(JSON.stringify({ env: data.env, version: v }, null, 2))}</pre>
      </div>
    </div>`;

  document.getElementById('app').innerHTML = shell(`
    <div class="topbar">
      <h2>${escapeHtml(t('system.title'))}</h2>
      <div class="toolbar">
        <button class="btn secondary sm" id="btn-check-update" title="${escapeHtml(t('system.selfHint'))}">${escapeHtml(t('system.checkUpdate'))}</button>
        <button class="btn sm" id="btn-one-click-update" title="${escapeHtml(t('system.confirmUpdate'))}">${escapeHtml(t('system.oneClick'))}</button>
      </div>
    </div>
    ${pageMetaHtml([t('system.selfHint')])}
    ${kpiGrid}

    <div class="usage-tabs-panel panel system-tabs-panel">
      <div class="seg-tabs" role="tablist" aria-label="${escapeHtml(t('system.title'))}">
        <button type="button" role="tab" class="seg-tab ${tab === 'software' ? 'is-active' : ''}" data-system-tab="software" aria-selected="${tab === 'software'}">
          ${escapeHtml(t('system.tabSoftware'))}
          <span class="seg-tab-count">${checks.length}</span>
        </button>
        <button type="button" role="tab" class="seg-tab ${tab === 'package' ? 'is-active' : ''}" data-system-tab="package" aria-selected="${tab === 'package'}">
          ${escapeHtml(t('system.tabPackage'))}
        </button>
        <button type="button" role="tab" class="seg-tab ${tab === 'env' ? 'is-active' : ''}" data-system-tab="env" aria-selected="${tab === 'env'}">
          ${escapeHtml(t('system.tabEnv'))}
        </button>
      </div>
      <div class="usage-tab-body">
        <div class="usage-tab-pane system-tab-pane-software" id="system-tab-software" ${tab === 'software' ? '' : 'hidden'}>
          ${softwarePane}
        </div>
        <div class="usage-tab-pane system-tab-pane-package" id="system-tab-package" ${tab === 'package' ? '' : 'hidden'}>
          ${packagePane}
        </div>
        <div class="usage-tab-pane system-tab-pane-env" id="system-tab-env" ${tab === 'env' ? '' : 'hidden'}>
          ${envPane}
        </div>
      </div>
    </div>
  `);
  bindShell();

  document.querySelectorAll('[data-system-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const raw = btn.getAttribute('data-system-tab') || 'software';
      const next =
        raw === 'package' || raw === 'env' || raw === 'software' ? raw : 'software';
      if (state.systemTab === next) return;
      state.systemTab = next;
      renderSystem().catch(onErr);
    });
  });

  document.getElementById('btn-check-update').onclick = async () => {
    try {
      const res = await api('/system/update-check');
      const d = res.data || {};
      const meta = versionStatusMeta(d);
      await uiAlert({
        title: t('system.checkResult'),
        message:
          `${t('system.current')}: ${d.current || '?'}\n` +
          `${t('system.npm')}: ${d.latestNpm || 'n/a'}\n` +
          `${t('system.github')}: ${d.latestGithub || 'n/a'}\n` +
          `${meta.hint}`,
      });
      state.systemTab = 'package';
      renderSystem().catch(onErr);
    } catch (e) {
      onErr(e);
    }
  };
  document.getElementById('btn-one-click-update').onclick = async () => {
    if (
      !(await uiConfirm({
        message: t('system.confirmUpdate'),
        variant: 'danger',
        confirmText: t('system.oneClick'),
      }))
    )
      return;
    // Ensure package tab is visible so update-log is on screen
    if (state.systemTab !== 'package') {
      state.systemTab = 'package';
      await renderSystem();
    }
    const logEl = document.getElementById('update-log');
    try {
      const btn = document.getElementById('btn-one-click-update');
      if (btn) btn.disabled = true;
      const res = await api('/system/update', {
        method: 'POST',
        body: JSON.stringify({ restart: true }),
      });
      if (logEl) {
        logEl.style.display = 'block';
        logEl.textContent =
          (res.data && (res.data.message || JSON.stringify(res.data, null, 2))) ||
          t('system.scheduled');
      }
      await uiAlert((res.data && res.data.message) || t('system.scheduled'));
    } catch (e) {
      onErr(e);
    }
  };
}


function banSourceLabel(source) {
  if (!source) return '—';
  const key = `ddos.sources.${source}`;
  const label = t(key);
  return label === key ? source : label;
}

function msToSec(ms) {
  return Math.max(1, Math.round(Number(ms || 0) / 1000));
}
function msToMin(ms) {
  return Math.max(1, Math.round(Number(ms || 0) / 60_000));
}
function secToMs(sec) {
  return Math.max(1000, Math.round(Number(sec || 0) * 1000));
}
function minToMs(min) {
  return Math.max(1000, Math.round(Number(min || 0) * 60_000));
}

function numVal(id, fallback) {
  const n = Number(document.getElementById(id)?.value);
  return Number.isFinite(n) ? n : fallback;
}
function boolVal(id) {
  return document.getElementById(id)?.checked === true;
}

function readDdosPolicyForm() {
  const wl = (document.getElementById('dp-whitelist')?.value || '')
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const trustedProxies = (document.getElementById('dp-trustedProxies')?.value || '')
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  // Master auto-ban lives in topbar toggle (hidden input kept for applyDdosPolicyToForm compat)
  const masterOn = document.getElementById('ddos-master-autoban')
    ? isMasterToggleOn('ddos-master-autoban')
    : boolVal('dp-autoBanEnabled') ||
      document.getElementById('dp-autoBanEnabled')?.value === '1';
  return {
    autoBanEnabled: masterOn,
    rateLimitWindowMs: secToMs(numVal('dp-rateWindowSec', 60)),
    rateLimitMax: Math.floor(numVal('dp-rateMaxKey', 120)),
    rateLimitIpMax: Math.floor(numVal('dp-rateMaxIp', 60)),
    chatBurstWindowMs: secToMs(numVal('dp-burstWindowSec', 10)),
    chatBurstMax: Math.floor(numVal('dp-burstMax', 20)),
    autoAuthEnabled: boolVal('dp-autoAuthEnabled'),
    failedAuthThreshold: Math.floor(numVal('dp-authThreshold', 20)),
    failedAuthWindowMs: secToMs(numVal('dp-authWindowSec', 300)),
    authBanDurationMs: minToMs(numVal('dp-authBanMin', 10)),
    autoRateEnabled: boolVal('dp-autoRateEnabled'),
    rateHitThreshold: Math.floor(numVal('dp-rateHitThreshold', 30)),
    rateHitWindowMs: secToMs(numVal('dp-rateHitWindowSec', 60)),
    rateBanDurationMs: minToMs(numVal('dp-rateBanMin', 15)),
    autoConnEnabled: boolVal('dp-autoConnEnabled'),
    maxConcurrentPerIp: Math.floor(numVal('dp-maxConcurrent', 20)),
    connBanDurationMs: minToMs(numVal('dp-connBanMin', 10)),
    autoVelocityEnabled: boolVal('dp-autoVelocityEnabled'),
    velocityMaxRequests: Math.floor(numVal('dp-velocityMax', 200)),
    velocityWindowMs: secToMs(numVal('dp-velocityWindowSec', 60)),
    velocityBanDurationMs: minToMs(numVal('dp-velocityBanMin', 10)),
    escalateEnabled: boolVal('dp-escalateEnabled'),
    escalateAfterBans: Math.floor(numVal('dp-escalateAfter', 3)),
    escalateDurationMs: minToMs(numVal('dp-escalateMin', 1440)),
    whitelist: wl,
    proxyTrustHops: Math.max(0, Math.min(10, Math.floor(numVal('dp-proxyTrustHops', 1)))),
    proxyIpSource: document.getElementById('dp-proxyIpSource')?.value || 'auto',
    trustedProxies: trustedProxies.length ? trustedProxies : ['127.0.0.1', '::1'],
  };
}

/** Fields used to decide relaxed / balanced / strict / custom. */
const DDOS_PRESET_KEYS = [
  'autoBanEnabled',
  'rateLimitWindowMs',
  'rateLimitMax',
  'rateLimitIpMax',
  'chatBurstWindowMs',
  'chatBurstMax',
  'autoAuthEnabled',
  'failedAuthThreshold',
  'failedAuthWindowMs',
  'authBanDurationMs',
  'autoRateEnabled',
  'rateHitThreshold',
  'rateHitWindowMs',
  'rateBanDurationMs',
  'autoConnEnabled',
  'maxConcurrentPerIp',
  'connBanDurationMs',
  'autoVelocityEnabled',
  'velocityMaxRequests',
  'velocityWindowMs',
  'velocityBanDurationMs',
  'escalateEnabled',
  'escalateAfterBans',
  'escalateDurationMs',
];

function normalizeDdosPolicySlice(p) {
  if (!p) return {};
  const out = {};
  for (const k of DDOS_PRESET_KEYS) {
    const v = p[k];
    if (typeof v === 'boolean') out[k] = v;
    else if (typeof v === 'number' && Number.isFinite(v)) out[k] = Math.round(v);
    else if (v == null) out[k] = null;
    else out[k] = v;
  }
  return out;
}

function ddosPoliciesEqual(a, b) {
  return (
    JSON.stringify(normalizeDdosPolicySlice(a)) ===
    JSON.stringify(normalizeDdosPolicySlice(b))
  );
}

/** @returns {'relaxed'|'balanced'|'strict'|'custom'} */
function matchDdosPreset(policy) {
  const presets = state._ddosPresetsCache;
  if (!presets || !policy) return 'custom';
  for (const name of ['relaxed', 'balanced', 'strict']) {
    if (presets[name] && ddosPoliciesEqual(policy, presets[name])) return name;
  }
  return 'custom';
}

function ddosPresetLabel(name) {
  if (name === 'relaxed') return t('ddos.presetRelaxed');
  if (name === 'balanced') return t('ddos.presetBalanced');
  if (name === 'strict') return t('ddos.presetStrict');
  return t('ddos.presetCustom');
}

function ddosPresetBadgeHtml(name, { unsaved = false } = {}) {
  const label = ddosPresetLabel(name);
  const tone =
    name === 'relaxed'
      ? 'relaxed'
      : name === 'balanced'
        ? 'balanced'
        : name === 'strict'
          ? 'strict'
          : 'custom';
  const status = unsaved
    ? tf('ddos.presetFormLabel', { name: label })
    : tf('ddos.presetActiveLabel', { name: label });
  return `<span class="ddos-preset-badge is-${tone}" id="ddos-preset-badge" title="${escapeHtml(status)}">${escapeHtml(status)}</span>`;
}

function updateDdosPresetUI() {
  if (!document.getElementById('ddos-policy-panel')) return;
  let formPol;
  try {
    formPol = readDdosPolicyForm();
  } catch {
    return;
  }
  const formMatch = matchDdosPreset(formPol);
  const savedMatch = matchDdosPreset(state._ddosPolicyCache || formPol);
  const unsaved = !ddosPoliciesEqual(formPol, state._ddosPolicyCache || formPol);

  document.querySelectorAll('[data-ddos-preset]').forEach((btn) => {
    const name = btn.dataset.ddosPreset;
    const isForm = name === formMatch;
    const isSaved = name === savedMatch;
    btn.classList.toggle('is-active', isForm);
    btn.classList.toggle('is-saved', isSaved && !isForm);
    btn.setAttribute('aria-pressed', isForm ? 'true' : 'false');
    // live label: 目前 / 已套用
    const base =
      name === 'relaxed'
        ? t('ddos.presetRelaxed')
        : name === 'balanced'
          ? t('ddos.presetBalanced')
          : t('ddos.presetStrict');
    if (isForm && isSaved) {
      btn.innerHTML = `${escapeHtml(base)} <span class="preset-tag">${escapeHtml(t('ddos.presetTagActive'))}</span>`;
    } else if (isForm && unsaved) {
      btn.innerHTML = `${escapeHtml(base)} <span class="preset-tag preset-tag--draft">${escapeHtml(t('ddos.presetTagDraft'))}</span>`;
    } else if (isSaved) {
      btn.innerHTML = `${escapeHtml(base)} <span class="preset-tag preset-tag--saved">${escapeHtml(t('ddos.presetTagSaved'))}</span>`;
    } else {
      btn.textContent = base;
    }
  });

  const badgeHost = document.getElementById('ddos-preset-badge');
  if (badgeHost) {
    const html = ddosPresetBadgeHtml(formMatch, {
      unsaved: unsaved && formMatch !== savedMatch,
    });
    // replace node to refresh classes
    badgeHost.outerHTML = html;
  }

  const customBtn = document.getElementById('ddos-preset-custom');
  if (customBtn) {
    customBtn.classList.toggle('is-active', formMatch === 'custom');
    customBtn.setAttribute(
      'aria-pressed',
      formMatch === 'custom' ? 'true' : 'false',
    );
  }

  const hint = document.getElementById('ddos-preset-hint');
  if (hint) {
    if (unsaved && formMatch !== savedMatch) {
      hint.textContent = tf('ddos.presetUnsavedHint', {
        form: ddosPresetLabel(formMatch),
        saved: ddosPresetLabel(savedMatch),
      });
      hint.hidden = false;
    } else if (formMatch === 'custom') {
      hint.textContent = t('ddos.presetCustomHint');
      hint.hidden = false;
    } else {
      hint.textContent = tf('ddos.presetActiveHint', {
        name: ddosPresetLabel(formMatch),
      });
      hint.hidden = false;
    }
  }
}

function applyDdosPolicyToForm(p) {
  if (!p || !document.getElementById('dp-autoBanEnabled')) return;
  const set = (id, v) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.type === 'checkbox') el.checked = Boolean(v);
    else el.value = v;
  };
  const hid = document.getElementById('dp-autoBanEnabled');
  if (hid) {
    if (hid.type === 'checkbox') hid.checked = Boolean(p.autoBanEnabled);
    else hid.value = p.autoBanEnabled ? '1' : '0';
  }
  setMasterToggle(
    'ddos-master-autoban',
    Boolean(p.autoBanEnabled),
    t('ddos.masterOn'),
    t('ddos.masterOff'),
  );
  setFeatureRootOff('ddos-root', !p.autoBanEnabled);
  setFeatureOffBanner('ddos-disabled-banner', !p.autoBanEnabled);
  set('dp-rateWindowSec', msToSec(p.rateLimitWindowMs));
  set('dp-rateMaxKey', p.rateLimitMax);
  set('dp-rateMaxIp', p.rateLimitIpMax);
  set('dp-burstWindowSec', msToSec(p.chatBurstWindowMs));
  set('dp-burstMax', p.chatBurstMax);
  set('dp-autoAuthEnabled', p.autoAuthEnabled);
  set('dp-authThreshold', p.failedAuthThreshold);
  set('dp-authWindowSec', msToSec(p.failedAuthWindowMs));
  set('dp-authBanMin', msToMin(p.authBanDurationMs));
  set('dp-autoRateEnabled', p.autoRateEnabled);
  set('dp-rateHitThreshold', p.rateHitThreshold);
  set('dp-rateHitWindowSec', msToSec(p.rateHitWindowMs));
  set('dp-rateBanMin', msToMin(p.rateBanDurationMs));
  set('dp-autoConnEnabled', p.autoConnEnabled);
  set('dp-maxConcurrent', p.maxConcurrentPerIp);
  set('dp-connBanMin', msToMin(p.connBanDurationMs));
  set('dp-autoVelocityEnabled', p.autoVelocityEnabled);
  set('dp-velocityMax', p.velocityMaxRequests);
  set('dp-velocityWindowSec', msToSec(p.velocityWindowMs));
  set('dp-velocityBanMin', msToMin(p.velocityBanDurationMs));
  set('dp-escalateEnabled', p.escalateEnabled);
  set('dp-escalateAfter', p.escalateAfterBans);
  set('dp-escalateMin', msToMin(p.escalateDurationMs));
  set('dp-whitelist', (p.whitelist || []).join('\n'));
  set('dp-proxyTrustHops', p.proxyTrustHops ?? 1);
  set('dp-proxyIpSource', p.proxyIpSource || 'auto');
  set(
    'dp-trustedProxies',
    (p.trustedProxies && p.trustedProxies.length
      ? p.trustedProxies
      : ['127.0.0.1', '::1']
    ).join('\n'),
  );
  updateDdosAutoBadge(p.autoBanEnabled);
  updateDdosPresetUI();
}

function updateDdosAutoBadge(on) {
  const el = document.getElementById('ddos-auto-badge');
  if (!el) return;
  el.className = `badge ${on ? 'success' : 'pending'}`;
  el.textContent = on ? t('ddos.autoOn') : t('ddos.autoOff');
}

function ddosPolicyPanelHtml(p) {
  const check = (id, on) =>
    `<label class="data-filter-check policy-enable"><input type="checkbox" id="${id}" ${on ? 'checked' : ''} /> <span>${escapeHtml(t('ddos.enableRule'))}</span></label>`;
  const field = (label, id, value, step = '1') =>
    `<label>${escapeHtml(label)}<input type="number" id="${id}" value="${escapeHtml(String(value))}" min="1" step="${step}" /></label>`;

  const savedMatch = matchDdosPreset(p);
  const presetBadge = ddosPresetBadgeHtml(savedMatch);

  return `
    <div class="panel data-table-panel ddos-policy-panel" id="ddos-policy-panel">
      <div class="panel-h">
        <div>
          <strong>${escapeHtml(t('ddos.policyTitle'))}</strong>
          <span class="muted">${escapeHtml(t('ddos.policyHint'))}</span>
        </div>
        <div class="ddos-header-badges">
          ${presetBadge}
          <span class="badge ${p.autoBanEnabled ? 'success' : 'pending'}" id="ddos-auto-badge">${escapeHtml(p.autoBanEnabled ? t('ddos.autoOn') : t('ddos.autoOff'))}</span>
        </div>
      </div>
      <div class="panel-pad">
        <div class="ddos-preset-block">
          <div class="ddos-preset-block-h">
            <strong>${escapeHtml(t('ddos.presetTitle'))}</strong>
            <span class="muted">${escapeHtml(t('ddos.presetHint'))}</span>
          </div>
          <div class="ddos-presets" role="group" aria-label="${escapeHtml(t('ddos.presetTitle'))}">
            <button type="button" class="ddos-preset-btn" data-ddos-preset="relaxed" aria-pressed="false">${escapeHtml(t('ddos.presetRelaxed'))}</button>
            <button type="button" class="ddos-preset-btn" data-ddos-preset="balanced" aria-pressed="false">${escapeHtml(t('ddos.presetBalanced'))}</button>
            <button type="button" class="ddos-preset-btn" data-ddos-preset="strict" aria-pressed="false">${escapeHtml(t('ddos.presetStrict'))}</button>
            <button type="button" class="ddos-preset-btn ddos-preset-btn--custom" id="ddos-preset-custom" disabled aria-pressed="false">${escapeHtml(t('ddos.presetCustom'))}</button>
          </div>
          <p class="ddos-preset-hint" id="ddos-preset-hint"></p>
        </div>
        <p class="muted policy-master-hint">${escapeHtml(t('ddos.autoBanMasterHint'))}</p>
        <input type="hidden" id="dp-autoBanEnabled" value="${p.autoBanEnabled ? '1' : '0'}" />

        <div class="policy-section">
          <h4>${escapeHtml(t('ddos.sectionProxy'))}</h4>
          <p class="muted" style="margin:0 0 10px">${escapeHtml(t('ddos.proxyHint'))}</p>
          <div class="form-grid">
            <label>${escapeHtml(t('ddos.proxyTrustHops'))}
              <input type="number" id="dp-proxyTrustHops" value="${escapeHtml(String(p.proxyTrustHops ?? 1))}" min="0" max="10" step="1" />
              <span class="field-hint">${escapeHtml(t('ddos.proxyTrustHopsHint'))}</span>
            </label>
            <label>${escapeHtml(t('ddos.proxyIpSource'))}
              <select id="dp-proxyIpSource">
                <option value="auto" ${(p.proxyIpSource || 'auto') === 'auto' ? 'selected' : ''}>${escapeHtml(t('ddos.proxySrcAuto'))}</option>
                <option value="cloudflare" ${p.proxyIpSource === 'cloudflare' ? 'selected' : ''}>${escapeHtml(t('ddos.proxySrcCf'))}</option>
                <option value="nginx" ${p.proxyIpSource === 'nginx' ? 'selected' : ''}>${escapeHtml(t('ddos.proxySrcNginx'))}</option>
                <option value="x-forwarded-for" ${p.proxyIpSource === 'x-forwarded-for' ? 'selected' : ''}>${escapeHtml(t('ddos.proxySrcXff'))}</option>
                <option value="socket" ${p.proxyIpSource === 'socket' ? 'selected' : ''}>${escapeHtml(t('ddos.proxySrcSocket'))}</option>
              </select>
              <span class="field-hint">${escapeHtml(t('ddos.proxyIpSourceHint'))}</span>
            </label>
            <label class="full">${escapeHtml(t('ddos.trustedProxies'))}
              <textarea id="dp-trustedProxies" rows="3" class="policy-whitelist">${escapeHtml((p.trustedProxies && p.trustedProxies.length ? p.trustedProxies : ['127.0.0.1', '::1']).join('\n'))}</textarea>
              <span class="field-hint">${escapeHtml(t('ddos.trustedProxiesHint'))}</span>
            </label>
          </div>
        </div>

        <div class="policy-section">
          <h4>${escapeHtml(t('ddos.sectionLimits'))}</h4>
          <div class="form-grid">
            ${field(t('ddos.rateWindow'), 'dp-rateWindowSec', msToSec(p.rateLimitWindowMs))}
            ${field(t('ddos.rateMaxKey'), 'dp-rateMaxKey', p.rateLimitMax)}
            ${field(t('ddos.rateMaxIp'), 'dp-rateMaxIp', p.rateLimitIpMax)}
            ${field(t('ddos.burstWindow'), 'dp-burstWindowSec', msToSec(p.chatBurstWindowMs))}
            ${field(t('ddos.burstMax'), 'dp-burstMax', p.chatBurstMax)}
          </div>
        </div>

        <div class="policy-section">
          <div class="policy-section-h"><h4>${escapeHtml(t('ddos.sectionAuth'))}</h4>${check('dp-autoAuthEnabled', p.autoAuthEnabled)}</div>
          <div class="form-grid">
            ${field(t('ddos.threshold'), 'dp-authThreshold', p.failedAuthThreshold)}
            ${field(t('ddos.windowSec'), 'dp-authWindowSec', msToSec(p.failedAuthWindowMs))}
            ${field(t('ddos.banMin'), 'dp-authBanMin', msToMin(p.authBanDurationMs))}
          </div>
        </div>

        <div class="policy-section">
          <div class="policy-section-h"><h4>${escapeHtml(t('ddos.sectionRate'))}</h4>${check('dp-autoRateEnabled', p.autoRateEnabled)}</div>
          <div class="form-grid">
            ${field(t('ddos.threshold'), 'dp-rateHitThreshold', p.rateHitThreshold)}
            ${field(t('ddos.windowSec'), 'dp-rateHitWindowSec', msToSec(p.rateHitWindowMs))}
            ${field(t('ddos.banMin'), 'dp-rateBanMin', msToMin(p.rateBanDurationMs))}
          </div>
        </div>

        <div class="policy-section">
          <div class="policy-section-h"><h4>${escapeHtml(t('ddos.sectionConn'))}</h4>${check('dp-autoConnEnabled', p.autoConnEnabled)}</div>
          <div class="form-grid">
            ${field(t('ddos.maxConcurrent'), 'dp-maxConcurrent', p.maxConcurrentPerIp)}
            ${field(t('ddos.banMin'), 'dp-connBanMin', msToMin(p.connBanDurationMs))}
          </div>
        </div>

        <div class="policy-section">
          <div class="policy-section-h"><h4>${escapeHtml(t('ddos.sectionVelocity'))}</h4>${check('dp-autoVelocityEnabled', p.autoVelocityEnabled)}</div>
          <div class="form-grid">
            ${field(t('ddos.velocityMax'), 'dp-velocityMax', p.velocityMaxRequests)}
            ${field(t('ddos.windowSec'), 'dp-velocityWindowSec', msToSec(p.velocityWindowMs))}
            ${field(t('ddos.banMin'), 'dp-velocityBanMin', msToMin(p.velocityBanDurationMs))}
          </div>
        </div>

        <div class="policy-section">
          <div class="policy-section-h"><h4>${escapeHtml(t('ddos.sectionEscalate'))}</h4>${check('dp-escalateEnabled', p.escalateEnabled)}</div>
          <div class="form-grid">
            ${field(t('ddos.escalateAfter'), 'dp-escalateAfter', p.escalateAfterBans)}
            ${field(t('ddos.escalateMin'), 'dp-escalateMin', msToMin(p.escalateDurationMs))}
          </div>
        </div>

        <div class="policy-section">
          <h4>${escapeHtml(t('ddos.sectionWhitelist'))}</h4>
          <p class="muted" style="margin:0 0 8px">${escapeHtml(t('ddos.whitelistHint'))}</p>
          <textarea id="dp-whitelist" rows="4" class="policy-whitelist">${escapeHtml((p.whitelist || []).join('\n'))}</textarea>
        </div>

        <div class="ddos-policy-actions">
          <button type="button" class="btn secondary sm" id="dp-reset">${escapeHtml(t('ddos.resetPolicy'))}</button>
          <button type="button" class="btn sm" id="dp-save">${escapeHtml(t('ddos.savePolicy'))}</button>
        </div>
      </div>
    </div>`;
}

function ddosEventsRows(events) {
  if (!events?.length) {
    return `<tr class="empty-row"><td colspan="5"><div class="data-empty"><strong>${escapeHtml(t('ddos.emptyEvents'))}</strong></div></td></tr>`;
  }
  return events
    .map(
      (e) => `
    <tr>
      <td>${fmtTime(e.at)}</td>
      <td class="cell-primary">${escapeHtml(e.ip)}</td>
      <td><span class="badge ${e.escalated ? 'warn' : 'pending'}">${escapeHtml(banSourceLabel(e.source))}</span></td>
      <td class="muted" style="max-width:280px;word-break:break-word">${escapeHtml(e.reason || '')}</td>
      <td>${escapeHtml(msToMin(e.durationMs))} min</td>
    </tr>`,
    )
    .join('');
}

async function renderDdos(opts = {}) {
  const soft = Boolean(opts.soft) && document.getElementById('ddos-root');
  const mainEl = document.querySelector('.main');
  const savedScroll = mainEl ? mainEl.scrollTop : 0;

  if (ddosTimer) {
    clearInterval(ddosTimer);
    ddosTimer = null;
  }

  const fetches = [
    api('/ddos/connections'),
    api('/ddos/blacklist'),
    api('/ddos/stats'),
    api('/ddos/events'),
  ];
  if (!soft) fetches.push(api('/ddos/policy'));
  const results = await Promise.all(fetches);
  const [conn, bl, st, evRes] = results;
  const policyRes = soft ? null : results[4];
  const df = state.ddosFilter;
  const ps = df.pageSize || 15;
  let active = conn.data?.active || [];
  let recent = conn.data?.recent || [];
  let bans = bl.data || [];
  const stats = st.data || {};
  const events = evRes.data || [];
  const policy = policyRes?.data || state._ddosPolicyCache || null;
  const presets = policyRes?.presets || state._ddosPresetsCache || null;
  if (policy) state._ddosPolicyCache = policy;
  if (presets) state._ddosPresetsCache = presets;
  const whitelist = (state._ddosPolicyCache?.whitelist || []).map(String);

  if (df.liveQ.trim()) {
    const qq = df.liveQ.trim().toLowerCase();
    const match = (c) =>
      [c.ip, c.path, c.method, c.apiKeyName, c.apiKeyPrefix]
        .filter(Boolean)
        .some((x) => String(x).toLowerCase().includes(qq));
    active = active.filter(match);
    recent = recent.filter(match);
  }
  if (df.banQ.trim()) {
    const qq = df.banQ.trim().toLowerCase();
    bans = bans.filter(
      (b) =>
        String(b.ip || '').toLowerCase().includes(qq) ||
        String(b.reason || '').toLowerCase().includes(qq),
    );
  }
  if (df.banSource) {
    bans = bans.filter((b) => b.source === df.banSource);
  }
  const liveSlice = active.slice(df.livePage * ps, df.livePage * ps + ps);
  const banSlice = bans.slice(df.banPage * ps, df.banPage * ps + ps);

  const liveRows = liveSlice
    .map(
      (c) => `
    <tr>
      <td class="cell-primary">${escapeHtml(c.ip)}</td>
      <td>${escapeHtml(c.method)}</td>
      <td class="muted" style="max-width:220px;word-break:break-all">${escapeHtml(c.path)}</td>
      <td>${escapeHtml(c.apiKeyName || c.apiKeyPrefix || '—')}</td>
      <td><span class="badge pending">${escapeHtml(t('status.active'))}</span></td>
      <td>${fmtMs(Date.now() - c.startedAt)}</td>
      <td><div class="row-actions"><button class="btn danger sm" data-ban="${escapeHtml(c.ip)}">${escapeHtml(t('ddos.ban'))}</button></div></td>
    </tr>`,
    )
    .join('');

  const recentRows = recent
    .slice(0, 40)
    .map(
      (c) => `
    <tr>
      <td class="cell-primary">${escapeHtml(c.ip)}</td>
      <td>${escapeHtml(c.method)} ${escapeHtml(c.path)}</td>
      <td>${c.statusCode ?? '—'}</td>
      <td>${fmtMs(c.durationMs)}</td>
      <td><div class="row-actions"><button class="btn danger sm" data-ban="${escapeHtml(c.ip)}">${escapeHtml(t('ddos.ban'))}</button></div></td>
    </tr>`,
    )
    .join('');

  const banRows = banSlice
    .map(
      (b) => `
    <tr>
      <td class="cell-primary">${escapeHtml(b.ip)}</td>
      <td>${escapeHtml(b.reason || '—')}</td>
      <td><span class="badge pending">${escapeHtml(banSourceLabel(b.source))}</span></td>
      <td>${b.expiresAt ? fmtTime(b.expiresAt) : escapeHtml(t('ddos.permanent'))}</td>
      <td><div class="row-actions"><button class="btn secondary sm" data-unban="${escapeHtml(b.ip)}">${escapeHtml(t('ddos.unban'))}</button></div></td>
    </tr>`,
    )
    .join('');

  const topIps = (stats.topIps || [])
    .map(
      (x) => `<tr><td class="cell-primary">${escapeHtml(x.ip)}</td><td>${x.requests}</td>
      <td><div class="row-actions"><button class="btn danger sm" data-ban="${escapeHtml(x.ip)}">${escapeHtml(t('ddos.ban'))}</button></div></td></tr>`,
    )
    .join('');

  const eventRows = ddosEventsRows(events);
  const emptyLive = `<tr class="empty-row"><td colspan="7"><div class="data-empty"><strong>${escapeHtml(t('ddos.emptyLive'))}</strong></div></td></tr>`;
  const emptyRecent = `<tr class="empty-row"><td colspan="5"><div class="data-empty"><strong>${escapeHtml(t('common.empty'))}</strong></div></td></tr>`;
  const emptyBan = `<tr class="empty-row"><td colspan="5"><div class="data-empty"><strong>${escapeHtml(t('ddos.emptyBan'))}</strong></div></td></tr>`;
  const emptyTop = `<tr class="empty-row"><td colspan="3"><div class="data-empty"><strong>${escapeHtml(t('common.empty'))}</strong></div></td></tr>`;

  const sourceOpts = [
    '',
    'manual',
    'auto-auth',
    'auto-rate',
    'auto-conn',
    'auto-velocity',
    'auto-escalate',
  ]
    .map((s) => {
      if (!s) return `<option value="">${escapeHtml(t('common.all'))}</option>`;
      return `<option value="${s}" ${df.banSource === s ? 'selected' : ''}>${escapeHtml(banSourceLabel(s))}</option>`;
    })
    .join('');

  if (soft) {
    const set = (id, html) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    };
    const setText = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };
    setText('ddos-stat-active', String(stats.activeConnections ?? active.length));
    setText('ddos-stat-rate', String(stats.rateLimitedHits ?? 0));
    setText('ddos-stat-blocked', String(stats.blockedHits ?? 0));
    setText('ddos-stat-ban', String(bans.length));
    setText('ddos-stat-auto', String(stats.autoBanTotal ?? 0));
    setText('ddos-tab-count-live', String(active.length));
    setText('ddos-tab-count-ban', String(bans.length));
    setText('ddos-tab-count-events', String(events.length));
    set('ddos-live-body', liveRows || emptyLive);
    set('ddos-recent-body', recentRows || emptyRecent);
    set('ddos-ban-body', banRows || emptyBan);
    set('ddos-top-body', topIps || emptyTop);
    set('ddos-events-body', eventRows);
    if (stats.policySummary) {
      updateDdosAutoBadge(Boolean(stats.policySummary.autoBanEnabled));
    }
    bindDdosActions();
    if (mainEl) mainEl.scrollTop = savedScroll;
  } else {
    const pol = policy || {
      autoBanEnabled: true,
      rateLimitWindowMs: 60000,
      rateLimitMax: 120,
      rateLimitIpMax: 60,
      chatBurstWindowMs: 10000,
      chatBurstMax: 20,
      autoAuthEnabled: true,
      failedAuthThreshold: 20,
      failedAuthWindowMs: 300000,
      authBanDurationMs: 600000,
      autoRateEnabled: true,
      rateHitThreshold: 30,
      rateHitWindowMs: 60000,
      rateBanDurationMs: 900000,
      autoConnEnabled: true,
      maxConcurrentPerIp: 20,
      connBanDurationMs: 600000,
      autoVelocityEnabled: true,
      velocityMaxRequests: 200,
      velocityWindowMs: 60000,
      velocityBanDurationMs: 600000,
      escalateEnabled: true,
      escalateAfterBans: 3,
      escalateDurationMs: 86400000,
      whitelist: ['127.0.0.1', '::1'],
      proxyTrustHops: 1,
      proxyIpSource: 'auto',
      trustedProxies: ['127.0.0.1', '::1'],
    };

    const autoBanOn = Boolean(pol.autoBanEnabled);
    const tab =
      df.tab === 'live' ||
      df.tab === 'blacklist' ||
      df.tab === 'events' ||
      df.tab === 'policy'
        ? df.tab
        : 'policy';
    state.ddosFilter.tab = tab;

    const kpiGrid = `
    <div class="grid ddos-kpi-grid">
      <div class="card"><div class="label">${escapeHtml(t('ddos.activeConn'))}</div><div class="value value-sm" id="ddos-stat-active">${stats.activeConnections ?? active.length}</div><div class="muted card-sub">${escapeHtml(t('ddos.live'))}</div></div>
      <div class="card"><div class="label">${escapeHtml(t('ddos.rateHits'))}</div><div class="value value-sm" id="ddos-stat-rate">${stats.rateLimitedHits ?? 0}</div><div class="muted card-sub">${escapeHtml(t('ddos.stats'))}</div></div>
      <div class="card"><div class="label">${escapeHtml(t('ddos.blockedHits'))}</div><div class="value value-sm" id="ddos-stat-blocked">${stats.blockedHits ?? 0}</div><div class="muted card-sub">${escapeHtml(t('ddos.stats'))}</div></div>
      <div class="card"><div class="label">${escapeHtml(t('ddos.blacklist'))}</div><div class="value value-sm" id="ddos-stat-ban">${bans.length}</div><div class="muted card-sub">${escapeHtml(t('ddos.tabBlacklist'))}</div></div>
      <div class="card"><div class="label">${escapeHtml(t('ddos.autoBans'))}</div><div class="value value-sm" id="ddos-stat-auto">${stats.autoBanTotal ?? 0}</div><div class="muted card-sub">${escapeHtml(t('ddos.tabEvents'))}</div></div>
    </div>`;

    const policyPane = ddosPolicyPanelHtml(pol);

    const livePane = `
    <div class="panel data-filter-panel ddos-filter-panel">
      <div class="panel-h"><strong>${escapeHtml(t('common.filterTitle'))}</strong></div>
      <div class="data-filter">
        <div class="data-filter-grid">
          <label class="full">${escapeHtml(t('ddos.live'))} / ${escapeHtml(t('ddos.recent'))}
            <input type="search" id="ddos-live-q" value="${escapeHtml(df.liveQ)}" placeholder="IP / path / key" />
          </label>
        </div>
        <div class="data-filter-actions">
          <button type="button" class="btn secondary sm" id="ddos-live-filter-reset">${escapeHtml(t('common.reset'))}</button>
          <button type="button" class="btn sm" id="ddos-live-filter-apply">${escapeHtml(t('common.apply'))}</button>
        </div>
      </div>
    </div>
    <div class="panel data-table-panel ddos-stack-panel">
      <div class="panel-h"><strong>${escapeHtml(t('ddos.live'))}</strong>
        <span class="muted">${escapeHtml(tf('common.pagerTotal', { n: active.length }))}</span>
      </div>
      <div class="table-wrap">
      <table class="data-table">
        <thead><tr>
          <th>${escapeHtml(t('ddos.ip'))}</th><th>${escapeHtml(t('ddos.method'))}</th>
          <th>${escapeHtml(t('ddos.path'))}</th><th>${escapeHtml(t('ddos.key'))}</th>
          <th>${escapeHtml(t('ddos.state'))}</th><th>${escapeHtml(t('ddos.duration'))}</th>
          <th>${escapeHtml(t('common.actions'))}</th>
        </tr></thead>
        <tbody id="ddos-live-body">${liveRows || emptyLive}</tbody>
      </table>
      </div>
      ${pagerHtml({ total: active.length, limit: ps, offset: df.livePage * ps, idPrefix: 'ddoslive' })}
    </div>
    <div class="panel data-table-panel ddos-stack-panel">
      <div class="panel-h"><strong>${escapeHtml(t('ddos.recent'))}</strong></div>
      <div class="table-wrap">
      <table class="data-table">
        <thead><tr>
          <th>${escapeHtml(t('ddos.ip'))}</th><th>${escapeHtml(t('ddos.path'))}</th>
          <th>${escapeHtml(t('common.httpStatus'))}</th><th>${escapeHtml(t('ddos.duration'))}</th><th>${escapeHtml(t('common.actions'))}</th>
        </tr></thead>
        <tbody id="ddos-recent-body">${recentRows || emptyRecent}</tbody>
      </table>
      </div>
    </div>`;

    const blacklistPane = `
    <div class="panel data-filter-panel ddos-filter-panel">
      <div class="panel-h"><strong>${escapeHtml(t('common.filterTitle'))}</strong></div>
      <div class="data-filter">
        <div class="data-filter-grid">
          <label>${escapeHtml(t('ddos.blacklist'))}
            <input type="search" id="ddos-ban-q" value="${escapeHtml(df.banQ)}" placeholder="IP / reason" />
          </label>
          <label>${escapeHtml(t('ddos.source'))}
            <select id="ddos-ban-source">${sourceOpts}</select>
          </label>
        </div>
        <div class="data-filter-actions">
          <button type="button" class="btn secondary sm" id="ddos-ban-filter-reset">${escapeHtml(t('common.reset'))}</button>
          <button type="button" class="btn sm" id="ddos-ban-filter-apply">${escapeHtml(t('common.apply'))}</button>
        </div>
      </div>
    </div>
    <div class="panel data-table-panel ddos-stack-panel">
      <div class="panel-h"><strong>${escapeHtml(t('ddos.blacklist'))}</strong>
        <span class="muted">${escapeHtml(tf('common.pagerTotal', { n: bans.length }))}</span>
      </div>
      <div class="filter-bar">
        <label>${escapeHtml(t('ddos.ip'))}<input id="ban-ip" placeholder="${escapeHtml(t('ddos.ipPlaceholder'))}" /></label>
        <label>${escapeHtml(t('ddos.reason'))}<input id="ban-reason" placeholder="${escapeHtml(t('ddos.reasonPh'))}" class="wide" /></label>
        <label>${escapeHtml(t('ddos.ttl'))}
          <select id="ban-ttl">
            <option value="">${escapeHtml(t('ddos.ttlPerm'))}</option>
            <option value="3600">${escapeHtml(t('ddos.ttl1h'))}</option>
            <option value="86400">${escapeHtml(t('ddos.ttl24h'))}</option>
            <option value="604800">${escapeHtml(t('ddos.ttl7d'))}</option>
          </select>
        </label>
        <button class="btn sm" id="ban-add">${escapeHtml(t('ddos.addBan'))}</button>
      </div>
      <div class="table-wrap">
      <table class="data-table">
        <thead><tr>
          <th>${escapeHtml(t('ddos.ip'))}</th><th>${escapeHtml(t('ddos.reason'))}</th>
          <th>${escapeHtml(t('ddos.source'))}</th><th>${escapeHtml(t('ddos.expires'))}</th><th>${escapeHtml(t('common.actions'))}</th>
        </tr></thead>
        <tbody id="ddos-ban-body">${banRows || emptyBan}</tbody>
      </table>
      </div>
      ${pagerHtml({ total: bans.length, limit: ps, offset: df.banPage * ps, idPrefix: 'ddosban' })}
    </div>`;

    const eventsPane = `
    <div class="panel data-table-panel ddos-stack-panel">
      <div class="panel-h"><strong>${escapeHtml(t('ddos.eventsTitle'))}</strong>
        <span class="muted">${escapeHtml(tf('common.pagerTotal', { n: events.length }))}</span>
      </div>
      <div class="table-wrap">
      <table class="data-table">
        <thead><tr>
          <th>${escapeHtml(t('ddos.eventTime'))}</th>
          <th>${escapeHtml(t('ddos.ip'))}</th>
          <th>${escapeHtml(t('ddos.eventSource'))}</th>
          <th>${escapeHtml(t('ddos.reason'))}</th>
          <th>${escapeHtml(t('ddos.eventDuration'))}</th>
        </tr></thead>
        <tbody id="ddos-events-body">${eventRows}</tbody>
      </table>
      </div>
    </div>
    <div class="panel data-table-panel ddos-stack-panel">
      <div class="panel-h"><strong>${escapeHtml(t('ddos.topIps'))}</strong></div>
      <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>${escapeHtml(t('ddos.ip'))}</th><th>${escapeHtml(t('usage.requests'))}</th><th>${escapeHtml(t('common.actions'))}</th></tr></thead>
        <tbody id="ddos-top-body">${topIps || emptyTop}</tbody>
      </table>
      </div>
    </div>`;

    document.getElementById('app').innerHTML = shell(`
    <div id="ddos-root" class="${autoBanOn ? '' : 'is-feature-off'}">
    <div class="topbar">
      <h2>${escapeHtml(t('ddos.title'))}</h2>
      <div class="toolbar">
        ${masterToggleBtnHtml({
          id: 'ddos-master-autoban',
          on: autoBanOn,
          onLabel: t('ddos.masterOn'),
          offLabel: t('ddos.masterOff'),
          title: t('ddos.autoBanMasterHint'),
        })}
        <button class="btn secondary sm" id="ddos-refresh">${escapeHtml(t('ddos.refresh'))}</button>
        <button class="btn secondary sm" id="ddos-pause">${escapeHtml(ddosPaused ? t('ddos.resume') : t('ddos.pause'))}</button>
      </div>
    </div>
    ${pageMetaHtml([t('ddos.policyHint')])}
    <div class="feature-off-banner" id="ddos-disabled-banner" ${autoBanOn ? 'hidden' : ''} role="status">
      <strong>${escapeHtml(t('common.featureOff'))}</strong>
      <span>${escapeHtml(t('ddos.disabledBanner'))}</span>
    </div>
    ${kpiGrid}

    <div class="usage-tabs-panel panel ddos-tabs-panel">
      <div class="seg-tabs" role="tablist" aria-label="${escapeHtml(t('ddos.title'))}">
        <button type="button" role="tab" class="seg-tab ${tab === 'policy' ? 'is-active' : ''}" data-ddos-tab="policy" aria-selected="${tab === 'policy'}">
          ${escapeHtml(t('ddos.tabPolicy'))}
        </button>
        <button type="button" role="tab" class="seg-tab ${tab === 'live' ? 'is-active' : ''}" data-ddos-tab="live" aria-selected="${tab === 'live'}">
          ${escapeHtml(t('ddos.tabLive'))}
          <span class="seg-tab-count" id="ddos-tab-count-live">${active.length}</span>
        </button>
        <button type="button" role="tab" class="seg-tab ${tab === 'blacklist' ? 'is-active' : ''}" data-ddos-tab="blacklist" aria-selected="${tab === 'blacklist'}">
          ${escapeHtml(t('ddos.tabBlacklist'))}
          <span class="seg-tab-count" id="ddos-tab-count-ban">${bans.length}</span>
        </button>
        <button type="button" role="tab" class="seg-tab ${tab === 'events' ? 'is-active' : ''}" data-ddos-tab="events" aria-selected="${tab === 'events'}">
          ${escapeHtml(t('ddos.tabEvents'))}
          <span class="seg-tab-count" id="ddos-tab-count-events">${events.length}</span>
        </button>
      </div>
      <div class="usage-tab-body">
        <div class="usage-tab-pane ddos-tab-pane ddos-tab-pane-policy" id="ddos-tab-policy" ${tab === 'policy' ? '' : 'hidden'}>
          ${policyPane}
        </div>
        <div class="usage-tab-pane ddos-tab-pane ddos-tab-pane-stack" id="ddos-tab-live" ${tab === 'live' ? '' : 'hidden'}>
          ${livePane}
        </div>
        <div class="usage-tab-pane ddos-tab-pane ddos-tab-pane-stack" id="ddos-tab-blacklist" ${tab === 'blacklist' ? '' : 'hidden'}>
          ${blacklistPane}
        </div>
        <div class="usage-tab-pane ddos-tab-pane ddos-tab-pane-stack" id="ddos-tab-events" ${tab === 'events' ? '' : 'hidden'}>
          ${eventsPane}
        </div>
      </div>
    </div>
    </div>
  `);
    bindShell();
    bindDdosActions(true, whitelist);

    document.querySelectorAll('[data-ddos-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const raw = btn.getAttribute('data-ddos-tab') || 'policy';
        const next =
          raw === 'live' ||
          raw === 'blacklist' ||
          raw === 'events' ||
          raw === 'policy'
            ? raw
            : 'policy';
        if (state.ddosFilter.tab === next) return;
        state.ddosFilter.tab = next;
        renderDdos().catch(onErr);
      });
    });

    document.getElementById('ddos-live-filter-apply')?.addEventListener('click', () => {
      state.ddosFilter.liveQ =
        document.getElementById('ddos-live-q')?.value?.trim() || '';
      state.ddosFilter.livePage = 0;
      renderDdos().catch(onErr);
    });
    document.getElementById('ddos-live-filter-reset')?.addEventListener('click', () => {
      state.ddosFilter.liveQ = '';
      state.ddosFilter.livePage = 0;
      renderDdos().catch(onErr);
    });
    document.getElementById('ddos-ban-filter-apply')?.addEventListener('click', () => {
      state.ddosFilter.banQ =
        document.getElementById('ddos-ban-q')?.value?.trim() || '';
      state.ddosFilter.banSource =
        document.getElementById('ddos-ban-source')?.value || '';
      state.ddosFilter.banPage = 0;
      renderDdos().catch(onErr);
    });
    document.getElementById('ddos-ban-filter-reset')?.addEventListener('click', () => {
      state.ddosFilter.banQ = '';
      state.ddosFilter.banSource = '';
      state.ddosFilter.banPage = 0;
      renderDdos().catch(onErr);
    });
    document.getElementById('ddoslive-prev')?.addEventListener('click', () => {
      state.ddosFilter.livePage = Math.max(0, df.livePage - 1);
      renderDdos().catch(onErr);
    });
    document.getElementById('ddoslive-next')?.addEventListener('click', () => {
      if ((df.livePage + 1) * ps < active.length) {
        state.ddosFilter.livePage += 1;
        renderDdos().catch(onErr);
      }
    });
    document.getElementById('ddosban-prev')?.addEventListener('click', () => {
      state.ddosFilter.banPage = Math.max(0, df.banPage - 1);
      renderDdos().catch(onErr);
    });
    document.getElementById('ddosban-next')?.addEventListener('click', () => {
      if ((df.banPage + 1) * ps < bans.length) {
        state.ddosFilter.banPage += 1;
        renderDdos().catch(onErr);
      }
    });
    const main2 = document.querySelector('.main');
    if (main2) {
      main2.onscroll = () => {
        state._ddosScrollPauseUntil = Date.now() + 4000;
      };
    }
  }

  if (!ddosPaused && state.page === 'ddos') {
    ddosTimer = setInterval(() => {
      if (state.page !== 'ddos' || ddosPaused) return;
      if (state._ddosScrollPauseUntil && Date.now() < state._ddosScrollPauseUntil) return;
      renderDdos({ soft: true }).catch(() => undefined);
    }, 2000);
  }
}

function bindDdosActions(full = false, whitelist = []) {
  const wl = whitelist.length
    ? whitelist
    : state._ddosPolicyCache?.whitelist || [];

  const banIp = async (ip) => {
    if (!ip) return;
    const onWl = wl.some((w) => String(w) === ip || String(w).startsWith(ip));
    if (
      !(await uiConfirm({
        message: onWl ? t('ddos.banWhitelistWarn') : t('ddos.banConfirm'),
        variant: 'danger',
        confirmText: t('ddos.ban'),
      }))
    )
      return;
    await api('/ddos/blacklist', {
      method: 'POST',
      body: JSON.stringify({
        ip,
        reason: t('ddos.banReasonDefault'),
        ttlSeconds: null,
      }),
    });
    renderDdos({ soft: true }).catch(onErr);
  };

  document.querySelectorAll('[data-ban]').forEach((b) => {
    b.onclick = () => banIp(b.dataset.ban);
  });
  document.querySelectorAll('[data-unban]').forEach((b) => {
    b.onclick = async () => {
      if (
        !(await uiConfirm({
          message: t('ddos.unbanConfirm'),
          variant: 'danger',
          confirmText: t('ddos.unban'),
        }))
      )
        return;
      await api(`/ddos/blacklist/${encodeURIComponent(b.dataset.unban)}`, {
        method: 'DELETE',
      });
      renderDdos({ soft: true }).catch(onErr);
    };
  });

  if (full) {
    document.getElementById('ban-add').onclick = async () => {
      const ip = document.getElementById('ban-ip').value.trim();
      if (!ip) return;
      const onWl = wl.some((w) => String(w) === ip);
      if (onWl) {
        if (
          !(await uiConfirm({
            message: t('ddos.banWhitelistWarn'),
            variant: 'danger',
            confirmText: t('ddos.ban'),
          }))
        )
          return;
      }
      const ttl = document.getElementById('ban-ttl').value;
      await api('/ddos/blacklist', {
        method: 'POST',
        body: JSON.stringify({
          ip,
          reason:
            document.getElementById('ban-reason').value.trim() || undefined,
          ttlSeconds: ttl ? Number(ttl) : null,
        }),
      });
      renderDdos({ soft: true }).catch(onErr);
    };
    document.getElementById('ddos-refresh').onclick = () =>
      renderDdos({ soft: false }).catch(onErr);
    document.getElementById('ddos-pause').onclick = () => {
      ddosPaused = !ddosPaused;
      const btn = document.getElementById('ddos-pause');
      if (btn) btn.textContent = ddosPaused ? t('ddos.resume') : t('ddos.pause');
      if (!ddosPaused) renderDdos({ soft: true }).catch(onErr);
    };

    document.getElementById('ddos-master-autoban')?.addEventListener('click', async () => {
      const next = !isMasterToggleOn('ddos-master-autoban');
      setMasterToggle(
        'ddos-master-autoban',
        next,
        t('ddos.masterOn'),
        t('ddos.masterOff'),
      );
      const hid = document.getElementById('dp-autoBanEnabled');
      if (hid) {
        if (hid.type === 'checkbox') hid.checked = next;
        else hid.value = next ? '1' : '0';
      }
      updateDdosAutoBadge(next);
      setFeatureRootOff('ddos-root', !next);
      setFeatureOffBanner('ddos-disabled-banner', !next);
      updateDdosPresetUI();
      // Immediate save of master switch (full form snapshot)
      try {
        const body = readDdosPolicyForm();
        const res = await api('/ddos/policy', {
          method: 'PUT',
          body: JSON.stringify(body),
        });
        state._ddosPolicyCache = res.data;
        updateDdosPresetUI();
      } catch (e) {
        setMasterToggle(
          'ddos-master-autoban',
          !next,
          t('ddos.masterOn'),
          t('ddos.masterOff'),
        );
        setFeatureRootOff('ddos-root', next);
        setFeatureOffBanner('ddos-disabled-banner', next);
        onErr(e);
      }
    });

    // Live-detect custom vs preset when user edits any field
    const policyPanel = document.getElementById('ddos-policy-panel');
    policyPanel?.addEventListener('input', () => updateDdosPresetUI());
    policyPanel?.addEventListener('change', () => updateDdosPresetUI());

    document.querySelectorAll('[data-ddos-preset]').forEach((btn) => {
      btn.onclick = () => {
        const name = btn.dataset.ddosPreset;
        if (name === 'custom') return;
        const preset = state._ddosPresetsCache?.[name];
        if (preset) applyDdosPolicyToForm(preset);
      };
    });

    updateDdosPresetUI();

    document.getElementById('dp-save')?.addEventListener('click', async () => {
      try {
        const body = readDdosPolicyForm();
        const res = await api('/ddos/policy', {
          method: 'PUT',
          body: JSON.stringify(body),
        });
        state._ddosPolicyCache = res.data;
        applyDdosPolicyToForm(res.data);
        updateDdosPresetUI();
        await uiAlert({ title: t('ddos.policyTitle'), message: t('ddos.policySaved') });
        renderDdos({ soft: true }).catch(onErr);
      } catch (e) {
        onErr(e);
      }
    });

    document.getElementById('dp-reset')?.addEventListener('click', async () => {
      if (
        !(await uiConfirm({
          message: t('ddos.confirmReset'),
          variant: 'danger',
          confirmText: t('ddos.resetPolicy'),
        }))
      )
        return;
      try {
        const res = await api('/ddos/policy/reset', { method: 'POST' });
        state._ddosPolicyCache = res.data;
        applyDdosPolicyToForm(res.data);
        updateDdosPresetUI();
        await uiAlert({ title: t('ddos.policyTitle'), message: t('ddos.policyReset') });
        renderDdos({ soft: true }).catch(onErr);
      } catch (e) {
        onErr(e);
      }
    });
  }
}

function runnerLabel(runner) {
  if (runner === 'pm2') return t('pm2.runnerPm2');
  if (runner === 'gctoac') return t('pm2.runnerGctoac');
  if (runner === 'none') return t('pm2.runnerNone');
  return t('pm2.runnerUnknown');
}

/** Localize PM2 API status / switch messages via messageKey + params */
function formatPm2Message(data) {
  if (!data) return '';
  const key = data.messageKey;
  if (key && typeof key === 'string') {
    if (key === 'pm2.msgOk') return '';
    const params = data.messageParams || {};
    const out = tf(key, params);
    // if missing i18n key, tf/t returns path — fall back to English message
    if (out && out !== key) return out;
  }
  const raw = data.message || '';
  if (!raw || raw === 'ok') return '';
  return raw;
}

/**
 * After runner switch / restart: show localized notice and auto-reload Admin.
 * Never rely on backend English `message` — always prefer messageKey / mode.
 */
function scheduleAdminReload(seconds = 10) {
  const ms = Math.max(1, Number(seconds) || 10) * 1000;
  window.setTimeout(() => {
    try {
      window.location.reload();
    } catch {
      window.location.href = window.location.href;
    }
  }, ms);
}

/**
 * @param {'pm2'|'gctoac'} mode
 * @param {any} data API data from /pm2/switch or scheduled payload
 */
function buildPm2SwitchAlertMessage(mode, data) {
  const keyFromApi =
    data?.messageKey ||
    (mode === 'pm2' ? 'pm2.msgSwitchPm2' : 'pm2.msgSwitchGctoac');
  let body = formatPm2Message({
    messageKey: keyFromApi,
    messageParams: data?.messageParams,
    message: undefined, // never show raw English from API
  });
  if (!body) {
    body =
      mode === 'pm2' ? t('pm2.msgSwitchPm2') : t('pm2.msgSwitchGctoac');
  }
  const port =
    data?.port ||
    data?.messageParams?.port ||
    (typeof location !== 'undefined' && location.port
      ? location.port
      : '3847');
  const lines = [
    body,
    tf('pm2.portAfterRestart', { port }),
    tf('pm2.autoRefreshIn', { n: 10 }),
  ];
  return lines.filter(Boolean).join('\n');
}

function runnerBadge(runner) {
  if (runner === 'pm2') return `<span class="badge success">${escapeHtml(runnerLabel(runner))}</span>`;
  if (runner === 'gctoac') return `<span class="badge agent">${escapeHtml(runnerLabel(runner))}</span>`;
  if (runner === 'none') return `<span class="badge pending">${escapeHtml(runnerLabel(runner))}</span>`;
  return `<span class="badge warn">${escapeHtml(runnerLabel(runner))}</span>`;
}

function envExtraToText(extra) {
  if (!extra || typeof extra !== 'object') return '';
  return Object.entries(extra)
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');
}

function textToEnvExtra(text) {
  const out = {};
  for (const line of (text || '').split('\n')) {
    const tline = line.trim();
    if (!tline || tline.startsWith('#')) continue;
    const eq = tline.indexOf('=');
    if (eq <= 0) continue;
    out[tline.slice(0, eq).trim()] = tline.slice(eq + 1).trim();
  }
  return out;
}

function readPm2ConfigForm() {
  const bool = (id) => document.getElementById(id)?.checked === true;
  const val = (id) => document.getElementById(id)?.value ?? '';
  let instances = val('pm2-cfg-instances').trim();
  if (instances !== 'max') {
    const n = Number(instances);
    instances = Number.isFinite(n) && n >= 1 ? n : 1;
  }
  const portRaw = val('pm2-cfg-port').trim();
  const portNum = Number(portRaw);
  return {
    port: Number.isFinite(portNum) && portNum >= 1 && portNum <= 65535 ? portNum : undefined,
    name: val('pm2-cfg-name').trim() || 'grok-openai-gateway',
    script: val('pm2-cfg-script').trim() || 'dist/server.js',
    cwd: val('pm2-cfg-cwd').trim() || undefined,
    instances,
    exec_mode: val('pm2-cfg-exec') === 'cluster' ? 'cluster' : 'fork',
    autorestart: bool('pm2-cfg-autorestart'),
    watch: bool('pm2-cfg-watch'),
    max_memory_restart: val('pm2-cfg-maxmem').trim() || '512M',
    max_restarts: Number(val('pm2-cfg-maxrestarts')) || 10,
    min_uptime: val('pm2-cfg-minuptime').trim() || '5s',
    restart_delay: Number(val('pm2-cfg-restartdelay')) || 2000,
    exp_backoff_restart_delay: Number(val('pm2-cfg-backoff')) || 1000,
    merge_logs: bool('pm2-cfg-mergelogs'),
    time: bool('pm2-cfg-time'),
    error_file: val('pm2-cfg-errfile').trim() || 'logs/pm2-error.log',
    out_file: val('pm2-cfg-outfile').trim() || 'logs/pm2-out.log',
    env_extra: textToEnvExtra(val('pm2-cfg-envextra')),
    preferred_runner: val('pm2-cfg-preferred') === 'pm2' ? 'pm2' : 'gctoac',
  };
}

async function renderPm2() {
  const st = await api('/pm2/status');
  const d = st.data || {};
  const app = d.app;
  const cfg = d.config || {};
  const holders = d.portHolders || {};
  const portBusy = (holders.pids && holders.pids.length > 0) || false;
  const msg = formatPm2Message(d);
  let logsText = '';
  let logsMeta = null;
  try {
    const lg = await api('/pm2/logs?lines=80');
    logsText = (lg.data?.stdout || '') + (lg.data?.stderr ? '\n' + lg.data.stderr : '');
    logsMeta = lg.data || null;
  } catch (e) {
    logsText = e.message || '';
  }
  if (d.lastError) {
    logsText = `===== last errors =====\n${d.lastError}\n\n${logsText}`;
  }
  const logFiles = logsMeta?.files || [];
  const logSizeLine = logFiles.length
    ? logFiles
        .filter((f) => f.exists)
        .map(
          (f) =>
            `${f.label}: ${f.size < 1024 ? f.size + ' B' : Math.round(f.size / 1024) + ' KB'}`,
        )
        .join(' · ')
    : '';
  const maxMb = logsMeta?.maxBytes
    ? Math.round(logsMeta.maxBytes / (1024 * 1024))
    : 5;
  const keepKb = logsMeta?.keepBytes
    ? Math.round(logsMeta.keepBytes / 1024)
    : 512;

  const statusRaw = app?.status || '—';
  const statusLabel =
    statusRaw === 'online'
      ? t('pm2.statusOnline')
      : statusRaw === 'errored'
        ? t('pm2.statusErrored')
        : statusRaw === 'stopped'
          ? t('pm2.statusStopped')
          : statusRaw;
  const statusBadge =
    statusRaw === 'online'
      ? `<span class="badge success">${escapeHtml(statusLabel)}</span>`
      : statusRaw === 'errored'
        ? `<span class="badge error">${escapeHtml(statusLabel)}</span>`
        : escapeHtml(statusLabel);

  const canStart = d.available;
  const canControl = d.available && app;
  const runner = d.runner || 'unknown';
  const isWarnOnly =
    msg &&
    statusRaw !== 'errored' &&
    d.available !== false &&
    d.messageKey !== 'pm2.msgErrored';

  const envExtraText = envExtraToText(cfg.env_extra);
  const tab =
    state.pm2Tab === 'port' ||
    state.pm2Tab === 'config' ||
    state.pm2Tab === 'logs' ||
    state.pm2Tab === 'runner'
      ? state.pm2Tab
      : 'runner';
  state.pm2Tab = tab;

  const kpiGrid = `
    <div class="grid pm2-kpi-grid" id="pm2-kpi-grid">
      <div class="card">
        <div class="label">${escapeHtml(t('pm2.app'))}</div>
        <div class="value value-sm">${escapeHtml(d.appName || cfg.name || 'grok-openai-gateway')}</div>
        <div class="muted card-sub">${runnerBadge(runner)}</div>
      </div>
      <div class="card">
        <div class="label">${escapeHtml(t('pm2.status'))}</div>
        <div class="value value-sm">${statusBadge}</div>
        <div class="muted card-sub">${escapeHtml(t('pm2.pid'))}: ${app?.pid && app.pid !== 0 ? app.pid : '—'}</div>
      </div>
      <div class="card">
        <div class="label">${escapeHtml(t('pm2.restarts'))}</div>
        <div class="value value-sm">${app?.restarts ?? '—'}</div>
        <div class="muted card-sub">CPU ${app?.cpu != null ? app.cpu + '%' : '—'} · ${
          app?.memory != null
            ? tf('common.mb', { n: Math.round(app.memory / 1024 / 1024) })
            : '—'
        }</div>
      </div>
      <div class="card">
        <div class="label">${escapeHtml(t('pm2.port'))}</div>
        <div class="value value-sm">${d.port ?? '—'}</div>
        <div class="muted card-sub">${escapeHtml(t('pm2.portBusy'))}: ${portBusy ? t('common.yes') : t('common.no')}</div>
      </div>
    </div>`;

  const runnerPane = `
    <div class="panel data-table-panel pm2-section-panel">
      <div class="panel-h">
        <div class="panel-h-text">
          <strong>${escapeHtml(t('pm2.switchTitle'))}</strong>
          <span class="muted panel-h-sub">${escapeHtml(t('pm2.switchHint'))}</span>
        </div>
        ${runnerBadge(runner)}
      </div>
      <div class="panel-pad">
        <div class="grid">
          <div class="card"><div class="label">${escapeHtml(t('pm2.currentRunner'))}</div><div class="value value-sm">${runnerBadge(runner)}</div></div>
          <div class="card"><div class="label">${escapeHtml(t('pm2.gctoacPid'))}</div><div class="value value-sm">${d.gctoac?.running && d.gctoac?.pid ? d.gctoac.pid : '—'}</div></div>
          <div class="card"><div class="label">${escapeHtml(t('pm2.port'))}</div><div class="value value-sm">${d.port ?? '—'}</div></div>
          <div class="card"><div class="label">${escapeHtml(t('pm2.portBusy'))}</div><div class="value value-sm">${portBusy ? t('common.yes') : t('common.no')}</div></div>
        </div>
        <div class="toolbar settings-save-bar">
          <button class="btn sm" id="pm2-switch-pm2" ${!canStart ? 'disabled' : ''}>${escapeHtml(t('pm2.switchToPm2'))}</button>
          <button class="btn secondary sm" id="pm2-switch-gctoac">${escapeHtml(t('pm2.switchToGctoac'))}</button>
        </div>
      </div>
    </div>`;

  const portPane = `
    <div class="panel data-table-panel pm2-section-panel">
      <div class="panel-h">
        <div class="panel-h-text">
          <strong>${escapeHtml(t('pm2.portTitle'))}</strong>
          <span class="muted panel-h-sub">${escapeHtml(t('pm2.portHint'))}</span>
        </div>
      </div>
      <div class="panel-pad">
        <div class="form-grid">
          <label class="full">${escapeHtml(t('pm2.fieldPort'))}
            <input type="number" id="pm2-cfg-port" min="1" max="65535" step="1" value="${escapeHtml(String(d.port ?? 3847))}" placeholder="3847" />
            <span class="hint">${escapeHtml(t('pm2.portDefaultNote'))}</span>
          </label>
        </div>
        <div class="toolbar settings-save-bar">
          <button type="button" class="btn sm" id="pm2-port-save">${escapeHtml(t('pm2.savePort'))}</button>
          <button type="button" class="btn secondary sm" id="pm2-port-default">${escapeHtml(t('pm2.useDefaultPort'))}</button>
        </div>
      </div>
    </div>`;

  const configPane = `
    <div class="panel data-table-panel pm2-section-panel" id="pm2-config-panel">
      <div class="panel-h">
        <div class="panel-h-text">
          <strong>${escapeHtml(t('pm2.configTitle'))}</strong>
          <span class="muted panel-h-sub">${escapeHtml(t('pm2.configHint'))}</span>
        </div>
      </div>
      <div class="panel-pad">
        <div class="form-grid pm2-config-form">
          <label>${escapeHtml(t('pm2.fieldName'))}<input id="pm2-cfg-name" value="${escapeHtml(cfg.name || '')}" /></label>
          <label>${escapeHtml(t('pm2.fieldScript'))}<input id="pm2-cfg-script" value="${escapeHtml(cfg.script || 'dist/server.js')}" /></label>
          <label>${escapeHtml(t('pm2.fieldCwd'))}<input id="pm2-cfg-cwd" value="${escapeHtml(cfg.cwd || '')}" placeholder="${escapeHtml(t('pm2.phCwd'))}" /></label>
          <label>${escapeHtml(t('pm2.fieldInstances'))}<input id="pm2-cfg-instances" value="${escapeHtml(String(cfg.instances ?? 1))}" placeholder="${escapeHtml(t('pm2.phInstances'))}" /></label>
          <label>${escapeHtml(t('pm2.fieldExecMode'))}
            <select id="pm2-cfg-exec">
              <option value="fork" ${cfg.exec_mode !== 'cluster' ? 'selected' : ''}>${escapeHtml(t('pm2.modeFork'))}</option>
              <option value="cluster" ${cfg.exec_mode === 'cluster' ? 'selected' : ''}>${escapeHtml(t('pm2.modeCluster'))}</option>
            </select>
          </label>
          <label>${escapeHtml(t('pm2.fieldMaxMem'))}<input id="pm2-cfg-maxmem" value="${escapeHtml(cfg.max_memory_restart || '512M')}" /></label>
          <label>${escapeHtml(t('pm2.fieldMaxRestarts'))}<input id="pm2-cfg-maxrestarts" type="number" value="${escapeHtml(String(cfg.max_restarts ?? 10))}" /></label>
          <label>${escapeHtml(t('pm2.fieldMinUptime'))}<input id="pm2-cfg-minuptime" value="${escapeHtml(String(cfg.min_uptime ?? '5s'))}" /></label>
          <label>${escapeHtml(t('pm2.fieldRestartDelay'))}<input id="pm2-cfg-restartdelay" type="number" value="${escapeHtml(String(cfg.restart_delay ?? 2000))}" /></label>
          <label>${escapeHtml(t('pm2.fieldBackoff'))}<input id="pm2-cfg-backoff" type="number" value="${escapeHtml(String(cfg.exp_backoff_restart_delay ?? 1000))}" /></label>
          <label>${escapeHtml(t('pm2.fieldErrorFile'))}<input id="pm2-cfg-errfile" value="${escapeHtml(cfg.error_file || 'logs/pm2-error.log')}" /></label>
          <label>${escapeHtml(t('pm2.fieldOutFile'))}<input id="pm2-cfg-outfile" value="${escapeHtml(cfg.out_file || 'logs/pm2-out.log')}" /></label>
          <label>${escapeHtml(t('pm2.fieldPreferred'))}
            <select id="pm2-cfg-preferred">
              <option value="gctoac" ${cfg.preferred_runner !== 'pm2' ? 'selected' : ''}>gctoac</option>
              <option value="pm2" ${cfg.preferred_runner === 'pm2' ? 'selected' : ''}>pm2</option>
            </select>
          </label>
          <label class="check"><input type="checkbox" id="pm2-cfg-autorestart" ${cfg.autorestart !== false ? 'checked' : ''}/> ${escapeHtml(t('pm2.fieldAutorestart'))}</label>
          <label class="check"><input type="checkbox" id="pm2-cfg-watch" ${cfg.watch ? 'checked' : ''}/> ${escapeHtml(t('pm2.fieldWatch'))}</label>
          <label class="check"><input type="checkbox" id="pm2-cfg-mergelogs" ${cfg.merge_logs !== false ? 'checked' : ''}/> ${escapeHtml(t('pm2.fieldMergeLogs'))}</label>
          <label class="check"><input type="checkbox" id="pm2-cfg-time" ${cfg.time !== false ? 'checked' : ''}/> ${escapeHtml(t('pm2.fieldTime'))}</label>
          <label class="full">${escapeHtml(t('pm2.fieldEnvExtra'))}<textarea id="pm2-cfg-envextra" rows="4" placeholder="${escapeHtml(t('pm2.phEnv'))}">${escapeHtml(envExtraText)}</textarea></label>
        </div>
        <div class="toolbar settings-save-bar">
          <button class="btn sm" id="pm2-cfg-save">${escapeHtml(t('pm2.saveConfig'))}</button>
          <button class="btn secondary sm" id="pm2-cfg-save-only">${escapeHtml(t('pm2.saveOnly'))}</button>
          <button class="btn secondary sm" id="pm2-cfg-reset">${escapeHtml(t('pm2.resetConfig'))}</button>
        </div>
      </div>
    </div>`;

  const logsPane = `
    <div class="panel data-table-panel pm2-section-panel pm2-logs-panel">
      <div class="panel-h">
        <div class="panel-h-text">
          <strong>${escapeHtml(t('pm2.logs'))}</strong>
          <span class="muted panel-h-sub">${escapeHtml(t('pm2.logsHint'))}</span>
        </div>
        <div class="toolbar">
          <button type="button" class="btn secondary sm" id="pm2-logs-refresh">${escapeHtml(t('pm2.refresh'))}</button>
          <button type="button" class="btn danger sm" id="pm2-logs-clear">${escapeHtml(t('pm2.clearLogs'))}</button>
        </div>
      </div>
      <div class="panel-pad">
        <p class="muted" style="margin:0 0 8px;font-size:0.82rem">
          ${escapeHtml(tf('pm2.logsAutoTrim', { maxMb, keepKb }))}
          ${logSizeLine ? ` · ${escapeHtml(logSizeLine)}` : ''}
        </p>
        <pre class="pre pre-logs" id="pm2-logs-pre">${escapeHtml(logsText || t('common.empty'))}</pre>
      </div>
    </div>`;

  document.getElementById('app').innerHTML = shell(`
    <div class="topbar">
      <h2>${escapeHtml(t('pm2.title'))}</h2>
      <div class="toolbar">
        <button class="btn secondary sm" id="pm2-refresh">${escapeHtml(t('pm2.refresh'))}</button>
        <button class="btn sm" id="pm2-start" ${!canStart ? 'disabled' : ''}>${escapeHtml(t('pm2.start'))}</button>
        <button class="btn secondary sm" id="pm2-stop" ${!canControl ? 'disabled' : ''}>${escapeHtml(t('pm2.stop'))}</button>
        <button class="btn sm" id="pm2-restart" ${!canStart ? 'disabled' : ''}>${escapeHtml(t('pm2.restart'))}</button>
        <button class="btn secondary sm" id="pm2-reload" ${!canControl || app?.status !== 'online' ? 'disabled' : ''}>${escapeHtml(t('pm2.reload'))}</button>
      </div>
    </div>
    ${pageMetaHtml([t('pm2.hint')])}
    ${
      msg
        ? `<div class="error-box${isWarnOnly ? ' warn-box' : ''}">${escapeHtml(msg)}</div>`
        : !d.available
          ? `<div class="error-box">${escapeHtml(t('pm2.unavailable'))}</div>`
          : ''
    }
    ${kpiGrid}

    <div class="usage-tabs-panel panel pm2-tabs-panel">
      <div class="seg-tabs" role="tablist" aria-label="${escapeHtml(t('pm2.title'))}">
        <button type="button" role="tab" class="seg-tab ${tab === 'runner' ? 'is-active' : ''}" data-pm2-tab="runner" aria-selected="${tab === 'runner'}">
          ${escapeHtml(t('pm2.tabRunner'))}
        </button>
        <button type="button" role="tab" class="seg-tab ${tab === 'port' ? 'is-active' : ''}" data-pm2-tab="port" aria-selected="${tab === 'port'}">
          ${escapeHtml(t('pm2.tabPort'))}
        </button>
        <button type="button" role="tab" class="seg-tab ${tab === 'config' ? 'is-active' : ''}" data-pm2-tab="config" aria-selected="${tab === 'config'}">
          ${escapeHtml(t('pm2.tabConfig'))}
        </button>
        <button type="button" role="tab" class="seg-tab ${tab === 'logs' ? 'is-active' : ''}" data-pm2-tab="logs" aria-selected="${tab === 'logs'}">
          ${escapeHtml(t('pm2.tabLogs'))}
        </button>
      </div>
      <div class="usage-tab-body">
        <div class="usage-tab-pane pm2-tab-pane" id="pm2-tab-runner" ${tab === 'runner' ? '' : 'hidden'}>
          ${runnerPane}
        </div>
        <div class="usage-tab-pane pm2-tab-pane" id="pm2-tab-port" ${tab === 'port' ? '' : 'hidden'}>
          ${portPane}
        </div>
        <div class="usage-tab-pane pm2-tab-pane" id="pm2-tab-config" ${tab === 'config' ? '' : 'hidden'}>
          ${configPane}
        </div>
        <div class="usage-tab-pane pm2-tab-pane" id="pm2-tab-logs" ${tab === 'logs' ? '' : 'hidden'}>
          ${logsPane}
        </div>
      </div>
    </div>
  `);
  bindShell();

  document.querySelectorAll('[data-pm2-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const raw = btn.getAttribute('data-pm2-tab') || 'runner';
      const next =
        raw === 'port' || raw === 'config' || raw === 'logs' || raw === 'runner'
          ? raw
          : 'runner';
      if (state.pm2Tab === next) return;
      state.pm2Tab = next;
      renderPm2().catch(onErr);
    });
  });

  document.getElementById('pm2-logs-refresh')?.addEventListener('click', () => {
    state.pm2Tab = 'logs';
    renderPm2().catch(onErr);
  });
  document.getElementById('pm2-logs-clear')?.addEventListener('click', async () => {
    if (
      !(await uiConfirm({
        message: t('pm2.confirmClearLogs'),
        variant: 'danger',
        confirmText: t('pm2.clearLogs'),
      }))
    )
      return;
    try {
      const res = await api('/pm2/logs/clear', {
        method: 'POST',
        body: JSON.stringify({ which: 'all' }),
      });
      const n = res.data?.cleared?.length || 0;
      await uiAlert({
        message: tf('pm2.logsCleared', { n }),
      });
      renderPm2().catch(onErr);
    } catch (e) {
      onErr(e);
    }
  });

  const doSwitch = async (mode) => {
    const okConfirm = await uiConfirm({
      message:
        mode === 'pm2' ? t('pm2.confirmSwitchPm2') : t('pm2.confirmSwitchGctoac'),
      variant: 'confirm',
      confirmText:
        mode === 'pm2' ? t('pm2.switchToPm2') : t('pm2.switchToGctoac'),
    });
    if (!okConfirm) return;
    try {
      const res = await api('/pm2/switch', {
        method: 'POST',
        body: JSON.stringify({ mode }),
      });
      const payload = res?.data || res || {};
      const alertMsg = buildPm2SwitchAlertMessage(
        mode === 'pm2' ? 'pm2' : 'gctoac',
        payload,
      );
      // Auto F5 after 10s (server restarts under new runner)
      scheduleAdminReload(10);
      await uiAlert({
        title: t('common.notice'),
        message: alertMsg,
        confirmText: t('common.ok'),
      });
      // If user confirms early, reload immediately
      try {
        window.location.reload();
      } catch {
        window.location.href = window.location.href;
      }
    } catch (e) {
      onErr(e);
    }
  };

  document.getElementById('pm2-refresh').onclick = () => renderPm2().catch(onErr);
  document.getElementById('pm2-switch-pm2').onclick = () => doSwitch('pm2');
  document.getElementById('pm2-switch-gctoac').onclick = () => doSwitch('gctoac');
  document.getElementById('pm2-start').onclick = () => doSwitch('pm2');
  document.getElementById('pm2-stop').onclick = async () => {
    if (
      !(await uiConfirm({
        message: t('pm2.confirmStop'),
        variant: 'danger',
        confirmText: t('pm2.stop'),
      }))
    )
      return;
    try {
      await api('/pm2/stop', { method: 'POST', body: '{}' });
      renderPm2().catch(onErr);
    } catch (e) {
      onErr(e);
    }
  };
  document.getElementById('pm2-restart').onclick = async () => {
    if (
      !(await uiConfirm({
        message: t('pm2.confirmRestart'),
        variant: 'confirm',
        confirmText: t('pm2.restart'),
      }))
    )
      return;
    try {
      await doSwitch('pm2');
    } catch (e) {
      onErr(e);
    }
  };
  document.getElementById('pm2-reload').onclick = async () => {
    try {
      await api('/pm2/reload', { method: 'POST', body: '{}' });
      renderPm2().catch(onErr);
    } catch (e) {
      onErr(e);
    }
  };

  const saveCfg = async (restart) => {
    try {
      const body = { ...readPm2ConfigForm(), restart };
      if (body.port == null) {
        await uiAlert({ message: t('pm2.portInvalid') });
        return;
      }
      const res = await api('/pm2/config', {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      if (res.data?.scheduled) {
        const portMsg = res.data.portChange
          ? `\n${tf('pm2.portChangedMsg', { from: res.data.portChange.previous, to: res.data.portChange.port })}`
          : '';
        const scheduledBody =
          formatPm2Message(res.data.scheduled) ||
          t('pm2.switchScheduled');
        scheduleAdminReload(10);
        await uiAlert({
          title: t('common.notice'),
          message:
            scheduledBody +
            portMsg +
            `\n${tf('pm2.autoRefreshIn', { n: 10 })}`,
        });
        try {
          window.location.reload();
        } catch {
          window.location.href = window.location.href;
        }
      } else {
        await uiAlert(
          res.data?.portChange
            ? tf('pm2.portSavedNeedRestart', {
                port: res.data.port,
              })
            : t('pm2.configSaved'),
        );
        renderPm2().catch(onErr);
      }
    } catch (e) {
      onErr(e);
    }
  };
  document.getElementById('pm2-cfg-save').onclick = () => saveCfg(true);
  document.getElementById('pm2-cfg-save-only').onclick = () => saveCfg(false);

  document.getElementById('pm2-port-default')?.addEventListener('click', () => {
    const el = document.getElementById('pm2-cfg-port');
    if (el) el.value = '3847';
  });
  document.getElementById('pm2-port-save')?.addEventListener('click', async () => {
    const port = Number(document.getElementById('pm2-cfg-port')?.value);
    if (!Number.isFinite(port) || port < 1 || port > 65535) {
      await uiAlert({ message: t('pm2.portInvalid') });
      return;
    }
    if (
      !(await uiConfirm({
        message: tf('pm2.confirmPortChange', { port }),
        variant: 'confirm',
        confirmText: t('pm2.savePort'),
      }))
    )
      return;
    try {
      const res = await api('/pm2/config', {
        method: 'PUT',
        body: JSON.stringify({ port, restart: true }),
      });
      const base =
        res.data?.scheduled?.message ||
        (res.data?.portChange
          ? tf('pm2.portChangedMsg', {
              from: res.data.portChange.previous,
              to: res.data.portChange.port,
            })
          : t('pm2.configSaved'));
      await uiAlert(base + '\n' + tf('pm2.portAfterRestart', { port }));
    } catch (e) {
      onErr(e);
    }
  });
  document.getElementById('pm2-cfg-reset').onclick = async () => {
    if (
      !(await uiConfirm({
        message: t('pm2.confirmReset'),
        variant: 'danger',
        confirmText: t('pm2.resetConfig'),
      }))
    )
      return;
    try {
      await api('/pm2/config/reset', { method: 'POST', body: '{}' });
      renderPm2().catch(onErr);
    } catch (e) {
      onErr(e);
    }
  };
}


/**
 * @typedef {{ role: string, content: string, reasoning?: string, streaming?: boolean, error?: boolean, docs?: { id: string, name: string }[] }} ChatMsg
 */
/** @type {ChatMsg[]} */
let chatMessages = [];
/** @type {AbortController | null} */
let chatAbort = null;
/** Pending attachments for next send: { id, name, mime, size } */
let chatPendingDocs = [];
/** True while LLM compress is in flight */
let chatCompressing = false;
/** How many older messages are folded (render window) */
let chatRenderSkip = 0;
/** @type {Map<string, string>} */
const chatMdCache = new Map();

/** UI prefs preserved across re-renders */
const chatUi = {
  /** selected API key id; empty = signed-in admin key */
  keyId: '',
  model: '',
  reasoning: true,
  /** optional system prompt (sent every turn, not stored in chat history bubbles) */
  systemPrompt: '',
  systemOpen: false,
};

/**
 * Context policy for API turns — does NOT rewrite chatMessages.
 * @type {{ mode: 'full'|'summary'|'recent', recentN: number, summary: string, summaryAt: string|null, summarySourceCount: number }}
 */
const chatContext = {
  mode: 'full',
  recentN: 6,
  summary: '',
  summaryAt: null,
  summarySourceCount: 0,
};

const CHAT_COMPRESS_MIN_MSGS = 3;
const CHAT_RENDER_WINDOW = 40;
const CHAT_RENDER_STEP = 20;
const CHAT_CONTENT_COLLAPSE = 2200;

/** Persisted multi-turn conversation session (playground) */
const chatSession = {
  conversationId: null,
  historyPage: 0,
  historyLimit: 20,
  historyQ: '',
  historyTotal: 0,
  historyItems: [],
  historyLoading: false,
  historyOpenMobile: false,
  saving: false,
  saveQueued: false,
  /** conversation id currently editing title inline */
  renamingId: null,
};
/** @type {ReturnType<typeof setTimeout> | null} */
let chatHistorySearchTimer = null;

const CHAT_MAX_DOCS = 10;

/** UUID v1–v8 (loose) — match backend z.string().uuid() */
const DOC_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function chatFileExt(name) {
  const base = String(name || '').split(/[/\\]/).pop() || '';
  const i = base.lastIndexOf('.');
  if (i < 0) return '';
  return base.slice(i).toLowerCase();
}

function isChatAllowedFilename(name) {
  return CHAT_ALLOWED_EXTENSIONS.has(chatFileExt(name));
}

function chatFormatsShort() {
  return t('chat.formatsHint');
}

function resetChatContext() {
  chatContext.mode = 'full';
  chatContext.recentN = 6;
  chatContext.summary = '';
  chatContext.summaryAt = null;
  chatContext.summarySourceCount = 0;
  chatRenderSkip = 0;
  chatMdCache.clear();
}

function conversationDisplayTitle(item) {
  const title = (item?.title || '').trim();
  if (title) return title;
  const preview = (item?.preview || '').trim();
  if (preview) return preview;
  return t('chat.untitled');
}

function messagesForSave() {
  return chatMessages
    .filter((m) => !m.streaming)
    .map((m) => {
      /** @type {{ role: string, content: string, reasoning?: string, docs?: {id:string,name:string}[], error?: boolean }} */
      const out = {
        role: m.role,
        content: m.content || '',
      };
      if (m.reasoning) out.reasoning = m.reasoning;
      if (m.docs && m.docs.length) out.docs = m.docs;
      if (m.error) out.error = true;
      return out;
    });
}

function contextPayloadForSave() {
  return {
    contextMode: chatContext.mode,
    contextRecentN: chatContext.recentN,
    summaryText: chatContext.summary || '',
    summaryAt: chatContext.summaryAt,
    summarySourceCount: chatContext.summarySourceCount || 0,
  };
}

function applyContextFromApi(data) {
  if (!data) return;
  chatContext.mode =
    data.contextMode === 'summary' || data.contextMode === 'recent'
      ? data.contextMode
      : 'full';
  chatContext.recentN = Math.min(
    40,
    Math.max(2, Number(data.contextRecentN) || 6),
  );
  chatContext.summary = (data.summaryText || '').trim();
  chatContext.summaryAt = data.summaryAt || null;
  chatContext.summarySourceCount = Number(data.summarySourceCount) || 0;
  if (chatContext.mode === 'summary' && !chatContext.summary) {
    chatContext.mode = 'full';
  }
}

function chatMessageChars(msgs) {
  return msgs.reduce(
    (n, m) => n + (m.content || '').length + (m.reasoning || '').length,
    0,
  );
}

function chatCompressEligible() {
  const ready = chatMessages.filter((m) => !m.streaming);
  if (ready.length < 2) return false;
  if (ready.length >= CHAT_COMPRESS_MIN_MSGS) return true;
  return chatMessageChars(ready) >= 800;
}

/**
 * Build messages array for playground API based on context policy.
 * Full history stays in chatMessages / UI.
 */
function buildApiMessages() {
  const systemBase = (chatUi.systemPrompt || '').trim();
  const ready = chatMessages.filter((m) => !m.streaming);
  const n = Math.min(
    40,
    Math.max(2, Number(chatContext.recentN) || 6),
  );

  /** @type {{ role: string, content: string }[]} */
  let slice = ready.map((m) => ({
    role: m.role,
    content: m.content || '',
  }));

  let system = systemBase;

  if (chatContext.mode === 'summary' && chatContext.summary) {
    const summaryBlock =
      (getLocale() === 'zh-Hant'
        ? '【先前對話摘要 — 僅供延續語境，完整記錄仍在用戶介面】\n'
        : '[Prior conversation summary — full history remains in the UI]\n') +
      chatContext.summary;
    system = system
      ? `${system}\n\n${summaryBlock}`
      : summaryBlock;
    // Prefer messages after summary was made; else last N
    const after = ready.slice(chatContext.summarySourceCount || 0);
    const tailSrc = after.length ? after : ready.slice(-n);
    slice = tailSrc.slice(-n).map((m) => ({
      role: m.role,
      content: m.content || '',
    }));
  } else if (chatContext.mode === 'recent') {
    slice = ready.slice(-n).map((m) => ({
      role: m.role,
      content: m.content || '',
    }));
  }

  /** @type {{ role: string, content: string }[]} */
  const api = slice.map((m) => ({ role: m.role, content: m.content }));
  if (system) api.unshift({ role: 'system', content: system });
  return api;
}

function contextModeLabel() {
  if (chatContext.mode === 'summary' && chatContext.summary) {
    return tf('chat.ctxModeSummaryLabel', { n: chatContext.recentN });
  }
  if (chatContext.mode === 'recent') {
    return tf('chat.ctxModeRecentLabel', { n: chatContext.recentN });
  }
  return t('chat.ctxModeFullLabel');
}

function updateChatCompressButton() {
  const btn = document.getElementById('chat-compress');
  if (!btn) return;
  const streaming = chatMessages.some((m) => m.streaming);
  const busy = Boolean(chatAbort) || chatCompressing || streaming;
  const ok = chatCompressEligible();
  btn.disabled = busy || !ok;
  btn.textContent = chatCompressing ? t('chat.compressing') : t('chat.compress');
  btn.title = !ok ? t('chat.compressNeedMore') : t('chat.compress');
  paintContextBanner();
  syncContextControls();
}

function syncContextControls() {
  const modeEl = document.getElementById('chat-ctx-mode');
  const nEl = document.getElementById('chat-ctx-n');
  if (modeEl) {
    const m =
      chatContext.mode === 'summary' && !chatContext.summary
        ? 'full'
        : chatContext.mode;
    modeEl.value = m;
    // disable summary option if no summary
    const optSum = modeEl.querySelector('option[value="summary"]');
    if (optSum) optSum.disabled = !chatContext.summary;
  }
  if (nEl) {
    nEl.value = String(chatContext.recentN);
    nEl.disabled = chatContext.mode === 'full';
  }
}

function paintContextBanner() {
  const host = document.getElementById('chat-compress-banner');
  if (!host) return;
  const hasSummary = Boolean(chatContext.summary);
  const longThread =
    chatMessages.filter((m) => !m.streaming).length > 40 ||
    chatMessageChars(chatMessages) > 60000;

  if (!hasSummary && chatContext.mode === 'full' && !longThread) {
    host.hidden = true;
    host.innerHTML = '';
    return;
  }

  host.hidden = false;
  const preview = hasSummary
    ? chatContext.summary.length > 160
      ? `${chatContext.summary.slice(0, 159)}…`
      : chatContext.summary
    : '';
  const warn = longThread
    ? `<p class="chat-compress-warn">${escapeHtml(t('chat.ctxLongHint'))}</p>`
    : '';

  host.innerHTML = `
    <div class="chat-compress-banner-inner">
      <div class="chat-compress-banner-text">
        <strong>${escapeHtml(t('chat.ctxPolicyTitle'))}</strong>
        <span class="muted">${escapeHtml(contextModeLabel())}</span>
        <p class="chat-compress-remark">${escapeHtml(t('chat.ctxRemark'))}</p>
        ${preview ? `<p class="chat-compress-preview">${escapeHtml(preview)}</p>` : ''}
        ${warn}
      </div>
      <div class="chat-compress-banner-actions">
        ${
          hasSummary
            ? `<button type="button" class="btn secondary sm" id="chat-summary-view">${escapeHtml(t('chat.compressView'))}</button>`
            : ''
        }
      </div>
    </div>`;
  document.getElementById('chat-summary-view')?.addEventListener('click', () => {
    openSummaryPopup();
  });
}

async function openSummaryPopup() {
  if (!chatContext.summary) {
    showError(t('chat.compressNeedSummary'));
    return;
  }
  const when = chatContext.summaryAt
    ? fmtTime(chatContext.summaryAt)
    : '—';
  const bodyHtml = formatChatMarkdown(chatContext.summary);
  // Custom large dialog
  if (uiDialogRoot) closeUiDialog(false);
  const root = document.createElement('div');
  root.className = 'ui-dialog-back';
  root.id = 'ui-dialog-back';
  root.dataset.cancelable = '1';
  root.innerHTML = `
    <div class="ui-dialog ui-dialog--info ui-dialog--large" role="dialog" aria-modal="true">
      <div class="ui-dialog-h">
        <div class="ui-dialog-icon" aria-hidden="true">Σ</div>
        <h3 class="ui-dialog-title">${escapeHtml(t('chat.compressResultTitle'))}</h3>
      </div>
      <div class="ui-dialog-body ui-dialog-body--md">
        <p class="muted" style="margin:0 0 10px">${escapeHtml(tf('chat.summaryMeta', { when, n: chatContext.summarySourceCount }))}</p>
        <div class="chat-content md">${bodyHtml}</div>
      </div>
      <div class="ui-dialog-actions">
        <button type="button" class="btn secondary sm" id="ui-dialog-copy">${escapeHtml(t('chat.copy'))}</button>
        <button type="button" class="btn sm" id="ui-dialog-ok">${escapeHtml(t('common.ok'))}</button>
      </div>
    </div>`;
  document.body.appendChild(root);
  document.body.classList.add('ui-dialog-open');
  uiDialogRoot = root;
  document.addEventListener('keydown', onUiDialogKeydown, true);
  return new Promise((resolve) => {
    uiDialogResolve = resolve;
    const finish = () => closeUiDialog(true);
    root.querySelector('#ui-dialog-ok')?.addEventListener('click', finish);
    root.addEventListener('click', (e) => {
      if (e.target === root) finish();
    });
    root.querySelector('#ui-dialog-copy')?.addEventListener('click', async () => {
      const ok = await copyTextToClipboard(chatContext.summary);
      const b = root.querySelector('#ui-dialog-copy');
      if (ok && b) {
        b.textContent = t('chat.copied');
        setTimeout(() => {
          if (b.isConnected) b.textContent = t('chat.copy');
        }, 1500);
      }
    });
  });
}

function buildCompressTranscript(msgs) {
  return msgs
    .map((m) => {
      const role = m.role || 'user';
      let body = (m.content || '').trim();
      if (m.docs && m.docs.length) {
        const names = m.docs.map((d) => d.name).join(', ');
        body = body
          ? `${body}\n[attachments: ${names}]`
          : `[attachments: ${names}]`;
      }
      if (body.length > 5000) body = `${body.slice(0, 4999)}…`;
      return `${role}: ${body}`;
    })
    .join('\n\n');
}

function compressSystemPrompt() {
  if (getLocale() === 'zh-Hant') {
    return [
      '你是對話摘要助手。只輸出精簡摘要，不要使用任何工具、不要上網、不要反問。',
      '若已有舊摘要，請合併更新為一份。',
      '請用繁體中文（或對齊原對話語言）條列：',
      '1) 主題與目標 2) 已確定事實／決定 3) 未完成事項 4) 用戶偏好或約束',
      '控制在約 600–1000 字。不要大段複製原文。只輸出摘要正文。',
    ].join('\n');
  }
  return [
    'You are a conversation summary assistant. Output only a concise summary.',
    'Merge any prior summary into one updated summary. No tools, no browsing, no questions.',
    'Cover: (1) topics/goals (2) facts/decisions (3) open items (4) preferences.',
    'Keep under ~600–1000 words. Summary body only.',
  ].join('\n');
}

/**
 * Generate summary for context policy — never mutates chatMessages.
 */
async function compressChatHistory() {
  if (chatCompressing || chatAbort || chatMessages.some((m) => m.streaming)) {
    showError(t('chat.compressBusy'));
    return;
  }
  const ready = chatMessages.filter((m) => !m.streaming);
  if (!chatCompressEligible()) {
    showError(t('chat.compressNeedMore'));
    return;
  }
  if (
    !(await uiConfirm({
      title: t('chat.compress'),
      message: t('chat.compressConfirm'),
      variant: 'confirm',
      confirmText: t('chat.compress'),
    }))
  )
    return;

  const auth = playgroundAuthKey();
  if (!auth) {
    showError(t('chat.needKey'));
    return;
  }

  captureChatUi();
  chatCompressing = true;
  updateChatCompressButton();
  const sendBtn = document.getElementById('chat-send');
  if (sendBtn) sendBtn.disabled = true;
  const st = document.getElementById('chat-stream-status');
  if (st) {
    st.hidden = false;
    st.textContent = t('chat.compressing');
  }

  try {
    // Include previous summary in input so re-compress merges
    let transcript = buildCompressTranscript(ready);
    if (chatContext.summary) {
      transcript =
        (getLocale() === 'zh-Hant'
          ? `先前摘要：\n${chatContext.summary}\n\n完整對話：\n`
          : `Prior summary:\n${chatContext.summary}\n\nFull conversation:\n`) +
        transcript;
    }

    const model =
      document.getElementById('chat-model')?.value ||
      chatUi.model ||
      'grok-4.5';
    const asKeyId = playgroundKeyId();
    const body = {
      model,
      stream: false,
      include_reasoning: false,
      messages: [
        { role: 'system', content: compressSystemPrompt() },
        {
          role: 'user',
          content:
            (getLocale() === 'zh-Hant'
              ? '請為以下對話產生摘要（僅供之後回合作為語境，不會刪除用戶介面中的記錄）：\n\n'
              : 'Summarize the following conversation (for later context only; UI history is kept):\n\n') +
            transcript,
        },
      ],
    };
    const realKeyId = playgroundRealApiKeyId();
    if (realKeyId) body.apiKeyId = realKeyId;

    const res = await fetch('/admin/api/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errText = await res.text();
      let msg = errText;
      try {
        const j = JSON.parse(errText);
        msg = j.error?.message || errText;
      } catch {
        /* */
      }
      throw new Error(msg || t('chat.compressFail'));
    }
    const json = await res.json();
    let summary =
      json?.choices?.[0]?.message?.content ||
      json?.choices?.[0]?.delta?.content ||
      '';
    if (typeof summary !== 'string') summary = String(summary || '');
    summary = summary
      .trim()
      .replace(/^【對話摘要】\s*/u, '')
      .replace(/^\[Conversation summary\]\s*/i, '');
    if (!summary) throw new Error(t('chat.compressFail'));

    chatContext.summary = summary;
    chatContext.summaryAt = new Date().toISOString();
    chatContext.summarySourceCount = ready.length;
    chatContext.mode = 'summary';
    // history untouched
    paintContextBanner();
    syncContextControls();
    showError('');
    if (st) {
      st.hidden = false;
      st.textContent = t('chat.compressOk');
      setTimeout(() => {
        const s2 = document.getElementById('chat-stream-status');
        if (s2 && s2.textContent === t('chat.compressOk')) {
          s2.hidden = true;
          s2.textContent = '';
        }
      }, 2800);
    }
    await saveConversation().catch(() => {});
    await openSummaryPopup();
  } catch (e) {
    showError(e.message || t('chat.compressFail'));
  } finally {
    chatCompressing = false;
    updateChatCompressButton();
    if (sendBtn) sendBtn.disabled = false;
    if (st && st.textContent === t('chat.compressing')) {
      st.hidden = true;
      st.textContent = '';
    }
  }
}

function setChatHistoryMobileOpen(open) {
  chatSession.historyOpenMobile = Boolean(open);
  document.body.classList.toggle('chat-history-open', chatSession.historyOpenMobile);
}

function closeChatHistoryMobile() {
  setChatHistoryMobileOpen(false);
}

async function loadConversationList() {
  if (!state.key) return;
  chatSession.historyLoading = true;
  paintChatHistoryList();
  try {
    const offset = chatSession.historyPage * chatSession.historyLimit;
    const params = new URLSearchParams({
      limit: String(chatSession.historyLimit),
      offset: String(offset),
    });
    if (chatSession.historyQ.trim()) {
      params.set('q', chatSession.historyQ.trim());
    }
    const res = await api(`/conversations?${params}`);
    chatSession.historyItems = res.data || [];
    chatSession.historyTotal = res.total ?? 0;
  } catch (e) {
    chatSession.historyItems = [];
    chatSession.historyTotal = 0;
    // soft fail — rail stays usable
    console.warn(e);
  } finally {
    chatSession.historyLoading = false;
    paintChatHistoryList();
  }
}

function paintChatHistoryList() {
  const list = document.getElementById('chat-history-list');
  const pager = document.getElementById('chat-history-pager');
  if (!list) return;

  if (chatSession.historyLoading && !chatSession.historyItems.length) {
    list.innerHTML = `<li class="chat-history-empty">${escapeHtml(t('common.loading'))}</li>`;
  } else if (!chatSession.historyItems.length) {
    list.innerHTML = `<li class="chat-history-empty">${escapeHtml(t('chat.historyEmpty'))}</li>`;
  } else {
    list.innerHTML = chatSession.historyItems
      .map((item) => {
        const active =
          chatSession.conversationId === item.id ? ' is-active' : '';
        const title = conversationDisplayTitle(item);
        const preview =
          item.title && item.preview && item.preview !== item.title
            ? item.preview
            : item.model || tf('chat.msgs', { n: item.messageCount || 0 });
        const isRenaming = chatSession.renamingId === item.id;
        // Prefill with what the user currently sees (custom title or preview/untitled)
        const editValue = title;
        const bodyInner = isRenaming
          ? `<input type="text" class="chat-history-title-input" data-title-input="${escapeHtml(item.id)}" value="${escapeHtml(editValue)}" maxlength="120" placeholder="${escapeHtml(t('chat.renamePh'))}" aria-label="${escapeHtml(t('chat.renamePh'))}" />
            <span class="preview">${escapeHtml(preview || '—')}</span>
            <span class="meta"><span>${escapeHtml(fmtTime(item.updatedAt))}</span></span>`
          : `<span class="title" data-title-label="${escapeHtml(item.id)}" title="${escapeHtml(t('chat.rename'))}">${escapeHtml(title)}</span>
            <span class="preview">${escapeHtml(preview || '—')}</span>
            <span class="meta"><span>${escapeHtml(fmtTime(item.updatedAt))}</span></span>`;
        // Never put <input> inside <button> — invalid HTML
        const main = isRenaming
          ? `<div class="chat-history-item${active} is-editing" data-conv-body="${escapeHtml(item.id)}">${bodyInner}</div>`
          : `<div class="chat-history-item${active}" data-open-conv="${escapeHtml(item.id)}" role="button" tabindex="0" title="${escapeHtml(title)}">${bodyInner}</div>`;
        return `
        <li class="chat-history-row${active}${isRenaming ? ' is-renaming' : ''}" data-conv-row="${escapeHtml(item.id)}">
          ${main}
          <div class="chat-history-item-actions">
            <button type="button" class="icon-action" data-rename-conv="${escapeHtml(item.id)}" title="${escapeHtml(t('chat.rename'))}" aria-label="${escapeHtml(t('chat.rename'))}">✎</button>
            <button type="button" class="icon-action danger" data-del-conv="${escapeHtml(item.id)}" title="${escapeHtml(t('chat.deleteConversation'))}" aria-label="${escapeHtml(t('chat.deleteConversation'))}">×</button>
          </div>
        </li>`;
      })
      .join('');
  }

  if (pager) {
    const limit = chatSession.historyLimit;
    const totalPages = Math.max(1, Math.ceil(chatSession.historyTotal / limit) || 1);
    const page = Math.min(chatSession.historyPage + 1, totalPages);
    const pageLabel = tf('chat.historyPage', { n: page, total: totalPages });
    const canPrev = chatSession.historyPage > 0;
    const canNext =
      (chatSession.historyPage + 1) * limit < chatSession.historyTotal;
    pager.innerHTML = `
      <button type="button" class="btn secondary sm" id="chat-hist-prev" ${canPrev ? '' : 'disabled'}>${escapeHtml(t('chat.historyPrev'))}</button>
      <span>${escapeHtml(pageLabel)}</span>
      <button type="button" class="btn secondary sm" id="chat-hist-next" ${canNext ? '' : 'disabled'}>${escapeHtml(t('chat.historyNext'))}</button>
    `;
    const prev = document.getElementById('chat-hist-prev');
    const next = document.getElementById('chat-hist-next');
    if (prev) {
      prev.onclick = () => {
        if (chatSession.historyPage > 0) {
          chatSession.historyPage -= 1;
          loadConversationList();
        }
      };
    }
    if (next) {
      next.onclick = () => {
        if ((chatSession.historyPage + 1) * limit < chatSession.historyTotal) {
          chatSession.historyPage += 1;
          loadConversationList();
        }
      };
    }
  }

  // Single-click open (delayed) vs double-click rename — avoid open wiping the row mid-dblclick
  list.querySelectorAll('[data-open-conv]').forEach((el) => {
    const id = el.getAttribute('data-open-conv');
    if (!id) return;
    /** @type {ReturnType<typeof setTimeout> | null} */
    let openTimer = null;
    const clearOpen = () => {
      if (openTimer) {
        clearTimeout(openTimer);
        openTimer = null;
      }
    };
    el.addEventListener('click', (e) => {
      if (chatSession.renamingId) return;
      // ignore clicks that originated on action buttons (they stopPropagation too)
      if (e.target instanceof Element && e.target.closest('.chat-history-item-actions')) {
        return;
      }
      clearOpen();
      openTimer = setTimeout(() => {
        openTimer = null;
        if (chatSession.renamingId) return;
        openConversation(id);
      }, 280);
    });
    el.addEventListener('dblclick', (e) => {
      e.preventDefault();
      e.stopPropagation();
      clearOpen();
      startInlineRename(id);
    });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!chatSession.renamingId) openConversation(id);
      }
    });
  });
  // Title label: also start rename on dblclick (same as row)
  list.querySelectorAll('[data-title-label]').forEach((el) => {
    el.addEventListener('dblclick', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = el.getAttribute('data-title-label');
      if (id) startInlineRename(id);
    });
  });
  list.querySelectorAll('[data-rename-conv]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = el.getAttribute('data-rename-conv');
      if (id) startInlineRename(id);
    });
  });
  list.querySelectorAll('[data-del-conv]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = el.getAttribute('data-del-conv');
      if (id) deleteConversation(id);
    });
  });

  // Focus title input if we just entered rename mode
  if (chatSession.renamingId) {
    const rid = String(chatSession.renamingId).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const input = list.querySelector(`[data-title-input="${rid}"]`);
    if (input instanceof HTMLInputElement) {
      bindTitleInput(input, chatSession.renamingId);
      // rAF so layout is ready before select()
      requestAnimationFrame(() => {
        if (!input.isConnected) return;
        input.focus();
        input.select();
      });
    }
  }
}

/**
 * Begin inline title edit at the history list title position (no window.prompt).
 * @param {string} id
 */
function startInlineRename(id) {
  if (!id) return;
  // Cancel any other rename
  if (chatSession.renamingId && chatSession.renamingId !== id) {
    chatSession.renamingId = null;
  }
  chatSession.renamingId = id;
  paintChatHistoryList();
}

/**
 * @param {HTMLInputElement} input
 * @param {string} id
 */
function bindTitleInput(input, id) {
  let finished = false;
  const finish = async (save) => {
    if (finished) return;
    finished = true;
    const raw = input.value;
    chatSession.renamingId = null;
    if (!save) {
      paintChatHistoryList();
      return;
    }
    const title = String(raw ?? '')
      .trim()
      .slice(0, 120);
    const item = chatSession.historyItems.find((x) => x.id === id);
    const prevStored = item ? (item.title || '').trim() : '';
    // Skip only when unchanged vs stored custom title
    // (if stored empty, saving the displayed text pins it as custom title)
    if (title === prevStored) {
      paintChatHistoryList();
      return;
    }
    // Optimistic UI
    if (item) item.title = title;
    paintChatHistoryList();
    try {
      await api(`/conversations/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ title }),
      });
      await loadConversationList();
    } catch (e) {
      showError(e.message || t('chat.saveFail'));
      await loadConversationList();
    }
  };

  input.addEventListener('keydown', (e) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      e.preventDefault();
      finish(true);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      finish(false);
    }
  });
  input.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
  input.addEventListener('mousedown', (e) => e.stopPropagation());
  input.addEventListener('dblclick', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
  input.addEventListener('blur', () => {
    setTimeout(() => finish(true), 0);
  });
}

async function renameConversation(id) {
  // Back-compat alias
  startInlineRename(id);
}

async function openConversation(id) {
  if (!id || chatAbort) {
    if (chatAbort) chatAbort.abort();
  }
  try {
    showError('');
    const res = await api(`/conversations/${id}`);
    const data = res.data || res;
    chatSession.conversationId = data.id;
    chatRenderSkip = 0;
    chatMdCache.clear();
    chatMessages = (data.messages || [])
      .filter((m) => !m.compressed)
      .map((m) => ({
        role: m.role,
        content: m.content || '',
        reasoning: m.reasoning || undefined,
        docs: m.docs,
        error: m.error,
      }));
    chatPendingDocs = [];
    chatUi.systemPrompt = data.systemPrompt || '';
    applyContextFromApi(data);
    if (data.model) chatUi.model = data.model;
    if (data.apiKeyId) {
      chatUi.keyId = data.apiKeyId;
    }
    // sync form controls if present
    const sysEl = document.getElementById('chat-system');
    if (sysEl) sysEl.value = chatUi.systemPrompt;
    const wrap = document.getElementById('chat-system-wrap');
    if (wrap) wrap.hidden = !chatUi.systemPrompt.trim() && !chatUi.systemOpen;
    const modelEl = document.getElementById('chat-model');
    if (modelEl && data.model) modelEl.value = data.model;
    const keyEl = document.getElementById('chat-key-select');
    if (keyEl && data.apiKeyId) {
      const has = [...keyEl.options].some((o) => o.value === data.apiKeyId);
      if (has) {
        keyEl.value = data.apiKeyId;
        chatUi.keyId = data.apiKeyId;
      }
    }
    renderChatBubbles();
    renderChatPending();
    paintChatHistoryList();
    paintContextBanner();
    syncContextControls();
    closeChatHistoryMobile();
  } catch (e) {
    showError(e.message || t('chat.loadFail'));
  }
}

/** Real API key UUID only — never send OTP session synthetic ids to validators. */
function playgroundRealApiKeyId() {
  const id = playgroundKeyId();
  if (!id) return null;
  if (String(id).startsWith('admin-session:')) return null;
  // basic uuid shape
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      id,
    )
  ) {
    return null;
  }
  return id;
}

async function saveConversation() {
  const messages = messagesForSave();
  if (!messages.length && !chatContext.summary) return;
  if (chatSession.saving) {
    chatSession.saveQueued = true;
    return;
  }
  chatSession.saving = true;
  chatSession.saveQueued = false;
  captureChatUi();
  const body = {
    messages,
    model: chatUi.model || null,
    systemPrompt: chatUi.systemPrompt || '',
    apiKeyId: playgroundRealApiKeyId(),
    ...contextPayloadForSave(),
  };
  try {
    if (chatSession.conversationId) {
      await api(`/conversations/${chatSession.conversationId}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
    } else {
      if (!messages.length) return;
      const res = await api('/conversations', {
        method: 'POST',
        body: JSON.stringify({ ...body, title: '' }),
      });
      const data = res.data || res;
      chatSession.conversationId = data.id;
    }
    await loadConversationList();
  } catch (e) {
    console.warn(e);
    // non-blocking — keep chat usable
  } finally {
    chatSession.saving = false;
    if (chatSession.saveQueued) {
      chatSession.saveQueued = false;
      saveConversation().catch(() => {});
    }
  }
}

async function deleteConversation(id) {
  if (
    !(await uiConfirm({
      title: t('chat.deleteConversation'),
      message: t('chat.deleteConfirm'),
      variant: 'danger',
      confirmText: t('chat.deleteConversation'),
    }))
  )
    return;
  try {
    await api(`/conversations/${id}`, { method: 'DELETE' });
    if (chatSession.conversationId === id) {
      chatSession.conversationId = null;
      chatMessages = [];
      chatPendingDocs = [];
      resetChatContext();
      renderChatBubbles();
      renderChatPending();
      paintContextBanner();
      syncContextControls();
    }
    // if page emptied, go back a page
    if (
      chatSession.historyItems.length <= 1 &&
      chatSession.historyPage > 0
    ) {
      chatSession.historyPage -= 1;
    }
    await loadConversationList();
  } catch (e) {
    showError(e.message || t('common.requestFailed'));
  }
}

function resetChatThread(keepSystem = true) {
  if (chatAbort) chatAbort.abort();
  chatMessages = [];
  chatPendingDocs = [];
  chatSession.conversationId = null;
  resetChatContext();
  if (!keepSystem) {
    chatUi.systemPrompt = '';
    chatUi.systemOpen = false;
  }
  renderChatBubbles();
  renderChatPending();
  paintChatHistoryList();
  paintContextBanner();
  syncContextControls();
}

/** Signed-in admin bearer (always used for Admin API). */
function playgroundAuthKey() {
  return state.key;
}

/** Selected key id for acting as (session me.id when empty). */
function playgroundKeyId() {
  const el = document.getElementById('chat-key-select');
  const v = el?.value || chatUi.keyId || '';
  if (v && v !== 'session') return v;
  return state.me?.id || '';
}

function captureChatUi() {
  const keyEl = document.getElementById('chat-key-select');
  const modelEl = document.getElementById('chat-model');
  const reasonEl = document.getElementById('chat-reasoning');
  const sysEl = document.getElementById('chat-system');
  if (keyEl) chatUi.keyId = keyEl.value === 'session' ? '' : keyEl.value;
  if (modelEl) chatUi.model = modelEl.value;
  if (reasonEl) chatUi.reasoning = reasonEl.checked;
  if (sysEl) chatUi.systemPrompt = sysEl.value;
}

function renderChatPending() {
  const wrap = document.getElementById('chat-pending');
  if (!wrap) return;
  if (!chatPendingDocs.length) {
    wrap.innerHTML = '';
    wrap.hidden = true;
    return;
  }
  wrap.hidden = false;
  wrap.innerHTML = chatPendingDocs
    .map(
      (d, i) => `
      <div class="chat-pending-item" title="${escapeHtml(d.name)}">
        <span class="name">${escapeHtml(d.name)}</span>
        <span class="muted">${fmtBytes(d.size)}</span>
        <button type="button" class="rm" data-rm-doc="${i}" aria-label="${escapeHtml(t('chat.removeFile'))}">×</button>
      </div>`,
    )
    .join('');
  wrap.querySelectorAll('[data-rm-doc]').forEach((btn) => {
    btn.onclick = () => {
      const idx = Number(btn.getAttribute('data-rm-doc'));
      chatPendingDocs.splice(idx, 1);
      renderChatPending();
    };
  });
}

function mdCacheKey(idx, content) {
  return `${idx}:${(content || '').length}:${(content || '').slice(0, 40)}`;
}

function renderChatBubbles() {
  const box = document.getElementById('chat-messages');
  if (!box) return;
  const nearBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 120;
  const streaming = chatMessages.some((m) => m.streaming);

  // Live status under composer
  const st = document.getElementById('chat-stream-status');
  if (st) {
    st.hidden = !streaming;
    st.textContent = streaming ? t('chat.streaming') : '';
  }

  if (!chatMessages.length) {
    box.innerHTML = `
      <div class="chat-empty">
        <strong>${escapeHtml(t('chat.emptyTitle'))}</strong>
        <p>${escapeHtml(t('chat.emptyHint'))}</p>
      </div>`;
    updateChatCompressButton();
    return;
  }

  // Render window: only last N + skip (load more expands)
  const total = chatMessages.length;
  const maxSkip = Math.max(0, total - CHAT_RENDER_WINDOW);
  if (chatRenderSkip > maxSkip) chatRenderSkip = maxSkip;
  const start = chatRenderSkip;
  const visible = chatMessages.slice(start);
  const hiddenCount = start;

  const foldBar =
    hiddenCount > 0
      ? `<div class="chat-load-older">
          <button type="button" class="btn secondary sm" id="chat-load-older">${escapeHtml(tf('chat.loadOlder', { n: hiddenCount }))}</button>
        </div>`
      : '';

  box.innerHTML =
    foldBar +
    visible
      .map((m, visIdx) => {
        const idx = start + visIdx;
        const role = m.role === 'user' ? 'user' : 'assistant';
        const roleLabel =
          m.role === 'user' ? t('chat.you') : t('chat.assistant');
        const docs =
          m.docs && m.docs.length
            ? `<div class="chat-attach-list">${m.docs
                .map(
                  (d) =>
                    `<span class="chat-attach-chip" title="${escapeHtml(d.name)}"><span>📎 ${escapeHtml(d.name)}</span></span>`,
                )
                .join('')}</div>`
            : '';
        const showReasoningBlock = Boolean(m.reasoning);
        const reasoning = showReasoningBlock
          ? `<details class="chat-reasoning" ${m.streaming || !m.content ? 'open' : ''}>
            <summary>${escapeHtml(t('chat.reasoning'))}${m.streaming && !m.content ? ` · ${escapeHtml(t('chat.streaming'))}` : ''}</summary>
            <pre>${escapeHtml(m.reasoning)}</pre>
          </details>`
          : '';
        let bodyText = m.content || '';
        if (!bodyText && m.streaming) {
          bodyText = m.reasoning ? '' : '…';
        }
        const errCls = m.error ? ' error' : '';
        const streamCls = m.streaming ? ' is-streaming' : '';
        // Streaming: plain text only (fast). Done assistant: MD with cache.
        const useMd =
          role === 'assistant' && !m.streaming && Boolean(bodyText);
        let bodyHtml;
        if (useMd) {
          const ck = mdCacheKey(idx, bodyText);
          if (chatMdCache.has(ck)) {
            bodyHtml = chatMdCache.get(ck);
          } else {
            bodyHtml = formatChatMarkdown(bodyText);
            chatMdCache.set(ck, bodyHtml);
            if (chatMdCache.size > 200) {
              const first = chatMdCache.keys().next().value;
              chatMdCache.delete(first);
            }
          }
        } else {
          bodyHtml = escapeHtml(bodyText);
        }
        const long =
          !m.streaming && bodyText.length > CHAT_CONTENT_COLLAPSE;
        const contentCls = `${useMd ? 'chat-content md' : 'chat-content'}${long ? ' is-collapsible' : ''}`;
        const moreBtn = long
          ? `<button type="button" class="btn ghost sm chat-expand-btn" data-expand="${idx}">${escapeHtml(t('chat.showMore'))}</button>`
          : '';
        const copyBtn =
          bodyText
            ? `<button type="button" class="chat-copy-btn" data-copy-msg="${idx}" title="${escapeHtml(t('chat.copy'))}">${escapeHtml(t('chat.copy'))}</button>`
            : '';
        return `<div class="chat-bubble ${role}${errCls}${streamCls}" data-msg-idx="${idx}">
        <div class="chat-bubble-head">
          <div class="chat-role">${escapeHtml(roleLabel)}${m.streaming ? ` <span class="chat-live">${escapeHtml(t('chat.streaming'))}</span>` : ''}</div>
          ${copyBtn}
        </div>
        ${docs}
        ${reasoning}
        <div class="${contentCls}" data-content-idx="${idx}">${bodyHtml}${m.streaming ? '<span class="chat-cursor">▍</span>' : ''}</div>
        ${moreBtn}
      </div>`;
      })
      .join('');

  if (nearBottom || streaming) {
    box.scrollTop = box.scrollHeight;
  }
  updateChatCompressButton();

  document.getElementById('chat-load-older')?.addEventListener('click', () => {
    const prevH = box.scrollHeight;
    chatRenderSkip = Math.max(0, chatRenderSkip - CHAT_RENDER_STEP);
    renderChatBubbles();
    const box2 = document.getElementById('chat-messages');
    if (box2) box2.scrollTop = box2.scrollHeight - prevH;
  });

  box.querySelectorAll('[data-expand]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const el = box.querySelector(
        `[data-content-idx="${btn.getAttribute('data-expand')}"]`,
      );
      if (el) {
        el.classList.toggle('is-expanded');
        btn.textContent = el.classList.contains('is-expanded')
          ? t('chat.showLess')
          : t('chat.showMore');
      }
    });
  });

  box.querySelectorAll('[data-copy-msg]').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const i = Number(btn.getAttribute('data-copy-msg'));
      const msg = chatMessages[i];
      if (!msg?.content) return;
      const ok = await copyTextToClipboard(msg.content);
      if (ok) {
        const prev = btn.textContent;
        btn.textContent = t('chat.copied');
        btn.classList.add('is-copied');
        setTimeout(() => {
          if (btn.isConnected) {
            btn.textContent = prev || t('chat.copy');
            btn.classList.remove('is-copied');
          }
        }, 1600);
      } else {
        showError(t('chat.copyFail'));
      }
    });
  });
}

/** Parse one SSE buffer chunk into { events, rest } */
function parseSseBuffer(buffer) {
  // Normalize CRLF
  const normalized = buffer.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const parts = normalized.split('\n');
  const rest = parts.pop() || '';
  const events = [];
  for (const line of parts) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith(':')) continue; // comment / keepalive
    if (!trimmed.startsWith('data:')) continue;
    const data = trimmed.slice(5).trim();
    if (!data) continue;
    events.push(data);
  }
  return { events, rest };
}

function applyStreamDelta(assistant, json) {
  if (!json || typeof json !== 'object') return false;
  // Error payload from our server mid-stream
  if (json.error) {
    const msg = formatApiError({ error: json.error });
    assistant.error = true;
    assistant.content = (assistant.content || '') + `\n✗ ${msg}`;
    return true;
  }
  const delta = json.choices?.[0]?.delta || {};
  let changed = false;
  if (delta.reasoning_content) {
    assistant.reasoning = (assistant.reasoning || '') + delta.reasoning_content;
    changed = true;
  }
  if (delta.thought && !delta.reasoning_content) {
    // avoid double-append when both aliases sent
    assistant.reasoning = (assistant.reasoning || '') + delta.thought;
    changed = true;
  } else if (delta.thought && delta.reasoning_content && delta.thought !== delta.reasoning_content) {
    assistant.reasoning = (assistant.reasoning || '') + delta.thought;
    changed = true;
  }
  if (typeof delta.content === 'string' && delta.content.length) {
    assistant.content = (assistant.content || '') + delta.content;
    changed = true;
  }
  // Non-stream style full message (fallback)
  const msg = json.choices?.[0]?.message;
  if (msg) {
    if (msg.content && !assistant.content) {
      assistant.content = msg.content;
      changed = true;
    }
    if (msg.reasoning_content && !assistant.reasoning) {
      assistant.reasoning = msg.reasoning_content;
      changed = true;
    }
  }
  return changed;
}

/**
 * Upload one file with progress via XHR (fetch has no upload progress).
 * @param {File} file
 * @param {(p: { loaded: number, total: number, percent: number }) => void} [onProgress]
 */
function uploadChatFile(file, onProgress) {
  const auth = playgroundAuthKey();
  if (!auth) return Promise.reject(new Error(t('chat.needKey')));

  return new Promise((resolve, reject) => {
    const fd = new FormData();
    fd.append('file', file, file.name);
    const asId = playgroundRealApiKeyId();
    if (asId) fd.append('apiKeyId', asId);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/admin/api/documents');
    xhr.setRequestHeader('Authorization', `Bearer ${auth}`);

    xhr.upload.onprogress = (ev) => {
      if (!onProgress) return;
      if (ev.lengthComputable && ev.total > 0) {
        const percent = Math.min(100, Math.round((ev.loaded / ev.total) * 100));
        onProgress({ loaded: ev.loaded, total: ev.total, percent });
      } else {
        onProgress({ loaded: ev.loaded || 0, total: 0, percent: -1 });
      }
    };

    xhr.onload = () => {
      let data = null;
      try {
        data = xhr.responseText ? JSON.parse(xhr.responseText) : null;
      } catch {
        data = null;
      }
      if (xhr.status < 200 || xhr.status >= 300) {
        const msg =
          data?.error?.message ||
          data?.message ||
          xhr.responseText ||
          xhr.statusText;
        reject(new Error(msg || t('chat.uploadFail')));
        return;
      }
      const doc = data?.data || data;
      const id = doc?.id;
      if (!id || typeof id !== 'string') {
        reject(new Error(t('chat.uploadFail')));
        return;
      }
      resolve({
        id,
        name: doc.originalName || doc.filename || file.name,
        mime: doc.mimeType || file.type || '',
        size: doc.sizeBytes ?? doc.size ?? file.size ?? 0,
      });
    };
    xhr.onerror = () => reject(new Error(t('chat.uploadFail')));
    xhr.onabort = () => reject(new Error(t('chat.uploadFail')));
    xhr.send(fd);
  });
}

function setChatUploadProgress(opts) {
  const wrap = document.getElementById('chat-upload-progress');
  if (!wrap) return;
  const { visible, fileName, fileIndex, fileTotal, percent, indeterminate } =
    opts;
  if (!visible) {
    wrap.hidden = true;
    wrap.setAttribute('aria-hidden', 'true');
    return;
  }
  wrap.hidden = false;
  wrap.setAttribute('aria-hidden', 'false');
  const label = document.getElementById('chat-upload-label');
  const bar = document.getElementById('chat-upload-bar');
  const pctEl = document.getElementById('chat-upload-pct');
  const name = fileName || '';
  const idx = fileIndex || 1;
  const tot = fileTotal || 1;
  if (label) {
    label.textContent =
      tot > 1
        ? tf('chat.uploadProgressMulti', { name, i: idx, n: tot })
        : tf('chat.uploadProgress', { name });
  }
  const ind = Boolean(indeterminate) || percent < 0;
  if (bar) {
    bar.classList.toggle('is-indeterminate', ind);
    if (!ind) {
      bar.style.width = `${Math.max(0, Math.min(100, percent))}%`;
    } else {
      bar.style.width = '40%';
    }
  }
  if (pctEl) {
    pctEl.textContent = ind
      ? t('chat.uploading')
      : tf('common.percent', { n: Math.max(0, Math.min(100, percent)) });
  }
}

/**
 * Add already-uploaded documents to the pending chips (no re-upload).
 * @param {Array<{ id: string, name?: string, originalName?: string, mime?: string, mimeType?: string, size?: number, sizeBytes?: number }>} docs
 */
function addChatExistingDocs(docs) {
  const list = Array.isArray(docs) ? docs : [];
  if (!list.length) return { added: 0, skipped: 0 };
  let added = 0;
  let skipped = 0;
  const pendingIds = new Set(chatPendingDocs.map((d) => d.id));
  for (const raw of list) {
    if (chatPendingDocs.length >= CHAT_MAX_DOCS) {
      skipped += list.length - added - skipped;
      break;
    }
    const id = raw?.id;
    const name = raw?.name || raw?.originalName || '';
    if (!id || !DOC_ID_RE.test(String(id))) {
      skipped += 1;
      continue;
    }
    if (!isChatAllowedFilename(name)) {
      skipped += 1;
      continue;
    }
    if (pendingIds.has(id)) {
      skipped += 1;
      continue;
    }
    chatPendingDocs.push({
      id,
      name: name || id,
      mime: raw.mime || raw.mimeType || '',
      size: raw.size ?? raw.sizeBytes ?? 0,
    });
    pendingIds.add(id);
    added += 1;
  }
  renderChatPending();
  return { added, skipped };
}

async function openChatLibraryPicker() {
  if (!playgroundAuthKey()) {
    showError(t('chat.needKey'));
    return;
  }
  // Library list filters by real key only (session → omit = all admin-visible docs)
  const asKeyId = playgroundRealApiKeyId();
  const room = Math.max(0, CHAT_MAX_DOCS - chatPendingDocs.length);
  if (room <= 0) {
    showError(t('chat.tooManyFiles'));
    return;
  }

  /** @type {Map<string, any>} */
  const selected = new Map();
  let loadSeq = 0;

  openAppModal({
    title: t('chat.libraryTitle'),
    subtitle: escapeHtml(t('chat.librarySubtitle')),
    size: 'md',
    bodyHtml: `
      <div class="chat-lib">
        <div class="chat-lib-toolbar">
          <input type="search" id="chat-lib-q" class="chat-lib-search" placeholder="${escapeHtml(t('chat.librarySearch'))}" autocomplete="off" />
          <span class="muted chat-lib-count" id="chat-lib-count">${escapeHtml(tf('chat.librarySelected', { n: 0 }))}</span>
        </div>
        <div class="muted chat-lib-formats">${escapeHtml(t('chat.formatsLabel'))}: ${escapeHtml(chatFormatsShort())}</div>
        <div id="chat-lib-list" class="chat-lib-list" role="listbox" aria-multiselectable="true">
          <div class="muted chat-lib-status">${escapeHtml(t('common.loading') || '…')}</div>
        </div>
      </div>`,
    footerHtml: `
      <button type="button" class="btn secondary sm" id="chat-lib-cancel">${escapeHtml(t('common.cancel'))}</button>
      <button type="button" class="btn sm" id="chat-lib-add" disabled>${escapeHtml(t('chat.libraryAdd'))}</button>`,
  });

  const listEl = document.getElementById('chat-lib-list');
  const qEl = document.getElementById('chat-lib-q');
  const countEl = document.getElementById('chat-lib-count');
  const addBtn = document.getElementById('chat-lib-add');
  document.getElementById('chat-lib-cancel')?.addEventListener('click', () => closeAppModal());

  const paintCount = () => {
    if (countEl) countEl.textContent = tf('chat.librarySelected', { n: selected.size });
    if (addBtn) {
      addBtn.disabled = selected.size === 0;
      addBtn.textContent =
        selected.size > 0
          ? `${t('chat.libraryAdd')} (${selected.size})`
          : t('chat.libraryAdd');
    }
  };

  const renderRows = (items) => {
    if (!listEl) return;
    const pendingIds = new Set(chatPendingDocs.map((d) => d.id));
    const allowed = (items || []).filter((d) => isChatAllowedFilename(d.originalName));
    if (!allowed.length) {
      listEl.innerHTML = `<div class="data-empty chat-lib-empty"><strong>${escapeHtml(t('chat.libraryEmpty'))}</strong></div>`;
      return;
    }
    listEl.innerHTML = allowed
      .map((d) => {
        const already = pendingIds.has(d.id);
        const checked = selected.has(d.id);
        const disabled = already && !checked;
        return `
          <label class="chat-lib-row ${already ? 'is-already' : ''} ${checked ? 'is-selected' : ''}" data-id="${escapeHtml(d.id)}">
            <input type="checkbox" data-lib-id="${escapeHtml(d.id)}" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''} />
            <span class="chat-lib-meta">
              <span class="chat-lib-name" title="${escapeHtml(d.originalName)}">${escapeHtml(d.originalName)}</span>
              <span class="muted">${escapeHtml(d.mimeType || '')} · ${fmtBytes(d.sizeBytes || 0)}${
                already ? ` · ${escapeHtml(t('chat.libraryAlready'))}` : ''
              }</span>
            </span>
          </label>`;
      })
      .join('');

    listEl.querySelectorAll('input[data-lib-id]').forEach((inp) => {
      inp.addEventListener('change', () => {
        const id = inp.getAttribute('data-lib-id');
        const row = allowed.find((x) => x.id === id);
        if (!row) return;
        if (inp.checked) {
          if (selected.size >= room && !selected.has(id)) {
            inp.checked = false;
            showError(t('chat.tooManyFiles'));
            return;
          }
          selected.set(id, row);
        } else {
          selected.delete(id);
        }
        const lab = inp.closest('.chat-lib-row');
        if (lab) lab.classList.toggle('is-selected', inp.checked);
        paintCount();
      });
    });
  };

  const load = async () => {
    const seq = ++loadSeq;
    if (listEl) {
      listEl.innerHTML = `<div class="muted chat-lib-status">${escapeHtml(t('common.loading') || '…')}</div>`;
    }
    try {
      const params = new URLSearchParams({
        limit: '50',
        offset: '0',
      });
      if (asKeyId) params.set('apiKeyId', asKeyId);
      const q = (qEl?.value || '').trim();
      if (q) params.set('q', q);
      const res = await api(`/documents?${params}`);
      if (seq !== loadSeq) return;
      renderRows(res.data || []);
    } catch (e) {
      if (seq !== loadSeq) return;
      if (listEl) {
        listEl.innerHTML = `<div class="error-box">${escapeHtml(e.message || t('chat.libraryLoadFail'))}</div>`;
      }
    }
  };

  let searchTimer = null;
  qEl?.addEventListener('input', () => {
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => load(), 280);
  });

  addBtn?.addEventListener('click', () => {
    const docs = [...selected.values()];
    const { added } = addChatExistingDocs(
      docs.map((d) => ({
        id: d.id,
        name: d.originalName,
        mime: d.mimeType,
        size: d.sizeBytes,
      })),
    );
    closeAppModal();
    if (added > 0) showError('');
  });

  paintCount();
  await load();
  qEl?.focus();
}

async function addChatFiles(fileList) {
  const rawFiles = [...(fileList || [])];
  if (!rawFiles.length) return;
  if (!playgroundAuthKey()) {
    showError(t('chat.needKey'));
    return;
  }

  const rejected = rawFiles.filter((f) => !isChatAllowedFilename(f.name));
  const files = rawFiles.filter((f) => isChatAllowedFilename(f.name));
  if (rejected.length) {
    showError(
      tf('chat.formatsReject', {
        name: rejected.map((f) => f.name).join(', '),
        formats: chatFormatsShort(),
      }),
    );
    if (!files.length) return;
  }

  if (chatPendingDocs.length + files.length > CHAT_MAX_DOCS) {
    showError(t('chat.tooManyFiles'));
    return;
  }
  const attachBtn = document.getElementById('chat-attach');
  const sendBtn = document.getElementById('chat-send');
  if (attachBtn) {
    attachBtn.disabled = true;
    attachBtn.textContent = t('chat.uploading');
  }
  if (sendBtn) sendBtn.disabled = true;

  const total = files.length;
  try {
    let i = 0;
    for (const file of files) {
      if (chatPendingDocs.length >= CHAT_MAX_DOCS) break;
      i += 1;
      setChatUploadProgress({
        visible: true,
        fileName: file.name,
        fileIndex: i,
        fileTotal: total,
        percent: 0,
        indeterminate: false,
      });
      const doc = await uploadChatFile(file, ({ percent }) => {
        setChatUploadProgress({
          visible: true,
          fileName: file.name,
          fileIndex: i,
          fileTotal: total,
          percent: percent < 0 ? 0 : percent,
          indeterminate: percent < 0,
        });
      });
      // brief 100% flash
      setChatUploadProgress({
        visible: true,
        fileName: file.name,
        fileIndex: i,
        fileTotal: total,
        percent: 100,
        indeterminate: false,
      });
      // avoid duplicate id if same file re-uploaded in session chips
      if (!chatPendingDocs.some((d) => d.id === doc.id)) {
        chatPendingDocs.push(doc);
      }
      renderChatPending();
    }
    if (!rejected.length) showError('');
  } catch (e) {
    showError(e.message || t('chat.uploadFail'));
  } finally {
    setChatUploadProgress({ visible: false });
    if (attachBtn) {
      attachBtn.disabled = false;
      attachBtn.textContent = t('chat.attach');
    }
    if (sendBtn) sendBtn.disabled = false;
  }
}

function chatKeySelectOptions() {
  const meId = state.me?.id || '';
  const meLabel = state.me
    ? `${t('chat.useSessionKey')} · ${state.me.name || ''} (${state.me.keyPrefix || ''}…)`
    : t('chat.useSessionKey');
  const selected = chatUi.keyId || 'session';
  const keys = (state.keys || []).filter((k) => k.isActive !== false);
  const opts = [
    `<option value="session" ${selected === 'session' || selected === meId || !selected ? 'selected' : ''}>${escapeHtml(meLabel)}</option>`,
  ];
  for (const k of keys) {
    if (meId && k.id === meId) continue;
    const label = `${k.name || 'key'} · ${k.keyPrefix || ''}… · ${k.role || ''}/${k.mode || ''}`;
    opts.push(
      `<option value="${escapeHtml(k.id)}" ${selected === k.id ? 'selected' : ''}>${escapeHtml(label)}</option>`,
    );
  }
  return opts.join('');
}

async function renderChatPlayground() {
  await Promise.all([loadModels(false), loadKeys()]);
  const models = state.models || [];
  if (!chatUi.model && models.length) chatUi.model = models[0];
  const modelOpts = models
    .map(
      (m) =>
        `<option value="${escapeHtml(m)}" ${chatUi.model === m ? 'selected' : ''}>${escapeHtml(m)}</option>`,
    )
    .join('');

  // leaving chat page closes mobile drawer class
  setChatHistoryMobileOpen(false);

  document.getElementById('app').innerHTML = shell(`
    <div class="chat-page" id="chat-page">
      <div class="chat-drop-overlay" id="chat-drop-overlay" hidden aria-hidden="true">
        <div class="chat-drop-overlay-card">
          <div class="chat-drop-overlay-icon" aria-hidden="true">📎</div>
          <strong>${escapeHtml(t('chat.dropTitle'))}</strong>
          <span class="muted">${escapeHtml(t('chat.dropHint'))}</span>
        </div>
      </div>
      <div class="topbar">
        <h2>${escapeHtml(t('chat.title'))}</h2>
        <div class="toolbar">
          <button type="button" class="btn secondary sm" id="chat-history-toggle">${escapeHtml(t('chat.historyOpen'))}</button>
          <button type="button" class="btn secondary sm" id="chat-compress" title="${escapeHtml(t('chat.compress'))}">${escapeHtml(t('chat.compress'))}</button>
          <button type="button" class="btn secondary sm" id="chat-new">${escapeHtml(t('chat.new'))}</button>
        </div>
      </div>
      <div class="chat-body">
        <div class="chat-history-backdrop" id="chat-history-backdrop"></div>
        <div class="chat-shell">
          <div class="chat-toolbar">
            <label>${escapeHtml(t('chat.keySelect'))}
              <select id="chat-key-select">${chatKeySelectOptions()}</select>
            </label>
            <label>${escapeHtml(t('chats.model'))}
              <select id="chat-model">${modelOpts || `<option value="grok-4.5">grok-4.5</option>`}</select>
            </label>
            <label class="check-inline" for="chat-reasoning">
              <input type="checkbox" id="chat-reasoning" ${chatUi.reasoning !== false ? 'checked' : ''} />
              ${escapeHtml(t('chat.includeReasoning'))}
            </label>
            <label class="chat-ctx-label">${escapeHtml(t('chat.ctxMode'))}
              <select id="chat-ctx-mode">
                <option value="full">${escapeHtml(t('chat.ctxModeFull'))}</option>
                <option value="summary">${escapeHtml(t('chat.ctxModeSummary'))}</option>
                <option value="recent">${escapeHtml(t('chat.ctxModeRecent'))}</option>
              </select>
            </label>
            <label class="chat-ctx-label chat-ctx-n-label">${escapeHtml(t('chat.ctxRecentN'))}
              <input type="number" id="chat-ctx-n" min="2" max="40" value="${chatContext.recentN}" />
            </label>
            <button type="button" class="btn ghost sm" id="chat-system-toggle" title="${escapeHtml(t('chat.systemHint'))}">
              ${escapeHtml(t('chat.systemPrompt'))}${chatUi.systemPrompt ? ' ·' : ''}
            </button>
          </div>
          <div class="chat-system-wrap" id="chat-system-wrap" ${chatUi.systemOpen || chatUi.systemPrompt ? '' : 'hidden'}>
            <label class="chat-system-label" for="chat-system">${escapeHtml(t('chat.systemPrompt'))}
              <span class="hint">${escapeHtml(t('chat.systemHint'))}</span>
            </label>
            <textarea id="chat-system" rows="3" placeholder="${escapeHtml(t('chat.systemPlaceholder'))}">${escapeHtml(chatUi.systemPrompt || '')}</textarea>
          </div>
          <div id="chat-compress-banner" class="chat-compress-banner" hidden></div>
          <div id="chat-messages" class="chat-messages"></div>
          <div class="chat-composer" id="chat-composer">
            <div id="chat-pending" class="chat-pending" hidden></div>
            <div id="chat-upload-progress" class="chat-upload-progress" hidden aria-hidden="true">
              <div class="chat-upload-meta">
                <span id="chat-upload-label" class="chat-upload-label"></span>
                <span id="chat-upload-pct" class="chat-upload-pct"></span>
              </div>
              <div class="chat-upload-track" role="progressbar" aria-valuemin="0" aria-valuemax="100">
                <div id="chat-upload-bar" class="chat-upload-bar"></div>
              </div>
            </div>
            <div id="chat-stream-status" class="chat-stream-status" hidden></div>
            <textarea id="chat-input" rows="2" placeholder="${escapeHtml(t('chat.placeholder'))}"></textarea>
            <div class="chat-composer-actions">
              <div class="chat-composer-left">
                <input type="file" id="chat-file" class="chat-file-input" multiple accept="${escapeHtml(CHAT_FILE_ACCEPT)}" />
                <button type="button" class="btn secondary sm" id="chat-attach" title="${escapeHtml(t('chat.attachHint'))}">${escapeHtml(t('chat.attach'))}</button>
                <button type="button" class="btn secondary sm" id="chat-attach-lib" title="${escapeHtml(t('chat.libraryTitle'))}">${escapeHtml(t('chat.attachLibrary'))}</button>
                <span class="chat-formats-hint" title="${escapeHtml(chatFormatsShort())}">
                  <span class="chat-formats-label">${escapeHtml(t('chat.formatsLabel'))}</span>
                  <span class="muted">${escapeHtml(chatFormatsShort())}</span>
                </span>
              </div>
              <div class="chat-composer-right">
                <button type="button" class="btn secondary sm" id="chat-stop" disabled>${escapeHtml(t('chat.stop'))}</button>
                <button type="button" class="btn sm" id="chat-send">${escapeHtml(t('chat.send'))}</button>
              </div>
            </div>
          </div>
        </div>
        <aside class="chat-history-rail" id="chat-history-rail" aria-label="${escapeHtml(t('chat.history'))}">
          <div class="chat-history-head">
            <div class="chat-history-head-row">
              <h3>${escapeHtml(t('chat.history'))}</h3>
              <button type="button" class="btn ghost sm" id="chat-history-close-mobile" aria-label="${escapeHtml(t('chat.historyClose'))}">×</button>
            </div>
            <input type="search" id="chat-history-search" class="chat-history-search" placeholder="${escapeHtml(t('chat.historySearch'))}" value="${escapeHtml(chatSession.historyQ)}" />
          </div>
          <ul class="chat-history-list" id="chat-history-list"></ul>
          <div class="chat-history-pager" id="chat-history-pager"></div>
        </aside>
      </div>
    </div>
  `);
  bindShell();
  renderChatBubbles();
  renderChatPending();
  paintChatHistoryList();
  updateChatCompressButton();
  paintContextBanner();
  syncContextControls();
  loadConversationList().catch(() => {});

  document.getElementById('chat-key-select').onchange = () => captureChatUi();
  const ctxMode = document.getElementById('chat-ctx-mode');
  const ctxN = document.getElementById('chat-ctx-n');
  if (ctxMode) {
    ctxMode.onchange = () => {
      const v = ctxMode.value;
      if (v === 'summary' && !chatContext.summary) {
        showError(t('chat.compressNeedSummary'));
        ctxMode.value = chatContext.mode === 'recent' ? 'recent' : 'full';
        return;
      }
      chatContext.mode = v === 'summary' || v === 'recent' ? v : 'full';
      paintContextBanner();
      syncContextControls();
      saveConversation().catch(() => {});
    };
  }
  if (ctxN) {
    ctxN.onchange = () => {
      chatContext.recentN = Math.min(
        40,
        Math.max(2, Number(ctxN.value) || 6),
      );
      paintContextBanner();
      saveConversation().catch(() => {});
    };
  }
  document.getElementById('chat-model').onchange = () => captureChatUi();
  document.getElementById('chat-reasoning').onchange = () => captureChatUi();
  document.getElementById('chat-system').oninput = () => captureChatUi();
  document.getElementById('chat-system-toggle').onclick = () => {
    captureChatUi();
    chatUi.systemOpen = !chatUi.systemOpen;
    const wrap = document.getElementById('chat-system-wrap');
    if (wrap) wrap.hidden = !chatUi.systemOpen && !chatUi.systemPrompt.trim();
    if (chatUi.systemOpen) document.getElementById('chat-system')?.focus();
  };

  document.getElementById('chat-new').onclick = () => {
    resetChatThread(true);
  };
  document.getElementById('chat-compress').onclick = () => {
    compressChatHistory().catch(() => {});
  };
  document.getElementById('chat-stop').onclick = () => {
    if (chatAbort) chatAbort.abort();
  };
  document.getElementById('chat-send').onclick = () => sendChatMessage();
  document.getElementById('chat-attach').onclick = () => {
    document.getElementById('chat-file')?.click();
  };
  document.getElementById('chat-attach-lib')?.addEventListener('click', () => {
    openChatLibraryPicker().catch((e) => showError(e.message || t('chat.libraryLoadFail')));
  });
  document.getElementById('chat-file').onchange = (e) => {
    const input = e.target;
    addChatFiles(input.files).finally(() => {
      input.value = '';
    });
  };

  const histToggle = document.getElementById('chat-history-toggle');
  const histBackdrop = document.getElementById('chat-history-backdrop');
  const histClose = document.getElementById('chat-history-close-mobile');
  if (histToggle) {
    histToggle.onclick = () => {
      setChatHistoryMobileOpen(!chatSession.historyOpenMobile);
    };
  }
  if (histBackdrop) {
    histBackdrop.onclick = () => closeChatHistoryMobile();
  }
  if (histClose) {
    histClose.onclick = () => closeChatHistoryMobile();
  }
  const searchEl = document.getElementById('chat-history-search');
  if (searchEl) {
    searchEl.oninput = () => {
      chatSession.historyQ = searchEl.value;
      if (chatHistorySearchTimer) clearTimeout(chatHistorySearchTimer);
      chatHistorySearchTimer = setTimeout(() => {
        chatSession.historyPage = 0;
        loadConversationList();
      }, 280);
    };
  }

  // Full-page drag & drop: drop files anywhere on the chat page
  bindChatPageFileDrop();

  document.getElementById('chat-input').onkeydown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };
}

/**
 * Allow dragging files from the OS into the chat page (whole surface).
 * Prevents the browser from navigating to the dropped file.
 */
function bindChatPageFileDrop() {
  const page = document.getElementById('chat-page');
  const overlay = document.getElementById('chat-drop-overlay');
  const composer = document.getElementById('chat-composer');
  if (!page) return;

  let dragDepth = 0;

  const hasFiles = (e) => {
    const types = e.dataTransfer?.types;
    if (!types) return false;
    // DOMStringList or array
    if (typeof types.includes === 'function') return types.includes('Files');
    return [...types].includes('Files');
  };

  const showOverlay = (on) => {
    page.classList.toggle('is-file-drag', on);
    if (composer) composer.classList.toggle('is-dragover', on);
    if (overlay) {
      overlay.hidden = !on;
      overlay.setAttribute('aria-hidden', on ? 'false' : 'true');
    }
  };

  const onDragEnter = (e) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    e.stopPropagation();
    dragDepth += 1;
    showOverlay(true);
  };

  const onDragOver = (e) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
    showOverlay(true);
  };

  const onDragLeave = (e) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    e.stopPropagation();
    dragDepth = Math.max(0, dragDepth - 1);
    if (dragDepth === 0) showOverlay(false);
  };

  const onDrop = (e) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    e.stopPropagation();
    dragDepth = 0;
    showOverlay(false);
    const files = e.dataTransfer?.files;
    if (files?.length) {
      addChatFiles(files).catch((err) =>
        showError(err.message || t('chat.uploadFail')),
      );
    }
  };

  page.addEventListener('dragenter', onDragEnter);
  page.addEventListener('dragover', onDragOver);
  page.addEventListener('dragleave', onDragLeave);
  page.addEventListener('drop', onDrop);

  // Block browser default open-file navigation while on chat page
  const winDragOver = (e) => {
    if (state.page !== 'chat') return;
    if (hasFiles(e)) e.preventDefault();
  };
  const winDrop = (e) => {
    if (state.page !== 'chat') return;
    if (hasFiles(e)) e.preventDefault();
  };
  window.addEventListener('dragover', winDragOver);
  window.addEventListener('drop', winDrop);

  // Stash removers on page node for cleanup on next render (node is discarded)
  page._chatDropCleanup = () => {
    window.removeEventListener('dragover', winDragOver);
    window.removeEventListener('drop', winDrop);
  };
}

/**
 * Collect document IDs for Grok: current pending chips + every prior message
 * that still carries `docs` so multi-turn keeps attachments in context.
 * @returns {string[]}
 */
function collectDocumentIdsForSend(pending) {
  const seen = new Set();
  const ids = [];
  const push = (id) => {
    if (!id || typeof id !== 'string') return;
    const t = id.trim();
    if (!DOC_ID_RE.test(t) || seen.has(t)) return;
    seen.add(t);
    ids.push(t);
  };
  for (const d of pending || []) push(d?.id);
  for (const m of chatMessages) {
    if (!m?.docs?.length) continue;
    for (const d of m.docs) push(d?.id);
  }
  return ids;
}

async function sendChatMessage() {
  captureChatUi();
  const input = document.getElementById('chat-input');
  let text = input?.value.trim() || '';
  const pending = [...chatPendingDocs];

  if (!text && !pending.length) {
    showError(t('chat.needContent'));
    return;
  }
  const auth = playgroundAuthKey();
  if (!auth) {
    showError(t('chat.needKey'));
    return;
  }
  if (!text && pending.length) {
    text = t('chat.fileOnlyPrompt');
  }

  // Reject pending chips that never got a server id (broken upload response)
  const badPending = pending.filter((d) => !d?.id || !DOC_ID_RE.test(String(d.id)));
  if (badPending.length) {
    showError(t('chat.uploadFail'));
    return;
  }

  const model =
    document.getElementById('chat-model')?.value || chatUi.model || 'grok-4.5';
  const includeReasoning =
    document.getElementById('chat-reasoning')?.checked !== false;
  const asKeyId = playgroundKeyId();

  // Pending for this user bubble only; API gets pending + history docs
  const docMeta = pending.map((d) => ({ id: d.id, name: d.name }));
  const docIds = collectDocumentIdsForSend(pending);

  chatMessages.push({
    role: 'user',
    content: text,
    docs: docMeta.length ? docMeta : undefined,
  });
  if (input) input.value = '';
  chatPendingDocs = [];
  renderChatPending();

  const assistant = {
    role: 'assistant',
    content: '',
    reasoning: '',
    streaming: true,
  };
  chatMessages.push(assistant);
  // Keep viewport on newest messages for long threads
  const maxSkip = Math.max(0, chatMessages.length - CHAT_RENDER_WINDOW);
  chatRenderSkip = maxSkip;
  renderChatBubbles();

  // Context policy: full | summary+recent N | recent N (history UI unchanged)
  const apiMessages = buildApiMessages();

  const sendBtn = document.getElementById('chat-send');
  const stopBtn = document.getElementById('chat-stop');
  const attachBtn = document.getElementById('chat-attach');
  const libBtn = document.getElementById('chat-attach-lib');
  if (sendBtn) sendBtn.disabled = true;
  if (attachBtn) attachBtn.disabled = true;
  if (libBtn) libBtn.disabled = true;
  if (stopBtn) stopBtn.disabled = false;

  chatAbort = new AbortController();
  try {
    const body = {
      model,
      stream: true,
      include_reasoning: includeReasoning,
      messages: apiMessages,
    };
    // Always pass document_ids when any attachment is in the thread
    if (docIds.length) body.document_ids = docIds;
    // Only send real key UUID — session actor is already on the Bearer token
    const realKeyId = playgroundRealApiKeyId();
    if (realKeyId) body.apiKeyId = realKeyId;

    // Admin playground proxy — select key by id (no raw secret)
    const res = await fetch('/admin/api/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: chatAbort.signal,
    });

    if (!res.ok) {
      const errText = await res.text();
      let msg = errText;
      try {
        const j = JSON.parse(errText);
        msg = j.error?.message || errText;
      } catch {
        /* */
      }
      throw new Error(msg || res.statusText);
    }

    // Prefer real streaming via ReadableStream
    if (res.body && typeof res.body.getReader === 'function') {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let lastPaint = 0;
      const paint = (force = false) => {
        const now = performance.now();
        if (force || now - lastPaint > 40) {
          lastPaint = now;
          renderChatBubbles();
        }
      };
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const { events, rest } = parseSseBuffer(buffer);
        buffer = rest;
        let changed = false;
        for (const data of events) {
          if (data === '[DONE]') continue;
          try {
            const json = JSON.parse(data);
            if (applyStreamDelta(assistant, json)) changed = true;
          } catch {
            /* skip incomplete / non-json */
          }
        }
        if (changed) paint(false);
      }
      // flush trailing buffer (no final newline)
      if (buffer.trim()) {
        const { events } = parseSseBuffer(buffer + '\n');
        for (const data of events) {
          if (data === '[DONE]') continue;
          try {
            applyStreamDelta(assistant, JSON.parse(data));
          } catch {
            /* ignore */
          }
        }
      }
      paint(true);
    } else {
      // Fallback: no stream body (some proxies) — read full text as SSE
      const text = await res.text();
      const { events } = parseSseBuffer(text + '\n');
      for (const data of events) {
        if (data === '[DONE]') continue;
        try {
          applyStreamDelta(assistant, JSON.parse(data));
        } catch {
          /* try non-SSE JSON completion */
          try {
            const full = JSON.parse(text);
            applyStreamDelta(assistant, full);
          } catch {
            /* ignore */
          }
        }
      }
      renderChatBubbles();
    }

    if (!assistant.content && !assistant.reasoning) {
      assistant.content = t('chat.emptyReply');
    }
    showError('');
  } catch (e) {
    if (e.name === 'AbortError') {
      assistant.content =
        (assistant.content || '') + `\n[${t('chat.stopped')}]`;
    } else {
      assistant.error = true;
      assistant.content =
        (assistant.content || '') + `\n✗ ${e.message || e}`;
      showError(e.message || String(e));
    }
  } finally {
    assistant.streaming = false;
    chatAbort = null;
    renderChatBubbles();
    updateChatCompressButton();
    if (sendBtn) sendBtn.disabled = false;
    if (attachBtn) attachBtn.disabled = false;
    if (libBtn) libBtn.disabled = false;
    if (stopBtn) stopBtn.disabled = true;
    // Persist thread (non-blocking on failure)
    saveConversation().catch(() => {});
  }
}

async function render() {
  const app = document.getElementById('app');
  try {
    if (!state.key) {
      await renderLogin();
      return;
    }
    if (!state.me) await ensureMe();
    if (state.page === 'dashboard') await renderDashboard();
    else if (state.page === 'chat') await renderChatPlayground();
    else if (state.page === 'chats') await renderChats();
    else if (state.page === 'keys') await renderKeys();
    else if (state.page === 'documents') await renderDocuments();
    else if (state.page === 'media') await renderMedia();
    else if (state.page === 'audit') await renderAudit();
    else if (state.page === 'settings') await renderSettings();
    else if (state.page === 'apiFeatures') await renderApiFeatures();
    else if (state.page === 'usage') await renderUsage();
    else if (state.page === 'ddos') await renderDdos();
    else if (state.page === 'queue') await renderQueue();
    else if (state.page === 'pm2') await renderPm2();
    else if (state.page === 'system') await renderSystem();
    else await renderDashboard();
  } catch (e) {
    app.innerHTML = shell(`<div class="error-box">${escapeHtml(e.message)}</div>`);
    bindShell();
  }
}

/** @type {ReturnType<typeof setInterval> | null} */
let queueTimer = null;

/** Queue list filter + page tabs (mirrors media / usage) */
const queueFilter = {
  /** 'overview' | 'jobs' | 'policy' */
  tab: 'overview',
  status: '',
  limit: 20,
  offset: 0,
};

function fmtQueueAge(ms) {
  if (!ms || ms < 0) return '—';
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${Math.round(ms / 1000)}s`;
  if (ms < 3_600_000) return `${Math.round(ms / 60_000)}m`;
  return `${(ms / 3_600_000).toFixed(1)}h`;
}

/** Fields compared for queue policy presets (operational pause/drain excluded). */
const QUEUE_PRESET_KEYS = [
  'enabled',
  'globalConcurrency',
  'perKeyConcurrency',
  'maxQueueDepth',
  'maxQueueDepthPerKey',
  'fairness',
  'defaultPriority',
  'playgroundPriority',
  'leaseMs',
  'maxWaitMs',
];

/** Built-in schemes — same UX pattern as DDoS center. */
function queuePolicyPresets() {
  return {
    relaxed: {
      enabled: true,
      globalConcurrency: 6,
      perKeyConcurrency: 2,
      maxQueueDepth: 200,
      maxQueueDepthPerKey: 40,
      fairness: 'weighted_round_robin',
      defaultPriority: 100,
      playgroundPriority: 40,
      leaseMs: 60_000,
      maxWaitMs: 900_000,
    },
    balanced: {
      enabled: true,
      globalConcurrency: 4,
      perKeyConcurrency: 1,
      maxQueueDepth: 100,
      maxQueueDepthPerKey: 20,
      fairness: 'weighted_round_robin',
      defaultPriority: 100,
      playgroundPriority: 50,
      leaseMs: 45_000,
      maxWaitMs: 600_000,
    },
    strict: {
      enabled: true,
      globalConcurrency: 2,
      perKeyConcurrency: 1,
      maxQueueDepth: 40,
      maxQueueDepthPerKey: 8,
      fairness: 'fifo_global',
      defaultPriority: 100,
      playgroundPriority: 80,
      leaseMs: 30_000,
      maxWaitMs: 300_000,
    },
  };
}

function normalizeQueuePolicySlice(p) {
  if (!p) return {};
  const out = {};
  for (const k of QUEUE_PRESET_KEYS) {
    const v = p[k];
    if (typeof v === 'boolean') out[k] = v;
    else if (typeof v === 'number' && Number.isFinite(v)) out[k] = Math.round(v);
    else if (typeof v === 'string') out[k] = v;
    else if (v == null) out[k] = null;
    else out[k] = v;
  }
  return out;
}

function queuePoliciesEqual(a, b) {
  return (
    JSON.stringify(normalizeQueuePolicySlice(a)) ===
    JSON.stringify(normalizeQueuePolicySlice(b))
  );
}

/** @returns {'relaxed'|'balanced'|'strict'|'custom'} */
function matchQueuePreset(policy) {
  if (!policy) return 'custom';
  const presets = queuePolicyPresets();
  for (const name of ['relaxed', 'balanced', 'strict']) {
    if (queuePoliciesEqual(policy, presets[name])) return name;
  }
  return 'custom';
}

function queuePresetLabel(name) {
  if (name === 'relaxed') return t('queue.presetRelaxed');
  if (name === 'balanced') return t('queue.presetBalanced');
  if (name === 'strict') return t('queue.presetStrict');
  return t('queue.presetCustom');
}

function queuePresetBadgeHtml(name, { unsaved = false } = {}) {
  const label = queuePresetLabel(name);
  const tone =
    name === 'relaxed'
      ? 'relaxed'
      : name === 'balanced'
        ? 'balanced'
        : name === 'strict'
          ? 'strict'
          : 'custom';
  const status = unsaved
    ? tf('queue.presetFormLabel', { name: label })
    : tf('queue.presetActiveLabel', { name: label });
  return `<span class="ddos-preset-badge is-${tone}" id="queue-preset-badge" title="${escapeHtml(status)}">${escapeHtml(status)}</span>`;
}

function readQueuePolicyForm() {
  return {
    // Master switch lives in topbar (not a form checkbox)
    enabled: document.getElementById('q-master-enabled')
      ? isMasterToggleOn('q-master-enabled')
      : true,
    globalConcurrency: Math.max(
      1,
      Math.min(64, Math.floor(numVal('qp-gconc', 4))),
    ),
    perKeyConcurrency: Math.max(
      1,
      Math.min(16, Math.floor(numVal('qp-kconc', 1))),
    ),
    maxQueueDepth: Math.max(1, Math.floor(numVal('qp-depth', 100))),
    maxQueueDepthPerKey: Math.max(1, Math.floor(numVal('qp-depthk', 20))),
    fairness:
      document.getElementById('qp-fair')?.value === 'fifo_global'
        ? 'fifo_global'
        : 'weighted_round_robin',
    defaultPriority: Math.max(0, Math.min(1000, Math.floor(numVal('qp-pri', 100)))),
    playgroundPriority: Math.max(
      0,
      Math.min(1000, Math.floor(numVal('qp-ppri', 50))),
    ),
    leaseMs: Math.max(5000, Math.floor(numVal('qp-lease', 45000))),
    maxWaitMs: Math.max(5000, Math.floor(numVal('qp-wait', 600000))),
  };
}

function applyQueueEnabledUi(on) {
  setMasterToggle(
    'q-master-enabled',
    on,
    t('queue.masterOn'),
    t('queue.masterOff'),
  );
  setFeatureRootOff('queue-root', !on);
  setFeatureOffBanner('queue-disabled-banner', !on);
  // Status pill in runtime panel
  const pill = document.getElementById('qk-pill-enabled');
  if (pill) {
    pill.innerHTML = dashStatusPill(on, t('dash.on'), t('dash.off'));
  }
}

function applyQueuePresetToForm(values) {
  if (!values) return;
  const setNum = (id, v) => {
    const el = document.getElementById(id);
    if (el) el.value = String(v);
  };
  applyQueueEnabledUi(values.enabled !== false);
  setNum('qp-gconc', values.globalConcurrency);
  setNum('qp-kconc', values.perKeyConcurrency);
  setNum('qp-depth', values.maxQueueDepth);
  setNum('qp-depthk', values.maxQueueDepthPerKey);
  const fair = document.getElementById('qp-fair');
  if (fair) fair.value = values.fairness || 'weighted_round_robin';
  setNum('qp-pri', values.defaultPriority);
  setNum('qp-ppri', values.playgroundPriority);
  setNum('qp-lease', values.leaseMs);
  setNum('qp-wait', values.maxWaitMs);
  updateQueuePresetUI();
}

function updateQueuePresetUI() {
  if (!document.getElementById('queue-policy-panel')) return;
  let formPol;
  try {
    formPol = readQueuePolicyForm();
  } catch {
    return;
  }
  const formMatch = matchQueuePreset(formPol);
  const savedMatch = matchQueuePreset(state._queuePolicyCache || formPol);
  const unsaved = !queuePoliciesEqual(
    formPol,
    state._queuePolicyCache || formPol,
  );

  document.querySelectorAll('[data-queue-preset]').forEach((btn) => {
    const name = btn.dataset.queuePreset;
    if (name === 'custom') {
      const isCustom = formMatch === 'custom';
      btn.classList.toggle('is-active', isCustom);
      btn.setAttribute('aria-pressed', isCustom ? 'true' : 'false');
      btn.disabled = !isCustom;
      return;
    }
    const isForm = name === formMatch;
    const isSaved = name === savedMatch;
    btn.classList.toggle('is-active', isForm);
    btn.classList.toggle('is-saved', isSaved && !isForm);
    btn.setAttribute('aria-pressed', isForm ? 'true' : 'false');
    const base =
      name === 'relaxed'
        ? t('queue.presetRelaxed')
        : name === 'balanced'
          ? t('queue.presetBalanced')
          : t('queue.presetStrict');
    if (isForm && isSaved) {
      btn.innerHTML = `${escapeHtml(base)} <span class="preset-tag">${escapeHtml(t('queue.presetTagActive'))}</span>`;
    } else if (isForm && unsaved) {
      btn.innerHTML = `${escapeHtml(base)} <span class="preset-tag preset-tag--draft">${escapeHtml(t('queue.presetTagDraft'))}</span>`;
    } else if (isSaved) {
      btn.innerHTML = `${escapeHtml(base)} <span class="preset-tag preset-tag--saved">${escapeHtml(t('queue.presetTagSaved'))}</span>`;
    } else {
      btn.textContent = base;
    }
  });

  const badgeHost = document.getElementById('queue-preset-badge');
  if (badgeHost) {
    badgeHost.outerHTML = queuePresetBadgeHtml(formMatch, {
      unsaved: unsaved && formMatch !== savedMatch,
    });
  }

  const hint = document.getElementById('queue-preset-hint');
  if (hint) {
    const hints = {
      relaxed: t('queue.presetRelaxedHint'),
      balanced: t('queue.presetBalancedHint'),
      strict: t('queue.presetStrictHint'),
      custom: t('queue.presetCustomHint'),
    };
    hint.textContent = hints[formMatch] || hints.custom;
  }
}

function bindQueuePresetControls() {
  document.querySelectorAll('[data-queue-preset]').forEach((btn) => {
    if (btn.dataset.queuePreset === 'custom') return;
    btn.onclick = () => {
      const name = btn.dataset.queuePreset;
      const preset = queuePolicyPresets()[name];
      if (!preset) return;
      applyQueuePresetToForm(preset);
    };
  });
  [
    'qp-gconc',
    'qp-kconc',
    'qp-depth',
    'qp-depthk',
    'qp-fair',
    'qp-pri',
    'qp-ppri',
    'qp-lease',
    'qp-wait',
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('change', () => updateQueuePresetUI());
    el.addEventListener('input', () => updateQueuePresetUI());
  });
  updateQueuePresetUI();
}

function queueMainScrollEl() {
  return document.querySelector('.main');
}

function queueJobRowsHtml(jobs) {
  return jobs
    .map((j) => {
      const activeJob =
        j.status === 'queued' || j.status === 'leased' || j.status === 'running';
      const requeueable =
        j.status === 'failed' || j.status === 'dead' || j.status === 'cancelled';
      const waitMs =
        j.startedAt || j.finishedAt
          ? null
          : j.queuedAt
            ? Date.now() - new Date(j.queuedAt).getTime()
            : null;
      return `
    <tr data-q-row="${escapeHtml(j.id)}">
      <td>
        <div class="cell-primary mono" title="${escapeHtml(j.id || '')}">${escapeHtml((j.id || '').slice(0, 10))}…</div>
        <div class="cell-sub mono" title="${escapeHtml(j.requestId || '')}">${escapeHtml((j.requestId || '').slice(0, 18))}${(j.requestId || '').length > 18 ? '…' : ''}</div>
        ${
          j.errorMessage
            ? `<div class="queue-job-err" title="${escapeHtml(j.errorMessage)}">${escapeHtml(String(j.errorMessage).slice(0, 80))}</div>`
            : ''
        }
      </td>
      <td>${badgeQueueSource(j.source)}</td>
      <td>
        ${badgeQueueStatus(j.status)}
        ${j.cancelRequested ? `<div class="cell-sub">${escapeHtml(t('queue.cancelReq'))}</div>` : ''}
      </td>
      <td class="mono" title="${escapeHtml(j.model || '')}">${escapeHtml(j.model || '—')}</td>
      <td><span class="queue-pri">${j.priority ?? '—'}</span></td>
      <td>
        <div class="cell-primary mono" title="${escapeHtml(j.apiKeyId || '')}">${escapeHtml((j.apiKeyId || '').slice(0, 8))}…</div>
      </td>
      <td class="mono">${j.attempt ?? 0}<span class="muted">/${j.maxAttempts ?? 1}</span></td>
      <td>
        <div class="cell-primary">${fmtTime(j.queuedAt)}</div>
        ${
          waitMs != null && j.status === 'queued'
            ? `<div class="cell-sub" data-q-wait>${escapeHtml(t('queue.wait'))}: ${fmtQueueAge(waitMs)}</div>`
            : j.startedAt
              ? `<div class="cell-sub">${escapeHtml(t('queue.started'))}: ${fmtTime(j.startedAt)}</div>`
              : ''
        }
      </td>
      <td>
        <div class="row-actions">
        ${
          activeJob
            ? `<button type="button" class="btn danger sm" data-q-cancel="${escapeHtml(j.id)}">${escapeHtml(t('queue.cancel'))}</button>`
            : ''
        }
        ${
          j.status === 'queued'
            ? `<button type="button" class="btn secondary sm" data-q-pri="${escapeHtml(j.id)}" data-pri="${j.priority}">${escapeHtml(t('queue.priorityBtn'))}</button>`
            : ''
        }
        ${
          requeueable
            ? `<button type="button" class="btn secondary sm" data-q-requeue="${escapeHtml(j.id)}">${escapeHtml(t('queue.requeue'))}</button>`
            : ''
        }
        </div>
      </td>
    </tr>`;
    })
    .join('');
}

function bindQueueRowActions() {
  document.querySelectorAll('[data-q-cancel]').forEach((b) => {
    b.onclick = async () => {
      if (
        !(await uiConfirm({
          title: t('queue.cancel'),
          message: t('queue.cancelConfirm'),
          variant: 'danger',
          confirmText: t('queue.cancel'),
        }))
      )
        return;
      await api(`/queue/jobs/${b.dataset.qCancel}/cancel`, {
        method: 'POST',
        body: '{}',
      });
      renderQueue().catch(onErr);
    };
  });
  document.querySelectorAll('[data-q-requeue]').forEach((b) => {
    b.onclick = async () => {
      await api(`/queue/jobs/${b.dataset.qRequeue}/requeue`, {
        method: 'POST',
        body: '{}',
      });
      renderQueue().catch(onErr);
    };
  });
  document.querySelectorAll('[data-q-pri]').forEach((b) => {
    b.onclick = async () => {
      const cur = Number(b.dataset.pri) || 100;
      const raw = window.prompt(t('queue.priorityPh'), String(cur));
      if (raw == null) return;
      const priority = Number(raw);
      if (!Number.isFinite(priority) || priority < 0 || priority > 1000) return;
      await api(`/queue/jobs/${b.dataset.qPri}/priority`, {
        method: 'POST',
        body: JSON.stringify({ priority }),
      });
      renderQueue().catch(onErr);
    };
  });
}

function queueModeLabel(pol) {
  if (!pol.enabled) return t('queue.modeOff');
  if (pol.paused) return t('queue.paused');
  if (pol.drainMode) return t('queue.drain');
  return t('queue.running');
}

/** Soft live-update: KPIs + job table only (keeps scroll / form focus). */
function applyQueueSoftUpdate({ s, pol, jobs, total, by }) {
  const deadCount = s.dead ?? by.dead ?? 0;
  const leased = s.leased ?? by.leased ?? 0;
  const running = s.running ?? by.running ?? 0;
  const queued = s.queued ?? by.queued ?? 0;
  const depth = s.depth ?? queued + leased + running;
  const modeLabel = queueModeLabel(pol);
  const fairnessLabel =
    pol.fairness === 'fifo_global' ? t('queue.fifo') : t('queue.wrr');

  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };
  const setHtml = (id, html) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  };

  setText('qk-depth', String(depth));
  setText('qk-depth-sub', tf('queue.kpiDepthSub', { q: queued, l: leased }));
  setHtml(
    'qk-running',
    `${running}<span class="dash-kpi-den">/${pol.globalConcurrency ?? '—'}</span>`,
  );
  setText('qk-running-sub', tf('queue.kpiActiveSub', { n: s.workerActive ?? 0 }));
  setText('qk-queued', String(queued));
  setText('qk-dead', String(deadCount));
  setText(
    'qk-oldest',
    s.oldestQueuedAgeMs ? fmtQueueAge(s.oldestQueuedAgeMs) : '—',
  );
  setText('qk-mode', modeLabel);
  setText('qk-mode-sub', fairnessLabel);

  const workerEl = document.getElementById('qk-worker-id');
  if (workerEl) {
    const wid = s.workerId || '—';
    workerEl.textContent = wid;
    workerEl.title = wid;
  }

  const setPill = (id, ok, okText, badText) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.outerHTML = `<span id="${id}">${dashStatusPill(ok, okText, badText)}</span>`;
  };
  setPill(
    'qk-pill-enabled',
    pol.enabled !== false,
    t('dash.on'),
    t('dash.off'),
  );
  setPill(
    'qk-pill-consumer',
    !pol.paused && pol.enabled !== false,
    t('queue.running'),
    pol.paused ? t('queue.paused') : t('queue.modeOff'),
  );
  setPill(
    'qk-pill-admission',
    !pol.drainMode,
    t('queue.accepting'),
    t('queue.drain'),
  );
  setText('qk-fairness-val', fairnessLabel);
  setText(
    'qk-conc-val',
    `${pol.perKeyConcurrency ?? 1} / ${pol.globalConcurrency ?? '—'}`,
  );

  // DLQ banner show/hide
  const dlqHost = document.getElementById('queue-dlq-slot');
  if (dlqHost) {
    if (deadCount > 0) {
      dlqHost.innerHTML = `
        <div class="queue-dlq-banner" role="status">
          <div class="queue-dlq-text">
            <strong>${escapeHtml(t('queue.dlqTitle'))}</strong>
            <span class="queue-dlq-count">${deadCount}</span>
            <span class="muted">${escapeHtml(t('queue.dlqHint'))}</span>
          </div>
          <div class="toolbar">
            <button type="button" class="btn secondary sm" id="q-filter-dead">${escapeHtml(t('queue.viewDlq'))}</button>
            <button type="button" class="btn danger sm" id="q-purge-dlq">${escapeHtml(t('queue.purgeDead'))}</button>
          </div>
        </div>`;
      document.getElementById('q-filter-dead')?.addEventListener('click', () => {
        queueFilter.status = 'dead';
        queueFilter.offset = 0;
        queueFilter.tab = 'jobs';
        renderQueue().catch(onErr);
      });
      // #q-purge-dlq handled via #queue-root click delegation (doPurge)
    } else {
      dlqHost.innerHTML = '';
    }
  }

  // Tab badge counts (overview KPIs live on overview; jobs badge uses list total)
  const setCount = (id, n) => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(n ?? 0);
  };
  setCount('q-tab-count-jobs', total);
  setCount('q-tab-count-dead', deadCount);

  const meta = document.getElementById('qk-jobs-meta');
  if (meta) meta.textContent = tf('queue.jobsMeta', { n: total });

  const tbody = document.querySelector('#queue-jobs-table tbody');
  if (tbody) {
    // Stable soft-refresh: skip DOM rewrite when row identity unchanged (avoids column jump)
    const sig = jobs
      .map(
        (j) =>
          `${j.id}|${j.status}|${j.priority}|${j.attempt}|${j.cancelRequested ? 1 : 0}|${j.errorMessage || ''}|${j.startedAt || ''}|${j.finishedAt || ''}`,
      )
      .join(';');
    const nextBody =
      queueJobRowsHtml(jobs) ||
      `<tr class="empty-row"><td colspan="9">
        <div class="data-empty">
          <div class="data-empty-icon">∅</div>
          <strong>${escapeHtml(t('queue.empty'))}</strong>
        </div>
      </td></tr>`;
    if (tbody.dataset.qsig !== sig) {
      const wrap = document.querySelector('#queue-jobs-table .table-wrap');
      const sx = wrap?.scrollLeft || 0;
      tbody.dataset.qsig = sig;
      tbody.innerHTML = nextBody;
      bindQueueRowActions();
      if (wrap) wrap.scrollLeft = sx;
    } else {
      // Only refresh live wait ages in-place (no full reflow)
      jobs.forEach((j) => {
        if (j.status !== 'queued' || !j.queuedAt) return;
        const waitMs = Date.now() - new Date(j.queuedAt).getTime();
        const id = String(j.id || '');
        let row = null;
        tbody.querySelectorAll('[data-q-row]').forEach((el) => {
          if (el.getAttribute('data-q-row') === id) row = el;
        });
        const waitEl = row?.querySelector('[data-q-wait]');
        if (waitEl) {
          waitEl.textContent = `${t('queue.wait')}: ${fmtQueueAge(waitMs)}`;
        }
      });
    }
  }

  // Pager meta only (avoid rebuilding selects and resetting focus)
  const pagerTotal = document.querySelector('#queue-pager .data-pager-meta span');
  if (pagerTotal) {
    const pages = Math.max(1, Math.ceil((total || 0) / queueFilter.limit) || 1);
    const page = Math.floor(queueFilter.offset / queueFilter.limit) + 1;
    const spans = document.querySelectorAll('#queue-pager .data-pager-meta > span');
    if (spans[0]) spans[0].textContent = tf('common.pagerTotal', { n: total || 0 });
    if (spans[1])
      spans[1].textContent = tf('common.pagerPage', { n: page, total: pages });
    const prev = document.getElementById('queue-prev');
    const next = document.getElementById('queue-next');
    if (prev) prev.disabled = queueFilter.offset <= 0;
    if (next) next.disabled = queueFilter.offset + queueFilter.limit >= total;
  }

  // Toolbar button labels (pause / drain may have changed externally)
  const pauseBtn = document.getElementById('q-pause');
  if (pauseBtn)
    pauseBtn.textContent = pol.paused ? t('queue.resume') : t('queue.pause');
  const drainBtn = document.getElementById('q-drain');
  if (drainBtn)
    drainBtn.textContent = pol.drainMode ? t('queue.undrain') : t('queue.drainBtn');

  // Master enable switch (don't fight user mid-click — only sync when not focused)
  const master = document.getElementById('q-master-enabled');
  if (master && document.activeElement !== master) {
    applyQueueEnabledUi(pol.enabled !== false);
  }
}

function ensureQueueAutoRefresh() {
  if (queueTimer) return;
  queueTimer = setInterval(() => {
    if (state.page !== 'queue') {
      clearInterval(queueTimer);
      queueTimer = null;
      return;
    }
    const el = document.activeElement;
    if (
      el &&
      el.closest &&
      el.closest('#queue-policy-panel') &&
      (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA')
    ) {
      return;
    }
    // Soft refresh: no full shell rebuild → scroll stays put
    renderQueue({ soft: true }).catch(() => {});
  }, 4000);
}

async function renderQueue(opts = {}) {
  const soft = Boolean(opts.soft) && document.getElementById('queue-root');

  if (!soft && queueTimer) {
    clearInterval(queueTimer);
    queueTimer = null;
  }

  // Preserve scroll across full re-renders (filter / save / manual refresh)
  const scrollEl = queueMainScrollEl();
  const savedScroll = !soft && scrollEl ? scrollEl.scrollTop : 0;

  const f = queueFilter;
  const q = new URLSearchParams();
  q.set('limit', String(f.limit));
  q.set('offset', String(f.offset));
  if (f.status) q.set('status', f.status);

  const [statsRes, jobsRes, policyRes] = await Promise.all([
    api('/queue/stats'),
    api(`/queue/jobs?${q}`),
    api('/queue/policy'),
  ]);
  // Page may have changed during fetch
  if (state.page !== 'queue') return;

  const s = statsRes.data || {};
  const pol = policyRes.data || s.policy || {};
  const jobs = jobsRes.data || [];
  const total = jobsRes.total ?? jobs.length;
  const by = s.byStatus || {};
  const deadCount = s.dead ?? by.dead ?? 0;
  const leased = s.leased ?? by.leased ?? 0;
  const running = s.running ?? by.running ?? 0;
  const queued = s.queued ?? by.queued ?? 0;
  const depth = s.depth ?? queued + leased + running;
  const modeLabel = queueModeLabel(pol);

  // Cache saved policy for preset matching (soft + full)
  state._queuePolicyCache = { ...pol };

  if (soft) {
    applyQueueSoftUpdate({ s, pol, jobs, total, by });
    ensureQueueAutoRefresh();
    return;
  }

  if (!queueFilter.tab) queueFilter.tab = 'overview';
  const tab =
    queueFilter.tab === 'jobs' || queueFilter.tab === 'policy'
      ? queueFilter.tab
      : 'overview';
  queueFilter.tab = tab;

  const bodyHtml = queueJobRowsHtml(jobs);

  const filter = filterPanelHtml({
    title: t('queue.filterTitle'),
    hint: t('queue.filterHint'),
    meta: tf('queue.jobsMeta', { n: total }),
    gridHtml: `
      <label>${escapeHtml(t('queue.filterStatus'))}
        <select id="qf-status">
          <option value="">${escapeHtml(t('queue.allStatuses'))}</option>
          <option value="queued" ${f.status === 'queued' ? 'selected' : ''}>${escapeHtml(t('queue.filterQueued'))}</option>
          <option value="active" ${f.status === 'active' ? 'selected' : ''}>${escapeHtml(t('queue.filterRunning'))}</option>
          <option value="dead" ${f.status === 'dead' ? 'selected' : ''}>${escapeHtml(t('queue.filterDead'))}</option>
          <option value="failed" ${f.status === 'failed' ? 'selected' : ''}>${escapeHtml(t('queue.filterFailed'))}</option>
          <option value="succeeded" ${f.status === 'succeeded' ? 'selected' : ''}>${escapeHtml(t('queue.filterSucceeded'))}</option>
          <option value="cancelled" ${f.status === 'cancelled' ? 'selected' : ''}>${escapeHtml(t('queue.filterCancelled'))}</option>
        </select>
      </label>`,
  });

  const table = dataTablePanelHtml({
    headHtml: `
      <th>${escapeHtml(t('queue.colJob'))}</th>
      <th>${escapeHtml(t('queue.colSource'))}</th>
      <th>${escapeHtml(t('queue.colStatus'))}</th>
      <th>${escapeHtml(t('queue.colModel'))}</th>
      <th>${escapeHtml(t('queue.colPri'))}</th>
      <th>${escapeHtml(t('queue.colKey'))}</th>
      <th>${escapeHtml(t('queue.colTry'))}</th>
      <th>${escapeHtml(t('queue.colTime'))}</th>
      <th>${escapeHtml(t('common.actions'))}</th>`,
    bodyHtml,
    colSpan: 9,
    emptyText: t('queue.empty'),
    pagerHtml: pagerHtml({
      total,
      limit: f.limit,
      offset: f.offset,
      idPrefix: 'queue',
    }),
  });

  const fairnessLabel =
    pol.fairness === 'fifo_global' ? t('queue.fifo') : t('queue.wrr');

  const queueOn = pol.enabled !== false;

  /** Standard page KPI card (.grid > .card) — same as Usage / DDoS */
  const kpiCard = (label, valueHtml, subText, valueId, subId) => `
    <div class="card">
      <div class="label">${escapeHtml(label)}</div>
      <div class="value value-sm" id="${escapeHtml(valueId)}">${valueHtml}</div>
      ${
        subText != null && subText !== ''
          ? `<div class="muted card-sub"${subId ? ` id="${escapeHtml(subId)}"` : ''}>${escapeHtml(String(subText))}</div>`
          : ''
      }
    </div>`;

  // Always-visible KPI strip (same .grid/.card pattern as Usage & DDoS)
  const kpiGrid = `
    <div class="grid queue-kpi-grid" id="queue-kpi-grid">
      ${kpiCard(
        t('queue.depth'),
        escapeHtml(String(depth)),
        tf('queue.kpiDepthSub', { q: queued, l: leased }),
        'qk-depth',
        'qk-depth-sub',
      )}
      ${kpiCard(
        t('queue.activeJobs'),
        `${running}<span class="dash-kpi-den">/${pol.globalConcurrency ?? '—'}</span>`,
        tf('queue.kpiActiveSub', { n: s.workerActive ?? 0 }),
        'qk-running',
        'qk-running-sub',
      )}
      ${kpiCard(
        t('queue.queued'),
        escapeHtml(String(queued)),
        t('queue.kpiQueuedSub'),
        'qk-queued',
        'qk-queued-sub',
      )}
      ${kpiCard(
        t('queue.dead'),
        escapeHtml(String(deadCount)),
        t('queue.kpiDeadSub'),
        'qk-dead',
        'qk-dead-sub',
      )}
      ${kpiCard(
        t('queue.oldest'),
        escapeHtml(s.oldestQueuedAgeMs ? fmtQueueAge(s.oldestQueuedAgeMs) : '—'),
        t('queue.kpiOldestSub'),
        'qk-oldest',
        'qk-oldest-sub',
      )}
      ${kpiCard(
        t('queue.mode'),
        escapeHtml(modeLabel),
        fairnessLabel,
        'qk-mode',
        'qk-mode-sub',
      )}
    </div>`;

  const overviewPane = `
    <div class="panel data-table-panel queue-status-panel">
      <div class="panel-h">
        <div class="panel-h-text">
          <strong>${escapeHtml(t('queue.statusPanel'))}</strong>
          <span class="muted panel-h-sub">${escapeHtml(t('queue.statusPanelHint'))}</span>
        </div>
      </div>
      <div class="panel-pad">
        <div class="queue-status-row queue-status-row--6">
          <div class="queue-status-item">
            <span class="label">${escapeHtml(t('queue.enabled'))}</span>
            <span id="qk-pill-enabled">${dashStatusPill(pol.enabled !== false, t('dash.on'), t('dash.off'))}</span>
          </div>
          <div class="queue-status-item">
            <span class="label">${escapeHtml(t('queue.consumer'))}</span>
            <span id="qk-pill-consumer">${dashStatusPill(!pol.paused && pol.enabled !== false, t('queue.running'), pol.paused ? t('queue.paused') : t('queue.modeOff'))}</span>
          </div>
          <div class="queue-status-item">
            <span class="label">${escapeHtml(t('queue.admission'))}</span>
            <span id="qk-pill-admission">${dashStatusPill(!pol.drainMode, t('queue.accepting'), t('queue.drain'))}</span>
          </div>
          <div class="queue-status-item">
            <span class="label">${escapeHtml(t('queue.fairness'))}</span>
            <strong class="queue-status-val" id="qk-fairness-val">${escapeHtml(fairnessLabel)}</strong>
          </div>
          <div class="queue-status-item">
            <span class="label">${escapeHtml(t('queue.concurrency'))}</span>
            <strong class="queue-status-val mono" id="qk-conc-val">${pol.perKeyConcurrency ?? 1} / ${pol.globalConcurrency ?? '—'}</strong>
          </div>
          <div class="queue-status-item queue-status-item--worker">
            <span class="label">${escapeHtml(t('queue.workerInstance'))}</span>
            <code class="queue-worker-id" id="qk-worker-id" title="${escapeHtml(s.workerId || '')}">${escapeHtml(s.workerId || '—')}</code>
            <span class="queue-worker-hint muted">${escapeHtml(t('queue.workerInstanceHint'))}</span>
          </div>
        </div>
      </div>
    </div>

    <div id="queue-dlq-slot">
    ${
      deadCount > 0
        ? `<div class="queue-dlq-banner" role="status">
      <div class="queue-dlq-text">
        <strong>${escapeHtml(t('queue.dlqTitle'))}</strong>
        <span class="queue-dlq-count">${deadCount}</span>
        <span class="muted">${escapeHtml(t('queue.dlqHint'))}</span>
      </div>
      <div class="toolbar">
        <button type="button" class="btn secondary sm" id="q-filter-dead">${escapeHtml(t('queue.viewDlq'))}</button>
        <button type="button" class="btn danger sm" id="q-purge-dlq">${escapeHtml(t('queue.purgeDead'))}</button>
      </div>
    </div>`
        : ''
    }
    </div>`;

  const jobsPane = `
    ${filter}
    <div id="queue-jobs-table" class="queue-jobs-table-host">${table}</div>`;

  const policyPane = `
    <div class="panel data-table-panel queue-policy-panel" id="queue-policy-panel">
      <div class="panel-h">
        <div class="panel-h-text">
          <strong>${escapeHtml(t('queue.policyTitle'))}</strong>
          <span class="muted panel-h-sub">${escapeHtml(t('queue.policyHint'))}</span>
        </div>
        ${queuePresetBadgeHtml(matchQueuePreset(pol))}
      </div>
      <div class="panel-pad">
        <div class="ddos-preset-block">
          <div class="ddos-preset-block-h">
            <strong>${escapeHtml(t('queue.presetTitle'))}</strong>
            <span class="muted">${escapeHtml(t('queue.presetHint'))}</span>
          </div>
          <div class="ddos-presets" role="group" aria-label="${escapeHtml(t('queue.presetTitle'))}">
            <button type="button" class="ddos-preset-btn" data-queue-preset="relaxed" data-ddos-preset="relaxed" aria-pressed="false">${escapeHtml(t('queue.presetRelaxed'))}</button>
            <button type="button" class="ddos-preset-btn" data-queue-preset="balanced" data-ddos-preset="balanced" aria-pressed="false">${escapeHtml(t('queue.presetBalanced'))}</button>
            <button type="button" class="ddos-preset-btn" data-queue-preset="strict" data-ddos-preset="strict" aria-pressed="false">${escapeHtml(t('queue.presetStrict'))}</button>
            <button type="button" class="ddos-preset-btn ddos-preset-btn--custom" data-queue-preset="custom" disabled aria-pressed="false">${escapeHtml(t('queue.presetCustom'))}</button>
          </div>
          <p class="ddos-preset-hint" id="queue-preset-hint"></p>
        </div>
        <div class="form-grid">
          <label>${escapeHtml(t('queue.globalConcurrency'))}
            <input type="number" id="qp-gconc" min="1" max="64" value="${Number(pol.globalConcurrency) || 2}" />
            <span class="hint">${escapeHtml(t('queue.hintGlobalConc'))}</span>
          </label>
          <label>${escapeHtml(t('queue.perKeyConcurrency'))}
            <input type="number" id="qp-kconc" min="1" max="16" value="${Number(pol.perKeyConcurrency) || 1}" />
            <span class="hint">${escapeHtml(t('queue.hintPerKeyConc'))}</span>
          </label>
          <label>${escapeHtml(t('queue.maxDepth'))}
            <input type="number" id="qp-depth" min="1" value="${Number(pol.maxQueueDepth) || 100}" />
            <span class="hint">${escapeHtml(t('queue.hintMaxDepth'))}</span>
          </label>
          <label>${escapeHtml(t('queue.maxDepthKey'))}
            <input type="number" id="qp-depthk" min="1" value="${Number(pol.maxQueueDepthPerKey) || 20}" />
            <span class="hint">${escapeHtml(t('queue.hintMaxDepthKey'))}</span>
          </label>
          <label>${escapeHtml(t('queue.fairness'))}
            <select id="qp-fair">
              <option value="weighted_round_robin" ${pol.fairness === 'weighted_round_robin' ? 'selected' : ''}>${escapeHtml(t('queue.wrr'))}</option>
              <option value="fifo_global" ${pol.fairness === 'fifo_global' ? 'selected' : ''}>${escapeHtml(t('queue.fifo'))}</option>
            </select>
            <span class="hint">${escapeHtml(t('queue.hintFairness'))}</span>
          </label>
          <label>${escapeHtml(t('queue.defaultPriority'))}
            <input type="number" id="qp-pri" min="0" max="1000" value="${Number(pol.defaultPriority) || 100}" />
          </label>
          <label>${escapeHtml(t('queue.playgroundPriority'))}
            <input type="number" id="qp-ppri" min="0" max="1000" value="${Number(pol.playgroundPriority) || 50}" />
          </label>
          <label>${escapeHtml(t('queue.leaseMs'))}
            <input type="number" id="qp-lease" min="5000" step="1000" value="${Number(pol.leaseMs) || 45000}" />
            <span class="hint">${escapeHtml(t('queue.hintLease'))}</span>
          </label>
          <label>${escapeHtml(t('queue.maxWaitMs'))}
            <input type="number" id="qp-wait" min="5000" step="1000" value="${Number(pol.maxWaitMs) || 600000}" />
            <span class="hint">${escapeHtml(t('queue.hintMaxWait'))}</span>
          </label>
        </div>
        <div class="toolbar settings-save-bar">
          <button type="button" class="btn sm" id="qp-save">${escapeHtml(t('queue.savePolicy'))}</button>
        </div>
      </div>
    </div>`;

  document.getElementById('app').innerHTML = shell(`
  <div id="queue-root" class="${queueOn ? '' : 'is-feature-off'}">
    <div class="topbar">
      <h2>${escapeHtml(t('queue.title'))}</h2>
      <div class="toolbar">
        ${masterToggleBtnHtml({
          id: 'q-master-enabled',
          on: queueOn,
          onLabel: t('queue.masterOn'),
          offLabel: t('queue.masterOff'),
          title: t('queue.masterHint'),
        })}
        <button type="button" class="btn secondary sm" id="q-pause">${escapeHtml(pol.paused ? t('queue.resume') : t('queue.pause'))}</button>
        <button type="button" class="btn secondary sm" id="q-drain">${escapeHtml(pol.drainMode ? t('queue.undrain') : t('queue.drainBtn'))}</button>
        <button type="button" class="btn danger sm" id="q-purge">${escapeHtml(t('queue.purgeDead'))}</button>
      </div>
    </div>
    ${pageMetaHtml([t('queue.subtitle')])}
    <div class="feature-off-banner" id="queue-disabled-banner" ${queueOn ? 'hidden' : ''} role="status">
      <strong>${escapeHtml(t('common.featureOff'))}</strong>
      <span>${escapeHtml(t('queue.disabledBanner'))}</span>
    </div>

    ${kpiGrid}

    <div class="usage-tabs-panel panel queue-tabs-panel">
      <div class="seg-tabs" role="tablist" aria-label="${escapeHtml(t('queue.title'))}">
        <button type="button" role="tab" class="seg-tab ${tab === 'overview' ? 'is-active' : ''}" data-queue-tab="overview" aria-selected="${tab === 'overview'}">
          ${escapeHtml(t('queue.tabOverview'))}
        </button>
        <button type="button" role="tab" class="seg-tab ${tab === 'jobs' ? 'is-active' : ''}" data-queue-tab="jobs" aria-selected="${tab === 'jobs'}">
          ${escapeHtml(t('queue.tabJobs'))}
          <span class="seg-tab-count" id="q-tab-count-jobs">${total}</span>
        </button>
        <button type="button" role="tab" class="seg-tab ${tab === 'policy' ? 'is-active' : ''}" data-queue-tab="policy" aria-selected="${tab === 'policy'}">
          ${escapeHtml(t('queue.tabPolicy'))}
        </button>
      </div>
      <div class="usage-tab-body">
        <div class="usage-tab-pane queue-tab-pane-overview" id="queue-tab-overview" ${tab === 'overview' ? '' : 'hidden'}>
          ${overviewPane}
        </div>
        <div class="usage-tab-pane queue-tab-pane-jobs" id="queue-tab-jobs" ${tab === 'jobs' ? '' : 'hidden'}>
          ${jobsPane}
        </div>
        <div class="usage-tab-pane queue-tab-pane-policy" id="queue-tab-policy" ${tab === 'policy' ? '' : 'hidden'}>
          ${policyPane}
        </div>
      </div>
    </div>
  </div>
  `);
  bindShell();

  document.querySelectorAll('[data-queue-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = btn.getAttribute('data-queue-tab') || 'overview';
      if (next !== 'overview' && next !== 'jobs' && next !== 'policy') return;
      if (queueFilter.tab === next) return;
      queueFilter.tab = next;
      if (next === 'jobs') {
        /* keep filters */
      } else {
        /* policy/overview: no offset change */
      }
      renderQueue().catch(onErr);
    });
  });

  // Restore scroll after full rebuild (filter / save / navigation)
  if (savedScroll > 0) {
    const main = queueMainScrollEl();
    if (main) {
      main.scrollTop = savedScroll;
      requestAnimationFrame(() => {
        main.scrollTop = savedScroll;
      });
    }
  }

  document.getElementById('q-master-enabled').onclick = async () => {
    const next = !isMasterToggleOn('q-master-enabled');
    applyQueueEnabledUi(next);
    try {
      const res = await api('/queue/policy', {
        method: 'PUT',
        body: JSON.stringify({ enabled: next }),
      });
      state._queuePolicyCache = {
        ...(state._queuePolicyCache || {}),
        ...(res.data || { enabled: next }),
      };
      updateQueuePresetUI();
    } catch (e) {
      applyQueueEnabledUi(!next);
      onErr(e);
    }
  };

  document.getElementById('q-pause').onclick = async () => {
    await api(pol.paused ? '/queue/resume' : '/queue/pause', {
      method: 'POST',
      body: '{}',
    });
    renderQueue().catch(onErr);
  };
  document.getElementById('q-drain').onclick = async () => {
    await api(pol.drainMode ? '/queue/undrain' : '/queue/drain', {
      method: 'POST',
      body: '{}',
    });
    renderQueue().catch(onErr);
  };
  let purgeBusy = false;
  const doPurge = async () => {
    if (purgeBusy) return;
    purgeBusy = true;
    try {
      const ok = await uiConfirm({
        title: t('queue.purgeTitle'),
        message: t('queue.purgeConfirm'),
        variant: 'danger',
        confirmText: t('queue.purgeConfirmBtn'),
        cancelText: t('common.cancel'),
      });
      if (!ok) return;
      const res = await api('/queue/purge-dead', {
        method: 'POST',
        body: '{}',
      });
      const n = Number(res?.data?.deleted ?? 0);
      await uiAlert({
        title: t('queue.purgeDoneTitle'),
        message: tf('queue.purgeDoneMsg', { n }),
        confirmText: t('common.ok'),
      });
      await renderQueue();
    } finally {
      purgeBusy = false;
    }
  };
  // Event delegation: soft-refresh rebuilds #q-purge-dlq; onclick rebinds each full render
  const queueRoot = document.getElementById('queue-root');
  if (queueRoot) {
    queueRoot.onclick = (e) => {
      const btn = e.target?.closest?.('#q-purge, #q-purge-dlq');
      if (!btn) return;
      e.preventDefault();
      doPurge().catch(onErr);
    };
  }
  document.getElementById('q-filter-dead')?.addEventListener('click', () => {
    queueFilter.status = 'dead';
    queueFilter.offset = 0;
    queueFilter.tab = 'jobs';
    renderQueue().catch(onErr);
  });

  document.querySelectorAll('[data-filter-apply]').forEach((btn) => {
    btn.onclick = () => {
      queueFilter.status = document.getElementById('qf-status')?.value || '';
      queueFilter.offset = 0;
      renderQueue().catch(onErr);
    };
  });
  document.querySelectorAll('[data-filter-reset]').forEach((btn) => {
    btn.onclick = () => {
      queueFilter.status = '';
      queueFilter.offset = 0;
      renderQueue().catch(onErr);
    };
  });

  bindPager('queue', queueFilter, () => renderQueue().catch(onErr));

  document.getElementById('qp-save').onclick = async () => {
    const body = readQueuePolicyForm();
    await api('/queue/policy', { method: 'PUT', body: JSON.stringify(body) });
    state._queuePolicyCache = { ...(state._queuePolicyCache || {}), ...body };
    showError('');
    renderQueue().catch(onErr);
  };

  bindQueuePresetControls();
  bindQueueRowActions();
  ensureQueueAutoRefresh();
}

// Boot Admin SPA (must run after all function declarations)
// Hash routing: refresh / share keeps page; Back/Forward works.
state.page = readInitialPage();
if (!location.hash || location.hash === '#' || location.hash === '#/') {
  writePageHash(state.page);
}
window.addEventListener('hashchange', () => {
  const p = hashToPage(location.hash);
  if (!p) return;
  if (p === state.page) return;
  // popstate/hash from browser — do not push again
  applyPageChange(p, { writeHash: false });
});
window.addEventListener('popstate', () => {
  const p = hashToPage(location.hash);
  if (!p || p === state.page) return;
  applyPageChange(p, { writeHash: false });
});
render();
