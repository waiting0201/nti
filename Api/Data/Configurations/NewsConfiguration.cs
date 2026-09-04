using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nti.Api.Common;
using Nti.Api.Models.Entities;

namespace Nti.Api.Data.Configurations;

/// <summary>單元 04 news（docs/08 §4.5）。</summary>
public sealed class NewsConfiguration : IEntityTypeConfiguration<News>
{
    public void Configure(EntityTypeBuilder<News> b)
    {
        b.ToTable("News");
        b.Property(x => x.CoverImagePath).HasMaxLength(260);
        b.Property(x => x.OgImagePath).HasMaxLength(260);
        b.Property(x => x.IsFeaturedHome).HasDefaultValue(false);
        b.Publishable(publishedByDefault: false).Audit();

        b.CategoryGuard(CategoryTypes.News, "FK_News_Category");

        b.HasIndex(x => new { x.IsDeleted, x.IsPublished, x.PublishDate })
            .HasDatabaseName("IX_News_List")
            .IsDescending(false, false, true)
            .IncludeProperties(x => new { x.CategoryId, x.CoverImagePath });
    }
}

public sealed class NewsI18nConfiguration : IEntityTypeConfiguration<NewsI18n>
{
    public void Configure(EntityTypeBuilder<NewsI18n> b)
    {
        b.I18nOf<NewsI18n, News>(nameof(NewsI18n.NewsId));

        b.Property(x => x.Title).HasMaxLength(250);
        b.Property(x => x.Summary).HasMaxLength(500);
        b.Property(x => x.CoverAlt).HasMaxLength(200);
        b.Property(x => x.Slug).HasMaxLength(160);
        b.Property(x => x.SeoTitle).HasMaxLength(70);
        b.Property(x => x.SeoDescription).HasMaxLength(180);
        b.Property(x => x.CanonicalUrl).HasMaxLength(300);
        b.Property(x => x.OgTitle).HasMaxLength(90);
        b.Property(x => x.OgDescription).HasMaxLength(200);

        b.HasIndex(x => new { x.Lang, x.Slug }).IsUnique().HasDatabaseName("UX_NewsI18n_Lang_Slug");
    }
}
