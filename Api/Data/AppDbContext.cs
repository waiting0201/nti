using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Nti.Api.Common;
using Nti.Api.Models.Entities;
using System.IdentityModel.Tokens.Jwt;

namespace Nti.Api.Data;

/// <summary>
/// 寫入端的 DbContext（docs/10 §8.1）。<b>schema 的權威來源是本專案的 Migration</b>，
/// 不是 <c>db/</c>——後者為參考實作與交付腳本。
/// <para>讀取一律走 <c>Services/Dapper/</c> 的 ReadService，不從這裡查。</para>
/// </summary>
public class AppDbContext(DbContextOptions<AppDbContext> options, IHttpContextAccessor? httpContextAccessor = null)
    : DbContext(options)
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        // Entity 設定一律寫在 Data/Configurations/<Entity>Configuration.cs
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }

    /// <summary>
    /// 統一填稽核欄位（docs/10 §8.4）：新增填 CreatedAt/By、修改填 UpdatedAt/By。
    /// <para>
    /// 刪除一律軟刪：對 <see cref="IAuditable"/> 呼叫 <c>Remove()</c> 會被在這裡改寫成
    /// <c>IsDeleted = 1</c>，避免任何一處漏寫就把內容真的刪掉。
    /// </para>
    /// </summary>
    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var now    = Clock.Now;
        var userId = CurrentAdminUserId();

        foreach (var entry in ChangeTracker.Entries<IAuditable>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = now;
                    entry.Entity.CreatedBy = userId;
                    break;

                case EntityState.Modified:
                    entry.Entity.UpdatedAt = now;
                    entry.Entity.UpdatedBy = userId;
                    break;

                case EntityState.Deleted:
                    entry.State            = EntityState.Modified;
                    entry.Entity.IsDeleted = true;
                    entry.Entity.UpdatedAt = now;
                    entry.Entity.UpdatedBy = userId;
                    break;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }

    /// <summary>目前登入的後台管理員 Id（來自 JWT 的 sub claim）；公開端點寫入時為 null。</summary>
    private int? CurrentAdminUserId()
    {
        var sub = httpContextAccessor?.HttpContext?.User?.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        return int.TryParse(sub, out var id) ? id : null;
    }
}
