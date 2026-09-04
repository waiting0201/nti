using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Nti.Api.Common;
using Nti.Api.Data;
using Nti.Api.Models.Dtos;
using Nti.Api.Models.Entities;
using Nti.Api.Services;

namespace Nti.Api.Handlers.Admin;

/// <summary>
/// 09 client。<b>唯一沒有 i18n 側表的內容單元</b>（品牌名不翻譯），
/// 故不能用 <see cref="AdminContentHandler{TEntity, TI18n}"/>，另寫一份。
/// </summary>
public sealed class AdminClientHandler(AppDbContext db)
{
    public async Task<IActionResult> GetListAsync(HttpRequest req)
    {
        var paging = Paging.From(req);
        var query  = db.ClientLogo.AsNoTracking().Where(x => !x.IsDeleted);

        var total = await query.CountAsync();
        var rows  = await query.OrderBy(x => x.SortOrder).ThenBy(x => x.Id)
            .Skip(paging.Skip).Take(paging.PageSize).ToListAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(PagedResult<ClientLogo>.From(rows, total, paging.Page, paging.PageSize)));
    }

    public async Task<IActionResult> GetByIdAsync(HttpRequest req, string rawId)
    {
        var item = await FindAsync(rawId);

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(item));
    }

    public async Task<IActionResult> CreateAsync(HttpRequest req)
    {
        var dto = await req.ReadFromJsonAsync<ClientLogo>()
            ?? throw AppException.BadRequest(ErrorCodes.ValidationRequired, "缺少內容。");

        if (string.IsNullOrWhiteSpace(dto.Name) || string.IsNullOrWhiteSpace(dto.LogoPath))
            throw AppException.BadRequest(ErrorCodes.ValidationRequired, "name 與 logoPath 為必填。");

        dto.Id = 0;
        db.ClientLogo.Add(dto);
        await db.SaveChangesAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(new { id = dto.Id }));
    }

    public async Task<IActionResult> UpdateAsync(HttpRequest req, string rawId)
    {
        var item = await FindAsync(rawId);
        var dto  = await req.ReadFromJsonAsync<ClientLogo>()
            ?? throw AppException.BadRequest(ErrorCodes.ValidationRequired, "缺少內容。");

        if (!string.IsNullOrWhiteSpace(dto.Name))     item.Name     = dto.Name;
        if (!string.IsNullOrWhiteSpace(dto.LogoPath)) item.LogoPath = dto.LogoPath;
        item.LinkUrl     = dto.LinkUrl;
        item.SortOrder   = dto.SortOrder;
        item.IsPublished = dto.IsPublished;

        await db.SaveChangesAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok("已更新。"));
    }

    public async Task<IActionResult> DeleteAsync(HttpRequest req, string rawId)
    {
        db.ClientLogo.Remove(await FindAsync(rawId));   // 軟刪，由 SaveChanges 改寫
        await db.SaveChangesAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok("已刪除。"));
    }

    private async Task<ClientLogo> FindAsync(string rawId)
    {
        if (!int.TryParse(rawId, out var id))
            throw AppException.BadRequest(ErrorCodes.ValidationFormat, "id 必須是數字。");

        return await db.ClientLogo.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted)
            ?? throw AppException.NotFound("ClientLogo");
    }
}

