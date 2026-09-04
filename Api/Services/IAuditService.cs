namespace Nti.Api.Services;

/// <summary>
/// 操作紀錄（docs/10 §9.3）。<c>/admin/*</c> 的寫入操作在 <c>AppRouter</c> 分派完成後統一寫入，
/// 不由各 Handler 各寫一次——後者遲早會有人漏寫，而且漏了不會有任何症狀。
/// </summary>
public interface IAuditService
{
    Task WriteAsync(int? adminUserId, string action, string entityName, int? entityId, string? sourceIp);
}
