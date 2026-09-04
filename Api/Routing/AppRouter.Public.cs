using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Nti.Api.Routing;

/// <summary>
/// 前台路由表（04-api §3.1 唯讀內容、§3.2 表單、§3.3 會員）。
/// <para>
/// <see cref="IsPublicRoute"/> 是<b>列舉式</b>白名單：新增前台端點時必須同時補進來，
/// 否則會被要求 token（docs/10 §7.6）。會員端點（<c>/me/*</c>）刻意不在白名單內。
/// </para>
/// </summary>
public sealed partial class AppRouter
{
    /// <summary>公開路由（不需 JWT）。</summary>
    private static bool IsPublicRoute(string method, string[] segments) =>
        (method, segments) is
            ("GET", ["health"]);

    /// <summary>前台分派；無對應路由回 null 交給下一張表。</summary>
    private Task<IActionResult?> RoutePublicAsync(HttpRequest req, string method, string[] segments) =>
        Task.FromResult<IActionResult?>((method, segments) switch
        {
            ("GET", ["health"]) => health.Get(),

            _ => null,
        });
}
