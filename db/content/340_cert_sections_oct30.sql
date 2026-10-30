/* =============================================================================
   340_cert_sections_oct30.sql  —  認證頁改為客戶指定的七個區塊（2026-10-30）
   -----------------------------------------------------------------------------
   須先套用 EF migration CertificationListSections（standards → quality、gmi 軟刪除）。

   /about-certifications 下方清單改為七個區塊，全由 CertificationListItem 驅動
   （Certification.ShowInDetailList 從此不再使用）：

     management 管理系統 ｜ quality 色彩與印刷品質資格 ｜ material 紙材與油墨 ｜ building 廠房建築
     membership 會員與自有標章 ｜ award 獲獎記錄 ｜ partner 合作夥伴

   客戶還沒提供各區的完整內容，這裡先用網站上既有的文字排入：英文＝mockup 原文，
   中文說明＝客戶 09-30 中文稿（250）或 apps/web/src/lib/zh.ts 的譯文；中文標題與區內順序
   依客戶 10-21 在「頁面文字」打的草稿（那批覆寫填在舊清單的格子裡，10-22 清單改由資料驅動後
   就不再生效——這正是客戶反映「其他無法更改」的原因）。草稿裡的「［請提供：…］」是待補資料，
   不寫進文案。
   合作夥伴先不放（0 筆＝前台不顯示該區），獎項與合作夥伴請客戶在後台「認證頁清單項目」補。

   冪等，可直接在正式庫執行：
     - 清單項目：management／material／building／membership／partner 五個新區塊只要有任何一列
       （含已刪除的）就視為已跑過，整段不動——避免把客戶在後台刪掉的項目加回來
     - 頁面文字：只修正客戶為了「新增區塊」而誤填的三筆中文覆寫（見下方第 2 段）
   ============================================================================= */
SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

/* ── 1. 清單項目 ── */
IF EXISTS (SELECT 1 FROM dbo.CertificationListItem
           WHERE Section IN ('management','material','building','membership','partner'))
    PRINT N'新區塊已有項目（含已刪除），清單不動';
ELSE
BEGIN
    DECLARE @items TABLE (
        Section VARCHAR(20), SortOrder INT,
        EnTitle NVARCHAR(200), EnDesc NVARCHAR(400),
        ZhTitle NVARCHAR(200), ZhDesc NVARCHAR(400)
    );

    INSERT @items VALUES
     ('management', 10, N'ISO 9001 — Quality Management System',
       N'Demonstrates NTI’s commitment to consistent quality, continuous improvement, and customer satisfaction.',
       N'ISO 9001品質管理系統',
       N'展現南台彩藝對一致品質、持續改善與客戶滿意度的承諾。'),
     ('management', 20, N'ISO 14001 — Environmental Management',
       N'Demonstrates NTI’s commitment to reducing environmental impact through responsible management across every stage of production and the product lifecycle.',
       N'ISO 14001環境管理系統',
       N'展現南台彩藝在生產與產品生命週期各階段，透過負責任管理降低環境衝擊的承諾。'),
     ('management', 30, N'ISO 45001 — Occupational Health & Safety Management',
       N'Certifies NTI’s commitment to maintaining a safe, healthy workplace through effective occupational health and safety management.',
       N'ISO 45001職業安全衛生管理系統',
       N'證明南台彩藝致力於透過有效的職業健康與安全管理，維持安全健康的工作環境。'),

     ('quality', 20, N'GMI Professional Printing Certification',
       N'GMI (Graphic Measures International) verifies packaging suppliers for leading global retailers. NTI has passed GMI certification for Target, Walgreens, Lowe’s, The Home Depot, Academy Sports + Outdoors, and CVS Pharmacy.',
       N'GMI 認證',
       N'GMI（Graphic Measures International）為國際大型零售通路查核包裝供應商。南台彩藝已通過Target、Walgreens、Lowe’s、The Home Depot、Academy Sports + Outdoors與CVS Pharmacy的GMI認證。'),

     ('material', 10, N'FSC™-CoC Chain of Custody',
       N'Guarantees that certified paper materials are sourced from responsibly managed forests and verified throughout the supply chain.',
       N'FSC™ CoC 產銷監管鏈驗證',
       N'確保通過認證的紙材來自負責任管理的森林，並在整個供應鏈中受到驗證。'),
     ('material', 20, N'MOF Certified',
       N'NTI uses MOF-certified eco-friendly printing materials and inks, helping clients reduce environmental impact while meeting recognized sustainability and quality standards.',
       N'無礦物油（Mineral Oil Free）油墨',
       N'南台彩藝使用MOF認證的環保印刷材料與油墨，協助客戶在符合公認永續與品質標準的同時降低環境衝擊。'),

     ('building', 10, N'EEWH Diamond Green Building',
       N'Our Tainan headquarters holds Taiwan’s highest green building rating, EEWH Diamond, for ecology, energy saving, waste reduction and health. Valid 30 April 2024 – 29 April 2029.',
       N'綠建築鑽石級',
       N'台南總部取得台灣綠建築最高等級EEWH鑽石級標章，涵蓋生態、節能、減廢與健康四大面向，有效期2024/04/30–2029/04/29。'),
     ('building', 20, N'LEED Gold',
       N'The same building is also certified LEED Gold under the U.S. Green Building Council’s Leadership in Energy and Environmental Design rating system.',
       N'LEED 黃金級',
       N'同一棟廠房也取得美國綠建築協會LEED（能源與環境設計先導）黃金級認證。'),

     ('membership', 10, N'Sedex Member',
       N'A membership rather than a certification: NTI shares its ethical and responsible sourcing data with customers through Sedex, the global supply-chain transparency platform.',
       N'Sedex 會員',
       N'屬於會員資格而非認證：南台彩藝透過全球供應鏈透明平台Sedex，與客戶分享道德與負責任採購的相關資料。'),
     ('membership', 20, N'NTI Green Printing Certificate',
       N'Our own mark, not a third-party certification, which clients who meet its conditions of use can print on their packaging as proof of an eco-conscious printing process.',
       N'南台彩藝綠色印刷標章',
       N'南台彩藝自行建立的標章（非第三方國際認證），客戶符合使用條件時可印於包裝上，作為環保印刷製程的證明。'),

     -- 既有兩筆獎項（310 的 SortOrder 10、20）排到後面，新的兩筆排前面
     ('award', 1, N'National Sustainable Development Award',
       N'Presented by Taiwan’s National Council for Sustainable Development, recognizing NTI’s years of work on ESG and low-carbon production.',
       N'國家永續發展獎',
       N'由行政院國家永續發展委員會頒發，肯定南台彩藝多年來在ESG與低碳製程上的投入。'),
     ('award', 2, N'Global Views ESG Award 2026',
       N'Outstanding Project award in the Low-Carbon Operations, SME category, at the 22nd Global Views ESG Corporate Sustainability Awards.',
       N'2026遠見ESG企業永續獎',
       N'第22屆遠見ESG企業永續獎，中小企業組「低碳營運」傑出方案獎。');

    -- quality／award 已有的同名項目不重複加（以英文標題比對）
    DELETE s FROM @items s
    WHERE EXISTS (SELECT 1 FROM dbo.CertificationListItem t
                  JOIN dbo.CertificationListItemI18n e ON e.CertificationListItemId = t.Id AND e.Lang = 'en'
                  WHERE t.Section = s.Section AND t.IsDeleted = 0 AND e.Title = s.EnTitle);

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

    -- ISO 12647-2 已寫進 G7 的說明，不再單列（客戶指定色彩與印刷品質資格為 G7＋GMI 兩項）
    UPDATE t SET t.IsDeleted = 1, t.UpdatedAt = SYSUTCDATETIME()
    FROM dbo.CertificationListItem t
    JOIN dbo.CertificationListItemI18n e ON e.CertificationListItemId = t.Id AND e.Lang = 'en'
    WHERE t.Section = 'quality' AND t.IsDeleted = 0 AND e.Title = N'ISO 12647-2';
    PRINT CONCAT(N'ISO 12647-2 下架 ', @@ROWCOUNT, N' 筆');
