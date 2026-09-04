using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nti.Api.Common;
using Nti.Api.Models.Entities;

namespace Nti.Api.Data.Configurations;

/// <summary>單元 05 vlog（docs/08 §4.6）。</summary>
public sealed class VlogConfiguration : IEntityTypeConfiguration<Vlog>
{
    public void Configure(EntityTypeBuilder<Vlog> b)
    {
        b.ToTable("Vlog");
        b.Property(x => x.YoutubeId).Ascii(20);
        b.Property(x => x.ThumbOverridePath).HasMaxLength(260);
        b.Property(x => x.IsMainFeature).HasDefaultValue(false);
        b.Property(x => x.SortOrder).HasDefaultValue(0);
        b.Publishable().Audit();

        b.CategoryGuard(CategoryTypes.Vlog, "FK_Vlog_Category");

        // 全站僅一支主打影片：交給 DB 的 filtered unique index，不只靠應用層檢查
        b.HasIndex(x => x.IsMainFeature)
            .IsUnique()
            .HasDatabaseName("UX_Vlog_MainFeature")
            .HasFilter("[IsMainFeature] = 1 AND [IsDeleted] = 0");
    }
}

public sealed class VlogI18nConfiguration : IEntityTypeConfiguration<VlogI18n>
{
    public void Configure(EntityTypeBuilder<VlogI18n> b)
    {
        b.I18nOf<VlogI18n, Vlog>(nameof(VlogI18n.VlogId));
        b.Property(x => x.Title).HasMaxLength(200);
        b.Property(x => x.Description).HasMaxLength(400);
    }
}
