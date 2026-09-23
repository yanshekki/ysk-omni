const path = require('node:path');
const fs = require('node:fs');

// Load project .env into PM2 env so DATABASE_URL / ENCRYPTION_KEY exist
function loadEnvFile(filePath) {
  const out = {};
  try {
    if (!fs.existsSync(filePath)) return out;
    for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const eq = t.indexOf('=');
      if (eq <= 0) continue;
      const k = t.slice(0, eq).trim();
      let v = t.slice(eq + 1).trim();
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      out[k] = v;
    }
  } catch {
    /* ignore */
  }
  return out;
}

function loadRuntimeConfig(root) {
  const defaults = {
    name: 'grok-openai-gateway',
    script: 'dist/server.js',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    max_restarts: 10,
    min_uptime: '5s',
    restart_delay: 2000,
    exp_backoff_restart_delay: 1000,
    merge_logs: true,
    time: true,
    error_file: 'logs/pm2-error.log',
    out_file: 'logs/pm2-out.log',
    env_extra: {},
  };
  try {
    const p = path.join(root, 'pm2.runtime.json');
    if (fs.existsSync(p)) {
      const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
      return { ...defaults, ...raw, env_extra: { ...defaults.env_extra, ...(raw.env_extra || {}) } };
    }
  } catch {
    /* ignore */
  }
  return defaults;
}

const root = __dirname;
const fileEnv = {
  ...loadEnvFile(path.join(root, '.env')),
  ...loadEnvFile(path.join(process.env.HOME || '', '.gctoac', '.env')),
};
const rt = loadRuntimeConfig(root);

/** @type {import('pm2').StartOptions[]} */
module.exports = {
  apps: [
    {
      name: rt.name || 'grok-openai-gateway',
      script: rt.script || 'dist/server.js',
      cwd: rt.cwd || root,
      instances: rt.instances != null ? rt.instances : 1,
      exec_mode: rt.exec_mode === 'cluster' ? 'cluster' : 'fork',
      autorestart: rt.autorestart !== false,
      max_restarts: rt.max_restarts != null ? rt.max_restarts : 10,
      min_uptime: rt.min_uptime != null ? rt.min_uptime : '5s',
      restart_delay: rt.restart_delay != null ? rt.restart_delay : 2000,
      exp_backoff_restart_delay:
        rt.exp_backoff_restart_delay != null ? rt.exp_backoff_restart_delay : 1000,
      watch: Boolean(rt.watch),
      max_memory_restart: rt.max_memory_restart || '512M',
      env: {
        NODE_ENV: fileEnv.NODE_ENV || 'production',
        ...fileEnv,
        ...(rt.env_extra || {}),
      },
      error_file: rt.error_file || 'logs/pm2-error.log',
      out_file: rt.out_file || 'logs/pm2-out.log',
      merge_logs: rt.merge_logs !== false,
      time: rt.time !== false,
    },
  ],
};
