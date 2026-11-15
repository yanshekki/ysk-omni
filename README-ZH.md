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

### 1.0.8 — 2026-11-15

### 安全

- 將 `vite` 由 6.4.5 升至 **6.4.6**，修復 GHSA-p4f5-76q4-ffq7（危急）。未跳脫的 `__vite-browser-external`／`__vite-optional-peer-dep` 虛擬模組 ID，在 Vite **開發**伺服器對外開放（`--host`／`server.host`）時可遠端執行程式碼。受影響範圍：Vite `>=4.0.0,<=6.4.5`。生產環境 Admin 是已建置的靜態檔；`dev:admin` 與 lockfile 中的 Vite 已修補。變更日誌：6.4.6（2026-11-09）「fix: escape ids in resolve virtual modules」。
- Admin 內嵌的 DOMPurify 由 **3.4.17** 升到 **3.4.18**（`public/admin/vendor/purify.min.js`，官方 3.4.18 壓縮檔）。3.4.18（2026-11-14）修復 `SAFE_FOR_TEMPLATES` 再解析繞過，以及 hook 把 config 物件交回 `sanitize()` 時允許清單外洩。對話 markdown 仍用 `USE_PROFILES: { html: true }` 消毒。
- 生產主機應使用 Node ≥22.23.5、≥24.22.3 或 ≥26.13.1（2026-11-11 安全版本：CVE-2026-123863、CVE-2026-123864 及同批）。套件 `engines` 維持 `>=20`。CI 仍用 Node 24。

### 依賴升級

- `vite` 6.4.5 → 6.4.6
- `typescript-eslint` 8.72.1 → 8.72.2，連同對應的 `@typescript-eslint/*`（外掛修正：prefer-string-starts-ends-with、no-deprecated 循環別名、no-unnecessary-type-assertion、prefer-nullish-coalescing）
- 傳遞依賴 `qs` 的 override 由 **6.16.2** 改為 **6.17.1**。6.16.2 已不在 GHSA-6pq8-jhm2-2vcw／CVE-2026-110816 與 GHSA-w4cr-vjpx-p82q／CVE-2026-110910 範圍內；6.17.1 是目前 6.x。與 GCtoAC 1.7.9 一致。
- 對齊 package.json 下限 `cors` `^2.8.6` 與 `@types/cors` `^2.8.19`（lockfile 本來已解析到這些版本）。

### 內部／CI

- 將套件版本升至 1.0.8、更新 Admin fixtures，並重建 Admin bundle，讓側欄顯示 v1.0.8。
- 快速開始與維運文件（英文與中文）記錄 2026-11-11 的生產 Node 下限。`engines` 與 CI 的 Node 24 不變。

### 1.0.7 — 2026-11-08

### 安全

- 用 `overrides` 把傳遞依賴 `qs` 釘在 **6.16.2**（express 與 body-parser 宣告 `~6.16.0`）。lockfile 先前是 6.16.0，落在 GHSA-6pq8-jhm2-2vcw／CVE-2026-110816（中等，`qs.stringify` 配 `arrayFormat: 'comma'` 遇到不可呼叫的自有 `toString` 會拋錯；6.16.1 已修）同 GHSA-w4cr-vjpx-p82q／CVE-2026-110910（低，`allowEmptyArrays` 沒有編碼空陣列的 key；6.16.2 已修）。qs 6.17.1 是 6.x 最新版，同樣沒有已知公告；此釘選與 GCtoAC 一致。
- Admin 內嵌的 DOMPurify 由 **3.2.4** 升到 **3.4.17**（`public/admin/vendor/purify.min.js`）。3.2.4 落在 CVE-2025-15599（3.2.7 已修）同 CVE-2026-0540（3.3.2 已修）範圍內。3.4.17 是目前 npm 上的 3.x，沒有已知公告。對話 markdown 仍用 `USE_PROFILES: { html: true }` 消毒。

### 內部／CI

- 將套件版本升至 1.0.7、更新 Admin fixtures，並重建 Admin bundle，讓側欄顯示 v1.0.7。
- 維運文件（英文與中文）於 2026-11-08 再核對 Node 現行版本：仍是 22.23.4、24.22.2 與 26.13.0。生產下限維持 ≥22.23.4、≥24.22.1 或 ≥26.12.1。

### 1.0.6 — 2026-11-01

### 安全

- CI（`.github/workflows/ci.yml`）改在 Node 24 上跑測試，不再使用 Node 20。Node 20 已結束支援（最後版本 20.20.2），沒有 CVE-2026-111497（Brotli 越界寫入）的修補。發佈工作流程本來已在 Node 24 上發佈。套件 `engines` 維持 `>=20`。
- 生產主機應使用 Node ≥22.23.4、≥24.22.1 或 ≥26.12.1。截至 2026-11-01，這些線上的現行版本是 22.23.4、24.22.2 與 26.13.0。

### 依賴升級

- `typescript-eslint` 8.72.0 → 8.72.1，連同對應的 `@typescript-eslint/*`。其餘直接依賴在 lockfile 已是主版本內的最新版，沒有改動。

### 內部／CI

- 將套件版本升至 1.0.6、更新 Admin fixtures，並重建 Admin bundle，讓側欄顯示 v1.0.6。
- 快速開始、維運與開發文件（英文與中文）記錄 CI 使用 Node 24，以及生產環境的 Node 下限。
- 將 Admin `formatApiError` 的後備錯誤本體標成錯誤物件，讓 `npm run typecheck:admin` 接受 `details.feature`、`details.flag` 與 `details.reason`。執行時期行為不變。

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
