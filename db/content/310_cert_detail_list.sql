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

   ⚠ 這支不處理既有的「頁面文字」中文覆寫。那些覆寫若把區塊大標改成別的意思
     （例：GMI 區塊大標改成「紙材與油墨」），改由資料驅動後會跟底下的清單對不上，
     需在後台「頁面文字」清掉或改回。
   ============================================================================= */
SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

DECLARE @items TABLE (
    Section VARCHAR(20), SortOrder INT,
    EnTitle NVARCHAR(200), EnDesc NVARCHAR(400),
    ZhTitle NVARCHAR(200), ZhDesc NVARCHAR(400)
);

INSERT @items VALUES
 ('standards', 10, N'G7 Master Colorspace',
   N'Developed by Idealliance, a globally recognized colour calibration methodology based on ISO 12647-2, ensuring consistent, accurate colour reproduction across every print run.',
   N'G7 Master Colorspace',
   N'由Idealliance開發、以ISO 12647-2為基礎的全球公認色彩校正方法，確保每一次印刷都能呈現一致且精準的色彩重現。'),
 ('standards', 20, N'ISO 12647-2',
   N'The standard litho production procedure our colour management runs to, with spot colours matched to swatch under controlled viewing conditions.',
   N'ISO 12647-2',
   N'我們色彩管理所遵循的標準平版印刷程序，特別色在受控觀察條件下與色票比對。'),

 ('gmi', 10, N'Target', N'The retailer that commissioned the GMI audit programme.', N'Target', N'委託建立 GMI 稽核制度的零售通路。'),
 ('gmi', 20, N'Walgreens', N'Approved packaging supplier.', N'Walgreens', N'認可的包裝供應商。'),
 ('gmi', 30, N'Lowe’s', N'Approved packaging supplier.', N'Lowe’s', N'認可的包裝供應商。'),
 ('gmi', 40, N'The Home Depot (THD)', N'Approved packaging supplier.', N'The Home Depot (THD)', N'認可的包裝供應商。'),
 ('gmi', 50, N'Academy Sports + Outdoors', N'Approved packaging supplier.', N'Academy Sports + Outdoors', N'認可的包裝供應商。'),
 ('gmi', 60, N'CVS pharmacy', N'Approved packaging supplier.', N'CVS pharmacy', N'認可的包裝供應商。'),

 ('award', 10, N'Outstanding Business Award',
   N'The 13th National Brand Yushan Award for Outstanding Business Award.',
   N'傑出企業獎',
   N'第13屆國家品牌玉山獎傑出企業獎。'),
 ('award', 20, N'Smart Building Award',
   N'Gold Award in the ‘Smart Buildings’ category at the 7th APEC ESCI (Energy Smart Communities Initiative) Best Practices Awards Program.',
   N'智慧建築獎',
   N'第7屆APEC ESCI（Energy Smart Communities Initiative）最佳實務獎「智慧建築」類別金獎。');

-- 已有內容的區塊整塊跳過（後台新增或刪過的都算）
DELETE i FROM @items i
WHERE EXISTS (SELECT 1 FROM dbo.CertificationListItem t WHERE t.Section = i.Section AND t.IsDeleted = 0);

DECLARE @map TABLE (Id INT, Section VARCHAR(20), SortOrder INT);

MERGE dbo.CertificationListItem AS t
USING @items AS s ON 1 = 0
WHEN NOT MATCHED THEN INSERT (Section, SortOrder) VALUES (s.Section, s.SortOrder)
OUTPUT inserted.Id, s.Section, s.SortOrder INTO @map;

INSERT dbo.CertificationListItemI18n (CertificationListItemId, Lang, Title, Description)
SELECT m.Id, 'en', s.EnTitle, s.EnDesc FROM @map m JOIN @items s ON s.Section = m.Section AND s.SortOrder = m.SortOrder
UNION ALL
SELECT m.Id, 'zh', s.ZhTitle, s.ZhDesc FROM @map m JOIN @items s ON s.Section = m.Section AND s.SortOrder = m.SortOrder;

DECLARE @added INT = (SELECT COUNT(*) FROM @map);
PRINT CONCAT(N'清單項目新增 ', @added, N' 筆');

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
