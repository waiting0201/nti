# 04 · API — Harness 作業書

| 欄位 | 內容 |
|------|------|
| **主責 Agent** | `system-analyst`（API 契約 / ER Model 定義） |
| **共責 Agent** | `backend-engineer`（實作）、`frontend-architect`（消費端） |
| **搭配 Skills** | `run`、`verify`、`code-review` |
| **對應階段** | P1（API 結構/ER Model 藍圖）／P4（實作）／持續維護 |
| **核心定位** | API 契約是**前後端平行 fan-out 的唯一介面**。契約先行、雙方並行、契約變更雙向同步。 |

---

## 1. 上游輸入

| 來源 | 用途 |
|------|------|
| [`reference/NTI_Printing_官網規劃書.md`](../reference/NTI_Printing_官網規劃書.md) §1、§3 | 前台資料需求 + CMS 功能 → endpoint 推導 |
| [`03-backend.md`](03-backend.md) | 資料模型與模組邊界 |
| [`05-seo.md`](05-seo.md) | 內容型別需回傳的 SEO 欄位 |
| [`08-database.md`](08-database.md) | ER Model／資料表欄位（endpoint 回傳欄位的來源） |
| [`09-cms-admin.md`](09-cms-admin.md) | 後台 24 個單元 → `/admin/*` 資源與權限碼對照 |
| 過往案例（webservice/SAP RFC/SAP RFC 串接經驗） | 第三方串接模式參考 |

---

## 2. 契約規範

- **執行環境**：**Azure Functions .NET 10（isolated）HTTP trigger**；每個資源群組以 Function 實作，路由用 `route` 屬性對應下列路徑。
- **風格**：RESTful（資源導向）；JSON；版本前綴 `/api/v1`。
- **語系**：以 `?lang=zh|en` 或 `Accept-Language` 提供雙語內容；列表回傳當前語系，必要時帶 `hreflang` 對應資訊。
- **認證**：公開讀取（前台內容）免認證；會員 API 用 JWT/session；後台管理 API 需 RBAC（超管/編輯/檢視者）。
- **錯誤格式**：統一 `{ code, message, details }`，HTTP 狀態語意正確。
- **分頁**：清單一律 `page`/`pageSize` + `total`。
- **檔案**：上傳走 multipart 或 **Azure Blob 預簽章（SAS）URL**；回傳 Blob 相對路徑（無資產表，見 [`08-database.md` §2.6](08-database.md)）。
- **文件化**：OpenAPI/Swagger 為單一事實來源，與本文件對齊。

---

## 3. Endpoint 群組（依 sitemap / 功能推導）

> 下列為**契約藍圖**，欄位細節以 OpenAPI 為準；資料表與欄位定義見 [`08-database.md`](08-database.md)。

### 3.1 前台內容（公開、唯讀，吃 CMS）
> 依 `mockup/` 44 頁實際結構對齊：**Projects 與 Green Vlog 無詳細頁**（前者卡片即完整內容，後者外連 YouTube）。

- `GET /content/home`（Banner、Solutions 卡、Proof 認證牆、Clients）
- `GET /solutions`、`GET /solutions/{slug}`（含品項卡）
- `GET /projects`（分類篩選）、`GET /facility?group={code}`、`GET /certifications`、`GET /clients`
- `GET /categories?type={CategoryType}`（下拉／篩選選項來源；`type` 值域為 `08-database.md` §4.1 的九種 `CategoryType`）——供 `projects.html` 的分類篩選與 Industries 清單、`get-a-quote` 的產業與材質下拉、`faq` 分組使用
- `GET /news`、`GET /news/{slug}`、`GET /green-vlog`
- `GET /faq`、`GET /industry-trends`、`GET /careers`
- `GET /supplier/notices`、`/supplier/specs`、`/supplier/downloads`
- `POST /supplier/downloads/{id}/hit`（累計 `SupplierDownload.DownloadCount`；`RequireLogin = 1` 者需會員憑證，P6 起生效）
- `GET /pages/{pageKey}`（**29 個**固定頁的 SEO 欄位；`HasRichBody = 1` 者另含 `bodyHtml` —— `privacy-legal` 與預留的 `green-csr`）
- `GET /site-settings`（公司資訊與社群連結；信件收件者等內部設定不外露）
- 每筆內容回傳 **SEO 欄位**：`title/metaDescription/h1/canonical/og/slug/imageAlt/hreflang`。

