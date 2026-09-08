namespace Nti.Api.Models.Dtos;

public sealed class LoginDto
{
    /// <summary>登入帳號。不限定 email 格式（2026-09-06）。</summary>
    public string? Username { get; set; }
    public string? Password { get; set; }

    /// <summary>reCAPTCHA v3 token（登入也受機器人防護，docs/10 §9.6）。</summary>
    public string? RecaptchaToken { get; set; }
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
    public string   Username           { get; set; } = null!;
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
