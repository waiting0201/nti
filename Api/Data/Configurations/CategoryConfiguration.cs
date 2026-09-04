using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nti.Api.Data.Seed;
using Nti.Api.Models.Entities;

namespace Nti.Api.Data.Configurations;

/// <summary>單元 22 category — 分類主檔（docs/08 §4.1）。</summary>
public sealed class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> b)
    {
        b.ToTable("Category", t => t.HasCheckConstraint("CK_Category_Type",
            "[CategoryType] IN ('News','Project','Vlog','Faq','Certification','Facility','SupplierNotice','Industry','QuoteMaterial')"));

        b.Property(x => x.CategoryType).Ascii(30);
        b.Property(x => x.Code).Ascii(40);
        b.Property(x => x.SortOrder).HasDefaultValue(0);
        b.Property(x => x.IsActive).HasDefaultValue(true);
        b.Audit();

        b.HasAlternateKey(x => new { x.CategoryType, x.Code }).HasName("UQ_Category_Type_Code");

        // 供下游九條複合 FK 參照的 principal key，不是業務唯一鍵（docs/08 §4.16）
        b.HasAlternateKey(x => new { x.Id, x.CategoryType }).HasName("UQ_Category_Id_Type");

        b.HasIndex(x => new { x.CategoryType, x.IsActive, x.SortOrder })
            .HasDatabaseName("IX_Category_Type");

        b.HasData(SeedData.Categories);
    }
}

public sealed class CategoryI18nConfiguration : IEntityTypeConfiguration<CategoryI18n>
{
    public void Configure(EntityTypeBuilder<CategoryI18n> b)
    {
        b.I18nOf<CategoryI18n, Category>(nameof(CategoryI18n.CategoryId));
        b.Property(x => x.Name).HasMaxLength(80);

        b.HasData(SeedData.CategoryI18ns);
    }
}
