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
/// </summary>
public interface IPublishable
{
    bool      IsPublished { get; set; }
    DateTime? PublishAt   { get; set; }
    DateTime? UnpublishAt { get; set; }
    int       SortOrder   { get; set; }
}
