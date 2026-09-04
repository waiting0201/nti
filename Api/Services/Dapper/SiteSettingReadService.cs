using Dapper;
using Nti.Api.Models.Dtos;
using System.Data;

namespace Nti.Api.Services.Dapper;

public interface ISiteSettingReadService
{
    Task<IEnumerable<SiteSettingDto>> GetPublicAsync(string lang);
}

/// <summary>全站設定（後台單元 21）。</summary>
public sealed class SiteSettingReadService(IDbConnection db) : ISiteSettingReadService
{
    /// <summary>
    /// 值在 SQL 內就依語系解析完，前端不需要知道 IsLocalized 與 ValueZh/ValueEn 的存在。
    /// <para>
    /// ⚠ <c>GroupName = 'Mail'</c> 是信件收件者等內部設定，<b>一律排除</b>——
    /// 這支是公開端點，內部信箱不該出現在任何人都能打的回應裡（04-api §3.1）。
    /// </para>
    /// </summary>
    private const string Sql = """
        SELECT s.SettingKey, s.GroupName, s.ValueType,
               CASE WHEN s.IsLocalized = 1 AND @Lang = 'en' THEN s.ValueEn ELSE s.ValueZh END AS Value
        FROM SiteSetting s
        WHERE s.GroupName <> 'Mail'
        ORDER BY s.GroupName, s.SortOrder, s.SettingKey
        """;

    public async Task<IEnumerable<SiteSettingDto>> GetPublicAsync(string lang) =>
        await db.QueryAsync<SiteSettingDto>(Sql, new { Lang = lang });
}
