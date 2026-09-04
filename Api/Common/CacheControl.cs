using Microsoft.AspNetCore.Http;

namespace Nti.Api.Common;

/// <summary>
/// 快取標頭（docs/10 §9.8）。前台唯讀端點供 Next.js ISR 消費，
/// 後台與會員端點一律 <c>no-store</c>。
/// </summary>
public static class CacheControl
{
    /// <summary>內容型端點的預設 CDN 快取秒數。</summary>
    public const int ContentSeconds = 300;

    /// <summary>低頻異動（設定、分類）的快取秒數。</summary>
    public const int StaticSeconds = 3600;

    /// <summary>
    /// 標記為公開可快取。<c>max-age=0</c> 讓瀏覽器每次回源，
    /// 由 CDN／ISR 用 <c>s-maxage</c> 擋住流量——內容改動後前台不會卡著舊資料。
    /// </summary>
    public static void Public(HttpResponse res, int sMaxAge = ContentSeconds) =>
        res.Headers.CacheControl =
            $"public, max-age=0, s-maxage={sMaxAge}, stale-while-revalidate={sMaxAge * 2}";

    /// <summary>後台與會員端點：不得快取。</summary>
    public static void NoStore(HttpResponse res) => res.Headers.CacheControl = "no-store";
}
