import { getLocale, tf } from '../i18n';

export function fmtTime(iso: string | null | undefined): string {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleString(
      getLocale() === 'zh-Hant' ? 'zh-HK' : 'en-US',
    );
  } catch {
    return iso;
  }
}

export function fmtBytes(n: number | null | undefined): string {
  if (n == null) return '—';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return tf('common.mb', { n: (n / 1024 / 1024).toFixed(1) });
}

export function fmtMs(ms: number | string | null | undefined): string {
  if (ms == null || ms === '') return '—';
  return tf('common.ms', { n: ms });
}

export function fmtPerMin(n: number | string | null | undefined): string {
  if (n == null || n === '') return '—';
  return tf('common.perMin', { n });
}
