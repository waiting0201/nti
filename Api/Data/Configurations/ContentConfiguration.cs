using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nti.Api.Common;
using Nti.Api.Models.Entities;

namespace Nti.Api.Data.Configurations;

/// <summary>單元 06 faq（docs/08 §4.7）。</summary>
public sealed class FaqConfiguration : IEntityTypeConfiguration<Faq>
{
    public void Configure(EntityTypeBuilder<Faq> b)
    {
        b.ToTable("Faq");
        b.Property(x => x.SortOrder).HasDefaultValue(0);
        b.Property(x => x.IsPublished).HasDefaultValue(true);
        b.Audit();

        // CategoryId 可為 NULL（可不分組）；NULL 時複合 FK 自動不檢查
        b.CategoryGuard(CategoryTypes.Faq, "FK_Faq_Category");
    }
}

public sealed class FaqI18nConfiguration : IEntityTypeConfiguration<FaqI18n>
{
    public void Configure(EntityTypeBuilder<FaqI18n> b)
    {
        b.I18nOf<FaqI18n, Faq>(nameof(FaqI18n.FaqId));
        b.Property(x => x.Question).HasMaxLength(300);
    }
}

/// <summary>單元 07 trend（docs/08 §4.7）。</summary>
public sealed class IndustryTrendConfiguration : IEntityTypeConfiguration<IndustryTrend>
{
    public void Configure(EntityTypeBuilder<IndustryTrend> b)
    {
        b.ToTable("IndustryTrend");
        b.Property(x => x.SortOrder).HasDefaultValue(0);
        b.Publishable().Audit();
    }
}

public sealed class IndustryTrendI18nConfiguration : IEntityTypeConfiguration<IndustryTrendI18n>
{
    public void Configure(EntityTypeBuilder<IndustryTrendI18n> b)
    {
        b.I18nOf<IndustryTrendI18n, IndustryTrend>(nameof(IndustryTrendI18n.IndustryTrendId));
        b.Property(x => x.Title).HasMaxLength(200);
    }
}

/// <summary>單元 08 certification（docs/08 §4.8）。</summary>
public sealed class CertificationConfiguration : IEntityTypeConfiguration<Certification>
{
    public void Configure(EntityTypeBuilder<Certification> b)
    {
        b.ToTable("Certification");
        b.Property(x => x.LogoPath).HasMaxLength(260);
        b.Property(x => x.LinkUrl).HasMaxLength(300);
        b.Property(x => x.ShowOnHome).HasDefaultValue(true);
        b.Property(x => x.SortOrder).HasDefaultValue(0);
        b.Property(x => x.IsPublished).HasDefaultValue(true);
        b.Audit();

        b.CategoryGuard(CategoryTypes.Certification, "FK_Certification_Category");

        b.HasIndex(x => new { x.IsDeleted, x.IsPublished, x.ShowOnHome, x.SortOrder })
            .HasDatabaseName("IX_Certification_Home");
    }
}

public sealed class CertificationI18nConfiguration : IEntityTypeConfiguration<CertificationI18n>
{
    public void Configure(EntityTypeBuilder<CertificationI18n> b)
    {
        b.I18nOf<CertificationI18n, Certification>(nameof(CertificationI18n.CertificationId));
        b.Property(x => x.Name).HasMaxLength(120);
        b.Property(x => x.Description).HasMaxLength(400);
        b.Property(x => x.LogoAlt).HasMaxLength(200);
    }
}

/// <summary>單元 09 client（docs/08 §4.8）。無 i18n 側表：品牌名不翻譯。</summary>
public sealed class ClientLogoConfiguration : IEntityTypeConfiguration<ClientLogo>
{
    public void Configure(EntityTypeBuilder<ClientLogo> b)
    {
        b.ToTable("ClientLogo");
        b.Property(x => x.Name).HasMaxLength(120);
        b.Property(x => x.LogoPath).HasMaxLength(260);
        b.Property(x => x.LinkUrl).HasMaxLength(300);
        b.Property(x => x.SortOrder).HasDefaultValue(0);
        b.Property(x => x.IsPublished).HasDefaultValue(true);
        b.Audit();
    }
}

/// <summary>單元 10 facility（docs/08 §4.8）。</summary>
public sealed class FacilityItemConfiguration : IEntityTypeConfiguration<FacilityItem>
{
    public void Configure(EntityTypeBuilder<FacilityItem> b)
    {
        b.ToTable("FacilityItem");
        b.Property(x => x.ImagePath).HasMaxLength(260);
        b.Property(x => x.SortOrder).HasDefaultValue(0);
        b.Property(x => x.IsPublished).HasDefaultValue(true);
        b.Audit();

        b.CategoryGuard(CategoryTypes.Facility, "FK_FacilityItem_Category");
    }
}

public sealed class FacilityItemI18nConfiguration : IEntityTypeConfiguration<FacilityItemI18n>
{
    public void Configure(EntityTypeBuilder<FacilityItemI18n> b)
    {
        b.I18nOf<FacilityItemI18n, FacilityItem>(nameof(FacilityItemI18n.FacilityItemId));
        b.Property(x => x.Name).HasMaxLength(160);
        b.Property(x => x.Description).HasMaxLength(600);
        b.Property(x => x.ImageAlt).HasMaxLength(200);
    }
}

/// <summary>單元 11 job（docs/08 §4.9）。</summary>
public sealed class JobPostingConfiguration : IEntityTypeConfiguration<JobPosting>
{
    public void Configure(EntityTypeBuilder<JobPosting> b)
    {
        b.ToTable("JobPosting");
        b.Property(x => x.SortOrder).HasDefaultValue(0);
        b.Publishable().Audit();
    }
}

public sealed class JobPostingI18nConfiguration : IEntityTypeConfiguration<JobPostingI18n>
{
    public void Configure(EntityTypeBuilder<JobPostingI18n> b)
    {
        b.I18nOf<JobPostingI18n, JobPosting>(nameof(JobPostingI18n.JobPostingId));
        b.Property(x => x.Title).HasMaxLength(160);
        b.Property(x => x.Location).HasMaxLength(80);
    }
}
