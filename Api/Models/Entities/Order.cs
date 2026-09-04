namespace Nti.Api.Models.Entities;

/// <summary>
/// 訂單（docs/08 §4.13，後台單元 20；功能屬 P6）。
/// <para>資料表名為 <c>Orders</c>——<c>Order</c> 是 T-SQL 保留字。</para>
/// </summary>
public sealed class Order : IAuditable
{
    public int       Id               { get; set; }
    public string    OrderNo          { get; set; } = null!;
    public int       MemberId         { get; set; }
    public int?      QuoteRequestId   { get; set; }
    public string    Title            { get; set; } = null!;
    public string    Status           { get; set; } = "Confirmed";  // Confirmed|InProduction|Shipped|Completed|Cancelled
    public DateOnly? ExpectedShipDate { get; set; }

    public DateTime  CreatedAt { get; set; }
    public int?      CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int?      UpdatedBy { get; set; }
    public bool      IsDeleted { get; set; }
}

/// <summary>生產進度（docs/08 §4.13）。前台會員的「生產進度」時間軸資料來源。</summary>
public sealed class OrderProgress
{
    public long     Id          { get; set; }
    public int      OrderId     { get; set; }
    public string   Stage       { get; set; } = null!;  // Design|PrePress|Printing|PostPress|QC|Shipping
    public string   StageStatus { get; set; } = null!;  // Pending|Doing|Done
    public DateTime HappenedAt  { get; set; }
    public string?  Note        { get; set; }
    public DateTime CreatedAt   { get; set; }
    public int?     CreatedBy   { get; set; }
}
