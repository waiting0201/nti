using Dapper;
using Nti.Api.Models.Dtos;
using System.Data;

namespace Nti.Api.Services.Dapper;

public interface IFaqReadService
{
    Task<IEnumerable<FaqDto>> GetPublishedAsync(string lang, int? categoryId);
}

/// <summary>常見問題（後台單元 06）。分類可為空，故 Category 走 LEFT JOIN。</summary>
public sealed class FaqReadService(IDbConnection db) : IFaqReadService
{
    private static readonly string Sql = $"""
        SELECT f.Id, f.CategoryId, c.Code AS CategoryCode, ci.Name AS CategoryName,
               f.SortOrder, i.Question, i.AnswerHtml
        FROM Faq f
        INNER JOIN FaqI18n i ON i.FaqId = f.Id AND i.Lang = @Lang
        LEFT  JOIN Category c ON c.Id = f.CategoryId AND c.IsDeleted = 0 AND c.IsActive = 1
        LEFT  JOIN CategoryI18n ci ON ci.CategoryId = c.Id AND ci.Lang = @Lang
        WHERE {Common.Sql.PublicFlag("f")}
          AND (f.CategoryId IS NULL OR c.Id IS NOT NULL)  -- 未分組照常顯示；掛在停用／刪除分類下的不顯示
          AND (@CategoryId IS NULL OR f.CategoryId = @CategoryId)
        ORDER BY c.SortOrder, f.SortOrder, f.Id
        """;

    public async Task<IEnumerable<FaqDto>> GetPublishedAsync(string lang, int? categoryId) =>
        await db.QueryAsync<FaqDto>(Sql, new { Lang = lang, CategoryId = categoryId });
}
