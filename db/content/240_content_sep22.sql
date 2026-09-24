/* =============================================================================
   240_content_sep22.sql  —  客戶 2026-09-22 SEO/GEO 改寫版文案（英文）
   -----------------------------------------------------------------------------
   **由 tools/build-content-sep22-sql.mjs 產生，請勿手改。** 取捨見該檔檔頭。

   - 頁面文字覆寫 10 段（PageText，en；已存在的不動）
   - 固定頁 SEO 標題 9 頁、方案頁 SEO 標題 4 頁（只補空的／預設值）
   - 認證說明 7 筆（只補空的）
   - FAQ 10 題，**未上架草稿**、只有英文（以英文問題判斷是否已建）

   需先有 0010（PageText）；在 200／230 之後執行。重跑無副作用。
   ============================================================================= */
SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

/* ── 頁面文字 ── */
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'en', 'caf114e8605bc163088815126b3c1c44b952ba693d29e99cc4d5df1775cb8ca2', N'NTI Printing is Taiwan’s pioneer eco-friendly printing company and sustainable packaging manufacturer, combining uncompromising digital-first quality with measurable environmental responsibility.', N'NTI Printing is Taiwan’s pioneer green printing solutions’ company and sustainable packaging manufacturer, combining uncompromising digital-first quality with measurable environmental responsibility. NTI Printing holds FSC CoC certification, G7 Master Printer status, and ISO 9001/14001 certification, making it one of Taiwan’s most certified eco-friendly printing manufacturers.'
FROM dbo.Page p
WHERE p.PageKey = N'home'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'en' AND x.SourceHash = 'caf114e8605bc163088815126b3c1c44b952ba693d29e99cc4d5df1775cb8ca2');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'en', '5489cce33bb12b93d82ef9ec16c06b18ae0c3a7e4c3823fc24523f155ab42c4d', N'Today, NTI Printing stands as one of Taiwan’s most certified eco-friendly printing companies and a trusted sustainable printing partner for global brands — proving that premium quality and environmental responsibility can thrive together. We deliver the sharpest prints, the richest colors, and the smallest footprint.', N'Today, NTI Printing stands as one of Taiwan’s most certified eco-friendly printing manufacturers and a trusted sustainable package printing partner for global brands — proving that premium quality and environmental responsibility can thrive together. We deliver the sharpest prints, the richest colors, and the smallest footprint.'
FROM dbo.Page p
WHERE p.PageKey = N'about-hub'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'en' AND x.SourceHash = '5489cce33bb12b93d82ef9ec16c06b18ae0c3a7e4c3823fc24523f155ab42c4d');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'en', '5489cce33bb12b93d82ef9ec16c06b18ae0c3a7e4c3823fc24523f155ab42c4d', N'Today, NTI Printing stands as one of Taiwan’s most certified eco-friendly printing companies and a trusted sustainable printing partner for global brands — proving that premium quality and environmental responsibility can thrive together. We deliver the sharpest prints, the richest colors, and the smallest footprint.', N'Today, NTI Printing stands as one of Taiwan’s most certified eco-friendly printing manufacturers and a trusted sustainable package printing partner for global brands — proving that premium quality and environmental responsibility can thrive together. We deliver the sharpest prints, the richest colors, and the smallest footprint.'
FROM dbo.Page p
WHERE p.PageKey = N'about-difference'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'en' AND x.SourceHash = '5489cce33bb12b93d82ef9ec16c06b18ae0c3a7e4c3823fc24523f155ab42c4d');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'en', '3bd6beecc1a0d2092a8644efe7848950eedf0dbcb2b80d43d3b933e56cd578b4', N'NTI has built its reputation on printing quality, and our clients hold us to it. We keep applying for further certification so that every customer gets the same assurance of product quality — audited by an outside body rather than asserted by us. Alongside the international standards below, we developed the NTI Green Printing Certificate, a mark our clients can display on their packaging as proof of an eco-conscious process.', N'NTI Printing holds FSC certified printing status and G7 Master Printer certification, alongside recognition through the APEC ESCI Award for sustainability excellence, making it one of Taiwan’s most certified eco-friendly printing manufacturers. NTI has built its reputation on printing quality, and our clients hold us to it. We keep applying for further certification so that every customer gets the same assurance of product quality — audited by an outside body rather than asserted by us. Alongside the international standards below, we developed the NTI Green Printing Certificate, a mark our clients can display on their packaging as proof of an eco-conscious process.'
FROM dbo.Page p
WHERE p.PageKey = N'about-certifications'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'en' AND x.SourceHash = '3bd6beecc1a0d2092a8644efe7848950eedf0dbcb2b80d43d3b933e56cd578b4');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'en', 'a80e03b390be8f8f07ead3549d69510eb7e44907b2335b7e15f5e0d02952cfa3', N'NTI Printing integrates advanced pre-press, printing, and post-press systems inside our G7 certified printing plant — a printing factory in Taiwan designed for precision, efficiency and sustainability. We use Heidelberg and Man Roland presses with in-line varnishing and carbon-balanced systems, reducing energy use and emissions.', N'NTI Printing integrates advanced digital pre-press, printing, and post-press systems inside our G7 certified printing plant — a printing factory in Taiwan designed for precision, efficiency and sustainability. We use Heidelberg and Man Roland presses with in-line varnishing and carbon-balanced systems, reducing energy use and emissions.'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'en' AND x.SourceHash = 'a80e03b390be8f8f07ead3549d69510eb7e44907b2335b7e15f5e0d02952cfa3');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'en', 'a80e03b390be8f8f07ead3549d69510eb7e44907b2335b7e15f5e0d02952cfa3', N'NTI Printing integrates advanced pre-press, printing, and post-press systems inside our G7 certified printing plant — a printing factory in Taiwan designed for precision, efficiency and sustainability. We use Heidelberg and Man Roland presses with in-line varnishing and carbon-balanced systems, reducing energy use and emissions.', N'NTI Printing integrates advanced digital pre-press, printing, and post-press systems inside our G7 certified printing plant — a printing factory in Taiwan designed for precision, efficiency and sustainability. We use Heidelberg and Man Roland presses with in-line varnishing and carbon-balanced systems, reducing energy use and emissions.'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'en' AND x.SourceHash = 'a80e03b390be8f8f07ead3549d69510eb7e44907b2335b7e15f5e0d02952cfa3');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'en', 'a4d2c8f9b3ea0ded41acf92b2a5d03b938a0b07ae306e4f45ca3a26d66e6ad44', N'Partnering with NTI Printing, a leading green printing company in Taiwan, means your brand doesn’t just look exceptional — it demonstrates a genuine commitment to sustainability. Through advanced green printing practices, carbon-conscious production, and internationally recognized eco-friendly materials, we help businesses strengthen their ESG performance and support the carbon reduction expectations of customers and global markets. By choosing NTI, you enhance your brand reputation, build consumer confidence, and show The Courage to Print Green.', N'Partnering with NTI Printing, a leading green printing company in Taiwan, means your brand doesn’t just look exceptional — it demonstrates a genuine sustainability commitment. Through advanced green printing practices, carbon-conscious production, and internationally recognized eco-friendly materials, we help businesses strengthen their ESG performance and support the carbon reduction expectations of customers and global markets. By choosing NTI, you enhance your brand reputation, build consumer confidence, and show The Courage to Print Green.'
FROM dbo.Page p
WHERE p.PageKey = N'sustainability-hub'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'en' AND x.SourceHash = 'a4d2c8f9b3ea0ded41acf92b2a5d03b938a0b07ae306e4f45ca3a26d66e6ad44');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'en', 'a4d2c8f9b3ea0ded41acf92b2a5d03b938a0b07ae306e4f45ca3a26d66e6ad44', N'Partnering with NTI Printing, a leading green printing company in Taiwan, means your brand doesn’t just look exceptional — it demonstrates a genuine commitment to sustainability. Through advanced green printing practices, carbon-conscious production, and internationally recognized eco-friendly materials, we help businesses strengthen their ESG performance and support the carbon reduction expectations of customers and global markets. By choosing NTI, you enhance your brand reputation, build consumer confidence, and show The Courage to Print Green.', N'Partnering with NTI Printing, a leading green printing company in Taiwan, means your brand doesn’t just look exceptional — it demonstrates a genuine sustainability commitment. Through advanced green printing practices, carbon-conscious production, and internationally recognized eco-friendly materials, we help businesses strengthen their ESG performance and support the carbon reduction expectations of customers and global markets. By choosing NTI, you enhance your brand reputation, build consumer confidence, and show The Courage to Print Green.'
FROM dbo.Page p
WHERE p.PageKey = N'green-our-advantage'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'en' AND x.SourceHash = 'a4d2c8f9b3ea0ded41acf92b2a5d03b938a0b07ae306e4f45ca3a26d66e6ad44');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'en', '6e46c1695ed8e1e1664b7b8b36f495d416c0f38ff59bbadb04d98638bd28e9bf', N'As a sustainable packaging manufacturer committed to responsible printing, NTI Printing is aligning its ESG packaging roadmap with the UN Sustainable Development Goals (SDGs) and evaluating Science-Based Targets (SBTi) status.', N'As a sustainable packaging manufacturer committed to responsible printing, NTI Printing is aligning its ESG packaging roadmap and sustainability goals with the UN Sustainable Development Goals (SDGs) and evaluating Science-Based Targets (SBTi) status.'
FROM dbo.Page p
WHERE p.PageKey = N'sustainability-hub'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'en' AND x.SourceHash = '6e46c1695ed8e1e1664b7b8b36f495d416c0f38ff59bbadb04d98638bd28e9bf');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'en', '6e46c1695ed8e1e1664b7b8b36f495d416c0f38ff59bbadb04d98638bd28e9bf', N'As a sustainable packaging manufacturer committed to responsible printing, NTI Printing is aligning its ESG packaging roadmap with the UN Sustainable Development Goals (SDGs) and evaluating Science-Based Targets (SBTi) status.', N'As a sustainable packaging manufacturer committed to responsible printing, NTI Printing is aligning its ESG packaging roadmap and sustainability goals with the UN Sustainable Development Goals (SDGs) and evaluating Science-Based Targets (SBTi) status.'
FROM dbo.Page p
WHERE p.PageKey = N'green-esg'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'en' AND x.SourceHash = '6e46c1695ed8e1e1664b7b8b36f495d416c0f38ff59bbadb04d98638bd28e9bf');

