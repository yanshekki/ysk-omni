# Admin 面板

網址：`http://127.0.0.1:3850/admin/`

生產 SPA：`admin/src/full/app.js` → `public/admin/boot.js`（`npm run build:admin`）。語言：英文與香港書面語。

## 登入

```bash
ysk-omni admin otp
```

在登入頁輸入該碼。五分鐘過期、只能用一次。面板不會在瀏覽器保存 live API 金鑰。

停用面板（只能用 CLI 重開）：

```bash
ysk-omni admin off
ysk-omni admin on
```

## 頁面

| 導航 | 用途 |
|------|------|
| 儀表板 | KPI、健康 |
| 對話 | 操場。預設已載入 GGUF。媒體模型會在對話中出圖／出片／出聲 |
| 對話記錄 | 加密請求歷史 |
| API 金鑰 | 新增／編輯：角色、模式、速率、IP 白名單、**可用模型** |
| 文件 | 已上傳檔案 |
| 媒體庫 | 工作室：圖像、影片、語音、轉錄；媒體庫 |
| 目錄 | Hub 搜尋、下載佇列、本機模型、Load／Unload／刪除 |
| 執行環境 | 按作業系統安裝／解除安裝 llama-server、ffmpeg 等 |
| 審計日誌 | 審計紀錄 |
| 安全設定 | 全域 safe、預設模型 |
| API 能力 | 協議與媒體旗標 |
| 用量與防護 | 限額與用量 |
| DDoS 中心 | 政策、封鎖 |
| 佇列 | 暫停、排空、工作 |
| PM2 | 行程管理 |
| 系統狀態 | 軟件（Node、npm、llama-server、ffmpeg、PM2、Prisma）、套件更新、環境 |
| 支援 | 作者與贊助 |

部署新的 `boot.js` 後請硬重新整理瀏覽器。
