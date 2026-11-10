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

    /// <summary>字串超過欄位長度。2628 是 SQL Server 2019+／Azure SQL 的新版（訊息含表名與欄名），8152 是舊版。</summary>
    private static readonly int[] TruncationErrors = [2628, 8152];

    /// <summary>2628 的訊息：<c>… in table 'NTI.dbo.CertificationI18n', column 'Description'. Truncated value: '…'</c></summary>
    private static readonly System.Text.RegularExpressions.Regex TruncationTarget = new(
        @"table '(?:[^'.]+\.)*(?<table>[^'.]+)', column '(?<column>[^']+)'",
        System.Text.RegularExpressions.RegexOptions.Compiled);

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

            // DELETE 撞到 FK 的意思跟寫入完全不同：是「還有東西指著這一筆」。
            // 沿用寫入那句「請確認選擇的分類、狀態」會把操作者導向一個不存在的欄位。
            var isDelete = string.Equals(
                context.GetHttpContext()?.Request.Method, "DELETE", StringComparison.OrdinalIgnoreCase);

            var (code, message) = (sql.Number, isDelete) switch
            {
                (UniqueViolation or UniqueIndexViolation, _) =>
                    (ErrorCodes.ConflictDuplicate, "資料重複，請檢查唯一欄位（如 slug、代號、Email）。"),
                (_, true) =>
                    (ErrorCodes.ConflictState, "這筆資料仍被其他資料引用（例如已送出的報價），無法刪除。"),
                _ =>
                    (ErrorCodes.ConflictState, "資料關聯或值域檢查未通過，請確認選擇的分類、狀態是否正確。"),
            };

            await WriteErrorAsync(context, 409, code, message);
        }
        catch (DbUpdateException dbEx) when (dbEx.InnerException is SqlException sql && TruncationErrors.Contains(sql.Number))
        {
            // 文字超過欄位長度（2026-11-10：08 認證的「說明」上限 400 字，後台沒擋，
            // 存檔只看到 500「伺服器發生非預期錯誤」，完全不知道是哪一欄太長）。
            // 這是請求的問題，回 400 並指出欄位與上限；SQL 訊息裡的截斷值不外露。
            logger.LogWarning(dbEx, "欄位長度超過上限：{Number} {Message}", sql.Number, sql.Message);
            await WriteErrorAsync(context, 400, ErrorCodes.ValidationRange, DescribeTruncation(context, sql.Message));
        }
        catch (Exception ex)
        {
            // 對外只回通用訊息，堆疊只進 App Insights（docs/10 §9.10）
            logger.LogError(ex, "Unhandled exception in [{Function}]", context.FunctionDefinition.Name);
            await WriteErrorAsync(context, 500, ErrorCodes.Internal, "伺服器發生非預期錯誤。");
        }
    }

    /// <summary>
    /// 「說明（Description）超過 400 字上限」。上限從 EF 模型反查（schema 權威就是它），
    /// 查不到就只講欄名；連欄名都解析不出來（8152 不帶欄名）時給通用訊息。
    /// </summary>
    private static string DescribeTruncation(FunctionContext context, string sqlMessage)
    {
        var match = TruncationTarget.Match(sqlMessage);
        if (!match.Success) return "有欄位的文字超過長度上限，請縮短後再存。";

        var table  = match.Groups["table"].Value;
        var column = match.Groups["column"].Value;

        int? max = null;
        try
        {
            var db = context.InstanceServices.GetService(typeof(Nti.Api.Data.AppDbContext)) as Nti.Api.Data.AppDbContext;
            max = db?.Model.GetEntityTypes()
                .Where(t => t.GetTableName() == table)
                .SelectMany(t => t.GetProperties())
                .FirstOrDefault(p => p.GetColumnName() == column)
                ?.GetMaxLength();
        }
        catch
        {
            // 只是為了錯誤訊息更好讀，查不到不影響回應
        }

        return max is int n
            ? $"「{column}」欄位超過 {n} 字上限，請縮短後再存。"
            : $"「{column}」欄位超過長度上限，請縮短後再存。";
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
