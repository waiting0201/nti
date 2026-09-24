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

    // 證號與日期：客戶 2026-09-22 SEO/GEO 文案要求逐條附上，AI 引擎只引用有具體數字的文字。
    // 不分語系（證號就是證號）；都可空，沒填前台就不顯示那一行。
    public string?   CertificateNo { get; set; }             // 例：FSC-C123456
    public DateOnly? CertifiedDate { get; set; }             // 取得日期
    public DateOnly? LastAuditDate { get; set; }             // 最近一次第三方稽核日期

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
