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
    IAuditService         audit,
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

    // ── 認證與表單（04-api §3.2、§3.3）────────────────────────────────
    AuthHandler           auth,
    MemberHandler         members,
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
    AdminMemberHandler           adminMembers,
    AdminOrderHandler            adminOrders,
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
            // 前台會員：只收 nti-web audience 的 token；後台 token 亦不得存取
            var principal = jwt.ValidateRequest(req, TokenAudiences.Web)
                ?? throw AppException.Unauthorized("缺少或無效的會員憑證。");

            req.HttpContext.User = principal;
        }
        else if (req.Headers.ContainsKey("Authorization"))
        {
            // 公開路由的選擇性登入：有帶會員 token 就掛上去，沒帶或無效也照樣放行。
            // POST /supplier/downloads/{id}/hit 需要這個——多數下載不需登入，
            // 只有 RequireLogin = 1 的受控文件要，那個判斷在 Handler 裡（04-api §3.1）。
            var principal = jwt.ValidateRequest(req, TokenAudiences.Web);
            if (principal is not null) req.HttpContext.User = principal;
        }

        var result = await RoutePublicAsync(req, method, segments)
            ?? await RouteAdminAsync(req, method, segments)
            ?? NotFound(method, route);

        // 稽核在分派完成後統一寫（docs/10 §9.3），不由各 Handler 各寫一次——
        // 後者只要有一支忘了寫就會留下查不到的操作，而且不會有任何症狀。
        // 走到這裡代表沒有拋例外；拋了的話 middleware 會接手，那些請求本來就不該記成已完成。
        await WriteAuditIfNeededAsync(req, method, segments, result);

        return result;
    }

    /// <summary>
    /// 是否需要寫 AuditLog：<c>/admin/*</c> 的寫入操作，外加三個「唯讀但必須留痕」的動作
    /// （04-api §3.4）——匯出報價 CSV、下載報價附件、重寄信件。
    /// 這三個都會把資料帶出系統或再送出去一次，誰做的必須查得到。
    /// </summary>
    private static bool ShouldAudit(string method, string[] segments)
    {
        if (segments is not ["admin", ..]) return false;

        if (method is "POST" or "PUT" or "PATCH" or "DELETE") return true;

        return (method, segments) is
            ("GET", ["admin", "quote", "export"]) or
            ("GET", ["admin", "quote", _, "attachments", _]);
    }

    private async Task WriteAuditIfNeededAsync(
        HttpRequest req, string method, string[] segments, IActionResult result)
    {
        if (!ShouldAudit(method, segments)) return;

        // 找不到路由的 404 不記：那不是一次操作
        if (result is NotFoundObjectResult) return;

        var action = (method, segments) switch
        {
            ("POST", ["admin", "audit", "emails", _, "resend"]) => "Resend",
            ("GET",  ["admin", "quote", "export"])              => "Export",
            ("GET",  _)                                         => "Download",
            ("PATCH", [.., "publish"])                          => "Publish",
            ("POST", _)                                         => "Create",
            ("DELETE", _)                                       => "Delete",
            _                                                   => "Update",
        };

        // EntityName 用單元代號（docs/09 §2），與權限碼同一組字串，查詢時對得起來
        var entityName = segments.Length > 1 ? segments[1] : "admin";
        var entityId   = segments.Length > 2 && int.TryParse(segments[2], out var id) ? id : (int?)null;

        await audit.WriteAsync(
            RequestContext.UserId(req.HttpContext.User),
            action, entityName, entityId, RequestContext.SourceIp(req));
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
