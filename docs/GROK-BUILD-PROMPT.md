# Copy-paste prompts for Grok Build

Run from a clone of `yanshekki/ysk-omni`.

```bash
git clone https://github.com/yanshekki/ysk-omni.git
cd ysk-omni
```

Use official Grok Build (`grok`). One phase per run.

## Phase 0

```text
Read GROK.md and docs/GROK-BUILD-PLAN.md in this repo.

Execute Phase 0 only:
1. git remote add gctoac https://github.com/yanshekki/Grok-Cli-to-OpenAI-compatible.git (ok if exists)
2. git fetch gctoac && git merge gctoac/main --allow-unrelated-histories
3. Keep this repo README.md and GROK.md if they conflict.
4. Rename package to ysk-omni. CLI bins: ysk-omni and ysko. Default port 3850. PM2 name ysk-omni.
5. Delete every grok -p / GROK_BIN spawn path. Chat worker must return engine_unconfigured until Phase 1.
6. Do not delete Admin, queue, AES, keys, DDoS, files.
7. Stop when: ysk-omni --help works, no gctoac bin, rg for spawn grok is clean.

Commit in small logical commits. Do not publish npm.
```

## Phase 1

```text
Read GROK.md and docs/GROK-BUILD-PLAN.md Phase 1.
Implement Hugging Face pull + text OpenAI API only.
Add registry, Hub client, ysk-omni catalog/show/pull/models/rm,
llama-server + vLLM + echo engines, GET /v1/models, POST /v1/chat/completions,
POST /v1/models/pull.
Echo must work without GPU. Tests for spec/quant/registry/echo.
Stop at Phase 1 checklist. Do not start image/video.
```

## Phase 2

```text
Read GROK.md and docs/GROK-BUILD-PLAN.md Phase 2.
Wire /v1/images/generations + /edits and /v1/audio/speech + /transcriptions
to env-configured workers. No grok spawn. Unconfigured = 501 JSON.
Stop at Phase 2 checklist.
```

## Phase 3

```text
Read GROK.md and docs/GROK-BUILD-PLAN.md Phase 3.
Implement OpenAI Videos job API on the existing durable queue.
Stop at Phase 3 checklist.
```

## Phase 4

```text
Read GROK.md and docs/GROK-BUILD-PLAN.md Phase 4.
Admin Catalog + local models + VRAM scheduler.
Stop at Phase 4 checklist.
```
