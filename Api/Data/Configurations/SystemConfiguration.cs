using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nti.Api.Data.Seed;
using Nti.Api.Models.Entities;

namespace Nti.Api.Data.Configurations;

/// <summary>單元 23 admin ／ 24 audit — 系統表（docs/08 §4.14）。</summary>
public sealed class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> b)
    {
        b.ToTable("Role");
        b.Property(x => x.Code).Ascii(30);
        b.Property(x => x.Name).HasMaxLength(60);
        b.Property(x => x.IsSystem).HasDefaultValue(false);   // 系統角色不可刪
        b.HasAlternateKey(x => x.Code).HasName("UQ_Role_Code");

        b.HasData(SeedData.Roles);
    }
}

public sealed class RolePermissionConfiguration : IEntityTypeConfiguration<RolePermission>
{
    public void Configure(EntityTypeBuilder<RolePermission> b)
    {
        b.ToTable("RolePermission");
        b.HasKey(x => new { x.RoleId, x.PermissionCode }).HasName("PK_RolePermission");
        b.Property(x => x.PermissionCode).Ascii(60);

        b.HasOne<Role>().WithMany()
            .HasForeignKey(x => x.RoleId)
            .HasConstraintName("FK_RolePermission_Role")
            .OnDelete(DeleteBehavior.Restrict);

        b.HasData(SeedData.RolePermissions);
    }
}

public sealed class AdminUserConfiguration : IEntityTypeConfiguration<AdminUser>
{
    public void Configure(EntityTypeBuilder<AdminUser> b)
    {
        b.ToTable("AdminUser");
        b.Property(x => x.Email).HasMaxLength(160);
        b.Property(x => x.PasswordHash).HasMaxLength(200);
        b.Property(x => x.DisplayName).HasMaxLength(80);
        b.Property(x => x.IsActive).HasDefaultValue(true);
        b.Property(x => x.FailedLoginCount).HasDefaultValue((byte)0);
        b.Property(x => x.MustChangePassword).HasDefaultValue(true);
        b.Audit();

        b.HasAlternateKey(x => x.Email).HasName("UQ_AdminUser_Email");
        b.HasOne<Role>().WithMany()
            .HasForeignKey(x => x.RoleId)
            .HasConstraintName("FK_AdminUser_Role")
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public sealed class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
{
    public void Configure(EntityTypeBuilder<AuditLog> b)
    {
        b.ToTable("AuditLog");
        b.Property(x => x.Action).Ascii(20);
        b.Property(x => x.EntityName).Ascii(60);
        b.Property(x => x.SourceIp).AsciiNullable(45);
        b.Property(x => x.CreatedAt).HasDefaultValueSql("SYSUTCDATETIME()");

        // AdminUserId 刻意不建 FK（docs/08 §2.3）：管理員刪除時不該連鎖擋住稽核紀錄
        b.HasIndex(x => new { x.EntityName, x.EntityId, x.CreatedAt })
            .HasDatabaseName("IX_AuditLog_Entity")
            .IsDescending(false, false, true);
    }
}

public sealed class EmailLogConfiguration : IEntityTypeConfiguration<EmailLog>
{
    public void Configure(EntityTypeBuilder<EmailLog> b)
    {
        b.ToTable("EmailLog");
        b.Property(x => x.MailType).Ascii(30);          // 刻意無 CHECK：未來加 NewsletterConfirm 不需改 schema
        b.Property(x => x.ToAddress).HasMaxLength(300);
        b.Property(x => x.Subject).HasMaxLength(250);
        b.Property(x => x.RelatedEntity).AsciiNullable(60);
        b.Property(x => x.Status).Ascii(10);            // Sent|Failed
        b.Property(x => x.ErrorMessage).HasMaxLength(1000);
        b.Property(x => x.SentAt).HasDefaultValueSql("SYSUTCDATETIME()");
    }
}
