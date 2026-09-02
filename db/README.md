# db／ — NTI 資料庫參考腳本

資料庫名稱 **NTI**。設計來源為 [docs/08-database.md](../docs/08-database.md)（schema）與
[docs/09-cms-admin.md](../docs/09-cms-admin.md)（後台單元與權限矩陣）；本目錄是它們的**可執行版本**。

目前以本機 SQL Server 開發，語法同時相容 Azure SQL Database（Basic）。

---

> ## ⚠️ 定位聲明（2026-09-02 起）
>
> 後端資料存取已定案為 **EF Core（寫入 + Migration）+ Dapper（讀取）雙軌**，
> **schema 的權威來源改為 `Api/Data/Migrations/`**（見 [docs/10-backend-design.md §8](../docs/10-backend-design.md)）。
>
> 本目錄自此由「權威建置腳本」降為 **參考實作與交付腳本**：
>
> | 用途 | 是否仍有效 |
> |---|---|
> | 本機一鍵建庫（`tools/run-local.sh`）供 P4 前的設計驗證與資料比對 | ✅ 有效 |
> | 交付給客戶／DBA 的可讀 DDL 與種子腳本 | ✅ 有效 |
> | **`verify/verify.sql` 的 24 項斷言** | ✅ **保留為 EF Migration 產出的驗收閘** —— 這些斷言獨立於 schema 由誰產生，價值不變 |
> | 〈Azure SQL 相容性 checklist〉（禁用語法表 + 預設值差異表） | ✅ **繼續適用**，檢查對象改為 `dotnet ef migrations script` 的輸出 |
> | 作為 P4 之後 schema 變更的落點 | ❌ 已失效 —— schema 變更一律寫 EF Migration，再視需要回頭同步本目錄 |
>
> **P4 的第一項工作**是把 `migrations/`（3 支）與 `seed/`（6 支）搬遷為
> `Data/Configurations/<Entity>Configuration.cs` + `HasData`。
> 各項規格（具名約束、Category 型別安全的 9 條 PERSISTED 計算欄、filtered unique index、
> 固定 Id 種子）的 EF Core 表達方式，對照表見
> [docs/10-backend-design.md §8.5](../docs/10-backend-design.md)。

---

## 快速開始

```bash
cp db/.env.local.example db/.env.local     # 填入本機 sa 密碼，此檔已在 .gitignore
db/tools/run-local.sh                      # 建庫 → migrations → seed → dev 帳號 → 驗證
```

砍掉重建：

```bash
set -a; . ./db/.env.local; set +a
db/tools/sqlcmd.sh master < db/local/900_drop_database.sql
db/tools/run-local.sh
```

本機無需安裝 sqlcmd —— `db/tools/sqlcmd.sh` 透過 `docker exec` 使用容器內的
`/opt/mssql-tools18/bin/sqlcmd`。GUI 檢視可用 DBeaver 或 VS Code 的 `ms-mssql` 擴充
（`localhost,1433` / `sa`）。

dev 管理員帳號為 `admin@nti.local`，密碼見 `local/910_seed_dev_admin.sql` 檔頭註解。
**`local/` 只在本機執行、不會出現在 GitHub 公開版**（見 [CLAUDE.md](../CLAUDE.md) 版控與雙 remote），
需要時向專案內部版（NAS）索取。

---

## 目錄結構

| 路徑 | 性質 | 說明 |
|---|---|---|
| `local/` | **只在本機執行** | 建庫／砍庫／dev 帳號。Azure 永不執行，runner 也不掃這裡。 |
| `migrations/` | 一次性、依序 | 由 `SchemaVersion` 記錄；**套用後不可再修改**。 |
| `seed/` | run-always、冪等 | 參照資料（角色／權限／分類／設定／頁面／方案）。 |
| `verify/` | 檢核 | 部署後跑一次，有 FAIL 即回傳非 0。 |
| `tools/` | 執行封裝 | `sqlcmd.sh`（單檔）、`run-local.sh`（全流程）。 |

### 檔名規則

