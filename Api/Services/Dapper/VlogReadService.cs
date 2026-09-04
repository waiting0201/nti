using Dapper;
using Nti.Api.Common;
using Nti.Api.Models.Dtos;
using System.Data;

namespace Nti.Api.Services.Dapper;

public interface IVlogReadService
{
    Task<IEnumerable<VlogDto>> GetPublishedAsync(string lang, int? categoryId);
}

/// <summary>Green Vlog（後台單元 05）。主打影片排最前面，前端直接取第一筆當頂部大播放器。</summary>
public sealed class VlogReadService(IDbConnection db) : IVlogReadService
{
    private static readonly string Sql = $"""
        SELECT v.Id, v.CategoryId, c.Code AS CategoryCode, ci.Name AS CategoryName,
               v.YoutubeId, v.ThumbOverridePath, v.IsMainFeature, v.SortOrder,
               i.Title, i.Description
        FROM Vlog v
        INNER JOIN VlogI18n i ON i.VlogId = v.Id AND i.Lang = @Lang
        INNER JOIN Category c ON c.Id = v.CategoryId
        INNER JOIN CategoryI18n ci ON ci.CategoryId = c.Id AND ci.Lang = @Lang
        WHERE {Common.Sql.PublicFilter("v")}
          AND (@CategoryId IS NULL OR v.CategoryId = @CategoryId)
        ORDER BY v.IsMainFeature DESC, v.SortOrder, v.Id
        """;

    public async Task<IEnumerable<VlogDto>> GetPublishedAsync(string lang, int? categoryId) =>
        await db.QueryAsync<VlogDto>(Sql, new { Lang = lang, Now = Clock.UtcNow, CategoryId = categoryId });
}
