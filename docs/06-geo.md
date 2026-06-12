# 06 · GEO（生成式引擎優化）— Harness 作業書

| 欄位 | 內容 |
|------|------|
| **主責 Agent** | `deep-research`（skill，現況/最佳實務調研）+ `system-analyst`（規範落地） |
| **協作 Agent** | 內容團隊、`backend-engineer`（結構化資料 + robots 策略）、`frontend-architect`（可檢索渲染） |
| **搭配 Skills** | `deep-research`、`verify` |
| **對應階段** | P1（GEO 策略調研）／P8（內容與結構落實）／持續優化 |
| **核心定位** | **GEO = Generative Engine Optimization**：讓 NTI 內容能被 ChatGPT、Claude、Gemini、Google AI Overviews、Perplexity 等**生成式引擎正確擷取、理解、引用**。與 SEO 互補但受眾是「AI 答案」而非「藍色連結」。 |

---

## 1. GEO vs SEO（為何獨立一份）

| | SEO（[`05-seo.md`](05-seo.md)） | GEO（本文件） |
|---|---|---|
| 目標 | 搜尋結果頁排名與點擊 | 被 AI 生成答案**引用 / 推薦 / 正確描述** |
| 受眾 | 搜尋引擎爬蟲 + 人 | LLM / RAG / AI 搜尋 |
| 手段重疊 | 結構化資料、語意化、權威內容、可檢索 | 同左 **+** 明確事實陳述、可被擷取的問答結構、實體一致性 |

> 兩者**共用** SSR/SSG、JSON-LD、內容品質基礎；GEO 額外強調「事實清晰、可被語言模型無歧義擷取」。

---

## 2. 工作分解

### 2.1 P1 — 調研（`deep-research`）
- 調研當前 GEO 最佳實務與各生成式引擎擷取行為（含 `llms.txt` 之類新興慣例的採用現況與實益）。
- 產出 NTI 適用的 GEO 規範草案 + 是否值得投入的取捨建議（避免過度投資未成熟標準）。
- ⚠️ 此領域變動快，規範**以調研當下實證為準**，勿照搬舊習慣；落實前再驗一次。

### 2.2 內容與實體（內容團隊 + system-analyst）
- **明確事實陳述**：NTI 核心能力、印刷方案、ESG/碳效率數據、認證（FSC/ISO）以可被擷取的清楚句式陳述，數字標明來源。
- **問答結構**：常見問題以 `FAQPage` JSON-LD + 明確 Q/A 段落呈現（彩盒、UV、包裝紙板、永續、報價流程）。
- **實體一致性**：公司名稱（NTI Printing / 南台彩藝）、地址、電話、品牌標語在全站與結構化資料一致 → 利於知識圖譜/實體消歧。
- **權威信號**：認證、案例、ESG 報告作為可引用佐證。

### 2.3 技術落實（backend / frontend）
- `Organization` / `Product` / `FAQPage` / `Article` JSON-LD 完整（與 05-seo 共用，避免重工）。
- 關鍵事實**伺服器端渲染**，不藏在 JS 互動後。
- 評估 `robots.txt` 對 AI 爬蟲（GPTBot、ClaudeBot、PerplexityBot 等）的開放策略——**由客戶決策**是否允許被訓練/擷取，預設允許「擷取以供即時回答」、是否允許「訓練」另議。

> 站內 AI 客服（Claude API/AI Agent）**本期不納入**；GEO 本期聚焦「被外部生成式引擎正確擷取/引用」，不含站內對話機器人。

---

## 3. DoD

- [ ] GEO 規範草案經 `deep-research` 產出並標註調研日期與時效性。
- [ ] 核心事實（能力/方案/ESG 數據/認證）以清楚、可擷取句式呈現，數字有來源。
- [ ] `Organization`/`Product`/`FAQPage`/`Article` JSON-LD 完整且通過驗證。
- [ ] 全站實體資訊（名稱/地址/電話/標語）一致。
- [ ] AI 爬蟲存取策略經**客戶書面決策**並落入 `robots.txt`。

---

## 4. 與其他 Agent 的介面

- ↔ [`05-seo.md`](05-seo.md)：共用結構化資料與可檢索渲染，GEO 不重造輪子。
- ← 內容團隊：可擷取事實/問答內容。
- ← `backend-engineer`：JSON-LD 注入、robots 策略。
- → 客戶：AI 爬蟲開放與否的決策點（寫入專案記憶 `type: project`）。

---

## 5. 風險與對策

| 風險 | 對策 |
|------|------|
| GEO 標準未成熟、過度投資 | deep-research 先評估實益，採低成本高共用項（結構化資料/事實清晰）優先 |
| AI 擷取/訓練政策爭議 | 交客戶書面決策，robots 可隨時調整 |
| 與 SEO 重工 | 共用 05-seo 的 JSON-LD/渲染基礎，本文件只加 GEO 專屬項 |

---

## 變更紀錄

| 日期 | 修改者 | 摘要 |
|------|--------|------|
| 2026-06-12 | Tim（Claude Code） | 初版：定義 GEO（生成式引擎優化）harness 作業書 |
| 2026-06-12 | Tim（Claude Code） | 客戶定案採用 GEO ✅；移除站內 AI 客服（本期不做），GEO 聚焦外部引擎擷取/引用 |

*最後更新：2026-06-12*