- `migrations/NNNN_snake_case.sql` — 四位數、不跳號。
  **已套用到任何共享環境的檔案視為不可變**，要改內容請新開一支。
- `seed/NNN_snake_case.sql` — 三位數、100 起跳（與 migrations 號段區隔）。
- 每個檔案自我完備：不使用 sqlcmd 的 `:r` include 或 `:setvar`（DbUp 不支援）。

### 為什麼 `000_create_database.sql` 在 `local/` 而不在 `migrations/`

Azure SQL Database 的資料庫由 `az sql db create` / Bicep 建立，且**不允許在 user
database 連線下 `CREATE DATABASE`、也不支援 `USE`**。若放進 `migrations/`，未來
runner 掃資料夾時會誤抓並在 Azure 上炸掉。

Azure 端對應指令（collation 必須一致）：

```bash
az sql db create -g <rg> -s <server> -n NTI \
   --service-objective Basic --collation Latin1_General_100_CI_AS_SC
```

---

## Collation 決策

資料庫定序 **`Latin1_General_100_CI_AS_SC`**（本機與 Azure 兩邊都明確指定，**建庫後不可更改**）。

- 所有可翻譯文字都是 `NVARCHAR`，中文儲存不依賴 code page，任何 collation 都存得下。
- `_100` + `_SC`（Supplementary Character）讓 `LEN()` / `SUBSTRING()` / `CHARINDEX()`
  正確處理 4-byte 字元（emoji、罕用漢字）。用舊的 `SQL_Latin1_General_CP1_CI_AS` 時
  `LEN()` 會把 emoji 算成 2 個字元 → 後台「SEO Title 70 字」提示會算錯。
- `CI`（大小寫不敏感）正好符合需求：`UX_PageI18n_Lang_Slug` 會把 `About` 與 `about`
  視為重複並擋下（URL 本該不分大小寫），`Redirect.FromPath` 與各種 `Code` 比對同理。
- 站上所有列表都以 `SortOrder` / `PublishDate` 排序，無「依中文筆畫排序」需求，
  故不需要 `Chinese_Taiwan_Stroke_*`。

> ⚠️ **代價**：資料庫定序與伺服器／tempdb 定序不同（本機與 Azure 皆然）。
> **任何 `#temp` 表的字串欄位一律加 `COLLATE DATABASE_DEFAULT`**，否則會出現
> `Cannot resolve the collation conflict`。`verify/verify.sql` 的表變數即為範例。

---

## Azure SQL 相容性 checklist

> ⚠️ 本機容器是 **Developer Edition**（等同 Enterprise 功能集），下列在本機都跑得過，
> 但在 Azure SQL **Basic** 上會失敗。改動腳本時當 PR checklist 逐條確認。

**禁用**

| 寫法 | 為什麼 |
|---|---|
| `USE [NTI]` | Azure SQL DB 不支援；靠 `sqlcmd -d` / 連線字串的 Initial Catalog |
| `CREATE DATABASE`（腳本內） | 只能在 `master` 連線且為批次唯一語句 → 已隔離到 `local/` |
| `ALTER DATABASE ... SET RECOVERY SIMPLE` | 不支援 |
| `ON [PRIMARY]` / `FILEGROUP` / `TEXTIMAGE_ON` | 不支援 |
| `sp_configure` / 追蹤旗標 / `xp_cmdshell` | 不支援 |
| `BULK INSERT '本機路徑'` / `OPENROWSET(BULK)` | 只能讀 Blob + EXTERNAL DATA SOURCE；種子一律用 `VALUES` |
| `CREATE INDEX ... WITH (ONLINE = ON)` | Basic 不支援 |
| Columnstore／In-Memory OLTP／資料壓縮／CDC | Basic 不支援 |
| 跨資料庫三段式名稱 `OtherDb.dbo.T` | 不支援 |
| `CREATE LOGIN`／SQL Agent Job | 排程改走 Azure Functions Timer Trigger |

**主動對齊的預設值差異**

