# admin — NTI Printing 管理後台（React + Vite SPA）

依 [`docs/09-cms-admin.md`](../docs/09-cms-admin.md) 實作的 **24 個後台單元**。
純 SPA、靜態輸出、`noindex`，資料一律走 `/api/v1/admin/*`（尚未上線，目前接本機 mock）。

## 快速開始

```bash
npm install
pnpm --filter admin seed     # 從 db/seed/*.sql 與 mockup/*.html 產生種子資料
pnpm --filter admin dev      # http://localhost:3300/admin/
```

登入頁選一個角色即可進入。任何網址加上 `?as=SuperAdmin` / `?as=Editor` / `?as=Viewer`
可直接以該角色開啟——把不同角色看到的畫面丟連結給客戶時很方便。

> 圖片來自 `public/assets`（指向 `../../mockup/assets` 的 symlink，不進版控）。
> 正式站的圖片會放 Azure Blob Storage。

## 部署形態：與公開站同站

後台不單獨開一個 Static Web Apps，而是**併進公開站掛在 `/admin/`**：
vite 的 `build.outDir` 直接指向 `../web/public/admin`，沒有複製步驟。

⚠️ **建置順序有相依：先 admin 後 web**，`next build` 才會把產物一起打包。
從 repo 根執行：

```bash
pnpm --filter admin build && pnpm --filter web build
```

dev 與 build 兩種形態的差別只有素材來源：

| | `pnpm --filter admin dev` | `pnpm --filter admin build` |
|---|---|---|
| 素材 | `public/assets` symlink → `mockup/assets` | 共用公開站的 `/assets/`，不複製第二份 |

設了 `VITE_MEDIA_BASE`（正式站＝`https://stntiprod.blob.core.windows.net`）時一律以它為前綴，蓋過上表兩種。

| `publicDir` | `public` | `false`（見 `vite.config.ts`） |
| `assetUrl()` 前綴 | `/admin` | 無（見 `src/lib/asset.ts`） |

> `pnpm --filter admin preview` 是 build 產物，圖片會指向 `/assets/`——
> 那要由公開站提供，單獨 preview 會缺圖，屬預期行為。

深層路徑（`/admin/u/news/1`）的 SPA fallback 在 `apps/web/src/middleware.ts`——
不能寫在 `next.config.ts` 或 `staticwebapp.config.json`，原因見
[`apps/web/README.md`](../web/README.md#後台同站部署admin)。

## 驗收閘

```bash
pnpm --filter admin check:units   # → 「✓ 每個上傳欄位都有 §3 提示、每個圖片欄位都有中英 Alt、權限矩陣 171 列」
pnpm --filter admin typecheck
```

`check:units` 對應 [`docs/09-cms-admin.md`](../docs/09-cms-admin.md) §8 DoD 的三條可機檢項目；
開發模式下 App 啟動時也會跑同一份檢查並印在 console。

## 這份實作對應規格的哪些條文

| docs §  | 實作位置 |
|---|---|
| §2 24 個單元 | [`src/units/`](src/units/) —— 一個單元一份宣告（欄位、清單欄、排序、上下架、固定筆數…） |
| §3 上傳建議尺寸 | [`src/units/content.ts`](src/units/content.ts) 的 `HINT`，**逐字**引用規格文字，顯示在欄位旁 |
| §3 共通規則 | 每個圖片欄位都配一個中英 Alt；[`validateUnits()`](src/units/index.ts) 會在開發模式檢查並在 console 指出違規 |
| §5.1 清單頁 | [`ListPage`](src/pages/ListPage.tsx)：分頁 20 筆、關鍵字、狀態／分類篩選、中英完成度 badge、批次上下架、批次軟刪、拖曳排序 |
| §5.2 編輯頁 | [`EditPage`](src/pages/EditPage.tsx)：左側語系中性欄位、右側中文／English 分頁，切換不離頁、離開前攔截未存變更 |
| §5.3 多語 | [`completeness.ts`](src/lib/completeness.ts)：上架前檢查兩語系必填，缺漏逐欄指出；另有「複製中文到英文」 |
| §5.4 上下架 | `publishState()` 推導草稿／已排程／上架中／已下架；上架時間、下架時間 |
| §5.5 富文本 | [`sanitizeHtml`](src/components/fields.tsx) 白名單 `p h3 h4 strong em ul ol li a blockquote img figure figcaption br`，貼上時去樣式 |
| §5.6 SEO 欄位組 | [`SEO_FIELDS`](src/units/index.ts)，只掛在 `page`／`news`／`solution`；Title 70／Description 180 即時字數與超長警示 |
| §5.7 刪除 | 一律軟刪；分類改為「有引用就只能停用」，對話框顯示引用筆數 |
| §6 權限矩陣 | [`permissions.ts`](src/lib/permissions.ts) 逐格對照規格，選單與按鈕依權限顯示；[管理員頁](src/pages/custom.tsx)可看到整張矩陣與展開列數 |
| §7 固定文字區 | 這些區塊**沒有**對應單元，符合決議 3 |
| 決議 2 | 沒有「媒體管理」選單，圖片只能從所屬欄位上傳 |

## 資料從哪來

目前的資料是 mock，但**內容是真的**：

- `db/seed/120_category.sql` → 九類共 44 筆分類
- `db/seed/140_page.sql` → 29 筆固定頁
- `db/seed/150_solution.sql` → 4 筆方案
- `mockup/*.html` → 12 篇新聞、6 個案例、8 則 FAQ、14 枚認證、24 張設備卡、5 個職缺…

由 [`scripts/build-seed.mjs`](scripts/build-seed.mjs) 產生（`pnpm --filter admin seed`），
所以後台一打開就是這個站真正的內容，客戶看得懂自己在改什麼。
P6 的報價／聯絡／會員／訂單與操作紀錄則是示意資料（前台表單尚未接 API）。

資料存在瀏覽器的 localStorage，**可以真的新增、編輯、排序、上下架**，重整不會消失。

## 接上後端要改哪裡

只有 [`src/api/client.ts`](src/api/client.ts) 一個檔案。上層畫面只認它匯出的
`list / listAll / get / save / create / softDelete / setPublished / reorder / …`，
不知道資料從哪來。換成帶 JWT 打 Azure Functions、解 `ApiResponse` 信封即可
（見 [`docs/10-backend-design.md`](../docs/10-backend-design.md)）。

## 已知未完成

- 富文本用 `document.execCommand`，夠用但不是長久方案；接 API 時可換成 Tiptap／Lexical。
- 上傳只在瀏覽器端產生預覽 URL，沒有真的上傳；尺寸檢核與 WebP 衍生檔屬後端工作（§3）。
- 報價 CSV 匯出、轉址 CSV 匯入匯出、信件重寄目前只有按鈕與權限判斷，行為待後端。
- 登入沒有真正的驗證，密碼規則、鎖定機制屬後端（§23）。
