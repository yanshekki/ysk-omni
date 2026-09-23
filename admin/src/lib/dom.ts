/** DOM helpers — no business logic */

export function escapeHtml(s: unknown): string {
  return String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function qs<T extends HTMLElement = HTMLElement>(
  sel: string,
  root: ParentNode = document,
): T | null {
  return root.querySelector(sel) as T | null;
}

export function qsa<T extends HTMLElement = HTMLElement>(
  sel: string,
  root: ParentNode = document,
): T[] {
  return Array.from(root.querySelectorAll(sel)) as T[];
}

export function appRoot(): HTMLElement {
  const el = document.getElementById('app');
  if (!el) throw new Error('#app missing');
  return el;
}

export function setHtml(el: HTMLElement | null, html: string): void {
  if (el) el.innerHTML = html;
}
