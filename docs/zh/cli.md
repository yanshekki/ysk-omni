# CLI 手冊

指令：`ysk-omni`。短名：`ysko`（不要用 `yo`）。

```bash
ysk-omni --help
ysk-omni <command> --help
```

## 全局旗標

| 旗標 | 說明 |
|------|------|
| `--home <path>` | 資料主目錄（預設 `~/.ysk-omni` 或專案根） |
| `--port <n>` | HTTP 連接埠（預設 **3850**） |
| `--json` | 支援時輸出機器可讀 JSON |
| `-V, --version` | 套件版本 |

以下每個命令都接受全局旗標。

## 生命週期

| 命令 | 作用 |
|------|------|
| `setup` | 建立資料目錄、`.env`、遷移、種子 admin 金鑰；嘗試 `npm i -g pm2` |
| `start` | 啟動閘道。`-f, --foreground` · `--pm2` |
| `stop` | 停止背景閘道 |
| `restart` | 重啟。`-f, --foreground` · `--pm2` |
| `status` | 行程與健康 |
| `migrate` | `prisma migrate deploy` |
| `seed` | 若缺少則種子 admin 金鑰 |
| `doctor` | Node、環境、已載入模型、VRAM、建置、執行器、連接埠衝突 |
| `open` | 列印 API／Admin 網址。`--admin` 只列 Admin |
| `version` | 套件版本 |
| `update` | 自我更新。`--check` · `--no-restart` · `--channel auto\|git\|npm-global\|npm-local` |

```bash
ysk-omni --home ~/.ysk-omni setup
ysk-omni start --foreground
ysk-omni start --pm2
ysk-omni doctor
ysk-omni update --check
```

## API 金鑰

`key create` 只列印密鑰 **一次**。

| 命令 | 旗標 |
|------|------|
| `key` | 裸指令會建立 **admin** 金鑰（相容）。請用 `key create` |
| `key create` | `-n <name>` `-r admin\|client` `-m safe\|agent` `--rate-limit <n>` `--models <id,id>` |
| `key admin` | 等同 `key create -r admin`。`-n <name>` |
| `key list` | 列出金鑰（不含密鑰） |
| `key show <id>` | 單一金鑰 |
| `key update <id>` | `-n` `-r` `-m` `--rate-limit` `--active on\|off` `--models <ids>` |
| `key revoke <id>` | 撤銷 |
| `key activate <id>` | 重新啟用 |

`--models` 為逗號分隔可用模型清單。建立時留空＝不限制。見 [API 金鑰](keys.md)。

```bash
ysk-omni key create -n studio -r client -m agent --models echo,piper/lessac-high
ysk-omni key update <id> --models echo
```

## Admin 面板

| 命令 | 作用 |
|------|------|
| `admin` / `admin status` | 面板開關狀態 |
| `admin on` | 啟用（設定庫） |
| `admin off` | 停用。只能用 `admin on` 重開 |
| `admin otp` | 一次性登入碼（別名 `admin login-code`）。5 分鐘、單次使用 |
| `admin sessions` / `admin sessions list` | 有效 OTP 工作階段 |
| `admin sessions revoke <id>` | id 前綴，或 `all`／`all-expired` |

## 安全設定

| 命令 | 旗標 |
|------|------|
| `settings` / `settings get` | 顯示 |
| `settings set` | `--global-safe on\|off` `--tools none\|readonly` `--max-turns <n>` `--timeout-ms <n>` `--default-model <id>` |
| `settings preset <name>` | `local` · `prod` · `code` · `read` · `chat` · `long` |

## 目錄與模型

| 命令 | 作用 |
|------|------|
| `catalog` | 本機登錄。`--modality text\|image\|video\|tts\|stt` |
| `catalog search [q]` | Hub 搜尋（有本機 runtime 者）。`--modality` |
| `catalog sync` | 快取下載量最高的 50 個 GGUF id（只寫中繼資料，不下載） |
| `show <spec>` | 列出 `org/repo` 或 `org/repo:Q4_K_M` 的 GGUF 量化 |
| `pull <spec>` | 拉取 GGUF 或記錄 safetensors id |
| `models` | 列出本機登錄（含 `echo`） |
| `rm <id>` | 刪除本機登錄列與檔案 |
| `load <id>` | 將 GGUF 載入 llama-server（或 vLLM） |
| `unload <id>` | 卸載 |

