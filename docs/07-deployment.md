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
| [`reference/部署與環境區隔.md`](../reference/部署與環境區隔.md) | 現況 mockup 部署 + 正式站區隔策略 + 架構待決事項（**權威**） |
| [`05-seo.md`](05-seo.md) | 上線 301/sitemap/GSC 交付 |
| [`02-frontend.md`](02-frontend.md)、[`03-backend.md`](03-backend.md) | 前後端 host 需求 |

---

## 2. 環境地圖

| 環境 | 內容 | 託管 | 觸發 | 存取 |
|------|------|------|------|------|
| **Mockup 預覽（現況）** | `mockup/` 靜態 mockup（完整站雛形）— **客戶採用版** | Cloudflare Pages 專案 `nti-mockup`（direct upload，**不連 git**） | 手動 `wrangler pages deploy` | 公開、免密碼，**設計定案後下線** |
| ~~**Mockup2 預覽**~~（未採用） | `mockup2/` 靜態切版稿（`.dc.html` + `support.js`） | Cloudflare Pages 專案 `nti-mockup2`（direct upload，**不連 git**） | 已停止更新 | 公開、免密碼，**可即刻下線** |
| **公開網站（前端）** | Next.js **SSR + ISR** | **Azure Static Web Apps**（Free 起，SSR 撞限制退 Container Apps） | push / CI 自動 build | 公開、需 SEO |
| **CMS 後台（前端）** | 純 SPA（靜態） | **與公開站同一個 Static Web Apps**，掛在 `/admin/`（vite `build.outDir` 直接寫進 `apps/web/public/admin`） | CI 先 `pnpm --filter admin build` 再 `pnpm --filter web build` | 登入後台、**noindex**（`robots.txt` Disallow） |
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
| **產物撞 SWA Free 的 250MB 上限** | `output: 'standalone'` + `apps/web/scripts/check-size.mjs` 在本機 build 就擋下（目前 135MB）。最大宗是 `public/assets` 63MB，正式站圖片轉 Blob 後會大幅下降 |
| **CI 建不出有圖的站** | `mockup/` 未進版控（0 追蹤檔），而 `public/assets` 由它同步而來 —— GitHub Actions checkout 後沒有素材，建出來的站會缺圖而 build 成功。**在圖片轉 Blob 之前，部署只能從有 mockup 的機器手動執行**，不要先寫 workflow |
| mockup 與正式站互相觸發 | mockup＝Cloudflare direct upload 不監看 git；正式站＝Azure，兩條獨立 |
| 上線 SEO 斷鏈 | 301 對照表 + sitemap 提交列為上線 Gate |
| 金鑰外洩（SQL 連線字串） | Azure Key Vault / App settings、不進版控、`security-review` |
| 切換當機 | staging 演練 + 可回滾部署 + DNS 低 TTL |

### 7.1 SWA Free 的四條硬限制

| 限制 | 對策 | 寫在哪 |
|------|------|--------|
| 單一環境 **250MB** | `output: 'standalone'` + postbuild 壓平 + `check-size.mjs` 擋門 | `apps/web/next.config.ts`、`scripts/` |
| 全部環境合計 **500MB** | 實務上只夠 prod + 1 個預覽環境；逼近時預覽環境先失敗 | — |
| 頻寬 **100GB/月**（超額不能加購，直接中斷） | `images.unoptimized`：不走 SWA managed backend 的圖片優化 | `next.config.ts` |
| hybrid 站**忽略 `staticwebapp.config.json` 的路由設定** | 路由一律寫在 `next.config.ts` / `middleware.ts` | `apps/web/src/middleware.ts` |

另有三個不會出現在錯誤訊息裡的坑，都已寫成程式碼註解：

1. **`outputFileTracingRoot` 不可釘在 app 上。** 產物會從 135MB 掉到個位數看似優化，
   其實 pnpm 的相依落在 tracing 範圍外，只留下指向外部的符號連結，SWA 打包時以
   `Could not find file .../node_modules/react` 失敗。
2. **CI 必須 `NPM_CONFIG_NODE_LINKER=hoisted` 安裝。** SWA 的打包器不跟隨符號連結，
   而 pnpm 預設的 `node_modules` 幾乎全是連結。本機保留 pnpm 嚴格佈局（擋 phantom
   dependency），只在 CI 改 hoisted。
3. **middleware matcher 必須排除 `.swa`。** SWA 以 `/.swa/health.html` 驗證站台起得來，
   被 middleware 導向就判定部署失敗，而錯誤訊息不會指向 middleware。

---

## 變更紀錄

| 日期 | 修改者 | 摘要 |
|------|--------|------|
| 2026-06-12 | Tim（Claude Code） | 初版：定義部署領域 harness 作業書（彙整既有部署與環境區隔策略） |
| 2026-06-12 | Tim（Claude Code） | 架構定案 Azure（SWA + Functions .NET10 + SQL Basic + Blob）；移除 Cloudflare/Vercel/Claude；新增 Pacdora SaaS 依賴與風險 |
| 2026-06-16 | Tim（Claude Code） | Pacdora／3D 包裝客製本期不納入（廠商不提供技術崁入服務）；移除 Pacdora SaaS 依賴、成本加項、相關金鑰與風險 |
| 2026-08-31 | Tim（Claude Code） | **設計版本定案：客戶選定 `mockup/`**；`mockup2/` 未採用並停止維護，`nti-mockup2` 標為可下線 |
| 2026-09-02 | Tim（Claude Code） | **後台改與公開站同站部署**：`admin/` 產物合流進 `web/public/admin`，掛 `/admin/`，只需一個 SWA。SPA fallback 寫在 `web/src/middleware.ts`（不能用 `staticwebapp.config.json`——SWA 對 Next.js hybrid 忽略其路由設定；也不能用 `next.config.ts` 的 fallback rewrite——會被 `/[locale]/*` 動態路由先接走）。後台不再自帶素材，共用前台 `/assets/` |
| 2026-09-02 | Tim（Claude Code） | **改為 pnpm workspace + `apps/{web,admin}`**（比照 EuniceMed）：後台 vite `build.outDir` 直接寫進 `apps/web/public/admin`，省掉複製步驟；middleware matcher 改用副檔名排除，並補上 **`.swa` 排除**（SWA 以 `/.swa/health.html` 驗證部署，被導向會判定部署失敗） |
| 2026-09-02 | Tim（Claude Code） | 新增 §7.1 SWA Free 硬限制對策：`output: 'standalone'` + `pack-standalone.mjs`（壓平 workspace 巢狀）+ `check-size.mjs`（250MB 閘，目前 135MB）；記錄 `outputFileTracingRoot` 與 hoisted linker 兩個坑。**新增風險：`mockup/` 未進版控導致 CI 建不出有圖的站，圖片轉 Blob 前不寫 workflow** |

*最後更新：2026-09-02*
