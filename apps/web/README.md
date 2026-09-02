# web — NTI Printing 公開站（Next.js）

`mockup/` 的 44 頁靜態切版稿，1:1 搬進 Next.js App Router。
**版面與 CSS 完全依 mockup**（客戶已確認的版本），本專案不做視覺重新詮釋。

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

- 路由：`/en/...`、`/zh/...`；`/` 與缺語系路徑由 middleware 導向 `/en`。
- `<html lang>`、canonical 與 `hreflang`（en／zh-Hant／x-default）已就緒。
- **中文文案尚未提供**，`/zh` 目前渲染與 `/en` 相同的英文內容作為佔位。
  依 [`docs/02-frontend.md`](../docs/02-frontend.md) §4，i18n 內容串接排在 P8。

## 已知待辦

- 中文文案、Header 搜尋功能、手機版漢堡選單（mockup 本身也未實作行為）。
- 表單（`/contact`、`/get-a-quote`）目前是 mockup 的前端成功卡，尚未接 API。
- `img-size.js`（mockup 的素材尺寸標示）依原註解不掛載於正式站。
