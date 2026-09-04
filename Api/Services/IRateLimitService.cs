namespace Nti.Api.Services;

/// <summary>
/// 公開端點的頻率限制（docs/10 §9.6）：表單 10 次／小時、登入 5 次／15 分鐘。
/// <para>
/// Consumption plan 是多實例，<b>不能用 MemoryCache</b>——每個實例各算各的，
/// 等於限制被實例數乘上去。狀態必須在 DB 或 Blob。
/// </para>
/// </summary>
public interface IRateLimitService
{
    /// <summary>報價表單：同一 IP 一小時內的提交數是否已達上限。</summary>
    Task<bool> IsQuoteLimitExceededAsync(string? sourceIp);

    /// <summary>聯絡表單：同上。</summary>
    Task<bool> IsContactLimitExceededAsync(string? sourceIp);
}
