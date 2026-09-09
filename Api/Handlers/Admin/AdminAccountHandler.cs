using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Nti.Api.Common;
using Nti.Api.Data;
using Nti.Api.Models.Entities;
using Nti.Api.Services;

namespace Nti.Api.Handlers.Admin;

/// <summary>23 admin — 管理員與角色（docs/09 §23）。</summary>
public sealed class AdminAccountHandler(AppDbContext db, IPasswordHasher hasher)
{
    private const int MinUsernameLength = 3;
    private const int MaxUsernameLength = 80;   // 與 AdminUserConfiguration 的欄位長度一致

    public async Task<IActionResult> GetListAsync(HttpRequest req)
    {
        var rows = await KeywordSearch
            .Apply(db.AdminUser.AsNoTracking().Where(u => !u.IsDeleted),
                   db.Model.FindEntityType(typeof(Models.Entities.AdminUser))!,
                   QueryValues.Text(req, "keyword"))
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
    /// 新增管理員。密碼<b>由建立者直接指定</b>（2026-09-09 客戶決定）——
    /// 不再產生亂數密碼、也不寄啟用信，帳密由建立者當場轉交。
    /// <para>
    /// 帳號（<c>username</c>）不限定 email 格式（2026-09-06）；<c>email</c> 是選填的通知信箱，
    /// 與登入無關，也不會拿來寄密碼。
    /// </para>
    /// </summary>
    public async Task<IActionResult> CreateAsync(HttpRequest req)
    {
        var dto = await req.ReadFromJsonAsync<AdminUserUpsertDto>()
            ?? throw AppException.BadRequest(ErrorCodes.ValidationRequired, "缺少內容。");

        if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.DisplayName) || dto.RoleId is null)
            throw AppException.BadRequest(ErrorCodes.ValidationRequired, "username、displayName、roleId 為必填。");

        if (string.IsNullOrWhiteSpace(dto.Password))
            throw AppException.BadRequest(ErrorCodes.ValidationRequired, "password 為必填。");

        ValidatePassword(dto.Password);

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

        var user = new AdminUser
        {
            Username           = username,
            Email              = mailbox,
            PasswordHash       = hasher.Hash(dto.Password),
            DisplayName        = dto.DisplayName.Trim(),
            RoleId             = dto.RoleId.Value,
            IsActive           = true,
            // 密碼是建立者當面設定並轉交的，不再強迫首登改一次
            MustChangePassword = false,
        };

        db.AdminUser.Add(user);
        await db.SaveChangesAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(new { id = user.Id }));
    }

    /// <summary>
    /// 重設某個管理員的密碼（<c>PUT /admin/admin/{id}/password</c>，權限 <c>admin.edit</c>）。
    /// 使用者忘記密碼時走這裡，不寄重設信；新密碼由操作者當面轉交。
    /// </summary>
    public async Task<IActionResult> SetPasswordAsync(HttpRequest req, string rawId)
    {
        var user = await FindAsync(rawId);
        var dto  = await req.ReadFromJsonAsync<AdminPasswordDto>()
            ?? throw AppException.BadRequest(ErrorCodes.ValidationRequired, "缺少內容。");

        if (string.IsNullOrWhiteSpace(dto.Password))
            throw AppException.BadRequest(ErrorCodes.ValidationRequired, "password 為必填。");

        ValidatePassword(dto.Password);

        user.PasswordHash       = hasher.Hash(dto.Password);
        user.MustChangePassword = false;
        await db.SaveChangesAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok("密碼已更新。"));
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

        // 帳號不是內容，這裡是**真刪**：軟刪只會讓那一列繼續佔著 Username 的唯一鍵，
        // 從清單消失、也登不進去，可是同名重建會被擋成「此帳號已存在」——
        // 對操作者而言就是「刪了卻沒刪掉」。ExecuteDelete 直接下 DELETE，
        // 繞過 SaveChanges 對 IAuditable 的軟刪改寫（docs/10 §8.4）。
        // 內容的 CreatedBy/UpdatedBy 與表單的 AssigneeId 指向 AdminUser.Id 但刻意無 FK，
        // 刪掉不會擋住這裡，那些欄位本來就只是 id。
        await db.AdminUser.Where(x => x.Id == user.Id).ExecuteDeleteAsync();

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

    /// <summary>長度下限與自助改密碼同一個常數（docs/10 §7.4），兩條路徑不該有不同標準。</summary>
    private static void ValidatePassword(string password)
    {
        if (password.Length < AuthHandler.MinPasswordLength)
            throw AppException.BadRequest(ErrorCodes.ValidationRange,
                $"密碼至少 {AuthHandler.MinPasswordLength} 碼。");
    }

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

    /// <summary>新增時必填；編輯不吃這個欄位，改密碼走 <c>PUT /admin/admin/{id}/password</c>。</summary>
    public string? Password    { get; set; }
}

/// <summary>重設密碼的請求本體。</summary>
public sealed class AdminPasswordDto
{
    public string? Password { get; set; }
}

/// <summary>24 audit — 信件紀錄（docs/09 §24）。</summary>
public sealed class AdminAuditHandler(AppDbContext db, IEmailService email)
{
    public async Task<IActionResult> GetEmailsAsync(HttpRequest req)
    {
        var paging = Paging.From(req);
        var status = QueryValues.Text(req, "status");

        var query = db.EmailLog.AsNoTracking().AsQueryable();
        if (status is not null) query = query.Where(e => e.Status == status);
        query = KeywordSearch.Apply(query, db.Model.FindEntityType(typeof(EmailLog))!,
            QueryValues.Text(req, "keyword"));

        var total = await query.CountAsync();
        var rows  = await query.OrderByDescending(e => e.Id)
            .Skip(paging.Skip).Take(paging.PageSize).ToListAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(
            PagedResult<EmailLog>.From(rows, total, paging.Page, paging.PageSize)));
    }

    /// <summary>重寄（權限 <c>audit.resend</c>）：把內容再送一次到某個信箱。</summary>
    public async Task<IActionResult> ResendAsync(HttpRequest req, string rawId)
    {
        if (!long.TryParse(rawId, out var id))
            throw AppException.BadRequest(ErrorCodes.ValidationFormat, "id 必須是數字。");

        var result = await email.ResendAsync(id) ?? throw AppException.NotFound("EmailLog");

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(result ? "已重寄。" : "重寄失敗，詳見 EmailLog。"));
    }
}
