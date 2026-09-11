using Microsoft.AspNetCore.Http;

namespace Nti.Api.Common;

/// <summary>
/// 快取標頭（docs/10 §9.8）。<b>所有端點一律 <c>no-store</c></b>。
/// <para>
/// 前台唯讀端點原本回 <c>public, max-age=0, s-maxage=300, stale-while-revalidate=600</c>，
/// 配合 Next.js 的 ISR。2026-09-11 前台改成完全不快取（`apps/web/src/lib/api.ts`），
/// 這裡也跟著拿掉：留著一個沒有人遵守的 <c>s-maxage</c> 只會在中間哪天冒出一層共用快取時，
/// 讓「後台改了前台沒變」以無法重現的方式回來。
/// </para>
/// <para>
/// 例外是 <see cref="Handlers.FileHandler"/> 的媒體代理：那裡回的是檔案位元組、
/// 檔名帶 GUID、內容不可變，仍然長快取。換圖會產生新路徑，不會拿到舊的那張。
/// </para>
/// </summary>
public static class CacheControl
{
    /// <summary>不得快取。前台、後台、會員端點都走這支。</summary>
    public static void NoStore(HttpResponse res) => res.Headers.CacheControl = "no-store";
}
