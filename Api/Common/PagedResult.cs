namespace Nti.Api.Common;

/// <summary>分頁查詢結果（docs/10 §5.2）。</summary>
public sealed record PagedResult<T>(
    IEnumerable<T> Items,
    int TotalCount,
    int Page,
    int PageSize,
    int TotalPages)
{
    public static PagedResult<T> From(IEnumerable<T> items, int totalCount, int page, int pageSize) =>
        new(items, totalCount, page, pageSize,
            Math.Max(1, (int)Math.Ceiling((double)totalCount / pageSize)));
}
