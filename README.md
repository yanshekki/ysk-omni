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

### 1.0.5 — 2026-10-25

### Security

- Upgrade `multer` 1.4.5-lts to 2.5.0 to fix CVE-2026-77078 (High multipart field-name DoS) and later 2.x multipart fixes through 2.5.0, including CVE-2026-113872. Upload routes still use `memoryStorage`. Multer limit errors now return 413 / 400 instead of 500.
- Pin transitive `body-parser` 1.20.9 (CVE-2026-111181 / GHSA-27r3-jxmh-p828) with an npm `overrides` entry so `express.json` and `urlencoded` get the patched parser.
- Upgrade `vite` 6.4.4 → 6.4.5 (GHSA-8g5g-mxqh-grgj). The advisory applies to the Admin Vite **dev** server; production serves the built static Admin bundle.
- Production hosts should run a Node.js build from the 2026-10-21 security releases (22.23.4, 24.22.1, 26.12.1, or current patched LTS) for CVE-2026-111497 and related runtime fixes. Package `engines` stay `>=20`.

### Dependency upgrades

- `multer` 1.4.5-lts.2 → 2.5.0
- `@types/multer` 1.4.13 → 2.3.0
- `body-parser` 1.20.8 → 1.20.9 (override)
- `vite` 6.4.4 → 6.4.5
- `typescript-eslint` 8.71.1 → 8.72.0

### Internal/CI

- Bump the package version to 1.0.5, update Admin fixtures, and rebuild the Admin bundle so the sidebar shows v1.0.5.

Full changelog: [CHANGELOG.md](./CHANGELOG.md).

## License

MIT — see [LICENSE](./LICENSE).

## Author

**Ki (yanshekki)** — [YSK Limited](https://ysk.hk/). [linktr.ee/yanshekki](https://linktr.ee/yanshekki)
