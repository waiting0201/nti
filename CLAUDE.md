# CLAUDE.md — NTI Printing 官網專案

本檔為專案規範與索引，供 Claude Code 與協作者每次進場時快速掌握全貌。

## 專案概述

NTI Printing 官方網站建置案。NTI 為包裝印刷廠，品牌精神為
**"The Courage to Print Green — 永續 All In!"**，永續／綠色印刷為核心訴求。

- 品牌標語（PES）：PROFESSIONALS | EFFECTIVENESS | SERVICE
- 需求：中／英雙語官網 + 自建 CMS 後台 + 會員系統 + 報價／聯絡表單 + AI 客服
- 目前狀態：**前端切版 + 後台介面完成**（`apps/web/` Next.js 1:1 承接 `mockup/` 全部 44 頁、雙語路由就緒；`apps/admin/` 24 個後台單元可操作，接本機 mock；兩者同站部署於 `/` 與 `/admin/`；API／DB 正式開發尚未啟動）

## 文件索引

| 文件 | 說明 |
|------|------|
| [**專案進度總表**](STATUS.md) | **做到哪裡了**的單一真相來源：已完成／未開工／被擋住的項目，與上線前 checklist |
| [規劃書（md）](reference/NTI_Printing_官網規劃書.md) | 完整官網規劃：前端頁面、後端功能、sitemap、技術建議 |
| [規劃書（pdf）](reference/NTI_Printing_官網規劃書.pdf) | 規劃書 PDF 版 |
| [規劃書（pptx）](reference/NTI_Printing_官網規劃書.pptx) | 規劃書簡報版 |
| [sitemap 圖](reference/sbk/sitemap20260831.JPG) | 網站架構圖（2026-08-31 客戶版；0626／0818 舊版同在 `reference/sbk/`） |
| [參考網站清單](reference/sbk/世界大廠網站.txt) | 5 個國際包裝印刷大廠官網 |
| [Harness 總覽](docs/README.md) | 編排總則 + Claude Code 設定 + 技術選型 + 分項作業書索引（含變更紀錄規範） |
| [01 設計（含競品分析）](docs/01-design.md) | visual-design-architect：設計系統/RWD/原型 + 競品設計分析 |
| [02 前端](docs/02-frontend.md) | frontend-architect：Next.js SSR/ISR 公開站 |
| [03 後端／CMS](docs/03-backend.md) | backend-engineer：Azure Functions .NET10 + Dapper + CMS |
| [04 API](docs/04-api.md) | system-analyst + backend-engineer：API 契約 |
| [05 SEO](docs/05-seo.md) | system-analyst + qa：SEO 規範與稽核 |
| [06 GEO](docs/06-geo.md) | deep-research + system-analyst：生成式引擎優化 |
| [07 部署](docs/07-deployment.md) | backend-engineer（DevOps）：Azure 部署地圖 |
| [08 資料庫設計](docs/08-database.md) | system-analyst + backend-engineer：49 張表 DDL、多語策略、索引、種子、遷移 |
| [09 後台 CMS 功能](docs/09-cms-admin.md) | backend-engineer：24 個後台單元規格、上傳建議尺寸總表、權限矩陣 |
| [10 後端技術規範](docs/10-backend-design.md) | backend-engineer：**P4 的施工標準**——分層鐵律、`ApiResponse` 信封、錯誤碼、JWT/RBAC、EF+Dapper 雙軌、Coding Checklist（範本：`Jabez/Api`） |
| [資料庫建置腳本](db/README.md) | `db/`：參考實作與交付腳本 migrations／seed／verify（資料庫名 NTI）。**schema 權威為 EF Migration**，見 10 §8 |
| [網站建置時程（PDF）](reference/NTI_網站建置時程.pdf) | 建置時程 Gantt（2026/07–11，7 月啟動、11 月測試上線）、客戶確認控制點 |
| [網站建置時程（HTML）](reference/網站建置時程.html) | 時程表原始檔（可編輯，產 PDF 用） |
| [部署與環境區隔](reference/部署與環境區隔.md) | mockup 預覽部署（Cloudflare Pages）、與正式站的區隔策略、架構待決事項 |
| [官網資訊架構 IA](reference/官網資訊架構_IA.md) | 依客戶 sitemap 的完整節點→mockup 頁面對照、footer/浮動鈕、對齊異動紀錄 |
| [品牌簡報：首頁版型](reference/NTI_Brand_Deck_首頁版型.pptx) | 客戶 2026-09-01 版首頁內容順序與 What We Do／Why NTI／Proof 三區塊的文案與配色稿 |
| [現有網站盤點與內容遷移](reference/現有網站盤點與內容遷移.md) | 舊站 nti-printing.com 頁面/內容盤點、新舊頁面對應、缺漏頁面與待製內容、待決策點 |
| [前端專案說明](apps/web/README.md) | `apps/web/`：Next.js 公開站——結構、素材同步、版面一致性怎麼保證、`verify:markup` 驗收閘 |
| [後台專案說明](apps/admin/README.md) | `apps/admin/`：React + Vite 管理後台——24 個單元、權限矩陣、mock 資料來源、接 API 時要改哪裡 |

