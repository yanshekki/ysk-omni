/** Dashboard /stats response (subset used by UI) */

export type StatsTotals = {
  chats24h?: number;
  success24h?: number;
  error24h?: number;
  successRate24h?: number;
  successRate?: number;
  errors?: number;
  activeKeys?: number;
  totalKeys?: number;
  documents?: number;
  mediaAssets?: number;
  mediaAssets24h?: number;
  conversations?: number;
  conversations24h?: number;
  adminSessions?: number;
};

export type StatsQueue = {
  enabled?: boolean;
  paused?: boolean;
  drainMode?: boolean;
  depth?: number;
  queued?: number;
  running?: number;
  dead?: number;
  succeeded?: number;
  globalConcurrency?: number;
  oldestQueuedAgeMs?: number;
  workerId?: string;
  workerActive?: number;
};

export type StatsSafety = {
  globalSafeMode?: boolean;
  safeToolsMode?: string;
  safeMaxTurns?: number;
  defaultModel?: string;
};

export type RecentChat = {
  id: string;
  requestId: string;
  model: string;
  status: string;
  policyMode?: string;
  durationMs?: number | null;
  createdAt: string;
  apiKey?: { name?: string };
};

export type StatsData = {
  totals?: StatsTotals;
  protection?: Record<string, unknown>;
  runtime?: { adminSessions?: number };
  concurrency?: { active?: number; max?: number };
  queue?: StatsQueue | null;
  safety?: StatsSafety | null;
  models24h?: Array<{ model: string; requests: number }>;
  recentChats?: RecentChat[];
  generatedAt?: string;
};

export type StatsResponse = {
  object?: string;
  data: StatsData;
};
