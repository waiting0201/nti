using Dapper;
using Nti.Api.Models.Dtos;
using System.Data;

namespace Nti.Api.Services.Dapper;

public interface IFacilityReadService
{
    Task<IEnumerable<FacilityItemDto>> GetPublishedAsync(string lang, string? groupCode);
}

/// <summary>
/// 設備卡（後台單元 10）。
/// <para>
/// <c>?group=</c> 收的是 <c>Category.Code</c>（pre-press／eco-printing／post-press／quality／tour）
/// 而不是 Id——前端的五個子頁路徑本身就是那個 code，用 Id 的話前端得先查一次分類。
/// </para>
/// </summary>
public sealed class FacilityReadService(IDbConnection db) : IFacilityReadService
{
    private static readonly string Sql = $"""
        SELECT f.Id, f.CategoryId, c.Code AS CategoryCode, ci.Name AS CategoryName,
               f.ImagePath, f.SortOrder, i.Name, i.Description, i.ImageAlt
        FROM FacilityItem f
        INNER JOIN FacilityItemI18n i ON i.FacilityItemId = f.Id AND i.Lang = @Lang
        INNER JOIN Category c ON c.Id = f.CategoryId
        INNER JOIN CategoryI18n ci ON ci.CategoryId = c.Id AND ci.Lang = @Lang
        WHERE {Common.Sql.PublicFlag("f")}
          AND (@GroupCode IS NULL OR c.Code = @GroupCode)
        ORDER BY c.SortOrder, f.SortOrder, f.Id
        """;

    public async Task<IEnumerable<FacilityItemDto>> GetPublishedAsync(string lang, string? groupCode) =>
        await db.QueryAsync<FacilityItemDto>(Sql, new { Lang = lang, GroupCode = groupCode });
}
