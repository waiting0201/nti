using System.IO.Compression;

namespace Nti.Api.Common;

/// <summary>
/// 報價附件 ZIP 的內容檢查——<b>只讀中央目錄，不解壓縮</b>。
/// <para>
/// 檔頭驗證只證明「這是一個 zip」，擋不住「zip 裡裝的是 .exe」。報價附件本期不做病毒掃描
/// （docs/09 §17），下載的人是超管、會在自己的電腦上解開，所以至少要把最常見的
/// 投遞手法擋在門口：壓縮檔裡夾執行檔／腳本／捷徑、再包一層壓縮檔躲檢查、壓縮炸彈。
/// </para>
/// <para>
/// 這<b>不是</b>防毒：PDF／AI／PSD 內嵌的惡意內容、Office 巨集以外的漏洞利用都擋不到。
/// 它擋的是「不需要任何漏洞、只要對方點兩下」的那一類。
/// </para>
/// </summary>
public static class ZipInspector
{
    /// <summary>
    /// 壓縮檔內不收的副檔名：點兩下就會執行（Windows／macOS），或是巢狀壓縮檔
    /// （裡面的東西這裡看不到，等於繞過整個檢查）。設計稿用不到其中任何一種。
    /// </summary>
    private static readonly HashSet<string> BlockedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        // Windows 可執行與安裝檔
        ".exe", ".dll", ".com", ".scr", ".pif", ".cpl", ".msi", ".msp", ".msc", ".sys", ".drv",
        // 腳本與命令
        ".bat", ".cmd", ".ps1", ".psm1", ".vbs", ".vbe", ".js", ".jse", ".wsf", ".wsh", ".hta", ".sh", ".command",
        // 捷徑與會被系統直接解讀的設定
        ".lnk", ".url", ".scf", ".reg", ".inf", ".library-ms", ".settingcontent-ms",
        // 帶巨集的 Office（設計稿不會是這些）
        ".docm", ".xlsm", ".pptm", ".dotm", ".xltm",
        // macOS／跨平台
        ".app", ".pkg", ".dmg", ".jar",
        // 巢狀壓縮檔與磁碟映像：內容這裡看不到
        ".zip", ".rar", ".7z", ".tar", ".gz", ".tgz", ".bz2", ".xz", ".cab", ".iso", ".img", ".vhd", ".vhdx",
    };

    /// <summary>單一壓縮檔的項目上限。設計稿資料夾幾百個檔已經很多。</summary>
    private const int MaxEntries = 2000;

    /// <summary>解壓後合計上限 1GB：20MB 的 zip 正常解開不會到這個量級。</summary>
    private const long MaxTotalUncompressedBytes = 1024L * 1024 * 1024;

    /// <summary>
    /// 單一項目的壓縮比上限。點陣圖、PSD 這類素材壓縮比通常個位數到幾十；
    /// 壓縮炸彈是上千倍。只對解開後超過 10MB 的項目套用，免得小文字檔誤判。
    /// </summary>
    private const double MaxCompressionRatio = 200;
    private const long RatioCheckMinBytes = 10L * 1024 * 1024;

    /// <summary>
    /// 檢查通過回 null；否則回給訪客看的原因。串流會倒回開頭，呼叫端可以接著上傳。
    /// <para>
    /// 項目的大小取自中央目錄，那是壓縮檔自己宣稱的數字，可以偽造。
    /// 因為這裡從不解壓縮，偽造它也換不到什麼——日後若要在伺服器端解開，必須另外限制實際讀出的位元組數。
    /// </para>
    /// </summary>
    public static string? Inspect(Stream stream, string displayName)
    {
        try
        {
            using var zip = new ZipArchive(stream, ZipArchiveMode.Read, leaveOpen: true);

            if (zip.Entries.Count > MaxEntries)
                return $"{displayName} 內含檔案過多（上限 {MaxEntries} 個）。";

            long total = 0;
            foreach (var entry in zip.Entries)
            {
                var name = entry.FullName.Replace('\\', '/');

                // Zip Slip：解壓工具若沒防，會把檔案寫到目標資料夾之外
                if (name.StartsWith('/') || (name.Length > 1 && name[1] == ':')
                    || name.Split('/').Any(segment => segment == ".."))
                    return $"{displayName} 內含不合法的路徑。";

                // 資料夾項目（名稱以 / 結尾）沒有副檔名問題
                if (name.EndsWith('/')) continue;

                if (BlockedExtensions.Contains(Path.GetExtension(name)))
                    return $"{displayName} 內含不接受的檔案類型（{Path.GetFileName(name)}）。壓縮檔內請勿放執行檔、腳本、捷徑或其他壓縮檔。";

                total += entry.Length;
                if (total > MaxTotalUncompressedBytes)
                    return $"{displayName} 解壓縮後的大小異常。";

                if (entry.Length > RatioCheckMinBytes
                    && entry.CompressedLength > 0
                    && (double)entry.Length / entry.CompressedLength > MaxCompressionRatio)
                    return $"{displayName} 的壓縮比異常。";
            }

            return null;
        }
        catch (InvalidDataException)
        {
            return $"{displayName} 不是有效的 ZIP 檔，或檔案已損毀。";
        }
        finally
        {
            stream.Position = 0;
        }
    }
}
