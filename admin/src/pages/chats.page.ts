import { appRoot, escapeHtml, qs } from '../lib/dom';
import { fmtTime } from '../lib/format';
import { badgeMode, badgeStatus } from '../lib/badges';
import { t, tf, tx } from '../i18n';
import { apiGet } from '../lib/http';
import { endpoints } from '../config/endpoints';
import { bindShell, shell } from '../components/shell';
import {
  bindPager,
  dataTablePanelHtml,
  filterPanelHtml,
  pagerHtml,
} from '../components/table';
import { keysService } from '../services/keys.service';
import {
  buildChatsListPath,
  parseChatsList,
  parseModelsList,
} from './page-api';
import { getState, onErr, patchState } from '../state/store';
import type { RenderCtx } from '../router';

type ChatRow = {
  id: string;
  requestId: string;
  model: string;
  status: string;
  policyMode?: string;
  durationMs?: number | null;
  createdAt: string;
  promptPreview?: string;
  contentPreview?: string;
  documentCount?: number;
  apiKey?: { name?: string; keyPrefix?: string };
};

export async function renderChatsPage(ctx: RenderCtx): Promise<void> {
  await Promise.all([
    keysService.loadAllIntoState().catch(() => []),
    loadModelsIntoState().catch(() => []),
  ]);

  const f = getState().chatFilter;
  const path = buildChatsListPath(f);
  // Backend: { object:'list', items, total, limit, offset } — NOT data[]
  const res = await apiGet<unknown>(path);
  const { rows: rawRows, total } = parseChatsList(res);
  const rows = rawRows as unknown as ChatRow[];

  const models = getState().models || [];
  const keys = (getState().keys || []) as Array<{
    id: string;
    name?: string;
    keyPrefix?: string;
  }>;

  const bodyHtml = rows
    .map(
      (c) => `
    <tr>
      <td>
        <div class="cell-primary mono">${escapeHtml(c.requestId)}</div>
        <div class="cell-sub">${escapeHtml(c.apiKey?.name || '')} ${c.apiKey?.keyPrefix ? `· ${escapeHtml(c.apiKey.keyPrefix)}…` : ''}</div>
      </td>
      <td>${escapeHtml(c.model)}</td>
      <td>${badgeStatus(c.status)} ${badgeMode(c.policyMode || '-')}</td>
      <td class="muted">${c.documentCount ? `×${c.documentCount}` : '—'}</td>
      <td class="chats-preview-cell"><div class="muted preview-text">${escapeHtml((c.promptPreview || '').slice(0, 120))}</div></td>
      <td class="chats-preview-cell"><div class="muted preview-text">${escapeHtml((c.contentPreview || '').slice(0, 120))}</div></td>
      <td>${fmtTime(c.createdAt)}</td>
    </tr>`,
    )
    .join('');

  const modelOpts = [
    `<option value="">${escapeHtml(tx('chats.allModels', t('common.all')))}</option>`,
    ...models.map(
      (m) =>
        `<option value="${escapeHtml(m)}" ${f.model === m ? 'selected' : ''}>${escapeHtml(m)}</option>`,
    ),
  ].join('');

  const keyOpts = [
    `<option value="">${escapeHtml(tx('chats.allKeys', t('common.all')))}</option>`,
    ...keys.map(
      (k) =>
        `<option value="${escapeHtml(k.id)}" ${f.apiKeyId === k.id ? 'selected' : ''}>${escapeHtml(k.name || k.id)} (${escapeHtml(k.keyPrefix || '')})</option>`,
    ),
  ].join('');

  const filter = filterPanelHtml({
    title: tx('chats.filterTitle', t('common.filterTitle')),
    hint: tx('chats.filterHint', t('common.filterHint')),
    meta: tf('common.pagerTotal', { n: total }),
    searchHtml: `
      <div class="data-filter-search">
        <label for="cf-q">${escapeHtml(tx('chats.search', t('common.search')))}</label>
        <input type="search" id="cf-q" value="${escapeHtml(f.q)}" placeholder="${escapeHtml(tx('chats.searchPh', ''))}" />
      </div>`,
    gridHtml: `
      <label>${escapeHtml(t('chats.status'))}
        <select id="cf-status">
          <option value="">${escapeHtml(tx('chats.allStatus', t('common.all')))}</option>
          ${['success', 'error', 'timeout', 'pending']
            .map(
              (s) =>
                `<option value="${s}" ${f.status === s ? 'selected' : ''}>${escapeHtml(tx(`status.${s}`, s))}</option>`,
            )
            .join('')}
        </select>
      </label>
      <label>${escapeHtml(t('chats.model'))}
        <select id="cf-model">${modelOpts}</select>
      </label>
      <label>${escapeHtml(tx('chats.apiKey', 'API key'))}
        <select id="cf-key">${keyOpts}</select>
      </label>
      <label>${escapeHtml(t('chats.mode'))}
        <select id="cf-mode">
          <option value="">${escapeHtml(tx('chats.allModes', t('common.all')))}</option>
          <option value="safe" ${f.policyMode === 'safe' ? 'selected' : ''}>${escapeHtml(t('keys.modeSafeBadge'))}</option>
          <option value="agent" ${f.policyMode === 'agent' ? 'selected' : ''}>${escapeHtml(t('keys.modeAgentBadge'))}</option>
        </select>
      </label>
      <label>${escapeHtml(tx('chats.from', 'From'))}
        <input type="date" id="cf-from" value="${escapeHtml(f.from)}" />
      </label>
      <label>${escapeHtml(tx('chats.to', 'To'))}
        <input type="date" id="cf-to" value="${escapeHtml(f.to)}" />
      </label>`,
  });

  const table = dataTablePanelHtml({
    headHtml: `
      <th>${escapeHtml(t('chats.request'))}</th>
      <th>${escapeHtml(t('chats.model'))}</th>
      <th>${escapeHtml(t('chats.status'))} / ${escapeHtml(t('chats.mode'))}</th>
      <th>${escapeHtml(tx('chats.attachments', 'Files'))}</th>
      <th>${escapeHtml(tx('chats.prompt', 'Prompt'))}</th>
      <th>${escapeHtml(tx('chats.response', 'Response'))}</th>
      <th>${escapeHtml(t('chats.time'))}</th>`,
    bodyHtml,
    colSpan: 7,
    emptyText: tx('chats.empty', t('common.empty')),
    pagerHtml: pagerHtml({
      total,
      limit: f.limit,
      offset: f.offset,
      idPrefix: 'chats',
    }),
  });

  appRoot().innerHTML = shell(`
    <div class="topbar">
      <h2>${escapeHtml(t('nav.chats'))}</h2>
      <div class="toolbar">
        <button type="button" class="btn secondary sm" id="chats-refresh">${escapeHtml(t('dash.refresh'))}</button>
      </div>
    </div>
    ${filter}
    ${table}
  `);

  bindShell(ctx.rerender);
  bindPager('chats', f, () => renderChatsPage(ctx).catch(onErr));
  document.getElementById('chats-refresh')?.addEventListener('click', () => {
    renderChatsPage(ctx).catch(onErr);
  });
  qs('[data-filter-apply]')!.onclick = () => {
    f.q = (qs<HTMLInputElement>('#cf-q')?.value || '').trim();
    f.status = qs<HTMLSelectElement>('#cf-status')?.value || '';
    f.model = qs<HTMLSelectElement>('#cf-model')?.value || '';
    f.apiKeyId = qs<HTMLSelectElement>('#cf-key')?.value || '';
    f.policyMode = qs<HTMLSelectElement>('#cf-mode')?.value || '';
    f.from = qs<HTMLInputElement>('#cf-from')?.value || '';
    f.to = qs<HTMLInputElement>('#cf-to')?.value || '';
    f.offset = 0;
    renderChatsPage(ctx).catch(onErr);
  };
  qs('[data-filter-reset]')!.onclick = () => {
    Object.assign(f, {
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
    });
    renderChatsPage(ctx).catch(onErr);
  };
}

async function loadModelsIntoState(): Promise<void> {
  try {
    const res = await apiGet(endpoints.models);
    patchState({ models: parseModelsList(res) });
  } catch {
    patchState({ models: [] });
  }
}
