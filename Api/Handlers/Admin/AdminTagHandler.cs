using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Nti.Api.Common;
using Nti.Api.Data;
using Nti.Api.Models.Entities;

namespace Nti.Api.Handlers.Admin;

/// <summary>
/// 單元 25 tag（後台）。<see cref="AdminCategoryHandler"/> 的同型結構：主表 + i18n 名稱，
/// 差別在標籤多了一個進網址的 <c>Slug</c>，以及與消息的多對多。
/// <para>
/// 與前台的 <c>TagReadService</c> 不同，這裡**看得到全部標籤**（含還沒掛任何消息的）——
/// 編輯要先建標籤才能掛到消息上，前台則只列有內容的那些。
/// </para>
/// </summary>
public sealed partial class AdminTagHandler(AppDbContext db)
{
    /// <summary>Slug 值域：ASCII 小寫、數字與連字號（客戶 2026-09-08 SEO 簡報的網址規則）。</summary>
    [GeneratedRegex("^[a-z0-9]+(?:-[a-z0-9]+)*$")]
    private static partial Regex SlugPattern { get; }

    public async Task<IActionResult> GetListAsync(HttpRequest req)
    {
        var keyword = QueryValues.Text(req, "keyword");

        var query = db.Tag.AsNoTracking().Where(t => !t.IsDeleted);

        // 標籤看得到的字有兩處：主表的 slug 與 i18n 的名稱，兩邊都要能搜到
        if (keyword is not null)
        {
            var onTag  = KeywordSearch.Predicate<Tag>(db.Model.FindEntityType(typeof(Tag))!, keyword);
            var onI18n = KeywordSearch.Predicate<TagI18n>(db.Model.FindEntityType(typeof(TagI18n))!, keyword);

            var matched = db.TagI18n.AsNoTracking().Where(onI18n!).Select(i => i.TagId);
            query = query.Where(KeywordSearch.Or(onTag!, t => matched.Contains(t.Id)));
        }

        var tags = await query.OrderBy(t => t.SortOrder).ThenBy(t => t.Id).ToListAsync();
        var ids  = tags.Select(t => t.Id).ToList();

        var names = await db.TagI18n.AsNoTracking()
            .Where(i => ids.Contains(i.TagId))
            .Select(i => new { i.TagId, i.Lang, i.Name })
            .ToListAsync();

        // 掛了幾篇消息。與分類一樣，刪除前要顯示前台影響（docs/09 §5.7），
        // 而且畫面是 render 當下同步讀這個數字，不能變成另一次往返。
        var usage = await db.NewsTag.AsNoTracking()
            .Where(nt => ids.Contains(nt.TagId))
            .GroupBy(nt => nt.TagId)
            .Select(g => new { TagId = g.Key, Count = g.Count() })
            .ToListAsync();

        var rows = tags.Select(t => new
        {
            t.Id, t.Slug, t.SortOrder, t.IsActive,
            usageCount = usage.FirstOrDefault(u => u.TagId == t.Id)?.Count ?? 0,
            i18n = names.Where(n => n.TagId == t.Id).ToDictionary(n => n.Lang, n => n.Name),
        });

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(rows));
    }

    /// <summary>
    /// 取單筆。後台的編輯畫面進去就打這支——少了它點任何一筆標籤都是 404
    /// （與單元 16 轉址同一個疏漏，2026-09-09 一起補）。
    /// </summary>
    public async Task<IActionResult> GetByIdAsync(HttpRequest req, string rawId)
    {
        var tag = await FindAsync(rawId);

        var names = await db.TagI18n.AsNoTracking()
            .Where(i => i.TagId == tag.Id)
            .Select(i => new { i.Lang, i.Name })
            .ToListAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(new
        {
            tag.Id, tag.Slug, tag.SortOrder, tag.IsActive,
            usageCount = await db.NewsTag.CountAsync(nt => nt.TagId == tag.Id),
            i18n = names.ToDictionary(n => n.Lang, n => n.Name),
        }));
    }

    public async Task<IActionResult> CreateAsync(HttpRequest req)
    {
        var dto = await req.ReadFromJsonAsync<TagUpsertDto>()
            ?? throw AppException.BadRequest(ErrorCodes.ValidationRequired, "缺少內容。");

        var slug = Normalize(dto.Slug);
        Validate(slug);

        if (await db.Tag.AnyAsync(t => !t.IsDeleted && t.Slug == slug))
            throw AppException.Conflict(ErrorCodes.ConflictDuplicate, $"標籤 {slug} 已存在。");

        var tag = new Tag { Slug = slug, SortOrder = dto.SortOrder, IsActive = dto.IsActive };

        var strategy = db.Database.CreateExecutionStrategy();
        await strategy.ExecuteAsync(async () =>
        {
            await using var tx = await db.Database.BeginTransactionAsync();

            db.Tag.Add(tag);
            await db.SaveChangesAsync();

            foreach (var (lang, name) in dto.I18n)
            {
                if (!Langs.All.Contains(lang)) continue;
                db.TagI18n.Add(new TagI18n { TagId = tag.Id, Lang = lang, Name = name });
            }

            await db.SaveChangesAsync();
            await tx.CommitAsync();
        });

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(new { id = tag.Id }));
    }

    public async Task<IActionResult> UpdateAsync(HttpRequest req, string rawId)
    {
        var tag = await FindAsync(rawId);
        var dto = await req.ReadFromJsonAsync<TagUpsertDto>()
            ?? throw AppException.BadRequest(ErrorCodes.ValidationRequired, "缺少內容。");

        var slug = Normalize(dto.Slug);
        Validate(slug);

        // 改 slug 等於改前台網址（/{lang}/news/tag/{slug}）。舊網址不自動轉址——
        // 這裡沒辦法判斷舊的那個有沒有被外部連結引用，硬塞一筆 301 反而會在
        // 轉址表裡累積垃圾。要保留舊網址請自行到單元 16 建一筆。
        if (!string.Equals(tag.Slug, slug, StringComparison.Ordinal)
            && await db.Tag.AnyAsync(t => !t.IsDeleted && t.Slug == slug && t.Id != tag.Id))
            throw AppException.Conflict(ErrorCodes.ConflictDuplicate, $"標籤 {slug} 已存在。");

        tag.Slug      = slug;
        tag.SortOrder = dto.SortOrder;
        tag.IsActive  = dto.IsActive;

        foreach (var (lang, name) in dto.I18n)
        {
            if (!Langs.All.Contains(lang)) continue;

            var existing = await db.TagI18n.FirstOrDefaultAsync(i => i.TagId == tag.Id && i.Lang == lang);
            if (existing is null) db.TagI18n.Add(new TagI18n { TagId = tag.Id, Lang = lang, Name = name });
            else existing.Name = name;
        }

        await db.SaveChangesAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok("已更新。"));
    }

    public async Task<IActionResult> DeleteAsync(HttpRequest req, string rawId)
    {
        var tag = await FindAsync(rawId);

        // 還掛著消息就不給刪，與分類同一條規則。NewsTag → Tag 的 FK 是 Restrict，
        // 不先擋的話 DB 一樣會擋，只是操作者看不到「是哪些消息還掛著」這個理由。

        if (await db.NewsTag.AnyAsync(nt => nt.TagId == tag.Id))
            throw AppException.Conflict(ErrorCodes.ConflictState, "仍有消息使用此標籤，請先從那些消息移除。");

        db.Tag.Remove(tag);
        await db.SaveChangesAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok("已刪除。"));
    }

    /// <summary>拖曳排序（docs/09 §5.1）。內容單元走泛型 handler 的同名方法，標籤這條是自己的。</summary>
    public async Task<IActionResult> SortAsync(HttpRequest req)
    {
        var items = await req.ReadFromJsonAsync<List<Models.Dtos.SortItemDto>>() ?? [];
        if (items.Count == 0)
            throw AppException.BadRequest(ErrorCodes.ValidationRequired, "缺少排序內容。");

        var ids  = items.Select(i => i.Id).ToList();
        var tags = await db.Tag.Where(t => ids.Contains(t.Id) && !t.IsDeleted).ToListAsync();

        foreach (var tag in tags)
            tag.SortOrder = items.First(i => i.Id == tag.Id).SortOrder;

        await db.SaveChangesAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok("排序已更新。"));
    }

    private async Task<Tag> FindAsync(string rawId)
    {
        if (!int.TryParse(rawId, out var id))
            throw AppException.BadRequest(ErrorCodes.ValidationFormat, "id 必須是整數。");

        return await db.Tag.FirstOrDefaultAsync(t => t.Id == id && !t.IsDeleted)
            ?? throw AppException.NotFound("Tag");
    }

    /// <summary>大小寫與前後空白一律正規化，避免同一個標籤靠大小寫混進兩筆。</summary>
    private static string Normalize(string? slug) => (slug ?? string.Empty).Trim().ToLowerInvariant();

    private static void Validate(string slug)
    {
        if (string.IsNullOrWhiteSpace(slug))
            throw AppException.BadRequest(ErrorCodes.ValidationRequired, "slug 為必填。");

        if (slug.Length > 160)
            throw AppException.BadRequest(ErrorCodes.ValidationFormat, "slug 不可超過 160 字元。");

        if (!SlugPattern.IsMatch(slug))
            throw AppException.BadRequest(ErrorCodes.ValidationFormat,
                "slug 僅能使用小寫英數與連字號（例：green-printing）。");
    }

    private sealed class TagUpsertDto
    {
        public string? Slug      { get; set; }
        public int     SortOrder { get; set; }
        public bool    IsActive  { get; set; } = true;
        public Dictionary<string, string> I18n { get; set; } = [];
    }
}
