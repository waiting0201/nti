using Dapper;
using Nti.Api.Common;
using System.Data;

namespace Nti.Api.Services;

/// <summary>
/// 每日流水號。
/// <para>
/// 併發下兩個請求可能算到同一個號碼——這裡不加鎖，靠 <c>UQ_QuoteRequest_QuoteNo</c> 擋，
/// 由呼叫端重試。加鎖要嘛用 sp_getapplock、要嘛序列化整張表，兩者在 Basic（5 DTU）
/// 都比「偶爾重試一次」貴，而表單的併發量本來就低。
/// </para>
/// </summary>
public sealed class QuoteNumberGenerator(IDbConnection db) : IQuoteNumberGenerator
{
    private const string Sql = """
        SELECT MAX(CAST(RIGHT(QuoteNo, 4) AS INT))
        FROM QuoteRequest
        WHERE QuoteNo LIKE @Prefix + '%'
        """;

    public async Task<string> NextAsync()
    {
        // 單號給人看，用台北日期才符合「今天」的直覺（docs/10 §9.1 的顯示用途）
        var prefix = $"Q{Clock.Today:yyyyMMdd}-";
        var max    = await db.ExecuteScalarAsync<int?>(Sql, new { Prefix = prefix });

        return $"{prefix}{(max ?? 0) + 1:D4}";
    }
}
