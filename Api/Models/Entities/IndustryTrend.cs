namespace Nti.Api.Models.Entities;

/// <summary>產業趨勢（docs/08 §4.7，後台單元 07）。無分類、無圖，純文章。</summary>
public sealed class IndustryTrend : IAuditable, IPublishable
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

public sealed class IndustryTrendI18n : II18n
{
    public int    IndustryTrendId { get; set; }
    public string Lang            { get; set; } = null!;
    public string Title           { get; set; } = null!;
    public string BodyHtml        { get; set; } = null!;
}
