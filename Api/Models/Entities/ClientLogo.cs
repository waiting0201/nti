namespace Nti.Api.Models.Entities;

/// <summary>
/// 客戶 logo 輪播（docs/08 §4.8，後台單元 09）。
/// <para>品牌名不翻譯，刻意無 i18n 側表——<see cref="Name"/> 同時作為 alt。</para>
/// </summary>
public sealed class ClientLogo : IAuditable
{
    public int     Id          { get; set; }
    public string  Name        { get; set; } = null!;   // 同時作為 alt
    public string  LogoPath    { get; set; } = null!;   // 去背 PNG／SVG
    public string? LinkUrl     { get; set; }
    public int     SortOrder   { get; set; }
    public bool    IsPublished { get; set; } = true;

    public DateTime  CreatedAt { get; set; }
    public int?      CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int?      UpdatedBy { get; set; }
    public bool      IsDeleted { get; set; }
}
