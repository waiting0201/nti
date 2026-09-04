using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace Nti.Api.Services;

/// <summary>呼叫 Cloudflare siteverify。HttpClient 由 DI 注入並設短 timeout。</summary>
public sealed class TurnstileService(
    HttpClient client,
    IConfiguration cfg,
    ILogger<TurnstileService> logger) : ITurnstileService
{
    private const string VerifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

    /// <summary>本機與測試環境沒有 secret，設了這個佔位值就跳過驗證。</summary>
    private const string PlaceholderSecret = "REPLACE_WITH_TURNSTILE_SECRET";

    public async Task<bool> VerifyAsync(string? token, string? remoteIp, CancellationToken cancellationToken = default)
    {
        var secret = cfg["Turnstile:SecretKey"];

        // 沒設定就放行：本機開發不該被機器人驗證擋住。
        // ⚠ 正式環境一定要設，否則兩支公開表單等於沒有防護。
        if (string.IsNullOrWhiteSpace(secret) || secret == PlaceholderSecret)
        {
            logger.LogWarning("Turnstile 未設定，略過驗證。正式環境必須設定 Turnstile__SecretKey。");
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
            return doc.RootElement.TryGetProperty("success", out var ok) && ok.GetBoolean();
        }
        catch (Exception ex)
        {
            // Cloudflare 掛掉或逾時 → 擋下請求。這裡刻意 fail closed：
            // 驗證服務不可用時放行，等於在最需要防護的時候把門打開。
            logger.LogError(ex, "Turnstile 驗證失敗（服務異常）。");
            return false;
        }
    }
}
