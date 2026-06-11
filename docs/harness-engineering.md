# NTI Printing 官網 — Harness Engineering（Agent 編排規範）

> 本文定義 NTI Printing（南台彩藝）官網**重建專案**在 Claude Code 環境中的 agent 編排策略：
> 哪個 agent 負責哪一段工作、用哪些 skills、產出什麼、在哪個關卡交付與驗證。
> 搭配[網站建置時程](網站建置時程.html)（PDF）一起閱讀。

---

## 0. 專案前提（影響 agent 編排）

| 事實 | 來源 | 對編排的影響 |
|------|------|--------------|
| **非全新案，是改版重建** | 既有站 `nti-printing.com`（WordPress + All-in-One SEO，約 80 篇文章 / 46 頁） | 需 **內容遷移 agent** 與 **301 轉址規劃**，非單純開發 |
| **設計稿已存在** | `planning/reference/Website Design/*.psd`（首頁、NTI Difference、Printing Solution、Green Advantage、Facility） | 設計 agent 為「**轉譯既有視覺 → 設計系統 + RWD**」，非從零發想 |
| **客戶需求＝差異化** | `NTI Printing 官網客戶需求.docx` | 內容/文案需強調 核心能力 × 解決方案 × ESG，避免型錄式 |
| **硬性 SEO 規範** | `2026_0514 網站建置 SEO 注意事項.pdf`（37 頁） | SEO 為**跨 agent 的交付驗收條件**，非獨立階段 |
| **Pacdora（Pandora）3D 包裝整合** | `Pandora.txt`（pacdora.com、riiqi.com.tw 案例） | 第三方不確定性高 → **deep-research + PoC 先行**，獨立關卡 |
| **客戶囉唆、不懂裝懂** | 專案備註 | 每階段強制 **原型先行 + 書面簽核 Gate**；agent 產出需可被非技術客戶看懂 |

---

## 1. Agent 角色編組（Roster）

| Agent | 專案職責 | 主要 skills | 關鍵交付物 |
|-------|----------|-------------|------------|
| **software-architect-blueprint** | 需求拆解、使用流程、產品藍圖、範圍界定（含 out-of-scope） | — | 需求規格書、範圍確認書、藍圖 |
| **system-analyst** | 系統架構、DB schema、API 結構、SEO 技術規範、Pacdora 整合介面定義 | — | 技術規格書、ER Model、API 文件 |
| **visual-design-architect** | 既有 PSD → 設計系統 + 響應式版型 + 可點擊原型 | `frontend-design` | Design tokens、各頁 RWD 設計稿、互動原型 |
| **frontend-architect** | Next.js 前台、i18n 雙語、共用元件、CMS 串接、Pacdora 前端嵌入 | `frontend-design`、`run`、`verify` | 前台站台、元件庫 |
| **backend-engineer** | 自建 CMS、API、會員系統、報價/聯絡、權限角色、媒體/S3、AI 客服、Pacdora 後端串接 | `run`、`verify` | API 服務、CMS 後台、DB |
| **qa-test-engineer** | 功能/RWD/跨瀏覽器/無障礙/SEO/效能稽核（只審不改） | `verify` | 缺失報告、驗收檢核表 |
| **code-review-optimizer** | 每次合併前的程式碼審查與重構建議 | `code-review`、`simplify` | Review 報告、修正項 |
| **deep-research（skill）** | Pacdora API/SDK 可行性、競品（DNP/Toppan/Amcor 等）分析 | `deep-research` | 研究報告、PoC 建議 |

> 行動裝置採 **RWD 響應式**（依 SEO 規範），**不需** `mobile-app-engineer`（無原生 App）。

---

## 2. 階段 → Agent 對應（Phase Mapping）

```
P0 啟動/需求凍結        → software-architect-blueprint          ┐ 序列關卡
P1 系統分析/架構/SEO藍圖  → system-analyst                        │ (Gate 簽核後才下一步)
P2 UI/UX 設計 + 原型     → visual-design-architect (frontend-design)┘
        │  G2 設計定稿簽核（不懂裝懂客戶的關鍵防線）
        ▼
P3 前端框架/元件   ─┐
P4 後端/CMS        ─┼─ 平行 fan-out（frontend-architect ‖ backend-engineer）
                   │     每次合併 → code-review-optimizer
P5 前台頁面開發    ─┘
        ▼
P6 會員/報價/聯絡/AI客服  → backend + frontend
P7 Pacdora 3D 整合       → deep-research → PoC → backend + frontend（獨立關卡）
P8 內容遷移/雙語/SEO實作  → backend + 內容團隊（301 map、結構化資料、WebP/alt）
        ▼
P9 整合測試/QA/效能/SEO稽核 → qa-test-engineer + code-review-optimizer (verify)
P10 UAT 客戶驗收           → 全體支援，PM 主導書面驗收
P11 上線/移交             → backend-engineer (run)
P12 保固維運              → 視缺失指派
```

