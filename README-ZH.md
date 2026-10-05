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

### 1.0.3 — 2026-10-05

### 安全

- 由 GitHub Actions 以 npm Trusted Publishing（OIDC）發佈 `ysk-omni`，並附上 provenance 來源證明。發佈工作流程不使用 npm token。

### 內部／CI

- `.github/workflows/release.yml` 在版本標籤上執行測試；若套件庫尚未有該版本才發佈，然後以 `npm view ysk-omni@<version>` 核對，並建立一個 GitHub Release。
- `README.md` 與 `README-ZH.md` 只列出最近三個版本，並按類別分組。`CHANGELOG.md` 與 `CHANGELOG.zh.md` 保留由 1.0.0 起的每個版本。
- 開發文件記錄這條更新日誌規則。
- CI 與發佈工作流程改用在 Node 24 上執行的 GitHub Actions（`actions/checkout@v7`、`actions/setup-node@v7`、`softprops/action-gh-release@v3`）。發佈工作使用 Node 24。

### 1.0.2 — 2026-09-28

### 改進

- 完成其餘 Admin 字串的八種語言翻譯（`683a52f`）
- 將 Admin 字串 600–799 譯成八種語言（`8f77c6e`）
- 將 Admin 字串 400–599 譯成八種語言（`03c1bc3`）
- 將 Admin 字串 200–399 譯成八種語言（`dfebb9e`）
- 將首 200 條 Admin 字串譯成八種語言（`e891f6d`）

### 內部／CI

- 將套件版本升至 1.0.2、更新測試 fixtures，並重建 Admin bundle，讓側欄顯示 v1.0.2（`03b3b1b`）

### 1.0.1 — 2026-09-27

### 新功能

- 在 Admin 登出按鈕上方顯示應用程式版本（`29f4a34`）
- 將 Admin 語言選擇器改為自訂下拉選單（`c322086`）
- Admin 語言選擇器支援 11 個語系，以及繁體中文與簡體中文（`7d10af6`）
- 新增 Admin 商業合作頁（`9688907`）

### 修正

- 在 Node 測試略過 documentElement，並發佈 1.0.1（`7eef3f9`）

### 內部／CI

- 在 tsc 前清掉 dist，避免把過期建置產物打包進去（`e127ae9`）

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
