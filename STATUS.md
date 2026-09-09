# 專案進度總表

> **這份文件是「做到哪裡了」的單一真相來源。** 每完成一項就更新對應那格。
>
> 分工：本檔記錄**狀態**；[`docs/`](docs/README.md) 的十份作業書記錄各領域的**規格與施工標準**；
> [`CLAUDE.md`](CLAUDE.md) 記錄**專案規範與索引**。三份不要互相抄，各司其職。

**最後更新**：2026-09-09

---

## 一句話現況

**前端切版、後台介面、部署管線三條線已完成並在 Azure 上運作**——
公開站 44 頁與後台 23 單元同站部署於 `stapp-nti-prod`，素材走 Blob，
push 到 GitHub 即自動部署。後台目前接的是本機 mock，所有內容都是從 mockup 與 `db/seed`
產生的種子資料——**資料庫與業務端點都還沒做**。

**整條線已經在 Azure 上跑起來了**：API、資料庫、111 筆內容都上線，公開站與後台
都已切換到 CMS，客戶現在可以在線上後台改內容、在線上公開站看到結果。
剩下的是上線前的收尾（正式網域、reCAPTCHA、SMTP、中文校閱）。
⚠ **中文是機器翻譯初稿，上線前必須由客戶校閱**（見 db/content/README）。

---

## 圖例

| 記號 | 意思 |
|---|---|
| ✅ | 完成且驗證過 |
| 🟡 | 部分完成／有已知缺口 |
| ⬜ | 未開工 |
| ⛔ | 本期不納入（已決策） |

---

## 一、總覽

| 階段 | 領域 | 狀態 | 備註 |
|---|---|---|---|
| P0 | 需求凍結 | ✅ | 規劃書、sitemap、時程皆在 `reference/` |
| P1 | 系統分析／架構 | ✅ | 技術選型 2026-06-12 凍結，2026-09-02 修訂為 EF+Dapper 雙軌 |
| P2 | UI/UX 設計 + 原型 | ✅ | `mockup/` 44 頁，客戶已定案（`mockup2/` 未採用） |
| P3 | 前端框架／元件 | ✅ | Next.js App Router，共用元件與各頁行為自 mockup 移植 |
| P4 | 後端／CMS API | ✅ | 程式、資源、內容、CI 全數完成並上線（見 §五、§六） |
| P5 | 前台頁面開發 | 🟡 | 44 頁切版完成；內容仍為靜態，未接 API |
| P6 | 報價／聯絡表單 | ✅ | 兩支表單已接上後端，含附件上傳與 reCAPTCHA v3（2026-09-08） |
| P8 | 內容遷移／雙語／SEO 實作 | 🟡 | 雙語完成（CMS 內容 + 44 頁靜態文字皆有中文，**待客戶校閱**）；sitemap／結構化資料／舊站 301 已做，客戶 SEO 清單的 meta description／WebP／客製 404／OG＋Twitter 四項於 2026-09-09 補齊（見 §二）。標籤體系與 301 轉址單元於 2026-09-09 完成（舊站 100 個 `/tag/*` 有 99 條 1:1 轉址）。仍缺 GA4／GSC（要客戶帳號）；舊站 80 篇文章的落點待內容遷移 |
| P9 | 整合測試／QA／SEO 稽核 | ⬜ | |
| P10 | UAT 客戶驗收 | ⬜ | |
| P11 | 部署 | ✅ | SWA + Blob + CI 全通（見 §六） |
| — | AI 客服 | ⛔ | 本期不納入 |
| — | 會員系統／訂單與生產進度 | ⛔ | **2026-09-06 移出範圍**：客戶 2026-08-31 sitemap 無會員節點，mockup 44 頁亦無會員中心。前後端、資料表與後台單元皆已移除 |
| — | 3D 包裝客製（Pacdora） | ⛔ | 廠商不提供技術崁入服務 |

---

## 二、前台頁面（44 頁）

`apps/web`，Next.js App Router，1:1 承接 `mockup/`。

### ✅ 已完成

- **44 頁全數切版**，由 `scripts/build-pages.mjs` 從 mockup 機械式產生，結構、class、文案一字未動
- **版面驗收閘**：`pnpm --filter web verify:markup` 逐節點比對，輸出「全部 44 頁與 mockup 一致」
- **CSS 不重寫**：`globals.css` 是 `mockup/assets/site.css` 的原檔複製
- **行為不重寫**：mockup 各頁 inline script 原樣移植成 `useEffect`
  （HeroSlider／FacilityExplorer／ProductShowcase／FaqFilter／ProjectFilter／PageForm）
- **雙語路由**：`/en`、`/zh`；`/` 與缺語系路徑由 middleware 導向 `/en`
- **canonical 與 hreflang**：en／zh-Hant／x-default 已就緒（`src/lib/i18n.ts`）
- **素材走 Blob**：`mediaUrl()` + `NEXT_PUBLIC_MEDIA_BASE`

### 🟡 有缺口

| 項目 | 現況 |
|---|---|
| 中文文案 | 已補齊（見下方「靜態文字雙語」），但**是機器翻譯初稿，待客戶校閱** |
| 首頁 hero 素材 | 英文標語**燒在圖裡**（`ref-home-banner*.png`），中文站需要客戶提供中文版素材 |
| 公司傳真與地圖嵌入碼 | 仍待客戶提供（地址與電話已於 2026-09-06 更新，見下方） |

### ✅ 靜態文字雙語（2026-09-06）

CMS 那 16 頁的內容早就有中英兩版（§十），但**其餘 28 頁與 header／footer／浮動鈕
是寫死在前端的固定文案**（docs/08 決議 3），`/zh` 一直顯示英文。現在補上了：

| 做法 | 說明 |
|---|---|
| 字典 | `apps/web/src/lib/zh.ts`，**以英文原文為 key**，962／1003 筆有中文；剩下 41 筆是刻意不翻的品牌名、機型名、認證縮寫、Email 與檔案大小 |
| 套用 | 每頁把整棵 JSX 包在 `<T locale={locale}>`，由 `src/lib/translate.tsx` 走訪 element tree 換文字節點與 `alt`／`title`／`placeholder`／`aria-label` |
| client component | header 與兩個 explorer 另吃 `zh-client.ts`（83 筆子集，腳本產生），避免整本字典進 client bundle |
| 盤點工具 | `node apps/web/scripts/extract-i18n.mjs`（`--stale`／`--client`） |

**`/en` 完全不經過替換**，所以 `verify:markup` 仍然「全部 44 頁與 mockup 一致」。
44 頁的 `/zh` 都已渲染中文，掃過去只剩 5 個節點是英文（皆為機型／標準名稱）。

順手修掉的兩個既有問題：

