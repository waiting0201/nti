using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nti.Api.Common;
using Nti.Api.Models.Entities;

namespace Nti.Api.Data.Configurations;

/// <summary>單元 17 quote（docs/08 §4.12）。</summary>
public sealed class QuoteRequestConfiguration : IEntityTypeConfiguration<QuoteRequest>
{
    public void Configure(EntityTypeBuilder<QuoteRequest> b)
    {
        b.ToTable("QuoteRequest", t => t.HasCheckConstraint(
            "CK_Quote_Status", "[Status] IN ('New','InProgress','Quoted','Closed','Spam')"));

        b.Property(x => x.QuoteNo).Ascii(20);
        b.Property(x => x.FullName).HasMaxLength(80);
        b.Property(x => x.Company).HasMaxLength(120);
        b.Property(x => x.Email).HasMaxLength(160);
        b.Property(x => x.Phone).HasMaxLength(40);
        b.Property(x => x.Quantity).HasMaxLength(60);
        b.Property(x => x.SizeText).HasMaxLength(100);
        b.Property(x => x.NeedsSustainableAdvice).HasDefaultValue(false);
        b.Property(x => x.Status).Ascii(20).HasDefaultValue("New");
        b.Property(x => x.SourceIp).AsciiNullable(45);
        b.Property(x => x.UserAgent).HasMaxLength(400);
        b.Property(x => x.SourceLang).AsciiNullable(5);
        b.Property(x => x.SubmittedAt).HasDefaultValueSql("SYSUTCDATETIME()");
        b.Audit();

        b.HasAlternateKey(x => x.QuoteNo).HasName("UQ_QuoteRequest_QuoteNo");

        b.HasOne<Member>().WithMany()
            .HasForeignKey(x => x.MemberId)
            .HasConstraintName("FK_QuoteRequest_Member")
            .OnDelete(DeleteBehavior.Restrict);

        b.HasOne<Solution>().WithMany()
            .HasForeignKey(x => x.SolutionId)
            .HasConstraintName("FK_QuoteRequest_Solution")
            .OnDelete(DeleteBehavior.Restrict);

        // 一張表兩個分類欄，各自守住自己的 CategoryType
        b.CategoryGuard(CategoryTypes.Industry, "FK_QuoteRequest_Industry",
            idColumn: nameof(QuoteRequest.IndustryCategoryId), guardColumn: "IndustryTypeGuard");
        b.CategoryGuard(CategoryTypes.QuoteMaterial, "FK_QuoteRequest_Material",
            idColumn: nameof(QuoteRequest.MaterialCategoryId), guardColumn: "MaterialTypeGuard");

        // AssigneeId 指向 AdminUser 但刻意不建 FK（docs/08 §2.3）
        b.HasIndex(x => new { x.Status, x.SubmittedAt })
            .HasDatabaseName("IX_Quote_Status")
            .IsDescending(false, true);
    }
}

public sealed class QuoteAttachmentConfiguration : IEntityTypeConfiguration<QuoteAttachment>
{
    public void Configure(EntityTypeBuilder<QuoteAttachment> b)
    {
        b.ToTable("QuoteAttachment", t => t.HasCheckConstraint(
            "CK_QuoteAtt_Scan", "[ScanStatus] IN ('Pending','Clean','Infected')"));

        b.Property(x => x.FilePath).HasMaxLength(260);
        b.Property(x => x.OriginalName).HasMaxLength(200);
        b.Property(x => x.ContentType).Ascii(100);
        b.Property(x => x.ScanStatus).Ascii(10).HasDefaultValue("Pending");
        b.Property(x => x.CreatedAt).HasDefaultValueSql("SYSUTCDATETIME()");

        b.HasOne<QuoteRequest>().WithMany()
            .HasForeignKey(x => x.QuoteRequestId)
            .HasConstraintName("FK_QuoteAttachment_QuoteRequest")
            .OnDelete(DeleteBehavior.Restrict);

        b.HasIndex(x => x.QuoteRequestId).HasDatabaseName("IX_QuoteAttachment_Quote");
    }
}

/// <summary>單元 18 contact（docs/08 §4.12）。</summary>
public sealed class ContactMessageConfiguration : IEntityTypeConfiguration<ContactMessage>
{
    public void Configure(EntityTypeBuilder<ContactMessage> b)
    {
        b.ToTable("ContactMessage", t => t.HasCheckConstraint(
            "CK_Contact_Status", "[Status] IN ('New','Replied','Closed','Spam')"));

        b.Property(x => x.Name).HasMaxLength(80);
        b.Property(x => x.Email).HasMaxLength(160);
        b.Property(x => x.Company).HasMaxLength(120);
        b.Property(x => x.Phone).HasMaxLength(40);
        b.Property(x => x.Status).Ascii(20).HasDefaultValue("New");
        b.Property(x => x.SourceIp).AsciiNullable(45);
        b.Property(x => x.UserAgent).HasMaxLength(400);
        b.Property(x => x.SourceLang).AsciiNullable(5);
        b.Property(x => x.SubmittedAt).HasDefaultValueSql("SYSUTCDATETIME()");
        b.Audit();

        b.HasIndex(x => new { x.Status, x.SubmittedAt })
            .HasDatabaseName("IX_Contact_Status")
            .IsDescending(false, true);
    }
}
