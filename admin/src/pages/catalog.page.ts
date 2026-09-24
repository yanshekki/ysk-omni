import { appRoot, escapeHtml } from '../lib/dom';
import { apiGet, apiSend } from '../lib/http';
import { endpoints } from '../config/endpoints';
import { bindShell, shell } from '../components/shell';
import { onErr } from '../state/store';
import type { RenderCtx } from '../router';

type Pack = {
  id: string;
  repoId: string;
  modality: string;
  runtime: string;
  quants: string[];
  vramMb: number;
};

type CatalogPayload = {
  packs?: Pack[];
  local?: Array<{ id: string; path?: string; vramMb?: number }>;
  loaded?: Array<{ id: string; vramMb: number }>;
  usedMb?: number;
  budgetMb?: number;
};

export async function renderCatalogPage(ctx: RenderCtx): Promise<void> {
  let data: CatalogPayload = {};
  try {
    data = (await apiGet<CatalogPayload>(endpoints.catalog)) as CatalogPayload;
  } catch (e) {
    onErr(e instanceof Error ? e.message : String(e));
  }
  const packs = data.packs || [];
  const local = data.local || [];
  const loaded = data.loaded || [];
  const rows = packs
    .map(
      (p) => `
      <tr>
        <td><code>${escapeHtml(p.id)}</code></td>
        <td>${escapeHtml(p.modality)}</td>
        <td>${escapeHtml(p.runtime)}</td>
        <td>${escapeHtml((p.quants || []).join(', ') || '—')}</td>
        <td>${p.vramMb}</td>
        <td><button type="button" class="btn sm" data-pull="${escapeHtml(p.id)}">Pull</button></td>
      </tr>`,
    )
    .join('');
  const localRows = local
    .map(
      (m) => `
      <tr>
        <td><code>${escapeHtml(m.id)}</code></td>
        <td>${escapeHtml(m.path || '—')}</td>
        <td>${m.vramMb ?? 0}</td>
        <td>
          <button type="button" class="btn sm" data-load="${escapeHtml(m.id)}" data-vram="${m.vramMb ?? 0}">Load</button>
          <button type="button" class="btn secondary sm" data-unload="${escapeHtml(m.id)}">Unload</button>
        </td>
      </tr>`,
    )
    .join('');

  appRoot().innerHTML = shell(`
    <div class="topbar"><h1>Catalog</h1></div>
    <p class="muted">VRAM ${data.usedMb ?? 0} / ${data.budgetMb ?? 0} MB · loaded: ${
      loaded.map((m) => m.id).join(', ') || 'none'
    }</p>
    <div class="panel">
      <h2>Curated packs</h2>
      <table class="data"><thead><tr><th>Id</th><th>Modality</th><th>Runtime</th><th>Quants</th><th>VRAM</th><th></th></tr></thead>
      <tbody>${rows || '<tr><td colspan="6">No packs</td></tr>'}</tbody></table>
    </div>
    <div class="panel">
      <h2>Local models</h2>
      <table class="data"><thead><tr><th>Id</th><th>Path</th><th>VRAM</th><th></th></tr></thead>
      <tbody>${localRows || '<tr><td colspan="4">Empty registry</td></tr>'}</tbody></table>
    </div>
  `);
  bindShell(ctx.rerender);
  for (const btn of appRoot().querySelectorAll<HTMLButtonElement>('[data-pull]')) {
    btn.onclick = async () => {
      const spec = btn.getAttribute('data-pull') || '';
      try {
        const res = await fetch('/admin/api/catalog/pull', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: spec }),
        });
        await res.text();
        await ctx.rerender();
      } catch (e) {
        onErr(e instanceof Error ? e.message : String(e));
      }
    };
  }
  for (const btn of appRoot().querySelectorAll<HTMLButtonElement>('[data-load]')) {
    btn.onclick = async () => {
      try {
        await apiSend(endpoints.modelsLoad, {
          method: 'POST',
          body: {
            id: btn.getAttribute('data-load'),
            vramMb: Number(btn.getAttribute('data-vram') || 0),
          },
        });
        await ctx.rerender();
      } catch (e) {
        onErr(e instanceof Error ? e.message : String(e));
      }
    };
  }
  for (const btn of appRoot().querySelectorAll<HTMLButtonElement>('[data-unload]')) {
    btn.onclick = async () => {
      try {
        await apiSend(endpoints.modelsUnload, {
          method: 'POST',
          body: { id: btn.getAttribute('data-unload') },
        });
        await ctx.rerender();
      } catch (e) {
        onErr(e instanceof Error ? e.message : String(e));
      }
    };
  }
}
