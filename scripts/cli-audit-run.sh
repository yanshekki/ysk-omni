#!/usr/bin/env bash
# Strict gctoac CLI audit: run every leaf command once in an isolated --home.
# Usage: bash scripts/cli-audit-run.sh
set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

HOME_CLI="${HOME_CLI:-/tmp/gctoac-cli-audit-$$}"
PORT="${PORT:-13947}"
BIN=(node dist/cli/index.js --home "$HOME_CLI" --port "$PORT")
REPORT="${REPORT:-$HOME_CLI/audit-report.tsv}"
mkdir -p "$HOME_CLI"
: >"$REPORT"

pass=0
fail=0
skip=0
expect_fail=0

run() {
  local name="$1"
  shift
  local expect="${1:-0}" # 0 = expect success, 1 = expect non-zero, skip = skip
  shift || true
  if [[ "$expect" == "skip" ]]; then
    echo -e "SKIP\t$name\t$1" | tee -a "$REPORT"
    skip=$((skip + 1))
    return 0
  fi
  local out rc
  set +e
  out="$("${BIN[@]}" "$@" 2>&1)"
  rc=$?
  set -e
  local summary
  summary="$(echo "$out" | tr '\n' ' ' | head -c 160)"
  if [[ "$expect" == "0" ]]; then
    if [[ $rc -eq 0 ]]; then
      echo -e "PASS\t$name\t$rc\t$summary" | tee -a "$REPORT"
      pass=$((pass + 1))
    else
      echo -e "FAIL\t$name\t$rc\t$summary" | tee -a "$REPORT"
      fail=$((fail + 1))
    fi
  else
    # expect non-zero
    if [[ $rc -ne 0 ]]; then
      echo -e "PASS\t$name\t$rc (expected fail)\t$summary" | tee -a "$REPORT"
      expect_fail=$((expect_fail + 1))
      pass=$((pass + 1))
    else
      echo -e "FAIL\t$name\t$rc (wanted fail)\t$summary" | tee -a "$REPORT"
      fail=$((fail + 1))
    fi
  fi
}

echo "=== gctoac CLI audit ==="
echo "HOME=$HOME_CLI PORT=$PORT"
echo "BIN=${BIN[*]}"
echo

# L help
run "help" 0 --help
run "help-key" 0 help key
run "help-admin" 0 help admin
run "help-queue" 0 help queue
run "help-ddos" 0 help ddos
run "help-settings" 0 help settings
run "help-api" 0 help api
run "help-docs" 0 help docs
run "help-chats" 0 help chats
run "help-conversations" 0 help conversations
run "help-audit" 0 help audit
run "help-logs" 0 help logs
run "help-update" 0 help update

# A basics (no DB yet for some)
run "version" 0 version
run "open" 0 open
run "open-admin" 0 open --admin
# doctor before setup: expect non-zero (.env missing)
run "doctor-before-setup" 1 doctor

# Setup (may try pm2 global install — ignore side effects)
run "setup" 0 setup
run "migrate" 0 migrate
run "seed" 0 seed
run "doctor" 0 doctor

# Capture a key id for later
KEY_OUT="$("${BIN[@]}" key create -n audit-key -r client -m safe 2>&1)" || true
KEY_ID="$(echo "$KEY_OUT" | sed -n 's/^[[:space:]]*id:[[:space:]]*//p' | head -1)"
echo "KEY_ID=$KEY_ID"

run "key-create" 0 key create -n audit-key2 -r client
run "key-list" 0 key list
if [[ -n "${KEY_ID:-}" ]]; then
  run "key-show" 0 key show "$KEY_ID"
  run "key-update" 0 key update "$KEY_ID" -n audit-renamed --rate-limit 99
  run "key-revoke" 0 key revoke "$KEY_ID"
  run "key-activate" 0 key activate "$KEY_ID"
else
  run "key-show" skip "no key id"
  run "key-update" skip "no key id"
  run "key-revoke" skip "no key id"
  run "key-activate" skip "no key id"
fi
run "key-admin" 0 key admin -n audit-admin
# bare key defaults to admin create
run "key-bare" 0 key

