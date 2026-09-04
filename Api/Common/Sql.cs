namespace Nti.Api.Common;

/// <summary>
/// 前台查詢共用的 SQL 片段（docs/10 §8.2）。
/// <para>
/// 可見性條件抽在這裡而不是每個 ReadService 各寫一份，是為了避免條件漂移——
/// 清單少一個條件、詳細頁多一個條件，症狀是「列表看得到、點進去 404」，
/// 而且只有特定幾筆資料會踩到。
/// </para>
/// </summary>
public static class Sql
{
    /// <summary>
    /// 完整可見性條件（docs/08 §2.4）：未刪除、已上架、且在上下架時間窗內。
    /// 用於有 <c>PublishAt</c>／<c>UnpublishAt</c> 的表。
    /// </summary>
    /// <param name="alias">主表別名。</param>
    public static string PublicFilter(string alias) => $"""
        {alias}.IsDeleted = 0 AND {alias}.IsPublished = 1
          AND ({alias}.PublishAt   IS NULL OR {alias}.PublishAt   <= @Now)
          AND ({alias}.UnpublishAt IS NULL OR {alias}.UnpublishAt >  @Now)
        """;

    /// <summary>
    /// 只有開關、沒有時間窗的表（SolutionItem／Faq／Certification／ClientLogo／
    /// FacilityItem／SupplierSpec／SupplierDownload）的可見性條件。
    /// </summary>
    public static string PublicFlag(string alias) => $"{alias}.IsDeleted = 0 AND {alias}.IsPublished = 1";

    /// <summary>
    /// 分頁尾巴。一律 OFFSET/FETCH + 另跑 COUNT(*)（docs/10 §8.2）。
    /// </summary>
    public const string PageTail = "OFFSET @Skip ROWS FETCH NEXT @Take ROWS ONLY";
}
