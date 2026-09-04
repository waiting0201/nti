namespace Nti.Api.Common;

/// <summary>
/// 錯誤碼值域（docs/10 §5.4）。新增一個碼要同時更新 docs/10 §5.4 的表與 04-api 的變更紀錄。
/// </summary>
public static class ErrorCodes
{
    public const string ValidationRequired    = "VALIDATION_REQUIRED";     // 400 缺必填欄位
    public const string ValidationFormat      = "VALIDATION_FORMAT";       // 400 格式錯誤（email／日期／slug）
    public const string ValidationRange       = "VALIDATION_RANGE";        // 400 長度／數值超出範圍

    public const string AuthInvalidCredentials = "AUTH_INVALID_CREDENTIALS"; // 401 帳密錯誤
    public const string AuthTokenInvalid       = "AUTH_TOKEN_INVALID";       // 401 token 缺失／過期／簽章不符
    public const string AuthMustChangePassword = "AUTH_MUST_CHANGE_PASSWORD";// 403 首登未改密碼
    public const string AuthAccountInactive    = "AUTH_ACCOUNT_INACTIVE";    // 403 帳號停用
    public const string Forbidden              = "FORBIDDEN";                // 403 權限碼不足

    public const string NotFound          = "NOT_FOUND";           // 404 不存在／已軟刪／未上架
    public const string ConflictDuplicate = "CONFLICT_DUPLICATE";  // 409 slug／Code／email 重複
    public const string ConflictState     = "CONFLICT_STATE";      // 409 狀態不允許此操作

    public const string UploadType      = "UPLOAD_TYPE";       // 400 副檔名或 magic bytes 不在白名單
    public const string UploadSize      = "UPLOAD_SIZE";       // 400 單檔 > 20MB 或超過 5 個
    public const string UploadUnscanned = "UPLOAD_UNSCANNED";  // 403 ScanStatus <> 'Clean' 的附件下載

    public const string RateLimited     = "RATE_LIMITED";      // 429 公開表單／登入頻率限制
    public const string BotCheckFailed  = "BOT_CHECK_FAILED";  // 400 Turnstile 未通過

    public const string Internal        = "INTERNAL";          // 500 未預期例外（不得洩漏堆疊）
}
