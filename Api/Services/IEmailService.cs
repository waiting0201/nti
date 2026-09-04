namespace Nti.Api.Services;

/// <summary>
/// 寄信（docs/10 §9.4）。
/// <para>
/// <b>寄送結果一律寫 EmailLog（成功與失敗都寫）</b>，而且<b>寄信失敗不得讓呼叫端失敗</b>——
/// 表單資料先落庫、回 200，寄不出去只記 log，後台可以重寄。
/// 反過來做的話，SMTP 掛掉的那幾分鐘客戶送出的報價就直接遺失了。
/// </para>
/// </summary>
public interface IEmailService
{
    /// <summary>寄信並記錄 EmailLog。回傳是否寄送成功（呼叫端通常可以忽略）。</summary>
    Task<bool> SendAsync(
        string  mailType,
        string  toAddress,
        string  subject,
        string  htmlBody,
        string? relatedEntity = null,
        int?    relatedId     = null,
        CancellationToken cancellationToken = default);

    /// <summary>重寄既有的 EmailLog（後台單元 24 的 audit.resend）。找不到回 null。</summary>
    Task<bool?> ResendAsync(long emailLogId, CancellationToken cancellationToken = default);
}
