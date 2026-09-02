# 03 · 後端／CMS Backend — Harness 作業書

| 欄位 | 內容 |
|------|------|
| **主責 Agent** | `backend-engineer` |
| **協作 Agent** | `system-analyst`（DB schema / API 契約 / 權限模型）、`frontend-architect`（串接）、`code-review-optimizer`（合併前審查） |
| **搭配 Skills** | `run`、`verify`、`code-review`／`simplify`、`security-review` |
| **對應階段** | P4（後端/CMS）／P6（會員/報價/聯絡）／P8（內容遷移） |
| **核心定位** | 自建 CMS + API 服務；以 [`04-api.md`](04-api.md) 契約為與前端的介面，平行 fan-out。 |

---

## 1. 上游輸入

| 來源 | 用途 |
|------|------|
| [`reference/NTI_Printing_官網規劃書.md`](../reference/NTI_Printing_官網規劃書.md) §3-1 | CMS 功能需求來源（與現行 IA 的差異見 [`09-cms-admin.md` §2.1](09-cms-admin.md)） |
| [`04-api.md`](04-api.md) | API 契約（system-analyst 定義） |
| 既有 WordPress 站 `nti-printing.com`（約 80 篇文章 / 46 頁） | 內容遷移來源（P8） |
| [`05-seo.md`](05-seo.md) | CMS 需提供的 SEO 欄位（meta/slug/alt/canonical/hreflang） |
| [`08-database.md`](08-database.md) | **資料表 DDL、多語策略、索引、種子**（本文件 §4.1 的落地規格） |
| [`09-cms-admin.md`](09-cms-admin.md) | **後台 24 個單元的欄位／操作／權限規格**（本文件 §3 的落地規格） |
| [`10-backend-design.md`](10-backend-design.md) | **後端技術規範**：分層、命名、回應信封、資料存取、設定與 Coding Checklist（本文件 §2 的落地規格） |

---

## 2. 技術基線（已凍結）

| 項目 | 選定 | 備註 |
|------|------|------|
| 後端框架 | **Azure Functions .NET 10**（isolated worker，ASP.NET Core Integration） | 單一 `RouterFunction` catch-all + 集中式 `AppRouter`，唯一資料存取層 |
| 資料存取 | **EF Core（寫入 + Migration）+ Dapper（讀取）雙軌** | 寫入要交易與關聯完整性、讀取要可控 SQL 與 DTO 投影；分工鐵律見 [`10-backend-design.md` §8](10-backend-design.md)。**取代 2026-06-12 的 Dapper 單軌決策** |
| schema 權威 | **EF Core Migration**（`Api/Data/Migrations/`） | [`db/`](../db/) 由權威降為參考實作與交付腳本；`db/verify/verify.sql` 保留為驗收閘 |
| 資料庫 | **Azure SQL Database — Basic 層** | 已定案；ER Model 與 DDL 見 [`08-database.md`](08-database.md) |
| 檔案儲存 | **Azure Blob Storage** | 媒體/設計稿上傳（預簽章 URL） |
| CMS 後台前端 | **純 SPA（靜態）**，不需 SEO、不需 SSR | 與公開站分開部署 |
| AI 客服 | **本期不納入** | Claude API/AI Agent 暫緩，後續再評估 |
| 施工標準 | [`10-backend-design.md`](10-backend-design.md) | 分層鐵律、命名、`ApiResponse` 信封、錯誤碼、JWT、設定管理、Coding Checklist |

---

## 3. 範圍 — CMS 模組（對應規劃書 §3 功能清單）

**內容維護**：以 **24 個後台單元**實作，單元清單、欄位與權限見 [`09-cms-admin.md`](09-cms-admin.md)。
規劃書 §3-1 的部分區塊名稱（COURAGE、Project 精選、NTI Difference、Advantages 數據）已被 2026-08-31 IA 改版與 2026-09-01 首頁改版取代，逐項差異與**三個待確認缺口**（電子報／CSR／Banner 影片）見 [`09-cms-admin.md` §2.1](09-cms-admin.md)。

**系統管理**：
- **管理員與權限角色**：超級管理員 / 內容編輯 / 檢視者（RBAC），權限矩陣以 [`09-cms-admin.md` §6](09-cms-admin.md) 為權威（展開後 171 列）。
- **報價需求管理**：檢視／改狀態／指派承辦人／匯出，狀態五態 `待處理 / 處理中 / 已報價 / 已結案 / 垃圾訊息`（DB 值 `New / InProgress / Quoted / Closed / Spam`）。客戶填寫內容唯讀。
- **聯絡表單管理**：檢視／改狀態，狀態四態 `待處理 / 已回覆 / 已結案 / 垃圾訊息`（`New / Replied / Closed / Spam`）。
- **會員管理**：清單、啟用/停用、重寄驗證信／觸發密碼重設（**後台不可查看或設定會員密碼**）。

> **語系管理不設獨立模組**：改為每個單元的中／英分頁 + 清單完成度 badge（[`09-cms-admin.md` §5.3](09-cms-admin.md)），API 亦無 `/admin/i18n` 端點。

**會員系統（P6）**：註冊/登入/忘記密碼、會員中心、帳戶設定、報價紀錄、訂單管理（生產進度）。

**表單後端（P6）**：Get a Quote（含設計稿上傳）、Contact Us — 送出後通知信給業務、確認信給客戶，可串 CRM。

