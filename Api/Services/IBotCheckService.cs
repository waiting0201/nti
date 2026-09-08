namespace Nti.Api.Services;

/// <summary>
/// 公開寫入端點的機器人防護（docs/10 §9.6）。目前實作為 <see cref="RecaptchaService"/>。
/// <para>
/// 介面刻意不帶供應商名稱：2026-09-08 已經從 Cloudflare Turnstile 換成 Google reCAPTCHA v3 一次，
/// 呼叫端不該再因為換供應商而改動。
/// </para>
/// </summary>
public interface IBotCheckService
{
    /// <summary>
    /// 驗證前端取得的 token。未設定 secret 時直接放行（本機開發用）。
    /// </summary>
    /// <param name="action">
    /// 前端 <c>grecaptcha.execute</c> 時宣告的動作名稱，必須與回傳的一致——
    /// 少了這道比對，攻擊者可以拿在別頁取得的合法 token 來打這支端點。
    /// </param>
    Task<bool> VerifyAsync(string? token, string action, string? remoteIp, CancellationToken cancellationToken = default);
}

/// <summary>reCAPTCHA v3 的動作名稱。前端 execute 時要送一模一樣的字串。</summary>
public static class BotCheckActions
{
    public const string Quote      = "quote";
    public const string Contact    = "contact";
    public const string AdminLogin = "admin_login";
}
