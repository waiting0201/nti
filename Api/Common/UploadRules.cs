namespace Nti.Api.Common;

/// <summary>
/// 上傳限制（docs/09 §3 為尺寸與格式的權威；此處只落實後端擋得住的部分）。
/// </summary>
public static class UploadRules
{
    /// <summary>報價設計稿：docs/04 §3.2。</summary>
    public static readonly string[] QuoteAttachmentExtensions = [".pdf", ".ai", ".psd", ".jpg", ".jpeg", ".png", ".zip"];

    /// <summary>後台圖片：docs/09 §3。</summary>
    public static readonly string[] ImageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".svg"];

    /// <summary>報價附件單檔上限 20MB。</summary>
    public const long QuoteAttachmentMaxBytes = 20 * 1024 * 1024;

    /// <summary>報價附件最多 5 個。</summary>
    public const int QuoteAttachmentMaxCount = 5;

    /// <summary>後台圖片單檔上限 10MB。</summary>
    public const long ImageMaxBytes = 10 * 1024 * 1024;

    /// <summary>Blob 容器名稱。全部 private（docs/10 §9.5）。</summary>
    public static class Containers
    {
        /// <summary>後台上傳的內容圖片。</summary>
        public const string Media = "media";

        /// <summary>報價附件——需授權且掃描通過才給下載。</summary>
        public const string QuoteAttachments = "quote-attachments";
    }
}
