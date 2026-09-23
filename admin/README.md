# Admin Panel

## Production (full features — current)

| Entry | Content |
|-------|---------|
| `public/admin/boot.js` | **Full SPA** (Vite bundle of complete Admin) |
| Source of truth | `admin/src/full/app.js` (+ `i18n.js`, `allowed-extensions.js`) |
| Pages | Login, Dashboard, Chat playground, Chat logs, API Keys, Documents, Media, Audit, Safety, API features, Usage, DDoS, Queue, PM2, System |

```bash
npm run build:admin    # → public/admin/boot.js (full features)
npm run build          # server + full admin
```

After deploy: hard-refresh `/admin` (Ctrl+Shift+R).

## Architecture

```
admin/src/
  boot.ts              # production entry → imports full/app.js
  full/                # complete SPA (parity with all features)
    app.js
    i18n.js
    allowed-extensions.js
  pages/ services/ …   # incremental TS rewrite (not production entry yet)
```

**Cutover rule for page-by-page TS:** only switch away from `full/app.js` when that page has **full** feature parity (no stubs).

## Dev

```bash
npm run dev:admin      # Vite :5174, proxies API → :3847
npm run typecheck:admin
npm run test:admin
```
