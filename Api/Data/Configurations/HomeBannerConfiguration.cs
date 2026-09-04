using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nti.Api.Models.Entities;

namespace Nti.Api.Data.Configurations;

/// <summary>單元 01 home-banner（docs/08 §4.2）。</summary>
public sealed class HomeBannerConfiguration : IEntityTypeConfiguration<HomeBanner>
{
    public void Configure(EntityTypeBuilder<HomeBanner> b)
    {
        b.ToTable("HomeBanner", t =>
        {
            t.HasCheckConstraint("CK_HomeBanner_MediaType", "[MediaType] IN ('image','video')");
            // 影片型 Banner 一定要有影片檔，否則前台會渲染出空的 <video>
            t.HasCheckConstraint("CK_HomeBanner_Video", "[MediaType] = 'image' OR [VideoPath] IS NOT NULL");
        });

        b.Property(x => x.ImagePath).HasMaxLength(260);
        b.Property(x => x.ImagePathMobile).HasMaxLength(260);
        b.Property(x => x.MediaType).Ascii(10).HasDefaultValue("image");
        b.Property(x => x.VideoPath).HasMaxLength(260);
        b.Property(x => x.LinkUrl).HasMaxLength(300);
        b.Property(x => x.OpenInNewTab).HasDefaultValue(false);
        b.Property(x => x.SortOrder).HasDefaultValue(0);
        b.Publishable().Audit();

        b.HasIndex(x => new { x.IsDeleted, x.IsPublished, x.SortOrder })
            .HasDatabaseName("IX_HomeBanner_List");
    }
}

public sealed class HomeBannerI18nConfiguration : IEntityTypeConfiguration<HomeBannerI18n>
{
    public void Configure(EntityTypeBuilder<HomeBannerI18n> b)
    {
        b.I18nOf<HomeBannerI18n, HomeBanner>(nameof(HomeBannerI18n.HomeBannerId));
        b.Property(x => x.ImageAlt).HasMaxLength(200);
    }
}
