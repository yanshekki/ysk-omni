# Admin Panel

Production SPA: `admin/src/full/app.js` → `public/admin/boot.js`.

Product guide: [docs/en/admin.md](../docs/en/admin.md) · [docs/zh/admin.md](../docs/zh/admin.md)

## Production

| Entry | Content |
|-------|---------|
| `public/admin/boot.js` | Full SPA (Vite bundle) |
| Source | `admin/src/full/app.js` + `i18n.js` |
| Pages | Login, Dashboard, Chat, Chat logs, API Keys, Documents, Media, Catalog, Runtimes, Audit, Safety, API features, Usage, DDoS, Queue, PM2, System, Support, Business |

```bash
npm run build:admin    # → public/admin/boot.js
npm run build          # server + Admin
```

After deploy: hard-refresh `/admin`.

## Layout

```
admin/src/
  boot.ts              # production entry → full/app.js
  full/                # complete SPA
  pages/ services/ …   # incremental TypeScript rewrite (not production yet)
```

Only leave `full/app.js` for a page when that page has full feature parity.

## Dev

```bash
npm run dev:admin      # Vite :5174, proxy API → :3850
npm run typecheck:admin
npm run test:admin
```
