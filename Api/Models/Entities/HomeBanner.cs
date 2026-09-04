namespace Nti.Api.Models.Entities;

/// <summary>
/// 首頁 Banner（docs/08 §4.2，後台單元 01）。
/// <para>
/// 首頁的 What We Do（4 格）、Why global brands choose NTI?（6 格）與形象圖標語
/// 是品牌簡報定案的固定文案，不入庫；形象圖走 <c>SiteSetting['home.gallery_image']</c>。
/// </para>
/// </summary>
public sealed class HomeBanner : IAuditable, IPublishable
{
    public int     Id              { get; set; }
    public string  ImagePath       { get; set; } = null!;  // 桌機圖；MediaType='video' 時兼作 poster 與行動裝置 fallback
    public string? ImagePathMobile { get; set; }           // 未填則用桌機圖
    public string  MediaType       { get; set; } = "image";// 預留（待客戶確認）：影片型 Banner，docs/09 §2.1 缺口三
    public string? VideoPath       { get; set; }           // Blob 相對路徑，MP4(H.264) / WebM
    public string? LinkUrl         { get; set; }
    public bool    OpenInNewTab    { get; set; }
    public int     SortOrder       { get; set; }

    public bool      IsPublished { get; set; } = true;
    public DateTime? PublishAt   { get; set; }
    public DateTime? UnpublishAt { get; set; }

    public DateTime  CreatedAt { get; set; }
    public int?      CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int?      UpdatedBy { get; set; }
    public bool      IsDeleted { get; set; }
}

public sealed class HomeBannerI18n : II18n
{
    public int    HomeBannerId { get; set; }
    public string Lang         { get; set; } = null!;
    public string ImageAlt     { get; set; } = null!;   // MediaType='video' 時作為 <video> 的 aria-label
}
