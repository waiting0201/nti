# web — NTI Printing 公開站（Next.js）

`mockup/` 的 44 頁靜態切版稿，1:1 搬進 Next.js App Router。
**版面與 CSS 完全依 mockup**（客戶已確認的版本），本專案不做視覺重新詮釋。

## 內容從哪來

由 `NEXT_PUBLIC_API_BASE` 決定，兩種模式的**版面完全相同**：

| | 沒設（現況部署） | 設了 |
|---|---|---|
| 集合型內容 | 各頁寫死的 mockup 內容 | CMS（`/api/v1/*`） |
| 固定頁 SEO | 各頁寫死的 title/description | 後台「固定頁」單元 |
| 圖片 | `public/assets` 或 `NEXT_PUBLIC_MEDIA_BASE` | CMS 上傳的走 `/files/media/*` 代理 |

沒設就整層停用（`src/lib/api.ts`）。這不是權宜：客戶的內容與中文文案都還沒進 CMS，
而公開站已經部署在 SWA 上——接了空的資料庫只會讓整站變空白。

接 API 跑：

```bash
cd Api && func start                                       # 另一個終端
NEXT_PUBLIC_API_BASE=http://localhost:7071/api/v1 pnpm --filter web dev
```

⚠ `NEXT_PUBLIC_*` 是 **build 時內嵌**的，換 base 要重新 build。
本機的 func 要用 **7072**（7071 被別的專案佔著時），兩邊要一致。

CMS 資料**完全不快取**（見〈存檔後多久才更新〉），所以改了後台重整就看得到；
還是看不到的話先確認 `NEXT_PUBLIC_API_BASE` 真的有設——沒設時整層 API 停用，
畫面上是寫死的 mockup 內容，改什麼都不會變。

### 哪些頁接了 CMS

| 頁面 | 來源 |
|---|---|
| 全部 44 頁的 `<head>` | 固定頁 SEO（`/pages/{pageKey}`，對照表在 `src/lib/pages.ts`） |
| 首頁 | Banner、Proof 認證牆、客戶 logo |
| `/news`、`/news/{slug}` | 消息列表與詳細頁（詳細頁是新增的動態路由） |
| `/projects`、`/faq`、`/green-vlog`、`/industry-trends`、`/careers` | 各自的內容單元 |
| `/about-certifications`、`/supplier-area` | 認證牆／公告、規範、下載 |
| `/facility-*`（4 頁）、`/products-*`（3 頁） | 設備卡、方案品項卡 |
| `/contact`、footer、首頁形象圖帶 | **網站設定**（單元 21，`/site-settings`）——公司資訊、社群網址、圖帶 |

其餘頁面的內容是**固定文案**（docs/08 決議 3：固定頁的內容寫死在前端，
CMS 只管 SEO），所以它們只接 SEO。

網站設定走 [`src/lib/site-settings.ts`](src/lib/site-settings.ts)：讀不到（沒設 API base、
端點掛了）回 `null`，呼叫端就渲染寫死的 mockup 內容；讀到了但某個 key 是空的，
同樣落回寫死的值。**社群圖示是唯一的例外**：接上 CMS 之後只顯示客戶填了網址的那幾個，
一個都沒填就一個都不顯示——後台那三個欄位的提示就是這樣寫的（「留空則前台不顯示該圖示」），
拿 mockup 那三個 `href="#"` 當退路等於把死連結送上線。

> `/contact` 的 `generateMetadata()` 仍是寫死的電話與信箱：那段在頁面渲染前就要決定，
> 而且屬於 SEO 文案（單元 20）。客戶改了電話，頁面會變、搜尋結果摘要不會——已知，不是漏接。
> 同理 `lib/jsonld.ts` 的結構化資料也還是寫死的一份公司資訊。

> `mockup/` 那 12 篇 `/news-*` 是設計稿附的示範文章，保留著——
> CMS 沒有內容時列表會連到它們，有內容時列表改連 `/news/{slug}`。

⚠ **接了 CMS 的頁面不再由 `build-pages.mjs` 產生**（會洗掉接線）。
清單在該腳本的 `HAND_MAINTAINED`。