# Admin panel
run "admin" 0 admin
run "admin-status" 0 admin status
run "admin-off" 0 admin off
run "admin-on" 0 admin on
run "admin-otp" 0 admin otp
run "admin-sessions" 0 admin sessions
run "admin-sessions-list" 0 admin sessions list
run "admin-sessions-revoke-expired" 0 admin sessions revoke all-expired

# Settings
run "settings" 0 settings
run "settings-get" 0 settings get
run "settings-set" 0 settings set --global-safe off --max-turns 8
run "settings-preset" 0 settings preset local

# Queue
run "queue" 0 queue
run "queue-stats" 0 queue stats
run "queue-policy" 0 queue policy
run "queue-policy-get" 0 queue policy get
run "queue-policy-set" 0 queue policy set --enabled on --global-concurrency 3
run "queue-policy-preset" 0 queue policy preset balanced
run "queue-pause" 0 queue pause
run "queue-resume" 0 queue resume
run "queue-drain" 0 queue drain
run "queue-undrain" 0 queue undrain
run "queue-jobs" 0 queue jobs
run "queue-job-missing" 1 queue job 00000000-0000-4000-8000-000000000000
run "queue-cancel-missing" 1 queue cancel 00000000-0000-4000-8000-000000000000
run "queue-requeue-missing" 1 queue requeue 00000000-0000-4000-8000-000000000000
run "queue-priority-missing" 1 queue priority 00000000-0000-4000-8000-000000000000 10
run "queue-purge-dead-noyes" 1 queue purge-dead
run "queue-purge-dead" 0 queue purge-dead -y

# DDoS
run "ddos" 0 ddos
run "ddos-policy" 0 ddos policy
run "ddos-policy-get" 0 ddos policy get
run "ddos-policy-set" 0 ddos policy set --auto-ban on --rate-limit-max 100
run "ddos-policy-preset" 0 ddos policy preset balanced
run "ddos-policy-reset" 0 ddos policy reset
run "ddos-ban" 0 ddos ban 203.0.113.1 --ttl 60 --reason audit
run "ddos-blacklist" 0 ddos blacklist
run "ddos-unban" 0 ddos unban 203.0.113.1

# Data
run "docs" 0 docs
run "docs-list" 0 docs list
run "docs-show-missing" 1 docs show 00000000-0000-4000-8000-000000000000
run "docs-delete-noyes" 1 docs delete 00000000-0000-4000-8000-000000000000
run "docs-delete-missing" 1 docs delete 00000000-0000-4000-8000-000000000000 -y
run "chats" 0 chats
run "chats-list" 0 chats list
run "chats-show-missing" 1 chats show 00000000-0000-4000-8000-000000000000
run "conversations" 0 conversations
run "conversations-list" 0 conversations list
run "conversations-delete-noyes" 1 conversations delete 00000000-0000-4000-8000-000000000000
run "conversations-delete-missing" 1 conversations delete 00000000-0000-4000-8000-000000000000 -y
run "audit" 0 audit
run "audit-list" 0 audit list
run "stats" 0 stats

# API features
run "api-features" 0 api features
run "api-features-get" 0 api features get
run "api-features-set" 0 api features set --tools on --vision on
run "api-features-preset" 0 api features preset open

# Logs
run "logs" 0 logs -n 5
run "logs-show" 0 logs show -n 5
run "logs-clear" 0 logs clear

# Runtime (detached start/stop) — no PM2
run "start" 0 start
sleep 2
run "status" 0 status
run "models" 0 models
run "stop" 0 stop
run "restart" 0 restart
sleep 2
run "stop-after-restart" 0 stop

# Update check only
run "update-check" 0 update --check

# JSON mode sample
run "json-settings" 0 --json settings get
run "json-queue" 0 --json queue stats
run "json-api" 0 --json api features get

echo
echo "=== SUMMARY ==="
echo "PASS=$pass FAIL=$fail SKIP=$skip (expected-fail-as-pass counted in PASS)"
echo "Report: $REPORT"
echo "Home: $HOME_CLI"

if [[ $fail -gt 0 ]]; then
  exit 1
fi
exit 0
