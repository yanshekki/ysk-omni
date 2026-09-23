import { describe, expect, it } from 'vitest';
import {
  parseSortDir,
  resolveScalarOrderBy,
  sortInMemory,
} from '../../src/utils/list-sort';

describe('list-sort', () => {
  it('parseSortDir defaults to desc', () => {
    expect(parseSortDir(undefined)).toBe('desc');
    expect(parseSortDir('')).toBe('desc');
    expect(parseSortDir('ASC')).toBe('asc');
    expect(parseSortDir('desc')).toBe('desc');
    expect(parseSortDir('nope')).toBe('desc');
  });

  it('resolveScalarOrderBy uses whitelist + default field + desc', () => {
    const allowed = ['createdAt', 'name', 'status'] as const;
    expect(resolveScalarOrderBy(undefined, undefined, allowed, 'createdAt')).toEqual({
      createdAt: 'desc',
    });
    expect(resolveScalarOrderBy('name', 'asc', allowed, 'createdAt')).toEqual({
      name: 'asc',
    });
    expect(resolveScalarOrderBy('hack', 'asc', allowed, 'createdAt')).toEqual({
      createdAt: 'asc',
    });
  });

  it('sortInMemory sorts dates desc by default', () => {
    const rows = [
      { id: 1, createdAt: new Date('2024-01-01') },
      { id: 2, createdAt: new Date('2025-06-01') },
      { id: 3, createdAt: new Date('2024-06-01') },
    ];
    const sorted = sortInMemory(
      rows,
      undefined,
      undefined,
      { createdAt: (r) => r.createdAt },
      'createdAt',
    );
    expect(sorted.map((r) => r.id)).toEqual([2, 3, 1]);
  });

  it('sortInMemory sorts strings asc when requested', () => {
    const rows = [{ name: 'zeta' }, { name: 'alpha' }, { name: 'mu' }];
    const sorted = sortInMemory(
      rows,
      'name',
      'asc',
      { name: (r) => r.name },
      'name',
    );
    expect(sorted.map((r) => r.name)).toEqual(['alpha', 'mu', 'zeta']);
  });

  it('sortInMemory nulls last', () => {
    const rows = [
      { n: 1 as number | null },
      { n: null },
      { n: 3 as number | null },
    ];
    const sorted = sortInMemory(
      rows,
      'n',
      'desc',
      { n: (r) => r.n },
      'n',
    );
    expect(sorted.map((r) => r.n)).toEqual([3, 1, null]);
  });
});
