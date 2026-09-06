using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Nti.Api.Common;
using Nti.Api.Handlers;
using Nti.Api.Handlers.Admin;
using Nti.Api.Services;
using System.Security.Claims;

namespace Nti.Api.Routing;

/// <summary>
/// 集中式路由分派器（docs/10 §3、§7.5）。
/// <para>
/// 收 (method, route) → 拆 segments → 驗 JWT → 檢查權限 → C# list pattern 分派到 Handler。
/// 路由表拆成兩個 partial：<c>AppRouter.Public.cs</c>（前台唯讀＋表單）與
/// <c>AppRouter.Admin.cs</c>（後台 24 單元＋權限對照）。
/// </para>
/// </summary>
public sealed partial class AppRouter(
    ILogger<AppRouter>    logger,
    IJwtService           jwt,
    HealthHandler         health,
    ContentHandler        content,
    SolutionHandler       solutions,
    ProjectHandler        projects,
    NewsHandler           news,
    VlogHandler           vlogs,
    FaqHandler            faqs,
    TrendHandler          trends,
    CertificationHandler  certifications,
    ClientHandler         clients,
    FacilityHandler       facility,
    JobHandler            jobs,
    SupplierHandler       supplier,
    PageHandler           pages,
    SettingHandler        settings,
    CategoryHandler       categories,
    FileHandler           files,

    // ── 認證與表單（04-api §3.2）──────────────────────────────────────
    AuthHandler           auth,
    FormHandler           forms,

    // ── 後台 24 個單元（04-api §3.4）──────────────────────────────────
    AdminDashboardHandler        dashboard,
    AdminHomeBannerHandler       adminBanners,
    AdminSolutionHandler         adminSolutions,
    AdminSolutionItemHandler     adminSolutionItems,
    AdminProjectHandler          adminProjects,
    AdminNewsHandler             adminNews,
    AdminVlogHandler             adminVlogs,
    AdminFaqHandler              adminFaqs,
    AdminTrendHandler            adminTrends,
    AdminCertificationHandler    adminCertifications,
    AdminClientHandler           adminClients,
    AdminFacilityHandler         adminFacility,
    AdminJobHandler              adminJobs,
    AdminSupplierNoticeHandler   adminSupplierNotices,
    AdminSupplierSpecHandler     adminSupplierSpecs,
    AdminSupplierDownloadHandler adminSupplierDownloads,
    AdminPageHandler             adminPages,
    AdminRedirectHandler         adminRedirects,
    AdminFormHandler             adminForms,
    AdminSettingHandler          adminSettings,
    AdminCategoryHandler         adminCategories,
    AdminAccountHandler          adminAccounts,
    AdminAuditHandler            adminAudits,
    AdminMediaHandler            adminMedia)
{
    /// <summary>
    /// <see cref="GetRequiredPermission"/> 的預設回傳值：<b>未列在權限表的 /admin/* 一律拒絕</b>。
    /// <para>
    /// 這是 NTI 相對 Jabez 的修正——Jabez 預設 null（登入即可），新增端點忘了補權限表就會靜默放行。
    /// 這裡改成新端點忘了補就直接 403，錯誤會在開發時就浮現。
    /// </para>
    /// </summary>
    private const string DenySentinel = "__DENY__";

    public async Task<IActionResult> RouteAsync(HttpRequest req, string route)
    {
        var method   = req.Method.ToUpperInvariant();
        var segments = route.Trim('/').Split('/', StringSplitOptions.RemoveEmptyEntries);

        logger.LogDebug("Router: method={Method} route={Route}", method, route);

        // CORS preflight：實際的 allow-list 在平台層（docs/10 §9.7），程式內只放行 OPTIONS
        if (method == "OPTIONS") return new OkResult();

        // HEAD 一律當 GET 走：CDN 與監控會用 HEAD 探測，不對應的話它們拿到的是 404
        // （ASP.NET Core 會自己把 body 丟掉，只回標頭）
        if (method == "HEAD") method = "GET";

        if (segments is ["admin", ..] || IsAdminAuthRoute(method, segments))
        {
            // 後台：只收 nti-admin audience 的 token；會員 token 打 /admin/* 一律擋下
            var principal = jwt.ValidateRequest(req, TokenAudiences.Admin)
                ?? throw AppException.Unauthorized("缺少或無效的後台憑證。");

            // /auth/admin/change-password 不需權限碼（見 IsAdminAuthRoute 的說明）
            if (segments is ["admin", ..])
                RequirePermission(principal, GetRequiredPermission(method, segments));

            req.HttpContext.User = principal;
        }
        else if (!IsPublicRoute(method, segments))
        {
            // 前台全站匿名（沒有會員系統），白名單就是前台的完整範圍。
            // 沒登記在白名單的非 /admin/* 路由一律當成不存在——新端點忘了補白名單時
            // 會在開發階段直接 404，不會靜悄悄地變成公開端點（docs/10 §7.6）。
            return NotFound(method, route);
        }

        return await RoutePublicAsync(req, method, segments)
            ?? await RouteAdminAsync(req, method, segments)
            ?? NotFound(method, route);
    }

    /// <summary>檢查 JWT 的 permissions claim；<c>is_superadmin</c> 自動通過（docs/10 §7.5）。</summary>
    private static void RequirePermission(ClaimsPrincipal principal, string? permissionCode)
    {
        if (permissionCode is null) return;

        if (permissionCode == DenySentinel)
            throw AppException.Forbidden("此端點未登記於權限表。");

        if (principal.FindFirst("is_superadmin")?.Value == "true") return;

        if (!principal.FindAll("permissions").Any(c => c.Value == permissionCode))
            throw AppException.Forbidden($"缺少所需權限：{permissionCode}");
    }

    private static IActionResult NotFound(string method, string route) =>
        new NotFoundObjectResult(ApiResponse.Fail(
            ErrorCodes.NotFound,
            "端點不存在。",
            $"Route '/api/v1/{route}' with method {method} does not exist."));
}
