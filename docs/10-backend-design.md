# 10 · 後端技術規範 Backend Design — Harness 規範書

| 欄位 | 內容 |
|------|------|
| **主責 Agent** | `backend-engineer` |
| **共責 Agent** | `system-analyst`（契約／schema／權限模型）、`code-review-optimizer`（合併前審查） |
| **搭配 Skills** | `run`、`verify`、`code-review`／`simplify`、`security-review` |
| **對應階段** | P4（後端／CMS／API 實作）／P6（會員與表單）／持續維護 |
| **核心定位** | 本文件規範**怎麼寫**；[`04-api.md`](04-api.md) 規範**寫什麼**。P4 開工後，所有後端程式碼以本文件為唯一施工標準。 |
| **範本來源** | `/Users/tim/webapps/Jabez/Api`（同技術棧、已上線）與其 `docs/backend-design.md`。凡標註「Jabez 已驗證」者為實戰結論，不再重新評估。 |

---

## 1. 上游輸入

| 來源 | 用途 |
|------|------|
| [`04-api.md`](04-api.md) | API 契約：端點清單、權限碼對照、回應信封（本文件 §5 為其實作規格） |
| [`08-database.md`](08-database.md) | 資料表 DDL、多語策略、索引、種子 —— 本文件 §8 定義如何以 EF Core 表達 |
| [`09-cms-admin.md`](09-cms-admin.md) | 24 個後台單元、上傳尺寸規則、**權限矩陣（171 列，權威來源）** |
| [`03-backend.md`](03-backend.md) | 領域範圍與模組邊界 |
| [`07-deployment.md`](07-deployment.md) | Azure 資源與部署地圖（本文件 §11 為其 CI/CD 落地） |
| [`db/README.md`](../db/README.md) | **Azure SQL Basic 相容性 checklist**（§8.6 沿用該表） |

---

## 2. 執行環境與相依

### 2.1 執行模型（關鍵分水嶺）

**Azure Functions v4 — Isolated Worker Model + ASP.NET Core Integration。**

`Program.cs` 使用 `ConfigureFunctionsWebApplication()`（**不是** `ConfigureFunctionsWorkerDefaults()`）。這個選擇決定了整套程式碼的形狀：

| | ASP.NET Core Integration（本專案） | Worker Defaults（**不用**） |
|---|---|---|
| Handler 參數 | `HttpRequest` | `HttpRequestData` |
| Handler 回傳 | `IActionResult` | `HttpResponseData` |
| 讀 body | `req.ReadFromJsonAsync<T>()` | `await new StreamReader(...)` |
| 讀 form | `req.ReadFormAsync()` → `IFormFile` | 需自行解析 multipart |
| 例外處理 | `context.GetHttpContext()` 寫回應 | `HttpResponseData` |

> ⚠️ 網路上多數 isolated worker 範例是後者。**抄範例前先確認它用的是哪一套**，混用會出現 `HttpRequestData` 無法轉型的編譯錯誤。（Jabez 已驗證）

### 2.2 專案設定

- `net10.0`、`AzureFunctionsVersion` = `v4`、`OutputType` = `Exe`
- `Nullable=enable`、`ImplicitUsings=enable`
- `RootNamespace` = `Nti.Api`
- 根目錄放 `global.json` 鎖 SDK（`10.0.1xx` + `rollForward: latestFeature`），避免不同機器 SDK 版本產出的 Migration 有差異
- `local.settings.json` 設 `CopyToPublishDirectory=Never`（見 §10）

### 2.3 套件與版本注意事項

| 套件 | 用途 | 注意 |
|---|---|---|
| `Microsoft.Azure.Functions.Worker` + `.Extensions.Http.AspNetCore` | 執行模型 | 需 AspNetCore 版才有 §2.1 的整合 |
| `Microsoft.EntityFrameworkCore.SqlServer` (10.x) | 寫入 + Migration | 見 §8.1 |
| `Dapper` (2.x) | 讀取 | 見 §8.2 |
| `Microsoft.ApplicationInsights.WorkerService` | 遙測 | **必須 2.x。3.x 在 isolated worker 會 `TypeLoadException`**（Jabez 已驗證） |
| `BCrypt.Net-Next` | 密碼雜湊 | 見 §7.4 |
| `Azure.Storage.Blobs` | 檔案 | 本機用 Azurite |
| `System.IdentityModel.Tokens.Jwt` | JWT 自簽 | 見 §7.1 |

### 2.4 `host.json`

`routePrefix` 設為 **`api/v1`**，使 §4 的 `AppRouter` 只需處理版本後的路徑，而 `04-api.md` §3 列出的 `/solutions`、`/admin/quote` 等即為對外的 `/api/v1/solutions`、`/api/v1/admin/quote`。

```jsonc
{
  "version": "2.0",
  "extensions": { "http": { "routePrefix": "api/v1" } },
  "logging": {
    "applicationInsights": {
      "samplingSettings": { "isEnabled": true, "excludedTypes": "Request" }
    }
  }
}
```

---

## 3. 目錄結構與分層鐵律

