using SkiaSharp;

namespace Nti.Api.Common;

/// <summary>
/// 後台圖片上傳時的縮圖＋轉 WebP（docs/09 §3）。
/// <para>
/// 欄位旁的建議尺寸只是提示，客戶照樣會把 10667×4000、3.3MB 的 PNG 原檔丟進 Banner
/// （2026-10-06 首頁 LCP 62 秒的元凶）。後端收下來就先壓：超過該單元建議寬度就等比縮小，
/// JPG／PNG 一律轉成 WebP。不保留原檔——沒有任何資料列引用它，夜間的孤兒檔清除也會把它刪掉。
/// </para>
/// </summary>
public static class ImageOptimizer
{
    /// <summary>WebP 品質。與 2026-09-09 mockup 素材批次轉檔用的 q82 一致。</summary>
    public const int Quality = 82;

    public sealed record Optimized(byte[] Content, int Width, int Height);

    /// <summary>
    /// 回傳壓好的 WebP；回 <c>null</c> 代表沿用原檔：SVG、動圖、解不開的檔，
    /// 或本來就是 WebP 且不用縮（重新編碼只會掉畫質），或壓完反而比較大。
    /// 串流讀完不倒回，呼叫端拿到 null 時要自己 <c>Seek(0)</c>。
    /// </summary>
    public static Optimized? Optimize(Stream input, string extension, int maxWidth)
    {
        if (extension.Equals(".svg", StringComparison.OrdinalIgnoreCase)) return null;

        using var data  = SKData.Create(input);
        using var codec = data is null ? null : SKCodec.Create(data);
        if (codec is null || codec.FrameCount > 1) return null;

        using var decoded = SKBitmap.Decode(codec);
        if (decoded is null) return null;

        // 手機拍的 JPG 靠 EXIF 標方向；轉 WebP 會丟掉 EXIF，不先轉正就會躺著
        var origin  = codec.EncodedOrigin;
        var swapsWh = origin is SKEncodedOrigin.LeftTop or SKEncodedOrigin.RightTop
                             or SKEncodedOrigin.RightBottom or SKEncodedOrigin.LeftBottom;
        var shownWidth = swapsWh ? decoded.Height : decoded.Width;

        var isWebp = extension.Equals(".webp", StringComparison.OrdinalIgnoreCase);
        if (shownWidth <= maxWidth && isWebp && origin == SKEncodedOrigin.TopLeft) return null;

        // 先縮再轉向：大圖轉向要多開一張同尺寸的點陣圖，10667×4000 就是多 170MB
        var scale = shownWidth > maxWidth ? (double)maxWidth / shownWidth : 1d;
        using var resized = scale < 1 ? Resize(decoded, scale) : null;
        var source = resized ?? decoded;

        using var oriented = origin == SKEncodedOrigin.TopLeft ? null : Orient(source, origin);
        var final = oriented ?? source;

        using var encoded = final.Encode(SKEncodedImageFormat.Webp, Quality);
        if (encoded is null) return null;

        // 沒縮、只是換格式卻變大（例如色數很少的小 PNG）就不值得換
        if (scale == 1 && encoded.Size >= input.Length) return null;

        return new Optimized(encoded.ToArray(), final.Width, final.Height);
    }

    private static SKBitmap Resize(SKBitmap src, double scale)
    {
        var info = new SKImageInfo(
            Math.Max(1, (int)Math.Round(src.Width * scale)),
            Math.Max(1, (int)Math.Round(src.Height * scale)),
            src.ColorType, src.AlphaType);

        // 縮小倍率可能到 4 倍以上，雙三次只看 4×4 鄰點會出鋸齒；mipmap 先降到相近層再取樣
        return src.Resize(info, new SKSamplingOptions(SKFilterMode.Linear, SKMipmapMode.Linear))
            ?? throw new InvalidOperationException("縮圖失敗。");
    }

    /// <summary>依 EXIF Orientation（1–8）把像素轉正。</summary>
    private static SKBitmap Orient(SKBitmap src, SKEncodedOrigin origin)
    {
        float w = src.Width, h = src.Height;

        // x' = ScaleX·x + SkewX·y + TransX；y' = SkewY·x + ScaleY·y + TransY
        var (matrix, swapsWh) = origin switch
        {
            SKEncodedOrigin.TopRight    => (new SKMatrix(-1, 0, w, 0, 1, 0, 0, 0, 1), false), // 水平翻轉
            SKEncodedOrigin.BottomRight => (new SKMatrix(-1, 0, w, 0, -1, h, 0, 0, 1), false), // 180°
            SKEncodedOrigin.BottomLeft  => (new SKMatrix(1, 0, 0, 0, -1, h, 0, 0, 1), false), // 垂直翻轉
            SKEncodedOrigin.LeftTop     => (new SKMatrix(0, 1, 0, 1, 0, 0, 0, 0, 1), true),   // 轉置
            SKEncodedOrigin.RightTop    => (new SKMatrix(0, -1, h, 1, 0, 0, 0, 0, 1), true),  // 順時針 90°
            SKEncodedOrigin.RightBottom => (new SKMatrix(0, -1, h, -1, 0, w, 0, 0, 1), true), // 反轉置
            SKEncodedOrigin.LeftBottom  => (new SKMatrix(0, 1, 0, -1, 0, w, 0, 0, 1), true),  // 逆時針 90°
            _ => (SKMatrix.Identity, false),
        };

        var dst = new SKBitmap(new SKImageInfo(
            swapsWh ? src.Height : src.Width, swapsWh ? src.Width : src.Height, src.ColorType, src.AlphaType));

        using var canvas = new SKCanvas(dst);
        // 新配置的點陣圖內容未初始化，去背 PNG 的透明處會疊在垃圾像素上
        canvas.Clear(SKColors.Transparent);
        canvas.SetMatrix(matrix);
        // 只有 90° 倍數的旋轉與翻轉，像素一對一，不需要內插
        canvas.DrawBitmap(src, 0, 0, new SKSamplingOptions(SKFilterMode.Nearest));
        return dst;
    }
}
