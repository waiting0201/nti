namespace Nti.Api.Models.Dtos;

/// <summary>供應商公告（後台單元 12）。</summary>
public sealed class SupplierNoticeDto
{
    public int      Id             { get; set; }
    public int      CategoryId     { get; set; }
    public string   CategoryCode   { get; set; } = null!;
    public string   CategoryName   { get; set; } = null!;
    public DateOnly NoticeDate     { get; set; }
    public string?  AttachmentPath { get; set; }
    public string   Title          { get; set; } = null!;
    public string?  BodyHtml       { get; set; }
}

/// <summary>供應商規範（後台單元 13）。</summary>
public sealed class SupplierSpecDto
{
    public int    Id          { get; set; }
    public int    SortOrder   { get; set; }
    public string Title       { get; set; } = null!;
    public string Description { get; set; } = null!;
}

/// <summary>
/// 供應商下載（後台單元 14）。
/// <para>
/// <see cref="FilePath"/> 不直接給檔案 URL——下載一律經後端代理路由，容器全為 private。
/// </para>
/// </summary>
public sealed class SupplierDownloadDto
{
    public int    Id            { get; set; }
    public string FilePath      { get; set; } = null!;
    public string FileExt       { get; set; } = null!;
    public long   FileSizeBytes { get; set; }
    public int    DownloadCount { get; set; }
    public int    SortOrder     { get; set; }
    public string Name          { get; set; } = null!;
}
