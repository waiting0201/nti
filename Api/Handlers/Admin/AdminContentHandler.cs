using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Nti.Api.Common;
using Nti.Api.Data;
using Nti.Api.Models.Dtos;
using Nti.Api.Models.Entities;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace Nti.Api.Handlers.Admin;

/// <summary>
/// 內容單元 01–14 的後台 CRUD 基底。
/// <para>
/// 這 14 個單元的形狀完全一致：主表（稽核 + 上下架 + 排序）＋ <c>{Entity}I18n</c> 側表。
/// 逐單元手寫 14 份一模一樣的 CRUD，維護時要改 14 個地方，而且一定會有漏改的那個。
/// 共用邏輯放這裡，各單元只宣告自己的差異（標題欄位、i18n 外鍵、有沒有時間窗）。
/// </para>
/// <para>
/// 這不是 Repository Pattern（docs/10 §3.2 鐵律 5 禁止的那個）：它沒有把 DbContext
/// 包在資料存取介面後面，就是一個帶泛型的 Handler，直接用 <see cref="AppDbContext"/>。
/// </para>
/// </summary>
public abstract class AdminContentHandler<TEntity, TI18n>(AppDbContext db)
    where TEntity : class, IAuditable, new()
    where TI18n   : class, II18n, new()
{
    /// <summary>單元代號，用於錯誤訊息與 AuditLog 的 EntityName。</summary>
    protected virtual string EntityName => typeof(TEntity).Name;

    /// <summary>i18n 側表指向主表的外鍵欄位名（由 EF 模型推導，不必各單元自己寫）。</summary>
    private string ForeignKeyName => db.Model.FindEntityType(typeof(TI18n))!
        .FindPrimaryKey()!.Properties
        .Single(p => p.Name != nameof(II18n.Lang)).Name;

    // ── 清單 ──────────────────────────────────────────────────────────────
    public async Task<IActionResult> GetListAsync(HttpRequest req)
    {
        var paging = Paging.From(req);
        var query  = db.Set<TEntity>().AsNoTracking().Where(e => !e.IsDeleted);

        var total = await query.CountAsync();

        // 後台清單一律分頁（docs/10 §8.7）：不帶參數時也用預設 20，
        // 內容累積之後不分頁的清單會把 Basic 的 5 DTU 吃光
        var entities = await query
            .OrderByDescending(e => EF.Property<int>(e, "Id"))
            .Skip(paging.Skip).Take(paging.PageSize)
            .ToListAsync();

        // 取整列再在記憶體投影，而不是在 Select 裡用 EF.Property：
        // 14 個單元的欄位並不齊（News／SupplierNotice 沒有 SortOrder，七個單元沒有上下架時間窗），
        // 在查詢裡引用不存在的欄位會在轉譯時炸掉。主表都是路徑與旗標這種小欄位
        // （大的內文在 i18n 側表），一頁最多 100 筆，取整列不構成負擔。
        var rows = entities.Select(ToRow).ToList();

        await FillI18nAsync(rows);

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(new
        {
            items      = rows,
            totalCount = total,
            page       = paging.Page,
            pageSize   = paging.PageSize,
            totalPages = Math.Max(1, (int)Math.Ceiling((double)total / paging.PageSize)),
        }));
    }

    /// <summary>
    /// 主表的一列攤平成 <c>{ 欄位…, i18n: {} }</c>——後台清單要縮圖、分類、日期這些主表欄位，
    /// 只回標題的話每一列都要再打一次單筆端點。key 一律 camelCase，與 JSON 序列化一致
    /// （Dictionary 的 key 不吃 PropertyNamingPolicy，得自己轉）。
    /// </summary>
    private Dictionary<string, object?> ToRow(TEntity entity)
    {
        var entry = db.Entry(entity);
        var row   = new Dictionary<string, object?>();

        foreach (var property in entry.Metadata.GetProperties())
        {
            // 影子屬性（CategoryTypeGuard 那類）是 DB 層的實作細節，不外露
            if (property.IsShadowProperty()) continue;

            row[Camel(property.Name)] = entry.Property(property.Name).CurrentValue;
        }

        row["i18n"] = new Dictionary<string, Dictionary<string, object?>>();
        return row;
    }

    /// <summary>
    /// 補上中英內容與完成度。
    /// <para>
    /// <b>刻意跳過 nvarchar(max) 欄位</b>（BodyHtml／AnswerHtml…）：清單不需要內文，
    /// 一頁 20 筆的新聞列表會把 40 份內文一起撈出來，在 Basic 的 5 DTU 上很有感。
    /// 需要內文時打單筆端點。
    /// </para>
    /// </summary>
    private async Task FillI18nAsync(List<Dictionary<string, object?>> rows)
    {
        if (rows.Count == 0) return;

        var ids = rows.Select(r => (int)r["id"]!).ToList();
        var fk  = ForeignKeyName;

        var i18ns = await db.Set<TI18n>().AsNoTracking()
            .Where(i => ids.Contains(EF.Property<int>(i, fk)))
            .ToListAsync();

        var i18nType = db.Model.FindEntityType(typeof(TI18n))!;
        var slim = i18nType.GetProperties()
            .Where(p => !p.IsShadowProperty())
            .Where(p => p.Name != fk && p.Name != nameof(II18n.Lang))
            .Where(p => p.ClrType != typeof(string) || p.GetMaxLength() is not null)
            .ToList();

        foreach (var row in rows)
        {
            var id      = (int)row["id"]!;
            var byLang  = new Dictionary<string, Dictionary<string, object?>>();

            foreach (var i18n in i18ns)
            {
                var entry = db.Entry(i18n);
                if ((int)entry.Property(fk).CurrentValue! != id) continue;

                byLang[i18n.Lang] = slim.ToDictionary(
                    p => Camel(p.Name),
                    p => entry.Property(p.Name).CurrentValue);
            }

            row["i18n"]  = byLang;
            row["hasZh"] = byLang.ContainsKey(Langs.Zh);
            row["hasEn"] = byLang.ContainsKey(Langs.En);
        }
    }

    private static string Camel(string name) =>
        name.Length > 0 ? char.ToLowerInvariant(name[0]) + name[1..] : name;

    // ── 單筆 ──────────────────────────────────────────────────────────────
    public async Task<IActionResult> GetByIdAsync(HttpRequest req, string rawId)
    {
        var id     = ParseId(rawId);
        var entity = await FindAsync(id);

        var fk    = ForeignKeyName;
        var i18ns = await db.Set<TI18n>().AsNoTracking()
            .Where(i => EF.Property<int>(i, fk) == id)
            .ToListAsync();

        var row = ToRow(entity);
        row["i18n"] = i18ns.ToDictionary(i => i.Lang, i => (object)i);
        row["hasZh"] = i18ns.Any(i => i.Lang == Langs.Zh);
        row["hasEn"] = i18ns.Any(i => i.Lang == Langs.En);

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(row));
    }

    // ── 新增／修改 ────────────────────────────────────────────────────────
    /// <summary>
    /// 請求格式：<c>{ ...主表欄位..., "i18n": { "zh": {...}, "en": {...} } }</c>。
    /// 兩語系隨資源一併讀寫（04-api §3.4，沒有獨立的 i18n 端點）。
    /// </summary>
    public async Task<IActionResult> CreateAsync(HttpRequest req)
    {
        var (body, i18nNode) = await ReadBodyAsync(req);

        var entity = Deserialize<TEntity>(body) ?? throw AppException.BadRequest(
            ErrorCodes.ValidationRequired, "缺少內容。");

        // Id 與稽核欄位一律忽略請求送來的值：前者由 DB 產生，後者由 SaveChanges 統一填
        db.Entry(entity).Property("Id").CurrentValue = 0;

        var strategy = db.Database.CreateExecutionStrategy();
        await strategy.ExecuteAsync(async () =>
        {
            await using var tx = await db.Database.BeginTransactionAsync();

            db.Set<TEntity>().Add(entity);
            await db.SaveChangesAsync();

            await UpsertI18nAsync((int)db.Entry(entity).Property("Id").CurrentValue!, i18nNode, replace: true);
            await tx.CommitAsync();
        });

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(new { id = db.Entry(entity).Property("Id").CurrentValue }));
    }

    public async Task<IActionResult> UpdateAsync(HttpRequest req, string rawId)
    {
        var id     = ParseId(rawId);
        var entity = await FindAsync(id);
        var (body, i18nNode) = await ReadBodyAsync(req);

        // 逐欄套用：只更新請求有帶的欄位，沒帶的保持原值（PATCH 語意，PUT 也照這樣做，
        // 因為後台的編輯頁不一定會把所有欄位都送回來）
        ApplyScalars(entity, body);

        var strategy = db.Database.CreateExecutionStrategy();
        await strategy.ExecuteAsync(async () =>
        {
            await using var tx = await db.Database.BeginTransactionAsync();

            await db.SaveChangesAsync();
            await UpsertI18nAsync(id, i18nNode, replace: false);
            await tx.CommitAsync();
        });

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok("已更新。"));
    }

    // ── 上下架 ────────────────────────────────────────────────────────────
    /// <summary>
    /// 上架前檢查兩語系齊備（docs/10 §8.3）：只有單一語系就上架，
    /// 另一個語系的前台頁面會直接 404，而且不會有人發現。
    /// </summary>
    public async Task<IActionResult> PublishAsync(HttpRequest req, string rawId)
    {
        var id     = ParseId(rawId);
        var entity = await FindAsync(id);
        var dto    = await req.ReadFromJsonAsync<PublishDto>() ?? new PublishDto();

        if (dto.IsPublished)
        {
            var fk    = ForeignKeyName;
            var langs = await db.Set<TI18n>().AsNoTracking()
                .Where(i => EF.Property<int>(i, fk) == id)
                .Select(i => i.Lang)
                .ToListAsync();

            var missing = Langs.All.Except(langs).ToArray();
            if (missing.Length > 0)
                throw AppException.Conflict(ErrorCodes.ConflictState,
                    $"缺少 {string.Join("、", missing)} 語系內容，無法上架。");
        }

        var entry = db.Entry(entity);
        entry.Property(nameof(IPublishable.IsPublished)).CurrentValue = dto.IsPublished;

        if (entry.Metadata.FindProperty(nameof(IPublishable.PublishAt)) is not null)
        {
            entry.Property(nameof(IPublishable.PublishAt)).CurrentValue   = dto.PublishAt;
            entry.Property(nameof(IPublishable.UnpublishAt)).CurrentValue = dto.UnpublishAt;
        }

        await db.SaveChangesAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(dto.IsPublished ? "已上架。" : "已下架。"));
    }

    // ── 排序 ──────────────────────────────────────────────────────────────
    public async Task<IActionResult> SortAsync(HttpRequest req)
    {
        var items = await req.ReadFromJsonAsync<List<SortItemDto>>() ?? [];
        if (items.Count == 0)
            throw AppException.BadRequest(ErrorCodes.ValidationRequired, "缺少排序內容。");

        var ids      = items.Select(i => i.Id).ToList();
        var entities = await db.Set<TEntity>()
            .Where(e => ids.Contains(EF.Property<int>(e, "Id")) && !e.IsDeleted)
            .ToListAsync();

        foreach (var entity in entities)
        {
            var entry = db.Entry(entity);

            // News 與 SupplierNotice 沒有 SortOrder（它們照日期排），前端不該對它們排序
            if (entry.Metadata.FindProperty("SortOrder") is null)
                throw AppException.Conflict(ErrorCodes.ConflictState, $"{EntityName} 不支援手動排序。");

            var id = (int)entry.Property("Id").CurrentValue!;
            entry.Property("SortOrder").CurrentValue = items.First(i => i.Id == id).SortOrder;
        }

        await db.SaveChangesAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok($"已更新 {entities.Count} 筆排序。"));
    }

    // ── 刪除（一律軟刪）───────────────────────────────────────────────────
    public async Task<IActionResult> DeleteAsync(HttpRequest req, string rawId)
    {
        var entity = await FindAsync(ParseId(rawId));

        // Remove() 會被 AppDbContext 改寫成 IsDeleted = 1（docs/10 §8.4）
        db.Set<TEntity>().Remove(entity);
        await db.SaveChangesAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok("已刪除。"));
    }

    // ── 內部 ──────────────────────────────────────────────────────────────
    private async Task<TEntity> FindAsync(int id) =>
        await db.Set<TEntity>().FirstOrDefaultAsync(e => EF.Property<int>(e, "Id") == id && !e.IsDeleted)
            ?? throw AppException.NotFound(EntityName);

    private static int ParseId(string rawId) =>
        int.TryParse(rawId, out var id)
            ? id
            : throw AppException.BadRequest(ErrorCodes.ValidationFormat, "id 必須是數字。");

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy        = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true,
    };

    private static async Task<(JsonObject Body, JsonObject? I18n)> ReadBodyAsync(HttpRequest req)
    {
        JsonNode? node;
        try
        {
            node = await JsonNode.ParseAsync(req.Body);
        }
        catch (JsonException)
        {
            throw AppException.BadRequest(ErrorCodes.ValidationFormat, "請求內容不是有效的 JSON。");
        }

        if (node is not JsonObject body)
            throw AppException.BadRequest(ErrorCodes.ValidationFormat, "請求內容必須是 JSON 物件。");

        var i18n = body["i18n"] as JsonObject;
        body.Remove("i18n");

        return (body, i18n);
    }

    private static T? Deserialize<T>(JsonObject body) => body.Deserialize<T>(JsonOptions);

    /// <summary>把請求帶到的主表欄位套到既有實體上，沒帶的欄位不動。</summary>
    private void ApplyScalars(TEntity entity, JsonObject body)
    {
        var entry = db.Entry(entity);

        foreach (var (key, value) in body)
        {
            var property = entry.Metadata.GetProperties()
                .FirstOrDefault(p => string.Equals(p.Name, key, StringComparison.OrdinalIgnoreCase));

            // 主鍵與稽核欄位不接受外部指派；未知欄位忽略（前端多送東西不該讓整筆失敗）
            if (property is null || property.IsPrimaryKey() || IsAuditColumn(property.Name)) continue;
            if (property.IsShadowProperty()) continue;

            if (TryConvertJson(value, property, out var converted))
                entry.Property(property.Name).CurrentValue = converted;
        }
    }

    /// <summary>
    /// 把 JSON 值套到欄位上；回傳 false 代表這個欄位應該跳過。
    /// <para>
    /// <c>null</c> 要單獨處理：後台編輯頁是「取出整筆、改幾個欄位、整筆送回」，
    /// 所以 <c>unpublishAt: null</c> 這種值一定會出現。直接丟給 <c>Deserialize</c>
    /// 會在可空欄位上炸成 500（訊息是「could not be converted to System.DateTime」，
    /// 完全看不出是哪一欄）。
    /// </para>
    /// <para>
    /// 必填欄位收到 null 則<b>整個跳過</b>，不是塞預設值——把 NOT NULL 的欄位
    /// 寫成 <c>DateTime.MinValue</c> 或空字串是靜默的資料毀損，比報錯難查得多。
    /// </para>
    /// </summary>
    private static bool TryConvertJson(
        JsonNode? value,
        Microsoft.EntityFrameworkCore.Metadata.IProperty property,
        out object? converted)
    {
        converted = null;

        if (value is null || value.GetValueKind() == System.Text.Json.JsonValueKind.Null)
            return property.IsNullable;

        converted = value.Deserialize(property.ClrType, JsonOptions);
        return true;
    }

    private static bool IsAuditColumn(string name) => name is
        nameof(IAuditable.CreatedAt) or nameof(IAuditable.CreatedBy) or
        nameof(IAuditable.UpdatedAt) or nameof(IAuditable.UpdatedBy) or nameof(IAuditable.IsDeleted);

    /// <summary>寫入 i18n。<paramref name="replace"/> 為 true 時（新增）直接建，否則有則更新、無則建。</summary>
    private async Task UpsertI18nAsync(int ownerId, JsonObject? i18nNode, bool replace)
    {
        if (i18nNode is null) return;

        var fk = ForeignKeyName;

        foreach (var (lang, node) in i18nNode)
        {
            if (node is not JsonObject langBody) continue;

            if (!Langs.All.Contains(lang))
                throw AppException.BadRequest(ErrorCodes.ValidationFormat,
                    $"語系 {lang} 不在值域內（zh／en）。");

            var existing = replace
                ? null
                : await db.Set<TI18n>().FirstOrDefaultAsync(
                    i => EF.Property<int>(i, fk) == ownerId && i.Lang == lang);

            if (existing is null)
            {
                var created = langBody.Deserialize<TI18n>(JsonOptions) ?? new TI18n();
                created.Lang = lang;

                var entry = db.Set<TI18n>().Add(created);
                entry.Property(fk).CurrentValue = ownerId;
            }
            else
            {
                var entry = db.Entry(existing);
                foreach (var (key, value) in langBody)
                {
                    var property = entry.Metadata.GetProperties()
                        .FirstOrDefault(p => string.Equals(p.Name, key, StringComparison.OrdinalIgnoreCase));

                    if (property is null || property.IsPrimaryKey()) continue;

                    if (TryConvertJson(value, property, out var converted))
                entry.Property(property.Name).CurrentValue = converted;
                }
            }
        }

        await db.SaveChangesAsync();
    }
}
