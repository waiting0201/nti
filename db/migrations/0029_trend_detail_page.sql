/* =============================================================================
   0029_trend_detail_page.sql  —  產業趨勢分清單頁／詳細頁（2026-11-16）
   -----------------------------------------------------------------------------
   /printing-trends 改成只列標題＋摘要，點進去是 /printing-trends/{slug}。
   IndustryTrendI18n 補上與 NewsI18n 相同的 Summary＋SEO 欄位組（含 Slug），
   IndustryTrend 補 OgImagePath。既有列先給暫用 slug（trend-{Id}），正式值由
   db/content/400_trend_detail.sql 帶入。

   與 EF 那條路徑的 Api/Data/Migrations/*_TrendDetailPage 一對一（schema 權威在那邊，
   見 db/README 與 docs/10 §8）。

   套用後：IndustryTrendI18n +7 欄、IndustryTrend +1 欄、唯一索引 +1（UX_IndustryTrendI18n_Lang_Slug）。
   Slug 不設 DEFAULT：匿名約束會讓 verify 的「系統命名約束數 = 0」失敗，空字串也會馬上撞唯一索引。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

IF COL_LENGTH('dbo.IndustryTrendI18n', 'Summary') IS NULL
    ALTER TABLE dbo.IndustryTrendI18n ADD
        Summary        NVARCHAR(500) NULL,
        Slug           NVARCHAR(160) NULL,
        SeoTitle       NVARCHAR(70)  NULL,
        SeoDescription NVARCHAR(180) NULL,
        CanonicalUrl   NVARCHAR(300) NULL,
        OgTitle        NVARCHAR(90)  NULL,
        OgDescription  NVARCHAR(200) NULL;

IF COL_LENGTH('dbo.IndustryTrend', 'OgImagePath') IS NULL
    ALTER TABLE dbo.IndustryTrend ADD OgImagePath NVARCHAR(260) NULL;

COMMIT;
GO

BEGIN TRAN;

UPDATE dbo.IndustryTrendI18n
SET    Slug = CONCAT('trend-', IndustryTrendId)
WHERE  Slug IS NULL;

ALTER TABLE dbo.IndustryTrendI18n ALTER COLUMN Slug NVARCHAR(160) NOT NULL;

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_IndustryTrendI18n_Lang_Slug')
    CREATE UNIQUE INDEX UX_IndustryTrendI18n_Lang_Slug ON dbo.IndustryTrendI18n (Lang, Slug);

IF NOT EXISTS (SELECT 1 FROM dbo.SchemaVersion WHERE ScriptName = N'0029_trend_detail_page.sql')
    INSERT dbo.SchemaVersion (ScriptName) VALUES (N'0029_trend_detail_page.sql');

COMMIT;
GO
