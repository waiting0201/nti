namespace Nti.Api.Models.Dtos;

/// <summary>
/// 報價需求送出（04-api §3.2）。欄位與 <c>QuoteRequest</c> 一致。
/// <para>附件不在這裡——走 multipart 的檔案欄位，由 Handler 另行處理。</para>
/// </summary>
public sealed class QuoteCreateDto
{
    public string?  FullName               { get; set; }
    public string?  Company                { get; set; }
    public string?  Email                  { get; set; }
    public string?  Phone                  { get; set; }
    public int?     SolutionId             { get; set; }
    public int?     IndustryCategoryId     { get; set; }
    public string?  Quantity               { get; set; }
    public string?  SizeText               { get; set; }
    public int?     MaterialCategoryId     { get; set; }

    /// <summary>
    /// 三個下拉也可以送**代號**而不是 Id，未給 Id 時由伺服器換算。
    /// <para>
    /// 公開表單不該知道資料庫的 Id：那是內部識別、跨環境未必一致，寫進頁面等於把
    /// DB 細節外洩到 HTML。代號（<c>boxes</c>／<c>food-beverage</c>／<c>fsc</c>）是
    /// 種子檔裡穩定的公開識別，也讓 mockup 的選項讀得懂。
    /// </para>
    /// </summary>
    public string?  SolutionCode           { get; set; }
    public string?  IndustryCode           { get; set; }
    public string?  MaterialCode           { get; set; }
    public DateOnly? TargetDate            { get; set; }
    public bool     NeedsSustainableAdvice { get; set; }
    public string?  Requirement            { get; set; }

    /// <summary>隱私權同意。必填且必須為 true——伺服器端另記同意時間、IP、UA。</summary>
    public bool     Consent                { get; set; }

    /// <summary>reCAPTCHA v3 token（docs/10 §9.6）。</summary>
    public string?  RecaptchaToken         { get; set; }
}

/// <summary>報價送出的回應。<b>不回傳內部 Id</b>，只回單號（docs/10 §9.6）。</summary>
public sealed class QuoteCreatedDto
{
    public string QuoteNo { get; set; } = null!;
}

/// <summary>聯絡訊息送出（04-api §3.2）。刻意無「主旨」欄位。</summary>
public sealed class ContactCreateDto
{
    public string? Name           { get; set; }
    public string? Email          { get; set; }
    public string? Company        { get; set; }
    public string? Phone          { get; set; }
    public string? Message        { get; set; }
    public bool    Consent        { get; set; }
    public string? RecaptchaToken { get; set; }
}
