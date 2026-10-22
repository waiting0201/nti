namespace Nti.Api.Models.Entities;

/// <summary>認證／夥伴／獎項（docs/08 §4.8，後台單元 08）。<see cref="ShowOnHome"/> 決定是否列入首頁 Proof 牆。</summary>
public sealed class Certification : IAuditable
{
    public int     Id          { get; set; }
    public int?    CategoryId  { get; set; }
    public string  LogoPath    { get; set; } = null!;   // 去背 PNG／SVG
    public string? LinkUrl     { get; set; }
    public bool    ShowOnHome  { get; set; } = true;
    // 列在認證頁「管理系統與環境認證」清單（名稱＋說明）。2026-10-22 加
    public bool    ShowInDetailList { get; set; }
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
    // 首頁 Proof 牆 logo 下方那行用的簡稱（例：ISO 9001）；空的就用 Name。2026-10-21 加
    public string? ShortName       { get; set; }
    public string? Description     { get; set; }
    public string  LogoAlt         { get; set; } = null!;
}

/// <summary>
/// 認證頁的文字清單項目（後台單元 08 的附屬清單，2026-10-22 加）：色彩標準、GMI 通路、獎項。
/// 這些不是認證——沒有 logo，也不該出現在 logo 牆與首頁 Proof 牆，所以不放進 <see cref="Certification"/>。
/// </summary>
public sealed class CertificationListItem : IAuditable
{
    public int    Id          { get; set; }
    public string Section     { get; set; } = null!;   // standards（色彩標準）／gmi（GMI 通路）／award（獎項）
    public int    SortOrder   { get; set; }
    public bool   IsPublished { get; set; } = true;

    public DateTime  CreatedAt { get; set; }
    public int?      CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int?      UpdatedBy { get; set; }
    public bool      IsDeleted { get; set; }
}

public sealed class CertificationListItemI18n : II18n
{
    public int     CertificationListItemId { get; set; }
    public string  Lang                    { get; set; } = null!;
    public string  Title                   { get; set; } = null!;
    public string? Description             { get; set; }
}
