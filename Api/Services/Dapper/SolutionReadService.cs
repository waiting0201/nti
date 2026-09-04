using Dapper;
using Nti.Api.Common;
using Nti.Api.Models.Dtos;
using System.Data;

namespace Nti.Api.Services.Dapper;

public interface ISolutionReadService
{
    Task<IEnumerable<SolutionListDto>> GetPublishedAsync(string lang);
    Task<SolutionDetailDto?> GetBySlugAsync(string lang, string slug);
}

/// <summary>方案（後台單元 02）。首頁四張卡與 solutions 列表／詳細頁共用。</summary>
public sealed class SolutionReadService(IDbConnection db) : ISolutionReadService
{
    private static readonly string ListSql = $"""
        SELECT s.Id, s.Code, s.CoverImagePath, s.SortOrder,
               i.Name, i.H1, i.Summary, i.CoverAlt, i.Slug
        FROM Solution s
        INNER JOIN SolutionI18n i ON i.SolutionId = s.Id AND i.Lang = @Lang
        WHERE {Common.Sql.PublicFilter("s")}
        ORDER BY s.SortOrder, s.Id
        """;

    /// <summary>
    /// 詳細頁一次取三段：主體、SEO 的 hreflang 對照、品項卡。
    /// <para>
    /// 用 QueryMultiple 而不是三次往返：Basic 只有 5 DTU，能省的來回就省。
    /// hreflang 由同一 Id 的兩筆 i18n 推導（docs/08 §2.7），不落欄位。
    /// </para>
    /// </summary>
    private static readonly string DetailSql = $"""
        SELECT s.Id, s.Code, s.CoverImagePath, i.Name, i.H1, i.Summary, i.IntroHtml, i.CoverAlt,
               i.Slug, i.SeoTitle, i.SeoDescription, i.CanonicalUrl, i.OgTitle, i.OgDescription,
               COALESCE(s.OgImagePath, s.CoverImagePath) AS OgImagePath
        FROM Solution s
        INNER JOIN SolutionI18n i ON i.SolutionId = s.Id AND i.Lang = @Lang
        WHERE {Common.Sql.PublicFilter("s")} AND i.Slug = @Slug;

        SELECT h.Lang, h.Slug
        FROM SolutionI18n h
        WHERE h.SolutionId = (SELECT SolutionId FROM SolutionI18n WHERE Lang = @Lang AND Slug = @Slug);

        SELECT it.Id, it.ImagePath, it.SortOrder, ii.Name, ii.Description, ii.ImageAlt
        FROM SolutionItem it
        INNER JOIN SolutionItemI18n ii ON ii.SolutionItemId = it.Id AND ii.Lang = @Lang
        WHERE {Common.Sql.PublicFlag("it")}
          AND it.SolutionId = (SELECT SolutionId FROM SolutionI18n WHERE Lang = @Lang AND Slug = @Slug)
        ORDER BY it.SortOrder, it.Id;
        """;

    public async Task<IEnumerable<SolutionListDto>> GetPublishedAsync(string lang) =>
        await db.QueryAsync<SolutionListDto>(ListSql, new { Lang = lang, Now = Clock.UtcNow });

    public async Task<SolutionDetailDto?> GetBySlugAsync(string lang, string slug)
    {
        await using var grid = await db.QueryMultipleAsync(DetailSql, new { Lang = lang, Slug = slug, Now = Clock.UtcNow });

        var row = await grid.ReadSingleOrDefaultAsync<SolutionDetailRow>();
        if (row is null) return null;

        var hreflang = await grid.ReadAsync<(string Lang, string Slug)>();
        var items    = await grid.ReadAsync<SolutionItemDto>();

        return row.ToDto(hreflang, items);
    }

    /// <summary>Dapper 投影用的扁平列——DTO 是巢狀的（Seo 子物件），SQL 回來的是一張表。</summary>
    private sealed class SolutionDetailRow
    {
        public int     Id             { get; set; }
        public string  Code           { get; set; } = null!;
        public string  CoverImagePath { get; set; } = null!;
        public string  Name           { get; set; } = null!;
        public string  H1             { get; set; } = null!;
        public string? Summary        { get; set; }
        public string? IntroHtml      { get; set; }
        public string  CoverAlt       { get; set; } = null!;
        public string  Slug           { get; set; } = null!;
        public string? SeoTitle       { get; set; }
        public string? SeoDescription { get; set; }
        public string? CanonicalUrl   { get; set; }
        public string? OgTitle        { get; set; }
        public string? OgDescription  { get; set; }
        public string? OgImagePath    { get; set; }

        public SolutionDetailDto ToDto(
            IEnumerable<(string Lang, string Slug)> hreflang,
            IEnumerable<SolutionItemDto> items) => new()
        {
            Id = Id, Code = Code, CoverImagePath = CoverImagePath,
            Name = Name, H1 = H1, Summary = Summary, IntroHtml = IntroHtml, CoverAlt = CoverAlt,
            Seo = new SeoDto
            {
                Slug = Slug, SeoTitle = SeoTitle, SeoDescription = SeoDescription,
                CanonicalUrl = CanonicalUrl, OgTitle = OgTitle, OgDescription = OgDescription,
                OgImagePath = OgImagePath,
                Hreflang = hreflang.ToDictionary(x => x.Lang, x => x.Slug),
            },
            Items = items,
        };
    }
}
