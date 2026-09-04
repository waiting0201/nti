# `Api/` — NTI 後端 API

Azure Functions .NET 10（isolated worker + ASP.NET Core Integration）。
**單一 `RouterFunction` catch-all + 集中式 `AppRouter`**，資料存取為 EF Core（寫）＋ Dapper（讀）雙軌。

- **怎麼寫**：[`docs/10-backend-design.md`](../docs/10-backend-design.md) —— 開工前必讀，本專案的唯一施工標準
- **寫什麼**：[`docs/04-api.md`](../docs/04-api.md) —— 端點契約
- **資料表**：[`docs/08-database.md`](../docs/08-database.md)（設計）／`Api/Data/Migrations/`（**schema 權威**）
- **後台單元與權限**：[`docs/09-cms-admin.md`](../docs/09-cms-admin.md) §2、§6
- 範本專案：`/Users/tim/webapps/Jabez/Api`（同技術棧、已上線）

---

## 本機執行

```bash
# 1. 設定（第一次）
cp Api/local.settings.example.json Api/local.settings.json   # 填入 SQL 密碼與 Jwt__Secret

# 2. 本機資料庫（Docker SQL Server，collation 必須與 Azure 一致）
docker exec -i sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$SA_PW" -C -d master \
  < db/local/000_create_database.sql

# 3. 起站
cd Api && func start            # → http://localhost:7071/api/v1/{*route}
```

`routePrefix` 是 **`api/v1`**（`host.json`），所以 `docs/04` 寫的 `GET /solutions` 實際位址是
`GET /api/v1/solutions`。

冒煙測試：

```bash
curl -s localhost:7071/api/v1/health          # 200，統一信封
curl -s -i localhost:7071/api/v1/admin/news   # 401（無憑證）
```

## 結構

```
Api/
├── Functions/RouterFunction.cs   # 唯一 HTTP entry point，只做 trigger binding
├── Routing/
│   ├── AppRouter.cs              # 分派 + JWT + 授權
│   ├── AppRouter.Public.cs       # 前台路由表 + IsPublicRoute 白名單
│   └── AppRouter.Admin.cs        # 後台路由表 + 權限對照（預設拒絕）
├── Middleware/ExceptionMiddleware.cs
├── Handlers/                     # 一單元一個 <Unit>Handler.cs
├── Services/                     # 跨 Handler 的協調服務
│   └── Dapper/                   # <Unit>ReadService.cs（純讀）
├── Models/{Entities,Dtos}/
├── Data/                         # AppDbContext / Configurations / Migrations（schema 權威）
└── Common/                       # ApiResponse / AppException / ErrorCodes / Constants / Clock / …
```

## 三個一開始就會踩到的點

1. **授權是預設拒絕的。** `AppRouter.Admin.cs` 的 `GetRequiredPermission` 沒登記的 `/admin/*`
   一律 403（不是放行）。新增後台端點時要同時補路由表與權限表兩處。
   同理，前台新端點若沒補進 `AppRouter.Public.cs` 的 `IsPublicRoute`，會被要求 token。

2. **兩套身分不共用 token。** 後台 token 的 audience 是 `nti-admin`、前台會員是 `nti-web`，
   互打對方的路由一律 401。

3. **camelCase 要設兩處。** `Program.cs` 的 `Configure<JsonOptions>`（回應）與
   `ConfigureHttpJsonOptions`（`ReadFromJsonAsync`）少設一邊，就會出現半邊 PascalCase。

## 現況

已完成：

- **骨架**：統一信封與錯誤碼、例外處理、JWT（雙 audience）、集中式路由與預設拒絕授權、
  `Common/` 常數（權限碼 83／CategoryType 9／PageKey 29）、`GET /health`
- **資料層**：48 張表的 Entity 與 Configuration、`InitialSchema` Migration（schema + 種子）、
  `AppDbContext`（稽核欄位統一填寫、軟刪改寫）
- **種子**：角色 3／權限 171／分類 44(+88)／設定 15／固定頁 29(+58)／方案 4(+8)，
  由 `Data/Seed/SeedData.cs` 的 `HasData` 寫入，Id 硬編、跨環境一致

- **前台唯讀端點**（04 §3.1）：20 支，15 個單元的 Dapper ReadService + Handler

未完成：§3.2 表單（2）、§3.3 會員（4）、§3.4 後台 CRUD（24 單元）、
Blob／Email／Turnstile／rate limit 服務、三支 Timer Function、CI/CD。
進度見 [`STATUS.md`](../STATUS.md) §五。

## 本機要有東西看

各內容表剛建好是空的，端點會回 200 但都是空陣列。灌假內容：

```bash
db/tools/sqlcmd.sh NTI < db/local/920_dev_content.sql        # 每個單元一筆
db/tools/sqlcmd.sh NTI < db/local/930_dev_content_clear.sql  # 清除並還原
```

## 資料層的四個地雷（都已寫成程式碼註解）

1. **`Clock.UtcNow` 才是寫 DB 用的。** `Clock.Now` 是台北時區、只給顯示。
   混用的話上下架時間窗會整整差 8 小時（docs/08 §2.2）。

2. **預設值為 `true` 的 bool 欄位，`false` 存不進去。** `HasDefaultValue(true)` 會讓 EF
   在值等於 CLR 預設（`false`）時把整欄從 INSERT 拿掉、改用 DB 預設值——
   「先建好、暫不上架」會被靜默上架。`AppDbContext.AlwaysWriteColumnsWithDefaults` 統一修掉。

3. **EF 預設每條外鍵都建索引。** 35 條 FK 就是 35 個索引，Basic 只有 5 DTU。
   `ConfigureConventions` 移除了 `ForeignKeyIndexConvention`，索引只留 docs/08 §5 明列的 20 條。

4. **約束一定要具名。** `UseNamedDefaultConstraints()` 少了這行，DEFAULT 會拿到隨機名稱
   （`DF__HomeBanner__Sort__1B0907CE`），每個環境都不同，之後「改預設值」的 migration
   在 dev 跑得過、在 prod 炸掉。`db/verify/verify-ef.sql` 會斷言「匿名約束數 = 0」。

## Schema 怎麼驗

```bash
# 建庫（本機；Azure 由 az sql db create 建，collation 必須一致）
docker exec -i sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$SA_PW" -C -d master \
  < db/local/000_create_database.sql

cd Api && dotnet ef database update      # 或直接 func start，啟動時會自動套用

# 驗收閘：結構 11 項 + 種子 16 項
docker exec -i sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$SA_PW" -C -I -b -d NTI \
  < db/verify/verify-ef.sql            # 應輸出「verify-ef 全數 PASS。」
```

`db/migrations/` 的手寫 DDL 已降為**參考實作**：schema 的權威是 `Api/Data/Migrations/`。
兩者已逐欄逐約束比對過，除了 `SchemaVersion` ↔ `__EFMigrationsHistory` 與四個 DEFAULT
約束名稱的縮寫差異（EF 一律 `DF_<表>_<欄>`）之外完全一致。
