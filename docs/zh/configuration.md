# 設定

`ysk-omni setup` 會寫入 `~/.ysk-omni/.env`。不要提交 `.env`。見 [`.env.example`](../../.env.example)。

預設 `NODE_ENV` 為 **production**。只有本機開發才用 `development`。

## 核心

| 變數 | 說明 |
|------|------|
| `PORT` | 預設 **3850** |
| `HOST` | 監聽位址（`0.0.0.0`） |
| `DATABASE_URL` | SQLite，例如 `file:../data/gateway.db`（相對 `prisma/`） |
| `ENCRYPTION_KEY` | 32-byte 金鑰：`openssl rand -base64 32` |
| `ADMIN_BOOTSTRAP_KEY` | 可選的第一把 admin 密鑰 |
| `OMNI_HOME` | 資料主目錄 |
| `STORAGE_DIR` | 加密檔案（預設 `./storage`） |
| `CORS_ORIGINS` | 逗號分隔 origins（改 `PORT` 時請一併更新） |
| `LOG_LEVEL` | `fatal` … `trace` |
| `BODY_LIMIT`／`UPLOAD_MAX_BYTES`／`DOCUMENT_DB_MAX_BYTES` | 大小上限 |
| `ADMIN_PANEL_ENABLED` | 硬關 `/admin`（需重啟）。運行時：`ysk-omni admin on\|off` |
| `PM2_ADMIN_ENABLED` | 允許 Admin 控制 PM2 |

## 引擎與 worker

| 變數 | 說明 |
|------|------|
| `OMNI_DEFAULT_MODEL` | 用戶端省略 `model` 時使用 |
| `OMNI_LLAMA_SERVER` | `llama-server` 路徑 |
| `OMNI_LLAMA_N_GPU_LAYERS` | 預設 `-1`（全部層）。`0`＝CPU |
| `OMNI_VLLM` | vLLM 二進位或 Python 直譯器 |
| `OMNI_VLLM_MODULE` | `1`＝`python -m vllm.entrypoints.openai.api_server` |
| `OMNI_IMAGE_URL`／`OMNI_TTS_URL`／`OMNI_STT_URL`／`OMNI_VIDEO_URL` | OpenAI 形狀 worker |
| `OMNI_MAX_CONCURRENT` | 進行中的對話工作（亦種子佇列併發） |
| `OMNI_TIMEOUT_MS` | 預設逾時 |
| `OMNI_SAFE_MODE` | 強制所有金鑰進入 safe |
| `OMNI_SAFE_MAX_TURNS`／`OMNI_SAFE_TIMEOUT_MS` | safe 預設 |
| `OMNI_ALWAYS_APPROVE` | 只對 agent；safe 一律關閉 |
| `OMNI_DEFAULT_CWD`／`OMNI_CWD_ALLOWLIST` | 工作區路徑（空白 cwd＝`<STORAGE_DIR>/workspaces/default`） |

## 限額與代理

| 變數 | 說明 |
|------|------|
| `RATE_LIMIT_WINDOW_MS`／`RATE_LIMIT_MAX`／`RATE_LIMIT_IP_MAX` | 速率限制 |
| `CHAT_BURST_MAX` | 每把金鑰短窗突發 |
| `BLOCK_FAILED_AUTH_*`／`BLOCK_DURATION_MS` | 認證失敗 IP 封鎖 |
| `TRUST_PROXY` | 層數：`0`／`1`／`2`…（`true`→1，`false`→0） |
| `PROXY_IP_SOURCE` | `auto` · `cloudflare` · `nginx` · `x-forwarded-for` · `socket` |
| `QUEUE_BACKEND` | `sqlite`（預設）。`redis`／`kafka` 預留 |

資料庫內的 DDoS 政策在首次儲存後會覆寫環境變數。
