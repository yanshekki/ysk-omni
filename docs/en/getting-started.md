# Getting started

## Requirements

- Node.js 20 or later
- Text GGUF: `llama-server` on `PATH`, or `OMNI_LLAMA_SERVER`
- Text safetensors: `vLLM` (`OMNI_VLLM`)
- Image / speech / video: an OpenAI-shaped HTTP worker (see [Media](media.md))

## Install and start

```bash
npm install -g ysk-omni

ysk-omni doctor
ysk-omni setup          # data dir, .env, migrate, seed admin key
ysk-omni start          # http://127.0.0.1:3850
ysk-omni start --pm2    # same process under PM2
```

Data home defaults to `~/.ysk-omni`. Override with `--home` or `OMNI_HOME`.

## Admin login

Admin does not store a long-lived API key in the browser. Mint a one-time code:

```bash
ysk-omni admin otp
```

Open `http://127.0.0.1:3850/admin/` and enter the code (five minutes, single use).

## First model

```bash
ysk-omni catalog search Qwen --modality text
ysk-omni pull Qwen/Qwen2.5-0.5B-Instruct-GGUF:Q2_K
ysk-omni load Qwen/Qwen2.5-0.5B-Instruct-GGUF:Q2_K
```

Without a loaded engine, use `model=echo` for protocol tests.

## First API call

```bash
export KEY=$(ysk-omni --home ~/.ysk-omni key create -n demo -r client -m safe --json | ...)

curl -sS http://127.0.0.1:3850/v1/models \
  -H "Authorization: Bearer omni_live_…"

curl -sS http://127.0.0.1:3850/v1/chat/completions \
  -H "Authorization: Bearer omni_live_…" \
  -H 'Content-Type: application/json' \
  -d '{"model":"echo","messages":[{"role":"user","content":"hello"}]}'
```

`GET /v1/models` lists ids this key may use. Restrict a key with `--models` (see [API keys](keys.md)).

Print URLs:

```bash
ysk-omni open
ysk-omni open --admin
```
