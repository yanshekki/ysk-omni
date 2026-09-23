/**
 * Lightweight pages for domains not yet fully migrated from app.js.
 */
import { appRoot, escapeHtml } from '../lib/dom';
import { apiGet } from '../lib/http';
import { bindShell, shell } from '../components/shell';
import { t } from '../i18n';
import { listRows, listTotal, type ListEnvelope } from '../lib/list';
import { onErr } from '../state/store';
import type { RenderCtx } from '../router';

function summarizePayload(data: unknown): string {
  if (data == null) return 'null';
  if (Array.isArray(data)) return `array[${data.length}]`;
  if (typeof data === 'object') {
    const o = data as ListEnvelope<unknown> & Record<string, unknown>;
    const rows = listRows(o);
    const total = listTotal(o, rows);
    const keys = Object.keys(o).slice(0, 14).join(', ');
    if (rows.length || typeof o.total === 'number') {
      return `list: ${rows.length} rows (total=${total}) · ${keys}`;
    }
    return `object · ${keys}`;
  }
  return typeof data;
}

export function makeApiExplorerPage(opts: {
  titleKey: string;
  path: string;
  hint?: string;
}) {
  return async function render(ctx: RenderCtx): Promise<void> {
    let body = '';
    let summary = '';
    try {
      const data = await apiGet<unknown>(opts.path);
      summary = summarizePayload(data);
      body = `<pre class="pre" style="max-height:70vh;overflow:auto;font-size:0.8rem">${escapeHtml(JSON.stringify(data, null, 2))}</pre>`;
    } catch (e) {
      const err = e instanceof Error ? e.message : String(e);
      summary = 'error';
      body = `<div class="error-box">${escapeHtml(err)}</div>`;
    }

    appRoot().innerHTML = shell(`
      <div class="topbar">
        <h2>${escapeHtml(t(opts.titleKey))}</h2>
        <div class="toolbar">
          <button type="button" class="btn secondary sm" id="gen-refresh">${escapeHtml(t('dash.refresh'))}</button>
        </div>
      </div>
      ${opts.hint ? `<p class="page-hint">${escapeHtml(opts.hint)}</p>` : ''}
      <div class="panel">
        <div class="panel-h">
          <strong>GET ${escapeHtml(opts.path)}</strong>
          <span class="muted" style="font-size:0.75rem"> · ${escapeHtml(summary)}</span>
        </div>
        <div class="panel-pad">${body}</div>
      </div>
    `);
    bindShell(ctx.rerender);
    document.getElementById('gen-refresh')?.addEventListener('click', () => {
      render(ctx).catch(onErr);
    });
  };
}