## 目錄結構

```
NTI/
├── CLAUDE.md          # 本檔：規範與索引
├── STATUS.md          # 進度總表：做到哪裡了（狀態的單一真相來源）
├── docs/              # harness 文件（攤平、無子資料夾）
│   ├── README.md      # Harness 總覽：編排總則 + Claude Code 設定 + 索引
│   └── 01~10.md       # 十份分項作業書（設計/前端/後端/API/SEO/GEO/部署/資料庫/CMS/後端規範）
├── db/                # 資料庫參考腳本與交付版（資料庫名 NTI）
│   ├── README.md      # 執行方式、Azure 相容性 checklist、已知缺口
│   ├── local/         # 只在本機執行：建庫／砍庫／dev 帳號
│   ├── migrations/    # 一次性、依序，由 SchemaVersion 記錄
│   ├── seed/          # run-always 冪等種子（角色／權限／分類／設定／頁面／方案）
│   ├── verify/        # 建置後自我檢核
│   └── tools/         # run-local.sh 一鍵建置
├── mockup/            # 靜態 HTML 原型（44 頁，客戶已定案的設計版本）— 切版的權威來源
│   └── assets/        # 圖片、site.css、img-size.js
├── pnpm-workspace.yaml # pnpm workspace：packages = apps/*
├── apps/
│   ├── web/           # Next.js 公開站（App Router），1:1 承接 mockup 全部 44 頁
│   │   ├── src/app/       # globals.css＝site.css 原檔；[locale]/ 下 44 個 page.tsx
│   │   ├── src/components/# Header/Footer/浮動鈕＋各頁行為（自 mockup inline script 移植）
│   │   ├── src/middleware.ts # 語系前綴導向 + /admin/* 的後台 SPA fallback
│   │   ├── scripts/       # sync-assets / build-pages（codegen）/ verify-markup（驗收閘）
│   │   ├── public/assets/ # 由 mockup/assets 同步而來，**不進版控**（70MB）
│   │   └── public/admin/  # 後台產物，由 apps/admin 的 vite build 直接寫入，**不進版控**
│   └── admin/         # 管理後台（React + Vite 純 SPA，靜態、noindex），掛在 /admin/
│       ├── src/units/     # docs/09 的 24 個單元宣告（欄位、清單欄、權限、上傳提示）
│       ├── src/api/       # client.ts＝唯一的資料存取層；種子自 db/seed 與 mockup 產生
│       └── src/pages/     # 通用清單／編輯 + 儀表板、設定、分類、角色、操作紀錄
├── reference/         # 規劃案原始文件（規劃書、時程、IA、簡報）— 約 2.5GB，**只進 NAS**
│   └── sbk/           # 客戶提供的原始素材（sitemap、CIS、需求書）
├── tools/
│   ├── sync-public.sh # master → public 同步（去除 reference/），推 GitHub 前執行
│   └── upload-assets.sh # mockup/assets → Azure Blob（stntiprod/assets）
├── .githooks/
│   └── pre-push       # 安全網：擋下含 reference/ 的 ref 推向 Remote_GitHub
└── .claude/           # Claude Code 本機設定
```

