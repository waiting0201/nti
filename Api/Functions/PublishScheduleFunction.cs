using Microsoft.Azure.Functions.Worker;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Nti.Api.Common;
using Nti.Api.Data;

namespace Nti.Api.Functions;

/// <summary>
/// 上下架排程（docs/10 §9.9）。
/// <para>
/// <b>前台的可見性其實不靠這支</b>——<c>PublicFilter</c> 每次查詢都會比對
/// <c>PublishAt</c>／<c>UnpublishAt</c>，時間一到自然就出現或消失。
/// 這支處理的是另一半：把**後台看到的狀態**與前台對齊。
/// </para>
/// <para>
/// 沒有它的話，一筆 <c>UnpublishAt</c> 已過期的內容在後台清單上仍顯示「已上架」，
/// 編輯會以為它還在線上。這種不一致沒有錯誤訊息，只會讓人對後台失去信任。
/// </para>
/// </summary>
public sealed class PublishScheduleFunction(AppDbContext db, ILogger<PublishScheduleFunction> logger)
{
    [Function(nameof(PublishScheduleFunction))]
    public async Task RunAsync([TimerTrigger("%PublishScheduleCron%")] TimerInfo timer)
    {
        // ⚠ IsPastDue 時**不要 return**：Consumption／Flex 的冷啟動會讓觸發延遲，
        //   延遲的那一次正是最該補做的一次（Jabez 已驗證）。這裡只記一行 log。
        if (timer.IsPastDue)
            logger.LogInformation("PublishSchedule 觸發延遲，照常執行。");

        var now   = Clock.UtcNow;
        var total = 0;

        // 每張內容表各查一次。表數固定 8 張，逐表寫比動態組 SQL 容易看懂也容易改。
        total += await UnpublishExpiredAsync(db.HomeBanner, now);
        total += await UnpublishExpiredAsync(db.Solution, now);
        total += await UnpublishExpiredAsync(db.Project, now);
        total += await UnpublishExpiredAsync(db.News, now);
        total += await UnpublishExpiredAsync(db.Vlog, now);
        total += await UnpublishExpiredAsync(db.IndustryTrend, now);
        total += await UnpublishExpiredAsync(db.JobPosting, now);
        total += await UnpublishExpiredAsync(db.SupplierNotice, now);

        if (total > 0) logger.LogInformation("PublishSchedule：下架 {Count} 筆到期內容。", total);
    }

    /// <summary>
    /// 把 <c>UnpublishAt</c> 已過期但仍標記為上架的內容改為下架。
    /// <para>
    /// 冪等閘就是 <c>IsPublished = true</c> 這個條件：改過的下一輪就查不到了，
    /// 重跑幾次結果都一樣。
    /// </para>
    /// </summary>
    private async Task<int> UnpublishExpiredAsync<T>(DbSet<T> set, DateTime now)
        where T : class, Models.Entities.IAuditable, Models.Entities.IPublishable
    {
        var expired = await set
            .Where(x => !x.IsDeleted && x.IsPublished && x.UnpublishAt != null && x.UnpublishAt <= now)
            .ToListAsync();

        foreach (var item in expired) item.IsPublished = false;

        // 走 SaveChangesAsync 讓稽核欄位照統一規則填；排程沒有登入者，UpdatedBy 會是 null
        if (expired.Count > 0) await db.SaveChangesAsync();

        return expired.Count;
    }
}
