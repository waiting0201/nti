namespace Nti.Api.Models.Entities;

/// <summary>最新消息（docs/08 §4.5，後台單元 04）。</summary>
public sealed class News : IAuditable, IPublishable
{
    public int      Id             { get; set; }
    public int      CategoryId     { get; set; }
    public DateOnly PublishDate    { get; set; }          // 顯示用日期（2026.03.13），與上下架時間窗無關
    public string   CoverImagePath { get; set; } = null!;
    public string?  OgImagePath    { get; set; }          // 未填沿用封面
    public bool     IsFeaturedHome { get; set; }          // 是否上首頁／Insights 精選

    public bool      IsPublished { get; set; }            // 預設 0：新聞先存草稿再上架
    public DateTime? PublishAt   { get; set; }
    public DateTime? UnpublishAt { get; set; }

    public DateTime  CreatedAt { get; set; }
    public int?      CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int?      UpdatedBy { get; set; }
    public bool      IsDeleted { get; set; }
}

/// <summary>新聞的多語內容，含 SEO 欄位組（docs/08 §2.7）。</summary>
public sealed class NewsI18n : II18n
{
    public int     NewsId         { get; set; }
    public string  Lang           { get; set; } = null!;
    public string  Title          { get; set; } = null!;  // 同時作為 H1
    public string? Summary        { get; set; }           // 列表摘要 + 詳細頁導言
    public string  BodyHtml       { get; set; } = null!;  // 富文本（含小標、段落、內文圖）
    public string  CoverAlt       { get; set; } = null!;
    public string  Slug           { get; set; } = null!;
    public string? SeoTitle       { get; set; }
    public string? SeoDescription { get; set; }
    public string? CanonicalUrl   { get; set; }
    public string? OgTitle        { get; set; }
    public string? OgDescription  { get; set; }
}
