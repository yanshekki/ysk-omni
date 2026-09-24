# 快速開始

## 前置要求

- Node.js 20 或以上
- 文字 GGUF：`PATH` 上的 `llama-server`，或 `OMNI_LLAMA_SERVER`
- 文字 safetensors：`vLLM`（`OMNI_VLLM`）
- 圖像／語音／影片：OpenAI 形狀的 HTTP worker（見[媒體](media.md)）

## 安裝並啟動

```bash
npm install -g ysk-omni

ysk-omni doctor
ysk-omni setup          # 資料目錄、.env、遷移、種子 admin 金鑰
ysk-omni start          # http://127.0.0.1:3850
ysk-omni start --pm2    # 同一行程交 PM2 管理
```

資料主目錄預設 `~/.ysk-omni`。可用 `--home` 或 `OMNI_HOME` 覆寫。

## Admin 登入

Admin 不會在瀏覽器長期保存 API 金鑰。請產生一次性登入碼：

```bash
ysk-omni admin otp
```

開啟 `http://127.0.0.1:3850/admin/` 並輸入該碼（五分鐘、單次使用）。

## 第一個模型

```bash
ysk-omni catalog search Qwen --modality text
ysk-omni pull Qwen/Qwen2.5-0.5B-Instruct-GGUF:Q2_K
ysk-omni load Qwen/Qwen2.5-0.5B-Instruct-GGUF:Q2_K
```

尚未載入引擎時，可用 `model=echo` 做協議測試。

## 第一次 API 呼叫

```bash
curl -sS http://127.0.0.1:3850/v1/models \
  -H "Authorization: Bearer omni_live_…"

curl -sS http://127.0.0.1:3850/v1/chat/completions \
  -H "Authorization: Bearer omni_live_…" \
  -H 'Content-Type: application/json' \
  -d '{"model":"echo","messages":[{"role":"user","content":"你好"}]}'
```

`GET /v1/models` 列出此金鑰可用的 id。用 `--models` 限制金鑰（見 [API 金鑰](keys.md)）。

列印網址：

```bash
ysk-omni open
ysk-omni open --admin
```