```
Api/
├── Api.csproj  host.json  Program.cs
├── local.settings.example.json      # 進版控；local.settings.json 不進
├── Functions/                       # trigger binding，僅此而已
│   ├── RouterFunction.cs            # 唯一 HTTP entry point（catch-all）
│   ├── PublishScheduleFunction.cs   # Timer：上下架排程生效
│   └── RetentionCleanupFunction.cs  # Timer：AuditLog 12 個月清除
├── Routing/
│   ├── AppRouter.cs                 # 分派 + 授權（partial class）
│   ├── AppRouter.Public.cs          # 前台唯讀路由表
│   └── AppRouter.Admin.cs           # 後台路由表 + 權限對照
├── Middleware/ExceptionMiddleware.cs
├── Handlers/                        # <Unit>Handler.cs
├── Services/                        # I<X>Service.cs + <X>Service.cs
│   └── Dapper/                      # <Unit>ReadService.cs（純讀）
├── Models/
│   ├── Entities/                    # EF Core POCO
│   └── Dtos/                        # <Unit>Dtos.cs（一單元一檔）
├── Data/
│   ├── AppDbContext.cs  AppDbContextFactory.cs
│   ├── Configurations/              # <Entity>Configuration.cs
│   └── Migrations/                  # ★ schema 權威來源
└── Common/                          # ApiResponse / AppException / Clock / Constants / Helpers
```

### 3.1 各層職責

| 層 | 路徑 | 職責 | 命名 |
|---|---|---|---|
| Function | `Functions/` | 只做 trigger binding，立刻轉交 | `RouterFunction`、`<X>Function`（Timer） |
| Router | `Routing/` | segments 拆解 → JWT 驗證 → 權限檢查 → List Pattern 分派 | `AppRouter` partial |
| Handler | `Handlers/` | HTTP 解析／參數驗證／業務協調／`ApiResponse` 包裝 | `<Unit>Handler.cs`，`<Unit>` 用 [`09-cms-admin.md` §2](09-cms-admin.md) 的單元代號 |
| Service | `Services/` | 跨 Handler 共用的業務協調（JWT／Blob／Email／Audit／Lang） | `<X>Service.cs` + `I<X>Service.cs` |
| ReadService | `Services/Dapper/` | **純讀取** SQL + DTO 投影 | `<Unit>ReadService.cs` + `I<Unit>ReadService.cs` |
| Data | `Data/` | 寫入、交易、schema | `<Entity>Configuration.cs` |
| Common | `Common/` | 純函式 static helper、常數、統一時間源 | `<X>Helper.cs`／`<X>Calculator.cs` |

### 3.2 鐵律

1. **Handler 內禁止直接寫 SQL** —— 讀走 Dapper ReadService，寫走 `AppDbContext`。
2. **ReadService 禁止寫入** —— 任何 INSERT/UPDATE/DELETE 一律 EF Core。
3. **Service 禁止回傳 HTTP** —— 只有 Handler 呼叫 `ApiResponse.Ok(...)`／`Fail(...)`。
4. **Handler 內禁止重複檢查權限碼** —— 授權集中在 `AppRouter`（§7.5）。唯一例外是欄位級可見性（目前 NTI 無此需求）。
5. **禁止引入**：Repository Pattern、In-Process Model、自訂 IoC 容器、AutoMapper。
6. 一個單元一個 Handler、一個 ReadService、一個 Dtos 檔。**單元代號逐字對應** 09 §2 與權限碼，不做單複數轉換。

---

## 4. `Program.cs` 組成

唯一的 composition root，所有註冊都在這裡手寫，**不用組件掃描**（註冊清單本身就是模組清冊，可讀性優先）。

```csharp
var host = new HostBuilder()
    .ConfigureFunctionsWebApplication(worker =>
    {
        worker.UseMiddleware<ExceptionMiddleware>();      // 包住整個 Function 執行
    })
    .ConfigureServices((ctx, services) =>
    {
        var cfg = ctx.Configuration;

        // ── 遙測：isolated worker 少了這兩行，所有 ILogger 輸出都不會進 App Insights
        services.AddApplicationInsightsTelemetryWorkerService();
        services.ConfigureFunctionsApplicationInsights();

        // ── JSON camelCase：★ 兩處都要設，少一處就會半邊 PascalCase
        services.Configure<JsonOptions>(o =>              // IActionResult 回應序列化
        {
            o.JsonSerializerOptions.PropertyNamingPolicy        = JsonNamingPolicy.CamelCase;
            o.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
        });
        services.ConfigureHttpJsonOptions(o =>            // ReadFromJsonAsync 反序列化
        {
            o.SerializerOptions.PropertyNamingPolicy        = JsonNamingPolicy.CamelCase;
            o.SerializerOptions.PropertyNameCaseInsensitive = true;
        });

        var connStr = cfg["ConnectionStrings:DefaultConnection"]
            ?? throw new InvalidOperationException("ConnectionStrings:DefaultConnection is required.");

        // ── EF Core（寫入）
        services.AddDbContext<AppDbContext>(opt =>
            opt.UseSqlServer(connStr, sql =>
            {
                sql.EnableRetryOnFailure(3);              // ★ 影響交易寫法，見 §8.1
                sql.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
            }));

        // ── Dapper（讀取）：與 EF Core 共用同一條連線字串
        services.AddScoped<IDbConnection>(_ => new SqlConnection(connStr));

        // Singleton：只讀設定、無狀態
        services.AddSingleton<IJwtService, JwtService>();
        services.AddSingleton<IBlobStorageService, BlobStorageService>();
        services.AddSingleton<IEmailService, EmailService>();
        services.AddHttpClient<ITurnstileService, TurnstileService>(c => c.Timeout = TimeSpan.FromSeconds(8));

        // Scoped：碰 AppDbContext / IDbConnection
        services.AddScoped<IAuditService, AuditService>();
        services.AddScoped<INewsReadService, NewsReadService>();
        // ... 每個單元一列
        services.AddScoped<NewsHandler>();
        // ... 每個單元一列
        services.AddScoped<AppRouter>();
        services.AddHttpContextAccessor();
    })
    .Build();

// 啟動時套用 pending migration（schema 權威，見 §8.4）
using (var scope = host.Services.CreateScope())
{
    await scope.ServiceProvider.GetRequiredService<AppDbContext>().Database.MigrateAsync();
}

await host.RunAsync();
```

