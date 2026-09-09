using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Nti.Api.Common;
using Nti.Api.Services.Dapper;

namespace Nti.Api.Handlers;

/// <summary>
/// 單元 25 tag（前台）。標籤封存頁 <c>/{lang}/news/tag/{slug}</c> 的資料來源。
/// <para>
/// 消息本身仍然走 <c>/news?tag={slug}</c>——標籤只是個篩選條件，沒必要為它另開一組消息端點。
/// 這裡只回標籤自己的資料（名稱與篇數），讓封存頁能顯示標題與 SEO 標題。
/// </para>
/// </summary>
public sealed class TagHandler(ITagReadService reads)
{
    public async Task<IActionResult> GetListAsync(HttpRequest req)
    {
        var lang = LangResolver.Resolve(req);
        var data = await reads.GetAllAsync(lang);

        CacheControl.Public(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(data));
    }

    public async Task<IActionResult> GetBySlugAsync(HttpRequest req, string slug)
    {
        var lang = LangResolver.Resolve(req);
        // 沒有已上架消息的標籤一律當 404（見 TagReadService）——不做空的封存頁
        var dto  = await reads.GetBySlugAsync(lang, slug) ?? throw AppException.NotFound("Tag");

        CacheControl.Public(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(dto));
    }
}
