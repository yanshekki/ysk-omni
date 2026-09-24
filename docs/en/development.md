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
