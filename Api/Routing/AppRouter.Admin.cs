using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Nti.Api.Routing;

/// <summary>
/// 後台路由表與權限對照（04-api §3.4、docs/09 §2 的 24 個單元）。
/// <para>
/// <see cref="GetRequiredPermission"/> <b>預設拒絕</b>：新增 <c>/admin/*</c> 端點若忘了在這裡登記，
/// 會直接 403 而不是靜默放行。路徑中的 <c>{unit}</c> 一律用 docs/09 §2 的單元代號原字串
/// （單數、含連字號），與權限碼 <c>{單元代號}.{action}</c> 逐字對應，不做單複數轉換。
/// </para>
/// </summary>
public sealed partial class AppRouter
{
    /// <summary>依 method + segments 決定所需權限碼；null = 登入即可，DenySentinel = 拒絕。</summary>
    private static string? GetRequiredPermission(string method, string[] segments) =>
        (method, segments) switch
        {
            _ => DenySentinel,
        };

    /// <summary>後台分派；無對應路由回 null。</summary>
    private Task<IActionResult?> RouteAdminAsync(HttpRequest req, string method, string[] segments) =>
        Task.FromResult<IActionResult?>((method, segments) switch
        {
            _ => null,
        });
}