### 4.1 DI 生命週期慣例

| 生命週期 | 適用 | 例 |
|---|---|---|
| `Singleton` | 只讀設定、無 per-request 狀態 | `JwtService`、`BlobStorageService`、`EmailService` |
| `Scoped` | 依賴 `AppDbContext` 或 `IDbConnection` | **所有 Handler、所有 ReadService、`AppRouter`**、`AuditService` |
| `Transient` | 不使用 | — |

> 把 `Handler` 誤設 Singleton 會捕獲已釋放的 `DbContext`，且錯誤在高併發下才浮現。**沒有例外**：碰 DB 的一律 `Scoped`。

---

## 5. 統一回應格式

> 本節是 [`04-api.md`](04-api.md) §2 的實作規格。**所有端點一律回傳此信封，禁止直接回傳裸 data。**

### 5.1 `ApiResponse<T>`

```csharp
namespace Nti.Api.Common;

public sealed class ApiResponse<T>
{
    public bool     Success   { get; init; }
    public string?  Code      { get; init; }                    // 成功時 null；失敗時為 §5.4 的錯誤碼
    public T?       Data      { get; init; }
    public string   Message   { get; init; } = string.Empty;    // 給人看
    public string[] Errors    { get; init; } = [];              // 細節（欄位驗證訊息等）
    public string   Timestamp { get; init; } = DateTimeOffset.UtcNow.ToString("o");
}

public static class ApiResponse
{
    public static ApiResponse<T> Ok<T>(T data, string message = "Success") =>
        new() { Success = true, Data = data, Message = message };

    public static ApiResponse<object?> Ok(string message = "Success") =>
        new() { Success = true, Data = null, Message = message };

    public static ApiResponse<object?> Fail(string code, string message, params string[] errors) =>
        new() { Success = false, Code = code, Data = null, Message = message, Errors = errors };
}
```

序列化後（camelCase）：

```jsonc
// 成功
{ "success": true, "code": null, "data": { ... }, "message": "Success", "errors": [], "timestamp": "..." }
// 失敗
{ "success": false, "code": "VALIDATION_REQUIRED", "data": null,
  "message": "缺少必填欄位。", "errors": ["email is required"], "timestamp": "..." }
```

> `code` 欄是 NTI 相對 Jabez 的增補，用來承接 04 §2 原訂的 `{ code, message, details }`：**`code` 給程式判斷、`message` 給人看、`errors` 放細節**。前端一律以 `code` 分支，不得比對 `message` 字串。

### 5.2 `PagedResult<T>`

```csharp
public sealed record PagedResult<T>(
    IEnumerable<T> Items, int TotalCount, int Page, int PageSize, int TotalPages);
```

### 5.3 分頁雙模式

同一 URL 兩種行為（Jabez 已驗證，省掉一組 `/lookup` 端點）：

- 帶 `page` 或 `pageSize` → `data` 為 `PagedResult<T>`
- 兩者皆無 → `data` 為平面陣列（供後台下拉選單、前台完整清單）

```csharp
int page     = int.TryParse(req.Query["page"],     out var p)  ? Math.Max(1, p)         : 1;
int pageSize = int.TryParse(req.Query["pageSize"], out var ps) ? Math.Clamp(ps, 1, 100) : 20;
```

**`pageSize` 一律 `Math.Clamp(ps, 1, 100)`，禁止無上限** —— Azure SQL Basic 只有 5 DTU，一個 `pageSize=99999` 就能拖垮全站。後台清單預設 20（[`09-cms-admin.md` §5](09-cms-admin.md)）。

### 5.4 錯誤碼值域

| `code` | HTTP | 用於 |
|---|---|---|
| `VALIDATION_REQUIRED` | 400 | 缺必填欄位 |
| `VALIDATION_FORMAT` | 400 | 格式錯誤（email、日期、slug） |
| `VALIDATION_RANGE` | 400 | 長度／數值超出範圍（SEO Title 70 字等） |
| `AUTH_INVALID_CREDENTIALS` | 401 | 帳密錯誤 |
| `AUTH_TOKEN_INVALID` | 401 | token 缺失／過期／簽章不符 |
| `AUTH_MUST_CHANGE_PASSWORD` | 403 | `MustChangePassword=1` 尚未改密碼 |
| `AUTH_ACCOUNT_INACTIVE` | 403 | 帳號停用 |
| `FORBIDDEN` | 403 | 權限碼不足（§7.5） |
| `NOT_FOUND` | 404 | 資源不存在／已軟刪／未上架 |
| `CONFLICT_DUPLICATE` | 409 | slug、`Code`、email 重複 |
| `CONFLICT_STATE` | 409 | 狀態不允許此操作（如上架但缺英文語系） |
| `UPLOAD_TYPE` | 400 | 副檔名或 magic bytes 不在白名單 |
| `UPLOAD_SIZE` | 400 | 單檔 > 20MB 或超過 5 個 |
| `UPLOAD_UNSCANNED` | 403 | `ScanStatus <> 'Clean'` 的附件下載請求 |
| `RATE_LIMITED` | 429 | 公開表單／登入頻率限制（§9.6） |
| `BOT_CHECK_FAILED` | 400 | Turnstile 驗證未通過 |
| `INTERNAL` | 500 | 未預期例外（不得洩漏堆疊） |

