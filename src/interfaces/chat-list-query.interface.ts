/** Admin chat-request list filters. */
export interface ChatListQuery {
  limit?: number;
  offset?: number;
  status?: string;
  apiKeyId?: string;
  model?: string;
  q?: string;
  from?: string;
  to?: string;
  hasDocuments?: boolean | string;
  policyMode?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}