- `<head>` 的 `title`／`description` 沒有解 HTML 實體，`&amp;` 被 React 再跳脫一次，
  英文站的標題長期顯示成 `…Packaging &amp;amp; Printing…`。改在 `build-pages.mjs` 解掉。
- 語系鈕在 900–1150px 之間會把「中文」拆成兩行直排（`.lang-btn` 沒有 `white-space:nowrap`、
  `.htools` 會被壓縮）。mockup 的按鈕永遠是 `EN`，所以從沒踩到。

### ✅ 手機版語系切換（2026-09-06）

mockup 的 `@media(max-width:900px)` 把 `.menu` 與 `.htools .lang` 一起藏起來，
於是手機上沒有任何切換語系的入口（漢堡選單在 mockup 本來就沒有行為）。
改成只藏 `.menu`，`.htools` 的 gap 由 18px 收成 12px。

以 CDP 在**真正的 320px 視窗**量過（headless 的 `--window-size` 最小 500px，
量不到手機寬度 —— 先前「header 會橫向溢出」的判斷就是被這個限制誤導的，
實際上從來沒有溢出）：320px 下 `document.scrollWidth` 等於視窗寬，
語系鈕在 175..233、漢堡在 276..300，下拉展開後選單落在 97..233 完全在畫面內，
兩個連結分別指向 `/en/contact` 與 `/zh/contact`。375px 與 900px 邊界同樣正常。

### ✅ 公司地址與電話更正（2026-09-06）

contact 頁原本掛的是**台中的暫代地址**與 04 開頭的電話（`db/seed/130_site_setting.sql`
與後台的提示都標著「待換台南實際廠址」）。客戶提供了正式資料，已更新：

| | 舊 | 新 |
|---|---|---|
| 地址（zh） | 台中市北屯區東山路一段 192 巷 56 弄 18 號 | 709 臺南市安南區媽祖宮里工業六路29號 |
| 地址（en） | No. 18, Aly. 56, Ln. 192, Sec. 1, Dongshan Rd., Beitun Dist., Taichung 406 | No. 29, Gongye 6th Rd., Annan Dist., Tainan City 709, Taiwan |
| 標題 | Taichung Plant & Office／台中廠與辦公室 | Tainan Plant & Office／台南廠與辦公室 |
| 電話 | +886 4 2436 6659 | +886 6 261 1358（`tel:+88662611358`） |

同步更新的位置：`mockup/contact.html`（英文權威來源）→ `build-pages.mjs` 重產
contact 頁、`zh.ts` 的三筆 key、Google Maps embed 的查詢字串與 iframe title、
後台 mock 的 `company.address`／`company.phone`，以及 `db/seed/130_site_setting.sql`
與後台提示裡「待換台南廠址」的註記。

⚠ 兩個需要確認的地方：英文地址的**郵遞區號 709** 與**省略「媽祖宮里」**都是依
慣例補的（沿用原本「Taichung 406」帶郵遞區號的格式），客戶只給了中文地址。

`SiteSetting` 的 `company.address`／`company.phone` 在資料庫裡仍是 NULL —— 依設計
那是客戶在後台填的欄位，且目前沒有任何頁面讀它（固定頁的內容寫死在前端，
docs/08 決議 3）。要的話可以另外灌進去。

### ✅ 語系解析（2026-09-06）

`src/middleware.ts` 從「一律導向 `/en`」改成：使用者選過的（`NEXT_LOCALE` cookie，
一年）→ `Accept-Language` → `en`。造訪任何 `/zh/...` 就會把語系記下來，之後回到 `/`
不會被打回英文。順序與後端 `Common/LangResolver.cs` 一致，只有預設值不同
（前台 `en`，API `zh`）。

### ✅ 已接上 API（2026-09-04）

由 `NEXT_PUBLIC_API_BASE` 決定，**兩種模式的版面完全相同**：沒設就渲染各頁寫死的
mockup 內容（現況部署），設了就改吃 CMS。

| 接上的部分 | 來源 |
|---|---|
| **全部 44 頁的 `<head>`** | 固定頁 SEO（對照表 `src/lib/pages.ts`）。含 noindex 開關與 OG 欄位 |
| 首頁 | Banner、Proof 認證牆、客戶 logo |
| `/news` + **新增的 `/news/{slug}`** | 消息列表與詳細頁 |
| `/projects`、`/faq`、`/green-vlog`、`/industry-trends`、`/careers` | 各內容單元 |
| `/about-certifications`、`/supplier-area` | 認證牆／公告、規範、下載 |
| `/facility-*`（4）、`/products-*`（3） | 設備卡、方案品項卡 |

其餘頁面只接 SEO——它們的內容是固定文案（docs/08 決議 3）。

**`verify:markup` 仍然 44 頁全過**：沒設 API 時輸出與 mockup 逐字相同。
接了 API 之後逐頁實測，各頁確實改吃 CMS（含「缺語系不 fallback」：
只有英文的消息在 `/zh` 不出現、詳細頁 404）。

⚠ 接了 CMS 的 16 頁不再由 `build-pages.mjs` 產生（會洗掉接線），
清單在該腳本的 `HAND_MAINTAINED`。

### ✅ SEO 基礎建設（2026-09-07）

| 項目 | 做法 |
|---|---|
| `sitemap.xml` | `src/app/sitemap.ts`：44 條靜態路由 × 2 語系＝88 條，接了 CMS 再加消息詳細頁（實測 112 條）。逐條帶 `xhtml:link` hreflang，消息用 Id 把中英兩篇配對（slug 可翻譯、中英不同） |
| 路由清單 | `src/lib/routes.ts` 由 `build-pages.mjs` 從 mockup 產生，不是手寫 |
| `robots.txt` | 開放收錄時補上 sitemap 位址（預設仍是 `Disallow: /`，見 §七） |
| 結構化資料 | `Organization`＋`WebSite`（全站）、`BreadcrumbList`（25 頁，來自 mockup 的 `.crumb`）、`NewsArticle`（CMS 消息詳細頁）。不發 `FAQPage`／`Product`／`VideoObject`，理由記在 [docs/05 §2.3](docs/05-seo.md) |
| 舊站 301 | `src/lib/legacy-redirects.ts` + middleware，**229 條全部有去處**：59 條專屬落點（45 個固定頁、2 個分類，加上 mockup 那 12 篇示範消息——它們正是舊站同一批文章），其餘 170 條依客戶決定導回首頁（產生檔 `legacy-archive.ts`） |
| 覆蓋率檢查 | `node tools/check-legacy-redirects.mjs [--write]`：抓舊站 sitemap 比對，並重產 [`reference/舊站301對照表.md`](reference/舊站301對照表.md) |

### ✅ 依客戶 SEO 清單補上的四項（2026-09-09）

對照客戶 2026-09-08 的《網站建置 SEO 注意事項》逐條稽核後補的。

