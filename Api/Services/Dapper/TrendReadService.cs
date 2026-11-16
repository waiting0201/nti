using Dapper;
using Nti.Api.Common;
using Nti.Api.Models.Dtos;
using System.Data;

namespace Nti.Api.Services.Dapper;

public interface ITrendReadService
{
    Task<IEnumerable<IndustryTrendDto>> GetPublishedAsync(string lang);
    Task<IndustryTrendDetailDto?> GetBySlugAsync(string lang, string slug);
    Task<string?> GetMovedToAsync(string lang, string slug);
}

/// <summary>
/// 產業趨勢（後台單元 07）。清單頁 <c>/printing-trends</c> 只列標題＋摘要，
/// 內文在詳細頁 <c>/printing-trends/{slug}</c>（2026-11-16 起）。
/// </summary>
public sealed class TrendReadService(IDbConnection db) : ITrendReadService
{
    /// <summary>前台詳細頁的路徑（不含語系前綴），轉址表也用這個組法。</summary>
    public static string DetailPath(string slug) => $"/printing-trends/{slug}";

    private static readonly string ListSql = $"""
        SELECT t.Id, t.SortOrder, i.Title, i.Summary, i.Slug
        FROM IndustryTrend t
        INNER JOIN IndustryTrendI18n i ON i.IndustryTrendId = t.Id AND i.Lang = @Lang
        WHERE {Common.Sql.PublicFilter("t")}
        ORDER BY t.SortOrder, t.Id
        """;

    // 清單與詳細頁共用同一個 PublicFilter，避免「列表看得到、點進去 404」
    private static readonly string DetailSql = $"""
        SELECT t.Id, i.Title, i.Summary, i.BodyHtml,
               i.Slug, i.SeoTitle, i.SeoDescription, i.CanonicalUrl, i.OgTitle, i.OgDescription,
               t.OgImagePath
        FROM IndustryTrend t
        INNER JOIN IndustryTrendI18n i ON i.IndustryTrendId = t.Id AND i.Lang = @Lang
        WHERE {Common.Sql.PublicFilter("t")} AND i.Slug = @Slug;

        SELECT h.Lang, h.Slug
        FROM IndustryTrendI18n h
        WHERE h.IndustryTrendId = (SELECT IndustryTrendId FROM IndustryTrendI18n WHERE Lang = @Lang AND Slug = @Slug);
        """;

    public async Task<IEnumerable<IndustryTrendDto>> GetPublishedAsync(string lang) =>
        await db.QueryAsync<IndustryTrendDto>(ListSql, new { Lang = lang, Now = Clock.UtcNow });

    public async Task<IndustryTrendDetailDto?> GetBySlugAsync(string lang, string slug)
    {
        await using var grid = await db.QueryMultipleAsync(DetailSql, new { Lang = lang, Slug = slug, Now = Clock.UtcNow });

        var row = await grid.ReadSingleOrDefaultAsync<DetailRow>();
        if (row is null) return null;

        var hreflang = await grid.ReadAsync<(string Lang, string Slug)>();
        return row.ToDto(hreflang);
    }

    /// <summary>
    /// 舊 slug 的新網址。後台改了已上架趨勢的 slug 時會在 <c>Redirect</c> 建一筆
    /// （AdminTrendHandler.OnSlugChangedAsync），這裡只查該語系的 <c>/printing-trends/{slug}</c>。
    /// </summary>
    public async Task<string?> GetMovedToAsync(string lang, string slug) =>
        await db.QuerySingleOrDefaultAsync<string>("""
            SELECT ToPath FROM Redirect
            WHERE FromPath = @From AND IsActive = 1 AND IsDeleted = 0;
            """, new { From = SitePaths.For(lang, DetailPath(slug.ToLowerInvariant())) });

    private sealed class DetailRow
    {
        public int     Id             { get; set; }
        public string  Title          { get; set; } = null!;
        public string? Summary        { get; set; }
        public string  BodyHtml       { get; set; } = null!;
        public string  Slug           { get; set; } = null!;
        public string? SeoTitle       { get; set; }
        public string? SeoDescription { get; set; }
        public string? CanonicalUrl   { get; set; }
        public string? OgTitle        { get; set; }
        public string? OgDescription  { get; set; }
        public string? OgImagePath    { get; set; }

        public IndustryTrendDetailDto ToDto(IEnumerable<(string Lang, string Slug)> hreflang) => new()
        {
            Id = Id, Title = Title, Summary = Summary, BodyHtml = BodyHtml,
            Seo = new SeoDto
            {
                Slug = Slug, SeoTitle = SeoTitle, SeoDescription = SeoDescription,
                CanonicalUrl = CanonicalUrl, OgTitle = OgTitle, OgDescription = OgDescription,
                OgImagePath = OgImagePath,
                Hreflang = hreflang.ToDictionary(x => x.Lang, x => x.Slug),
            },
        };
    }
}
