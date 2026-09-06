using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Nti.Api.Common;
using Nti.Api.Models.Entities;
using Nti.Api.Services;

namespace Nti.Api.Data.Seed;

/// <summary>
/// 建立第一位超級管理員（docs/10 §7.4）。
/// <para>
/// 帳號不進 Migration 的 <c>HasData</c>：種子會進版控，密碼雜湊也會跟著進，
/// 而且每個環境都一樣。改由部署時以 app setting 注入，跑完把旗標關掉。
/// </para>
/// <para>
/// <b>只在 AdminUser 表是空的時候動作</b>——旗標忘了關也不會覆蓋既有帳號或重設密碼。
/// 建立出來的帳號帶 <c>MustChangePassword = 1</c>，首次登入必須改密碼。
/// </para>
/// </summary>
public static class SuperAdminBootstrapper
{
    public static async Task RunAsync(AppDbContext db, IConfiguration cfg, IPasswordHasher hasher)
    {
        if (!string.Equals(cfg["BOOTSTRAP_SUPERADMIN"], "true", StringComparison.OrdinalIgnoreCase))
            return;

        if (await db.AdminUser.AnyAsync()) return;

        // 帳號不限定 email 格式（2026-09-06）：_USERNAME 為主，沒設就沿用舊的 _EMAIL 當帳號
        var username = cfg["BOOTSTRAP_SUPERADMIN_USERNAME"] ?? cfg["BOOTSTRAP_SUPERADMIN_EMAIL"];
        var email    = cfg["BOOTSTRAP_SUPERADMIN_EMAIL"];
        var password = cfg["BOOTSTRAP_SUPERADMIN_PASSWORD"];

        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
            throw new InvalidOperationException(
                "BOOTSTRAP_SUPERADMIN=true 時必須同時提供 BOOTSTRAP_SUPERADMIN_USERNAME（或 _EMAIL）與 _PASSWORD。");

        var superAdminRoleId = await db.Role.Where(r => r.Code == RoleCodes.SuperAdmin)
                                            .Select(r => r.Id)
                                            .FirstAsync();

        db.AdminUser.Add(new AdminUser
        {
            Username           = username.Trim(),
            Email              = string.IsNullOrWhiteSpace(email) ? null : email.Trim(),
            PasswordHash       = hasher.Hash(password),
            DisplayName        = "Super Admin",
            RoleId             = superAdminRoleId,
            IsActive           = true,
            MustChangePassword = true,
            CreatedAt          = Clock.UtcNow,
        });

        await db.SaveChangesAsync();
    }
}