| 項目 | 做法 | 驗證 |
|---|---|---|
| **meta description** | 原本 44 頁只有 4 頁有。描述寫進 **mockup 的 `<meta name="description">`**（英文的權威來源），由 `build-pages.mjs` 帶到 28 頁，`HAND_MAINTAINED` 的 13 頁手動補；中文照舊走 `zh.ts`。全部 ≤155 字元（客戶簡報的上限），首頁那條原本 216 字元也一併修短 | 88 個網址（44×2）全部有、無重複、無過長 |
| **圖片 WebP** | 被引用且 >150KB 的 36 張轉 WebP（q82），原檔保留在 `mockup/assets-original/`（不在 `sync-assets` 的範圍內）。`ref-home-banner1` 另外從 10667×4000 縮到 2560 寬 | 47MB→4.8MB；最大單張 448K（原 3.2MB），符合簡報的 300–500K；首頁圖片總重 2.0MB |
| **客製化 404** | `app/[locale]/page-not-found/page.tsx`＋`middleware.ts` 的路由比對。**真的回 404 狀態碼**，不是 soft 404 | `/en/xxx`、`/zh/a/b/c`、`/{locale}/page-not-found` 皆 404，且有完整 header／footer／浮動鈕與正確 `<html lang>` |
| **OG 預設圖與 Twitter Cards** | `lib/i18n.ts` 補 `DEFAULT_OG_IMAGE`（`assets/og-default.jpg`，1200×630）與 `twitter: summary_large_image`；消息詳細頁同步 | 88 個網址全部有 `og:image` 與 `twitter:card` |

**404 的實作為什麼繞這麼遠**（註解裡都寫了，這裡只留結論）：
本專案的 root layout 是 `app/[locale]/layout.tsx`（`<html lang>` 要吃語系）。這種結構下
Next 的 `not-found.tsx` **兩種放法都不會有站台版型**——放 `[locale]/` 底下不會被編成
not-found 邊界，放 root 又在 `[locale]` 的 layout 樹之外，實測都只得到內建的
`__next_error__` 空殼。所以改成 middleware 比對 `ROUTES`，對不到就
`NextResponse.rewrite('/{locale}/page-not-found', { status: 404 })`：網址列維持使用者
打的那一個，狀態碼是真的 404，畫面吃得到 `[locale]` 的版型與 `<html lang>`。

> ⚠ **這裡走過一段冤枉路，記下來免得重蹈**：一開始判定「`rewrite` 帶 `status` 會被
> Next 攔掉」，因而改用 middleware 自我 `fetch` 取回 404 頁的 HTML。那個判定是**錯的**
> —— 它是用 `pnpm --filter web start`（`next start`）測出來的，而 `next start` 對
> `output: standalone` 會服務**過期的輸出**（它自己會印警告）。自我 fetch 的版本在本機
> 會過，但部署到 SWA 之後**每個 404 都變成 500**。
> **驗證這條路徑一定要用 `pnpm --filter web start:standalone`。**

### 🔴 三個單元接真 API 後才發現的編輯缺陷（2026-09-09 修）

後台先前只在 mock 模式下被點過，接上真 API 後這三個單元的「點進去編輯」全都是 404。

| 單元 | 問題 | 修法 |
|---|---|---|
| **15 頁面設定與 SEO** | 後端用 `PageKey` 當識別（`/admin/page/{pageKey}`，公開端點 `/pages/{key}` 也一樣），後台卻送整數 `Id` → **每一頁點進去都 404**。另外清單的 `i18n` 是**陣列** `[{lang,…}]` 不是以語系為鍵的物件（中/英欄與完整度檢查全錯），單筆端點回的是 `{item, i18n}` 信封不是平的一列（欄位全空） | 三處都修在 `client.api.ts`：`page` 以 `pageKey` 當 UI 的 id、i18n 陣列轉成以 lang 為鍵、單筆比照 quote 攤平 |
| **16 301 轉址** | **沒有取單筆的路由**（只有清單／新增／修改／刪除／匯入匯出），點任何一筆都 404 | 補 `AdminRedirectHandler.GetByIdAsync` 與路由；排在 `export` 之後，`export` 不會被當成 id |
| **25 消息標籤** | 同上，我新加時漏了取單筆 | 補 `AdminTagHandler.GetByIdAsync`（一併回 `usageCount` 與雙語名稱） |

實測方式：本機起 API（`func start --port 7072`，連 Docker SQL Server）＋真 token，
逐一驗證 29 個固定頁全部取得成功、三個單元的 GET／PUT 都 200。

⚠ **App Insights 完全沒有遙測**（requests／traces／exceptions 都是 0），所以線上出問題
時查不到任何線索——這次是靠本機重現才定位的。isolated worker 需要
`ConfigureFunctionsApplicationInsights()`＋`AddApplicationInsightsTelemetryWorkerService()`，
連線字串雖然設了但沒生效。**上線前應該補**，否則等於沒有可觀測性。

### ✅ 標籤體系與 301 轉址單元（2026-09-09）

| 項目 | 做法 |
|---|---|
| **單元 16 301 轉址** | 由隱藏改為啟用。後端 CRUD 與 CSV 匯入匯出本來就寫好了（`AdminRedirectHandler`），缺的是後台入口——補上「⬆ 匯入 CSV」按鈕（`ListPage`）。匯入以 `fromPath` 為鍵覆寫，**重跑同一份檔案不會產生重複**，客戶可以改完試算表再整份丟一次 |
| **單元 25 消息標籤** | 全新一條：`Tag`／`TagI18n`／`NewsTag` 三張表（EF Migration `AddNewsTags`，`db/migrations/0007` 為參考實作）、公開端點 `GET /tags`｜`/tags/{slug}`｜`/news?tag=`、後台 CRUD 與拖曳排序、消息單元的標籤多選欄位 |
| **前台封存頁** | `/{語系}/news/tag/{slug}`，含麵包屑結構化資料、hreflang、OG／Twitter；消息詳細頁底部有標籤列（客戶簡報的「站內連結」來源之一） |
| **舊站 100 個 `/tag/*`** | **99 條改為 1:1 轉址**（原本全部導回首頁＝soft 404）。舊標籤同義詞氾濫，收斂成 17 個有內容支撐的主題；沒有對應主題的長尾詞轉到內容最相近的頁面。唯一沒落點的是 `/tag/美國`（舊站拿它標兩類不相干的文章），維持導首頁 |
| 權限 | 167 → **173 列**（SuperAdmin 82／Editor 69／Viewer 22）。`tag.delete` 只給超管——刪標籤會改動前台網址 |

**兩個刻意的設計決定**（三處註解都寫了）：

- **Tag.Slug 不分語系**，與消息不同（消息的 slug 在 `NewsI18n`）。客戶簡報明訂網址
  「避免使用中文」，中文標籤名沒辦法當網址；而且中英共用同一個 slug 之後，
  封存頁的 hreflang 是恆等式，不必像消息那樣用 Id 兩邊配對。
