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
| [`planning/NTI_Printing_官網規劃書.md`](../planning/NTI_Printing_官網規劃書.md) §1、§3 | 前台資料需求 + CMS 功能 → endpoint 推導 |
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
- **檔案**：上傳走 multipart 或預簽章 URL（S3），回傳資產 id/url。
- **文件化**：OpenAPI/Swagger 為單一事實來源，與本文件對齊。

---

## 3. Endpoint 群組（依 sitemap / 功能推導）

> 下列為**契約藍圖**，欄位細節以 OpenAPI 為準；資料表與欄位定義見 [`08-database.md`](08-database.md)。

### 3.1 前台內容（公開、唯讀，吃 CMS）
- `GET /content/home`（Banner、COURAGE、Printing、精選 Project、Clients）
- `GET /nti-difference`、`GET /printing-solutions`、`GET /printing-solutions/{slug}`（4 子方案）
- `GET /projects`、`GET /projects/{slug}`（含影片、技術標籤、分類篩選）
- `GET /facility`、`GET /advantages`（含碳效率/ESG 數據）
- `GET /news`、`GET /news/{slug}`、`GET /green-vlog`、`GET /green-vlog/{slug}`
- `GET /supplier/announcements`、`/supplier/specs`、`/supplier/downloads`
- `GET /legal/privacy`、`GET /contact-info`
- 每筆內容回傳 **SEO 欄位**：`title/metaDescription/h1/canonical/og/slug/imageAlt/hreflang`。

### 3.2 表單（公開寫入）
- `POST /quotes`（公司/聯絡人/Email/電話/產品類型/數量/需求/設計稿上傳）→ 觸發業務通知信 + 客戶確認信，可串 CRM。
- `POST /contacts`（姓名/Email/電話/主旨/訊息）→ 通知信。

### 3.3 會員（認證）
- `POST /auth/register`、`/auth/login`、`/auth/forgot-password`、`/auth/reset-password`
- `GET/PUT /me`（帳戶設定）
- `GET /me/quotes`（報價紀錄 + 狀態）、`GET /me/orders`、`GET /me/orders/{id}`（生產進度）

### 3.4 後台管理（RBAC）
- `GET/POST/PUT/DELETE /admin/{resource}`（各內容型別 CRUD + 排序 + 上下架排程）
- `/admin/quotes`、`/admin/contacts`（檢視/回覆/狀態/匯出）
- `/admin/members`（清單/啟用停用）、`/admin/users`（管理員/角色）、`/admin/i18n`（中英對照）

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

*最後更新：2026-09-01*
