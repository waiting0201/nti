using Dapper;
using Nti.Api.Common;
using Nti.Api.Models.Dtos;
using System.Data;

namespace Nti.Api.Services.Dapper;

public interface ISupplierReadService
{
    Task<IEnumerable<SupplierNoticeDto>> GetNoticesAsync(string lang, int? categoryId);
    Task<PagedResult<SupplierNoticeDto>> GetNoticesPagedAsync(string lang, int? categoryId, Paging paging);
    Task<IEnumerable<SupplierSpecDto>> GetSpecsAsync(string lang);
    Task<IEnumerable<SupplierDownloadDto>> GetDownloadsAsync(string lang);
    Task<SupplierDownloadDto?> GetDownloadAsync(string lang, int id);
    Task<bool> IncrementDownloadCountAsync(int id);
}

/// <summary>
/// 供應商專區（後台單元 12／13／14）。三個單元共用一支 ReadService——
/// 它們在前台是同一頁的三個區塊，分三支只會讓 Handler 多注入兩個相依。
/// </summary>
public sealed class SupplierReadService(IDbConnection db) : ISupplierReadService
{
    // ── 12 supplier-notice ────────────────────────────────────────────────
    private const string NoticeFrom = """
        FROM SupplierNotice n
        INNER JOIN SupplierNoticeI18n i ON i.SupplierNoticeId = n.Id AND i.Lang = @Lang
        INNER JOIN Category c ON c.Id = n.CategoryId
        INNER JOIN CategoryI18n ci ON ci.CategoryId = c.Id AND ci.Lang = @Lang
        """;

    private static readonly string NoticeWhere = $"""
        WHERE {Common.Sql.PublicFilter("n")}
          AND (@CategoryId IS NULL OR n.CategoryId = @CategoryId)
        """;

    private static readonly string NoticeSql = $"""
        SELECT n.Id, n.CategoryId, c.Code AS CategoryCode, ci.Name AS CategoryName,
               n.NoticeDate, n.AttachmentPath, i.Title, i.BodyHtml
        {NoticeFrom}
        {NoticeWhere}
        ORDER BY n.NoticeDate DESC, n.Id DESC
        """;

    private static readonly string NoticeCountSql = $"SELECT COUNT(*) {NoticeFrom} {NoticeWhere}";

    // ── 13 supplier-spec ──────────────────────────────────────────────────
    private static readonly string SpecSql = $"""
        SELECT s.Id, s.SortOrder, i.Title, i.Description
        FROM SupplierSpec s
        INNER JOIN SupplierSpecI18n i ON i.SupplierSpecId = s.Id AND i.Lang = @Lang
        WHERE {Common.Sql.PublicFlag("s")}
        ORDER BY s.SortOrder, s.Id
        """;

    // ── 14 supplier-download ──────────────────────────────────────────────
    private static readonly string DownloadSelect = $"""
        SELECT d.Id, d.FilePath, d.FileExt, d.FileSizeBytes, d.RequireLogin,
               d.DownloadCount, d.SortOrder, i.Name
        FROM SupplierDownload d
        INNER JOIN SupplierDownloadI18n i ON i.SupplierDownloadId = d.Id AND i.Lang = @Lang
        WHERE {Common.Sql.PublicFlag("d")}
        """;

    public async Task<IEnumerable<SupplierNoticeDto>> GetNoticesAsync(string lang, int? categoryId) =>
        await db.QueryAsync<SupplierNoticeDto>(NoticeSql,
            new { Lang = lang, Now = Clock.UtcNow, CategoryId = categoryId });

    public async Task<PagedResult<SupplierNoticeDto>> GetNoticesPagedAsync(string lang, int? categoryId, Paging paging)
    {
        var p = new { Lang = lang, Now = Clock.UtcNow, CategoryId = categoryId, Skip = paging.Skip, Take = paging.PageSize };

        var total = await db.ExecuteScalarAsync<int>(NoticeCountSql, p);
        var rows  = await db.QueryAsync<SupplierNoticeDto>($"{NoticeSql} {Common.Sql.PageTail}", p);

        return PagedResult<SupplierNoticeDto>.From(rows, total, paging.Page, paging.PageSize);
    }

    public async Task<IEnumerable<SupplierSpecDto>> GetSpecsAsync(string lang) =>
        await db.QueryAsync<SupplierSpecDto>(SpecSql, new { Lang = lang });

    public async Task<IEnumerable<SupplierDownloadDto>> GetDownloadsAsync(string lang) =>
        await db.QueryAsync<SupplierDownloadDto>($"{DownloadSelect} ORDER BY d.SortOrder, d.Id", new { Lang = lang });

    public async Task<SupplierDownloadDto?> GetDownloadAsync(string lang, int id) =>
        await db.QuerySingleOrDefaultAsync<SupplierDownloadDto>(
            $"{DownloadSelect} AND d.Id = @Id", new { Lang = lang, Id = id });

    /// <summary>
    /// 累計下載次數（<c>POST /supplier/downloads/{id}/hit</c>）。
    /// <para>
    /// ⚠ 這是本 ReadService 唯一的寫入，而且是刻意的例外：它是純計數器、
    /// 不碰稽核欄位也不需要交易，走 EF 會為了 +1 而載入整個 entity。
    /// 任何有業務語意的寫入仍一律走 <c>AppDbContext</c>（docs/10 §3.2 鐵律 2）。
    /// </para>
    /// </summary>
    public async Task<bool> IncrementDownloadCountAsync(int id)
    {
        const string sql = """
            UPDATE SupplierDownload
            SET DownloadCount = DownloadCount + 1
            WHERE Id = @Id AND IsDeleted = 0 AND IsPublished = 1
            """;

        return await db.ExecuteAsync(sql, new { Id = id }) > 0;
    }
}