- **沒有已上架消息的標籤前台一律 404**，不做「目前沒有文章」的空頁面。
  一個標籤體系最容易搞砸的方式就是產出一百個沒有內容的封存頁——那是 thin content。
  後台看得到全部標籤（編輯要先建才能掛），前台只看得到有東西可看的那些。

⚠ **仍未做**（需要客戶提供或屬另一批工作）：GA4／Search Console（要客戶帳號）、
HTML 網站地圖頁、19 頁沒有麵包屑（設計稿本來就沒有）。
另外 `/news/{slug}` 打到不存在的 slug 時，狀態碼正確但畫面是 Next 空殼——
middleware 在 Edge runtime 查不到 CMS 的 slug，只能整個前綴放行。
舊站那 80 篇文章與其標籤仍待內容遷移；文章進 CMS 後，標籤的封存頁才會真正有量。

兩個實作上的限制，都寫成程式碼註解了：

- **JSON-LD 不能放在 `</header>` 到 `<footer>` 之間**——版面驗收閘比對那個區間的節點序列。
  全站的放在 layout 的 body 末端；`BreadcrumbList` 因為只跟路由有關，做成 client component
  掛在 layout（跟 `SiteHeader` 判 active 同一個做法），44 個 page.tsx 一個都不用改。
- **舊網址帶結尾斜線會走兩跳**（Next 先 308 去斜線、middleware 再 301）。Google 可接受。

`verify:markup` 仍然「全部 44 頁與 mockup 一致」。

### ✅ 兩支表單已接上後端（2026-09-08）

`PageForm` 原本只是把表單藏起來、顯示成功卡，沒有送出任何資料。現在：

- **欄位有名字了**：mockup 的 input 原本連 `name` 都沒有（只靠 label 文字辨識），
  已在 `mockup/contact.html`／`get-a-quote.html` 補上，再由 `build-pages.mjs` 同步。
- **報價表單真的能附檔**：設計稿的 `.fupload` 一直寫著「dieline、artwork… 最多 5 個」，
  底下卻沒有 `<input type="file">`。已補上（客戶 2026-09-08 確認），
  否則後台的附件下載永遠沒有東西可下載。
- **三個下拉送代號不送 Id**：`boxes`／`food-beverage`／`fsc` 這種 `db/seed` 的穩定代號，
  由 API 換算成 Id。公開表單不該知道資料庫的 Id。
- **reCAPTCHA v3**：`grecaptcha.execute` 取 token 後一併送出，action 為 `quote`／`contact`。
- 送出失敗的訊息依 API 錯誤碼中英對照顯示；節點是失敗時才在 client 端插入的，
  **`verify:markup` 仍然 44 頁全過**。

**真瀏覽器實測 5 項全過**（headless Chrome + 本機 API + DB）：兩支表單都確實
`POST` 出去並顯示成功卡；報價單的代號正確換成 Id（`boxes`→1、`food-beverage`→31、
`fsc`→41）、`SourceLang` 為 `zh`、附件 `browser-dieline.pdf` 存進 Blob 與資料表。

### ⬜ 未做

- 舊站那 170 條目前是導回首頁，**不是一對一 301**——擋在內容遷移。Google 會判成
  soft 404、權重傳不過去（客戶知情的取捨，2026-09-07）。內容搬進 CMS 後把落點補進
  `legacy-redirects.ts` 的 `POSTS` 即可，優先處理 47 篇 Dr.Print 電子報
- `/solutions` 的 explorer 互動元件仍是寫死的四個方案（它不是卡片列表，
  是有 `data-set` 切換行為的自訂元件；四筆方案的代號固定，之後要接再說）

---

## 三、後台介面（24 單元）

`apps/admin`，React + Vite 純 SPA，掛在 `/admin/`。

### ✅ 已完成

- **23 個單元 + 儀表板**，依 [`docs/09`](docs/09-cms-admin.md) 實作（19 會員／20 訂單已移出範圍）
- **驗收閘**：`pnpm --filter admin check:units` →
  「每個上傳欄位都有 §3 提示、每個圖片欄位都有中英 Alt、權限矩陣 173 列」
- **權限矩陣**與 [`db/seed/110_role_permission.sql`](db/README.md) 一對一（173 列），數字對不上時 dev 模式 console 直接報錯
- **角色切換登入**（SuperAdmin／Editor／Viewer）用來驗權限矩陣

### ✅ 已接上 API（2026-09-04）

資料存取層改成兩套實作、同一組簽章，由 `VITE_API_BASE` 決定用哪一套：

| | 沒設（現況部署） | 設了 |
|---|---|---|
| 實作 | `client.mock.ts`（localStorage） | `client.api.ts`（打 `/api/v1/admin/*`） |
| 登入 | 選角色即進入 | 帳號 + 密碼（帳號不限定 email 格式），首登強制改密碼 |
| 權限 | 查本地 173 列矩陣 | 由 JWT 的 `permissions` claim 決定 |
| 圖片 | 本機素材 | 上傳 Blob，經 `/files/media/*` 代理取回 |

保留 mock 是因為後台已部署在 SWA 的 `/admin/` 供客戶操作，而 API 資源還沒開——
硬切會讓那個站當場壞掉。CI 已接上 `vars.API_BASE`，資源開好設定它即可切換。

**整合測試 21 項對真後端全數通過**：欄位改名雙向、內文只在單筆端點、
存檔、新增、缺語系上架被擋（409）、型別不符的分類被擋（409）、軟刪、
分類引用數、設定的單語／多語判斷。

⚠ 那 21 項**沒有涵蓋報價詳細頁**——2026-09-08 才發現 `GET /admin/quote/{id}` 回的是
`{ quote, attachments }` 巢狀物件，而 `client.api.ts` 當成平的一列在讀，正式站的報價詳細頁
其實組不出資料（`row.id` 為 `"undefined"`、欄位全空、附件陣列丟給 React 會直接炸）。已修。

### ✅ 缺口已清（2026-09-08）

