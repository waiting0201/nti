namespace Nti.Api.Models.Entities;

/// <summary>
/// 前台會員（docs/08 §4.13，後台單元 19；功能屬 P6）。
/// <para>
/// 與 <see cref="AdminUser"/> 是兩套獨立帳號體系，不共用登入，JWT audience 也分離。
/// 後台不可查看或設定會員密碼，只能重寄驗證信／觸發密碼重設／啟用停用（docs/09 §19）。
/// </para>
/// </summary>
public sealed class Member : IAuditable
{
    public int       Id               { get; set; }
    public string    Email            { get; set; } = null!;
    public string    PasswordHash     { get; set; } = null!;
    public string    DisplayName      { get; set; } = null!;
    public string?   Company          { get; set; }
    public string?   Phone            { get; set; }
    public string    PreferredLang    { get; set; } = "zh";
    public string    Status           { get; set; } = "Pending";  // Pending|Active|Suspended
    public DateTime? EmailConfirmedAt { get; set; }
    public DateTime? LastLoginAt      { get; set; }
    public byte      FailedLoginCount { get; set; }
    public DateTime? LockoutEndAt     { get; set; }

    public DateTime  CreatedAt { get; set; }
    public int?      CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int?      UpdatedBy { get; set; }
    public bool      IsDeleted { get; set; }
}

/// <summary>
/// 會員的 email 驗證／密碼重設 token（docs/08 §4.13）。一次性、帶到期時間。
/// <para><see cref="TokenHash"/> 只存 SHA-256，明碼僅寄出，DB 外洩也無法用來重設密碼。</para>
/// </summary>
public sealed class MemberToken
{
    public long      Id        { get; set; }
    public int       MemberId  { get; set; }
    public string    TokenType { get; set; } = null!;   // EmailVerify|PasswordReset
    public byte[]    TokenHash { get; set; } = null!;
    public DateTime  ExpiresAt { get; set; }
    public DateTime? UsedAt    { get; set; }
    public DateTime  CreatedAt { get; set; }
}
