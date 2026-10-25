/* =============================================================================
   0019_page_video_i18n.sql  —  頁面影片分語系：Page.YoutubeId → PageI18n.YoutubeId（2026-10-25）
   -----------------------------------------------------------------------------
   關於我們（about-hub）中英各一支影片；工廠導覽（facility-tour）只有中文版是影片，
   英文版改為單元 10「參觀」分類的照片輪播（Api/Common/Constants.cs 的 PageVideoPages.LangsByPage）。

   先搬值、再刪欄：0013 之後可能已經在後台換過影片。關於我們的值抄到中英兩列，
   工廠導覽只抄到中文那列。

   與 EF 那條路徑的 Api/Data/Migrations/ 下的 PageVideoI18n 一對一（schema 權威在那邊，
   見 db/README 與 docs/10 §8）。

   套用後：表數、外鍵、索引不變；Page 欄位 −1、PageI18n 欄位 +1。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

IF COL_LENGTH('dbo.PageI18n', 'YoutubeId') IS NULL
    ALTER TABLE dbo.PageI18n ADD YoutubeId VARCHAR(20) NULL;          -- YouTube 影片 ID（分語系）
GO

BEGIN TRAN;

-- 動態 SQL：重跑時 Page.YoutubeId 已經不在，直接寫會在編譯階段就失敗
IF COL_LENGTH('dbo.Page', 'YoutubeId') IS NOT NULL
BEGIN
    EXEC (N'
        UPDATE i SET i.YoutubeId = p.YoutubeId
        FROM dbo.PageI18n i
        INNER JOIN dbo.Page p ON p.Id = i.PageId
        WHERE p.YoutubeId IS NOT NULL
          AND (p.PageKey = ''about-hub'' OR (p.PageKey = ''facility-tour'' AND i.Lang = ''zh''));
        ALTER TABLE dbo.Page DROP COLUMN YoutubeId;');
END

IF NOT EXISTS (SELECT 1 FROM dbo.SchemaVersion WHERE ScriptName = N'0019_page_video_i18n.sql')
    INSERT dbo.SchemaVersion (ScriptName) VALUES (N'0019_page_video_i18n.sql');

COMMIT;
GO