| 原缺口 | 處置 |
|---|---|
| 3 個欄位存不進去 | **分別處理**：`contact.assignee` 補上 `ContactMessage.AssigneeId`（schema 真的漏了，`QuoteRequest` 早就有）；`vlog.thumbAlt` 與 `ogImageAlt` **從 UI 移除**——前者的縮圖在前台是 `alt=""` 的裝飾性圖片、緊鄰影片標題，補 Alt 會讓螢幕閱讀器把標題唸兩遍，後者是 meta 標籤、頁面上沒有那張圖。docs/09 §3「每個圖片欄位必附 Alt」的通則同步收斂，三個例外在欄位宣告處以 `altExempt` 寫明理由 |
| 清單搜尋 | **後端補上 `keyword` 參數**（04 §3.4），比對主表與 i18n 側表所有有長度上限的字串欄，`nvarchar(max)` 內文不進來。在 SQL 層過濾，跨頁也準；`%`／`_` 視為字面值。內容單元走 i18n 子查詢（`WHERE Id IN (SELECT …)`），不把側表拉回記憶體 |
| 匯出 CSV 沒有入口 | 報價清單補上「⬇ 匯出 CSV」鍵（`quote.export`，僅超管）。**順帶修好 BOM**：原本寫 `new UTF8Encoding(true).GetBytes(...)`，但那個旗標只影響 `GetPreamble()`，`GetBytes()` 從來不含 BOM——等於註解說要 BOM、實際一個都沒寫，Excel 開中文會亂碼。報價與轉址兩支匯出都修了 |

**實測 11 項全過**（本機 API + DB）：承辦人存得進去、i18n 側表搜得到、pageSize=1 時
總數與 pageSize=50 一致（證明在 SQL 層過濾）、扁平表／未分頁清單都搜得到、
查無資料回 0、搜 `%` 不會全部命中、CSV 帶 BOM。

### 🟡 有缺口

| 項目 | 現況 |
|---|---|
| 可拖曳單元的搜尋 | 走 `listAll`（`pageSize=100`）取整份再在前端過濾，資料完整所以結果是準的；但單元超過 100 筆時 `listAll` 會靜默截斷，拖曳排序也會一起失準 |

---

## 四、資料模型（45 張表）

### ✅ 已完成

- [`docs/08-database.md`](docs/08-database.md)：45 張表的 DDL、多語策略、索引、種子、遷移策略
- [`db/`](db/README.md) 參考實作：`migrations/`（0001–0004）、`seed/`（100–150 共 6 支）、`verify/`、`tools/run-local.sh`
- 本機一鍵建置：`cp db/.env.local.example db/.env.local && db/tools/run-local.sh`

- **EF Core Migration（schema 權威來源）已建立**（2026-09-04）：
  44 個 Entity + Configuration、`Api/Data/Migrations/` 五支 migration
  （`InitialSchema` 建立 schema 與種子；2026-09-06 的 `RemoveMemberAndOrder`／`AdminUsernameLogin`／
  `DropAuditLog`；2026-09-08 的 `DropAttachmentScanStatus` 移除附件掃描欄位）。
  `db/` 自此為參考實作與交付腳本。
  - 種子由 `Api/Data/Seed/SeedData.cs` 的 `HasData` 寫入，Id 硬編、跨環境一致：
    角色 3／權限 167／分類 44(+88)／設定 15／固定頁 29(+58)／方案 4(+8)
  - 驗收閘 [`db/verify/verify-ef.sql`](db/README.md)：結構 11 項 + 種子 16 項，本機**全數 PASS**
  - 與 `db/migrations/` 建出來的庫逐欄逐約束比對，差異只有 `SchemaVersion` ↔
    `__EFMigrationsHistory` 與四個 DEFAULT 約束的名稱縮寫（以 EF 為準）
  - ⚠ **那個「名稱縮寫」差異不是無害的**：2026-09-06 移除會員與訂單時，
    `DROP CONSTRAINT DF_SupplierDownload_RequireLogin` 在正式庫找不到該名稱
    （SQL 3728），migration 整支回滾、worker 起不來。教訓寫在
    [`docs/10 §11.1`](docs/10-backend-design.md)：migration 不得依賴 DEFAULT 約束的名稱

### ⬜ 未做

- 本機 `NTI` 庫若仍是 `db/` 腳本建的版本，要切成 EF 版需先砍庫重建
  （`db/local/900_drop_database.sql` → `dotnet ef database update`）
- `db/migrations/0002` 仍帶著 `QuoteAttachment.ScanStatus` 與 `CK_QuoteAtt_Scan`——
  EF 已於 2026-09-08 移除。一次性腳本不回頭改，這是 `db/` 參考路徑與權威 schema 的已知漂移

> Azure SQL（`nti-sql-prod`／資料庫 `NTI`，Basic）**已於 2026-09-04 開設**並跑過
> migration 與 111 筆內容匯入，見 §六。

---

## 五、API（骨架完成，業務端點未開工）

`Api/`（namespace `Nti.Api`）已建立，施工標準見 [`docs/10-backend-design.md`](docs/10-backend-design.md)，
契約見 [`docs/04-api.md`](docs/04-api.md)。專案說明：[`Api/README.md`](Api/README.md)。

### ✅ 骨架（2026-09-04）

- **執行模型**：Functions v4 isolated + ASP.NET Core Integration（`ConfigureFunctionsWebApplication`），
  `routePrefix = api/v1`，單一 `RouterFunction` catch-all
- **統一信封** `ApiResponse<T>`（含 `code`）＋ **錯誤碼 18 個**（`ErrorCodes`）＋ `PagedResult<T>`
  ＋ `Paging`（`pageSize` 強制 `Clamp(1,100)`）
- **`ExceptionMiddleware`**：`AppException` → 對應 status + code；`ReadFormAsync` 的 Content-Type
  例外單獨接住；其餘一律 500 `INTERNAL`，堆疊不外洩
- **JWT 單一 audience**（`nti-admin`）——前台全站匿名，沒有會員系統
- **集中式 `AppRouter`**（三個 partial）＋ **授權預設拒絕**：未登記於權限表的 `/admin/*` 直接 403
- **`Common/` 常數**：權限碼 79 個（＝ `db/seed/110` 的 SuperAdmin 授權範圍）、CategoryType 9、
  PageKey 29、角色 3、報價／聯絡狀態、`Clock`（Asia/Taipei）、`LangResolver`
- **`AppDbContext`**：稽核五欄統一填寫、`Remove()` 自動改寫為軟刪
- **`GET /health`** 本機實測通過（`func start` + `dotnet build` 0 warning／0 error）

### ✅ 資料層（2026-09-04）

44 張表的 Entity、Configuration 與 Migration，詳見 §四。三個踩到的坑已寫成程式碼註解：

| 坑 | 後果 | 處置 |
|---|---|---|
| `Clock.Now`（台北）vs DDL 的 `SYSUTCDATETIME()`（UTC） | 同一欄兩種時區，上下架時間窗差 8 小時 | 持久化一律 `Clock.UtcNow`；docs/10 §9.1 已更正 |
| 預設值為 `true` 的 bool 欄位存不進 `false` | 「暫不上架」被靜默上架、預留的 `green-csr` 從 noindex 變成可索引 | 掃全模型設 `ValueGenerated.Never` |
| EF 自動幫每條外鍵建索引 | Basic 5 DTU 多出一堆沒用的索引 | 移除 `ForeignKeyIndexConvention`，只留明列的 17 條 |

