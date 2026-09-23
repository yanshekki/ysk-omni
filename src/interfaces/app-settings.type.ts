/** Runtime application settings (DB-backed with env defaults). */
export type AppSettings = {
  globalSafeMode: boolean;
  safeMaxTurns: number;
  safeTimeoutMs: number;
  safeToolsMode: 'none' | 'readonly';
  defaultModel: string;
  adminPanelEnabled: boolean;
};
