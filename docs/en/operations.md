# Operations

## Health

```bash
ysk-omni doctor
ysk-omni status
curl -sS http://127.0.0.1:3850/health
curl -sS http://127.0.0.1:3850/ready
```

`/ready` checks SQLite and whether `llama-server` is on PATH.

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