本機實測（port 7072）：

| 情境 | 結果 |
|---|---|
| `GET /api/v1/health` | 200，信封正確、camelCase、時間為台北時區 |
| 無憑證打 `/admin/*` | 401 `AUTH_TOKEN_INVALID` |
| 後台 token 打未登記的 `/admin/news` | 403 `FORBIDDEN`（預設拒絕生效） |
| 不存在的路由 | 404 `NOT_FOUND` |

### ✅ 3.1 前台內容端點（2026-09-04）

20 支端點全部實作並實機打過（`func start` + curl），皆回 200 且信封正確：

`/content/home`（首頁五組資料一次給）、`/solutions`、`/solutions/{slug}`、`/projects`、
`/facility?group=`、`/certifications`、`/clients`、`/categories?type=`、`/news`、`/news/{slug}`、
`/green-vlog`、`/faq`、`/industry-trends`、`/careers`、`/supplier/notices`、`/supplier/specs`、
`/supplier/downloads`、`POST /supplier/downloads/{id}/hit`、`/pages/{pageKey}`、`/site-settings`

實測驗到的行為：

| 驗證項 | 結果 |
|---|---|
| 缺語系不 fallback | 只有英文的消息不出現在 `/zh` 清單，詳細頁 404 |
| 上下架時間窗 | `PublishAt` 在未來的消息不出現，直接打 slug 也 404 |
| 語系解析 | `?lang=` 優先，其次 `Accept-Language`（`zh-Hant-TW` 可解），皆無則 `zh` |
| hreflang | 由同一 Id 的兩筆 i18n 推導，回傳 `{en, zh}` slug 對照 |
| 分頁雙模式 | 帶 `page`／`pageSize` 回 `PagedResult`，不帶回平面陣列 |
| 值域驗證 | `?type=Bogus` 回 400 `VALIDATION_FORMAT`（不是靜默的空陣列） |
| 快取標頭 | 內容 `s-maxage=300`、設定與分類 `3600`、寫入端點 `no-store` |
| 內部設定不外洩 | `/site-settings` 濾掉 `Mail` 群組（15 → 12 筆） |

本機假內容 fixture：`db/local/920_dev_content.sql`（各單元一筆 + 兩個邊界案例）。

### ✅ 3.2 表單／3.3 後台認證／3.4 後台（2026-09-04）

| 群組 | 端點數 | 狀態 |
|---|---|---|
| 3.1 前台內容（公開唯讀） | 20 | ✅ |
| 3.2 表單（公開寫入） | 2 | ✅ 含 reCAPTCHA v3、rate limit、附件上傳與 magic bytes 驗證 |
| 3.4 後台管理（RBAC） | 22 單元 + 動作端點 | ✅ 含上傳、匯出入、稽核 |
| 3.3 後台認證（契約原本沒有） | 2 | ✅ `/auth/admin/login`、`/auth/admin/change-password` |

支援服務：`PasswordHasher`（BCrypt）、`BlobStorageService`、`EmailService`（+EmailLog）、
`RecaptchaService`、`RateLimitService`、`AuditService`、`QuoteNumberGenerator`、
`SuperAdminBootstrapper`（第一位超管由部署流程建立）。

實測結果（`func start` + Azurite，51 項自動化斷言 + 逐項手驗）：

| 驗證項 | 結果 |
|---|---|
| 權限矩陣 | SuperAdmin 79／Editor 67／Viewer 21 逐項驗過：Viewer 可讀不可寫、Editor 沒有 `quote.export`／`admin.*`／`audit.*` |
| 預設拒絕 | 未登記的 `/admin/*` 回 403（不是靜默放行） |
| 上架前兩語系檢查 | 只有中文就上架回 409 `CONFLICT_STATE`，補上英文後成功 |
| 帳號列舉防護 | 帳號不存在與密碼錯誤回同一個 `AUTH_INVALID_CREDENTIALS`；忘記密碼一律回成功 |
| 首登強制改密碼 | 改完 `mustChangePassword=false`，舊密碼失效 |
| magic bytes | 副檔名改成 `.png` 的文字檔被擋（400 `UPLOAD_TYPE`） |
| 附件授權 | `ScanStatus=Pending` 拒絕下載（403），改 `Clean` 後下載且內容位元一致 |
| rate limit | 公開表單第 10 次起回 429 `RATE_LIMITED` |
| 寄信失敗不影響提交 | SMTP 未設定 → EmailLog 記 `Failed`，但表單仍回 200 |

### ✅ Timer Function（2026-09-04）

兩支都實測跑過（把 cron 調成每 10 秒觀察行為），皆遵守「`IsPastDue` 時不 return」與冪等閘：
（`RetentionCleanupFunction` 已隨操作紀錄一起移除，2026-09-06。）

| Function | 工作 | 實測 |
|---|---|---|
| `PublishScheduleFunction` | `UnpublishAt` 到期的內容改為下架 | 過期那筆被下架，第二輪不重複動作 |
| `OrphanMediaFunction` | 孤兒檔清除 | 掃描含富文本 `<img src>`；7 天內的新檔不視為孤兒 |

> ⚠ `OrphanMedia` **預設只報告不刪除**，要真的刪必須設 `OrphanMediaDeleteEnabled=true`。
> 判斷「哪些算孤兒」依賴那份欄位清單是否完整——新增 `*Path` 欄位卻忘了補進去，
> 就會把正在用的圖當成孤兒。建議先看幾輪報告再打開。
>
> `EmailLog` 的保留期仍未定義（`db/README` 缺口 #3），刻意不動它。

### ✅ OpenAPI 與 CI（2026-09-04）

- [`Api/openapi.yaml`](Api/README.md)：52 個路徑、65 個 operation，手寫
  （catch-all 路由讓自動產生器無從內省，docs/10 §13 的待決項已定案）
- [`tools/check-openapi.mjs`](tools/check-openapi.mjs)：漂移檢查。靜態比對路徑 segment
  是否存在於 `AppRouter`，`--live` 另外實打全部 47 個 GET 端點。**目前全數通過**
- [`.github/workflows/api.yml`](.github/workflows/api.yml)：觸發於 `Api/**`，OIDC 登入
  （Flex Consumption 不支援 publish profile），含 health 冒煙測試與
  「產物不得含 `local.settings.json`」的斷言

### ⬜ 其他未做

- **中文文案待客戶校閱**：CMS 內容已用 mockup 的實際內容填入（見 §十）
- **refresh token rotation**（docs/10 §7.3）：schema 無對應資料表，端點清單也未列
  `/auth/refresh`。目前只發 access token（後台 60 分鐘）
