# NTI Printing 官網 — Harness 文件總覽

> 本檔整合三部分於一處：**A. Agent 編排總則**、**B. Claude Code 環境設定**、以及**分項作業書索引**。
> 各建置領域（設計／前端／後端／API／SEO／GEO／部署）的細節，拆成同層的 7 份分項作業書（見下表）。
> 搭配[網站建置時程](../reference/網站建置時程.html)（PDF）一起閱讀。

---

## 分項作業書索引

| # | 領域 | 文件 | 主責 Agent | 協作 Agent | 對應階段 |
|---|------|------|-----------|-----------|----------|
| 01 | 設計 Design（含競品設計分析） | [01-design.md](01-design.md) | `visual-design-architect` | frontend-architect | P2 |
| 02 | 前端 Frontend | [02-frontend.md](02-frontend.md) | `frontend-architect` | visual-design-architect、backend-engineer | P3 / P5 / P6 |
| 03 | 後端／CMS Backend | [03-backend.md](03-backend.md) | `backend-engineer` | system-analyst | P4 / P6 |
| 04 | API | [04-api.md](04-api.md) | `system-analyst`（契約）+ `backend-engineer`（實作） | frontend-architect | P1 / P4 |
| 05 | SEO | [05-seo.md](05-seo.md) | `system-analyst`（規範）+ `qa-test-engineer`（稽核） | 全體 | P1→P9（跨階段） |
| 06 | GEO（生成式引擎優化） | [06-geo.md](06-geo.md) | `deep-research`（skill）+ `system-analyst` | 內容團隊 | P1 / P8 |
| 07 | 部署 Deployment | [07-deployment.md](07-deployment.md) | `backend-engineer`（DevOps 角色） | system-analyst | P11 |
| 08 | 資料庫設計 Database | [08-database.md](08-database.md) | `system-analyst`（schema）+ `backend-engineer`（建置） | — | P1 / P4 |
| 09 | 後台 CMS 功能 | [09-cms-admin.md](09-cms-admin.md) | `backend-engineer` | system-analyst | P4 / P6 |

> SEO／GEO 為**跨 agent 的交付驗收條件**，不是孤立階段——每個前台頁面與 CMS 模組完成前都需滿足其 DoD（見 §A4）。

---

## 技術選型（已凍結 2026-06-12）

| 層 | 選定 | 說明 |
|----|------|------|
| 公開網站（前端） | **Next.js（SSR + ISR）** | 需 SEO + GEO；內容頁 ISR、會員/個人化頁 SSR/CSR |
| 公開站 host | **Azure Static Web Apps**（Free 起，必要時 Standard；SSR 撞限制則退 Container Apps） | Next.js SSR/ISR 一級支援 |
| CMS 後台（後端管理介面） | **純 SPA**（靜態），**不需 SEO** | 登入後台用，host 同 SWA Free / Blob 靜態 |
| API | **Azure Functions .NET 10**（isolated、Consumption） | 唯一資料存取層，**Dapper** + Azure SQL |
| 資料庫 | **Azure SQL Database — Basic 層** | 已定案 |
| 媒體/檔案 | **Azure Blob Storage** | 設計稿、媒體 |
| 3D 包裝客製 | **本期不納入** | 曾評估 Pacdora 整合，但廠商不提供技術崁入（embedding）服務，故本期不納入；如需 3D 客製改以樣板+人工報價或後續另案評估 |
| AI 客服 | **暫不納入本期** | Claude API/AI Agent 浮動按鈕本期不做，後續再評估 |

> 月費約 $7–18（East Asia）。公開站 SSR host 的 SWA Free 額度需上線前以實際流量驗證。

---

# A. Agent 編排總則

> 定義本**重建專案**在 Claude Code 環境中的 agent 編排策略：哪個 agent 負責哪一段、用哪些 skills、產出什麼、在哪個關卡交付與驗證。

## A0. 專案前提（影響 agent 編排）

| 事實 | 來源 | 對編排的影響 |
|------|------|--------------|
| **非全新案，是改版重建** | 既有站 `nti-printing.com`（WordPress + All-in-One SEO，約 80 篇文章 / 46 頁） | 需 **內容遷移 agent** 與 **301 轉址規劃**，非單純開發 |
| **設計稿已存在** | `reference/WebsiteDesign/*.psd`（首頁、NTI Difference、Printing Solution、Green Advantage、Facility） | 設計 agent 為「**轉譯既有視覺 → 設計系統 + RWD**」，非從零發想 |
| **客戶需求＝差異化** | `NTI Printing 官網客戶需求.docx` | 內容/文案需強調 核心能力 × 解決方案 × ESG，避免型錄式 |
| **硬性 SEO 規範** | `2026_0514 網站建置 SEO 注意事項.pdf`（37 頁） | SEO 為**跨 agent 的交付驗收條件**，非獨立階段 |
| **客戶囉唆、不懂裝懂** | 專案備註 | 每階段強制 **原型先行 + 書面簽核 Gate**；agent 產出需可被非技術客戶看懂 |

## A1. Agent 角色編組（Roster）

