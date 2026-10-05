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

### 1.0.3 — 2026-10-05

### Security

- Publish `ysk-omni` from GitHub Actions with npm Trusted Publishing (OIDC) and a provenance attestation. The release workflow does not use an npm token.

### Internal/CI

- `.github/workflows/release.yml` runs the test suite on a version tag, publishes that version when it is not already on the registry, checks `npm view ysk-omni@<version>`, and creates one GitHub Release.
- `README.md` and `README-ZH.md` list only the latest three versions, grouped by category. `CHANGELOG.md` and `CHANGELOG.zh.md` keep every version from 1.0.0.
- Development docs record this changelog rule.
- CI and the release workflow use GitHub Actions on the Node 24 runtime (`actions/checkout@v7`, `actions/setup-node@v7`, `softprops/action-gh-release@v3`). The publish job runs on Node 24.

### 1.0.2 — 2026-09-28

### Improvements

- Finish remaining Admin strings for eight languages (`683a52f`)
- Translate Admin strings 600–799 into eight languages (`8f77c6e`)
- Translate Admin strings 400–599 into eight languages (`03c1bc3`)
- Translate Admin strings 200–399 into eight languages (`dfebb9e`)
- Translate first 200 Admin strings into eight languages (`e891f6d`)

### Internal/CI

- Bump the package version, update fixtures, and rebuild the Admin bundle so the sidebar shows v1.0.2 (`03b3b1b`)

### 1.0.1 — 2026-09-27

### New features

- Show app version above the Admin logout button (`29f4a34`)
- Redesign Admin language picker as a custom dropdown (`c322086`)
- Admin language picker with 11 locales and Traditional/Simplified Chinese (`7d10af6`)
- Add Admin Business partnership page (`9688907`)

### Fixes

- Skip documentElement in Node tests and release 1.0.1 (`7eef3f9`)

### Internal/CI

- Wipe dist before tsc so stale build artifacts are not packed (`e127ae9`)

Full changelog: [CHANGELOG.md](./CHANGELOG.md).

## License

MIT — see [LICENSE](./LICENSE).

## Author

**Ki (yanshekki)** — [YSK Limited](https://ysk.hk/). [linktr.ee/yanshekki](https://linktr.ee/yanshekki)
