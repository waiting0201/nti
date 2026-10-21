/* =============================================================================
   300_keep_en_h1.sql  —  還原 280 第一版改掉的英文 H1（2026-10-21）
   -----------------------------------------------------------------------------
   客戶確認《NTI WEBSITE 調整》只改中文、英文維持原文。280 第一版連英文 H1 一起改成
   Packaging Cards／UV Printing & Special Finishes，且已在正式庫執行；這支改回原文。

   只改「還是 280 寫入值」的列，後台另外改過的不動；冪等，可直接在正式庫執行。
   新建的庫跑的是已修正的 280（只改中文），這支對它沒有作用。
   ============================================================================= */
SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

UPDATE dbo.SolutionI18n SET H1 = N'Packaging Paperboard'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'cardboard') AND Lang = 'en'
  AND H1 = N'Packaging Cards';
PRINT CONCAT(N'cardboard 英文 H1 還原 ', @@ROWCOUNT, N' 筆');

UPDATE dbo.SolutionI18n SET H1 = N'UV Printing'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'uv') AND Lang = 'en'
  AND H1 = N'UV Printing & Special Finishes';
PRINT CONCAT(N'uv 英文 H1 還原 ', @@ROWCOUNT, N' 筆');

COMMIT;
GO
