namespace Nti.Api.Models.Entities;

/// <summary>
/// 供應商下載（docs/08 §4.10，後台單元 14）。
/// <para><see cref="RequireLogin"/> 為受控文件，會員系統上線後（P6）才生效。</para>
/// </summary>
public sealed class SupplierDownload : IAuditable
{
    public int    Id            { get; set; }
    public string FilePath      { get; set; } = null!;
    public string FileExt       { get; set; } = null!;  // 自動帶入，前台顯示 PDF/XLSX 標籤
    public long   FileSizeBytes { get; set; }           // 自動帶入，前台格式化為 2.4 MB
    public bool   RequireLogin  { get; set; }
    public int    DownloadCount { get; set; }
    public int    SortOrder     { get; set; }
    public bool   IsPublished   { get; set; } = true;

    public DateTime  CreatedAt { get; set; }
    public int?      CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int?      UpdatedBy { get; set; }
    public bool      IsDeleted { get; set; }
}

public sealed class SupplierDownloadI18n : II18n
{
    public int    SupplierDownloadId { get; set; }
    public string Lang               { get; set; } = null!;
    public string Name               { get; set; } = null!;
}
