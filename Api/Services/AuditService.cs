using Nti.Api.Common;
using Nti.Api.Data;
using Nti.Api.Models.Entities;

namespace Nti.Api.Services;

/// <summary>寫 AuditLog。保留 12 個月，由 RetentionCleanupFunction 清除。</summary>
public sealed class AuditService(AppDbContext db) : IAuditService
{
    public async Task WriteAsync(int? adminUserId, string action, string entityName, int? entityId, string? sourceIp)
    {
        db.AuditLog.Add(new AuditLog
        {
            AdminUserId = adminUserId,
            Action      = action,
            EntityName  = entityName,
            EntityId    = entityId,
            SourceIp    = sourceIp,
            CreatedAt   = Clock.UtcNow,
        });

        await db.SaveChangesAsync();
    }
}
