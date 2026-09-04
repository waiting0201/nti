namespace Nti.Api.Services;

/// <summary>Cloudflare Turnstile 驗證（docs/10 §9.6）。公開寫入端點的機器人防護。</summary>
public interface ITurnstileService
{
    /// <summary>驗證前端取得的 token。未設定 secret 時直接放行（本機開發用）。</summary>
    Task<bool> VerifyAsync(string? token, string? remoteIp, CancellationToken cancellationToken = default);
}
