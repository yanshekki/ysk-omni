#!/usr/bin/env bash
# Install gctoac globally from the npm registry (recommended path).
# Does NOT clone GitHub or use `npm install -g github:…`.
set -euo pipefail

PKG="${GCTOAC_NPM_PACKAGE:-grok-cli-to-openai-compatible}"
VERSION="${GCTOAC_NPM_VERSION:-latest}"

echo "[gctoac] Installing ${PKG}@${VERSION} globally from npm…"
npm install -g "${PKG}@${VERSION}" --no-fund --no-audit

BIN_DIR="$(npm config get prefix)/bin"
echo ""
echo "[gctoac] Done."
echo "[gctoac] Package: ${PKG}@${VERSION}"
echo "[gctoac] Bins:    $BIN_DIR/gctoac , $BIN_DIR/gcoa"
echo ""

if ! command -v gctoac >/dev/null 2>&1; then
  echo "[gctoac] NOTE: $BIN_DIR is not on your PATH."
  echo "         Add this to ~/.bashrc or ~/.zshrc:"
  echo "           export PATH=\"$BIN_DIR:\$PATH\""
  echo ""
  if [[ -x "$BIN_DIR/gctoac" ]]; then
    "$BIN_DIR/gctoac" version || true
  fi
else
  gctoac version || true
fi

echo "Next:"
echo "  gctoac doctor"
echo "  gctoac setup"
echo "  gctoac start"
