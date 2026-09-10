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

    /// <summary>
    /// 後台文件（公告附件、供應商下載檔）：docs/09 §3。
    /// <para>
    /// 與 <see cref="ImageExtensions"/> 分開是因為兩者互不通用——圖片欄位收到 .zip
    /// 是錯的，文件欄位收到 .webp 也是錯的。共用一份白名單只會讓兩邊都變寬。
    /// </para>
    /// <para>
    /// docs §3 給 <c>supplier-notice</c> 的公告附件寫的是「PDF」，比這份窄。
    /// 那條較嚴的規則由後台介面的 accept 與提示文字承擔；這裡是所有文件欄位
    /// 共用的底線，不逐單元分岔。
    /// </para>
    /// </summary>
    public static readonly string[] DocumentExtensions = [".pdf", ".docx", ".xlsx", ".zip"];

    /// <summary>報價附件單檔上限 20MB。</summary>
    public const long QuoteAttachmentMaxBytes = 20 * 1024 * 1024;

    /// <summary>報價附件最多 5 個。</summary>
    public const int QuoteAttachmentMaxCount = 5;

    /// <summary>後台圖片單檔上限 10MB。</summary>
    public const long ImageMaxBytes = 10 * 1024 * 1024;

    /// <summary>後台文件單檔上限 20MB（docs/09 §3）。</summary>
    public const long DocumentMaxBytes = 20 * 1024 * 1024;

    /// <summary>Blob 容器名稱。全部 private（docs/10 §9.5）。</summary>
    public static class Containers
    {
        /// <summary>後台上傳的內容圖片。</summary>
        public const string Media = "media";

        /// <summary>報價附件——需授權且掃描通過才給下載。</summary>
        public const string QuoteAttachments = "quote-attachments";
    }
}