新增錯誤碼時同步更新本表與 `Common/ErrorCodes.cs`，並在 04 的變更紀錄補記。

---

## 6. 例外處理

### 6.1 `AppException`

```csharp
public sealed class AppException(string code, string message, int statusCode = 400) : Exception(message)
{
    public string Code       { get; } = code;
    public int    StatusCode { get; } = statusCode;

    public static AppException NotFound(string resource)  => new(ErrorCodes.NotFound, $"{resource} 不存在。", 404);
    public static AppException Unauthorized(string? d = null) => new(ErrorCodes.AuthTokenInvalid, d ?? "未授權。", 401);
    public static AppException Forbidden(string? d = null)    => new(ErrorCodes.Forbidden, d ?? "權限不足。", 403);
    public static AppException BadRequest(string code, string detail) => new(code, detail, 400);
    public static AppException Conflict(string code, string detail)   => new(code, detail, 409);
}
```

**禁止 `throw new Exception(...)`** —— 沒有 code、沒有 status，只會變成 500。

### 6.2 `ExceptionMiddleware`

`IFunctionsWorkerMiddleware`（worker 層，**不是** ASP.NET Core middleware），透過 `context.GetHttpContext()` 寫回應：

- `AppException` → `LogWarning` + 對應 status + 其 `Code`
- `InvalidOperationException` 且訊息含 `Incorrect Content-Type` → 400 `UPLOAD_TYPE`。這是 `ReadFormAsync` 對非 multipart 請求的行為，必須單獨接住否則會變 500（Jabez 已驗證）
- 其他 → `LogError` + 500 `INTERNAL`，**對外只回通用訊息**，細節只進 App Insights
- 寫回應前檢查 `httpContext.Response.HasStarted`

---

## 7. 認證與授權

### 7.1 JWT 自簽

使用自寫 `JwtService`（HS256），**不接 `AddAuthentication().AddJwtBearer()`** —— isolated worker 的 middleware pipeline 與 ASP.NET Core 不同，自己驗證比接管線可控（Jabez 已驗證）。

要點：
- `JwtSecurityTokenHandler { MapInboundClaims = false }`，保持 claim 原名（`sub`／`name`／`email`）
- `TokenValidationParameters` 全開（issuer／audience／lifetime／signing key），`ClockSkew = 30s`
- 驗證失敗一律回 `null`，由呼叫端轉 401，**不讓例外冒出**

### 7.2 兩套身分（NTI 特有）

Jabez 只有內部員工一種身分；NTI 有**後台管理員**與**前台會員**兩種，必須分離：

| | 後台 | 前台會員（P6） |
|---|---|---|
| 資料表 | `AdminUser` / `Role` / `RolePermission` | `Member` / `MemberToken` |
| audience | `nti-admin` | `nti-web` |
| claims | `roles`、`permissions`、`is_superadmin` | `member_id`，無權限碼 |
| 可達路由 | `/admin/*` | `/me/*`、需登入的 `/supplier/downloads/{id}/hit` |

**`AppRouter` 依 audience 判定**：會員 token 打 `/admin/*` 一律 403，反之亦然。

### 7.3 Token 生命週期

- access token：`Jwt__ExpiryMinutes`（後台 60、前台會員 120）
- refresh token：`Convert.ToBase64String(RandomNumberGenerator.GetBytes(64))` 的不透明字串，存 DB
- **rotation**：每次 refresh 撤銷舊 token（`IsRevoked=1`）並發新的一對；偵測到已撤銷 token 被重用 → 撤銷該使用者全部 token
- 前台會員的 email 驗證／密碼重設 token 走 `MemberToken`，一次性、帶到期時間

### 7.4 密碼

- `BCrypt.Net.BCrypt.HashPassword` / `.Verify`，work factor 用預設
- 後台**永不回傳也永不可設定會員密碼**（[`03-backend.md`](03-backend.md) §3）；只能觸發重設信
- 正式環境第一位超管由部署流程建立：隨機密碼 + 啟用信 + `MustChangePassword=1`
- 登入失敗訊息不區分「帳號不存在」與「密碼錯誤」，一律 `AUTH_INVALID_CREDENTIALS`

### 7.5 授權集中在 Router：**預設拒絕**

```csharp
private static string? GetRequiredPermission(string method, string[] segments) =>
    (method, segments) switch
    {
        ("GET",            ["admin", "news", ..])  => PermissionCodes.NewsView,
        ("POST",           ["admin", "news"])      => PermissionCodes.NewsEdit,
        ("PUT" or "PATCH", ["admin", "news", _])   => PermissionCodes.NewsEdit,
        ("DELETE",         ["admin", "news", _])   => PermissionCodes.NewsDelete,
        // ... 24 個單元逐條
        _ => DenySentinel,      // ★ 未列出的 /admin/* 一律拒絕
    };
```

> Jabez 此處的預設是 `_ => null`（＝登入即可），其文件自承是已知風險。**NTI 改為預設拒絕**：新增 `/admin/*` 端點若忘了補權限表，會直接 403 而不是靜默放行。非 `/admin/*` 的公開路由走 `IsPublicRoute` 白名單，不經此表。

