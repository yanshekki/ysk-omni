/**
 * Normalize Admin list envelopes.
 * Backend is inconsistent: chats use `items`, keys/docs/media use `data`.
 */
export type ListEnvelope<T> = {
  object?: string;
  total?: number;
  limit?: number;
  offset?: number;
  data?: T[];
  items?: T[];
};

export function listRows<T>(res: ListEnvelope<T> | null | undefined): T[] {
  if (!res) return [];
  if (Array.isArray(res.items)) return res.items;
  if (Array.isArray(res.data)) return res.data;
  return [];
}

export function listTotal<T>(
  res: ListEnvelope<T> | null | undefined,
  rows?: T[],
): number {
  if (res && typeof res.total === 'number') return res.total;
  return (rows ?? listRows(res)).length;
}
