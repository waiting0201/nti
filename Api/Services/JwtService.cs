using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Nti.Api.Common;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Nti.Api.Services;

/// <summary>
/// 自寫 JWT 驗證（docs/10 §7.1）。
/// <para>
/// 不接 <c>AddAuthentication().AddJwtBearer()</c>——isolated worker 的 pipeline 與 ASP.NET Core 不同，
/// 自己驗證比接管線可控（Jabez 已驗證）。
/// </para>
/// </summary>
public sealed class JwtService : IJwtService
{
    private readonly string _secret;
    private readonly string _issuer;
    private readonly string _audienceAdmin;
    private readonly string _audienceWeb;
    private readonly int    _expiryMinutesAdmin;
    private readonly int    _expiryMinutesWeb;
    private readonly SymmetricSecurityKey _key;

    private readonly JwtSecurityTokenHandler _handler = new()
    {
        // 停用預設 claim type 映射，保持原始 claim name（sub／name／email），
        // 否則 sub 會變成 http://schemas.xmlsoap.org/... 那串
        MapInboundClaims = false,
    };

    public JwtService(IConfiguration config)
    {
        _secret             = config["Jwt:Secret"] ?? throw new InvalidOperationException("Jwt:Secret is required.");
        _issuer             = config["Jwt:Issuer"]        ?? "nti-api";
        _audienceAdmin      = config["Jwt:AudienceAdmin"] ?? TokenAudiences.Admin;
        _audienceWeb        = config["Jwt:AudienceWeb"]   ?? TokenAudiences.Web;
        _expiryMinutesAdmin = int.TryParse(config["Jwt:ExpiryMinutes"],    out var a) ? a : 60;
        _expiryMinutesWeb   = int.TryParse(config["Jwt:ExpiryMinutesWeb"], out var w) ? w : 120;
        _key                = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secret));
    }

    public string GenerateAdminToken(
        int                 adminUserId,
        string              name,
        string              email,
        IEnumerable<string> roleCodes,
        IEnumerable<string> permissionCodes,
        bool                isSuperAdmin = false)
    {
        var claims = BaseClaims(adminUserId, name, email);

        if (isSuperAdmin)
            claims.Add(new Claim("is_superadmin", "true"));

        foreach (var role in roleCodes)
            claims.Add(new Claim("roles", role));

        foreach (var perm in permissionCodes)
            claims.Add(new Claim("permissions", perm));

        return Write(claims, _audienceAdmin, _expiryMinutesAdmin);
    }

    public string GenerateMemberToken(int memberId, string name, string email)
    {
        var claims = BaseClaims(memberId, name, email);
        claims.Add(new Claim("member_id", memberId.ToString()));
        return Write(claims, _audienceWeb, _expiryMinutesWeb);
    }

    public string GenerateRefreshToken() =>
        Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));

    public ClaimsPrincipal? ValidateToken(string token, string audience)
    {
        try
        {
            var parameters = new TokenValidationParameters
            {
                ValidateIssuer           = true,
                ValidateAudience         = true,
                ValidateLifetime         = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer              = _issuer,
                ValidAudience            = audience,
                IssuerSigningKey         = _key,
                ClockSkew                = TimeSpan.FromSeconds(30),
            };
            return _handler.ValidateToken(token, parameters, out _);
        }
        catch
        {
            return null;
        }
    }

    public ClaimsPrincipal? ValidateRequest(HttpRequest req, string audience)
    {
        var authHeader = req.Headers.Authorization.FirstOrDefault();
        if (authHeader is null || !authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            return null;

        return ValidateToken(authHeader["Bearer ".Length..].Trim(), audience);
    }

    private static List<Claim> BaseClaims(int id, string name, string email) =>
    [
        new(JwtRegisteredClaimNames.Sub,   id.ToString()),
        new(JwtRegisteredClaimNames.Name,  name),
        new(JwtRegisteredClaimNames.Email, email),
        new(JwtRegisteredClaimNames.Jti,   Guid.NewGuid().ToString()),
    ];

    private string Write(List<Claim> claims, string audience, int expiryMinutes)
    {
        // JWT 有效期是 docs/10 §9.1 允許直接用 UtcNow 的三個例外之一
        var token = new JwtSecurityToken(
            issuer:             _issuer,
            audience:           audience,
            claims:             claims,
            notBefore:          DateTime.UtcNow,
            expires:            DateTime.UtcNow.AddMinutes(expiryMinutes),
            signingCredentials: new SigningCredentials(_key, SecurityAlgorithms.HmacSha256));

        return _handler.WriteToken(token);
    }
}
