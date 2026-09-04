/* =============================================================================
   200_mockup_content.sql  —  mockup 頁面內容匯入 CMS
   =============================================================================
   由 tools/build-content-sql.mjs 產生，**請勿手改**（重新產生：node tools/build-content-sql.mjs）。

   內容來源：mockup 目錄下的頁面（客戶已確認的設計版本）
   中文來源：tools/content-zh.mjs —— ⚠ **機器翻譯初稿，上線前必須由客戶校閱**

   冪等：每一段都先查再插，重跑不會產生重複；已存在的列會更新文字欄位。
   執行後 db/verify/verify-ef.sql 的結構斷言不受影響（本檔只動內容表）。

   ⚠ 兩個沒有憑據、刻意未翻譯的專有名詞（見 content-zh.mjs 的說明）：
      公司中文名（保留 NTI）、董事長中文姓名（用「鄭董事長」）。
   ============================================================================= */
SET NOCOUNT ON;
SET XACT_ABORT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

BEGIN TRAN;

/* ── home-banner → HomeBanner（3 筆）──────────────────────────── */
IF NOT EXISTS (SELECT 1 FROM dbo.HomeBanner WHERE ImagePath = N'assets/ref-home-banner1.png')
    INSERT dbo.HomeBanner (ImagePath, ImagePathMobile, MediaType, LinkUrl, OpenInNewTab, SortOrder, IsPublished) VALUES (N'assets/ref-home-banner1.png', NULL, 'image', N'/green-advantage', 0, 10, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.HomeBannerI18n WHERE HomeBannerId = (SELECT Id FROM dbo.HomeBanner WHERE ImagePath = N'assets/ref-home-banner1.png') AND Lang = 'zh')
    INSERT dbo.HomeBannerI18n (HomeBannerId, Lang, ImageAlt)
    VALUES ((SELECT Id FROM dbo.HomeBanner WHERE ImagePath = N'assets/ref-home-banner1.png'), 'zh', N'勇於印綠？—— NTI');
ELSE
    UPDATE dbo.HomeBannerI18n SET ImageAlt = N'勇於印綠？—— NTI' WHERE HomeBannerId = (SELECT Id FROM dbo.HomeBanner WHERE ImagePath = N'assets/ref-home-banner1.png') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.HomeBannerI18n WHERE HomeBannerId = (SELECT Id FROM dbo.HomeBanner WHERE ImagePath = N'assets/ref-home-banner1.png') AND Lang = 'en')
    INSERT dbo.HomeBannerI18n (HomeBannerId, Lang, ImageAlt)
    VALUES ((SELECT Id FROM dbo.HomeBanner WHERE ImagePath = N'assets/ref-home-banner1.png'), 'en', N'The courage to print green? — NTI Printing');
ELSE
    UPDATE dbo.HomeBannerI18n SET ImageAlt = N'The courage to print green? — NTI Printing' WHERE HomeBannerId = (SELECT Id FROM dbo.HomeBanner WHERE ImagePath = N'assets/ref-home-banner1.png') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.HomeBanner WHERE ImagePath = N'assets/ref-home-banner2.png')
    INSERT dbo.HomeBanner (ImagePath, ImagePathMobile, MediaType, LinkUrl, OpenInNewTab, SortOrder, IsPublished) VALUES (N'assets/ref-home-banner2.png', NULL, 'image', N'/solutions', 0, 20, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.HomeBannerI18n WHERE HomeBannerId = (SELECT Id FROM dbo.HomeBanner WHERE ImagePath = N'assets/ref-home-banner2.png') AND Lang = 'zh')
    INSERT dbo.HomeBannerI18n (HomeBannerId, Lang, ImageAlt)
    VALUES ((SELECT Id FROM dbo.HomeBanner WHERE ImagePath = N'assets/ref-home-banner2.png'), 'zh', N'NTI 客製化包裝印刷');
ELSE
    UPDATE dbo.HomeBannerI18n SET ImageAlt = N'NTI 客製化包裝印刷' WHERE HomeBannerId = (SELECT Id FROM dbo.HomeBanner WHERE ImagePath = N'assets/ref-home-banner2.png') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.HomeBannerI18n WHERE HomeBannerId = (SELECT Id FROM dbo.HomeBanner WHERE ImagePath = N'assets/ref-home-banner2.png') AND Lang = 'en')
    INSERT dbo.HomeBannerI18n (HomeBannerId, Lang, ImageAlt)
    VALUES ((SELECT Id FROM dbo.HomeBanner WHERE ImagePath = N'assets/ref-home-banner2.png'), 'en', N'NTI custom printed packaging solutions');
ELSE
    UPDATE dbo.HomeBannerI18n SET ImageAlt = N'NTI custom printed packaging solutions' WHERE HomeBannerId = (SELECT Id FROM dbo.HomeBanner WHERE ImagePath = N'assets/ref-home-banner2.png') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.HomeBanner WHERE ImagePath = N'assets/ref-home-mid2.png')
    INSERT dbo.HomeBanner (ImagePath, ImagePathMobile, MediaType, LinkUrl, OpenInNewTab, SortOrder, IsPublished) VALUES (N'assets/ref-home-mid2.png', NULL, 'image', N'/differences', 0, 30, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.HomeBannerI18n WHERE HomeBannerId = (SELECT Id FROM dbo.HomeBanner WHERE ImagePath = N'assets/ref-home-mid2.png') AND Lang = 'zh')
    INSERT dbo.HomeBannerI18n (HomeBannerId, Lang, ImageAlt)
    VALUES ((SELECT Id FROM dbo.HomeBanner WHERE ImagePath = N'assets/ref-home-mid2.png'), 'zh', N'NTI 台南廠海德堡印刷產線');
ELSE
    UPDATE dbo.HomeBannerI18n SET ImageAlt = N'NTI 台南廠海德堡印刷產線' WHERE HomeBannerId = (SELECT Id FROM dbo.HomeBanner WHERE ImagePath = N'assets/ref-home-mid2.png') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.HomeBannerI18n WHERE HomeBannerId = (SELECT Id FROM dbo.HomeBanner WHERE ImagePath = N'assets/ref-home-mid2.png') AND Lang = 'en')
    INSERT dbo.HomeBannerI18n (HomeBannerId, Lang, ImageAlt)
    VALUES ((SELECT Id FROM dbo.HomeBanner WHERE ImagePath = N'assets/ref-home-mid2.png'), 'en', N'NTI printing facility — Heidelberg press line in Tainan');
ELSE
    UPDATE dbo.HomeBannerI18n SET ImageAlt = N'NTI printing facility — Heidelberg press line in Tainan' WHERE HomeBannerId = (SELECT Id FROM dbo.HomeBanner WHERE ImagePath = N'assets/ref-home-mid2.png') AND Lang = 'en';

GO

/* ── solution → Solution（4 筆已由 EF 種子建立，這裡補封面與文案）────── */
UPDATE dbo.Solution SET CoverImagePath = N'assets/prod-box-gluing.jpg', IsPublished = 1 WHERE Code = N'boxes';
UPDATE dbo.SolutionI18n SET Name = N'彩盒包裝', H1 = N'客製化彩盒包裝', CoverAlt = N'NTI 客製化彩盒包裝', Slug = N'color-box-packaging', SeoTitle = N'客製化彩盒包裝'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'boxes') AND Lang = 'zh';
UPDATE dbo.SolutionI18n SET Name = N'Color Box Packaging', H1 = N'Custom Color Box Packaging', CoverAlt = N'Custom color box packaging by NTI', Slug = N'color-box-packaging', SeoTitle = N'Custom Color Box Packaging'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'boxes') AND Lang = 'en';

UPDATE dbo.Solution SET CoverImagePath = N'assets/prod-card-hangtag.jpg', IsPublished = 1 WHERE Code = N'cardboard';
UPDATE dbo.SolutionI18n SET Name = N'包裝紙板', H1 = N'客製化包裝紙板', CoverAlt = N'NTI 客製化包裝紙板', Slug = N'packaging-paperboard', SeoTitle = N'客製化包裝紙板'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'cardboard') AND Lang = 'zh';
UPDATE dbo.SolutionI18n SET Name = N'Packaging Paperboard', H1 = N'Custom Packaging Paperboard', CoverAlt = N'Custom packaging paperboard by NTI', Slug = N'packaging-paperboard', SeoTitle = N'Custom Packaging Paperboard'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'cardboard') AND Lang = 'en';

UPDATE dbo.Solution SET CoverImagePath = N'assets/prod-uv-print.jpg', IsPublished = 1 WHERE Code = N'uv';
UPDATE dbo.SolutionI18n SET Name = N'UV 印刷', H1 = N'環保 UV 印刷', CoverAlt = N'NTI 環保 UV 印刷', Slug = N'uv-printing', SeoTitle = N'環保 UV 印刷'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'uv') AND Lang = 'zh';
UPDATE dbo.SolutionI18n SET Name = N'UV Printing', H1 = N'Eco-Friendly UV Printing', CoverAlt = N'Eco-friendly UV printing by NTI', Slug = N'uv-printing', SeoTitle = N'Eco-Friendly UV Printing'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'uv') AND Lang = 'en';

UPDATE dbo.Solution SET CoverImagePath = N'assets/prod-other-bag.jpg', IsPublished = 1 WHERE Code = N'other';
UPDATE dbo.SolutionI18n SET Name = N'其他印刷', H1 = N'其他印刷服務', CoverAlt = N'NTI 其他印刷服務', Slug = N'other-printing', SeoTitle = N'其他印刷服務'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'other') AND Lang = 'zh';
UPDATE dbo.SolutionI18n SET Name = N'Other Printing', H1 = N'Other Printing Services', CoverAlt = N'Other printing services by NTI', Slug = N'other-printing', SeoTitle = N'Other Printing Services'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'other') AND Lang = 'en';

GO

