using Microsoft.AspNetCore.Http;

namespace Nti.Api.Common;

/// <summary>
/// 分頁雙模式（docs/10 §5.3）：帶 <c>page</c> 或 <c>pageSize</c> 才分頁，兩者皆無則回平面陣列。
/// </summary>
/// <param name="IsPaged">請求是否帶了分頁參數。</param>
public readonly record struct Paging(bool IsPaged, int Page, int PageSize)
{
    public const int DefaultPageSize = 20;   // 後台清單預設（docs/09 §5）
    public const int MaxPageSize     = 100;  // 契約上限（04-api §2）

    public int Skip => (Page - 1) * PageSize;

    /// <summary>
    /// 從 query string 取分頁參數。
    /// <para>
    /// <b>pageSize 一律 Clamp(1, 100)</b>：Azure SQL Basic 只有 5 DTU，
    /// 一個 <c>pageSize=99999</c> 就能拖垮全站（docs/10 §5.3）。
    /// </para>
    /// </summary>
    public static Paging From(HttpRequest req)
    {
        var rawPage     = req.Query["page"].FirstOrDefault();
        var rawPageSize = req.Query["pageSize"].FirstOrDefault();

        var isPaged  = !string.IsNullOrWhiteSpace(rawPage) || !string.IsNullOrWhiteSpace(rawPageSize);
        var page     = int.TryParse(rawPage,     out var p)  ? Math.Max(1, p) : 1;
        var pageSize = int.TryParse(rawPageSize, out var ps) ? Math.Clamp(ps, 1, MaxPageSize) : DefaultPageSize;

        return new Paging(isPaged, page, pageSize);
    }
}