/* ── 固定頁 SEO 標題 ── */
UPDATE i SET SeoTitle = N'Why Choose NTI Printing | Quality, Sustainability & Partnership'
FROM dbo.PageI18n i JOIN dbo.Page p ON p.Id = i.PageId
WHERE p.PageKey = N'about-difference' AND i.Lang = 'en' AND (i.SeoTitle IS NULL OR i.SeoTitle = N'');
UPDATE i SET SeoTitle = N'NTI Printing Certifications | FSC · G7 · ISO 9001 · ISO 14001'
FROM dbo.PageI18n i JOIN dbo.Page p ON p.Id = i.PageId
WHERE p.PageKey = N'about-certifications' AND i.Lang = 'en' AND (i.SeoTitle IS NULL OR i.SeoTitle = N'');
UPDATE i SET SeoTitle = N'Custom Packaging & Printing Solutions | NTI Printing Taiwan'
FROM dbo.PageI18n i JOIN dbo.Page p ON p.Id = i.PageId
WHERE p.PageKey = N'solutions' AND i.Lang = 'en' AND (i.SeoTitle IS NULL OR i.SeoTitle = N'');
UPDATE i SET SeoTitle = N'Packaging Printing Portfolio | NTI Printing'
FROM dbo.PageI18n i JOIN dbo.Page p ON p.Id = i.PageId
WHERE p.PageKey = N'projects' AND i.Lang = 'en' AND (i.SeoTitle IS NULL OR i.SeoTitle = N'');
UPDATE i SET SeoTitle = N'State-of-the-Art Printing Facility | NTI Printing'
FROM dbo.PageI18n i JOIN dbo.Page p ON p.Id = i.PageId
WHERE p.PageKey = N'facility' AND i.Lang = 'en' AND (i.SeoTitle IS NULL OR i.SeoTitle = N'');
UPDATE i SET SeoTitle = N'Eco-Friendly Printing in Taiwan | NTI Green Advantage'
FROM dbo.PageI18n i JOIN dbo.Page p ON p.Id = i.PageId
WHERE p.PageKey = N'green-our-advantage' AND i.Lang = 'en' AND (i.SeoTitle IS NULL OR i.SeoTitle = N'');
UPDATE i SET SeoTitle = N'Carbon Neutral Printing | NTI’s Net Zero Commitment'
FROM dbo.PageI18n i JOIN dbo.Page p ON p.Id = i.PageId
WHERE p.PageKey = N'green-carbon' AND i.Lang = 'en' AND (i.SeoTitle IS NULL OR i.SeoTitle = N'');
UPDATE i SET SeoTitle = N'Sustainable Printing Materials | Soy Ink, FSC Paper & More'
FROM dbo.PageI18n i JOIN dbo.Page p ON p.Id = i.PageId
WHERE p.PageKey = N'green-materials' AND i.Lang = 'en' AND (i.SeoTitle IS NULL OR i.SeoTitle = N'');
UPDATE i SET SeoTitle = N'ESG Printing Commitment | NTI’s 2030 Sustainability Goals'
FROM dbo.PageI18n i JOIN dbo.Page p ON p.Id = i.PageId
WHERE p.PageKey = N'green-esg' AND i.Lang = 'en' AND (i.SeoTitle IS NULL OR i.SeoTitle = N'');

