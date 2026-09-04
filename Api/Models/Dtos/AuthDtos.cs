namespace Nti.Api.Models.Dtos;

public sealed class LoginDto
{
    public string? Email    { get; set; }
    public string? Password { get; set; }

    /// <summary>Turnstile token（登入也受機器人防護，docs/10 §9.6）。</summary>
    public string? TurnstileToken { get; set; }
}

/// <summary>
/// 登入成功的回應。
/// <para>
/// 沒有 refresh token：schema 沒有對應的資料表，而 04-api §3.3 的端點清單也未列
/// <c>/auth/refresh</c>。要做 rotation（docs/10 §7.3）得先加一張表。
/// </para>
/// </summary>
public sealed class AuthTokenDto
{
    public string   AccessToken        { get; set; } = null!;
    public int      ExpiresInMinutes   { get; set; }
    public string   DisplayName        { get; set; } = null!;
    public string?  Email              { get; set; }

    /// <summary>後台專用：角色與權限碼，供前端決定畫面顯示（真正的把關在 API）。</summary>
    public string?   RoleCode           { get; set; }
    public string[]? Permissions        { get; set; }

    /// <summary>true 時前端必須先導向改密碼，其他操作都會被擋（403）。</summary>
    public bool     MustChangePassword { get; set; }
}

public sealed class ChangePasswordDto
{
    public string? CurrentPassword { get; set; }
    public string? NewPassword     { get; set; }
}

public sealed class RegisterDto
{
    public string? Email         { get; set; }
    public string? Password      { get; set; }
    public string? DisplayName   { get; set; }
    public string? Company       { get; set; }
    public string? Phone         { get; set; }
    public string? PreferredLang { get; set; }
    public bool    Consent       { get; set; }
    public string? TurnstileToken { get; set; }
}

public sealed class ForgotPasswordDto
{
    public string? Email          { get; set; }
    public string? TurnstileToken { get; set; }
}

public sealed class ResetPasswordDto
{
    public string? Token       { get; set; }
    public string? NewPassword { get; set; }
}

/// <summary>會員帳戶設定（<c>GET/PUT /me</c>）。</summary>
public sealed class MemberProfileDto
{
    public int      Id            { get; set; }
    public string   Email         { get; set; } = null!;
    public string   DisplayName   { get; set; } = null!;
    public string?  Company       { get; set; }
    public string?  Phone         { get; set; }
    public string   PreferredLang { get; set; } = null!;
    public string   Status        { get; set; } = null!;
}

public sealed class MemberProfileUpdateDto
{
    public string? DisplayName   { get; set; }
    public string? Company       { get; set; }
    public string? Phone         { get; set; }
    public string? PreferredLang { get; set; }
}
