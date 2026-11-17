namespace Nti.Api.Common;

/// <summary>
/// 上傳檔名的淨化。檔名只用來<b>顯示</b>（後台清單、通知信、下載時的預設檔名）；
/// Blob 上的實際路徑一律是 GUID（<see cref="Services.BlobStorageService"/>），不受這裡影響。
/// </summary>
public static class UploadFileName
{
    /// <summary>
    /// 去掉路徑、控制字元與雙向文字控制字元，並截到 <paramref name="maxLength"/>（保留副檔名）。
    /// <list type="bullet">
    ///   <item>路徑：舊版 IE／Edge 會送出 <c>C:\Users\…\file.pdf</c>；macOS 上的 <c>Path.GetFileName</c> 不認反斜線，要先換掉。</item>
    ///   <item>雙向控制字元（U+202E 等）：<c>invoice‮fdp.exe</c> 在畫面上會顯示成 <c>invoiceexe.pdf</c>，
    ///         是偽裝副檔名的老手法。後台人員看到的名字必須就是檔案真正的名字。</item>
    ///   <item>長度：欄位是 <c>nvarchar(200)</c>，超長原本會在<b>上傳完 Blob 之後</b>才撞 DB 截斷錯誤。</item>
    /// </list>
    /// </summary>
    public static string Sanitize(string? raw, int maxLength = UploadRules.OriginalNameMaxLength)
    {
        var name = Path.GetFileName((raw ?? string.Empty).Replace('\\', '/'));
        name = new string(name.Where(c => !char.IsControl(c) && !IsBidiControl(c)).ToArray()).Trim();

        var ext  = Path.GetExtension(name);
        var stem = Path.GetFileNameWithoutExtension(name).Trim().TrimEnd('.');
        if (stem.Length == 0) stem = "attachment";

        // 副檔名本身異常地長時就不保留它（白名單的副檔名最長 5 字元，這種檔案稍後會被擋下）
        if (ext.Length >= maxLength) ext = string.Empty;
        if (stem.Length + ext.Length > maxLength)
        {
            stem = stem[..(maxLength - ext.Length)];
            // 不要把 emoji 之類的代理對切成半個字元
            if (char.IsHighSurrogate(stem[^1])) stem = stem[..^1];
        }

        return stem + ext;
    }

    private static bool IsBidiControl(char c) =>
        c is '\u200E' or '\u200F' or '\u061C'
          or >= '\u202A' and <= '\u202E'
          or >= '\u2066' and <= '\u2069';
}
