/* =============================================================================
   0013_page_video.sql  —  頁面影片從網站設定搬到 Page.YoutubeId（2026-10-07）
   -----------------------------------------------------------------------------
   0012 把關於我們／工廠導覽頁的影片放在網站設定（video.*）；同一天改放進後台單元 15
   「頁面設定與 SEO」該頁的編輯畫面——編輯要改一頁的東西，應該都在那一頁裡。

   先搬值、再刪 key：0012 之後可能已經在後台換過影片，直接刪等於把設定丟了。
   Page.YoutubeId 只有 about-hub、facility-tour 兩頁用（Api/Common/Constants.cs 的 PageVideoPages）。

   與 EF 那條路徑的 Api/Data/Migrations/*_PageVideo 一對一（schema 權威在那邊，
   見 db/README 與 docs/10 §8）。

   套用後：表數、外鍵、索引不變；Page 欄位 +1；CK_SiteSetting_Group 拿掉 'Video'；
   SiteSetting 17 → 15 列。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

IF COL_LENGTH('dbo.Page', 'YoutubeId') IS NULL
    ALTER TABLE dbo.Page ADD YoutubeId VARCHAR(20) NULL;              -- YouTube 影片 ID
GO

BEGIN TRAN;

UPDATE p SET p.YoutubeId = s.ValueEn
FROM dbo.Page p
INNER JOIN dbo.SiteSetting s
    ON s.SettingKey = CASE p.PageKey WHEN 'about-hub'     THEN 'video.about'
                                     WHEN 'facility-tour' THEN 'video.facility_tour' END
WHERE s.ValueEn IS NOT NULL;

DELETE dbo.SiteSetting WHERE SettingKey IN ('video.about', 'video.facility_tour');

ALTER TABLE dbo.SiteSetting DROP CONSTRAINT CK_SiteSetting_Group;
ALTER TABLE dbo.SiteSetting ADD CONSTRAINT CK_SiteSetting_Group
    CHECK (GroupName IN ('Company','Social','Home','Mail'));

IF NOT EXISTS (SELECT 1 FROM dbo.SchemaVersion WHERE ScriptName = N'0013_page_video.sql')
    INSERT dbo.SchemaVersion (ScriptName) VALUES (N'0013_page_video.sql');

COMMIT;
GO
