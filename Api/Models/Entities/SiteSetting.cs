namespace Nti.Api.Models.Entities;

/// <summary>
/// 全站設定（docs/08 §4.1）：key-value，後台以固定 key 清單渲染表單。
/// <para>
/// 全 schema 唯一不用 <c>*I18n</c> 側表、改用橫向 <c>ValueZh</c>／<c>ValueEn</c> 的例外——
/// 固定 15 個 key 沒有增刪需求，側表只會讓每次讀設定多一次 JOIN。
/// </para>
/// </summary>
public sealed class SiteSetting
{
    public string    SettingKey  { get; set; } = null!;
    public string    GroupName   { get; set; } = null!;  // Company|Social|Home|Mail
    public string    ValueType   { get; set; } = null!;  // text|multiline|image|url|email|html
    public bool      IsLocalized { get; set; }
    public string?   ValueZh     { get; set; }
    public string?   ValueEn     { get; set; }
    public int       SortOrder   { get; set; }
    public DateTime? UpdatedAt   { get; set; }
    public int?      UpdatedBy   { get; set; }
}
