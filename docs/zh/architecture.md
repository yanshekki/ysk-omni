# 架構

```text
用戶端（OpenAI SDK / curl / Open WebUI）
        │  Authorization: Bearer omni_live_…
        ▼
   Express 閘道 :3850
   · 認證 · 限流 · safe/agent · 佇列 · Admin
        │
        ├─ GGUF 文字     → llama-server（OMNI_LLAMA_SERVER / PATH）
        ├─ safetensors   → vLLM
        ├─ echo          → 內建協議測試模型
        ├─ 圖像          → OMNI_IMAGE_URL
        ├─ TTS / STT     → OMNI_TTS_URL / OMNI_STT_URL
        └─ 影片          → OMNI_VIDEO_URL（或短 H.264 樣本）
```

## 行程

| 行程 | 職責 |
|------|------|
| `ysk-omni start` | 閘道、Admin SPA、SQLite、目錄、金鑰政策 |
| `llama-server` | **Load** 後持久 GGUF 對話 |
| vLLM | safetensors 對話 |
| 媒體 worker | OpenAI 形狀的 `/v1/images/generations`、`/v1/videos`、`/v1/audio/*` |

閘道不會啟動外部編程 CLI。文字推論是 llama-server、vLLM 或 `echo`。

## 資料

預設主目錄：`~/.ysk-omni`。

| 路徑 | 內容 |
|------|------|
| `data/gateway.db` | 金鑰、對話、佇列、審計（Prisma / SQLite） |
| `models/` | 已拉取權重（GGUF 與 Hub 快照） |
| `.env` | `ENCRYPTION_KEY`、`PORT`、worker 網址 |
| `logs/` | 閘道與 PM2 日誌 |

對話內容以 AES-256-GCM 加密儲存。

## Admin

Vite SPA 位於 `/admin/`，生產包 `public/admin/boot.js` 來自 `admin/src/full/app.js`。登入用一次性碼，不是貼上 live 金鑰。
