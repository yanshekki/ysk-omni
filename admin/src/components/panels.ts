import { escapeHtml } from '../lib/dom';

export function dashKpiCard(opts: {
  label: string;
  value: string | number;
  sub?: string;
  tone?: string;
  href?: string;
}): string {
  const toneCls = opts.tone ? ` dash-kpi--${opts.tone}` : '';
  const inner = `
    <div class="label">${escapeHtml(opts.label)}</div>
    <div class="value">${opts.value}</div>
    ${opts.sub != null && opts.sub !== '' ? `<div class="dash-kpi-sub muted">${opts.sub}</div>` : ''}`;
  if (opts.href) {
    return `<button type="button" class="card dash-kpi${toneCls}" data-nav="${escapeHtml(opts.href)}">${inner}</button>`;
  }
  return `<div class="card dash-kpi${toneCls}">${inner}</div>`;
}

export function masterToggleBtnHtml(opts: {
  id: string;
  on: boolean;
  onLabel: string;
  offLabel: string;
  title?: string;
}): string {
  return `<button type="button"
    class="master-toggle ${opts.on ? 'is-on' : 'is-off'}"
    id="${escapeHtml(opts.id)}"
    aria-pressed="${opts.on ? 'true' : 'false'}"
    title="${escapeHtml(opts.title || '')}">
    <span class="master-toggle-track" aria-hidden="true"><span class="master-toggle-knob"></span></span>
    <span class="master-toggle-label">${escapeHtml(opts.on ? opts.onLabel : opts.offLabel)}</span>
  </button>`;
}