## 設計方向（摘要，詳見 [01-design.md §8 競品設計分析](docs/01-design.md#8-競品設計分析)）

- **配色**：白底＋深藏青/炭灰文字（產業標準），以**綠色點綴**呼應永續精神、與競品區隔。
- **Hero**：全幅影片 + 永續標語 + CTA，首屏即傳達「Print Green」。
- **綠色優勢**：用大數字＋圖示的數據統計區塊呈現碳效率／ESG。
- **認證夥伴**：FSC、ISO 等以整齊 logo 網格呈現。
- 重視 RWD、SEO（SSR/SSG）、無障礙、i18n 雙語。

## 技術選型（已凍結 2026-06-12，詳見 [docs/README.md](docs/README.md)）

| 項目 | 選定 |
|------|------|
| 公開網站（前端） | **Next.js（React）SSR + ISR** → Azure Static Web Apps |
| CMS 後台 | 自建管理後台，**純 SPA（靜態、不需 SEO）** |
| API／後端 | **Azure Functions .NET 10**（isolated、ASP.NET Core Integration），單一 `RouterFunction` + 集中式 `AppRouter` |
| 資料存取 | **EF Core（寫入 + Migration）+ Dapper（讀取）雙軌**（2026-09-02 修訂，原為 Dapper 單軌） |
| 資料庫 | **Azure SQL Database — Basic**（schema 權威＝EF Migration） |
| 檔案儲存 | **Azure Blob Storage**（`stntiprod`／容器 `assets`，westus2） |
| 3D 包裝客製 | **本期不納入**（Pacdora 廠商不提供技術崁入服務） |
| AI 客服 | **本期不納入**（Claude API/AI Agent 暫緩） |

## 工作慣例

- **後端開發**：一律先讀 [docs/10-backend-design.md](docs/10-backend-design.md)（分層鐵律、回應信封、錯誤碼、授權），再看 [docs/04-api.md](docs/04-api.md)（要寫哪些端點）。範本專案為 `/Users/tim/webapps/Jabez/Api`。
- **資料庫**：schema 設計在 [docs/08-database.md](docs/08-database.md)；**權威來源為 EF Core Migration**（`Api/Data/Migrations/`，表達方式對照見 10 §8.5）。[`db/`](db/README.md) 為參考實作與交付腳本，本機一鍵建置：`cp db/.env.local.example db/.env.local && db/tools/run-local.sh`；`db/verify/verify.sql` 保留為驗收閘。
- **檔案放置慣例**：`docs/` 僅放 **harness engineering 文件**；其他產出的 PDF／時程／規劃檔一律放 `reference/`，客戶提供的原始素材放 `reference/sbk/`。新增重要文件時，於上方「文件索引」補連結。
- **套件管理**：**pnpm workspace**（`pnpm-workspace.yaml`，packages = `apps/*`），repo 根 `pnpm install` 一次裝完。
  指令一律從根目錄下 `pnpm --filter web ...` / `pnpm --filter admin ...`。
  ⚠️ pnpm 的嚴格佈局擋 phantom dependency：腳本 import 什麼，就要在該 app 的 package.json 宣告什麼。
- **建置順序有相依**：**先 admin 後 web**。後台的 vite build 直接寫進 `apps/web/public/admin/`，
  `next build` 才會把它一起打包（同一個 SWA）：

  ```bash
  pnpm --filter admin build && pnpm --filter web build
  ```

  正式站要帶素材 base（否則圖片指向本機路徑）：

  ```bash
  NEXT_PUBLIC_MEDIA_BASE=https://stntiprod.blob.core.windows.net pnpm --filter web build
  ```

  web 的 build 會接著跑 `postbuild`（壓平 standalone + **SWA Free 250MB 閘**）。
  要用實際部署的產物起站驗證：`pnpm --filter web start:standalone`。
  SWA Free 的四條硬限制與三個隱形坑見 [docs/07 §7.1](docs/07-deployment.md)。

