using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Nti.Api.Common;
using Nti.Api.Models.Dtos;
using Nti.Api.Services.Dapper;

namespace Nti.Api.Handlers;

/// <summary>
/// 前台聚合端點（04-api §3.1 的 <c>GET /content/home</c>）。
/// <para>
/// 唯一不對應單一後台單元的 Handler：首頁一次要 Banner、方案卡、認證牆、客戶 logo
/// 與精選消息五組資料，拆成五支端點會讓 ISR 的重新驗證變成五個時間點，
/// 首頁可能出現「認證牆更新了、Banner 還是舊的」。
/// </para>
/// </summary>
public sealed class ContentHandler(
    IHomeBannerReadService    banners,
    ISolutionReadService      solutions,
    ICertificationReadService certifications,
    IClientReadService        clients,
    INewsReadService          news)
{
    /// <summary>首頁精選消息取幾筆。</summary>
    private const int FeaturedNewsCount = 3;

    public async Task<IActionResult> GetHomeAsync(HttpRequest req)
    {
        var lang = LangResolver.Resolve(req);

        var dto = new HomeContentDto
        {
            Banners        = await banners.GetPublishedAsync(lang),
            Solutions      = await solutions.GetPublishedAsync(lang),
            Certifications = await certifications.GetPublishedAsync(lang, homeOnly: true),
            Clients        = await clients.GetPublishedAsync(),
            FeaturedNews   = await news.GetFeaturedAsync(lang, FeaturedNewsCount),
        };

        CacheControl.Public(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(dto));
    }
}
