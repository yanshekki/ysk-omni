export const API_KEY_PREFIX = 'gk_live_';

export const MAX_MESSAGES = 100;
export const MAX_MESSAGE_CHARS = 100_000;
export const MAX_TOTAL_PROMPT_CHARS = 500_000;
export const MAX_DOCUMENT_CONTEXT_CHARS = 200_000;
export const MAX_DOCUMENTS_PER_CHAT = 10;

export const ALLOWED_UPLOAD_MIME_TYPES = new Set([
  'text/plain',
  'text/markdown',
  'text/csv',
  'text/html',
  'application/json',
  'application/xml',
  'text/xml',
  'application/pdf',
  'application/javascript',
  'text/javascript',
  'application/typescript',
  'text/typescript',
  'text/x-python',
  'text/x-java-source',
  'text/css',
  'text/yaml',
  'application/x-yaml',
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
]);

export const ALLOWED_UPLOAD_EXTENSIONS = new Set([
  '.txt',
  '.md',
  '.markdown',
  '.csv',
  '.json',
  '.xml',
  '.html',
  '.htm',
  '.js',
  '.ts',
  '.tsx',
  '.jsx',
  '.py',
  '.java',
  '.go',
  '.rs',
  '.c',
  '.cpp',
  '.h',
  '.hpp',
  '.css',
  '.yml',
  '.yaml',
  '.toml',
  '.ini',
  '.env',
  '.sh',
  '.sql',
  '.log',
  '.pdf',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
]);

/** Extension → allowed MIME set (strict pairing). */
export const EXT_MIME_MAP: Record<string, Set<string>> = {
  '.txt': new Set(['text/plain']),
  '.md': new Set(['text/plain', 'text/markdown']),
  '.markdown': new Set(['text/plain', 'text/markdown']),
  '.csv': new Set(['text/csv', 'text/plain']),
  '.json': new Set(['application/json', 'text/plain']),
  '.xml': new Set(['application/xml', 'text/xml', 'text/plain']),
  '.html': new Set(['text/html']),
  '.htm': new Set(['text/html']),
  '.js': new Set(['application/javascript', 'text/javascript', 'text/plain']),
  '.ts': new Set([
    'application/typescript',
    'text/typescript',
    'text/plain',
    'application/javascript',
  ]),
  '.tsx': new Set([
    'application/typescript',
    'text/typescript',
    'text/plain',
    'application/javascript',
  ]),
  '.jsx': new Set(['application/javascript', 'text/javascript', 'text/plain']),
  '.py': new Set(['text/x-python', 'text/plain']),
  '.java': new Set(['text/x-java-source', 'text/plain']),
  '.go': new Set(['text/plain']),
  '.rs': new Set(['text/plain']),
  '.c': new Set(['text/plain']),
  '.cpp': new Set(['text/plain']),
  '.h': new Set(['text/plain']),
  '.hpp': new Set(['text/plain']),
  '.css': new Set(['text/css', 'text/plain']),
  '.yml': new Set(['text/yaml', 'application/x-yaml', 'text/plain']),
  '.yaml': new Set(['text/yaml', 'application/x-yaml', 'text/plain']),
  '.toml': new Set(['text/plain']),
  '.ini': new Set(['text/plain']),
  '.env': new Set(['text/plain']),
  '.sh': new Set(['text/plain']),
  '.sql': new Set(['text/plain']),
  '.log': new Set(['text/plain']),
  '.pdf': new Set(['application/pdf']),
  '.png': new Set(['image/png']),
  '.jpg': new Set(['image/jpeg']),
  '.jpeg': new Set(['image/jpeg']),
  '.webp': new Set(['image/webp']),
  '.gif': new Set(['image/gif']),
};

export function isImageMime(mime: string): boolean {
  return mime.toLowerCase().startsWith('image/');
}

export function isTextualMime(mime: string): boolean {
  const m = mime.toLowerCase();
  return (
    m.startsWith('text/') ||
    m === 'application/json' ||
    m === 'application/xml' ||
    m === 'application/javascript' ||
    m === 'application/typescript' ||
    m === 'application/x-yaml'
  );
}

export const CHAT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  ERROR: 'error',
  TIMEOUT: 'timeout',
  /** Client disconnected mid-stream */
  CANCELLED: 'cancelled',
} as const;

