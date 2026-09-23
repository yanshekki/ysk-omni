#!/usr/bin/env bash
# API audit against a running gateway (optional; unit/integration tests are primary).
# Usage: API_KEY=gk_live_... ADMIN_KEY=gk_live_... BASE_URL=http://127.0.0.1:3847 bash scripts/api-audit-run.sh
set -u
BASE_URL="${BASE_URL:-http://127.0.0.1:3847}"
API_KEY="${API_KEY:-}"
ADMIN_KEY="${ADMIN_KEY:-$API_KEY}"

if [[ -z "$API_KEY" ]]; then
  echo "Set API_KEY (and optionally ADMIN_KEY, BASE_URL)"
  echo "Prefer: npm test  (in-process full matrix with mocks)"
  exit 1
fi

pass=0
fail=0
run() {
  local name="$1" method="$2" path="$3" key="$4"
  shift 4 || true
  local code
  code=$(curl -sS -o /tmp/gog-api-audit.json -w '%{http_code}' -X "$method" \
    "${BASE_URL}${path}" \
    -H "Authorization: Bearer ${key}" \
    -H "Content-Type: application/json" \
    "$@" || echo 000)
  if [[ "$code" =~ ^2 ]]; then
    echo "PASS $name ($code)"
    pass=$((pass + 1))
  else
    echo "FAIL $name ($code) $(head -c 120 /tmp/gog-api-audit.json 2>/dev/null)"
    fail=$((fail + 1))
  fi
}

run "health" GET "/health" ""
run "ready" GET "/ready" ""
run "models" GET "/v1/models" "$API_KEY"
run "models-one" GET "/v1/models/grok-4.5" "$API_KEY"
run "chat" POST "/v1/chat/completions" "$API_KEY" \
  -d '{"model":"grok-4.5","messages":[{"role":"user","content":"Reply: pong"}],"stream":false}'
run "messages" POST "/v1/messages" "$API_KEY" \
  -d '{"model":"grok-4.5","max_tokens":32,"messages":[{"role":"user","content":"hi"}]}'
run "responses" POST "/v1/responses" "$API_KEY" \
  -d '{"model":"grok-4.5","input":"hi","stream":false}'
run "admin-me" GET "/admin/api/me" "$ADMIN_KEY"
run "admin-stats" GET "/admin/api/stats" "$ADMIN_KEY"
run "admin-queue" GET "/admin/api/queue/stats" "$ADMIN_KEY"
run "admin-ddos" GET "/admin/api/ddos/policy" "$ADMIN_KEY"
run "admin-features" GET "/admin/api/api-features" "$ADMIN_KEY"

echo "SUMMARY pass=$pass fail=$fail"
[[ $fail -eq 0 ]]