/* ── 方案頁 SEO 標題 ── */
UPDATE dbo.SolutionI18n SET SeoTitle = N'Custom Color Box Packaging | NTI Printing Taiwan'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'boxes') AND Lang = 'en'
  AND (SeoTitle IS NULL OR SeoTitle = N'' OR SeoTitle IN (N'Custom Color Box Packaging', N'Custom Color Box Packaging — NTI Printing'));
UPDATE dbo.SolutionI18n SET SeoTitle = N'Custom Cardboard Box Printing | NTI Printing'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'cardboard') AND Lang = 'en'
  AND (SeoTitle IS NULL OR SeoTitle = N'' OR SeoTitle IN (N'Custom Packaging Paperboard', N'Packaging Paperboard — NTI Printing'));
UPDATE dbo.SolutionI18n SET SeoTitle = N'UV Printing Services Taiwan | NTI Printing'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'uv') AND Lang = 'en'
  AND (SeoTitle IS NULL OR SeoTitle = N'' OR SeoTitle IN (N'Eco-Friendly UV Printing', N'UV Printing — NTI Printing'));
UPDATE dbo.SolutionI18n SET SeoTitle = N'Specialty Printing Services | NTI Printing Taiwan'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'other') AND Lang = 'en'
  AND (SeoTitle IS NULL OR SeoTitle = N'' OR SeoTitle IN (N'Other Printing Services', N'Other Printing — NTI Printing'));

