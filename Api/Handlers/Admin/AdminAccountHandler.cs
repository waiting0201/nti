using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Nti.Api.Common;
using Nti.Api.Data;
using Nti.Api.Models.Entities;
using Nti.Api.Services;

namespace Nti.Api.Handlers.Admin;

/// <summary>23 admin — 管理員與角色（docs/09 §23）。</summary>
public sealed class AdminAccountHandler(AppDbContext db, IPasswordHasher hasher, IEmailService email)
{
    private const int MinUsernameLength = 3;
    private const int MaxUsernameLength = 80;   // 與 AdminUserConfiguration 的欄位長度一致

    public async Task<IActionResult> GetListAsync(HttpRequest req)
    {
        var rows = await db.AdminUser.AsNoTracking().Where(u => !u.IsDeleted)
            .OrderBy(u => u.Id)
            .Select(u => new
            {
                u.Id, u.Username, u.Email, u.DisplayName, u.RoleId,
                roleCode = db.Role.Where(r => r.Id == u.RoleId).Select(r => r.Code).FirstOrDefault(),
                u.IsActive, u.LastLoginAt, u.MustChangePassword, u.CreatedAt,
            })
            .ToListAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(rows));
    }

    /// <summary>角色清單（含權限碼），供後台的角色下拉與權限檢視。</summary>
    public async Task<IActionResult> GetRolesAsync(HttpRequest req)
    {
        var rows = await db.Role.AsNoTracking().OrderBy(r => r.Id)
            .Select(r => new
            {
                r.Id, r.Code, r.Name, r.IsSystem,
                permissions = db.RolePermission.Where(p => p.RoleId == r.Id)
                                               .Select(p => p.PermissionCode).ToList(),
            })
            .ToListAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(rows));
    }

    /// <summary>
    /// 新增管理員。密碼由系統產生，<b>不接受請求指定密碼</b>——
    /// 讓建立者知道別人的密碼是沒必要的風險（docs/10 §7.4）。首登強制改密碼。
    /// <para>
    /// 帳號（<c>username</c>）不限定 email 格式（2026-09-06），信箱改為選填：
    /// 有填就寄啟用信、初始密碼不回傳；沒填就寄不出去，只好把初始密碼回給建立者當場轉交。
    /// </para>
    /// </summary>
    public async Task<IActionResult> CreateAsync(HttpRequest req)
    {
        var dto = await req.ReadFromJsonAsync<AdminUserUpsertDto>()
            ?? throw AppException.BadRequest(ErrorCodes.ValidationRequired, "缺少內容。");

        if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.DisplayName) || dto.RoleId is null)
            throw AppException.BadRequest(ErrorCodes.ValidationRequired, "username、displayName、roleId 為必填。");

        var username = dto.Username.Trim();
        var mailbox  = NormalizeEmail(dto.Email);

        if (username.Length < MinUsernameLength || username.Length > MaxUsernameLength)
            throw AppException.BadRequest(ErrorCodes.ValidationRange,
                $"帳號長度需介於 {MinUsernameLength}–{MaxUsernameLength} 字。");

        // 只擋空白：帳號會被人手動輸入，中間帶空白幾乎都是複製貼上帶進來的
        if (username.Any(char.IsWhiteSpace))
            throw AppException.BadRequest(ErrorCodes.ValidationFormat, "帳號不可包含空白。");

        if (await db.AdminUser.AnyAsync(u => u.Username == username))
            throw AppException.Conflict(ErrorCodes.ConflictDuplicate, "此帳號已存在。");

        if (!await db.Role.AnyAsync(r => r.Id == dto.RoleId))
            throw AppException.NotFound("Role");

        var initialPassword = GeneratePassword();

        var user = new AdminUser
        {
            Username           = username,
            Email              = mailbox,
            PasswordHash       = hasher.Hash(initialPassword),
            DisplayName        = dto.DisplayName.Trim(),
            RoleId             = dto.RoleId.Value,
            IsActive           = true,
            MustChangePassword = true,
        };

        db.AdminUser.Add(user);
        await db.SaveChangesAsync();

        if (mailbox is not null)
            await email.SendAsync("AdminInvite", mailbox, "[NTI] 後台帳號已建立",
                $"<p>帳號：{user.Username}</p><p>初始密碼：{initialPassword}</p><p>首次登入後請立即修改。</p>",
                nameof(AdminUser), user.Id);

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(new
        {
            id = user.Id,
            // 沒有信箱可寄時才回傳，否則初始密碼不離開伺服器
            initialPassword = mailbox is null ? initialPassword : null,
        }));
    }

    public async Task<IActionResult> UpdateAsync(HttpRequest req, string rawId)
    {
        var user = await FindAsync(rawId);
        var dto  = await req.ReadFromJsonAsync<AdminUserUpsertDto>()
            ?? throw AppException.BadRequest(ErrorCodes.ValidationRequired, "缺少內容。");

        // 帳號建立後唯讀：改帳號等於換一個人，稽核紀錄會對不上
        if (!string.IsNullOrWhiteSpace(dto.DisplayName)) user.DisplayName = dto.DisplayName.Trim();
        if (dto.Email is not null) user.Email = NormalizeEmail(dto.Email);

        if (dto.RoleId is not null)
        {
            if (!await db.Role.AnyAsync(r => r.Id == dto.RoleId)) throw AppException.NotFound("Role");
            user.RoleId = dto.RoleId.Value;
        }

        if (dto.IsActive is not null)
        {
            // 不准把自己停用：停完就再也登不進來改回去了
            if (dto.IsActive == false && user.Id == RequestContext.UserId(req.HttpContext.User))
                throw AppException.Conflict(ErrorCodes.ConflictState, "不能停用自己的帳號。");

            user.IsActive = dto.IsActive.Value;
        }

        await db.SaveChangesAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok("已更新。"));
    }

    public async Task<IActionResult> DeleteAsync(HttpRequest req, string rawId)
    {
        var user = await FindAsync(rawId);

        if (user.Id == RequestContext.UserId(req.HttpContext.User))
            throw AppException.Conflict(ErrorCodes.ConflictState, "不能刪除自己的帳號。");

        // 最後一個可用的超管不能刪，否則系統再也沒有人能管權限
        var superAdminRoleId = await db.Role.Where(r => r.Code == RoleCodes.SuperAdmin).Select(r => r.Id).FirstAsync();
        if (user.RoleId == superAdminRoleId)
        {
            var remaining = await db.AdminUser.CountAsync(u =>
                u.RoleId == superAdminRoleId && u.IsActive && !u.IsDeleted && u.Id != user.Id);

            if (remaining == 0)
                throw AppException.Conflict(ErrorCodes.ConflictState, "至少要保留一位可用的超級管理員。");
        }

        db.AdminUser.Remove(user);   // 軟刪
        await db.SaveChangesAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok("已刪除。"));
    }

    /// <summary>信箱選填：空字串一律存 null，不然唯一性與「有沒有信箱」的判斷都會被空字串汙染。</summary>
    private static string? NormalizeEmail(string? raw)
    {
        var value = raw?.Trim();
        if (string.IsNullOrEmpty(value)) return null;

        if (!value.Contains('@') || value.Any(char.IsWhiteSpace))
            throw AppException.BadRequest(ErrorCodes.ValidationFormat, "email 格式不正確。");

        return value;
    }

    /// <summary>系統產生的初始密碼：16 碼 URL-safe 亂數，只出現在啟用信或建立回應裡。</summary>
    private static string GeneratePassword() =>
        Convert.ToBase64String(System.Security.Cryptography.RandomNumberGenerator.GetBytes(12))
               .Replace('+', 'A').Replace('/', 'b').TrimEnd('=');

    private async Task<AdminUser> FindAsync(string rawId)
    {
        if (!int.TryParse(rawId, out var id))
            throw AppException.BadRequest(ErrorCodes.ValidationFormat, "id 必須是數字。");

        return await db.AdminUser.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted)
            ?? throw AppException.NotFound("AdminUser");
    }
}

