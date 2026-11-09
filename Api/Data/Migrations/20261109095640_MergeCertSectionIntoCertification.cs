using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nti.Api.Data.Migrations
{
    /// <summary>
    /// 認證頁清單的區塊併回認證分類（2026-11-09）：前一支 <c>CertificationListSectionCategory</c> 另開的
    /// <c>CertSection</c> 型別，與 08 logo 的首頁 Proof 分組（<c>Certification</c>）在客戶眼中是同一套分類
    /// （名稱幾乎一樣、兩邊要改兩次），所以合併——08 與 08b 共用 <c>Certification</c>：
    /// 首頁 Proof 牆只顯示有 logo 的分類，認證頁只顯示有文字項目的分類。
    /// <para>
    /// 每個 CertSection 依序對到一個 Certification 分類（對上的保留 Proof 那邊的名稱與排序）：
    /// ① 中文名稱相同 → ② 英文名稱相同 → ③ 名稱互相包含且只有唯一一個（「綠建築認證」↔「雙綠建築認證」）
    /// → ④ 都沒有就新建，代號 <c>section-{原代號}</c>（避開 290 的 quality／eco／safety），排在既有分類之後。
    /// </para>
    /// </summary>
    public partial class MergeCertSectionIntoCertification : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                ALTER TABLE [CertificationListItem] DROP CONSTRAINT [FK_CertificationListItem_Category];
                ALTER TABLE [CertificationListItem] DROP COLUMN [CategoryTypeGuard];
                """);

            migrationBuilder.Sql("""
                DECLARE @map TABLE (SectionId INT PRIMARY KEY, TargetId INT NULL);
                DECLARE @maxSort INT = ISNULL((SELECT MAX([SortOrder]) FROM [Category]
                                               WHERE [CategoryType] = 'Certification' AND [IsDeleted] = 0), 0);

                DECLARE @sid INT, @code VARCHAR(40), @sort INT, @zh NVARCHAR(80), @en NVARCHAR(80), @target INT, @rank INT = 0;
                DECLARE cur CURSOR LOCAL FAST_FORWARD FOR
                    SELECT c.[Id], c.[Code], c.[SortOrder],
                           LTRIM(RTRIM(zh.[Name])), LTRIM(RTRIM(en.[Name]))
                    FROM [Category] c
                    LEFT JOIN [CategoryI18n] zh ON zh.[CategoryId] = c.[Id] AND zh.[Lang] = 'zh'
                    LEFT JOIN [CategoryI18n] en ON en.[CategoryId] = c.[Id] AND en.[Lang] = 'en'
                    WHERE c.[CategoryType] = 'CertSection'
                    ORDER BY c.[SortOrder], c.[Id];
                OPEN cur;
                FETCH NEXT FROM cur INTO @sid, @code, @sort, @zh, @en;
                WHILE @@FETCH_STATUS = 0
                BEGIN
                    -- 已被前面的區塊用掉的分類不再對（一對一）
                    ;WITH cand AS (
                        SELECT c.[Id], LTRIM(RTRIM(zh.[Name])) AS Zh, LTRIM(RTRIM(en.[Name])) AS En
                        FROM [Category] c
                        LEFT JOIN [CategoryI18n] zh ON zh.[CategoryId] = c.[Id] AND zh.[Lang] = 'zh'
                        LEFT JOIN [CategoryI18n] en ON en.[CategoryId] = c.[Id] AND en.[Lang] = 'en'
                        WHERE c.[CategoryType] = 'Certification' AND c.[IsDeleted] = 0
                          AND c.[Id] NOT IN (SELECT [TargetId] FROM @map WHERE [TargetId] IS NOT NULL))
                    SELECT @target = COALESCE(
                        (SELECT TOP 1 [Id] FROM cand WHERE Zh = @zh ORDER BY [Id]),
                        (SELECT TOP 1 [Id] FROM cand WHERE En = @en ORDER BY [Id]),
                        (SELECT MIN([Id]) FROM cand
                         WHERE LEN(@zh) > 0 AND LEN(Zh) > 0
                           AND (CHARINDEX(@zh, Zh) > 0 OR CHARINDEX(Zh, @zh) > 0)
                         HAVING COUNT(*) = 1));

                    IF @target IS NULL
                    BEGIN
                        SET @rank += 1;
                        DECLARE @newCode VARCHAR(40) = LEFT('section-' + @code, 40);
                        IF EXISTS (SELECT 1 FROM [Category] WHERE [CategoryType] = 'Certification' AND [Code] = @newCode)
                            SET @newCode = LEFT('section-' + @code + '-' + CAST(@sid AS VARCHAR(10)), 40);

                        INSERT [Category] ([CategoryType], [Code], [SortOrder], [IsActive], [CreatedAt], [IsDeleted])
                        SELECT 'Certification', @newCode, @maxSort + 10 * @rank, [IsActive], SYSUTCDATETIME(), 0
                        FROM [Category] WHERE [Id] = @sid;
                        SET @target = SCOPE_IDENTITY();

                        INSERT [CategoryI18n] ([CategoryId], [Lang], [Name])
                        SELECT @target, [Lang], [Name] FROM [CategoryI18n] WHERE [CategoryId] = @sid;
                    END

                    INSERT @map VALUES (@sid, @target);
                    SET @target = NULL;
                    FETCH NEXT FROM cur INTO @sid, @code, @sort, @zh, @en;
                END
                CLOSE cur; DEALLOCATE cur;

                UPDATE t SET t.[CategoryId] = m.[TargetId]
                FROM [CertificationListItem] t INNER JOIN @map m ON m.[SectionId] = t.[CategoryId];

                DELETE i FROM [CategoryI18n] i INNER JOIN [Category] c ON c.[Id] = i.[CategoryId] WHERE c.[CategoryType] = 'CertSection';
                DELETE FROM [Category] WHERE [CategoryType] = 'CertSection';
                """);

            migrationBuilder.DropCheckConstraint(
                name: "CK_Category_Type",
                table: "Category");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Category_Type",
                table: "Category",
                sql: "[CategoryType] IN ('News','Project','Vlog','Faq','Certification','Facility','SupplierNotice','Industry','QuoteMaterial')");

            migrationBuilder.Sql("""
                ALTER TABLE [CertificationListItem]
                    ADD [CategoryTypeGuard] AS CAST('Certification' AS VARCHAR(30)) PERSISTED;
                """);

            migrationBuilder.Sql("""
                ALTER TABLE [CertificationListItem] ADD CONSTRAINT [FK_CertificationListItem_Category]
                    FOREIGN KEY ([CategoryId], [CategoryTypeGuard]) REFERENCES [Category] ([Id], [CategoryType]);
                """);
        }

        /// <inheritdoc />
        /// <remarks>
        /// 反向：清單項目用到的每個認證分類，各複製一個 CertSection（代號、名稱、排序、啟用照抄）再改掛過去。
        /// 合併時新建的 section-* 認證分類留著（可能已被 08 的 logo 用到，刪不得）。
        /// </remarks>
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                ALTER TABLE [CertificationListItem] DROP CONSTRAINT [FK_CertificationListItem_Category];
                ALTER TABLE [CertificationListItem] DROP COLUMN [CategoryTypeGuard];
                """);

            migrationBuilder.DropCheckConstraint(
                name: "CK_Category_Type",
                table: "Category");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Category_Type",
                table: "Category",
                sql: "[CategoryType] IN ('News','Project','Vlog','Faq','Certification','Facility','SupplierNotice','Industry','QuoteMaterial','CertSection')");

            migrationBuilder.Sql("""
                DECLARE @map TABLE (CertId INT PRIMARY KEY, SectionId INT NULL);
                INSERT @map (CertId) SELECT DISTINCT [CategoryId] FROM [CertificationListItem];

                DECLARE @cid INT, @sid INT;
                DECLARE cur CURSOR LOCAL FAST_FORWARD FOR SELECT [CertId] FROM @map;
                OPEN cur;
                FETCH NEXT FROM cur INTO @cid;
                WHILE @@FETCH_STATUS = 0
                BEGIN
                    INSERT [Category] ([CategoryType], [Code], [SortOrder], [IsActive], [CreatedAt], [IsDeleted])
                    SELECT 'CertSection', [Code], [SortOrder], [IsActive], SYSUTCDATETIME(), [IsDeleted]
                    FROM [Category] WHERE [Id] = @cid;
                    SET @sid = SCOPE_IDENTITY();
                    INSERT [CategoryI18n] ([CategoryId], [Lang], [Name])
                    SELECT @sid, [Lang], [Name] FROM [CategoryI18n] WHERE [CategoryId] = @cid;
                    UPDATE @map SET [SectionId] = @sid WHERE [CertId] = @cid;
                    FETCH NEXT FROM cur INTO @cid;
                END
                CLOSE cur; DEALLOCATE cur;

                UPDATE t SET t.[CategoryId] = m.[SectionId]
                FROM [CertificationListItem] t INNER JOIN @map m ON m.[CertId] = t.[CategoryId];
                """);

            migrationBuilder.Sql("""
                ALTER TABLE [CertificationListItem]
                    ADD [CategoryTypeGuard] AS CAST('CertSection' AS VARCHAR(30)) PERSISTED;
                """);

            migrationBuilder.Sql("""
                ALTER TABLE [CertificationListItem] ADD CONSTRAINT [FK_CertificationListItem_Category]
                    FOREIGN KEY ([CategoryId], [CategoryTypeGuard]) REFERENCES [Category] ([Id], [CategoryType]);
                """);
        }
    }
}
