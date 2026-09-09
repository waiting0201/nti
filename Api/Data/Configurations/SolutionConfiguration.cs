using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nti.Api.Data.Seed;
using Nti.Api.Models.Entities;

namespace Nti.Api.Data.Configurations;

/// <summary>單元 02 solution（docs/08 §4.3）。</summary>
public sealed class SolutionConfiguration : IEntityTypeConfiguration<Solution>
{
    public void Configure(EntityTypeBuilder<Solution> b)
    {
        b.ToTable("Solution");
        b.Property(x => x.Code).Ascii(30);
        b.Property(x => x.CoverImagePath).HasMaxLength(260);
        b.Property(x => x.OgImagePath).HasMaxLength(260);
        b.Property(x => x.SortOrder).HasDefaultValue(0);
        b.Publishable().Audit();

        b.HasAlternateKey(x => x.Code).HasName("UQ_Solution_Code");

        b.HasData(SeedData.Solutions);
    }
}

public sealed class SolutionI18nConfiguration : IEntityTypeConfiguration<SolutionI18n>
{
    public void Configure(EntityTypeBuilder<SolutionI18n> b)
    {
        b.I18nOf<SolutionI18n, Solution>(nameof(SolutionI18n.SolutionId));

        b.Property(x => x.Name).HasMaxLength(80);
        b.Property(x => x.H1).HasMaxLength(160);
        b.Property(x => x.Summary).HasMaxLength(300);
        b.Property(x => x.CoverAlt).HasMaxLength(200);
        b.Property(x => x.Slug).HasMaxLength(160);
        b.Property(x => x.SeoTitle).HasMaxLength(70);
        b.Property(x => x.SeoDescription).HasMaxLength(180);
        b.Property(x => x.CanonicalUrl).HasMaxLength(300);
        b.Property(x => x.OgTitle).HasMaxLength(90);
        b.Property(x => x.OgDescription).HasMaxLength(200);

        // 刻意不含 IsDeleted：這個索引在軟刪年代是為了讓刪掉的內容仍佔著 slug。
        // 刪除改真刪之後（docs/10 §8.4）刪掉就不再有列，條件加不加都一樣，
        // 留著是因為它同時擋住「兩筆現存內容用同一個 slug」——那才是這條索引現在的工作。

        b.HasIndex(x => new { x.Lang, x.Slug }).IsUnique().HasDatabaseName("UX_SolutionI18n_Lang_Slug");

        b.HasData(SeedData.SolutionI18ns);
    }
}

public sealed class SolutionItemConfiguration : IEntityTypeConfiguration<SolutionItem>
{
    public void Configure(EntityTypeBuilder<SolutionItem> b)
    {
        b.ToTable("SolutionItem");
        b.Property(x => x.ImagePath).HasMaxLength(260);
        b.Property(x => x.SortOrder).HasDefaultValue(0);
        b.Property(x => x.IsPublished).HasDefaultValue(true);
        b.Audit();

        // 品項卡是方案的附屬（後台就長在方案的編輯頁裡），方案刪掉就跟著走
        b.HasOne<Solution>().WithMany()
            .HasForeignKey(x => x.SolutionId)
            .HasConstraintName("FK_SolutionItem_Solution")
            .OnDelete(DeleteBehavior.Cascade);

        b.HasIndex(x => new { x.SolutionId, x.SortOrder }).HasDatabaseName("IX_SolutionItem_Solution");
    }
}

public sealed class SolutionItemI18nConfiguration : IEntityTypeConfiguration<SolutionItemI18n>
{
    public void Configure(EntityTypeBuilder<SolutionItemI18n> b)
    {
        b.I18nOf<SolutionItemI18n, SolutionItem>(nameof(SolutionItemI18n.SolutionItemId));
        b.Property(x => x.Name).HasMaxLength(120);
        b.Property(x => x.Description).HasMaxLength(400);
        b.Property(x => x.ImageAlt).HasMaxLength(200);
    }
}
