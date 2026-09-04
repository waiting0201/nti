namespace Nti.Api.Models.Entities;

/// <summary>
/// 報價需求（docs/08 §4.12，後台單元 17）。
/// <para>
/// 客戶填寫的內容在後台唯讀，只有 <see cref="Status"/>／<see cref="AssigneeId"/>／
/// <see cref="InternalNote"/>／<see cref="RepliedAt"/> 可改。匯出 CSV 需 <c>quote.export</c>
/// 權限且必須寫入 AuditLog（docs/09 §17）。
/// </para>
/// </summary>
public sealed class QuoteRequest : IAuditable
{
    public int       Id                     { get; set; }
    public string    QuoteNo                { get; set; } = null!;  // Q20260901-0001，後端產生
    public int?      MemberId               { get; set; }           // 未登入送出則為 NULL
    public string    FullName               { get; set; } = null!;
    public string    Company                { get; set; } = null!;
    public string    Email                  { get; set; } = null!;
    public string?   Phone                  { get; set; }
    public int?      SolutionId             { get; set; }
    public int?      IndustryCategoryId     { get; set; }
    public string    Quantity               { get; set; } = null!;
    public string?   SizeText               { get; set; }           // L×W×H mm
    public int?      MaterialCategoryId     { get; set; }
    public DateOnly? TargetDate             { get; set; }
    public bool      NeedsSustainableAdvice { get; set; }
    public string    Requirement            { get; set; } = null!;
    public DateTime  ConsentAt              { get; set; }           // 隱私權同意時間（個資法留存）

    public string    Status       { get; set; } = "New";
    public int?      AssigneeId   { get; set; }                     // AdminUser.Id，刻意不建 FK
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

/// <summary>
/// 報價附件（設計稿）。<see cref="ScanStatus"/> 非 <c>Clean</c> 者不提供下載（docs/09 §17）。
/// </summary>
public sealed class QuoteAttachment
{
    public int      Id             { get; set; }
    public int      QuoteRequestId { get; set; }
    public string   FilePath       { get; set; } = null!;
    public string   OriginalName   { get; set; } = null!;
    public string   ContentType    { get; set; } = null!;
    public long     SizeBytes      { get; set; }
    public string   ScanStatus     { get; set; } = "Pending";  // Pending|Clean|Infected
    public DateTime CreatedAt      { get; set; }
}
