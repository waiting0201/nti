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
        b.Property(x => x.CertificateNo).HasMaxLength(100);
        b.Property(x => x.ShowOnHome).HasDefaultValue(true);
        b.Property(x => x.ShowInDetailList).HasDefaultValue(false);
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
        b.Property(x => x.ShortName).HasMaxLength(60);
        b.Property(x => x.Description).HasMaxLength(400);
        b.Property(x => x.LogoAlt).HasMaxLength(200);
    }
}

/// <summary>單元 08 的附屬清單：認證頁的七個清單區塊（docs/08 §4.8）。</summary>
public sealed class CertificationListItemConfiguration : IEntityTypeConfiguration<CertificationListItem>
{
    public void Configure(EntityTypeBuilder<CertificationListItem> b)
    {
        b.ToTable("CertificationListItem");
        b.Property(x => x.SortOrder).HasDefaultValue(0);
        b.Property(x => x.IsPublished).HasDefaultValue(true);
        b.Audit();

        // 區塊＝認證分類（與 08 的 logo 共用同一套 Certification 分類），2026-11-09 起取代寫死的 Section 字串
        b.CategoryGuard(CategoryTypes.Certification, "FK_CertificationListItem_Category");

        b.HasIndex(x => new { x.IsDeleted, x.IsPublished, x.CategoryId, x.SortOrder })
            .HasDatabaseName("IX_CertificationListItem_Category");
    }
}

public sealed class CertificationListItemI18nConfiguration : IEntityTypeConfiguration<CertificationListItemI18n>
{
    public void Configure(EntityTypeBuilder<CertificationListItemI18n> b)
    {
        b.I18nOf<CertificationListItemI18n, CertificationListItem>(nameof(CertificationListItemI18n.CertificationListItemId));
        b.Property(x => x.Title).HasMaxLength(200);
        b.Property(x => x.Description).HasMaxLength(400);
    }
}

/// <summary>單元 08 的附屬清單：碳效率頁的績效表（docs/08 §4.8）。只有一張表，不分區塊。</summary>
public sealed class PerformanceMetricConfiguration : IEntityTypeConfiguration<PerformanceMetric>
{
    public void Configure(EntityTypeBuilder<PerformanceMetric> b)
    {
        b.ToTable("PerformanceMetric");
        b.Property(x => x.SortOrder).HasDefaultValue(0);
        b.Property(x => x.IsPublished).HasDefaultValue(true);
        b.Audit();
        // 不另建索引：一頁幾列的小表，全表掃描比多一條索引的維護成本划算（Basic 5 DTU，docs/08 §5）
    }
}

public sealed class PerformanceMetricI18nConfiguration : IEntityTypeConfiguration<PerformanceMetricI18n>
{
    public void Configure(EntityTypeBuilder<PerformanceMetricI18n> b)
    {
        b.I18nOf<PerformanceMetricI18n, PerformanceMetric>(nameof(PerformanceMetricI18n.PerformanceMetricId));
        b.Property(x => x.Indicator).HasMaxLength(100);
        b.Property(x => x.Period).HasMaxLength(50);
        b.Property(x => x.Result).HasMaxLength(200);
    }
}

/// <summary>單元 08 的附屬清單：ESG 頁的「南台彩藝永續目標」表（docs/08 §4.8）。</summary>
public sealed class SustainabilityGoalConfiguration : IEntityTypeConfiguration<SustainabilityGoal>
{
    public void Configure(EntityTypeBuilder<SustainabilityGoal> b)
    {
        b.ToTable("SustainabilityGoal");
        b.Property(x => x.SortOrder).HasDefaultValue(0);
        b.Property(x => x.IsPublished).HasDefaultValue(true);
        b.Audit();
        // 同 PerformanceMetric：幾列的小表，不另建索引
    }
}

public sealed class SustainabilityGoalI18nConfiguration : IEntityTypeConfiguration<SustainabilityGoalI18n>
{
    public void Configure(EntityTypeBuilder<SustainabilityGoalI18n> b)
    {
        b.I18nOf<SustainabilityGoalI18n, SustainabilityGoal>(nameof(SustainabilityGoalI18n.SustainabilityGoalId));
        b.Property(x => x.Goal).HasMaxLength(100);
        b.Property(x => x.Timeline).HasMaxLength(50);
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