`RequirePermission` 檢查 `permissions` claim；`is_superadmin=true` 自動通過。權限碼值域＝[`09-cms-admin.md` §6](09-cms-admin.md) 的 171 列，與 `db/seed/110_role_permission.sql` 逐字對應（§9.2）。

### 7.6 公開路由白名單

`IsPublicRoute` 對應 [`04-api.md`](04-api.md) §3.1／§3.2 的前台唯讀端點與兩支表單端點。白名單是**列舉式**，新增前台端點時必須補進去，否則會要求 token。

---

## 8. 資料存取（EF Core 寫 + Dapper 讀）

> **2026-09-02 決策**：資料存取由原訂的 Dapper 單軌改為雙軌，**schema 權威來源為 `Api/Data/Migrations/`**。`db/` 目錄降為參考實作與交付腳本（見 [`db/README.md`](../db/README.md)）。

### 8.1 寫入：EF Core

- Entity 為單純 POCO，設定全寫在 `Data/Configurations/<Entity>Configuration.cs`，由 `ApplyConfigurationsFromAssembly` 自動套用
- `AppDbContextFactory`（`IDesignTimeDbContextFactory`）供 `dotnet ef` 使用
- **交易必須包 execution strategy**：因為啟用了 `EnableRetryOnFailure`，直接 `BeginTransactionAsync` 會被擋下（Jabez 已驗證）

```csharp
var strategy = db.Database.CreateExecutionStrategy();
await strategy.ExecuteAsync(async () =>
{
    await using var tx = await db.Database.BeginTransactionAsync();
    // ... 多表寫入（例如主表 + 兩筆 i18n）
    await db.SaveChangesAsync();
    await tx.CommitAsync();
});
```

### 8.2 讀取：Dapper ReadService

```csharp
public sealed class NewsReadService(IDbConnection db) : INewsReadService
{
    private const string BaseSelect = """
        SELECT n.Id, n.CategoryId, n.CoverImagePath, n.PublishDate, n.SortOrder,
               i.Title, i.Slug, i.Summary, i.SeoTitle, i.SeoDescription, i.CanonicalUrl
        FROM News n
        INNER JOIN NewsI18n i ON i.NewsId = n.Id AND i.Lang = @Lang
        """;

    /// <summary>前台可見性條件，所有公開查詢共用（避免條件漂移）</summary>
    private const string PublicFilter = """
        WHERE n.IsDeleted = 0 AND n.IsPublished = 1
          AND (n.PublishAt   IS NULL OR n.PublishAt   <= @Now)
          AND (n.UnpublishAt IS NULL OR n.UnpublishAt >  @Now)
        """;

    public async Task<PagedResult<NewsListDto>> GetPagedAsync(string lang, int page, int pageSize)
    {
        var p = new { Lang = lang, Now = Clock.Now, Skip = (page - 1) * pageSize, Take = pageSize };
        var countSql = $"SELECT COUNT(*) FROM News n INNER JOIN NewsI18n i ON i.NewsId = n.Id AND i.Lang = @Lang {PublicFilter}";
        var sql = $"""
            {BaseSelect}
            {PublicFilter}
            ORDER BY n.PublishDate DESC, n.Id DESC
            OFFSET @Skip ROWS FETCH NEXT @Take ROWS ONLY
            """;
        int total = await db.ExecuteScalarAsync<int>(countSql, p);
        var rows  = await db.QueryAsync<NewsListDto>(sql, p);
        return new PagedResult<NewsListDto>(rows, total, page, pageSize,
            Math.Max(1, (int)Math.Ceiling((double)total / pageSize)));
    }
}
```

規則：
- SQL 一律 `const string` raw string literal，**完全參數化**，禁止字串串接使用者輸入
- 共用片段（可見性條件、關鍵字篩選）抽成 `const` 或 `BuildXxxFilter()`，避免「清單看得到、詳細頁 404」這類條件漂移
- 分頁一律 `OFFSET/FETCH NEXT` + 另跑 `COUNT(*)`
- 介面放成對的 `I<Unit>ReadService.cs`

### 8.3 多語（NTI 特有，Jabez 無先例）

- 可翻譯文字在 `{Entity}I18n`，PK = (`{Entity}Id`, `Lang`)，`Lang` 值域 `'zh'` / `'en'`
- **語系解析**：`?lang=` 優先，其次 `Accept-Language`，皆無則 `'zh'`。集中在 `Common/LangResolver.cs`，Handler 呼叫一次後往下傳，**不讓 ReadService 自己讀 `HttpRequest`**
- **缺語系不 fallback**（[`08-database.md`](08-database.md) §2.5）→ 前台查詢一律 **`INNER JOIN` i18n 子表**，該語系無資料即不出現在清單、詳細頁回 404 `NOT_FOUND`
- 後台查詢相反：用 `LEFT JOIN` 兩語系，供「中英完成度 badge」與雙分頁編輯（09 §5.3）
- 上架時檢查兩語系齊備，缺則 409 `CONFLICT_STATE`
- slug 唯一鍵是 `(Lang, Slug)`，中英可不同網址；`hreflang` 由同一 `Id` 的兩筆 i18n 推導，不落欄位

### 8.4 稽核與上下架欄位的統一填法

override `SaveChangesAsync`，集中填 [`08-database.md`](08-database.md) §2.3 的稽核五欄：