/* ── 認證說明 ── */
UPDATE dbo.CertificationI18n SET Description = N'Developed by Idealliance, a globally recognized colour calibration methodology based on ISO 12647-2, ensuring consistent, accurate colour reproduction across every print run.'
WHERE CertificationId = 4 AND Lang = 'en' AND (Description IS NULL OR Description = N'');
UPDATE dbo.CertificationI18n SET Description = N'NTI is GMI certified, ensuring consistent, colour-accurate packaging that meets the quality standards of leading global retailers, including Target, Walgreens, Lowe’s, The Home Depot, Academy Sports + Outdoors, and CVS Pharmacy.'
WHERE CertificationId = 5 AND Lang = 'en' AND (Description IS NULL OR Description = N'');
UPDATE dbo.CertificationI18n SET Description = N'Demonstrates NTI’s commitment to consistent quality, continuous improvement, and customer satisfaction.'
WHERE CertificationId = 6 AND Lang = 'en' AND (Description IS NULL OR Description = N'');
UPDATE dbo.CertificationI18n SET Description = N'Demonstrates NTI’s commitment to reducing environmental impact through responsible management across every stage of production and the product lifecycle.'
WHERE CertificationId = 7 AND Lang = 'en' AND (Description IS NULL OR Description = N'');
UPDATE dbo.CertificationI18n SET Description = N'Certifies NTI’s commitment to maintaining a safe, healthy workplace through effective occupational health and safety management.'
WHERE CertificationId = 8 AND Lang = 'en' AND (Description IS NULL OR Description = N'');
UPDATE dbo.CertificationI18n SET Description = N'Guarantees that certified paper materials are sourced from responsibly managed forests and verified throughout the supply chain.'
WHERE CertificationId = 9 AND Lang = 'en' AND (Description IS NULL OR Description = N'');
UPDATE dbo.CertificationI18n SET Description = N'NTI uses MOF-certified eco-friendly printing materials and inks, helping clients reduce environmental impact while meeting recognized sustainability and quality standards.'
WHERE CertificationId = 14 AND Lang = 'en' AND (Description IS NULL OR Description = N'');

