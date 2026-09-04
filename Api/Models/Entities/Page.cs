namespace Nti.Api.Models.Entities;

/// <summary>
/// 固定頁註冊表（docs/08 §4.11，後台單元 15）。
/// <para>
/// 內容寫死在前端，這裡只管 SEO。29 筆固定頁不可增刪、Id 固定，key 值域見
/// <see cref="Common.PageKeys"/>。<c>HasRichBody = 1</c> 只有 privacy-legal 與預留的 green-csr。
/// </para>
/// </summary>
public sealed class Page : IAuditable
{
    public int     Id            { get; set; }
    public string  PageKey       { get; set; } = null!;  // home|about-difference|green-carbon|...
    public string  RouteTemplate { get; set; } = null!;  // /{lang}/about/difference
    public bool    HasRichBody   { get; set; }
    public string? OgImagePath   { get; set; }
    public bool    IsIndexable   { get; set; } = true;   // 0 → noindex

    public DateTime  CreatedAt { get; set; }
    public int?      CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int?      UpdatedBy { get; set; }
    public bool      IsDeleted { get; set; }
}

public sealed class PageI18n : II18n
{
    public int     PageId         { get; set; }
    public string  Lang           { get; set; } = null!;
    public string? BodyHtml       { get; set; }          // 僅 HasRichBody = 1 時使用
    public string  Slug           { get; set; } = null!;
    public string? SeoTitle       { get; set; }
    public string? SeoDescription { get; set; }
    public string? CanonicalUrl   { get; set; }
    public string? OgTitle        { get; set; }
    public string? OgDescription  { get; set; }
}
