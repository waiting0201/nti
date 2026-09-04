namespace Nti.Api.Common;

/// <summary>
/// 統一回應信封（docs/10 §5.1）。所有端點一律回傳此結構，禁止回裸 data。
/// <para>
/// <see cref="Code"/> 給程式判斷、<see cref="Message"/> 給人看、<see cref="Errors"/> 放細節；
/// 前端一律以 <c>code</c> 分支，不得比對 <c>message</c> 字串。
/// </para>
/// </summary>
public sealed class ApiResponse<T>
{
    public bool     Success   { get; init; }
    /// <summary>成功時 null；失敗時為 <see cref="ErrorCodes"/> 的值。</summary>
    public string?  Code      { get; init; }
    public T?       Data      { get; init; }
    public string   Message   { get; init; } = string.Empty;
    public string[] Errors    { get; init; } = [];
    public string   Timestamp { get; init; } = DateTimeOffset.UtcNow.ToString("o");
}

/// <summary>Static factory — 讓 Handler 保持簡潔。</summary>
public static class ApiResponse
{
    public static ApiResponse<T> Ok<T>(T data, string message = "Success") =>
        new() { Success = true, Data = data, Message = message };

    public static ApiResponse<object?> Ok(string message = "Success") =>
        new() { Success = true, Data = null, Message = message };

    public static ApiResponse<object?> Fail(string code, string message, params string[] errors) =>
        new() { Success = false, Code = code, Data = null, Message = message, Errors = errors };

    public static ApiResponse<object?> Fail(string code, string message, IEnumerable<string> errors) =>
        new() { Success = false, Code = code, Data = null, Message = message, Errors = errors.ToArray() };
}
