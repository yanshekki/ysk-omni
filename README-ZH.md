# YSK Omni

[![CI](https://github.com/yanshekki/ysk-omni/actions/workflows/ci.yml/badge.svg)](https://github.com/yanshekki/ysk-omni/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/ysk-omni.svg)](https://www.npmjs.com/package/ysk-omni)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org/)
[![Port](https://img.shields.io/badge/port-3850-informational)](#預設-port)

**語言：** [English](./README.md) · 中文

**產品頁：** [ysk.hk/products/ysk-omni](https://ysk.hk/products/ysk-omni) · EN：[ysk.hk/en/products/ysk-omni](https://ysk.hk/en/products/ysk-omni)

本機 Hugging Face 模型，前面放一層可上線的 **OpenAI 相容 HTTP API**。文字走 llama-server / vLLM；圖像、語音、影片走獨立 worker。

| | |
|--|--|
| **npm** | [`ysk-omni`](https://www.npmjs.com/package/ysk-omni) |
| **CLI** | `ysk-omni` · 短名 `ysko` |
| **預設 port** | **`3850`** |
| **NODE_ENV 預設** | **`production`**（本機開發才設 `development`） |
| **產品頁** | [ysk.hk/products/omni](https://ysk.hk/products/omni) |

GCTOAC（`gctoac` :3847）仍是 Grok CLI 產品。YSK Omni **不再** spawn `grok -p`。

**主要能力**

- OpenAI 相容 `POST /v1/chat/completions` + **`POST /v1/responses`**（文字子集）+ Anthropic 相容 **`POST /v1/messages`**
- 已拉取的 GGUF：Load 後由持久 `llama-server` 代理；safetensors 走 `vllm serve` 或 `python -m vllm.entrypoints.openai.api_server`
- 無本機引擎時用 `model=echo`；圖像／TTS／STT 未設 worker 時回 **501** `engine_unconfigured`
- 每把 key 的 **safe** / **agent** 政策 + 全域安全覆寫
- AES-256-GCM 加密 + 完整 chat 審計
- **Admin Panel** — OTP 登入（`ysk-omni admin otp`）、儀表板、對話、金鑰、**Catalog（Pull / Load / Unload）**、文件、審計、用量、**媒體庫**、**對話佇列**、**DDoS 中心**、安全設定、**API 能力**、PM2
- **媒體庫** — 圖像／語音／影片工作列；未接影片 worker 時回可播放的短 H.264 MP4 fixture
- **持久化對話佇列**、**DDoS／防濫用**、控制 CLI（`setup` / `start --pm2` / `doctor` / keys / queue / ddos）

```text
Client (OpenAI SDK / curl / Open WebUI)
        │  Authorization: Bearer omni_live_...
        ▼
   Express Gateway :3850
   · 認證 · 限流 · safe/agent · 佇列 · Admin
        │
        ├─ 文字 GGUF → llama-server（OMNI_LLAMA_SERVER / PATH）
        ├─ 文字 safetensors → vLLM
        ├─ 圖像 → OMNI_IMAGE_URL（OpenAI 形狀，不是 Comfy 原生 /prompt）
        ├─ TTS / STT → OMNI_TTS_URL / OMNI_STT_URL
        └─ 影片 → OMNI_VIDEO_URL 或可播放 MP4 fixture
```

---

## 快速開始

### 1. 前置要求

- **Node.js** ≥ 20  
- 文字 GGUF：`llama-server`（Homebrew `llama.cpp` 或 `OMNI_LLAMA_SERVER`）  
- 文字 safetensors：`vllm` 或 `python -m vllm.entrypoints.openai.api_server`  
- 圖像／語音／影片：另開 OpenAI 形狀 HTTP worker（ComfyUI 原生 API 需要轉接層）

### 2. 安裝並啟動

```bash
npm install -g ysk-omni

ysk-omni doctor   # 檢查 Node / llama-server / vLLM / 已載入引擎 / 環境
ysk-omni setup    # 資料目錄、.env、資料庫、admin API key；會嘗試 npm i -g pm2
ysk-omni start    # http://127.0.0.1:3850
ysk-omni start --pm2
ysk-omni status
```

開啟 Admin（OTP 登入 — **不會**在瀏覽器長期保存 API key）：

```bash
ysk-omni admin otp     # 產生一次性登入碼（5 分鐘、單次使用）
```

```text
http://127.0.0.1:3850/admin/
```

在登入頁貼上 OTP。**每次登入都要新碼**（session 約 12 小時）。

**API** 存取（OpenAI client／腳本）請用 `omni_live_…` key：

```bash
ysk-omni key create    # 明文只顯示一次（預設 role: admin）
ysk-omni key list      # 只顯示 prefix（明文不會存庫）
```

**資料目錄：** `~/.ysk-omni/`  
可用 `OMNI_HOME` 或 `ysk-omni --home /path` 覆蓋。

### 3. 呼叫 API

```bash
export API_KEY=omni_live_...   # setup 或 Admin 取得

curl -s http://127.0.0.1:3850/v1/chat/completions \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "echo",
    "messages": [{"role":"user","content":"用一個字打招呼"}]
  }'
```

---

## 安裝

**支援方式：** 只從 **npm registry** 安裝。

```bash
npm install -g ysk-omni
```

可選輔助腳本（等同上面指令）：

```bash
curl -fsSL https://raw.githubusercontent.com/yanshekki/ysk-omni/main/scripts/install.sh | bash
```

### 專案依賴

```bash
npm install ysk-omni
npx ysk-omni setup
npx ysk-omni start --foreground
```

### 由原始碼開發（貢獻者）

`dist/` **不會** commit 到 git。clone 後請自行 build：

```bash
git clone https://github.com/yanshekki/ysk-omni.git
cd ysk-omni
npm install
npm run build
npm link          # 可選：把 ysk-omni 掛到 PATH
```

> **不要** 使用 `npm install -g github:…`（不支援）。

### 更新

```bash
npm install -g ysk-omni@latest
# 或
ysk-omni update              # 自我更新 + migrate + 排程重啟
ysk-omni update --check      # 只檢查
ysk-omni update --no-restart
```

Git 工作目錄：update 會跑 `npm install --include=dev` 再 `npm run build`（避免 `.env` 的 `NODE_ENV=production` 令 tsc 缺 `@types`）。compile 失敗仍會執行 `ysk-omni migrate`。

亦可在 Admin → **系統狀態** → 一鍵更新。

---

## 預設 port

| URL | 用途 |
|-----|------|
| `http://127.0.0.1:3850/v1` | OpenAI 相容 API base |
| `http://127.0.0.1:3850/admin/` | Admin 控制台 |
| `http://127.0.0.1:3850/health` | 健康檢查 |

更改監聽連接埠（會寫入 `.env`；Admin 儲存時會重啟 runner）：

```bash
# CLI — 寫入 PORT 到 .env 並啟動
ysk-omni --port 4000 start
ysk-omni --port 4000 start --pm2

# 或編輯 .env
PORT=4000
```

**Admin → PM2 → 監聽連接埠** — 預設 **3850**，儲存並重啟。改完請用**新 port** 開啟 Admin（例如 `http://127.0.0.1:4000/admin/`）。

---

## CLI（`ysk-omni` / `ysko`）

全域選項：`--home <path>`、`--port <n>`（預設 **3850**）、`--json`（支援的指令輸出 JSON）。

多數控制指令**直連本機 DB**（與 gateway 同一 `DATABASE_URL`），政策類變更約 **2–5 秒**內被執行中進程重載，**無需重啟**。

### 生命週期與維運

| 指令 | 說明 |
|------|------|
| `ysk-omni setup` | 建目錄、`.env`、migrate、seed admin key，盡量安裝 pm2 |
| `ysk-omni start` / `start -f` / `start --pm2` | 啟動 gateway |
| `ysk-omni stop` / `restart` | 停止／重啟 |
| `ysk-omni status` | Runner、port、proxy、health |
| `ysk-omni doctor` | 環境全面檢查 |
| `ysk-omni logs` / `logs clear` | 日誌 |
| `ysk-omni migrate` / `seed` | DB migrate／seed |
| `ysk-omni update` / `update --check` | 自我更新（含錯誤時仍會執行 `ysk-omni migrate`） |
| `ysk-omni open` / `version` | URL／版本 |

### Admin 登入與面板

| 指令 | 說明 |
|------|------|
| `ysk-omni admin status` / `on` / `off` | 面板開關（**只能用 CLI `on` 重開**） |
| `ysk-omni admin otp` | 一次性 SPA 登入碼（5 分鐘、單次） |
| `ysk-omni admin sessions` | 列出有效 OTP session |
| `ysk-omni admin sessions revoke <id\|all\|all-expired>` | 撤銷 session |

### 金鑰

| 指令 | 說明 |
|------|------|
| `ysk-omni key create` / `list` / `show <id>` | 建立／列表／詳情 |
| `ysk-omni key update <id> --name … --mode safe\|agent --rate-limit n --active on\|off` | 更新 |
| `ysk-omni key revoke <id>` / `activate <id>` | 撤銷／重新啟用 |

### 安全設定（Safety）

| 指令 | 說明 |
|------|------|
| `ysk-omni settings` / `settings get` | 顯示全域 safe、tools、turns、timeout、model |
| `ysk-omni settings set --global-safe on\|off --tools none\|readonly --max-turns n --timeout-ms n --default-model …` | 寫入 |
| `ysk-omni settings preset local\|prod\|code\|read\|chat\|long` | 套用建議預設並儲存 |

### 對話佇列

| 指令 | 說明 |
|------|------|
| `ysk-omni queue` / `queue stats` | 深度與各狀態計數 |
| `ysk-omni queue policy get\|set\|preset relaxed\|balanced\|strict` | 政策 |
| `ysk-omni queue pause` / `resume` / `drain` / `undrain` | 暫停／恢復／排空 |
| `ysk-omni queue jobs` / `queue job <id>` | 列表／詳情 |
| `ysk-omni queue cancel\|requeue\|priority <id> …` | 作業操作 |
| `ysk-omni queue purge-dead --yes` | 清死信／失敗／取消 |

### DDoS／黑名單

| 指令 | 說明 |
|------|------|
| `ysk-omni ddos` | 政策摘要 + 黑名單 |
| `ysk-omni ddos policy get\|set\|preset\|reset` | 政策 |
| `ysk-omni ddos ban <ip> [--ttl 3600] [--reason …]` | 封鎖 |
| `ysk-omni ddos unban <ip>` / `blacklist` | 解封／列表 |

### 觀測與資料

| 指令 | 說明 |
|------|------|
| `ysk-omni stats` | 儀表板式摘要 |
| `ysk-omni grok inspect` | 本機 Grok Build 環境快照（與推理無關） |
| `ysk-omni grok sessions` | 閘道殘留 session 表（不再 resume `grok -p`） |
| `ysk-omni models` | 本機 registry + `echo` |

| `ysk-omni docs list\|show\|delete` | 文件（delete 需 `--yes`） |
| `ysk-omni chats list\|show` | API 對話請求（meta） |
| `ysk-omni conversations list\|delete` | Playground 線程 |
| `ysk-omni audit list [--action …]` | 審計日誌 |

```bash
ysk-omni --home ~/.ysk-omni-alt setup
ysk-omni --port 3850 start
ysk-omni status
ysk-omni admin otp
ysk-omni settings preset prod
ysk-omni queue pause
ysk-omni ddos ban 203.0.113.10 --ttl 3600 --reason abuse
ysk-omni stats --json
ysk-omni logs clear
```

---

## 功能一覽

| 功能 | 說明 |
|------|------|
| OpenAI API | `POST /v1/chat/completions`、`POST /v1/responses`（文字）、`GET /v1/models` |
| Anthropic API | `POST /v1/messages`（Bearer 或 `x-api-key`） |
| Thinking | `reasoning_content` + Grok `thought` + `grok.*` |
| 文件 | 類型嗅探上傳、加密儲存（DB 或檔案系統）、下載 |
| Safe / Agent | 每 key 政策；可全域強制 safe |
| 加密 | AES-256-GCM 加密 prompt、response、檔案 |
| 對話歷史 | 多輪對話、上下文模式（full / summary / recent） |
| Admin Panel | OTP session 登入；**分 tab** 頁面（佇列／媒體／系統／PM2／DDoS／API 能力）；精簡 EN／繁中文案 |
| 媒體庫 | 工作室（生成／編輯／**1–15 秒影片**／配音）、資產與工作、多格式預覽 lightbox（`blob:` CSP 安全）。沙箱沒有 `output.png` 時，會從今次 Imagine session 的 `images/` 收圖 |
| 對話佇列 | 持久化 SQLite 工作、公平輪詢、暫停／排空、死信、Idempotency-Key、`QUEUE_BACKEND`、離線串流 fallback |
| DDoS 中心 | 即時連線、黑名單、自動封鎖、可配置策略與預設檔（分 tab） |
| 反向代理 | 信任層數 + CF / nginx / X-Forwarded-For 真實 IP |
| 認證 | API key：**scrypt** hash（舊 SHA-256 登入時自動升級）；Admin SPA：OTP → session |
| CLI | 生命週期、preferred runner、日誌、自我更新、`admin otp`、`grok inspect`、`grok sessions` |
| 運維 | SQLite、PM2、日誌自動裁剪（>5 MB）、GitHub Actions CI |

---

## API

受保護路由需要：

```http
Authorization: Bearer omni_live_...
```

### Chat（stream）

佇列啟用時（預設），stream 可能先出現 `gog.queue` 排隊事件，再是一般 OpenAI chunk。

```bash
curl -sN http://127.0.0.1:3850/v1/chat/completions \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: my-client-req-001" \
  -d '{
    "model": "grok-4.6",
    "stream": true,
    "include_reasoning": true,
    "messages": [{"role":"user","content":"數到 3"}]
  }'
```

`Idempotency-Key` 可選（依 API key 隔離）。同一 key 在 job 進行中可安全重試。

### OpenAI SDK

```ts
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: 'http://127.0.0.1:3850/v1',
});

const res = await client.chat.completions.create({
  model: 'grok-4.6',
  messages: [{ role: 'user', content: 'Hello' }],
});
console.log(res.choices[0].message.content);
```

### Images（OpenAI 形狀）

`POST /v1/images/generations` 與 `POST /v1/images/edits` 回傳官方 Images 物件。需要 **`imagesApi` + `tools`**，以及 **agent**（或管理員）金鑰；safe 金鑰會得 **403**。

```bash
curl -s http://127.0.0.1:3850/v1/images/generations \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "紅色方塊",
    "n": 1,
    "aspect_ratio": "16:9",
    "response_format": "b64_json"
  }'
```

```json
{
  "created": 1710000000,
  "data": [{ "b64_json": "iVBOR…" }],
  "grok": { "provider": "grok-tools", "asset_ids": ["uuid"] }
}
```

| 欄位／主題 | 行為 |
|------------|------|
| `response_format` | `b64_json`（預設，與 GPT image 模型相同）或 `url` |
| `size` | OpenAI 像素（`1024x1024` 等）**或** Grok 比例（`16:9`） |
| `aspect_ratio` | Grok Imagine（`1:1`、`16:9` 等）——優先於像素尺寸 |
| `n` | 1–4；Grok 無批次生成，Gateway 或會循環。`n=1` 只交一張 |
| `data[].url` | Gateway 本機 `/v1/media/assets/:id/content`（同一把 API 金鑰），不是 OpenAI CDN |
| `grok` | Gateway 擴充（`provider`、`asset_ids`）。OpenAI SDK 會忽略未知欄位 |

**生成如何真正收到檔案（v1.7.4+）：** Grok Imagine 永遠寫到  
`~/.grok/sessions/<encodeURIComponent(sandbox-cwd)>/<session-uuid>/images/`  
（例如 `1.jpg`）。media-run 沙箱**沒有 bash**，agent 無法自行 `cp` 到 `output.png`。Gateway 只把**今次 run 對應 session** 最新一張圖，在 `image_gen` 成功時（以及 Grok 結束後）複製到沙箱 `output.jpg|png|webp`。

收圖順序：

1. 沙箱根目錄 `output.png` / `output.jpg` / `output.webp` / `output.jpeg`
2. 遞歸掃描沙箱（realpath；不會跟隨 symlink 離開今次 run）
3. 只收今次 run 的 Grok session `images/`——**不會**掃描整個 `~/.grok/sessions`

優先最新一張。忽略 `input.png`、`mask.png`、`frame.png`、`ref-*.png`。只有完全找不到圖像時才會回 **502** `no_image_in_sandbox`——**不是** `imagesApi` 或 API 金鑰問題。若 Grok 其後燒盡 `maxTurns` 並以 exit `1` 結束，Gateway 仍會交已生成的圖（不會因為後續 `use_tool` 失敗而丟棄成功的 `image_gen`）。`n=1` 收到第一張圖後會停止 CLI，避免 agent 繼續呼叫 `use_tool`。編輯使用 `--tools image_edit` + `input.png`。影片收檔同樣可取今次 session 的 `videos/`／`images/` 以及沙箱 `output.mp4`。

```ts
const img = await client.images.generate({
  model: 'grok-4.6',
  prompt: '紅色方塊',
  n: 1,
  response_format: 'b64_json',
});
const b64 = img.data[0].b64_json;
```

### Chat body 擴充欄位

```json
{
  "model": "grok-4.6",
  "messages": [{ "role": "user", "content": "Hello" }],
  "stream": false,
  "include_reasoning": true,
  "cwd": "/allowed/workspace",
  "session_id": "optional-session",
  "document_ids": ["uuid"]
}
```

| 欄位 | 說明 |
|------|------|
| `include_reasoning` | 預設 `true`；Grok `thought` → `reasoning_content` |
| `cwd` | 僅 **agent**（allowlist 內）；**safe** 強制 sandbox |
| `session_id` | 按 API key 映射成 Grok UUID：第一次 `-s`，之後 `--resume`（Grok 1.0+） |
| `resume` | Grok session UUID（`--resume`）。Admin playground Resume 欄。 |
| `fork_session` | 由該 session 分支出去。 |
| `reasoning_effort` / `effort` | Grok `--reasoning-effort`（`none`…`max`）。閘：`reasoningEffort`。 |
| `experimental_memory` / `no_memory` | Grok memory。閘：`memory`。 |
| `no_plan` | 關閉 plan mode。閘：`planMode`。 |
| `permission_mode` | `default` / `acceptEdits` / `auto` / `dontAsk` / `bypassPermissions` / `plan`。閘：`permissionMode`。 |
| `document_ids` | 注入已解密文件內容 |
| `tools` / `functions` | **`tools`** 開啟時映射到 Grok（否則 400） |

### Thinking 對應

| Grok 事件 | OpenAI / DeepSeek 欄位 | 額外 |
|-----------|------------------------|------|
| `thought` | `reasoning_content` / `delta.reasoning_content` | `thought` 別名 |
| `text` | `content` / `delta.content` | — |
| `tool_call` / `tool_call_update` / `plan` | chunk 上的 `grok_event` | OpenAI SDK 會忽略未知欄位 |
| `usage` / `cost` | `usage`（Grok 有回 cache／cost 就帶上） | — |
| `end` | `finish_reason` | `grok.sessionId`、`grok.stopReason` |

### 持久化對話佇列

佇列政策**啟用**時（預設），每個 `POST /v1/chat/completions` 會寫入 `ChatJob` 表，再由進程內 worker 以租約／心跳／開機回收語意消費。

| 主題 | 行為 |
|------|------|
| **語意** | At-least-once；claim 時 visibility timeout（lease）；重啟回收 in-flight |
| **公平** | 預設依 API key **加權輪詢**，或全域 FIFO；每 key + 全域併發上限 |
| **Stream** | 連線保持；先收到 `object: "gog.queue"` 排隊事件，再是一般 OpenAI chunk |
| **背壓** | `maxQueueDepth` / `maxQueueDepthPerKey` → **429** `queue_full`；drain／停用 → **503** `queue_draining`；等待逾時 → **504**；取消 → **409** |
| **冪等** | 可選 `Idempotency-Key`（依 API key 隔離）。進行中重用；成功回 already-done；失敗／死信／取消後可重試 |
| **後端** | `QUEUE_BACKEND=sqlite`（預設、可上線）。`redis`／`kafka` 預留給多機（尚未實作 — 選用會啟動失敗） |
| **Payload** | Job 內容以 AES-GCM 加密存於 `ChatJob` |
| **Admin** | **佇列**頁：KPI、暫停／排空、政策、狀態篩選（含死信／`active`）、取消／重新入隊／優先級／清理已完成（24h+） |

Stream 預覽：

```text
data: {"object":"gog.queue","status":"queued","job_id":"…","position":2}
data: {"object":"gog.queue","status":"queued","job_id":"…","position":1}
data: {"id":"chatcmpl-…","object":"chat.completion.chunk","grok_event":{"type":"tool_call",…},…}
```

Admin 操作（OTP **session** token 或 admin API key）：

```http
GET  /admin/api/queue/stats
GET  /admin/api/queue/jobs?status=dead
GET  /admin/api/queue/jobs?status=active
POST /admin/api/queue/pause | /resume | /drain | /undrain
PUT  /admin/api/queue/policy
POST /admin/api/queue/jobs/:id/cancel | /requeue
POST /admin/api/queue/jobs/:id/priority   # body: {"priority":0-1000}
POST /admin/api/queue/purge-dead
```

### 端點

| Method | Path | 說明 |
|--------|------|------|
| GET | `/health` | 存活 |
| GET | `/ready` | DB + Grok 檢查 |
| GET | `/v1/models` | 此金鑰可用的模型（文字／圖像／影片／語音／轉錄；受金鑰清單限制） |
| POST | `/v1/chat/completions` | OpenAI Chat（佇列；可選 `Idempotency-Key`） |
| POST | `/v1/responses` | OpenAI Responses 文字子集 |
| POST | `/v1/messages` | Anthropic Messages（Bearer 或 `x-api-key`） |
| POST | `/v1/images/generations` | OpenAI Images 生成（`b64_json`／`url`；沙箱為空時會收今次 session `images/`） |
| POST | `/v1/images/edits` | OpenAI Images 編輯（multipart `image` + 可選 `mask`） |
| GET | `/v1/media/assets/:id` | 已存資產中繼資料 |
| GET | `/v1/media/assets/:id/content` | 已存資產內容（同一把 API 金鑰） |
| POST | `/v1/videos` | Grok 影片 job（`seconds` 1–15；`voices[]` → `reference_to_video`） |
| GET | `/v1/videos/:id` | 查影片 job |
| GET | `/admin/api/grok/inspect` | 本機 `grok inspect --json` 快照 |
| GET/DELETE | `/admin/api/grok/sessions`… | 列出／刪除 `~/.grok/sessions` |
| POST | `/v1/documents` | 上傳（欄位 `file`） |
| GET/DELETE | `/v1/documents`… | 列表 / 軟刪除 |
| POST/GET/DELETE | `/v1/api-keys`… | Admin 管理 key |
| POST | `/admin/api/auth/login` | OTP → session token（公開，有限流） |
| POST | `/admin/api/auth/logout` | 撤銷 session |
| * | `/admin/api/*` | Admin JSON API（OTP session **或** `role=admin` API key） |

---

## Safe / Agent 政策

| Mode | 適用 | 行為 |
|------|------|------|
| **`safe`**（client 預設） | 對外應用 | Sandbox cwd、不 always-approve、限制 tools、較短 timeout |
| **`agent`** | 受信 / 內網 | 完整 CLI tools（可 always-approve）；cwd 仍受 allowlist 限制 |

- 全域強制 safe：`GROK_SAFE_MODE=true` 或 Admin → **安全設定**  
- Client **無法** 靠 request body 提權  
- **不要** 將 `agent` key 暴露於公網  

---

## Admin Panel

```text
http://127.0.0.1:3850/admin/
```

### 登入（OTP）

Admin **SPA 不會接受長期 API key**。請產生一次性登入碼：

```bash
ysk-omni admin otp          # 別名：ysk-omni admin login-code
```

- 有效 **5 分鐘**、**單次使用**
- Session token 存於 `sessionStorage`（約 **12 小時**）
- 登出／逾時／換瀏覽器後需重新取碼

Admin **JSON API**（`/admin/api/*`）可用：

- `Authorization: Bearer gog_sess_…`（OTP session），或  
- `Authorization: Bearer omni_live_…`（`role=admin`）

| 頁面 | 功能 |
|------|------|
| **儀表板** | 24h KPI、成功率、**佇列深度**、防護摘要、模型用量、運行狀態（port／加密） |
| **對話** | 多輪 playground：effort、resume/fork UUID、memory／no-plan／permission、tool chip + cost、歷史、上下文模式、附件（佇列啟用時同樣先入隊） |
| **對話記錄** | 搜尋／篩選／分頁；**完整解密** prompt／reasoning／response |
| **API 金鑰** | 建立／編輯 mode／role／限流／IP 白名單；撤銷 |
| **文件** | 搜尋／篩選／分頁；預覽、下載、刪除；DB 與檔案系統儲存 |
| **審計日誌** | 搜尋／篩選／分頁；可讀動作標籤 |
| **用量與防護** | 24h 統計、按模型／按金鑰分 tab、限流摘要 |
| **媒體庫** | **分 tab：** 工作室 · 資產 · 工作。KPI 條。工作室：生成／編輯／**圖生影片（1–15 秒）**／**配音**（`ara` `eve` `leo` `rex` `sal` `mio` → `reference_to_video`）。素材庫選取 + 拖放。預覽 lightbox |
| **佇列** | **分 tab：** 總覽 · 工作列表 · 政策。KPI 條（自動 soft-refresh）。暫停／排空、死信篩選、取消／重新入隊／優先級／清理、併發與公平預設 |
| **DDoS 中心** | **分 tab：** 政策 · 流量 · 黑名單 · 事件。KPI 條。即時連線、最近請求、自動封鎖事件、熱門 IP、**運行時防護策略**（寬鬆／均衡／嚴格／自訂）、反向代理 IP |
| **安全設定** | 全域 safe、工具／turns／timeout、預設模型、精簡預設方案、關閉 Admin 面板（只能用 CLI 重開） |
| **API 能力** | **分 tab：** 協議 · 媒體 · 能力 · 模擬。KPI 啟用計數。預設：開放／鎖定／開發 |
| **PM2** | **分 tab：** 運行方式 · 連接埠 · 設定 · 日誌。KPI 進程條。Runner 切換（ysk-omni ↔ PM2）、監聽 port（預設 3850）、設定、清除日誌 + 自動裁剪 |
| **系統狀態** | **分 tab：** 軟件 · 套件 · 環境 · **Grok sessions**。Software tab 有 **Grok inspect** 卡（version／channel／models／skills／MCP）。Sessions tab 列出 `~/.grok/sessions`（搜尋 + 刪除）。一鍵更新並重啟 |
| **支援** | 捐助／GitHub Sponsors／Linktree／加密地址、YSK Limited 服務、**email@ysk.hk** |

Admin 共用 UX：分段 tab + 頂部 KPI 卡片、精簡正式 EN／繁中文案、table 操作按鈕置中；僅需運維刷新的頁面保留右上角 **重新整理**（儀表板／用量／DDoS／PM2）。

### DDoS／防濫用（運行時）

策略存於資料庫（Admin → DDoS）。環境變數只是**初始預設**；儲存後以 Admin 為準。可用「重設為環境預設」還原。

| 能力 | 說明 |
|------|------|
| 限流 | 視窗、每 key 上限、每 IP 上限、chat burst |
| 自動封鎖 | 失敗認證、重複 429、並發洪水、請求速率、累犯升級 |
| 預設檔 | 寬鬆／均衡／嚴格／自訂（自動判定） |
| 白名單 | 永不被自動封鎖（例如 `127.0.0.1`） |
| 手動封鎖 | TTL 或永久 |

### 反向代理／CDN（客戶端 IP）

經 **nginx** 或 **Cloudflare** 時，請設定信任層數，令封鎖、限流、審計使用**真實用戶 IP**：

| 設定 | 常見值 |
|------|--------|
| 信任代理層數 | `1` = nginx 或 CF→應用；`2` = CF→nginx→應用；`0` = 僅直連 |
| IP 來源 | `auto`（建議）、`cloudflare`、`nginx`、`x-forwarded-for`、`socket` |

在 **Admin → DDoS → 反向代理** 設定，或 env：

```env
TRUST_PROXY=1
PROXY_IP_SOURCE=auto
```

nginx 示例：

```nginx
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
```

---

## 環境變數

詳見 [`.env.example`](./.env.example)。`ysk-omni setup` 新建時預設 **`NODE_ENV=production`**。

| 變數 | 說明 |
|------|------|
| `NODE_ENV` | 預設 **`production`**。本機開發才設 `development`（美化日誌） |
| `PORT` | 預設 **`3850`**（亦可在 Admin → PM2 修改） |
| `HOST` | 監聽位址（預設 `0.0.0.0`） |
| `DATABASE_URL` | SQLite，例如 `file:../data/gateway.db`（相對 `prisma/`） |
| `ENCRYPTION_KEY` | 32-byte key：`openssl rand -base64 32` |
| `ADMIN_BOOTSTRAP_KEY` | 可選；首次 setup 用此字串作 admin key |
| `GROK_BIN` | 預設 `grok` |
| `GROK_DEFAULT_MODEL` | 預設模型（`grok-4.6`） |
| `GROK_DEFAULT_CWD` / `GROK_CWD_ALLOWLIST` | Agent 工作目錄（空白預設為 `<STORAGE_DIR>/workspaces/default`，不會使用 gateway 原始碼目錄） |
| `GROK_TIMEOUT_MS` | Agent 預設 timeout（ms） |
| `GROK_ALWAYS_APPROVE` | 只對 agent；safe 一律關閉 |
| `GROK_SAFE_MODE` | 強制全部 key 用 safe |
| `GROK_SAFE_MAX_TURNS` / `GROK_SAFE_TIMEOUT_MS` | Safe 模式預設（亦可在 Admin → 安全設定改） |
| `GROK_MAX_CONCURRENT` | 最多並行 Grok 進程（亦作佇列全域併發預設種子） |
| `QUEUE_BACKEND` | 對話佇列後端：**`sqlite`**（預設）。`redis`／`kafka` 預留（尚未實作） |
| `ADMIN_PANEL_ENABLED` | 硬關 `/admin`（env，需重啟）。運行時：`ysk-omni admin on\|off` |
| `PM2_ADMIN_ENABLED` | 允許 Admin 控制 PM2 |
| `CORS_ORIGINS` | 逗號分隔 origins（改 `PORT` 時請一併更新） |
| `RATE_LIMIT_*` / `CHAT_BURST_MAX` / `BLOCK_*` | 限流／自動認證初始值（DDoS 策略儲存後會覆寫） |
| `TRUST_PROXY` | 代理層數：`0`／`1`／`2`…（`true`→1，`false`→0） |
| `PROXY_IP_SOURCE` | `auto` \| `cloudflare` \| `nginx` \| `x-forwarded-for` \| `socket` |
| `OMNI_HOME` | CLI 資料目錄（預設 `~/.ysk-omni`） |
| `STORAGE_DIR` | 加密大檔 + sandbox |
| `UPLOAD_MAX_BYTES` / `DOCUMENT_DB_MAX_BYTES` | 上傳上限／DB 與檔案系統分界 |
| `BODY_LIMIT` | JSON body 大小上限（預設 `1mb`） |
| `LOG_LEVEL` | `fatal` \| `error` \| `warn` \| `info` \| `debug` \| `trace` |

**請備份 `ENCRYPTION_KEY`。** 遺失後歷史資料無法解密。

運行時佇列政策（併發、公平、暫停／排空、深度）存於 DB（`queue_policy`），在 **Admin → 佇列** 編輯 — 不只靠 env。

---

## 生產環境

### 建議：CLI

```bash
ysk-omni setup
ysk-omni start              # detached ysk-omni
# 或
ysk-omni start --pm2        # 使用 PM2
ysk-omni status
```

`ysk-omni restart` 會跟從上次的 **preferred runner**（ysk-omni 或 PM2）。

### PM2 ecosystem

```bash
npm run build
pm2 start ecosystem.config.cjs
pm2 logs ysk-omni
```

### 日誌

- 檔案位於 `logs/`（或資料目錄）：`pm2-error.log`、`pm2-out.log`、`ysk-omni.*.log`
- **Admin → PM2 → 清除日誌**，或 `ysk-omni logs clear`
- **自動裁剪：** 每次讀取日誌時，單檔 **> 5 MB** 只保留最後約 512 KB

### 避免 EADDRINUSE

同一 port 只應有一個 runner。若 ysk-omni 與 PM2 搶 port：

```bash
ysk-omni stop
ysk-omni start          # 或：ysk-omni start --pm2
ysk-omni doctor         # 會標示 mixed runners
```

---

## 專案結構

```text
src/                  TypeScript 原始碼（app、routes、services、cli）
src/services/queue/   持久化對話佇列（政策、ChatJob、worker、backend 介面）
public/admin/         Admin SPA（OTP 登入 + 各頁）
prisma/               Schema、migrations（含 chat_jobs）、seed
dist/                 編譯後 JS（gitignore；npm run build / prepublishOnly 產生）
scripts/              prepare、install.sh
tests/                Vitest（單元 + 整合）
```

---

## 腳本

```bash
npm run dev          # 開發
npm run build        # prisma generate + tsc
npm start            # node dist/server.js
npm test             # 單元 + 整合測試
npm run db:setup     # migrate + seed
ysk-omni setup|start|status|stop|doctor|logs|update
```

### 發佈到 npm（維護者）

`prepublishOnly` 會跑 `npm run build`，tarball 一定包含 `dist/`。

```bash
npm login
npm publish --access public --otp=<2FA六位碼>
```

---

## 安全注意

- API key 存 **scrypt** hash（`scrypt$salt$hash`）；舊 **SHA-256** 列在驗證時會自動升級  
- Chat prompt/response、文件與 **佇列 job payload** 以 **AES-256-GCM** 靜態加密  
- 對外 client 請用 **`safe`** mode  
- **Admin SPA：** 只用 OTP（`ysk-omni admin otp`）→ 短時 session 存 `sessionStorage`（XSS = 在 session 有效期內完全接管）  
- **客戶端 IP：** 只有 **可信代理列表** 內的 TCP peer（預設 `127.0.0.1`）才會採信 `CF-Connecting-IP`／`X-Real-IP`／`XFF`。直連客戶**無法偽造 header** 繞過限流或封鎖他人。遠端 nginx 請把其 IP 加入 Admin → DDoS → 可信代理。  
- Admin 只應在本機／VPN 開啟  
- 不要 commit `.env`，不要外洩 admin key／OTP  
- 可完全關閉 Admin：`ysk-omni admin off`（只能用 `ysk-omni admin on` 重開）  
- 一鍵更新／PM2／改 port 需 admin（視 admin key／OTP session 為 root）

---

## 👤 作者

**Ki (yanshekki)** — 全端工程師、量化交易者，[YSK Limited](https://ysk.hk/) 創辦人。

🌐 [linktr.ee/yanshekki](https://linktr.ee/yanshekki) · 📄 [產品頁](https://ysk.hk/products/ysk-omni) · 🏢 [ysk.hk](https://ysk.hk/)

### ☕ 支援／贊助

若 YSK Omni 對你有幫助，歡迎贊助開發。

| 網絡 | 地址 |
| --- | --- |
| **EVM** (ETH/BSC/AVAX) | `yanshekki.eth` |
| **NEAR** | `yanshekki.near` |
| **ADA** (Cardano) | `$yanshekki` |

---

## 授權

MIT — 見 [LICENSE](./LICENSE)。

## 免責聲明

本 gateway 會 spawn 本機推論行程（llama-server / vLLM）並轉發至你設定的圖像／語音／影片 worker。認證、暴露範圍、key 模式由你負責。作者不對濫用或資料損失負責。
