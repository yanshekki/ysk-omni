# GROK.md — YSK Omni

You are implementing **YSK Omni** in this repository.
Product owner: Ki / yanshekki. Speak and commit in the repo language already used (English for code/docs unless a README-ZH is requested).

## Mission

Turn this repo into a production OpenAI-compatible HTTP gateway that:

1. Keeps GCTOAC gateway features (API keys, AES queue, OTP Admin, DDoS, files, Media Studio, PM2/CLI lifecycle).
2. **Deletes** all `grok -p` / Grok CLI spawn paths.
3. Pulls models from Hugging Face and serves them on OpenAI-shaped routes.
4. Covers **text, image, video, voice** (TTS + STT) — not chat-only.

GCTOAC source of truth (read-only reference, do not modify that repo):

```
https://github.com/yanshekki/Grok-Cli-to-OpenAI-compatible
```

This account cannot GitHub-fork its own repo under a new name. Import history locally instead (Phase 0).

## Locked names

| Thing | Value |
|--|--|
| Product | YSK Omni |
| GitHub | yanshekki/ysk-omni |
| npm | `ysk-omni` |
| CLI bin | `ysk-omni` |
| CLI alias | `ysko` |
| Port | **3850** |
| PM2 name | `ysk-omni` |
| Home dir | `~/.ysk-omni` |
| Env prefix | `OMNI_` |
| API keys | `omni_live_...` / `omni_admin_...` |
| Product URL | https://ysk.hk/products/omni |

Never ship binaries named `gctoac`, `gcoa`, or `yo`.
Never listen on 3847 by default.

## Architecture (do not collapse into one process)

```
Client → YSK Omni :3850 (this TypeScript gateway)
          auth, queue, AES, Admin, Media Studio
            │
            ├─ text  → vLLM or llama-server (child process)
            ├─ image → diffusion worker (SGLang-Diffusion / Comfy headless)
            ├─ video → same queue + worker (OpenAI Videos job shape)
            ├─ tts   → Qwen3-TTS / CosyVoice server
            └─ stt   → faster-whisper process
```

Gateway stays Node/TypeScript. Inference stays out-of-process. Add a VRAM scheduler before loading a second heavy model.

## What to keep from GCTOAC

- Express app, `/v1/chat/completions`, `/v1/responses`, `/v1/messages`
- API key hashing, rate limit, DDoS, OTP Admin SPA
- Durable chat/job queue + AES-GCM
- Files / documents / Media Studio shell
- CLI lifecycle: setup, start, stop, status, doctor, logs, key, migrate
- Prisma + SQLite default
- Tests layout (Vitest)

## What to delete

- `src/services/grok-cli.service.ts` and every `spawn(grok)` / `GROK_BIN` path
- Grok session maps that only exist to resume `grok -p`
- Media providers that shell out to Grok tools
- package name `grok-cli-to-openai-compatible`, bins `gctoac`/`gcoa`
- Default port 3847, `GROK_*` env as required settings
- README claims of Grok CLI capability parity

Safe/agent **policy flags** may stay as names, but they must no longer mean "approve Grok shell tools". Rebind later to local tool policy or leave inert with a comment.

## What to add (by phase)

Follow `docs/GROK-BUILD-PLAN.md`. Do **one phase per Grok Build run** unless the user says otherwise. Stop and report when the phase checklist is green.

Phase 0 = import + rename + delete grok spawn + `ysk-omni --help`.
Phase 1 = HF pull + text `/v1/chat/completions` via llama-server or vLLM (echo fallback if no binary).
Phase 2 = image + audio endpoints.
Phase 3 = video jobs on the existing queue.
Phase 4 = Admin Catalog page + VRAM orchestrator.

## Engineering rules

- TypeScript strict. Match existing GCTOAC style (no speculative refactors).
- `npm test` / targeted vitest must stay runnable after each phase.
- Do not commit `.env`, weights, `node_modules`, or `dist/`.
- MIT license. Do not copy Grok / xAI trademarks into product copy.
- Curated HF catalog first; raw Hub search is Phase 4.
- Gated HF models need `HF_TOKEN`. Public GGUF should work without it when Hub allows.
- Video and heavy image jobs are async. Use the durable queue. Do not block HTTP for minutes.

## First command if the worktree is still empty besides these docs

```bash
git remote add gctoac https://github.com/yanshekki/Grok-Cli-to-OpenAI-compatible.git
git fetch gctoac
git merge gctoac/main --allow-unrelated-histories -m "chore: import GCTOAC gateway as YSK Omni lineage"
```

Then rename package/CLI/port and strip Grok spawn. That is Phase 0.
