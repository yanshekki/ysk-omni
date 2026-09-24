# Configuration

`ysk-omni setup` writes `~/.ysk-omni/.env`. Do not commit `.env`. See [`.env.example`](../../.env.example).

Default `NODE_ENV` is **production**. Use `development` only for local coding.

## Core

| Variable | Meaning |
|----------|---------|
| `PORT` | Default **3850** |
| `HOST` | Bind address (`0.0.0.0`) |
| `DATABASE_URL` | SQLite, e.g. `file:../data/gateway.db` (relative to `prisma/`) |
| `ENCRYPTION_KEY` | 32-byte key: `openssl rand -base64 32` |
| `ADMIN_BOOTSTRAP_KEY` | Optional first admin secret |
| `OMNI_HOME` | Data home |
| `STORAGE_DIR` | Encrypted files (default `./storage`) |
| `CORS_ORIGINS` | Comma-separated origins (update when `PORT` changes) |
| `LOG_LEVEL` | `fatal` … `trace` |
| `BODY_LIMIT` / `UPLOAD_MAX_BYTES` / `DOCUMENT_DB_MAX_BYTES` | Size caps |
| `ADMIN_PANEL_ENABLED` | Hard-disable `/admin` (restart). Runtime: `ysk-omni admin on\|off` |
| `PM2_ADMIN_ENABLED` | Allow Admin to control PM2 |

## Engines and workers

| Variable | Meaning |
|----------|---------|
| `OMNI_DEFAULT_MODEL` | Used when the client omits `model` |
| `OMNI_LLAMA_SERVER` | Path to `llama-server` |
| `OMNI_LLAMA_N_GPU_LAYERS` | Default `-1` (all layers). `0` = CPU |
| `OMNI_VLLM` | vLLM binary or Python interpreter |
| `OMNI_VLLM_MODULE` | `1` = `python -m vllm.entrypoints.openai.api_server` |
| `OMNI_IMAGE_URL` / `OMNI_TTS_URL` / `OMNI_STT_URL` / `OMNI_VIDEO_URL` | OpenAI-shaped workers |
| `OMNI_MAX_CONCURRENT` | In-flight chat jobs (also seeds queue concurrency) |
| `OMNI_TIMEOUT_MS` | Default timeout |
| `OMNI_SAFE_MODE` | Force every key into safe mode |
| `OMNI_SAFE_MAX_TURNS` / `OMNI_SAFE_TIMEOUT_MS` | Safe defaults |
| `OMNI_ALWAYS_APPROVE` | Agent-only; safe always off |
| `OMNI_DEFAULT_CWD` / `OMNI_CWD_ALLOWLIST` | Workspace paths (empty cwd = `<STORAGE_DIR>/workspaces/default`) |

## Limits and proxy

| Variable | Meaning |
|----------|---------|
| `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX` / `RATE_LIMIT_IP_MAX` | Rate limits |
| `CHAT_BURST_MAX` | Short-window burst per key |
| `BLOCK_FAILED_AUTH_*` / `BLOCK_DURATION_MS` | Failed-auth IP block |
| `TRUST_PROXY` | Hops: `0` / `1` / `2`… (`true`→1, `false`→0) |
| `PROXY_IP_SOURCE` | `auto` · `cloudflare` · `nginx` · `x-forwarded-for` · `socket` |
| `QUEUE_BACKEND` | `sqlite` (default). `redis` / `kafka` reserved |

DDoS policy in the database overrides env after first save.
