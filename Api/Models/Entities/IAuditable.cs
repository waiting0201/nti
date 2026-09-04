namespace Nti.Api.Models.Entities;

/// <summary>
/// 稽核五欄（docs/08 §2.3）。所有內容表皆含，由
/// <see cref="Data.AppDbContext.SaveChangesAsync"/> 統一填寫，Handler 不得自行指派。
/// <para><c>CreatedBy</c>／<c>UpdatedBy</c> 指向 <c>AdminUser.Id</c>，刻意不建 FK。</para>
/// </summary>
public interface IAuditable
{
    DateTime  CreatedAt { get; set; }
    int?      CreatedBy { get; set; }
    DateTime? UpdatedAt { get; set; }
    int?      UpdatedBy { get; set; }
    bool      IsDeleted { get; set; }
}

/// <summary>
/// 上下架四欄（docs/08 §2.4）。前台查詢一律套 <c>PublicFilter</c>（docs/10 §8.2）。
/// <para>
/// 注意 <c>SortOrder</c> 不在這裡——有些單元（News、SupplierNotice）用日期排序而無 SortOrder，
/// 有些（SolutionItem、ClientLogo）有 SortOrder 卻無上下架時間窗。兩者是獨立的欄位組。
/// </para>
/// </summary>
public interface IPublishable
{
    bool      IsPublished { get; set; }
    DateTime? PublishAt   { get; set; }
    DateTime? UnpublishAt { get; set; }
}

/// <summary>多語子表（docs/08 §2.5）。PK 一律 (<c>{Entity}Id</c>, <c>Lang</c>)，值域 zh/en，缺語系不 fallback。</summary>
public interface II18n
{
    string Lang { get; set; }
}