- 新增 → `CreatedAt = Clock.Now`、`CreatedBy = 目前 AdminUser.Id`
- 修改 → `UpdatedAt` / `UpdatedBy`
- 刪除 → 一律**軟刪**（`IsDeleted = 1`），禁止 `Remove()` 硬刪內容表
- 目前使用者由 `IHttpContextAccessor` 取 `sub` claim

前台所有查詢共用 §8.2 的 `PublicFilter`。

### 8.5 08-database 既有規格如何以 EF Core 表達

| 08／`db/` 的規格 | EF Core Configuration 寫法 |
|---|---|
| 所有約束具名（`PK_`／`FK_`／`UQ_`／`CK_`／`DF_`） | `HasConstraintName(...)`、`HasCheckConstraint("CK_...", "...")`、`HasDefaultValue`／`HasDefaultValueSql` 後於 Migration 內指定名稱 |
| Category 型別安全的 9 條 PERSISTED 常數計算欄 | `Property(x => x.CategoryTypeGuard).HasComputedColumnSql("'News'", stored: true)` + `HasOne().WithMany().HasForeignKey(x => new { x.CategoryId, x.CategoryTypeGuard })` |
| filtered unique index（`UX_Vlog_MainFeature`、可為 NULL 的 `Code`） | `HasIndex(...).IsUnique().HasFilter("[Code] IS NOT NULL")` |
| 定序 `Latin1_General_100_CI_AS_SC` | 資料庫由 `az sql db create --collation` 建立；Migration 不改定序 |
| 種子：角色 3／權限 171／Category 44／SiteSetting 15／Page 29／Solution 4 | `HasData(...)` 寫在各自的 Configuration，**Id 固定硬編**（跨環境一致，對日後內容遷移對照與 hotfix SQL 很重要） |
| 時間欄 `DATETIME2(0)` 存 UTC | `HasColumnType("datetime2(0)")` |
| 狀態欄 `VARCHAR(20)` + `CHECK` | `HasColumnType("varchar(20)")` + `HasCheckConstraint` |
| `SchemaVersion` 表 | 由 EF 的 `__EFMigrationsHistory` 取代；`db/` 版保留供交付腳本使用 |

### 8.6 Azure SQL Basic 相容性

**[`db/README.md`](../db/README.md) 的「Azure SQL 相容性 checklist」（禁用語法表 + 預設值差異表）繼續適用**，只是檢查對象從手寫 `.sql` 換成 EF Migration 產出的 SQL。

每次 `dotnet ef migrations add` 後**必須**跑一次 `dotnet ef migrations script` 並逐條對照該表 —— 特別是 `CREATE INDEX ... WITH (ONLINE = ON)`（Basic 不支援）與資料壓縮相關選項。本機容器是 Developer Edition，這些在本機都跑得過。

### 8.7 效能底線（Basic 5 DTU）

- 索引寧缺勿濫（[`08-database.md`](08-database.md) §5）
- 禁止 N+1：清單頁的關聯資料在同一支 SQL 用 JOIN 取回，或一次 `QueryMultiple`
- 前台內容頁由 Next.js ISR 承接流量，API 不承擔每次請求（[`03-backend.md`](03-backend.md) §7）
- 後台清單一律分頁

---

## 9. 橫切關注

### 9.1 時間

`Common/Clock.cs` 提供 `Clock.Now`（Asia/Taipei）。**業務邏輯禁用 `DateTime.Now` / `DateTime.UtcNow`** —— 例外只有 JWT 有效期、DB 預設值、cron 判定三處。上下架排程與 `PublishDate` 比較全走 `Clock.Now`。

### 9.2 常數

`Common/Constants.cs` 內以 static class 分組：

| class | 內容 | 權威來源 |
|---|---|---|
| `PermissionCodes` | 171 列權限碼 | [`09-cms-admin.md` §6](09-cms-admin.md) ＝ `db/seed/110_role_permission.sql` |
| `RoleNames` | 超級管理員／內容編輯／檢視者 | 09 §6 |
| `CategoryTypes` | 九種 `CategoryType` | [`08-database.md`](08-database.md) §4.1 |
| `PageKeys` | 29 個固定頁 key | 08 §4／`db/seed/140_page.sql` |
| `QuoteStatuses` | `New/InProgress/Quoted/Closed/Spam` | [`03-backend.md`](03-backend.md) §3 |
| `ContactStatuses` | `New/Replied/Closed/Spam` | 03 §3 |
| `ErrorCodes` | §5.4 全表 | 本文件 |

**這些字串在程式中不得再出現字面值。**

### 9.3 AuditLog

[`09-cms-admin.md`](09-cms-admin.md) §5.8 要求所有 `/admin/*` 寫入操作記錄稽核。**在 `AppRouter` 分派完成後統一寫入**，而非每個 Handler 各寫一次：

- 觸發條件：`method` 為 POST/PUT/PATCH/DELETE 且路徑為 `/admin/*` 且回應 2xx
- 記錄：`AdminUserId`、`Action`（`method + 路徑`）、`TargetTable`／`TargetId`、`Ip`、`UserAgent`、`CreatedAt`
- **另有三個唯讀但須稽核的動作**（04 §3.4）：`GET /admin/quote/export`、`GET /admin/quote/{id}/attachments/{attId}`、`POST /admin/audit/emails/{id}/resend` —— 在 Router 的稽核判定加白名單
- 保留 12 個月，由 `RetentionCleanupFunction`（Timer）清除

