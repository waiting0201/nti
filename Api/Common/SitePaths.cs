namespace Nti.Api.Common;

/// <summary>
/// 前台網址的組法：中文在根目錄（<c>/news/x</c>），英文帶前綴（<c>/en/news/x</c>）。
/// <para>
/// 與前台 <c>apps/web/src/lib/i18n.ts</c> 的 <c>localePath()</c> 同一條規則（2026-10-06 拿掉 <c>/zh</c>）。
/// <c>Redirect</c> 表存的是真實網址，兩邊組法不同的話，轉址表裡就會出現
/// 前台永遠不會收到的 <c>/zh/…</c>。
/// </para>
/// </summary>
public static class SitePaths
{
    public static string For(string lang, string path) =>
        lang == Langs.Zh ? path : $"/{lang}{(path == "/" ? "" : path)}";
}
