using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Net.Http.Headers;

namespace Nti.Api.Services;

/// <summary>
/// 後台存檔後通知前台重生快取（docs/02 §渲染「背景/webhook 重生」）。
/// <para>
/// 前台的每支資料端點都是 <c>fetch(..., { next: { revalidate: 300 } })</c>，所以編輯者
/// 存了檔之後，公開頁最多要等五分鐘才換上新內容——而且是 stale-while-revalidate 語意，
/// 踩到期限的那個請求拿到的仍是舊頁。對「我剛剛明明改好了」的人來說那就是壞掉。
/// 這支打前台的 <c>/api/revalidate</c>，把 <c>cms</c> 這個 tag 的快取直接作廢。
/// </para>
/// <para>
/// <b>永遠不讓它影響存檔的結果。</b> 前台掛了、網址設錯、逾時——都只記 log。
/// 存檔已經成功寫進資料庫了，這時候回錯給編輯者只會讓人以為要重存一次；
/// 就算通知沒送到，300 秒的計時器仍然會把內容帶上去，這支只是讓它快一點。
/// </para>
/// </summary>
public sealed class FrontendRevalidator(
    HttpClient client,
    IConfiguration cfg,
    ILogger<FrontendRevalidator> logger) : IFrontendRevalidator
{
    public async Task RevalidateAsync(CancellationToken cancellationToken = default)
    {
        var url    = cfg["Revalidate:Url"];
        var secret = cfg["Revalidate:Secret"];

        // 沒設定就靜靜跳過：本機開發沒有跑著的前台可以通知。
        // 正式環境沒設也只是回到「等 300 秒」，不是故障。
        if (string.IsNullOrWhiteSpace(url) || string.IsNullOrWhiteSpace(secret))
        {
            logger.LogDebug("未設定 Revalidate__Url／Revalidate__Secret，略過前台快取重生通知。");
            return;
        }

        try
        {
            using var req = new HttpRequestMessage(HttpMethod.Post, url);
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", secret);

            var res = await client.SendAsync(req, cancellationToken);

            if (res.IsSuccessStatusCode)
                logger.LogInformation("已通知前台重生快取。");
            else
                logger.LogWarning("前台快取重生通知回 {Status}，內容仍會在 ISR 到期後更新。", (int)res.StatusCode);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "前台快取重生通知失敗，內容仍會在 ISR 到期後更新。");
        }
    }
}
