namespace Nti.Api.Models.Dtos;

/// <summary>
/// SEO 欄位組（docs/08 §2.7）。凡是有自己網址的實體（Page／News／Solution）都回傳這組。
/// <para>
/// <see cref="Hreflang"/> 不落欄位，由同一 Id 的兩筆 i18n 推導（語系 → slug），
/// 供前端組 <c>&lt;link rel="alternate"&gt;</c>。缺語系的那一邊不會出現在字典裡。
/// </para>
/// </summary>
public sealed class SeoDto
{
    public string  Slug           { get; set; } = null!;
    public string? SeoTitle       { get; set; }
    public string? SeoDescription { get; set; }
    public string? CanonicalUrl   { get; set; }
    public string? OgTitle        { get; set; }
    public string? OgDescription  { get; set; }
    public string? OgImagePath    { get; set; }

    public Dictionary<string, string> Hreflang { get; set; } = [];
}

/// <summary>分類（docs/08 §4.1）。前台的篩選器與下拉選單都吃這個。</summary>
public sealed class CategoryDto
{
    public int    Id           { get; set; }
    public string CategoryType { get; set; } = null!;
    public string Code         { get; set; } = null!;
    public int    SortOrder    { get; set; }
    public string Name         { get; set; } = null!;
}

/// <summary>
/// 全站設定（docs/08 §4.1）。<see cref="Value"/> 已依語系解析完成，
/// 前端不需要知道 <c>IsLocalized</c> 與 ValueZh/ValueEn 的存在。
/// <para>⚠ <c>Mail</c> 群組（信件收件者）為內部設定，<b>不會出現在前台回應中</b>。</para>
/// </summary>
public sealed class SiteSettingDto
{
    public string  SettingKey { get; set; } = null!;
    public string  GroupName  { get; set; } = null!;
    public string  ValueType  { get; set; } = null!;
    public string? Value      { get; set; }
}