/* ── solution-item → SolutionItem（15 筆）──────────────────────────── */
IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-gluing.jpg')
    INSERT dbo.SolutionItem (SolutionId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Solution WHERE Code = N'boxes'), N'assets/prod-box-gluing.jpg', 10, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItemI18n WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-gluing.jpg') AND Lang = 'zh')
    INSERT dbo.SolutionItemI18n (SolutionItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-gluing.jpg'), 'zh', N'糊盒', N'最常見的盒型 —— 上下開口、容易組裝，適合較輕的產品。', N'糊盒');
ELSE
    UPDATE dbo.SolutionItemI18n SET Name = N'糊盒', Description = N'最常見的盒型 —— 上下開口、容易組裝，適合較輕的產品。', ImageAlt = N'糊盒' WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-gluing.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItemI18n WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-gluing.jpg') AND Lang = 'en')
    INSERT dbo.SolutionItemI18n (SolutionItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-gluing.jpg'), 'en', N'Gluing Box', N'The most common box type — top and bottom open, easy to assemble, and suited to lighter products.', N'Gluing Box');
ELSE
    UPDATE dbo.SolutionItemI18n SET Name = N'Gluing Box', Description = N'The most common box type — top and bottom open, easy to assemble, and suited to lighter products.', ImageAlt = N'Gluing Box' WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-gluing.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-bottom.jpg')
    INSERT dbo.SolutionItem (SolutionId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Solution WHERE Code = N'boxes'), N'assets/prod-box-bottom.jpg', 20, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItemI18n WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-bottom.jpg') AND Lang = 'zh')
    INSERT dbo.SolutionItemI18n (SolutionItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-bottom.jpg'), 'zh', N'糊底盒', N'底部糊合可承受更大重量，同時保持易組裝 —— 較重產品的首選。', N'糊底盒');
ELSE
    UPDATE dbo.SolutionItemI18n SET Name = N'糊底盒', Description = N'底部糊合可承受更大重量，同時保持易組裝 —— 較重產品的首選。', ImageAlt = N'糊底盒' WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-bottom.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItemI18n WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-bottom.jpg') AND Lang = 'en')
    INSERT dbo.SolutionItemI18n (SolutionItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-bottom.jpg'), 'en', N'Bottom Gluing Box', N'Glued bottom carries more weight while staying easy to assemble — the choice for heavier products.', N'Bottom Gluing Box');
ELSE
    UPDATE dbo.SolutionItemI18n SET Name = N'Bottom Gluing Box', Description = N'Glued bottom carries more weight while staying easy to assemble — the choice for heavier products.', ImageAlt = N'Bottom Gluing Box' WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-bottom.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-insert.jpg')
    INSERT dbo.SolutionItem (SolutionId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Solution WHERE Code = N'boxes'), N'assets/prod-box-insert.jpg', 30, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItemI18n WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-insert.jpg') AND Lang = 'zh')
    INSERT dbo.SolutionItemI18n (SolutionItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-insert.jpg'), 'zh', N'插底盒', N'四個扣片交叉結構提升承載強度 —— 組裝容易且更經濟。', N'插底盒');
ELSE
    UPDATE dbo.SolutionItemI18n SET Name = N'插底盒', Description = N'四個扣片交叉結構提升承載強度 —— 組裝容易且更經濟。', ImageAlt = N'插底盒' WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-insert.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItemI18n WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-insert.jpg') AND Lang = 'en')
    INSERT dbo.SolutionItemI18n (SolutionItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-insert.jpg'), 'en', N'Insert Bottom Box', N'Four latches in a crossed structure add loading strength — easy to assemble and more economical.', N'Insert Bottom Box');
ELSE
    UPDATE dbo.SolutionItemI18n SET Name = N'Insert Bottom Box', Description = N'Four latches in a crossed structure add loading strength — easy to assemble and more economical.', ImageAlt = N'Insert Bottom Box' WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-insert.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-handcarry.jpg')
    INSERT dbo.SolutionItem (SolutionId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Solution WHERE Code = N'boxes'), N'assets/prod-box-handcarry.jpg', 40, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItemI18n WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-handcarry.jpg') AND Lang = 'zh')
    INSERT dbo.SolutionItemI18n (SolutionItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-handcarry.jpg'), 'zh', N'手提盒', N'糊底或交叉底並附提把 —— 不需另外提袋。常用於禮盒、蛋糕與外帶。', N'手提盒');
ELSE
    UPDATE dbo.SolutionItemI18n SET Name = N'手提盒', Description = N'糊底或交叉底並附提把 —— 不需另外提袋。常用於禮盒、蛋糕與外帶。', ImageAlt = N'手提盒' WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-handcarry.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItemI18n WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-handcarry.jpg') AND Lang = 'en')
    INSERT dbo.SolutionItemI18n (SolutionItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-handcarry.jpg'), 'en', N'Hand-Carry Box', N'Glued or crossed bottom with a built-in handle — no extra carrier bag needed. Popular for gift boxes, cakes, and takeaway.', N'Hand-Carry Box');
ELSE
    UPDATE dbo.SolutionItemI18n SET Name = N'Hand-Carry Box', Description = N'Glued or crossed bottom with a built-in handle — no extra carrier bag needed. Popular for gift boxes, cakes, and takeaway.', ImageAlt = N'Hand-Carry Box' WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-handcarry.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-topbottom.jpg')
    INSERT dbo.SolutionItem (SolutionId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Solution WHERE Code = N'boxes'), N'assets/prod-box-topbottom.jpg', 50, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItemI18n WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-topbottom.jpg') AND Lang = 'zh')
    INSERT dbo.SolutionItemI18n (SolutionItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-topbottom.jpg'), 'zh', N'天地盒', N'盒蓋與盒身分離 —— 結構較複雜，呈現典雅而高質感的效果。', N'天地盒');
ELSE
    UPDATE dbo.SolutionItemI18n SET Name = N'天地盒', Description = N'盒蓋與盒身分離 —— 結構較複雜，呈現典雅而高質感的效果。', ImageAlt = N'天地盒' WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-topbottom.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItemI18n WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-topbottom.jpg') AND Lang = 'en')
    INSERT dbo.SolutionItemI18n (SolutionItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-topbottom.jpg'), 'en', N'Top & Bottom Box', N'Separate lid and base — a more complex structure with an elegant, premium presentation.', N'Top & Bottom Box');
ELSE
    UPDATE dbo.SolutionItemI18n SET Name = N'Top & Bottom Box', Description = N'Separate lid and base — a more complex structure with an elegant, premium presentation.', ImageAlt = N'Top & Bottom Box' WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-topbottom.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-special.jpg')
    INSERT dbo.SolutionItem (SolutionId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Solution WHERE Code = N'boxes'), N'assets/prod-box-special.jpg', 60, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItemI18n WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-special.jpg') AND Lang = 'zh')
    INSERT dbo.SolutionItemI18n (SolutionItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-special.jpg'), 'zh', N'特殊盒型', N'標準型錄之外的造型，提供客製結構設計與材質建議。', N'特殊盒型');
ELSE
    UPDATE dbo.SolutionItemI18n SET Name = N'特殊盒型', Description = N'標準型錄之外的造型，提供客製結構設計與材質建議。', ImageAlt = N'特殊盒型' WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-special.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItemI18n WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-special.jpg') AND Lang = 'en')
    INSERT dbo.SolutionItemI18n (SolutionItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-special.jpg'), 'en', N'Special Package', N'Customized structural design and material suggestions for shapes beyond the standard catalogue.', N'Special Package');
ELSE
    UPDATE dbo.SolutionItemI18n SET Name = N'Special Package', Description = N'Customized structural design and material suggestions for shapes beyond the standard catalogue.', ImageAlt = N'Special Package' WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-box-special.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-card-hangtag.jpg')
    INSERT dbo.SolutionItem (SolutionId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Solution WHERE Code = N'cardboard'), N'assets/prod-card-hangtag.jpg', 10, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItemI18n WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-card-hangtag.jpg') AND Lang = 'zh')
    INSERT dbo.SolutionItemI18n (SolutionItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-card-hangtag.jpg'), 'zh', N'紙卡與吊卡底板', N'泡殼真空包裝用底板 —— 手工具、電子零件與汽車零組件。', N'紙卡與吊卡底板');
ELSE
    UPDATE dbo.SolutionItemI18n SET Name = N'紙卡與吊卡底板', Description = N'泡殼真空包裝用底板 —— 手工具、電子零件與汽車零組件。', ImageAlt = N'紙卡與吊卡底板' WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-card-hangtag.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItemI18n WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-card-hangtag.jpg') AND Lang = 'en')
    INSERT dbo.SolutionItemI18n (SolutionItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-card-hangtag.jpg'), 'en', N'Paper Hang Tags & Blister Backcards', N'Backcards for blister vacuum packaging — hand tools, electronic spare parts, and automotive components.', N'Paper Hang Tags & Blister Backcards');
ELSE
    UPDATE dbo.SolutionItemI18n SET Name = N'Paper Hang Tags & Blister Backcards', Description = N'Backcards for blister vacuum packaging — hand tools, electronic spare parts, and automotive components.', ImageAlt = N'Paper Hang Tags & Blister Backcards' WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-card-hangtag.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-card-blister.jpg')
    INSERT dbo.SolutionItem (SolutionId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Solution WHERE Code = N'cardboard'), N'assets/prod-card-blister.jpg', 20, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItemI18n WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-card-blister.jpg') AND Lang = 'zh')
    INSERT dbo.SolutionItemI18n (SolutionItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-card-blister.jpg'), 'zh', N'泡殼卡紙', N'兩張卡紙夾一個泡殼 —— 零售商品的保護型展示包裝。', N'泡殼卡紙');
ELSE
    UPDATE dbo.SolutionItemI18n SET Name = N'泡殼卡紙', Description = N'兩張卡紙夾一個泡殼 —— 零售商品的保護型展示包裝。', ImageAlt = N'泡殼卡紙' WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-card-blister.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItemI18n WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-card-blister.jpg') AND Lang = 'en')
    INSERT dbo.SolutionItemI18n (SolutionItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-card-blister.jpg'), 'en', N'Blister Cardboard', N'Two cardboards laminated with one blister — protective display packaging for retail products.', N'Blister Cardboard');
ELSE
    UPDATE dbo.SolutionItemI18n SET Name = N'Blister Cardboard', Description = N'Two cardboards laminated with one blister — protective display packaging for retail products.', ImageAlt = N'Blister Cardboard' WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-card-blister.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-uv-print.jpg')
    INSERT dbo.SolutionItem (SolutionId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Solution WHERE Code = N'uv'), N'assets/prod-uv-print.jpg', 10, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItemI18n WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-uv-print.jpg') AND Lang = 'zh')
    INSERT dbo.SolutionItemI18n (SolutionItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-uv-print.jpg'), 'zh', N'UV 印刷', N'於非吸收性材質上平版印刷 —— 油墨即時固化，後加工可立即接續，不需背印、交期更短、成本更低。', N'UV 印刷');
ELSE
    UPDATE dbo.SolutionItemI18n SET Name = N'UV 印刷', Description = N'於非吸收性材質上平版印刷 —— 油墨即時固化，後加工可立即接續，不需背印、交期更短、成本更低。', ImageAlt = N'UV 印刷' WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-uv-print.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItemI18n WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-uv-print.jpg') AND Lang = 'en')
    INSERT dbo.SolutionItemI18n (SolutionItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-uv-print.jpg'), 'en', N'UV Printing', N'Litho printing on non-absorbent materials — instant ink curing means post-finishing can start immediately, with no backprint, shorter lead times, and lower cost.', N'UV Printing');
ELSE
    UPDATE dbo.SolutionItemI18n SET Name = N'UV Printing', Description = N'Litho printing on non-absorbent materials — instant ink curing means post-finishing can start immediately, with no backprint, shorter lead times, and lower cost.', ImageAlt = N'UV Printing' WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-uv-print.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-uv-special.jpg')
    INSERT dbo.SolutionItem (SolutionId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Solution WHERE Code = N'uv'), N'assets/prod-uv-special.jpg', 20, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItemI18n WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-uv-special.jpg') AND Lang = 'zh')
    INSERT dbo.SolutionItemI18n (SolutionItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-uv-special.jpg'), 'zh', N'特殊印刷與防偽', N'燙金壓凸與光柵壓紋 —— 客製開發的加工方式，保護並提升品牌價值。', N'特殊印刷與防偽');
ELSE
    UPDATE dbo.SolutionItemI18n SET Name = N'特殊印刷與防偽', Description = N'燙金壓凸與光柵壓紋 —— 客製開發的加工方式，保護並提升品牌價值。', ImageAlt = N'特殊印刷與防偽' WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-uv-special.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItemI18n WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-uv-special.jpg') AND Lang = 'en')
    INSERT dbo.SolutionItemI18n (SolutionItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-uv-special.jpg'), 'en', N'Special Printing & Anti-Counterfeiting', N'Foil embossing and logical-light embossment — custom-developed finishes that protect and elevate your brand.', N'Special Printing & Anti-Counterfeiting');
ELSE
    UPDATE dbo.SolutionItemI18n SET Name = N'Special Printing & Anti-Counterfeiting', Description = N'Foil embossing and logical-light embossment — custom-developed finishes that protect and elevate your brand.', ImageAlt = N'Special Printing & Anti-Counterfeiting' WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-uv-special.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-other-bag.jpg')
    INSERT dbo.SolutionItem (SolutionId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Solution WHERE Code = N'other'), N'assets/prod-other-bag.jpg', 10, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItemI18n WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-other-bag.jpg') AND Lang = 'zh')
    INSERT dbo.SolutionItemI18n (SolutionItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-other-bag.jpg'), 'zh', N'手提袋', N'紙質、塑膠或織品提袋，宣傳產品並強化品牌形象。', N'手提袋');
ELSE
    UPDATE dbo.SolutionItemI18n SET Name = N'手提袋', Description = N'紙質、塑膠或織品提袋，宣傳產品並強化品牌形象。', ImageAlt = N'手提袋' WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-other-bag.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItemI18n WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-other-bag.jpg') AND Lang = 'en')
    INSERT dbo.SolutionItemI18n (SolutionItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-other-bag.jpg'), 'en', N'Hand Bags', N'Paper, plastic, or textile carrier bags that promote products and strengthen brand image.', N'Hand Bags');
ELSE
    UPDATE dbo.SolutionItemI18n SET Name = N'Hand Bags', Description = N'Paper, plastic, or textile carrier bags that promote products and strengthen brand image.', ImageAlt = N'Hand Bags' WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-other-bag.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-other-redenvelope.jpg')
    INSERT dbo.SolutionItem (SolutionId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Solution WHERE Code = N'other'), N'assets/prod-other-redenvelope.jpg', 20, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItemI18n WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-other-redenvelope.jpg') AND Lang = 'zh')
    INSERT dbo.SolutionItemI18n (SolutionItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-other-redenvelope.jpg'), 'zh', N'紅包袋', N'透過平面設計與熱燙加工創造強烈的節慶感。', N'紅包袋');
ELSE
    UPDATE dbo.SolutionItemI18n SET Name = N'紅包袋', Description = N'透過平面設計與熱燙加工創造強烈的節慶感。', ImageAlt = N'紅包袋' WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-other-redenvelope.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItemI18n WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-other-redenvelope.jpg') AND Lang = 'en')
    INSERT dbo.SolutionItemI18n (SolutionItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-other-redenvelope.jpg'), 'en', N'Red Envelopes', N'Strong seasonal impact through graphic design and heat-emboss finishing.', N'Red Envelopes');
ELSE
    UPDATE dbo.SolutionItemI18n SET Name = N'Red Envelopes', Description = N'Strong seasonal impact through graphic design and heat-emboss finishing.', ImageAlt = N'Red Envelopes' WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-other-redenvelope.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-other-calendar.jpg')
    INSERT dbo.SolutionItem (SolutionId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Solution WHERE Code = N'other'), N'assets/prod-other-calendar.jpg', 30, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItemI18n WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-other-calendar.jpg') AND Lang = 'zh')
    INSERT dbo.SolutionItemI18n (SolutionItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-other-calendar.jpg'), 'zh', N'桌曆', N'節慶、企業贈禮與廣告推廣皆適用的日常實用贈品。', N'桌曆');
ELSE
    UPDATE dbo.SolutionItemI18n SET Name = N'桌曆', Description = N'節慶、企業贈禮與廣告推廣皆適用的日常實用贈品。', ImageAlt = N'桌曆' WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-other-calendar.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItemI18n WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-other-calendar.jpg') AND Lang = 'en')
    INSERT dbo.SolutionItemI18n (SolutionItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-other-calendar.jpg'), 'en', N'Desk Calendars', N'A daily-use gift for festivals, corporate gifting, and advertising promotion.', N'Desk Calendars');
ELSE
    UPDATE dbo.SolutionItemI18n SET Name = N'Desk Calendars', Description = N'A daily-use gift for festivals, corporate gifting, and advertising promotion.', ImageAlt = N'Desk Calendars' WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-other-calendar.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-other-mousepad.jpg')
    INSERT dbo.SolutionItem (SolutionId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Solution WHERE Code = N'other'), N'assets/prod-other-mousepad.jpg', 40, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItemI18n WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-other-mousepad.jpg') AND Lang = 'zh')
    INSERT dbo.SolutionItemI18n (SolutionItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-other-mousepad.jpg'), 'zh', N'滑鼠墊', N'UV 印刷，色彩飽和且長期抗褪色。', N'滑鼠墊');
ELSE
    UPDATE dbo.SolutionItemI18n SET Name = N'滑鼠墊', Description = N'UV 印刷，色彩飽和且長期抗褪色。', ImageAlt = N'滑鼠墊' WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-other-mousepad.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItemI18n WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-other-mousepad.jpg') AND Lang = 'en')
    INSERT dbo.SolutionItemI18n (SolutionItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-other-mousepad.jpg'), 'en', N'Mouse Pads', N'UV-printed for color saturation and long-lasting fade resistance.', N'Mouse Pads');
ELSE
    UPDATE dbo.SolutionItemI18n SET Name = N'Mouse Pads', Description = N'UV-printed for color saturation and long-lasting fade resistance.', ImageAlt = N'Mouse Pads' WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-other-mousepad.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-other-manual.png')
    INSERT dbo.SolutionItem (SolutionId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Solution WHERE Code = N'other'), N'assets/prod-other-manual.png', 50, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItemI18n WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-other-manual.png') AND Lang = 'zh')
    INSERT dbo.SolutionItemI18n (SolutionItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-other-manual.png'), 'zh', N'說明書與型錄', N'產品說明書與型錄 —— 功能、用法、操作說明與注意事項。', N'說明書與型錄');
ELSE
    UPDATE dbo.SolutionItemI18n SET Name = N'說明書與型錄', Description = N'產品說明書與型錄 —— 功能、用法、操作說明與注意事項。', ImageAlt = N'說明書與型錄' WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-other-manual.png') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.SolutionItemI18n WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-other-manual.png') AND Lang = 'en')
    INSERT dbo.SolutionItemI18n (SolutionItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-other-manual.png'), 'en', N'Instructions & Catalogs', N'Product manuals and catalogs — functions, usage, instructions, and precautions.', N'Instructions & Catalogs');
ELSE
    UPDATE dbo.SolutionItemI18n SET Name = N'Instructions & Catalogs', Description = N'Product manuals and catalogs — functions, usage, instructions, and precautions.', ImageAlt = N'Instructions & Catalogs' WHERE SolutionItemId = (SELECT Id FROM dbo.SolutionItem WHERE ImagePath = N'assets/prod-other-manual.png') AND Lang = 'en';

GO

/* ── project → Project（6 筆）──────────────────────────── */
IF NOT EXISTS (SELECT 1 FROM dbo.Project WHERE ImagePath = N'assets/hp-prod0.jpg')
    INSERT dbo.Project (CategoryId, ImagePath, VideoUrl, StatValue, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Project' AND Code = 'food'), N'assets/hp-prod0.jpg', NULL, N'-32%', 10, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.ProjectI18n WHERE ProjectId = (SELECT Id FROM dbo.Project WHERE ImagePath = N'assets/hp-prod0.jpg') AND Lang = 'zh')
    INSERT dbo.ProjectI18n (ProjectId, Lang, Title, Summary, StatLabel, ImageAlt)
    VALUES ((SELECT Id FROM dbo.Project WHERE ImagePath = N'assets/hp-prod0.jpg'), 'zh', N'外銷零食彩盒 —— 每單位碳排減少 32%', N'低遷移油墨、FSC 紙板與適重結構，支援品牌拓展日本與歐盟市場。', N'碳排／單位', N'外銷零食彩盒 —— 每單位碳排減少 32%');
ELSE
    UPDATE dbo.ProjectI18n SET Title = N'外銷零食彩盒 —— 每單位碳排減少 32%', Summary = N'低遷移油墨、FSC 紙板與適重結構，支援品牌拓展日本與歐盟市場。', StatLabel = N'碳排／單位', ImageAlt = N'外銷零食彩盒 —— 每單位碳排減少 32%' WHERE ProjectId = (SELECT Id FROM dbo.Project WHERE ImagePath = N'assets/hp-prod0.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.ProjectI18n WHERE ProjectId = (SELECT Id FROM dbo.Project WHERE ImagePath = N'assets/hp-prod0.jpg') AND Lang = 'en')
    INSERT dbo.ProjectI18n (ProjectId, Lang, Title, Summary, StatLabel, ImageAlt)
    VALUES ((SELECT Id FROM dbo.Project WHERE ImagePath = N'assets/hp-prod0.jpg'), 'en', N'Export snack carton — 32% less carbon per unit', N'Migration-safe inks, FSC board and a right-weighted structure for a brand scaling into Japan and the EU.', N'carbon / unit', N'Export snack carton — 32% less carbon per unit');
ELSE
    UPDATE dbo.ProjectI18n SET Title = N'Export snack carton — 32% less carbon per unit', Summary = N'Migration-safe inks, FSC board and a right-weighted structure for a brand scaling into Japan and the EU.', StatLabel = N'carbon / unit', ImageAlt = N'Export snack carton — 32% less carbon per unit' WHERE ProjectId = (SELECT Id FROM dbo.Project WHERE ImagePath = N'assets/hp-prod0.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.Project WHERE ImagePath = N'assets/hp-prod1.jpg')
    INSERT dbo.Project (CategoryId, ImagePath, VideoUrl, StatValue, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Project' AND Code = 'pharma'), N'assets/hp-prod1.jpg', NULL, N'0', 20, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.ProjectI18n WHERE ProjectId = (SELECT Id FROM dbo.Project WHERE ImagePath = N'assets/hp-prod1.jpg') AND Lang = 'zh')
    INSERT dbo.ProjectI18n (ProjectId, Lang, Title, Summary, StatLabel, ImageAlt)
    VALUES ((SELECT Id FROM dbo.Project WHERE ImagePath = N'assets/hp-prod1.jpg'), 'zh', N'可序號追溯的藥品彩盒，隨時備查', N'符合 GMP 的檢驗流程、批次追溯與防拆結構，供應受法規監管的產線。', N'稽核缺失', N'可序號追溯的藥品彩盒，隨時備查');
ELSE
    UPDATE dbo.ProjectI18n SET Title = N'可序號追溯的藥品彩盒，隨時備查', Summary = N'符合 GMP 的檢驗流程、批次追溯與防拆結構，供應受法規監管的產線。', StatLabel = N'稽核缺失', ImageAlt = N'可序號追溯的藥品彩盒，隨時備查' WHERE ProjectId = (SELECT Id FROM dbo.Project WHERE ImagePath = N'assets/hp-prod1.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.ProjectI18n WHERE ProjectId = (SELECT Id FROM dbo.Project WHERE ImagePath = N'assets/hp-prod1.jpg') AND Lang = 'en')
    INSERT dbo.ProjectI18n (ProjectId, Lang, Title, Summary, StatLabel, ImageAlt)
    VALUES ((SELECT Id FROM dbo.Project WHERE ImagePath = N'assets/hp-prod1.jpg'), 'en', N'Serialized pharma cartons, audit-ready', N'GMP-aligned inspection, batch traceability and tamper-evident structure for a regulated line.', N'audit findings', N'Serialized pharma cartons, audit-ready');
ELSE
    UPDATE dbo.ProjectI18n SET Title = N'Serialized pharma cartons, audit-ready', Summary = N'GMP-aligned inspection, batch traceability and tamper-evident structure for a regulated line.', StatLabel = N'audit findings', ImageAlt = N'Serialized pharma cartons, audit-ready' WHERE ProjectId = (SELECT Id FROM dbo.Project WHERE ImagePath = N'assets/hp-prod1.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.Project WHERE ImagePath = N'assets/diff-box.jpg')
    INSERT dbo.Project (CategoryId, ImagePath, VideoUrl, StatValue, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Project' AND Code = 'other'), N'assets/diff-box.jpg', NULL, N'100%', 30, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.ProjectI18n WHERE ProjectId = (SELECT Id FROM dbo.Project WHERE ImagePath = N'assets/diff-box.jpg') AND Lang = 'zh')
    INSERT dbo.ProjectI18n (ProjectId, Lang, Title, Summary, StatLabel, ImageAlt)
    VALUES ((SELECT Id FROM dbo.Project WHERE ImagePath = N'assets/diff-box.jpg'), 'zh', N'單一材質改版，貨架效果不打折', N'以可回收塗層取代塑膠淋膜 —— 同樣的亮度，單一回收流。', N'可回收', N'單一材質改版，貨架效果不打折');
ELSE
    UPDATE dbo.ProjectI18n SET Title = N'單一材質改版，貨架效果不打折', Summary = N'以可回收塗層取代塑膠淋膜 —— 同樣的亮度，單一回收流。', StatLabel = N'可回收', ImageAlt = N'單一材質改版，貨架效果不打折' WHERE ProjectId = (SELECT Id FROM dbo.Project WHERE ImagePath = N'assets/diff-box.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.ProjectI18n WHERE ProjectId = (SELECT Id FROM dbo.Project WHERE ImagePath = N'assets/diff-box.jpg') AND Lang = 'en')
    INSERT dbo.ProjectI18n (ProjectId, Lang, Title, Summary, StatLabel, ImageAlt)
    VALUES ((SELECT Id FROM dbo.Project WHERE ImagePath = N'assets/diff-box.jpg'), 'en', N'Mono-material redesign kept the shelf wow', N'Replaced plastic lamination with a recyclable coating — same gloss, single recycling stream.', N'recyclable', N'Mono-material redesign kept the shelf wow');
ELSE
    UPDATE dbo.ProjectI18n SET Title = N'Mono-material redesign kept the shelf wow', Summary = N'Replaced plastic lamination with a recyclable coating — same gloss, single recycling stream.', StatLabel = N'recyclable', ImageAlt = N'Mono-material redesign kept the shelf wow' WHERE ProjectId = (SELECT Id FROM dbo.Project WHERE ImagePath = N'assets/diff-box.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.Project WHERE ImagePath = N'assets/hp-prod2.jpg')
    INSERT dbo.Project (CategoryId, ImagePath, VideoUrl, StatValue, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Project' AND Code = 'gift'), N'assets/hp-prod2.jpg', NULL, N'ΔE≤2', 40, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.ProjectI18n WHERE ProjectId = (SELECT Id FROM dbo.Project WHERE ImagePath = N'assets/hp-prod2.jpg') AND Lang = 'zh')
    INSERT dbo.ProjectI18n (ProjectId, Lang, Title, Summary, StatLabel, ImageAlt)
    VALUES ((SELECT Id FROM dbo.Project WHERE ImagePath = N'assets/hp-prod2.jpg'), 'zh', N'節慶禮盒的量產級燙金與壓凸', N'40 萬個單位的燙金與觸感塗層，整批色差控制在 ΔE ≤ 2。', N'色差容許值', N'節慶禮盒的量產級燙金與壓凸');
ELSE
    UPDATE dbo.ProjectI18n SET Title = N'節慶禮盒的量產級燙金與壓凸', Summary = N'40 萬個單位的燙金與觸感塗層，整批色差控制在 ΔE ≤ 2。', StatLabel = N'色差容許值', ImageAlt = N'節慶禮盒的量產級燙金與壓凸' WHERE ProjectId = (SELECT Id FROM dbo.Project WHERE ImagePath = N'assets/hp-prod2.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.ProjectI18n WHERE ProjectId = (SELECT Id FROM dbo.Project WHERE ImagePath = N'assets/hp-prod2.jpg') AND Lang = 'en')
    INSERT dbo.ProjectI18n (ProjectId, Lang, Title, Summary, StatLabel, ImageAlt)
    VALUES ((SELECT Id FROM dbo.Project WHERE ImagePath = N'assets/hp-prod2.jpg'), 'en', N'Holiday gift set with foil + emboss at volume', N'Hot foil and tactile coating across 400k units with color held to ΔE ≤ 2 through the run.', N'color tolerance', N'Holiday gift set with foil + emboss at volume');
ELSE
    UPDATE dbo.ProjectI18n SET Title = N'Holiday gift set with foil + emboss at volume', Summary = N'Hot foil and tactile coating across 400k units with color held to ΔE ≤ 2 through the run.', StatLabel = N'color tolerance', ImageAlt = N'Holiday gift set with foil + emboss at volume' WHERE ProjectId = (SELECT Id FROM dbo.Project WHERE ImagePath = N'assets/hp-prod2.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.Project WHERE ImagePath = N'assets/ps-box1.jpg')
    INSERT dbo.Project (CategoryId, ImagePath, VideoUrl, StatValue, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Project' AND Code = 'food'), N'assets/ps-box1.jpg', NULL, N'-18°C', 50, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.ProjectI18n WHERE ProjectId = (SELECT Id FROM dbo.Project WHERE ImagePath = N'assets/ps-box1.jpg') AND Lang = 'zh')
    INSERT dbo.ProjectI18n (ProjectId, Lang, Title, Summary, StatLabel, ImageAlt)
    VALUES ((SELECT Id FROM dbo.Project WHERE ImagePath = N'assets/ps-box1.jpg'), 'zh', N'撐得住冷鏈的冷凍食品紙板', N'抗濕塗層與楞型選擇，經運輸與冷凍測試驗證。', N'已驗證', N'撐得住冷鏈的冷凍食品紙板');
ELSE
    UPDATE dbo.ProjectI18n SET Title = N'撐得住冷鏈的冷凍食品紙板', Summary = N'抗濕塗層與楞型選擇，經運輸與冷凍測試驗證。', StatLabel = N'已驗證', ImageAlt = N'撐得住冷鏈的冷凍食品紙板' WHERE ProjectId = (SELECT Id FROM dbo.Project WHERE ImagePath = N'assets/ps-box1.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.ProjectI18n WHERE ProjectId = (SELECT Id FROM dbo.Project WHERE ImagePath = N'assets/ps-box1.jpg') AND Lang = 'en')
    INSERT dbo.ProjectI18n (ProjectId, Lang, Title, Summary, StatLabel, ImageAlt)
    VALUES ((SELECT Id FROM dbo.Project WHERE ImagePath = N'assets/ps-box1.jpg'), 'en', N'Frozen-food board that survives the cold chain', N'Moisture-resistant coating and flute selection validated with transit and freezer testing.', N'validated', N'Frozen-food board that survives the cold chain');
ELSE
    UPDATE dbo.ProjectI18n SET Title = N'Frozen-food board that survives the cold chain', Summary = N'Moisture-resistant coating and flute selection validated with transit and freezer testing.', StatLabel = N'validated', ImageAlt = N'Frozen-food board that survives the cold chain' WHERE ProjectId = (SELECT Id FROM dbo.Project WHERE ImagePath = N'assets/ps-box1.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.Project WHERE ImagePath = N'assets/hp-casestudy.jpg')
    INSERT dbo.Project (CategoryId, ImagePath, VideoUrl, StatValue, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Project' AND Code = 'other'), N'assets/hp-casestudy.jpg', NULL, N'96%', 60, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.ProjectI18n WHERE ProjectId = (SELECT Id FROM dbo.Project WHERE ImagePath = N'assets/hp-casestudy.jpg') AND Lang = 'zh')
    INSERT dbo.ProjectI18n (ProjectId, Lang, Title, Summary, StatLabel, ImageAlt)
    VALUES ((SELECT Id FROM dbo.Project WHERE ImagePath = N'assets/hp-casestudy.jpg'), 'zh', N'D2C 品牌的大豆油墨瓦楞出貨箱', N'再生牛皮紙一次過機柔版印刷，內外雙面印刷打造開箱體驗。', N'再生纖維', N'D2C 品牌的大豆油墨瓦楞出貨箱');
ELSE
    UPDATE dbo.ProjectI18n SET Title = N'D2C 品牌的大豆油墨瓦楞出貨箱', Summary = N'再生牛皮紙一次過機柔版印刷，內外雙面印刷打造開箱體驗。', StatLabel = N'再生纖維', ImageAlt = N'D2C 品牌的大豆油墨瓦楞出貨箱' WHERE ProjectId = (SELECT Id FROM dbo.Project WHERE ImagePath = N'assets/hp-casestudy.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.ProjectI18n WHERE ProjectId = (SELECT Id FROM dbo.Project WHERE ImagePath = N'assets/hp-casestudy.jpg') AND Lang = 'en')
    INSERT dbo.ProjectI18n (ProjectId, Lang, Title, Summary, StatLabel, ImageAlt)
    VALUES ((SELECT Id FROM dbo.Project WHERE ImagePath = N'assets/hp-casestudy.jpg'), 'en', N'Soy-ink corrugated shipper for a D2C brand', N'One-pass flexo on recycled kraft, printed inside and out for an unboxing moment.', N'recycled fiber', N'Soy-ink corrugated shipper for a D2C brand');
ELSE
    UPDATE dbo.ProjectI18n SET Title = N'Soy-ink corrugated shipper for a D2C brand', Summary = N'One-pass flexo on recycled kraft, printed inside and out for an unboxing moment.', StatLabel = N'recycled fiber', ImageAlt = N'Soy-ink corrugated shipper for a D2C brand' WHERE ProjectId = (SELECT Id FROM dbo.Project WHERE ImagePath = N'assets/hp-casestudy.jpg') AND Lang = 'en';

GO

/* ── news → News（12 筆）──────────────────────────── */
IF NOT EXISTS (SELECT 1 FROM dbo.News WHERE CoverImagePath = N'assets/news/global-views-esg-award.jpg')
    INSERT dbo.News (CategoryId, PublishDate, CoverImagePath, IsFeaturedHome, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'News' AND Code = 'awards'), N'2026-06-30', N'assets/news/global-views-esg-award.jpg', 1, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.NewsI18n WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/global-views-esg-award.jpg') AND Lang = 'zh')
    INSERT dbo.NewsI18n (NewsId, Lang, Title, Summary, BodyHtml, CoverAlt, Slug, SeoTitle)
    VALUES ((SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/global-views-esg-award.jpg'), 'zh', N'NTI 以低碳營運獲頒 2026 遠見 ESG 企業永續獎', N'第 22 屆遠見 ESG 企業永續獎 5 月 7 日於台北香格里拉遠東國際大飯店舉行，NTI 以「低碳營運．中小企業組」獲得傑出方案獎。', N'<p>頒獎典禮由遠見雜誌主辦，環境部長彭啓明等貴賓出席，見證台灣企業在永續轉型上的進展。</p><p>遠見 ESG 獎是台灣歷史最久、也最具代表性的永續獎項之一。今年共有 142 家企業、239 件方案參賽，最終僅 57 家企業、81 件方案獲獎。NTI 是少數同時獲邀受訪並收錄於典禮影片的得獎者。</p><p>NTI 長期投入綠色印刷、綠色包裝、智慧物流、低碳材料與印刷技術。從同時取得 LEED 黃金級與 EEWH 鑽石級綠建築認證的廠房，到綠電、智慧製程管理、低碳供應鏈協作與製程減碳，目標始終是把永續從願景書上的一句話，落到每一道製程、每一項服務、每一個包裝上。</p><p>低碳不只是企業責任，也是競爭力。對包裝印刷而言，永續不只是少用能源、少排碳，而是把設計、材料、製程與管理整合起來，讓客戶同時拿到品質、效率與環境價值。</p><p>在低碳營運之外，NTI 也持續推動 ESG 紙藝文化教育計畫，結合綠色印刷與文創內容夥伴，投入生態保育、防災教育與海洋保育的合作 —— 讓永續從製造延伸到教育、文化與公眾參與。</p><p>典禮上，適逢 90 歲生日的遠見創辦人高希均教授說，無論 ESG 怎麼演進，說到底就是一件事：把事情做對。推動 ESG 靠的不只是設備與制度，而是每一位同仁在日常工作裡一點一點累積起來的。</p>', N'NTI 以低碳營運獲頒 2026 遠見 ESG 企業永續獎', N'global-views-esg-award-zh', N'NTI 獲頒 2026 遠見 ESG 企業永續獎');
ELSE
    UPDATE dbo.NewsI18n SET Title = N'NTI 以低碳營運獲頒 2026 遠見 ESG 企業永續獎', Summary = N'第 22 屆遠見 ESG 企業永續獎 5 月 7 日於台北香格里拉遠東國際大飯店舉行，NTI 以「低碳營運．中小企業組」獲得傑出方案獎。', BodyHtml = N'<p>頒獎典禮由遠見雜誌主辦，環境部長彭啓明等貴賓出席，見證台灣企業在永續轉型上的進展。</p><p>遠見 ESG 獎是台灣歷史最久、也最具代表性的永續獎項之一。今年共有 142 家企業、239 件方案參賽，最終僅 57 家企業、81 件方案獲獎。NTI 是少數同時獲邀受訪並收錄於典禮影片的得獎者。</p><p>NTI 長期投入綠色印刷、綠色包裝、智慧物流、低碳材料與印刷技術。從同時取得 LEED 黃金級與 EEWH 鑽石級綠建築認證的廠房，到綠電、智慧製程管理、低碳供應鏈協作與製程減碳，目標始終是把永續從願景書上的一句話，落到每一道製程、每一項服務、每一個包裝上。</p><p>低碳不只是企業責任，也是競爭力。對包裝印刷而言，永續不只是少用能源、少排碳，而是把設計、材料、製程與管理整合起來，讓客戶同時拿到品質、效率與環境價值。</p><p>在低碳營運之外，NTI 也持續推動 ESG 紙藝文化教育計畫，結合綠色印刷與文創內容夥伴，投入生態保育、防災教育與海洋保育的合作 —— 讓永續從製造延伸到教育、文化與公眾參與。</p><p>典禮上，適逢 90 歲生日的遠見創辦人高希均教授說，無論 ESG 怎麼演進，說到底就是一件事：把事情做對。推動 ESG 靠的不只是設備與制度，而是每一位同仁在日常工作裡一點一點累積起來的。</p>', CoverAlt = N'NTI 以低碳營運獲頒 2026 遠見 ESG 企業永續獎', Slug = N'global-views-esg-award-zh', SeoTitle = N'NTI 獲頒 2026 遠見 ESG 企業永續獎' WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/global-views-esg-award.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.NewsI18n WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/global-views-esg-award.jpg') AND Lang = 'en')
    INSERT dbo.NewsI18n (NewsId, Lang, Title, Summary, BodyHtml, CoverAlt, Slug, SeoTitle)
    VALUES ((SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/global-views-esg-award.jpg'), 'en', N'NTI wins a 2026 Global Views ESG Award for low-carbon operations', N'The 22nd Global Views ESG Corporate Sustainability Awards were held on 7 May at the Shangri-La Far Eastern Plaza Hotel, Taipei. NTI took the Outstanding Project award in the Low-Carbon Operations, SME category.', N'<p>The ceremony was hosted by Global Views Magazine, with Minister of Environment Peng Chi-Ming among the guests, marking the progress Taiwanese companies have made on sustainable transition.</p><p>The Global Views ESG award is one of Taiwan’s longest-running and most representative sustainability prizes. This year 142 companies entered 239 projects; only 57 companies and 81 entries won. NTI was among the small number of winners also featured in an interview and in the ceremony film.</p><p>NTI has invested consistently in green printing, green packaging, smart logistics, low-carbon materials and printing technology. From a factory holding both LEED Gold and EEWH Diamond green building certification, through to green electricity, smart process management, low-carbon supply-chain collaboration and process-level carbon reduction, the aim has been to move sustainability out of the mission statement and into every process, every service and every pack.</p><p>Low carbon is not only a corporate responsibility — it is competitiveness. For packaging printing, sustainability is not just using less energy and emitting less carbon; it is integrating design, materials, process and management so clients get packaging that delivers on quality, efficiency and environmental value at the same time.</p><p>Alongside low-carbon operations, NTI has been building an ESG paper-craft cultural education programme, combining green printing with creative content partners on work that promotes ecological conservation, disaster-prevention education and marine conservation — extending sustainability from manufacturing into education, culture and public participation.</p><p>At the ceremony, Global Views founder Professor Charles Kao — on his 90th birthday — said that however ESG evolves, it comes down to one thing: doing things right. Driving ESG takes more than equipment and systems; it takes every colleague building on it in daily work.</p>', N'NTI wins a 2026 Global Views ESG Award for low-carbon operations', N'global-views-esg-award', N'NTI wins a 2026 Global Views ESG Award for low-carbon operations');
ELSE
    UPDATE dbo.NewsI18n SET Title = N'NTI wins a 2026 Global Views ESG Award for low-carbon operations', Summary = N'The 22nd Global Views ESG Corporate Sustainability Awards were held on 7 May at the Shangri-La Far Eastern Plaza Hotel, Taipei. NTI took the Outstanding Project award in the Low-Carbon Operations, SME category.', BodyHtml = N'<p>The ceremony was hosted by Global Views Magazine, with Minister of Environment Peng Chi-Ming among the guests, marking the progress Taiwanese companies have made on sustainable transition.</p><p>The Global Views ESG award is one of Taiwan’s longest-running and most representative sustainability prizes. This year 142 companies entered 239 projects; only 57 companies and 81 entries won. NTI was among the small number of winners also featured in an interview and in the ceremony film.</p><p>NTI has invested consistently in green printing, green packaging, smart logistics, low-carbon materials and printing technology. From a factory holding both LEED Gold and EEWH Diamond green building certification, through to green electricity, smart process management, low-carbon supply-chain collaboration and process-level carbon reduction, the aim has been to move sustainability out of the mission statement and into every process, every service and every pack.</p><p>Low carbon is not only a corporate responsibility — it is competitiveness. For packaging printing, sustainability is not just using less energy and emitting less carbon; it is integrating design, materials, process and management so clients get packaging that delivers on quality, efficiency and environmental value at the same time.</p><p>Alongside low-carbon operations, NTI has been building an ESG paper-craft cultural education programme, combining green printing with creative content partners on work that promotes ecological conservation, disaster-prevention education and marine conservation — extending sustainability from manufacturing into education, culture and public participation.</p><p>At the ceremony, Global Views founder Professor Charles Kao — on his 90th birthday — said that however ESG evolves, it comes down to one thing: doing things right. Driving ESG takes more than equipment and systems; it takes every colleague building on it in daily work.</p>', CoverAlt = N'NTI wins a 2026 Global Views ESG Award for low-carbon operations', Slug = N'global-views-esg-award', SeoTitle = N'NTI wins a 2026 Global Views ESG Award for low-carbon operations' WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/global-views-esg-award.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.News WHERE CoverImagePath = N'assets/news/firefighter-boardgame.jpg')
    INSERT dbo.News (CategoryId, PublishDate, CoverImagePath, IsFeaturedHome, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'News' AND Code = 'esg'), N'2026-03-13', N'assets/news/firefighter-boardgame.jpg', 0, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.NewsI18n WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/firefighter-boardgame.jpg') AND Lang = 'zh')
    INSERT dbo.NewsI18n (NewsId, Lang, Title, Summary, BodyHtml, CoverAlt, Slug, SeoTitle)
    VALUES ((SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/firefighter-boardgame.jpg'), 'zh', N'NTI 捐贈紙模桌遊，推廣防災教育', N'這款桌遊把消防救災情境轉成體驗式學習 —— 把消防知識變成一家人可以一起玩過一遍的材料。採 FSC 驗證紙材與低碳印刷製程，物件本身就是訊息。', N'<p>這款桌遊把消防救災情境轉成體驗式學習 —— 把消防知識變成一家人可以一起玩過一遍的材料。採 FSC 驗證紙材與低碳印刷製程，物件本身就是訊息。</p><p>遊戲以救災情境為主軸，結合紙模型與桌遊玩法，讓玩家在組裝與遊玩的過程中吸收安全知識，而不是讀完一份說明。</p><p>環保驗證紙材與低碳印刷降低了生產過程的環境負荷，讓成品同時具備教育價值與環境責任。</p><p>NTI 投入綠色印刷與永續製造多年。這個專案與其說是一款桌遊，不如說是一次示範：企業用自己的核心技術能力，回應一個社會需求。</p>', N'NTI 捐贈紙模桌遊，推廣防災教育', N'firefighter-boardgame-zh', NULL);
ELSE
    UPDATE dbo.NewsI18n SET Title = N'NTI 捐贈紙模桌遊，推廣防災教育', Summary = N'這款桌遊把消防救災情境轉成體驗式學習 —— 把消防知識變成一家人可以一起玩過一遍的材料。採 FSC 驗證紙材與低碳印刷製程，物件本身就是訊息。', BodyHtml = N'<p>這款桌遊把消防救災情境轉成體驗式學習 —— 把消防知識變成一家人可以一起玩過一遍的材料。採 FSC 驗證紙材與低碳印刷製程，物件本身就是訊息。</p><p>遊戲以救災情境為主軸，結合紙模型與桌遊玩法，讓玩家在組裝與遊玩的過程中吸收安全知識，而不是讀完一份說明。</p><p>環保驗證紙材與低碳印刷降低了生產過程的環境負荷，讓成品同時具備教育價值與環境責任。</p><p>NTI 投入綠色印刷與永續製造多年。這個專案與其說是一款桌遊，不如說是一次示範：企業用自己的核心技術能力，回應一個社會需求。</p>', CoverAlt = N'NTI 捐贈紙模桌遊，推廣防災教育', Slug = N'firefighter-boardgame-zh', SeoTitle = NULL WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/firefighter-boardgame.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.NewsI18n WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/firefighter-boardgame.jpg') AND Lang = 'en')
    INSERT dbo.NewsI18n (NewsId, Lang, Title, Summary, BodyHtml, CoverAlt, Slug, SeoTitle)
    VALUES ((SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/firefighter-boardgame.jpg'), 'en', N'NTI donates a paper-model board game promoting disaster-prevention education', N'The game turns fire and rescue scenarios into experiential learning — converting firefighting knowledge into material families can work through together. It is produced on FSC-certified paper using a low-carbon printing process, so the object itself carries the message.', N'<p>The game turns fire and rescue scenarios into experiential learning — converting firefighting knowledge into material families can work through together. It is produced on FSC-certified paper using a low-carbon printing process, so the object itself carries the message.</p><p>Built around rescue scenarios, the game combines paper modelling with board-game play so that players absorb the safety content while assembling and playing rather than reading it.</p><p>Eco-certified paper stock and low-carbon printing reduce the environmental load of production, giving the finished product both educational value and environmental responsibility.</p><p>NTI has worked on green printing and sustainable manufacturing for years. This project is less a board game than a demonstration of what happens when a company answers a social need with its own core technical capability.</p>', N'NTI donates a paper-model board game promoting disaster-prevention education', N'firefighter-boardgame', NULL);
ELSE
    UPDATE dbo.NewsI18n SET Title = N'NTI donates a paper-model board game promoting disaster-prevention education', Summary = N'The game turns fire and rescue scenarios into experiential learning — converting firefighting knowledge into material families can work through together. It is produced on FSC-certified paper using a low-carbon printing process, so the object itself carries the message.', BodyHtml = N'<p>The game turns fire and rescue scenarios into experiential learning — converting firefighting knowledge into material families can work through together. It is produced on FSC-certified paper using a low-carbon printing process, so the object itself carries the message.</p><p>Built around rescue scenarios, the game combines paper modelling with board-game play so that players absorb the safety content while assembling and playing rather than reading it.</p><p>Eco-certified paper stock and low-carbon printing reduce the environmental load of production, giving the finished product both educational value and environmental responsibility.</p><p>NTI has worked on green printing and sustainable manufacturing for years. This project is less a board game than a demonstration of what happens when a company answers a social need with its own core technical capability.</p>', CoverAlt = N'NTI donates a paper-model board game promoting disaster-prevention education', Slug = N'firefighter-boardgame', SeoTitle = NULL WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/firefighter-boardgame.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.News WHERE CoverImagePath = N'assets/news/national-sustainable-development-award.jpg')
    INSERT dbo.News (CategoryId, PublishDate, CoverImagePath, IsFeaturedHome, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'News' AND Code = 'awards'), N'2026-03-09', N'assets/news/national-sustainable-development-award.jpg', 0, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.NewsI18n WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/national-sustainable-development-award.jpg') AND Lang = 'zh')
    INSERT dbo.NewsI18n (NewsId, Lang, Title, Summary, BodyHtml, CoverAlt, Slug, SeoTitle)
    VALUES ((SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/national-sustainable-development-award.jpg'), 'zh', N'NTI 榮獲國家永續發展獎', N'鄭董事長親自出席，自行政院副院長鄭麗君手中接下金質獎座。這座獎肯定的是多年來在 ESG 與低碳製程上的投入，屬於整個團隊。', N'<p>鄭董事長親自出席，自行政院副院長鄭麗君手中接下金質獎座。這座獎肯定的是多年來在 ESG 與低碳製程上的投入，屬於整個團隊。</p><p>作為台灣重要的包裝印刷廠之一，NTI 以綠色印刷與永續包裝為核心原則，透過設備升級、製程優化與導入國際標準推動低碳轉型。</p><p>節能建築與低碳製程。從廠房建築到生產流程都把節能減碳設計進去，以高效率設備與能源管理降低總排放。</p><p>創新印刷技術。數位與創新印刷製程在提升產出效率的同時，減少材料與能源的浪費。</p><p>資源循環與減廢。將循環經濟的做法應用於回收再利用，減少製程廢棄物並提升材料使用效率。</p><p>國際驗證與品質管理。持續取得包含 FSC® 森林管理與 GMI 國際印刷品質在內的驗證，讓產品品質與永續管理同步前進，也鞏固 NTI 在全球供應鏈中的位置。</p><p>NTI 也把綠色印刷延伸到 ESG 紙藝文化教育，與文創內容夥伴合作，以 FSC 驗證紙材、植物性環保油墨與低碳印刷投入保育、防災與海洋保育專案 —— 讓核心技術除了產品價值之外，也創造文化、教育與社會價值。</p>', N'NTI 榮獲國家永續發展獎', N'national-sustainable-development-award-zh', N'NTI receives the National Sustainable Development Award');
ELSE
    UPDATE dbo.NewsI18n SET Title = N'NTI 榮獲國家永續發展獎', Summary = N'鄭董事長親自出席，自行政院副院長鄭麗君手中接下金質獎座。這座獎肯定的是多年來在 ESG 與低碳製程上的投入，屬於整個團隊。', BodyHtml = N'<p>鄭董事長親自出席，自行政院副院長鄭麗君手中接下金質獎座。這座獎肯定的是多年來在 ESG 與低碳製程上的投入，屬於整個團隊。</p><p>作為台灣重要的包裝印刷廠之一，NTI 以綠色印刷與永續包裝為核心原則，透過設備升級、製程優化與導入國際標準推動低碳轉型。</p><p>節能建築與低碳製程。從廠房建築到生產流程都把節能減碳設計進去，以高效率設備與能源管理降低總排放。</p><p>創新印刷技術。數位與創新印刷製程在提升產出效率的同時，減少材料與能源的浪費。</p><p>資源循環與減廢。將循環經濟的做法應用於回收再利用，減少製程廢棄物並提升材料使用效率。</p><p>國際驗證與品質管理。持續取得包含 FSC® 森林管理與 GMI 國際印刷品質在內的驗證，讓產品品質與永續管理同步前進，也鞏固 NTI 在全球供應鏈中的位置。</p><p>NTI 也把綠色印刷延伸到 ESG 紙藝文化教育，與文創內容夥伴合作，以 FSC 驗證紙材、植物性環保油墨與低碳印刷投入保育、防災與海洋保育專案 —— 讓核心技術除了產品價值之外，也創造文化、教育與社會價值。</p>', CoverAlt = N'NTI 榮獲國家永續發展獎', Slug = N'national-sustainable-development-award-zh', SeoTitle = N'NTI receives the National Sustainable Development Award' WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/national-sustainable-development-award.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.NewsI18n WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/national-sustainable-development-award.jpg') AND Lang = 'en')
    INSERT dbo.NewsI18n (NewsId, Lang, Title, Summary, BodyHtml, CoverAlt, Slug, SeoTitle)
    VALUES ((SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/national-sustainable-development-award.jpg'), 'en', N'NTI receives the National Sustainable Development Award', N'Chairman Cheng Chun-Ming attended in person to receive the gold trophy from Vice Premier Cheng Li-Chiun. The award recognises years of work on ESG and low-carbon processes, and belongs to the whole team.', N'<p>Chairman Cheng Chun-Ming attended in person to receive the gold trophy from Vice Premier Cheng Li-Chiun. The award recognises years of work on ESG and low-carbon processes, and belongs to the whole team.</p><p>As one of Taiwan’s significant packaging printers, NTI works to a core principle of green printing and sustainable packaging, driving low-carbon transition through equipment upgrades, process optimisation and adoption of international standards.</p><p>Energy-efficient buildings and low-carbon process. Energy and carbon reduction designed in from the factory building through to the production flow, with high-efficiency equipment and energy management lowering total emissions.</p><p>Innovative printing technology. Digital and innovative print processes raise output efficiency while cutting material and energy waste.</p><p>Resource circulation and waste reduction. Circular-economy practice applied to recovery and reuse, reducing process waste and improving material efficiency.</p><p>International certification and quality management. Continuing certification — including FSC® forest management and GMI international print quality — keeps product quality and sustainability management moving together, and strengthens NTI’s position in global supply chains.</p><p>NTI has extended green printing into ESG paper-craft cultural education, working with creative content partners using FSC-certified stock, plant-based eco inks and low-carbon printing on conservation, disaster-prevention and marine-conservation projects — so core technology creates cultural, educational and social value as well as product value.</p>', N'NTI receives the National Sustainable Development Award', N'national-sustainable-development-award', N'NTI receives the National Sustainable Development Award');
ELSE
    UPDATE dbo.NewsI18n SET Title = N'NTI receives the National Sustainable Development Award', Summary = N'Chairman Cheng Chun-Ming attended in person to receive the gold trophy from Vice Premier Cheng Li-Chiun. The award recognises years of work on ESG and low-carbon processes, and belongs to the whole team.', BodyHtml = N'<p>Chairman Cheng Chun-Ming attended in person to receive the gold trophy from Vice Premier Cheng Li-Chiun. The award recognises years of work on ESG and low-carbon processes, and belongs to the whole team.</p><p>As one of Taiwan’s significant packaging printers, NTI works to a core principle of green printing and sustainable packaging, driving low-carbon transition through equipment upgrades, process optimisation and adoption of international standards.</p><p>Energy-efficient buildings and low-carbon process. Energy and carbon reduction designed in from the factory building through to the production flow, with high-efficiency equipment and energy management lowering total emissions.</p><p>Innovative printing technology. Digital and innovative print processes raise output efficiency while cutting material and energy waste.</p><p>Resource circulation and waste reduction. Circular-economy practice applied to recovery and reuse, reducing process waste and improving material efficiency.</p><p>International certification and quality management. Continuing certification — including FSC® forest management and GMI international print quality — keeps product quality and sustainability management moving together, and strengthens NTI’s position in global supply chains.</p><p>NTI has extended green printing into ESG paper-craft cultural education, working with creative content partners using FSC-certified stock, plant-based eco inks and low-carbon printing on conservation, disaster-prevention and marine-conservation projects — so core technology creates cultural, educational and social value as well as product value.</p>', CoverAlt = N'NTI receives the National Sustainable Development Award', Slug = N'national-sustainable-development-award', SeoTitle = N'NTI receives the National Sustainable Development Award' WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/national-sustainable-development-award.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.News WHERE CoverImagePath = N'assets/news/taicca-partnership.jpg')
    INSERT dbo.News (CategoryId, PublishDate, CoverImagePath, IsFeaturedHome, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'News' AND Code = 'partnership'), N'2025-11-13', N'assets/news/taicca-partnership.jpg', 0, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.NewsI18n WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/taicca-partnership.jpg') AND Lang = 'zh')
    INSERT dbo.NewsI18n (NewsId, Lang, Title, Summary, BodyHtml, CoverAlt, Slug, SeoTitle)
    VALUES ((SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/taicca-partnership.jpg'), 'zh', N'NTI 與文策院簽署「ESG for Culture」合作意向書', N'ESG for Culture 是文策院的跨界計畫，把企業永續策略與文化創意能量配對，發展兼具社會影響力與品牌價值的合作。這次簽署代表印刷產業正式進入這個場域，NTI 是南台灣的夥伴之一。', N'<p>ESG for Culture 是文策院的跨界計畫，把企業永續策略與文化創意能量配對，發展兼具社會影響力與品牌價值的合作。這次簽署代表印刷產業正式進入這個場域，NTI 是南台灣的夥伴之一。</p><p>鄭董事長表示：「印刷不只是製造，它是文化與價值的載體。我們希望透過綠色技術與設計思維，讓每一件印刷品都能傳遞永續的信念與文化的溫度。這次合作意味著企業的綠色轉型不再只是技術升級，而是一次文化共創。」</p><p>NTI 與文策院支持的設計團隊 72 Design 合作，製作了《明日動物》巡迴展。核心概念是以紙代塑，用低碳印刷與環保驗證紙材，做出兼顧創意與永續的展件。</p><p>作品以台灣原生物種為保育象徵 —— 其中包括台灣黑熊與石虎。巡展已在基隆 Space Moor 與京都 Gallery Biga 展出，年底移師台南。</p><p>NTI 創立於 1968 年，是台灣代表性的印刷品牌與國際合作夥伴。近年於台南科技工業園區興建新總部，整合智慧製造、一貫化生產與環境永續 —— 同時取得美國 LEED 黃金級與台灣 EEWH 鑽石級綠建築認證。</p><p>從製程減碳、能源管理到智慧倉儲，NTI 持續擴大 FSC 驗證紙材、LED-UV 節能印刷與免製版數位印刷的應用。</p>', N'NTI 與文策院簽署「ESG for Culture」合作意向書', N'taicca-partnership-zh', N'NTI signs an ESG for Culture letter of intent with TAICCA');
ELSE
    UPDATE dbo.NewsI18n SET Title = N'NTI 與文策院簽署「ESG for Culture」合作意向書', Summary = N'ESG for Culture 是文策院的跨界計畫，把企業永續策略與文化創意能量配對，發展兼具社會影響力與品牌價值的合作。這次簽署代表印刷產業正式進入這個場域，NTI 是南台灣的夥伴之一。', BodyHtml = N'<p>ESG for Culture 是文策院的跨界計畫，把企業永續策略與文化創意能量配對，發展兼具社會影響力與品牌價值的合作。這次簽署代表印刷產業正式進入這個場域，NTI 是南台灣的夥伴之一。</p><p>鄭董事長表示：「印刷不只是製造，它是文化與價值的載體。我們希望透過綠色技術與設計思維，讓每一件印刷品都能傳遞永續的信念與文化的溫度。這次合作意味著企業的綠色轉型不再只是技術升級，而是一次文化共創。」</p><p>NTI 與文策院支持的設計團隊 72 Design 合作，製作了《明日動物》巡迴展。核心概念是以紙代塑，用低碳印刷與環保驗證紙材，做出兼顧創意與永續的展件。</p><p>作品以台灣原生物種為保育象徵 —— 其中包括台灣黑熊與石虎。巡展已在基隆 Space Moor 與京都 Gallery Biga 展出，年底移師台南。</p><p>NTI 創立於 1968 年，是台灣代表性的印刷品牌與國際合作夥伴。近年於台南科技工業園區興建新總部，整合智慧製造、一貫化生產與環境永續 —— 同時取得美國 LEED 黃金級與台灣 EEWH 鑽石級綠建築認證。</p><p>從製程減碳、能源管理到智慧倉儲，NTI 持續擴大 FSC 驗證紙材、LED-UV 節能印刷與免製版數位印刷的應用。</p>', CoverAlt = N'NTI 與文策院簽署「ESG for Culture」合作意向書', Slug = N'taicca-partnership-zh', SeoTitle = N'NTI signs an ESG for Culture letter of intent with TAICCA' WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/taicca-partnership.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.NewsI18n WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/taicca-partnership.jpg') AND Lang = 'en')
    INSERT dbo.NewsI18n (NewsId, Lang, Title, Summary, BodyHtml, CoverAlt, Slug, SeoTitle)
    VALUES ((SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/taicca-partnership.jpg'), 'en', N'NTI signs an ESG for Culture letter of intent with TAICCA', N'ESG for Culture is TAICCA’s cross-sector programme, pairing corporate sustainability strategy with creative energy to build collaborations that carry both social impact and brand value. The signing marks the printing industry formally entering that space, with NTI as one of the southern Taiwan partners.', N'<p>ESG for Culture is TAICCA’s cross-sector programme, pairing corporate sustainability strategy with creative energy to build collaborations that carry both social impact and brand value. The signing marks the printing industry formally entering that space, with NTI as one of the southern Taiwan partners.</p><p>Chairman Cheng Chun-Ming: “Printing is not only manufacturing — it is a carrier of culture and value. Through green technology and design thinking, we want every printed piece to convey a belief in sustainability and a warmth of culture. This partnership means corporate green transition is no longer only a technical upgrade, but an act of cultural co-creation.”</p><p>With TAICCA-supported studio 72 Design, NTI produced the Animals of Tomorrow touring exhibition. Its core idea is replacing plastic with paper, using low-carbon printing and eco-certified stock to make exhibits that are creative and sustainable at once.</p><p>The work draws on Taiwan’s native species — the Formosan black bear and the leopard cat among them — as conservation symbols. The tour has shown at Space Moor in Keelung and Gallery Biga in Kyoto, and moves to Tainan at the end of the year.</p><p>Founded in 1968, NTI is a leading Taiwanese printing brand and an international partner. In recent years the company built a new headquarters in the Tainan Technology Industrial Park combining smart manufacturing, integrated production and environmental sustainability — earning both LEED Gold (US) and EEWH Diamond (Taiwan) green building certification.</p><p>From process carbon reduction and energy management through to smart warehousing, NTI continues to expand FSC-certified stock, LED-UV energy-saving printing and plateless digital printing.</p>', N'NTI signs an ESG for Culture letter of intent with TAICCA', N'taicca-partnership', N'NTI signs an ESG for Culture letter of intent with TAICCA');
ELSE
    UPDATE dbo.NewsI18n SET Title = N'NTI signs an ESG for Culture letter of intent with TAICCA', Summary = N'ESG for Culture is TAICCA’s cross-sector programme, pairing corporate sustainability strategy with creative energy to build collaborations that carry both social impact and brand value. The signing marks the printing industry formally entering that space, with NTI as one of the southern Taiwan partners.', BodyHtml = N'<p>ESG for Culture is TAICCA’s cross-sector programme, pairing corporate sustainability strategy with creative energy to build collaborations that carry both social impact and brand value. The signing marks the printing industry formally entering that space, with NTI as one of the southern Taiwan partners.</p><p>Chairman Cheng Chun-Ming: “Printing is not only manufacturing — it is a carrier of culture and value. Through green technology and design thinking, we want every printed piece to convey a belief in sustainability and a warmth of culture. This partnership means corporate green transition is no longer only a technical upgrade, but an act of cultural co-creation.”</p><p>With TAICCA-supported studio 72 Design, NTI produced the Animals of Tomorrow touring exhibition. Its core idea is replacing plastic with paper, using low-carbon printing and eco-certified stock to make exhibits that are creative and sustainable at once.</p><p>The work draws on Taiwan’s native species — the Formosan black bear and the leopard cat among them — as conservation symbols. The tour has shown at Space Moor in Keelung and Gallery Biga in Kyoto, and moves to Tainan at the end of the year.</p><p>Founded in 1968, NTI is a leading Taiwanese printing brand and an international partner. In recent years the company built a new headquarters in the Tainan Technology Industrial Park combining smart manufacturing, integrated production and environmental sustainability — earning both LEED Gold (US) and EEWH Diamond (Taiwan) green building certification.</p><p>From process carbon reduction and energy management through to smart warehousing, NTI continues to expand FSC-certified stock, LED-UV energy-saving printing and plateless digital printing.</p>', CoverAlt = N'NTI signs an ESG for Culture letter of intent with TAICCA', Slug = N'taicca-partnership', SeoTitle = N'NTI signs an ESG for Culture letter of intent with TAICCA' WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/taicca-partnership.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.News WHERE CoverImagePath = N'assets/news/green-printing-digital-innovation.jpg')
    INSERT dbo.News (CategoryId, PublishDate, CoverImagePath, IsFeaturedHome, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'News' AND Code = 'sustainability'), N'2025-09-16', N'assets/news/green-printing-digital-innovation.jpg', 0, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.NewsI18n WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/green-printing-digital-innovation.jpg') AND Lang = 'zh')
    INSERT dbo.NewsI18n (NewsId, Lang, Title, Summary, BodyHtml, CoverAlt, Slug, SeoTitle)
    VALUES ((SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/green-printing-digital-innovation.jpg'), 'zh', N'綠色印刷與數位創新在 NTI 台南廠', N'對企業而言，綠色印刷回應國際 ESG 要求，並以實際的責任作為強化品牌可信度；對環境而言，它減少污染、降低生態負荷。隨著全球淨零腳步加快，印刷業正往低碳與數位化生產移動，綠色印刷已成為與國際品牌合作的前提。', N'<p>對企業而言，綠色印刷回應國際 ESG 要求，並以實際的責任作為強化品牌可信度；對環境而言，它減少污染、降低生態負荷。隨著全球淨零腳步加快，印刷業正往低碳與數位化生產移動，綠色印刷已成為與國際品牌合作的前提。</p><p>低碳製程與環保材料。全面採用 FSC 驗證紙材，並持續優化製程以降低能源使用與廢棄物 —— 同時滿足客戶的永續要求與國際供應鏈規範。</p><p>AI 與數位印刷。HP Indigo 數位印刷機搭配 AI 能源監控系統讓生產更聰明，在減少打樣與耗材浪費的同時，讓小量客製更有彈性。</p><p>能源管理與智慧工廠。低耗能的 LED-UV 印刷設備搭配 AI 能耗分析，從原料倉儲到成品出貨都能精準控管。</p><p>數位化生產能快速回應市場需求、縮短交期並提升品質一致性。可變資料印刷（VDP）在需求允許時讓每一件都能不同。ERP／MES 整合把設計、印刷與加工串起來，讓整條鏈跑得更快。</p><p>NTI 也開放工廠參訪與交流場次，把永續印刷與 AI 智慧製造的實務經驗分享給其他企業。</p>', N'綠色印刷與數位創新在 NTI 台南廠', N'green-printing-digital-innovation-zh', N'Green printing and digital innovation at NTI Tainan');
ELSE
    UPDATE dbo.NewsI18n SET Title = N'綠色印刷與數位創新在 NTI 台南廠', Summary = N'對企業而言，綠色印刷回應國際 ESG 要求，並以實際的責任作為強化品牌可信度；對環境而言，它減少污染、降低生態負荷。隨著全球淨零腳步加快，印刷業正往低碳與數位化生產移動，綠色印刷已成為與國際品牌合作的前提。', BodyHtml = N'<p>對企業而言，綠色印刷回應國際 ESG 要求，並以實際的責任作為強化品牌可信度；對環境而言，它減少污染、降低生態負荷。隨著全球淨零腳步加快，印刷業正往低碳與數位化生產移動，綠色印刷已成為與國際品牌合作的前提。</p><p>低碳製程與環保材料。全面採用 FSC 驗證紙材，並持續優化製程以降低能源使用與廢棄物 —— 同時滿足客戶的永續要求與國際供應鏈規範。</p><p>AI 與數位印刷。HP Indigo 數位印刷機搭配 AI 能源監控系統讓生產更聰明，在減少打樣與耗材浪費的同時，讓小量客製更有彈性。</p><p>能源管理與智慧工廠。低耗能的 LED-UV 印刷設備搭配 AI 能耗分析，從原料倉儲到成品出貨都能精準控管。</p><p>數位化生產能快速回應市場需求、縮短交期並提升品質一致性。可變資料印刷（VDP）在需求允許時讓每一件都能不同。ERP／MES 整合把設計、印刷與加工串起來，讓整條鏈跑得更快。</p><p>NTI 也開放工廠參訪與交流場次，把永續印刷與 AI 智慧製造的實務經驗分享給其他企業。</p>', CoverAlt = N'綠色印刷與數位創新在 NTI 台南廠', Slug = N'green-printing-digital-innovation-zh', SeoTitle = N'Green printing and digital innovation at NTI Tainan' WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/green-printing-digital-innovation.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.NewsI18n WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/green-printing-digital-innovation.jpg') AND Lang = 'en')
    INSERT dbo.NewsI18n (NewsId, Lang, Title, Summary, BodyHtml, CoverAlt, Slug, SeoTitle)
    VALUES ((SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/green-printing-digital-innovation.jpg'), 'en', N'Green printing and digital innovation at NTI Tainan', N'For a business, green printing supports international ESG expectations and strengthens brand credibility by showing real responsibility. For the environment, it cuts pollution and reduces ecological load. As the global net-zero push accelerates, printing is moving towards low-carbon and digital production, and green printing has become a precondition for working with international brands.', N'<p>For a business, green printing supports international ESG expectations and strengthens brand credibility by showing real responsibility. For the environment, it cuts pollution and reduces ecological load. As the global net-zero push accelerates, printing is moving towards low-carbon and digital production, and green printing has become a precondition for working with international brands.</p><p>Low-carbon process and eco materials. FSC-certified stock across the board, with continuous process optimisation to reduce energy use and waste — meeting both client sustainability requirements and international supply-chain rules.</p><p>AI and digital printing. HP Indigo digital presses and an AI energy-monitoring system make production smarter, giving small-run customisation more flexibility while cutting proofing and consumable waste.</p><p>Energy management and the smart factory. Low-energy LED-UV printing equipment paired with AI energy analysis gives precise control, from raw-material storage through to finished-goods despatch.</p><p>Digital production responds to market demand quickly, shortens lead times and improves quality consistency. Variable data printing (VDP) makes every piece unique where the brief calls for it. ERP/MES integration connects design, printing and finishing so the whole chain moves faster.</p><p>NTI also runs open factory visits and exchange sessions, sharing practical experience of sustainable printing and AI-enabled manufacturing with other companies.</p>', N'Green printing and digital innovation at NTI Tainan', N'green-printing-digital-innovation', N'Green printing and digital innovation at NTI Tainan');
ELSE
    UPDATE dbo.NewsI18n SET Title = N'Green printing and digital innovation at NTI Tainan', Summary = N'For a business, green printing supports international ESG expectations and strengthens brand credibility by showing real responsibility. For the environment, it cuts pollution and reduces ecological load. As the global net-zero push accelerates, printing is moving towards low-carbon and digital production, and green printing has become a precondition for working with international brands.', BodyHtml = N'<p>For a business, green printing supports international ESG expectations and strengthens brand credibility by showing real responsibility. For the environment, it cuts pollution and reduces ecological load. As the global net-zero push accelerates, printing is moving towards low-carbon and digital production, and green printing has become a precondition for working with international brands.</p><p>Low-carbon process and eco materials. FSC-certified stock across the board, with continuous process optimisation to reduce energy use and waste — meeting both client sustainability requirements and international supply-chain rules.</p><p>AI and digital printing. HP Indigo digital presses and an AI energy-monitoring system make production smarter, giving small-run customisation more flexibility while cutting proofing and consumable waste.</p><p>Energy management and the smart factory. Low-energy LED-UV printing equipment paired with AI energy analysis gives precise control, from raw-material storage through to finished-goods despatch.</p><p>Digital production responds to market demand quickly, shortens lead times and improves quality consistency. Variable data printing (VDP) makes every piece unique where the brief calls for it. ERP/MES integration connects design, printing and finishing so the whole chain moves faster.</p><p>NTI also runs open factory visits and exchange sessions, sharing practical experience of sustainable printing and AI-enabled manufacturing with other companies.</p>', CoverAlt = N'Green printing and digital innovation at NTI Tainan', Slug = N'green-printing-digital-innovation', SeoTitle = N'Green printing and digital innovation at NTI Tainan' WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/green-printing-digital-innovation.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.News WHERE CoverImagePath = N'assets/news/green-drive-seminar.jpg')
    INSERT dbo.News (CategoryId, PublishDate, CoverImagePath, IsFeaturedHome, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'News' AND Code = 'event'), N'2025-07-01', N'assets/news/green-drive-seminar.jpg', 0, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.NewsI18n WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/green-drive-seminar.jpg') AND Lang = 'zh')
    INSERT dbo.NewsI18n (NewsId, Lang, Title, Summary, BodyHtml, CoverAlt, Slug, SeoTitle)
    VALUES ((SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/green-drive-seminar.jpg'), 'zh', N'「綠色驅動 × 數位創新」研討會圓滿結束', N'HP 亞太區品牌經理分享數位轉型的全球趨勢。', N'<p>HP 亞太區品牌經理分享數位轉型的全球趨勢。</p><p>綠色供應鏈與數位包裝製程的實務應用。</p><p>現場設備導覽與開放討論，把設計端與品牌端連起來。</p><p>交流餐敘打開跨產業合作的可能。</p><p>這場研討會與其說是資訊交流，不如說是一次針對「產業下一步往哪走」的工作坊。NTI 會持續把環保包裝落實到實務，並加快導入數位轉型技術，協助客戶打造更有韌性、也更有競爭力的永續品牌。</p>', N'「綠色驅動 × 數位創新」研討會圓滿結束', N'green-drive-seminar-zh', N'Green Drive × Digital Innovation seminar wraps up');
ELSE
    UPDATE dbo.NewsI18n SET Title = N'「綠色驅動 × 數位創新」研討會圓滿結束', Summary = N'HP 亞太區品牌經理分享數位轉型的全球趨勢。', BodyHtml = N'<p>HP 亞太區品牌經理分享數位轉型的全球趨勢。</p><p>綠色供應鏈與數位包裝製程的實務應用。</p><p>現場設備導覽與開放討論，把設計端與品牌端連起來。</p><p>交流餐敘打開跨產業合作的可能。</p><p>這場研討會與其說是資訊交流，不如說是一次針對「產業下一步往哪走」的工作坊。NTI 會持續把環保包裝落實到實務，並加快導入數位轉型技術，協助客戶打造更有韌性、也更有競爭力的永續品牌。</p>', CoverAlt = N'「綠色驅動 × 數位創新」研討會圓滿結束', Slug = N'green-drive-seminar-zh', SeoTitle = N'Green Drive × Digital Innovation seminar wraps up' WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/green-drive-seminar.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.NewsI18n WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/green-drive-seminar.jpg') AND Lang = 'en')
    INSERT dbo.NewsI18n (NewsId, Lang, Title, Summary, BodyHtml, CoverAlt, Slug, SeoTitle)
    VALUES ((SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/green-drive-seminar.jpg'), 'en', N'Green Drive × Digital Innovation seminar wraps up', N'HP’s Asia-Pacific brand manager on global trends in digital transformation.', N'<p>HP’s Asia-Pacific brand manager on global trends in digital transformation.</p><p>Practical application of green supply chains and digital packaging processes.</p><p>A live equipment tour with open discussion, connecting the design side with the brand side.</p><p>A networking dinner opening up cross-sector collaboration.</p><p>The seminar was less an information exchange than a working session on where the industry goes next. NTI will keep putting eco-friendly packaging into practice and accelerating its adoption of digital transformation technology, helping clients build sustainable brands with more resilience and more competitive edge.</p>', N'Green Drive × Digital Innovation seminar wraps up', N'green-drive-seminar', N'Green Drive × Digital Innovation seminar wraps up');
ELSE
    UPDATE dbo.NewsI18n SET Title = N'Green Drive × Digital Innovation seminar wraps up', Summary = N'HP’s Asia-Pacific brand manager on global trends in digital transformation.', BodyHtml = N'<p>HP’s Asia-Pacific brand manager on global trends in digital transformation.</p><p>Practical application of green supply chains and digital packaging processes.</p><p>A live equipment tour with open discussion, connecting the design side with the brand side.</p><p>A networking dinner opening up cross-sector collaboration.</p><p>The seminar was less an information exchange than a working session on where the industry goes next. NTI will keep putting eco-friendly packaging into practice and accelerating its adoption of digital transformation technology, helping clients build sustainable brands with more resilience and more competitive edge.</p>', CoverAlt = N'Green Drive × Digital Innovation seminar wraps up', Slug = N'green-drive-seminar', SeoTitle = N'Green Drive × Digital Innovation seminar wraps up' WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/green-drive-seminar.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.News WHERE CoverImagePath = N'assets/news/animals-of-tomorrow.jpg')
    INSERT dbo.News (CategoryId, PublishDate, CoverImagePath, IsFeaturedHome, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'News' AND Code = 'esg'), N'2025-05-09', N'assets/news/animals-of-tomorrow.jpg', 0, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.NewsI18n WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/animals-of-tomorrow.jpg') AND Lang = 'zh')
    INSERT dbo.NewsI18n (NewsId, Lang, Title, Summary, BodyHtml, CoverAlt, Slug, SeoTitle)
    VALUES ((SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/animals-of-tomorrow.jpg'), 'zh', N'為石虎發聲：NTI 參與《明日動物》特展', N'本次展覽聚焦瀕危物種。NTI 與 72 Design 共同創作以台灣黑熊與石虎為主軸的互動紙模型裝置，採可變資料印刷、免製版製作 —— 實務上意味著更低碳、更少廢棄的製程，兼具創意與教育性的作品，以及數位印刷在小量多樣上的彈性。', N'<p>本次展覽聚焦瀕危物種。NTI 與 72 Design 共同創作以台灣黑熊與石虎為主軸的互動紙模型裝置，採可變資料印刷、免製版製作 —— 實務上意味著更低碳、更少廢棄的製程，兼具創意與教育性的作品，以及數位印刷在小量多樣上的彈性。</p><p>展覽地點。基隆 SPACE MOOR。</p><p>展期。至 2025 年 5 月 25 日，12:00–19:00，免費入場。</p><p>本作品獲 Yahoo 新聞、中國時報、InTime 與 INNEWS 報導，展覽影片可於 YouTube 觀看。</p>', N'為石虎發聲：NTI 參與《明日動物》特展', N'animals-of-tomorrow-zh', NULL);
ELSE
    UPDATE dbo.NewsI18n SET Title = N'為石虎發聲：NTI 參與《明日動物》特展', Summary = N'本次展覽聚焦瀕危物種。NTI 與 72 Design 共同創作以台灣黑熊與石虎為主軸的互動紙模型裝置，採可變資料印刷、免製版製作 —— 實務上意味著更低碳、更少廢棄的製程，兼具創意與教育性的作品，以及數位印刷在小量多樣上的彈性。', BodyHtml = N'<p>本次展覽聚焦瀕危物種。NTI 與 72 Design 共同創作以台灣黑熊與石虎為主軸的互動紙模型裝置，採可變資料印刷、免製版製作 —— 實務上意味著更低碳、更少廢棄的製程，兼具創意與教育性的作品，以及數位印刷在小量多樣上的彈性。</p><p>展覽地點。基隆 SPACE MOOR。</p><p>展期。至 2025 年 5 月 25 日，12:00–19:00，免費入場。</p><p>本作品獲 Yahoo 新聞、中國時報、InTime 與 INNEWS 報導，展覽影片可於 YouTube 觀看。</p>', CoverAlt = N'為石虎發聲：NTI 參與《明日動物》特展', Slug = N'animals-of-tomorrow-zh', SeoTitle = NULL WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/animals-of-tomorrow.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.NewsI18n WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/animals-of-tomorrow.jpg') AND Lang = 'en')
    INSERT dbo.NewsI18n (NewsId, Lang, Title, Summary, BodyHtml, CoverAlt, Slug, SeoTitle)
    VALUES ((SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/animals-of-tomorrow.jpg'), 'en', N'Speaking up for the leopard cat: NTI joins the Animals of Tomorrow exhibition', N'The exhibition focuses on endangered species. NTI and 72 Design co-created interactive paper-model installations built around the Formosan black bear and the leopard cat, produced with variable printing and no plate-making — which in practice means a lower-carbon, lower-waste process, creative work that also teaches, and the flexibility of digital printing across small, varied runs.', N'<p>The exhibition focuses on endangered species. NTI and 72 Design co-created interactive paper-model installations built around the Formosan black bear and the leopard cat, produced with variable printing and no plate-making — which in practice means a lower-carbon, lower-waste process, creative work that also teaches, and the flexibility of digital printing across small, varied runs.</p><p>Venue. SPACE MOOR, Keelung.</p><p>Dates. Through 25 May 2025, 12:00–19:00, free entry.</p><p>The work was covered by Yahoo News, China Times, InTime and INNEWS, and an exhibition film is available on YouTube.</p>', N'Speaking up for the leopard cat: NTI joins the Animals of Tomorrow exhibition', N'animals-of-tomorrow', NULL);
ELSE
    UPDATE dbo.NewsI18n SET Title = N'Speaking up for the leopard cat: NTI joins the Animals of Tomorrow exhibition', Summary = N'The exhibition focuses on endangered species. NTI and 72 Design co-created interactive paper-model installations built around the Formosan black bear and the leopard cat, produced with variable printing and no plate-making — which in practice means a lower-carbon, lower-waste process, creative work that also teaches, and the flexibility of digital printing across small, varied runs.', BodyHtml = N'<p>The exhibition focuses on endangered species. NTI and 72 Design co-created interactive paper-model installations built around the Formosan black bear and the leopard cat, produced with variable printing and no plate-making — which in practice means a lower-carbon, lower-waste process, creative work that also teaches, and the flexibility of digital printing across small, varied runs.</p><p>Venue. SPACE MOOR, Keelung.</p><p>Dates. Through 25 May 2025, 12:00–19:00, free entry.</p><p>The work was covered by Yahoo News, China Times, InTime and INNEWS, and an exhibition film is available on YouTube.</p>', CoverAlt = N'Speaking up for the leopard cat: NTI joins the Animals of Tomorrow exhibition', Slug = N'animals-of-tomorrow', SeoTitle = NULL WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/animals-of-tomorrow.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.News WHERE CoverImagePath = N'assets/news/gentle-wild-paper-bags.png')
    INSERT dbo.News (CategoryId, PublishDate, CoverImagePath, IsFeaturedHome, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'News' AND Code = 'esg'), N'2025-04-18', N'assets/news/gentle-wild-paper-bags.png', 0, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.NewsI18n WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/gentle-wild-paper-bags.png') AND Lang = 'zh')
    INSERT dbo.NewsI18n (NewsId, Lang, Title, Summary, BodyHtml, CoverAlt, Slug, SeoTitle)
    VALUES ((SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/gentle-wild-paper-bags.png'), 'zh', N'Gentle Wild 紙袋：每一個袋子都是不同的動物', N'市場是現實的：產品再好，包裝不吸引人，客人可能連看都不看。Gentle Wild 設計了一整系列的動物插畫 —— 每一隻都像一則有角色、有場景的微型故事。', N'<p>市場是現實的：產品再好，包裝不吸引人，客人可能連看都不看。Gentle Wild 設計了一整系列的動物插畫 —— 每一隻都像一則有角色、有場景的微型故事。</p><p>搭配 HP 可變資料印刷，沒有兩個袋子是重複的，整個系列在視覺上卻仍然一致：認得出來，但不會膩。</p><p>免製版讓小量生產變得可行 —— 快、成本低，這在出貨節奏必須保持彈性時很關鍵。而因為 NTI 從紙張、油墨到印刷製程本身都採環保規格，品牌可以誠實告訴顧客：這個包裝對環境和對設計一樣友善。</p>', N'Gentle Wild 紙袋：每一個袋子都是不同的動物', N'gentle-wild-paper-bags-zh', N'Gentle Wild paper bags: a different animal on every bag');
ELSE
    UPDATE dbo.NewsI18n SET Title = N'Gentle Wild 紙袋：每一個袋子都是不同的動物', Summary = N'市場是現實的：產品再好，包裝不吸引人，客人可能連看都不看。Gentle Wild 設計了一整系列的動物插畫 —— 每一隻都像一則有角色、有場景的微型故事。', BodyHtml = N'<p>市場是現實的：產品再好，包裝不吸引人，客人可能連看都不看。Gentle Wild 設計了一整系列的動物插畫 —— 每一隻都像一則有角色、有場景的微型故事。</p><p>搭配 HP 可變資料印刷，沒有兩個袋子是重複的，整個系列在視覺上卻仍然一致：認得出來，但不會膩。</p><p>免製版讓小量生產變得可行 —— 快、成本低，這在出貨節奏必須保持彈性時很關鍵。而因為 NTI 從紙張、油墨到印刷製程本身都採環保規格，品牌可以誠實告訴顧客：這個包裝對環境和對設計一樣友善。</p>', CoverAlt = N'Gentle Wild 紙袋：每一個袋子都是不同的動物', Slug = N'gentle-wild-paper-bags-zh', SeoTitle = N'Gentle Wild paper bags: a different animal on every bag' WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/gentle-wild-paper-bags.png') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.NewsI18n WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/gentle-wild-paper-bags.png') AND Lang = 'en')
    INSERT dbo.NewsI18n (NewsId, Lang, Title, Summary, BodyHtml, CoverAlt, Slug, SeoTitle)
    VALUES ((SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/gentle-wild-paper-bags.png'), 'en', N'Gentle Wild paper bags: a different animal on every bag', N'The market is unforgiving: however good the product is, if the packaging does not catch the eye the customer may never look. Gentle Wild designed a full series of animal illustrations — each one reading like a miniature story with its own character and setting.', N'<p>The market is unforgiving: however good the product is, if the packaging does not catch the eye the customer may never look. Gentle Wild designed a full series of animal illustrations — each one reading like a miniature story with its own character and setting.</p><p>Paired with HP variable data printing, no two bags repeat, yet the range stays visually consistent: recognisable, but never dull.</p><p>No plate-making, so small runs are viable — fast and low cost, which matters when despatch has to stay flexible. And because NTI runs eco specifications from paper and ink through to the printing process itself, the brand can tell customers the packaging is kind to the environment as well as to the design.</p>', N'Gentle Wild paper bags: a different animal on every bag', N'gentle-wild-paper-bags', N'Gentle Wild paper bags: a different animal on every bag');
ELSE
    UPDATE dbo.NewsI18n SET Title = N'Gentle Wild paper bags: a different animal on every bag', Summary = N'The market is unforgiving: however good the product is, if the packaging does not catch the eye the customer may never look. Gentle Wild designed a full series of animal illustrations — each one reading like a miniature story with its own character and setting.', BodyHtml = N'<p>The market is unforgiving: however good the product is, if the packaging does not catch the eye the customer may never look. Gentle Wild designed a full series of animal illustrations — each one reading like a miniature story with its own character and setting.</p><p>Paired with HP variable data printing, no two bags repeat, yet the range stays visually consistent: recognisable, but never dull.</p><p>No plate-making, so small runs are viable — fast and low cost, which matters when despatch has to stay flexible. And because NTI runs eco specifications from paper and ink through to the printing process itself, the brand can tell customers the packaging is kind to the environment as well as to the design.</p>', CoverAlt = N'Gentle Wild paper bags: a different animal on every bag', Slug = N'gentle-wild-paper-bags', SeoTitle = N'Gentle Wild paper bags: a different animal on every bag' WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/gentle-wild-paper-bags.png') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.News WHERE CoverImagePath = N'assets/news/hp-variable-data-printing.jpg')
    INSERT dbo.News (CategoryId, PublishDate, CoverImagePath, IsFeaturedHome, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'News' AND Code = 'esg'), N'2025-03-21', N'assets/news/hp-variable-data-printing.jpg', 0, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.NewsI18n WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/hp-variable-data-printing.jpg') AND Lang = 'zh')
    INSERT dbo.NewsI18n (NewsId, Lang, Title, Summary, BodyHtml, CoverAlt, Slug, SeoTitle)
    VALUES ((SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/hp-variable-data-printing.jpg'), 'zh', N'HP 可變資料印刷：小量也能有存在感', N'可變資料印刷。每一件印刷品都可以不一樣 —— 姓名、序號、條碼、圖案。單件印刷成為可能，一盒一款設計也是。', N'<p>可變資料印刷。每一件印刷品都可以不一樣 —— 姓名、序號、條碼、圖案。單件印刷成為可能，一盒一款設計也是。</p><p>小量生產，降低庫存風險。沒有高額起訂量。依需求印製，彈性高、風險低 —— 適合快閃店、限量盲盒商品與客製服務。</p><p>交期快。免製版加上簡化的流程，讓案子從設計到出貨更快，縮短上市時間。</p><p>高品質輸出。先進的數位印刷能呈現細緻漸層與飽和色彩，提升產品質感與品牌形象。</p><p>彈性的市場測試。先以小量測試消費者反應，再調整設計或行銷 —— 少浪費、效率更好。</p>', N'HP 可變資料印刷：小量也能有存在感', N'hp-variable-data-printing-zh', N'HP variable data printing: small runs that still stand out');
ELSE
    UPDATE dbo.NewsI18n SET Title = N'HP 可變資料印刷：小量也能有存在感', Summary = N'可變資料印刷。每一件印刷品都可以不一樣 —— 姓名、序號、條碼、圖案。單件印刷成為可能，一盒一款設計也是。', BodyHtml = N'<p>可變資料印刷。每一件印刷品都可以不一樣 —— 姓名、序號、條碼、圖案。單件印刷成為可能，一盒一款設計也是。</p><p>小量生產，降低庫存風險。沒有高額起訂量。依需求印製，彈性高、風險低 —— 適合快閃店、限量盲盒商品與客製服務。</p><p>交期快。免製版加上簡化的流程，讓案子從設計到出貨更快，縮短上市時間。</p><p>高品質輸出。先進的數位印刷能呈現細緻漸層與飽和色彩，提升產品質感與品牌形象。</p><p>彈性的市場測試。先以小量測試消費者反應，再調整設計或行銷 —— 少浪費、效率更好。</p>', CoverAlt = N'HP 可變資料印刷：小量也能有存在感', Slug = N'hp-variable-data-printing-zh', SeoTitle = N'HP variable data printing: small runs that still stand out' WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/hp-variable-data-printing.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.NewsI18n WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/hp-variable-data-printing.jpg') AND Lang = 'en')
    INSERT dbo.NewsI18n (NewsId, Lang, Title, Summary, BodyHtml, CoverAlt, Slug, SeoTitle)
    VALUES ((SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/hp-variable-data-printing.jpg'), 'en', N'HP variable data printing: small runs that still stand out', N'Variable data printing. Every printed piece can differ — name, serial number, barcode, artwork. One-off printing becomes possible; so does one design per box.', N'<p>Variable data printing. Every printed piece can differ — name, serial number, barcode, artwork. One-off printing becomes possible; so does one design per box.</p><p>Small runs, lower inventory risk. No large minimum order. Print to demand, with high flexibility and low risk — suited to pop-ups, limited blind-box products and custom services.</p><p>Fast delivery. No plate-making and a simplified workflow move a job from design to despatch faster, shortening time to market.</p><p>High-quality output. Advanced digital printing renders fine gradients and saturated colour, lifting product feel and brand image.</p><p>Flexible market testing. Test consumer reaction on a small run first, then adjust design or marketing — less waste, better efficiency.</p>', N'HP variable data printing: small runs that still stand out', N'hp-variable-data-printing', N'HP variable data printing: small runs that still stand out');
ELSE
    UPDATE dbo.NewsI18n SET Title = N'HP variable data printing: small runs that still stand out', Summary = N'Variable data printing. Every printed piece can differ — name, serial number, barcode, artwork. One-off printing becomes possible; so does one design per box.', BodyHtml = N'<p>Variable data printing. Every printed piece can differ — name, serial number, barcode, artwork. One-off printing becomes possible; so does one design per box.</p><p>Small runs, lower inventory risk. No large minimum order. Print to demand, with high flexibility and low risk — suited to pop-ups, limited blind-box products and custom services.</p><p>Fast delivery. No plate-making and a simplified workflow move a job from design to despatch faster, shortening time to market.</p><p>High-quality output. Advanced digital printing renders fine gradients and saturated colour, lifting product feel and brand image.</p><p>Flexible market testing. Test consumer reaction on a small run first, then adjust design or marketing — less waste, better efficiency.</p>', CoverAlt = N'HP variable data printing: small runs that still stand out', Slug = N'hp-variable-data-printing', SeoTitle = N'HP variable data printing: small runs that still stand out' WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/hp-variable-data-printing.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.News WHERE CoverImagePath = N'assets/news/sme-investment-benchmark.jpg')
    INSERT dbo.News (CategoryId, PublishDate, CoverImagePath, IsFeaturedHome, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'News' AND Code = 'awards'), N'2025-01-15', N'assets/news/sme-investment-benchmark.jpg', 0, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.NewsI18n WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/sme-investment-benchmark.jpg') AND Lang = 'zh')
    INSERT dbo.NewsI18n (NewsId, Lang, Title, Summary, BodyHtml, CoverAlt, Slug, SeoTitle)
    VALUES ((SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/sme-investment-benchmark.jpg'), 'zh', N'獲選中小企業加速投資方案標竿企業', N'2024 年是一個里程碑。在環保包裝印刷這條路上，NTI 始終堅持綠色與永續的方向，先贏得客戶信任，繼而在中小企業加速投資方案中脫穎而出。', N'<p>2024 年是一個里程碑。在環保包裝印刷這條路上，NTI 始終堅持綠色與永續的方向，先贏得客戶信任，繼而在中小企業加速投資方案中脫穎而出。</p><p>這份肯定來自營運管理、核心差異化技術、自動化與數位轉型，以及永續經營各面向的表現。它屬於每一位同仁，也是繼續走下去的理由。</p>', N'獲選中小企業加速投資方案標竿企業', N'sme-investment-benchmark-zh', NULL);
ELSE
    UPDATE dbo.NewsI18n SET Title = N'獲選中小企業加速投資方案標竿企業', Summary = N'2024 年是一個里程碑。在環保包裝印刷這條路上，NTI 始終堅持綠色與永續的方向，先贏得客戶信任，繼而在中小企業加速投資方案中脫穎而出。', BodyHtml = N'<p>2024 年是一個里程碑。在環保包裝印刷這條路上，NTI 始終堅持綠色與永續的方向，先贏得客戶信任，繼而在中小企業加速投資方案中脫穎而出。</p><p>這份肯定來自營運管理、核心差異化技術、自動化與數位轉型，以及永續經營各面向的表現。它屬於每一位同仁，也是繼續走下去的理由。</p>', CoverAlt = N'獲選中小企業加速投資方案標竿企業', Slug = N'sme-investment-benchmark-zh', SeoTitle = NULL WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/sme-investment-benchmark.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.NewsI18n WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/sme-investment-benchmark.jpg') AND Lang = 'en')
    INSERT dbo.NewsI18n (NewsId, Lang, Title, Summary, BodyHtml, CoverAlt, Slug, SeoTitle)
    VALUES ((SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/sme-investment-benchmark.jpg'), 'en', N'Named a benchmark enterprise in the SME Accelerated Investment Programme', N'2024 was a milestone year. In eco-friendly packaging printing NTI has held to a green and sustainable direction, earning client trust and then standing out in the SME Accelerated Investment Programme.', N'<p>2024 was a milestone year. In eco-friendly packaging printing NTI has held to a green and sustainable direction, earning client trust and then standing out in the SME Accelerated Investment Programme.</p><p>The recognition came from performance across operational management, core differentiating technology, automation and digital transformation, and sustainable business practice. It belongs to every colleague, and it is the reason to keep going.</p>', N'Named a benchmark enterprise in the SME Accelerated Investment Programme', N'sme-investment-benchmark', NULL);
ELSE
    UPDATE dbo.NewsI18n SET Title = N'Named a benchmark enterprise in the SME Accelerated Investment Programme', Summary = N'2024 was a milestone year. In eco-friendly packaging printing NTI has held to a green and sustainable direction, earning client trust and then standing out in the SME Accelerated Investment Programme.', BodyHtml = N'<p>2024 was a milestone year. In eco-friendly packaging printing NTI has held to a green and sustainable direction, earning client trust and then standing out in the SME Accelerated Investment Programme.</p><p>The recognition came from performance across operational management, core differentiating technology, automation and digital transformation, and sustainable business practice. It belongs to every colleague, and it is the reason to keep going.</p>', CoverAlt = N'Named a benchmark enterprise in the SME Accelerated Investment Programme', Slug = N'sme-investment-benchmark', SeoTitle = NULL WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/sme-investment-benchmark.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.News WHERE CoverImagePath = N'assets/news/commonwealth-interview.jpg')
    INSERT dbo.News (CategoryId, PublishDate, CoverImagePath, IsFeaturedHome, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'News' AND Code = 'esg'), N'2024-11-11', N'assets/news/commonwealth-interview.jpg', 0, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.NewsI18n WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/commonwealth-interview.jpg') AND Lang = 'zh')
    INSERT dbo.NewsI18n (NewsId, Lang, Title, Summary, BodyHtml, CoverAlt, Slug, SeoTitle)
    VALUES ((SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/commonwealth-interview.jpg'), 'zh', N'NTI 接受《天下雜誌》專訪', N'訪談深入談到 NTI 如何把環境思維放進每一個生產細節 —— 從材料選擇到減碳作為 —— 以及在這個產業裡當一個綠色先行者、而不是跟隨者，需要什麼。', N'<p>訪談深入談到 NTI 如何把環境思維放進每一個生產細節 —— 從材料選擇到減碳作為 —— 以及在這個產業裡當一個綠色先行者、而不是跟隨者，需要什麼。</p>', N'NTI 接受《天下雜誌》專訪', N'commonwealth-interview-zh', N'NTI interviewed by CommonWealth Magazine');
ELSE
    UPDATE dbo.NewsI18n SET Title = N'NTI 接受《天下雜誌》專訪', Summary = N'訪談深入談到 NTI 如何把環境思維放進每一個生產細節 —— 從材料選擇到減碳作為 —— 以及在這個產業裡當一個綠色先行者、而不是跟隨者，需要什麼。', BodyHtml = N'<p>訪談深入談到 NTI 如何把環境思維放進每一個生產細節 —— 從材料選擇到減碳作為 —— 以及在這個產業裡當一個綠色先行者、而不是跟隨者，需要什麼。</p>', CoverAlt = N'NTI 接受《天下雜誌》專訪', Slug = N'commonwealth-interview-zh', SeoTitle = N'NTI interviewed by CommonWealth Magazine' WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/commonwealth-interview.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.NewsI18n WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/commonwealth-interview.jpg') AND Lang = 'en')
    INSERT dbo.NewsI18n (NewsId, Lang, Title, Summary, BodyHtml, CoverAlt, Slug, SeoTitle)
    VALUES ((SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/commonwealth-interview.jpg'), 'en', N'NTI interviewed by CommonWealth Magazine', N'The conversation went into how NTI builds environmental thinking into every production detail — from material selection through to carbon reduction measures — and what it takes to be a green front-runner in this industry rather than a follower.', N'<p>The conversation went into how NTI builds environmental thinking into every production detail — from material selection through to carbon reduction measures — and what it takes to be a green front-runner in this industry rather than a follower.</p>', N'NTI interviewed by CommonWealth Magazine', N'commonwealth-interview', N'NTI interviewed by CommonWealth Magazine');
ELSE
    UPDATE dbo.NewsI18n SET Title = N'NTI interviewed by CommonWealth Magazine', Summary = N'The conversation went into how NTI builds environmental thinking into every production detail — from material selection through to carbon reduction measures — and what it takes to be a green front-runner in this industry rather than a follower.', BodyHtml = N'<p>The conversation went into how NTI builds environmental thinking into every production detail — from material selection through to carbon reduction measures — and what it takes to be a green front-runner in this industry rather than a follower.</p>', CoverAlt = N'NTI interviewed by CommonWealth Magazine', Slug = N'commonwealth-interview', SeoTitle = N'NTI interviewed by CommonWealth Magazine' WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/commonwealth-interview.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.News WHERE CoverImagePath = N'assets/news/low-carbon-production-film.jpg')
    INSERT dbo.News (CategoryId, PublishDate, CoverImagePath, IsFeaturedHome, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'News' AND Code = 'sustainability'), N'2024-08-09', N'assets/news/low-carbon-production-film.jpg', 0, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.NewsI18n WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/low-carbon-production-film.jpg') AND Lang = 'zh')
    INSERT dbo.NewsI18n (NewsId, Lang, Title, Summary, BodyHtml, CoverAlt, Slug, SeoTitle)
    VALUES ((SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/low-carbon-production-film.jpg'), 'zh', N'一貫化低碳生產模式 —— 企業形象影片', N'作為一家以環境為核心的包裝印刷廠，NTI 致力提供符合最高環境標準的產品與服務。雙綠建築認證肯定了至今的努力 —— 也定下了接下來的標準。', N'<p>作為一家以環境為核心的包裝印刷廠，NTI 致力提供符合最高環境標準的產品與服務。雙綠建築認證肯定了至今的努力 —— 也定下了接下來的標準。</p><p>今天的客戶在意產品的品質，也在意它是怎麼被做出來的。影片涵蓋每一個階段 —— 材料選擇、結構設計、印刷製程、成品包裝與物流 —— 每一段都在國際節能減碳標準下運作，並由能源管理平台統籌全廠的效率規劃。</p><p>我們的目的是提供精緻的客製化包裝解決方案，因為品質與環境責任從來不是兩個分開的目標。選擇 NTI，是對我們的信任，也是對環境的一份貢獻。</p>', N'一貫化低碳生產模式 —— 企業形象影片', N'low-carbon-production-film-zh', N'Our integrated low-carbon production model — company film');
ELSE
    UPDATE dbo.NewsI18n SET Title = N'一貫化低碳生產模式 —— 企業形象影片', Summary = N'作為一家以環境為核心的包裝印刷廠，NTI 致力提供符合最高環境標準的產品與服務。雙綠建築認證肯定了至今的努力 —— 也定下了接下來的標準。', BodyHtml = N'<p>作為一家以環境為核心的包裝印刷廠，NTI 致力提供符合最高環境標準的產品與服務。雙綠建築認證肯定了至今的努力 —— 也定下了接下來的標準。</p><p>今天的客戶在意產品的品質，也在意它是怎麼被做出來的。影片涵蓋每一個階段 —— 材料選擇、結構設計、印刷製程、成品包裝與物流 —— 每一段都在國際節能減碳標準下運作，並由能源管理平台統籌全廠的效率規劃。</p><p>我們的目的是提供精緻的客製化包裝解決方案，因為品質與環境責任從來不是兩個分開的目標。選擇 NTI，是對我們的信任，也是對環境的一份貢獻。</p>', CoverAlt = N'一貫化低碳生產模式 —— 企業形象影片', Slug = N'low-carbon-production-film-zh', SeoTitle = N'Our integrated low-carbon production model — company film' WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/low-carbon-production-film.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.NewsI18n WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/low-carbon-production-film.jpg') AND Lang = 'en')
    INSERT dbo.NewsI18n (NewsId, Lang, Title, Summary, BodyHtml, CoverAlt, Slug, SeoTitle)
    VALUES ((SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/low-carbon-production-film.jpg'), 'en', N'Our integrated low-carbon production model — company film', N'As a packaging printer focused on the environment, NTI works to supply products and services that meet the highest environmental standards. The dual green building certification recognises the work done so far — and sets the bar for what comes next.', N'<p>As a packaging printer focused on the environment, NTI works to supply products and services that meet the highest environmental standards. The dual green building certification recognises the work done so far — and sets the bar for what comes next.</p><p>Customers today care about the quality of a product and about how it was made. The film covers every stage — material selection, structural design, the printing process, finished packaging and logistics — each running under international energy-saving and emission-reduction standards. An energy management platform coordinates efficiency planning across the whole plant.</p><p>Our purpose is to supply refined, custom packaging solutions, because quality and environmental responsibility are not separate goals. Choosing NTI is a vote of confidence in us and a contribution to the environment.</p>', N'Our integrated low-carbon production model — company film', N'low-carbon-production-film', N'Our integrated low-carbon production model — company film');
ELSE
    UPDATE dbo.NewsI18n SET Title = N'Our integrated low-carbon production model — company film', Summary = N'As a packaging printer focused on the environment, NTI works to supply products and services that meet the highest environmental standards. The dual green building certification recognises the work done so far — and sets the bar for what comes next.', BodyHtml = N'<p>As a packaging printer focused on the environment, NTI works to supply products and services that meet the highest environmental standards. The dual green building certification recognises the work done so far — and sets the bar for what comes next.</p><p>Customers today care about the quality of a product and about how it was made. The film covers every stage — material selection, structural design, the printing process, finished packaging and logistics — each running under international energy-saving and emission-reduction standards. An energy management platform coordinates efficiency planning across the whole plant.</p><p>Our purpose is to supply refined, custom packaging solutions, because quality and environmental responsibility are not separate goals. Choosing NTI is a vote of confidence in us and a contribution to the environment.</p>', CoverAlt = N'Our integrated low-carbon production model — company film', Slug = N'low-carbon-production-film', SeoTitle = N'Our integrated low-carbon production model — company film' WHERE NewsId = (SELECT Id FROM dbo.News WHERE CoverImagePath = N'assets/news/low-carbon-production-film.jpg') AND Lang = 'en';

GO

/* ── vlog → Vlog（4 筆）──────────────────────────── */
IF NOT EXISTS (SELECT 1 FROM dbo.Vlog WHERE YoutubeId = N'plgjH8Jw8pE')
    INSERT dbo.Vlog (CategoryId, YoutubeId, ThumbOverridePath, IsMainFeature, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Vlog' AND Code = 'sustainability'), N'plgjH8Jw8pE', NULL, 1, 10, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.VlogI18n WHERE VlogId = (SELECT Id FROM dbo.Vlog WHERE YoutubeId = N'plgjH8Jw8pE') AND Lang = 'zh')
    INSERT dbo.VlogI18n (VlogId, Lang, Title, Description)
    VALUES ((SELECT Id FROM dbo.Vlog WHERE YoutubeId = N'plgjH8Jw8pE'), 'zh', N'包裝印刷的最佳夥伴 —— NTI', N'永續');
ELSE
    UPDATE dbo.VlogI18n SET Title = N'包裝印刷的最佳夥伴 —— NTI', Description = N'永續' WHERE VlogId = (SELECT Id FROM dbo.Vlog WHERE YoutubeId = N'plgjH8Jw8pE') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.VlogI18n WHERE VlogId = (SELECT Id FROM dbo.Vlog WHERE YoutubeId = N'plgjH8Jw8pE') AND Lang = 'en')
    INSERT dbo.VlogI18n (VlogId, Lang, Title, Description)
    VALUES ((SELECT Id FROM dbo.Vlog WHERE YoutubeId = N'plgjH8Jw8pE'), 'en', N'The Perfect Partner for Packaging Printing — NTI Printing', N'Sustainability');
ELSE
    UPDATE dbo.VlogI18n SET Title = N'The Perfect Partner for Packaging Printing — NTI Printing', Description = N'Sustainability' WHERE VlogId = (SELECT Id FROM dbo.Vlog WHERE YoutubeId = N'plgjH8Jw8pE') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.Vlog WHERE YoutubeId = N'XbpMQ6oZV88')
    INSERT dbo.Vlog (CategoryId, YoutubeId, ThumbOverridePath, IsMainFeature, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Vlog' AND Code = 'sustainability'), N'XbpMQ6oZV88', NULL, 0, 20, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.VlogI18n WHERE VlogId = (SELECT Id FROM dbo.Vlog WHERE YoutubeId = N'XbpMQ6oZV88') AND Lang = 'zh')
    INSERT dbo.VlogI18n (VlogId, Lang, Title, Description)
    VALUES ((SELECT Id FROM dbo.Vlog WHERE YoutubeId = N'XbpMQ6oZV88'), 'zh', N'自然與永續', N'永續');
ELSE
    UPDATE dbo.VlogI18n SET Title = N'自然與永續', Description = N'永續' WHERE VlogId = (SELECT Id FROM dbo.Vlog WHERE YoutubeId = N'XbpMQ6oZV88') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.VlogI18n WHERE VlogId = (SELECT Id FROM dbo.Vlog WHERE YoutubeId = N'XbpMQ6oZV88') AND Lang = 'en')
    INSERT dbo.VlogI18n (VlogId, Lang, Title, Description)
    VALUES ((SELECT Id FROM dbo.Vlog WHERE YoutubeId = N'XbpMQ6oZV88'), 'en', N'Nature and Sustainability', N'Sustainability');
ELSE
    UPDATE dbo.VlogI18n SET Title = N'Nature and Sustainability', Description = N'Sustainability' WHERE VlogId = (SELECT Id FROM dbo.Vlog WHERE YoutubeId = N'XbpMQ6oZV88') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.Vlog WHERE YoutubeId = N'vECuYIiFSSM')
    INSERT dbo.Vlog (CategoryId, YoutubeId, ThumbOverridePath, IsMainFeature, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Vlog' AND Code = 'low-carbon'), N'vECuYIiFSSM', NULL, 0, 30, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.VlogI18n WHERE VlogId = (SELECT Id FROM dbo.Vlog WHERE YoutubeId = N'vECuYIiFSSM') AND Lang = 'zh')
    INSERT dbo.VlogI18n (VlogId, Lang, Title, Description)
    VALUES ((SELECT Id FROM dbo.Vlog WHERE YoutubeId = N'vECuYIiFSSM'), 'zh', N'整合式低碳生產', N'低碳生產');
ELSE
    UPDATE dbo.VlogI18n SET Title = N'整合式低碳生產', Description = N'低碳生產' WHERE VlogId = (SELECT Id FROM dbo.Vlog WHERE YoutubeId = N'vECuYIiFSSM') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.VlogI18n WHERE VlogId = (SELECT Id FROM dbo.Vlog WHERE YoutubeId = N'vECuYIiFSSM') AND Lang = 'en')
    INSERT dbo.VlogI18n (VlogId, Lang, Title, Description)
    VALUES ((SELECT Id FROM dbo.Vlog WHERE YoutubeId = N'vECuYIiFSSM'), 'en', N'Integrated Low-Carbon Production', N'Low-carbon production');
ELSE
    UPDATE dbo.VlogI18n SET Title = N'Integrated Low-Carbon Production', Description = N'Low-carbon production' WHERE VlogId = (SELECT Id FROM dbo.Vlog WHERE YoutubeId = N'vECuYIiFSSM') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.Vlog WHERE YoutubeId = N'Hc_WJwWZQSo')
    INSERT dbo.Vlog (CategoryId, YoutubeId, ThumbOverridePath, IsMainFeature, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Vlog' AND Code = 'awards'), N'Hc_WJwWZQSo', NULL, 0, 40, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.VlogI18n WHERE VlogId = (SELECT Id FROM dbo.Vlog WHERE YoutubeId = N'Hc_WJwWZQSo') AND Lang = 'zh')
    INSERT dbo.VlogI18n (VlogId, Lang, Title, Description)
    VALUES ((SELECT Id FROM dbo.Vlog WHERE YoutubeId = N'Hc_WJwWZQSo'), 'zh', N'2024 中小企業標竿企業獎', N'獲獎肯定');
ELSE
    UPDATE dbo.VlogI18n SET Title = N'2024 中小企業標竿企業獎', Description = N'獲獎肯定' WHERE VlogId = (SELECT Id FROM dbo.Vlog WHERE YoutubeId = N'Hc_WJwWZQSo') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.VlogI18n WHERE VlogId = (SELECT Id FROM dbo.Vlog WHERE YoutubeId = N'Hc_WJwWZQSo') AND Lang = 'en')
    INSERT dbo.VlogI18n (VlogId, Lang, Title, Description)
    VALUES ((SELECT Id FROM dbo.Vlog WHERE YoutubeId = N'Hc_WJwWZQSo'), 'en', N'2024 SME Benchmark Enterprise Award', N'Awards');
ELSE
    UPDATE dbo.VlogI18n SET Title = N'2024 SME Benchmark Enterprise Award', Description = N'Awards' WHERE VlogId = (SELECT Id FROM dbo.Vlog WHERE YoutubeId = N'Hc_WJwWZQSo') AND Lang = 'en';

GO

/* ── faq → Faq（8 筆）──────────────────────────── */
IF NOT EXISTS (SELECT 1 FROM dbo.Faq WHERE SortOrder = 10)
    INSERT dbo.Faq (SortOrder, IsPublished) VALUES (10, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.FaqI18n WHERE FaqId = (SELECT Id FROM dbo.Faq WHERE SortOrder = 10) AND Lang = 'zh')
    INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
    VALUES ((SELECT Id FROM dbo.Faq WHERE SortOrder = 10), 'zh', N'最小訂購量是多少？', N'<p>視製程而定。平版彩盒通常自 1,000 個起；數位與 UV 產線的短版與試產可以更少。告訴我們您實際需要的數量 —— 我們會規劃最經濟的做法，而不是硬性要求一個最低量。</p>');
ELSE
    UPDATE dbo.FaqI18n SET Question = N'最小訂購量是多少？', AnswerHtml = N'<p>視製程而定。平版彩盒通常自 1,000 個起；數位與 UV 產線的短版與試產可以更少。告訴我們您實際需要的數量 —— 我們會規劃最經濟的做法，而不是硬性要求一個最低量。</p>' WHERE FaqId = (SELECT Id FROM dbo.Faq WHERE SortOrder = 10) AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.FaqI18n WHERE FaqId = (SELECT Id FROM dbo.Faq WHERE SortOrder = 10) AND Lang = 'en')
    INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
    VALUES ((SELECT Id FROM dbo.Faq WHERE SortOrder = 10), 'en', N'What is your minimum order quantity?', N'<p>It depends on the process. Offset color boxes typically start around 1,000 units; short-run and pilot production can go lower on our digital and UV lines. Tell us the quantity you actually need — we will spec the most economical route rather than force a minimum.</p>');
ELSE
    UPDATE dbo.FaqI18n SET Question = N'What is your minimum order quantity?', AnswerHtml = N'<p>It depends on the process. Offset color boxes typically start around 1,000 units; short-run and pilot production can go lower on our digital and UV lines. Tell us the quantity you actually need — we will spec the most economical route rather than force a minimum.</p>' WHERE FaqId = (SELECT Id FROM dbo.Faq WHERE SortOrder = 10) AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.Faq WHERE SortOrder = 20)
    INSERT dbo.Faq (SortOrder, IsPublished) VALUES (20, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.FaqI18n WHERE FaqId = (SELECT Id FROM dbo.Faq WHERE SortOrder = 20) AND Lang = 'zh')
    INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
    VALUES ((SELECT Id FROM dbo.Faq WHERE SortOrder = 20), 'zh', N'可以做食品級與藥品包裝嗎？', N'<p>可以。食品接觸使用低遷移、低氣味油墨系統；藥品彩盒採符合 GMP 的檢驗流程與批次追溯。合規文件會與訂單一併備齊。</p>');
ELSE
    UPDATE dbo.FaqI18n SET Question = N'可以做食品級與藥品包裝嗎？', AnswerHtml = N'<p>可以。食品接觸使用低遷移、低氣味油墨系統；藥品彩盒採符合 GMP 的檢驗流程與批次追溯。合規文件會與訂單一併備齊。</p>' WHERE FaqId = (SELECT Id FROM dbo.Faq WHERE SortOrder = 20) AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.FaqI18n WHERE FaqId = (SELECT Id FROM dbo.Faq WHERE SortOrder = 20) AND Lang = 'en')
    INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
    VALUES ((SELECT Id FROM dbo.Faq WHERE SortOrder = 20), 'en', N'Can you handle food-grade and pharma packaging requirements?', N'<p>Yes. We run migration-safe, low-odor ink systems for food contact, and GMP-aligned inspection with batch traceability for pharmaceutical cartons. Compliance documentation is prepared together with the job.</p>');
ELSE
    UPDATE dbo.FaqI18n SET Question = N'Can you handle food-grade and pharma packaging requirements?', AnswerHtml = N'<p>Yes. We run migration-safe, low-odor ink systems for food contact, and GMP-aligned inspection with batch traceability for pharmaceutical cartons. Compliance documentation is prepared together with the job.</p>' WHERE FaqId = (SELECT Id FROM dbo.Faq WHERE SortOrder = 20) AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.Faq WHERE SortOrder = 30)
    INSERT dbo.Faq (SortOrder, IsPublished) VALUES (30, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.FaqI18n WHERE FaqId = (SELECT Id FROM dbo.Faq WHERE SortOrder = 30) AND Lang = 'zh')
    INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
    VALUES ((SELECT Id FROM dbo.Faq WHERE SortOrder = 30), 'zh', N'報價需要提供哪些檔案？', N'<p>刀模圖（AI／PDF，若已有）、PDF/X 完稿，以及目標數量、紙材與加工方式。還沒有刀模圖？提供產品尺寸，我們可以幫您提結構建議。</p>');
ELSE
    UPDATE dbo.FaqI18n SET Question = N'報價需要提供哪些檔案？', AnswerHtml = N'<p>刀模圖（AI／PDF，若已有）、PDF/X 完稿，以及目標數量、紙材與加工方式。還沒有刀模圖？提供產品尺寸，我們可以幫您提結構建議。</p>' WHERE FaqId = (SELECT Id FROM dbo.Faq WHERE SortOrder = 30) AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.FaqI18n WHERE FaqId = (SELECT Id FROM dbo.Faq WHERE SortOrder = 30) AND Lang = 'en')
    INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
    VALUES ((SELECT Id FROM dbo.Faq WHERE SortOrder = 30), 'en', N'What files do you need to start a quote?', N'<p>A dieline (AI/PDF) if you have one, artwork in PDF/X, and your target quantity, board and finish. No dieline yet? Send product dimensions and we will propose a structure.</p>');
ELSE
    UPDATE dbo.FaqI18n SET Question = N'What files do you need to start a quote?', AnswerHtml = N'<p>A dieline (AI/PDF) if you have one, artwork in PDF/X, and your target quantity, board and finish. No dieline yet? Send product dimensions and we will propose a structure.</p>' WHERE FaqId = (SELECT Id FROM dbo.Faq WHERE SortOrder = 30) AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.Faq WHERE SortOrder = 40)
    INSERT dbo.Faq (SortOrder, IsPublished) VALUES (40, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.FaqI18n WHERE FaqId = (SELECT Id FROM dbo.Faq WHERE SortOrder = 40) AND Lang = 'zh')
    INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
    VALUES ((SELECT Id FROM dbo.Faq WHERE SortOrder = 40), 'zh', N'訂單的碳足跡怎麼計算？', N'<p>我們在每個生產階段量測能源、紙板、油墨與廢棄物，對照通過查證的基線，再依批次分攤到您的訂單。您會拿到一份可供 ESG 團隊引用的單筆訂單數字，並附計算方法說明。</p>');
ELSE
    UPDATE dbo.FaqI18n SET Question = N'訂單的碳足跡怎麼計算？', AnswerHtml = N'<p>我們在每個生產階段量測能源、紙板、油墨與廢棄物，對照通過查證的基線，再依批次分攤到您的訂單。您會拿到一份可供 ESG 團隊引用的單筆訂單數字，並附計算方法說明。</p>' WHERE FaqId = (SELECT Id FROM dbo.Faq WHERE SortOrder = 40) AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.FaqI18n WHERE FaqId = (SELECT Id FROM dbo.Faq WHERE SortOrder = 40) AND Lang = 'en')
    INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
    VALUES ((SELECT Id FROM dbo.Faq WHERE SortOrder = 40), 'en', N'How do you calculate the carbon footprint of my order?', N'<p>We meter energy, board, ink and waste at each production stage against our audited baseline, then allocate to your order by run. You receive a per-order figure your ESG team can cite, with methodology notes.</p>');
ELSE
    UPDATE dbo.FaqI18n SET Question = N'How do you calculate the carbon footprint of my order?', AnswerHtml = N'<p>We meter energy, board, ink and waste at each production stage against our audited baseline, then allocate to your order by run. You receive a per-order figure your ESG team can cite, with methodology notes.</p>' WHERE FaqId = (SELECT Id FROM dbo.Faq WHERE SortOrder = 40) AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.Faq WHERE SortOrder = 50)
    INSERT dbo.Faq (SortOrder, IsPublished) VALUES (50, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.FaqI18n WHERE FaqId = (SELECT Id FROM dbo.Faq WHERE SortOrder = 50) AND Lang = 'zh')
    INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
    VALUES ((SELECT Id FROM dbo.Faq WHERE SortOrder = 50), 'zh', N'可以印在哪些環保材質上？', N'<p>FSC™ 驗證的原生紙與再生紙板、牛皮紙，以及特殊再生紙材。只要規格允許，我們一律以可回收塗層取代塑膠淋膜。</p>');
ELSE
    UPDATE dbo.FaqI18n SET Question = N'可以印在哪些環保材質上？', AnswerHtml = N'<p>FSC™ 驗證的原生紙與再生紙板、牛皮紙，以及特殊再生紙材。只要規格允許，我們一律以可回收塗層取代塑膠淋膜。</p>' WHERE FaqId = (SELECT Id FROM dbo.Faq WHERE SortOrder = 50) AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.FaqI18n WHERE FaqId = (SELECT Id FROM dbo.Faq WHERE SortOrder = 50) AND Lang = 'en')
    INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
    VALUES ((SELECT Id FROM dbo.Faq WHERE SortOrder = 50), 'en', N'Which eco materials can you print on?', N'<p>FSC™-certified virgin and recycled boards, kraft, and specialty recycled stocks. We replace plastic lamination with recyclable coatings wherever the spec allows.</p>');
ELSE
    UPDATE dbo.FaqI18n SET Question = N'Which eco materials can you print on?', AnswerHtml = N'<p>FSC™-certified virgin and recycled boards, kraft, and specialty recycled stocks. We replace plastic lamination with recyclable coatings wherever the spec allows.</p>' WHERE FaqId = (SELECT Id FROM dbo.Faq WHERE SortOrder = 50) AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.Faq WHERE SortOrder = 60)
    INSERT dbo.Faq (SortOrder, IsPublished) VALUES (60, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.FaqI18n WHERE FaqId = (SELECT Id FROM dbo.Faq WHERE SortOrder = 60) AND Lang = 'zh')
    INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
    VALUES ((SELECT Id FROM dbo.Faq WHERE SortOrder = 60), 'zh', N'一般交期多久？', N'<p>標準彩盒訂單自完稿確認起 10–15 個工作天；重複訂單更快。複雜加工會增加工時 —— 我們依實際機台產能承諾日期，並且守住它。</p>');
ELSE
    UPDATE dbo.FaqI18n SET Question = N'一般交期多久？', AnswerHtml = N'<p>標準彩盒訂單自完稿確認起 10–15 個工作天；重複訂單更快。複雜加工會增加工時 —— 我們依實際機台產能承諾日期，並且守住它。</p>' WHERE FaqId = (SELECT Id FROM dbo.Faq WHERE SortOrder = 60) AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.FaqI18n WHERE FaqId = (SELECT Id FROM dbo.Faq WHERE SortOrder = 60) AND Lang = 'en')
    INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
    VALUES ((SELECT Id FROM dbo.Faq WHERE SortOrder = 60), 'en', N'What are typical lead times?', N'<p>Standard color box orders run 10–15 working days from artwork approval; repeat orders are faster. Complex finishing adds time — we commit dates from real machine capacity, and keep them.</p>');
ELSE
    UPDATE dbo.FaqI18n SET Question = N'What are typical lead times?', AnswerHtml = N'<p>Standard color box orders run 10–15 working days from artwork approval; repeat orders are faster. Complex finishing adds time — we commit dates from real machine capacity, and keep them.</p>' WHERE FaqId = (SELECT Id FROM dbo.Faq WHERE SortOrder = 60) AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.Faq WHERE SortOrder = 70)
    INSERT dbo.Faq (SortOrder, IsPublished) VALUES (70, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.FaqI18n WHERE FaqId = (SELECT Id FROM dbo.Faq WHERE SortOrder = 70) AND Lang = 'zh')
    INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
    VALUES ((SELECT Id FROM dbo.Faq WHERE SortOrder = 70), 'zh', N'有提供結構設計與打樣嗎？', N'<p>有。印前團隊提供刀模圖、白樣與印刷樣，出貨結構在量產前另做落下與運輸測試。</p>');
ELSE
    UPDATE dbo.FaqI18n SET Question = N'有提供結構設計與打樣嗎？', AnswerHtml = N'<p>有。印前團隊提供刀模圖、白樣與印刷樣，出貨結構在量產前另做落下與運輸測試。</p>' WHERE FaqId = (SELECT Id FROM dbo.Faq WHERE SortOrder = 70) AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.FaqI18n WHERE FaqId = (SELECT Id FROM dbo.Faq WHERE SortOrder = 70) AND Lang = 'en')
    INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
    VALUES ((SELECT Id FROM dbo.Faq WHERE SortOrder = 70), 'en', N'Do you support structural design and prototyping?', N'<p>Yes. Our pre-press team provides dielines, white samples and printed mockups, plus drop and transit testing for shipping structures before mass production.</p>');
ELSE
    UPDATE dbo.FaqI18n SET Question = N'Do you support structural design and prototyping?', AnswerHtml = N'<p>Yes. Our pre-press team provides dielines, white samples and printed mockups, plus drop and transit testing for shipping structures before mass production.</p>' WHERE FaqId = (SELECT Id FROM dbo.Faq WHERE SortOrder = 70) AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.Faq WHERE SortOrder = 80)
    INSERT dbo.Faq (SortOrder, IsPublished) VALUES (80, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.FaqI18n WHERE FaqId = (SELECT Id FROM dbo.Faq WHERE SortOrder = 80) AND Lang = 'zh')
    INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
    VALUES ((SELECT Id FROM dbo.Faq WHERE SortOrder = 80), 'zh', N'國外客戶可以合作嗎？', N'<p>當然 —— 我們有相當比例的產出銷往日本、歐盟與北美。外銷紙箱、文件與貨運協調皆由台南廠統一處理。</p>');
ELSE
    UPDATE dbo.FaqI18n SET Question = N'國外客戶可以合作嗎？', AnswerHtml = N'<p>當然 —— 我們有相當比例的產出銷往日本、歐盟與北美。外銷紙箱、文件與貨運協調皆由台南廠統一處理。</p>' WHERE FaqId = (SELECT Id FROM dbo.Faq WHERE SortOrder = 80) AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.FaqI18n WHERE FaqId = (SELECT Id FROM dbo.Faq WHERE SortOrder = 80) AND Lang = 'en')
    INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
    VALUES ((SELECT Id FROM dbo.Faq WHERE SortOrder = 80), 'en', N'Can international clients work with you?', N'<p>Absolutely — a large share of our output ships to Japan, the EU and North America. We handle export cartons, documentation and freight coordination from the Tainan plant.</p>');
ELSE
    UPDATE dbo.FaqI18n SET Question = N'Can international clients work with you?', AnswerHtml = N'<p>Absolutely — a large share of our output ships to Japan, the EU and North America. We handle export cartons, documentation and freight coordination from the Tainan plant.</p>' WHERE FaqId = (SELECT Id FROM dbo.Faq WHERE SortOrder = 80) AND Lang = 'en';

GO

/* ── trend → IndustryTrend（5 筆）──────────────────────────── */
IF NOT EXISTS (SELECT 1 FROM dbo.IndustryTrend WHERE SortOrder = 10)
    INSERT dbo.IndustryTrend (SortOrder, IsPublished) VALUES (10, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.IndustryTrendI18n WHERE IndustryTrendId = (SELECT Id FROM dbo.IndustryTrend WHERE SortOrder = 10) AND Lang = 'zh')
    INSERT dbo.IndustryTrendI18n (IndustryTrendId, Lang, Title, BodyHtml)
    VALUES ((SELECT Id FROM dbo.IndustryTrend WHERE SortOrder = 10), 'zh', N'法規正在定調節奏', N'<p>歐盟、日本與北美的包裝法規正朝可回收性、再生成分與資訊揭露收斂。過去屬於美感的設計決定 —— 淋膜、燙金、開窗 —— 現在都成了合規決定。</p>');
ELSE
    UPDATE dbo.IndustryTrendI18n SET Title = N'法規正在定調節奏', BodyHtml = N'<p>歐盟、日本與北美的包裝法規正朝可回收性、再生成分與資訊揭露收斂。過去屬於美感的設計決定 —— 淋膜、燙金、開窗 —— 現在都成了合規決定。</p>' WHERE IndustryTrendId = (SELECT Id FROM dbo.IndustryTrend WHERE SortOrder = 10) AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.IndustryTrendI18n WHERE IndustryTrendId = (SELECT Id FROM dbo.IndustryTrend WHERE SortOrder = 10) AND Lang = 'en')
    INSERT dbo.IndustryTrendI18n (IndustryTrendId, Lang, Title, BodyHtml)
    VALUES ((SELECT Id FROM dbo.IndustryTrend WHERE SortOrder = 10), 'en', N'Regulation is setting the pace', N'<p>Packaging rules in the EU, Japan and North America are converging on recyclability, recycled content and disclosure. Design decisions that used to be aesthetic — a laminate, a foil, a window — are now compliance decisions.</p>');
ELSE
    UPDATE dbo.IndustryTrendI18n SET Title = N'Regulation is setting the pace', BodyHtml = N'<p>Packaging rules in the EU, Japan and North America are converging on recyclability, recycled content and disclosure. Design decisions that used to be aesthetic — a laminate, a foil, a window — are now compliance decisions.</p>' WHERE IndustryTrendId = (SELECT Id FROM dbo.IndustryTrend WHERE SortOrder = 10) AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.IndustryTrend WHERE SortOrder = 20)
    INSERT dbo.IndustryTrend (SortOrder, IsPublished) VALUES (20, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.IndustryTrendI18n WHERE IndustryTrendId = (SELECT Id FROM dbo.IndustryTrend WHERE SortOrder = 20) AND Lang = 'zh')
    INSERT dbo.IndustryTrendI18n (IndustryTrendId, Lang, Title, BodyHtml)
    VALUES ((SELECT Id FROM dbo.IndustryTrend WHERE SortOrder = 20), 'zh', N'單一材質取代複合結構', N'<p>複合結構印起來漂亮、回收起來麻煩。趨勢是走向單一紙材、單一塗層、單一廢棄流 —— 這把壓力推回印刷與加工端：要在不用塑膠淋膜的前提下，做出同樣的貨架效果。</p>');
ELSE
    UPDATE dbo.IndustryTrendI18n SET Title = N'單一材質取代複合結構', BodyHtml = N'<p>複合結構印起來漂亮、回收起來麻煩。趨勢是走向單一紙材、單一塗層、單一廢棄流 —— 這把壓力推回印刷與加工端：要在不用塑膠淋膜的前提下，做出同樣的貨架效果。</p>' WHERE IndustryTrendId = (SELECT Id FROM dbo.IndustryTrend WHERE SortOrder = 20) AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.IndustryTrendI18n WHERE IndustryTrendId = (SELECT Id FROM dbo.IndustryTrend WHERE SortOrder = 20) AND Lang = 'en')
    INSERT dbo.IndustryTrendI18n (IndustryTrendId, Lang, Title, BodyHtml)
    VALUES ((SELECT Id FROM dbo.IndustryTrend WHERE SortOrder = 20), 'en', N'Mono-material replaces the composite pack', N'<p>Composite structures print beautifully and recycle badly. The move is toward one board, one coating, one waste stream — which pushes the burden onto printing and finishing to deliver the same shelf impact without plastic lamination.</p>');
ELSE
    UPDATE dbo.IndustryTrendI18n SET Title = N'Mono-material replaces the composite pack', BodyHtml = N'<p>Composite structures print beautifully and recycle badly. The move is toward one board, one coating, one waste stream — which pushes the burden onto printing and finishing to deliver the same shelf impact without plastic lamination.</p>' WHERE IndustryTrendId = (SELECT Id FROM dbo.IndustryTrend WHERE SortOrder = 20) AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.IndustryTrend WHERE SortOrder = 30)
    INSERT dbo.IndustryTrend (SortOrder, IsPublished) VALUES (30, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.IndustryTrendI18n WHERE IndustryTrendId = (SELECT Id FROM dbo.IndustryTrend WHERE SortOrder = 30) AND Lang = 'zh')
    INSERT dbo.IndustryTrendI18n (IndustryTrendId, Lang, Title, BodyHtml)
    VALUES ((SELECT Id FROM dbo.IndustryTrend WHERE SortOrder = 30), 'zh', N'碳數據成為報價的一個欄位', N'<p>範疇三盤查讓一只印刷紙盒變成一個數據點。品牌愈來愈需要一個 ESG 團隊能引用的單筆訂單數字 —— 對照通過查證的基線量測而來，不是拿產業平均值估的。</p>');
ELSE
    UPDATE dbo.IndustryTrendI18n SET Title = N'碳數據成為報價的一個欄位', BodyHtml = N'<p>範疇三盤查讓一只印刷紙盒變成一個數據點。品牌愈來愈需要一個 ESG 團隊能引用的單筆訂單數字 —— 對照通過查證的基線量測而來，不是拿產業平均值估的。</p>' WHERE IndustryTrendId = (SELECT Id FROM dbo.IndustryTrend WHERE SortOrder = 30) AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.IndustryTrendI18n WHERE IndustryTrendId = (SELECT Id FROM dbo.IndustryTrend WHERE SortOrder = 30) AND Lang = 'en')
    INSERT dbo.IndustryTrendI18n (IndustryTrendId, Lang, Title, BodyHtml)
    VALUES ((SELECT Id FROM dbo.IndustryTrend WHERE SortOrder = 30), 'en', N'Carbon data becomes a line item', N'<p>Scope 3 reporting has turned the printed carton into a data point. Brands increasingly need a per-order figure their ESG team can cite — measured against an audited baseline, not estimated from an industry average.</p>');
ELSE
    UPDATE dbo.IndustryTrendI18n SET Title = N'Carbon data becomes a line item', BodyHtml = N'<p>Scope 3 reporting has turned the printed carton into a data point. Brands increasingly need a per-order figure their ESG team can cite — measured against an audited baseline, not estimated from an industry average.</p>' WHERE IndustryTrendId = (SELECT Id FROM dbo.IndustryTrend WHERE SortOrder = 30) AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.IndustryTrend WHERE SortOrder = 40)
    INSERT dbo.IndustryTrend (SortOrder, IsPublished) VALUES (40, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.IndustryTrendI18n WHERE IndustryTrendId = (SELECT Id FROM dbo.IndustryTrend WHERE SortOrder = 40) AND Lang = 'zh')
    INSERT dbo.IndustryTrendI18n (IndustryTrendId, Lang, Title, BodyHtml)
    VALUES ((SELECT Id FROM dbo.IndustryTrend WHERE SortOrder = 40), 'zh', N'版次變短、版本變多', N'<p>產品線正碎片化成區域版、季節版與活動版。經濟印量持續下降，這讓數位與可變資料流程成為平版的搭配，而不是取代。</p>');
ELSE
    UPDATE dbo.IndustryTrendI18n SET Title = N'版次變短、版本變多', BodyHtml = N'<p>產品線正碎片化成區域版、季節版與活動版。經濟印量持續下降，這讓數位與可變資料流程成為平版的搭配，而不是取代。</p>' WHERE IndustryTrendId = (SELECT Id FROM dbo.IndustryTrend WHERE SortOrder = 40) AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.IndustryTrendI18n WHERE IndustryTrendId = (SELECT Id FROM dbo.IndustryTrend WHERE SortOrder = 40) AND Lang = 'en')
    INSERT dbo.IndustryTrendI18n (IndustryTrendId, Lang, Title, BodyHtml)
    VALUES ((SELECT Id FROM dbo.IndustryTrend WHERE SortOrder = 40), 'en', N'Shorter runs, more versions', N'<p>Product ranges are fragmenting into regional, seasonal and campaign variants. The economic run length keeps falling, which favours digital and variable-data workflows alongside offset rather than instead of it.</p>');
ELSE
    UPDATE dbo.IndustryTrendI18n SET Title = N'Shorter runs, more versions', BodyHtml = N'<p>Product ranges are fragmenting into regional, seasonal and campaign variants. The economic run length keeps falling, which favours digital and variable-data workflows alongside offset rather than instead of it.</p>' WHERE IndustryTrendId = (SELECT Id FROM dbo.IndustryTrend WHERE SortOrder = 40) AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.IndustryTrend WHERE SortOrder = 50)
    INSERT dbo.IndustryTrend (SortOrder, IsPublished) VALUES (50, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.IndustryTrendI18n WHERE IndustryTrendId = (SELECT Id FROM dbo.IndustryTrend WHERE SortOrder = 50) AND Lang = 'zh')
    INSERT dbo.IndustryTrendI18n (IndustryTrendId, Lang, Title, BodyHtml)
    VALUES ((SELECT Id FROM dbo.IndustryTrend WHERE SortOrder = 50), 'zh', N'從印版到棧板的全程追溯', N'<p>食品接觸與藥品業務把所有人的標準都拉高了。批次追溯、低遷移油墨系統與檢驗紀錄，正從受管制的類別擴散到一般零售包裝。</p>');
ELSE
    UPDATE dbo.IndustryTrendI18n SET Title = N'從印版到棧板的全程追溯', BodyHtml = N'<p>食品接觸與藥品業務把所有人的標準都拉高了。批次追溯、低遷移油墨系統與檢驗紀錄，正從受管制的類別擴散到一般零售包裝。</p>' WHERE IndustryTrendId = (SELECT Id FROM dbo.IndustryTrend WHERE SortOrder = 50) AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.IndustryTrendI18n WHERE IndustryTrendId = (SELECT Id FROM dbo.IndustryTrend WHERE SortOrder = 50) AND Lang = 'en')
    INSERT dbo.IndustryTrendI18n (IndustryTrendId, Lang, Title, BodyHtml)
    VALUES ((SELECT Id FROM dbo.IndustryTrend WHERE SortOrder = 50), 'en', N'Traceability from plate to pallet', N'<p>Food-contact and pharmaceutical work has raised the bar for everyone. Batch traceability, migration-safe ink systems and inspection records are moving from regulated categories into mainstream retail packaging.</p>');
ELSE
    UPDATE dbo.IndustryTrendI18n SET Title = N'Traceability from plate to pallet', BodyHtml = N'<p>Food-contact and pharmaceutical work has raised the bar for everyone. Batch traceability, migration-safe ink systems and inspection records are moving from regulated categories into mainstream retail packaging.</p>' WHERE IndustryTrendId = (SELECT Id FROM dbo.IndustryTrend WHERE SortOrder = 50) AND Lang = 'en';

GO

/* ── certification → Certification（14 筆）──────────────────────────── */
IF NOT EXISTS (SELECT 1 FROM dbo.Certification WHERE LogoPath = N'assets/cert-g7.png')
    INSERT dbo.Certification (CategoryId, LogoPath, LinkUrl, ShowOnHome, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Certification' AND Code = 'certification'), N'assets/cert-g7.png', NULL, 1, 10, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.CertificationI18n WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-g7.png') AND Lang = 'zh')
    INSERT dbo.CertificationI18n (CertificationId, Lang, Name, Description, LogoAlt)
    VALUES ((SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-g7.png'), 'zh', N'G7 Master 認證廠', NULL, N'G7 Master 認證廠');
ELSE
    UPDATE dbo.CertificationI18n SET Name = N'G7 Master 認證廠', Description = NULL, LogoAlt = N'G7 Master 認證廠' WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-g7.png') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.CertificationI18n WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-g7.png') AND Lang = 'en')
    INSERT dbo.CertificationI18n (CertificationId, Lang, Name, Description, LogoAlt)
    VALUES ((SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-g7.png'), 'en', N'G7 Master Qualified Facility', NULL, N'G7 Master Qualified Facility');
ELSE
    UPDATE dbo.CertificationI18n SET Name = N'G7 Master Qualified Facility', Description = NULL, LogoAlt = N'G7 Master Qualified Facility' WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-g7.png') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.Certification WHERE LogoPath = N'assets/cert-gmi.png')
    INSERT dbo.Certification (CategoryId, LogoPath, LinkUrl, ShowOnHome, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Certification' AND Code = 'certification'), N'assets/cert-gmi.png', NULL, 1, 20, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.CertificationI18n WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-gmi.png') AND Lang = 'zh')
    INSERT dbo.CertificationI18n (CertificationId, Lang, Name, Description, LogoAlt)
    VALUES ((SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-gmi.png'), 'zh', N'GMI 認證印刷廠', NULL, N'GMI 認證印刷廠');
ELSE
    UPDATE dbo.CertificationI18n SET Name = N'GMI 認證印刷廠', Description = NULL, LogoAlt = N'GMI 認證印刷廠' WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-gmi.png') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.CertificationI18n WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-gmi.png') AND Lang = 'en')
    INSERT dbo.CertificationI18n (CertificationId, Lang, Name, Description, LogoAlt)
    VALUES ((SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-gmi.png'), 'en', N'GMI Certified Print Facility', NULL, N'GMI Certified Print Facility');
ELSE
    UPDATE dbo.CertificationI18n SET Name = N'GMI Certified Print Facility', Description = NULL, LogoAlt = N'GMI Certified Print Facility' WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-gmi.png') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.Certification WHERE LogoPath = N'assets/cert-iso9001.png')
    INSERT dbo.Certification (CategoryId, LogoPath, LinkUrl, ShowOnHome, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Certification' AND Code = 'certification'), N'assets/cert-iso9001.png', NULL, 1, 30, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.CertificationI18n WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-iso9001.png') AND Lang = 'zh')
    INSERT dbo.CertificationI18n (CertificationId, Lang, Name, Description, LogoAlt)
    VALUES ((SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-iso9001.png'), 'zh', N'ISO 9001 品質管理系統', NULL, N'ISO 9001 品質管理系統');
ELSE
    UPDATE dbo.CertificationI18n SET Name = N'ISO 9001 品質管理系統', Description = NULL, LogoAlt = N'ISO 9001 品質管理系統' WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-iso9001.png') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.CertificationI18n WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-iso9001.png') AND Lang = 'en')
    INSERT dbo.CertificationI18n (CertificationId, Lang, Name, Description, LogoAlt)
    VALUES ((SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-iso9001.png'), 'en', N'ISO 9001 Quality Assurance Management', NULL, N'ISO 9001 Quality Assurance Management');
ELSE
    UPDATE dbo.CertificationI18n SET Name = N'ISO 9001 Quality Assurance Management', Description = NULL, LogoAlt = N'ISO 9001 Quality Assurance Management' WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-iso9001.png') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.Certification WHERE LogoPath = N'assets/cert-iso14001.png')
    INSERT dbo.Certification (CategoryId, LogoPath, LinkUrl, ShowOnHome, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Certification' AND Code = 'certification'), N'assets/cert-iso14001.png', NULL, 1, 40, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.CertificationI18n WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-iso14001.png') AND Lang = 'zh')
    INSERT dbo.CertificationI18n (CertificationId, Lang, Name, Description, LogoAlt)
    VALUES ((SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-iso14001.png'), 'zh', N'ISO 14001 環境管理系統', NULL, N'ISO 14001 環境管理系統');
ELSE
    UPDATE dbo.CertificationI18n SET Name = N'ISO 14001 環境管理系統', Description = NULL, LogoAlt = N'ISO 14001 環境管理系統' WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-iso14001.png') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.CertificationI18n WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-iso14001.png') AND Lang = 'en')
    INSERT dbo.CertificationI18n (CertificationId, Lang, Name, Description, LogoAlt)
    VALUES ((SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-iso14001.png'), 'en', N'ISO 14001 Environmental Management', NULL, N'ISO 14001 Environmental Management');
ELSE
    UPDATE dbo.CertificationI18n SET Name = N'ISO 14001 Environmental Management', Description = NULL, LogoAlt = N'ISO 14001 Environmental Management' WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-iso14001.png') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.Certification WHERE LogoPath = N'assets/cert-iso45001.png')
    INSERT dbo.Certification (CategoryId, LogoPath, LinkUrl, ShowOnHome, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Certification' AND Code = 'certification'), N'assets/cert-iso45001.png', NULL, 1, 50, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.CertificationI18n WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-iso45001.png') AND Lang = 'zh')
    INSERT dbo.CertificationI18n (CertificationId, Lang, Name, Description, LogoAlt)
    VALUES ((SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-iso45001.png'), 'zh', N'ISO 45001 職業安全衛生管理系統', NULL, N'ISO 45001 職業安全衛生管理系統');
ELSE
    UPDATE dbo.CertificationI18n SET Name = N'ISO 45001 職業安全衛生管理系統', Description = NULL, LogoAlt = N'ISO 45001 職業安全衛生管理系統' WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-iso45001.png') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.CertificationI18n WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-iso45001.png') AND Lang = 'en')
    INSERT dbo.CertificationI18n (CertificationId, Lang, Name, Description, LogoAlt)
    VALUES ((SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-iso45001.png'), 'en', N'ISO 45001 Occupational Health & Safety', NULL, N'ISO 45001 Occupational Health & Safety');
ELSE
    UPDATE dbo.CertificationI18n SET Name = N'ISO 45001 Occupational Health & Safety', Description = NULL, LogoAlt = N'ISO 45001 Occupational Health & Safety' WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-iso45001.png') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.Certification WHERE LogoPath = N'assets/cert-fsc.png')
    INSERT dbo.Certification (CategoryId, LogoPath, LinkUrl, ShowOnHome, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Certification' AND Code = 'certification'), N'assets/cert-fsc.png', NULL, 1, 60, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.CertificationI18n WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-fsc.png') AND Lang = 'zh')
    INSERT dbo.CertificationI18n (CertificationId, Lang, Name, Description, LogoAlt)
    VALUES ((SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-fsc.png'), 'zh', N'FSC™ 森林管理驗證', NULL, N'FSC™ 森林管理驗證');
ELSE
    UPDATE dbo.CertificationI18n SET Name = N'FSC™ 森林管理驗證', Description = NULL, LogoAlt = N'FSC™ 森林管理驗證' WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-fsc.png') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.CertificationI18n WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-fsc.png') AND Lang = 'en')
    INSERT dbo.CertificationI18n (CertificationId, Lang, Name, Description, LogoAlt)
    VALUES ((SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-fsc.png'), 'en', N'FSC certified', NULL, N'FSC certified');
ELSE
    UPDATE dbo.CertificationI18n SET Name = N'FSC certified', Description = NULL, LogoAlt = N'FSC certified' WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-fsc.png') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.Certification WHERE LogoPath = N'assets/cert-leed-gold.png')
    INSERT dbo.Certification (CategoryId, LogoPath, LinkUrl, ShowOnHome, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Certification' AND Code = 'certification'), N'assets/cert-leed-gold.png', NULL, 1, 70, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.CertificationI18n WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-leed-gold.png') AND Lang = 'zh')
    INSERT dbo.CertificationI18n (CertificationId, Lang, Name, Description, LogoAlt)
    VALUES ((SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-leed-gold.png'), 'zh', N'LEED 黃金級 2023', NULL, N'LEED 黃金級 2023');
ELSE
    UPDATE dbo.CertificationI18n SET Name = N'LEED 黃金級 2023', Description = NULL, LogoAlt = N'LEED 黃金級 2023' WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-leed-gold.png') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.CertificationI18n WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-leed-gold.png') AND Lang = 'en')
    INSERT dbo.CertificationI18n (CertificationId, Lang, Name, Description, LogoAlt)
    VALUES ((SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-leed-gold.png'), 'en', N'LEED Gold 2023', NULL, N'LEED Gold 2023');
ELSE
    UPDATE dbo.CertificationI18n SET Name = N'LEED Gold 2023', Description = NULL, LogoAlt = N'LEED Gold 2023' WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-leed-gold.png') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.Certification WHERE LogoPath = N'assets/cert-greenbuilding.png')
    INSERT dbo.Certification (CategoryId, LogoPath, LinkUrl, ShowOnHome, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Certification' AND Code = 'certification'), N'assets/cert-greenbuilding.png', NULL, 1, 80, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.CertificationI18n WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-greenbuilding.png') AND Lang = 'zh')
    INSERT dbo.CertificationI18n (CertificationId, Lang, Name, Description, LogoAlt)
    VALUES ((SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-greenbuilding.png'), 'zh', N'綠建築標章 —— 鑽石級', NULL, N'綠建築標章 —— 鑽石級');
ELSE
    UPDATE dbo.CertificationI18n SET Name = N'綠建築標章 —— 鑽石級', Description = NULL, LogoAlt = N'綠建築標章 —— 鑽石級' WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-greenbuilding.png') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.CertificationI18n WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-greenbuilding.png') AND Lang = 'en')
    INSERT dbo.CertificationI18n (CertificationId, Lang, Name, Description, LogoAlt)
    VALUES ((SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-greenbuilding.png'), 'en', N'Green Building Label — Diamond grade', NULL, N'Green Building Label — Diamond grade');
ELSE
    UPDATE dbo.CertificationI18n SET Name = N'Green Building Label — Diamond grade', Description = NULL, LogoAlt = N'Green Building Label — Diamond grade' WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-greenbuilding.png') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.Certification WHERE LogoPath = N'assets/cert-co2neutral.png')
    INSERT dbo.Certification (CategoryId, LogoPath, LinkUrl, ShowOnHome, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Certification' AND Code = 'certification'), N'assets/cert-co2neutral.png', NULL, 1, 90, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.CertificationI18n WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-co2neutral.png') AND Lang = 'zh')
    INSERT dbo.CertificationI18n (CertificationId, Lang, Name, Description, LogoAlt)
    VALUES ((SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-co2neutral.png'), 'zh', N'碳中和 CO2 Neutral', NULL, N'碳中和 CO2 Neutral');
ELSE
    UPDATE dbo.CertificationI18n SET Name = N'碳中和 CO2 Neutral', Description = NULL, LogoAlt = N'碳中和 CO2 Neutral' WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-co2neutral.png') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.CertificationI18n WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-co2neutral.png') AND Lang = 'en')
    INSERT dbo.CertificationI18n (CertificationId, Lang, Name, Description, LogoAlt)
    VALUES ((SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-co2neutral.png'), 'en', N'CO2 Neutral', NULL, N'CO2 Neutral');
ELSE
    UPDATE dbo.CertificationI18n SET Name = N'CO2 Neutral', Description = NULL, LogoAlt = N'CO2 Neutral' WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-co2neutral.png') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.Certification WHERE LogoPath = N'assets/cert-green.png')
    INSERT dbo.Certification (CategoryId, LogoPath, LinkUrl, ShowOnHome, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Certification' AND Code = 'certification'), N'assets/cert-green.png', NULL, 1, 100, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.CertificationI18n WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-green.png') AND Lang = 'zh')
    INSERT dbo.CertificationI18n (CertificationId, Lang, Name, Description, LogoAlt)
    VALUES ((SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-green.png'), 'zh', N'綠色印刷標章', NULL, N'綠色印刷標章');
ELSE
    UPDATE dbo.CertificationI18n SET Name = N'綠色印刷標章', Description = NULL, LogoAlt = N'綠色印刷標章' WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-green.png') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.CertificationI18n WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-green.png') AND Lang = 'en')
    INSERT dbo.CertificationI18n (CertificationId, Lang, Name, Description, LogoAlt)
    VALUES ((SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-green.png'), 'en', N'Green Printing', NULL, N'Green Printing');
ELSE
    UPDATE dbo.CertificationI18n SET Name = N'Green Printing', Description = NULL, LogoAlt = N'Green Printing' WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-green.png') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.Certification WHERE LogoPath = N'assets/cert-mof.png')
    INSERT dbo.Certification (CategoryId, LogoPath, LinkUrl, ShowOnHome, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Certification' AND Code = 'certification'), N'assets/cert-mof.png', NULL, 1, 110, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.CertificationI18n WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-mof.png') AND Lang = 'zh')
    INSERT dbo.CertificationI18n (CertificationId, Lang, Name, Description, LogoAlt)
    VALUES ((SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-mof.png'), 'zh', N'無礦物油 Mineral Oil Free', NULL, N'無礦物油 Mineral Oil Free');
ELSE
    UPDATE dbo.CertificationI18n SET Name = N'無礦物油 Mineral Oil Free', Description = NULL, LogoAlt = N'無礦物油 Mineral Oil Free' WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-mof.png') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.CertificationI18n WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-mof.png') AND Lang = 'en')
    INSERT dbo.CertificationI18n (CertificationId, Lang, Name, Description, LogoAlt)
    VALUES ((SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-mof.png'), 'en', N'Mineral Oil Free', NULL, N'Mineral Oil Free');
ELSE
    UPDATE dbo.CertificationI18n SET Name = N'Mineral Oil Free', Description = NULL, LogoAlt = N'Mineral Oil Free' WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-mof.png') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.Certification WHERE LogoPath = N'assets/cert-esg.png')
    INSERT dbo.Certification (CategoryId, LogoPath, LinkUrl, ShowOnHome, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Certification' AND Code = 'certification'), N'assets/cert-esg.png', NULL, 1, 120, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.CertificationI18n WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-esg.png') AND Lang = 'zh')
    INSERT dbo.CertificationI18n (CertificationId, Lang, Name, Description, LogoAlt)
    VALUES ((SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-esg.png'), 'zh', N'ESG —— 環境、社會、公司治理', NULL, N'ESG —— 環境、社會、公司治理');
ELSE
    UPDATE dbo.CertificationI18n SET Name = N'ESG —— 環境、社會、公司治理', Description = NULL, LogoAlt = N'ESG —— 環境、社會、公司治理' WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-esg.png') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.CertificationI18n WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-esg.png') AND Lang = 'en')
    INSERT dbo.CertificationI18n (CertificationId, Lang, Name, Description, LogoAlt)
    VALUES ((SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-esg.png'), 'en', N'ESG — Environmental, Social, Governance', NULL, N'ESG — Environmental, Social, Governance');
ELSE
    UPDATE dbo.CertificationI18n SET Name = N'ESG — Environmental, Social, Governance', Description = NULL, LogoAlt = N'ESG — Environmental, Social, Governance' WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-esg.png') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.Certification WHERE LogoPath = N'assets/cert-sedex.png')
    INSERT dbo.Certification (CategoryId, LogoPath, LinkUrl, ShowOnHome, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Certification' AND Code = 'certification'), N'assets/cert-sedex.png', NULL, 1, 130, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.CertificationI18n WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-sedex.png') AND Lang = 'zh')
    INSERT dbo.CertificationI18n (CertificationId, Lang, Name, Description, LogoAlt)
    VALUES ((SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-sedex.png'), 'zh', N'Sedex 會員', NULL, N'Sedex 會員');
ELSE
    UPDATE dbo.CertificationI18n SET Name = N'Sedex 會員', Description = NULL, LogoAlt = N'Sedex 會員' WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-sedex.png') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.CertificationI18n WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-sedex.png') AND Lang = 'en')
    INSERT dbo.CertificationI18n (CertificationId, Lang, Name, Description, LogoAlt)
    VALUES ((SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-sedex.png'), 'en', N'Sedex Member', NULL, N'Sedex Member');
ELSE
    UPDATE dbo.CertificationI18n SET Name = N'Sedex Member', Description = NULL, LogoAlt = N'Sedex Member' WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-sedex.png') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.Certification WHERE LogoPath = N'assets/cert-esci.png')
    INSERT dbo.Certification (CategoryId, LogoPath, LinkUrl, ShowOnHome, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Certification' AND Code = 'certification'), N'assets/cert-esci.png', NULL, 1, 140, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.CertificationI18n WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-esci.png') AND Lang = 'zh')
    INSERT dbo.CertificationI18n (CertificationId, Lang, Name, Description, LogoAlt)
    VALUES ((SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-esci.png'), 'zh', N'ESCI 智慧節能社區倡議', NULL, N'ESCI 智慧節能社區倡議');
ELSE
    UPDATE dbo.CertificationI18n SET Name = N'ESCI 智慧節能社區倡議', Description = NULL, LogoAlt = N'ESCI 智慧節能社區倡議' WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-esci.png') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.CertificationI18n WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-esci.png') AND Lang = 'en')
    INSERT dbo.CertificationI18n (CertificationId, Lang, Name, Description, LogoAlt)
    VALUES ((SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-esci.png'), 'en', N'Energy Smart Communities Initiative', NULL, N'Energy Smart Communities Initiative');
ELSE
    UPDATE dbo.CertificationI18n SET Name = N'Energy Smart Communities Initiative', Description = NULL, LogoAlt = N'Energy Smart Communities Initiative' WHERE CertificationId = (SELECT Id FROM dbo.Certification WHERE LogoPath = N'assets/cert-esci.png') AND Lang = 'en';

GO

/* ── client → ClientLogo（6 筆，無 i18n 側表）──────────── */
IF NOT EXISTS (SELECT 1 FROM dbo.ClientLogo WHERE LogoPath = N'assets/client-target.png')
    INSERT dbo.ClientLogo (Name, LogoPath, LinkUrl, SortOrder, IsPublished)
    VALUES (N'Target', N'assets/client-target.png', NULL, 10, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.ClientLogo WHERE LogoPath = N'assets/client-cvs.png')
    INSERT dbo.ClientLogo (Name, LogoPath, LinkUrl, SortOrder, IsPublished)
    VALUES (N'CVS pharmacy', N'assets/client-cvs.png', NULL, 20, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.ClientLogo WHERE LogoPath = N'assets/client-walgreens.png')
    INSERT dbo.ClientLogo (Name, LogoPath, LinkUrl, SortOrder, IsPublished)
    VALUES (N'Walgreens', N'assets/client-walgreens.png', NULL, 30, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.ClientLogo WHERE LogoPath = N'assets/client-lowes.png')
    INSERT dbo.ClientLogo (Name, LogoPath, LinkUrl, SortOrder, IsPublished)
    VALUES (N'Lowe’s', N'assets/client-lowes.png', NULL, 40, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.ClientLogo WHERE LogoPath = N'assets/client-academy.png')
    INSERT dbo.ClientLogo (Name, LogoPath, LinkUrl, SortOrder, IsPublished)
    VALUES (N'Academy Sports + Outdoors', N'assets/client-academy.png', NULL, 50, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.ClientLogo WHERE LogoPath = N'assets/client-homedepot.png')
    INSERT dbo.ClientLogo (Name, LogoPath, LinkUrl, SortOrder, IsPublished)
    VALUES (N'The Home Depot', N'assets/client-homedepot.png', NULL, 60, 1);
GO

/* ── facility → FacilityItem（24 筆）──────────────────────────── */
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-pre-ctp.jpg')
    INSERT dbo.FacilityItem (CategoryId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Facility' AND Code = 'pre-press'), N'assets/fac-pre-ctp.jpg', 10, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-pre-ctp.jpg') AND Lang = 'zh')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-pre-ctp.jpg'), 'zh', N'海德堡 Suprasetter 105 S 直接製版機', NULL, N'海德堡 Suprasetter 105 S 直接製版機');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'海德堡 Suprasetter 105 S 直接製版機', Description = NULL, ImageAlt = N'海德堡 Suprasetter 105 S 直接製版機' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-pre-ctp.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-pre-ctp.jpg') AND Lang = 'en')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-pre-ctp.jpg'), 'en', N'Heidelberg Suprasetter 105 S CTP', NULL, N'Heidelberg Suprasetter 105 S CTP');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'Heidelberg Suprasetter 105 S CTP', Description = NULL, ImageAlt = N'Heidelberg Suprasetter 105 S CTP' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-pre-ctp.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-pre-proof.jpg')
    INSERT dbo.FacilityItem (CategoryId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Facility' AND Code = 'pre-press'), N'assets/fac-pre-proof.jpg', 20, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-pre-proof.jpg') AND Lang = 'zh')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-pre-proof.jpg'), 'zh', N'Prinect Color Proof Pro —— 數位打樣', NULL, N'Prinect Color Proof Pro 數位打樣');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'Prinect Color Proof Pro —— 數位打樣', Description = NULL, ImageAlt = N'Prinect Color Proof Pro 數位打樣' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-pre-proof.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-pre-proof.jpg') AND Lang = 'en')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-pre-proof.jpg'), 'en', N'Prinect Color Proof Pro — digital proofing', NULL, N'Prinect Color Proof Pro — digital proofing');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'Prinect Color Proof Pro — digital proofing', Description = NULL, ImageAlt = N'Prinect Color Proof Pro — digital proofing' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-pre-proof.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-pre-jazzy.jpg')
    INSERT dbo.FacilityItem (CategoryId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Facility' AND Code = 'pre-press'), N'assets/fac-pre-jazzy.jpg', 30, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-pre-jazzy.jpg') AND Lang = 'zh')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-pre-jazzy.jpg'), 'zh', N'Jazzy Light 色彩管理系統', NULL, N'Jazzy Light 色彩管理系統');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'Jazzy Light 色彩管理系統', Description = NULL, ImageAlt = N'Jazzy Light 色彩管理系統' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-pre-jazzy.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-pre-jazzy.jpg') AND Lang = 'en')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-pre-jazzy.jpg'), 'en', N'Jazzy Light color management system', NULL, N'Jazzy Light color management system');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'Jazzy Light color management system', Description = NULL, ImageAlt = N'Jazzy Light color management system' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-pre-jazzy.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-pre-zund.jpg')
    INSERT dbo.FacilityItem (CategoryId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Facility' AND Code = 'pre-press'), N'assets/fac-pre-zund.jpg', 40, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-pre-zund.jpg') AND Lang = 'zh')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-pre-zund.jpg'), 'zh', N'ZÜND CCD 高速裁切機', NULL, N'ZÜND CCD 高速裁切機');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'ZÜND CCD 高速裁切機', Description = NULL, ImageAlt = N'ZÜND CCD 高速裁切機' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-pre-zund.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-pre-zund.jpg') AND Lang = 'en')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-pre-zund.jpg'), 'en', N'ZÜND CCD high-speed cutter', NULL, N'ZÜND CCD high-speed cutter');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'ZÜND CCD high-speed cutter', Description = NULL, ImageAlt = N'ZÜND CCD high-speed cutter' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-pre-zund.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-eco-press.png')
    INSERT dbo.FacilityItem (CategoryId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Facility' AND Code = 'eco-printing'), N'assets/fac-eco-press.png', 50, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-eco-press.png') AND Lang = 'zh')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-eco-press.png'), 'zh', N'海德堡 Speedmaster CD-102 印刷產線', NULL, N'海德堡 Speedmaster CD-102 印刷產線');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'海德堡 Speedmaster CD-102 印刷產線', Description = NULL, ImageAlt = N'海德堡 Speedmaster CD-102 印刷產線' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-eco-press.png') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-eco-press.png') AND Lang = 'en')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-eco-press.png'), 'en', N'Heidelberg Speedmaster CD-102 press line', NULL, N'Heidelberg Speedmaster CD-102 press line');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'Heidelberg Speedmaster CD-102 press line', Description = NULL, ImageAlt = N'Heidelberg Speedmaster CD-102 press line' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-eco-press.png') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-eco-pressroom.jpg')
    INSERT dbo.FacilityItem (CategoryId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Facility' AND Code = 'eco-printing'), N'assets/fac-eco-pressroom.jpg', 60, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-eco-pressroom.jpg') AND Lang = 'zh')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-eco-pressroom.jpg'), 'zh', N'印刷現場 —— 生產控管', NULL, N'印刷現場生產控管');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'印刷現場 —— 生產控管', Description = NULL, ImageAlt = N'印刷現場生產控管' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-eco-pressroom.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-eco-pressroom.jpg') AND Lang = 'en')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-eco-pressroom.jpg'), 'en', N'Press room — production control', NULL, N'Press room — production control');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'Press room — production control', Description = NULL, ImageAlt = N'Press room — production control' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-eco-pressroom.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-eco-axis.jpg')
    INSERT dbo.FacilityItem (CategoryId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Facility' AND Code = 'eco-printing'), N'assets/fac-eco-axis.jpg', 70, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-eco-axis.jpg') AND Lang = 'zh')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-eco-axis.jpg'), 'zh', N'Axis Control 色彩量測系統', NULL, N'Axis Control 色彩量測系統');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'Axis Control 色彩量測系統', Description = NULL, ImageAlt = N'Axis Control 色彩量測系統' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-eco-axis.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-eco-axis.jpg') AND Lang = 'en')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-eco-axis.jpg'), 'en', N'Axis Control color measurement system', NULL, N'Axis Control color measurement system');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'Axis Control color measurement system', Description = NULL, ImageAlt = N'Axis Control color measurement system' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-eco-axis.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-eco-imagecontrol.jpg')
    INSERT dbo.FacilityItem (CategoryId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Facility' AND Code = 'eco-printing'), N'assets/fac-eco-imagecontrol.jpg', 80, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-eco-imagecontrol.jpg') AND Lang = 'zh')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-eco-imagecontrol.jpg'), 'zh', N'Image Control 光譜量測系統', NULL, N'Image Control 光譜量測系統');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'Image Control 光譜量測系統', Description = NULL, ImageAlt = N'Image Control 光譜量測系統' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-eco-imagecontrol.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-eco-imagecontrol.jpg') AND Lang = 'en')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-eco-imagecontrol.jpg'), 'en', N'Image Control spectral measurement', NULL, N'Image Control spectral measurement');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'Image Control spectral measurement', Description = NULL, ImageAlt = N'Image Control spectral measurement' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-eco-imagecontrol.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-post-diecut.jpg')
    INSERT dbo.FacilityItem (CategoryId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Facility' AND Code = 'post-press'), N'assets/fac-post-diecut.jpg', 90, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-post-diecut.jpg') AND Lang = 'zh')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-post-diecut.jpg'), 'zh', N'海德堡 Varimatrix 105 模切機', NULL, N'海德堡 Varimatrix 105 模切機');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'海德堡 Varimatrix 105 模切機', Description = NULL, ImageAlt = N'海德堡 Varimatrix 105 模切機' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-post-diecut.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-post-diecut.jpg') AND Lang = 'en')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-post-diecut.jpg'), 'en', N'Heidelberg Varimatrix 105 die-cutter', NULL, N'Heidelberg Varimatrix 105 die-cutter');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'Heidelberg Varimatrix 105 die-cutter', Description = NULL, ImageAlt = N'Heidelberg Varimatrix 105 die-cutter' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-post-diecut.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-post-laminate.jpg')
    INSERT dbo.FacilityItem (CategoryId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Facility' AND Code = 'post-press'), N'assets/fac-post-laminate.jpg', 100, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-post-laminate.jpg') AND Lang = 'zh')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-post-laminate.jpg'), 'zh', N'高速智慧型貼合機', NULL, N'高速智慧型貼合機');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'高速智慧型貼合機', Description = NULL, ImageAlt = N'高速智慧型貼合機' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-post-laminate.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-post-laminate.jpg') AND Lang = 'en')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-post-laminate.jpg'), 'en', N'High-speed intelligent laminating machine', NULL, N'High-speed intelligent laminating machine');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'High-speed intelligent laminating machine', Description = NULL, ImageAlt = N'High-speed intelligent laminating machine' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-post-laminate.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-post-window.jpg')
    INSERT dbo.FacilityItem (CategoryId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Facility' AND Code = 'post-press'), N'assets/fac-post-window.jpg', 110, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-post-window.jpg') AND Lang = 'zh')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-post-window.jpg'), 'zh', N'數位開窗貼窗機', NULL, N'數位開窗貼窗機');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'數位開窗貼窗機', Description = NULL, ImageAlt = N'數位開窗貼窗機' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-post-window.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-post-window.jpg') AND Lang = 'en')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-post-window.jpg'), 'en', N'Digital window patching machine', NULL, N'Digital window patching machine');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'Digital window patching machine', Description = NULL, ImageAlt = N'Digital window patching machine' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-post-window.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-post-gluer.jpg')
    INSERT dbo.FacilityItem (CategoryId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Facility' AND Code = 'post-press'), N'assets/fac-post-gluer.jpg', 120, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-post-gluer.jpg') AND Lang = 'zh')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-post-gluer.jpg'), 'zh', N'高速萬能糊盒機', NULL, N'高速萬能糊盒機');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'高速萬能糊盒機', Description = NULL, ImageAlt = N'高速萬能糊盒機' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-post-gluer.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-post-gluer.jpg') AND Lang = 'en')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-post-gluer.jpg'), 'en', N'High-speed universal folder-gluer', NULL, N'High-speed universal folder-gluer');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'High-speed universal folder-gluer', Description = NULL, ImageAlt = N'High-speed universal folder-gluer' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-post-gluer.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-post-shrink.jpg')
    INSERT dbo.FacilityItem (CategoryId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Facility' AND Code = 'post-press'), N'assets/fac-post-shrink.jpg', 130, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-post-shrink.jpg') AND Lang = 'zh')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-post-shrink.jpg'), 'zh', N'自動收縮膜包裝機', NULL, N'自動收縮膜包裝機');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'自動收縮膜包裝機', Description = NULL, ImageAlt = N'自動收縮膜包裝機' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-post-shrink.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-post-shrink.jpg') AND Lang = 'en')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-post-shrink.jpg'), 'en', N'Automatic heat shrink wrap machine', NULL, N'Automatic heat shrink wrap machine');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'Automatic heat shrink wrap machine', Description = NULL, ImageAlt = N'Automatic heat shrink wrap machine' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-post-shrink.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-i1io.png')
    INSERT dbo.FacilityItem (CategoryId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Facility' AND Code = 'quality'), N'assets/fac-qc-i1io.png', 140, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-i1io.png') AND Lang = 'zh')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-i1io.png'), 'zh', N'X-Rite i1iO 光譜色彩量測儀', NULL, N'X-Rite i1iO 光譜色彩量測儀');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'X-Rite i1iO 光譜色彩量測儀', Description = NULL, ImageAlt = N'X-Rite i1iO 光譜色彩量測儀' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-i1io.png') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-i1io.png') AND Lang = 'en')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-i1io.png'), 'en', N'X-Rite i1iO spectral color measurement', NULL, N'X-Rite i1iO spectral color measurement');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'X-Rite i1iO spectral color measurement', Description = NULL, ImageAlt = N'X-Rite i1iO spectral color measurement' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-i1io.png') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-exact.png')
    INSERT dbo.FacilityItem (CategoryId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Facility' AND Code = 'quality'), N'assets/fac-qc-exact.png', 150, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-exact.png') AND Lang = 'zh')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-exact.png'), 'zh', N'X-Rite eXact 分光光度儀', NULL, N'X-Rite eXact 分光光度儀');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'X-Rite eXact 分光光度儀', Description = NULL, ImageAlt = N'X-Rite eXact 分光光度儀' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-exact.png') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-exact.png') AND Lang = 'en')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-exact.png'), 'en', N'X-Rite eXact spectrophotometer', NULL, N'X-Rite eXact spectrophotometer');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'X-Rite eXact spectrophotometer', Description = NULL, ImageAlt = N'X-Rite eXact spectrophotometer' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-exact.png') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-icplate.png')
    INSERT dbo.FacilityItem (CategoryId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Facility' AND Code = 'quality'), N'assets/fac-qc-icplate.png', 160, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-icplate.png') AND Lang = 'zh')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-icplate.png'), 'zh', N'X-Rite IC Plate II 網點量測儀', NULL, N'X-Rite IC Plate II 網點量測儀');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'X-Rite IC Plate II 網點量測儀', Description = NULL, ImageAlt = N'X-Rite IC Plate II 網點量測儀' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-icplate.png') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-icplate.png') AND Lang = 'en')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-icplate.png'), 'en', N'X-Rite IC Plate II dot measurement', NULL, N'X-Rite IC Plate II dot measurement');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'X-Rite IC Plate II dot measurement', Description = NULL, ImageAlt = N'X-Rite IC Plate II dot measurement' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-icplate.png') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-barcode.png')
    INSERT dbo.FacilityItem (CategoryId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Facility' AND Code = 'quality'), N'assets/fac-qc-barcode.png', 170, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-barcode.png') AND Lang = 'zh')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-barcode.png'), 'zh', N'條碼等級檢測儀', NULL, N'條碼等級檢測儀');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'條碼等級檢測儀', Description = NULL, ImageAlt = N'條碼等級檢測儀' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-barcode.png') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-barcode.png') AND Lang = 'en')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-barcode.png'), 'en', N'Barcode grade scanner', NULL, N'Barcode grade scanner');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'Barcode grade scanner', Description = NULL, ImageAlt = N'Barcode grade scanner' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-barcode.png') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-chamber.png')
    INSERT dbo.FacilityItem (CategoryId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Facility' AND Code = 'quality'), N'assets/fac-qc-chamber.png', 180, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-chamber.png') AND Lang = 'zh')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-chamber.png'), 'zh', N'恆溫恆濕試驗機', NULL, N'恆溫恆濕試驗機');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'恆溫恆濕試驗機', Description = NULL, ImageAlt = N'恆溫恆濕試驗機' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-chamber.png') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-chamber.png') AND Lang = 'en')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-chamber.png'), 'en', N'Temperature & humidity chamber', NULL, N'Temperature & humidity chamber');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'Temperature & humidity chamber', Description = NULL, ImageAlt = N'Temperature & humidity chamber' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-chamber.png') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-rub.png')
    INSERT dbo.FacilityItem (CategoryId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Facility' AND Code = 'quality'), N'assets/fac-qc-rub.png', 190, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-rub.png') AND Lang = 'zh')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-rub.png'), 'zh', N'油墨耐摩擦試驗機', NULL, N'油墨耐摩擦試驗機');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'油墨耐摩擦試驗機', Description = NULL, ImageAlt = N'油墨耐摩擦試驗機' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-rub.png') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-rub.png') AND Lang = 'en')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-rub.png'), 'en', N'Ink rub tester', NULL, N'Ink rub tester');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'Ink rub tester', Description = NULL, ImageAlt = N'Ink rub tester' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-rub.png') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-gloss.png')
    INSERT dbo.FacilityItem (CategoryId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Facility' AND Code = 'quality'), N'assets/fac-qc-gloss.png', 200, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-gloss.png') AND Lang = 'zh')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-gloss.png'), 'zh', N'光澤度計 —— Elcometer 406', NULL, N'光澤度計 Elcometer 406');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'光澤度計 —— Elcometer 406', Description = NULL, ImageAlt = N'光澤度計 Elcometer 406' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-gloss.png') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-gloss.png') AND Lang = 'en')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-gloss.png'), 'en', N'Gloss meter — Elcometer 406', NULL, N'Gloss meter — Elcometer 406');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'Gloss meter — Elcometer 406', Description = NULL, ImageAlt = N'Gloss meter — Elcometer 406' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-gloss.png') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-blister.png')
    INSERT dbo.FacilityItem (CategoryId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Facility' AND Code = 'quality'), N'assets/fac-qc-blister.png', 210, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-blister.png') AND Lang = 'zh')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-blister.png'), 'zh', N'泡殼封合強度試驗機', NULL, N'泡殼封合強度試驗機');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'泡殼封合強度試驗機', Description = NULL, ImageAlt = N'泡殼封合強度試驗機' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-blister.png') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-blister.png') AND Lang = 'en')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-blister.png'), 'en', N'Blister packing strength tester', NULL, N'Blister packing strength tester');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'Blister packing strength tester', Description = NULL, ImageAlt = N'Blister packing strength tester' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-qc-blister.png') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-tour1.jpg')
    INSERT dbo.FacilityItem (CategoryId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Facility' AND Code = 'tour'), N'assets/fac-tour1.jpg', 220, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-tour1.jpg') AND Lang = 'zh')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-tour1.jpg'), 'zh', N'廠區作業現場', NULL, N'NTI 廠區作業現場');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'廠區作業現場', Description = NULL, ImageAlt = N'NTI 廠區作業現場' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-tour1.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-tour1.jpg') AND Lang = 'en')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-tour1.jpg'), 'en', N'Factory floor', NULL, N'Factory floor');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'Factory floor', Description = NULL, ImageAlt = N'Factory floor' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-tour1.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-tour2.jpg')
    INSERT dbo.FacilityItem (CategoryId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Facility' AND Code = 'tour'), N'assets/fac-tour2.jpg', 230, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-tour2.jpg') AND Lang = 'zh')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-tour2.jpg'), 'zh', N'生產通道', NULL, N'NTI 生產通道');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'生產通道', Description = NULL, ImageAlt = N'NTI 生產通道' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-tour2.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-tour2.jpg') AND Lang = 'en')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-tour2.jpg'), 'en', N'Production aisle', NULL, N'Production aisle');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'Production aisle', Description = NULL, ImageAlt = N'Production aisle' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-tour2.jpg') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-tour-main.jpg')
    INSERT dbo.FacilityItem (CategoryId, ImagePath, SortOrder, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Facility' AND Code = 'tour'), N'assets/fac-tour-main.jpg', 240, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-tour-main.jpg') AND Lang = 'zh')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-tour-main.jpg'), 'zh', N'包材倉儲與物流', NULL, N'NTI 包材倉儲與物流');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'包材倉儲與物流', Description = NULL, ImageAlt = N'NTI 包材倉儲與物流' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-tour-main.jpg') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.FacilityItemI18n WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-tour-main.jpg') AND Lang = 'en')
    INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
    VALUES ((SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-tour-main.jpg'), 'en', N'Packaging stock & logistics', NULL, N'Packaging stock & logistics');
ELSE
    UPDATE dbo.FacilityItemI18n SET Name = N'Packaging stock & logistics', Description = NULL, ImageAlt = N'Packaging stock & logistics' WHERE FacilityItemId = (SELECT Id FROM dbo.FacilityItem WHERE ImagePath = N'assets/fac-tour-main.jpg') AND Lang = 'en';

GO

/* ── job → JobPosting（5 筆）──────────────────────────── */
IF NOT EXISTS (SELECT 1 FROM dbo.JobPosting WHERE SortOrder = 10)
    INSERT dbo.JobPosting (SortOrder, IsPublished) VALUES (10, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.JobPostingI18n WHERE JobPostingId = (SELECT Id FROM dbo.JobPosting WHERE SortOrder = 10) AND Lang = 'zh')
    INSERT dbo.JobPostingI18n (JobPostingId, Lang, Title, Location, DescriptionHtml)
    VALUES ((SELECT Id FROM dbo.JobPosting WHERE SortOrder = 10), 'zh', N'平版印刷機操作員 —— 台南廠', N'台南廠', N'<p>依 ISO 12647-2 色彩標準操作與維護單張平版印刷機。具海德堡機台經驗者佳；適合的人選我們會提供色彩管理流程訓練。另有輪班津貼。</p>');
ELSE
    UPDATE dbo.JobPostingI18n SET Title = N'平版印刷機操作員 —— 台南廠', Location = N'台南廠', DescriptionHtml = N'<p>依 ISO 12647-2 色彩標準操作與維護單張平版印刷機。具海德堡機台經驗者佳；適合的人選我們會提供色彩管理流程訓練。另有輪班津貼。</p>' WHERE JobPostingId = (SELECT Id FROM dbo.JobPosting WHERE SortOrder = 10) AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.JobPostingI18n WHERE JobPostingId = (SELECT Id FROM dbo.JobPosting WHERE SortOrder = 10) AND Lang = 'en')
    INSERT dbo.JobPostingI18n (JobPostingId, Lang, Title, Location, DescriptionHtml)
    VALUES ((SELECT Id FROM dbo.JobPosting WHERE SortOrder = 10), 'en', N'Offset Press Operator — Tainan plant', N'Tainan plant', N'<p>Run and maintain sheet-fed offset presses to ISO 12647-2 colour standards. Experience on Heidelberg equipment preferred; we will train the right candidate on our colour management workflow. Shift allowance applies.</p>');
ELSE
    UPDATE dbo.JobPostingI18n SET Title = N'Offset Press Operator — Tainan plant', Location = N'Tainan plant', DescriptionHtml = N'<p>Run and maintain sheet-fed offset presses to ISO 12647-2 colour standards. Experience on Heidelberg equipment preferred; we will train the right candidate on our colour management workflow. Shift allowance applies.</p>' WHERE JobPostingId = (SELECT Id FROM dbo.JobPosting WHERE SortOrder = 10) AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.JobPosting WHERE SortOrder = 20)
    INSERT dbo.JobPosting (SortOrder, IsPublished) VALUES (20, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.JobPostingI18n WHERE JobPostingId = (SELECT Id FROM dbo.JobPosting WHERE SortOrder = 20) AND Lang = 'zh')
    INSERT dbo.JobPostingI18n (JobPostingId, Lang, Title, Location, DescriptionHtml)
    VALUES ((SELECT Id FROM dbo.JobPosting WHERE SortOrder = 20), 'zh', N'印前／色彩管理工程師', N'台南廠', N'<p>負責 CTP 出版、打樣與網點校正。您將使用 Jazzy 色彩系統與 X-Rite 儀器，是工件上機前的最後一道把關。</p>');