## 快速開始

```bash
npm install
npm run sync:assets     # 從 ../mockup/assets 同步圖片素材（76MB，不進版控）
npm run dev             # http://localhost:3100
```

> `mockup/` 本身未進版控（見 [`CLAUDE.md`](../CLAUDE.md) 版控段），
> 新環境請先自 NAS 取得 `mockup/` 再跑 `sync:assets`。

## 專案結構

```
web/
├── src/app/
│   ├── globals.css            # ← mockup/assets/site.css 原檔複製，未改一個字元
│   ├── home.css               # ← mockup/index.html 的 inline <style> 原樣抽出（只有首頁載入）
│   └── [locale]/
│       ├── layout.tsx         # html/head（Google Fonts 同 mockup）＋ Header/Footer/浮動鈕
│       ├── page.tsx           # 首頁（index.html）
│       └── <slug>/page.tsx    # 其餘 43 頁，slug 與 mockup 檔名一一對應
├── src/components/
│   ├── SiteHeader / SiteFooter / FloatingPanel   # mockup 三處共用區塊
│   ├── SiteChrome.tsx         # 每頁共用的那段 inline script（sticky header／reveal／浮動鈕／語系下拉／explorer）
│   ├── behaviors/             # 各頁專屬 script：HeroSlider／FacilityExplorer／ProductShowcase／FaqFilter／ProjectFilter／PageForm
│   ├── A.tsx                  # <a> 包裝：站內走 next/link，錨點與外部連結維持原生 <a>
│   └── nav-active.ts          # 逐頁自 mockup 擷取的 header active 對照表
├── src/lib/i18n.ts            # locale、路由前綴、canonical/hreflang
├── src/middleware.ts          # `/` 與缺語系路徑導向 `/en`；`/admin/*` 的後台 SPA fallback
└── scripts/
    ├── sync-assets.mjs        # 素材同步
    ├── build-pages.mjs        # 一次性 codegen：mockup HTML → page.tsx
    ├── extract-i18n.mjs       # 盤點 mockup 的可翻譯字串／重產 zh-client.ts
    ├── pack-standalone.mjs    # postbuild：把 standalone 整理成 SWA 收得下的形狀
    ├── check-size.mjs         # postbuild：SWA Free 的 250MB 閘
    └── verify-markup.mjs      # 版面驗收閘：Next 輸出 vs mockup 逐節點比對
```

## 版面一致性怎麼保證

1. **CSS 不重寫**：`globals.css` 是 `site.css` 的原檔複製；`home.css` 是首頁 inline style 原樣抽出。
   兩者只有 `--card` 一個變數不同（`#F3F5F7` / `#F5F7F8`，mockup 本來就如此），
   且 `home.css` 只掛在首頁路由，內頁不會載到。
2. **HTML 不手抄**：44 個頁面由 `scripts/build-pages.mjs` 從 mockup 機械式轉換而來，
   只做 HTML→JSX 語法轉換與連結／素材路徑重寫，結構、class、文案一字未動。
3. **行為不重寫**：mockup 各頁的 inline script 原樣移植成 `useEffect`，
   不改成 React state 驅動，以免動到 DOM 結構。
4. **有驗收閘**：

```bash
pnpm --filter web build && pnpm --filter web start          # 一個終端
pnpm --filter web verify:markup                   # 另一個終端 → 「全部 44 頁與 mockup 一致」
```

`verify:markup` 比對標籤結構、class、屬性值、文字與**會被渲染的空白**，
忽略不影響渲染的差異（縮排、屬性順序、HTML 實體寫法）。
共用元件（header／footer／浮動鈕）也逐頁比對，順便驗證每頁的 nav active 狀態。

> 若之後改為手動維護頁面內容，請停用 `build-pages.mjs`（它會覆寫 `page.tsx`）。

## 後台同站部署（`/admin/`）

管理後台（`apps/admin`，Vite 打包的純 SPA）與公開站部署到**同一個 Azure Static Web Apps**，
掛在 `/admin/`。後台的 vite `build.outDir` 直接指向本專案的 `public/admin/`，沒有複製步驟；
產物不進版控。

⚠️ **建置順序有相依：先 admin 後 web**，`next build` 才會把 `public/admin` 一起打包。

```bash
pnpm --filter admin build && pnpm --filter web build
```

同站之後有三件事必須知道：

1. **SPA fallback 寫在 `src/middleware.ts`，不是 `next.config.ts`。**
   `[locale]` 是動態段、什麼都吃，`/admin/news` 會先被 `/[locale]/news` 接走
   （locale=`"admin"`）在 layout 裡 `notFound()`，`fallback` rewrite 根本輪不到。
   middleware 排在路由比對之前，才擋得住這個碰撞。
2. **也不能用 `staticwebapp.config.json`。** SWA 對 Next.js hybrid 站會忽略該檔的
   路由設定（`routes` / `navigationFallback`）。寫在 middleware 讓 dev、`next start`、
   SWA 三種環境行為一致。
3. **後台不自帶素材。** vite build 會關掉 `publicDir`，後台的 `/assets/...` 直接命中
   本專案的 `public/assets`，省掉重複的 70MB。

middleware 的 matcher 有兩個不可拿掉的排除項：`.swa`（SWA 用 `/.swa/health.html`
驗證部署起得來，被導向就判定部署失敗，錯誤訊息不會指向這裡）與副檔名結尾
（`/assets/*`、`/admin/static/*`、`robots.txt` 一律放行）。

後台與公開站同域，所以 `src/app/robots.ts` 明確 `Disallow: /admin/`
（`index.html` 的 `meta noindex` 只擋索引、不擋爬取）。

## 部署產物（SWA Free）

`next build` 設 `output: 'standalone'`，並由 `postbuild` 收尾：

```bash
pnpm --filter web build          # next build → pack-standalone → check-size
pnpm --filter web start:standalone   # 用實際要部署的產物起站（驗證用）
```

`pack-standalone.mjs` 做兩件 Next 不會自己做、但少了就會出事的事：

1. **把 `.next/static` 與 `public/` 複製進 standalone。** 少了它們，部署後 CSS、
   字型、圖片與整個 `/admin` 全部 404 —— 而 build 完全成功，不會有任何警告。
2. **壓平 pnpm workspace 造成的兩層巢狀。** SWA 找的是
   `.next/standalone/server.js`，workspace 下它會落在
   `.next/standalone/apps/web/server.js`，SWA 找不到入口，部署會走到最後才回
   「Web app warm up timed out」。

`check-size.mjs` 擋 SWA Free 的 250MB 單一環境上限。素材走 Blob 時
`pack-standalone.mjs` 不會打包 `public/assets`，產物 **135MB → 73MB**。

> ⚠️ 三個不會出現在錯誤訊息裡的坑——`outputFileTracingRoot` 不可釘在 app 上、
> CI 必須 `NPM_CONFIG_NODE_LINKER=hoisted` 安裝、middleware matcher 必須排除
> `.swa`——原因分別寫在 `next.config.ts`、`scripts/pack-standalone.mjs`、
> `src/middleware.ts` 的註解，彙整在
> [`docs/07-deployment.md`](../../docs/07-deployment.md) §7.1。

## 部署

`stapp-nti-prod`（Azure Static Web Apps，Free）＝ `gray-river-0a6ae341e.5.azurestaticapps.net`。
公開站與後台在同一份產物裡（`/` 與 `/admin/`）。

自動部署：`.github/workflows/web.yml`，push 到公開 repo 的 `main` 觸發。
`main` 由 `tools/sync-public.sh` 從 `master` 產生，所以日常流程
（commit → `sync-public.sh` → `push Remote_GitHub`）就會部署一次。

> ⚠️ **上線前 robots 預設擋全站**（`src/app/robots.ts`）。上線要設兩個 repository
> variable：`ALLOW_INDEXING=1` 與 `SITE_URL=https://www.nti-printing.com`。
> 只開前者的話 canonical 還指著 azurestaticapps.net，權重會導到臨時網址。
> 詳見 [`docs/07-deployment.md`](../../docs/07-deployment.md) §7.3。

## 素材：本機 vs Blob

素材網址一律經過 [`src/lib/media.ts`](src/lib/media.ts) 的 `mediaUrl()`，由
`NEXT_PUBLIC_MEDIA_BASE` 決定前綴：

| | 未設（本機、`verify:markup`） | 設為 Blob |
|---|---|---|
| 輸出 | `/assets/x.png`，由 `public/assets` 服務 | `https://stntiprod.blob.core.windows.net/assets/x.png` |
| standalone | 135MB（含素材） | 73MB（`public/assets` 不打包） |
| 需要 `mockup/` | 是（`sync:assets` 來源） | **否** |

```bash
NEXT_PUBLIC_MEDIA_BASE=https://stntiprod.blob.core.windows.net pnpm --filter web build
```

44 個頁面的 `src` 由 `build-pages.mjs` 產生成 `{mediaUrl("/assets/…")}`，
`verify:markup` 讀同一個變數正規化 mockup 端的路徑，所以兩種模式下版面驗收閘都成立。

素材更新後重新上傳：`AZ_STORAGE_ACCOUNT=stntiprod tools/upload-assets.sh`。

## 雙語現況

- 路由：`/en/...`、`/zh/...`。`<html lang>`、canonical 與 `hreflang`（en／zh-Hant／x-default）已就緒。
- **語系解析**（`src/middleware.ts`）：使用者選過的（`NEXT_LOCALE` cookie，一年）→
  `Accept-Language` → `en`。造訪任何 `/zh/...` 或 `/en/...` 就會把該語系記下來，
  所以之後回到 `/` 不會被打回英文。順序與後端 `Common/LangResolver.cs` 一致，
  只有預設值不同（前台 `en`，API `zh`）。
- **靜態文字**：`src/lib/zh.ts` 以**英文原文為 key**，查不到就落回英文。
  頁面把整棵 JSX 包在 `<T locale={locale}>` 裡，由 `src/lib/translate.tsx` 走訪
  element tree 換掉文字節點與 `alt`／`title`／`placeholder`／`aria-label`。
  **`/en` 完全不經過替換**，所以 `verify:markup` 這道閘不受影響。
- **CMS 內容**：接了 `NEXT_PUBLIC_API_BASE` 的 16 頁改吃資料庫的 `*I18n` 資料表，
  兩個語系各自獨立（缺語系不 fallback）。資料不快取，每個請求重新取（見下）。

### 存檔後多久才更新

**立刻。CMS 資料這一層沒有任何快取**（2026-09-11 起）：`src/lib/api.ts` 的每支 fetch
都帶 `cache: 'no-store'`，用到它的頁面在執行期就是每個請求重新渲染，
後端的唯讀端點也一律回 `no-store`。編輯者存完檔，前台重整就是新的。

在此之前是 `revalidate: 300` + `tags: ['cms']` 的 ISR，靠後端存檔時打
`POST /api/revalidate` 把 tag 作廢。那條路徑（前台的 route handler、後端的
`FrontendRevalidator`、兩邊的 `REVALIDATE_SECRET`／`Revalidate__Url`）已經整批移除——
它有一個補不起來的洞：ISR 快取是**每個執行個體各自持有**的，SWA 一旦擴出第二個
執行個體，通知只清得到接到請求的那一台，其餘仍等 300 秒。

⚠️ 正式環境的 SWA 與 Function 上如果還留著 `REVALIDATE_SECRET`／`Revalidate__Url`／
`Revalidate__Secret` 三個 app setting，現在是無害的孤兒設定，可以刪（見 docs/07 §環境變數）。

代價要知道：**每一個訪客的每一頁都會打 API、進一次 Azure SQL Basic**。
流量長起來之後要加回快取的話，加在 `src/lib/api.ts`，並且要連同
「多執行個體下怎麼作廢」一起解決，不是把舊的 webhook 接回來就好。

例外是圖片：`/files/media/*` 仍然是一年的 `immutable` 快取。那裡回的是檔案位元組、
檔名帶 GUID，後台換圖會產生新路徑，不會拿到舊的那張。

### 字典怎麼維護

```bash
node scripts/extract-i18n.mjs           # 列出 mockup 有、字典還沒有的字串
node scripts/extract-i18n.mjs --stale   # 列出字典有、mockup 已經沒有的 key
node scripts/extract-i18n.mjs --client  # 重產 src/lib/zh-client.ts
```

英文文案的權威來源仍然是 `mockup/`：**要改英文請改 mockup 再重跑 `build-pages.mjs`**，
字典只補中文。目前 962／1003 筆有中文，其餘 41 筆是刻意不翻的品牌名、機型名、
認證縮寫、Email 與檔案大小（`extract-i18n.mjs` 不帶參數就會把它們列出來）。

⚠ **中文是機器翻譯初稿，不是客戶核可的文案**，與 `tools/content-zh.mjs` 的 CMS
內容同一個狀態。上線前必須由客戶校閱。

### 為什麼字典分兩份

`SiteHeader` 與兩個 explorer 是 client component。讓它們吃完整字典，1000 筆會被
打進 client bundle，於是 `zh-client.ts` 只放它們用得到的 82 筆，由
`extract-i18n.mjs --client` 從 `zh.ts` 產生，不會漂移。

## SEO 基礎建設

| 檔案 | 做什麼 |
|---|---|
| `src/app/sitemap.ts` | 44 條靜態路由 × 2 語系，接了 CMS 再加消息詳細頁；逐條帶 hreflang |
| `src/app/robots.ts` | 預設 `Disallow: /`，`NEXT_PUBLIC_ALLOW_INDEXING=1` 才開放並附 sitemap 位址 |
| `src/lib/routes.ts` | **產生檔**：全部靜態路由，`build-pages.mjs` 從 mockup 產出 |
| `src/lib/breadcrumbs.ts` | **產生檔**：各頁麵包屑（含中文），來自 mockup 的 `.crumb` |
| `src/lib/jsonld.ts` | 結構化資料建構器（`Organization`／`WebSite`／`BreadcrumbList`／`NewsArticle`） |
| `src/lib/legacy-redirects.ts` | 舊站 301 對照表（59 條專屬落點），由 `middleware.ts` 發 301 |
| `src/lib/legacy-archive.ts` | **產生檔**：舊站其餘 170 條網址，一律導回首頁 |

兩件動手前要知道的事：

1. **JSON-LD 不能加在 `</header>` 到 `<footer>` 之間**——`verify:markup` 比對那個區間的
   節點序列，多一個 `<script>` 就會整頁報差異。全站的掛在 layout 的 body 末端；
   麵包屑只跟路由有關，所以做成 client component（`BreadcrumbJsonLd`）也掛在 layout，
   44 個 page.tsx 完全不用動——其中 28 個是產生的，手動加也會被下次 codegen 洗掉。
2. **兩個產生檔不要手改**，改 mockup 再重跑 `node scripts/build-pages.mjs`。

舊站轉址的覆蓋率（repo 根目錄執行，會連到舊站抓 sitemap）：

```bash
node tools/check-legacy-redirects.mjs          # 只回報
node tools/check-legacy-redirects.mjs --write  # 一併更新 reference/舊站301對照表.md
```

## 已知待辦

- **中文文案待客戶校閱**（現況為機器翻譯初稿）。
- 手機版漢堡選單仍然沒有行為（mockup 本身也未實作），但語系切換已經有了。
- 首頁 hero 的橫幅圖片把英文標語**燒在圖裡**（`ref-home-banner*.png`），
  中文站要換掉需要客戶提供中文版素材。
- 表單（`/contact`、`/get-a-quote`）目前是 mockup 的前端成功卡，尚未接 API。
- `img-size.js`（mockup 的素材尺寸標示）依原註解不掛載於正式站。
- 舊站 301 有 59 條是專屬落點，其餘 170 條先導回首頁（客戶決定，不讓使用者撞 404）。
  那 170 條拿不回 SEO 權重，**等內容遷移**後補成一對一。
  注意只有「舊站 sitemap 上真的存在」的網址會被導首頁——其他不存在的路徑照樣 404，
  不會把整站變成永不 404。
