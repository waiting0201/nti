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
| **公開網站（前端）** | Next.js **SSR + ISR** | **Azure Static Web Apps** `stapp-nti-prod`（RG `NTIUS`／westus2／Free）<br>`gray-river-0a6ae341e.5.azurestaticapps.net` | push `main` → `.github/workflows/web.yml` | 公開可達，**上線前 robots 擋全站**（見 §7.3） |
| **CMS 後台（前端）** | 純 SPA（靜態） | **與公開站同一個 Static Web Apps**，掛在 `/admin/`（vite `build.outDir` 直接寫進 `apps/web/public/admin`） | CI 先 `pnpm --filter admin build` 再 `pnpm --filter web build` | 登入後台、**noindex**（`robots.txt` Disallow） |
| **API** | Azure Functions **.NET 10**（isolated、Consumption） | Azure Functions | CI/CD | 公開讀免認證、會員/後台需認證 |
| **資料庫** | **Azure SQL Database — Basic** | Azure（PaaS） | — | 受 Functions 存取 |
| **媒體/檔案** | Azure Blob Storage `stntiprod`（RG `NTIUS`／westus2） | Azure | `tools/upload-assets.sh` | 容器 `assets` 公開讀取；上傳走 AAD（Storage Blob Data Contributor），不用帳戶金鑰 |

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
| **產物撞 SWA Free 的 250MB 上限** | `output: 'standalone'` + `apps/web/scripts/check-size.mjs` 在本機 build 就擋下。素材轉 Blob 後 **135MB → 73MB**（設了 `NEXT_PUBLIC_MEDIA_BASE` 時 `pack-standalone.mjs` 不打包 `public/assets`） |
| ~~CI 建不出有圖的站~~（2026-09-02 解除） | 素材已轉 Blob，頁面引用的是絕對網址，`mockup/` 與 `public/assets` 都不再是建置的前提 —— 已實測移走 `public/assets` 後建置照樣成功。CI 只需設 `NEXT_PUBLIC_MEDIA_BASE` |
| mockup 與正式站互相觸發 | mockup＝Cloudflare direct upload 不監看 git；正式站＝Azure，兩條獨立 |
| 上線 SEO 斷鏈 | 301 對照表 + sitemap 提交列為上線 Gate |
| 金鑰外洩（SQL 連線字串） | Azure Key Vault / App settings、不進版控、`security-review` |
| 切換當機 | staging 演練 + 可回滾部署 + DNS 低 TTL |

### 7.3 上線前的 noindex 閘

SWA 的網址公開可達，而規劃上線是 2026-11。中間若被搜尋引擎收錄，換到正式網域後
會留下一批指向 `azurestaticapps.net` 的舊索引。

`apps/web/src/app/robots.ts` 因此**預設輸出 `Disallow: /`**，要開放收錄必須在該次
build 明確設 `NEXT_PUBLIC_ALLOW_INDEXING=1`。CI 從 repository variable
`ALLOW_INDEXING` 帶入 —— 目前未設（＝空字串＝擋全站）。

**上線當天要做的兩件事**：

1. `gh variable set ALLOW_INDEXING -R waiting0201/nti -b 1`
2. `gh variable set SITE_URL -R waiting0201/nti -b https://www.nti-printing.com`
   （canonical 與 hreflang 由它決定，見 `apps/web/src/lib/i18n.ts`）

然後重跑一次 workflow。**兩件都做完才算上線** —— 只開 indexing 而 SITE_URL 還指著
azurestaticapps.net 的話，canonical 會把權重導到臨時網址。

### 7.2 素材與 Blob Storage

mockup 的素材（126 檔、62MB）放在 `stntiprod` 的 `assets` 容器，公開讀取。
公開站與後台以環境變數指向它，**未設時一律回落到本機 `/assets/...`**，
所以本機開發與 `verify:markup` 的行為完全不變：

| App | 變數 | 未設時 |
|-----|------|--------|
| `apps/web` | `NEXT_PUBLIC_MEDIA_BASE` | `/assets/...`（由 `public/assets` 服務） |
| `apps/admin` | `VITE_MEDIA_BASE` | dev 走 `/admin/assets/`、build 走 `/assets/` |

值為 `https://stntiprod.blob.core.windows.net`（容器名就叫 `assets`，所以只補前綴、
路徑不改寫）。這是 build-time 內嵌，換 base 要重新 build。

素材更新後重新上傳：

```bash
AZ_STORAGE_ACCOUNT=stntiprod tools/upload-assets.sh
```

`Cache-Control` 只給 `max-age=86400`：檔名沒有內容雜湊（`logo.svg` 就叫 `logo.svg`），
設成 immutable 的話換圖後瀏覽器會抱著舊檔不放。

> `verify:markup` 讀同一個環境變數來正規化 mockup 端的路徑，所以兩種模式下
> 這個閘都成立 —— 已分別以「未設」與「指向 Blob」兩種模式驗過 44 頁一致。

### 7.4 API 與資料庫的資源建立（尚未執行）

程式碼與 CI 已就緒（[`.github/workflows/api.yml`](../.github/workflows/api.yml)），**Azure 資源尚未開設**。
下列指令會產生費用，執行前請先確認訂閱與預算。

