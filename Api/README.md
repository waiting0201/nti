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

已完成：專案骨架、統一信封與錯誤碼、例外處理、JWT（雙 audience）、集中式路由與預設拒絕授權、
`Common/` 常數（權限碼 83／CategoryType 9／PageKey 29）、`AppDbContext`（稽核欄位統一填寫、
軟刪改寫）、`GET /health`。

未完成：**Entity 與 EF Migration**（schema 權威，`Data/Migrations/` 尚未建立）、
所有業務端點（04 §3.1 前台 18／§3.2 表單 2／§3.3 會員 4／§3.4 後台 24 單元）、
Blob／Email／Turnstile／rate limit 服務、三支 Timer Function、CI/CD。
進度見 [`STATUS.md`](../STATUS.md) §五。
