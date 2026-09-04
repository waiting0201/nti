namespace Nti.Api.Models.Entities;

/// <summary>供應商規範（docs/08 §4.10，後台單元 13）。</summary>
public sealed class SupplierSpec : IAuditable
{
    public int  Id          { get; set; }
    public int  SortOrder   { get; set; }
    public bool IsPublished { get; set; } = true;

    public DateTime  CreatedAt { get; set; }
    public int?      CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int?      UpdatedBy { get; set; }
    public bool      IsDeleted { get; set; }
}

public sealed class SupplierSpecI18n : II18n
{
    public int    SupplierSpecId { get; set; }
    public string Lang           { get; set; } = null!;
    public string Title          { get; set; } = null!;
    public string Description    { get; set; } = null!;
}