- ~~附件病毒掃描~~ → **本期不做**（2026-09-08 決策）：接掃描服務是每月固定成本
  （Defender for Storage ≈ US$10／storage account），與案子規模不成比例。
  閘已拆除、`ScanStatus` 欄位由 migration `DropAttachmentScanStatus` 移除，
  下載改為「限超管 + 一律 octet-stream/nosniff + 後台明示未掃描」

---

## 六、部署與維運 ✅

### 正式環境

| 資源 | 值 | 起用 |
|---|---|---|
| Static Web App | `stapp-nti-prod`（RG `NTIUS`／westus2／**Free**）<br>`gray-river-0a6ae341e.5.azurestaticapps.net` | 09-02 |
| Blob Storage | `stntiprod`／容器 `assets`（公開讀取）＋ `media`、`quote-attachments`（private） | 09-02 |
| **Function App** | `func-nti-prod`（**Flex Consumption FC1**）<br>`https://func-nti-prod.azurewebsites.net/api/v1` | **09-04** |
| **Azure SQL** | `nti-sql-prod`／資料庫 `NTI`（**Basic**，定序 `Latin1_General_100_CI_AS_SC`） | **09-04** |
| **App Insights** | `ai-nti-prod` | **09-04** |
| CI | `web.yml`（前端）＋ `api.yml`（後端，OIDC 登入），push `main` 觸發 | 09-04 |
| 月費 | 約 **US$5–8**（SQL Basic 約 $5，Flex Consumption 依用量） | |

**內容已上線**：111 筆 mockup 內容（中英雙語）已匯入 Azure SQL，
`vars.API_BASE` 已設，公開站與後台都改吃 CMS。

公開站與後台**在同一份產物裡**（`/` 與 `/admin/`），只需一個 SWA。

### 日常流程

```bash
git push Remote_NAS       # 完整版（含 reference/），不會部署
tools/sync-public.sh      # 產生去掉 reference/ 的 public 分支
git push Remote_GitHub    # ← 這一步才觸發部署
```

### 已驗證

- 前台 44 頁、後台全路由（含與前台撞名的 `/admin/news`）線上皆 200
- `_next/static` 的 CSS 與 chunk 線上 200（standalone 最典型的失敗是「部署成功但全站沒樣式」）
- 圖片指向 Blob 且載得到，頁面上**零**殘留的本機 `/assets/` 引用
- 移走 `public/assets` 後帶 base 建置仍成功——CI 不再依賴未進版控的 `mockup/`

### 踩過的坑（都已寫成程式碼註解，彙整於 [`docs/07`](docs/07-deployment.md) §7.1）

1. `[locale]` 動態段會吃掉 `/admin/*`，SPA fallback 只能寫在 middleware
2. SWA 對 Next.js hybrid 站**忽略** `staticwebapp.config.json` 的路由設定
3. middleware matcher 必須排除 `.swa`，否則 SWA 判定部署失敗且訊息不指向此處
4. `outputFileTracingRoot` 不可釘在 app 上，否則產物只剩斷掉的符號連結
5. CI 必須 `NPM_CONFIG_NODE_LINKER=hoisted`，SWA 打包器不跟隨符號連結

### ⬜ 未做

- 正式網域 `www.nti-printing.com` 綁定（custom domain + DNS，卡客戶端）
- **SMTP 未設定**：`Smtp__Host`／`Port` 已填 Brevo，還缺 `Smtp__User`／`Password`／`From`。
  表單照常收得到資料，只是通知信寄不出去（EmailLog 記 `Failed`，可在後台重寄）
- 🔴 **後台登入被 reCAPTCHA 擋住（2026-09-09 修）**：後端的 `/auth/admin/login` 在
  2026-09-08 隨 v3 一起加了機器人檢查，但**後台 SPA 從來沒送過 token**——
  `apps/admin/` 裡當時一行 reCAPTCHA 程式碼都沒有。Function App 一設
  `Recaptcha__SecretKey`，登入就必然回 `BOT_CHECK_FAILED`，畫面顯示
  「機器人驗證未通過，請重新整理後再試」，**沒有人登得進後台**。
  已補 `apps/admin/src/lib/recaptcha.ts`（與公開站的 `PageForm.tsx` 同一套做法）、
  登入時帶 token，並在 CI 的 admin build 補上 `VITE_RECAPTCHA_SITE_KEY`
  （少了它前端一樣拿不到 token）。**要重新部署一次才會生效。**
  - ⚠ **這個檢查讓後台登入相依於 Google 可連線**：`RecaptchaService` 是 fail closed，
    script 被廣告阻擋器或公司防火牆擋掉時，客戶會被鎖在自己的 CMS 外面而沒有救援途徑。
    帳號鎖定已於同日移除（見下一條），所以 reCAPTCHA 現在是登入端點**唯一**的
    暴力破解防護，不宜再拿掉。真的被 script 擋住時的救援途徑：暫時把 Function App 的
    `Recaptcha__SecretKey` 清成 `REPLACE_WITH_RECAPTCHA_SECRET`，驗證會整個略過。

- 🔴 **踩到的坑：正式庫的預設值約束是自動命名的**（2026-09-09）。
  `DropAdminLockout` 第一版讓 EF 產出
  `ALTER TABLE [AdminUser] DROP CONSTRAINT [DF_AdminUser_FailedLoginCount]`，
  但**正式庫裡那個約束叫 `DF__AdminUser__Faile__70DDC3D8`**——早期建庫沒有把
  `DefaultConstraintName` 帶進去。實測 107 個預設值約束裡 **103 個是自動命名的**，
  只有 4 個（新加的 Tag 那批）符合 `DF_<表>_<欄>` 慣例。
  - 後果比想像嚴重：`Program.cs` 在啟動時跑 `MigrateAsync()`，**migration 一失敗
    整個 Function App 就起不來**。health 連續回 404／502，而且
    **App Insights 一筆紀錄都沒有**——程序還沒走到能送遙測的地方就死了，
    Flex Consumption 又不留容器日誌。查不到錯誤時要直接連 DB 看
    `__EFMigrationsHistory` 停在哪一支。
  - 修法：拿掉 `DropColumn` 上的 `.Annotation("Relational:DefaultConstraintName", …)`，
    EF 就會改用「先查 `sys.default_constraints` 拿實際名稱再卸」的寫法。
  - ⚠ **這是全域性的**：往後任何 `DropColumn`／改欄位型別只要碰到有預設值的欄位，
    都會踩同一個雷。產生 migration 之後**務必先跑
    `dotnet ef migrations script <前一支> <這一支>` 看實際 SQL**，
    出現寫死的 `DROP CONSTRAINT [DF_…]` 就要照上面處理。

