# 目錄

Admin **目錄**與 CLI 管理本機權重。Pull **不會**在你按該列的 Pull（或執行 `ysk-omni pull`）之前開始下載。

## Hub

Hugging Face 分頁使用官方 Hub REST API（`GET https://huggingface.co/api/models`，Link 標頭游標）。同步會快取下載量最高的 50 個 GGUF id（只寫中繼資料）。

沒有本機 runtime 的列會隱藏。容量以單一單位顯示（MB 或 GB），並在可知時附估計 VRAM。

## 下載佇列

進行中的拉取在專用區塊：百分比、容量、速度、預計完成時間。轉到其他 Admin 分頁不會丟失該區塊。沒有下載任何檔案的失敗拉取不會留下紅字橫幅。

## 本機模型

已拉取的 GGUF 與快照（whisper、diffusion、T2V）列於本機模型。動作：**Load**、**Unload**、**刪除**。亦可輸入 Hub 路徑拉取。

```bash
ysk-omni catalog --modality image
ysk-omni catalog search sdxl --modality image
ysk-omni catalog sync
ysk-omni pull org/repo:Q4_K_M
ysk-omni models
ysk-omni load <id>
ysk-omni unload <id>
ysk-omni rm <id>
```

Load 會為 GGUF 啟動 llama-server。safetensors 文字 id 需要 vLLM。diffusion／whisper／T2V 由媒體 worker 從磁碟使用，不是 llama-server。
