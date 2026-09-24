# Architecture

```text
Client (OpenAI SDK / curl / Open WebUI)
        │  Authorization: Bearer omni_live_…
        ▼
   Express gateway :3850
   · auth · rate limit · safe/agent · queue · Admin
        │
        ├─ GGUF text     → llama-server (OMNI_LLAMA_SERVER / PATH)
        ├─ safetensors   → vLLM
        ├─ echo          → built-in protocol test model
        ├─ image         → OMNI_IMAGE_URL
        ├─ TTS / STT     → OMNI_TTS_URL / OMNI_STT_URL
        └─ video         → OMNI_VIDEO_URL (or a short H.264 fixture)
```

## Processes

| Process | Role |
|---------|------|
| `ysk-omni start` | Gateway, Admin SPA, SQLite, catalog, key policy |
| `llama-server` | Persistent GGUF chat after **Load** |
| vLLM | Safetensors chat |
| Media worker | OpenAI-shaped `/v1/images/generations`, `/v1/videos`, `/v1/audio/*` |

The gateway does not spawn an external coding CLI. Text inference is llama-server, vLLM, or `echo`.

## Data

Default home: `~/.ysk-omni`.

| Path | Contents |
|------|----------|
| `data/gateway.db` | Keys, chats, queue, audit (Prisma / SQLite) |
| `models/` | Pulled weights (GGUF and Hub snapshots) |
| `.env` | `ENCRYPTION_KEY`, `PORT`, worker URLs |
| `logs/` | Gateway and PM2 logs |

Chat bodies are stored with AES-256-GCM.

## Admin

Vite SPA at `/admin/`, production bundle `public/admin/boot.js` from `admin/src/full/app.js`. Session is an OTP, not a pasted live key.