### 3.2 表單（公開寫入）
> 欄位以 [`08-database.md` §4.12](08-database.md) 的 `QuoteRequest` / `ContactMessage` 為準，下列為完整清單（非摘要）。兩者皆須帶隱私權同意時間，伺服器端另記錄 IP／UA／來源語系。

- `POST /quotes` → 觸發業務通知信 + 客戶確認信（結果記入 `EmailLog`），可串 CRM。
  必填：`fullName`、`company`、`email`、`quantity`、`requirement`、`consent`
  選填：`phone`、`solutionId`（產品類型）、`industryCategoryId`、`sizeText`、`materialCategoryId`、`targetDate`、`needsSustainableAdvice`（永續建議勾選）、`attachments[]`（設計稿，PDF/AI/PSD/JPG/PNG/ZIP，單檔 ≤20MB、最多 5 個）
  回傳系統產生的 `quoteNo`（格式 `Q20260901-0001`）。
- `POST /contacts` → 通知信。
  必填：`name`、`email`、`message`、`consent`
  選填：`company`、`phone`
  **無「主旨」欄位** —— `mockup/contact.html` 與 `ContactMessage` 皆無此欄。

### 3.3 會員（認證）
- `POST /auth/register`、`/auth/login`、`/auth/forgot-password`、`/auth/reset-password`
- `GET/PUT /me`（帳戶設定）
- `GET /me/quotes`（報價紀錄 + 狀態）、`GET /me/orders`、`GET /me/orders/{id}`（生產進度）

### 3.4 後台管理（RBAC）
- `GET/POST/PUT/DELETE /admin/{unit}`（各單元 CRUD + 排序 + 上下架排程）
- **`{unit}` 一律使用 [`09-cms-admin.md` §2](09-cms-admin.md) 的單元代號原字串**（單數、含連字號），與 RBAC 權限碼 `{單元代號}.{action}` 逐字對應，不做單複數轉換：

  | 路徑 | 單元 | 權限碼前綴 |
  |---|---|---|
  | `/admin/home-banner`、`/admin/solution`、`/admin/project`、`/admin/news`、`/admin/vlog`、`/admin/faq`、`/admin/trend`、`/admin/certification`、`/admin/client`、`/admin/facility`、`/admin/job`、`/admin/supplier-notice`、`/admin/supplier-spec`、`/admin/supplier-download` | 01–14 內容 | 同路徑名 |
  | `/admin/page`、`/admin/redirect` | 15、16 | `page.*`、`redirect.*` |
  | `/admin/quote`、`/admin/contact` | 17、18（檢視／改狀態／匯出） | `quote.*`、`contact.*` |
  | `/admin/member`、`/admin/order` | 19、20 | `member.*`、`order.*` |
  | `/admin/setting`、`/admin/category` | 21、22 | `setting.*`、`category.*` |
  | `/admin/admin`、`/admin/audit` | 23 管理員與角色、24 操作紀錄 | `admin.*`、`audit.*` |
  | `/admin/dashboard` | 00 待辦總覽（唯讀聚合） | `dashboard.view` |

- 非 CRUD 的動作端點與其權限碼：`GET /admin/quote/export`（`quote.export`，**須寫入 `AuditLog`**）、`GET /admin/quote/{id}/attachments/{attId}`（`quote.download`，`ScanStatus <> 'Clean'` 者拒絕）、`GET|POST /admin/redirect/export|import`（`redirect.export`）、`POST /admin/audit/emails/{id}/resend`（`audit.resend`）。
- 中英對照無獨立端點（`/admin/i18n` 已移除），兩語系隨各資源一併讀寫。

