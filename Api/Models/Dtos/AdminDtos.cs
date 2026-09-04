namespace Nti.Api.Models.Dtos;

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
