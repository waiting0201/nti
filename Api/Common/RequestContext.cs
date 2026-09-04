using Microsoft.AspNetCore.Http;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Nti.Api.Common;

/// <summary>請求的來源資訊。表單要留存 IP／UA／來源語系（個資法與濫用追查）。</summary>
public static class RequestContext
{
    /// <summary>
    /// 來源 IP。優先看 <c>X-Forwarded-For</c> 的第一段——Functions 前面有 SWA／Front Door，
    /// <c>RemoteIpAddress</c> 拿到的會是平台的位址，全部請求看起來都來自同一個 IP
    /// （rate limit 會因此把所有人算成同一個人）。
    /// </summary>
    public static string? SourceIp(HttpRequest req)
    {
        var forwarded = req.Headers["X-Forwarded-For"].FirstOrDefault();
        if (!string.IsNullOrWhiteSpace(forwarded))
        {
            // "client, proxy1, proxy2"；Azure 會附上 :port，要去掉
            var first = forwarded.Split(',')[0].Trim();
            var colon = first.LastIndexOf(':');

            // IPv6 會有多個冒號，只有「單一冒號」才是 host:port
            if (colon > 0 && first.IndexOf(':') == colon) first = first[..colon];

            return Truncate(first, 45);
        }

        return Truncate(req.HttpContext.Connection.RemoteIpAddress?.ToString(), 45);
    }

    public static string? UserAgent(HttpRequest req) =>
        Truncate(req.Headers.UserAgent.FirstOrDefault(), 400);

    /// <summary>目前登入者的 Id（後台管理員或前台會員，看路由而定）。</summary>
    public static int? UserId(ClaimsPrincipal? user) =>
        int.TryParse(user?.FindFirst(JwtRegisteredClaimNames.Sub)?.Value, out var id) ? id : null;

    private static string? Truncate(string? value, int max) =>
        string.IsNullOrWhiteSpace(value) ? null : (value.Length <= max ? value : value[..max]);
}
