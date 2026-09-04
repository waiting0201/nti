namespace Nti.Api.Models.Entities;

/// <summary>
/// 電子報訂閱（docs/08 §4.15）——<b>預留，待客戶確認</b>（docs/09 §2.1 缺口一）。
/// <para>
/// 尚未列入本期估算，schema 先備妥，客戶點頭後只需補後台單元與權限碼。
/// double opt-in 的 <see cref="ConfirmToken"/> 只存 SHA-256（比照 <see cref="MemberToken"/>）；
/// <c>Source='Import'</c> 直接支援舊站名單遷移；無可翻譯欄位故不設 i18n 側表。
/// </para>
/// </summary>
public sealed class NewsletterSubscriber : IAuditable
{
    public int       Id                    { get; set; }
    public string    Email                 { get; set; } = null!;
    public string?   DisplayName           { get; set; }
    public string?   Company               { get; set; }
    public string    PreferredLang         { get; set; } = "en";
    public string    Status                { get; set; } = "Pending";  // Pending|Subscribed|Unsubscribed|Bounced
    public string    Source                { get; set; } = "Website";  // Website|Import|Admin
    public DateTime? ConsentAt             { get; set; }
    public byte[]?   ConfirmToken          { get; set; }
    public DateTime? ConfirmTokenExpiresAt { get; set; }
    public DateTime? ConfirmedAt           { get; set; }
    public byte[]?   UnsubscribeToken      { get; set; }               // 退訂連結用，長期有效
    public DateTime? UnsubscribedAt        { get; set; }
    public string?   UnsubscribeReason     { get; set; }
    public DateTime? LastSentAt            { get; set; }
    public byte      BounceCount           { get; set; }

    public string?   SourceIp     { get; set; }
    public string?   UserAgent    { get; set; }
    public string?   SourceLang   { get; set; }
    public DateTime  SubscribedAt { get; set; }

    public DateTime  CreatedAt { get; set; }
    public int?      CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int?      UpdatedBy { get; set; }
    public bool      IsDeleted { get; set; }
}
