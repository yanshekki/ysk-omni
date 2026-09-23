#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://127.0.0.1:3847}"
API_KEY="${API_KEY:-}"

if [[ -z "$API_KEY" ]]; then
  echo "Usage: API_KEY=gk_live_... ./scripts/smoke.sh"
  exit 1
fi

echo "== health =="
curl -fsS "$BASE_URL/health" | tee /tmp/gog-health.json
echo

echo "== ready =="
curl -fsS "$BASE_URL/ready" | tee /tmp/gog-ready.json
echo

echo "== models =="
curl -fsS "$BASE_URL/v1/models" -H "Authorization: Bearer $API_KEY" | tee /tmp/gog-models.json
echo

echo "== chat =="
curl -fsS "$BASE_URL/v1/chat/completions" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"grok-4.5","messages":[{"role":"user","content":"Reply with exactly: pong"}]}' \
  | tee /tmp/gog-chat.json
echo

echo "Smoke OK"
