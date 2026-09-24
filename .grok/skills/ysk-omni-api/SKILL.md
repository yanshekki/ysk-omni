---
name: ysk-omni-api
description: >
  Call or implement YSK Omni OpenAI-compatible HTTP: GET /v1/models, chat
  completions, images, videos, audio speech and transcriptions, key allowlists,
  omni.asset_ids. Use when adding endpoints, debugging 403 model_not_allowed,
  or writing curl against :3850.
---

# YSK Omni HTTP API

Canonical reference: [docs/en/api.md](../../../docs/en/api.md) · [docs/zh/api.md](../../../docs/zh/api.md). Keys: [docs/en/keys.md](../../../docs/en/keys.md). Media: [docs/en/media.md](../../../docs/en/media.md).

## Rules

- Auth: `Authorization: Bearer omni_live_…`.
- `GET /v1/models` is the allowlist-aware catalog (`modality` / `runtime`).
- Chat `/v1/chat/completions` is text (llama-server / vLLM / echo). Media ids use `/v1/images/*`, `/v1/videos`, `/v1/audio/*`.
- Gateway extension field is **`omni`** (e.g. `omni.asset_ids`), not a third-party vendor block.
- 403 `model_not_allowed` when the key allowlist is set and the id is missing.
- 501 `engine_unconfigured` when the text or media worker is not attached.

When adding a public route, register it in `tests/integration/v1/routes.registry.test.ts` and update `docs/*/api.md`.
