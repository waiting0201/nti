using Dapper;
using Nti.Api.Models.Dtos;
using System.Data;

namespace Nti.Api.Services.Dapper;

public interface IPageReadService
{
    Task<PageDto?> GetByKeyAsync(string lang, string pageKey);
}

/// <summary>固定頁的 SEO（後台單元 15）。29 筆固定頁不可增刪，key 值域見 Common.PageKeys。</summary>
public sealed class PageReadService(IDbConnection db) : IPageReadService
{
    private const string Sql = """
        SELECT p.Id, p.PageKey, p.RouteTemplate, p.HasRichBody, p.IsIndexable,
               i.BodyHtml, i.Slug, i.SeoTitle, i.SeoDescription, i.CanonicalUrl,
               i.OgTitle, i.OgDescription, p.OgImagePath
        FROM Page p
        INNER JOIN PageI18n i ON i.PageId = p.Id AND i.Lang = @Lang
        WHERE p.IsDeleted = 0 AND p.PageKey = @PageKey;

        SELECT h.Lang, h.Slug
        FROM PageI18n h
        INNER JOIN Page pp ON pp.Id = h.PageId
        WHERE pp.PageKey = @PageKey;
        """;

    public async Task<PageDto?> GetByKeyAsync(string lang, string pageKey)
    {
        await using var grid = await db.QueryMultipleAsync(Sql, new { Lang = lang, PageKey = pageKey });

        var row = await grid.ReadSingleOrDefaultAsync<PageRow>();
        if (row is null) return null;

        var hreflang = await grid.ReadAsync<(string Lang, string Slug)>();
        return row.ToDto(hreflang);
    }

    private sealed class PageRow
    {
        public int     Id            { get; set; }
        public string  PageKey       { get; set; } = null!;
        public string  RouteTemplate { get; set; } = null!;
        public bool    HasRichBody   { get; set; }
        public bool    IsIndexable   { get; set; }
        public string? BodyHtml      { get; set; }
        public string  Slug          { get; set; } = null!;
        public string? SeoTitle      { get; set; }
        public string? SeoDescription { get; set; }
        public string? CanonicalUrl  { get; set; }
        public string? OgTitle       { get; set; }
        public string? OgDescription { get; set; }
        public string? OgImagePath   { get; set; }

        public PageDto ToDto(IEnumerable<(string Lang, string Slug)> hreflang) => new()
        {
            Id = Id, PageKey = PageKey, RouteTemplate = RouteTemplate,
            HasRichBody = HasRichBody, IsIndexable = IsIndexable,
            // 只有 HasRichBody = 1 的兩頁（privacy-legal、預留的 green-csr）才有內文
            BodyHtml = HasRichBody ? BodyHtml : null,
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
