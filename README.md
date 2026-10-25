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

### 1.0.4 — 2026-10-11

### Security

- `express` 4.22.3 updates `path-to-regexp` to fix CVE-2026-4867.
- `prisma` / `@prisma/client` 6.19.3 update the `effect` dependency to resolve a security vulnerability.

### Dependency upgrades

- `pino-pretty` 13.1.3 → 13.2.0
- `tsx` 4.23.1 → 4.23.15
- `vite` 6.4.3 → 6.4.4
- `typescript-eslint` 8.64.0 → 8.71.1
- `prisma` 6.5.0 → 6.19.3
- `@prisma/client` 6.5.0 → 6.19.3
- `express` 4.22.2 → 4.22.3
- `@types/node` 22.20.1 → 22.20.5

### Internal/CI

- Bump the package version to 1.0.4, update Admin fixtures, and rebuild the Admin bundle so the sidebar shows v1.0.4.
- Keep Prisma CLI version pins in lockstep with `prisma` / `@prisma/client` 6.19.3.
- Clear the lint gate after the `typescript-eslint` bump (case-block scope, unused self-assign, generator `yield`, Admin ESLint glob).

### 1.0.3 — 2026-10-05

### Security

- Publish `ysk-omni` from GitHub Actions with npm Trusted Publishing (OIDC) and a provenance attestation. The release workflow does not use an npm token.

### Internal/CI

- `.github/workflows/release.yml` runs the test suite on a version tag, publishes that version when it is not already on the registry, checks `npm view ysk-omni@<version>`, and creates one GitHub Release.
- `README.md` and `README-ZH.md` list only the latest three versions, grouped by category. `CHANGELOG.md` and `CHANGELOG.zh.md` keep every version from 1.0.0.
- Development docs record this changelog rule.
- CI and the release workflow use GitHub Actions on the Node 24 runtime (`actions/checkout@v7`, `actions/setup-node@v7`, `softprops/action-gh-release@v3`). The publish job runs on Node 24.

Full changelog: [CHANGELOG.md](./CHANGELOG.md).

## License

MIT — see [LICENSE](./LICENSE).

## Author

**Ki (yanshekki)** — [YSK Limited](https://ysk.hk/). [linktr.ee/yanshekki](https://linktr.ee/yanshekki)