END

/* ── 2. 頁面文字：還原客戶為了「新增區塊」誤填的中文覆寫 ──
   後台原本無法新增區塊，客戶把導言大標「Certifications」改成「管理系統」、導言段落改成
   條列文字（含「[請提供…]」），GMI 大標改成「紙材與油墨」。現在七個區塊各有其位，
   這三筆改回正常譯文。只動仍是那些誤填內容的列，客戶之後改過的不碰。 */
DECLARE @pid INT = (SELECT Id FROM dbo.Page WHERE PageKey = N'about-certifications');

UPDATE dbo.PageText SET Value = N'認證', UpdatedAt = SYSUTCDATETIME()
WHERE PageId = @pid AND Lang = 'zh' AND IsDeleted = 0
  AND SourceText = N'Certifications' AND Value LIKE N'%管理系統%';
PRINT CONCAT(N'還原「Certifications」大標 ', @@ROWCOUNT, N' 筆');

UPDATE dbo.PageText SET Value = N'南台彩藝持有FSC認證印刷資格與G7 Master Printer認證，並設立獨家的綠色印刷認證標章，加上曾榮獲APEC ESCI獎項的永續卓越表現肯定，是台灣認證數量最多的環保印刷製造商之一。NTI 的口碑建立在印刷品質上，客戶也以此標準要求我們。我們持續申請更多認證，讓每一位客戶都得到同樣的品質保證 —— 由外部機構稽核，而不是我們自己說了算。除了下列國際標準之外，我們也發展出 NTI 綠色印刷認證，客戶可將這個標章印在包裝上，作為環保製程的證明。',
    UpdatedAt = SYSUTCDATETIME()
WHERE PageId = @pid AND Lang = 'zh' AND IsDeleted = 0
  AND SourceText LIKE N'NTI has built its reputation on printing quality%'
  AND (LTRIM(Value) LIKE N'•%' OR Value LIKE N'%請提供%');
PRINT CONCAT(N'還原導言段落 ', @@ROWCOUNT, N' 筆');

UPDATE dbo.PageText SET Value = N'GMI 專業印刷認證', UpdatedAt = SYSUTCDATETIME()
WHERE PageId = @pid AND Lang = 'zh' AND IsDeleted = 0
  AND SourceText = N'GMI Professional Printing Certification' AND Value LIKE N'%紙材%';
PRINT CONCAT(N'還原 GMI 大標 ', @@ROWCOUNT, N' 筆');

-- 給人看：其餘仍留在本頁的中文覆寫（客戶若把清單內容貼在別的段落，這裡看得到）
SELECT SourceText AS [原文], Value AS [中文覆寫]
FROM dbo.PageText
WHERE PageId = @pid AND Lang = 'zh' AND IsDeleted = 0 AND Value LIKE N'%請提供%';

COMMIT;
GO
