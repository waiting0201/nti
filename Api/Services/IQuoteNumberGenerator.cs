namespace Nti.Api.Services;

/// <summary>報價單號產生（格式 <c>Q20260901-0001</c>，每日重新編號）。</summary>
public interface IQuoteNumberGenerator
{
    Task<string> NextAsync();
}
