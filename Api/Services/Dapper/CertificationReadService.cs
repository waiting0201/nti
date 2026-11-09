using Dapper;
using Nti.Api.Models.Dtos;
using System.Data;

namespace Nti.Api.Services.Dapper;

public interface ICertificationReadService
{
    Task<IEnumerable<CertificationDto>> GetPublishedAsync(string lang, bool homeOnly = false);
    Task<IEnumerable<CertificationListItemDto>> GetListItemsAsync(string lang);
    Task<IEnumerable<PerformanceMetricDto>> GetPerformanceMetricsAsync(string lang);
    Task<IEnumerable<SustainabilityGoalDto>> GetSustainabilityGoalsAsync(string lang);
}

/// <summary>認證／夥伴／獎項（後台單元 08）。首頁 Proof 認證牆與 certifications 頁共用。</summary>
public sealed class CertificationReadService(IDbConnection db) : ICertificationReadService
{
    /// <summary>分類可為 NULL（未分組），故 Category 走 LEFT JOIN；i18n 主體仍是 INNER JOIN。</summary>
    private static readonly string BaseSql = $"""
        SELECT t.Id, t.CategoryId, c.Code AS CategoryCode, ci.Name AS CategoryName,
               t.LogoPath, t.LinkUrl, t.ShowOnHome, t.ShowInDetailList, t.SortOrder,
               t.CertificateNo, t.CertifiedDate, t.LastAuditDate,
               i.Name, i.ShortName, i.Description, i.LogoAlt
        FROM Certification t
        INNER JOIN CertificationI18n i ON i.CertificationId = t.Id AND i.Lang = @Lang
        LEFT  JOIN Category c ON c.Id = t.CategoryId AND c.IsDeleted = 0 AND c.IsActive = 1
        LEFT  JOIN CategoryI18n ci ON ci.CategoryId = c.Id AND ci.Lang = @Lang
        WHERE {Common.Sql.PublicFlag("t")}
          AND (t.CategoryId IS NULL OR c.Id IS NOT NULL)  -- 未分組照常顯示；掛在停用／刪除分類下的不顯示
        """;

    public async Task<IEnumerable<CertificationDto>> GetPublishedAsync(string lang, bool homeOnly = false)
    {
        var sql = homeOnly
            ? $"{BaseSql} AND t.ShowOnHome = 1 ORDER BY t.SortOrder, t.Id"
            : $"{BaseSql} ORDER BY t.SortOrder, t.Id";

        return await db.QueryAsync<CertificationDto>(sql, new { Lang = lang });
    }

    public async Task<IEnumerable<CertificationListItemDto>> GetListItemsAsync(string lang) =>
        await db.QueryAsync<CertificationListItemDto>($"""
            SELECT t.Id, t.CategoryId, c.Code AS SectionCode, ci.Name AS SectionTitle,
                   t.SortOrder, i.Title, i.Description
            FROM CertificationListItem t
            INNER JOIN CertificationListItemI18n i ON i.CertificationListItemId = t.Id AND i.Lang = @Lang
            -- 區塊停用／刪除＝整塊不顯示（與其他單元的「分類停用＝前台隱藏」一致）
            INNER JOIN Category c ON c.Id = t.CategoryId AND c.IsDeleted = 0 AND c.IsActive = 1
            INNER JOIN CategoryI18n ci ON ci.CategoryId = c.Id AND ci.Lang = @Lang
            WHERE {Common.Sql.PublicFlag("t")}
            ORDER BY c.SortOrder, c.Id, t.SortOrder, t.Id
            """, new { Lang = lang });

    public async Task<IEnumerable<PerformanceMetricDto>> GetPerformanceMetricsAsync(string lang) =>
        await db.QueryAsync<PerformanceMetricDto>($"""
            SELECT t.Id, t.SortOrder, i.Indicator, i.Period, i.Result
            FROM PerformanceMetric t
            INNER JOIN PerformanceMetricI18n i ON i.PerformanceMetricId = t.Id AND i.Lang = @Lang
            WHERE {Common.Sql.PublicFlag("t")}
            ORDER BY t.SortOrder, t.Id
            """, new { Lang = lang });

    public async Task<IEnumerable<SustainabilityGoalDto>> GetSustainabilityGoalsAsync(string lang) =>
        await db.QueryAsync<SustainabilityGoalDto>($"""
            SELECT t.Id, t.SortOrder, i.Goal, i.Timeline
            FROM SustainabilityGoal t
            INNER JOIN SustainabilityGoalI18n i ON i.SustainabilityGoalId = t.Id AND i.Lang = @Lang
            WHERE {Common.Sql.PublicFlag("t")}
            ORDER BY t.SortOrder, t.Id
            """, new { Lang = lang });
}
