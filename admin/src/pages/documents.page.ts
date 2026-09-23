import { appRoot, escapeHtml, qs } from '../lib/dom';
import { fmtBytes, fmtTime } from '../lib/format';
import { t, tf, tx } from '../i18n';
import { documentsService } from '../services/documents.service';
import { keysService } from '../services/keys.service';
import { bindShell, shell } from '../components/shell';
import {
  bindPager,
  dataTablePanelHtml,
  filterPanelHtml,
  pagerHtml,
} from '../components/table';
import { listRows, listTotal, type ListEnvelope } from '../lib/list';
import { uiConfirm } from '../lib/confirm';
import { getState, onErr } from '../state/store';
import type { RenderCtx } from '../router';

type DocumentRow = {
  id: string;
  originalName?: string;
  mimeType?: string;
  sizeBytes?: number;
  storageType?: string;
  createdAt?: string;
  apiKey?: { name?: string; keyPrefix?: string };
};

function storageTypeLabel(type: string | undefined): string {
  if (type === 'filesystem') return t('docs.storageFs');
  return t('docs.storageDb');
}

export async function renderDocumentsPage(ctx: RenderCtx): Promise<void> {
  await keysService.loadAllIntoState();
  const f = getState().docFilter;
  const keys = getState().keys as Array<{ id: string; name: string }>;

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

  const res = (await documentsService.list(
    params,
  )) as ListEnvelope<DocumentRow>;
  const data = listRows(res);
  const total = listTotal(res, data);

  const bodyHtml = data
    .map(
      (d) => `
    <tr>
      <td><div class="cell-primary">${escapeHtml(d.originalName || d.id)}</div>
        <div class="cell-sub mono">${escapeHtml(String(d.id).slice(0, 8))}…</div></td>
      <td>${escapeHtml(d.mimeType || '—')}</td>
      <td>${fmtBytes(d.sizeBytes)}</td>
      <td>${escapeHtml(storageTypeLabel(d.storageType))}</td>
      <td>${escapeHtml(d.apiKey?.name || '—')}</td>
      <td>${fmtTime(d.createdAt)}</td>
      <td class="row-actions">
        <button type="button" class="btn ghost sm" data-doc-dl="${escapeHtml(d.id)}" data-name="${escapeHtml(d.originalName || 'download')}">${escapeHtml(t('docs.download'))}</button>
        <button type="button" class="btn danger sm" data-doc-del="${escapeHtml(d.id)}">${escapeHtml(tx('common.delete', 'Delete'))}</button>
      </td>
    </tr>`,
    )
    .join('');

  const keyOpts = keys
    .map(
      (k) =>
        `<option value="${escapeHtml(k.id)}" ${f.apiKeyId === k.id ? 'selected' : ''}>${escapeHtml(k.name)}</option>`,
    )
    .join('');

  const filter = filterPanelHtml({
    title: t('common.filterTitle'),
    hint: t('common.filterHint'),
    meta: tf('common.pagerTotal', { n: total }),
    searchHtml: `
      <div class="data-filter-search">
        <label for="df-q">${escapeHtml(t('common.search'))}</label>
        <input type="search" id="df-q" value="${escapeHtml(f.q)}" />
      </div>`,
    gridHtml: `
      <label>${escapeHtml(tx('docs.apiKey', 'API key'))}
        <select id="df-key">
          <option value="">${escapeHtml(t('common.all'))}</option>
          ${keyOpts}
        </select>
      </label>
      <label>${escapeHtml(t('docs.storage'))}
        <select id="df-storage">
          <option value="">${escapeHtml(t('common.all'))}</option>
          <option value="database" ${f.storageType === 'database' ? 'selected' : ''}>DB</option>
          <option value="filesystem" ${f.storageType === 'filesystem' ? 'selected' : ''}>FS</option>
        </select>
      </label>`,
  });

  const table = dataTablePanelHtml({
    headHtml: `
      <th>${escapeHtml(tx('docs.file', 'File'))}</th>
      <th>${escapeHtml(t('docs.mime'))}</th>
      <th>${escapeHtml(t('docs.size'))}</th>
      <th>${escapeHtml(t('docs.storage'))}</th>
      <th>${escapeHtml(tx('docs.apiKey', 'Key'))}</th>
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

  appRoot().innerHTML = shell(`
    <div class="topbar">
      <h2>${escapeHtml(t('docs.title'))}</h2>
      <div class="toolbar">
        <button type="button" class="btn secondary sm" id="docs-refresh">${escapeHtml(t('dash.refresh'))}</button>
      </div>
    </div>
    ${filter}
    ${table}
  `);

  bindShell(ctx.rerender);
  bindPager('docs', f, () => renderDocumentsPage(ctx).catch(onErr));

  document.getElementById('docs-refresh')?.addEventListener('click', () => {
    renderDocumentsPage(ctx).catch(onErr);
  });

  qs('[data-filter-apply]')!.onclick = () => {
    f.q = (qs<HTMLInputElement>('#df-q')?.value || '').trim();
    f.apiKeyId = qs<HTMLSelectElement>('#df-key')?.value || '';
    f.storageType = qs<HTMLSelectElement>('#df-storage')?.value || '';
    f.offset = 0;
    renderDocumentsPage(ctx).catch(onErr);
  };
  qs('[data-filter-reset]')!.onclick = () => {
    Object.assign(f, {
      q: '',
      apiKeyId: '',
      storageType: '',
      from: '',
      to: '',
      limit: 20,
      offset: 0,
    });
    renderDocumentsPage(ctx).catch(onErr);
  };

  document.querySelectorAll('[data-doc-dl]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        const id = (btn as HTMLElement).getAttribute('data-doc-dl')!;
        const name =
          (btn as HTMLElement).getAttribute('data-name') || 'download';
        const blob = await documentsService.downloadBlob(id);
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = name;
        a.click();
      } catch (e) {
        onErr(e);
      }
    });
  });

  document.querySelectorAll('[data-doc-del]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (
        !(await uiConfirm({
          message: tx('docs.confirmDelete', 'Delete this document?'),
          variant: 'danger',
        }))
      )
        return;
      try {
        await documentsService.remove(
          (btn as HTMLElement).getAttribute('data-doc-del')!,
        );
        await renderDocumentsPage(ctx);
      } catch (e) {
        onErr(e);
      }
    });
  });
}
