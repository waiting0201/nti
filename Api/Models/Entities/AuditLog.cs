namespace Nti.Api.Models.Entities;

/// <summary>
/// 操作紀錄（docs/08 §4.14，後台單元 24）。所有 <c>/admin/*</c> 的寫入操作皆記錄，
/// 由 <c>AppRouter</c> 在分派完成後統一寫入（docs/10 §9.3），保留 12 個月。
/// </summary>
public sealed class AuditLog
{
    public long     Id          { get; set; }
    public int?     AdminUserId { get; set; }          // 刻意不建 FK（docs/08 §2.3）
    public string   Action      { get; set; } = null!; // Create|Update|Delete|Publish|Login|Export
    public string   EntityName  { get; set; } = null!;
    public int?     EntityId    { get; set; }
    public string?  ChangesJson { get; set; }          // { field: [before, after] }
    public string?  SourceIp    { get; set; }
    public DateTime CreatedAt   { get; set; }
}