- ✅ **移除後台登入的帳號鎖定**（2026-09-09，客戶決定）：原本「連續 5 次失敗鎖 15 分鐘」
  已拿掉，`AdminUser.FailedLoginCount`／`LockoutEndAt` 兩個死欄位一併移除
  （EF Migration `DropAdminLockout`、`db/migrations/0008`）。
  理由是那種鎖定會變成對帳號本身的阻斷服務——只要持續用錯誤密碼打某個帳號，
  就能讓真正的管理員登不進來，而攻擊者不必知道任何密碼。
  暴力破解改由登入端點的 reCAPTCHA v3 擋。
  - ⚠ **登入端點目前沒有 IP rate limit**：[docs/10 §9.6](docs/10-backend-design.md) 設計了
    「登入 5 次／15 分鐘」，但只有兩支公開表單實作了（`FormHandler` 用 `IRateLimitService`），
    登入這支從來沒接。鎖定拿掉之後，reCAPTCHA 就是這支端點唯一的暴力破解防護。
    **要不要補上 IP rate limit 需要你決定**——它沒有「鎖住特定帳號」的問題（鍵是 IP 不是帳號），
    但同一個 NAT 後面的整間辦公室會共用配額，本質上是把阻斷服務的對象從帳號換成 IP。
- ✅ **reCAPTCHA v3 已完整設定並生效**（2026-09-08）：site key 走 `vars.RECAPTCHA_SITE_KEY`
  進前端 bundle，secret 已設進 Function App。實測不帶 token 的請求回 400 `BOT_CHECK_FAILED`
  且不寫入資料，確認驗證真的在跑。
  - ⚠ **最後一哩沒辦法用自動化驗證**：自動化瀏覽器送出時 Google 一律回 `browser-error`
    （這正是 v3 該做的事）。網域與金鑰本身沒問題——瀏覽器端取得了正常的 token、
    console 沒有 domain 錯誤。**需要一次真人手動送出才能確認真實訪客不會被擋。**
  - ⚠ **目前是 fail closed**：驗證沒過就退件。分數門檻 `Recaptcha__MinScore` 預設 0.5，
    用 VPN、隱私瀏覽器或公司 NAT 的真人可能被誤擋，而**被擋掉的詢價是直接消失的**。
    待評估：改成「驗證沒過仍收下，但標記為 `Spam` 狀態」——`ContactMessage`／`QuoteRequest`
    本來就有這個狀態，後台看得到、可以救回來，比讓客戶的生意消失好
- mockup 預覽站（Cloudflare Pages `nti-mockup`）**設計定案後下線**

---

## 七、上線前 checklist

> ⚠️ **目前 `robots.txt` 是 `Disallow: /`**——SWA 網址公開可達而上線排在 2026-11，
> 中間被收錄會留下指向 `azurestaticapps.net` 的舊索引。

上線當天**兩個 variable 必須一起翻**（只翻前者的話 canonical 會把權重導到臨時網址）：

```bash
gh variable set ALLOW_INDEXING -R waiting0201/nti -b 1
gh variable set SITE_URL -R waiting0201/nti -b https://www.nti-printing.com
gh workflow run web.yml -R waiting0201/nti    # variable 是 build-time 內嵌，要重建才生效
```

翻完之後別忘了把 `https://www.nti-printing.com/sitemap.xml` 提交到 Google Search Console
（`robots.txt` 開放後才會帶出這條位址），並確認舊網域的 301 已經指過來。

其餘見 [`docs/07`](docs/07-deployment.md) §5 DoD。

---

## 八、擋住的事項

| 項目 | 擋在哪 | 影響 |
|---|---|---|
| **中文文案** | 客戶未提供正式文案 | 已用機器翻譯初稿填滿（111 筆內容，`/zh` 可以驗收了），但**上線前需客戶校閱**。公司中文名與董事長姓名沒有依據，刻意保留 `NTI`／「鄭董事長」 |
| 舊站內容遷移 | 待決策點見 `reference/現有網站盤點與內容遷移.md` | 80 篇文章與 100 個標籤還沒進 CMS，那 170 條舊網址只能先導回首頁（拿不回權重）；缺漏頁面內容同此。**建議向客戶要舊站 Search Console 存取權**，按點擊排序決定哪些文章必須遷移 |
| 公司傳真、地圖嵌入碼 | 客戶未提供 | `SiteSetting` 的 `company.fax`／`company.map_embed` 仍為 NULL；地圖目前用地址字串查 Google Maps embed |
| SMTP 帳密 | 客戶未提供寄件帳號（`Smtp__Host`／`Port` 已填 Brevo） | 表單收得到資料，但通知信一律 `Failed` |
| 正式網域 | 客戶端 DNS | 上線 checklist 卡住 |

---

## 九、怎麼維護這份文件

- **每完成一項就改對應那格**，不要累積到最後補。
- 狀態改變時同步更新「一句話現況」與「最後更新」日期。
- 決策異動（不只是進度）要同時寫進對應 `docs/` 作業書的**變更紀錄**表——
  本檔只記狀態，不記決策理由。
- 踩到不會出現在錯誤訊息裡的坑時，**先寫成程式碼註解**，再在 §六摘要一行。

---

## 十、內容（2026-09-04）

`mockup/` 的頁面內容已匯入 CMS：[`db/content/200_mockup_content.sql`](db/content/README.md)，
由 [`tools/build-content-sql.mjs`](tools/build-content-sql.mjs) 產生，冪等、可重跑。

| 單元 | 筆數 | 單元 | 筆數 | 單元 | 筆數 |
|---|---|---|---|---|---|
| 首頁 Banner | 3 | 消息 | 12 | 設備 | 24 |
| 方案品項 | 15 | 影片 | 4 | 職缺 | 5 |
| 案例 | 6 | 常見問題 | 8 | 供應商公告 | 5 |
| 認證 | 14 | 產業趨勢 | 5 | 供應商規範 | 4 |
| 客戶 logo | 6 | | | | **合計 111** |

四筆固定方案的封面與文案一併補上並上架（種子原本刻意設為未上架）。

**逐頁實測**：中文站各頁確實顯示中文內容、英文站維持英文，
中英 slug 不同的消息詳細頁互打對方語系會 404（缺語系不 fallback）。
沒設 `NEXT_PUBLIC_API_BASE` 時 `verify:markup` 仍然 44 頁全過。

### ⚠ 中文是初稿

`tools/content-zh.mjs` 的繁中翻譯是機器產出的初稿，**不是客戶核可的文案**。
兩個沒有依據、刻意不編的專有名詞：**公司中文名**（保留 `NTI`）與
**董事長中文姓名**（用「鄭董事長」）。

### 產生器回報、需要人決定的兩件事

1. **3 篇消息的 SEO 標題超過 70 字元** —— 留空而不是截斷（截斷會把沒寫完的
   標題送進搜尋結果）。請在後台補一個夠短的。
2. **2 個 mockup 標籤對不到 `db/seed` 的分類** —— `Project:esg`／`Project:retail`
   是設計稿的示範標籤，已對到最接近的既有分類（其他／禮品）。
