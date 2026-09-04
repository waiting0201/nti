/* =============================================================================
   verify-ef.sql  —  EF Migration 建置後的自我檢核
   =============================================================================
   輸出單一結果集：檢查項 / 預期 / 實際 / PASS|FAIL。
   有任何 FAIL 時以 RAISERROR(16) 結束 → sqlcmd -b 回傳非 0，可直接接 CI。

   與同目錄的 verify.sql 的關係
   -----------------------------------------------------------------------------
   verify.sql 檢核的是 db/migrations/ 那條路徑建出來的庫（含 SchemaVersion 表、
   由 db/seed 的腳本灌種子）。2026-09-02 起 schema 的權威來源改為 EF Migration
   （docs/10 §8），正式環境的庫由 Api 啟動時的 MigrateAsync() 建立，兩處差異：

     - SchemaVersion 由 __EFMigrationsHistory 取代（故表數仍為 49，組成不同）
     - 種子改由 Api/Data/Seed/SeedData.cs 的 HasData 寫入，筆數斷言完全相同

   斷言內容與 verify.sql 逐條對應，數字有異動時兩份要一起改。

   ⚠ filtered index 的建立與查詢都要求 QUOTED_IDENTIFIER 為 ON，執行時帶 sqlcmd -I。

   用法：
     sqlcmd -S <server> -d NTI -I -b -i db/verify/verify-ef.sql
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

DECLARE @r TABLE (
    Seq      INT IDENTITY(1,1),
    Item     NVARCHAR(80) COLLATE DATABASE_DEFAULT,
    Expected NVARCHAR(20) COLLATE DATABASE_DEFAULT,
    Actual   NVARCHAR(20) COLLATE DATABASE_DEFAULT
);

/* ---------- 結構 ---------- */
INSERT @r (Item, Expected, Actual)
SELECT N'資料表總數（48 + __EFMigrationsHistory）', N'49', CAST(COUNT(*) AS NVARCHAR(20)) FROM sys.tables;

INSERT @r (Item, Expected, Actual)
SELECT N'*I18n 多語子表數', N'16', CAST(COUNT(*) AS NVARCHAR(20)) FROM sys.tables WHERE name LIKE '%I18n';

INSERT @r (Item, Expected, Actual)
SELECT N'外鍵數', N'35', CAST(COUNT(*) AS NVARCHAR(20)) FROM sys.foreign_keys;

INSERT @r (Item, Expected, Actual)
SELECT N'Category 型別安全複合外鍵數', N'9', CAST(COUNT(*) AS NVARCHAR(20))
FROM sys.foreign_keys fk
WHERE fk.referenced_object_id = OBJECT_ID(N'dbo.Category')
  AND (SELECT COUNT(*) FROM sys.foreign_key_columns c WHERE c.constraint_object_id = fk.object_id) = 2;

INSERT @r (Item, Expected, Actual)
SELECT N'型別安全 PERSISTED 計算欄數', N'9', CAST(COUNT(*) AS NVARCHAR(20))
FROM sys.computed_columns WHERE is_persisted = 1;

/* 匿名約束在各環境會產生不同的隨機名稱（DF__HomeBanner__Sort__1B0907CE），
   使得「改預設值」的 migration 無法跨環境重播 → 必須為 0。
   EF 端由 modelBuilder.UseNamedDefaultConstraints() 保證。 */
INSERT @r (Item, Expected, Actual)
SELECT N'匿名（系統命名）約束數', N'0', CAST(SUM(c) AS NVARCHAR(20)) FROM (
    SELECT COUNT(*) c FROM sys.key_constraints     WHERE is_system_named = 1
    UNION ALL SELECT COUNT(*) FROM sys.foreign_keys        WHERE is_system_named = 1
    UNION ALL SELECT COUNT(*) FROM sys.check_constraints   WHERE is_system_named = 1
    UNION ALL SELECT COUNT(*) FROM sys.default_constraints WHERE is_system_named = 1
) x;