ELSE
    UPDATE dbo.JobPostingI18n SET Title = N'印前／色彩管理工程師', Location = N'台南廠', DescriptionHtml = N'<p>負責 CTP 出版、打樣與網點校正。您將使用 Jazzy 色彩系統與 X-Rite 儀器，是工件上機前的最後一道把關。</p>' WHERE JobPostingId = (SELECT Id FROM dbo.JobPosting WHERE SortOrder = 20) AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.JobPostingI18n WHERE JobPostingId = (SELECT Id FROM dbo.JobPosting WHERE SortOrder = 20) AND Lang = 'en')
    INSERT dbo.JobPostingI18n (JobPostingId, Lang, Title, Location, DescriptionHtml)
    VALUES ((SELECT Id FROM dbo.JobPosting WHERE SortOrder = 20), 'en', N'Prepress / Colour Management Engineer', N'Tainan plant', N'<p>Own CTP output, proofing and dot calibration. You will work with the Jazzy colour system and X-Rite instruments, and be the last check before a job reaches the press.</p>');
ELSE
    UPDATE dbo.JobPostingI18n SET Title = N'Prepress / Colour Management Engineer', Location = N'Tainan plant', DescriptionHtml = N'<p>Own CTP output, proofing and dot calibration. You will work with the Jazzy colour system and X-Rite instruments, and be the last check before a job reaches the press.</p>' WHERE JobPostingId = (SELECT Id FROM dbo.JobPosting WHERE SortOrder = 20) AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.JobPosting WHERE SortOrder = 30)
    INSERT dbo.JobPosting (SortOrder, IsPublished) VALUES (30, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.JobPostingI18n WHERE JobPostingId = (SELECT Id FROM dbo.JobPosting WHERE SortOrder = 30) AND Lang = 'zh')
    INSERT dbo.JobPostingI18n (JobPostingId, Lang, Title, Location, DescriptionHtml)
    VALUES ((SELECT Id FROM dbo.JobPosting WHERE SortOrder = 30), 'zh', N'包裝結構設計師', N'台南廠', N'<p>把產品尺寸轉成撐得住運輸、又能乾淨回收的刀模。除 CAD 之外也要在 ZÜND 裁切機上實際做樣，並與品牌端設計團隊密切合作。</p>');
