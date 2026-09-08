using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Globalization;
using System.Text.Json;

namespace Nti.Api.Services;

/// <summary>
/// Google reCAPTCHA v3 驗證（2026-09-08 由 Cloudflare Turnstile 換來）。
/// <para>
/// <b>v3 與 Turnstile 的關鍵差別是它不回「過或不過」，而是回 0.0–1.0 的分數</b>，
/// 由我們自己決定門檻。Google 建議 0.5 起跳，正式上線後要看實際分佈再調——
/// 門檻訂太高會擋掉真人（尤其是用 VPN 或隱私瀏覽器的），訂太低等於沒擋。
/// 因此拒絕時把分數記進 log，才有調整的依據。
/// </para>
/// </summary>
public sealed class RecaptchaService(
    HttpClient client,
    IConfiguration cfg,
    ILogger<RecaptchaService> logger) : IBotCheckService
{
    private const string VerifyUrl = "https://www.google.com/recaptcha/api/siteverify";

    /// <summary>本機與測試環境沒有 secret，設了這個佔位值就跳過驗證。</summary>
    private const string PlaceholderSecret = "REPLACE_WITH_RECAPTCHA_SECRET";

    /// <summary>沒設定 <c>Recaptcha:MinScore</c> 時的門檻（Google 官方建議值）。</summary>
    private const double DefaultMinScore = 0.5;

    public async Task<bool> VerifyAsync(
        string? token, string action, string? remoteIp, CancellationToken cancellationToken = default)
    {
        var secret = cfg["Recaptcha:SecretKey"];

        // 沒設定就放行：本機開發不該被機器人驗證擋住。
        // ⚠ 正式環境一定要設，否則兩支公開表單與後台登入等於沒有防護。
        if (string.IsNullOrWhiteSpace(secret) || secret == PlaceholderSecret)
        {
            logger.LogWarning("reCAPTCHA 未設定，略過驗證。正式環境必須設定 Recaptcha__SecretKey。");
            return true;
        }

        if (string.IsNullOrWhiteSpace(token)) return false;

        try
        {
            var form = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["secret"]   = secret,
                ["response"] = token,
                ["remoteip"] = remoteIp ?? string.Empty,
            });

            using var response = await client.PostAsync(VerifyUrl, form, cancellationToken);
            var json = await response.Content.ReadAsStringAsync(cancellationToken);

            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;

            if (!root.TryGetProperty("success", out var ok) || !ok.GetBoolean())
            {
                logger.LogWarning("reCAPTCHA 驗證未通過：{Errors}",
                    root.TryGetProperty("error-codes", out var errors) ? errors.ToString() : "(未回報原因)");
                return false;
            }

            // action 必須與前端宣告的一致，否則在別頁取得的合法 token 也能拿來打這支端點
            var returnedAction = root.TryGetProperty("action", out var a) ? a.GetString() : null;
            if (!string.Equals(returnedAction, action, StringComparison.Ordinal))
            {
                logger.LogWarning("reCAPTCHA action 不符：預期 {Expected}，實得 {Actual}。", action, returnedAction);
                return false;
            }

            var score = root.TryGetProperty("score", out var s) ? s.GetDouble() : 0d;
            var minScore = double.TryParse(cfg["Recaptcha:MinScore"], NumberStyles.Float,
                CultureInfo.InvariantCulture, out var configured) ? configured : DefaultMinScore;

            if (score < minScore)
            {
                // 分數要記下來：門檻調不調、往哪調，只能靠實際分佈判斷
                logger.LogWarning("reCAPTCHA 分數過低：{Score}（門檻 {MinScore}，action {Action}）。",
                    score, minScore, action);
                return false;
            }

            return true;
        }
        catch (Exception ex)
        {
            // Google 掛掉或逾時 → 擋下請求。這裡刻意 fail closed：
            // 驗證服務不可用時放行，等於在最需要防護的時候把門打開。
            logger.LogError(ex, "reCAPTCHA 驗證失敗（服務異常）。");
            return false;
        }
    }
}
