namespace Nti.Api.Models.Dtos;

/// <summary>
/// 後台清單列（docs/09 §5）。
/// <para>
/// <see cref="HasZh"/>／<see cref="HasEn"/> 是「中英完成度 badge」（09 §5.3）的來源：
/// 後台清單用 LEFT JOIN 兩語系，缺哪一邊要看得出來——這與前台的 INNER JOIN 相反，
/// 前台是缺語系就不顯示，後台是缺語系要標出來讓編輯去補。
/// </para>
/// </summary>
public sealed class AdminListItemDto
{
    public int       Id          { get; set; }
    public string?   TitleZh     { get; set; }
    public string?   TitleEn     { get; set; }
    public bool      HasZh       { get; set; }
    public bool      HasEn       { get; set; }
    public bool      IsPublished { get; set; }
    public int       SortOrder   { get; set; }
    public DateTime? PublishAt   { get; set; }
    public DateTime? UnpublishAt { get; set; }
    public DateTime  CreatedAt   { get; set; }
    public DateTime? UpdatedAt   { get; set; }
}

/// <summary>i18n 側表的清單投影。每個單元的標題欄位名稱不同，故由各單元自己指定。</summary>
public sealed class AdminI18nSummary
{
    public int     OwnerId { get; set; }
    public string  Lang    { get; set; } = null!;
    public string? Title   { get; set; }
}

/// <summary>上下架（權限碼 <c>{unit}.publish</c>）。</summary>
public sealed class PublishDto
{
    public bool      IsPublished { get; set; }
    public DateTime? PublishAt   { get; set; }
    public DateTime? UnpublishAt { get; set; }
}

/// <summary>排序：一次送整批，避免逐筆 PATCH 造成中間狀態。</summary>
public sealed class SortItemDto
{
    public int Id        { get; set; }
    public int SortOrder { get; set; }
}
