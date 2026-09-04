using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Nti.Api.Routing;

/// <summary>
/// 前台路由表（04-api §3.1 唯讀內容、§3.2 表單、§3.3 會員）。
/// <para>
/// <see cref="IsPublicRoute"/> 是<b>列舉式</b>白名單：新增前台端點時必須同時補進來，
/// 否則會被要求 token（docs/10 §7.6）。會員端點（<c>/me/*</c>）刻意不在白名單內。
/// </para>
/// </summary>
public sealed partial class AppRouter
{
    /// <summary>公開路由（不需 JWT）。</summary>
    private static bool IsPublicRoute(string method, string[] segments) =>
        (method, segments) is
            ("GET",  ["health"]) or

            // ── 04-api §3.1 前台內容 ──────────────────────────────────────
            ("GET",  ["content", "home"]) or
            ("GET",  ["solutions"]) or
            ("GET",  ["solutions", _]) or
            ("GET",  ["projects"]) or
            ("GET",  ["facility"]) or
            ("GET",  ["certifications"]) or
            ("GET",  ["clients"]) or
            ("GET",  ["categories"]) or
            ("GET",  ["news"]) or
            ("GET",  ["news", _]) or
            ("GET",  ["green-vlog"]) or
            ("GET",  ["faq"]) or
            ("GET",  ["industry-trends"]) or
            ("GET",  ["careers"]) or
            ("GET",  ["supplier", "notices"]) or
            ("GET",  ["supplier", "specs"]) or
            ("GET",  ["supplier", "downloads"]) or
            // RequireLogin = 1 的受控文件由 Handler 自己擋（多數項目不需登入，
            // 整條路由要求 token 會讓一般下載也打不到）
            ("POST", ["supplier", "downloads", _, "hit"]) or
            ("GET",  ["pages", _]) or
            ("GET",  ["site-settings"]);

    /// <summary>前台分派；無對應路由回 null 交給下一張表。</summary>
    private async Task<IActionResult?> RoutePublicAsync(HttpRequest req, string method, string[] segments) =>
        (method, segments) switch
        {
            ("GET",  ["health"])                  => health.Get(),

            // ── 內容 ──────────────────────────────────────────────────────
            ("GET",  ["content", "home"])         => await content.GetHomeAsync(req),
            ("GET",  ["solutions"])               => await solutions.GetListAsync(req),
            ("GET",  ["solutions", var slug])     => await solutions.GetBySlugAsync(req, slug),
            ("GET",  ["projects"])                => await projects.GetListAsync(req),
            ("GET",  ["facility"])                => await facility.GetListAsync(req),
            ("GET",  ["certifications"])          => await certifications.GetListAsync(req),
            ("GET",  ["clients"])                 => await clients.GetListAsync(req),
            ("GET",  ["categories"])              => await categories.GetListAsync(req),
            ("GET",  ["news"])                    => await news.GetListAsync(req),
            ("GET",  ["news", var slug])          => await news.GetBySlugAsync(req, slug),
            ("GET",  ["green-vlog"])              => await vlogs.GetListAsync(req),
            ("GET",  ["faq"])                     => await faqs.GetListAsync(req),
            ("GET",  ["industry-trends"])         => await trends.GetListAsync(req),
            ("GET",  ["careers"])                 => await jobs.GetListAsync(req),

            // ── 供應商專區 ────────────────────────────────────────────────
            ("GET",  ["supplier", "notices"])     => await supplier.GetNoticesAsync(req),
            ("GET",  ["supplier", "specs"])       => await supplier.GetSpecsAsync(req),
            ("GET",  ["supplier", "downloads"])   => await supplier.GetDownloadsAsync(req),
            ("POST", ["supplier", "downloads", var id, "hit"]) => await supplier.HitDownloadAsync(req, id),

            // ── 頁面 SEO 與全站設定 ───────────────────────────────────────
            ("GET",  ["pages", var pageKey])      => await pages.GetByKeyAsync(req, pageKey),
            ("GET",  ["site-settings"])           => await settings.GetPublicAsync(req),

            _ => null,
        };
}
