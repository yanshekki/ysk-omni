import { appRoot, escapeHtml } from '../lib/dom';
import { t, tx } from '../i18n';
import { mediaService } from '../services/media.service';
import { bindShell, shell } from '../components/shell';
import { uiConfirm } from '../lib/confirm';
import { listRows, listTotal, type ListEnvelope } from '../lib/list';
import {
  isBrowserPreviewable,
  mediaPreviewKind,
  mediaPreviewStageHtml,
} from '../lib/media-preview';
import { getState, onErr, patchState } from '../state/store';
import type { MediaAssetRow, MediaJobRow } from '../types/api/media';
import type { RenderCtx } from '../router';

let previewObjectUrl: string | null = null;

function revokePreviewUrl(): void {
  if (previewObjectUrl) {
    try {
      URL.revokeObjectURL(previewObjectUrl);
    } catch {
      /* ignore */
    }
    previewObjectUrl = null;
  }
}

function closeMediaPreviewModal(): void {
  document
    .querySelectorAll('#media-preview-modal video, #media-preview-modal audio')
    .forEach((el) => {
      try {
        (el as HTMLMediaElement).pause();
      } catch {
        /* ignore */
      }
    });
  revokePreviewUrl();
  document.getElementById('media-preview-modal')?.remove();
}

function openMediaPreviewModal(meta: {
  id: string;
  mime?: string;
  filename?: string;
  prompt?: string;
  kind?: string;
  bytes?: number;
  blob: Blob;
}): void {
  closeMediaPreviewModal();
  const url = URL.createObjectURL(meta.blob);
  previewObjectUrl = url;
  const mime = meta.mime || meta.blob.type || '';
  const filename = meta.filename || meta.id;
  const pKind = mediaPreviewKind(mime, filename) || 'image';
  const stage = mediaPreviewStageHtml(
    pKind,
    url,
    filename,
    escapeHtml,
    t('common.loading') || '…',
  );
  const sub = [filename, mime, meta.kind].filter(Boolean).join(' · ');
  const promptHtml = meta.prompt
    ? `<div class="media-lb-prompt"><span class="muted">${escapeHtml(t('media.prompt'))}</span><p>${escapeHtml(meta.prompt)}</p></div>`
    : '';

  const html = `
    <div class="modal-back" id="media-preview-modal">
      <div class="modal modal--xl modal--media-preview" role="dialog" aria-modal="true">
        <div class="modal-h">
          <div class="modal-title-block">
            <strong>${escapeHtml(t('media.preview'))}</strong>
            <div class="muted">${escapeHtml(sub)}</div>
          </div>
          <button type="button" class="modal-x" id="media-preview-x" aria-label="close">×</button>
        </div>
        <div class="modal-b">
          <div class="media-lightbox">
            <div class="media-lb-stage">${stage}</div>
            ${promptHtml}
          </div>
        </div>
        <div class="modal-f">
          <button type="button" class="btn secondary sm" id="media-preview-dl">${escapeHtml(t('media.download'))}</button>
          <button type="button" class="btn sm" id="media-preview-close">${escapeHtml(t('common.cancel'))}</button>
        </div>
      </div>
    </div>`;
  document.getElementById('app')?.insertAdjacentHTML('beforeend', html);

  const close = () => closeMediaPreviewModal();
  document.getElementById('media-preview-x')?.addEventListener('click', close);
  document.getElementById('media-preview-close')?.addEventListener('click', close);
  document.getElementById('media-preview-modal')?.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).id === 'media-preview-modal') close();
  });
  document.getElementById('media-preview-dl')?.addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `media-${meta.id.slice(0, 8)}`;
    a.click();
  });

  if (pKind === 'text') {
    meta.blob
      .text()
      .then((text) => {
        const el = document.querySelector('#media-preview-modal .media-lb-stage');
        if (el) {
          el.innerHTML = `<pre class="media-lb-text">${escapeHtml(text.slice(0, 400_000))}</pre>`;
        }
      })
      .catch(() => undefined);
  }
}

