using Microsoft.AspNetCore.Http;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Nti.Api.Common;

/// <summary>請求的來源資訊。表單要留存 IP／UA／來源語系（個資法與濫用追查）。</summary>
public static class RequestContext
{
    /// <summary>
    /// 來源 IP，取 <c>X-Forwarded-For</c> 的<b>最後一段</b>。
    /// <para>
    /// 瀏覽器直連 <c>func-nti-prod.azurewebsites.net</c>（docs/07），前面只有 App Service 的前端：
    /// 它把它看到的連線位址<b>附加</b>在既有的 <c>X-Forwarded-For</c> 之後。所以最後一段是 Azure 寫的、
    /// 前面各段是用戶端自己送的——取第一段的話，攻擊者每次換一個值就能無限繞過 rate limit。
    /// <c>RemoteIpAddress</c> 在 isolated worker 裡是 host 轉送的位址，不能用。
    /// </para>
    /// <para>
    /// ⚠ 日後若在前面加 Front Door／APIM／SWA linked backend，最後一段會變成那一層的位址，
    /// 所有訪客會被算成同一個 IP（10 次／小時後全站表單被擋）。屆時要改成從右邊數過信任的代理層數。
    /// </para>
    /// </summary>
    public static string? SourceIp(HttpRequest req)
    {
        // 標頭可能出現多次，合起來再切
        var forwarded = string.Join(',', req.Headers["X-Forwarded-For"].ToArray());
        var last = forwarded.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                            .LastOrDefault();
        if (!string.IsNullOrWhiteSpace(last))
        {
            // Azure 會附上 :port，要去掉。IPv6 會有多個冒號，只有「單一冒號」才是 host:port；
            // 帶 port 的 IPv6 形如 [::1]:443，去掉中括號與 port
            if (last.StartsWith('[') && last.IndexOf(']') is var close and > 0) last = last[1..close];
            else
            {
                var colon = last.LastIndexOf(':');
                if (colon > 0 && last.IndexOf(':') == colon) last = last[..colon];
            }

            return Truncate(last, 45);
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
