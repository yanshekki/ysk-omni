import { escapeHtml } from '../lib/dom';
import { t, tf } from '../i18n';

export function dataTablePanelHtml(opts: {
  headHtml: string;
  bodyHtml: string;
  colSpan: number;
  emptyText: string;
  pagerHtml?: string;
}): string {
  const hasRows = Boolean(opts.bodyHtml && opts.bodyHtml.trim());
  const body = hasRows
    ? opts.bodyHtml
    : `<tr><td colspan="${opts.colSpan}" class="muted data-empty-cell">${escapeHtml(opts.emptyText)}</td></tr>`;
  return `
  <div class="panel data-table-panel">
    <div class="table-wrap">
      <table class="data">
        <thead><tr>${opts.headHtml}</tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div>
    ${opts.pagerHtml || ''}
  </div>`;
}

export function pagerHtml(opts: {
  total: number;
  limit: number;
  offset: number;
  idPrefix: string;
}): string {
  const pages = Math.max(1, Math.ceil((opts.total || 0) / opts.limit) || 1);
  const page = Math.floor(opts.offset / opts.limit) + 1;
  return `
  <div class="pager" data-pager="${escapeHtml(opts.idPrefix)}">
    <span class="muted">${escapeHtml(tf('common.pagerTotal', { n: opts.total }))}
      · ${escapeHtml(tf('common.pagerPage', { n: page, total: pages }))}</span>
    <div class="pager-actions">
      <button type="button" class="btn secondary sm" data-pager-prev ${page <= 1 ? 'disabled' : ''}>${escapeHtml(t('common.prev'))}</button>
      <button type="button" class="btn secondary sm" data-pager-next ${page >= pages ? 'disabled' : ''}>${escapeHtml(t('common.next'))}</button>
    </div>
  </div>`;
}

export function bindPager(
  idPrefix: string,
  filter: { limit: number; offset: number },
  reload: () => void,
): void {
  const root = document.querySelector(`[data-pager="${idPrefix}"]`);
  if (!root) return;
  root.querySelector('[data-pager-prev]')?.addEventListener('click', () => {
    filter.offset = Math.max(0, filter.offset - filter.limit);
    reload();
  });
  root.querySelector('[data-pager-next]')?.addEventListener('click', () => {
    filter.offset = filter.offset + filter.limit;
    reload();
  });
}

export function filterPanelHtml(opts: {
  title: string;
  hint: string;
  meta?: string;
  searchHtml?: string;
  gridHtml?: string;
}): string {
  return `
  <div class="panel data-filter-panel">
    <div class="panel-h">
      <strong>${escapeHtml(opts.title)}</strong>
      ${opts.meta ? `<span class="muted">${escapeHtml(opts.meta)}</span>` : ''}
    </div>
    <div class="panel-pad">
      <p class="muted page-hint" style="margin-top:0">${escapeHtml(opts.hint)}</p>
      ${opts.searchHtml || ''}
      <div class="data-filter-grid">${opts.gridHtml || ''}</div>
      <div class="data-filter-actions">
        <button type="button" class="btn sm" data-filter-apply>${escapeHtml(t('common.apply'))}</button>
        <button type="button" class="btn secondary sm" data-filter-reset>${escapeHtml(t('common.reset'))}</button>
      </div>
    </div>
  </div>`;
}
