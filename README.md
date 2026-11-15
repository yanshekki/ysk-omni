# YSK Omni

[![CI](https://github.com/yanshekki/ysk-omni/actions/workflows/ci.yml/badge.svg)](https://github.com/yanshekki/ysk-omni/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/ysk-omni.svg)](https://www.npmjs.com/package/ysk-omni)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org/)

**Language:** English · [中文](./README-ZH.md)

Local Hugging Face models behind an OpenAI-compatible HTTP gateway. Text: llama-server / vLLM / echo. Image, speech, transcription, and video: separate workers.

| | |
|--|--|
| **CLI** | `ysk-omni` · alias `ysko` |
| **Default port** | **3850** |
| **Docs** | [docs/en](./docs/en/README.md) |
| **Product** | [ysk.hk/products/ysk-omni](https://ysk.hk/products/ysk-omni) |

```bash
npm install -g ysk-omni
ysk-omni setup
ysk-omni admin otp
ysk-omni start
```

Open `http://127.0.0.1:3850/admin/` with the one-time code. Pull a GGUF in Catalog, Load it, then:

```bash
curl -sS http://127.0.0.1:3850/v1/models \
  -H "Authorization: Bearer omni_live_…"
```

Full CLI, API, Admin, Catalog, Runtimes, keys, and operations: **[Documentation](./docs/en/README.md)**.

## Changelog

### 1.0.8 — 2026-11-15

### Security

- Upgrade `vite` 6.4.5 → **6.4.6** for GHSA-p4f5-76q4-ffq7 (Critical). Unescaped `__vite-browser-external` / `__vite-optional-peer-dep` virtual module IDs allowed RCE when the Vite **dev** server is exposed (`--host` / `server.host`). Affected: Vite `>=4.0.0,<=6.4.5`. Production Admin is a built static bundle; `dev:admin` and the locked Vite version are patched. Changelog: 6.4.6 (2026-11-09) “fix: escape ids in resolve virtual modules”.
- Vendor Admin DOMPurify **3.4.17 → 3.4.18** (`public/admin/vendor/purify.min.js`, official minified 3.4.18 build). 3.4.18 (2026-11-14) fixes a `SAFE_FOR_TEMPLATES` reparse bypass and hook allow-list leakage when a hook passes the config object back to `sanitize()`. Chat markdown still sanitizes with `USE_PROFILES: { html: true }`.
- Production hosts should run Node ≥22.23.5, ≥24.22.3, or ≥26.13.1 (2026-11-11 security releases: CVE-2026-123863, CVE-2026-123864 and siblings). Package `engines` stay `>=20`. CI stays on Node 24.

### Dependency upgrades

- `vite` 6.4.5 → 6.4.6
- `typescript-eslint` 8.72.1 → 8.72.2, including the matching `@typescript-eslint/*` packages (plugin bugfixes: prefer-string-starts-ends-with, no-deprecated circular aliases, no-unnecessary-type-assertion, prefer-nullish-coalescing)
- Transitive `qs` override **6.16.2 → 6.17.1**. 6.16.2 is already OSV-clean for GHSA-6pq8-jhm2-2vcw / CVE-2026-110816 and GHSA-w4cr-vjpx-p82q / CVE-2026-110910; 6.17.1 is current 6.x. Matches GCtoAC 1.7.9.
- Align package.json floors `cors` `^2.8.6` and `@types/cors` `^2.8.19` (lockfile already resolved those versions).

### Internal/CI

- Bump the package version to 1.0.8, update Admin fixtures, and rebuild the Admin bundle so the sidebar shows v1.0.8.
- Getting started and operations docs (English and 中文) record the 2026-11-11 production Node floor. `engines` and CI Node 24 are unchanged.

### 1.0.7 — 2026-11-08

### Security

- Pin transitive `qs` at **6.16.2** via `overrides` (express and body-parser declare `~6.16.0`). Lockfile was 6.16.0, which is inside GHSA-6pq8-jhm2-2vcw / CVE-2026-110816 (moderate, `qs.stringify` with `arrayFormat: 'comma'` throws on a non-callable own `toString`; patched in 6.16.1) and GHSA-w4cr-vjpx-p82q / CVE-2026-110910 (low, `allowEmptyArrays` did not encode empty-array keys; patched in 6.16.2). qs 6.17.1 is the latest 6.x and is also clean; this pin matches GCtoAC.
- Vendor Admin DOMPurify **3.2.4 → 3.4.17** (`public/admin/vendor/purify.min.js`). 3.2.4 is inside CVE-2025-15599 (fixed in 3.2.7) and CVE-2026-0540 (fixed in 3.3.2). 3.4.17 is the current npm 3.x with no known advisories. Chat markdown still sanitizes with `USE_PROFILES: { html: true }`.

### Internal/CI

- Bump the package version to 1.0.7, update Admin fixtures, and rebuild the Admin bundle so the sidebar shows v1.0.7.
- Operations docs (English and 中文) re-check the Node current builds as of 2026-11-08: still 22.23.4, 24.22.2, and 26.13.0. Production floor stays ≥22.23.4, ≥24.22.1, or ≥26.12.1.

### 1.0.6 — 2026-11-01

### Security

- CI (`.github/workflows/ci.yml`) runs the test job on Node 24 instead of Node 20. Node 20 is end of life (final release 20.20.2) and has no fix for CVE-2026-111497 (Brotli out-of-bounds write). The release workflow already publishes on Node 24. Package `engines` stay `>=20`.
- Production hosts should run Node ≥22.23.4, ≥24.22.1, or ≥26.12.1. As of 2026-11-01 the current builds on those lines are 22.23.4, 24.22.2, and 26.13.0.

### Dependency upgrades

- `typescript-eslint` 8.72.0 → 8.72.1, including the matching `@typescript-eslint/*` packages. Other direct dependencies were already at the latest within-major version in the lockfile and were not changed.

### Internal/CI

- Bump the package version to 1.0.6, update Admin fixtures, and rebuild the Admin bundle so the sidebar shows v1.0.6.
- Getting started, operations, and development docs (English and 中文) record the Node 24 CI job and the production Node floor.
- Type the Admin `formatApiError` fallback body as the error object so `npm run typecheck:admin` accepts `details.feature`, `details.flag`, and `details.reason`. Runtime behavior is unchanged.

Full changelog: [CHANGELOG.md](./CHANGELOG.md).

## License

MIT — see [LICENSE](./LICENSE).

## Author

**Ki (yanshekki)** — [YSK Limited](https://ysk.hk/). [linktr.ee/yanshekki](https://linktr.ee/yanshekki)
