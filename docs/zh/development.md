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

## 發佈與更新日誌

推送附註標籤 `vX.Y.Z`，版本須與 `package.json` 的 `"version"` 相同。[`.github/workflows/release.yml`](../../.github/workflows/release.yml) 的檔名必須是這個，而且不要設定 GitHub environment。該工作流程先跑測試，再以 Trusted Publishing 發佈到 npm。認證只用 GitHub Actions OIDC（`id-token: write`），發佈附帶 provenance 來源證明。不要加入 npm token（`NPM_TOKEN`、`NODE_AUTH_TOKEN` 或套件庫認證）。若套件庫已有該版本，工作流程會略過發佈，然後執行 `npm view ysk-omni@<version>`，並建立或更新一個 GitHub Release。

更新日誌規則：

- [`CHANGELOG.md`](../../CHANGELOG.md) 與 [`CHANGELOG.zh.md`](../../CHANGELOG.zh.md) 記錄由 1.0.0 起的每個版本，最新的在最前。
- 每個版本按類別分組，沒有內容的類別不寫。英文：New features、Improvements、Fixes、Security、Dependency upgrades、Internal/CI。中文（[`CHANGELOG.zh.md`](../../CHANGELOG.zh.md)，香港書面語）：新功能、改進、修正、安全、依賴升級、內部／CI。
- 條目來自 git 歷史、標籤與 GitHub Release。不要編造變更。
- 提交類型對應：`feat` → 新功能；`fix` → 修正；`security`／`fix(security)` → 安全；`refactor`、`perf`、`style`、`i18n` → 改進；依賴升級 → 依賴升級；`docs`、`test`、`chore`、`build`、`ci` → 內部／CI。
- [`README.md`](../../README.md) 與 [`README-ZH.md`](../../README-ZH.md) 只顯示最近三個版本，使用相同分組，並以完整更新日誌的連結作結。
