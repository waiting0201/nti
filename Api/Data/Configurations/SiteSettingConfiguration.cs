using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nti.Api.Data.Seed;
using Nti.Api.Models.Entities;

namespace Nti.Api.Data.Configurations;

/// <summary>單元 21 setting — 全站設定（docs/08 §4.1）。</summary>
public sealed class SiteSettingConfiguration : IEntityTypeConfiguration<SiteSetting>
{
    public void Configure(EntityTypeBuilder<SiteSetting> b)
    {
        b.ToTable("SiteSetting", t => t.HasCheckConstraint("CK_SiteSetting_Group",
            "[GroupName] IN ('Company','Social','Home','Mail')"));

        b.HasKey(x => x.SettingKey).HasName("PK_SiteSetting");
        b.Property(x => x.SettingKey).Ascii(60).ValueGeneratedNever();
        b.Property(x => x.GroupName).Ascii(30);
        b.Property(x => x.ValueType).Ascii(10);
        b.Property(x => x.IsLocalized).HasDefaultValue(false);
        b.Property(x => x.SortOrder).HasDefaultValue(0);

        b.HasData(SeedData.SiteSettings);
    }
}