/// <summary>
/// 後台圖片上傳。掛在各單元底下（<c>POST /admin/{unit}/upload</c>）並沿用該單元的
/// <c>{unit}.edit</c> 權限——另開一個 <c>media.*</c> 權限碼會讓 171 列的矩陣對不上。
/// </summary>
public sealed class AdminMediaHandler(IBlobStorageService blobs)
{
    public async Task<IActionResult> UploadAsync(HttpRequest req)
    {
        if (!req.HasFormContentType)
            throw AppException.BadRequest(ErrorCodes.UploadType, "請以 multipart/form-data 上傳。");

        var form = await req.ReadFormAsync();
        var file = form.Files.FirstOrDefault()
            ?? throw AppException.BadRequest(ErrorCodes.ValidationRequired, "缺少檔案。");

        var ext = Path.GetExtension(file.FileName);

        if (!UploadRules.ImageExtensions.Contains(ext, StringComparer.OrdinalIgnoreCase))
            throw AppException.BadRequest(ErrorCodes.UploadType,
                $"不支援的格式：{ext}。可接受 {string.Join("、", UploadRules.ImageExtensions)}。");

        if (file.Length > UploadRules.ImageMaxBytes)
            throw AppException.BadRequest(ErrorCodes.UploadSize, "檔案超過 10MB。");

        await using var stream = file.OpenReadStream();

        // 只信檔頭（docs/10 §9.5）：SVG 是純文字，另以開頭標籤判斷
        if (!await FileSignatureValidator.IsValidAsync(stream, file.FileName))
            throw AppException.BadRequest(ErrorCodes.UploadType, "檔案內容與副檔名不符。");

        var path = await blobs.UploadAsync(UploadRules.Containers.Media, file.FileName, stream, file.ContentType);

        CacheControl.NoStore(req.HttpContext.Response);
        // 回相對路徑，不是 URL：DB 存的就是這個（docs/08 §2.6）
        return new OkObjectResult(ApiResponse.Ok(new { path }));
    }
}

/// <summary>21 setting。key-value，只能改值不能增刪 key。</summary>
public sealed class AdminSettingHandler(AppDbContext db)
{
    public async Task<IActionResult> GetListAsync(HttpRequest req)
    {
        // 後台看得到全部 15 個 key，包含前台不外露的 Mail 群組
        var rows = await db.SiteSetting.AsNoTracking()
            .OrderBy(x => x.GroupName).ThenBy(x => x.SortOrder).ThenBy(x => x.SettingKey)
            .ToListAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(rows));
    }

    /// <summary>整批更新。後台的設定頁是一次送出整張表單，逐筆 PUT 會留下半套設定。</summary>
    public async Task<IActionResult> UpdateAsync(HttpRequest req)
    {
        var items = await req.ReadFromJsonAsync<List<SiteSetting>>() ?? [];
        if (items.Count == 0)
            throw AppException.BadRequest(ErrorCodes.ValidationRequired, "缺少內容。");

        var keys     = items.Select(i => i.SettingKey).ToList();
        var settings = await db.SiteSetting.Where(x => keys.Contains(x.SettingKey)).ToListAsync();

        var unknown = keys.Except(settings.Select(s => s.SettingKey)).ToArray();
        if (unknown.Length > 0)
            throw AppException.NotFound($"設定 key {string.Join("、", unknown)}");

        foreach (var setting in settings)
        {
            var input = items.First(i => i.SettingKey == setting.SettingKey);
            setting.ValueZh   = input.ValueZh;
            setting.ValueEn   = input.ValueEn;
            setting.UpdatedAt = Clock.UtcNow;
            setting.UpdatedBy = RequestContext.UserId(req.HttpContext.User);
        }

        await db.SaveChangesAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok($"已更新 {settings.Count} 筆設定。"));
    }
}