/* ── FAQ 草稿 ── */
DECLARE @faqId INT, @sort INT = (SELECT ISNULL(MAX(SortOrder), 0) FROM dbo.Faq WHERE IsDeleted = 0);
IF NOT EXISTS (SELECT 1 FROM dbo.FaqI18n i JOIN dbo.Faq f ON f.Id = i.FaqId
               WHERE f.IsDeleted = 0 AND i.Lang = 'en' AND i.Question = N'What certifications does NTI Printing hold?')
BEGIN
    SET @sort += 10;
    INSERT dbo.Faq (CategoryId, SortOrder, IsPublished)
    VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Faq' AND Code = N'general' AND IsDeleted = 0), @sort, 0);
    SET @faqId = SCOPE_IDENTITY();
    INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
    VALUES (@faqId, 'en', N'What certifications does NTI Printing hold?', N'<p>NTI Printing holds G7 Master Colorspace, GMI Professional Printing Certification, ISO 14001, ISO 9001, OHSAS 18001, FSC™-CoC Chain of Custody, and MOF-certified eco-friendly printing materials.</p>');
END
IF NOT EXISTS (SELECT 1 FROM dbo.FaqI18n i JOIN dbo.Faq f ON f.Id = i.FaqId
               WHERE f.IsDeleted = 0 AND i.Lang = 'en' AND i.Question = N'What does FSC CoC certification mean for my packaging?')
BEGIN
    SET @sort += 10;
    INSERT dbo.Faq (CategoryId, SortOrder, IsPublished)
    VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Faq' AND Code = N'general' AND IsDeleted = 0), @sort, 0);
    SET @faqId = SCOPE_IDENTITY();
    INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
    VALUES (@faqId, 'en', N'What does FSC CoC certification mean for my packaging?', N'<p>FSC™-CoC (Chain of Custody) certification guarantees that certified paper materials are sourced from responsibly managed forests and verified throughout the supply chain — from NTI Printing to your finished packaging.</p>');
END
IF NOT EXISTS (SELECT 1 FROM dbo.FaqI18n i JOIN dbo.Faq f ON f.Id = i.FaqId
               WHERE f.IsDeleted = 0 AND i.Lang = 'en' AND i.Question = N'What is G7 Master Printer certification?')
BEGIN
    SET @sort += 10;
    INSERT dbo.Faq (CategoryId, SortOrder, IsPublished)
    VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Faq' AND Code = N'general' AND IsDeleted = 0), @sort, 0);
    SET @faqId = SCOPE_IDENTITY();
    INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
    VALUES (@faqId, 'en', N'What is G7 Master Printer certification?', N'<p>G7 Master Colorspace, developed by Idealliance and based on ISO 12647-2, is a globally recognized colour calibration methodology that ensures consistent, accurate colour reproduction across every print run at NTI Printing.</p>');
END
IF NOT EXISTS (SELECT 1 FROM dbo.FaqI18n i JOIN dbo.Faq f ON f.Id = i.FaqId
               WHERE f.IsDeleted = 0 AND i.Lang = 'en' AND i.Question = N'Is NTI’s printing carbon neutral?')
BEGIN
    SET @sort += 10;
    INSERT dbo.Faq (CategoryId, SortOrder, IsPublished)
    VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Faq' AND Code = N'sustainability' AND IsDeleted = 0), @sort, 0);
    SET @faqId = SCOPE_IDENTITY();
    INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
    VALUES (@faqId, 'en', N'Is NTI’s printing carbon neutral?', N'<p>NTI Printing is working toward net-zero through the 4 Rs (Reduce, Reuse, Recover, Recycle), carbon-balanced Heidelberg presses, solar energy, and ongoing carbon footprint tracking.</p>');
END
IF NOT EXISTS (SELECT 1 FROM dbo.FaqI18n i JOIN dbo.Faq f ON f.Id = i.FaqId
               WHERE f.IsDeleted = 0 AND i.Lang = 'en' AND i.Question = N'What eco-friendly materials does NTI use?')
