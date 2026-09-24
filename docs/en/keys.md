# API keys

Keys are `omni_live_…`. Create in Admin or CLI. The secret is shown once.

## Role and mode

| Field | Values |
|-------|--------|
| Role | `admin` · `client` |
| Mode | `safe` (external) · `agent` (full media + tools) |
| Rate | Requests per minute |
| IP allowlist | One IP or CIDR per line. Empty = all IPs |
| Allowed models | Multi-select + extra ids. Empty = all models |

Admin OTP sessions are unrestricted for models (empty allowlist).

## Allowlist

Stored as JSON on the key. Exact id match (`echo`, `piper/lessac-high`, `org/repo:Q4_K_M`).

- Empty list: no restriction
- Non-empty: chat, image, video, speech, transcribe, and `GET /v1/models` only accept those ids
- Miss → **403** `model_not_allowed`

```bash
ysk-omni key create -n app -r client -m safe --models echo,piper/lessac-high
ysk-omni key update <id> --models echo
```

Clients discover the list with `GET /v1/models`.