---

## 3. 編排模式（Orchestration Patterns）

### 3.1 序列關卡（P0→P1→P2）
需求與設計階段**嚴格序列**、每階段以 Gate 簽核收斂。針對「不懂裝懂」客戶，**設計原型（P2）必須在任何開發前完成並簽核** —— 讓客戶「先看得到、再開發」，把「我以為是這樣」擋在寫程式之前。

### 3.2 平行 fan-out（P3‖P4‖P5）
前端與後端在設計定稿後平行推進，以 **API 契約（system-analyst 的 API 文件）** 為介面，雙方並行不互鎖。每個 PR 合併前由 `code-review-optimizer` 把關，再由 `qa-test-engineer` 抽審。

### 3.3 研究 → PoC → 整合（P7 Pacdora）
第三方整合風險最高，採三段式：
1. `deep-research` 釐清 Pacdora 是 **SDK 嵌入 / iframe / API** 何種整合方式、授權與費用、可否帶設計結果進報價流程。
2. 最小 **PoC**（單一品項 3D 預覽）→ 交付 **G-Pacdora 關卡**簽核。
3. 確認可行後才正式整合，並把「客製化設計 → 報價」串成一條動線。

> 若 PoC 顯示不可行或超出預算，於關卡即時止損、改為「樣板選擇 + 人工報價」備案，避免拖累主線。

### 3.4 持續驗證
所有可執行交付物以 `run`／`verify` skill 在真實環境跑起來確認；SEO 規範（Lighthouse / Core Web Vitals / 結構化資料測試）列為 `qa-test-engineer` 的**驗收條件**，而非事後補做。

---

## 4. 跨 Agent 的交付驗收條件（DoD）

每個前台頁面 / CMS 模組「完成」前，需同時滿足：

- **功能**：符合規格書，`verify` 實機通過。
- **SEO**：可自訂 Title/Meta/H1/canonical/OG/slug/圖片 alt；URL 3–4 層、小寫、連字號；hreflang 雙語對應；JSON-LD（Website/Breadcrumb/Product/Article/FAQ/Organization）。
- **效能**：圖片 WebP + lazy load + 壓縮（300–500K）；Lighthouse 行動版 ≥ 90。
- **RWD**：桌機／平板／手機三斷點。
- **無障礙 / HTTPS / 可檢索**：避免文字圖片化、重要資訊不依賴 JS。
- **i18n**：中／英內容對照齊備。
- **品質**：通過 `code-review-optimizer` 審查。

---

## 5. Skills 使用約定

| Skill | 何時用 |
|-------|--------|
| `frontend-design` | 設計系統、所有前台元件/頁面開發 |
| `run` / `verify` | 每次改動後實機啟動、驗證行為（提交客戶 Demo 前必做） |
| `code-review` / `simplify` | 每次合併前；客戶驗收前的整體體檢 |
| `deep-research` | Pacdora 整合研究、競品分析 |

---

## 6. Memory 與情境約定

- 客戶決策、需求凍結內容、變更紀錄 → 寫入專案記憶（`type: project`），並轉成絕對日期。
- 客戶溝通慣例與雷點（如「不懂裝懂、需原型先行」）→ `type: feedback`，附 **Why / How to apply**。
- 既有 WordPress 結構、Pacdora 介面細節 → `type: reference`，附來源連結。

---

## 7. 風險與對策（與時程表 PDF 對應）

| 風險 | 觸發點 | 對策（編排層面） |
|------|--------|------------------|
| 客戶反覆改需求 | 全程 | 需求凍結 + 變更管理 CR 流程；原型先行 |
| 客戶誤解技術 | 評審/驗收 | agent 產出白話化、附截圖/原型；避免術語 |
| Pacdora 不可行/超支 | P7 PoC | 研究→PoC→關卡止損；備案＝樣板+人工報價 |
| 舊站 SEO 權重流失 | 上線 | 301 轉址對照表、sitemap 提交、GSC 監控 |
| 雙語內容延遲 | P8 | 內容遷移與開發解耦，內容缺口不卡開發 |

---

*最後更新：2026-06-11｜對應時程：見 `docs/網站建置時程.html` 與 PDF。*
