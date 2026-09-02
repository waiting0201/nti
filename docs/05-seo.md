# 05 · SEO — Harness 作業書

| 欄位 | 內容 |
|------|------|
| **主責 Agent** | `system-analyst`（SEO 技術規範制定） |
| **稽核 Agent** | `qa-test-engineer`（上線前/每頁 SEO 驗收） |
| **協作 Agent** | 全體（SEO 是**跨 agent 的交付驗收條件**，非孤立階段） |
| **搭配 Skills** | `verify`（Lighthouse / 結構化資料測試） |
| **對應階段** | P1（規範藍圖）→ P3–P8（落實）→ P9（稽核）→ 上線（301/sitemap/GSC） |
| **核心定位** | 既有站改版重建（`nti-printing.com`，WordPress + All-in-One SEO，約 80 篇/46 頁），**SEO 權重不可流失**。 |
| **適用範圍** | **僅公開網站（Next.js SSR/ISR）**。**CMS 後台為登入後台、不需 SEO**，且應以 `robots`/noindex 排除索引。 |

---

## 1. 上游輸入（硬性規範）

| 來源 | 說明 |
|------|------|
| `reference/sbk/2026_0514 網站建置 SEO 注意事項_南台彩藝股份有限公司.pdf`（37 頁） | **客戶硬性 SEO 規範**，本文件為其落地對照；衝突時以 PDF 為準並回報 |
| 既有 WordPress 站 | 既有 URL/內容 → 301 對照來源 |
| [`04-api.md`](04-api.md) | 內容 API 需回傳的 SEO 欄位 |

> ⚠️ 本文件為規範摘要與落地檢核；細節仍以 SEO 注意事項 PDF 為權威來源。落實前由 system-analyst 對 PDF 逐項拆解成檢核表。

---

## 2. SEO 技術規範（落地檢核項）

### 2.1 可編輯欄位（CMS 必備，見 03/04）
每個內容型別可自訂：`Title`、`Meta description`、`H1`（唯一）、`canonical`、`OG/Twitter card`、`slug`、**圖片 `alt`**。

### 2.2 URL 結構
- 層級 **3–4 層**、**小寫**、**連字號** `-` 分隔、語意化、避免參數化。
- 雙語採 **`/zh`、`/en` 子路徑**（非參數、非子網域），每頁 `hreflang` 中英互指 + `x-default`。
- 固定頁的實際路徑登記在 `Page.RouteTemplate`（如 `/{lang}/about/facility/pre-press`），清單見 [`08-database.md` §6.4](08-database.md) 與 [`db/seed/140_page.sql`](../db/seed/140_page.sql)；動態內容（`news`／`solutions`）的最後一段取自 `*I18n.Slug`，允許中英不同 slug。
- `hreflang` 不落資料庫欄位，由同一筆內容的兩列 i18n 推導（[`08-database.md` §2.7](08-database.md)）。

> ⚠️ 路由細節待 [`02-frontend.md`](02-frontend.md) 定案；`db/seed/140_page.sql` 為現行提案值，改動只需更新該檔，不影響 schema。

### 2.3 結構化資料（JSON-LD）
依頁型注入：`Website`、`Organization`、`BreadcrumbList`、`Product`（印刷方案）、`Article`（NEWS/Green Vlog）、`FAQPage`、必要時 `VideoObject`（案例/Vlog 影片）。

### 2.4 渲染與可檢索
- 公開站內容頁採 **Next.js SSG + ISR**（CMS 更新以 webhook 觸發 revalidate）、會員/個人化頁 SSR/CSR；關鍵內容**不依賴 JS**。
- CMS 後台 SPA 以 `X-Robots-Tag: noindex` / `robots.txt` 排除索引。
- **避免文字圖片化**（標題/正文為可選取文字）。
- 語意化標籤、單一 H1、合理 H2–H3 階層、麵包屑。

### 2.5 效能（Core Web Vitals）
- 圖片 **WebP + lazy load + 壓縮（300–500K）**。
- **Lighthouse 行動版 ≥ 90**；LCP/CLS/INP 達標。
- HTTPS、HTTP/2+、CDN。

