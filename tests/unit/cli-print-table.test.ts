import { describe, expect, it, vi } from 'vitest';
import { printTable } from '../../src/cli/lib/print-table';

describe('cli print-table', () => {
  it('prints empty marker for no rows', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    printTable(['a', 'b'], []);
    const joined = spy.mock.calls.map((c) => String(c[0])).join('\n');
    expect(joined).toMatch(/empty/i);
    spy.mockRestore();
  });

  it('prints header and rows', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    printTable(
      ['id', 'name'],
      [
        ['1', 'alice'],
        ['2', 'bob'],
      ],
    );
    const joined = spy.mock.calls.map((c) => String(c[0])).join('\n');
    expect(joined).toContain('id');
    expect(joined).toContain('alice');
    expect(joined).toContain('bob');
    spy.mockRestore();
  });
});
