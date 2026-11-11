/* =============================================================================
   370_cert_page_section.sql  —  認證 logo 的「認證頁區塊」初始值（客戶 2026-11-11）
   -----------------------------------------------------------------------------
   客戶要認證頁排成「區塊大標 → 文字清單 → 該區塊的 logo」。logo 的區塊存在
   Certification.PageCategoryId（EF *_CertPageSection／參考 0028），與首頁 Proof 的分組分開。

   對法：同一個關鍵字同時出現在認證名稱（英文）與某個 08b 清單項目的標題（英文）→
   logo 放到那個清單項目所在的區塊。不寫死分類代號（各環境的區塊代號由 0025 依名稱產生，未必一致）。

   冪等：只補 PageCategoryId 還是 NULL 的；後台選過的不動。對不到的維持 NULL（前台沿用首頁分組）。
   ============================================================================= */
SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

DECLARE @kw TABLE (Prio INT, Pat NVARCHAR(50));
INSERT @kw VALUES
 (10, N'%ISO 9001%'), (11, N'%ISO 14001%'), (12, N'%ISO 14064%'), (13, N'%ISO 45001%'),
 (20, N'%G7%'), (21, N'%GMI%'), (22, N'%FSC%'), (23, N'%Sedex%'),
 (30, N'%LEED%'), (31, N'%Diamond%'), (32, N'%MOF%'), (33, N'%Green Printing%'), (34, N'%ESCI%');

UPDATE c SET c.PageCategoryId = m.CategoryId
FROM dbo.Certification c
INNER JOIN dbo.CertificationI18n ci ON ci.CertificationId = c.Id AND ci.Lang = 'en'
CROSS APPLY (
    SELECT TOP 1 li.CategoryId
    FROM @kw k
    INNER JOIN dbo.CertificationListItemI18n lii ON lii.Lang = 'en' AND lii.Title LIKE k.Pat
    INNER JOIN dbo.CertificationListItem li ON li.Id = lii.CertificationListItemId AND li.IsDeleted = 0
    WHERE ci.Name LIKE k.Pat
    ORDER BY k.Prio, li.SortOrder, li.Id
) m
WHERE c.IsDeleted = 0 AND c.PageCategoryId IS NULL;

PRINT CONCAT(N'認證頁區塊已補：', @@ROWCOUNT, N' 筆');

COMMIT;
GO
