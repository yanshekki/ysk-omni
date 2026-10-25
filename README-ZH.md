# YSK Omni

[![CI](https://github.com/yanshekki/ysk-omni/actions/workflows/ci.yml/badge.svg)](https://github.com/yanshekki/ysk-omni/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/ysk-omni.svg)](https://www.npmjs.com/package/ysk-omni)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org/)

**語言：** [English](./README.md) · 中文

本機 Hugging Face 模型，前面一層 OpenAI 相容 HTTP 閘道。文字：llama-server／vLLM／echo。圖像、語音、轉錄、影片：獨立 worker。

| | |
|--|--|
| **CLI** | `ysk-omni` · 短名 `ysko` |
| **預設連接埠** | **3850** |
| **文件** | [docs/zh](./docs/zh/README.md) |
| **產品頁** | [ysk.hk/products/ysk-omni](https://ysk.hk/products/ysk-omni) |

```bash
npm install -g ysk-omni
ysk-omni setup
ysk-omni admin otp
ysk-omni start
```

以一次性登入碼開啟 `http://127.0.0.1:3850/admin/`。在目錄拉取 GGUF、Load，然後：

```bash
curl -sS http://127.0.0.1:3850/v1/models \
  -H "Authorization: Bearer omni_live_…"
```

完整 CLI、API、Admin、目錄、執行環境、金鑰與維運：**[文件](./docs/zh/README.md)**。

## 更新日誌

### 1.0.5 — 2026-10-25

### 安全

- 將 `multer` 由 1.4.5-lts 升至 2.5.0，修復 CVE-2026-77078（高危 multipart 欄位名拒絕服務）以及 2.x 至 2.5.0 的後續 multipart 修補，包括 CVE-2026-113872。上傳路由仍用 `memoryStorage`。Multer 上限錯誤改回 413／400，不再當 500。
- 以 npm `overrides` 釘選傳遞依賴 `body-parser` 1.20.9（CVE-2026-111181／GHSA-27r3-jxmh-p828），讓 `express.json` 與 `urlencoded` 用上已修補的解析器。
- 將 `vite` 由 6.4.4 升至 6.4.5（GHSA-8g5g-mxqh-grgj）。該公告只影響 Admin Vite **開發**伺服器；生產環境提供已建置的靜態 Admin。
- 生產主機應使用 2026-10-21 Node.js 安全版本（22.23.4、24.22.1、26.12.1，或現行已修補 LTS），以覆蓋 CVE-2026-111497 等執行時期修補。套件 `engines` 維持 `>=20`。

### 依賴升級

- `multer` 1.4.5-lts.2 → 2.5.0
- `@types/multer` 1.4.13 → 2.3.0
- `body-parser` 1.20.8 → 1.20.9（override）
- `vite` 6.4.4 → 6.4.5
- `typescript-eslint` 8.71.1 → 8.72.0

### 內部／CI

- 將套件版本升至 1.0.5、更新 Admin fixtures，並重建 Admin bundle，讓側欄顯示 v1.0.5。

### 1.0.4 — 2026-10-11

### 安全

- `express` 4.22.3 更新 `path-to-regexp`，修復 CVE-2026-4867。
- `prisma`／`@prisma/client` 6.19.3 更新 `effect` 依賴，修復安全漏洞。

### 依賴升級

- `pino-pretty` 13.1.3 → 13.2.0
- `tsx` 4.23.1 → 4.23.15
- `vite` 6.4.3 → 6.4.4
- `typescript-eslint` 8.64.0 → 8.71.1
- `prisma` 6.5.0 → 6.19.3
- `@prisma/client` 6.5.0 → 6.19.3
- `express` 4.22.2 → 4.22.3
- `@types/node` 22.20.1 → 22.20.5

### 內部／CI

- 將套件版本升至 1.0.4、更新 Admin fixtures，並重建 Admin bundle，讓側欄顯示 v1.0.4。
- Prisma CLI 版本釘選與 `prisma`／`@prisma/client` 6.19.3 同步。
- 在 `typescript-eslint` 升級後通過 lint（case 區塊作用域、多餘自我賦值、generator `yield`、Admin ESLint glob）。

### 1.0.3 — 2026-10-05

### 安全

- 由 GitHub Actions 以 npm Trusted Publishing（OIDC）發佈 `ysk-omni`，並附上 provenance 來源證明。發佈工作流程不使用 npm token。

### 內部／CI

- `.github/workflows/release.yml` 在版本標籤上執行測試；若套件庫尚未有該版本才發佈，然後以 `npm view ysk-omni@<version>` 核對，並建立一個 GitHub Release。
- `README.md` 與 `README-ZH.md` 只列出最近三個版本，並按類別分組。`CHANGELOG.md` 與 `CHANGELOG.zh.md` 保留由 1.0.0 起的每個版本。
- 開發文件記錄這條更新日誌規則。
- CI 與發佈工作流程改用在 Node 24 上執行的 GitHub Actions（`actions/checkout@v7`、`actions/setup-node@v7`、`softprops/action-gh-release@v3`）。發佈工作使用 Node 24。

完整更新日誌：[CHANGELOG.zh.md](./CHANGELOG.zh.md)。

## 授權

MIT — 見 [LICENSE](./LICENSE)。

## 作者

**Ki (yanshekki)** — [YSK Limited](https://ysk.hk/)。[linktr.ee/yanshekki](https://linktr.ee/yanshekki)

### 支援／贊助

若 YSK Omni 對你有幫助，歡迎贊助開發。

| 網絡 | 地址 |
| --- | --- |
| **EVM** (ETH/BSC/AVAX) | `yanshekki.eth` |
| **NEAR** | `yanshekki.near` |
| **ADA** (Cardano) | `$yanshekki` |
