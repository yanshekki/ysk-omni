# 媒體

圖像、影片、語音、轉錄走獨立 `/v1` 路由（以及 Admin **媒體庫**工作室），不是 llama-server 對話。

## Worker

若只跑一個 worker 行程，四個網址可指向同一主機：

```bash
export OMNI_IMAGE_URL=http://127.0.0.1:3870
export OMNI_TTS_URL=http://127.0.0.1:3870
export OMNI_STT_URL=http://127.0.0.1:3870
export OMNI_VIDEO_URL=http://127.0.0.1:3870
```

小型真實權重 worker（Piper、faster-whisper、可選 diffusion／T2V）：

```bash
python3.12 -m venv ~/.ysk-omni/venvs/tiny-media
# pip：faster-whisper piper-tts pillow torch diffusers …
TINY_WORKER_PORT=3870 python scripts/tiny-media-worker.py
```

`TINY_MEDIA_FAKE=1` 提供合成 wav／png（CI）。未設圖像／TTS／STT 網址 → **501** `engine_unconfigured`。

## 格式

工作室與 API 接受輸出副檔名（`png`、`jpeg`、`wav`、`mp3`、`mp4` 等）。worker 產出其他容器時，閘道用 **ffmpeg** 轉換。

影片是真實 T2V 管線（例如 Zeroscope UNet3D），不是靜態圖幻燈片。

## 工作室

Admin → 媒體庫：圖像、影片、語音、轉錄。語音需要提示；轉錄需要附加音訊。對話操場在選擇媒體模型時以同一方式轉送。

## 權限

公開 `/v1` 媒體需要 **agent** 或 **admin** 金鑰。safe 用戶金鑰會收到 `media_forbidden`。
