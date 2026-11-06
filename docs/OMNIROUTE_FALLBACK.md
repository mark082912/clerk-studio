# OmniRoute：Claude Code / Codex CLI 的備用模型路由（選用）

> 2026-11-06 核對；本文件是 Clerk Studio 的**開發工具備援說明**，不是網站的國考功能，也不是 Claude / OpenAI 官方提供的免費額度。OmniRoute 專案與不同供應商規則經常變動，實際以當下安裝版本、供應商配額與授權條款為準。

## 核心結論

- **不是「Claude 訂閱用完會自動接力」**：Claude Code 的 CLI 介面會被導向其他供應商，背後實際回覆模型未必是 Claude；每家 API 憑證與免費資格必須獨立取得。
- **不是免費無上限**：官方頁面會彙總多家 free tier 的理論 token 額度（例如曾宣稱約 16.2 億／月），並不代表你安裝後就有這個額度，不能直接當成本保證。
- **不要送病人資料**：不同供應商的保留、記錄與訓練政策不同。Clerk Studio 開發時僅使用匿名範例、合成資料與通用程式碼；禁止上傳病人姓名、病歷號、院內文件、HIS/CePO 登入資訊或私人 API key。

## 安裝與啟動（在你自己的 Mac / Windows 終端機）

```bash
node -v
npm view omniroute version
npm install -g omniroute@latest
omniroute
```

Node.js 請使用套件當下要求的受支援版本；先核對 `node -v`，不可只按舊文章列的版本號判斷。伺服器通常在 `http://localhost:20128`；若畫面無法打開，先看終端機輸出。修改或重設管理員密碼，勿沿用公開預設值。

### ⚠️ 先做網路防護

OmniRoute 曾公開說明預設可能監聽 `0.0.0.0` 且不要求 API key；在公共 Wi-Fi 或多人共用網路可能暴露你的免費配額與請求存取面。

只在本機使用時，於啟動時顯示的 `.env` 位置設定：

```dotenv
OMNIROUTE_SERVER_HOST=127.0.0.1
```

然後停止服務並重新啟動，確認服務只綁定 loopback。若刻意提供遠端/區域網路存取，另設定 `REQUIRE_API_KEY=true`，並遵守供應商安全要求。切勿把 `.env`、OAuth 憑證或 API keys 提交至公開 GitHub。

## 增加 Providers 並啟動 coding CLI

1. 於 OmniRoute 控制台新增**自行申請**的供應商 API key（例如 Gemini、Groq），確認供應商允許該接入方式。
2. 在控制台確認實際可使用的模型、剩餘配額與錯誤紀錄；沒有任何可用供應商時，auto-fallback 也無法完成請求。
3. 在另一個終端機，使用本機安裝的 Claude Code 或 Codex CLI：

```bash
# 已安裝 Claude Code（需先能執行 claude）
omniroute launch --model auto

# 已安裝 Codex CLI（需先能執行 codex）
omniroute launch-codex --model auto
```

OmniRoute 新版亦提供 `omniroute setup-claude`、`omniroute setup-codex`、`omniroute run claude` 等整合方式；實際命令選項可能隨版本變更，請用 `omniroute --help` 和官方 CLI 文件核對。一般 OpenAI-compatible 工具的 API base URL 通常是 `http://localhost:20128/v1`；Claude Code 的 Anthropic API base URL 則通常不帶 `/v1`，不可混用。

**Cursor 更新提醒**：舊教學寫「Cursor 不能用」不夠準確。較新官方文件已提供 `omniroute setup-cursor` 的手動設定指示，但可用的功能範圍依 Cursor 版本與模式而異，不能保證所有 Agent 功能都相容。

## 遇到錯誤

| 現象 | 先檢查 |
|---|---|
| `OmniRoute is not reachable` | 是否仍有 `omniroute` 伺服器程序、連線埠是否正確 |
| `No eligible providers` / 402 / 502 | 供應商是否已設定、該模型是否支援、配額與限速是否耗盡 |
| `Unable to determine provider for model` | 使用本版本支援的模型或 `--model auto`；檢查實際 model catalog |
| 找不到 `claude` / `codex` | 先安裝對應 CLI 並確認 PATH |
| 更新後設定不符 | 備份 OmniRoute 設定、查看升級說明與 `omniroute doctor`（若支援） |

不建議把 Claude Code 訂閱用的登入憑證交給第三方路由；使用官方允許的 API key 或符合服務條款的提供者。**不要為了省 token 把未匿名化的臨床資料送到免費模型。**

## 查核來源（請優先閱讀最新版）

- [OmniRoute 官方 GitHub](https://github.com/cheaper-inference/OmniRoute)
- [官方 CLI Integrations](https://github.com/cheaper-inference/OmniRoute/wiki/cli-integrations)
- [官方安裝／設定說明](https://github.com/cheaper-inference/OmniRoute/blob/main/docs/guides/SETUP_GUIDE.md)
- [npm omniroute 套件與最新版本](https://www.npmjs.com/package/omniroute)
- [GitHub 開發者對預設網路綁定位址的解釋](https://github.com/cheaper-inference/OmniRoute/discussions/11645)

此文件只說明替代開發工作流程，不代表 Clerk Studio 已透過 OmniRoute 連線或把任何使用者資料傳給它。
