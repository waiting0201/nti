namespace Nti.Api.Models.Entities;

/// <summary>
/// 後台管理員（docs/08 §4.14）。前台全站匿名，沒有會員帳號體系。
/// </summary>
public sealed class AdminUser : IAuditable
{
    public int       Id                 { get; set; }

    /// <summary>登入帳號。不限定 email 格式（2026-09-06），唯一。</summary>
    public string    Username           { get; set; } = null!;

    /// <summary>通知信箱，選填。沒填就寄不出啟用信，初始密碼改由建立者當場取得。</summary>
    public string?   Email              { get; set; }
    public string    PasswordHash       { get; set; } = null!;
    public string    DisplayName        { get; set; } = null!;
    public int       RoleId             { get; set; }
    public bool      IsActive           { get; set; } = true;
    public DateTime? LastLoginAt        { get; set; }
    // FailedLoginCount／LockoutEndAt 於 2026-09-09 移除：連續失敗鎖定帳號等於
    // 開放對帳號的阻斷服務，暴力破解改由登入端點的 reCAPTCHA v3 擋（見 AuthHandler）
    public bool      MustChangePassword { get; set; } = true;

    public DateTime  CreatedAt { get; set; }
    public int?      CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int?      UpdatedBy { get; set; }
    public bool      IsDeleted { get; set; }
}