| 設定 | Azure 預設 | 本機預設 | 處理 |
|---|---|---|---|
| `READ_COMMITTED_SNAPSHOT` | ON | OFF | `local/000_create_database.sql` 明確設 ON —— 不對齊就測不出 prod 的併發行為 |
| `COMPATIBILITY_LEVEL` | 160 | 160 | 仍明寫鎖死 |
| 資料庫定序 | `SQL_Latin1_General_CP1_CI_AS` | 繼承 model | 兩邊都明確指定為 `Latin1_General_100_CI_AS_SC` |

**每個腳本檔開頭固定**

```sql
SET NOCOUNT ON; SET ANSI_NULLS ON; SET QUOTED_IDENTIFIER ON; SET XACT_ABORT ON;
GO
```

`QUOTED_IDENTIFIER` 特別重要：**sqlcmd 預設是 OFF**，而 filtered index
（`UX_Vlog_MainFeature`）在 OFF 下建立會直接失敗。執行時另加 `sqlcmd -I` 雙保險。

**`GO` 的處理**：`GO` 是 sqlcmd/SSMS 的批次分隔符、不是 T-SQL。本目錄的腳本會用到它，
因此**執行器必須以 `^\s*GO\s*$` 切批次**（sqlcmd、DbUp、SSMS、DBeaver 都支援；
若自行用 .NET `SqlCommand` 整檔送出會炸）。

---

## 冪等性與交易

**兩層防護**

1. **runner 層（權威）**：`SchemaVersion` 記錄已套用的 migration 檔名，只跑未記錄的。
2. **腳本層（保險）**：每個物件仍包 `IF NOT EXISTS`，讓「手動跑到一半失敗 → 修正後重跑」
   在本機可行。

**腳本內不寫 `BEGIN TRAN` / `TRY...CATCH`** —— `TRY...CATCH` 無法跨 `GO`，而我們需要 `GO`。
改為：

- 本機：`sqlcmd -b`（首個錯誤即中止、回傳非 0），配合 `IF NOT EXISTS` 重跑修復。
- CI／prod：由 runner 對每支腳本開一個交易（DbUp 的 `WithTransactionPerScript()`）。
  SQL Server 的 DDL 可交易，能達成單檔 all-or-nothing。

**種子一律用 `VALUES` 建構子 + `WHERE NOT EXISTS`（自然鍵），不用 `MERGE`**
（MERGE 有多個已知並發／觸發器缺陷，錯誤訊息也難讀）。

`Role`(3) / `Solution`(4) / `Page`(29) 三張表用 `SET IDENTITY_INSERT` 固定 Id ——
它們筆數固定不可增刪，各環境 Id 一致對日後資料比對、hotfix SQL、內容遷移對照很重要。
`Category`(44) 客戶可能增刪，維持自然鍵 + 自動 Id。

### 接上 DbUp

> 定位變更後，正式環境的 schema 由 `Program.cs` 啟動時的 `MigrateAsync()` 套用（見 10 §4／§11）；
> 本節保留供「以本目錄腳本交付」的情境使用。

`SchemaVersion` 的 `ScriptName` / `Applied` 兩欄刻意與 DbUp 預設 journal 相容
（名稱與型別不可更動），其餘欄位皆可 NULL 或帶 DEFAULT。對接只需：

```csharp
DeployChanges.To.SqlDatabase(conn)
    .JournalToSqlTable("dbo", "SchemaVersion")
    .WithScriptsFromFileSystem("db/migrations")
    .WithScriptsFromFileSystem("db/seed",
        new SqlScriptOptions { ScriptType = ScriptType.RunAlways })
    .WithTransactionPerScript()
    .Build();
```

`SchemaVersion.Checksum` 保留給 runner 實作「已套用的檔被事後編輯 → 中止部署」。

---

## 相對 docs/08 §4 的四點調整

這四點都是「讓腳本可執行」與「跨環境安全」的必要調整，已回寫 docs/08：