ELSE
    UPDATE dbo.JobPostingI18n SET Title = N'包裝結構設計師', Location = N'台南廠', DescriptionHtml = N'<p>把產品尺寸轉成撐得住運輸、又能乾淨回收的刀模。除 CAD 之外也要在 ZÜND 裁切機上實際做樣，並與品牌端設計團隊密切合作。</p>' WHERE JobPostingId = (SELECT Id FROM dbo.JobPosting WHERE SortOrder = 30) AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.JobPostingI18n WHERE JobPostingId = (SELECT Id FROM dbo.JobPosting WHERE SortOrder = 30) AND Lang = 'en')
    INSERT dbo.JobPostingI18n (JobPostingId, Lang, Title, Location, DescriptionHtml)
    VALUES ((SELECT Id FROM dbo.JobPosting WHERE SortOrder = 30), 'en', N'Structural Packaging Designer', N'Tainan plant', N'<p>Turn product dimensions into dielines that survive transit and recycle cleanly. CAD plus hands-on sample making on our ZÜND cutter; close collaboration with brand-side design teams.</p>');
ELSE
    UPDATE dbo.JobPostingI18n SET Title = N'Structural Packaging Designer', Location = N'Tainan plant', DescriptionHtml = N'<p>Turn product dimensions into dielines that survive transit and recycle cleanly. CAD plus hands-on sample making on our ZÜND cutter; close collaboration with brand-side design teams.</p>' WHERE JobPostingId = (SELECT Id FROM dbo.JobPosting WHERE SortOrder = 30) AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.JobPosting WHERE SortOrder = 40)
    INSERT dbo.JobPosting (SortOrder, IsPublished) VALUES (40, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.JobPostingI18n WHERE JobPostingId = (SELECT Id FROM dbo.JobPosting WHERE SortOrder = 40) AND Lang = 'zh')
    INSERT dbo.JobPostingI18n (JobPostingId, Lang, Title, Location, DescriptionHtml)
    VALUES ((SELECT Id FROM dbo.JobPosting WHERE SortOrder = 40), 'zh', N'ESG 永續專員', N'台南廠', N'<p>維護碳盤查、驗證佐證資料與客戶 ESG 報告。適合同時能處理試算表、也願意走進印刷現場的人。</p>');