/* CHECK 約束 33 = 16 個 *I18n 的 Lang 值域 + 17 個狀態／型別值域 */
INSERT @r (Item, Expected, Actual)
SELECT N'CHECK 約束數', N'33', CAST(COUNT(*) AS NVARCHAR(20)) FROM sys.check_constraints;

/* 索引寧缺勿濫（Basic 5 DTU）：非 PK/UQ 的索引只有 docs/08 §5 明列的 20 條。
   EF 會自動幫每條外鍵建索引，AppDbContext 已移除該慣例——這條斷言就是在守它。 */
INSERT @r (Item, Expected, Actual)
SELECT N'非 PK/UQ 索引數', N'20', CAST(COUNT(*) AS NVARCHAR(20))
FROM sys.indexes i JOIN sys.tables t ON t.object_id = i.object_id
WHERE i.is_primary_key = 0 AND i.is_unique_constraint = 0 AND i.type > 0;

/* docs/08 §9 DoD 第 1 條：內容表具備稽核五欄 */
INSERT @r (Item, Expected, Actual)
SELECT N'內容表缺稽核五欄的張數', N'0', CAST(COUNT(*) AS NVARCHAR(20))
FROM (VALUES ('AdminUser'),('Category'),('HomeBanner'),('Solution'),('SolutionItem'),
             ('Project'),('News'),('Vlog'),('Faq'),('IndustryTrend'),('Certification'),
             ('ClientLogo'),('FacilityItem'),('JobPosting'),('SupplierNotice'),
             ('SupplierSpec'),('SupplierDownload'),('Page'),('Redirect'),
             ('QuoteRequest'),('ContactMessage'),('Member'),('Orders'),
             ('NewsletterSubscriber')) t (n)
WHERE (SELECT COUNT(*) FROM sys.columns c
       WHERE c.object_id = OBJECT_ID('dbo.' + t.n)
         AND c.name IN ('CreatedAt','CreatedBy','UpdatedAt','UpdatedBy','IsDeleted')) <> 5;

INSERT @r (Item, Expected, Actual)
SELECT N'*I18n 的 PK 非 (Id, Lang) 複合鍵的張數', N'0', CAST(COUNT(*) AS NVARCHAR(20))
FROM sys.tables t
WHERE t.name LIKE '%I18n'
  AND NOT EXISTS (
      SELECT 1 FROM sys.key_constraints k
      JOIN sys.index_columns ic ON ic.object_id = k.parent_object_id AND ic.index_id = k.unique_index_id
      JOIN sys.columns col ON col.object_id = ic.object_id AND col.column_id = ic.column_id
      WHERE k.parent_object_id = t.object_id AND k.type = 'PK'
      GROUP BY k.object_id
      HAVING COUNT(*) = 2 AND MAX(CASE WHEN col.name = 'Lang' THEN 1 ELSE 0 END) = 1);

INSERT @r (Item, Expected, Actual)
SELECT N'*I18n 缺 Lang 值域 CHECK 的張數', N'0', CAST(COUNT(*) AS NVARCHAR(20))
FROM sys.tables t
WHERE t.name LIKE '%I18n'
  AND NOT EXISTS (SELECT 1 FROM sys.check_constraints ck
                  WHERE ck.parent_object_id = t.object_id AND ck.name = 'CK_' + t.name + '_Lang');

