namespace Nti.Api.Services;

/// <summary>後台存檔後通知前台重生快取。實作見 <see cref="FrontendRevalidator"/>。</summary>
public interface IFrontendRevalidator
{
    /// <summary>作廢前台 <c>cms</c> tag 的快取。失敗只記 log，不拋例外。</summary>
    Task RevalidateAsync(CancellationToken cancellationToken = default);
}
