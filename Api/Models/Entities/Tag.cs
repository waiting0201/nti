namespace Nti.Api.Models.Entities;

/// <summary>
/// 消息標籤（後台單元 25）。舊站 nti-printing.com 有 100 個 <c>/tag/*</c> 封存頁，
/// 依 <c>reference/現有網站盤點與內容遷移.md</c> 的決策 D4「全部保留標籤體系並逐一 301 對應」，
/// 標籤在新站是有前台封存頁的正式體系，不只是後台的一個欄位。
/// <para>
/// ⚠ <b>Slug 不分語系</b>，與 <c>News</c> 不同（新聞的 slug 在 <c>NewsI18n</c>）。
/// 兩個理由：一是客戶 2026-09-08 的 SEO 簡報明訂網址「避免使用中文」，中文標籤名沒辦法
/// 直接當網址；二是同一個 slug 兩個語系共用，`/zh/news/tag/esg` 與 `/en/news/tag/esg`
/// 的 hreflang 配對是恆等式，不必像新聞那樣兩邊查表配對。顯示名稱才分語系（<see cref="TagI18n"/>）。
/// </para>
/// </summary>
public sealed class Tag : IAuditable
{
    public int    Id        { get; set; }
    public string Slug      { get; set; } = null!;   // ASCII 小寫、連字號，前台網址用
    public int    SortOrder { get; set; }
    public bool   IsActive  { get; set; } = true;

    public DateTime  CreatedAt { get; set; }
    public int?      CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int?      UpdatedBy { get; set; }
    public bool      IsDeleted { get; set; }
}

/// <summary>標籤的顯示名稱，分語系。</summary>
public sealed class TagI18n : II18n
{
    public int    TagId { get; set; }
    public string Lang  { get; set; } = null!;
    public string Name  { get; set; } = null!;
}

/// <summary>消息與標籤的多對多。純關聯表，沒有稽核欄位（跟著兩端的生命週期走）。</summary>
public sealed class NewsTag
{
    public int NewsId { get; set; }
    public int TagId  { get; set; }
}
