using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nti.Api.Common;
using Nti.Api.Models.Entities;

namespace Nti.Api.Data.Configurations;

/// <summary>單元 12 supplier-notice（docs/08 §4.10）。</summary>
public sealed class SupplierNoticeConfiguration : IEntityTypeConfiguration<SupplierNotice>
{
    public void Configure(EntityTypeBuilder<SupplierNotice> b)
    {
        b.ToTable("SupplierNotice");
        b.Property(x => x.AttachmentPath).HasMaxLength(260);
        b.Publishable().Audit();

        b.CategoryGuard(CategoryTypes.SupplierNotice, "FK_SupplierNotice_Category");

        b.HasIndex(x => new { x.IsDeleted, x.IsPublished, x.NoticeDate })
            .HasDatabaseName("IX_SupplierNotice_List")
            .IsDescending(false, false, true);
    }
}

public sealed class SupplierNoticeI18nConfiguration : IEntityTypeConfiguration<SupplierNoticeI18n>
{
    public void Configure(EntityTypeBuilder<SupplierNoticeI18n> b)
    {
        b.I18nOf<SupplierNoticeI18n, SupplierNotice>(nameof(SupplierNoticeI18n.SupplierNoticeId));
        b.Property(x => x.Title).HasMaxLength(250);
    }
}

/// <summary>單元 13 supplier-spec（docs/08 §4.10）。</summary>
public sealed class SupplierSpecConfiguration : IEntityTypeConfiguration<SupplierSpec>
{
    public void Configure(EntityTypeBuilder<SupplierSpec> b)
    {
        b.ToTable("SupplierSpec");
        b.Property(x => x.SortOrder).HasDefaultValue(0);
        b.Property(x => x.IsPublished).HasDefaultValue(true);
        b.Audit();
    }
}

public sealed class SupplierSpecI18nConfiguration : IEntityTypeConfiguration<SupplierSpecI18n>
{
    public void Configure(EntityTypeBuilder<SupplierSpecI18n> b)
    {
        b.I18nOf<SupplierSpecI18n, SupplierSpec>(nameof(SupplierSpecI18n.SupplierSpecId));
        b.Property(x => x.Title).HasMaxLength(160);
        b.Property(x => x.Description).HasMaxLength(600);
    }
}

/// <summary>單元 14 supplier-download（docs/08 §4.10）。</summary>
public sealed class SupplierDownloadConfiguration : IEntityTypeConfiguration<SupplierDownload>
{
    public void Configure(EntityTypeBuilder<SupplierDownload> b)
    {
        b.ToTable("SupplierDownload");
        b.Property(x => x.FilePath).HasMaxLength(260);
        b.Property(x => x.FileExt).Ascii(10);
        b.Property(x => x.RequireLogin).HasDefaultValue(false);
        b.Property(x => x.DownloadCount).HasDefaultValue(0);
        b.Property(x => x.SortOrder).HasDefaultValue(0);
        b.Property(x => x.IsPublished).HasDefaultValue(true);
        b.Audit();
    }
}

public sealed class SupplierDownloadI18nConfiguration : IEntityTypeConfiguration<SupplierDownloadI18n>
{
    public void Configure(EntityTypeBuilder<SupplierDownloadI18n> b)
    {
        b.I18nOf<SupplierDownloadI18n, SupplierDownload>(nameof(SupplierDownloadI18n.SupplierDownloadId));
        b.Property(x => x.Name).HasMaxLength(200);
    }
}
