---
name: ysk-omni
description: >
  Operate and change the YSK Omni gateway repo (local Hugging Face models,
  OpenAI-compatible HTTP on :3850, Admin SPA). Use when working on ysk-omni,
  the Admin panel, catalog, runtimes, keys, or this Mac’s ~/.ysk-omni home.
  Triggers: ysk-omni, ys ko, omni gateway, Admin OTP, catalog pull, llama-server.
---

# YSK Omni product rules

Read [docs/en/README.md](../../../docs/en/README.md) (Chinese: [docs/zh](../../../docs/zh/README.md)).

## Runtime

- Home: `~/.ysk-omni`. Gateway **:3850**. CLI: `ysk-omni` / `ysko`.
- Admin: `ysk-omni admin otp` then `http://127.0.0.1:3850/admin/`. Hard-refresh after `npm run build:admin`.
- Text: llama-server / vLLM / `echo`. Media: `OMNI_IMAGE_URL` / `OMNI_TTS_URL` / `OMNI_STT_URL` / `OMNI_VIDEO_URL`.
- Production Admin source: `admin/src/full/app.js` → `public/admin/boot.js`.

## Copy

Admin and product docs: Hong Kong written Chinese + English with the same meaning. No Grok / GCTOAC product copy.

## Git

Small logical commits on `yanshekki/ysk-omni` `main` (`git fetch origin`, merge `origin/main` if behind, `git push origin HEAD:main`). No rebase, force-push, or npm publish unless asked.

## Do not

Spawn an external coding CLI for chat. Do not reintroduce `grok` identifiers in user-facing strings or `src/`.
