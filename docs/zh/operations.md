# 維運

## 健康

```bash
ysk-omni doctor
ysk-omni status
curl -sS http://127.0.0.1:3850/health
curl -sS http://127.0.0.1:3850/ready
```

`/ready` 檢查 SQLite，以及 `llama-server` 是否在 PATH。

## 行程管理

```bash
ysk-omni start --pm2
ysk-omni restart --pm2
ysk-omni logs -n 80
ysk-omni logs clear
```

Admin → PM2 可檢視同一行程（`ysk-omni`）。在該頁改連接埠會重寫設定並重啟。

## 反向代理

將 `TRUST_PROXY` 設為跳數（Cloudflare → nginx → 應用＝`2`）。`PROXY_IP_SOURCE` 決定如何讀取用戶 IP，讓封鎖與審計使用真實位址。

## 更新

```bash
ysk-omni update --check
ysk-omni update
```

Admin → 系統狀態 → 套件可對比 npm／GitHub 並一鍵更新（API 會短暫中斷）。

## 連接埠被佔用

`doctor` 會報告 EADDRINUSE。停掉多餘執行器（`ysk-omni stop` 或 PM2 stop），只留一個行程佔用 :3850。
