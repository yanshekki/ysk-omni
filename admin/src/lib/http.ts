import { API_BASE } from '../config/constants';
import { getToken, logout } from '../state/store';
import type { ApiErrorBody } from '../types/api/common';
import { hasT, t } from '../i18n';
import { formatApiError } from './api-error';

export class HttpError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.body = body;
  }
}

export type ApiSendOptions = {
  method?: string;
  body?: unknown;
  formData?: FormData;
  headers?: Record<string, string>;
  /** Skip Authorization header */
  noAuth?: boolean;
  /** Absolute path (starts with /) or relative to API_BASE */
  absolute?: boolean;
};

function resolveUrl(path: string, absolute?: boolean): string {
  if (absolute || path.startsWith('http')) return path;
  if (path.startsWith('/admin/')) return path;
  return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Typed Admin API client — only outbound channel for pages/services.
 * Mirrors backend middleware concerns: Bearer auth, error envelope parse.
 */
export async function apiSend<T = unknown>(
  path: string,
  options: ApiSendOptions = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers || {}),
  };

  let body: BodyInit | undefined;
  if (options.formData) {
    body = options.formData;
  } else if (options.body !== undefined) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    body =
      typeof options.body === 'string'
        ? options.body
        : JSON.stringify(options.body);
  }

  if (!options.noAuth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(resolveUrl(path, options.absolute), {
    method: options.method || (body ? 'POST' : 'GET'),
    headers,
    body,
  });

  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { error: { message: text } };
  }

  if (!res.ok) {
    const errBody = data as ApiErrorBody;
    const msg = formatApiError(data, res.statusText, t, hasT);
    const code = errBody?.error?.code || '';
    if (res.status === 401) {
      logout(false);
    } else if (res.status === 403) {
      // Keep session for permission / feature errors
      const keepSession = [
        'media_forbidden',
        'feature_disabled',
        'forbidden',
        'media_not_supported',
      ].includes(code);
      if (!keepSession) logout(false);
    }
    throw new HttpError(msg, res.status, data);
  }

  return data as T;
}

export function apiGet<T = unknown>(path: string): Promise<T> {
  return apiSend<T>(path, { method: 'GET' });
}

export function apiPut<T = unknown>(path: string, body: unknown): Promise<T> {
  return apiSend<T>(path, { method: 'PUT', body });
}

export function apiPost<T = unknown>(path: string, body?: unknown): Promise<T> {
  return apiSend<T>(path, { method: 'POST', body });
}

export function apiPatch<T = unknown>(path: string, body: unknown): Promise<T> {
  return apiSend<T>(path, { method: 'PATCH', body });
}

export function apiDelete<T = unknown>(path: string): Promise<T> {
  return apiSend<T>(path, { method: 'DELETE' });
}

/** Binary download with auth (media / documents) */
export async function apiBlob(path: string): Promise<Blob> {
  const token = getToken();
  const res = await fetch(resolveUrl(path), {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    const text = await res.text();
    let msg = text;
    try {
      const j = JSON.parse(text) as ApiErrorBody;
      msg = j.error?.message || text;
    } catch {
      /* keep text */
    }
    if (res.status === 401 || res.status === 403) logout(false);
    throw new HttpError(msg || t('common.requestFailed'), res.status, null);
  }
  return res.blob();
}
