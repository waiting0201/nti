# 02 · 前端 Frontend — Harness 作業書

| 欄位 | 內容 |
|------|------|
| **主責 Agent** | `frontend-architect` |
| **協作 Agent** | `visual-design-architect`（設計交付）、`backend-engineer`（API/CMS 串接）、`system-analyst`（SEO/i18n 技術約束） |
| **搭配 Skills** | `frontend-design`、`run`、`verify` |
| **對應階段** | P3（前端框架/元件）／P5（前台頁面）／P6（會員/報價/聯絡）／P7（Pacdora 前端嵌入） |
| **核心定位** | 以**設計定稿**與 **API 契約**為雙介面，與後端平行 fan-out 不互鎖。 |

---

## 1. 上游輸入

| 來源 | 用途 |
|------|------|
| [`01-design.md`](01-design.md) 交付（tokens + 元件規格 + 三斷點稿） | 切版契約 |
| [`04-api.md`](04-api.md) API 契約 | 資料串接介面（先 mock 後接真值） |
| [`05-seo.md`](05-seo.md) SEO 技術規範 | 渲染策略、meta、結構化資料、URL/hreflang |
| [`mockup/`](../mockup/) 靜態切版稿 | 既有版型落地參考 |

---

## 2. 技術基線（待 P1 system-analyst 最終確認）

| 項目 | 選定 | 備註 |
|------|------|------|
| 框架 | **Next.js（React）— SSR + ISR** | Azure SWA 一級支援；SSR/ISR 滿足 SEO/GEO |
| 渲染 | **內容頁 SSG + ISR**（背景/webhook 重生）、**會員/報價/個人化頁 SSR 或 CSR** | 內容頁 HTML 由 CDN 出，訪客不觸發 Node 渲染、也不打醒 Functions 冷啟動 |
| i18n | 中／英雙語，`hreflang` 對應 | 路由 `/zh`、`/en` 或 domain 策略由 SEO 文件定 |
| 樣式 | 對應 design tokens（CSS variables / Tailwind） | 與 01-design tokens 一致 |
| 資料來源 | **只呼叫 .NET API（[`04-api.md`](04-api.md)），前端不直連 DB** | 公開站只負責呈現 |
| 部署 | **Azure Static Web Apps**（Free 起，SSR 撞限制退 Container Apps） | 見 [`07-deployment.md`](07-deployment.md) |

> ✅ 技術選型已凍結（見 [`README.md`](README.md) 技術選型）。CMS 後台為**獨立純 SPA**、不需 SEO，與本公開站分開部署。

---

## 3. 範圍（對應 sitemap）

- **共用元件**：Header（多層下拉、語系切換、會員入口）、Footer、Floating Button（Get a Quote／Contact Us；~~AI Agent 本期不做~~）、麵包屑、分頁、卡片、輪播、表單元件。
- **首頁**：Banner/Videos 輪播、COURAGE 互動區、Printing、Project 卡、Clients 輪播。
- **內容頁（吃 CMS）**：NTI Difference、Printing Solution（+4 子方案）、Projects（總覽 + 詳細）、Facility & Equipment、Advantages（數據統計區）、NEWS（列表 + 詳細）、Green Vlog（含 YouTube 嵌入）、Supplier Area（公告/規格/下載）、Privacy & Legal。
- **功能頁**：Get a Quote（含檔案上傳）、Contact Us（Google Map 嵌入）、Member（登入/註冊/會員中心/報價紀錄/訂單）。
- **Pacdora 3D 包裝客製**（P7）：於 Printing Solution／Get a Quote 嵌入 Pacdora 3D 設計/預覽（SDK/iframe/API，依 PoC 決定），把「客製設計結果 → 報價」串成一條動線（參考案例：riiqi 紙杯）。3D 元件為互動工具、不需被索引，但其所在頁面的周邊內容仍須 SSR/SEO。
- ~~AI 客服~~：本期不做（Claude API/AI Agent 暫緩）。

---

## 4. 工作分解

1. **專案骨架**（P3）：Next.js + i18n + tokens + 共用 layout（Header/Footer/Floating）。
2. **元件庫**：對齊 01-design 元件，Storybook 或等效清單。
3. **內容頁**（P5）：串 CMS 資料，先以 API mock 開發，契約穩定後接真值。
4. **功能頁**（P6）：表單驗證、檔案上傳、會員流程（登入/註冊/忘記密碼/會員中心）。
5. **Pacdora 嵌入**（P7）：依 deep-research → PoC 結果整合「客製設計 → 報價」動線；預留嵌入點位，不提前 hardcode 整合方式。
6. **i18n 內容串接**（P8）：中英對照、語系切換、hreflang。

---

## 5. DoD（每個前台頁面完成前需同時滿足）

- [ ] **功能**：符合規格書，`verify` 實機通過。
- [ ] **SEO**：可自訂 Title/Meta/H1/canonical/OG/slug/圖片 alt；URL 3–4 層、小寫、連字號；hreflang 雙語對應；JSON-LD（Website/Breadcrumb/Product/Article/FAQ/Organization）。
- [ ] **效能**：圖片 WebP + lazy load + 壓縮（300–500K）；**Lighthouse 行動版 ≥ 90**。
- [ ] **RWD**：桌機／平板／手機三斷點。
- [ ] **無障礙 / HTTPS / 可檢索**：避免文字圖片化、重要資訊不依賴 JS、語意化標籤、鍵盤可操作。
- [ ] **i18n**：中／英內容對照齊備、英文不破版。
- [ ] **品質**：通過 `code-review-optimizer` 審查。

---

## 6. 與其他 Agent 的介面

- ← `visual-design-architect`：設計交付為切版來源；切版可行性問題回饋給設計。
- ↔ `backend-engineer`：以 [`04-api.md`](04-api.md) 契約為介面，前端先 mock、後端並行實作；契約變更雙方同步。
- ← `system-analyst`：SEO/i18n/渲染策略約束。
- → `qa-test-engineer`：交付供 RWD/跨瀏覽器/無障礙/效能稽核。

---

## 7. 風險與對策

| 風險 | 對策 |
|------|------|
| API 契約未定卡前端 | 以 04-api 契約 + mock server 解耦，契約凍結後接真值 |
| SSR host 未定 | 以 Next.js 標準寫法，避免綁定特定平台；部署選型見 07 |
| Pacdora 整合不確定 | 等 P7 PoC 結果，前端預留嵌入點位，不提前 hardcode |
| 重要資訊依賴 JS 傷 SEO | SSR/SSG 關鍵內容，client 僅做漸進增強 |

---

## 變更紀錄

| 日期 | 修改者 | 摘要 |
|------|--------|------|
| 2026-06-12 | Tim（Claude Code） | 初版：定義前端領域 harness 作業書 |
| 2026-06-12 | Tim（Claude Code） | 凍結 Next.js SSR/ISR + Azure SWA；移除 AI 客服；強化 Pacdora 3D 嵌入與報價動線 |

*最後更新：2026-06-12*