public sealed class AdminUserUpsertDto
{
    /// <summary>登入帳號，不限定 email 格式；建立後唯讀。</summary>
    public string? Username    { get; set; }

    /// <summary>通知信箱，選填。</summary>
    public string? Email       { get; set; }
    public string? DisplayName { get; set; }
    public int?    RoleId      { get; set; }
    public bool?   IsActive    { get; set; }
}

/// <summary>24 audit — 操作紀錄與寄信紀錄（docs/09 §24）。</summary>
public sealed class AdminAuditHandler(AppDbContext db, IEmailService email)
{
    public async Task<IActionResult> GetLogsAsync(HttpRequest req)
    {
        var paging     = Paging.From(req);
        var entityName = QueryValues.Text(req, "entityName");

        var query = db.AuditLog.AsNoTracking().AsQueryable();
        if (entityName is not null) query = query.Where(a => a.EntityName == entityName);

        var total = await query.CountAsync();
        var rows  = await query.OrderByDescending(a => a.Id)
            .Skip(paging.Skip).Take(paging.PageSize)
            .Select(a => new
            {
                a.Id, a.AdminUserId,
                adminName = db.AdminUser.Where(u => u.Id == a.AdminUserId).Select(u => u.DisplayName).FirstOrDefault(),
                a.Action, a.EntityName, a.EntityId, a.SourceIp, a.CreatedAt,
            })
            .ToListAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(new
        {
            items = rows, totalCount = total, page = paging.Page, pageSize = paging.PageSize,
            totalPages = Math.Max(1, (int)Math.Ceiling((double)total / paging.PageSize)),
        }));
    }

    public async Task<IActionResult> GetEmailsAsync(HttpRequest req)
    {
        var paging = Paging.From(req);
        var status = QueryValues.Text(req, "status");

        var query = db.EmailLog.AsNoTracking().AsQueryable();
        if (status is not null) query = query.Where(e => e.Status == status);

        var total = await query.CountAsync();
        var rows  = await query.OrderByDescending(e => e.Id)
            .Skip(paging.Skip).Take(paging.PageSize).ToListAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(
            PagedResult<EmailLog>.From(rows, total, paging.Page, paging.PageSize)));
    }

    /// <summary>
    /// 重寄（權限 <c>audit.resend</c>）。
    /// <b>這是唯讀但必須寫 AuditLog 的三個動作之一</b>（docs/10 §9.3）：重寄會把內容再送一次到某個信箱。
    /// </summary>
    public async Task<IActionResult> ResendAsync(HttpRequest req, string rawId)
    {
        if (!long.TryParse(rawId, out var id))
            throw AppException.BadRequest(ErrorCodes.ValidationFormat, "id 必須是數字。");

        var result = await email.ResendAsync(id) ?? throw AppException.NotFound("EmailLog");

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(result ? "已重寄。" : "重寄失敗，詳見 EmailLog。"));
    }
}