- **前端切版**：版面與 CSS **一律以 `mockup/` 為準**（客戶已確認），不做視覺重新詮釋。
  `apps/web/src/app/globals.css` 是 `mockup/assets/site.css` 的原檔複製，要改樣式請先改 mockup 再同步。
  頁面由 `apps/web/scripts/build-pages.mjs` 從 mockup 機械式產生；改動後務必跑驗收閘：
  `pnpm --filter web build && pnpm --filter web start`，另一終端 `pnpm --filter web verify:markup`
  （應輸出「全部 44 頁與 mockup 一致」）。
- **後台開發**：先讀 [docs/09-cms-admin.md](docs/09-cms-admin.md)（24 個單元、上傳尺寸總表、共用 UI 規則、權限矩陣）。
  權限矩陣的權威展開在 [`db/seed/110_role_permission.sql`](db/README.md)（171 列）；
  `apps/admin/src/lib/permissions.ts` 與它一對一，數字對不上時開發模式的 console 會直接報錯。
- 前端開發優先使用 `frontend-design` skill；改動後用 `run`／`verify` skill 驗證。
- **版控與雙 remote（重要）**：git 無法對不同 remote 過濾路徑，因此用**兩條分支**分流：

  | 分支 | 內容 | 推向 | 體積 |
  |------|------|------|------|
  | `master` | 完整 | `Remote_NAS`（`/Volumes/public/Repo/NTI`） | 2,527 MB / 111 檔 |
  | `public` | master 去掉下表排除項 | `Remote_GitHub`（`waiting0201/nti`，**public repo**） | 0.8 MB 全歷史 / 30 檔 |

  **`public` 分支的排除項**（`tools/sync-public.sh` 的 `EXCLUDE`）——
  ⚠️ 必須涵蓋**歷史上出現過的路徑**，不只是現在的路徑：

  | 路徑 | 說明 | 歷史物件量 |
  |---|---|---|
  | `reference/` | 設計 PSD 與客戶素材 | （現行名稱） |
  | `planning/` | `reference/` 的前身，2026-06 改名前的同一批檔案 | 2,479 MB |
  | `mockup/` | 靜態切版稿與圖片（今已 gitignore，舊 commit 仍帶著） | 66 MB |
  | `mockup2/` | 同上，未採用的版本 | 0.3 MB |
  | `.wrangler/` | Cloudflare 部署快取 | — |
  | `db/local/` | 只在本機執行的建庫腳本，含 dev 管理員帳號雜湊 | — |

  **真正的安全網是體積斷言，不是這張清單**：`sync-public.sh` 與 `.githooks/pre-push`
  都會檢查全歷史可達物件 ≤ 20MB（正常約 0.8MB）。路徑清單永遠可能漏掉某個只存在於
  舊 commit 的目錄 —— 這正是 `planning/` 一開始被漏掉的原因。

  > ⚠️ `waiting0201/nti` 是 **public repo**。新增檔案時先想清楚是否適合公開；
  > 客戶未上線的素材、任何憑證與個資一律放進排除項，或根本不要進版控。

  **日常流程**：一律 commit 在 `master` → `git push Remote_NAS` → `tools/sync-public.sh` → `git push Remote_GitHub`。
  兩個 remote 的預設 refspec 已設好，裸的 `git push <remote>` 就會推對的分支到對的地方。

  - `sync-public.sh` 用 plumbing 重建 tree，**不動工作目錄**（毫秒級，不會複製 2.5GB），
    保留每個 commit 的訊息／作者／日期並加註 `X-Source-Commit`；**append-only，永不需要 force push**。
  - `.githooks/pre-push` 會擋下任何含 `reference/` 的 ref 推向 `Remote_GitHub`
    （2.3GB 會撞上 GitHub 的 2GB 單次推送上限）。
  - **重新 clone 後必須執行 `git config core.hooksPath .githooks`**，否則安全網不生效。
  - 不要 commit 在 `public` 上 —— 它由腳本產生，手動提交會讓下次同步接不上。

## 聯絡資訊

專案聯絡窗口與客戶聯絡資料見 `reference/`（未進 GitHub 公開版）。
