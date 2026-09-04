using Microsoft.AspNetCore.Http;

namespace Nti.Api.Common;

/// <summary>query string 取值。無效值一律視為「沒給」，與 <see cref="Paging"/> 的寬鬆解析一致。</summary>
public static class QueryValues
{
    public static int? Int(HttpRequest req, string key) =>
        int.TryParse(req.Query[key].FirstOrDefault(), out var v) ? v : null;

    public static string? Text(HttpRequest req, string key)
    {
        var value = req.Query[key].FirstOrDefault();
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }
}
