namespace Nti.Api.Models.Entities;

/// <summary>
/// 後台管理員（docs/08 §4.14）。與前台 <see cref="Member"/> 是兩套獨立帳號體系，不共用登入。
/// </summary>
public sealed class AdminUser : IAuditable
{
    public int       Id                 { get; set; }
    public string    Email              { get; set; } = null!;
    public string    PasswordHash       { get; set; } = null!;
    public string    DisplayName        { get; set; } = null!;
    public int       RoleId             { get; set; }
    public bool      IsActive           { get; set; } = true;
    public DateTime? LastLoginAt        { get; set; }
    public byte      FailedLoginCount   { get; set; }   // 連續 5 次鎖 15 分鐘（docs/09 §23）
    public DateTime? LockoutEndAt       { get; set; }
    public bool      MustChangePassword { get; set; } = true;

    public DateTime  CreatedAt { get; set; }
    public int?      CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int?      UpdatedBy { get; set; }
    public bool      IsDeleted { get; set; }
}