/// <summary>22 category。九種 CategoryType 共用同一個單元。</summary>
public sealed class AdminCategoryHandler(AppDbContext db)
{
    public async Task<IActionResult> GetListAsync(HttpRequest req)
    {
        var type = QueryValues.Text(req, "type");

        if (type is not null && !CategoryTypes.All.Contains(type))
            throw AppException.BadRequest(ErrorCodes.ValidationFormat, "type 不在值域內。");

        var categories = await db.Category.AsNoTracking()
            .Where(c => !c.IsDeleted && (type == null || c.CategoryType == type))
            .OrderBy(c => c.CategoryType).ThenBy(c => c.SortOrder).ThenBy(c => c.Id)
            .ToListAsync();

        // 名稱另外查再併起來：ToDictionary 沒辦法翻成 SQL（EF 會在執行期丟
        // 「LINQ expression could not be translated」，編譯期看不出來）
        var ids   = categories.Select(c => c.Id).ToList();
        var names = await db.CategoryI18n.AsNoTracking()
            .Where(i => ids.Contains(i.CategoryId))
            .Select(i => new { i.CategoryId, i.Lang, i.Name })
            .ToListAsync();

        // 每個分類被幾筆內容引用。後台刪除前要顯示前台影響（docs/09 §5.7），
        // 而且 UI 是在 render 時同步取這個數字，不能讓它變成另一次往返。
        var usage = await CountUsageAsync(ids);

        var rows = categories.Select(c => new
        {
            c.Id, c.CategoryType, c.Code, c.SortOrder, c.IsActive,
            usageCount = usage.GetValueOrDefault(c.Id),
            i18n = names.Where(n => n.CategoryId == c.Id).ToDictionary(n => n.Lang, n => n.Name),
        });

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(rows));
    }

    public async Task<IActionResult> CreateAsync(HttpRequest req)
    {
        var dto = await req.ReadFromJsonAsync<CategoryUpsertDto>()
            ?? throw AppException.BadRequest(ErrorCodes.ValidationRequired, "缺少內容。");

        if (string.IsNullOrWhiteSpace(dto.CategoryType) || !CategoryTypes.All.Contains(dto.CategoryType))
            throw AppException.BadRequest(ErrorCodes.ValidationFormat, "categoryType 不在值域內。");

        if (string.IsNullOrWhiteSpace(dto.Code))
            throw AppException.BadRequest(ErrorCodes.ValidationRequired, "code 為必填。");

        if (await db.Category.AnyAsync(c => c.CategoryType == dto.CategoryType && c.Code == dto.Code))
            throw AppException.Conflict(ErrorCodes.ConflictDuplicate, "同型別下的 code 已存在。");

        var category = new Category
        {
            CategoryType = dto.CategoryType,
            Code         = dto.Code,
            SortOrder    = dto.SortOrder,
            IsActive     = dto.IsActive,
        };

        var strategy = db.Database.CreateExecutionStrategy();
        await strategy.ExecuteAsync(async () =>
        {
            await using var tx = await db.Database.BeginTransactionAsync();

            db.Category.Add(category);
            await db.SaveChangesAsync();

            foreach (var (lang, name) in dto.I18n)
                db.CategoryI18n.Add(new CategoryI18n { CategoryId = category.Id, Lang = lang, Name = name });

            await db.SaveChangesAsync();
            await tx.CommitAsync();
        });

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(new { id = category.Id }));
    }

    public async Task<IActionResult> UpdateAsync(HttpRequest req, string rawId)
    {
        var category = await FindAsync(rawId);
        var dto = await req.ReadFromJsonAsync<CategoryUpsertDto>()
            ?? throw AppException.BadRequest(ErrorCodes.ValidationRequired, "缺少內容。");

        // CategoryType 與 Code 建立後不可改：下游內容表用複合外鍵綁著型別，
        // 改型別會讓既有內容的分類指向錯誤的值域（docs/08 §4.1「建立後不可改」）
        category.SortOrder = dto.SortOrder;
        category.IsActive  = dto.IsActive;

        foreach (var (lang, name) in dto.I18n)
        {
            if (!Langs.All.Contains(lang)) continue;

            var existing = await db.CategoryI18n.FirstOrDefaultAsync(i => i.CategoryId == category.Id && i.Lang == lang);
            if (existing is null)
                db.CategoryI18n.Add(new CategoryI18n { CategoryId = category.Id, Lang = lang, Name = name });
            else
                existing.Name = name;
        }

        await db.SaveChangesAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok("已更新。"));
    }

    public async Task<IActionResult> DeleteAsync(HttpRequest req, string rawId)
    {
        var category = await FindAsync(rawId);

        // 有內容掛在底下就不給刪：軟刪主檔會讓那些內容的分類名稱查不到（前台 INNER JOIN 會整筆消失）
        if (await IsInUseAsync(category.Id))
            throw AppException.Conflict(ErrorCodes.ConflictState, "仍有內容使用此分類，請先移除或改分類。");

        db.Category.Remove(category);
        await db.SaveChangesAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok("已刪除。"));
    }

    /// <summary>
    /// 各分類的引用筆數。逐表 GROUP BY 再合併，而不是每個分類跑八個子查詢——
    /// 44 個分類 × 8 張表會變成 352 次查詢，Basic 的 5 DTU 撐不住。
    /// </summary>
    private async Task<Dictionary<int, int>> CountUsageAsync(List<int> ids)
    {
        var totals = new Dictionary<int, int>();

        async Task AddAsync(IQueryable<int> categoryIds)
        {
            var groups = await categoryIds
                .GroupBy(id => id)
                .Select(g => new { CategoryId = g.Key, Count = g.Count() })
                .ToListAsync();

            foreach (var g in groups)
                totals[g.CategoryId] = totals.GetValueOrDefault(g.CategoryId) + g.Count;
        }

        await AddAsync(db.News.Where(x => !x.IsDeleted && ids.Contains(x.CategoryId)).Select(x => x.CategoryId));
        await AddAsync(db.Project.Where(x => !x.IsDeleted && ids.Contains(x.CategoryId)).Select(x => x.CategoryId));
        await AddAsync(db.Vlog.Where(x => !x.IsDeleted && ids.Contains(x.CategoryId)).Select(x => x.CategoryId));
        await AddAsync(db.FacilityItem.Where(x => !x.IsDeleted && ids.Contains(x.CategoryId)).Select(x => x.CategoryId));
        await AddAsync(db.SupplierNotice.Where(x => !x.IsDeleted && ids.Contains(x.CategoryId)).Select(x => x.CategoryId));
        await AddAsync(db.Faq.Where(x => !x.IsDeleted && x.CategoryId != null && ids.Contains(x.CategoryId.Value))
                             .Select(x => x.CategoryId!.Value));
        await AddAsync(db.Certification.Where(x => !x.IsDeleted && x.CategoryId != null && ids.Contains(x.CategoryId.Value))
                             .Select(x => x.CategoryId!.Value));
        await AddAsync(db.QuoteRequest.Where(x => !x.IsDeleted && x.IndustryCategoryId != null && ids.Contains(x.IndustryCategoryId.Value))
                             .Select(x => x.IndustryCategoryId!.Value));
        await AddAsync(db.QuoteRequest.Where(x => !x.IsDeleted && x.MaterialCategoryId != null && ids.Contains(x.MaterialCategoryId.Value))
                             .Select(x => x.MaterialCategoryId!.Value));

        return totals;
    }

    private async Task<bool> IsInUseAsync(int id) =>
        await db.News.AnyAsync(x => x.CategoryId == id && !x.IsDeleted)
        || await db.Project.AnyAsync(x => x.CategoryId == id && !x.IsDeleted)
        || await db.Vlog.AnyAsync(x => x.CategoryId == id && !x.IsDeleted)
        || await db.Faq.AnyAsync(x => x.CategoryId == id && !x.IsDeleted)
        || await db.Certification.AnyAsync(x => x.CategoryId == id && !x.IsDeleted)
        || await db.FacilityItem.AnyAsync(x => x.CategoryId == id && !x.IsDeleted)
        || await db.SupplierNotice.AnyAsync(x => x.CategoryId == id && !x.IsDeleted)
        || await db.QuoteRequest.AnyAsync(x => (x.IndustryCategoryId == id || x.MaterialCategoryId == id) && !x.IsDeleted);

    private async Task<Category> FindAsync(string rawId)
    {
        if (!int.TryParse(rawId, out var id))
            throw AppException.BadRequest(ErrorCodes.ValidationFormat, "id 必須是數字。");

        return await db.Category.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted)
            ?? throw AppException.NotFound("Category");
    }
}

/// <summary>分類新增／修改的請求。i18n 是 <c>{ "zh": "名稱", "en": "Name" }</c>。</summary>
public sealed class CategoryUpsertDto
{
    public string? CategoryType { get; set; }
    public string? Code         { get; set; }
    public int     SortOrder    { get; set; }
    public bool    IsActive     { get; set; } = true;
    public Dictionary<string, string> I18n { get; set; } = [];
}
