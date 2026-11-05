/* =============================================================================
   360_sustainability_goals.sql  —  ESG 頁「南台彩藝永續目標」表的初始內容（2026-11-05）
   -----------------------------------------------------------------------------
   0023／EF *_SustainabilityGoal 之後，/green-esg「企業社會責任」上方的永續目標表改由資料驅動。
   中文＝客戶 11-05 提供的清單（「SO 50001」更正為 ISO 50001）；英文＝我方翻譯
   （mockup/green-esg.html 同一份），待客戶確認。

   冪等：表裡已經有任何一筆（含後台新增的）就整批不動。
   ============================================================================= */
SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

DECLARE @items TABLE (
    SortOrder INT,
    EnGoal NVARCHAR(100), EnTimeline NVARCHAR(50),
    ZhGoal NVARCHAR(100), ZhTimeline NVARCHAR(50)
);

INSERT @items VALUES
 (10, N'Renewable energy RE60',                N'2030',             N'再生能源 RE60',         N'2030'),
 (20, N'ISO 50001 Energy Management',          N'Expected 2026',    N'ISO 50001 能源管理',    N'預計 2026'),
 (30, N'ISO 14067 Product Carbon Footprint',   N'Expected 2026',    N'ISO 14067 產品碳足跡',  N'預計 2026'),
 (40, N'Green Factory Label',                  N'Applying in 2026', N'綠色工廠標章',          N'2026 年申請'),
 (50, N'Halal certification',                  N'In progress',      N'清真認證',              N'申請中');

IF EXISTS (SELECT 1 FROM dbo.SustainabilityGoal WHERE IsDeleted = 0)
BEGIN
    PRINT N'永續目標表已有內容，不動';
END
ELSE
BEGIN
    DECLARE @map TABLE (Id INT, SortOrder INT);

    MERGE dbo.SustainabilityGoal AS t
    USING @items AS s ON 1 = 0
    WHEN NOT MATCHED THEN INSERT (SortOrder) VALUES (s.SortOrder)
    OUTPUT inserted.Id, s.SortOrder INTO @map;

    INSERT dbo.SustainabilityGoalI18n (SustainabilityGoalId, Lang, Goal, Timeline)
    SELECT m.Id, 'en', s.EnGoal, s.EnTimeline FROM @map m JOIN @items s ON s.SortOrder = m.SortOrder
    UNION ALL
    SELECT m.Id, 'zh', s.ZhGoal, s.ZhTimeline FROM @map m JOIN @items s ON s.SortOrder = m.SortOrder;

    DECLARE @added INT = (SELECT COUNT(*) FROM @map);
    PRINT CONCAT(N'永續目標表新增 ', @added, N' 列');
END

COMMIT;
GO
