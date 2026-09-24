# HTTP API

基底網址：`http://127.0.0.1:3850`。認證：`Authorization: Bearer omni_live_…`。

## 模型

`GET /v1/models` 列出**此金鑰可用**的 id，並帶 `modality`、`runtime`（`text`、`image`、`video`、`tts`、`stt`）。內建包括 `echo`、`piper/lessac-high`、`tts-1`、`whisper-1`，加上本機登錄與已載入引擎。

金鑰有可用模型清單時，回傳清單與目錄的交集。空白清單＝全部目錄。

`GET /v1/models/:id` 回傳單一 id，否則 404 或 403 `model_not_allowed`。

## 對話

| 方法 | 路徑 | 說明 |
|------|------|------|
| POST | `/v1/chat/completions` | OpenAI 對話。串流：`"stream": true` |
| POST | `/v1/responses` | OpenAI Responses（文字子集） |
| POST | `/v1/messages` | Anthropic Messages（亦接受 `x-api-key`） |

文字引擎：已載入 GGUF（llama-server）、vLLM 或 `echo`。在此路由傳入媒體模型 id 不會自動生成媒體；請用媒體端點或 Admin 操場（依目錄 runtime 轉送）。

完成結果的閘道擴充：`omni.sessionId`、`omni.asset_ids`（媒體）。OpenAI SDK 會忽略未知欄位。

```json
{
  "model": "echo",
  "messages": [{ "role": "user", "content": "你好" }]
}
```

## 媒體

| 方法 | 路徑 |
|------|------|
| POST | `/v1/images/generations` |
| POST | `/v1/images/edits` |
| POST | `/v1/videos` |
| GET | `/v1/videos/:id` |
| GET | `/v1/videos/:id/content` |
| POST | `/v1/audio/speech` |
| POST | `/v1/audio/transcriptions` |
| GET | `/v1/media/assets/:id/content` |

將 `OMNI_IMAGE_URL`／`OMNI_TTS_URL`／`OMNI_STT_URL`／`OMNI_VIDEO_URL` 指向 OpenAI 形狀的 worker。未設圖像／TTS／STT worker → **501** `engine_unconfigured`。未設影片 worker 時可能回一段短 H.264 樣本。

圖像／影片／語音需要 **agent** 或 **admin** 金鑰，除非演員是 Admin OTP。

輸出副檔名：`png`／`jpeg`／`mp3`／`wav`／`mp4` 等；閘道會用 ffmpeg 轉換。

## 文件與 assistants

| 方法 | 路徑 |
|------|------|
| POST/GET/DELETE | `/v1/documents` · `/v1/documents/:id` |
| POST | `/v1/assistants` 及相關 OpenAI 形狀路由（受能力旗標限制） |

## 健康

| 方法 | 路徑 |
|------|------|
| GET | `/health` |
| GET | `/ready` | 資料庫 + 文字引擎（PATH 上的 llama-server） |

## 錯誤

JSON：`{ "error": { "message", "type", "code" } }`。

| 代碼 | 常見狀態 |
|------|----------|
| `unauthorized` | 401 |
| `forbidden` | 403 |
| `model_not_allowed` | 403 |
| `feature_disabled` | 403／501 |
| `engine_unconfigured` | 501 |
| `engine_timeout` | 504 |
| `rate_limit_exceeded` | 429 |
| `queue_full`／`queue_draining` | 429／503 |
