import { escapeHtml } from './dom';
import { t } from '../i18n';

export function badgeStatus(s: string | undefined | null): string {
  const c =
    s === 'success'
      ? 'success'
      : s === 'error' || s === 'timeout'
        ? 'error'
        : 'pending';
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

export function badgeMode(m: string | undefined | null): string {
  const mode = m === 'agent' ? 'agent' : m === 'safe' ? 'safe' : m || 'safe';
  const label =
    mode === 'agent'
      ? t('keys.modeAgentBadge')
      : mode === 'safe'
        ? t('keys.modeSafeBadge')
        : mode;
  return `<span class="badge ${mode === 'agent' ? 'agent' : 'safe'}">${escapeHtml(label)}</span>`;
}

export function badgeRole(r: string | undefined | null): string {
  const role = String(r || '').toLowerCase();
  const label =
    role === 'admin'
      ? t('keys.roleAdminBadge')
      : role === 'client' || role === 'user'
        ? t('keys.roleClientBadge')
        : r || '-';
  return escapeHtml(label);
}
