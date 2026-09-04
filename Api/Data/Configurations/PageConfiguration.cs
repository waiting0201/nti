using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nti.Api.Data.Seed;
using Nti.Api.Models.Entities;

namespace Nti.Api.Data.Configurations;

/// <summary>單元 15 page（docs/08 §4.11）。</summary>
public sealed class PageConfiguration : IEntityTypeConfiguration<Page>
{
    public void Configure(EntityTypeBuilder<Page> b)
    {
        b.ToTable("Page");
        b.Property(x => x.PageKey).Ascii(60);
        b.Property(x => x.RouteTemplate).HasMaxLength(200);
        b.Property(x => x.HasRichBody).HasDefaultValue(false);
        b.Property(x => x.OgImagePath).HasMaxLength(260);
        b.Property(x => x.IsIndexable).HasDefaultValue(true);
        b.Audit();

        b.HasAlternateKey(x => x.PageKey).HasName("UQ_Page_PageKey");

        b.HasData(SeedData.Pages);
    }
}

public sealed class PageI18nConfiguration : IEntityTypeConfiguration<PageI18n>
{
    public void Configure(EntityTypeBuilder<PageI18n> b)
    {
        b.I18nOf<PageI18n, Page>(nameof(PageI18n.PageId));

        b.Property(x => x.Slug).HasMaxLength(160);
        b.Property(x => x.SeoTitle).HasMaxLength(70);
        b.Property(x => x.SeoDescription).HasMaxLength(180);
        b.Property(x => x.CanonicalUrl).HasMaxLength(300);
        b.Property(x => x.OgTitle).HasMaxLength(90);
        b.Property(x => x.OgDescription).HasMaxLength(200);

        b.HasIndex(x => new { x.Lang, x.Slug }).IsUnique().HasDatabaseName("UX_PageI18n_Lang_Slug");

        b.HasData(SeedData.PageI18ns);
    }
}

/// <summary>單元 16 redirect（docs/08 §4.11）。</summary>
public sealed class RedirectConfiguration : IEntityTypeConfiguration<Redirect>
{
    public void Configure(EntityTypeBuilder<Redirect> b)
    {
        b.ToTable("Redirect", t => t.HasCheckConstraint("CK_Redirect_Status", "[StatusCode] IN (301,302,308)"));

        b.Property(x => x.FromPath).HasMaxLength(400);
        b.Property(x => x.ToPath).HasMaxLength(400);
        b.Property(x => x.StatusCode).HasDefaultValue((short)301);
        b.Property(x => x.HitCount).HasDefaultValue(0);
        b.Property(x => x.IsActive).HasDefaultValue(true);
        b.Audit();

        // 一個索引同時提供唯一性與覆蓋：middleware 查轉址只打這一個
        // （0003 因此拿掉 docs/08 §5 原訂的 IX_Redirect_From，兩者完全重複）
        b.HasIndex(x => x.FromPath)
            .IsUnique()
            .HasDatabaseName("UX_Redirect_FromPath")
            .IncludeProperties(x => new { x.ToPath, x.StatusCode, x.IsActive });
    }
}
