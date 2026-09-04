namespace Nti.Api.Models.Entities;

/// <summary>
/// 職缺（docs/08 §4.9，後台單元 11）。
/// <para>
/// careers 頁的 Why NTI 六條為固定文案不入庫；應徵行為走 Email，
/// 刻意不設 JobApplication 表——沒有履歷收件與個資保管的需求。
/// </para>
/// </summary>
public sealed class JobPosting : IAuditable, IPublishable
{
    public int Id        { get; set; }
    public int SortOrder { get; set; }

    public bool      IsPublished { get; set; } = true;
    public DateTime? PublishAt   { get; set; }
    public DateTime? UnpublishAt { get; set; }

    public DateTime  CreatedAt { get; set; }
    public int?      CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int?      UpdatedBy { get; set; }
    public bool      IsDeleted { get; set; }
}

public sealed class JobPostingI18n : II18n
{
    public int     JobPostingId    { get; set; }
    public string  Lang            { get; set; } = null!;
    public string  Title           { get; set; } = null!;  // Offset Press Operator
    public string? Location        { get; set; }           // Tainan plant
    public string  DescriptionHtml { get; set; } = null!;
}