ELSE
    UPDATE dbo.JobPostingI18n SET Title = N'ESG 永續專員', Location = N'台南廠', DescriptionHtml = N'<p>維護碳盤查、驗證佐證資料與客戶 ESG 報告。適合同時能處理試算表、也願意走進印刷現場的人。</p>' WHERE JobPostingId = (SELECT Id FROM dbo.JobPosting WHERE SortOrder = 40) AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.JobPostingI18n WHERE JobPostingId = (SELECT Id FROM dbo.JobPosting WHERE SortOrder = 40) AND Lang = 'en')
    INSERT dbo.JobPostingI18n (JobPostingId, Lang, Title, Location, DescriptionHtml)
    VALUES ((SELECT Id FROM dbo.JobPosting WHERE SortOrder = 40), 'en', N'ESG & Sustainability Specialist', N'Tainan plant', N'<p>Maintain our carbon accounting, certification evidence and customer ESG reporting. Suits someone comfortable with both a spreadsheet and a pressroom floor.</p>');
ELSE
    UPDATE dbo.JobPostingI18n SET Title = N'ESG & Sustainability Specialist', Location = N'Tainan plant', DescriptionHtml = N'<p>Maintain our carbon accounting, certification evidence and customer ESG reporting. Suits someone comfortable with both a spreadsheet and a pressroom floor.</p>' WHERE JobPostingId = (SELECT Id FROM dbo.JobPosting WHERE SortOrder = 40) AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.JobPosting WHERE SortOrder = 50)
    INSERT dbo.JobPosting (SortOrder, IsPublished) VALUES (50, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.JobPostingI18n WHERE JobPostingId = (SELECT Id FROM dbo.JobPosting WHERE SortOrder = 50) AND Lang = 'zh')
    INSERT dbo.JobPostingI18n (JobPostingId, Lang, Title, Location, DescriptionHtml)
    VALUES ((SELECT Id FROM dbo.JobPosting WHERE SortOrder = 50), 'zh', N'國外業務代表', N'台南廠', N'<p>開發與經營日本、歐盟與北美客戶。需具商用英語能力；有包裝或印刷背景者尤佳。</p>');
