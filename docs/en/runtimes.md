# Runtimes

Admin **Runtimes** lists inference tools by **host OS** (macOS, Linux, Windows): installed, missing, how to install.

## One-click install

Each card with an allowlisted plan has **Install**. The gateway runs Homebrew, pip, winget, or Docker as appropriate for this OS.

**Uninstall** asks for confirmation, then reverses that plan.

```bash
ysk-omni runtimes
ysk-omni runtimes install llamacpp
ysk-omni runtimes install ffmpeg
ysk-omni runtimes uninstall llamacpp
```

Runtime ids include `llamacpp`, `ffmpeg`, `mlx`, and others shown on the page.

Catalog **Load** still needs the binary on `PATH` (or `OMNI_LLAMA_SERVER`). Install here first if `doctor` reports llama-server missing.
