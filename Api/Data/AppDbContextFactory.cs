using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System.Text.Json;

namespace Nti.Api.Data;

/// <summary>
/// 供設計時期工具使用（<c>dotnet ef migrations add</c>）。
/// 優先讀 local.settings.json，其次環境變數，最後 fallback 到本機 SQL Server。
/// </summary>
public sealed class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var connStr = ReadFromLocalSettings()
            ?? Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
            ?? "Server=localhost,1433;Database=NTI;User Id=sa;Password=Strong@Password123;TrustServerCertificate=True;";

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlServer(connStr)
            .Options;

        return new AppDbContext(options);
    }

    private static string? ReadFromLocalSettings()
    {
        var path = Path.Combine(Directory.GetCurrentDirectory(), "local.settings.json");
        if (!File.Exists(path)) return null;

        try
        {
            using var doc = JsonDocument.Parse(File.ReadAllText(path));
            if (doc.RootElement.TryGetProperty("ConnectionStrings", out var cs)
                && cs.TryGetProperty("DefaultConnection", out var conn))
            {
                return conn.GetString();
            }
        }
        catch (JsonException) { /* 讀不到就往下 fallback */ }

        return null;
    }
}
