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

    /// <summary>
    /// 報價附件合計上限 95MB。
    /// <para>
    /// 不是 20MB × 5：Functions host 預設整個請求本文上限 100MB（<c>FUNCTIONS_REQUEST_BODY_SIZE_LIMIT</c>），
    /// 5 個都滿 20MB 再加 multipart 的分界與文字欄位，會在 host 那層被直接切斷，
    /// 訪客看到的是連線錯誤而不是可理解的訊息。留 5MB 給 multipart 開銷與欄位。
    /// </para>
    /// </summary>
    public const long QuoteAttachmentMaxTotalBytes = 95L * 1024 * 1024;

    /// <summary>
    /// 報價請求本文上限：附件合計 + 1MB 文字欄位。<b>在讀取本文之前</b>就以
    /// <c>Content-Length</c> 擋，並同時作為 <c>FormOptions</c> 的上限（chunked 請求沒有 Content-Length）。
    /// </summary>
    public const long QuoteRequestMaxBytes = QuoteAttachmentMaxTotalBytes + 1024 * 1024;

    /// <summary>聯絡表單沒有附件，本文 256KB 已遠超任何正常留言。</summary>
    public const long ContactRequestMaxBytes = 256 * 1024;

    /// <summary>
    /// 報價附件存檔時的 Content-Type：<b>由副檔名決定，不採用上傳端送來的值</b>。
    /// 上傳端的 Content-Type 是使用者說了算（可以是 <c>text/html</c>），存進 Blob 與 DB
    /// 等於讓外部檔案決定日後任何讀取者怎麼解讀它。
    /// </summary>
    public static readonly IReadOnlyDictionary<string, string> QuoteAttachmentContentTypes =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            [".pdf"]  = "application/pdf",
            [".ai"]   = "application/postscript",
            [".psd"]  = "image/vnd.adobe.photoshop",
            [".jpg"]  = "image/jpeg",
            [".jpeg"] = "image/jpeg",
            [".png"]  = "image/png",
            [".zip"]  = "application/zip",
        };

    /// <summary>附件原始檔名的上限，與 <c>QuoteAttachment.OriginalName</c> 欄位長度一致。</summary>
    public const int OriginalNameMaxLength = 200;

    /// <summary>後台圖片單檔上限 10MB。</summary>
    public const long ImageMaxBytes = 10 * 1024 * 1024;

    /// <summary>
    /// 各單元圖片的最大寬度，超過就由 <see cref="ImageOptimizer"/> 等比縮小。
    /// 取自 docs/09 §3 建議尺寸的寬（同單元多個欄位取最寬的那個：solution 的品項圖 1280 &gt; 封面 1160）。
    /// client 的建議只講短邊 ≥300，橫式 logo 會很寬，給 1200。
    /// </summary>
    private static readonly Dictionary<string, int> ImageMaxWidths = new(StringComparer.OrdinalIgnoreCase)
    {
        ["home-banner"]   = 2400,
        ["setting"]       = 2400,
        ["solution"]      = 1280,
        ["project"]       = 1160,
        ["news"]          = 1800,
        ["certification"] = 600,
        ["client"]        = 1200,
        ["facility"]      = 1200,
        ["vlog"]          = 1280,
    };

    /// <summary>沒列在表上的單元（例如 page 的 OG 圖）以首頁 Banner 的寬度為上限。</summary>
    public static int ImageMaxWidthFor(string unit) =>
        ImageMaxWidths.TryGetValue(unit, out var width) ? width : 2400;

    /// <summary>後台文件單檔上限 20MB（docs/09 §3）。</summary>
    public const long DocumentMaxBytes = 20 * 1024 * 1024;

    /// <summary>Blob 容器名稱。全部 private（docs/10 §9.5）。</summary>
    public static class Containers
    {
        /// <summary>後台上傳的內容圖片。</summary>
        public const string Media = "media";

        /// <summary>報價附件——下載限 <c>quote.download</c>（僅超管），本期不做病毒掃描（docs/09 §17）。</summary>
        public const string QuoteAttachments = "quote-attachments";
    }
}
