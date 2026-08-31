# CLAUDE.md — NTI Printing 官網專案

本檔為專案規範與索引，供 Claude Code 與協作者每次進場時快速掌握全貌。

## 專案概述

NTI Printing 官方網站建置案。NTI 為包裝印刷廠，品牌精神為
**"The Courage to Print Green — 永續 All In!"**，永續／綠色印刷為核心訴求。

- 品牌標語（PES）：PROFESSIONALS | EFFECTIVENESS | SERVICE
- 需求：中／英雙語官網 + 自建 CMS 後台 + 會員系統 + 報價／聯絡表單 + AI 客服
- 目前狀態：**規劃階段**（尚未開始開發；非 git repo）

## 文件索引

| 文件 | 說明 |
|------|------|
| [規劃書（md）](planning/NTI_Printing_官網規劃書.md) | 完整官網規劃：前端頁面、後端功能、sitemap、技術建議 |
| [規劃書（pdf）](planning/NTI_Printing_官網規劃書.pdf) | 規劃書 PDF 版 |
| [規劃書（pptx）](planning/NTI_Printing_官網規劃書.pptx) | 規劃書簡報版 |
| [sitemap 圖](planning/sitemap.JPG) | 網站架構圖 |
| [參考網站清單](planning/reference/世界大廠網站.txt) | 5 個國際包裝印刷大廠官網 |
| [Harness 總覽](docs/README.md) | 編排總則 + Claude Code 設定 + 技術選型 + 分項作業書索引（含變更紀錄規範） |
| [01 設計（含競品分析）](docs/01-design.md) | visual-design-architect：設計系統/RWD/原型 + 競品設計分析 |
| [02 前端](docs/02-frontend.md) | frontend-architect：Next.js SSR/ISR 公開站 |
| [03 後端／CMS](docs/03-backend.md) | backend-engineer：Azure Functions .NET10 + Dapper + CMS |
| [04 API](docs/04-api.md) | system-analyst + backend-engineer：API 契約 |
| [05 SEO](docs/05-seo.md) | system-analyst + qa：SEO 規範與稽核 |
| [06 GEO](docs/06-geo.md) | deep-research + system-analyst：生成式引擎優化 |
| [07 部署](docs/07-deployment.md) | backend-engineer（DevOps）：Azure 部署地圖 |
| [網站建置時程（PDF）](planning/NTI_網站建置時程.pdf) | 建置時程 Gantt（2026/07–11，7 月啟動、11 月測試上線）、客戶確認控制點 |
| [網站建置時程（HTML）](planning/網站建置時程.html) | 時程表原始檔（可編輯，產 PDF 用） |
| [部署與環境區隔](planning/部署與環境區隔.md) | mockup 預覽部署（Cloudflare Pages）、與正式站的區隔策略、架構待決事項 |
| [官網資訊架構 IA](reference/官網資訊架構_IA.md) | 依客戶 sitemap 的完整節點→mockup 頁面對照、footer/浮動鈕、對齊異動紀錄 |
| [現有網站盤點與內容遷移](planning/現有網站盤點與內容遷移.md) | 舊站 nti-printing.com 頁面/內容盤點、新舊頁面對應、缺漏頁面與待製內容、待決策點 |

## 目錄結構

```
NTI/
├── CLAUDE.md          # 本檔：規範與索引
├── docs/              # harness 文件（攤平、無子資料夾）
│   ├── README.md      # Harness 總覽：編排總則 + Claude Code 設定 + 索引
│   └── 01~07.md       # 七份分項作業書（設計/前端/後端/API/SEO/GEO/部署）
├── planning/          # 規劃案原始文件（規劃書、sitemap、簡報）
│   └── reference/     # 參考素材
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
| API／後端 | **Azure Functions .NET 10**（isolated）+ **Dapper** |
| 資料庫 | **Azure SQL Database — Basic** |
| 檔案儲存 | **Azure Blob Storage** |
| 3D 包裝客製 | **本期不納入**（Pacdora 廠商不提供技術崁入服務） |
| AI 客服 | **本期不納入**（Claude API/AI Agent 暫緩） |

## 工作慣例

- **檔案放置慣例**：`docs/` 僅放 **harness engineering 文件**；其他產出的 PDF／時程／規劃檔一律放 `planning/`。新增重要文件時，於上方「文件索引」補連結。
- 前端開發優先使用 `frontend-design` skill；改動後用 `run`／`verify` skill 驗證。
- 若要進版控，先 `git init`（目前非 git repo）。

## 聯絡資訊

- 電話：04-2436-6659｜Email：tim@weypro.com
- 地址：406 台中市北屯區東山路一段192巷56弄18號
