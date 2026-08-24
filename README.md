# Grok CLI → OpenAI-Compatible Gateway

[![CI](https://github.com/yanshekki/Grok-Cli-to-OpenAI-compatible/actions/workflows/ci.yml/badge.svg)](https://github.com/yanshekki/Grok-Cli-to-OpenAI-compatible/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/grok-cli-to-openai-compatible.svg)](https://www.npmjs.com/package/grok-cli-to-openai-compatible)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org/)
[![Port](https://img.shields.io/badge/port-3847-informational)](#default-port)

**Languages:** English · [中文](./README-ZH.md)

**Product page:** [ysk.hk/products/gctoac](https://ysk.hk/products/gctoac) · EN: [ysk.hk/en/products/gctoac](https://ysk.hk/en/products/gctoac)

Production OpenAI-compatible HTTP gateway for local **[Grok CLI](https://x.ai)** (`grok -p`).

| | |
|--|--|
| **npm** | [`grok-cli-to-openai-compatible`](https://www.npmjs.com/package/grok-cli-to-openai-compatible) |
| **CLI** | `gctoac` · alias `gcoa` |
| **Default port** | **`3847`** |
| **NODE_ENV default** | **`production`** (set `development` only for local coding) |

**What you get**

- OpenAI-compatible `POST /v1/chat/completions` + **`POST /v1/responses`** (text subset) + Anthropic-compatible **`POST /v1/messages`** (stream + non-stream)
- Thinking / `reasoning_content` (DeepSeek-style + Grok `thought`)
- Per-key **safe** / **agent** policy + global safety overrides
- AES-256-GCM encryption + full chat audit
- **Admin Panel** — OTP login (`gctoac admin otp`), dashboard, chats, keys, documents, audit, usage, **media library**, **chat queue**, **DDoS center**, Safety settings, **API features**, PM2, system update — pages use a consistent **KPI + segmented tabs** layout
- **Media library** — studio (generate / edit / **image-to-video 1–15s** / **reference-to-video + preset voices**), assets & jobs tabs, browser preview lightbox (image / video / audio / PDF / text)
- **Durable chat queue** — every conversation is enqueued with leases, then consumed by an in-process worker; Admin pause / drain / cancel / DLQ; optional `Idempotency-Key`; offline stream collect when no live Response
- **DDoS / abuse protection** — configurable rate limits, multi-rule auto-ban, reverse-proxy client IP (nginx / Cloudflare)
- Control CLI: lifecycle + **settings / api features / queue / ddos / keys / docs / chats / stats / models / admin sessions / grok inspect / grok sessions**
- **API features** (Admin tabs + `gctoac api features`): protocol + Grok CLI capability gates (tools, vision, json-schema, effort, …)

### Capability parity (Grok CLI–backed “100%”)

| Capability | Chat | Responses | Anthropic Messages | Admin switch |
|------------|:----:|:---------:|:------------------:|--------------|
| Text + stream | ✅ | ✅ | ✅ | protocol flags |
| Vision / image parts | ✅ | ✅ | ✅ | `vision` |
| **Images** `/v1/images/generations` + `/edits` | ✅ OpenAI-shaped (`b64_json` / `url`) | — | — | `imagesApi` + `tools` + agent key |
| **Files** `/v1/files` (docs alias) | ✅ | — | — | `filesOpenAiAlias` |
| **Videos** `/v1/videos` | ✅ Grok `image_to_video` (1–15s) / `reference_to_video` + voices | — | — | `videoApi` |
| **Audio** `/v1/audio/speech` + `/transcriptions` | ✅ mock or 503 | — | — | `audioApi` + provider env |
| Tools (allowlist → Grok) | ✅ | ✅ | ✅ (incl. `tool_use`/`tool_result`) | `tools` |
| tool_calls in response | ✅* | text+meta | ✅ `tool_use` blocks | `tools` |
| Structured JSON schema | ✅ | ✅ | via tools/prompt | `structuredOutput` |
| Reasoning effort | ✅ | ✅ | thinking→effort | `reasoningEffort` |
| Session resume / fork | ✅ | — | — | `sessionResume` |
| Assistants-lite | — | — | — | `assistantsEmulation` |
| Usage estimate | ✅ | ✅ | ✅ | `usageEstimate` |
| Temperature / sampling | accept† | accept† | accept† | `strictSampling` |

\* When Grok stream emits tool events (often server-side tools run without client-visible tool_calls).  
† Grok CLI has no sampling knobs — ignored unless `strictSampling` rejects them.

**Not claimable as cloud OpenAI/Anthropic parity:** real embeddings, realtime audio, hosted file search indexes, exact provider-side tool runtime — those need backends Grok CLI does not expose.

```text
Client (OpenAI SDK / curl / Open WebUI)
        │  Authorization: Bearer gk_live_...
        ▼
   Express Gateway :3847
   · Auth · rate limit · safe/agent
   · Enqueue ChatJob (AES-GCM payload) · SSE holds with gog.queue
   · Proxy-aware client IP · auto-ban
   · Encrypted audit · Admin /admin (Queue control)
   · gctoac start | stop | status | update
        │
        ▼
   In-process worker (lease / fair RR / concurrency)
        │
        ▼
   grok -p …  (local Grok CLI)
```

---

## Quick start

### 1. Prerequisites

- **Node.js** ≥ 20  
- **Grok CLI** (Grok Build **1.0+**) installed and logged in:

```bash
curl -fsSL https://x.ai/cli/install.sh | bash
grok login
grok --version
```

### 2. Install & run

```bash
npm install -g grok-cli-to-openai-compatible

gctoac doctor   # Node / Grok / env / runner / proxy checks
gctoac setup    # data home, .env (NODE_ENV=production), DB, admin API key
gctoac start    # http://127.0.0.1:3847
gctoac status   # runner, port, proxy, health
```

Open Admin (OTP login — **not** a long-lived API key in the browser):

```bash
gctoac admin otp     # prints a one-time code (5 min, single use)
```

```text
http://127.0.0.1:3847/admin/
```

Paste the code on the login page. A **new code is required for every login** (session ~12h).

For **API** access (OpenAI clients / scripts), use a `gk_live_…` key:

```bash
gctoac key create    # prints plaintext once (default role: admin)
gctoac key list      # prefixes only (plaintext is never stored)
```

**Data directory:** `~/.gctoac/`  
Override with `GCTOAC_HOME` or `gctoac --home /path`.

### 3. Call the API

```bash
export API_KEY=gk_live_...   # from setup or Admin

curl -s http://127.0.0.1:3847/v1/chat/completions \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "grok-4.6",
    "messages": [{"role":"user","content":"Say hi in one word"}]
  }'
```

---

## Install

**Supported path:** install from the **npm registry** only.

```bash
npm install -g grok-cli-to-openai-compatible
```

Optional helper:

```bash
curl -fsSL https://raw.githubusercontent.com/yanshekki/Grok-Cli-to-OpenAI-compatible/main/scripts/install.sh | bash
```

### Project dependency

```bash
npm install grok-cli-to-openai-compatible
npx gctoac setup
npx gctoac start --foreground
```

### Develop from source (contributors)

`dist/` is **not** committed. Build after clone:

```bash
git clone https://github.com/yanshekki/Grok-Cli-to-OpenAI-compatible.git
cd Grok-Cli-to-OpenAI-compatible
npm install
npm run build
npm link          # optional: put gctoac on PATH
```

> Do **not** use `npm install -g github:…` — unsupported.

### Update

```bash
npm install -g grok-cli-to-openai-compatible@latest
# or
gctoac update              # self-update + migrate + schedule restart
gctoac update --check      # check only
gctoac update --no-restart
```

Git checkouts: update runs `npm install --include=dev` then `npm run build` (so `NODE_ENV=production` in `.env` does not strip TypeScript types). Always runs `gctoac migrate`, including if compile fails.

Or Admin → **System** → one-click update.

---

## Default port

| URL | Purpose |
|-----|---------|
| `http://127.0.0.1:3847/v1` | OpenAI-compatible API base |
| `http://127.0.0.1:3847/admin/` | Admin Panel |
| `http://127.0.0.1:3847/health` | Health check |

Change the listen port (persists to `.env`, restarts runner when done from Admin):

```bash
# CLI — writes PORT to .env and starts
gctoac --port 4000 start
gctoac --port 4000 start --pm2

# or edit .env
PORT=4000
```

**Admin → PM2 → Listen port** — default **3847**, save & restart. After change, open Admin on the **new** port (e.g. `http://127.0.0.1:4000/admin/`).

---

## CLI (`gctoac` / `gcoa`)

Global options: `--home <path>`, `--port <n>` (default **3847**), `--json` (machine-readable where supported).

Most control commands talk to the **local DB** (same `DATABASE_URL` as the gateway). Policy writes are picked up by a running process within **~2–5s** — **no restart required**.

### Lifecycle & ops

| Command | Description |
|---------|-------------|
| `gctoac setup` | Create dirs, `.env`, migrate DB, seed admin key |
| `gctoac start` / `start -f` / `start --pm2` | Start gateway |
| `gctoac stop` / `restart` | Stop / restart |
| `gctoac status` | Runner, port, proxy, health |
| `gctoac doctor` | Full env check |
| `gctoac logs` / `logs clear` | Logs |
| `gctoac migrate` / `seed` | DB migrate / seed |
| `gctoac update` / `update --check` | Self-update (always runs `gctoac migrate`, including on error) |
| `gctoac open` / `version` | URLs / version |

### Admin login & panel

| Command | Description |
|---------|-------------|
| `gctoac admin status` / `on` / `off` | Panel switch (**only CLI `on` re-enables**) |
| `gctoac admin otp` | One-time SPA login code (5 min, single use) |
| `gctoac admin sessions` | List active OTP sessions |
| `gctoac admin sessions revoke <id\|all\|all-expired>` | Revoke sessions |

### API keys

| Command | Description |
|---------|-------------|
| `gctoac key create` / `list` / `show <id>` | Create / list / show |
| `gctoac key update <id> --name … --mode safe\|agent --rate-limit n --active on\|off` | Update |
| `gctoac key revoke <id>` / `activate <id>` | Revoke / re-enable |

### Safety settings

| Command | Description |
|---------|-------------|
| `gctoac settings` / `settings get` | Global safe, tools, turns, timeout, model |
| `gctoac settings set --global-safe on\|off --tools none\|readonly --max-turns n --timeout-ms n --default-model …` | Write |
| `gctoac settings preset local\|prod\|code\|read\|chat\|long` | Apply preset and save |

### Chat queue

| Command | Description |
|---------|-------------|
| `gctoac queue` / `queue stats` | Depth and status counts |
| `gctoac queue policy get\|set\|preset relaxed\|balanced\|strict` | Policy |
| `gctoac queue pause` / `resume` / `drain` / `undrain` | Control plane |
| `gctoac queue jobs` / `queue job <id>` | List / detail |
| `gctoac queue cancel\|requeue\|priority <id> …` | Job ops |
| `gctoac queue purge-dead --yes` | Purge terminal jobs |

### DDoS / blacklist

| Command | Description |
|---------|-------------|
| `gctoac ddos` | Policy summary + blacklist |
| `gctoac ddos policy get\|set\|preset\|reset` | Policy |
| `gctoac ddos ban <ip> [--ttl 3600] [--reason …]` | Ban |
| `gctoac ddos unban <ip>` / `blacklist` | Unban / list |

### Observability & data

| Command | Description |
|---------|-------------|
| `gctoac stats` | Dashboard-style summary |
| `gctoac grok inspect` | Local Grok Build snapshot (version, models, skills, MCP) |
| `gctoac grok sessions` | List local Grok CLI sessions |
| `gctoac grok sessions delete <id> --yes` | Permanently delete a Grok session |
| `gctoac models [--refresh]` | Local Grok models |
| `gctoac docs list\|show\|delete` | Documents (`delete` needs `--yes`) |
| `gctoac chats list\|show` | API chat requests (meta) |
| `gctoac conversations list\|delete` | Playground threads |
| `gctoac audit list [--action …]` | Audit log |

```bash
gctoac --home ~/.gctoac-alt setup
gctoac --port 3847 start
gctoac status
gctoac admin otp
gctoac settings preset prod
gctoac queue pause
gctoac ddos ban 203.0.113.10 --ttl 3600 --reason abuse
gctoac stats --json
gctoac logs clear
```

---

## Features

| Feature | Details |
|---------|---------|
| OpenAI API | `POST /v1/chat/completions`, `POST /v1/responses` (text), `GET /v1/models` |
| Anthropic API | `POST /v1/messages` (Bearer or `x-api-key`) |
| Thinking | `reasoning_content` + Grok `thought` + `grok.*` meta |
| Documents | Type-sniffed upload, encrypted storage (DB or filesystem), download |
| Safe / Agent | Per-key policy; optional global force-safe |
| Encryption | AES-256-GCM for prompts, responses, files |
| Chat history | Multi-turn conversations, context modes (full / summary / recent) |
| Admin Panel | OTP session login; **tabbed** pages (queue / media / system / PM2 / DDoS / API features); compact EN/ZH copy |
| Media library | Studio (gen/edit/**1–15s video**/voices), assets & jobs, multi-format preview lightbox (`blob:` CSP-safe). Generate harvests Imagine session `images/` when sandbox `output.png` is missing |
| Chat queue | Durable SQLite jobs, fair RR, pause/drain, DLQ, Idempotency-Key, `QUEUE_BACKEND`, offline stream fallback |
| DDoS center | Live connections, blacklist, auto-ban rules, presets, runtime policy (tabbed) |
| Reverse proxy | Trust hops + CF / nginx / X-Forwarded-For client IP |
| Auth | API keys: **scrypt** hashes (legacy SHA-256 auto-migrates); Admin SPA: OTP → session token |
| CLI | Full control plane: lifecycle, settings, queue, DDoS, keys, docs, chats, stats, `admin otp`, `grok inspect`, `grok sessions` |
| Ops | SQLite, PM2, log auto-trim (>5 MB), GitHub Actions CI |

---

## API

Protected routes require:

```http
Authorization: Bearer gk_live_...
```

### Chat (stream)

When the durable queue is enabled (default), the stream may first emit `gog.queue` position events, then normal OpenAI chunks.

```bash
curl -sN http://127.0.0.1:3847/v1/chat/completions \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: my-client-req-001" \
  -d '{
    "model": "grok-4.6",
    "stream": true,
    "include_reasoning": true,
    "messages": [{"role":"user","content":"Count to 3"}]
  }'
```

`Idempotency-Key` is optional (scoped per API key). Safe to retry the same key while a job is active.

### OpenAI SDK (Chat Completions)

```ts
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: 'http://127.0.0.1:3847/v1',
});

const res = await client.chat.completions.create({
  model: 'grok-4.6',
  messages: [{ role: 'user', content: 'Hello' }],
});
console.log(res.choices[0].message.content);
```

### OpenAI Responses (text subset)

```bash
curl -s http://127.0.0.1:3847/v1/responses \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "grok-4.6",
    "input": "Hello",
    "stream": false
  }'
```

```ts
// openai SDK ≥ responses support
const r = await client.responses.create({
  model: 'grok-4.6',
  input: 'Hello',
});
```

Supported: `input` string or message items (text), `instructions`, `stream`, `tools` (→ Grok tools when enabled), `previous_response_id` (context chain), `GET/DELETE /v1/responses/:id` (encrypted store).

### Images (OpenAI-shaped)

`POST /v1/images/generations` and `POST /v1/images/edits` return the official Images object. Requires **`imagesApi` + `tools`** and an **agent** (or admin) key — safe keys get **403**.

```bash
curl -s http://127.0.0.1:3847/v1/images/generations \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "a red square",
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

| Field / topic | Behavior |
|---------------|----------|
| `response_format` | `b64_json` (default, same as GPT image models) or `url` |
| `size` | OpenAI pixels (`1024x1024`, …) **or** a Grok aspect (`16:9`) |
| `aspect_ratio` | Grok Imagine (`1:1`, `16:9`, …) — preferred over pixel sizes |
| `n` | 1–4; Grok has no batch generate — gateway may loop. `n=1` returns one image |
| `data[].url` | Gateway-local `/v1/media/assets/:id/content` (same API key). Not an OpenAI CDN |
| `grok` | Gateway extension (`provider`, `asset_ids`). OpenAI SDKs ignore unknown fields |

**How generate actually gets a file (v1.7.4+):** Grok Imagine always writes to  
`~/.grok/sessions/<encodeURIComponent(sandbox-cwd)>/<session-uuid>/images/`  
(e.g. `1.jpg`). The media-run sandbox has **no bash**, so the agent cannot `cp` that file to `output.png`. The gateway copies the newest image for **this run’s session only** into sandbox `output.jpg|png|webp` as soon as `image_gen` succeeds (and again when Grok exits).

Collect order:

1. Sandbox-root `output.png` / `output.jpg` / `output.webp` / `output.jpeg`
2. Recursive scan of the sandbox (realpath; never follows links out of the run dir)
3. This run’s Grok session `images/` only — never the rest of `~/.grok/sessions`

Prefer the newest file. Ignore `input.png`, `mask.png`, `frame.png`, `ref-*.png`. **502** `no_image_in_sandbox` only if nothing exists — that is **not** an `imagesApi` or API-key failure. If Grok then burns `maxTurns` and exits `1`, the gateway still returns the already-generated file (it does not drop a successful `image_gen`). After the first image is in hand (`n=1`), the CLI process is stopped so the agent cannot keep calling `use_tool`. Edit uses `--tools image_edit` + `input.png`. Video collect can also take this run’s session `videos/` / `images/` plus sandbox `output.mp4`.

```ts
const img = await client.images.generate({
  model: 'grok-4.6',
  prompt: 'a red square',
  n: 1,
  response_format: 'b64_json',
});
const b64 = img.data[0].b64_json;
```

### Anthropic Messages

```bash
curl -s http://127.0.0.1:3847/v1/messages \
  -H "x-api-key: $API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "grok-4.6",
    "max_tokens": 1024,
    "messages": [{"role":"user","content":"Hello"}],
    "stream": false
  }'
```

Also accepts `Authorization: Bearer $API_KEY`.  
Supported: text `system` + user/assistant messages, **image blocks** (ACP `--prompt-json`), `tool_use` / `tool_result`, stream SSE (`message_start` … `message_stop`).

### API compatibility matrix

| Feature | Chat Completions | Responses | Anthropic Messages |
|---------|------------------|-----------|--------------------|
| Text chat | ✅ | ✅ | ✅ |
| Stream | ✅ OpenAI chunks | ✅ `response.*` events | ✅ Anthropic events |
| Models list | ✅ `/v1/models` | (use same) | (use same) |
| Auth | Bearer | Bearer | Bearer or `x-api-key` |
| Vision / image parts | ✅ (`vision` feature) | ✅ | ✅ |
| Tools / function calling | ✅ (`tools` feature) | ✅ | ✅ |
| `temperature` / `top_p` / `stop` | accepted, **ignored** | ignored | ignored |
| `max_tokens` | accepted, ignored | `max_output_tokens` ignored | required field, ignored by Grok |
| Reasoning | `include_reasoning` → `reasoning_content` | optional | off by default |
| Queue | yes (`gog.queue` on stream) | yes (no `gog.queue` in SSE) | yes (no `gog.queue` in SSE) |

### Chat body extensions

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

| Field | Notes |
|-------|--------|
| `include_reasoning` | Default `true`. Maps Grok `thought` → `reasoning_content` |
| `cwd` | **agent** only (allowlist); **safe** forces sandbox |
| `session_id` | Mapped to a per-key Grok UUID: first call uses `-s`, later calls `--resume` (Grok 1.0+). |
| `resume` | Grok session UUID (`--resume`). Admin playground Resume field. |
| `fork_session` | Fork that session instead of continuing it. |
| `reasoning_effort` / `effort` | Grok `--reasoning-effort` (`none`…`max`). Gate: `reasoningEffort`. |
| `experimental_memory` / `no_memory` | Grok memory flags. Gate: `memory`. |
| `no_plan` | Disable plan mode. Gate: `planMode`. |
| `permission_mode` | `default` / `acceptEdits` / `auto` / `dontAsk` / `bypassPermissions` / `plan`. Gate: `permissionMode`. |
| `document_ids` | Inject decrypted documents as context |
| `temperature`, `top_p`, `stop`, `user` | Accepted for SDK compatibility; **not applied** by Grok CLI |
| `tools` / `functions` | Mapped to Grok when **`tools`** is enabled (otherwise 400) |
| `response_format: json_object` | Best-effort system hint only |

### Thinking mapping

| Grok event | OpenAI / DeepSeek field | Extra |
|------------|-------------------------|--------|
| `thought` | `reasoning_content` / `delta.reasoning_content` | `thought` alias |
| `text` | `content` / `delta.content` | — |
| `tool_call` / `tool_call_update` / `plan` | extra `grok_event` on the chunk | OpenAI SDK ignores unknown fields |
| `usage` / `cost` | `usage` (+ cache / cost when Grok sends them) | — |
| `end` | `finish_reason` | `grok.sessionId`, `grok.stopReason` |

### Durable chat queue

When queue policy is **enabled** (default), every `POST /v1/chat/completions` is written to the durable `ChatJob` table, then consumed by an in-process worker with lease / heartbeat / crash reclaim.

| Topic | Behavior |
|-------|----------|
| **Semantics** | At-least-once delivery; visibility timeout (lease) on claim; boot reclaim of in-flight jobs |
| **Fairness** | `weighted_round_robin` by API key (default) or global FIFO; per-key + global concurrency |
| **Stream** | Connection stays open; client first receives `object: "gog.queue"` position events, then normal OpenAI chunks |
| **Backpressure** | `maxQueueDepth` / `maxQueueDepthPerKey` → **429** `queue_full`; drain / disabled → **503** `queue_draining`; wait timeout → **504**; cancel → **409** |
| **Idempotency** | Optional header `Idempotency-Key` (scoped per API key). Active job is reused; succeeded key returns already-done; failed/dead/cancelled frees the key for retry |
| **Backend** | `QUEUE_BACKEND=sqlite` (default, production-ready). `redis` / `kafka` reserved for multi-node (not implemented — boot fails if selected) |
| **Payload** | Job body encrypted at rest (AES-GCM) in `ChatJob` |
| **Admin** | **Queue** page: KPIs, pause/resume, drain, policy, status filter (incl. DLQ / `active`), cancel / requeue / priority / purge finished (24h+) |

Stream preview:

```text
data: {"object":"gog.queue","status":"queued","job_id":"…","position":2}
data: {"object":"gog.queue","status":"queued","job_id":"…","position":1}
data: {"id":"chatcmpl-…","object":"chat.completion.chunk","grok_event":{"type":"tool_call",…},…}
```

Admin ops (OTP **session** token or admin API key):

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

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Liveness |
| GET | `/ready` | DB + Grok check |
| GET | `/v1/models` | List models |
| POST | `/v1/chat/completions` | OpenAI Chat (queued; optional `Idempotency-Key`) |
| POST | `/v1/responses` | OpenAI Responses (text + store) |
| GET/DELETE | `/v1/responses/:id` | Retrieve / soft-delete stored response |
| POST | `/v1/messages` | Anthropic Messages (Bearer or `x-api-key`) |
| POST | `/v1/images/generations` | OpenAI Images generate (`b64_json` / `url`; harvests session `images/` if sandbox is empty) |
| POST | `/v1/images/edits` | OpenAI Images edit (multipart `image` + optional `mask`) |
| GET | `/v1/media/assets/:id` | Stored asset metadata |
| GET | `/v1/media/assets/:id/content` | Stored asset bytes (same API key) |
| POST | `/v1/videos` | Grok video job (`seconds` 1–15; `voices[]` → `reference_to_video`) |
| GET | `/v1/videos/:id` | Poll video job |
| GET | `/admin/api/grok/inspect` | Local `grok inspect --json` snapshot |
| GET/DELETE | `/admin/api/grok/sessions`… | List / delete `~/.grok/sessions` |
| POST/GET/DELETE | `/v1/assistants`… | Assistants-lite (feature `assistantsEmulation`) |
| POST/GET | `/v1/threads`… | Threads + messages + runs (Assistants-lite) |
| POST | `/v1/documents` | Upload (`file` field) |
| GET/DELETE | `/v1/documents`… | List / soft-delete |
| POST/GET/DELETE | `/v1/api-keys`… | Admin key management |
| POST | `/admin/api/auth/login` | Exchange OTP → session token (public, rate-limited) |
| POST | `/admin/api/auth/logout` | Revoke session |
| * | `/admin/api/*` | Admin JSON API (OTP session **or** `role=admin` API key) |

---

## Safe / Agent policy

| Mode | Use for | Behavior |
|------|---------|----------|
| **`safe`** (default for clients) | External apps | Sandbox cwd, no always-approve, restricted tools, shorter timeout |
| **`agent`** | Trusted / internal | Full CLI tools (optional always-approve); cwd still allowlisted |

- Force all keys safe: `GROK_SAFE_MODE=true` or Admin → **Safety settings**  
- Clients **cannot** escalate via request body  
- Do **not** expose `agent` keys on the public internet  

---

## Admin Panel

```text
http://127.0.0.1:3847/admin/
```

### Login (OTP)

The Admin **SPA does not accept long-lived API keys** in the browser. Generate a one-time code:

```bash
gctoac admin otp          # alias: gctoac admin login-code
```

- Valid **5 minutes**, **single use**
- Session token stored in `sessionStorage` (~**12 hours**)
- New code required after logout / expiry / new browser

Admin **JSON API** (`/admin/api/*`) accepts either:

- `Authorization: Bearer gog_sess_…` (OTP session), or  
- `Authorization: Bearer gk_live_…` with `role=admin`

| Page | Features |
|------|----------|
| **Dashboard** | 24h KPIs, success rate, **queue depth**, protection snapshot, models, runtime (port / encryption) |
| **Chat** | Multi-turn playground: effort, resume/fork UUID, memory / no-plan / permission, tool chips + cost, history, context modes, attachments (queued when enabled) |
| **Chat logs** | Search / filter / pager; full **decrypted** prompt / reasoning / response |
| **API Keys** | Create / edit mode / role / rate limit / IP whitelist; revoke |
| **Documents** | Search / filter / pager; preview, download, delete; storage DB vs filesystem |
| **Audit Logs** | Search / filter / pager; human-readable actions |
| **Usage & limits** | 24h stats, by-model / by-key tabs, gateway limit summary |
| **Media** | **Tabs:** Studio · Assets · Jobs. KPI strip. Studio: generate / edit / **image-to-video (1–15s)** / **voice** (`ara` `eve` `leo` `rex` `sal` `mio` → `reference_to_video`). Library picker + drag-drop. Preview lightbox |
| **Queue** | **Tabs:** Overview · Jobs · Policy. KPI strip (auto soft-refresh). Pause/drain, DLQ filter, cancel/requeue/priority/purge, concurrency & fairness presets |
| **DDoS center** | **Tabs:** Policy · Traffic · Blacklist · Events. KPI strip. Live connections, recent requests, auto-ban events, top IPs, **runtime protection policy** (relaxed / balanced / strict / custom), reverse-proxy IP |
| **Safety settings** | Global safe mode, tools / turns / timeout, default model, concise presets, disable Admin panel (re-enable only via CLI) |
| **API features** | **Tabs:** Protocols · Media · Capabilities · Emulation. KPI enabled counts. Presets: open / locked / dev |
| **PM2** | **Tabs:** Runner · Port · Config · Logs. KPI process strip. Runner switch (gctoac ↔ PM2), listen port (default 3847), config, clear logs + auto-trim |
| **System** | **Tabs:** Software · Package · Environment · **Grok sessions**. Software tab has a **Grok inspect** card (version / channel / models / skills / MCP). Sessions tab lists `~/.grok/sessions` (search + delete). One-click update & restart |
| **Support** | Donate / GitHub Sponsors / Linktree / crypto addresses, YSK Limited services, **email@ysk.hk** |

Shared Admin UX: segmented tabs + top KPI cards, compact formal EN/ZH strings, table action buttons centered; only operational pages keep a top-right **Refresh** (dashboard / usage / DDoS / PM2).

### DDoS / abuse (runtime)

Policy is stored in the database (Admin → DDoS). Env values are **initial defaults** only; after first save, Admin is authoritative. Reset via **Reset to env defaults**.

| Capability | Notes |
|------------|--------|
| Rate limits | Window, max per key, max per IP, chat burst |
| Auto-ban rules | Failed auth, repeated 429, concurrent flood, request velocity, escalation |
| Presets | Relaxed / Balanced / Strict / Custom (auto-detected) |
| Whitelist | Never auto-banned (e.g. `127.0.0.1`) |
| Manual ban | TTL or permanent |

### Reverse proxy / CDN (client IP)

Behind **nginx** or **Cloudflare**, configure so bans, rate limits, and audit use the **real client IP**:

| Setting | Typical value |
|---------|----------------|
| Trust proxy hops | `1` = nginx or CF→app; `2` = CF→nginx→app; `0` = direct only |
| IP source | `auto` (recommended), `cloudflare`, `nginx`, `x-forwarded-for`, `socket` |

Set in **Admin → DDoS → Reverse proxy**, or env:

```env
TRUST_PROXY=1
PROXY_IP_SOURCE=auto
```

Example nginx:

```nginx
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
```

---

## Environment variables

See [`.env.example`](./.env.example). Fresh `gctoac setup` writes **`NODE_ENV=production`**.

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | Default **`production`**. Use `development` only for local coding (pretty logs) |
| `PORT` | Default **`3847`** (also editable in Admin → PM2) |
| `HOST` | Listen address (default `0.0.0.0`) |
| `DATABASE_URL` | SQLite, e.g. `file:../data/gateway.db` (relative to `prisma/`) |
| `ENCRYPTION_KEY` | 32-byte key: `openssl rand -base64 32` |
| `ADMIN_BOOTSTRAP_KEY` | Optional seed admin key on first setup |
| `GROK_BIN` | Default `grok` |
| `GROK_DEFAULT_MODEL` | Default model id (`grok-4.6`) |
| `GROK_DEFAULT_CWD` / `GROK_CWD_ALLOWLIST` | Agent cwd (empty default = `<STORAGE_DIR>/workspaces/default`, not the gateway repo) |
| `GROK_TIMEOUT_MS` | Default agent timeout (ms) |
| `GROK_ALWAYS_APPROVE` | Agent only; off in safe mode |
| `GROK_SAFE_MODE` | Force all keys to safe |
| `GROK_SAFE_MAX_TURNS` / `GROK_SAFE_TIMEOUT_MS` | Safe-mode defaults (also editable in Admin → Safety settings) |
| `GROK_MAX_CONCURRENT` | Max parallel Grok processes (also seeds queue global concurrency default) |
| `QUEUE_BACKEND` | Durable chat queue: **`sqlite`** (default). `redis` / `kafka` reserved (not implemented) |
| `ADMIN_PANEL_ENABLED` | Hard off for `/admin` (env; restart). Runtime: `gctoac admin on\|off` |
| `PM2_ADMIN_ENABLED` | Allow Admin PM2 controls |
| `CORS_ORIGINS` | Comma-separated origins (update when changing `PORT`) |
| `RATE_LIMIT_*` / `CHAT_BURST_MAX` / `BLOCK_*` | Initial rate-limit / auto-auth defaults (overridden by DDoS policy after save) |
| `TRUST_PROXY` | Proxy hops: `0` / `1` / `2`… (`true`→1, `false`→0) |
| `PROXY_IP_SOURCE` | `auto` \| `cloudflare` \| `nginx` \| `x-forwarded-for` \| `socket` |
| `GCTOAC_HOME` | CLI data home (default `~/.gctoac`) |
| `STORAGE_DIR` | Encrypted large files + sandboxes |
| `UPLOAD_MAX_BYTES` / `DOCUMENT_DB_MAX_BYTES` | Upload / DB vs filesystem threshold |
| `BODY_LIMIT` | JSON body size limit (default `1mb`) |
| `LOG_LEVEL` | `fatal` \| `error` \| `warn` \| `info` \| `debug` \| `trace` |

**Back up `ENCRYPTION_KEY`.** If lost, historical data cannot be decrypted.

Runtime queue policy (concurrency, fairness, pause/drain, depths) is stored in the DB (`queue_policy` setting) and edited under **Admin → Queue** — not only via env.

---

## Production

### Recommended: CLI

```bash
gctoac setup
gctoac start              # detached gctoac
# or
gctoac start --pm2        # under PM2
gctoac status
```

`gctoac restart` follows the last **preferred runner** (gctoac or PM2).

### PM2 ecosystem

```bash
npm run build
pm2 start ecosystem.config.cjs
pm2 logs grok-openai-gateway
```

### Logs

- Files under `logs/` (or data home): `pm2-error.log`, `pm2-out.log`, `gctoac.*.log`
- **Admin → PM2 → Clear logs**, or `gctoac logs clear`
- **Auto-trim:** each log read trims files **> 5 MB** down to the last ~512 KB

### Avoid EADDRINUSE

Only one runner should bind the port. If both gctoac and PM2 race:

```bash
gctoac stop
gctoac start          # or: gctoac start --pm2
gctoac doctor         # flags mixed runners
```

---

## Project layout

```text
src/                  TypeScript (app, routes, services, cli)
src/services/queue/   Durable chat queue (policy, ChatJob, worker, backend iface)
public/admin/         Admin SPA (OTP login + pages)
prisma/               Schema, migrations (incl. chat_jobs), seed
dist/                 Built JS (gitignored; created by npm run build / prepublishOnly)
scripts/              prepare, install.sh
tests/                Vitest (unit + integration)
```

---

## Scripts

```bash
npm run dev          # development (tsx watch)
npm run build        # prisma generate + tsc
npm start            # node dist/server.js
npm test             # unit + integration
npm run db:setup     # migrate + seed
gctoac setup|start|status|stop|doctor|logs|update
```

### Publish (maintainers)

`prepublishOnly` runs `npm run build` so the tarball includes `dist/`.

```bash
npm login
npm publish --access public --otp=<2FA_CODE>
```

---

## Security

- API keys stored as **scrypt** hashes (`scrypt$salt$hash`); legacy **SHA-256** rows verify and auto-upgrade on login  
- Chat + documents + **queue job payloads** encrypted at rest with **AES-256-GCM**  
- Prefer **`safe`** keys for any external client  
- **Admin SPA:** OTP only (`gctoac admin otp`) → short-lived session in `sessionStorage` (XSS = full takeover for the session TTL)  
- **Client IP:** `CF-Connecting-IP` / `X-Real-IP` / `X-Forwarded-For` are trusted **only** when the TCP peer is in **Trusted proxy IPs** (default `127.0.0.1`). Direct clients cannot spoof headers to bypass rate limits or ban others.  
- Expose Admin only on localhost/VPN  
- Never commit `.env` or share admin keys / OTP codes  
- Admin can be fully disabled: `gctoac admin off` (re-enable only via `gctoac admin on`)  
- One-click update / PM2 / port change require admin (treat admin keys / OTP sessions as root)

---

## 👤 Creator

**Ki (yanshekki)** — Full-stack developer, quant trader, founder of [YSK Limited](https://ysk.hk/).

🌐 [linktr.ee/yanshekki](https://linktr.ee/yanshekki) · 📄 [Product page](https://ysk.hk/products/gctoac) · 🏢 [ysk.hk](https://ysk.hk/)

### ☕ Support / Donate

If this Grok → OpenAI gateway helps your work, consider buying me a coffee!

| Network | Address |
| --- | --- |
| **EVM** (ETH/BSC/AVAX) | `yanshekki.eth` |
| **NEAR** | `yanshekki.near` |
| **ADA** (Cardano) | `$yanshekki` |

---

## License

MIT — see [LICENSE](./LICENSE).

## Disclaimer

This gateway spawns **Grok CLI**, which may use filesystem, shell, and network tools depending on policy. You are responsible for exposure, authentication, and key modes. Authors are not liable for misuse or data loss.
