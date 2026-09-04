namespace Nti.Api.Common;

/// <summary>
/// 統一時間源（docs/10 §9.1）。業務邏輯一律走這裡，
/// <c>DateTime.Now</c> / <c>DateTime.UtcNow</c> 只准出現在 JWT 有效期、DB 預設值、cron 判定三處。
/// </summary>
public static class Clock
{
    private static readonly TimeZoneInfo TaipeiTz = TimeZoneInfo.FindSystemTimeZoneById("Asia/Taipei");

    /// <summary>台北時區的當前時間。</summary>
    public static DateTime Now => TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TaipeiTz);

    /// <summary>台北時區的今日日期。</summary>
    public static DateTime Today => Now.Date;
}
