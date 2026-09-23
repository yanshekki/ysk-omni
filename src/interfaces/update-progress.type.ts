/** Optional progress hooks for CLI loading UI */
export type UpdateProgress = {
  /** Called at the start of each major step */
  step?: (info: { index: number; total: number; title: string }) => void;
  /** Called while a long command is about to run */
  start?: (label: string) => void;
  /** Called when a step succeeds */
  succeed?: (label: string) => void;
  /** Called when a step fails */
  fail?: (label: string) => void;
};
