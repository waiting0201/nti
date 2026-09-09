using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nti.Api.Data.Seed;
using Nti.Api.Models.Entities;

namespace Nti.Api.Data.Configurations;

/// <summary>單元 25 tag — 消息標籤（舊站 100 個 <c>/tag/*</c> 封存頁的落點，見 <see cref="Tag"/>）。</summary>
public sealed class TagConfiguration : IEntityTypeConfiguration<Tag>
{
    public void Configure(EntityTypeBuilder<Tag> b)
    {
        b.ToTable("Tag");

        // Slug 進網址，一律 ASCII（客戶 2026-09-08 SEO 簡報：網址避免使用中文）。
        // 160 與 NewsI18n.Slug 一致，兩者都是網址片段。
        b.Property(x => x.Slug).Ascii(160);
        b.Property(x => x.SortOrder).HasDefaultValue(0);
        b.Property(x => x.IsActive).HasDefaultValue(true);
        b.Audit();

        // 一個 slug 只能有一筆——它是前台網址的唯一鍵，重複的話 /news/tag/{slug} 沒有唯一解。
        // 篩掉軟刪的列，否則刪掉再建同名標籤會撞唯一鍵。
        b.HasIndex(x => x.Slug)
            .IsUnique()
            .HasFilter("[IsDeleted] = 0")
            .HasDatabaseName("UX_Tag_Slug");

        b.HasIndex(x => new { x.IsDeleted, x.IsActive, x.SortOrder }).HasDatabaseName("IX_Tag_List");

        b.HasData(SeedData.Tags);
    }
}

public sealed class TagI18nConfiguration : IEntityTypeConfiguration<TagI18n>
{
    public void Configure(EntityTypeBuilder<TagI18n> b)
    {
        b.I18nOf<TagI18n, Tag>(nameof(TagI18n.TagId));
        b.Property(x => x.Name).HasMaxLength(80);

        b.HasData(SeedData.TagI18ns);
    }
}

/// <summary>消息 × 標籤的關聯表。</summary>
public sealed class NewsTagConfiguration : IEntityTypeConfiguration<NewsTag>
{
    public void Configure(EntityTypeBuilder<NewsTag> b)
    {
        b.ToTable("NewsTag");
        b.HasKey(x => new { x.NewsId, x.TagId }).HasName("PK_NewsTag");

        b.HasOne<News>().WithMany().HasForeignKey(x => x.NewsId)
            .HasConstraintName("FK_NewsTag_News").OnDelete(DeleteBehavior.Cascade);

        // 標籤端不連動刪除：標籤是軟刪的，硬砍會把別人的關聯一起帶走。
        // 後台刪標籤時先解關聯（AdminTagHandler），這條 FK 是最後一道防線。
        b.HasOne<Tag>().WithMany().HasForeignKey(x => x.TagId)
            .HasConstraintName("FK_NewsTag_Tag").OnDelete(DeleteBehavior.Restrict);

        // 封存頁的查詢是「給 TagId，找 News」，所以 TagId 要能單獨走索引
        // （PK 的前導欄是 NewsId，那條吃不到）。
        b.HasIndex(x => x.TagId).HasDatabaseName("IX_NewsTag_Tag");

        // 這張表**不**用 HasData：它指向 News，而 News 不在 Migration 的種子裡
        // （12 篇 mockup 消息由 db/content/200_mockup_content.sql 匯入）。
        // 在這裡 HasData 會在 migrate 當下撞 FK_NewsTag_News。
        // 標籤與消息的關聯一併由那支產生檔輸出（tools/build-content-sql.mjs）。
    }
}
