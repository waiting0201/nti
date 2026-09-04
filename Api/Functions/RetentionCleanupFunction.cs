using Microsoft.Azure.Functions.Worker;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Nti.Api.Common;
using Nti.Api.Data;

namespace Nti.Api.Functions;

/// <summary>
/// 保留期清除（docs/10 §9.9）。<c>AuditLog</c> 保留 12 個月。
/// </summary>
public sealed class RetentionCleanupFunction(AppDbContext db, ILogger<RetentionCleanupFunction> logger)
{
    /// <summary>AuditLog 保留 12 個月（docs/09 §24）。</summary>
    private const int AuditRetentionMonths = 12;

    /// <summary>一次最多刪幾列。Basic 只有 5 DTU，一次刪十萬列會鎖住整張表。</summary>
    private const int BatchSize = 1000;

    [Function(nameof(RetentionCleanupFunction))]
    public async Task RunAsync([TimerTrigger("%RetentionCleanupCron%")] TimerInfo timer)
    {
        if (timer.IsPastDue)
            logger.LogInformation("RetentionCleanup 觸發延遲，照常執行。");

        var cutoff = Clock.UtcNow.AddMonths(-AuditRetentionMonths);

        // 分批刪：條件（CreatedAt < cutoff）本身就是冪等閘，中途失敗下次接著刪
        var deleted = 0;
        while (true)
        {
            var batch = await db.AuditLog
                .Where(a => a.CreatedAt < cutoff)
                .OrderBy(a => a.Id)
                .Take(BatchSize)
                .ExecuteDeleteAsync();

            deleted += batch;
            if (batch < BatchSize) break;
        }

        if (deleted > 0)
            logger.LogInformation("RetentionCleanup：清除 {Count} 筆 {Months} 個月前的 AuditLog。",
                deleted, AuditRetentionMonths);

        // ⚠ EmailLog 的保留期尚未定義（db/README 已知缺口 #3），需客戶確認後再補。
        //   在那之前刻意不動它——寄信紀錄是報價與聯絡表單的送達證明，
        //   自己挑一個期限刪掉，出事時會沒有東西可查。
    }
}
