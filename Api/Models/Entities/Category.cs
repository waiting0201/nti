namespace Nti.Api.Models.Entities;

/// <summary>
/// 統一分類主檔（docs/08 §4.1）：全 schema 唯一的橫向共用主檔，一表九用
/// （九種 <c>CategoryType</c> 服務八個內容單元與報價表單），後台為單一「分類管理」單元。
/// <para>
/// 型別正確性由各引用端的 <c>CategoryTypeGuard</c> 複合外鍵在 DB 層保證，見 docs/08 §4.16。
/// </para>
/// </summary>
public sealed class Category : IAuditable
{
    public int    Id           { get; set; }
    public string CategoryType { get; set; } = null!;   // 值域見 Common.CategoryTypes
    public string Code         { get; set; } = null!;   // 程式用固定碼，建立後不可改
    public int    SortOrder    { get; set; }
    public bool   IsActive     { get; set; } = true;

    public DateTime  CreatedAt { get; set; }
    public int?      CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int?      UpdatedBy { get; set; }
    public bool      IsDeleted { get; set; }
}

public sealed class CategoryI18n : II18n
{
    public int    CategoryId { get; set; }
    public string Lang       { get; set; } = null!;
    public string Name       { get; set; } = null!;
}
