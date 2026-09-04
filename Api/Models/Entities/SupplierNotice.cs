namespace Nti.Api.Models.Entities;

/// <summary>供應商公告（docs/08 §4.10，後台單元 12）。分類：Policy／ESG／Quality／Logistics。</summary>
public sealed class SupplierNotice : IAuditable, IPublishable
{
    public int      Id             { get; set; }
    public int      CategoryId     { get; set; }
    public DateOnly NoticeDate     { get; set; }
    public string?  AttachmentPath { get; set; }

    public bool      IsPublished { get; set; } = true;
    public DateTime? PublishAt   { get; set; }
    public DateTime? UnpublishAt { get; set; }

    public DateTime  CreatedAt { get; set; }
    public int?      CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int?      UpdatedBy { get; set; }
    public bool      IsDeleted { get; set; }
}

public sealed class SupplierNoticeI18n : II18n
{
    public int     SupplierNoticeId { get; set; }
    public string  Lang             { get; set; } = null!;
    public string  Title            { get; set; } = null!;
    public string? BodyHtml         { get; set; }
}
