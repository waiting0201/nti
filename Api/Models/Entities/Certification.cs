namespace Nti.Api.Models.Entities;

/// <summary>認證／夥伴／獎項（docs/08 §4.8，後台單元 08）。<see cref="ShowOnHome"/> 決定是否列入首頁 Proof 牆。</summary>
public sealed class Certification : IAuditable
{
    public int     Id          { get; set; }
    public int?    CategoryId  { get; set; }
    public string  LogoPath    { get; set; } = null!;   // 去背 PNG／SVG
    public string? LinkUrl     { get; set; }
    public bool    ShowOnHome  { get; set; } = true;
    // 列在認證頁「管理系統與環境認證」清單（名稱＋說明）。2026-10-22 加；2026-10-30 起認證頁改全由 CertificationListItem 驅動，此欄已無作用
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
/// 認證頁的文字清單項目（後台單元 08 的附屬清單，2026-10-22 加；2026-10-30 起改為客戶指定的七個區塊）。
/// 這些不是認證——沒有 logo，也不該出現在 logo 牆與首頁 Proof 牆，所以不放進 <see cref="Certification"/>。
/// </summary>
public sealed class CertificationListItem : IAuditable
{
    public int    Id          { get; set; }
    public string Section     { get; set; } = null!;   // management 管理系統／quality 色彩與印刷品質資格／material 紙材與油墨／building 廠房建築／membership 會員與自有標章／award 獲獎記錄／partner 合作夥伴
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

/// <summary>
/// 碳效率頁的績效表（後台單元 08 的附屬清單，2026-11-05 加）：一列＝指標／期間／結果。
/// 掛在 /green-carbon「水資源」段落下方；三欄都分語系（「2024 年」「度／年」這類單位中英寫法不同）。
/// 跟認證同屬 ESG 揭露，權限沿用 certification.*，不另開權限碼。
/// </summary>
public sealed class PerformanceMetric : IAuditable
{
    public int    Id          { get; set; }
    public int    SortOrder   { get; set; }
    public bool   IsPublished { get; set; } = true;

    public DateTime  CreatedAt { get; set; }
    public int?      CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int?      UpdatedBy { get; set; }
    public bool      IsDeleted { get; set; }
}

public sealed class PerformanceMetricI18n : II18n
{
    public int    PerformanceMetricId { get; set; }
    public string Lang                { get; set; } = null!;
    public string Indicator           { get; set; } = null!;   // 指標：溫室氣體總排放
    public string Period              { get; set; } = null!;   // 期間：2024 年／2026 / 2030／現況
    public string Result              { get; set; } = null!;   // 結果：2,141 公噸 CO₂e（直接 314、能源間接 1,827）
}

/// <summary>
/// ESG 頁的「南台彩藝永續目標」表（後台單元 08 的附屬清單，2026-11-05 加）：一列＝目標／時程。
/// 掛在 /green-esg「企業社會責任」上方；兩欄都分語系。權限沿用 certification.*。
/// </summary>
public sealed class SustainabilityGoal : IAuditable
{
    public int    Id          { get; set; }
    public int    SortOrder   { get; set; }
    public bool   IsPublished { get; set; } = true;

    public DateTime  CreatedAt { get; set; }
    public int?      CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int?      UpdatedBy { get; set; }
    public bool      IsDeleted { get; set; }
}

public sealed class SustainabilityGoalI18n : II18n
{
    public int    SustainabilityGoalId { get; set; }
    public string Lang                 { get; set; } = null!;
    public string Goal                 { get; set; } = null!;   // 目標：ISO 50001 能源管理
    public string Timeline             { get; set; } = null!;   // 時程：預計 2026／申請中
}
