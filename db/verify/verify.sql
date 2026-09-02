/* =============================================================================
   verify.sql  —  建置後自我檢核
   =============================================================================
   輸出單一結果集：檢查項 / 預期 / 實際 / PASS|FAIL。
   有任何 FAIL 時以 RAISERROR(16) 結束 → sqlcmd -b 回傳非 0，可直接接 CI。

   本檔同時承擔幾條「不用 trigger 擋、改為部署後查核」的斷言（Solution 固定 4 筆、
   Page 固定 29 筆），以及 docs/08 §9 DoD 第 1 條的自動化（稽核五欄）。

   ⚠ 資料庫定序 Latin1_General_100_CI_AS_SC 與伺服器／tempdb 定序不同，
     故表變數的字串欄位一律加 COLLATE DATABASE_DEFAULT。這是全專案的通則。
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
SELECT N'資料表總數（47 設計 + Newsletter + SchemaVersion）', N'49',
       CAST(COUNT(*) AS NVARCHAR(20)) FROM sys.tables;

INSERT @r (Item, Expected, Actual)
SELECT N'*I18n 多語子表數', N'16',
       CAST(COUNT(*) AS NVARCHAR(20)) FROM sys.tables WHERE name LIKE '%I18n';

INSERT @r (Item, Expected, Actual)
SELECT N'外鍵數', N'35', CAST(COUNT(*) AS NVARCHAR(20)) FROM sys.foreign_keys;

INSERT @r (Item, Expected, Actual)
SELECT N'Category 型別安全複合外鍵數', N'9', CAST(COUNT(*) AS NVARCHAR(20))
FROM sys.foreign_keys fk
WHERE fk.referenced_object_id = OBJECT_ID(N'dbo.Category')
  AND (SELECT COUNT(*) FROM sys.foreign_key_columns c WHERE c.constraint_object_id = fk.object_id) = 2;

/* 匿名約束在各環境會產生不同的隨機名稱（DF__HomeBanner__Sort__1B0907CE），
   使得「改預設值」的 migration 無法跨環境重播 → 必須為 0。 */
INSERT @r (Item, Expected, Actual)
SELECT N'匿名（系統命名）約束數', N'0', CAST(SUM(c) AS NVARCHAR(20)) FROM (
    SELECT COUNT(*) c FROM sys.key_constraints     WHERE is_system_named = 1
    UNION ALL SELECT COUNT(*) FROM sys.foreign_keys       WHERE is_system_named = 1
    UNION ALL SELECT COUNT(*) FROM sys.check_constraints  WHERE is_system_named = 1
    UNION ALL SELECT COUNT(*) FROM sys.default_constraints WHERE is_system_named = 1
) x;

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

/* docs/08 §2.5：每張 *I18n 的 PK 必須是 (主表Id, Lang) 複合鍵 */
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
      HAVING COUNT(*) = 2 AND MAX(CASE WHEN col.name = 'Lang' THEN 1 ELSE 0 END) = 1
  );

INSERT @r (Item, Expected, Actual)
SELECT N'*I18n 缺 Lang 值域 CHECK 的張數', N'0', CAST(COUNT(*) AS NVARCHAR(20))
FROM sys.tables t
WHERE t.name LIKE '%I18n'
  AND NOT EXISTS (SELECT 1 FROM sys.check_constraints ck
                  WHERE ck.parent_object_id = t.object_id AND ck.name LIKE 'CK[_]%[_]Lang');

