using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Nti.Api.Common;
using Nti.Api.Data;
using Nti.Api.Models.Dtos;
using Nti.Api.Models.Entities;
using Nti.Api.Services;

namespace Nti.Api.Handlers.Admin;

/// <summary>19 member ／ 20 order（docs/09 §19、§20；功能屬 P6）。</summary>
public sealed class AdminMemberHandler(AppDbContext db, IEmailService email)
{
    public async Task<IActionResult> GetMembersAsync(HttpRequest req)
    {
        var paging = Paging.From(req);
        var query  = db.Member.AsNoTracking().Where(m => !m.IsDeleted);

        var total = await query.CountAsync();
        var rows  = await query.OrderByDescending(m => m.CreatedAt)
            .Skip(paging.Skip).Take(paging.PageSize)
            // 密碼雜湊不出現在任何回應裡（docs/03 §3：後台不可查看或設定會員密碼）
            .Select(m => new
            {
                m.Id, m.Email, m.DisplayName, m.Company, m.Phone,
                m.PreferredLang, m.Status, m.EmailConfirmedAt, m.LastLoginAt, m.CreatedAt,
            })
            .ToListAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(new
        {
            items = rows, totalCount = total, page = paging.Page, pageSize = paging.PageSize,
            totalPages = Math.Max(1, (int)Math.Ceiling((double)total / paging.PageSize)),
        }));
    }

    public async Task<IActionResult> GetMemberAsync(HttpRequest req, string rawId)
    {
        var member = await FindAsync(rawId);

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(new
        {
            member.Id, member.Email, member.DisplayName, member.Company, member.Phone,
            member.PreferredLang, member.Status, member.EmailConfirmedAt, member.LastLoginAt, member.CreatedAt,
        }));
    }

    /// <summary>
    /// 後台只能啟用／停用與觸發重設信，<b>不能查看或設定密碼</b>（docs/03 §3）。
    /// </summary>
    public async Task<IActionResult> UpdateMemberAsync(HttpRequest req, string rawId)
    {
        var member = await FindAsync(rawId);
        var dto    = await req.ReadFromJsonAsync<MemberAdminUpdateDto>() ?? new MemberAdminUpdateDto();

        if (dto.Status is not null)
        {
            if (dto.Status is not ("Pending" or "Active" or "Suspended"))
                throw AppException.BadRequest(ErrorCodes.ValidationFormat,
                    "status 必須是 Pending／Active／Suspended。");

            member.Status = dto.Status;

            // 手動啟用時補上驗證時間，否則會出現「Active 但沒驗證過」的矛盾狀態
            if (dto.Status == "Active" && member.EmailConfirmedAt is null)
                member.EmailConfirmedAt = Clock.UtcNow;
        }

        await db.SaveChangesAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok("已更新。"));
    }

    /// <summary>重寄驗證信。信件內容與註冊時相同，token 另發一組。</summary>
    public async Task<IActionResult> ResendVerifyAsync(HttpRequest req, string rawId)
    {
        var member = await FindAsync(rawId);

        await email.SendAsync("MemberVerify", member.Email, "[NTI] 請驗證您的 Email",
            "<p>請點擊信中連結完成驗證。</p>", nameof(Member), member.Id);

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok("已重寄驗證信。"));
    }

    private async Task<Member> FindAsync(string rawId)
    {
        if (!int.TryParse(rawId, out var id))
            throw AppException.BadRequest(ErrorCodes.ValidationFormat, "id 必須是數字。");

        return await db.Member.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted)
            ?? throw AppException.NotFound("Member");
    }
}

public sealed class MemberAdminUpdateDto
{
    public string? Status { get; set; }
}