| Agent | 專案職責 | 主要 skills | 關鍵交付物 |
|-------|----------|-------------|------------|
| **software-architect-blueprint** | 需求拆解、使用流程、產品藍圖、範圍界定（含 out-of-scope） | — | 需求規格書、範圍確認書、藍圖 |
| **system-analyst** | 系統架構、DB schema、API 結構、SEO 技術規範 | — | 技術規格書、ER Model、API 文件 |
| **visual-design-architect** | 既有 PSD → 設計系統 + 響應式版型 + 可點擊原型 | `frontend-design` | Design tokens、各頁 RWD 設計稿、互動原型 |
| **frontend-architect** | Next.js 前台、i18n 雙語、共用元件、CMS 串接 | `frontend-design`、`run`、`verify` | 前台站台、元件庫 |
| **backend-engineer** | 自建 CMS、API（Azure Functions .NET 10）、會員系統、報價/聯絡、權限角色、媒體/Blob | `run`、`verify` | API 服務、CMS 後台、DB |
| **qa-test-engineer** | 功能/RWD/跨瀏覽器/無障礙/SEO/效能稽核（只審不改） | `verify` | 缺失報告、驗收檢核表 |
| **code-review-optimizer** | 每次合併前的程式碼審查與重構建議 | `code-review`、`simplify` | Review 報告、修正項 |
| **deep-research（skill）** | 競品（DNP/Toppan/Amcor 等）分析 | `deep-research` | 研究報告、PoC 建議 |

> 行動裝置採 **RWD 響應式**（依 SEO 規範），**不需** `mobile-app-engineer`（無原生 App）。

## A2. 階段 → Agent 對應（Phase Mapping）

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
P6 會員/報價/聯絡        → backend + frontend（AI 客服本期不做）
P8 內容遷移/雙語/SEO實作  → backend + 內容團隊（301 map、結構化資料、WebP/alt）
        ▼
