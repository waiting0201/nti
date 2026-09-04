using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Nti.Api.Common;

namespace Nti.Api.Routing;

/// <summary>
/// 後台路由表與權限對照（04-api §3.4、docs/09 §2 的 24 個單元）。
/// <para>
/// <see cref="GetRequiredPermission"/> <b>預設拒絕</b>：新增 <c>/admin/*</c> 端點若忘了在這裡登記，
/// 會直接 403 而不是靜默放行。路徑中的 <c>{unit}</c> 一律用 docs/09 §2 的單元代號原字串
/// （單數、含連字號），與權限碼 <c>{單元代號}.{action}</c> 逐字對應，不做單複數轉換。
/// </para>
/// </summary>
public sealed partial class AppRouter
{
    /// <summary>
    /// 內容單元 01–14：CRUD 形狀一致，權限碼也一致（<c>{unit}.view|edit|publish|delete</c>）。
    /// <para>
    /// 逐單元把同一組規則抄 14 次，遲早會有一行把 <c>news.delete</c> 寫成 <c>news.edit</c>，
    /// 而那種錯誤不會有任何症狀——只會讓某個角色多出它不該有的權限。
    /// 這裡改成用同一套規則展開，單元代號逐字對應 <see cref="PermissionCodes"/>。
    /// </para>
    /// </summary>
    private static readonly HashSet<string> ContentUnits = new(StringComparer.Ordinal)
    {
        "home-banner", "solution", "project", "news", "vlog", "faq", "trend",
        "certification", "client", "facility", "job",
        "supplier-notice", "supplier-spec", "supplier-download",
    };

    /// <summary>依 method + segments 決定所需權限碼；null = 登入即可，DenySentinel = 拒絕。</summary>
    private static string? GetRequiredPermission(string method, string[] segments) =>
        (method, segments) switch
        {
            // ── 00 dashboard ─────────────────────────────────────────────
            ("GET", ["admin", "dashboard"]) => PermissionCodes.DashboardView,

            // ── 01–14 內容單元（含 solution 的品項卡）────────────────────
            (_, ["admin", var unit, ..]) when ContentUnits.Contains(unit) =>
                ContentPermission(method, unit, segments),

            // ── 15 page：29 筆固定頁不可增刪，故無 delete ────────────────
            ("POST",           ["admin", "page", "upload"]) => PermissionCodes.PageEdit,
            ("GET",            ["admin", "page", ..])       => PermissionCodes.PageView,
            ("PUT" or "PATCH", ["admin", "page", _])        => PermissionCodes.PageEdit,

            // ── 16 redirect ──────────────────────────────────────────────
            ("GET",            ["admin", "redirect", "export"]) => PermissionCodes.RedirectExport,
            ("POST",           ["admin", "redirect", "import"]) => PermissionCodes.RedirectExport,
            ("GET",            ["admin", "redirect", ..])       => PermissionCodes.RedirectView,
            ("POST",           ["admin", "redirect"])           => PermissionCodes.RedirectEdit,
            ("PUT" or "PATCH", ["admin", "redirect", _])        => PermissionCodes.RedirectEdit,
            ("DELETE",         ["admin", "redirect", _])        => PermissionCodes.RedirectDelete,

            // ── 17 quote：匯出與附件下載僅超管（矩陣第 7 列）─────────────
            ("GET",            ["admin", "quote", "export"])              => PermissionCodes.QuoteExport,
            ("GET",            ["admin", "quote", _, "attachments", _])   => PermissionCodes.QuoteDownload,
            ("GET",            ["admin", "quote", ..])                    => PermissionCodes.QuoteView,
            ("PUT" or "PATCH", ["admin", "quote", _])                     => PermissionCodes.QuoteEdit,

            // ── 18 contact ───────────────────────────────────────────────
            ("GET",            ["admin", "contact", ..]) => PermissionCodes.ContactView,
            ("PUT" or "PATCH", ["admin", "contact", _])  => PermissionCodes.ContactEdit,

            // ── 19 member ────────────────────────────────────────────────
            ("GET",            ["admin", "member", ..])                  => PermissionCodes.MemberView,
            ("PUT" or "PATCH", ["admin", "member", _])                   => PermissionCodes.MemberEdit,
            ("POST",           ["admin", "member", _, "resend-verify"])  => PermissionCodes.MemberEdit,

            // ── 20 order ─────────────────────────────────────────────────
            ("GET",            ["admin", "order", ..])             => PermissionCodes.OrderView,
            ("POST",           ["admin", "order"])                 => PermissionCodes.OrderEdit,
            ("PUT" or "PATCH", ["admin", "order", _])              => PermissionCodes.OrderEdit,
            ("POST",           ["admin", "order", _, "progress"])  => PermissionCodes.OrderEdit,

            // ── 21 setting ───────────────────────────────────────────────
            ("POST",           ["admin", "setting", "upload"]) => PermissionCodes.SettingEdit,
            ("GET",            ["admin", "setting"])           => PermissionCodes.SettingView,
            ("PUT" or "PATCH", ["admin", "setting"])           => PermissionCodes.SettingEdit,

            // ── 22 category ──────────────────────────────────────────────
            ("GET",            ["admin", "category", ..]) => PermissionCodes.CategoryView,
            ("POST",           ["admin", "category"])     => PermissionCodes.CategoryEdit,
            ("PUT" or "PATCH", ["admin", "category", _])  => PermissionCodes.CategoryEdit,
            ("DELETE",         ["admin", "category", _])  => PermissionCodes.CategoryDelete,

            // ── 23 admin（管理員與角色）──────────────────────────────────
            ("GET",            ["admin", "admin", ..]) => PermissionCodes.AdminView,
            ("POST",           ["admin", "admin"])     => PermissionCodes.AdminEdit,
            ("PUT" or "PATCH", ["admin", "admin", _])  => PermissionCodes.AdminEdit,
            ("DELETE",         ["admin", "admin", _])  => PermissionCodes.AdminDelete,

            // ── 24 audit ─────────────────────────────────────────────────
            ("POST", ["admin", "audit", "emails", _, "resend"]) => PermissionCodes.AuditResend,
            ("GET",  ["admin", "audit", ..])                    => PermissionCodes.AuditView,

            // ★ 未列出的 /admin/* 一律拒絕
            _ => DenySentinel,
        };

