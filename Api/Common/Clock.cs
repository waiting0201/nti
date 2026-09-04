namespace Nti.Api.Common;

/// <summary>
/// 統一時間源（docs/10 §9.1）。業務邏輯一律走這裡，
/// <c>DateTime.Now</c> / <c>DateTime.UtcNow</c> 只准出現在 JWT 有效期與 cron 判定。
/// </summary>
/// <remarks>
/// <para><b>兩個時間、兩種用途，不要混用</b>：</para>
/// <list type="bullet">
///   <item>
///     <see cref="UtcNow"/> —— <b>所有寫進資料庫的時間戳</b>。docs/08 §2.2 定義
///     時間欄一律存 UTC（DDL 的預設值是 <c>SYSUTCDATETIME()</c>），顯示時才轉台北。
///     稽核欄位、上下架時間窗、<c>SubmittedAt</c>／<c>ConsentAt</c> 全部用這個。
///   </item>
///   <item>
///     <see cref="Now"/>／<see cref="Today"/> —— 台北時區，供**顯示與營業日判定**。
///     不要拿去寫 DB，也不要拿去跟 DB 的時間欄比較。
///   </item>
/// </list>
/// <para>
/// ⚠ docs/10 §8.4／§8.2 原本寫「<c>CreatedAt = Clock.Now</c>」「<c>@Now = Clock.Now</c>」，
/// 與 docs/08 §2.2 的「存 UTC」相衝突：EF 寫入會是台北時間、DB 預設值會是 UTC，
/// 同一欄兩種時區，上下架時間窗還會差 8 小時。此處以 docs/08 為準（儲存語意屬 schema 規範），
/// 持久化一律 <see cref="UtcNow"/>。決策記於 docs/10 變更紀錄 2026-09-04。
/// </para>
/// </remarks>
public static class Clock
{
    private static readonly TimeZoneInfo TaipeiTz = TimeZoneInfo.FindSystemTimeZoneById("Asia/Taipei");

    /// <summary>寫入資料庫與比較資料庫時間欄的唯一時間源（UTC）。</summary>
    public static DateTime UtcNow => DateTime.UtcNow;

    /// <summary>台北時區的當前時間，供顯示與營業日判定使用。<b>不要寫進 DB。</b></summary>
    public static DateTime Now => TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TaipeiTz);

    /// <summary>台北時區的今日日期。</summary>
    public static DateOnly Today => DateOnly.FromDateTime(Now);

    /// <summary>把 DB 取出的 UTC 時間轉為台北時間（顯示用）。</summary>
    public static DateTime ToTaipei(DateTime utc) =>
        TimeZoneInfo.ConvertTimeFromUtc(DateTime.SpecifyKind(utc, DateTimeKind.Utc), TaipeiTz);
}