/// <summary>00 dashboard — 待辦總覽（docs/09 §00）。唯讀聚合，三個角色都看得到。</summary>
public sealed class AdminDashboardHandler(AppDbContext db)
{
    public async Task<IActionResult> GetAsync(HttpRequest req)
    {
        var now = Clock.UtcNow;

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(new
        {
            // 待辦：新進的表單就是後台每天要處理的東西
            newQuotes    = await db.QuoteRequest.CountAsync(q => q.Status == QuoteStatuses.New && !q.IsDeleted),
            newContacts  = await db.ContactMessage.CountAsync(c => c.Status == ContactStatuses.New && !c.IsDeleted),

            // 內容量：上架中的筆數
            publishedNews = await db.News.CountAsync(n => n.IsPublished && !n.IsDeleted),
            publishedProjects = await db.Project.CountAsync(p => p.IsPublished && !p.IsDeleted),

            // 排程中：PublishAt 還沒到的，提醒編輯這些還沒上線
            scheduledNews = await db.News.CountAsync(n => !n.IsDeleted && n.PublishAt != null && n.PublishAt > now),

            // 寄信失敗：需要人去重寄，不看就沒人知道
            failedEmails = await db.EmailLog.CountAsync(e => e.Status == "Failed"),
        }));
    }
}