    /// <summary>內容單元的權限規則：檢視／編輯／上下架／刪除。</summary>
    private static string ContentPermission(string method, string unit, string[] segments) =>
        (method, segments) switch
        {
            ("GET", _)                                  => $"{unit}.view",
            ("PATCH", [.., "publish"])                  => $"{unit}.publish",
            ("POST" or "PUT" or "PATCH", _)             => $"{unit}.edit",
            ("DELETE", _)                               => $"{unit}.delete",
            _                                           => DenySentinel,
        };

    /// <summary>後台分派；無對應路由回 null。</summary>
    private async Task<IActionResult?> RouteAdminAsync(HttpRequest req, string method, string[] segments) =>
        (method, segments) switch
        {
            // ── 00 dashboard ─────────────────────────────────────────────
            ("GET", ["admin", "dashboard"]) => await dashboard.GetAsync(req),

            // ── 01 home-banner ───────────────────────────────────────────
            _ when segments is ["admin", "home-banner", ..] => await Content(adminBanners, req, method, segments),
            // ── 02 solution（固定 4 筆：不開放新增與刪除）────────────────
            _ when segments is ["admin", "solution", "item", ..] =>
                await Content(adminSolutionItems, req, method, segments[1..]),
            _ when segments is ["admin", "solution", ..] =>
                await Content(adminSolutions, req, method, segments, allowCreate: false, allowDelete: false),
            // ── 03–14 ────────────────────────────────────────────────────
            _ when segments is ["admin", "project", ..]           => await Content(adminProjects, req, method, segments),
            _ when segments is ["admin", "news", ..]              => await Content(adminNews, req, method, segments),
            _ when segments is ["admin", "vlog", ..]              => await Content(adminVlogs, req, method, segments),
            _ when segments is ["admin", "faq", ..]               => await Content(adminFaqs, req, method, segments),
            _ when segments is ["admin", "trend", ..]             => await Content(adminTrends, req, method, segments),
            _ when segments is ["admin", "certification", ..]     => await Content(adminCertifications, req, method, segments),
            _ when segments is ["admin", "facility", ..]          => await Content(adminFacility, req, method, segments),
            _ when segments is ["admin", "job", ..]               => await Content(adminJobs, req, method, segments),
            _ when segments is ["admin", "supplier-notice", ..]   => await Content(adminSupplierNotices, req, method, segments),
            _ when segments is ["admin", "supplier-spec", ..]     => await Content(adminSupplierSpecs, req, method, segments),
            _ when segments is ["admin", "supplier-download", ..] => await Content(adminSupplierDownloads, req, method, segments),

            // ── 09 client：唯一沒有 i18n 側表的內容單元，另走一套 ────────
            ("GET",            ["admin", "client"])          => await adminClients.GetListAsync(req),
            ("GET",            ["admin", "client", var id])  => await adminClients.GetByIdAsync(req, id),
            ("POST",           ["admin", "client"])          => await adminClients.CreateAsync(req),
            ("PUT" or "PATCH", ["admin", "client", var id])  => await adminClients.UpdateAsync(req, id),
            ("DELETE",         ["admin", "client", var id])  => await adminClients.DeleteAsync(req, id),
            ("POST",           ["admin", "client", "upload"]) => await adminMedia.UploadAsync(req),

            // ── 15 page ──────────────────────────────────────────────────
            ("POST",           ["admin", "page", "upload"])  => await adminMedia.UploadAsync(req),
            ("GET",            ["admin", "page"])           => await adminPages.GetListAsync(req),
            ("GET",            ["admin", "page", var key])  => await adminPages.GetByKeyAsync(req, key),
            ("PUT" or "PATCH", ["admin", "page", var key])  => await adminPages.UpdateAsync(req, key),

            // ── 16 redirect ──────────────────────────────────────────────
            ("GET",            ["admin", "redirect", "export"]) => await adminRedirects.ExportAsync(req),
            ("POST",           ["admin", "redirect", "import"]) => await adminRedirects.ImportAsync(req),
            ("GET",            ["admin", "redirect"])           => await adminRedirects.GetListAsync(req),
            ("POST",           ["admin", "redirect"])           => await adminRedirects.CreateAsync(req),
            ("PUT" or "PATCH", ["admin", "redirect", var id])   => await adminRedirects.UpdateAsync(req, id),
            ("DELETE",         ["admin", "redirect", var id])   => await adminRedirects.DeleteAsync(req, id),

            // ── 17 quote ─────────────────────────────────────────────────
            ("GET",            ["admin", "quote", "export"])                 => await adminForms.ExportQuotesAsync(req),
            ("GET",            ["admin", "quote", var id, "attachments", var attId])
                                                                             => await adminForms.DownloadAttachmentAsync(req, id, attId),
            ("GET",            ["admin", "quote"])                           => await adminForms.GetQuotesAsync(req),
            ("GET",            ["admin", "quote", var id])                   => await adminForms.GetQuoteAsync(req, id),
            ("PUT" or "PATCH", ["admin", "quote", var id])                   => await adminForms.UpdateQuoteAsync(req, id),

            // ── 18 contact ───────────────────────────────────────────────
            ("GET",            ["admin", "contact"])          => await adminForms.GetContactsAsync(req),
            ("GET",            ["admin", "contact", var id])  => await adminForms.GetContactAsync(req, id),
            ("PUT" or "PATCH", ["admin", "contact", var id])  => await adminForms.UpdateContactAsync(req, id),

            // ── 19 member ────────────────────────────────────────────────
            ("GET",            ["admin", "member"])                        => await adminMembers.GetMembersAsync(req),
            ("GET",            ["admin", "member", var id])                => await adminMembers.GetMemberAsync(req, id),
            ("PUT" or "PATCH", ["admin", "member", var id])                => await adminMembers.UpdateMemberAsync(req, id),
            ("POST",           ["admin", "member", var id, "resend-verify"]) => await adminMembers.ResendVerifyAsync(req, id),

            // ── 20 order ─────────────────────────────────────────────────
            ("GET",            ["admin", "order"])                     => await adminOrders.GetListAsync(req),
            ("GET",            ["admin", "order", var id])             => await adminOrders.GetByIdAsync(req, id),
            ("POST",           ["admin", "order"])                     => await adminOrders.CreateAsync(req),
            ("PUT" or "PATCH", ["admin", "order", var id])             => await adminOrders.UpdateAsync(req, id),
            ("POST",           ["admin", "order", var id, "progress"]) => await adminOrders.AddProgressAsync(req, id),

            // ── 21 setting ───────────────────────────────────────────────
            ("POST",           ["admin", "setting", "upload"]) => await adminMedia.UploadAsync(req),
            ("GET",            ["admin", "setting"]) => await adminSettings.GetListAsync(req),
            ("PUT" or "PATCH", ["admin", "setting"]) => await adminSettings.UpdateAsync(req),

            // ── 22 category ──────────────────────────────────────────────
            ("GET",            ["admin", "category"])          => await adminCategories.GetListAsync(req),
            ("POST",           ["admin", "category"])          => await adminCategories.CreateAsync(req),
            ("PUT" or "PATCH", ["admin", "category", var id])  => await adminCategories.UpdateAsync(req, id),
            ("DELETE",         ["admin", "category", var id])  => await adminCategories.DeleteAsync(req, id),

            // ── 23 admin ─────────────────────────────────────────────────
            ("GET",            ["admin", "admin", "roles"])   => await adminAccounts.GetRolesAsync(req),
            ("GET",            ["admin", "admin"])            => await adminAccounts.GetListAsync(req),
            ("POST",           ["admin", "admin"])            => await adminAccounts.CreateAsync(req),
            ("PUT" or "PATCH", ["admin", "admin", var id])    => await adminAccounts.UpdateAsync(req, id),
            ("DELETE",         ["admin", "admin", var id])    => await adminAccounts.DeleteAsync(req, id),

            // ── 24 audit ─────────────────────────────────────────────────
            ("GET",  ["admin", "audit"])                             => await adminAudits.GetLogsAsync(req),
            ("GET",  ["admin", "audit", "emails"])                   => await adminAudits.GetEmailsAsync(req),
            ("POST", ["admin", "audit", "emails", var id, "resend"]) => await adminAudits.ResendAsync(req, id),

            _ => null,
        };

