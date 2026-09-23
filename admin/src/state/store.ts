import {
  KEY_STORAGE,
  type PageId,
  pageToHash,
  PAGE_HASH,
} from '../config/constants';
import type { AppState, Listener } from '../types/state';

function defaultState(): AppState {
  return {
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
      tab: 'model',
      modelQ: '',
      keyQ: '',
      keyActive: '',
      modelPage: 0,
      keyPage: 0,
      pageSize: 10,
    },
    ddosFilter: {
      liveQ: '',
      banQ: '',
      banSource: '',
      livePage: 0,
      banPage: 0,
      pageSize: 15,
    },
    mediaKind: '',
    models: [],
    keys: [],
  };
}

const state: AppState = defaultState();
const listeners = new Set<Listener>();

/** Sync hash → page on boot */
export function readHashPage(): PageId | null {
  const raw = (location.hash || '').replace(/^#\/?/, '').split('?')[0];
  if (!raw) return null;
  const id = PAGE_HASH[raw.toLowerCase()] || PAGE_HASH[raw];
  return id || null;
}

export function writeHash(page: PageId): void {
  const h = `#/${pageToHash(page)}`;
  if (location.hash !== h) {
    history.replaceState(null, '', h);
  }
}

export function getState(): Readonly<AppState> {
  return state;
}

export function getToken(): string {
  return state.key;
}

export function setToken(token: string): void {
  state.key = token;
  if (token) sessionStorage.setItem(KEY_STORAGE, token);
  else sessionStorage.removeItem(KEY_STORAGE);
}

export function setError(msg: string): void {
  state.error = msg;
  const box = document.querySelector('#flash-error') as HTMLElement | null;
  if (box) {
    box.hidden = !msg;
    box.textContent = msg;
  }
}

export function clearError(): void {
  setError('');
}

export function setPage(page: PageId): void {
  state.page = page;
  state.modal = null;
  state.error = '';
  if (page === 'chats') state.chatFilter.offset = 0;
  if (page === 'documents') state.docFilter.offset = 0;
  if (page === 'keys') state.keyFilter.offset = 0;
  if (page === 'audit') state.auditFilter.offset = 0;
  if (page !== 'chat') {
    document.body.classList.remove('chat-history-open');
  }
  writeHash(page);
  notify();
}

export function patchState(partial: Partial<AppState>): void {
  Object.assign(state, partial);
}

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function notify(): void {
  for (const fn of listeners) fn();
}

/** Soft logout (401) or full logout */
export function logout(clear = true): void {
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
  writeHash('login');
  notify();
}

export function showError(msg: string): void {
  setError(msg);
}

export function onErr(e: unknown): void {
  console.error(e);
  const msg = e instanceof Error ? e.message : String(e);
  showError(msg);
}
