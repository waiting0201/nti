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
/// ⚠ <b>刻意沒有「連續失敗鎖定帳號」</b>（2026-09-09 依客戶決定移除）。
/// 那種鎖定會變成對帳號本身的阻斷服務——只要一直用錯誤密碼打某個帳號，
/// 就能讓真正的管理員登不進來，而攻擊者不必知道任何密碼。
/// 暴力破解由這支端點的 reCAPTCHA v3 擋（<see cref="IBotCheckService"/>）。
/// </para>
/// <para>
/// 04-api §3 沒有列後台的 auth 端點（§3.3 講的是前台會員），但後台一定要登得進去，
/// 故補 <c>/auth/admin/login</c> 與 <c>/auth/admin/change-password</c>，已回寫 04 的變更紀錄。
/// </para>
/// </summary>
public sealed class AuthHandler(
    AppDbContext      db,
    IPasswordHasher   hasher,
    IJwtService       jwt,
    IBotCheckService  botCheck,
    IConfiguration    cfg)
{
    /// <summary>密碼長度下限（2026-09-06 由 8 放寬為 6；前端 Login.tsx 同步）。</summary>
    public  const int  MinPasswordLength = 6;

    public async Task<IActionResult> AdminLoginAsync(HttpRequest req)
    {
        var dto = await req.ReadFromJsonAsync<LoginDto>() ?? new LoginDto();

        if (!await botCheck.VerifyAsync(dto.RecaptchaToken, BotCheckActions.AdminLogin, RequestContext.SourceIp(req)))
            throw AppException.BadRequest(ErrorCodes.BotCheckFailed, "機器人驗證未通過。");

        if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
            throw AppException.BadRequest(ErrorCodes.ValidationRequired, "username 與 password 為必填。");

        // 帳號不限定 email 格式，比對前只去頭尾空白（貼上帳號時常帶到）
        var username = dto.Username.Trim();
        var user     = await db.AdminUser.FirstOrDefaultAsync(x => x.Username == username && !x.IsDeleted);

        // 帳號不存在與密碼錯誤回同一個錯誤（docs/10 §7.4）：分開回等於送對方一個帳號列舉工具
        if (user is null || !hasher.Verify(dto.Password, user.PasswordHash))
            throw new AppException(ErrorCodes.AuthInvalidCredentials, "帳號或密碼錯誤。", 401);

        if (!user.IsActive)
            throw new AppException(ErrorCodes.AuthAccountInactive, "帳號已停用。", 403);

        var role        = await db.Role.FirstAsync(r => r.Id == user.RoleId);
        var permissions = await db.RolePermission.Where(p => p.RoleId == user.RoleId)
                                                 .Select(p => p.PermissionCode)
                                                 .ToArrayAsync();

        user.LastLoginAt = Clock.UtcNow;
        await db.SaveChangesAsync();

        var token = jwt.GenerateAdminToken(user.Id, user.DisplayName, user.Username, user.Email,
            [role.Code], permissions, isSuperAdmin: role.Code == RoleCodes.SuperAdmin);

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(new AuthTokenDto
        {
            AccessToken        = token,
            ExpiresInMinutes   = int.TryParse(cfg["Jwt:ExpiryMinutes"], out var m) ? m : 60,
            DisplayName        = user.DisplayName,
            Username           = user.Username,
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

        if (dto.NewPassword.Length < MinPasswordLength)
            throw AppException.BadRequest(ErrorCodes.ValidationRange, $"新密碼至少 {MinPasswordLength} 碼。");

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
}
