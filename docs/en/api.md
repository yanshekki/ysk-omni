# HTTP API

Base URL: `http://127.0.0.1:3850`. Authenticate with `Authorization: Bearer omni_live_…`.

## Models

`GET /v1/models` lists ids **this key may use**, with `modality` and `runtime` (`text`, `image`, `video`, `tts`, `stt`). Built-ins include `echo`, `piper/lessac-high`, `tts-1`, `whisper-1`, plus local registry and loaded engines.

If the key has an allowlist, the list is that allowlist intersected with the catalog. Empty allowlist = full catalog.

`GET /v1/models/:id` returns one id, or 404 / 403 `model_not_allowed`.

## Chat

| Method | Path | Notes |
|--------|------|--------|
| POST | `/v1/chat/completions` | OpenAI chat. Stream with `"stream": true` |
| POST | `/v1/responses` | OpenAI Responses (text subset) |
| POST | `/v1/messages` | Anthropic Messages (`x-api-key` also accepted) |

Text engines: loaded GGUF (llama-server), vLLM, or `echo`. Media model ids in chat do not auto-dispatch on this route; use the media endpoints or Admin playground (which routes by catalog runtime).

Gateway extension on completions: `omni.sessionId`, `omni.asset_ids` (media). OpenAI SDKs ignore unknown fields.

```json
{
  "model": "echo",
  "messages": [{ "role": "user", "content": "hello" }]
}
```

## Media

| Method | Path |
|--------|------|
| POST | `/v1/images/generations` |
| POST | `/v1/images/edits` |
| POST | `/v1/videos` |
| GET | `/v1/videos/:id` |
| GET | `/v1/videos/:id/content` |
| POST | `/v1/audio/speech` |
| POST | `/v1/audio/transcriptions` |
| GET | `/v1/media/assets/:id/content` |

Point `OMNI_IMAGE_URL` / `OMNI_TTS_URL` / `OMNI_STT_URL` / `OMNI_VIDEO_URL` at an OpenAI-shaped worker. Missing image/TTS/STT worker → **501** `engine_unconfigured`. Video may return a short H.264 fixture if no worker is set.

Image/video/speech need an **agent** or **admin** key unless Admin OTP is the actor.

Output format: request `png` / `jpeg` / `mp3` / `wav` / `mp4` as supported; the gateway converts with ffmpeg when needed.

## Documents and assistants

| Method | Path |
|--------|------|
| POST/GET/DELETE | `/v1/documents` · `/v1/documents/:id` |
| POST | `/v1/assistants` and related OpenAI-shaped routes (feature-gated) |

## Health

| Method | Path |
|--------|------|
| GET | `/health` |
| GET | `/ready` | Database + text engine (llama-server on PATH) |

## Errors

JSON: `{ "error": { "message", "type", "code" } }`.

| Code | Typical status |
|------|----------------|
| `unauthorized` | 401 |
| `forbidden` | 403 |
| `model_not_allowed` | 403 |
| `feature_disabled` | 403 / 501 |
| `engine_unconfigured` | 501 |
| `engine_timeout` | 504 |
| `rate_limit_exceeded` | 429 |
| `queue_full` / `queue_draining` | 429 / 503 |
