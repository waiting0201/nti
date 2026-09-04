using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Nti.Api.Common;
using Nti.Api.Services.Dapper;

namespace Nti.Api.Handlers;

/// <summary>單元 22 category（前台唯讀部分）。</summary>
public sealed class CategoryHandler(ICategoryReadService reads)
{
    public async Task<IActionResult> GetListAsync(HttpRequest req)
    {
        var type = QueryValues.Text(req, "type");

        // type 有明確值域（docs/08 §4.1 的九種），打錯字回 400 而不是靜默回空陣列——
        // 後者會讓前端以為「這個分類真的沒有資料」，很難查。
        if (type is not null && !CategoryTypes.All.Contains(type))
            throw AppException.BadRequest(ErrorCodes.ValidationFormat,
                $"type 必須是下列其中之一：{string.Join(", ", CategoryTypes.All)}。");

        var rows = await reads.GetByTypeAsync(LangResolver.Resolve(req), type);

        CacheControl.Public(req.HttpContext.Response, CacheControl.StaticSeconds);
        return new OkObjectResult(ApiResponse.Ok(rows));
    }
}
