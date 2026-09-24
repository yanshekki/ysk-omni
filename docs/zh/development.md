# 開發

## 由原始碼

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

| 腳本 | 作用 |
|------|------|
| `npm run build:admin` | Vite → `public/admin/boot.js` |
| `npm run dev:admin` | Vite :5174，API 代理至 :3850 |
| `npm run typecheck:admin` | Admin TypeScript |

生產入口是 `admin/src/full/app.js`。模組化 `admin/src/pages/*` 供測試；在功能對齊完成前不要把頁面切離 `full/app.js`。

介面文案：英文 + 香港書面語，見 `admin/src/full/i18n.js`。

## 測試

見 [tests/README.md](../../tests/README.md)。

```bash
npm test
npm run test:admin
npm run test:api
npm run test:cli
npm run test:registry
```

可選即時媒體：`OMNI_LIVE_TINY=1` 或 `OMNI_LIVE_BEST=1`，並設 `OMNI_LIVE_KEY`。

## 目錄

| 路徑 | 職責 |
|------|------|
| `src/` | 閘道、CLI |
| `admin/src/full/` | 生產 Admin SPA |
| `prisma/` | SQLite schema 與遷移 |
| `scripts/tiny-media-worker.py` | 本機圖像／TTS／STT／影片 worker |
| `docs/en` · `docs/zh` | 產品文件 |
