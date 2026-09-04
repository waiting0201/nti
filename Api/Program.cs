using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Nti.Api.Common;
using Nti.Api.Data;
using Microsoft.Extensions.Configuration;
using Nti.Api.Data.Seed;
using Nti.Api.Handlers;
using Nti.Api.Handlers.Admin;
using Nti.Api.Middleware;
using Nti.Api.Routing;
using Nti.Api.Services;
using Nti.Api.Services.Dapper;
using System.Data;
using System.Text.Json;

// 唯一的 composition root（docs/10 §4）：所有註冊都在這裡手寫，不用組件掃描——
// 註冊清單本身就是模組清冊。
var host = new HostBuilder()
    // ConfigureFunctionsWebApplication（ASP.NET Core Integration），不是 ConfigureFunctionsWorkerDefaults。
    // 這個選擇決定整套程式碼的形狀：Handler 收 HttpRequest、回 IActionResult（docs/10 §2.1）。
    .ConfigureFunctionsWebApplication(worker =>
    {
        worker.UseMiddleware<ExceptionMiddleware>();
    })
    .ConfigureServices((ctx, services) =>
    {
        var cfg = ctx.Configuration;

        // ── 遙測 ─────────────────────────────────────────────────────────────
        // isolated worker 少了這兩行，程式裡所有 ILogger 輸出都不會進 App Insights，
        // 正式站的 log 會長期是空的（Jabez 實戰教訓）。取樣設定在 host.json。
        services.AddApplicationInsightsTelemetryWorkerService();
        services.ConfigureFunctionsApplicationInsights();

        // ── JSON camelCase：兩處都要設，少一處就會半邊 PascalCase ────────────
        services.Configure<JsonOptions>(o =>          // IActionResult 回應序列化
        {
            o.JsonSerializerOptions.PropertyNamingPolicy        = JsonNamingPolicy.CamelCase;
            o.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
        });
        services.ConfigureHttpJsonOptions(o =>        // ReadFromJsonAsync 反序列化
        {
            o.SerializerOptions.PropertyNamingPolicy        = JsonNamingPolicy.CamelCase;
            o.SerializerOptions.PropertyNameCaseInsensitive = true;
        });

        var connStr = cfg["ConnectionStrings:DefaultConnection"]
            ?? throw new InvalidOperationException("ConnectionStrings:DefaultConnection is required.");

        // ── EF Core（寫入 + Migration）────────────────────────────────────────
        services.AddDbContext<AppDbContext>(opt =>
            opt.UseSqlServer(connStr, sql =>
            {
                // 啟用重試會擋下裸的 BeginTransactionAsync，
                // 多表寫入一律包在 CreateExecutionStrategy() 內（docs/10 §8.1）
                sql.EnableRetryOnFailure(3);
                sql.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
            }));

        // ── Dapper（讀取）：與 EF Core 共用同一條連線字串 ──────────────────────
        services.AddScoped<IDbConnection>(_ => new SqlConnection(connStr));

        // ── Singleton：只讀設定、無 per-request 狀態 ──────────────────────────
        services.AddSingleton<IJwtService, JwtService>();
        services.AddSingleton<IPasswordHasher, PasswordHasher>();
        services.AddSingleton<IBlobStorageService, BlobStorageService>();

        // 顯式短 timeout：Turnstile 正常 < 1s，異常時寧可快速失敗也不要讓表單卡住
        services.AddHttpClient<ITurnstileService, TurnstileService>(c => c.Timeout = TimeSpan.FromSeconds(8));

        // ── Scoped：碰 AppDbContext / IDbConnection 的一律 Scoped，沒有例外 ────
        //    誤設 Singleton 會捕獲已釋放的 DbContext，且只在高併發下才浮現（docs/10 §4.1）
        services.AddScoped<AppRouter>();
        services.AddHttpContextAccessor();
        services.AddScoped<IAuditService, AuditService>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<IRateLimitService, RateLimitService>();
        services.AddScoped<IQuoteNumberGenerator, QuoteNumberGenerator>();

        // ── Dapper 讀取服務（一單元一支，Scoped：依賴 IDbConnection）────────
        services.AddScoped<ICategoryReadService, CategoryReadService>();
        services.AddScoped<ISiteSettingReadService, SiteSettingReadService>();
        services.AddScoped<IHomeBannerReadService, HomeBannerReadService>();
        services.AddScoped<ISolutionReadService, SolutionReadService>();
        services.AddScoped<IProjectReadService, ProjectReadService>();
        services.AddScoped<INewsReadService, NewsReadService>();
        services.AddScoped<IVlogReadService, VlogReadService>();
        services.AddScoped<IFaqReadService, FaqReadService>();
        services.AddScoped<ITrendReadService, TrendReadService>();
        services.AddScoped<ICertificationReadService, CertificationReadService>();
        services.AddScoped<IClientReadService, ClientReadService>();
        services.AddScoped<IFacilityReadService, FacilityReadService>();
        services.AddScoped<IJobReadService, JobReadService>();
        services.AddScoped<ISupplierReadService, SupplierReadService>();
        services.AddScoped<IPageReadService, PageReadService>();

        // ── Handlers（一個單元一個，隨 P4 逐步補上）──────────────────────────
        services.AddScoped<HealthHandler>();
        services.AddScoped<ContentHandler>();
        services.AddScoped<SolutionHandler>();
        services.AddScoped<ProjectHandler>();
        services.AddScoped<NewsHandler>();
        services.AddScoped<VlogHandler>();
        services.AddScoped<FaqHandler>();
        services.AddScoped<TrendHandler>();
        services.AddScoped<CertificationHandler>();
        services.AddScoped<ClientHandler>();
        services.AddScoped<FacilityHandler>();
        services.AddScoped<JobHandler>();
        services.AddScoped<SupplierHandler>();
        services.AddScoped<PageHandler>();
        services.AddScoped<SettingHandler>();
        services.AddScoped<CategoryHandler>();

        // 認證與公開表單（04-api §3.2、§3.3）
        services.AddScoped<AuthHandler>();
        services.AddScoped<MemberHandler>();
        services.AddScoped<FormHandler>();

        // 後台 24 個單元（04-api §3.4）
        services.AddScoped<AdminDashboardHandler>();
        services.AddScoped<AdminHomeBannerHandler>();
        services.AddScoped<AdminSolutionHandler>();
        services.AddScoped<AdminSolutionItemHandler>();
        services.AddScoped<AdminProjectHandler>();
        services.AddScoped<AdminNewsHandler>();
        services.AddScoped<AdminVlogHandler>();
        services.AddScoped<AdminFaqHandler>();
        services.AddScoped<AdminTrendHandler>();
        services.AddScoped<AdminCertificationHandler>();
        services.AddScoped<AdminClientHandler>();
        services.AddScoped<AdminFacilityHandler>();
        services.AddScoped<AdminJobHandler>();
        services.AddScoped<AdminSupplierNoticeHandler>();
        services.AddScoped<AdminSupplierSpecHandler>();
        services.AddScoped<AdminSupplierDownloadHandler>();
        services.AddScoped<AdminPageHandler>();
        services.AddScoped<AdminRedirectHandler>();
        services.AddScoped<AdminFormHandler>();
        services.AddScoped<AdminMemberHandler>();
        services.AddScoped<AdminOrderHandler>();
        services.AddScoped<AdminSettingHandler>();
        services.AddScoped<AdminCategoryHandler>();
        services.AddScoped<AdminAccountHandler>();
        services.AddScoped<AdminAuditHandler>();
        services.AddScoped<AdminMediaHandler>();
    })
    .Build();

// Dapper 的 DateOnly 對應（DATE 欄位）。少了這行，有資料的查詢會在執行期炸
// 「Error parsing column」，而且空結果集不會觸發——最容易漏到上線才發現的那種。
DateOnlyTypeHandler.Register();

// schema 權威在 Api/Data/Migrations/：啟動時套用 pending migration，CI 不另外跑（docs/10 §11）
using (var scope = host.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();

    // 第一位超管由部署流程建立（docs/10 §7.4）：只在 AdminUser 表是空的時候動作，
    // 旗標忘了關也不會覆蓋既有帳號。跑完請把 BOOTSTRAP_SUPERADMIN 關掉。
    await SuperAdminBootstrapper.RunAsync(
        db,
        scope.ServiceProvider.GetRequiredService<IConfiguration>(),
        scope.ServiceProvider.GetRequiredService<IPasswordHasher>());
}

await host.RunAsync();