BEGIN
    SET @sort += 10;
    INSERT dbo.Faq (CategoryId, SortOrder, IsPublished)
    VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Faq' AND Code = N'materials' AND IsDeleted = 0), @sort, 0);
    SET @faqId = SCOPE_IDENTITY();
    INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
    VALUES (@faqId, 'en', N'What eco-friendly materials does NTI use?', N'<p>NTI Printing uses FSC-certified paper, low-VOC (under 1%) eco-friendly inks, RoHS-compliant materials, and solvent-recovery systems across production.</p>');
END
IF NOT EXISTS (SELECT 1 FROM dbo.FaqI18n i JOIN dbo.Faq f ON f.Id = i.FaqId
               WHERE f.IsDeleted = 0 AND i.Lang = 'en' AND i.Question = N'Does eco-friendly printing cost more?')
BEGIN
    SET @sort += 10;
    INSERT dbo.Faq (CategoryId, SortOrder, IsPublished)
    VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Faq' AND Code = N'sustainability' AND IsDeleted = 0), @sort, 0);
    SET @faqId = SCOPE_IDENTITY();
    INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
    VALUES (@faqId, 'en', N'Does eco-friendly printing cost more?', N'');
END
IF NOT EXISTS (SELECT 1 FROM dbo.FaqI18n i JOIN dbo.Faq f ON f.Id = i.FaqId
               WHERE f.IsDeleted = 0 AND i.Lang = 'en' AND i.Question = N'Can NTI handle international orders and export?')
BEGIN
    SET @sort += 10;
    INSERT dbo.Faq (CategoryId, SortOrder, IsPublished)
    VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Faq' AND Code = N'general' AND IsDeleted = 0), @sort, 0);
    SET @faqId = SCOPE_IDENTITY();
    INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
    VALUES (@faqId, 'en', N'Can NTI handle international orders and export?', N'<p>Yes. NTI Printing supports domestic and international clients with direct delivery to factories, suppliers, warehouses, or assembly plants across Taiwan and Asia, with simplified cross-border coordination.</p>');
END
IF NOT EXISTS (SELECT 1 FROM dbo.FaqI18n i JOIN dbo.Faq f ON f.Id = i.FaqId
               WHERE f.IsDeleted = 0 AND i.Lang = 'en' AND i.Question = N'What types of custom packaging can NTI produce?')
BEGIN
    SET @sort += 10;
    INSERT dbo.Faq (CategoryId, SortOrder, IsPublished)
    VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Faq' AND Code = N'general' AND IsDeleted = 0), @sort, 0);
    SET @faqId = SCOPE_IDENTITY();
    INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
    VALUES (@faqId, 'en', N'What types of custom packaging can NTI produce?', N'<p>NTI Printing produces custom color box packaging, cardboard packaging, UV-printed finishes, and specialty printing (foil stamping, embossing, holographic effects) — see Printing Solutions for the full range.</p>');
END
IF NOT EXISTS (SELECT 1 FROM dbo.FaqI18n i JOIN dbo.Faq f ON f.Id = i.FaqId
               WHERE f.IsDeleted = 0 AND i.Lang = 'en' AND i.Question = N'What is NTI’s minimum order quantity (MOQ)?')
BEGIN
    SET @sort += 10;
    INSERT dbo.Faq (CategoryId, SortOrder, IsPublished)
    VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Faq' AND Code = N'ordering' AND IsDeleted = 0), @sort, 0);
    SET @faqId = SCOPE_IDENTITY();
    INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
    VALUES (@faqId, 'en', N'What is NTI’s minimum order quantity (MOQ)?', N'');
END
IF NOT EXISTS (SELECT 1 FROM dbo.FaqI18n i JOIN dbo.Faq f ON f.Id = i.FaqId
               WHERE f.IsDeleted = 0 AND i.Lang = 'en' AND i.Question = N'What is the typical lead time for custom packaging?')
BEGIN
    SET @sort += 10;
    INSERT dbo.Faq (CategoryId, SortOrder, IsPublished)
    VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Faq' AND Code = N'ordering' AND IsDeleted = 0), @sort, 0);
    SET @faqId = SCOPE_IDENTITY();
    INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
    VALUES (@faqId, 'en', N'What is the typical lead time for custom packaging?', N'');
END

COMMIT;
GO
