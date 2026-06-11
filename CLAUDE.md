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
| [參考網站清單](planning/reference/website.txt) | 5 個國際包裝印刷大廠官網 |
| [參考網站分析](docs/reference-website-analysis.md) | 競品設計分析與對 NTI 的建議 |
| [Harness 設定說明](docs/harness.md) | Claude Code harness 設定、權限、skills、memory |
| [Harness Engineering（Agent 編排）](docs/harness-engineering.md) | 建置專案的 agent 角色編組、階段對應、編排模式 |
| [網站建置時程（PDF）](planning/NTI_網站建置時程.pdf) | 26 週建置時程 Gantt、Pacdora 整合、客戶治理機制 |
| [網站建置時程（HTML）](planning/網站建置時程.html) | 時程表原始檔（可編輯，產 PDF 用） |

## 目錄結構

```
NTI/
├── CLAUDE.md          # 本檔：規範與索引
├── docs/              # 文件（harness 說明、分析報告等）
├── planning/          # 規劃案原始文件（規劃書、sitemap、簡報）
│   └── reference/     # 參考素材
└── .claude/           # Claude Code 本機設定
```

## 設計方向（摘要，詳見[參考網站分析](docs/reference-website-analysis.md)）

- **配色**：白底＋深藏青/炭灰文字（產業標準），以**綠色點綴**呼應永續精神、與競品區隔。
- **Hero**：全幅影片 + 永續標語 + CTA，首屏即傳達「Print Green」。
- **綠色優勢**：用大數字＋圖示的數據統計區塊呈現碳效率／ESG。
- **認證夥伴**：FSC、ISO 等以整齊 logo 網格呈現。
- 重視 RWD、SEO（SSR/SSG）、無障礙、i18n 雙語。

## 技術建議（出自規劃書，待確認）

| 項目 | 建議 |
|------|------|
| 前端 | Next.js（React）或 Nuxt.js（Vue） |
| 後端 | Node.js/NestJS 或 PHP/Laravel |
| CMS | 自建管理後台 |
| 資料庫 | PostgreSQL 或 MySQL |
| 檔案儲存 | AWS S3 / GCP Cloud Storage |
| AI 客服 | 串接 Claude API 或 ChatGPT API |

## 工作慣例

- **檔案放置慣例**：`docs/` 僅放 **harness engineering 文件**；其他產出的 PDF／時程／規劃檔一律放 `planning/`。新增重要文件時，於上方「文件索引」補連結。
- 前端開發優先使用 `frontend-design` skill；改動後用 `run`／`verify` skill 驗證。
- 若要進版控，先 `git init`（目前非 git repo）。

## 聯絡資訊

- 電話：04-2436-6659｜Email：tim@weypro.com
- 地址：406 台中市北屯區東山路一段192巷56弄18號
