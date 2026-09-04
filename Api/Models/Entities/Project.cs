namespace Nti.Api.Models.Entities;

/// <summary>
/// 案例實績（docs/08 §4.4，後台單元 03）。
/// <para>
/// 無詳細頁（04-api 已移除 <c>/projects/{slug}</c>），故無 slug 與 SEO 欄位組——
/// 卡片本身即完整內容。分類走 <c>Category(Industry)</c>，與報價表單的產業下拉共用同一份主檔。
/// </para>
/// </summary>
public sealed class Project : IAuditable, IPublishable
{
    public int     Id         { get; set; }
    public int     CategoryId { get; set; }
    public string  ImagePath  { get; set; } = null!;
    public string? VideoUrl   { get; set; }   // 有值才顯示播放圖示
    public string? StatValue  { get; set; }   // 卡片大數字，如 -32%
    public int     SortOrder  { get; set; }

    public bool      IsPublished { get; set; } = true;
    public DateTime? PublishAt   { get; set; }
    public DateTime? UnpublishAt { get; set; }

    public DateTime  CreatedAt { get; set; }
    public int?      CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int?      UpdatedBy { get; set; }
    public bool      IsDeleted { get; set; }
}

public sealed class ProjectI18n : II18n
{
    public int     ProjectId { get; set; }
    public string  Lang      { get; set; } = null!;
    public string  Title     { get; set; } = null!;
    public string? Summary   { get; set; }
    public string? StatLabel { get; set; }   // carbon / unit
    public string  ImageAlt  { get; set; } = null!;
}
