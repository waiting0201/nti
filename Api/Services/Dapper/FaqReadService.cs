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
        LEFT  JOIN Category c ON c.Id = f.CategoryId AND c.IsDeleted = 0
        LEFT  JOIN CategoryI18n ci ON ci.CategoryId = c.Id AND ci.Lang = @Lang
        WHERE {Common.Sql.PublicFlag("f")}
          AND (@CategoryId IS NULL OR f.CategoryId = @CategoryId)
        ORDER BY c.SortOrder, f.SortOrder, f.Id
        """;

    public async Task<IEnumerable<FaqDto>> GetPublishedAsync(string lang, int? categoryId) =>
        await db.QueryAsync<FaqDto>(Sql, new { Lang = lang, CategoryId = categoryId });
}
