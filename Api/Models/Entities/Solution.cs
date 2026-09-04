namespace Nti.Api.Models.Entities;

/// <summary>
/// 客製化解決方案（docs/08 §4.3，後台單元 02）。
/// <para>
/// 固定 4 筆（boxes／cardboard／uv／other），後台不提供新增與刪除；同時驅動首頁
/// Printing Solutions 四張卡。筆數由 <c>db/verify/verify.sql</c> 斷言，不用 trigger 擋。
/// </para>
/// </summary>
public sealed class Solution : IAuditable, IPublishable
{
    public int     Id             { get; set; }
    public string  Code           { get; set; } = null!;  // boxes|cardboard|uv|other
    public string  CoverImagePath { get; set; } = null!;
    public string? OgImagePath    { get; set; }           // 未填沿用封面
    public int     SortOrder      { get; set; }

    public bool      IsPublished { get; set; } = true;
    public DateTime? PublishAt   { get; set; }
    public DateTime? UnpublishAt { get; set; }

    public DateTime  CreatedAt { get; set; }
    public int?      CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int?      UpdatedBy { get; set; }
    public bool      IsDeleted { get; set; }
}

/// <summary>方案的多語內容，含 SEO 欄位組（docs/08 §2.7）——方案有自己的網址。</summary>
public sealed class SolutionI18n : II18n
{
    public int     SolutionId     { get; set; }
    public string  Lang           { get; set; } = null!;
    public string  Name           { get; set; } = null!;  // Color Box Packaging
    public string  H1             { get; set; } = null!;  // Custom Color Box Packaging
    public string? Summary        { get; set; }           // 首頁卡片／列表用短述
    public string? IntroHtml      { get; set; }           // 方案頁導言（富文本）
    public string  CoverAlt       { get; set; } = null!;
    public string  Slug           { get; set; } = null!;
    public string? SeoTitle       { get; set; }
    public string? SeoDescription { get; set; }
    public string? CanonicalUrl   { get; set; }
    public string? OgTitle        { get; set; }
    public string? OgDescription  { get; set; }
}

/// <summary>方案底下的品項卡。</summary>
public sealed class SolutionItem : IAuditable
{
    public int    Id          { get; set; }
    public int    SolutionId  { get; set; }
    public string ImagePath   { get; set; } = null!;
    public int    SortOrder   { get; set; }
    public bool   IsPublished { get; set; } = true;   // 無時間窗，僅開關

    public DateTime  CreatedAt { get; set; }
    public int?      CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int?      UpdatedBy { get; set; }
    public bool      IsDeleted { get; set; }
}

public sealed class SolutionItemI18n : II18n
{
    public int     SolutionItemId { get; set; }
    public string  Lang           { get; set; } = null!;
    public string  Name           { get; set; } = null!;
    public string? Description    { get; set; }
    public string  ImageAlt       { get; set; } = null!;
}