1. **展開 `/* audit */`**。08 §4 用單行註解佔位五個稽核欄，腳本必須寫實。
2. **所有約束具名**（`PK_` / `FK_` / `UQ_` / `CK_` / `DF_`）。
   匿名 inline DEFAULT 會產生 `DF__HomeBanner__Sort__1B0907CE` 這種帶隨機 hash 的名稱，
   **每個環境都不同** → 未來要 `DROP CONSTRAINT` 改預設值時，dev 能跑的 migration
   會在 prod 炸掉。`verify.sql` 斷言匿名約束數為 0。
3. **`Member` / `MemberToken` 上移**至 `QuoteRequest` 之前（08 §4.12 的建表順序警語）。
4. **Category 型別安全**。`Category` 是唯一的橫向共用主檔（九種 `CategoryType` 服務八個
   內容單元 + 報價表單）。單純的 FK 只保證「分類存在」、不保證「型別正確」——
   `News.CategoryId` 可以指到 `CategoryType='Facility'` 的列而不被擋下。
   因此在每個引用端加一個 PERSISTED 常數計算欄（`*TypeGuard`），與 `CategoryId` 組成
   複合 FK 指向 `Category(Id, CategoryType)`。計算欄為常數、零維護成本；`CategoryId`
   可為 NULL 時複合 FK 自動不檢查（MATCH SIMPLE 語意），故不影響選填分類的單元。

**索引層另有四點調整**（見 `migrations/0003_init_indexes.sql` 檔頭）：移除與 UNIQUE 重複的
`IX_Redirect_From`、新增 `UX_Vlog_MainFeature`（DB 層保證全站僅一支主打影片）、
新增 4 條外鍵支撐索引、新增 `IX_NewsletterSubscriber_Status`。

### 刻意不做

`Solution` 固定 4 筆、`Page` 固定 29 筆**不在 DB 層加約束**。可行方案只有 INSTEAD OF
trigger 或 DDL trigger，但：(a) Basic 5 DTU 下每次寫入多一次 trigger 是實打實的成本；
(b) 內容遷移（P8）與資料修補會被自己的 trigger 擋住，屆時得 `DISABLE TRIGGER`，反而
製造事故面；(c) docs/09 §4 已明訂後台不提供新增／刪除按鈕。
**改為由 `verify.sql` 斷言筆數**，效果相同、零執行期成本。

`UX_NewsI18n_Lang_Slug` 等 slug 唯一索引**刻意不含 `IsDeleted`** —— 軟刪的內容仍永久佔用
slug。SEO 上舊網址不該被回收後指向不同內容，這是設計而非疏漏。

---

## 預留項目（待客戶確認）

docs/09 §2.1 列出三個缺口「屬範圍變更、未確認前不納入本期估算」。schema 已先備妥，
客戶點頭後只需補後台單元與權限碼，**不必再動結構**：

| 缺口 | 預留內容 | 位置 |
|---|---|---|
| 電子報（含訂閱名單與舊站名單遷移） | `NewsletterSubscriber` 表（double opt-in、`Source='Import'` 支援名單匯入） | `0002_init_schema.sql` 末段 |
| 首頁 Banner 影片 | `HomeBanner.MediaType` / `VideoPath` + 兩條 CHECK | `0002_init_schema.sql` 單元 01 |
| CSR 社會責任頁 | `Page` 第 29 筆 `green-csr`（`HasRichBody=1`、`IsIndexable=0`） | `seed/140_page.sql` |

`green-csr` 設 `HasRichBody=1` 是為了讓客戶點頭後能直接在後台撰稿上線、不需改前端程式
（docs/09 §7 的擴充路徑）；`IsIndexable=0` 避免未確認前的空頁被搜尋引擎索引。

---

## 已知缺口（不在本目錄的範圍內）

> 2026-09-02：原先列在此的兩項（產業別分類與 mockup 不一致、docs/03·04 與 08 的契約不一致）**已全部修正**，見下方〈命名一致性〉。