    /// <summary>
    /// 內容單元 01–14 的共同路由形狀。<paramref name="segments"/> 為 <c>["admin", unit, ...]</c>。
    /// </summary>
    private async Task<IActionResult?> Content<TEntity, TI18n>(
        Handlers.Admin.AdminContentHandler<TEntity, TI18n> handler,
        HttpRequest req, string method, string[] segments,
        bool allowCreate = true, bool allowDelete = true)
        where TEntity : class, Models.Entities.IAuditable, new()
        where TI18n   : class, Models.Entities.II18n, new()
        => (method, segments) switch
        {
            ("GET",            [_, _])                      => await handler.GetListAsync(req),
            ("PUT",            [_, _, "sort"])              => await handler.SortAsync(req),
            ("POST",           [_, _, "upload"])            => await adminMedia.UploadAsync(req),
            ("PATCH",          [_, _, var id, "publish"])   => await handler.PublishAsync(req, id),
            ("GET",            [_, _, var id])              => await handler.GetByIdAsync(req, id),
            ("POST",           [_, _]) when allowCreate     => await handler.CreateAsync(req),
            ("PUT" or "PATCH", [_, _, var id])              => await handler.UpdateAsync(req, id),
            ("DELETE",         [_, _, var id]) when allowDelete => await handler.DeleteAsync(req, id),
            _ => null,
        };
}
