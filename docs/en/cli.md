# CLI reference

Binary: `ysk-omni`. Alias: `ysko` (not `yo`).

```bash
ysk-omni --help
ysk-omni <command> --help
```

## Global flags

| Flag | Meaning |
|------|---------|
| `--home <path>` | Data home (default `~/.ysk-omni` or project root) |
| `--port <n>` | HTTP port (default **3850**) |
| `--json` | Machine-readable JSON where the command supports it |
| `-V, --version` | Package version |

Every command below also accepts the global flags.

## Lifecycle

| Command | What it does |
|---------|----------------|
| `setup` | Create data dirs, `.env`, migrate, seed admin key; tries `npm i -g pm2` |
| `start` | Start gateway. `-f, --foreground` · `--pm2` |
| `stop` | Stop background gateway |
| `restart` | Restart. `-f, --foreground` · `--pm2` |
| `status` | Process + health |
| `migrate` | `prisma migrate deploy` |
| `seed` | Seed bootstrap admin key if missing |
| `doctor` | Node, env, loaded models, VRAM, build, runner, port conflicts |
| `open` | Print API / Admin URLs. `--admin` prints Admin only |
| `version` | Package version |
| `update` | Self-update. `--check` · `--no-restart` · `--channel auto\|git\|npm-global\|npm-local` |

```bash
ysk-omni --home ~/.ysk-omni setup
ysk-omni start --foreground
ysk-omni start --pm2
ysk-omni doctor
ysk-omni update --check
```

## API keys

`key create` prints the secret **once**.

| Command | Flags |
|---------|-------|
| `key` | Bare form creates an **admin** key (compat). Prefer `key create` |
| `key create` | `-n <name>` `-r admin\|client` `-m safe\|agent` `--rate-limit <n>` `--models <id,id>` |
| `key admin` | Same as `key create -r admin`. `-n <name>` |
| `key list` | List keys (no secrets) |
| `key show <id>` | One key |
| `key update <id>` | `-n` `-r` `-m` `--rate-limit` `--active on\|off` `--models <ids>` |
| `key revoke <id>` | Revoke |
| `key activate <id>` | Re-activate |

`--models` is a comma-separated allowlist. Empty / omitted on create = all models. See [API keys](keys.md).

```bash
ysk-omni key create -n studio -r client -m agent --models echo,piper/lessac-high
ysk-omni key update <id> --models echo
```

## Admin panel

| Command | What it does |
|---------|----------------|
| `admin` / `admin status` | Panel on/off |
| `admin on` | Enable (settings DB) |
| `admin off` | Disable. Only `admin on` turns it back on |
| `admin otp` | One-time login code (alias `admin login-code`). 5 min, single use |
| `admin sessions` / `admin sessions list` | Active OTP sessions |
| `admin sessions revoke <id>` | Id prefix, or `all` / `all-expired` |

## Safety settings

| Command | Flags |
|---------|-------|
| `settings` / `settings get` | Show |
| `settings set` | `--global-safe on\|off` `--tools none\|readonly` `--max-turns <n>` `--timeout-ms <n>` `--default-model <id>` |
| `settings preset <name>` | `local` · `prod` · `code` · `read` · `chat` · `long` |

## Catalog and models

| Command | What it does |
|---------|----------------|
| `catalog` | Local registry. `--modality text\|image\|video\|tts\|stt` |
| `catalog search [q]` | Hub search (runnable runtimes). `--modality` |
| `catalog sync` | Cache top 50 GGUF ids by downloads (metadata only, no download) |
| `show <spec>` | List GGUF quants for `org/repo` or `org/repo:Q4_K_M` |
| `pull <spec>` | Pull GGUF or record a safetensors id |
| `models` | List local registry (includes `echo`) |
| `rm <id>` | Delete local registry row + files |
| `load <id>` | Load GGUF into llama-server (or vLLM) |
| `unload <id>` | Unload |

```bash
ysk-omni catalog --modality text
ysk-omni catalog search whisper --modality stt
ysk-omni catalog sync
ysk-omni pull Qwen/Qwen2.5-0.5B-Instruct-GGUF:Q2_K
ysk-omni load Qwen/Qwen2.5-0.5B-Instruct-GGUF:Q2_K
ysk-omni unload Qwen/Qwen2.5-0.5B-Instruct-GGUF:Q2_K
ysk-omni rm Qwen/Qwen2.5-0.5B-Instruct-GGUF:Q2_K
```

## Runtimes

| Command | What it does |
|---------|----------------|
| `runtimes` | Host OS, installed vs missing, install plan |
| `runtimes install <id>` | Homebrew / pip / winget / Docker (`llamacpp`, `ffmpeg`, `mlx`, …) |
| `runtimes uninstall <id>` | Reverse the install plan (confirm in Admin) |

## Chat queue

Bare `queue` = stats.

| Command | What it does |
|---------|----------------|
| `queue stats` | Depth and counts |
| `queue policy` / `policy get` | Show policy |
| `queue policy set` | Update policy fields |
| `queue policy preset <name>` | Named preset |
| `queue pause` / `resume` | Worker claiming |
| `queue drain` / `undrain` | Reject / allow new enqueues |
| `queue jobs` | List jobs |
| `queue job <id>` | One job |
| `queue cancel <id>` | Cancel |
| `queue requeue <id>` | Requeue |
| `queue priority <id> <n>` | Set priority |
| `queue purge-dead` | Delete dead/failed/cancelled. `-y, --yes` |

## DDoS and blacklist

Bare `ddos` = summary.

| Command | Flags |
|---------|-------|
| `ddos policy` / `policy get` | Show |
| `ddos policy set` | `--auto-ban` `--rate-limit-max` `--rate-limit-ip-max` `--chat-burst-max` `--failed-auth-threshold` `--rate-hit-threshold` `--max-concurrent-per-ip` `--velocity-max-requests` `--proxy-trust-hops` `--proxy-ip-source auto\|cloudflare\|nginx\|x-forwarded-for\|socket` |
| `ddos policy preset <name>` | `relaxed` · `balanced` · `strict` |
| `ddos policy reset` | Back to env defaults |
| `ddos ban <ip>` | `--ttl <seconds>` `--reason <text>` |
| `ddos unban <ip>` | Remove from blacklist |
| `ddos blacklist` | List active entries |

## Documents, chats, audit

| Command | What it does |
|---------|----------------|
| `docs` / `docs list` | `--limit` `--offset` |
| `docs show <id>` | One document |
| `docs delete <id>` | Delete |
| `chats` / `chats list` | Stored chat requests |
| `chats show <id>` | One request |
| `conversations list` | Playground threads |
| `conversations delete <id>` | Delete thread |
| `audit` / `audit list` | Audit log |
| `stats` | Dashboard-style DB summary |

## API feature flags

Parity with Admin → API features.

| Command | What it does |
|---------|----------------|
| `api features` / `api features get` | Show flags |
| `api features set` | `--openai-chat` `--openai-responses` `--anthropic-messages` `--tools` `--vision` `--images-api` `--audio-api` `--video-api` `--files-openai-alias` `--strict-sampling` … (each `on\|off`) |
| `api features preset <name>` | `open` · `locked` · `dev` |

## Logs

| Command | Flags |
|---------|-------|
| `logs` / `logs show` | `-n, --lines <n>` (default 40) |
| `logs clear` | Truncate PM2 and ysk-omni log files |
