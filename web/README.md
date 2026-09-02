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
├── src/middleware.ts          # `/` 與缺語系路徑導向 `/en`
└── scripts/
    ├── sync-assets.mjs        # 素材同步
    ├── build-pages.mjs        # 一次性 codegen：mockup HTML → page.tsx
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
npm run build && npm run start          # 一個終端
npm run verify:markup                   # 另一個終端 → 「全部 44 頁與 mockup 一致」
```

`verify:markup` 比對標籤結構、class、屬性值、文字與**會被渲染的空白**，
忽略不影響渲染的差異（縮排、屬性順序、HTML 實體寫法）。
共用元件（header／footer／浮動鈕）也逐頁比對，順便驗證每頁的 nav active 狀態。

> 若之後改為手動維護頁面內容，請停用 `build-pages.mjs`（它會覆寫 `page.tsx`）。

## 雙語現況

- 路由：`/en/...`、`/zh/...`；`/` 與缺語系路徑由 middleware 導向 `/en`。
- `<html lang>`、canonical 與 `hreflang`（en／zh-Hant／x-default）已就緒。
- **中文文案尚未提供**，`/zh` 目前渲染與 `/en` 相同的英文內容作為佔位。
  依 [`docs/02-frontend.md`](../docs/02-frontend.md) §4，i18n 內容串接排在 P8。

## 已知待辦

- 中文文案、Header 搜尋功能、手機版漢堡選單（mockup 本身也未實作行為）。
- 表單（`/contact`、`/get-a-quote`）目前是 mockup 的前端成功卡，尚未接 API。
- `img-size.js`（mockup 的素材尺寸標示）依原註解不掛載於正式站。