export const AUDIT_ACTIONS = {
  CHAT_CREATE: 'chat.create',
  DOCUMENT_UPLOAD: 'document.upload',
  DOCUMENT_DELETE: 'document.delete',
  DOCUMENT_LIST: 'document.list',
  DOCUMENT_READ: 'document.read',
  DOCUMENT_DOWNLOAD: 'document.download',
  API_KEY_CREATE: 'api_key.create',
  API_KEY_UPDATE: 'api_key.update',
  API_KEY_DELETE: 'api_key.delete',
  API_KEY_LIST: 'api_key.list',
  SETTINGS_UPDATE: 'settings.update',
  CHAT_ADMIN_VIEW: 'chat.admin_view',
  SYSTEM_UPDATE: 'system.update',
  SYSTEM_UPDATE_CHECK: 'system.update_check',
  IP_BAN: 'ip.ban',
  IP_UNBAN: 'ip.unban',
  DDOS_POLICY_UPDATE: 'ddos.policy_update',
  PM2_START: 'pm2.start',
  PM2_STOP: 'pm2.stop',
  PM2_RESTART: 'pm2.restart',
  PM2_RELOAD: 'pm2.reload',
  PM2_CONFIG: 'pm2.config',
  PM2_SWITCH: 'pm2.switch',
  PLAYGROUND_CHAT: 'playground.chat',
  PLAYGROUND_UPLOAD: 'playground.upload',
  CONVERSATION_CREATE: 'conversation.create',
  CONVERSATION_UPDATE: 'conversation.update',
  CONVERSATION_DELETE: 'conversation.delete',
  ADMIN_LOGIN: 'admin.login',
  ADMIN_LOGOUT: 'admin.logout',
  ADMIN_OTP_CREATE: 'admin.otp_create',
  QUEUE_POLICY_UPDATE: 'queue.policy_update',
  QUEUE_CANCEL: 'queue.cancel',
  QUEUE_REQUEUE: 'queue.requeue',
  API_FEATURES_UPDATE: 'admin.api_features_update',
  MEDIA_GENERATE: 'media.generate',
  MEDIA_READ: 'media.read',
  MEDIA_DELETE: 'media.delete',
  GROK_SESSION_DELETE: 'grok.session_delete',
} as const;

export const ROLES = {
  CLIENT: 'client',
  ADMIN: 'admin',
} as const;

export const KEY_MODES = {
  SAFE: 'safe',
  AGENT: 'agent',
} as const;

/** Re-export canonical mode type (lives in interfaces/). */
export type { KeyMode, ApiKeyMode } from '../interfaces/api-key-mode.type';

/**
 * Tools stripped in safe mode (denylist). Prefer SAFE_READONLY_TOOLS allowlist
 * when safeToolsMode=readonly (stronger). Names cover common Grok CLI aliases.
 */
export const SAFE_DISALLOWED_TOOLS = [
  'run_terminal_cmd',
  'run_terminal_command',
  'Bash',
  'bash',
  'Shell',
  'shell',
  'search_replace',
  'Edit',
  'edit',
  'Write',
  'write',
  'MultiEdit',
  'NotebookEdit',
  'web_search',
  'web_fetch',
  'WebSearch',
  'WebFetch',
  'Agent',
  'Task',
  'spawn_subagent',
  'image_gen',
  'image_edit',
  'image_to_video',
  'reference_to_video',
  'mcp',
  'MCP',
].join(',');

export const SETTING_KEYS = {
  GLOBAL_SAFE_MODE: 'global_safe_mode',
  SAFE_MAX_TURNS: 'safe_max_turns',
  SAFE_TIMEOUT_MS: 'safe_timeout_ms',
  SAFE_TOOLS_MODE: 'safe_tools_mode', // none | readonly
  DEFAULT_MODEL: 'default_model',
  ADMIN_PANEL_ENABLED: 'admin_panel_enabled',
  /** JSON blob: runtime DDoS / rate-limit / auto-ban policy */
  DDOS_POLICY: 'ddos_policy',
  /** JSON blob: chat work-queue policy */
  QUEUE_POLICY: 'queue_policy',
  /** JSON blob: API protocol + Grok capability feature flags */
  API_FEATURES: 'api_features',
} as const;

