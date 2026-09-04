using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Nti.Api.Data;
using Nti.Api.Handlers;
using Nti.Api.Middleware;
using Nti.Api.Routing;
using Nti.Api.Services;
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

        // ── Scoped：碰 AppDbContext / IDbConnection 的一律 Scoped，沒有例外 ────
        //    誤設 Singleton 會捕獲已釋放的 DbContext，且只在高併發下才浮現（docs/10 §4.1）
        services.AddScoped<AppRouter>();
        services.AddHttpContextAccessor();

        // ── Handlers（一個單元一個，隨 P4 逐步補上）──────────────────────────
        services.AddScoped<HealthHandler>();
    })
    .Build();

// schema 權威在 Api/Data/Migrations/：啟動時套用 pending migration，CI 不另外跑（docs/10 §11）
using (var scope = host.Services.CreateScope())
{
    await scope.ServiceProvider.GetRequiredService<AppDbContext>().Database.MigrateAsync();
}

await host.RunAsync();
