using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using Nti.Api.Common;
using Nti.Api.Models.Entities;
using System.IdentityModel.Tokens.Jwt;

namespace Nti.Api.Data;

/// <summary>
/// 寫入端的 DbContext（docs/10 §8.1）。<b>schema 的權威來源是本專案的 Migration</b>，
/// 不是 <c>db/</c>——後者為參考實作與交付腳本。
/// <para>讀取一律走 <c>Services/Dapper/</c> 的 ReadService，不從這裡查。</para>
/// </summary>
public class AppDbContext(DbContextOptions<AppDbContext> options, IHttpContextAccessor? httpContextAccessor = null)
    : DbContext(options)
{
    // ── 系統（docs/08 §4.14）────────────────────────────────────────────────
    public DbSet<Role>           Role           => Set<Role>();
    public DbSet<RolePermission> RolePermission => Set<RolePermission>();
    public DbSet<AdminUser>      AdminUser      => Set<AdminUser>();
    public DbSet<AuditLog>       AuditLog       => Set<AuditLog>();
    public DbSet<EmailLog>       EmailLog       => Set<EmailLog>();

    // ── 共用主檔（§4.1）─────────────────────────────────────────────────────
    public DbSet<Category>     Category     => Set<Category>();
    public DbSet<CategoryI18n> CategoryI18n => Set<CategoryI18n>();
    public DbSet<SiteSetting>  SiteSetting  => Set<SiteSetting>();

    // ── 內容單元 01–14（§4.2–§4.10）─────────────────────────────────────────
    public DbSet<HomeBanner>           HomeBanner           => Set<HomeBanner>();
    public DbSet<HomeBannerI18n>       HomeBannerI18n       => Set<HomeBannerI18n>();
    public DbSet<Solution>             Solution             => Set<Solution>();
    public DbSet<SolutionI18n>         SolutionI18n         => Set<SolutionI18n>();
    public DbSet<SolutionItem>         SolutionItem         => Set<SolutionItem>();
    public DbSet<SolutionItemI18n>     SolutionItemI18n     => Set<SolutionItemI18n>();
    public DbSet<Project>              Project              => Set<Project>();
    public DbSet<ProjectI18n>          ProjectI18n          => Set<ProjectI18n>();
    public DbSet<News>                 News                 => Set<News>();
    public DbSet<NewsI18n>             NewsI18n             => Set<NewsI18n>();
    public DbSet<Vlog>                 Vlog                 => Set<Vlog>();
    public DbSet<VlogI18n>             VlogI18n             => Set<VlogI18n>();
    public DbSet<Faq>                  Faq                  => Set<Faq>();
    public DbSet<FaqI18n>              FaqI18n              => Set<FaqI18n>();
    public DbSet<IndustryTrend>        IndustryTrend        => Set<IndustryTrend>();
    public DbSet<IndustryTrendI18n>    IndustryTrendI18n    => Set<IndustryTrendI18n>();
    public DbSet<Certification>        Certification        => Set<Certification>();
    public DbSet<CertificationI18n>    CertificationI18n    => Set<CertificationI18n>();
    public DbSet<ClientLogo>           ClientLogo           => Set<ClientLogo>();
    public DbSet<FacilityItem>         FacilityItem         => Set<FacilityItem>();
    public DbSet<FacilityItemI18n>     FacilityItemI18n     => Set<FacilityItemI18n>();
    public DbSet<JobPosting>           JobPosting           => Set<JobPosting>();
    public DbSet<JobPostingI18n>       JobPostingI18n       => Set<JobPostingI18n>();
    public DbSet<SupplierNotice>       SupplierNotice       => Set<SupplierNotice>();
    public DbSet<SupplierNoticeI18n>   SupplierNoticeI18n   => Set<SupplierNoticeI18n>();
    public DbSet<SupplierSpec>         SupplierSpec         => Set<SupplierSpec>();
    public DbSet<SupplierSpecI18n>     SupplierSpecI18n     => Set<SupplierSpecI18n>();
    public DbSet<SupplierDownload>     SupplierDownload     => Set<SupplierDownload>();
    public DbSet<SupplierDownloadI18n> SupplierDownloadI18n => Set<SupplierDownloadI18n>();

    // ── 頁面／SEO（§4.11）───────────────────────────────────────────────────
    public DbSet<Page>     Page     => Set<Page>();
    public DbSet<PageI18n> PageI18n => Set<PageI18n>();
    public DbSet<Redirect> Redirect => Set<Redirect>();

    // ── 表單（§4.12）────────────────────────────────────────────────────────
    public DbSet<QuoteRequest>    QuoteRequest    => Set<QuoteRequest>();
    public DbSet<QuoteAttachment> QuoteAttachment => Set<QuoteAttachment>();
    public DbSet<ContactMessage>  ContactMessage  => Set<ContactMessage>();

    // ── 會員與訂單（§4.13，P6）──────────────────────────────────────────────
    public DbSet<Member>        Member        => Set<Member>();
    public DbSet<MemberToken>   MemberToken   => Set<MemberToken>();
    public DbSet<Order>         Order         => Set<Order>();
    public DbSet<OrderProgress> OrderProgress => Set<OrderProgress>();

    // ── 預留（§4.15，待客戶確認）────────────────────────────────────────────
    public DbSet<NewsletterSubscriber> NewsletterSubscriber => Set<NewsletterSubscriber>();

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        // 時間欄一律 DATETIME2(0) 存 UTC（docs/08 §2.2），逐欄寫會漏
        configurationBuilder.Properties<DateTime>().HaveColumnType("datetime2(0)");


        // ★ 關掉「每個外鍵自動建索引」的慣例。
        //   Azure SQL Basic 只有 5 DTU / 2GB，索引寧缺勿濫（docs/08 §5）：35 條外鍵會變成
        //   35 個索引，其中大多數（i18n 側表的 FK 是 PK 前導欄、選填分類欄）根本用不到。
        //   真正需要的 FK 支撐索引由 0003 明列 4 條，已逐條寫在各 Configuration 裡。
        configurationBuilder.Conventions.Remove(typeof(ForeignKeyIndexConvention));
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // 具名 DEFAULT 約束（DF_<表>_<欄>）。匿名約束在各環境會拿到不同的隨機名稱
        // （DF__HomeBanner__Sort__1B0907CE），使「改預設值」的 migration 無法跨環境重播；
        // db/verify/verify.sql 也直接斷言「匿名約束數 = 0」。
        modelBuilder.UseNamedDefaultConstraints();

        // Entity 設定一律寫在 Data/Configurations/<Entity>Configuration.cs
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

        AlwaysWriteColumnsWithDefaults(modelBuilder);
    }

    /// <summary>
    /// 讓「預設值為 true 的欄位」存得進 false。
    /// <para>
    /// <c>HasDefaultValue(...)</c> 會把欄位標成 <see cref="ValueGenerated.OnAdd"/>，
    /// EF 因此在值等於 CLR 預設值（bool 即 false）時<b>把整欄從 INSERT 拿掉</b>、改讓 DB 預設值生效。
    /// 於是 <c>IsPublished = false</c> 進 DB 會變成 1 —— 而且不會有任何錯誤訊息。
    /// </para>
    /// <para>
    /// 這不只是種子的問題：任何一筆「先建好、暫不上架」的內容都會被靜默上架，
    /// 預留的 <c>green-csr</c> 頁也會從 noindex 變成可被索引。
    /// 改成 <see cref="ValueGenerated.Never"/> 後 EF 一律照實寫入，
    /// 「程式寫什麼」與「DB 存什麼」不再有落差；DDL 的 DEFAULT 約束不受影響（仍會建立），
    /// 只是改由手寫 SQL 之類的路徑才會用到它。
    /// </para>
    /// <para>
    /// 只挑 bool：字串預設值（<c>Status='New'</c>）的 CLR 預設是 null，永遠不會等於實際值；
    /// 數值預設值（<c>SortOrder=0</c>）省略後 DB 補的就是同一個 0，兩者都沒有這個問題。
    /// 範圍放大到全型別會連 IDENTITY 主鍵一起改掉。
    /// </para>
    /// <para>用迴圈掃全模型而不是逐欄補：之後新增的表一樣會踩到這個坑。</para>
    /// </summary>
    private static void AlwaysWriteColumnsWithDefaults(ModelBuilder modelBuilder)
    {
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            foreach (var property in entityType.GetProperties())
                if (property.ClrType == typeof(bool) && property.GetDefaultValue() is not null)
                    property.ValueGenerated = ValueGenerated.Never;
    }

    /// <summary>
    /// 統一填稽核欄位（docs/10 §8.4）：新增填 CreatedAt/By、修改填 UpdatedAt/By。
    /// <para>
    /// 刪除一律軟刪：對 <see cref="IAuditable"/> 呼叫 <c>Remove()</c> 會被在這裡改寫成
    /// <c>IsDeleted = 1</c>，避免任何一處漏寫就把內容真的刪掉。
    /// </para>
    /// </summary>
    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var now    = Clock.UtcNow;   // 稽核欄位存 UTC（docs/08 §2.2），與 DDL 的 SYSUTCDATETIME() 預設值一致
        var userId = CurrentAdminUserId();

        foreach (var entry in ChangeTracker.Entries<IAuditable>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = now;
                    entry.Entity.CreatedBy = userId;
                    break;

                case EntityState.Modified:
                    entry.Entity.UpdatedAt = now;
                    entry.Entity.UpdatedBy = userId;
                    break;

                case EntityState.Deleted:
                    entry.State            = EntityState.Modified;
                    entry.Entity.IsDeleted = true;
                    entry.Entity.UpdatedAt = now;
                    entry.Entity.UpdatedBy = userId;
                    break;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }

    /// <summary>目前登入的後台管理員 Id（來自 JWT 的 sub claim）；公開端點寫入時為 null。</summary>
    private int? CurrentAdminUserId()
    {
        var sub = httpContextAccessor?.HttpContext?.User?.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        return int.TryParse(sub, out var id) ? id : null;
    }
}
