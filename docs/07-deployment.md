# 07 · 部署 Deployment — Harness 作業書

| 欄位 | 內容 |
|------|------|
| **主責 Agent** | `backend-engineer`（兼 DevOps 角色） |
| **協作 Agent** | `system-analyst`（架構選型）、`frontend-architect`（前端 build/host）、`qa-test-engineer`（上線前稽核） |
| **搭配 Skills** | `run`、`verify`、`security-review` |
| **對應階段** | 全程（環境區隔）／P11（上線移交）／P12（維運） |
| **核心定位** | **「程式碼可同資料夾，但部署一定分開」**。mockup 與正式站環境互不干擾。 |

---

## 1. 上游輸入

| 來源 | 用途 |
|------|------|
| [`planning/部署與環境區隔.md`](../planning/部署與環境區隔.md) | 現況 mockup 部署 + 正式站區隔策略 + 架構待決事項（**權威**） |
| [`05-seo.md`](05-seo.md) | 上線 301/sitemap/GSC 交付 |
| [`02-frontend.md`](02-frontend.md)、[`03-backend.md`](03-backend.md) | 前後端 host 需求 |

---

## 2. 環境地圖

| 環境 | 內容 | 託管 | 觸發 | 存取 |
|------|------|------|------|------|
| **Mockup 預覽（現況）** | `mockup/` 靜態 mockup（完整站雛形）— **客戶採用版** | Cloudflare Pages 專案 `nti-mockup`（direct upload，**不連 git**） | 手動 `wrangler pages deploy` | 公開、免密碼，**設計定案後下線** |
| ~~**Mockup2 預覽**~~（未採用） | `mockup2/` 靜態切版稿（`.dc.html` + `support.js`） | Cloudflare Pages 專案 `nti-mockup2`（direct upload，**不連 git**） | 已停止更新 | 公開、免密碼，**可即刻下線** |
| **公開網站（前端）** | Next.js **SSR + ISR** | **Azure Static Web Apps**（Free 起，SSR 撞限制退 Container Apps） | push / CI 自動 build | 公開、需 SEO |
| **CMS 後台（前端）** | 純 SPA（靜態） | Azure Static Web Apps（另一專案）/ Blob 靜態 | push / CI | 登入後台、**noindex** |
| **API** | Azure Functions **.NET 10**（isolated、Consumption） | Azure Functions | CI/CD | 公開讀免認證、會員/後台需認證 |
| **資料庫** | **Azure SQL Database — Basic** | Azure（PaaS） | — | 受 Functions 存取 |
| **媒體/檔案** | Azure Blob Storage | Azure | — | 預簽章 URL |

> Mockup 預覽更新指令（`--branch=main` 必加，否則會被歸到 Preview 環境而非 production）：
> ```bash
> npx wrangler pages deploy mockup --project-name=nti-mockup --branch=main --commit-dirty=true
> ```
>
> Mockup2 預覽更新指令（網址 https://nti-mockup2.pages.dev 不變）：
> ```bash
> npx wrangler pages deploy mockup2 --project-name=nti-mockup2 --branch=main --commit-dirty=true
> ```
> 根網址由 `mockup2/_redirects` 302 導向 `index.dc.html`。
>
> 2026-07-15：`nti-mockup` 專案重建，改載 `mockup/` 完整站雛形（原 v1 切版稿內容汰除）；`nti-mockup2` 維持 `mockup2/` 切版稿不動。
>
> **2026-08-31：客戶選定 `mockup/`（https://nti-mockup.pages.dev）為設計版本。** `mockup2/` 未採用，停止維護，`nti-mockup2` 專案可下線；後續改稿與正式站切版一律以 `mockup/` 為基準。

---

## 3. 架構選型（已定案 2026-06-12）

全棧定為 **Azure**：公開站 Next.js(SSR/ISR) → **Static Web Apps**；CMS 後台純 SPA → 靜態；API → **Azure Functions .NET 10**；DB → **Azure SQL Database Basic**；媒體 → **Blob Storage**。**AI 客服本期不納入**；**3D 客製（Pacdora）本期不納入**。