export async function renderMediaPage(ctx: RenderCtx): Promise<void> {
  const kind = getState().mediaKind || '';
  const [assetsRes, jobsRes] = await Promise.all([
    mediaService.listAssets({ kind: kind || undefined, limit: 50 }),
    mediaService.listJobs({ limit: 30 }).catch(() => ({ data: [], total: 0 })),
  ]);
  const assets = listRows(assetsRes as ListEnvelope<MediaAssetRow>);
  const jobs = listRows(jobsRes as ListEnvelope<MediaJobRow>);
  const assetsTotal = listTotal(assetsRes as ListEnvelope<MediaAssetRow>, assets);

  const assetRows = assets.length
    ? assets
        .map((a) => {
          const mime = a.mime || '';
          const fname = a.filename || a.originalName || '';
          const canPreview = isBrowserPreviewable(mime, fname);
          const preview = canPreview
            ? `<button type="button" class="btn ghost sm" data-media-preview="${escapeHtml(a.id)}" data-media-mime="${escapeHtml(mime)}" data-media-name="${escapeHtml(fname)}" data-media-prompt="${escapeHtml(a.prompt || '')}" data-media-kind="${escapeHtml(a.kind || '')}">${escapeHtml(t('media.preview'))}</button>`
            : '';
          return `<tr>
            <td class="mono">${escapeHtml(String(a.id).slice(0, 8))}…</td>
            <td>${escapeHtml(a.kind || '')}</td>
            <td>${escapeHtml(mime || '')}</td>
            <td>${escapeHtml(String(a.bytes ?? ''))}</td>
            <td>${escapeHtml(a.provider || '')}</td>
            <td class="muted" title="${escapeHtml(a.prompt || '')}">${escapeHtml((a.prompt || '—').slice(0, 40))}</td>
            <td class="muted">${escapeHtml((a.created_at || '').slice(0, 19))}</td>
            <td class="row-actions">
              ${preview}
              <button type="button" class="btn ghost sm" data-media-dl="${escapeHtml(a.id)}">${escapeHtml(t('media.download'))}</button>
              <button type="button" class="btn danger sm" data-media-del="${escapeHtml(a.id)}">${escapeHtml(t('media.delete'))}</button>
            </td>
          </tr>`;
        })
        .join('')
    : `<tr><td colspan="8" class="muted">${escapeHtml(tx('media.empty', t('common.empty')))}</td></tr>`;

  const jobRows = jobs.length
    ? jobs
        .map(
          (j) => `<tr>
          <td class="mono">${escapeHtml(String(j.id).slice(0, 8))}…</td>
          <td>${escapeHtml(j.status || '')}</td>
          <td class="muted" title="${escapeHtml(j.prompt || '')}">${escapeHtml((j.prompt || '—').slice(0, 48))}</td>
          <td class="mono">${escapeHtml(j.result_asset_id ? String(j.result_asset_id).slice(0, 8) + '…' : '—')}</td>
          <td class="muted">${escapeHtml((j.created_at || '').slice(0, 19))}</td>
        </tr>`,
        )
        .join('')
    : `<tr><td colspan="5" class="muted">${escapeHtml(t('media.jobsEmpty'))}</td></tr>`;

  appRoot().innerHTML = shell(`
    <div class="topbar">
      <h2>${escapeHtml(t('media.title'))}</h2>
      <div class="toolbar">
        <select id="media-kind" class="input sm">
          <option value="">${escapeHtml(t('media.allKinds'))}</option>
          <option value="image" ${kind === 'image' ? 'selected' : ''}>image</option>
          <option value="video" ${kind === 'video' ? 'selected' : ''}>video</option>
          <option value="audio" ${kind === 'audio' ? 'selected' : ''}>audio</option>
        </select>
        <button type="button" class="btn secondary sm" id="media-refresh">${escapeHtml(t('dash.refresh'))}</button>
      </div>
    </div>
    <p class="page-hint">${escapeHtml(t('media.intro'))}</p>
    <div class="panel">
      <div class="panel-h"><strong>${escapeHtml(t('media.assets'))}</strong>
        <span class="muted">(${assetsTotal})</span>
      </div>
      <div class="table-wrap">
        <table class="data">
          <thead><tr>
            <th>ID</th><th>${escapeHtml(t('media.kind'))}</th><th>MIME</th>
            <th>${escapeHtml(t('media.bytes'))}</th><th>${escapeHtml(t('media.provider'))}</th>
            <th>${escapeHtml(t('media.prompt'))}</th><th>${escapeHtml(t('media.created'))}</th>
            <th></th>
          </tr></thead>
          <tbody>${assetRows}</tbody>
        </table>
      </div>
    </div>
    <div class="panel" style="margin-top:1rem">
      <div class="panel-h"><strong>${escapeHtml(t('media.jobs'))}</strong></div>
      <div class="table-wrap">
        <table class="data">
          <thead><tr>
            <th>ID</th><th>${escapeHtml(t('media.status'))}</th>
            <th>${escapeHtml(t('media.prompt'))}</th><th>Asset</th>
            <th>${escapeHtml(t('media.created'))}</th>
          </tr></thead>
          <tbody>${jobRows}</tbody>
        </table>
      </div>
    </div>
  `);

  bindShell(ctx.rerender);

  document.getElementById('media-refresh')?.addEventListener('click', () => {
    renderMediaPage(ctx).catch(onErr);
  });
  document.getElementById('media-kind')?.addEventListener('change', (e) => {
    patchState({
      mediaKind: (e.target as HTMLSelectElement).value || '',
    });
    renderMediaPage(ctx).catch(onErr);
  });

  document.querySelectorAll('[data-media-preview]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        const el = btn as HTMLElement;
        const id = el.getAttribute('data-media-preview')!;
        const blob = await mediaService.downloadBlob(id);
        openMediaPreviewModal({
          id,
          blob,
          mime: el.getAttribute('data-media-mime') || blob.type,
          filename: el.getAttribute('data-media-name') || '',
          prompt: el.getAttribute('data-media-prompt') || '',
          kind: el.getAttribute('data-media-kind') || '',
        });
      } catch (e) {
        onErr(e);
      }
    });
  });

  document.querySelectorAll('[data-media-dl]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        const id = (btn as HTMLElement).getAttribute('data-media-dl')!;
        const blob = await mediaService.downloadBlob(id);
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `media-${id.slice(0, 8)}`;
        a.click();
      } catch (e) {
        onErr(e);
      }
    });
  });

  document.querySelectorAll('[data-media-del]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = (btn as HTMLElement).getAttribute('data-media-del')!;
      if (
        !(await uiConfirm({
          message: t('media.deleteConfirm'),
          variant: 'danger',
          confirmText: t('media.delete'),
        }))
      )
        return;
      try {
        await mediaService.remove(id);
        await renderMediaPage(ctx);
      } catch (e) {
        onErr(e);
      }
    });
  });
}
