# YSK Omni — Grok Build plan

Execute **one phase per `grok -p` run**. Check the phase box list before stopping.
Source gateway: `yanshekki/Grok-Cli-to-OpenAI-compatible` @ latest `main` (currently 1.7.4).

---

## Phase 0 — Import, rename, kill `grok -p`

Goal: this repo contains the GCTOAC tree, branded YSK Omni, no Grok CLI child processes.

### 0.1 Import

```bash
git remote add gctoac https://github.com/yanshekki/Grok-Cli-to-OpenAI-compatible.git || true
git fetch gctoac
git merge gctoac/main --allow-unrelated-histories -m "chore: import GCTOAC gateway as YSK Omni lineage"
```

Resolve doc conflicts in favor of **this** repo's `README.md` and `GROK.md`.

### 0.2 Rename map

| Old | New |
|--|--|
| package `grok-cli-to-openai-compatible` | `ysk-omni` |
| bin `gctoac`, `gcoa` | `ysk-omni`, `ysko` |
| port `3847` | `3850` |
| PM2 name `grok-openai-gateway` | `ysk-omni` |
| `GROK_BIN` / spawn grok | delete |
| default model `grok-4.6` | no default until a local model is pulled |
| key prefix if any `gk_live_` | `omni_live_` |
| `STORAGE_DIR` default still local | `~/.ysk-omni` / `OMNI_HOME` |
| env `GROK_*` required | drop; keep only if a comment explains leftover |
| Admin title / footer Grok | YSK Omni |
| `update.service` GitHub repo + npm name | `yanshekki/ysk-omni` / `ysk-omni` |

Touch at least: `package.json`, `src/cli/index.ts`, `src/config/env.ts`, `src/config/constants.ts`, `src/services/pm2-config.ts`, `src/services/update.service.ts`, `.env.example`, `ecosystem.config.cjs`, Admin SPA strings.

### 0.3 Delete Grok runtime

Remove or gut so nothing execs `grok`:

- `src/services/grok-cli.service.ts`
- `src/services/grok-request-builder.service.ts`
- `src/services/grok-inspect.service.ts`
- `src/services/grok-session-map.service.ts`
- `src/services/grok-sessions.service.ts`
- `src/services/media/providers/grok-tools.provider.ts`

Chat / queue worker must return a clear `501` / typed error: `engine_unconfigured` until Phase 1 wires HF text.

Do **not** delete Admin, queue, encryption, keys, DDoS, files.

### 0.4 CLI still boots

```bash
npm install
npm run build   # or tsx path if dist skipped
npx ysk-omni --help
npx ysko --help
```

Help text must list `setup`, `start`, `stop`, `status`, `doctor`, `key`. No `gctoac` string in `--help`.

### Phase 0 done when

- [ ] GCTOAC sources are in this tree
- [ ] `package.json` name is `ysk-omni`, bins are `ysk-omni` + `ysko`
- [ ] default port 3850
- [ ] `rg -n "spawn\(.*grok|GROK_BIN|gctoac" src` is empty or only comments / changelog
- [ ] `ysk-omni --help` works
- [ ] existing unit tests that mocked grok are updated or skipped with a reason, not left red without comment

---

## Phase 1 — Hugging Face pull + text OpenAI API

Goal: `ysk-omni pull <hf>` stores a GGUF (or records a safetensors id); `POST /v1/chat/completions` talks to llama-server or vLLM; echo engine if neither binary exists.

### 1.1 Registry

`~/.ysk-omni/registry.json` + `src/services/hf/registry.ts`

Fields: `id`, `repoId`, `filename`, `path`, `quant`, `modality` (`text|image|video|tts|stt`), `runtime` (`llamacpp|vllm|echo|...`), `vramMb`, `pulledAt`, `sha256`.

### 1.2 Hub client

`src/services/hf/client.ts`

- Parse `org/repo`, `org/repo:Q4_K_M`, `hf.co/org/repo:quant`
- `GET https://huggingface.co/api/models/{id}/tree/main?recursive=1`
- Fallback `GET /api/models/{id}` siblings
- Prefer GGUF `Q4_K_M` when no quant given
- Resume download with `Range` to `OMNI_HOME/models/`
- `HF_TOKEN` for gated / datacenter 401

### 1.3 CLI

