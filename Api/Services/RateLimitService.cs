using Dapper;
using Nti.Api.Common;
using System.Data;

namespace Nti.Api.Services;

/// <summary>
/// 以既有的表單資料表當計數來源。
/// <para>
/// 沒有另建 rate-limit 表是刻意的：<c>QuoteRequest</c>／<c>ContactMessage</c> 本來就存了
/// <c>SourceIp</c> 與 <c>SubmittedAt</c>，要的答案（這個 IP 最近一小時送了幾次）直接查得到。
/// 多一張表就多一份要清理、要遷移、要在 verify 斷言的東西，而換來的只是同一個數字。
/// </para>
/// <para>
/// 代價：被擋下的請求不會留下紀錄，所以擋掉的次數查不到。真的需要時再補表。
/// </para>
/// </summary>
public sealed class RateLimitService(IDbConnection db) : IRateLimitService
{
    /// <summary>公開表單：10 次／小時（docs/10 §9.6）。</summary>
    private const int FormLimitPerHour = 10;

    private const string QuoteSql = """
        SELECT COUNT(*) FROM QuoteRequest
        WHERE SourceIp = @Ip AND SubmittedAt >= DATEADD(HOUR, -1, @Now)
        """;

    private const string ContactSql = """
        SELECT COUNT(*) FROM ContactMessage
        WHERE SourceIp = @Ip AND SubmittedAt >= DATEADD(HOUR, -1, @Now)
        """;

    public Task<bool> IsQuoteLimitExceededAsync(string? sourceIp)   => IsExceededAsync(QuoteSql, sourceIp);
    public Task<bool> IsContactLimitExceededAsync(string? sourceIp) => IsExceededAsync(ContactSql, sourceIp);

    private async Task<bool> IsExceededAsync(string sql, string? sourceIp)
    {
        // 取不到 IP（少見，但代理層設定不對時會發生）就不擋——
        // 擋下所有取不到 IP 的請求等於整個表單掛掉，比放行風險大。
        if (string.IsNullOrWhiteSpace(sourceIp)) return false;

        var count = await db.ExecuteScalarAsync<int>(sql, new { Ip = sourceIp, Now = Clock.UtcNow });
        return count >= FormLimitPerHour;
    }
}
