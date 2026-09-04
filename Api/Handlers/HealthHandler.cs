using Microsoft.AspNetCore.Mvc;
using Nti.Api.Common;

namespace Nti.Api.Handlers;

/// <summary>存活檢查。公開端點，刻意不碰 DB——Azure SQL Basic 只有 5 DTU，健康檢查不該吃它。</summary>
public sealed class HealthHandler
{
    public IActionResult Get() =>
        new OkObjectResult(ApiResponse.Ok(new
        {
            status  = "healthy",
            service = "nti-api",
            version = typeof(HealthHandler).Assembly.GetName().Version?.ToString() ?? "unknown",
            time    = Clock.Now.ToString("yyyy-MM-dd HH:mm:ss"),
        }));
}
