# Test suite guide

Vitest multi-project layout for **Admin pages**, **Admin + V1 APIs**, and **CLI**.

## Projects

| Project | Environment | Includes |
|---------|-------------|----------|
| `server` | node | `tests/unit/**`, `tests/integration/**` |
| `admin-node` | node | `tests/admin/unit/l1|l2`, `tests/admin/contract` |
| `admin-dom` | happy-dom | `tests/admin/unit/l3` |

## Scripts

```bash
npm test                 # full suite
npm run test:admin       # admin L1–L3
npm run test:admin:l3    # page DOM only
npm run test:api         # integration API subset
npm run test:cli         # CLI unit + smoke
npm run test:registry    # fail if a route/page/command is unlisted
npm run test:coverage    # coverage report
```

## Adding a new surface (required)

### New Admin page

1. Add `PageId` + `PAGE_HASH` + `NAV_ITEMS` in `admin/src/config/constants.ts`
2. Add `pagePrimaryGetPath` in `admin/src/pages/page-api.ts` (skip for static pages listed in `STATIC_NAV_PAGES`)
3. Register renderer in `admin/src/router.ts`
4. Add L3: `tests/admin/unit/l3/<page>.page.test.ts`
5. Ensure primary GET is covered in `tests/integration/admin/routes.registry.test.ts` `ADMIN_COVERAGE`

### New Admin or V1 endpoint

1. Implement route in `src/routes/**`
2. Add row to `ADMIN_COVERAGE` or `V1_COVERAGE` in the matching `routes.registry.test.ts`
3. Add a real hit test (integration or unit) referenced by `coveredBy`
4. Run `npm run test:registry`

### New CLI command

1. Register in `src/cli/index.ts`
2. Add leaf to `CLI_EXPECTED_LEAVES` / top-level to `CLI_EXPECTED_TOP_LEVEL` in `tests/helpers/cli-registry.ts`
3. Add behavior unit under `tests/unit/cli/` when non-trivial
4. Run `npm run test:cli` (requires `npm run build` for dist CLI)

## Layers (DoD)

- **L1 pure** — URL builders, parsers, `formatApiError`, list helpers
- **L2 services** — mock fetch HTTP contracts
- **L3 pages** — happy-dom render + no raw i18n keys
- **Registry** — every Express route / CLI leaf / page primary path enumerated
- **Integration** — supertest + isolated DB via `tests/helpers/api-harness.ts`

## Notes

- Production Admin SPA entry is still `admin/src/full/app.js` → `boot.js`; modular `admin/src/pages/*` is the testable architecture path. Prefer implementing features in modules and wiring full SPA until unified.
- Optional live Grok: `tests/integration/grok-live.optional.test.ts` (not required for CI green).
- Dangerous ops (pm2 start/stop, system update) are hit in `routes.hit-matrix` with broad acceptable status codes.
- **Hit matrices:** `tests/integration/admin/routes.hit-matrix.test.ts` and `tests/integration/v1/routes.hit-matrix.test.ts` exercise every registered endpoint over real HTTP.

## Completion checklist (deep suite)

| Surface | Mechanism | Status |
|---------|-----------|--------|
| Admin pages (15+login) | L3 happy-dom + page-route matrix | ✅ |
| Admin `/admin/api/*` | registry + hit-matrix | ✅ |
| Public `/v1/*` + health | registry + hit-matrix | ✅ |
| CLI leaves | registry help + domain help + smoke | ✅ |
| Error i18n | L1 formatApiError + ErrorCodes keys | ✅ |
