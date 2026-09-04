using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Nti.Api.Common;
using Nti.Api.Data;
using Nti.Api.Models.Dtos;
using Nti.Api.Models.Entities;
using Nti.Api.Services;
using System.Security.Cryptography;
using System.Text;

namespace Nti.Api.Handlers;

/// <summary>
/// 前台會員（04-api §3.3，單元 19）。與後台是兩套獨立帳號體系，JWT audience 也分離。
/// </summary>
public sealed class MemberHandler(
    AppDbContext      db,
    IPasswordHasher   hasher,
    IJwtService       jwt,
    IEmailService     email,
    ITurnstileService turnstile,
    IConfiguration    cfg)
{
    private const int  MaxFailedAttempts   = 5;
    private const int  LockoutMinutes      = 15;
    private const int  TokenValidHours     = 24;
    private const int  MinPasswordLength   = 8;

    // ── 註冊 ──────────────────────────────────────────────────────────────
    public async Task<IActionResult> RegisterAsync(HttpRequest req)
    {
        var dto = await req.ReadFromJsonAsync<RegisterDto>() ?? new RegisterDto();

        if (!await turnstile.VerifyAsync(dto.TurnstileToken, RequestContext.SourceIp(req)))
            throw AppException.BadRequest(ErrorCodes.BotCheckFailed, "機器人驗證未通過。");

        if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password)
            || string.IsNullOrWhiteSpace(dto.DisplayName))
            throw AppException.BadRequest(ErrorCodes.ValidationRequired, "email、password、displayName 為必填。");

        if (dto.Password.Length < MinPasswordLength)
            throw AppException.BadRequest(ErrorCodes.ValidationRange, $"密碼至少 {MinPasswordLength} 碼。");

        if (!dto.Consent)
            throw AppException.BadRequest(ErrorCodes.ValidationRequired, "必須同意隱私權政策。");

        if (await db.Member.AnyAsync(x => x.Email == dto.Email))
            throw AppException.Conflict(ErrorCodes.ConflictDuplicate, "此 email 已註冊。");

        var lang = dto.PreferredLang is not null && Langs.All.Contains(dto.PreferredLang)
            ? dto.PreferredLang
            : LangResolver.Resolve(req);

        var member = new Member
        {
            Email         = dto.Email.Trim(),
            PasswordHash  = hasher.Hash(dto.Password),
            DisplayName   = dto.DisplayName.Trim(),
            Company       = dto.Company?.Trim(),
            Phone         = dto.Phone?.Trim(),
            PreferredLang = lang,
            Status        = "Pending",     // 驗證信點了才變 Active
            CreatedAt     = Clock.UtcNow,
        };

        db.Member.Add(member);
        await db.SaveChangesAsync();

        var token = await IssueTokenAsync(member.Id, "EmailVerify");
        await email.SendAsync("MemberVerify", member.Email, "[NTI] 請驗證您的 Email",
            $"<p>驗證碼：{token}</p>", nameof(Member), member.Id);

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok("註冊成功，請至信箱完成驗證。"));
    }

    // ── 登入 ──────────────────────────────────────────────────────────────
    public async Task<IActionResult> LoginAsync(HttpRequest req)
    {
        var dto = await req.ReadFromJsonAsync<LoginDto>() ?? new LoginDto();

        if (!await turnstile.VerifyAsync(dto.TurnstileToken, RequestContext.SourceIp(req)))
            throw AppException.BadRequest(ErrorCodes.BotCheckFailed, "機器人驗證未通過。");

        if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
            throw AppException.BadRequest(ErrorCodes.ValidationRequired, "email 與 password 為必填。");

        var member = await db.Member.FirstOrDefaultAsync(x => x.Email == dto.Email && !x.IsDeleted);

        if (member is null || !hasher.Verify(dto.Password, member.PasswordHash))
        {
            if (member is not null) await RecordFailedAttemptAsync(member);
            throw new AppException(ErrorCodes.AuthInvalidCredentials, "帳號或密碼錯誤。", 401);
        }

        if (member.LockoutEndAt is not null && member.LockoutEndAt > Clock.UtcNow)
            throw new AppException(ErrorCodes.AuthAccountInactive, "帳號已鎖定，請稍後再試。", 403);

        // Pending（未驗證信箱）與 Suspended 都不給登入，訊息分開讓使用者知道下一步
        if (member.Status == "Pending")
            throw new AppException(ErrorCodes.AuthAccountInactive, "請先完成 Email 驗證。", 403);

        if (member.Status != "Active")
            throw new AppException(ErrorCodes.AuthAccountInactive, "帳號已停用。", 403);

        member.FailedLoginCount = 0;
        member.LockoutEndAt     = null;
        member.LastLoginAt      = Clock.UtcNow;
        await db.SaveChangesAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(new AuthTokenDto
        {
            AccessToken      = jwt.GenerateMemberToken(member.Id, member.DisplayName, member.Email),
            ExpiresInMinutes = int.TryParse(cfg["Jwt:ExpiryMinutesWeb"], out var m) ? m : 120,
            DisplayName      = member.DisplayName,
            Email            = member.Email,
        }));
    }

    // ── 忘記／重設密碼 ────────────────────────────────────────────────────
    public async Task<IActionResult> ForgotPasswordAsync(HttpRequest req)
    {
        var dto = await req.ReadFromJsonAsync<ForgotPasswordDto>() ?? new ForgotPasswordDto();

        if (!await turnstile.VerifyAsync(dto.TurnstileToken, RequestContext.SourceIp(req)))
            throw AppException.BadRequest(ErrorCodes.BotCheckFailed, "機器人驗證未通過。");

        var member = await db.Member.FirstOrDefaultAsync(x => x.Email == dto.Email && !x.IsDeleted);

        // 找不到也回同樣的成功訊息：回「查無此帳號」等於提供了帳號列舉
        if (member is not null)
        {
            var token = await IssueTokenAsync(member.Id, "PasswordReset");
            await email.SendAsync("PasswordReset", member.Email, "[NTI] 重設密碼",
                $"<p>重設碼：{token}</p>", nameof(Member), member.Id);
        }

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok("若該信箱已註冊，我們已寄出重設信。"));
    }

    public async Task<IActionResult> ResetPasswordAsync(HttpRequest req)
    {
        var dto = await req.ReadFromJsonAsync<ResetPasswordDto>() ?? new ResetPasswordDto();

        if (string.IsNullOrWhiteSpace(dto.Token) || string.IsNullOrWhiteSpace(dto.NewPassword))
            throw AppException.BadRequest(ErrorCodes.ValidationRequired, "token 與 newPassword 為必填。");

        if (dto.NewPassword.Length < MinPasswordLength)
            throw AppException.BadRequest(ErrorCodes.ValidationRange, $"密碼至少 {MinPasswordLength} 碼。");

        var hash   = Sha256(dto.Token);
        var now    = Clock.UtcNow;
        var record = await db.MemberToken.FirstOrDefaultAsync(x =>
            x.TokenType == "PasswordReset" && x.TokenHash == hash && x.UsedAt == null && x.ExpiresAt > now);

        if (record is null)
            throw new AppException(ErrorCodes.AuthTokenInvalid, "重設碼無效或已過期。", 401);

        var member = await db.Member.FirstAsync(x => x.Id == record.MemberId);

        member.PasswordHash     = hasher.Hash(dto.NewPassword);
        member.FailedLoginCount = 0;
        member.LockoutEndAt     = null;
        record.UsedAt           = now;   // 一次性
        await db.SaveChangesAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok("密碼已重設。"));
    }

    // ── 帳戶設定 ──────────────────────────────────────────────────────────
    public async Task<IActionResult> GetMeAsync(HttpRequest req)
    {
        var member = await CurrentMemberAsync(req);

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(new MemberProfileDto
        {
            Id = member.Id, Email = member.Email, DisplayName = member.DisplayName,
            Company = member.Company, Phone = member.Phone,
            PreferredLang = member.PreferredLang, Status = member.Status,
        }));
    }

    public async Task<IActionResult> UpdateMeAsync(HttpRequest req)
    {
        var dto    = await req.ReadFromJsonAsync<MemberProfileUpdateDto>() ?? new MemberProfileUpdateDto();
        var member = await CurrentMemberAsync(req);

        // email 不可自行修改（會繞過驗證流程）；密碼走重設流程
        if (!string.IsNullOrWhiteSpace(dto.DisplayName)) member.DisplayName = dto.DisplayName.Trim();
        member.Company = dto.Company?.Trim();
        member.Phone   = dto.Phone?.Trim();

        if (dto.PreferredLang is not null && Langs.All.Contains(dto.PreferredLang))
            member.PreferredLang = dto.PreferredLang;

        await db.SaveChangesAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok("已更新。"));
    }

    // ── 報價與訂單紀錄 ────────────────────────────────────────────────────
    public async Task<IActionResult> GetMyQuotesAsync(HttpRequest req)
    {
        var memberId = RequireMemberId(req);

        var rows = await db.QuoteRequest.AsNoTracking()
            .Where(q => q.MemberId == memberId && !q.IsDeleted)
            .OrderByDescending(q => q.SubmittedAt)
            .Select(q => new { q.QuoteNo, q.Status, q.SubmittedAt, q.Quantity, q.RepliedAt })
            .ToListAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(rows));
    }

    public async Task<IActionResult> GetMyOrdersAsync(HttpRequest req)
    {
        var memberId = RequireMemberId(req);

        var rows = await db.Order.AsNoTracking()
            .Where(o => o.MemberId == memberId && !o.IsDeleted)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new { o.Id, o.OrderNo, o.Title, o.Status, o.ExpectedShipDate })
            .ToListAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(rows));
    }

    /// <summary>訂單生產進度。<b>一定要帶會員條件</b>，否則換個 id 就能看別人的訂單。</summary>
    public async Task<IActionResult> GetMyOrderAsync(HttpRequest req, string rawId)
    {
        var memberId = RequireMemberId(req);

        if (!int.TryParse(rawId, out var id))
            throw AppException.BadRequest(ErrorCodes.ValidationFormat, "id 必須是數字。");

        var order = await db.Order.AsNoTracking()
            .Where(o => o.Id == id && o.MemberId == memberId && !o.IsDeleted)
            .Select(o => new { o.Id, o.OrderNo, o.Title, o.Status, o.ExpectedShipDate })
            .FirstOrDefaultAsync() ?? throw AppException.NotFound("Order");

        var progress = await db.OrderProgress.AsNoTracking()
            .Where(p => p.OrderId == id)
            .OrderBy(p => p.HappenedAt)
            .Select(p => new { p.Stage, p.StageStatus, p.HappenedAt, p.Note })
            .ToListAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(new { order, progress }));
    }

    // ── 內部 ──────────────────────────────────────────────────────────────
    private int RequireMemberId(HttpRequest req) =>
        RequestContext.UserId(req.HttpContext.User) ?? throw AppException.Unauthorized();

    /// <summary>連續失敗 5 次鎖 15 分鐘，與後台同一套規則。</summary>
    private async Task RecordFailedAttemptAsync(Member member)
    {
        member.FailedLoginCount = (byte)Math.Min(byte.MaxValue, member.FailedLoginCount + 1);

        if (member.FailedLoginCount >= MaxFailedAttempts)
        {
            member.LockoutEndAt     = Clock.UtcNow.AddMinutes(LockoutMinutes);
            member.FailedLoginCount = 0;
        }

        await db.SaveChangesAsync();
    }

    private async Task<Member> CurrentMemberAsync(HttpRequest req) =>
        await db.Member.FirstOrDefaultAsync(x => x.Id == RequireMemberId(req) && !x.IsDeleted)
            ?? throw AppException.NotFound("Member");

    /// <summary>
    /// 發一次性 token。<b>DB 只存 SHA-256</b>，明碼只出現在信裡——
    /// 資料庫外洩也無法拿 MemberToken 的內容去重設任何人的密碼。
    /// </summary>
    private async Task<string> IssueTokenAsync(int memberId, string tokenType)
    {
        var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32))
                           .Replace('+', '-').Replace('/', '_').TrimEnd('=');

        db.MemberToken.Add(new MemberToken
        {
            MemberId  = memberId,
            TokenType = tokenType,
            TokenHash = Sha256(token),
            ExpiresAt = Clock.UtcNow.AddHours(TokenValidHours),
            CreatedAt = Clock.UtcNow,
        });
        await db.SaveChangesAsync();

        return token;
    }

    private static byte[] Sha256(string value) => SHA256.HashData(Encoding.UTF8.GetBytes(value));
}
