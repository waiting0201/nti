/* =============================================================================
   280_menu_rename_oct21.sql  —  客戶 10-21 選單更名：兩個方案頁的 H1 跟著改
   -----------------------------------------------------------------------------
   客戶《NTI WEBSITE 調整》把子選單「包裝紙板」改為「包裝紙卡」、「UV印刷」改為
   「UV 印刷與特殊加工」，英文同步為 Packaging Cards／UV Printing & Special Finishes。
   選單與麵包屑寫在前台程式裡，但這兩頁的 H1 來自 SolutionI18n.H1（後台單元 02），
   不跑這支的話頁面標題會停在舊名。

   只改「還是種子值或 230 寫入值」的列，後台改過的不會被蓋掉；冪等，可直接在正式庫執行。
   方案名稱（Name，首頁方案卡與報價表單的品項）與 SEO 標題不在這次範圍，維持原值。
   ============================================================================= */
SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

/* cardboard */
UPDATE dbo.SolutionI18n SET H1 = N'包裝紙卡'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'cardboard') AND Lang = 'zh'
  AND H1 IN (N'包裝紙板', N'客製化包裝紙板');
UPDATE dbo.SolutionI18n SET H1 = N'Packaging Cards'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'cardboard') AND Lang = 'en'
  AND H1 IN (N'Packaging Paperboard', N'Custom Packaging Paperboard');

/* uv */
UPDATE dbo.SolutionI18n SET H1 = N'UV 印刷與特殊加工'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'uv') AND Lang = 'zh'
  AND H1 IN (N'UV 印刷', N'環保 UV 印刷');
UPDATE dbo.SolutionI18n SET H1 = N'UV Printing & Special Finishes'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'uv') AND Lang = 'en'
  AND H1 IN (N'UV Printing', N'Eco-Friendly UV Printing');

COMMIT;
GO
