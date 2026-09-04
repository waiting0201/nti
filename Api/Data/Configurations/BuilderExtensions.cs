using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nti.Api.Models.Entities;

namespace Nti.Api.Data.Configurations;

/// <summary>
/// 重複出現的欄位組（稽核、上下架、i18n 子表、分類型別安全）的共用設定。
/// <para>
/// 抽這一層不只是為了少打字：<c>db/verify/verify.sql</c> 會斷言「內容表缺稽核五欄的張數 = 0」
/// 與「*I18n 缺 Lang 值域 CHECK 的張數 = 0」，逐表手寫遲早會漏掉一張。
/// </para>
/// </summary>
internal static class BuilderExtensions
{
    /// <summary>ASCII 欄位：<c>VARCHAR(n)</c>（狀態碼、語系、路徑碼一律非 Unicode）。</summary>
    public static PropertyBuilder<string> Ascii(this PropertyBuilder<string> p, int maxLength) =>
        p.IsUnicode(false).HasMaxLength(maxLength);

    /// <summary>可空 ASCII 欄位。</summary>
    public static PropertyBuilder<string?> AsciiNullable(this PropertyBuilder<string?> p, int maxLength) =>
        p.IsUnicode(false).HasMaxLength(maxLength);

    /// <summary>稽核五欄（docs/08 §2.3）。<c>CreatedAt</c> 的 DB 預設值為 UTC。</summary>
    public static EntityTypeBuilder<T> Audit<T>(this EntityTypeBuilder<T> b) where T : class, IAuditable
    {
        b.Property(x => x.CreatedAt).HasDefaultValueSql("SYSUTCDATETIME()");
        b.Property(x => x.IsDeleted).HasDefaultValue(false);
        return b;
    }

    /// <summary>上下架三欄（docs/08 §2.4）。<paramref name="publishedByDefault"/> 逐表對齊 DDL 的 DEFAULT。</summary>
    public static EntityTypeBuilder<T> Publishable<T>(this EntityTypeBuilder<T> b, bool publishedByDefault = true)
        where T : class, IPublishable
    {
        b.Property(x => x.IsPublished).HasDefaultValue(publishedByDefault);
        return b;
    }

    /// <summary>
    /// 多語子表：PK (<paramref name="parentIdColumn"/>, Lang)、FK 指向主表、Lang 值域 CHECK。
    /// </summary>
    public static EntityTypeBuilder<T> I18nOf<T, TParent>(
        this EntityTypeBuilder<T> b, string parentIdColumn)
        where T : class, II18n
        where TParent : class
    {
        var table  = typeof(T).Name;
        var parent = typeof(TParent).Name;

        b.ToTable(table, t => t.HasCheckConstraint($"CK_{table}_Lang", "[Lang] IN ('zh','en')"));
        b.HasKey(parentIdColumn, nameof(II18n.Lang)).HasName($"PK_{table}");
        b.Property(x => x.Lang).Ascii(5);

        b.HasOne<TParent>()
            .WithMany()
            .HasForeignKey(parentIdColumn)
            .HasConstraintName($"FK_{table}_{parent}")
            .OnDelete(DeleteBehavior.Restrict);

        return b;
    }

    /// <summary>
    /// Category 型別安全（docs/08 §4.16）：常數 PERSISTED 計算欄 + 複合 FK 指向 <c>Category(Id, CategoryType)</c>。
    /// <para>
    /// 單純的 FK 只保證「分類存在」，不保證「型別正確」——<c>News.CategoryId</c> 指到
    /// <c>CategoryType='Facility'</c> 的列不會被擋。加上這條後由 DB 層保證。
    /// <c>CategoryId</c> 可為 NULL 時複合 FK 自動不檢查（MATCH SIMPLE），故選填分類的單元不受影響。
    /// </para>
    /// </summary>
    public static EntityTypeBuilder<T> CategoryGuard<T>(
        this EntityTypeBuilder<T> b,
        string categoryType,
        string constraintName,
        string idColumn    = "CategoryId",
        string guardColumn = "CategoryTypeGuard")
        where T : class
    {
        b.Property<string>(guardColumn)
            .IsUnicode(false)
            .HasMaxLength(30)
            .HasComputedColumnSql($"CAST('{categoryType}' AS VARCHAR(30))", stored: true);

        b.HasOne<Category>()
            .WithMany()
            .HasForeignKey(idColumn, guardColumn)
            .HasPrincipalKey(nameof(Category.Id), nameof(Category.CategoryType))
            .HasConstraintName(constraintName)
            .OnDelete(DeleteBehavior.Restrict);

        return b;
    }
}
