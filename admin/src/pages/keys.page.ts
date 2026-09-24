import { appRoot, escapeHtml, qs } from '../lib/dom';
import { fmtPerMin, fmtTime } from '../lib/format';
import { badgeMode, badgeRole } from '../lib/badges';
import { t, tf, tx } from '../i18n';
import { keysService } from '../services/keys.service';
import { apiGet } from '../lib/http';
import { endpoints } from '../config/endpoints';
import { bindShell, shell } from '../components/shell';
import {
  bindPager,
  dataTablePanelHtml,
  filterPanelHtml,
  pagerHtml,
} from '../components/table';
import { closeAppModal, openAppModal } from '../components/modal';
import { uiConfirm } from '../lib/confirm';
import { listRows, listTotal, type ListEnvelope } from '../lib/list';
import { getState, onErr } from '../state/store';
import type { ApiKeyRow } from '../types/api/keys';
import type { RenderCtx } from '../router';

export async function renderKeysPage(ctx: RenderCtx): Promise<void> {
  const f = getState().keyFilter;
  let usageMap: Record<string, { requests?: number; utilization?: number }> =
    {};
  try {
    const u = await apiGet<{
      data?: {
        perKey?: Array<{
          apiKeyId: string;
          requests?: number;
          utilization?: number;
        }>;
      };
    }>(endpoints.usage);
    for (const row of u.data?.perKey || []) {
      usageMap[row.apiKeyId] = row;
    }
  } catch {
    /* ignore */
  }

  const res = (await keysService.list({
    limit: f.limit,
    offset: f.offset,
    q: f.q || undefined,
    role: f.role || undefined,
    mode: f.mode || undefined,
    isActive: f.isActive || undefined,
  })) as ListEnvelope<ApiKeyRow>;
  const data = listRows(res);
  const total = listTotal(res, data);

  const bodyHtml = data
    .map((k) => {
      const u = usageMap[k.id];
      const reqs = u?.requests ?? '—';
      const util = u ? Math.round((u.utilization || 0) * 100) : 0;
      const wl = k.ipWhitelist || [];
      const wlLabel = wl.length
        ? tf('keys.ipCount', { n: wl.length })
        : t('keys.ipAll');
      const models = k.allowedModels || [];
      const modelsLabel = !models.length
        ? t('keys.modelsAll')
        : models.length <= 2
          ? models.join(', ')
          : tf('keys.modelsCount', { n: models.length });
      return `
    <tr>
      <td><div class="cell-primary">${escapeHtml(k.name)}</div><div class="cell-sub">${escapeHtml(k.keyPrefix)}…</div></td>
      <td>${badgeRole(k.role)}</td>
      <td>${badgeMode(k.mode)}</td>
      <td>${fmtPerMin(k.rateLimit)}</td>
      <td title="${escapeHtml(wl.join(', '))}">${escapeHtml(wlLabel)}</td>
      <td title="${escapeHtml(models.join(', '))}">${escapeHtml(modelsLabel)}</td>
      <td>
        <div>${reqs} <span class="muted">(${escapeHtml(t('keys.usage24'))})</span></div>
        <div class="usage-bar ${util > 80 ? 'warn' : ''}"><span style="width:${util}%"></span></div>
      </td>
      <td>${k.isActive ? `<span class="badge success">${escapeHtml(t('common.active'))}</span>` : `<span class="badge error">${escapeHtml(t('common.revoked'))}</span>`}</td>
      <td>${fmtTime(k.createdAt)}</td>
      <td><div class="row-actions">
        <button class="btn secondary sm" data-edit="${k.id}">${escapeHtml(t('keys.edit'))}</button>
        ${k.isActive ? `<button class="btn danger sm" data-revoke="${k.id}">${escapeHtml(t('keys.revoke'))}</button>` : ''}
      </div></td>
    </tr>`;
    })
    .join('');

  const filter = filterPanelHtml({
    title: t('common.filterTitle'),
    hint: t('common.filterHint'),
    meta: tf('common.pagerTotal', { n: total }),
    searchHtml: `
      <div class="data-filter-search">
        <label for="kf-q">${escapeHtml(t('common.search'))}</label>
        <input type="search" id="kf-q" value="${escapeHtml(f.q)}" placeholder="${escapeHtml(t('keys.searchPh'))}" />
      </div>`,
    gridHtml: `
      <label>${escapeHtml(t('keys.role'))}
        <select id="kf-role">
          <option value="">${escapeHtml(t('common.all'))}</option>
          <option value="client" ${f.role === 'client' ? 'selected' : ''}>${escapeHtml(t('keys.roleClient'))}</option>
          <option value="admin" ${f.role === 'admin' ? 'selected' : ''}>${escapeHtml(t('keys.roleAdmin'))}</option>
        </select>
      </label>
      <label>${escapeHtml(t('keys.mode'))}
        <select id="kf-mode">
          <option value="">${escapeHtml(t('common.all'))}</option>
          <option value="safe" ${f.mode === 'safe' ? 'selected' : ''}>${escapeHtml(t('keys.modeSafeBadge'))}</option>
          <option value="agent" ${f.mode === 'agent' ? 'selected' : ''}>${escapeHtml(t('keys.modeAgentBadge'))}</option>
        </select>
      </label>
      <label>${escapeHtml(t('keys.status'))}
        <select id="kf-active">
          <option value="">${escapeHtml(t('common.all'))}</option>
          <option value="true" ${f.isActive === 'true' ? 'selected' : ''}>${escapeHtml(t('common.active'))}</option>
          <option value="false" ${f.isActive === 'false' ? 'selected' : ''}>${escapeHtml(t('common.revoked'))}</option>
        </select>
      </label>`,
  });

  const table = dataTablePanelHtml({
    headHtml: `
      <th>${escapeHtml(t('keys.name'))}</th><th>${escapeHtml(t('keys.role'))}</th>
      <th>${escapeHtml(t('keys.mode'))}</th><th>${escapeHtml(t('keys.rate'))}</th>
      <th>${escapeHtml(t('keys.ipWhitelistCol'))}</th>
      <th>${escapeHtml(t('keys.allowedModelsCol'))}</th>
      <th>${escapeHtml(t('keys.usage24'))}</th><th>${escapeHtml(t('keys.status'))}</th>
      <th>${escapeHtml(t('keys.created'))}</th><th>${escapeHtml(t('common.actions'))}</th>`,
    bodyHtml,
    colSpan: 10,
    emptyText: tx('keys.empty', t('common.empty')),
    pagerHtml: pagerHtml({
      total,
      limit: f.limit,
      offset: f.offset,
      idPrefix: 'keys',
    }),
  });

  appRoot().innerHTML = shell(`
    <div class="topbar">
      <h2>${escapeHtml(t('keys.title'))}</h2>
      <div class="toolbar">
        <button class="btn" id="btn-new-key">${escapeHtml(t('keys.new'))}</button>
      </div>
    </div>
    ${filter}
    ${table}
  `);

  bindShell(ctx.rerender);
  bindPager('keys', f, () => renderKeysPage(ctx).catch(onErr));

  qs('[data-filter-apply]')!.onclick = () => {
    f.q = (qs<HTMLInputElement>('#kf-q')?.value || '').trim();
    f.role = qs<HTMLSelectElement>('#kf-role')?.value || '';
    f.mode = qs<HTMLSelectElement>('#kf-mode')?.value || '';
    f.isActive = qs<HTMLSelectElement>('#kf-active')?.value || '';
    f.offset = 0;
    renderKeysPage(ctx).catch(onErr);
  };
  qs('[data-filter-reset]')!.onclick = () => {
    Object.assign(f, {
      q: '',
      role: '',
      mode: '',
      isActive: '',
      limit: 20,
      offset: 0,
    });
    renderKeysPage(ctx).catch(onErr);
  };

  document.getElementById('btn-new-key')!.onclick = () =>
    showKeyForm(ctx, null).catch(onErr);

  document.querySelectorAll('[data-edit]').forEach((b) => {
    const key = data.find((x) => x.id === (b as HTMLElement).dataset.edit);
    (b as HTMLElement).onclick = () =>
      showKeyForm(ctx, key || null).catch(onErr);
  });

  document.querySelectorAll('[data-revoke]').forEach((b) => {
    (b as HTMLElement).onclick = async () => {
      if (
        !(await uiConfirm({
          message: t('keys.confirmRevoke'),
          variant: 'danger',
          confirmText: t('keys.revoke'),
        }))
      )
        return;
      await keysService.revoke((b as HTMLElement).dataset.revoke!);
      renderKeysPage(ctx).catch(onErr);
    };
  });
}

