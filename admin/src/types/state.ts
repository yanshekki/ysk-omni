import type { PageId } from '../config/constants';

export type AdminMe = {
  id: string;
  name: string;
  role: string;
  mode?: string;
  keyPrefix?: string;
  authVia?: string;
};

export type ListFilter = {
  q: string;
  limit: number;
  offset: number;
};

export type KeyFilter = ListFilter & {
  role: string;
  mode: string;
  isActive: string;
};

export type DocFilter = ListFilter & {
  apiKeyId: string;
  storageType: string;
  from: string;
  to: string;
};

export type ChatFilter = ListFilter & {
  status: string;
  model: string;
  apiKeyId: string;
  from: string;
  to: string;
  policyMode: string;
  hasDocuments: string;
};

export type AuditFilter = ListFilter & {
  action: string;
  apiKeyId: string;
  from: string;
  to: string;
};

export type UsageFilter = {
  tab: 'model' | 'key';
  modelQ: string;
  keyQ: string;
  keyActive: string;
  modelPage: number;
  keyPage: number;
  pageSize: number;
};

export type DdosFilter = {
  liveQ: string;
  banQ: string;
  banSource: string;
  livePage: number;
  banPage: number;
  pageSize: number;
};

export type AppState = {
  key: string;
  page: PageId;
  me: AdminMe | null;
  error: string;
  modal: string | null;
  chatFilter: ChatFilter;
  docFilter: DocFilter;
  keyFilter: KeyFilter;
  auditFilter: AuditFilter;
  usageFilter: UsageFilter;
  ddosFilter: DdosFilter;
  mediaKind: string;
  /** Model id strings (playground select) */
  models: string[];
  keys: Array<Record<string, unknown>>;
};

export type Listener = () => void;
