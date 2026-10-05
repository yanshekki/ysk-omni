# 更新日誌

最新的在最前。由 1.0.0 起的每個版本按類別分組。`README-ZH.md` 只顯示最近三個版本。English: [CHANGELOG.md](./CHANGELOG.md)。

條目來自 git 歷史、標籤與 GitHub Release。

## 1.0.3 — 2026-10-05

### 安全

- 由 GitHub Actions 以 npm Trusted Publishing（OIDC）發佈 `ysk-omni`，並附上 provenance 來源證明。發佈工作流程不使用 npm token。

### 內部／CI

- `.github/workflows/release.yml` 在版本標籤上執行測試；若套件庫尚未有該版本才發佈，然後以 `npm view ysk-omni@<version>` 核對，並建立一個 GitHub Release。
- `README.md` 與 `README-ZH.md` 只列出最近三個版本，並按類別分組。`CHANGELOG.md` 與 `CHANGELOG.zh.md` 保留由 1.0.0 起的每個版本。
- 開發文件記錄這條更新日誌規則。
- CI 與發佈工作流程改用在 Node 24 上執行的 GitHub Actions（`actions/checkout@v7`、`actions/setup-node@v7`、`softprops/action-gh-release@v3`）。發佈工作使用 Node 24。

GitHub Release：https://github.com/yanshekki/ysk-omni/releases/tag/v1.0.3

## 1.0.2 — 2026-09-28

### 改進

- 完成其餘 Admin 字串的八種語言翻譯（`683a52f`）
- 將 Admin 字串 600–799 譯成八種語言（`8f77c6e`）
- 將 Admin 字串 400–599 譯成八種語言（`03c1bc3`）
- 將 Admin 字串 200–399 譯成八種語言（`dfebb9e`）
- 將首 200 條 Admin 字串譯成八種語言（`e891f6d`）

### 內部／CI

- 將套件版本升至 1.0.2、更新測試 fixtures，並重建 Admin bundle，讓側欄顯示 v1.0.2（`03b3b1b`）

GitHub Release：https://github.com/yanshekki/ysk-omni/releases/tag/v1.0.2
比較：https://github.com/yanshekki/ysk-omni/compare/v1.0.1...v1.0.2

## 1.0.1 — 2026-09-27

### 新功能

- 在 Admin 登出按鈕上方顯示應用程式版本（`29f4a34`）
- 將 Admin 語言選擇器改為自訂下拉選單（`c322086`）
- Admin 語言選擇器支援 11 個語系，以及繁體中文與簡體中文（`7d10af6`）
- 新增 Admin 商業合作頁（`9688907`）

### 修正

- 在 Node 測試略過 documentElement，並發佈 1.0.1（`7eef3f9`）

### 內部／CI

- 在 tsc 前清掉 dist，避免把過期建置產物打包進去（`e127ae9`）

GitHub Release：https://github.com/yanshekki/ysk-omni/releases/tag/v1.0.1
比較：https://github.com/yanshekki/ysk-omni/compare/v1.0.0...v1.0.1

## 1.0.0 — 2026-09-24

列出的提交由 `ee0ffa8` 至標籤 `v1.0.0`。更早的提交是該匯入提交所記錄的沿革，不另行列作 1.0.0 的變更。

### 新功能

- `GET /v1/models` 列出該 API 金鑰可用的模型（`5109fd9`）
- API 金鑰可限制為允許的模型清單（`4f7c252`）
- 對話操場可產生圖像、影片、語音與轉錄（`b553f7c`）
- Zeroscope 改為真正的文字轉影片，不再輸出靜態畫面（`0449ec4`）
- 輸出格式選擇器，以及更強的本機媒體權重（`784ce4d`）
- 可拉取 Whisper 與擴散模型的 Hub 權重（`2e00254`）
- 媒體庫工作室加入語音與轉錄模式（`869db34`）
- 小型 OpenAI 媒體 worker，以及即時模態測試（`72c460d`）
- 可在 Admin 與 CLI 解除安裝執行環境（`eda5122`）
- 一鍵以 brew、pip、winget、Docker 安裝執行環境（`202807e`）
- Admin 執行環境頁提供各作業系統的安裝指令（`cb7979a`）
- 目錄下載佇列顯示百分比、速度與預計剩餘時間（`4dbd96f`）
- Hub 目錄列顯示估計磁碟 MB 與 VRAM（`ad0dab2`）
- 目錄只顯示可執行的 Hub 項目，可刪除本機模型、按路徑拉取，並提供 CLI（`408f958`）
- 將 Hub 前 50 個 GGUF id 同步到目錄，而不下載檔案（`06ce4c4`）
- 在 Admin 目錄搜尋 Hugging Face Hub（`0b6bf90`）
- Admin 目錄版面改為與 KPI 及分頁頁面一致（`175f530`）
- 附帶一個 OpenAI 形狀的示範媒體 worker（`18fb831`）
- llama GPU 層數環境變數，以及 vLLM 以 python -m 啟動的後備方式（`7012f7b`）
- 影片工作的測試檔改為可播放的 ffmpeg H.264 mp4（`9103d74`）
- STT 檔案代理、ftyp 影片測試檔，doctor 讀取 engines.json（`1a57d0e`）
- 持久執行 vLLM，並代理 OpenAI 聊天（`f98b23c`）
- 保持 llama-server 載入，並代理串流聊天（`d5978e2`）
- 已拉取的 GGUF 聊天經 llama-server 代理（`695602b`）
- 影片工作開始時獨佔並卸載 VRAM（`bd32fa1`）
- 生產環境 boot.js SPA 包含 Admin 目錄（`6bd027c`）
- 預設啟用圖像、音訊與影片 API（`e422594`）
- Admin 目錄、VRAM LRU 排程，以及 doctor 的 VRAM 檢查（`9b13112`）
- 影片工作進入佇列，並以測試檔位元組完成（`50ac51c`）
- 未設定 OMNI worker URL 時，圖像與音訊 API 回傳 501（`6fc3114`）
- echo 聊天引擎，以及 OpenAI 模型拉取路由（`7af0b6c`）
- 精選目錄、Hub 用戶端與模型 CLI（`2954ad2`）
- 本機模型 registry.json 可新增或更新（`56caf16`）
- 解析 Hugging Face 規格並選擇 GGUF 量化（`2c6b871`）
- 不再啟動舊有 CLI，改為回傳 engine_unconfigured（`a7d4dbf`）

