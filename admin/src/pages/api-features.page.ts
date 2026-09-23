import { appRoot, escapeHtml } from '../lib/dom';
import { t, tf } from '../i18n';
import { featuresService } from '../services/features.service';
import { bindShell, shell } from '../components/shell';
import { uiConfirm } from '../lib/confirm';
import { onErr } from '../state/store';
import type { ApiFeatureKey, FeaturePresetName } from '../types/api/features';
import type { RenderCtx } from '../router';

const GROUPS: { titleKey: string; keys: ApiFeatureKey[] }[] = [
  {
    titleKey: 'apiFeatures.groupProtocols',
    keys: ['openaiChat', 'openaiResponses', 'anthropicMessages'],
  },
  {
    titleKey: 'apiFeatures.groupMedia',
    keys: ['imagesApi', 'filesOpenAiAlias', 'videoApi', 'audioApi'],
  },
  {
    titleKey: 'apiFeatures.groupCaps',
    keys: [
      'tools',
      'structuredOutput',
      'vision',
      'reasoningEffort',
      'webSearch',
      'subagents',
      'planMode',
      'memory',
      'sessionResume',
      'bestOfN',
      'checkLoop',
      'systemOverride',
      'rules',
      'permissionMode',
      'sandbox',
    ],
  },
  {
    titleKey: 'apiFeatures.groupEmu',
    keys: [
      'usageEstimate',
      'assistantsEmulation',
      'strictSampling',
      'forceDisableToolsInSafe',
    ],
  },
];

export async function renderApiFeaturesPage(ctx: RenderCtx): Promise<void> {
  const res = await featuresService.get();
  const data = res.data || ({} as Record<string, boolean>);

  const flagLabel = (k: string) => t(`apiFeatures.flag.${k}`) || k;
  const flagHint = (k: string) => t(`apiFeatures.hint.${k}`) || '';

  const sections = GROUPS.map((g) => {
    const rows = g.keys
      .map((k) => {
        const on = Boolean((data as Record<string, boolean>)[k]);
        return `
          <div class="dash-prot-row api-feat-row" data-feat="${escapeHtml(k)}">
            <div>
              <strong>${escapeHtml(flagLabel(k))}</strong>
              <div class="muted" style="font-size:0.78rem;font-weight:500">${escapeHtml(flagHint(k))}</div>
            </div>
            <button type="button" class="master-toggle ${on ? 'is-on' : 'is-off'}" data-feat-toggle="${escapeHtml(k)}" aria-pressed="${on ? 'true' : 'false'}">
              <span class="master-toggle-track" aria-hidden="true"><span class="master-toggle-knob"></span></span>
              <span class="master-toggle-label">${escapeHtml(on ? t('dash.on') : t('dash.off'))}</span>
            </button>
          </div>`;
      })
      .join('');
    return `
        <div class="panel dash-panel">
          <div class="panel-h"><strong>${escapeHtml(t(g.titleKey))}</strong></div>
          <div class="panel-pad">${rows}</div>
        </div>`;
  }).join('');

  appRoot().innerHTML = shell(`
    <div class="topbar">
      <h2>${escapeHtml(t('apiFeatures.title'))}</h2>
      <div class="toolbar">
        <button type="button" class="btn secondary sm" data-feat-preset="open">${escapeHtml(t('apiFeatures.presetOpen'))}</button>
        <button type="button" class="btn secondary sm" data-feat-preset="locked">${escapeHtml(t('apiFeatures.presetLocked'))}</button>
        <button type="button" class="btn secondary sm" data-feat-preset="dev">${escapeHtml(t('apiFeatures.presetDev'))}</button>
        <button type="button" class="btn secondary sm" id="feat-refresh">${escapeHtml(t('dash.refresh'))}</button>
      </div>
    </div>
    <p class="page-hint">${escapeHtml(t('apiFeatures.intro'))}</p>
    <div class="dash-layout" style="grid-template-columns:1fr">
      <div class="dash-main">${sections}</div>
    </div>
  `);

  bindShell(ctx.rerender);

  document.getElementById('feat-refresh')?.addEventListener('click', () => {
    renderApiFeaturesPage(ctx).catch(onErr);
  });

  document.querySelectorAll('[data-feat-toggle]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const key = (btn as HTMLElement).getAttribute(
        'data-feat-toggle',
      ) as ApiFeatureKey | null;
      if (!key) return;
      const next = !(btn as HTMLElement).classList.contains('is-on');
      try {
        await featuresService.update({ [key]: next });
        await renderApiFeaturesPage(ctx);
      } catch (e) {
        onErr(e);
      }
    });
  });

  document.querySelectorAll('[data-feat-preset]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const name = (btn as HTMLElement).getAttribute(
        'data-feat-preset',
      ) as FeaturePresetName | null;
      if (!name) return;
      if (
        !(await uiConfirm({
          message: tf('apiFeatures.presetConfirm', { name }),
          confirmText: t('common.confirm'),
        }))
      )
        return;
      try {
        await featuresService.applyPreset(name);
        await renderApiFeaturesPage(ctx);
      } catch (e) {
        onErr(e);
      }
    });
  });
}
