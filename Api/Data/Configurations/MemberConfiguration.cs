using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nti.Api.Models.Entities;

namespace Nti.Api.Data.Configurations;

/// <summary>單元 19 member（docs/08 §4.13，P6）。</summary>
public sealed class MemberConfiguration : IEntityTypeConfiguration<Member>
{
    public void Configure(EntityTypeBuilder<Member> b)
    {
        b.ToTable("Member", t =>
        {
            t.HasCheckConstraint("CK_Member_Status", "[Status] IN ('Pending','Active','Suspended')");
            t.HasCheckConstraint("CK_Member_PreferredLang", "[PreferredLang] IN ('zh','en')");
        });

        b.Property(x => x.Email).HasMaxLength(160);
        b.Property(x => x.PasswordHash).HasMaxLength(200);
        b.Property(x => x.DisplayName).HasMaxLength(80);
        b.Property(x => x.Company).HasMaxLength(120);
        b.Property(x => x.Phone).HasMaxLength(40);
        b.Property(x => x.PreferredLang).Ascii(5).HasDefaultValue("zh");
        b.Property(x => x.Status).Ascii(20).HasDefaultValue("Pending");
        b.Property(x => x.FailedLoginCount).HasDefaultValue((byte)0);
        b.Audit();

        b.HasAlternateKey(x => x.Email).HasName("UQ_Member_Email");
    }
}

public sealed class MemberTokenConfiguration : IEntityTypeConfiguration<MemberToken>
{
    public void Configure(EntityTypeBuilder<MemberToken> b)
    {
        b.ToTable("MemberToken", t => t.HasCheckConstraint(
            "CK_MemberToken_Type", "[TokenType] IN ('EmailVerify','PasswordReset')"));

        b.Property(x => x.TokenType).Ascii(20);
        b.Property(x => x.TokenHash).HasColumnType("varbinary(32)");
        b.Property(x => x.CreatedAt).HasDefaultValueSql("SYSUTCDATETIME()");

        b.HasOne<Member>().WithMany()
            .HasForeignKey(x => x.MemberId)
            .HasConstraintName("FK_MemberToken_Member")
            .OnDelete(DeleteBehavior.Restrict);

        // 驗證信／重設信的 token 查詢：以雜湊查，覆蓋到期與使用狀態，一次索引查完
        b.HasIndex(x => x.TokenHash)
            .HasDatabaseName("IX_MemberToken_Lookup")
            .IncludeProperties(x => new { x.MemberId, x.ExpiresAt, x.UsedAt });
    }
}
