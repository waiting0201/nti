using Dapper;
using Nti.Api.Common;
using Nti.Api.Models.Dtos;
using System.Data;

namespace Nti.Api.Services.Dapper;

public interface ITagReadService
{
    Task<IEnumerable<TagDto>> GetAllAsync(string lang);
    Task<TagDto?> GetBySlugAsync(string lang, string slug);
}

/// <summary>
/// 消息標籤（後台單元 25）的純讀服務。
/// <para>
/// 兩個端點都**只回有已上架消息的標籤**（<c>NewsCount &gt; 0</c>）。空標籤的封存頁是
/// Google 眼中的 thin content，列出來只會讓 sitemap 帶一堆沒有內容的網址；
/// 後台看得到全部標籤（走 EF 那條），前台看到的是有東西可看的那些。
/// </para>
/// </summary>
public sealed class TagReadService(IDbConnection db) : ITagReadService
{
    /// <summary>
    /// 標籤的消息計數。可見性條件與 <see cref="NewsReadService"/> 完全一致——
    /// 兩邊不一致就會出現「標籤說有 3 篇、點進去只有 1 篇」。
    /// </summary>
    private static readonly string CountSubquery = $"""
        SELECT COUNT(*)
        FROM NewsTag nt
        INNER JOIN News n ON n.Id = nt.NewsId
        INNER JOIN NewsI18n ni ON ni.NewsId = n.Id AND ni.Lang = @Lang
        WHERE nt.TagId = t.Id AND {Common.Sql.PublicFilter("n")}
        """;

    private static readonly string ListSql = $"""
        SELECT t.Id, t.Slug, i.Name, ({CountSubquery}) AS NewsCount
        FROM Tag t
        INNER JOIN TagI18n i ON i.TagId = t.Id AND i.Lang = @Lang
        WHERE t.IsDeleted = 0 AND t.IsActive = 1
        ORDER BY t.SortOrder, t.Id
        """;

    private static readonly string BySlugSql = $"""
        SELECT t.Id, t.Slug, i.Name, ({CountSubquery}) AS NewsCount
        FROM Tag t
        INNER JOIN TagI18n i ON i.TagId = t.Id AND i.Lang = @Lang
        WHERE t.IsDeleted = 0 AND t.IsActive = 1 AND t.Slug = @Slug
        """;

    public async Task<IEnumerable<TagDto>> GetAllAsync(string lang)
    {
        var rows = await db.QueryAsync<TagDto>(ListSql, new { Lang = lang, Now = Clock.UtcNow });
        return rows.Where(t => t.NewsCount > 0);
    }

    public async Task<TagDto?> GetBySlugAsync(string lang, string slug)
    {
        var row = await db.QuerySingleOrDefaultAsync<TagDto>(BySlugSql,
            new { Lang = lang, Slug = slug, Now = Clock.UtcNow });

        // 標籤存在但這個語系底下沒有已上架消息 → 當成不存在（封存頁 404，不做空頁面）
        return row is { NewsCount: > 0 } ? row : null;
    }
}
