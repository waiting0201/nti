using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Nti.Api.Services;

/// <summary>JWT 自簽（docs/10 §7）。兩套身分：後台管理員與前台會員，audience 分離。</summary>
public interface IJwtService
{
    /// <summary>後台管理員 access token（audience = nti-admin）。</summary>
    string GenerateAdminToken(
        int                 adminUserId,
        string              name,
        string              email,
        IEnumerable<string> roleCodes,
        IEnumerable<string> permissionCodes,
        bool                isSuperAdmin = false);

    /// <summary>前台會員 access token（audience = nti-web，無權限碼）。</summary>
    string GenerateMemberToken(int memberId, string name, string email);

    /// <summary>不透明 refresh token（存 DB，rotation 見 docs/10 §7.3）。</summary>
    string GenerateRefreshToken();

    /// <summary>驗證 token；失敗一律回 null，不讓例外冒出。</summary>
    ClaimsPrincipal? ValidateToken(string token, string audience);

    /// <summary>從 Authorization: Bearer 取 token 並驗證。</summary>
    ClaimsPrincipal? ValidateRequest(HttpRequest req, string audience);
}
