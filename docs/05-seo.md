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
依頁型注入。**2026-09-07 實作時收斂為四種**（`apps/web/src/lib/jsonld.ts`）：

| 型別 | 範圍 | 來源 |
|---|---|---|
| `Organization` | 全站（layout） | mockup 與客戶提供的台南廠址；中文名 `南台彩藝` 取自舊站 `<title>` |
| `WebSite` | 全站（layout） | 同上，`publisher` 指回 `Organization` |
| `BreadcrumbList` | 25／44 頁 | mockup 的 `.crumb`，由 `build-pages.mjs` 產生 `lib/breadcrumbs.ts` |
| `NewsArticle` | CMS 的 `/news/{slug}` | 消息詳細端點 |

**刻意不發的三種**，理由記在此：

- **`FAQPage`**：Google 2023-08 起只對政府與醫療網站顯示 FAQ 複合結果，一般企業站發了不會有任何呈現。
- **`Product`／`Offer`**：方案頁沒有價格、庫存、評價，發了只會在 Search Console 累積必填欄位警告。
- **`VideoObject`**：影片都是 YouTube 嵌入，`thumbnailUrl`／`uploadDate`／`duration` 目前拿不到。

原則：**結構化資料只描述畫面上真的有、且我們有依據的事實**。沒有麵包屑的 19 頁就不發
`BreadcrumbList`——與可見內容不符是 Google 明列的違規項。

### 2.4 渲染與可檢索
- 公開站內容頁採 **Next.js SSG + ISR**（CMS 更新以 webhook 觸發 revalidate）；關鍵內容**不依賴 JS**。
- CMS 後台 SPA 以 `X-Robots-Tag: noindex` / `robots.txt` 排除索引。
- **避免文字圖片化**（標題/正文為可選取文字）。
- 語意化標籤、單一 H1、合理 H2–H3 階層、麵包屑。

### 2.5 效能（Core Web Vitals）
- 圖片 **WebP + lazy load + 壓縮（300–500K）**。
- **Lighthouse 行動版 ≥ 90**；LCP/CLS/INP 達標。
- HTTPS、HTTP/2+、CDN。

### 2.6 索引基礎建設
- `sitemap.xml`（含雙語）、`robots.txt`、canonical 一致、404/410 正確。
- 實作：`apps/web/src/app/sitemap.ts`（44 條靜態路由 × 2 語系＋CMS 消息，逐條帶
  `xhtml:link` hreflang，與各頁 `<head>` 同一組值）、`robots.ts`（預設 `Disallow: /`，
  由 `ALLOW_INDEXING` 開放並附 sitemap 位址）。
- 靜態路由清單由 `build-pages.mjs` 從 mockup 產生（`lib/routes.ts`），不是手寫——
  手寫清單遲早會跟 mockup 脫節。

---

## 3. 既有站遷移（上線關鍵）

1. ✅ **匯出舊站 URL 清單**：`tools/check-legacy-redirects.mjs` 直接抓舊站 sitemap
   （2026-09-07：45 頁 + 82 篇文章 + 2 分類 + 100 標籤＝229 條），可重跑。
2. 🟡 **301 對照表**：`apps/web/src/lib/legacy-redirects.ts`，由 middleware 發 301。
   **229 條都有去處**：59 條有專屬落點（全部固定頁與分類），其餘 170 條
   （100 個標籤封存頁 + 70 篇文章）依客戶 2026-09-07 決定**一律導回首頁**——
   舊連結進來不要讓使用者撞 404。清單為產生檔 `lib/legacy-archive.ts`，
   逐條現況見 [`reference/舊站301對照表.md`](../reference/舊站301對照表.md)。
3. 上線時部署 301、提交新 `sitemap.xml` 至 **Google Search Console**。
4. 上線後監控 GSC 涵蓋率/索引/排名，異常即修。

> 301 對照表為上線 Gate 必交付物，與 [`07-deployment.md`](07-deployment.md) 連動。
>
> ⚠ **導回首頁買到的是使用者體驗，不是 SEO**：內容不對等的轉址會被 Google 判成
> soft 404，權重與 404 一樣傳不過去，GSC 也會列出「重新導向但內容不符」。
> 這是客戶知情下的取捨（2026-09-07）——寧可讓人看到首頁，也不要看到 404。
>
> **內容遷移時的優先順序**：舊站 82 篇文章裡，約 25 篇是節慶營運公告（沒有搜尋價值）、
> 47 篇是 Dr.Print 電子報（綠色印刷／ESG／碳權，**舊站唯一會帶進陌生流量的資產**）。
> 上線前若能拿到舊站 Search Console 的存取權，按點擊排序取前 20–30 個 URL，
> 通常就涵蓋八成以上自然流量——那批才是必須遷移並補上一對一 301 的清單，
> 不需要 80 篇全譯。100 個標籤封存頁是薄內容，新站也沒有標籤體系，維持導回首頁即可。
>
> ⚠ 舊網址帶結尾斜線時會經過兩跳（Next 先 308 去掉斜線、middleware 再 301）。
> 五跳以內 Google 可接受，但新增對照時 key 一律不帶結尾斜線。

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
| 2026-09-07 | Tim（Claude Code） | **客戶決定**：舊站沒有專屬落點的 170 條網址一律 301 回首頁（產生檔 `legacy-archive.ts`），不讓使用者撞 404；同時記錄其 SEO 代價（soft 404、不傳權重）與內容遷移的優先順序 |
| 2026-09-07 | Tim（Claude Code） | §2.3 結構化資料收斂為 `Organization`／`WebSite`／`BreadcrumbList`／`NewsArticle` 四種，並記錄不發 `FAQPage`／`Product`／`VideoObject` 的理由；§2.6 補 `sitemap.ts` 實作；§3 舊站 301 由「待辦」改為 59／229 已實作，附可重跑的覆蓋率檢查 |
| 2026-09-02 | Tim（Claude Code） | §2.2 雙語 URL 由「子路徑**或** hreflang」二選一收斂為明確採用 `/zh`、`/en` 子路徑，並指向 `Page.RouteTemplate` 與 [`db/seed/140_page.sql`](../db/seed/140_page.sql) 的實際清單（路由細節仍待 02-frontend 定案） |
| 2026-09-09 | Tim（Claude Code） | 依客戶 2026-09-08《網站建置 SEO 注意事項》逐條稽核，補上四項缺口：**40 頁的 meta description**（寫進 mockup，經產生器帶到 44 頁）、**36 張圖轉 WebP**（47MB→4.8MB）、**客製化 404**、**預設 og:image 與 Twitter Cards**。仍缺的項目見 STATUS §SEO |

*最後更新：2026-09-09*
