using Dapper;
using Nti.Api.Common;
using Nti.Api.Models.Dtos;
using System.Data;

namespace Nti.Api.Services.Dapper;

public interface IJobReadService
{
    Task<IEnumerable<JobPostingDto>> GetPublishedAsync(string lang);
}

/// <summary>職缺（後台單元 11）。careers 頁的 Why NTI 六條是固定文案，不在這裡。</summary>
public sealed class JobReadService(IDbConnection db) : IJobReadService
{
    private static readonly string Sql = $"""
        SELECT j.Id, j.SortOrder, i.Title, i.Location, i.DescriptionHtml
        FROM JobPosting j
        INNER JOIN JobPostingI18n i ON i.JobPostingId = j.Id AND i.Lang = @Lang
        WHERE {Common.Sql.PublicFilter("j")}
        ORDER BY j.SortOrder, j.Id
        """;

    public async Task<IEnumerable<JobPostingDto>> GetPublishedAsync(string lang) =>
        await db.QueryAsync<JobPostingDto>(Sql, new { Lang = lang, Now = Clock.UtcNow });
}
