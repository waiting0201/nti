namespace Nti.Api.Models.Entities;

/// <summary>
/// 聯絡訊息（docs/08 §4.12，後台單元 18）。
/// <para>刻意無「主旨」欄位——mockup 的 contact 頁與契約皆無此欄。</para>
/// </summary>
public sealed class ContactMessage : IAuditable
{
    public int       Id           { get; set; }
    public string    Name         { get; set; } = null!;
    public string    Email        { get; set; } = null!;
    public string?   Company      { get; set; }
    public string?   Phone        { get; set; }
    public string    Message      { get; set; } = null!;
    public DateTime  ConsentAt    { get; set; }
    public string    Status       { get; set; } = "New";
    public string?   InternalNote { get; set; }
    public DateTime? RepliedAt    { get; set; }

    public string?   SourceIp    { get; set; }
    public string?   UserAgent   { get; set; }
    public string?   SourceLang  { get; set; }
    public DateTime  SubmittedAt { get; set; }

    public DateTime  CreatedAt { get; set; }
    public int?      CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int?      UpdatedBy { get; set; }
    public bool      IsDeleted { get; set; }
}
