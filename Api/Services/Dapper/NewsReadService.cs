using Dapper;
using Nti.Api.Common;
using Nti.Api.Models.Dtos;
using System.Data;

namespace Nti.Api.Services.Dapper;

public interface INewsReadService
{
    Task<IEnumerable<NewsListDto>> GetAllAsync(string lang, int? categoryId);
    Task<PagedResult<NewsListDto>> GetPagedAsync(string lang, int? categoryId, Paging paging);
    Task<IEnumerable<NewsListDto>> GetFeaturedAsync(string lang, int take);
    Task<NewsDetailDto?> GetBySlugAsync(string lang, string slug);
}

/// <summary>最新消息（後台單元 04）。</summary>
public sealed class NewsReadService(IDbConnection db) : INewsReadService
{
    private const string From = """
        FROM News n
        INNER JOIN NewsI18n i ON i.NewsId = n.Id AND i.Lang = @Lang
        INNER JOIN Category c ON c.Id = n.CategoryId
        INNER JOIN CategoryI18n ci ON ci.CategoryId = c.Id AND ci.Lang = @Lang
        """;

    /// <summary>清單與詳細頁共用同一份可見性條件，避免「列表看得到、點進去 404」。</summary>
    private static readonly string Where = $"""
        WHERE {Common.Sql.PublicFilter("n")}
          AND (@CategoryId IS NULL OR n.CategoryId = @CategoryId)
        """;

    private static readonly string ListSelect = $"""
        SELECT n.Id, n.CategoryId, c.Code AS CategoryCode, ci.Name AS CategoryName,
               n.PublishDate, n.CoverImagePath, n.IsFeaturedHome,
               i.Title, i.Summary, i.CoverAlt, i.Slug
        {From}
        {Where}
        ORDER BY n.PublishDate DESC, n.Id DESC
        """;

    private static readonly string CountSql = $"SELECT COUNT(*) {From} {Where}";

    private static readonly string PagedSql = $"{ListSelect} {Common.Sql.PageTail}";

    private static readonly string DetailSql = $"""
        SELECT n.Id, n.CategoryId, c.Code AS CategoryCode, ci.Name AS CategoryName,
               n.PublishDate, n.CoverImagePath, i.Title, i.Summary, i.BodyHtml, i.CoverAlt,
               i.Slug, i.SeoTitle, i.SeoDescription, i.CanonicalUrl, i.OgTitle, i.OgDescription,
               COALESCE(n.OgImagePath, n.CoverImagePath) AS OgImagePath
        FROM News n
        INNER JOIN NewsI18n i ON i.NewsId = n.Id AND i.Lang = @Lang
        INNER JOIN Category c ON c.Id = n.CategoryId
        INNER JOIN CategoryI18n ci ON ci.CategoryId = c.Id AND ci.Lang = @Lang
        WHERE {Common.Sql.PublicFilter("n")} AND i.Slug = @Slug;

        SELECT h.Lang, h.Slug
        FROM NewsI18n h
        WHERE h.NewsId = (SELECT NewsId FROM NewsI18n WHERE Lang = @Lang AND Slug = @Slug);
        """;

    private static readonly string FeaturedSql = $"""
        SELECT TOP (@Take) n.Id, n.CategoryId, c.Code AS CategoryCode, ci.Name AS CategoryName,
               n.PublishDate, n.CoverImagePath, n.IsFeaturedHome,
               i.Title, i.Summary, i.CoverAlt, i.Slug
        {From}
        WHERE {Common.Sql.PublicFilter("n")} AND n.IsFeaturedHome = 1
        ORDER BY n.PublishDate DESC, n.Id DESC
        """;

    public async Task<IEnumerable<NewsListDto>> GetAllAsync(string lang, int? categoryId) =>
        await db.QueryAsync<NewsListDto>(ListSelect,
            new { Lang = lang, Now = Clock.UtcNow, CategoryId = categoryId });

    public async Task<PagedResult<NewsListDto>> GetPagedAsync(string lang, int? categoryId, Paging paging)
    {
        var p = new { Lang = lang, Now = Clock.UtcNow, CategoryId = categoryId, Skip = paging.Skip, Take = paging.PageSize };

        var total = await db.ExecuteScalarAsync<int>(CountSql, p);
        var rows  = await db.QueryAsync<NewsListDto>(PagedSql, p);

        return PagedResult<NewsListDto>.From(rows, total, paging.Page, paging.PageSize);
    }

    public async Task<IEnumerable<NewsListDto>> GetFeaturedAsync(string lang, int take) =>
        await db.QueryAsync<NewsListDto>(FeaturedSql, new { Lang = lang, Now = Clock.UtcNow, Take = take });

    public async Task<NewsDetailDto?> GetBySlugAsync(string lang, string slug)
    {
        await using var grid = await db.QueryMultipleAsync(DetailSql, new { Lang = lang, Slug = slug, Now = Clock.UtcNow });

        var row = await grid.ReadSingleOrDefaultAsync<NewsDetailRow>();
        if (row is null) return null;

        var hreflang = await grid.ReadAsync<(string Lang, string Slug)>();
        return row.ToDto(hreflang);
    }

    private sealed class NewsDetailRow
    {
        public int      Id             { get; set; }
        public int      CategoryId     { get; set; }
        public string   CategoryCode   { get; set; } = null!;
        public string   CategoryName   { get; set; } = null!;
        public DateOnly PublishDate    { get; set; }
        public string   CoverImagePath { get; set; } = null!;
        public string   Title          { get; set; } = null!;
        public string?  Summary        { get; set; }
        public string   BodyHtml       { get; set; } = null!;
        public string   CoverAlt       { get; set; } = null!;
        public string   Slug           { get; set; } = null!;
        public string?  SeoTitle       { get; set; }
        public string?  SeoDescription { get; set; }
        public string?  CanonicalUrl   { get; set; }
        public string?  OgTitle        { get; set; }
        public string?  OgDescription  { get; set; }
        public string?  OgImagePath    { get; set; }

        public NewsDetailDto ToDto(IEnumerable<(string Lang, string Slug)> hreflang) => new()
        {
            Id = Id, CategoryId = CategoryId, CategoryCode = CategoryCode, CategoryName = CategoryName,
            PublishDate = PublishDate, CoverImagePath = CoverImagePath,
            Title = Title, Summary = Summary, BodyHtml = BodyHtml, CoverAlt = CoverAlt,
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
