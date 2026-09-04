using Microsoft.AspNetCore.Http;

namespace Nti.Api.Common;

/// <summary>
/// 語系解析（docs/10 §8.3）：<c>?lang=</c> 優先，其次 <c>Accept-Language</c>，皆無則 <c>zh</c>。
/// <para>
/// Handler 呼叫一次後把結果往下傳；<b>ReadService 不自己讀 HttpRequest</b>，
/// 否則同一次請求可能出現兩種語系解析結果。
/// </para>
/// </summary>
public static class LangResolver
{
    public static string Resolve(HttpRequest req)
    {
        var q = req.Query["lang"].FirstOrDefault();
        if (!string.IsNullOrWhiteSpace(q) && Langs.All.Contains(q.Trim().ToLowerInvariant()))
            return q.Trim().ToLowerInvariant();

        // Accept-Language: zh-Hant-TW,zh;q=0.9,en;q=0.8 → 取第一個能對到值域的主語言
        foreach (var part in req.Headers.AcceptLanguage.ToString().Split(',', StringSplitOptions.RemoveEmptyEntries))
        {
            var tag = part.Split(';')[0].Trim().ToLowerInvariant();
            if (tag.Length == 0) continue;

            var primary = tag.Split('-')[0];
            if (Langs.All.Contains(primary)) return primary;
        }

        return Langs.Zh;
    }
}
