using Dapper;
using Nti.Api.Common;
using Nti.Api.Models.Dtos;
using System.Data;

namespace Nti.Api.Services.Dapper;

public interface IHomeBannerReadService
{
    Task<IEnumerable<HomeBannerDto>> GetPublishedAsync(string lang);
}

/// <summary>首頁 Banner（後台單元 01）。</summary>
public sealed class HomeBannerReadService(IDbConnection db) : IHomeBannerReadService
{
    private static readonly string Sql = $"""
        SELECT b.Id, b.ImagePath, b.ImagePathMobile, b.MediaType, b.VideoPath,
               b.LinkUrl, b.OpenInNewTab, b.SortOrder, i.ImageAlt
        FROM HomeBanner b
        INNER JOIN HomeBannerI18n i ON i.HomeBannerId = b.Id AND i.Lang = @Lang
        WHERE {Common.Sql.PublicFilter("b")}
        ORDER BY b.SortOrder, b.Id
        """;

    public async Task<IEnumerable<HomeBannerDto>> GetPublishedAsync(string lang) =>
        await db.QueryAsync<HomeBannerDto>(Sql, new { Lang = lang, Now = Clock.UtcNow });
}
