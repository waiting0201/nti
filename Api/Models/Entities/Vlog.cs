namespace Nti.Api.Models.Entities;

/// <summary>
/// Green Vlog（docs/08 §4.6，後台單元 05）。無詳細頁，外連 YouTube。
/// <para>
/// <see cref="IsMainFeature"/> 全站僅一支，由 filtered unique index
/// <c>UX_Vlog_MainFeature</c> 在 DB 層保證，不只靠應用層檢查。
/// </para>
/// </summary>
public sealed class Vlog : IAuditable, IPublishable
{
    public int     Id                { get; set; }
    public int     CategoryId        { get; set; }
    public string  YoutubeId         { get; set; } = null!; // 只存 ID，前端組 embed / thumb URL
    public string? ThumbOverridePath { get; set; }          // 未填自動取 YouTube hqdefault
    public bool    IsMainFeature     { get; set; }          // 頁面頂部大播放器（僅一支）
    public int     SortOrder         { get; set; }

    public bool      IsPublished { get; set; } = true;
    public DateTime? PublishAt   { get; set; }
    public DateTime? UnpublishAt { get; set; }

    public DateTime  CreatedAt { get; set; }
    public int?      CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int?      UpdatedBy { get; set; }
    public bool      IsDeleted { get; set; }
}

public sealed class VlogI18n : II18n
{
    public int     VlogId      { get; set; }
    public string  Lang        { get; set; } = null!;
    public string  Title       { get; set; } = null!;
    public string? Description { get; set; }
}
