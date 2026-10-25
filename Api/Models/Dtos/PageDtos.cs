namespace Nti.Api.Models.Dtos;

/// <summary>
/// 固定頁（後台單元 15）。內容寫死在前端，這裡只提供 SEO 欄位；
/// <c>HasRichBody = 1</c> 的兩頁（privacy-legal、預留的 green-csr）另含 <see cref="BodyHtml"/>。
/// </summary>
public sealed class PageDto
{
    public int     Id            { get; set; }
    public string  PageKey       { get; set; } = null!;
    public string  RouteTemplate { get; set; } = null!;
    public bool    HasRichBody   { get; set; }
    public bool    IsIndexable   { get; set; }
    public string? BodyHtml      { get; set; }
    /// <summary>頁面影片（YouTube 影片 ID，分語系）。只有 PageVideoPages 列出的頁與語系有值；null → 前台用 mockup 那支。</summary>
    public string? YoutubeId     { get; set; }
    /// <summary>頂部橫幅圖路徑。只有 PageBannerPages 那幾頁有值；null → 前台用 mockup 那張。</summary>
    public string? BannerImagePath { get; set; }
    /// <summary>
    /// 中段橫幅圖路徑，依頁面由上而下；長度＝該頁的張數（PageMidBannerPages），沒有中段圖的頁是空陣列。
    /// 某一格是 null → 後台清空了，前台那個區塊不顯示。
    /// </summary>
    public List<string?> MidBannerImagePaths { get; set; } = [];

    public SeoDto  Seo           { get; set; } = null!;

    /// <summary>「頁面文字」覆寫：原文 → 該語系的字。沒有覆寫就是空物件，前台照原文顯示。</summary>
    public Dictionary<string, string> Texts { get; set; } = [];
}

/// <summary>
/// 首頁聚合（04-api §3.1 的 <c>GET /content/home</c>）。
/// 首頁一次要四組資料，讓前端打四次會讓 ISR 的重新驗證變成四個時間點。
/// </summary>
public sealed class HomeContentDto
{
    public IEnumerable<HomeBannerDto>    Banners        { get; set; } = [];
    public IEnumerable<SolutionListDto>  Solutions      { get; set; } = [];
    public IEnumerable<CertificationDto> Certifications { get; set; } = [];
    public IEnumerable<ClientLogoDto>    Clients        { get; set; } = [];
    public IEnumerable<NewsListDto>      FeaturedNews   { get; set; } = [];
}
