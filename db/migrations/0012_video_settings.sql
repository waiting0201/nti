/* =============================================================================
   0012_video_settings.sql  —  頁面上的 YouTube 影片改由後台維護（2026-10-07）
   -----------------------------------------------------------------------------
   後台單元 21 setting 新增「頁面影片」群組（GroupName 'Video'），兩個 key，都存 YouTube 影片 ID：
     video.about          關於我們頁（/differences）
     video.facility_tour  工廠導覽頁（/facility-tour）
   原本寫死在頁面裡；沒填（NULL）時前台照舊顯示 mockup 的那支。
   預設值（目前那支影片）由本支直接補上，部署後不必再跑 220；只補 NULL，不蓋後台改過的值。

   與 EF 那條路徑的 Api/Data/Migrations/*_VideoSettings 一對一（schema 權威在那邊，
   見 db/README 與 docs/10 §8）。

   套用後：表數、外鍵、索引不變；CK_SiteSetting_Group 多 'Video'；SiteSetting 15 → 17 列。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

ALTER TABLE dbo.SiteSetting DROP CONSTRAINT CK_SiteSetting_Group;
ALTER TABLE dbo.SiteSetting ADD CONSTRAINT CK_SiteSetting_Group
    CHECK (GroupName IN ('Company','Social','Home','Video','Mail'));

INSERT dbo.SiteSetting (SettingKey, GroupName, ValueType, IsLocalized, SortOrder)
SELECT v.SettingKey, 'Video', 'text', 0, v.SortOrder
FROM (VALUES ('video.about', 10), ('video.facility_tour', 20)) v (SettingKey, SortOrder)
WHERE NOT EXISTS (SELECT 1 FROM dbo.SiteSetting t WHERE t.SettingKey = v.SettingKey);

/* 預設值＝原本寫死在頁面上的那支影片（與 EF migration 同一段；只補 NULL，不蓋後台改過的值） */
UPDATE dbo.SiteSetting
   SET ValueZh = N'vECuYIiFSSM', ValueEn = N'vECuYIiFSSM', UpdatedAt = SYSUTCDATETIME()
 WHERE SettingKey IN (N'video.about', N'video.facility_tour')
   AND ValueZh IS NULL AND ValueEn IS NULL;

IF NOT EXISTS (SELECT 1 FROM dbo.SchemaVersion WHERE ScriptName = N'0012_video_settings.sql')
    INSERT dbo.SchemaVersion (ScriptName) VALUES (N'0012_video_settings.sql');

COMMIT;
GO