1. **`Page.RouteTemplate` 待 02-frontend 定案**：[docs/05-seo.md §2.2](../docs/05-seo.md) 已確立採用 `/zh`、`/en` 子路徑，`seed/140_page.sql` 是依此與 IA 層級推導的現行提案值。路由確定後直接改該檔即可，**不影響 schema**。
2. **富文本內文插圖的孤兒清除**：docs/08 §2.6 說孤兒檔「比對欄位引用後清除」，但 `news` 內文插圖只存在於 `NewsI18n.BodyHtml` 的 HTML 字串裡、沒有 `*Path` 欄位。清除排程**必須額外解析所有 `*Html` 欄位內的 `<img src>`**，否則會誤刪。
3. **`AuditLog` 保留 12 個月**（docs/09 §24）需要清除排程（走 Azure Functions Timer Trigger，Azure SQL 無 Agent Job）；`EmailLog` 的保留期尚未定義。
4. **WebP 衍生檔的路徑慣例未定**：docs/08 §2.6 要求影像另存 WebP 衍生檔且原檔保留，但只有一個 `XxxPath` 欄位，兩者的對應靠命名慣例——慣例本身尚未寫進任何文件。

---

## 命名一致性（DB 種子 ↔ mockup）

原則：**`Code` 是程式契約**（建立後不可改，`08-database.md` §6.2 定義）；**顯示名跟隨 mockup 的客戶定案文案**。
2026-09-02 已讓三處逐字一致：

| 資料 | 權威文案來源 | 已對齊的三處 |
|---|---|---|
| `Category(Industry)` 10 項 | `mockup/projects.html` #industries（客戶定案的完整清單） | DB 種子、`projects.html`、`get-a-quote.html` 產業下拉（原僅 5 項且命名不同，已補齊） |
| `Category(QuoteMaterial)` 4 項 | `mockup/get-a-quote.html` 材質下拉 | DB 種子、該下拉。「No preference — advise me」即 `MaterialCategoryId = NULL`，不建分類列 |
| `Solution` 4 項 | `mockup/get-a-quote.html` 產品類型下拉 | DB 種子（`SolutionI18n.Name`）、該下拉 |

`get-a-quote.html` 的附件說明也已對齊 docs/09 §3（PDF/AI/PSD/JPG/PNG/ZIP、單檔 ≤20MB、最多 5 個）。

## 安全

- **sa 密碼絕不進版控**：只放 `db/.env.local`（已在 `.gitignore`），範本為 `.env.local.example`。
- `local/910_seed_dev_admin.sql` 的固定密碼**僅供本機**；正式環境第一位超管由部署流程
  建立（隨機密碼 + 寄啟用信 + `MustChangePassword=1`）。
- `local/900_drop_database.sql` 硬編碼名稱守衛，只允許刪除 `NTI` ——
  本機容器內另有其他專案的資料庫。

---

## 驗證期望值

`verify/verify.sql` 目前斷言 24 項，全 PASS 才回傳 0。主要幾項：

| 檢查項 | 預期 |
|---|---|
| 資料表總數 | 49（08 §3 的 47 + `NewsletterSubscriber` + `SchemaVersion`） |
| `*I18n` 子表 | 16 |
| 外鍵 | 35（`AuditLog.AdminUserId`／`CreatedBy`／`UpdatedBy`／`AssigneeId` 依 08 §2.3 刻意無 FK） |
| Category 型別安全複合外鍵 | 9 |
| 匿名（系統命名）約束 | **0** |
| 內容表缺稽核五欄 | 0（docs/08 §9 DoD 第 1 條的自動化） |
| `RolePermission` | 171（SuperAdmin 83／Editor 67／Viewer 21） |
| `Category` / `CategoryI18n` | 44 / 88 |
| `SiteSetting` | 15 |
| `Page` / `PageI18n` / `HasRichBody=1` | 29 / 58 / 2 |
| `Solution` / `SolutionI18n` | 4 / 8 |

發版前的三輪驗證：① 空庫跑一次全 PASS ② **連續再跑一次**零錯誤且輸出相同（實測冪等，
不是宣稱）③ `900_drop_database.sql` 後重跑，確認可從空庫一次建置到位。
