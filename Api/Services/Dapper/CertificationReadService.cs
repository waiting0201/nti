using Dapper;
using Nti.Api.Models.Dtos;
using System.Data;

namespace Nti.Api.Services.Dapper;

public interface ICertificationReadService
{
    Task<IEnumerable<CertificationDto>> GetPublishedAsync(string lang, bool homeOnly = false);
}

/// <summary>認證／夥伴／獎項（後台單元 08）。首頁 Proof 認證牆與 certifications 頁共用。</summary>
public sealed class CertificationReadService(IDbConnection db) : ICertificationReadService
{
    /// <summary>分類可為 NULL（未分組），故 Category 走 LEFT JOIN；i18n 主體仍是 INNER JOIN。</summary>
    private static readonly string BaseSql = $"""
        SELECT t.Id, t.CategoryId, c.Code AS CategoryCode, ci.Name AS CategoryName,
               t.LogoPath, t.LinkUrl, t.ShowOnHome, t.SortOrder,
               i.Name, i.Description, i.LogoAlt
        FROM Certification t
        INNER JOIN CertificationI18n i ON i.CertificationId = t.Id AND i.Lang = @Lang
        LEFT  JOIN Category c ON c.Id = t.CategoryId AND c.IsDeleted = 0
        LEFT  JOIN CategoryI18n ci ON ci.CategoryId = c.Id AND ci.Lang = @Lang
        WHERE {Common.Sql.PublicFlag("t")}
        """;

    public async Task<IEnumerable<CertificationDto>> GetPublishedAsync(string lang, bool homeOnly = false)
    {
        var sql = homeOnly
            ? $"{BaseSql} AND t.ShowOnHome = 1 ORDER BY t.SortOrder, t.Id"
            : $"{BaseSql} ORDER BY t.SortOrder, t.Id";

        return await db.QueryAsync<CertificationDto>(sql, new { Lang = lang });
    }
}
