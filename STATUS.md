# 專案進度總表

> **這份文件是「做到哪裡了」的單一真相來源。** 每完成一項就更新對應那格。
>
> 分工：本檔記錄**狀態**；[`docs/`](docs/README.md) 的十份作業書記錄各領域的**規格與施工標準**；
> [`CLAUDE.md`](CLAUDE.md) 記錄**專案規範與索引**。三份不要互相抄，各司其職。

**最後更新**：2026-09-02

---

## 一句話現況

**前端切版、後台介面、部署管線三條線已完成並在 Azure 上運作**——
公開站 44 頁與後台 24 單元同站部署於 `stapp-nti-prod`，素材走 Blob，
push 到 GitHub 即自動部署。**API 與資料庫尚未開工**，後台目前接的是本機 mock，
所有內容都是從 mockup 與 `db/seed` 產生的種子資料。

下一段主線是 **P4 後端**（Azure Functions .NET 10 + EF/Dapper 雙軌）。

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
| P4 | 後端／CMS API | ⬜ | **下一段主線**。`Api/` 尚未建立 |
| P5 | 前台頁面開發 | 🟡 | 44 頁切版完成；內容仍為靜態，未接 API |
| P6 | 會員／報價／聯絡 | 🟡 | 表單已切版（`PageForm`），無後端 |
| P8 | 內容遷移／雙語／SEO 實作 | 🟡 | 雙語路由就緒，**中文文案未提供**；sitemap 與結構化資料未做 |
| P9 | 整合測試／QA／SEO 稽核 | ⬜ | |
| P10 | UAT 客戶驗收 | ⬜ | |
| P11 | 部署 | ✅ | SWA + Blob + CI 全通（見 §六） |
| — | AI 客服 | ⛔ | 本期不納入 |
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
| 中文文案 | **未提供**。`/zh` 目前渲染與 `/en` 相同的英文內容作為佔位 |
| 內容來源 | 全部寫死在 `page.tsx`，未接 API（P5 尾段） |
| 表單送出 | `PageForm` 只有前端行為，送出無後端（P6） |

### ⬜ 未做

- `sitemap.ts`（`robots.ts` 已有）
- 結構化資料（JSON-LD）
- 舊站 301 轉址對照表（盤點在 `reference/現有網站盤點與內容遷移.md`）

---

## 三、後台介面（24 單元）

`apps/admin`，React + Vite 純 SPA，掛在 `/admin/`。

### ✅ 已完成

- **24 個單元 + 儀表板**（清單項目 25），依 [`docs/09`](docs/09-cms-admin.md) 實作
- **驗收閘**：`pnpm --filter admin check:units` →
  「每個上傳欄位都有 §3 提示、每個圖片欄位都有中英 Alt、權限矩陣 171 列」
- **權限矩陣**與 [`db/seed/110_role_permission.sql`](db/README.md) 一對一（171 列），數字對不上時 dev 模式 console 直接報錯
- **角色切換登入**（SuperAdmin／Editor／Viewer）用來驗權限矩陣

### 🟡 有缺口

| 項目 | 現況 |
|---|---|
| 資料來源 | `src/api/client.ts` 接的是 `seed.generated.ts`（自 `db/seed` 與 mockup 產生）。**改動不落地，重整即還原** |
| 登入 | 點角色卡片即進入，無密碼。正式版為 Email + 密碼、首登強制改密碼、連錯 5 次鎖 15 分鐘 |
| 檔案上傳 | 欄位與尺寸提示齊備，實際上傳無後端 |

---

## 四、資料模型（49 張表）

### ✅ 已完成

- [`docs/08-database.md`](docs/08-database.md)：49 張表的 DDL、多語策略、索引、種子、遷移策略
- [`db/`](db/README.md) 參考實作：`migrations/`（0001–0003）、`seed/`（100–150 共 6 支）、`verify/`、`tools/run-local.sh`
- 本機一鍵建置：`cp db/.env.local.example db/.env.local && db/tools/run-local.sh`

### ⬜ 未做

- **EF Core Migration**——schema 的**權威來源**是它，不是 `db/`（見 [`docs/10`](docs/10-backend-design.md) §8）。
  `Api/Data/Migrations/` 尚未建立。
- Azure SQL Database 實例尚未開設

---

## 五、API（尚未開工）

`Api/` 尚未建立。契約規範在 [`docs/04-api.md`](docs/04-api.md)，施工標準在 [`docs/10-backend-design.md`](docs/10-backend-design.md)（範本專案：`/Users/tim/webapps/Jabez/Api`）。

| 群組 | 規劃端點數 | 狀態 |
|---|---|---|
| 3.1 前台內容（公開唯讀） | 18 | ⬜ |
| 3.2 表單（公開寫入） | 2 | ⬜ |
| 3.3 會員（認證） | 4 | ⬜ |
| 3.4 後台管理（RBAC） | 24 單元 CRUD + 5 支動作端點 | ⬜ |

> 開工前必讀順序：`docs/10`（分層鐵律、`ApiResponse` 信封、錯誤碼、JWT/RBAC）→ `docs/04`（要寫哪些端點）。

---

## 六、部署與維運 ✅

### 正式環境（2026-09-02 起運作）

| 資源 | 值 |
|---|---|
| Static Web App | `stapp-nti-prod`（RG `NTIUS`／westus2／**Free**） |
| 網址 | `gray-river-0a6ae341e.5.azurestaticapps.net` |
| Blob Storage | `stntiprod`／容器 `assets`（126 檔 62MB，公開讀取） |
| CI | `.github/workflows/web.yml`，push 公開 repo 的 `main` 觸發 |
| standalone 產物 | **73MB**（上限 250MB） |

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

- 正式網域 `www.nti-printing.com` 綁定（custom domain + DNS）
- Azure Functions 與 Azure SQL 的資源與 pipeline（隨 P4 一起）
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

其餘見 [`docs/07`](docs/07-deployment.md) §5 DoD。

---

## 八、擋住的事項

| 項目 | 擋在哪 | 影響 |
|---|---|---|
| **中文文案** | 客戶未提供 | `/zh` 全站是英文佔位，雙語驗收無法進行 |
| 舊站內容遷移 | 待決策點見 `reference/現有網站盤點與內容遷移.md` | 301 對照表、缺漏頁面內容 |
| Azure SQL 開設 | 隨 P4 一起，尚未開工 | 後台無法脫離 mock |
| 正式網域 | 客戶端 DNS | 上線 checklist 卡住 |

---

## 九、怎麼維護這份文件

- **每完成一項就改對應那格**，不要累積到最後補。
- 狀態改變時同步更新「一句話現況」與「最後更新」日期。
- 決策異動（不只是進度）要同時寫進對應 `docs/` 作業書的**變更紀錄**表——
  本檔只記狀態，不記決策理由。
- 踩到不會出現在錯誤訊息裡的坑時，**先寫成程式碼註解**，再在 §六摘要一行。