async function showKeyForm(
  ctx: RenderCtx,
  existing: ApiKeyRow | null,
): Promise<void> {
  const isEdit = Boolean(existing);
  const wlText = (existing?.ipWhitelist || []).join('\n');
  const selectedModels = new Set(existing?.allowedModels || []);
  let preset = ['piper/lessac-high', 'echo'];
  try {
    const cat = await apiGet<{
      local?: Array<{ id?: string }>;
      loaded?: Array<{ id?: string } | string>;
    }>(endpoints.catalog);
    const local = (cat.local || []).map((m) => m.id).filter(Boolean) as string[];
    const loaded = (cat.loaded || [])
      .map((e) => (typeof e === 'string' ? e : e.id))
      .filter(Boolean) as string[];
    preset = [...new Set([...loaded, ...local, ...preset])];
  } catch {
    /* keep builtin ids */
  }
  const extraIds = [...selectedModels].filter((id) => !preset.includes(id));
  const modelBoxes = preset
    .map(
      (id) => `
        <label class="key-model-item">
          <input type="checkbox" data-k-model value="${escapeHtml(id)}" ${selectedModels.has(id) ? 'checked' : ''} />
          <span>${escapeHtml(id)}</span>
        </label>`,
    )
    .join('');
  openAppModal({
    title: isEdit ? t('keys.edit') : t('keys.new'),
    subtitle: isEdit
      ? `${escapeHtml(existing?.name || '')} · ${escapeHtml(existing?.keyPrefix || '')}…`
      : '',
    size: 'lg',
    bodyHtml: `
      <div class="form-grid">
        <label class="full">${escapeHtml(t('keys.name'))}<input id="k-name" value="${escapeHtml(existing?.name || '')}" /></label>
        <label>${escapeHtml(t('keys.role'))}
          <select id="k-role">
            <option value="client">${escapeHtml(t('keys.roleClient'))}</option>
            <option value="admin">${escapeHtml(t('keys.roleAdmin'))}</option>
          </select>
        </label>
        <label>${escapeHtml(t('keys.mode'))}
          <select id="k-mode">
            <option value="safe">${escapeHtml(t('keys.modeSafe'))}</option>
            <option value="agent">${escapeHtml(t('keys.modeAgent'))}</option>
          </select>
        </label>
        <label>${escapeHtml(t('keys.rate'))}<input id="k-rate" type="number" value="${existing?.rateLimit ?? 60}" /></label>
        <label>${escapeHtml(t('keys.maxTurns'))}<input id="k-turns" type="number" value="${existing?.maxTurns ?? ''}" /></label>
        <label>${escapeHtml(t('keys.timeoutMs'))}<input id="k-timeout" type="number" value="${existing?.timeoutMs ?? ''}" /></label>
        <label class="full">${escapeHtml(t('keys.ipWhitelist'))}
          <textarea id="k-ip" rows="4" placeholder="${escapeHtml(t('keys.ipPlaceholder'))}">${escapeHtml(wlText)}</textarea>
          <span class="field-hint">${escapeHtml(t('keys.ipWhitelistHint'))}</span>
        </label>
        <div class="full key-models-field">
          <span>${escapeHtml(t('keys.allowedModels'))}</span>
          <div class="key-model-list" id="k-models">${modelBoxes}</div>
          <span class="field-hint">${escapeHtml(t('keys.allowedModelsHint'))}</span>
        </div>
        <label class="full">${escapeHtml(t('keys.modelsExtra'))}
          <textarea id="k-models-extra" rows="3" placeholder="${escapeHtml(t('keys.modelsPlaceholder'))}">${escapeHtml(extraIds.join('\n'))}</textarea>
          <span class="field-hint">${escapeHtml(t('keys.modelsExtraHint'))}</span>
        </label>
        ${
          isEdit
            ? `<label class="full">${escapeHtml(t('keys.status'))}
          <select id="k-active"><option value="true">${escapeHtml(t('common.active'))}</option><option value="false">${escapeHtml(t('common.revoked'))}</option></select>
        </label>`
            : ''
        }
      </div>
      <pre id="k-created" class="pre key-once-box" hidden></pre>`,
    footerHtml: `
      <button type="button" class="btn secondary sm" id="k-cancel">${escapeHtml(t('common.cancel'))}</button>
      <button type="button" class="btn sm" id="k-save">${escapeHtml(t('common.save'))}</button>`,
  });

  (document.getElementById('k-role') as HTMLSelectElement).value =
    existing?.role || 'client';
  (document.getElementById('k-mode') as HTMLSelectElement).value =
    existing?.mode || 'safe';
  if (isEdit) {
    (document.getElementById('k-active') as HTMLSelectElement).value = String(
      existing!.isActive,
    );
  }
  document.getElementById('k-cancel')!.onclick = () => closeAppModal();
  document.getElementById('k-save')!.onclick = async () => {
    const ipWhitelist = (
      document.getElementById('k-ip') as HTMLTextAreaElement
    ).value
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const body = {
      name: (document.getElementById('k-name') as HTMLInputElement).value.trim(),
      role: (document.getElementById('k-role') as HTMLSelectElement).value,
      mode: (document.getElementById('k-mode') as HTMLSelectElement).value,
      rateLimit: Number(
        (document.getElementById('k-rate') as HTMLInputElement).value || 60,
      ),
      maxTurns: (document.getElementById('k-turns') as HTMLInputElement).value
        ? Number((document.getElementById('k-turns') as HTMLInputElement).value)
        : null,
      timeoutMs: (document.getElementById('k-timeout') as HTMLInputElement)
        .value
        ? Number(
            (document.getElementById('k-timeout') as HTMLInputElement).value,
          )
        : null,
      ipWhitelist,
      allowedModels: [
        ...new Set([
          ...[...document.querySelectorAll('[data-k-model]:checked')].map(
            (el) => (el as HTMLInputElement).value,
          ),
          ...(document.getElementById('k-models-extra') as HTMLTextAreaElement)
            .value.split(/[\n,]+/)
            .map((s) => s.trim())
            .filter(Boolean),
        ]),
      ],
    };
    try {
      if (isEdit && existing) {
        await keysService.update(existing.id, {
          ...body,
          isActive:
            (document.getElementById('k-active') as HTMLSelectElement)
              .value === 'true',
        });
        closeAppModal();
        renderKeysPage(ctx).catch(onErr);
      } else {
        const res = await keysService.create(body);
        const box = document.getElementById('k-created');
        if (box) {
          box.hidden = false;
          box.textContent = `${t('keys.keyOnce')}\n${res.data?.key || JSON.stringify(res.data)}`;
        }
        const saveBtn = document.getElementById('k-save');
        if (saveBtn) {
          saveBtn.textContent = t('chats.close');
          saveBtn.onclick = () => {
            closeAppModal();
            renderKeysPage(ctx).catch(onErr);
          };
        }
      }
    } catch (e) {
      onErr(e);
    }
  };
}