- 月費約 **$7–18（East Asia）**，成本地板為 SQL Basic（~$5）。
- **唯一待驗證**：公開站 SSR 在 **SWA Free 額度**是否夠；不夠則退 **Azure Container Apps**（scale-to-zero）或 App Service B1。上線前以實際流量驗一次。
- **mockup 不受影響**：`nti-mockup`（Cloudflare direct upload）維持原樣，與正式站兩條獨立部署。

---

## 4. 工作分解

1. **環境區隔**（全程）：mockup（Cloudflare direct upload）與正式站（Azure）兩條獨立部署互不觸發；`.gitignore` 排除 `web/node_modules`、`web/.next`。
2. ~~架構選型~~：已定案（§3）。
3. **CI/CD**：公開站/CMS push 自動 build（SWA）；Functions pipeline（build/test/deploy）；環境變數與金鑰（含 SQL 連線字串）走 **Azure Key Vault / SWA 與 Functions 的 App settings**，**不進版控**。
4. **環境分層**：dev / staging（客戶 UAT）/ production；staging 供 P10 UAT。
5. **上線（P11）**：DNS 切換、HTTPS 憑證、部署 **301 轉址**、提交 `sitemap.xml` 至 GSC、開啟監控/錯誤追蹤/備份。
6. **維運（P12）**：備份還原演練、日誌/告警、依缺失指派修補。

---

## 5. DoD（上線前）

- [ ] 三層環境（dev/staging/prod）就緒，staging 通過客戶 UAT。
- [ ] HTTPS、CDN、HTTP/2+ 啟用。
- [ ] **301 轉址對照表**部署且驗證無鏈/迴圈（與 05-seo）。
- [ ] `sitemap.xml` 提交 GSC，索引監控就緒。
- [ ] 金鑰/環境變數走 secret 管理，無硬編碼、無進版控（`security-review` 通過）。
- [ ] 資料庫備份策略與還原演練完成。
- [ ] 監控/告警/錯誤追蹤上線。
- [ ] mockup 與正式站部署互不觸發，已驗證。
- [ ] 上線後 mockup（`nti-mockup`）依約**下線淘汰**（Cloudflare dashboard 刪專案；設計稿留 git 歷史）。

---

## 6. 與其他 Agent 的介面

- ← `system-analyst`：架構選型決策。
- ← `frontend-architect` / `backend-engineer`：build 產物與執行需求。
- ← `05-seo.md`：301/sitemap/GSC 交付。
- → `qa-test-engineer`：staging 環境供上線前全項稽核。

---

## 7. 風險與對策

| 風險 | 對策 |
|------|------|
| 公開站 SSR 撞 SWA Free 額度 | 上線前以實際流量驗證；不夠退 Container Apps（scale-to-zero）或 App Service B1 |
| mockup 與正式站互相觸發 | mockup＝Cloudflare direct upload 不監看 git；正式站＝Azure，兩條獨立 |
| 上線 SEO 斷鏈 | 301 對照表 + sitemap 提交列為上線 Gate |
| 金鑰外洩（SQL 連線字串） | Azure Key Vault / App settings、不進版控、`security-review` |
| 切換當機 | staging 演練 + 可回滾部署 + DNS 低 TTL |

---

## 變更紀錄

| 日期 | 修改者 | 摘要 |
|------|--------|------|
| 2026-06-12 | Tim（Claude Code） | 初版：定義部署領域 harness 作業書（彙整既有部署與環境區隔策略） |
| 2026-06-12 | Tim（Claude Code） | 架構定案 Azure（SWA + Functions .NET10 + SQL Basic + Blob）；移除 Cloudflare/Vercel/Claude；新增 Pacdora SaaS 依賴與風險 |
| 2026-06-16 | Tim（Claude Code） | Pacdora／3D 包裝客製本期不納入（廠商不提供技術崁入服務）；移除 Pacdora SaaS 依賴、成本加項、相關金鑰與風險 |
| 2026-08-31 | Tim（Claude Code） | **設計版本定案：客戶選定 `mockup/`**；`mockup2/` 未採用並停止維護，`nti-mockup2` 標為可下線 |

*最後更新：2026-08-31*