### 2.6 索引基礎建設
- `sitemap.xml`（含雙語）、`robots.txt`、canonical 一致、404/410 正確。

---

## 3. 既有站遷移（上線關鍵）

1. **匯出舊站 URL 清單**（80 篇 + 46 頁）。
2. **建立 301 轉址對照表**（舊 URL → 新 URL，一對一，避免轉址鏈）。
3. 上線時部署 301、提交新 `sitemap.xml` 至 **Google Search Console**。
4. 上線後監控 GSC 涵蓋率/索引/排名，異常即修。

> 301 對照表為上線 Gate 必交付物，與 [`07-deployment.md`](07-deployment.md) 連動。

---

## 4. 工作分解

| 階段 | 工作 | 負責 |
|------|------|------|
| P1 | 把 SEO PDF 拆成逐項檢核表；定 URL/hreflang/結構化資料規範 | system-analyst |
| P3–P6 | 前後端落實可編輯欄位、渲染策略、結構化資料 | frontend / backend |
| P8 | 內容遷移 + 301 對照表 + sitemap | backend + 內容團隊 |
| P9 | 全站 SEO 稽核（Lighthouse、Rich Results Test、hreflang 檢查） | qa-test-engineer |
| 上線 | 提交 sitemap、部署 301、GSC 監控 | backend（DevOps） |

---

## 5. DoD（SEO 驗收，逐頁 + 全站）

**逐頁**：
- [ ] Title/Meta/H1/canonical/OG/slug/圖片 alt 皆可編輯且已填。
- [ ] URL 合規（3–4 層、小寫、連字號）、hreflang 中英互指。
- [ ] 對應頁型 JSON-LD 通過 Rich Results Test。
- [ ] Lighthouse 行動版 ≥ 90；無文字圖片化；關鍵內容非 JS 依賴。

**全站／上線**：
- [ ] `sitemap.xml`（雙語）+ `robots.txt` 正確。
- [ ] 301 對照表完整、無轉址鏈/迴圈、舊重要頁全覆蓋。
- [ ] sitemap 已提交 GSC，索引監控就緒。

---

## 6. 與其他 Agent 的介面

- → 全體：本文件 DoD 併入各頁面/模組「完成」定義（見總則 §4）。
- ← `backend-engineer`：CMS 提供 SEO 欄位 + 301 + sitemap 產生。
- ← `frontend-architect`：渲染策略、結構化資料注入、效能。
- → `qa-test-engineer`：稽核依本檢核表執行。
- ↔ [`06-geo.md`](06-geo.md)：SEO（傳統搜尋）與 GEO（生成式引擎）共用結構化資料與內容品質基礎。

---

## 7. 風險與對策

| 風險 | 對策 |
|------|------|
| 舊站權重流失 | 301 對照表 + sitemap 提交 + GSC 監控（總則風險表對應） |
| SEO 變事後補做 | 列為各頁 DoD，P9 前持續驗，不留尾 |
| 文字圖片化 | 設計階段即標註（見 01-design），稽核時抓 |
| 雙語 hreflang 錯置 | i18n 對照齊備後再上線，qa 專項檢查 |

---

## 變更紀錄

| 日期 | 修改者 | 摘要 |
|------|--------|------|
| 2026-06-12 | Tim（Claude Code） | 初版：定義 SEO harness 作業書 |
| 2026-06-12 | Tim（Claude Code） | 範圍限定公開站、CMS noindex；補 Next.js SSG+ISR 重生策略與 Pacdora 頁面說明 |
| 2026-06-16 | Tim（Claude Code） | Pacdora／3D 包裝客製本期不納入（廠商不提供技術崁入服務）；移除 Pacdora 頁面 SEO 說明 |
| 2026-09-02 | Tim（Claude Code） | §2.2 雙語 URL 由「子路徑**或** hreflang」二選一收斂為明確採用 `/zh`、`/en` 子路徑，並指向 `Page.RouteTemplate` 與 [`db/seed/140_page.sql`](../db/seed/140_page.sql) 的實際清單（路由細節仍待 02-frontend 定案） |

*最後更新：2026-09-02*
