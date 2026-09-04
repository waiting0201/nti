# 專案進度總表

> **這份文件是「做到哪裡了」的單一真相來源。** 每完成一項就更新對應那格。
>
> 分工：本檔記錄**狀態**；[`docs/`](docs/README.md) 的十份作業書記錄各領域的**規格與施工標準**；
> [`CLAUDE.md`](CLAUDE.md) 記錄**專案規範與索引**。三份不要互相抄，各司其職。

**最後更新**：2026-09-04

---

## 一句話現況

**前端切版、後台介面、部署管線三條線已完成並在 Azure 上運作**——
公開站 44 頁與後台 24 單元同站部署於 `stapp-nti-prod`，素材走 Blob，
push 到 GitHub 即自動部署。後台目前接的是本機 mock，所有內容都是從 mockup 與 `db/seed`
產生的種子資料——**資料庫與業務端點都還沒做**。

**P4 後端的端點已全部完成**：3.1 前台唯讀、3.2 表單、3.3 會員、3.4 後台 24 單元
皆實作並本機實測通過（權限矩陣三個角色逐項驗過）。剩下三支 Timer Function 與 CI/CD。

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
| P4 | 後端／CMS API | 🟡 | 端點全數完成（見 §五）；剩 Timer Function 與 CI/CD |
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

- **EF Core Migration（schema 權威來源）已建立**（2026-09-04）：
  48 個 Entity + Configuration、`Api/Data/Migrations/InitialSchema`（schema + 種子）。
  `db/` 自此為參考實作與交付腳本。
  - 種子由 `Api/Data/Seed/SeedData.cs` 的 `HasData` 寫入，Id 硬編、跨環境一致：
    角色 3／權限 171／分類 44(+88)／設定 15／固定頁 29(+58)／方案 4(+8)
  - 驗收閘 [`db/verify/verify-ef.sql`](db/README.md)：結構 11 項 + 種子 16 項，本機**全數 PASS**
  - 與 `db/migrations/` 建出來的庫逐欄逐約束比對，差異只有 `SchemaVersion` ↔
    `__EFMigrationsHistory` 與四個 DEFAULT 約束的名稱縮寫（以 EF 為準）

### ⬜ 未做

- Azure SQL Database 實例尚未開設
- 本機 `NTI` 庫目前仍是 `db/` 腳本建的版本；要切成 EF 版需先砍庫重建
  （`db/local/900_drop_database.sql` → `dotnet ef database update`）

---

## 五、API（骨架完成，業務端點未開工）

`Api/`（namespace `Nti.Api`）已建立，施工標準見 [`docs/10-backend-design.md`](docs/10-backend-design.md)，
契約見 [`docs/04-api.md`](docs/04-api.md)。專案說明：[`Api/README.md`](Api/README.md)。

### ✅ 骨架（2026-09-04）

- **執行模型**：Functions v4 isolated + ASP.NET Core Integration（`ConfigureFunctionsWebApplication`），
  `routePrefix = api/v1`，單一 `RouterFunction` catch-all
- **統一信封** `ApiResponse<T>`（含 `code`）＋ **錯誤碼 18 個**（`ErrorCodes`）＋ `PagedResult<T>`
  ＋ `Paging`（`pageSize` 強制 `Clamp(1,100)`）
- **`ExceptionMiddleware`**：`AppException` → 對應 status + code；`ReadFormAsync` 的 Content-Type
  例外單獨接住；其餘一律 500 `INTERNAL`，堆疊不外洩
- **JWT 雙 audience**（`nti-admin`／`nti-web`），互打對方路由一律 401
- **集中式 `AppRouter`**（三個 partial）＋ **授權預設拒絕**：未登記於權限表的 `/admin/*` 直接 403
- **`Common/` 常數**：權限碼 83 個（＝ `db/seed/110` 的 SuperAdmin 授權範圍）、CategoryType 9、
  PageKey 29、角色 3、報價／聯絡狀態、`Clock`（Asia/Taipei）、`LangResolver`
- **`AppDbContext`**：稽核五欄統一填寫、`Remove()` 自動改寫為軟刪
- **`GET /health`** 本機實測通過（`func start` + `dotnet build` 0 warning／0 error）

### ✅ 資料層（2026-09-04）

48 張表的 Entity、Configuration 與 Migration，詳見 §四。三個踩到的坑已寫成程式碼註解：

| 坑 | 後果 | 處置 |
|---|---|---|
| `Clock.Now`（台北）vs DDL 的 `SYSUTCDATETIME()`（UTC） | 同一欄兩種時區，上下架時間窗差 8 小時 | 持久化一律 `Clock.UtcNow`；docs/10 §9.1 已更正 |
| 預設值為 `true` 的 bool 欄位存不進 `false` | 「暫不上架」被靜默上架、預留的 `green-csr` 從 noindex 變成可索引 | 掃全模型設 `ValueGenerated.Never` |
| EF 自動幫每條外鍵建索引 | Basic 5 DTU 多出 35 個沒用的索引 | 移除 `ForeignKeyIndexConvention`，只留明列的 20 條 |

本機實測（port 7072）：

| 情境 | 結果 |
|---|---|
| `GET /api/v1/health` | 200，信封正確、camelCase、時間為台北時區 |
| 無憑證打 `/admin/*` | 401 `AUTH_TOKEN_INVALID` |
| 後台 token 打未登記的 `/admin/news` | 403 `FORBIDDEN`（預設拒絕生效） |
| 會員 token 打 `/admin/*` | 401（audience 分離生效） |
| 不存在的路由 | 404 `NOT_FOUND` |

### ✅ 3.1 前台內容端點（2026-09-04）

