using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nti.Api.Models.Entities;

namespace Nti.Api.Data.Configurations;

/// <summary>電子報訂閱（docs/08 §4.15）——預留，待客戶確認。</summary>
public sealed class NewsletterSubscriberConfiguration : IEntityTypeConfiguration<NewsletterSubscriber>
{
    public void Configure(EntityTypeBuilder<NewsletterSubscriber> b)
    {
        b.ToTable("NewsletterSubscriber", t =>
        {
            t.HasCheckConstraint("CK_NewsletterSubscriber_Status",
                "[Status] IN ('Pending','Subscribed','Unsubscribed','Bounced')");
            t.HasCheckConstraint("CK_NewsletterSubscriber_Source",
                "[Source] IN ('Website','Import','Admin')");
            t.HasCheckConstraint("CK_NewsletterSubscriber_Lang", "[PreferredLang] IN ('zh','en')");
        });

        b.Property(x => x.Email).HasMaxLength(160);
        b.Property(x => x.DisplayName).HasMaxLength(80);
        b.Property(x => x.Company).HasMaxLength(120);
        b.Property(x => x.PreferredLang).Ascii(5).HasDefaultValue("en");
        b.Property(x => x.Status).Ascii(20).HasDefaultValue("Pending");
        b.Property(x => x.Source).Ascii(20).HasDefaultValue("Website");
        b.Property(x => x.ConfirmToken).HasColumnType("varbinary(32)");
        b.Property(x => x.UnsubscribeToken).HasColumnType("varbinary(32)");
        b.Property(x => x.UnsubscribeReason).HasMaxLength(200);
        b.Property(x => x.BounceCount).HasDefaultValue((byte)0);
        b.Property(x => x.SourceIp).AsciiNullable(45);
        b.Property(x => x.UserAgent).HasMaxLength(400);
        b.Property(x => x.SourceLang).AsciiNullable(5);
        b.Property(x => x.SubscribedAt).HasDefaultValueSql("SYSUTCDATETIME()");
        b.Audit();

        b.HasAlternateKey(x => x.Email).HasName("UQ_NewsletterSubscriber_Email");

        b.HasIndex(x => new { x.Status, x.SubscribedAt })
            .HasDatabaseName("IX_NewsletterSubscriber_Status")
            .IsDescending(false, true)
            .IncludeProperties(x => new { x.Email, x.PreferredLang });
    }
}
