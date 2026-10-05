# Development

## From source

```bash
git clone https://github.com/yanshekki/ysk-omni.git
cd ysk-omni
npm install
npx prisma generate
npx tsc -p tsconfig.json
npm run build:admin
ysk-omni --home ~/.ysk-omni start --foreground
```

## Admin

| Script | What |
|--------|------|
| `npm run build:admin` | Vite → `public/admin/boot.js` |
| `npm run dev:admin` | Vite :5174, proxy API → :3850 |
| `npm run typecheck:admin` | Admin TS |

Production entry is `admin/src/full/app.js`. Modular `admin/src/pages/*` is the testable path; do not switch a page off `full/app.js` until feature parity is complete.

UI copy: English + Hong Kong written Chinese in `admin/src/full/i18n.js`.

## Tests

See [tests/README.md](../../tests/README.md).

```bash
npm test
npm run test:admin
npm run test:api
npm run test:cli
npm run test:registry
```

Live media (optional): `OMNI_LIVE_TINY=1` or `OMNI_LIVE_BEST=1` plus `OMNI_LIVE_KEY`.

## Layout

| Path | Role |
|------|------|
| `src/` | Gateway, CLI |
| `admin/src/full/` | Production Admin SPA |
| `prisma/` | SQLite schema + migrations |
| `scripts/tiny-media-worker.py` | Local image/TTS/STT/video worker |
| `docs/en` · `docs/zh` | Product documentation |

## Releases and changelog

Push an annotated tag `vX.Y.Z` whose version matches `package.json` `"version"`. [`.github/workflows/release.yml`](../../.github/workflows/release.yml) — that filename, with no GitHub environment — runs the tests, then publishes to npm with Trusted Publishing. Authentication is GitHub Actions OIDC (`id-token: write`), and the publish includes a provenance attestation. Do not add an npm token (`NPM_TOKEN`, `NODE_AUTH_TOKEN`, or registry auth). If that version is already on the registry, the workflow skips publish, then runs `npm view ysk-omni@<version>` and creates or updates one GitHub Release.

Changelog rule:

- [`CHANGELOG.md`](../../CHANGELOG.md) and [`CHANGELOG.zh.md`](../../CHANGELOG.zh.md) record every version from 1.0.0, newest first.
- Group each version by category, and omit empty categories. English: New features, Improvements, Fixes, Security, Dependency upgrades, Internal/CI. Chinese ([`CHANGELOG.zh.md`](../../CHANGELOG.zh.md), Hong Kong written Chinese): 新功能、改進、修正、安全、依賴升級、內部／CI.
- Build entries from git history, tags, and GitHub Releases. Do not invent changes.
- Map commit types as follows: `feat` → New features; `fix` → Fixes; `security` / `fix(security)` → Security; `refactor`, `perf`, `style`, `i18n` → Improvements; dependency bumps → Dependency upgrades; `docs`, `test`, `chore`, `build`, `ci` → Internal/CI.
- [`README.md`](../../README.md) and [`README-ZH.md`](../../README-ZH.md) show only the latest three versions, in those same groups, and end with a link to the full changelog.
