using Nti.Api.Models.Entities;
using System.Text.RegularExpressions;

namespace Nti.Api.Common;

/// <summary>
/// 媒體檔路徑的共用規則：哪些欄位存的是 <c>media</c> 容器裡的檔案、路徑怎麼正規化、
/// 富文本裡的插圖怎麼抓出來。
/// <para>
/// 由兩條清除路徑共用——存檔當下的即時清除（<see cref="Services.IMediaCleaner"/>）與
/// 夜間的孤兒檔掃描（<c>OrphanMediaFunction</c>）。各寫一份遲早會分岔，
/// 而分岔的症狀是其中一邊把還在用的檔案當成孤兒刪掉。
/// </para>
/// </summary>
public static class MediaPaths
{
    /// <summary>抓 <c>&lt;img src="..."&gt;</c>。只取 src，不做完整 HTML 解析。</summary>
    private static readonly Regex ImgSrc = new(
        """<img\b[^>]*?\bsrc\s*=\s*["']([^"']+)["']""",
        RegexOptions.IgnoreCase | RegexOptions.Compiled, TimeSpan.FromSeconds(2));

    /// <summary>
    /// 欄位名含 <c>Path</c> 就當成檔案路徑欄位。
    /// <para>
    /// 用「含」而不是「結尾是」，因為 <c>HomeBanner.ImagePathMobile</c> 結尾是 Mobile；
    /// 逐欄列舉則會在新增欄位時漏掉，而漏掉的症狀是那個欄位換過的舊檔永遠留在 Blob。
    /// </para>
    /// </summary>
    public static bool IsFilePathField(string propertyName) =>
        propertyName.Contains("Path", StringComparison.Ordinal);

    /// <summary>富文本欄位（<c>BodyHtml</c>／<c>IntroHtml</c>…）：插圖藏在 <c>&lt;img src&gt;</c> 裡。</summary>
    public static bool IsRichTextField(string propertyName) =>
        propertyName.EndsWith("Html", StringComparison.Ordinal);

    /// <summary>
    /// <b>這些型別的 <c>*Path</c> 不是 media 容器的檔案</b>，即時清除必須跳過：
    /// <list type="bullet">
    ///   <item><see cref="Redirect"/>：<c>FromPath</c>／<c>ToPath</c> 是網址路徑，根本不是檔案。</item>
    ///   <item><see cref="QuoteAttachment"/>：檔案在 <c>quote-attachments</c> 容器，
    ///         且刪報價時已由 <c>AdminFormHandler</c> 當場刪除。</item>
    /// </list>
    /// 用 <c>typeof</c> 而不是字串比對：entity 改名時這裡會編譯失敗，而不是靜悄悄地失效。
    /// </summary>
    public static bool IsNonMediaEntity(Type clrType) =>
        clrType == typeof(Redirect) || clrType == typeof(QuoteAttachment);

    /// <summary>
    /// 抓出一段富文本裡所有插圖的相對路徑（已正規化）。
    /// <para>回 <see cref="IReadOnlySet{T}"/> 而不是清單：呼叫端要的是 <c>Contains</c>，
    /// 而且要沿用這裡的忽略大小寫比較子。</para>
    /// </summary>
    public static IReadOnlySet<string> ExtractImagePaths(string? html)
    {
        var paths = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        if (string.IsNullOrWhiteSpace(html)) return paths;

        foreach (Match match in ImgSrc.Matches(html))
            paths.Add(Normalize(match.Groups[1].Value));

        return paths;
    }

    /// <summary>
    /// 統一成容器內的相對路徑。內文的 <c>src</c> 可能是完整 URL 或帶前導斜線，
    /// 與 DB 欄位存的相對路徑對不起來就會誤判成孤兒。
    /// </summary>
    public static string Normalize(string value)
    {
        var path = value.Trim();

        if (Uri.TryCreate(path, UriKind.Absolute, out var uri)) path = uri.AbsolutePath;

        path = path.TrimStart('/');

        // 切掉代理路由：前台取檔走 `{apiBase}/files/media/{rel}`（容器是 private），
        // 所以富文本裡的 <img src> 很可能是那條完整網址。用「找到就取後半段」而不是比對開頭，
        // 因為 apiBase 帶著 `/api/v1`——比對開頭會漏掉，而漏掉的路徑與 DB 存的相對路徑對不起來：
        // 夜間掃描會把還掛在內文裡的圖判成孤兒刪掉，即時清除則是靜靜地什麼都沒刪。
        var proxy = $"files/{UploadRules.Containers.Media}/";
        var at    = path.IndexOf(proxy, StringComparison.OrdinalIgnoreCase);
        if (at >= 0) path = path[(at + proxy.Length)..];

        // 去掉容器名前綴（前端組 URL 時會帶上）
        var prefix = UploadRules.Containers.Media + "/";
        if (path.StartsWith(prefix, StringComparison.OrdinalIgnoreCase)) path = path[prefix.Length..];

        return path;
    }
}
