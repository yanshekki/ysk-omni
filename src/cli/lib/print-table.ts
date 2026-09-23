import { info } from './print';

/** Simple fixed-width table for CLI lists. */
export function printTable(
  headers: string[],
  rows: Array<Array<string | number | null | undefined>>,
): void {
  if (!rows.length) {
    info('(empty)');
    return;
  }
  const cols = headers.map((h, i) => {
    const cells = [h, ...rows.map((r) => String(r[i] ?? ''))];
    const width = Math.min(48, Math.max(...cells.map((c) => c.length)));
    return { header: h, width };
  });
  const line = (cells: string[]) =>
    cells
      .map((c, i) => {
        const w = cols[i]!.width;
        const s = c.length > w ? `${c.slice(0, w - 1)}…` : c;
        return s.padEnd(w);
      })
      .join('  ');
  info(line(headers));
  info(cols.map((c) => '-'.repeat(c.width)).join('  '));
  for (const r of rows) {
    info(line(r.map((x) => String(x ?? ''))));
  }
}
