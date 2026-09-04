using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Azure.Functions.Worker.Middleware;
using Microsoft.Extensions.Logging;
using Nti.Api.Common;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Nti.Api.Middleware;

/// <summary>
/// 全域例外處理（docs/10 §6.2）。
/// <para>
/// 是 <see cref="IFunctionsWorkerMiddleware"/>（worker 層）而<b>不是</b> ASP.NET Core middleware——
/// 因為採 <c>ConfigureFunctionsWebApplication</c>，回應要透過 <c>context.GetHttpContext()</c> 寫回。
/// </para>
/// </summary>
public sealed class ExceptionMiddleware(ILogger<ExceptionMiddleware> logger) : IFunctionsWorkerMiddleware
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy   = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = JsonIgnoreCondition.Never,
        WriteIndented          = false,
    };

    /// <summary>SQL Server 的約束違反錯誤碼。</summary>
    private const int ConstraintViolation  = 547;    // FK 或 CHECK
    private const int UniqueIndexViolation = 2601;
    private const int UniqueViolation      = 2627;

    private static readonly int[] ConstraintErrors =
        [ConstraintViolation, UniqueIndexViolation, UniqueViolation];

    public async Task Invoke(FunctionContext context, FunctionExecutionDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (AppException appEx)
        {
            logger.LogWarning(appEx, "AppException [{Code}/{StatusCode}]: {Message}",
                appEx.Code, appEx.StatusCode, appEx.Message);
            await WriteErrorAsync(context, appEx.StatusCode, appEx.Code, appEx.Message);
        }
        catch (InvalidOperationException ioEx)
            when (ioEx.Message.Contains("Incorrect Content-Type", StringComparison.OrdinalIgnoreCase))
        {
            // ReadFormAsync 對非 multipart／x-www-form-urlencoded 的請求拋這個。
            // 不單獨接住就會變成 500，看起來像伺服器壞掉而不是請求格式錯（Jabez 已驗證）。
            logger.LogWarning(ioEx, "Form parse failed in [{Function}]", context.FunctionDefinition.Name);
            await WriteErrorAsync(context, 400, ErrorCodes.UploadType,
                "請求需為 multipart/form-data 或 application/x-www-form-urlencoded。");
        }
        catch (DbUpdateException dbEx) when (dbEx.InnerException is SqlException sql && ConstraintErrors.Contains(sql.Number))
        {
            // 約束擋下來的寫入是「請求有問題」，不是伺服器壞了。不轉譯的話前端只會看到
            // 500「伺服器發生非預期錯誤」——例如選了不屬於該單元型別的分類
            // （Category 型別安全的複合外鍵，docs/08 §4.16），使用者完全不知道要改什麼。
            logger.LogWarning(dbEx, "DB 約束擋下寫入：{Number} {Message}", sql.Number, sql.Message);

            var (code, message) = sql.Number switch
            {
                UniqueViolation or UniqueIndexViolation =>
                    (ErrorCodes.ConflictDuplicate, "資料重複，請檢查唯一欄位（如 slug、代號、Email）。"),
                _ =>
                    (ErrorCodes.ConflictState, "資料關聯或值域檢查未通過，請確認選擇的分類、狀態是否正確。"),
            };

            await WriteErrorAsync(context, 409, code, message);
        }
        catch (Exception ex)
        {
            // 對外只回通用訊息，堆疊只進 App Insights（docs/10 §9.10）
            logger.LogError(ex, "Unhandled exception in [{Function}]", context.FunctionDefinition.Name);
            await WriteErrorAsync(context, 500, ErrorCodes.Internal, "伺服器發生非預期錯誤。");
        }
    }

    private static async Task WriteErrorAsync(FunctionContext context, int statusCode, string code, string message)
    {
        var httpContext = context.GetHttpContext();
        if (httpContext is null || httpContext.Response.HasStarted) return;

        var body = JsonSerializer.Serialize(ApiResponse.Fail(code, message), JsonOptions);
        httpContext.Response.StatusCode  = statusCode;
        httpContext.Response.ContentType = "application/json";
        await httpContext.Response.WriteAsync(body);
    }
}
