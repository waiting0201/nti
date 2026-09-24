using System.Text.RegularExpressions;

namespace Nti.Api.Common;

/// <summary>
/// 網址代稱（slug）的值域：ASCII 小寫、數字與連字號（客戶 2026-09-08 SEO 簡報：網址避免使用中文）。
/// <para>
/// 標籤、消息、方案共用這一條規則。消息原本走共用的內容 handler，完全沒有檢查——
/// 中文、空白、斜線都存得進去，前台的網址就跟著壞掉。
/// </para>
/// </summary>
public static partial class Slugs
{
    public const int MaxLength = 160;

    [GeneratedRegex("^[a-z0-9]+(?:-[a-z0-9]+)*$")]
    private static partial Regex Pattern { get; }

    public static string Normalize(string? slug) => (slug ?? string.Empty).Trim().ToLowerInvariant();

    public static void Validate(string slug)
    {
        if (string.IsNullOrWhiteSpace(slug))
            throw AppException.BadRequest(ErrorCodes.ValidationRequired, "slug 為必填。");

        if (slug.Length > MaxLength)
            throw AppException.BadRequest(ErrorCodes.ValidationFormat, $"slug 不可超過 {MaxLength} 字元。");

        if (!Pattern.IsMatch(slug))
            throw AppException.BadRequest(ErrorCodes.ValidationFormat,
                "slug 僅能使用小寫英數與連字號（例：green-printing）。");
    }
}
