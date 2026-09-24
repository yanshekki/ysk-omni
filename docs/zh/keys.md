# API 金鑰

金鑰格式為 `omni_live_…`。在 Admin 或 CLI 建立。密鑰只顯示一次。

## 角色與模式

| 欄位 | 值 |
|------|------|
| 角色 | `admin` · `client` |
| 模式 | `safe`（對外）· `agent`（完整媒體與工具） |
| 速率 | 每分鐘請求數 |
| IP 白名單 | 每行一個 IP 或 CIDR。留空＝不限制 IP |
| 可用模型 | 多選 + 額外 id。留空＝全部模型 |

Admin OTP 工作階段對模型沒有限制（空白清單）。

## 可用模型清單

以 JSON 存在金鑰上。完整 id 比對（`echo`、`piper/lessac-high`、`org/repo:Q4_K_M`）。

- 空白清單：不限制
- 非空：對話、圖像、影片、語音、轉錄、`GET /v1/models` 只准清單內 id
- 不在清單 → **403** `model_not_allowed`

```bash
ysk-omni key create -n app -r client -m safe --models echo,piper/lessac-high
ysk-omni key update <id> --models echo
```

用戶以 `GET /v1/models` 查詢可用清單。
