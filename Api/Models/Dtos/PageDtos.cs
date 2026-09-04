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

    public SeoDto  Seo           { get; set; } = null!;
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
