/** Shared list sorting helpers for Admin APIs (server-side only). */

export type SortDir = 'asc' | 'desc';

export function parseSortDir(raw: unknown): SortDir {
  return String(raw || '').toLowerCase() === 'asc' ? 'asc' : 'desc';
}

/**
 * Pick a whitelist field for Prisma `orderBy: { field: dir }`.
 * Invalid sortBy falls back to defaultField; sortDir defaults to desc.
 */
export function resolveScalarOrderBy<T extends string>(
  sortBy: string | undefined,
  sortDir: SortDir | string | undefined,
  allowed: readonly T[],
  defaultField: T,
): Record<string, SortDir> {
  const dir = parseSortDir(sortDir);
  const field = (
    sortBy && (allowed as readonly string[]).includes(sortBy)
      ? sortBy
      : defaultField
  ) as T;
  return { [field]: dir };
}

/**
 * In-memory sort for aggregates / connection snapshots.
 * Default direction is **desc** (newest / largest first).
 */
export function sortInMemory<T>(
  rows: T[],
  sortBy: string | undefined,
  sortDir: SortDir | string | undefined,
  getters: Record<
    string,
    (row: T) => string | number | Date | null | undefined
  >,
  defaultKey: string,
): T[] {
  const dirMul = parseSortDir(sortDir) === 'asc' ? 1 : -1;
  const key = sortBy && getters[sortBy] ? sortBy : defaultKey;
  const get = getters[key] || getters[defaultKey];
  if (!get) return [...rows];
  return [...rows].sort((a, b) => {
    const va = get(a);
    const vb = get(b);
    if (va == null && vb == null) return 0;
    if (va == null) return 1;
    if (vb == null) return -1;
    if (va instanceof Date && vb instanceof Date) {
      return (va.getTime() - vb.getTime()) * dirMul;
    }
    if (typeof va === 'number' && typeof vb === 'number') {
      return (va - vb) * dirMul;
    }
    const sa = String(va);
    const sb = String(vb);
    // ISO date strings
    if (/^\d{4}-\d{2}-\d{2}/.test(sa) && /^\d{4}-\d{2}-\d{2}/.test(sb)) {
      return (Date.parse(sa) - Date.parse(sb)) * dirMul;
    }
    return (
      sa.localeCompare(sb, undefined, {
        numeric: true,
        sensitivity: 'base',
      }) * dirMul
    );
  });
}