### 9.4 EmailLog

`POST /quotes`、`POST /contacts` 的業務通知信與客戶確認信，**寄送結果一律寫 `EmailLog`**（成功與失敗都寫）。寄信失敗**不得讓表單提交失敗** —— 表單資料先落庫、回 200，寄信失敗只記 log 並允許後台 `POST /admin/audit/emails/{id}/resend` 重寄。

### 9.5 檔案上傳

流程（[`09-cms-admin.md`](09-cms-admin.md) §3 為尺寸與格式權威）：

1. `req.ReadFormAsync()` → `IFormFile`
2. 副檔名白名單（報價設計稿：PDF/AI/PSD/JPG/PNG/ZIP；後台圖片：JPG/PNG/WebP/SVG 依單元）
3. 大小：報價附件單檔 ≤20MB、最多 5 個；後台圖片依 09 §3
4. **magic bytes 驗證**（`Common/FileSignatureValidator.cs`）—— 只信任檔頭，不信任 `Content-Type` 與副檔名（Jabez 已驗證，防偽造）
5. 上傳 Blob，路徑 `{container}/{yyyy}/{MM}/{guid}{ext}`
6. 影像另存 WebP 衍生檔、原檔保留；命名慣例 `{原檔名}.webp` 同目錄（補上 `db/README.md` 已知缺口 #4）
7. 報價附件寫 `QuoteAttachment.ScanStatus = 'Pending'`，掃描後更新

**所有 Blob 容器一律 private**（`PublicAccessType.None`），前端經後端代理路由 `/files/{container}/{*path}` 取檔，避開 403/CORS 並可施加授權（附件下載需 `quote.download` 且 `ScanStatus = 'Clean'`）。

### 9.6 公開端點防護（NTI 特有）

Jabez 是內網 ERP，無此需求；NTI 的 `/quotes`、`/contacts`、`/auth/*` 對外開放：

- **Turnstile**：前端取 token，後端 `TurnstileService` 呼叫 siteverify 驗證後才處理。失敗回 400 `BOT_CHECK_FAILED`。（repo 內有 `turnstile-spin` skill 可用於建置）
- **Rate limit**：以 IP + 端點為鍵，公開表單 10 次／小時、登入 5 次／15 分鐘。Consumption plan 無共享記憶體，**狀態存 DB 或 Blob**，不要用 `MemoryCache`（多實例會失效）。超限回 429 `RATE_LIMITED`
- 隱私同意：`consent` 為必填，伺服器端另記 `ConsentAt`／IP／UA／來源語系
- 表單回應**不回傳內部 Id**，只回 `quoteNo`（`Q20260901-0001`）

### 9.7 CORS

程式內只處理 `OPTIONS → new OkResult()`；實際 allow-list 在平台層：

- 本機：`local.settings.json` 的 `Host.CORS`
- 正式：Function App → CORS，**兩個 origin**（公開站 SWA domain、CMS SPA domain）。禁用 `*`（會員與後台端點帶憑證）

### 9.8 快取標頭

前台唯讀端點供 Next.js ISR 消費，回應帶 `Cache-Control: public, max-age=0, s-maxage=300, stale-while-revalidate=600`；`/site-settings`、`/categories` 這類低頻異動可拉長 `s-maxage`。後台與會員端點一律 `Cache-Control: no-store`。

### 9.9 排程（Timer Trigger）

Azure SQL 無 Agent Job，排程一律走 Functions Timer。cron 由 app setting 注入（`"%PublishScheduleCron%"`），並遵守：**時間窗判定 + DB 冪等閘 + `IsPastDue` 時不 return**（Flex/Consumption 冷啟動會延遲觸發；Jabez 已驗證）。

| Function | 工作 |
|---|---|
| `PublishScheduleFunction` | `PublishAt`／`UnpublishAt` 到期生效 |
| `RetentionCleanupFunction` | `AuditLog` 保留 12 個月；`EmailLog` 保留期**待定**（`db/README.md` 已知缺口 #3） |
| `OrphanMediaFunction` | 孤兒檔清除。**必須額外解析所有 `*Html` 欄位內的 `<img src>`**，否則會誤刪內文插圖（`db/README.md` 已知缺口 #2） |

### 9.10 Logging

`ILogger<T>` 建構式注入 + Application Insights。**日誌不得寫入密碼、token、完整 email、附件內容**。`host.json` 設取樣（`excludedTypes: "Request"`）。

---

## 10. 設定管理

- 本機：`local.settings.json`（**不進版控**）＋ `local.settings.example.json`（**進版控**，只有 key 與假值）
- 正式：Azure Function App → Configuration → Application Settings，**key 名稱完全相同**
- **雙底線慣例**：`Jwt__Secret` ↔ `IConfiguration["Jwt:Secret"]`
- 連線字串用 `cfg["ConnectionStrings:DefaultConnection"]`（EF Core 與 Dapper 共用同一條）
- **不使用 Key Vault**（本期規模不需要，成本與維運複雜度不划算）

| Key 群組 | 內容 |
|---|---|
| `ConnectionStrings__DefaultConnection` | Azure SQL |
| `Jwt__Secret` / `__Issuer` / `__AudienceAdmin` / `__AudienceWeb` / `__ExpiryMinutes` / `__RefreshExpiryDays` | §7 |
| `Smtp__Host` / `__Port` / `__User` / `__Password` / `__From` | 通知信 |
| `BlobStorageConnection` | §9.5，本機為 Azurite |
| `Turnstile__SecretKey` | §9.6 |
| `PublishScheduleCron` / `RetentionCleanupCron` / `OrphanMediaCron` | §9.9 |
| `Cors__AllowedOrigins` | 參考用；實際生效在平台層 |

