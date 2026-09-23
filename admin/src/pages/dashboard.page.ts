import { appRoot, escapeHtml } from '../lib/dom';
import { fmtMs, fmtTime } from '../lib/format';
import { badgeMode, badgeStatus } from '../lib/badges';
import { t, tf, tx } from '../i18n';
import { statsService } from '../services/stats.service';
import { bindShell, shell } from '../components/shell';
import { dashKpiCard } from '../components/panels';
import { dataTablePanelHtml } from '../components/table';
import { parseStats } from './page-api';
import { onErr } from '../state/store';
import type { RecentChat, StatsData } from '../types/api/stats';
import type { RenderCtx } from '../router';

export async function renderDashboardPage(ctx: RenderCtx): Promise<void> {
  const res = await statsService.get();
  const parsed = parseStats(res);
  const d = (res.data || {}) as StatsData;
  const recent = parsed.recentChats as RecentChat[];
  const tot = (parsed.totals || {}) as NonNullable<StatsData['totals']>;
  const rt = d.runtime || {};
  const conc = d.concurrency || {};
  const q = (parsed.queue || null) as StatsData['queue'];
  const safety = (parsed.safety || null) as StatsData['safety'];
  const models = (parsed.models24h || []) as NonNullable<
    StatsData['models24h']
  >;
  const rate24 = tot.successRate24h ?? 0;
  const rateAll = tot.successRate ?? 0;
  const genAt = parsed.generatedAt ? fmtTime(parsed.generatedAt) : '—';

  let queueKpiValue = '—';
  let queueKpiSub = t('dash.kpiQueueSub');
  let queueTone = '';
  if (q) {
    if (!q.enabled) {
      queueKpiValue = t('dash.kpiQueueOff');
      queueTone = 'warn';
    } else if (q.paused) {
      queueKpiValue = t('dash.kpiQueuePaused');
      queueTone = 'warn';
    } else if (q.drainMode) {
      queueKpiValue = t('dash.kpiQueueDrain');
      queueTone = 'warn';
    } else {
      queueKpiValue = `${q.depth ?? 0}`;
    }
    const waitS =
      q.oldestQueuedAgeMs && q.oldestQueuedAgeMs > 0
        ? ` · wait ${Math.round(q.oldestQueuedAgeMs / 1000)}s`
        : '';
    queueKpiSub = tf('dash.kpiQueueSubLive', {
      run: q.running ?? 0,
      max: q.globalConcurrency ?? '—',
      dead: q.dead ?? 0,
      wait: waitS,
    });
    if ((q.dead || 0) > 0 || (q.depth || 0) > 20) queueTone = queueTone || 'warn';
  }

  const safeOn = Boolean(safety?.globalSafeMode);
  const safeKpiValue = safety
    ? safeOn
      ? t('dash.kpiSafeOn')
      : t('dash.kpiSafeOff')
    : '—';
  const safeKpiSub = safety
    ? tf('dash.kpiSafeSub', {
        tools: safety.safeToolsMode || '—',
        turns: safety.safeMaxTurns ?? '—',
        model: safety.defaultModel || '—',
      })
    : t('dash.kpiSafeSubEmpty');

  const bodyHtml = recent
    .map(
      (c) => `
    <tr>
      <td><span class="cell-primary">${escapeHtml(c.requestId)}</span>
        <div class="cell-sub">${escapeHtml(c.apiKey?.name || '')}</div></td>
      <td>${escapeHtml(c.model)}</td>
      <td>${badgeStatus(c.status)}</td>
      <td>${badgeMode(c.policyMode || '-')}</td>
      <td>${fmtMs(c.durationMs)}</td>
      <td>${fmtTime(c.createdAt)}</td>
    </tr>`,
    )
    .join('');

  const recentTable = dataTablePanelHtml({
    headHtml: `
      <th>${escapeHtml(t('chats.request'))}</th>
      <th>${escapeHtml(t('chats.model'))}</th>
      <th>${escapeHtml(t('chats.status'))}</th>
      <th>${escapeHtml(t('chats.mode'))}</th>
      <th>${escapeHtml(tx('chats.duration', 'Duration'))}</th>
      <th>${escapeHtml(t('chats.time'))}</th>`,
    bodyHtml,
    colSpan: 6,
    emptyText: tx('dash.empty', t('common.empty')),
  });

  const modelMax = Math.max(1, ...models.map((m) => m.requests || 0), 1);
  const modelBars = models.length
    ? models
        .map((m) => {
          const pct = Math.round(((m.requests || 0) / modelMax) * 100);
          return `
          <div class="dash-bar-row">
            <div class="dash-bar-label" title="${escapeHtml(m.model)}">${escapeHtml(m.model)}</div>
            <div class="dash-bar-track"><span style="width:${pct}%"></span></div>
            <div class="dash-bar-n">${m.requests}</div>
          </div>`;
        })
        .join('')
    : `<div class="data-empty" style="padding:20px"><strong>${escapeHtml(t('dash.emptyModels'))}</strong></div>`;

  const queueDetailHtml = q
    ? `
      <div class="dash-stat-grid">
        <div><div class="label">${escapeHtml(t('dash.qQueued'))}</div><div class="value value-sm">${q.queued ?? 0}</div></div>
        <div><div class="label">${escapeHtml(t('dash.qRunning'))}</div><div class="value value-sm">${q.running ?? 0}<span class="dash-kpi-den">/${q.globalConcurrency ?? '—'}</span></div></div>
        <div><div class="label">${escapeHtml(t('dash.qDead'))}</div><div class="value value-sm">${q.dead ?? 0}</div></div>
        <div><div class="label">${escapeHtml(t('dash.qSucceeded'))}</div><div class="value value-sm">${q.succeeded ?? 0}</div></div>
      </div>`
    : `<div class="data-empty" style="padding:12px 0"><strong>${escapeHtml(t('dash.qUnavailable'))}</strong></div>`;

  appRoot().innerHTML = shell(`
    <div class="dash-hero">
      <div class="dash-hero-text">
        <h2>${escapeHtml(t('dash.title'))}</h2>
        <p class="muted">${escapeHtml(t('dash.subtitle'))}</p>
      </div>
      <div class="dash-hero-meta">
        <span class="muted">${escapeHtml(t('dash.updated'))}: ${escapeHtml(genAt)}</span>
        <button type="button" class="btn secondary sm" id="dash-refresh">${escapeHtml(t('dash.refresh'))}</button>
      </div>
    </div>

    <div class="dash-kpi-grid">
      ${dashKpiCard({
        label: t('dash.kpi24h'),
        value: tot.chats24h ?? 0,
        sub: tf('dash.kpi24hSub', { ok: tot.success24h ?? 0, err: tot.error24h ?? 0 }),
        tone: 'primary',
        href: 'chats',
      })}
      ${dashKpiCard({
        label: t('dash.kpiSuccessRate'),
        value: `${rate24}%`,
        sub: tf('dash.kpiSuccessRateSub', { all: rateAll }),
        tone: rate24 >= 90 ? 'ok' : rate24 >= 70 ? 'warn' : 'danger',
        href: 'usage',
      })}
      ${dashKpiCard({
        label: t('dash.kpiErrors'),
        value: tot.error24h ?? 0,
        sub: tf('dash.kpiErrorsSub', { all: tot.errors ?? 0 }),
        tone: (tot.error24h || 0) > 0 ? 'warn' : 'ok',
        href: 'chats',
      })}
      ${dashKpiCard({
        label: t('dash.kpiQueue'),
        value: queueKpiValue,
        sub: queueKpiSub,
        tone: queueTone,
        href: 'queue',
      })}
      ${dashKpiCard({
        label: t('dash.kpiSafe'),
        value: safeKpiValue,
        sub: safeKpiSub,
        tone: safety ? (safeOn ? 'ok' : 'warn') : '',
        href: 'settings',
      })}
      ${dashKpiCard({
        label: t('dash.kpiKeys'),
        value: `${tot.activeKeys ?? 0}<span class="dash-kpi-den">/${tot.totalKeys ?? 0}</span>`,
        sub: t('dash.kpiKeysSub'),
        href: 'keys',
      })}
      ${dashKpiCard({
        label: t('dash.kpiDocs'),
        value: tot.documents ?? 0,
        sub: t('dash.kpiDocsSub'),
        href: 'documents',
      })}
      ${dashKpiCard({
        label: t('dash.kpiMedia') || 'Media',
        value: tot.mediaAssets ?? 0,
        sub: tf('dash.kpiMediaSub', { n: tot.mediaAssets24h ?? 0 }),
        href: 'media',
      })}
      ${dashKpiCard({
        label: t('dash.kpiConv'),
        value: tot.conversations ?? 0,
        sub: tf('dash.kpiConvSub', { n: tot.conversations24h ?? 0 }),
        href: 'chat',
      })}
      ${dashKpiCard({
        label: t('dash.kpiSessions'),
        value: tot.adminSessions ?? rt.adminSessions ?? 0,
        sub: t('dash.kpiSessionsSub'),
      })}
      ${dashKpiCard({
        label: t('dash.kpiConcurrent'),
        value: `${conc.active ?? 0}<span class="dash-kpi-den">/${conc.max ?? 0}</span>`,
        sub: t('dash.kpiConcurrentSub'),
        tone: (conc.active || 0) >= (conc.max || 1) ? 'warn' : '',
      })}
    </div>

    <div class="dash-layout">
      <div class="dash-main">
        <div class="panel dash-panel">
          <div class="panel-h">
            <strong>${escapeHtml(t('dash.recent'))}</strong>
            <button type="button" class="btn secondary sm" data-nav="chats">${escapeHtml(t('dash.viewAll'))}</button>
          </div>
          ${recentTable.replace('data-table-panel', 'data-table-panel dash-embed-table')}
        </div>
        <div class="panel dash-panel">
          <div class="panel-h">
            <strong>${escapeHtml(t('dash.queuePanel'))}</strong>
            <button type="button" class="btn secondary sm" data-nav="queue">${escapeHtml(t('dash.openQueue'))}</button>
          </div>
          <div class="panel-pad dash-prot">${queueDetailHtml}</div>
        </div>
      </div>
      <aside class="dash-side">
        <div class="panel dash-panel">
          <div class="panel-h">
            <strong>${escapeHtml(tx('dash.models24h', 'Models 24h'))}</strong>
            <button type="button" class="btn secondary sm" data-nav="usage">${escapeHtml(t('dash.viewAll'))}</button>
          </div>
          <div class="panel-pad">${modelBars}</div>
        </div>
        <div class="panel dash-panel">
          <div class="panel-h">
            <strong>${escapeHtml(t('dash.safety'))}</strong>
            <button type="button" class="btn secondary sm" data-nav="settings">${escapeHtml(t('dash.openSettings'))}</button>
          </div>
          <div class="panel-pad">
            <div class="dash-prot-row">
              <span>${escapeHtml(t('dash.kpiSafe'))}</span>
              <span class="badge ${safeOn ? 'success' : 'warn'}">${escapeHtml(safeKpiValue)}</span>
            </div>
            <p class="muted" style="margin:0.5rem 0 0;font-size:0.85rem">${escapeHtml(safeKpiSub)}</p>
          </div>
        </div>
      </aside>
    </div>
  `);

  bindShell(ctx.rerender);
  document.getElementById('dash-refresh')?.addEventListener('click', () => {
    renderDashboardPage(ctx).catch(onErr);
  });
}