> 本期不含 AI 客服端點（原 `/ai/chat` 已移除），亦不含 Pacdora／3D 包裝客製端點（廠商不提供技術崁入服務）。

---

## 4. 工作分解

1. **P1 契約凍結 v1**：ER Model + OpenAPI 草稿，經 Gate 簽核。
2. **Mock server**：供 frontend 解耦開發。
3. **P4 實作對齊**：backend-engineer 實作，逐 endpoint 與契約 diff。
4. **契約變更流程**：任何欄位/路徑變更 → 更新 OpenAPI + 本文件 §3 + 通知前後端 + 補變更紀錄。

---

## 5. DoD

- [ ] OpenAPI 與本文件一致，前後端皆可由契約獨立開發。
- [ ] 認證/RBAC/錯誤格式/分頁一致落實。
- [ ] 內容 endpoint 回傳完整 SEO 欄位（與 05-seo 對齊）。
- [ ] 第三方金鑰一律後端持有，前端零金鑰。
- [ ] `verify` 實機通過、`code-review` 審查通過。

---

## 6. 與其他 Agent 的介面

- `system-analyst` 定契約 → `backend-engineer` 實作 ← `frontend-architect` 消費。三方共用 OpenAPI。
- 契約是雙向同步點：實作或前端發現契約缺口 → 回 system-analyst 修訂並補紀錄。

---

## 7. 風險與對策

| 風險 | 對策 |
|------|------|
| 契約頻繁變動拖累雙方 | v1 凍結 + CR 流程；mock 先行 |
| SEO 欄位漏在 API 層 | 內容 endpoint 強制含 SEO 欄位，列入 DoD |

---

## 變更紀錄

| 日期 | 修改者 | 摘要 |
|------|--------|------|
| 2026-06-12 | Tim（Claude Code） | 初版：定義 API 契約 harness 作業書 |
| 2026-06-12 | Tim（Claude Code） | 改為 Azure Functions .NET10 HTTP trigger；移除 `/ai/chat`；Pacdora 設計結果併入 `/quotes` 可選欄位 |
| 2026-06-16 | Tim（Claude Code） | Pacdora／3D 包裝客製本期不納入（廠商不提供技術崁入服務）；移除 §3.5 Pacdora 契約、/quotes 之 pacdora 欄位、相關風險 |
| 2026-09-01 | Tim（Claude Code） | 上游輸入補 08（DDL）／09（後台單元）；ER Model 權威來源改指向 `08-database.md` |
| 2026-09-01 | Tim（Claude Code） | §3.1 依 mockup 44 頁對齊（移除 `/projects/{slug}`、`/green-vlog/{slug}`；`/nti-difference`、`/advantages` 併入 `/pages/{pageKey}`；新增 faq／industry-trends／careers／certifications／clients／site-settings）；檔案上傳由「預簽章 URL（S3）」更正為 Azure Blob SAS；`/admin/i18n` 移除 |
| 2026-09-02 | Tim（Claude Code） | 對齊 08／09 修正四處契約缺口：`POST /contacts` 刪除不存在的「主旨」、補回「公司」（依 `ContactMessage` 與 `mockup/contact.html`）；`POST /quotes` 欄位補齊為完整清單（產業／尺寸／材質／目標日期／永續建議勾選／同意時間）；新增 `GET /categories?type=`（前台下拉選項來源，原為契約缺口）與 `POST /supplier/downloads/{id}/hit`；§3.4 `/admin/{resource}` 改為 `{unit}` 並附完整路徑↔單元↔權限碼對照表（不再單複數混用、`/admin/users` 更正為 `/admin/admin`），補列非 CRUD 動作端點；固定頁 28 → 29 |

*最後更新：2026-09-02*
