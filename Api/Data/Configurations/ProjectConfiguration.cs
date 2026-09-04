using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nti.Api.Common;
using Nti.Api.Models.Entities;

namespace Nti.Api.Data.Configurations;

/// <summary>單元 03 project（docs/08 §4.4）。</summary>
public sealed class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
    public void Configure(EntityTypeBuilder<Project> b)
    {
        b.ToTable("Project");
        b.Property(x => x.ImagePath).HasMaxLength(260);
        b.Property(x => x.VideoUrl).HasMaxLength(300);
        b.Property(x => x.StatValue).HasMaxLength(20);
        b.Property(x => x.SortOrder).HasDefaultValue(0);
        b.Publishable().Audit();

        b.CategoryGuard(CategoryTypes.Project, "FK_Project_Category");

        b.HasIndex(x => new { x.IsDeleted, x.IsPublished, x.SortOrder }).HasDatabaseName("IX_Project_List");
    }
}

public sealed class ProjectI18nConfiguration : IEntityTypeConfiguration<ProjectI18n>
{
    public void Configure(EntityTypeBuilder<ProjectI18n> b)
    {
        b.I18nOf<ProjectI18n, Project>(nameof(ProjectI18n.ProjectId));
        b.Property(x => x.Title).HasMaxLength(200);
        b.Property(x => x.Summary).HasMaxLength(400);
        b.Property(x => x.StatLabel).HasMaxLength(60);
        b.Property(x => x.ImageAlt).HasMaxLength(200);
    }
}
