# YSK Omni

Local Hugging Face models. OpenAI-shaped APIs. Text, image, video, voice.

| | |
|--|--|
| **CLI** | `ysk-omni` · alias `ysko` |
| **Default port** | **3850** |
| **Product** | [ysk.hk/products/omni](https://ysk.hk/products/omni) |
| **Lineage** | Conceptual fork of [Grok-Cli-to-OpenAI-compatible](https://github.com/yanshekki/Grok-Cli-to-OpenAI-compatible) — keep the gateway, remove `grok -p` |

GCTOAC (`gctoac` :3847) stays the Grok CLI product. YSK Omni is the local multimodal runtime.

## Status

Bootstrap repo. Import GCTOAC source and execute the plan with Grok Build:

1. Open this repo in a worktree.
2. Read [`GROK.md`](./GROK.md) then [`docs/GROK-BUILD-PLAN.md`](./docs/GROK-BUILD-PLAN.md).
3. Run the import + Phase 0 task in `GROK.md`.

```bash
grok --cwd . -p "Read GROK.md and docs/GROK-BUILD-PLAN.md. Execute Phase 0 only. Stop when ysk-omni CLI --help works and grok -p is gone."
```

## Intended CLI

```bash
ysk-omni setup
ysk-omni catalog --modality text
ysk-omni pull Qwen/Qwen2.5-7B-Instruct-GGUF:Q4_K_M
ysk-omni start
ysk-omni doctor
```

Alias: `ysko` → same binary. Do not use `yo` (Yeoman).

## Local workers

Text chat with a pulled GGUF needs `llama-server` on `PATH` (or `OMNI_LLAMA_SERVER`). Load the model in Admin Catalog, then `POST /v1/chat/completions` with that model id. Safetensors ids need `vllm` (`OMNI_VLLM`). Without those binaries, use `model=echo`.

Image / speech / transcription / video workers are HTTP:

```bash
# OpenAI-shaped image worker
export OMNI_IMAGE_URL=http://127.0.0.1:7860
curl -s http://127.0.0.1:3850/v1/images/generations \
  -H "Authorization: Bearer $KEY" -H 'Content-Type: application/json' \
  -d '{"prompt":"a red square"}'

# TTS
export OMNI_TTS_URL=http://127.0.0.1:9880
curl -s http://127.0.0.1:3850/v1/audio/speech \
  -H "Authorization: Bearer $KEY" -H 'Content-Type: application/json' \
  -d '{"input":"hello","voice":"alloy"}' --output speech.mp3

# STT (multipart file is forwarded to the worker)
export OMNI_STT_URL=http://127.0.0.1:9881
curl -s http://127.0.0.1:3850/v1/audio/transcriptions \
  -H "Authorization: Bearer $KEY" -F file=@clip.wav

# Video worker (optional). Without it, jobs complete with a tiny ftyp fixture.
export OMNI_VIDEO_URL=http://127.0.0.1:8188
```

Unset those URLs → HTTP 501 `{ "error": { "code": "engine_unconfigured" } }`.

## License

MIT — same as GCTOAC.