```bash
ysk-omni catalog --modality text
ysk-omni catalog search whisper --modality stt
ysk-omni catalog sync
ysk-omni pull Qwen/Qwen2.5-0.5B-Instruct-GGUF:Q2_K
ysk-omni load Qwen/Qwen2.5-0.5B-Instruct-GGUF:Q2_K
ysk-omni unload Qwen/Qwen2.5-0.5B-Instruct-GGUF:Q2_K
ysk-omni rm Qwen/Qwen2.5-0.5B-Instruct-GGUF:Q2_K
```

## 執行環境

| 命令 | 作用 |
|------|------|
| `runtimes` | 主機作業系統、已安裝／缺失、安裝方案 |
| `runtimes install <id>` | Homebrew／pip／winget／Docker（`llamacpp`、`ffmpeg`、`mlx` 等） |
| `runtimes uninstall <id>` | 依方案解除安裝（Admin 會先確認） |

## 對話佇列

裸 `queue`＝統計。

| 命令 | 作用 |
|------|------|
| `queue stats` | 深度與數量 |
| `queue policy`／`policy get` | 顯示政策 |
| `queue policy set` | 更新政策欄位 |
| `queue policy preset <name>` | 具名預設 |
| `queue pause`／`resume` | 工人認領 |
| `queue drain`／`undrain` | 拒絕／允許新入隊 |
| `queue jobs` | 列出工作 |
| `queue job <id>` | 單一工作 |
| `queue cancel <id>` | 取消 |
| `queue requeue <id>` | 重新入隊 |
| `queue priority <id> <n>` | 設定優先級 |
| `queue purge-dead` | 刪除失敗／已取消。`-y, --yes` |

## DDoS 與黑名單

裸 `ddos`＝摘要。

| 命令 | 旗標 |
|------|------|
| `ddos policy`／`policy get` | 顯示 |
| `ddos policy set` | `--auto-ban` `--rate-limit-max` `--rate-limit-ip-max` `--chat-burst-max` `--failed-auth-threshold` `--rate-hit-threshold` `--max-concurrent-per-ip` `--velocity-max-requests` `--proxy-trust-hops` `--proxy-ip-source auto\|cloudflare\|nginx\|x-forwarded-for\|socket` |
| `ddos policy preset <name>` | `relaxed` · `balanced` · `strict` |
| `ddos policy reset` | 還原環境變數預設 |
| `ddos ban <ip>` | `--ttl <seconds>` `--reason <text>` |
| `ddos unban <ip>` | 自黑名單移除 |
| `ddos blacklist` | 列出有效項目 |

## 文件、對話、審計

| 命令 | 作用 |
|------|------|
| `docs`／`docs list` | `--limit` `--offset` |
| `docs show <id>` | 單一文件 |
| `docs delete <id>` | 刪除 |
| `chats`／`chats list` | 已儲存對話請求 |
| `chats show <id>` | 單一請求 |
| `conversations list` | 操場執行緒 |
| `conversations delete <id>` | 刪除執行緒 |
| `audit`／`audit list` | 審計日誌 |
| `stats` | 儀表板式資料庫摘要 |

## API 能力旗標

與 Admin → API 能力對齊。

| 命令 | 作用 |
|------|------|
| `api features`／`api features get` | 顯示旗標 |
| `api features set` | `--openai-chat` `--openai-responses` `--anthropic-messages` `--tools` `--vision` `--images-api` `--audio-api` `--video-api` `--files-openai-alias` `--strict-sampling` …（各為 `on\|off`） |
| `api features preset <name>` | `open` · `locked` · `dev` |

## 日誌

| 命令 | 旗標 |
|------|------|
| `logs`／`logs show` | `-n, --lines <n>`（預設 40） |
| `logs clear` | 清空 PM2 與 ysk-omni 日誌檔 |
