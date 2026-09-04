namespace Nti.Api.Models.Entities;

/// <summary>
/// 寄信紀錄（docs/08 §4.14）。成功與失敗都寫；寄信失敗不得讓表單提交失敗，
/// 只記 log 並允許後台重寄（docs/10 §9.4）。
/// </summary>
public sealed class EmailLog
{
    public long     Id            { get; set; }
    public string   MailType      { get; set; } = null!; // QuoteNotify|QuoteConfirm|ContactNotify|MemberVerify|PasswordReset
    public string   ToAddress     { get; set; } = null!;
    public string   Subject       { get; set; } = null!;
    public string?  RelatedEntity { get; set; }
    public int?     RelatedId     { get; set; }
    public string   Status        { get; set; } = null!; // Sent|Failed
    public string?  ErrorMessage  { get; set; }
    public DateTime SentAt        { get; set; }
}
