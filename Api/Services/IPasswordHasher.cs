namespace Nti.Api.Services;

/// <summary>密碼雜湊（docs/10 §7.4）。後台與前台會員共用同一套。</summary>
public interface IPasswordHasher
{
    string Hash(string password);

    /// <summary>驗證。雜湊格式不合法時回 false 而不是拋例外——DB 裡的爛資料不該變成 500。</summary>
    bool Verify(string password, string hash);
}

/// <summary>BCrypt（work factor 用預設）。salt 內含於雜湊字串，不另存欄位。</summary>
public sealed class PasswordHasher : IPasswordHasher
{
    public string Hash(string password) => BCrypt.Net.BCrypt.HashPassword(password);

    public bool Verify(string password, string hash)
    {
        try
        {
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }
        catch (BCrypt.Net.SaltParseException)
        {
            return false;
        }
    }
}