> 本期不含 AI 客服（Claude API）。

---

## 4. 工作分解

1. **資料層**（P4）：依 [`08-database.md`](08-database.md) 建立 **49 張表**（內容模型 + 多語 i18n 子表 + 會員 + 報價/聯絡 + RBAC + 版本表 + 預留的 `NewsletterSubscriber`）。
   **schema 權威為 EF Core Migration**：既有 [`db/`](../db/) 的 3 支 migration 與 6 支 seed 需搬遷為 `Data/Configurations/<Entity>Configuration.cs` + `HasData`（表達方式對照表見 [`10-backend-design.md` §8.5](10-backend-design.md)），這是 P4 的第一項工作。
   `db/` 保留為參考實作與交付腳本（本機一鍵建置 `db/tools/run-local.sh` 仍可用）；`db/verify/verify.sql` 的 24 項斷言保留為 EF Migration 產出的驗收閘。
2. **CMS 後台**：依 [`09-cms-admin.md`](09-cms-admin.md) 的 24 個單元實作 CRUD + 排序 + 上下架排程 + 富文本 + 欄位級檔案上傳（Azure Blob，**不做 Media Library**）+ 角色權限。
3. **API 實作**：對齊 [`04-api.md`](04-api.md) 契約（前台讀取 + 後台管理 + 表單 + 會員），寫法依 [`10-backend-design.md`](10-backend-design.md)。
4. **會員與表單**（P6）：認證（JWT/session）、密碼雜湊、信件通知、檔案上傳防護。
5. **內容遷移**（P8）：WordPress → 新 CMS（含媒體、分類、上架狀態），配合 301 對照表（見 05-seo）。

---

## 5. DoD（CMS 模組 / API 完成前）

- [ ] 符合規劃書功能清單，`verify` 實機通過。
- [ ] **SEO 欄位**：每個內容型別可編輯 Title/Meta/H1/canonical/OG/slug/圖片 alt、中英 hreflang 對應。
- [ ] **安全**：RBAC 落實、輸入驗證、檔案上傳型別/大小限制、密碼雜湊、金鑰不落前端、防 SQLi/XSS/CSRF，通過 `security-review`。
- [ ] **效能**：清單查詢分頁/索引、媒體走 CDN、避免 N+1。
- [ ] **可維運**：上下架排程、操作稽核日誌、錯誤監控。
- [ ] **品質**：通過 `code-review-optimizer`。

---

## 6. 與其他 Agent 的介面

- ← `system-analyst`：DB schema、API 契約、權限模型、SEO 欄位需求。
- ↔ `frontend-architect`：04-api 契約為介面；契約變更雙方同步並回寫 04-api。
- → `qa-test-engineer`：交付供功能/安全/效能稽核。

---

## 7. 風險與對策

| 風險 | 對策 |
|------|------|
| 內容遷移資料遺失/格式跑掉 | 先試遷一批驗證、保留原站、媒體 checksum 比對 |
| 報價/設計稿上傳被濫用 | 型別白名單、大小限制、病毒掃描、登入後才可上傳大檔 |
| Functions 冷啟動影響 API | 公開站內容頁走 ISR 不每次打 API；必要端點評估 Flex/常駐 |

---

## 變更紀錄

| 日期 | 修改者 | 摘要 |
|------|--------|------|
| 2026-06-12 | Tim（Claude Code） | 初版：定義後端/CMS 領域 harness 作業書 |
| 2026-06-12 | Tim（Claude Code） | 凍結 .NET10/Functions/Azure SQL Basic/Blob；CMS 前端純 SPA；移除 AI 客服；Pacdora 後端 adapter 串接 |
| 2026-06-12 | Tim（Claude Code） | 資料存取改用 **Dapper**（取代 EF Core） |
| 2026-06-16 | Tim（Claude Code） | Pacdora／3D 包裝客製本期不納入（廠商不提供技術崁入服務）；移除 P7 後端 adapter 串接、報價帶入、相關協作與風險 |
| 2026-09-01 | Tim（Claude Code） | 拆出 [`08-database.md`](08-database.md)（DDL）與 [`09-cms-admin.md`](09-cms-admin.md)（後台單元規格）；本文件保留領域編排，細節改為引用 |
| 2026-09-01 | Tim（Claude Code） | §3 內容維護清單（照抄規劃書、已被 IA 改版取代）改為指向 09 §2／§2.1；修正規劃書路徑 `planning/` → `reference/` |
| 2026-09-02 | Tim（Claude Code） | §3 對齊 08／09：報價狀態 3 態 → 5 態（另補聯絡表單 4 態）、刪除已廢除的「語系管理」獨立模組、權限指向 09 §6 矩陣、補「後台不可查看會員密碼」；§4 表數 47 → 49 並指向可執行腳本 [`db/`](../db/) |
| 2026-09-02 | Tim（Claude Code） | 以 `Jabez/Api` 為範本定調實作路線：§2 資料存取由 **Dapper 單軌改為 EF Core（寫）+ Dapper（讀）雙軌**（推翻 2026-06-12 凍結決策）、後端框架註明 ASP.NET Core Integration 與集中式 `AppRouter`、新增「schema 權威＝EF Migration」與「施工標準＝10」兩列；§4 資料層改為以 EF Migration 為權威、`db/` 降為參考與交付用；新增 [`10-backend-design.md`](10-backend-design.md) |

*最後更新：2026-09-02*
