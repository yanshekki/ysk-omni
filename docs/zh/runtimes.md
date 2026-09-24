# 執行環境

Admin **執行環境**按**主機作業系統**（macOS、Linux、Windows）列出推論工具：已安裝、缺失、如何安裝。

## 一鍵安裝

有允許方案的卡片有 **安裝**。閘道會依本機 OS 執行 Homebrew、pip、winget 或 Docker。

**解除安裝**會先確認，再依方案還原。

```bash
ysk-omni runtimes
ysk-omni runtimes install llamacpp
ysk-omni runtimes install ffmpeg
ysk-omni runtimes uninstall llamacpp
```

Runtime id 包括 `llamacpp`、`ffmpeg`、`mlx` 及頁面上列出的其他項目。

目錄 **Load** 仍需要二進位在 `PATH`（或 `OMNI_LLAMA_SERVER`）。若 `doctor` 報告缺少 llama-server，請先在此安裝。