P9 整合測試/QA/效能/SEO稽核 → qa-test-engineer + code-review-optimizer (verify)
P10 UAT 客戶驗收           → 全體支援，PM 主導書面驗收
P11 上線/移交             → backend-engineer (run)
P12 保固維運              → 視缺失指派
```

## A3. 編排模式（Orchestration Patterns）

**A3.1 序列關卡（P0→P1→P2）** — 需求與設計階段**嚴格序列**、每階段以 Gate 簽核收斂。針對「不懂裝懂」客戶，**設計原型（P2）必須在任何開發前完成並簽核** —— 讓客戶「先看得到、再開發」，把「我以為是這樣」擋在寫程式之前。

**A3.2 平行 fan-out（P3‖P4‖P5）** — 前端與後端在設計定稿後平行推進，以 **API 契約（§04）** 為介面，雙方並行不互鎖。每個 PR 合併前由 `code-review-optimizer` 把關，再由 `qa-test-engineer` 抽審。

**A3.4 持續驗證** — 所有可執行交付物以 `run`／`verify` skill 在真實環境跑起來確認；SEO 規範（Lighthouse / Core Web Vitals / 結構化資料測試）列為 `qa-test-engineer` 的**驗收條件**，而非事後補做。

## A4. 跨 Agent 的交付驗收條件（DoD）

每個前台頁面 / CMS 模組「完成」前，需同時滿足：

- **功能**：符合規格書，`verify` 實機通過。
- **SEO**：可自訂 Title/Meta/H1/canonical/OG/slug/圖片 alt；URL 3–4 層、小寫、連字號；hreflang 雙語對應；JSON-LD（Website/Breadcrumb/Product/Article/FAQ/Organization）。
- **效能**：圖片 WebP + lazy load + 壓縮（300–500K）；Lighthouse 行動版 ≥ 90。
- **RWD**：桌機／平板／手機三斷點。
- **無障礙 / HTTPS / 可檢索**：避免文字圖片化、重要資訊不依賴 JS。
- **i18n**：中／英內容對照齊備。
- **品質**：通過 `code-review-optimizer` 審查。

## A5. Skills 使用約定

| Skill | 何時用 |
|-------|--------|
| `frontend-design` | 設計系統、所有前台元件/頁面開發 |
| `run` / `verify` | 每次改動後實機啟動、驗證行為（提交客戶 Demo 前必做） |
| `code-review` / `simplify` | 每次合併前；客戶驗收前的整體體檢 |
| `deep-research` | 競品分析 |

## A6. Memory 與情境約定

- 客戶決策、需求凍結內容、變更紀錄 → 寫入專案記憶（`type: project`），並轉成絕對日期。
- 客戶溝通慣例與雷點（如「不懂裝懂、需原型先行」）→ `type: feedback`，附 **Why / How to apply**。
- 既有 WordPress 結構等 → `type: reference`，附來源連結。

## A7. 風險與對策（與時程表 PDF 對應）

| 風險 | 觸發點 | 對策（編排層面） |
|------|--------|------------------|
| 客戶反覆改需求 | 全程 | 需求凍結 + 變更管理 CR 流程；原型先行 |
| 客戶誤解技術 | 評審/驗收 | agent 產出白話化、附截圖/原型；避免術語 |
| 舊站 SEO 權重流失 | 上線 | 301 轉址對照表、sitemap 提交、GSC 監控 |
| 雙語內容延遲 | P8 | 內容遷移與開發解耦，內容缺口不卡開發 |

---

# B. Claude Code 環境設定

> 記錄此專案使用 Claude Code（Anthropic 官方 CLI agent）的相關設定與慣例。

## B1. 目錄結構

```
NTI/
├── CLAUDE.md                  # 專案規範與索引（agent 每次載入）
├── .claude/
│   └── settings.local.json    # 本機 harness 設定（權限等，不進版控）
├── docs/                      # 文件區（本總覽 + 7 份分項作業書）
│   ├── README.md              # 本檔：Harness 總覽（編排總則 + 設定 + 索引）
│   ├── 01-design.md … 07-deployment.md
├── reference/                 # 規劃案原始文件（客戶素材在 reference/sbk/）
└── mockup/                    # 靜態切版稿（用過即丟）
```

## B2. settings.local.json（權限設定）

位置：`.claude/settings.local.json`，本機個人設定，通常不納入版控。若要團隊共用改寫入 `.claude/settings.json`。調整權限可用 `/permissions` 或 `update-config` skill。

| 權限 | 用途 |
|------|------|
| `Bash(python3 -c ":*")` | 執行 inline Python |
| `Bash(pip3 install python-pptx)` | 安裝簡報產生套件 |
| `Bash(python3 generate_pptx.py)` | 產生規劃書 PPTX |
| `Bash(python3:*)` | 一般 Python 指令 |

## B3. 可用的 Skills（斜線指令）

| Skill | 用途 |
|-------|------|
| `frontend-design` | 產生高品質前端介面（建置官網頁面時使用） |
| `run` | 啟動並驗證專案 app |
| `verify` | 實際執行 app 驗證改動是否如預期 |
| `code-review` / `simplify` | 程式碼審查／重構 |
| `security-review` | 安全審查 |
| `deep-research` | 競品分析 |
| `update-config` | 調整 harness 設定（權限、env、hooks） |

## B4. Memory（持久記憶）

Agent 具備檔案式持久記憶，位於使用者層級：
`~/.claude/projects/-Users-tim-webapps-NTI/memory/`

用於跨 session 記住使用者偏好、專案決策等。專案本身的規範請寫入 `CLAUDE.md`，而非 memory。

## B5. 慣例

- 文件一律放 `docs/`，規劃原始檔放 `reference/`（客戶素材 `reference/sbk/`）。
- `CLAUDE.md` 為單一索引入口，新增重要文件時於其中補上連結。
- 此專案目前**非 git repo**；若要進版控需先 `git init`。

---

## 文件使用約定

1. **單一事實來源**：各領域規格以對應分項文件（01–07）為準；本檔 §A 只保留編排層面的決策。兩者衝突時，先更新 §A 再回寫分項。
2. **每份文件都帶「變更紀錄」表**：任何修改（含他人代改）都要在該表補一列（日期 / 修改者 / 摘要），並同步更新本檔末端「最後更新」日期。詳見下方〈變更紀錄維護規範〉。
3. **檔案放置**：harness engineering 文件一律放 `docs/`；產出的規劃／時程／設計檔放 `reference/`（見 [CLAUDE.md](../CLAUDE.md) 工作慣例）。

## 變更紀錄維護規範（重要）

> 客戶「不懂裝懂、會反覆改需求」，文件可追溯性是專案防線之一。**有改必記**。

每次修改任一文件時：
1. 在該文件「變更紀錄」表新增一列：`| YYYY-MM-DD | 修改者 | 一行摘要 |`。
2. 若修改牽動跨領域介面（如 API 契約、SEO 規範、設計 token），於相關文件同步補記。
3. 更新本檔末端「最後更新」日期。
4. 若為客戶決策／需求凍結／變更（CR），另寫入專案記憶（`type: project`，轉絕對日期）。

---

## 變更紀錄

| 日期 | 修改者 | 摘要 |
|------|--------|------|
| 2026-06-12 | Tim（Claude Code） | 建立分項 harness 文件架構，新增 01–07 七份作業書與索引 |
| 2026-06-12 | Tim（Claude Code） | 凍結技術選型（Next.js SSR/ISR + Azure Functions .NET10 + Azure SQL Basic + Blob + SWA）；AI 客服暫緩、納入 Pacdora 3D；資料存取定為 Dapper |
| 2026-06-12 | Tim（Claude Code） | 整併 docs/：移除 harness/ 子資料夾、檔案攤平至 docs/；本檔吸收原 harness-engineering.md（編排總則）與 harness.md（Claude Code 設定）；競品分析併入 01-design.md |
| 2026-06-16 | Tim（Claude Code） | Pacdora／3D 包裝客製本期不納入（廠商不提供技術崁入服務）；移除 P7 整合 track、G 關卡、相關研究/職責/成本/風險 |

*最後更新：2026-06-16｜對應時程：見 `reference/網站建置時程.html` 與 PDF。*
