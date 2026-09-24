#!/usr/bin/env bash
# Live tiny media worker (Piper + faster-whisper tiny + optional tiny-sd).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OMNI_HOME="${OMNI_HOME:-$HOME/.ysk-omni}"
VENV="${OMNI_HOME}/venvs/tiny-media"
export OMNI_HOME
export TINY_WORKER_PORT="${TINY_WORKER_PORT:-3870}"
export TINY_MEDIA_CACHE="${TINY_MEDIA_CACHE:-$OMNI_HOME/models/tiny}"
if [[ ! -x "$VENV/bin/python" ]]; then
  echo "Create venv first: python3.12 -m venv $VENV && $VENV/bin/pip install faster-whisper piper-tts pillow" >&2
  exit 1
fi
exec "$VENV/bin/python" "$ROOT/scripts/tiny-media-worker.py"