export const CHAT_JOB_STATUS = {
  QUEUED: 'queued',
  LEASED: 'leased',
  RUNNING: 'running',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  DEAD: 'dead',
} as const;

export const CHAT_JOB_SOURCE = {
  V1: 'v1',
  PLAYGROUND: 'playground',
} as const;

/** IpBlacklist.source values */
export const BAN_SOURCES = {
  MANUAL: 'manual',
  AUTO_AUTH: 'auto-auth',
  AUTO_RATE: 'auto-rate',
  AUTO_CONN: 'auto-conn',
  AUTO_VELOCITY: 'auto-velocity',
  AUTO_ESCALATE: 'auto-escalate',
} as const;

export type BanSource = (typeof BAN_SOURCES)[keyof typeof BAN_SOURCES];

export const SAFE_TOOLS_MODES = {
  NONE: 'none',
  READONLY: 'readonly',
} as const;

/** Strongest safe default: only read-only inspection tools. */
export const SAFE_READONLY_TOOLS =
  'read_file,Read,grep,Grep,list_dir,LS,Glob,glob';

export const STORAGE_TYPES = {
  DB: 'db',
  FILESYSTEM: 'filesystem',
} as const;

/** Fallback models if `grok models` cannot be parsed */
export const DEFAULT_MODELS = ['grok-4.6', 'grok-4.5'] as const;

/**
 * Grok Imagine `aspect_ratio` values (image_gen / image_edit multi-ref).
 * Prefer these over OpenAI pixel sizes when calling Grok tools.
 */
export const GROK_ASPECT_RATIOS = [
  'auto',
  '1:1',
  '16:9',
  '9:16',
  '4:3',
  '3:4',
  '3:2',
  '2:3',
  '2:1',
  '1:2',
] as const;

/** OpenAI Images API size strings (compat); mapped to Grok aspect ratios. */
export const OPENAI_IMAGE_SIZES = [
  '256x256',
  '512x512',
  '1024x1024',
  '1792x1024',
  '1024x1792',
] as const;

/** Grok image_to_video / reference_to_video duration (seconds). 1.0.1+ allows 1–15. */
export const GROK_VIDEO_MIN_SECONDS = 1;
export const GROK_VIDEO_MAX_SECONDS = 15;
export const GROK_VIDEO_DURATIONS = [6, 10] as const;

/** Preset voices for Grok reference_to_video (Imagine). Unknown ids are rejected. */
export const GROK_VIDEO_VOICES = [
  'ara',
  'eve',
  'leo',
  'rex',
  'sal',
  'mio',
] as const;

/**
 * Map OpenAI-style `size` or Grok `aspect_ratio` → canonical aspect ratio string.
 */
export function resolveGrokAspectRatio(
  sizeOrAspect?: string | null,
  aspectRatio?: string | null,
): string {
  const ar = (aspectRatio || '').trim();
  if (ar && (GROK_ASPECT_RATIOS as readonly string[]).includes(ar)) return ar;

  const s = (sizeOrAspect || '').trim();
  if (!s) return '1:1';
  if ((GROK_ASPECT_RATIOS as readonly string[]).includes(s)) return s;

  switch (s) {
    case '256x256':
    case '512x512':
    case '1024x1024':
      return '1:1';
    case '1792x1024':
      return '16:9';
    case '1024x1792':
      return '9:16';
    default:
      // WxH → nearest common ratio when possible
      const m = s.match(/^(\d+)\s*[x×]\s*(\d+)$/i);
      if (m) {
        const w = Number(m[1]);
        const h = Number(m[2]);
        if (w > 0 && h > 0) {
          const r = w / h;
          if (Math.abs(r - 1) < 0.08) return '1:1';
          if (Math.abs(r - 16 / 9) < 0.08) return '16:9';
          if (Math.abs(r - 9 / 16) < 0.08) return '9:16';
          if (Math.abs(r - 4 / 3) < 0.08) return '4:3';
          if (Math.abs(r - 3 / 4) < 0.08) return '3:4';
          if (Math.abs(r - 3 / 2) < 0.08) return '3:2';
          if (Math.abs(r - 2 / 3) < 0.08) return '2:3';
        }
      }
      return 'auto';
  }
}
