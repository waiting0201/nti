using Dapper;
using Nti.Api.Common;
using Nti.Api.Models.Dtos;
using System.Data;

namespace Nti.Api.Services.Dapper;

public interface ITrendReadService
{
    Task<IEnumerable<IndustryTrendDto>> GetPublishedAsync(string lang);
}

/// <summary>產業趨勢（後台單元 07）。</summary>
public sealed class TrendReadService(IDbConnection db) : ITrendReadService
{
    private static readonly string Sql = $"""
        SELECT t.Id, t.SortOrder, i.Title, i.BodyHtml
        FROM IndustryTrend t
        INNER JOIN IndustryTrendI18n i ON i.IndustryTrendId = t.Id AND i.Lang = @Lang
        WHERE {Common.Sql.PublicFilter("t")}
        ORDER BY t.SortOrder, t.Id
        """;

    public async Task<IEnumerable<IndustryTrendDto>> GetPublishedAsync(string lang) =>
        await db.QueryAsync<IndustryTrendDto>(Sql, new { Lang = lang, Now = Clock.UtcNow });
}
