# Catalog

Admin **Catalog** and the CLI manage local weights. Pull does **not** start a download until you choose Pull on a row (or `ysk-omni pull`).

## Hub

The Hugging Face tab uses the official Hub REST API (`GET https://huggingface.co/api/models`, Link-header cursors). Sync caches the top 50 GGUF ids by downloads (metadata only).

Rows without a local runtime are hidden. Size is shown in one unit (MB or GB), plus an estimated VRAM hint when known.

## Pull queue

In-progress pulls live in a dedicated dock: percent, bytes, speed, ETA. Switching Admin tabs does not drop the dock. Failed pulls that downloaded nothing are not kept as a red banner.

## Local models

Pulled GGUF and snapshots (whisper, diffusion, T2V) appear under local models. Actions: **Load**, **Unload**, **delete**. You can also pull by Hub path.

```bash
ysk-omni catalog --modality image
ysk-omni catalog search sdxl --modality image
ysk-omni catalog sync
ysk-omni pull org/repo:Q4_K_M
ysk-omni models
ysk-omni load <id>
ysk-omni unload <id>
ysk-omni rm <id>
```

Load starts llama-server for GGUF. Safetensors text ids need vLLM. Diffusion / whisper / T2V are used by the media worker from disk, not llama-server.
