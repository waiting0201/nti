using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nti.Api.Models.Entities;

namespace Nti.Api.Data.Configurations;

/// <summary>單元 20 order（docs/08 §4.13，P6）。資料表名 Orders——Order 是 T-SQL 保留字。</summary>
public sealed class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> b)
    {
        b.ToTable("Orders", t => t.HasCheckConstraint(
            "CK_Order_Status", "[Status] IN ('Confirmed','InProduction','Shipped','Completed','Cancelled')"));

        b.Property(x => x.OrderNo).Ascii(20);
        b.Property(x => x.Title).HasMaxLength(200);
        b.Property(x => x.Status).Ascii(20).HasDefaultValue("Confirmed");
        b.Audit();

        b.HasAlternateKey(x => x.OrderNo).HasName("UQ_Orders_OrderNo");

        b.HasOne<Member>().WithMany()
            .HasForeignKey(x => x.MemberId)
            .HasConstraintName("FK_Orders_Member")
            .OnDelete(DeleteBehavior.Restrict);

        b.HasOne<QuoteRequest>().WithMany()
            .HasForeignKey(x => x.QuoteRequestId)
            .HasConstraintName("FK_Orders_QuoteRequest")
            .OnDelete(DeleteBehavior.Restrict);

        b.HasIndex(x => new { x.MemberId, x.CreatedAt })
            .HasDatabaseName("IX_Orders_Member")
            .IsDescending(false, true);
    }
}

public sealed class OrderProgressConfiguration : IEntityTypeConfiguration<OrderProgress>
{
    public void Configure(EntityTypeBuilder<OrderProgress> b)
    {
        b.ToTable("OrderProgress", t =>
        {
            t.HasCheckConstraint("CK_OrderProgress_Stage",
                "[Stage] IN ('Design','PrePress','Printing','PostPress','QC','Shipping')");
            t.HasCheckConstraint("CK_OrderProgress_StageStatus",
                "[StageStatus] IN ('Pending','Doing','Done')");
        });

        b.Property(x => x.Stage).Ascii(20);
        b.Property(x => x.StageStatus).Ascii(20);
        b.Property(x => x.Note).HasMaxLength(400);
        b.Property(x => x.CreatedAt).HasDefaultValueSql("SYSUTCDATETIME()");

        b.HasOne<Order>().WithMany()
            .HasForeignKey(x => x.OrderId)
            .HasConstraintName("FK_OrderProgress_Orders")
            .OnDelete(DeleteBehavior.Restrict);

        b.HasIndex(x => new { x.OrderId, x.HappenedAt }).HasDatabaseName("IX_OrderProgress_Order");
    }
}