ELSE
    UPDATE dbo.JobPostingI18n SET Title = N'國外業務代表', Location = N'台南廠', DescriptionHtml = N'<p>開發與經營日本、歐盟與北美客戶。需具商用英語能力；有包裝或印刷背景者尤佳。</p>' WHERE JobPostingId = (SELECT Id FROM dbo.JobPosting WHERE SortOrder = 50) AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.JobPostingI18n WHERE JobPostingId = (SELECT Id FROM dbo.JobPosting WHERE SortOrder = 50) AND Lang = 'en')
    INSERT dbo.JobPostingI18n (JobPostingId, Lang, Title, Location, DescriptionHtml)
    VALUES ((SELECT Id FROM dbo.JobPosting WHERE SortOrder = 50), 'en', N'International Sales Representative', N'Tainan plant', N'<p>Develop and service accounts in Japan, the EU and North America. Business-level English required; packaging or print background an advantage.</p>');
ELSE
    UPDATE dbo.JobPostingI18n SET Title = N'International Sales Representative', Location = N'Tainan plant', DescriptionHtml = N'<p>Develop and service accounts in Japan, the EU and North America. Business-level English required; packaging or print background an advantage.</p>' WHERE JobPostingId = (SELECT Id FROM dbo.JobPosting WHERE SortOrder = 50) AND Lang = 'en';

