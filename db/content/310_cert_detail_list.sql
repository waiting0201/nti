/* =============================================================================
   310_cert_detail_list.sql  —  認證頁四個清單區塊的初始內容（2026-10-22）
   -----------------------------------------------------------------------------
   0016／EF *_CertificationListItem 之後，/about-certifications 下方四個清單改由資料驅動：

     - Printing & Colour Standards（standards）、GMI 通路（gmi）、Awards（award）
       → CertificationListItem。英文＝mockup 原文；中文＝客戶 09-30 中文稿（250），
         稿裡沒有的（清單標題、ISO 12647-2、GMI 通路說明）用 apps/web/src/lib/zh.ts 的譯文
     - Management System & Environmental Certification
       → Certification.ShowInDetailList = 1（FSC、ISO 14001、ISO 9001、ISO 45001、MOF），
         以英文名稱對應——不靠 Id（各庫的 Id 不同），也不靠 LogoPath（MOF 的 logo 已在後台重新上傳）

   冪等，可直接在正式庫執行：
     - 清單項目：該區塊已經有任何一筆（含後台新增的）就整塊不動
     - ShowInDetailList：已經有任何一筆認證勾了就不動（尊重後台的選擇）
     - 認證說明：只補空的

   2026-11-09 起這支只處理認證的 ShowInDetailList 與說明；清單項目（含原本的 G7、兩筆獎項）
   移到 340，因為區塊改由認證分類驅動後，standards／gmi 這些代號已對不到任何分類。

   ⚠ 這支不處理既有的「頁面文字」中文覆寫。那些覆寫若把區塊大標改成別的意思
     （例：GMI 區塊大標改成「紙材與油墨」），改由資料驅動後會跟底下的清單對不上，
     需在後台「頁面文字」清掉或改回。
   ============================================================================= */
SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

/* 清單項目已移到 340（2026-11-09）：區塊改由認證分類驅動、代號與分類對不上之後，
   這裡原本寫入的 G7、ISO 12647-2 與兩筆獎項，改由 340 在清單整張是空的時候一次建好。 */

/* ── 管理系統與環境認證：勾選要列在說明清單的認證 ── */
DECLARE @certs TABLE (Pattern NVARCHAR(60), EnDesc NVARCHAR(400), ZhDesc NVARCHAR(400));
INSERT @certs VALUES
 (N'FSC%',
   N'Guarantees that certified paper materials are sourced from responsibly managed forests and verified throughout the supply chain.',
   N'確保通過認證的紙材來自負責任管理的森林，並在整個供應鏈中受到驗證。'),
 (N'ISO 14001%',
   N'Demonstrates NTI’s commitment to reducing environmental impact through responsible management across every stage of production and the product lifecycle.',
   N'展現南台彩藝在生產與產品生命週期各階段，透過負責任管理降低環境衝擊的承諾。'),
 (N'ISO 9001%',
   N'Demonstrates NTI’s commitment to consistent quality, continuous improvement, and customer satisfaction.',
   N'展現南台彩藝對一致品質、持續改善與客戶滿意度的承諾。'),
 (N'ISO 45001%',
   N'Certifies NTI’s commitment to maintaining a safe, healthy workplace through effective occupational health and safety management.',
   N'證明南台彩藝致力於透過有效的職業健康與安全管理，維持安全健康的工作環境。'),
 (N'Mineral Oil Free%',
   N'NTI uses MOF-certified eco-friendly printing materials and inks, helping clients reduce environmental impact while meeting recognized sustainability and quality standards.',
   N'南台彩藝使用MOF認證的環保印刷材料與油墨，協助客戶在符合公認永續與品質標準的同時降低環境衝擊。');

DECLARE @matched TABLE (CertificationId INT, EnDesc NVARCHAR(400), ZhDesc NVARCHAR(400));
INSERT @matched
SELECT t.Id, p.EnDesc, p.ZhDesc
FROM @certs p
JOIN dbo.CertificationI18n e ON e.Lang = 'en' AND e.Name LIKE p.Pattern
JOIN dbo.Certification t ON t.Id = e.CertificationId AND t.IsDeleted = 0;

IF NOT EXISTS (SELECT 1 FROM dbo.Certification WHERE ShowInDetailList = 1 AND IsDeleted = 0)
BEGIN
    UPDATE t SET t.ShowInDetailList = 1, t.UpdatedAt = SYSUTCDATETIME()
    FROM dbo.Certification t JOIN @matched m ON m.CertificationId = t.Id;
    PRINT CONCAT(N'勾選列入說明清單的認證 ', @@ROWCOUNT, N' 筆');
END
ELSE
    PRINT N'已有認證勾選列入說明清單，不動';

UPDATE i SET i.Description = m.EnDesc
FROM dbo.CertificationI18n i JOIN @matched m ON m.CertificationId = i.CertificationId
WHERE i.Lang = 'en' AND (i.Description IS NULL OR i.Description = N'');
PRINT CONCAT(N'補英文說明 ', @@ROWCOUNT, N' 筆');

UPDATE i SET i.Description = m.ZhDesc
FROM dbo.CertificationI18n i JOIN @matched m ON m.CertificationId = i.CertificationId
WHERE i.Lang = 'zh' AND (i.Description IS NULL OR i.Description = N'');
PRINT CONCAT(N'補中文說明 ', @@ROWCOUNT, N' 筆');

-- 對不到的樣式列出來（認證被改名或刪掉時，要到後台手動勾）
SELECT p.Pattern AS [未對到的認證名稱]
FROM @certs p
WHERE NOT EXISTS (SELECT 1 FROM dbo.CertificationI18n e
                  JOIN dbo.Certification t ON t.Id = e.CertificationId AND t.IsDeleted = 0
                  WHERE e.Lang = 'en' AND e.Name LIKE p.Pattern);

COMMIT;
GO
