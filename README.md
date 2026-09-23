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

## License

MIT — same as GCTOAC.
