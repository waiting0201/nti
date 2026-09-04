using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Nti.Api.Common;
using Nti.Api.Data;
using Nti.Api.Models.Dtos;
using Nti.Api.Services;

namespace Nti.Api.Handlers;

/// <summary>
/// 後台登入（docs/09 §23）。
/// <para>
/// 04-api §3 沒有列後台的 auth 端點（§3.3 講的是前台會員），但後台一定要登得進去，
/// 故補 <c>/auth/admin/login</c> 與 <c>/auth/admin/change-password</c>，已回寫 04 的變更紀錄。
/// </para>
/// </summary>
public sealed class AuthHandler(
    AppDbContext      db,
    IPasswordHasher   hasher,
    IJwtService       jwt,
    ITurnstileService turnstile,
    IConfiguration    cfg)
{
    /// <summary>連續失敗 5 次鎖 15 分鐘（docs/09 §23）。</summary>
    private const int  MaxFailedAttempts = 5;
    private const int  LockoutMinutes    = 15;

    public async Task<IActionResult> AdminLoginAsync(HttpRequest req)
    {
        var dto = await req.ReadFromJsonAsync<LoginDto>() ?? new LoginDto();

        if (!await turnstile.VerifyAsync(dto.TurnstileToken, RequestContext.SourceIp(req)))
            throw AppException.BadRequest(ErrorCodes.BotCheckFailed, "機器人驗證未通過。");

        if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
            throw AppException.BadRequest(ErrorCodes.ValidationRequired, "email 與 password 為必填。");

        var user = await db.AdminUser.FirstOrDefaultAsync(x => x.Email == dto.Email && !x.IsDeleted);

        // 帳號不存在與密碼錯誤回同一個錯誤（docs/10 §7.4）：分開回等於送對方一個帳號列舉工具
        if (user is null || !hasher.Verify(dto.Password, user.PasswordHash))
        {
            if (user is not null) await RecordFailedAttemptAsync(user);
            throw new AppException(ErrorCodes.AuthInvalidCredentials, "帳號或密碼錯誤。", 401);
        }

        if (user.LockoutEndAt is not null && user.LockoutEndAt > Clock.UtcNow)
            throw new AppException(ErrorCodes.AuthAccountInactive,
                $"帳號已鎖定，請於 {LockoutMinutes} 分鐘後再試。", 403);

        if (!user.IsActive)
            throw new AppException(ErrorCodes.AuthAccountInactive, "帳號已停用。", 403);

        var role        = await db.Role.FirstAsync(r => r.Id == user.RoleId);
        var permissions = await db.RolePermission.Where(p => p.RoleId == user.RoleId)
                                                 .Select(p => p.PermissionCode)
                                                 .ToArrayAsync();

        user.FailedLoginCount = 0;
        user.LockoutEndAt     = null;
        user.LastLoginAt      = Clock.UtcNow;
        await db.SaveChangesAsync();

        var token = jwt.GenerateAdminToken(user.Id, user.DisplayName, user.Email,
            [role.Code], permissions, isSuperAdmin: role.Code == RoleCodes.SuperAdmin);

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(new AuthTokenDto
        {
            AccessToken        = token,
            ExpiresInMinutes   = int.TryParse(cfg["Jwt:ExpiryMinutes"], out var m) ? m : 60,
            DisplayName        = user.DisplayName,
            Email              = user.Email,
            RoleCode           = role.Code,
            Permissions        = permissions,
            MustChangePassword = user.MustChangePassword,
        }));
    }

    /// <summary>
    /// 改密碼。需要有效的後台 token（Router 已驗過），
    /// <c>MustChangePassword = 1</c> 的使用者也要能打——否則首登就卡死。
    /// </summary>
    public async Task<IActionResult> AdminChangePasswordAsync(HttpRequest req)
    {
        var dto    = await req.ReadFromJsonAsync<ChangePasswordDto>() ?? new ChangePasswordDto();
        var userId = RequestContext.UserId(req.HttpContext.User)
            ?? throw AppException.Unauthorized();

        if (string.IsNullOrWhiteSpace(dto.CurrentPassword) || string.IsNullOrWhiteSpace(dto.NewPassword))
            throw AppException.BadRequest(ErrorCodes.ValidationRequired, "currentPassword 與 newPassword 為必填。");

        if (dto.NewPassword.Length < 8)
            throw AppException.BadRequest(ErrorCodes.ValidationRange, "新密碼至少 8 碼。");

        var user = await db.AdminUser.FirstOrDefaultAsync(x => x.Id == userId && !x.IsDeleted)
            ?? throw AppException.NotFound("AdminUser");

        if (!hasher.Verify(dto.CurrentPassword, user.PasswordHash))
            throw new AppException(ErrorCodes.AuthInvalidCredentials, "目前密碼錯誤。", 401);

        user.PasswordHash       = hasher.Hash(dto.NewPassword);
        user.MustChangePassword = false;
        await db.SaveChangesAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok("密碼已更新。"));
    }

    private async Task RecordFailedAttemptAsync(Models.Entities.AdminUser user)
    {
        user.FailedLoginCount = (byte)Math.Min(byte.MaxValue, user.FailedLoginCount + 1);

        if (user.FailedLoginCount >= MaxFailedAttempts)
        {
            user.LockoutEndAt     = Clock.UtcNow.AddMinutes(LockoutMinutes);
            user.FailedLoginCount = 0;
        }

        await db.SaveChangesAsync();
    }
}