/* ---------- 種子（Api/Data/Seed/SeedData.cs 的 HasData）---------- */
INSERT @r (Item, Expected, Actual) SELECT N'Role', N'3', CAST(COUNT(*) AS NVARCHAR(20)) FROM dbo.Role;
INSERT @r (Item, Expected, Actual) SELECT N'RolePermission 合計', N'171', CAST(COUNT(*) AS NVARCHAR(20)) FROM dbo.RolePermission;
INSERT @r (Item, Expected, Actual) SELECT N'  └ SuperAdmin', N'83', CAST(COUNT(*) AS NVARCHAR(20)) FROM dbo.RolePermission p JOIN dbo.Role r ON r.Id = p.RoleId WHERE r.Code = 'SuperAdmin';
INSERT @r (Item, Expected, Actual) SELECT N'  └ Editor',     N'67', CAST(COUNT(*) AS NVARCHAR(20)) FROM dbo.RolePermission p JOIN dbo.Role r ON r.Id = p.RoleId WHERE r.Code = 'Editor';
INSERT @r (Item, Expected, Actual) SELECT N'  └ Viewer',     N'21', CAST(COUNT(*) AS NVARCHAR(20)) FROM dbo.RolePermission p JOIN dbo.Role r ON r.Id = p.RoleId WHERE r.Code = 'Viewer';
INSERT @r (Item, Expected, Actual) SELECT N'Category',       N'44', CAST(COUNT(*) AS NVARCHAR(20)) FROM dbo.Category;
INSERT @r (Item, Expected, Actual) SELECT N'CategoryI18n',   N'88', CAST(COUNT(*) AS NVARCHAR(20)) FROM dbo.CategoryI18n;
INSERT @r (Item, Expected, Actual) SELECT N'SiteSetting',    N'15', CAST(COUNT(*) AS NVARCHAR(20)) FROM dbo.SiteSetting;
INSERT @r (Item, Expected, Actual) SELECT N'Page（固定 28 + 預留 csr）', N'29', CAST(COUNT(*) AS NVARCHAR(20)) FROM dbo.Page;
INSERT @r (Item, Expected, Actual) SELECT N'PageI18n',       N'58', CAST(COUNT(*) AS NVARCHAR(20)) FROM dbo.PageI18n;
INSERT @r (Item, Expected, Actual) SELECT N'  └ HasRichBody=1（privacy-legal、green-csr）', N'2', CAST(COUNT(*) AS NVARCHAR(20)) FROM dbo.Page WHERE HasRichBody = 1;
/* 預留的 green-csr 在客戶確認前必須是 noindex —— 這條同時守住 EF 的
   「bool 預設值為 true 時 false 存不進去」那個坑（見 AppDbContext 的說明）。 */
INSERT @r (Item, Expected, Actual) SELECT N'  └ green-csr 為 noindex', N'0', CAST(CAST(IsIndexable AS INT) AS NVARCHAR(20)) FROM dbo.Page WHERE PageKey = 'green-csr';
INSERT @r (Item, Expected, Actual) SELECT N'Solution（固定 4 筆）', N'4', CAST(COUNT(*) AS NVARCHAR(20)) FROM dbo.Solution;
INSERT @r (Item, Expected, Actual) SELECT N'  └ 皆未上架（待素材與文案）', N'4', CAST(COUNT(*) AS NVARCHAR(20)) FROM dbo.Solution WHERE IsPublished = 0;
INSERT @r (Item, Expected, Actual) SELECT N'SolutionI18n',   N'8',  CAST(COUNT(*) AS NVARCHAR(20)) FROM dbo.SolutionI18n;
INSERT @r (Item, Expected, Actual) SELECT N'已套用的 Migration 數', N'1', CAST(COUNT(*) AS NVARCHAR(20)) FROM dbo.__EFMigrationsHistory;

/* ---------- 輸出 ---------- */
SELECT Item AS [檢查項], Expected AS [預期], Actual AS [實際],
       CASE WHEN Expected = Actual THEN 'PASS' ELSE 'FAIL' END AS [結果]
FROM @r ORDER BY Seq;

DECLARE @fail INT = (SELECT COUNT(*) FROM @r WHERE Expected <> Actual);
IF @fail > 0
    RAISERROR(N'verify-ef 有 %d 項 FAIL。', 16, 1, @fail);
ELSE
    PRINT N'verify-ef 全數 PASS。';
GO
