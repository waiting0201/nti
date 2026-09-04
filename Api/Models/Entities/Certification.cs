namespace Nti.Api.Models.Entities;

/// <summary>認證／夥伴／獎項（docs/08 §4.8，後台單元 08）。<see cref="ShowOnHome"/> 決定是否列入首頁 Proof 牆。</summary>
public sealed class Certification : IAuditable
{
    public int     Id          { get; set; }
    public int?    CategoryId  { get; set; }
    public string  LogoPath    { get; set; } = null!;   // 去背 PNG／SVG
    public string? LinkUrl     { get; set; }
    public bool    ShowOnHome  { get; set; } = true;
    public int     SortOrder   { get; set; }
    public bool    IsPublished { get; set; } = true;

    public DateTime  CreatedAt { get; set; }
    public int?      CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int?      UpdatedBy { get; set; }
    public bool      IsDeleted { get; set; }
}

public sealed class CertificationI18n : II18n
{
    public int     CertificationId { get; set; }
    public string  Lang            { get; set; } = null!;
    public string  Name            { get; set; } = null!;
    public string? Description     { get; set; }
    public string  LogoAlt         { get; set; } = null!;
}
