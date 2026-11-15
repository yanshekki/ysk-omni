# Operations

## Health

```bash
ysk-omni doctor
ysk-omni status
curl -sS http://127.0.0.1:3850/health
curl -sS http://127.0.0.1:3850/ready
```

`/ready` checks SQLite and whether `llama-server` is on PATH.

## Node.js runtime

The package `engines` field is Node.js 20 or later. Node 20 is end of life (final release 20.20.2) and has no fix for the Brotli out-of-bounds write (CVE-2026-111497) or the 2026-11-11 runtime issues. Production hosts should run at least **22.23.5**, **24.22.3**, or **26.13.1** (2026-11-11 security releases: CVE-2026-123863, CVE-2026-123864 and siblings). As of 2026-11-15 those are the current builds on those lines.

GitHub Actions CI (`.github/workflows/ci.yml`) runs the suite on Node 24. The release workflow publishes on Node 24 as well.

## Process manager

```bash
ysk-omni start --pm2
ysk-omni restart --pm2
ysk-omni logs -n 80
ysk-omni logs clear
```

Admin → PM2 can inspect the same process (`ysk-omni`). Changing port there rewrites config and restarts.

## Reverse proxy

Set `TRUST_PROXY` to the hop count (Cloudflare → nginx → app = `2`). `PROXY_IP_SOURCE` selects how the client IP is read so bans and audit use the real address.

## Updates

```bash
ysk-omni update --check
ysk-omni update
```

Admin → System → Package can check npm/GitHub and one-click update (brief API downtime).

## Port in use

`doctor` reports EADDRINUSE. Stop the extra runner (`ysk-omni stop` or PM2 stop) so only one process holds :3850.
