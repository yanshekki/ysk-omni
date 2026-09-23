/** Editable PM2 app options (stored in pm2.runtime.json) */
export interface Pm2RuntimeConfig {
  name: string;
  script: string;
  cwd?: string;
  instances: number | string;
  exec_mode: 'fork' | 'cluster';
  autorestart: boolean;
  watch: boolean;
  max_memory_restart: string;
  max_restarts: number;
  min_uptime: string | number;
  restart_delay: number;
  exp_backoff_restart_delay: number;
  merge_logs: boolean;
  time: boolean;
  error_file: string;
  out_file: string;
  /** Extra env vars merged on top of .env (do not put secrets you wouldn't commit) */
  env_extra: Record<string, string>;
  /** Preferred runner after switch / start: pm2 | gctoac */
  preferred_runner: 'pm2' | 'gctoac';
}
