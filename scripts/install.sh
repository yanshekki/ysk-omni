#!/usr/bin/env bash
# Install ysk-omni globally from the npm registry (recommended path).
# Does NOT clone GitHub or use `npm install -g github:…`.
set -euo pipefail

PKG="${GCTOAC_NPM_PACKAGE:-ysk-omni}"
VERSION="${GCTOAC_NPM_VERSION:-latest}"

echo "[ysk-omni] Installing ${PKG}@${VERSION} globally from npm…"
npm install -g "${PKG}@${VERSION}" --no-fund --no-audit

BIN_DIR="$(npm config get prefix)/bin"
echo ""
echo "[ysk-omni] Done."
echo "[ysk-omni] Package: ${PKG}@${VERSION}"
echo "[ysk-omni] Bins:    $BIN_DIR/ysk-omni , $BIN_DIR/ysko"
echo ""

if ! command -v ysk-omni >/dev/null 2>&1; then
  echo "[ysk-omni] NOTE: $BIN_DIR is not on your PATH."
  echo "         Add this to ~/.bashrc or ~/.zshrc:"
  echo "           export PATH=\"$BIN_DIR:\$PATH\""
  echo ""
  if [[ -x "$BIN_DIR/ysk-omni" ]]; then
    "$BIN_DIR/ysk-omni" version || true
  fi
else
  ysk-omni version || true
fi

echo "Next:"
echo "  ysk-omni doctor"
echo "  ysk-omni setup"
echo "  ysk-omni start"
