namespace Nti.Api.Models.Entities;

/// <summary>舊站 301 對照（docs/08 §4.11，後台單元 16）。內容遷移 P8 使用。</summary>
public sealed class Redirect : IAuditable
{
    public int    Id         { get; set; }
    public string FromPath   { get; set; } = null!;  // 一律小寫、含前導 /
    public string ToPath     { get; set; } = null!;
    public short  StatusCode { get; set; } = 301;
    public int    HitCount   { get; set; }
    public bool   IsActive   { get; set; } = true;

    public DateTime  CreatedAt { get; set; }
    public int?      CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int?      UpdatedBy { get; set; }
    public bool      IsDeleted { get; set; }
}