```bash
RG=NTIUS; LOC=westus2; APP=func-nti-prod; SQLSRV=sql-nti-prod

# ── Azure SQL：collation 必須與本機一致，之後才比對得了 schema ──────────
az sql server create -g $RG -n $SQLSRV -l $LOC \
  --admin-user ntiadmin --admin-password '<強密碼>'
az sql db create -g $RG -s $SQLSRV -n NTI \
  --service-objective Basic --collation Latin1_General_100_CI_AS_SC

# Functions 的出口 IP 不固定，開放 Azure 服務存取（Basic 沒有 VNet 整合）
az sql server firewall-rule create -g $RG -s $SQLSRV -n AllowAzure \
  --start-ip-address 0.0.0.0 --end-ip-address 0.0.0.0

# ── Function App（.NET 10 isolated）─────────────────────────────────
az functionapp create -g $RG -n $APP -l $LOC \
  --storage-account stntiprod --consumption-plan-location $LOC \
  --runtime dotnet-isolated --runtime-version 10 --functions-version 4

# ── App settings（key 名稱與 local.settings.json 完全相同，雙底線慣例）──
az functionapp config appsettings set -g $RG -n $APP --settings \
  "ConnectionStrings__DefaultConnection=<Azure SQL 連線字串>" \
  "Jwt__Secret=<32 字以上亂數>" "Jwt__Issuer=nti-api" \
  "Jwt__AudienceAdmin=nti-admin" "Jwt__AudienceWeb=nti-web" \
  "Jwt__ExpiryMinutes=60" "Jwt__ExpiryMinutesWeb=120" \
  "BlobStorageConnection=<stntiprod 連線字串>" \
  "Smtp__Host=<...>" "Smtp__Port=587" "Smtp__User=<...>" \
  "Smtp__Password=<...>" "Smtp__From=<...>" \
  "Turnstile__SecretKey=<...>" \
  "PublishScheduleCron=0 */5 * * * *" \
  "RetentionCleanupCron=0 30 3 * * *" \
  "OrphanMediaCron=0 0 4 * * 0"

# ── CORS：兩個 origin，禁用 *（會員與後台端點帶憑證）──────────────────
az functionapp cors add -g $RG -n $APP \
  --allowed-origins https://gray-river-0a6ae341e.5.azurestaticapps.net
```

**第一位超級管理員**（docs/10 §7.4）：把 `BOOTSTRAP_SUPERADMIN=true` 與
`BOOTSTRAP_SUPERADMIN_EMAIL`／`_PASSWORD` 設上去，重啟一次 Function App，
**跑完立刻改回 false 並移除密碼設定**。它只在 `AdminUser` 表為空時動作。

**OIDC 聯合身分**（`api.yml` 用它登入，不用 publish profile）：

```bash
az ad app create --display-name nti-github-oidc          # 取得 appId
az ad sp create --id <appId>
az role assignment create --assignee <appId> --role Contributor \
  --scope /subscriptions/<subId>/resourceGroups/$RG
az ad app federated-credential create --id <appId> --parameters '{
  "name":"nti-main",
  "issuer":"https://token.actions.githubusercontent.com",
  "subject":"repo:waiting0201/nti:ref:refs/heads/main",
  "audiences":["api://AzureADTokenExchange"]
}'
```

GitHub 端要設定：

| 類型 | 名稱 | 值 |
|---|---|---|
| secret | `AZURE_CLIENT_ID` | 上面的 appId |
| secret | `AZURE_TENANT_ID` | 租用戶 Id |
| secret | `AZURE_SUBSCRIPTION_ID` | 訂閱 Id |
| variable | `FUNCTION_APP_NAME` | `func-nti-prod` |

部署後跑一次 schema 驗收閘（docs/10 §11）：

```bash
sqlcmd -S $SQLSRV.database.windows.net -d NTI -U ntiadmin -P '<密碼>' \
  -I -b -i db/verify/verify-ef.sql        # 應輸出「verify-ef 全數 PASS。」
```

> ⚠ **前端還沒有指向 API 的設定**。`apps/web` 與 `apps/admin` 目前都不打 API
> （前者內容寫死、後者接本機 mock），資源開好之後還要補 `NEXT_PUBLIC_API_BASE`
> 之類的變數並改前端資料來源，才算真的接上。

---

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
| 2026-09-02 | Tim（Claude Code） | **素材轉 Azure Blob Storage**：建立 RG `NTIUS`／帳戶 `stntiprod`／容器 `assets`（westus2，公開讀取），上傳 126 檔 62MB。頁面素材改走 `mediaUrl()`（`NEXT_PUBLIC_MEDIA_BASE`），standalone 產物 135MB → 73MB。**CI 建置不再依賴 `mockup/`**，前一列的風險解除 |
| 2026-09-02 | Tim（Claude Code） | **接上 SWA 自動部署**：建立 `stapp-nti-prod`（NTIUS／westus2／Free）與 `.github/workflows/web.yml`（push `main` 觸發，hoisted 安裝、先 admin 後 web、`skip_app_build`、concurrency group）。新增 §7.3：上線前 robots 預設擋全站，上線需設 `ALLOW_INDEXING` 與 `SITE_URL` 兩個 variable |
| 2026-09-04 | Tim（Claude Code） | 新增 §7.4：API 與資料庫的資源建立指令、OIDC 聯合身分設定、GitHub secrets／variables 清單、部署後的 schema 驗收閘。CI 為 `.github/workflows/api.yml`（觸發於 `Api/**`，含 health 冒煙測試與「產物不得含 local.settings.json」的斷言）。資源本身尚未開設 |

*最後更新：2026-09-04*

