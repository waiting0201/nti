/* =============================================================================
   350_performance_metrics.sql  —  碳效率頁績效表的初始內容（2026-11-05）
   -----------------------------------------------------------------------------
   0022／EF *_PerformanceMetric 之後，/green-carbon「水資源」下方的績效表改由資料驅動。
   中文＝客戶 11-05 提供的表格；英文＝我方翻譯（mockup/green-carbon.html 同一份），待客戶確認。

   冪等，可直接在正式庫執行：表裡已經有任何一筆（含後台新增的）就整批不動。
   ============================================================================= */
SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

DECLARE @items TABLE (
    SortOrder INT,
    EnIndicator NVARCHAR(100), EnPeriod NVARCHAR(50), EnResult NVARCHAR(200),
    ZhIndicator NVARCHAR(100), ZhPeriod NVARCHAR(50), ZhResult NVARCHAR(200)
);

INSERT @items VALUES
 (10, N'Total GHG emissions',     N'2024',        N'2,141 tCO₂e (Scope 1: 314; Scope 2: 1,827)',
      N'溫室氣體總排放',           N'2024 年',     N'2,141 公噸 CO₂e（直接 314、能源間接 1,827）'),
 (20, N'Renewable energy target', N'2026 / 2030', N'RE24 / RE60',
      N'再生能源目標',             N'2026 / 2030', N'RE24 / RE60'),
 (30, N'Rooftop solar PV',        N'Current',     N'591.26 kWp',
      N'屋頂太陽光電',             N'現況',        N'591.26 kWp'),
 (40, N'Affordable green power',  N'From 2026',   N'205,000 kWh / year awarded',
      N'平價綠電',                 N'2026 年起',   N'得標 205,000 度 / 年');

IF EXISTS (SELECT 1 FROM dbo.PerformanceMetric WHERE IsDeleted = 0)
BEGIN
    PRINT N'績效表已有內容，不動';
END
ELSE
BEGIN
    DECLARE @map TABLE (Id INT, SortOrder INT);

    MERGE dbo.PerformanceMetric AS t
    USING @items AS s ON 1 = 0
    WHEN NOT MATCHED THEN INSERT (SortOrder) VALUES (s.SortOrder)
    OUTPUT inserted.Id, s.SortOrder INTO @map;

    INSERT dbo.PerformanceMetricI18n (PerformanceMetricId, Lang, Indicator, Period, Result)
    SELECT m.Id, 'en', s.EnIndicator, s.EnPeriod, s.EnResult FROM @map m JOIN @items s ON s.SortOrder = m.SortOrder
    UNION ALL
    SELECT m.Id, 'zh', s.ZhIndicator, s.ZhPeriod, s.ZhResult FROM @map m JOIN @items s ON s.SortOrder = m.SortOrder;

    DECLARE @added INT = (SELECT COUNT(*) FROM @map);
    PRINT CONCAT(N'績效表新增 ', @added, N' 列');
END

COMMIT;
GO