GO

/* ── supplier-notice → SupplierNotice（5 筆）──────────────────────────── */
IF NOT EXISTS (SELECT 1 FROM dbo.SupplierNotice WHERE NoticeDate = N'2026-06-20')
    INSERT dbo.SupplierNotice (CategoryId, NoticeDate, AttachmentPath, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'SupplierNotice' AND Code = 'policy'), N'2026-06-20', NULL, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.SupplierNoticeI18n WHERE SupplierNoticeId = (SELECT Id FROM dbo.SupplierNotice WHERE NoticeDate = N'2026-06-20') AND Lang = 'zh')
    INSERT dbo.SupplierNoticeI18n (SupplierNoticeId, Lang, Title, BodyHtml)
    VALUES ((SELECT Id FROM dbo.SupplierNotice WHERE NoticeDate = N'2026-06-20'), 'zh', N'進料紙板含水率公差更新 —— 8 月 1 日起生效', N'<p>進料紙板含水率公差更新 —— 8 月 1 日起生效</p>');
ELSE
    UPDATE dbo.SupplierNoticeI18n SET Title = N'進料紙板含水率公差更新 —— 8 月 1 日起生效', BodyHtml = N'<p>進料紙板含水率公差更新 —— 8 月 1 日起生效</p>' WHERE SupplierNoticeId = (SELECT Id FROM dbo.SupplierNotice WHERE NoticeDate = N'2026-06-20') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.SupplierNoticeI18n WHERE SupplierNoticeId = (SELECT Id FROM dbo.SupplierNotice WHERE NoticeDate = N'2026-06-20') AND Lang = 'en')
    INSERT dbo.SupplierNoticeI18n (SupplierNoticeId, Lang, Title, BodyHtml)
    VALUES ((SELECT Id FROM dbo.SupplierNotice WHERE NoticeDate = N'2026-06-20'), 'en', N'Updated incoming board moisture tolerance — effective August 1', N'<p>Updated incoming board moisture tolerance — effective August 1</p>');