**任何金鑰不得出現在前端**（04 §5 DoD）。

---

## 11. 部署

詳見 [`07-deployment.md`](07-deployment.md)；本節只定 API 這一段的 CI/CD 形狀。

- GitHub Actions，觸發於 `Api/**` 變更
- **OIDC 聯合身分登入**（`permissions: id-token: write` + `azure/login@v2`），**不用 publish profile** —— Flex Consumption 不支援（Jabez 已驗證）
- `dotnet publish -c Release -o ./output` → `Azure/functions-action@v1`
- **分支即環境**：`staging` → staging Function App，`master` → 正式
- Migration **不在 CI 跑**，由 `Program.cs` 啟動時 `MigrateAsync()` 套用
- 部署後跑 `db/verify/verify.sql` 作為 schema 驗收閘（§8.6）

---

## 12. Coding Style Checklist

> `code-review` / `simplify` skill 的審查依據。PR 合併前逐條確認。

- [ ] `dotnet build` **0 errors / 0 warnings**
- [ ] 所有端點回傳 `ApiResponse<T>`，無裸 data、無裸字串
- [ ] 失敗回應帶 §5.4 的 `code`；新錯誤碼已補進本文件與 `ErrorCodes.cs`
- [ ] 清單端點有分頁且 `pageSize` 有 `Math.Clamp(ps, 1, 100)` 上限
- [ ] Handler 內無 SQL；ReadService 內無寫入；Service 內無 `IActionResult`
- [ ] Handler 內無權限碼檢查（授權在 Router）；新 `/admin/*` 端點已補進 `GetRequiredPermission`
- [ ] 所有 SQL 完全參數化，無字串串接使用者輸入
- [ ] 無 `DateTime.Now` / `DateTime.UtcNow`（JWT／DB 預設值／cron 除外）
- [ ] 無字面值狀態碼／權限碼／`CategoryType`／`PageKey`（一律用 `Constants`）
- [ ] 前台查詢帶 `PublicFilter`（`IsDeleted` + `IsPublished` + 上下架時間窗）
- [ ] 前台 i18n 用 `INNER JOIN`（不 fallback）；後台用 `LEFT JOIN`
- [ ] 內容刪除為軟刪，非 `Remove()`
- [ ] 多表寫入包在 `CreateExecutionStrategy()` + transaction 內
- [ ] 上傳有副檔名白名單 + 大小限制 + **magic bytes 驗證**
- [ ] 公開寫入端點有 Turnstile + rate limit
- [ ] `/admin/*` 寫入操作有 AuditLog
- [ ] 新增／修改端點已同步更新 [`04-api.md`](04-api.md) §3 與 OpenAPI，並補變更紀錄
- [ ] `dotnet ef migrations script` 已對照 §8.6 的 Azure SQL Basic checklist
- [ ] 日誌無密碼／token／個資

---

## 13. 已知取捨與待決

| 項目 | 現況 | 待決 |
|---|---|---|
| **OpenAPI** | Jabez 無 Swagger，靠手寫 `docs/api-routes.md`。但 04 §5 DoD 要求「OpenAPI 為單一事實來源」 | 決定：手寫 `openapi.yaml` 進版控，或引入 `Microsoft.Azure.Functions.Worker.Extensions.OpenApi`（catch-all 路由下自動產生能力有限）。**P1 契約凍結前需定案** |
| **`AppRouter` 檔案膨脹** | Jabez 的 `AppRouter.cs` 已達 62KB | NTI 端點量約其 1/3，先拆 `AppRouter.Public.cs` / `AppRouter.Admin.cs` 兩個 partial 即可 |
| **測試專案** | Jabez 完全沒有測試，靠 checklist 人工自檢 | NTI 是否補單元測試（至少涵蓋權限判定表與 `PublicFilter`）待定 |
| **Rate limit 儲存** | Consumption 多實例，`MemoryCache` 不可用 | 用 DB 表或 Blob；若量小可先用 DB，上線後看 DTU 再評估 |
| **`db/` 與 EF Migration 的搬遷** | `db/` 現有 3 支 migration + 6 支 seed + 24 項 verify 斷言 | 搬遷為 `Configuration` + `HasData` 屬 P4 第一項工作；`verify.sql` 保留為驗收閘 |
| **`EmailLog` 保留期** | 未定義 | 需客戶確認（`db/README.md` 已知缺口 #3） |

---

## 變更紀錄

| 日期 | 修改者 | 摘要 |
|------|--------|------|
| 2026-09-02 | Tim（Claude Code） | 初版：以 `/Users/tim/webapps/Jabez/Api` 及其 `docs/backend-design.md` 為範本，建立 NTI 後端技術規範。定案四項：資料存取改 **EF Core 寫 + Dapper 讀**雙軌、路由改**集中式 `AppRouter`**、schema 權威改 **EF Migration**、授權**預設拒絕**。補齊 04 缺口：成功回應信封、錯誤碼值域、分頁回應形狀。新增 Jabez 無先例的 NTI 特有規範：多語 i18n 查詢、兩套身分、CORS 雙 origin、Turnstile／rate limit、快取標頭、AuditLog／EmailLog 慣例 |

*最後更新：2026-09-02*
