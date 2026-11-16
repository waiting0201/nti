namespace Nti.Api.Models.Entities;

/// <summary>
/// 產業趨勢（docs/08 §4.7，後台單元 07）。無分類、無封面圖，純文章。
/// 2026-11-16 起分清單頁（標題＋摘要）與詳細頁（<c>/printing-trends/{slug}</c>）。
/// </summary>
public sealed class IndustryTrend : IAuditable, IPublishable
{
    public int Id        { get; set; }
    public int SortOrder { get; set; }
    public string? OgImagePath { get; set; }   // 社群分享圖；未填沿用全站預設

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
    public string  BodyHtml       { get; set; } = null!;
    public string? Summary        { get; set; }           // 清單卡片 + 詳細頁導言
    public string  Slug           { get; set; } = null!;  // /printing-trends/{slug}，中英可不同
    public string? SeoTitle       { get; set; }
    public string? SeoDescription { get; set; }
    public string? CanonicalUrl   { get; set; }
    public string? OgTitle        { get; set; }
    public string? OgDescription  { get; set; }
}
