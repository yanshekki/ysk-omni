import { describe, expect, it } from 'vitest';
import { listRows, listTotal } from '../../../../admin/src/lib/list';

describe('admin listRows / listTotal', () => {
  it('prefers items (chats shape)', () => {
    const res = {
      object: 'list',
      total: 20,
      items: [{ id: 'a' }, { id: 'b' }],
      data: [{ id: 'ignored' }],
    };
    // items takes priority when both present
    expect(listRows(res)).toEqual([{ id: 'a' }, { id: 'b' }]);
    expect(listTotal(res)).toBe(20);
  });

  it('uses data when items missing (keys/docs/media)', () => {
    const res = {
      object: 'list',
      total: 3,
      data: [{ id: '1' }, { id: '2' }, { id: '3' }],
    };
    expect(listRows(res)).toHaveLength(3);
    expect(listTotal(res)).toBe(3);
  });

  it('handles empty / null safely', () => {
    expect(listRows(null)).toEqual([]);
    expect(listRows(undefined)).toEqual([]);
    expect(listRows({})).toEqual([]);
    expect(listTotal(null)).toBe(0);
    expect(listTotal({ data: [{ x: 1 }] })).toBe(1);
  });

  it('reproduces chats page bug: total without rows when using wrong field', () => {
    const api = { object: 'list', total: 20, items: [{ id: '1' }] };
    // wrong: res.data
    const wrong = (api as { data?: unknown[] }).data || [];
    expect(wrong).toEqual([]);
    // correct
    expect(listRows(api)).toHaveLength(1);
    expect(listTotal(api, listRows(api))).toBe(20);
  });
});