/* ---------- 種子資料 ---------- */
INSERT @r (Item, Expected, Actual) SELECT N'Role',           N'3',  CAST(COUNT(*) AS NVARCHAR(20)) FROM dbo.Role;
INSERT @r (Item, Expected, Actual) SELECT N'RolePermission 合計', N'171', CAST(COUNT(*) AS NVARCHAR(20)) FROM dbo.RolePermission;
INSERT @r (Item, Expected, Actual) SELECT N'  └ SuperAdmin', N'83', CAST(COUNT(*) AS NVARCHAR(20)) FROM dbo.RolePermission p JOIN dbo.Role r ON r.Id = p.RoleId WHERE r.Code = 'SuperAdmin';
INSERT @r (Item, Expected, Actual) SELECT N'  └ Editor',     N'67', CAST(COUNT(*) AS NVARCHAR(20)) FROM dbo.RolePermission p JOIN dbo.Role r ON r.Id = p.RoleId WHERE r.Code = 'Editor';
INSERT @r (Item, Expected, Actual) SELECT N'  └ Viewer',     N'21', CAST(COUNT(*) AS NVARCHAR(20)) FROM dbo.RolePermission p JOIN dbo.Role r ON r.Id = p.RoleId WHERE r.Code = 'Viewer';
INSERT @r (Item, Expected, Actual) SELECT N'Category',       N'44', CAST(COUNT(*) AS NVARCHAR(20)) FROM dbo.Category;
INSERT @r (Item, Expected, Actual) SELECT N'CategoryI18n',   N'88', CAST(COUNT(*) AS NVARCHAR(20)) FROM dbo.CategoryI18n;
INSERT @r (Item, Expected, Actual) SELECT N'  └ CategoryType 種類', N'9', CAST(COUNT(DISTINCT CategoryType) AS NVARCHAR(20)) FROM dbo.Category;
INSERT @r (Item, Expected, Actual) SELECT N'SiteSetting',    N'15', CAST(COUNT(*) AS NVARCHAR(20)) FROM dbo.SiteSetting;
INSERT @r (Item, Expected, Actual) SELECT N'Page（固定 28 + 預留 csr）', N'29', CAST(COUNT(*) AS NVARCHAR(20)) FROM dbo.Page;
INSERT @r (Item, Expected, Actual) SELECT N'PageI18n',       N'58', CAST(COUNT(*) AS NVARCHAR(20)) FROM dbo.PageI18n;
INSERT @r (Item, Expected, Actual) SELECT N'  └ HasRichBody=1（privacy-legal、green-csr）', N'2', CAST(COUNT(*) AS NVARCHAR(20)) FROM dbo.Page WHERE HasRichBody = 1;
INSERT @r (Item, Expected, Actual) SELECT N'Solution（固定 4 筆）', N'4', CAST(COUNT(*) AS NVARCHAR(20)) FROM dbo.Solution;
INSERT @r (Item, Expected, Actual) SELECT N'SolutionI18n',   N'8',  CAST(COUNT(*) AS NVARCHAR(20)) FROM dbo.SolutionI18n;
INSERT @r (Item, Expected, Actual) SELECT N'SchemaVersion（已套用 migration 數）', N'3', CAST(COUNT(*) AS NVARCHAR(20)) FROM dbo.SchemaVersion;

/* docs/09 §23：系統至少保留一名啟用中的超級管理員 */
INSERT @r (Item, Expected, Actual)
SELECT N'啟用中的超級管理員', N'>=1',
       CASE WHEN COUNT(*) >= 1 THEN N'>=1' ELSE N'0' END
FROM dbo.AdminUser a JOIN dbo.Role r ON r.Id = a.RoleId
WHERE r.Code = 'SuperAdmin' AND a.IsActive = 1 AND a.IsDeleted = 0;

/* ---------- 輸出 ---------- */
SELECT Seq AS [#], Item AS [檢查項], Expected AS [預期], Actual AS [實際],
       CASE WHEN Expected = Actual THEN 'PASS' ELSE 'FAIL' END AS [結果]
FROM @r ORDER BY Seq;

DECLARE @fail INT = (SELECT COUNT(*) FROM @r WHERE Expected <> Actual);
IF @fail > 0
    RAISERROR (N'verify 失敗：%d 項不符預期（見上表 FAIL 列）。', 16, 1, @fail);
ELSE
    PRINT N'verify 全數 PASS。';
GO
