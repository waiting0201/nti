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
    /// <summary>
    /// 寄信並記錄 EmailLog。回傳是否寄送成功（呼叫端通常可以忽略）。
    /// <para><paramref name="toAddress"/> 可為逗號分隔的多組位址（後台「通知收件者」就是這樣填的）。</para>
    /// <para><paramref name="replyTo"/>：內部通知信填客戶信箱，收件同仁按「回覆」就直接回給客戶。</para>
    /// <para>後台設定 <c>mail.bcc</c> 有值時，每封信都會密件副本給它。</para>
    /// </summary>
    Task<bool> SendAsync(
        string  mailType,
        string  toAddress,
        string  subject,
        string  htmlBody,
        string? relatedEntity = null,
        int?    relatedId     = null,
        string? replyTo       = null,
        CancellationToken cancellationToken = default);
}