### 改進

- 清除閘道內的舊有產品識別字（`bd2b5a2`）

### 修正

- 刪除 Hub 快照目錄，並讓 Ubuntu CI 不再受阻（`4bf5468`）
- 移除系統軟體與產品文案中的舊有字句（`2051ab8`）
- Admin 文案改為香港書面語，並對齊英文（`7d5bbd0`）
- 移除 Admin 介面中的舊有產品文案（`ee68f53`）
- 將 Zeroscope 的 Hub 拉取分類為影片而非圖像（`7759499`）
- 已有 unet/ 時略過 SDXL 根目錄的權重傾印（`2a94467`）
- Piper 小型語音改用 lessac-low 的 Hub 路徑（`c550c2c`）
- Admin 首頁加上快取清除，讓執行環境導覽能載入（`d14015b`）
- 目錄 Hub 分頁與其他頁面一致，並保持捲動位置（`63580ad`）
- Pull 沒有下載內容時隱藏目錄佇列（`2337290`）
- 切換分頁時保留目錄 Pull 進度（`016223e`）
- 只保留確實有 GGUF 檔的本機模型（`a5521ab`）
- 目錄 Pull 進度改以進度條顯示，不再顯示原始位元組（`6cc143e`）
- Hub 大小與 VRAM 以單一單位顯示（`7810019`）
- 目錄 Hub 搜尋與按路徑 Pull 分成兩條工具列（`76f64c5`）
- Hub Link 標頭型別為 string | string[]（`d821975`）
- 操場聊天預設模型改為已載入的 GGUF（`1bc24ba`）
- 佇列中的 llama 聊天串流略過第二次 SSE 初始化（`8202326`）
- 共用 omniHome()，並把佇列中的聊天代理到 llama-server（`f76c493`）
- Admin 操場預設改為 echo，不再使用舊有預設模型（`8903394`）
- 為已拉取的 GGUF 計算雜湊，並在模型 registry 中略過失敗的 Hub 下載（`5ead97f`）
- 分別編碼 Hugging Face 的組織與儲存庫（`5bb8749`）
- 改名為 ysk-omni 後使用有效識別字（`b1ad035`）

### 內部／CI

- 發佈 1.0.0，並加入 CI 與 npm 發佈工作流程（`c84c8ee`）
- 重寫手冊、完整 CLI 參考與 agent skills（`5cd6cd7`）
- 從中文 README 環境變數表移除過期的二進位路徑（`a2abbe6`）
- 移除過期的計劃檔（`d37326a`）
- 嚴謹的即時 SDXL、whisper-large、Piper-high 與真正影片測試（`3d4272c`）
- Admin 使用香港書面語，並對齊英文（`6393f22`）
- 標出剩餘的 CLI 表面，並將預設模型設為 echo（`a880874`）
- 補充 Comfy 的 OpenAI 相容說明與 PM2 啟動，並移除過期的 CLI 產品文案（`0424b0e`）
- 將專案識別改為 YSK Omni（`cfd0541`）
- 匯入先前的閘道作為 YSK Omni 的沿革（`ee0ffa8`）

GitHub Release：https://github.com/yanshekki/ysk-omni/releases/tag/v1.0.0
提交：https://github.com/yanshekki/ysk-omni/commits/v1.0.0
