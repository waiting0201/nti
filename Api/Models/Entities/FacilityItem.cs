namespace Nti.Api.Models.Entities;

/// <summary>
/// 設備卡（docs/08 §4.8，後台單元 10）。
/// 分類即 Facility & Equipment 的五個子頁：印前／環保印刷／印後／品檢／導覽。
/// </summary>
public sealed class FacilityItem : IAuditable
{
    public int    Id          { get; set; }
    public int    CategoryId  { get; set; }
    public string ImagePath   { get; set; } = null!;
    public int    SortOrder   { get; set; }
    public bool   IsPublished { get; set; } = true;

    public DateTime  CreatedAt { get; set; }
    public int?      CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int?      UpdatedBy { get; set; }
    public bool      IsDeleted { get; set; }
}

public sealed class FacilityItemI18n : II18n
{
    public int     FacilityItemId { get; set; }
    public string  Lang           { get; set; } = null!;
    public string  Name           { get; set; } = null!;
    public string? Description    { get; set; }
    public string  ImageAlt       { get; set; } = null!;
}
