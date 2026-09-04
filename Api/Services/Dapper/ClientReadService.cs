using Dapper;
using Nti.Api.Models.Dtos;
using System.Data;

namespace Nti.Api.Services.Dapper;

public interface IClientReadService
{
    Task<IEnumerable<ClientLogoDto>> GetPublishedAsync();
}

/// <summary>客戶 logo 輪播（後台單元 09）。品牌名不翻譯，故沒有 lang 參數。</summary>
public sealed class ClientReadService(IDbConnection db) : IClientReadService
{
    private static readonly string Sql = $"""
        SELECT c.Id, c.Name, c.LogoPath, c.LinkUrl, c.SortOrder
        FROM ClientLogo c
        WHERE {Common.Sql.PublicFlag("c")}
        ORDER BY c.SortOrder, c.Id
        """;

    public async Task<IEnumerable<ClientLogoDto>> GetPublishedAsync() =>
        await db.QueryAsync<ClientLogoDto>(Sql);
}
