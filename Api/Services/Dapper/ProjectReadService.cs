using Dapper;
using Nti.Api.Common;
using Nti.Api.Models.Dtos;
using System.Data;

namespace Nti.Api.Services.Dapper;

public interface IProjectReadService
{
    Task<IEnumerable<ProjectDto>> GetAllAsync(string lang, int? categoryId);
    Task<PagedResult<ProjectDto>> GetPagedAsync(string lang, int? categoryId, Paging paging);
}

/// <summary>案例實績（後台單元 03）。分類走 Category(Industry)，與報價表單的產業下拉共用主檔。</summary>
public sealed class ProjectReadService(IDbConnection db) : IProjectReadService
{
    private const string From = """
        FROM Project p
        INNER JOIN ProjectI18n i ON i.ProjectId = p.Id AND i.Lang = @Lang
        INNER JOIN Category c ON c.Id = p.CategoryId
        INNER JOIN CategoryI18n ci ON ci.CategoryId = c.Id AND ci.Lang = @Lang
        """;

    private static readonly string Where = $"""
        WHERE {Common.Sql.PublicFilter("p")}
          AND (@CategoryId IS NULL OR p.CategoryId = @CategoryId)
        """;

    private static readonly string ListSql = $"""
        SELECT p.Id, p.CategoryId, c.Code AS CategoryCode, ci.Name AS CategoryName,
               p.ImagePath, p.VideoUrl, p.StatValue, p.SortOrder,
               i.Title, i.Summary, i.StatLabel, i.ImageAlt
        {From}
        {Where}
        ORDER BY p.SortOrder, p.Id
        """;

    private static readonly string CountSql = $"SELECT COUNT(*) {From} {Where}";

    public async Task<IEnumerable<ProjectDto>> GetAllAsync(string lang, int? categoryId) =>
        await db.QueryAsync<ProjectDto>(ListSql, new { Lang = lang, Now = Clock.UtcNow, CategoryId = categoryId });

    public async Task<PagedResult<ProjectDto>> GetPagedAsync(string lang, int? categoryId, Paging paging)
    {
        var p = new { Lang = lang, Now = Clock.UtcNow, CategoryId = categoryId, Skip = paging.Skip, Take = paging.PageSize };

        var total = await db.ExecuteScalarAsync<int>(CountSql, p);
        var rows  = await db.QueryAsync<ProjectDto>($"{ListSql} {Common.Sql.PageTail}", p);

        return PagedResult<ProjectDto>.From(rows, total, paging.Page, paging.PageSize);
    }
}
