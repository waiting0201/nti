namespace Nti.Api.Models.Entities;

/// <summary>常見問題（docs/08 §4.7，後台單元 06）。分類可不填——NULL 時複合 FK 自動不檢查。</summary>
public sealed class Faq : IAuditable
{
    public int  Id          { get; set; }
    public int? CategoryId  { get; set; }
    public int  SortOrder   { get; set; }
    public bool IsPublished { get; set; } = true;

    public DateTime  CreatedAt { get; set; }
    public int?      CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int?      UpdatedBy { get; set; }
    public bool      IsDeleted { get; set; }
}

public sealed class FaqI18n : II18n
{
    public int    FaqId      { get; set; }
    public string Lang       { get; set; } = null!;
    public string Question   { get; set; } = null!;
    public string AnswerHtml { get; set; } = null!;
}