ELSE
    UPDATE dbo.SupplierNoticeI18n SET Title = N'Updated incoming board moisture tolerance — effective August 1', BodyHtml = N'<p>Updated incoming board moisture tolerance — effective August 1</p>' WHERE SupplierNoticeId = (SELECT Id FROM dbo.SupplierNotice WHERE NoticeDate = N'2026-06-20') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.SupplierNotice WHERE NoticeDate = N'2026-05-30')
    INSERT dbo.SupplierNotice (CategoryId, NoticeDate, AttachmentPath, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'SupplierNotice' AND Code = 'esg'), N'2026-05-30', NULL, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.SupplierNoticeI18n WHERE SupplierNoticeId = (SELECT Id FROM dbo.SupplierNotice WHERE NoticeDate = N'2026-05-30') AND Lang = 'zh')
    INSERT dbo.SupplierNoticeI18n (SupplierNoticeId, Lang, Title, BodyHtml)
    VALUES ((SELECT Id FROM dbo.SupplierNotice WHERE NoticeDate = N'2026-05-30'), 'zh', N'碳數據調查：2026 上半年上游碳足跡填報開始', N'<p>碳數據調查：2026 上半年上游碳足跡填報開始</p>');
ELSE
    UPDATE dbo.SupplierNoticeI18n SET Title = N'碳數據調查：2026 上半年上游碳足跡填報開始', BodyHtml = N'<p>碳數據調查：2026 上半年上游碳足跡填報開始</p>' WHERE SupplierNoticeId = (SELECT Id FROM dbo.SupplierNotice WHERE NoticeDate = N'2026-05-30') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.SupplierNoticeI18n WHERE SupplierNoticeId = (SELECT Id FROM dbo.SupplierNotice WHERE NoticeDate = N'2026-05-30') AND Lang = 'en')
    INSERT dbo.SupplierNoticeI18n (SupplierNoticeId, Lang, Title, BodyHtml)
    VALUES ((SELECT Id FROM dbo.SupplierNotice WHERE NoticeDate = N'2026-05-30'), 'en', N'Carbon data request: 2026 H1 upstream footprint submission opens', N'<p>Carbon data request: 2026 H1 upstream footprint submission opens</p>');
ELSE
    UPDATE dbo.SupplierNoticeI18n SET Title = N'Carbon data request: 2026 H1 upstream footprint submission opens', BodyHtml = N'<p>Carbon data request: 2026 H1 upstream footprint submission opens</p>' WHERE SupplierNoticeId = (SELECT Id FROM dbo.SupplierNotice WHERE NoticeDate = N'2026-05-30') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.SupplierNotice WHERE NoticeDate = N'2026-05-12')
    INSERT dbo.SupplierNotice (CategoryId, NoticeDate, AttachmentPath, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'SupplierNotice' AND Code = 'quality'), N'2026-05-12', NULL, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.SupplierNoticeI18n WHERE SupplierNoticeId = (SELECT Id FROM dbo.SupplierNotice WHERE NoticeDate = N'2026-05-12') AND Lang = 'zh')
    INSERT dbo.SupplierNoticeI18n (SupplierNoticeId, Lang, Title, BodyHtml)
    VALUES ((SELECT Id FROM dbo.SupplierNotice WHERE NoticeDate = N'2026-05-12'), 'zh', N'油墨與塗層進料 IQC 抽樣計畫修訂', N'<p>油墨與塗層進料 IQC 抽樣計畫修訂</p>');
ELSE
    UPDATE dbo.SupplierNoticeI18n SET Title = N'油墨與塗層進料 IQC 抽樣計畫修訂', BodyHtml = N'<p>油墨與塗層進料 IQC 抽樣計畫修訂</p>' WHERE SupplierNoticeId = (SELECT Id FROM dbo.SupplierNotice WHERE NoticeDate = N'2026-05-12') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.SupplierNoticeI18n WHERE SupplierNoticeId = (SELECT Id FROM dbo.SupplierNotice WHERE NoticeDate = N'2026-05-12') AND Lang = 'en')
    INSERT dbo.SupplierNoticeI18n (SupplierNoticeId, Lang, Title, BodyHtml)
    VALUES ((SELECT Id FROM dbo.SupplierNotice WHERE NoticeDate = N'2026-05-12'), 'en', N'Revised IQC sampling plan for ink and coating deliveries', N'<p>Revised IQC sampling plan for ink and coating deliveries</p>');
ELSE
    UPDATE dbo.SupplierNoticeI18n SET Title = N'Revised IQC sampling plan for ink and coating deliveries', BodyHtml = N'<p>Revised IQC sampling plan for ink and coating deliveries</p>' WHERE SupplierNoticeId = (SELECT Id FROM dbo.SupplierNotice WHERE NoticeDate = N'2026-05-12') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.SupplierNotice WHERE NoticeDate = N'2026-04-08')
    INSERT dbo.SupplierNotice (CategoryId, NoticeDate, AttachmentPath, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'SupplierNotice' AND Code = 'logistics'), N'2026-04-08', NULL, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.SupplierNoticeI18n WHERE SupplierNoticeId = (SELECT Id FROM dbo.SupplierNotice WHERE NoticeDate = N'2026-04-08') AND Lang = 'zh')
    INSERT dbo.SupplierNoticeI18n (SupplierNoticeId, Lang, Title, BodyHtml)
    VALUES ((SELECT Id FROM dbo.SupplierNotice WHERE NoticeDate = N'2026-04-08'), 'zh', N'新版月台預約系統上線 —— 內含預約指引', N'<p>新版月台預約系統上線 —— 內含預約指引</p>');
ELSE
    UPDATE dbo.SupplierNoticeI18n SET Title = N'新版月台預約系統上線 —— 內含預約指引', BodyHtml = N'<p>新版月台預約系統上線 —— 內含預約指引</p>' WHERE SupplierNoticeId = (SELECT Id FROM dbo.SupplierNotice WHERE NoticeDate = N'2026-04-08') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.SupplierNoticeI18n WHERE SupplierNoticeId = (SELECT Id FROM dbo.SupplierNotice WHERE NoticeDate = N'2026-04-08') AND Lang = 'en')
    INSERT dbo.SupplierNoticeI18n (SupplierNoticeId, Lang, Title, BodyHtml)
    VALUES ((SELECT Id FROM dbo.SupplierNotice WHERE NoticeDate = N'2026-04-08'), 'en', N'New dock scheduling system goes live — booking guide inside', N'<p>New dock scheduling system goes live — booking guide inside</p>');
ELSE
    UPDATE dbo.SupplierNoticeI18n SET Title = N'New dock scheduling system goes live — booking guide inside', BodyHtml = N'<p>New dock scheduling system goes live — booking guide inside</p>' WHERE SupplierNoticeId = (SELECT Id FROM dbo.SupplierNotice WHERE NoticeDate = N'2026-04-08') AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.SupplierNotice WHERE NoticeDate = N'2026-03-15')
    INSERT dbo.SupplierNotice (CategoryId, NoticeDate, AttachmentPath, IsPublished) VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'SupplierNotice' AND Code = 'policy'), N'2026-03-15', NULL, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.SupplierNoticeI18n WHERE SupplierNoticeId = (SELECT Id FROM dbo.SupplierNotice WHERE NoticeDate = N'2026-03-15') AND Lang = 'zh')
    INSERT dbo.SupplierNoticeI18n (SupplierNoticeId, Lang, Title, BodyHtml)
    VALUES ((SELECT Id FROM dbo.SupplierNotice WHERE NoticeDate = N'2026-03-15'), 'zh', N'2026 年度供應商評鑑標準公告', N'<p>2026 年度供應商評鑑標準公告</p>');
ELSE
    UPDATE dbo.SupplierNoticeI18n SET Title = N'2026 年度供應商評鑑標準公告', BodyHtml = N'<p>2026 年度供應商評鑑標準公告</p>' WHERE SupplierNoticeId = (SELECT Id FROM dbo.SupplierNotice WHERE NoticeDate = N'2026-03-15') AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.SupplierNoticeI18n WHERE SupplierNoticeId = (SELECT Id FROM dbo.SupplierNotice WHERE NoticeDate = N'2026-03-15') AND Lang = 'en')
    INSERT dbo.SupplierNoticeI18n (SupplierNoticeId, Lang, Title, BodyHtml)
    VALUES ((SELECT Id FROM dbo.SupplierNotice WHERE NoticeDate = N'2026-03-15'), 'en', N'Annual supplier evaluation criteria for 2026 published', N'<p>Annual supplier evaluation criteria for 2026 published</p>');
ELSE
    UPDATE dbo.SupplierNoticeI18n SET Title = N'Annual supplier evaluation criteria for 2026 published', BodyHtml = N'<p>Annual supplier evaluation criteria for 2026 published</p>' WHERE SupplierNoticeId = (SELECT Id FROM dbo.SupplierNotice WHERE NoticeDate = N'2026-03-15') AND Lang = 'en';

GO

/* ── supplier-spec → SupplierSpec（4 筆）──────────────────────────── */
IF NOT EXISTS (SELECT 1 FROM dbo.SupplierSpec WHERE SortOrder = 10)
    INSERT dbo.SupplierSpec (SortOrder, IsPublished) VALUES (10, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.SupplierSpecI18n WHERE SupplierSpecId = (SELECT Id FROM dbo.SupplierSpec WHERE SortOrder = 10) AND Lang = 'zh')
    INSERT dbo.SupplierSpecI18n (SupplierSpecId, Lang, Title, Description)
    VALUES ((SELECT Id FROM dbo.SupplierSpec WHERE SortOrder = 10), 'zh', N'紙板與紙張規範', N'基重公差、含水率範圍、FSC™ 文件與棧板要求。');
ELSE
    UPDATE dbo.SupplierSpecI18n SET Title = N'紙板與紙張規範', Description = N'基重公差、含水率範圍、FSC™ 文件與棧板要求。' WHERE SupplierSpecId = (SELECT Id FROM dbo.SupplierSpec WHERE SortOrder = 10) AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.SupplierSpecI18n WHERE SupplierSpecId = (SELECT Id FROM dbo.SupplierSpec WHERE SortOrder = 10) AND Lang = 'en')
    INSERT dbo.SupplierSpecI18n (SupplierSpecId, Lang, Title, Description)
    VALUES ((SELECT Id FROM dbo.SupplierSpec WHERE SortOrder = 10), 'en', N'Board & Paper Specifications', N'Grammage tolerance, moisture range, FSC™ documentation and pallet requirements.');
ELSE
    UPDATE dbo.SupplierSpecI18n SET Title = N'Board & Paper Specifications', Description = N'Grammage tolerance, moisture range, FSC™ documentation and pallet requirements.' WHERE SupplierSpecId = (SELECT Id FROM dbo.SupplierSpec WHERE SortOrder = 10) AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.SupplierSpec WHERE SortOrder = 20)
    INSERT dbo.SupplierSpec (SortOrder, IsPublished) VALUES (20, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.SupplierSpecI18n WHERE SupplierSpecId = (SELECT Id FROM dbo.SupplierSpec WHERE SortOrder = 20) AND Lang = 'zh')
    INSERT dbo.SupplierSpecI18n (SupplierSpecId, Lang, Title, Description)
    VALUES ((SELECT Id FROM dbo.SupplierSpec WHERE SortOrder = 20), 'zh', N'油墨與塗層要求', N'低 VOC 門檻、食品接觸合規證明與批次 COA 格式。');
ELSE
    UPDATE dbo.SupplierSpecI18n SET Title = N'油墨與塗層要求', Description = N'低 VOC 門檻、食品接觸合規證明與批次 COA 格式。' WHERE SupplierSpecId = (SELECT Id FROM dbo.SupplierSpec WHERE SortOrder = 20) AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.SupplierSpecI18n WHERE SupplierSpecId = (SELECT Id FROM dbo.SupplierSpec WHERE SortOrder = 20) AND Lang = 'en')
    INSERT dbo.SupplierSpecI18n (SupplierSpecId, Lang, Title, Description)
    VALUES ((SELECT Id FROM dbo.SupplierSpec WHERE SortOrder = 20), 'en', N'Ink & Coating Requirements', N'Low-VOC thresholds, food-contact compliance certificates and batch COA format.');
ELSE
    UPDATE dbo.SupplierSpecI18n SET Title = N'Ink & Coating Requirements', Description = N'Low-VOC thresholds, food-contact compliance certificates and batch COA format.' WHERE SupplierSpecId = (SELECT Id FROM dbo.SupplierSpec WHERE SortOrder = 20) AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.SupplierSpec WHERE SortOrder = 30)
    INSERT dbo.SupplierSpec (SortOrder, IsPublished) VALUES (30, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.SupplierSpecI18n WHERE SupplierSpecId = (SELECT Id FROM dbo.SupplierSpec WHERE SortOrder = 30) AND Lang = 'zh')
    INSERT dbo.SupplierSpecI18n (SupplierSpecId, Lang, Title, Description)
    VALUES ((SELECT Id FROM dbo.SupplierSpec WHERE SortOrder = 30), 'zh', N'交貨與包裝規則', N'標示、棧板堆疊、月台預約與交期承諾。');
ELSE
    UPDATE dbo.SupplierSpecI18n SET Title = N'交貨與包裝規則', Description = N'標示、棧板堆疊、月台預約與交期承諾。' WHERE SupplierSpecId = (SELECT Id FROM dbo.SupplierSpec WHERE SortOrder = 30) AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.SupplierSpecI18n WHERE SupplierSpecId = (SELECT Id FROM dbo.SupplierSpec WHERE SortOrder = 30) AND Lang = 'en')
    INSERT dbo.SupplierSpecI18n (SupplierSpecId, Lang, Title, Description)
    VALUES ((SELECT Id FROM dbo.SupplierSpec WHERE SortOrder = 30), 'en', N'Delivery & Packaging Rules', N'Labeling, palletization, dock booking and lead-time commitments.');
ELSE
    UPDATE dbo.SupplierSpecI18n SET Title = N'Delivery & Packaging Rules', Description = N'Labeling, palletization, dock booking and lead-time commitments.' WHERE SupplierSpecId = (SELECT Id FROM dbo.SupplierSpec WHERE SortOrder = 30) AND Lang = 'en';

IF NOT EXISTS (SELECT 1 FROM dbo.SupplierSpec WHERE SortOrder = 40)
    INSERT dbo.SupplierSpec (SortOrder, IsPublished) VALUES (40, 1);
IF NOT EXISTS (SELECT 1 FROM dbo.SupplierSpecI18n WHERE SupplierSpecId = (SELECT Id FROM dbo.SupplierSpec WHERE SortOrder = 40) AND Lang = 'zh')
    INSERT dbo.SupplierSpecI18n (SupplierSpecId, Lang, Title, Description)
    VALUES ((SELECT Id FROM dbo.SupplierSpec WHERE SortOrder = 40), 'zh', N'ESG 數據申報', N'供應夥伴的上游碳數據格式與申報時程。');
ELSE
    UPDATE dbo.SupplierSpecI18n SET Title = N'ESG 數據申報', Description = N'供應夥伴的上游碳數據格式與申報時程。' WHERE SupplierSpecId = (SELECT Id FROM dbo.SupplierSpec WHERE SortOrder = 40) AND Lang = 'zh';
IF NOT EXISTS (SELECT 1 FROM dbo.SupplierSpecI18n WHERE SupplierSpecId = (SELECT Id FROM dbo.SupplierSpec WHERE SortOrder = 40) AND Lang = 'en')
    INSERT dbo.SupplierSpecI18n (SupplierSpecId, Lang, Title, Description)
    VALUES ((SELECT Id FROM dbo.SupplierSpec WHERE SortOrder = 40), 'en', N'ESG Data Reporting', N'Upstream carbon data format and submission schedule for supply partners.');
ELSE
    UPDATE dbo.SupplierSpecI18n SET Title = N'ESG Data Reporting', Description = N'Upstream carbon data format and submission schedule for supply partners.' WHERE SupplierSpecId = (SELECT Id FROM dbo.SupplierSpec WHERE SortOrder = 40) AND Lang = 'en';

GO

COMMIT;
PRINT N'mockup 內容已匯入。';
GO