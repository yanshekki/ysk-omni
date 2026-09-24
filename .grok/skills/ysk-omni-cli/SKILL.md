---
name: ysk-omni-cli
description: >
  Run the ysk-omni / ys ko command-line controller: setup, start, catalog,
  pull, load, keys, runtimes, queue, ddos, admin otp. Use when the user asks
  to start the gateway, pull a model, create a key, or install llama-server.
  Slash: /ysk-omni-cli.
---

# YSK Omni CLI

Full flag list: [docs/en/cli.md](../../../docs/en/cli.md) · [docs/zh/cli.md](../../../docs/zh/cli.md).

Global: `--home <path>` `--port <n>` `--json`.

## Common flows

```bash
ysk-omni --home ~/.ysk-omni setup
ysk-omni admin otp
ysk-omni start --foreground

ysk-omni catalog search Qwen --modality text
ysk-omni pull org/repo:Q4_K_M
ysk-omni load <id>

ysk-omni key create -n app -r client -m safe --models echo
ysk-omni runtimes install llamacpp
ysk-omni doctor
```

Prefer documented commands over inventing flags. After adding a CLI command, update `docs/*/cli.md` and `tests/helpers/cli-registry.ts`.
