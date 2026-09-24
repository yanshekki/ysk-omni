# Test suite

Vitest multi-project layout for Admin pages, Admin + v1 APIs, and CLI.

## Projects

| Project | Environment | Includes |
|---------|-------------|----------|
| `server` | node | `tests/unit/**`, `tests/integration/**` |
| `admin-node` | node | `tests/admin/unit/l1|l2`, `tests/admin/contract` |
| `admin-dom` | happy-dom | `tests/admin/unit/l3` |

## Scripts

```bash
npm test                 # full suite
npm run test:admin       # Admin L1–L3
npm run test:admin:l3    # page DOM only
npm run test:api         # integration API subset
npm run test:cli         # CLI unit + smoke
npm run test:registry    # fail if a route/page/command is unlisted
npm run test:coverage    # coverage report
```

## Adding a surface

### New Admin page

1. `PageId` + `PAGE_HASH` + `NAV_ITEMS` in `admin/src/config/constants.ts`
2. `pagePrimaryGetPath` in `admin/src/pages/page-api.ts`
3. Register renderer in `admin/src/router.ts`
4. L3: `tests/admin/unit/l3/<page>.page.test.ts`
5. Primary GET in `tests/integration/admin/routes.registry.test.ts`

### New Admin or v1 endpoint

1. Route in `src/routes/**`
2. Row in `ADMIN_COVERAGE` or `V1_COVERAGE`
3. Real hit test referenced by `coveredBy`
4. `npm run test:registry`

### New CLI command

1. Register in `src/cli/index.ts`
2. Leaf in `CLI_EXPECTED_LEAVES` / top-level in `CLI_EXPECTED_TOP_LEVEL`
3. Behaviour unit under `tests/unit/cli/` when non-trivial
4. `npm run test:cli` (needs `npm run build` for `dist/cli`)

## Layers

- **L1** — URL builders, parsers, `formatApiError`
- **L2** — mock fetch contracts
- **L3** — happy-dom render, no raw i18n keys
- **Registry** — every Express route / CLI leaf / page path
- **Integration** — isolated DB via `tests/helpers/api-harness.ts`

## Notes

- Production Admin entry is `admin/src/full/app.js` → `boot.js`.
- Optional live media: `OMNI_LIVE_TINY=1` or `OMNI_LIVE_BEST=1` with `OMNI_LIVE_KEY` (`tests/integration/v1.live-tiny-modalities.test.ts`, `v1.live-best-modalities.test.ts`).
- Dangerous ops (PM2 start/stop, system update) use broad acceptable status codes in hit-matrix.
- Hit matrices: `tests/integration/admin/routes.hit-matrix.test.ts`, `tests/integration/v1/routes.hit-matrix.test.ts`.