```
ysk-omni catalog              # curated JSON, not full Hub
ysk-omni show <spec>          # list GGUF files + pick
ysk-omni pull <spec>
ysk-omni models               # local registry
ysk-omni rm <id>
```

Ship `src/catalog/curated.json` with a small first pack (text only in this phase):

- `Qwen/Qwen2.5-0.5B-Instruct-GGUF` (llama.cpp)
- `Qwen/Qwen2.5-7B-Instruct` (vLLM safetensors)

### 1.4 Engines

- `src/services/runtimes/llama-server.ts` — spawn `llama-server -m <gguf>` or `llama-server -hf org/repo:quant` if no local file yet; proxy `/v1/chat/completions` stream.
- `src/services/runtimes/vllm.ts` — if `vllm` on PATH, `vllm serve <hf_id> --port <ephemeral>`.
- `src/services/runtimes/echo.ts` — labelled stub so CI / machines without GPU still pass API tests.

Router: pulled GGUF → llama-server if present; safetensors id → vLLM if present; else echo.

### 1.5 HTTP

- `GET /v1/models` — registry + `echo`
- `POST /v1/chat/completions` stream + non-stream (reuse existing response shaper if any)
- `POST /v1/models/pull` `{ "model": "org/repo:quant" }` NDJSON progress

`GET /v1/models` must **not** list Grok model ids.

### Phase 1 done when

- [ ] `ysk-omni show Qwen/Qwen2.5-0.5B-Instruct-GGUF` lists quants
- [ ] pull of a tiny/public GGUF works or is integration-skipped with recorded reason
- [ ] `POST /v1/chat/completions` with `model=echo` returns OpenAI JSON
- [ ] if `llama-server` exists, a pulled GGUF model streams tokens
- [ ] vitest covers spec parse, quant pick, registry upsert, echo chat

---

## Phase 2 — Image + voice

### Image

Keep GCTOAC routes `/v1/images/generations` and `/edits`.
Replace Grok provider with a worker:

- Preferred: HTTP to a local diffusion server (SGLang-Diffusion or Comfy headless) if `OMNI_IMAGE_URL` set.
- Fallback: 501 with `{ "error": { "code": "engine_unconfigured", "message": "image runtime not attached" } }` — never silent empty images.

Curated image ids (do not download in unit tests):

- Z-Image-Turbo
- FLUX.2 Klein 4B (Apache)

### Voice

- `POST /v1/audio/speech` → Qwen3-TTS or CosyVoice if `OMNI_TTS_URL` / binary present; else 501.
- `POST /v1/audio/transcriptions` → faster-whisper process; else 501.

Media Studio tabs should call these routes, not Grok tools.

### Phase 2 done when

- [ ] image/audio routes exist and never call `grok`
- [ ] unconfigured runtime = explicit 501 JSON
- [ ] configured runtime (env URL) proxies one successful fixture test or documented manual curl

---

## Phase 3 — Video jobs

Use **existing durable queue**. Shape:

- `POST /v1/videos` → `{ id, object: "video", status: "queued" }`
- `GET /v1/videos/{id}`
- `GET /v1/videos/{id}/content`

Worker: Comfy headless or SGLang-Diffusion video. VRAM exclusive. Default curated: LTX-2.5 (fast) and Wan 2.2 (quality), behind catalog flags.

Do not block the HTTP request until the mp4 exists.

### Phase 3 done when

- [ ] create returns queued job id
- [ ] worker updates status `in_progress` → `completed` or `failed`
- [ ] content download works for a fixture or documented local run

---

## Phase 4 — Catalog Admin + VRAM

- Admin tab **Catalog**: curated packs, modality filter, Pull button, progress via queue SSE
- Admin tab **Local models**: load / unload
- `src/services/vram-scheduler.ts`: each model declares `vramMb`; unload LRU when the next job does not fit; video jobs exclusive
- Optional Hub search box (HF API), results tagged `unsupported` unless runtime known

### Phase 4 done when

- [ ] Admin lists curated text+image+audio+video packs
- [ ] Pull from UI writes registry
- [ ] doctor prints loaded models + estimated VRAM

---

## Out of scope (do not do unless asked)

- Changing GCTOAC itself
- Publishing npm until Phase 1 is green and the owner says publish
- Training / LoRA UI (that is DatasetForge)
- Scraping all of Hugging Face into the Admin list
- Implementing a sampler inside Node
