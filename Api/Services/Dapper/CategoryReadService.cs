using Dapper;
using Nti.Api.Models.Dtos;
using System.Data;

namespace Nti.Api.Services.Dapper;

public interface ICategoryReadService
{
    Task<IEnumerable<CategoryDto>> GetByTypeAsync(string lang, string? categoryType);
}

/// <summary>
/// 分類（後台單元 22）。前台的篩選器與下拉選單都吃這支：projects 的分類篩選、
/// faq 分組、報價表單的產業與材質下拉。
/// </summary>
public sealed class CategoryReadService(IDbConnection db) : ICategoryReadService
{
    /// <summary>
    /// 停用的分類不出現在前台；i18n 用 INNER JOIN——該語系沒名稱的分類不列出（缺語系不 fallback）。
    /// </summary>
    private const string BaseSql = """
        SELECT c.Id, c.CategoryType, c.Code, c.SortOrder, i.Name
        FROM Category c
        INNER JOIN CategoryI18n i ON i.CategoryId = c.Id AND i.Lang = @Lang
        WHERE c.IsDeleted = 0 AND c.IsActive = 1
        """;

    public async Task<IEnumerable<CategoryDto>> GetByTypeAsync(string lang, string? categoryType)
    {
        var sql = categoryType is null
            ? $"{BaseSql} ORDER BY c.CategoryType, c.SortOrder, c.Id"
            : $"{BaseSql} AND c.CategoryType = @CategoryType ORDER BY c.SortOrder, c.Id";

        return await db.QueryAsync<CategoryDto>(sql, new { Lang = lang, CategoryType = categoryType });
    }
}
