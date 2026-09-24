# YSK Omni

Local Hugging Face models. OpenAI-shaped APIs. Text, image, video, voice.

| | |
|--|--|
| **CLI** | `ysk-omni` · alias `ysko` |
| **Default port** | **3850** |
| **Product** | [ysk.hk/products/omni](https://ysk.hk/products/omni) |
| **Lineage** | Conceptual fork of [Grok-Cli-to-OpenAI-compatible](https://github.com/yanshekki/Grok-Cli-to-OpenAI-compatible) — keep the gateway, remove `grok -p` |

GCTOAC (`gctoac` :3847) stays the Grok CLI product. YSK Omni is the local multimodal runtime.

## CLI

```bash
ysk-omni setup                 # data dir, .env, migrate, seed; also installs pm2 when npm -g works
ysk-omni catalog --modality text
ysk-omni pull Qwen/Qwen2.5-0.5B-Instruct-GGUF:Q2_K
ysk-omni start                 # detached node on :3850
ysk-omni start --pm2           # same process under PM2 (name ysk-omni)
ysk-omni doctor
```

Alias: `ysko` → same binary. Do not use `yo` (Yeoman).

## Local workers

Admin Catalog **Hugging Face** tab searches the official Hub REST API (`GET https://huggingface.co/api/models`, Link-header cursors). There is no RSS/Atom feed for the model index. Curated packs stay the default; Hub search does not dump the whole Hub.

Text chat with a pulled GGUF needs `llama-server` on `PATH` (or `OMNI_LLAMA_SERVER`). Load the model in Admin Catalog, then `POST /v1/chat/completions` with that model id. Offload layers with `OMNI_LLAMA_N_GPU_LAYERS` (default `-1` = all). Safetensors ids need `vllm` (`OMNI_VLLM`), or `python -m vllm.entrypoints.openai.api_server` when `OMNI_VLLM` is a Python interpreter / `OMNI_VLLM_MODULE=1`. Without those binaries, use `model=echo`.

Image / speech / transcription / video workers are **OpenAI-shaped HTTP**, not ComfyUI native graphs. Point `OMNI_IMAGE_URL` / `OMNI_VIDEO_URL` at a process that already speaks `/v1/images/generations` and `/v1/videos`. A stock ComfyUI server (`/prompt`, `/history`) needs an OpenAI-compat adapter in front.

Tiny **real** weights worker (Piper TTS, faster-whisper `tiny`, optional `segmind/tiny-sd` + ffmpeg video). First run downloads into `~/.ysk-omni/models/tiny/`:

```bash
python3.12 -m venv ~/.ysk-omni/venvs/tiny-media
~/.ysk-omni/venvs/tiny-media/bin/pip install faster-whisper piper-tts pillow
# image (optional, larger): pip install torch diffusers transformers accelerate
TINY_WORKER_PORT=3870 ~/.ysk-omni/venvs/tiny-media/bin/python scripts/tiny-media-worker.py
export OMNI_IMAGE_URL=http://127.0.0.1:3870
export OMNI_TTS_URL=http://127.0.0.1:3870
export OMNI_STT_URL=http://127.0.0.1:3870
export OMNI_VIDEO_URL=http://127.0.0.1:3870
```

`TINY_MEDIA_FAKE=1` serves synthetic wav/png without downloading (CI). Live smoke: `OMNI_LIVE_TINY=1 OMNI_LIVE_KEY=omni_live_… npx vitest run tests/integration/v1.live-tiny-modalities.test.ts`.

Demo worker (fixtures, not Comfy / whisper weights):

```bash
node scripts/omni-openai-worker.mjs   # http://127.0.0.1:3860
export OMNI_IMAGE_URL=http://127.0.0.1:3860
export OMNI_TTS_URL=http://127.0.0.1:3860
export OMNI_STT_URL=http://127.0.0.1:3860
export OMNI_VIDEO_URL=http://127.0.0.1:3860

curl -s http://127.0.0.1:3850/v1/images/generations \
  -H "Authorization: Bearer $KEY" -H 'Content-Type: application/json' \
  -d '{"prompt":"a red square"}'

curl -s http://127.0.0.1:3850/v1/audio/speech \
  -H "Authorization: Bearer $KEY" -H 'Content-Type: application/json' \
  -d '{"input":"hello","voice":"alloy"}' --output speech.wav

curl -s http://127.0.0.1:3850/v1/audio/transcriptions \
  -H "Authorization: Bearer $KEY" -F file=@clip.wav
```

Unset those URLs → HTTP 501 `{ "error": { "code": "engine_unconfigured" } }` (video still returns the fixture).

## License

MIT — same as GCTOAC.