/// <summary>20 order。訂單與生產進度。</summary>
public sealed class AdminOrderHandler(AppDbContext db)
{
    public async Task<IActionResult> GetListAsync(HttpRequest req)
    {
        var paging = Paging.From(req);
        var query  = db.Order.AsNoTracking().Where(o => !o.IsDeleted);

        var total = await query.CountAsync();
        var rows  = await query.OrderByDescending(o => o.CreatedAt)
            .Skip(paging.Skip).Take(paging.PageSize).ToListAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(PagedResult<Order>.From(rows, total, paging.Page, paging.PageSize)));
    }

    public async Task<IActionResult> GetByIdAsync(HttpRequest req, string rawId)
    {
        var order    = await FindAsync(rawId);
        var progress = await db.OrderProgress.AsNoTracking()
            .Where(p => p.OrderId == order.Id).OrderBy(p => p.HappenedAt).ToListAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(new { order, progress }));
    }

    public async Task<IActionResult> CreateAsync(HttpRequest req)
    {
        var dto = await req.ReadFromJsonAsync<Order>()
            ?? throw AppException.BadRequest(ErrorCodes.ValidationRequired, "缺少內容。");

        if (string.IsNullOrWhiteSpace(dto.OrderNo) || string.IsNullOrWhiteSpace(dto.Title) || dto.MemberId == 0)
            throw AppException.BadRequest(ErrorCodes.ValidationRequired, "orderNo、title、memberId 為必填。");

        if (await db.Order.AnyAsync(o => o.OrderNo == dto.OrderNo))
            throw AppException.Conflict(ErrorCodes.ConflictDuplicate, "orderNo 已存在。");

        dto.Id = 0;
        db.Order.Add(dto);
        await db.SaveChangesAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(new { id = dto.Id }));
    }

    public async Task<IActionResult> UpdateAsync(HttpRequest req, string rawId)
    {
        var order = await FindAsync(rawId);
        var dto   = await req.ReadFromJsonAsync<Order>()
            ?? throw AppException.BadRequest(ErrorCodes.ValidationRequired, "缺少內容。");

        if (!string.IsNullOrWhiteSpace(dto.Title)) order.Title = dto.Title;
        if (!string.IsNullOrWhiteSpace(dto.Status))
        {
            if (dto.Status is not ("Confirmed" or "InProduction" or "Shipped" or "Completed" or "Cancelled"))
                throw AppException.BadRequest(ErrorCodes.ValidationFormat, "status 不在值域內。");

            order.Status = dto.Status;
        }
        order.ExpectedShipDate = dto.ExpectedShipDate;

        await db.SaveChangesAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok("已更新。"));
    }

    /// <summary>新增一筆生產進度。會員的「生產進度」時間軸就是這張表。</summary>
    public async Task<IActionResult> AddProgressAsync(HttpRequest req, string rawId)
    {
        var order = await FindAsync(rawId);
        var dto   = await req.ReadFromJsonAsync<OrderProgress>()
            ?? throw AppException.BadRequest(ErrorCodes.ValidationRequired, "缺少內容。");

        if (dto.Stage is not ("Design" or "PrePress" or "Printing" or "PostPress" or "QC" or "Shipping"))
            throw AppException.BadRequest(ErrorCodes.ValidationFormat, "stage 不在值域內。");

        if (dto.StageStatus is not ("Pending" or "Doing" or "Done"))
            throw AppException.BadRequest(ErrorCodes.ValidationFormat, "stageStatus 不在值域內。");

        db.OrderProgress.Add(new OrderProgress
        {
            OrderId     = order.Id,
            Stage       = dto.Stage,
            StageStatus = dto.StageStatus,
            HappenedAt  = dto.HappenedAt == default ? Clock.UtcNow : dto.HappenedAt,
            Note        = dto.Note,
            CreatedAt   = Clock.UtcNow,
            CreatedBy   = RequestContext.UserId(req.HttpContext.User),
        });
        await db.SaveChangesAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok("已新增進度。"));
    }

    private async Task<Order> FindAsync(string rawId)
    {
        if (!int.TryParse(rawId, out var id))
            throw AppException.BadRequest(ErrorCodes.ValidationFormat, "id 必須是數字。");

        return await db.Order.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted)
            ?? throw AppException.NotFound("Order");
    }
}