20 支端點全部實作並實機打過（`func start` + curl），皆回 200 且信封正確：

`/content/home`（首頁五組資料一次給）、`/solutions`、`/solutions/{slug}`、`/projects`、
`/facility?group=`、`/certifications`、`/clients`、`/categories?type=`、`/news`、`/news/{slug}`、
`/green-vlog`、`/faq`、`/industry-trends`、`/careers`、`/supplier/notices`、`/supplier/specs`、
`/supplier/downloads`、`POST /supplier/downloads/{id}/hit`、`/pages/{pageKey}`、`/site-settings`

實測驗到的行為：

| 驗證項 | 結果 |
|---|---|
| 缺語系不 fallback | 只有英文的消息不出現在 `/zh` 清單，詳細頁 404 |
| 上下架時間窗 | `PublishAt` 在未來的消息不出現，直接打 slug 也 404 |
| 語系解析 | `?lang=` 優先，其次 `Accept-Language`（`zh-Hant-TW` 可解），皆無則 `zh` |
| hreflang | 由同一 Id 的兩筆 i18n 推導，回傳 `{en, zh}` slug 對照 |
| 分頁雙模式 | 帶 `page`／`pageSize` 回 `PagedResult`，不帶回平面陣列 |
| 值域驗證 | `?type=Bogus` 回 400 `VALIDATION_FORMAT`（不是靜默的空陣列） |
| 快取標頭 | 內容 `s-maxage=300`、設定與分類 `3600`、寫入端點 `no-store` |
| 內部設定不外洩 | `/site-settings` 濾掉 `Mail` 群組（15 → 12 筆） |
| 受控文件 | `RequireLogin = 1` 的下載未帶會員憑證回 401 |

本機假內容 fixture：`db/local/920_dev_content.sql`（各單元一筆 + 三個邊界案例）。

### ✅ 3.2 表單／3.3 會員／3.4 後台（2026-09-04）

| 群組 | 端點數 | 狀態 |
|---|---|---|
| 3.1 前台內容（公開唯讀） | 20 | ✅ |
| 3.2 表單（公開寫入） | 2 | ✅ 含 Turnstile、rate limit、附件上傳與 magic bytes 驗證 |
| 3.3 會員（認證） | 9 | ✅ 註冊／登入／忘記密碼／重設／`/me`／報價與訂單紀錄 |
| 3.4 後台管理（RBAC） | 24 單元 + 動作端點 | ✅ 含 dashboard、上傳、匯出入、稽核 |
| 後台認證（契約原本沒有） | 2 | ✅ `/auth/admin/login`、`/auth/admin/change-password` |

支援服務：`PasswordHasher`（BCrypt）、`BlobStorageService`、`EmailService`（+EmailLog）、
`TurnstileService`、`RateLimitService`、`AuditService`、`QuoteNumberGenerator`、
`SuperAdminBootstrapper`（第一位超管由部署流程建立）。

實測結果（`func start` + Azurite，51 項自動化斷言 + 逐項手驗）：

| 驗證項 | 結果 |
|---|---|
| 權限矩陣 | SuperAdmin 83／Editor 67／Viewer 21 逐項驗過：Viewer 可讀不可寫、Editor 沒有 `quote.export`／`admin.*`／`audit.*` |
| 預設拒絕 | 未登記的 `/admin/*` 回 403（不是靜默放行） |
| audience 分離 | 會員 token 打 `/admin/*` 401，後台 token 打 `/me` 401 |
| 上架前兩語系檢查 | 只有中文就上架回 409 `CONFLICT_STATE`，補上英文後成功 |
| 帳號列舉防護 | 帳號不存在與密碼錯誤回同一個 `AUTH_INVALID_CREDENTIALS`；忘記密碼一律回成功 |
| 首登強制改密碼 | 改完 `mustChangePassword=false`，舊密碼失效 |
| magic bytes | 副檔名改成 `.png` 的文字檔被擋（400 `UPLOAD_TYPE`） |
| 附件授權 | `ScanStatus=Pending` 拒絕下載（403），改 `Clean` 後下載且內容位元一致 |
| rate limit | 公開表單第 10 次起回 429 `RATE_LIMITED` |
| 寄信失敗不影響提交 | SMTP 未設定 → EmailLog 記 `Failed`，但表單仍回 200 |
| AuditLog | 後台寫入全數留痕，另含匯出 CSV 與附件下載兩個唯讀動作 |

### ⬜ 其他未做

- 三支 Timer Function（`PublishSchedule`／`RetentionCleanup`／`OrphanMedia`）
- Azure Function App 資源與 CI/CD（OIDC 登入）
- **refresh token rotation**（docs/10 §7.3）：schema 無對應資料表，且 04 §3.3 的端點清單
  未列 `/auth/refresh`。目前只發 access token（後台 60 分鐘、會員 120 分鐘）
- 附件病毒掃描：`ScanStatus` 目前寫入後恆為 `Pending`，未接掃描服務（未掃過的一律拒絕下載）
- OpenAPI 文件（docs/10 §13 的待決項）

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
| Azure SQL 開設 | 資源尚未開設（schema、種子與 API 都已就緒） | 後台無法脫離 mock |
| 正式網域 | 客戶端 DNS | 上線 checklist 卡住 |

---

## 九、怎麼維護這份文件

- **每完成一項就改對應那格**，不要累積到最後補。
- 狀態改變時同步更新「一句話現況」與「最後更新」日期。
- 決策異動（不只是進度）要同時寫進對應 `docs/` 作業書的**變更紀錄**表——
  本檔只記狀態，不記決策理由。
- 踩到不會出現在錯誤訊息裡的坑時，**先寫成程式碼註解**，再在 §六摘要一行。
