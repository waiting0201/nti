namespace Nti.Api.Common;

/// <summary>
/// 上傳檔案的 magic bytes 驗證（docs/10 §9.5）。
/// <para>
/// <b>只信任檔頭，不信任 Content-Type 與副檔名</b>——兩者都是使用者送什麼就是什麼。
/// 把 .exe 改名成 .pdf 送上來，副檔名白名單擋不住，檔頭擋得住。
/// </para>
/// </summary>
public static class FileSignatureValidator
{
    /// <summary>副檔名 → 可接受的檔頭（任一符合即可）。</summary>
    private static readonly Dictionary<string, byte[][]> Signatures = new(StringComparer.OrdinalIgnoreCase)
    {
        [".pdf"]  = [[0x25, 0x50, 0x44, 0x46]],                                     // %PDF
        [".jpg"]  = [[0xFF, 0xD8, 0xFF]],
        [".jpeg"] = [[0xFF, 0xD8, 0xFF]],
        [".png"]  = [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]],
        [".gif"]  = [[0x47, 0x49, 0x46, 0x38]],                                     // GIF8
        [".webp"] = [[0x52, 0x49, 0x46, 0x46]],                                     // RIFF（第 8–11 byte 另檢 WEBP）
        [".zip"]  = [[0x50, 0x4B, 0x03, 0x04], [0x50, 0x4B, 0x05, 0x06], [0x50, 0x4B, 0x07, 0x08]],
        [".psd"]  = [[0x38, 0x42, 0x50, 0x53]],                                     // 8BPS
        // AI 檔實際上是 PDF 或 EPS 包裝
        [".ai"]   = [[0x25, 0x50, 0x44, 0x46], [0x25, 0x21, 0x50, 0x53]],
        // SVG 是純文字，沒有固定檔頭；由 IsTextualSvg 另外判斷
        [".svg"]  = [],
    };

    /// <summary>SVG 的最大檢查長度——只看開頭有沒有 XML/SVG 標籤，不做完整解析。</summary>
    private const int SvgProbeLength = 1024;

    /// <summary>
    /// 檔頭是否與副檔名相符。串流會被讀取並倒回開頭，呼叫端可以接著上傳。
    /// </summary>
    public static async Task<bool> IsValidAsync(Stream stream, string fileName)
    {
        var ext = Path.GetExtension(fileName);
        if (!Signatures.TryGetValue(ext, out var candidates)) return false;

        var buffer = new byte[Math.Max(SvgProbeLength, 16)];
        var read   = await stream.ReadAsync(buffer);
        stream.Position = 0;

        if (ext.Equals(".svg", StringComparison.OrdinalIgnoreCase))
            return IsTextualSvg(buffer.AsSpan(0, read));

        if (candidates.Any(sig => read >= sig.Length && buffer.AsSpan(0, sig.Length).SequenceEqual(sig)))
        {
            // WebP 的 RIFF 檔頭與 WAV／AVI 共用，要再看 8–11 byte 是不是 WEBP
            if (ext.Equals(".webp", StringComparison.OrdinalIgnoreCase))
                return read >= 12 && buffer.AsSpan(8, 4).SequenceEqual("WEBP"u8);

            return true;
        }

        return false;
    }

    private static bool IsTextualSvg(ReadOnlySpan<byte> head)
    {
        var text = System.Text.Encoding.UTF8.GetString(head).TrimStart('﻿', ' ', '\r', '\n', '\t');
        return text.StartsWith("<?xml", StringComparison.OrdinalIgnoreCase)
            || text.StartsWith("<svg", StringComparison.OrdinalIgnoreCase);
    }
}
