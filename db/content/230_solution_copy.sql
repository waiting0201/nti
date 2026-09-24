/* =============================================================================
   230_solution_copy.sql  —  四個方案的 H1／短述／導言／SEO（與 mockup 逐字相同）
   -----------------------------------------------------------------------------
   **由 tools/build-solution-copy-sql.mjs 產生，請勿手改。**

   前台 2026-09-24 起讀這幾個欄位（/products-* 四頁、首頁方案卡）。每個欄位只在
   「還是空的」或「還是早期種子的提案值」時才補，後台改過的不會被蓋掉——可直接在正式庫執行，
   重跑無副作用。
   ============================================================================= */
SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

/* boxes · zh */
UPDATE dbo.SolutionI18n SET H1 = N'客製化彩盒包裝'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'boxes') AND Lang = 'zh'
  AND (H1 IS NULL OR H1 = N'' OR H1 = N'客製化彩盒包裝');
UPDATE dbo.SolutionI18n SET Summary = N'多種盒型：除了摺疊盒，我們也提供客製化盒型結構設計。'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'boxes') AND Lang = 'zh'
  AND (Summary IS NULL OR Summary = N'');
UPDATE dbo.SolutionI18n SET IntroHtml = N'<p>探索 NTI 完整的客製化彩盒包裝與彩盒印刷選項：</p>'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'boxes') AND Lang = 'zh'
  AND (IntroHtml IS NULL OR IntroHtml = N'');
UPDATE dbo.SolutionI18n SET SeoTitle = N'客製化彩盒包裝 —— NTI Printing'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'boxes') AND Lang = 'zh'
  AND (SeoTitle IS NULL OR SeoTitle = N'' OR SeoTitle = N'客製化彩盒包裝');
-- SeoDescription：字典沒有中文，不寫（前台顯示英文原文）

/* boxes · en */
UPDATE dbo.SolutionI18n SET H1 = N'Custom Color Box Packaging'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'boxes') AND Lang = 'en'
  AND (H1 IS NULL OR H1 = N'' OR H1 = N'Custom Color Box Packaging');
UPDATE dbo.SolutionI18n SET Summary = N'Multiple box-types: besides folding box, we also provide customize box structure design.'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'boxes') AND Lang = 'en'
  AND (Summary IS NULL OR Summary = N'');
UPDATE dbo.SolutionI18n SET IntroHtml = N'<p>Explore NTI’s full range of custom color box packaging and color box printing options below:</p>'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'boxes') AND Lang = 'en'
  AND (IntroHtml IS NULL OR IntroHtml = N'');
UPDATE dbo.SolutionI18n SET SeoTitle = N'Custom Color Box Packaging — NTI Printing'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'boxes') AND Lang = 'en'
  AND (SeoTitle IS NULL OR SeoTitle = N'' OR SeoTitle = N'Custom Color Box Packaging');
UPDATE dbo.SolutionI18n SET SeoDescription = N'Custom color box packaging from NTI: tuck-top, reinforced-bottom, rigid and specialty structures, printed and finished to retail standard in Taiwan.'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'boxes') AND Lang = 'en'
  AND (SeoDescription IS NULL OR SeoDescription = N'');

/* cardboard · zh */
UPDATE dbo.SolutionI18n SET H1 = N'包裝紙板'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'cardboard') AND Lang = 'zh'
  AND (H1 IS NULL OR H1 = N'' OR H1 = N'客製化包裝紙板');
UPDATE dbo.SolutionI18n SET Summary = N'零售貨架用的吊卡、泡殼卡與背卡。'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'cardboard') AND Lang = 'zh'
  AND (Summary IS NULL OR Summary = N'');
UPDATE dbo.SolutionI18n SET IntroHtml = N'<p>NTI Printing 生產零售、工業與消費性應用的客製化紙板包裝與印刷紙盒，包括：</p>'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'cardboard') AND Lang = 'zh'
  AND (IntroHtml IS NULL OR IntroHtml = N'');
UPDATE dbo.SolutionI18n SET SeoTitle = N'包裝紙板 —— NTI Printing'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'cardboard') AND Lang = 'zh'
  AND (SeoTitle IS NULL OR SeoTitle = N'' OR SeoTitle = N'客製化包裝紙板');
-- SeoDescription：字典沒有中文，不寫（前台顯示英文原文）

/* cardboard · en */
UPDATE dbo.SolutionI18n SET H1 = N'Packaging Paperboard'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'cardboard') AND Lang = 'en'
  AND (H1 IS NULL OR H1 = N'' OR H1 = N'Custom Packaging Paperboard');
UPDATE dbo.SolutionI18n SET Summary = N'Hang tags, blister cards and backcards for retail walls.'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'cardboard') AND Lang = 'en'
  AND (Summary IS NULL OR Summary = N'');
UPDATE dbo.SolutionI18n SET IntroHtml = N'<p>NTI Printing produces custom cardboard packaging and printed cardboard boxes for retail, industrial, and consumer applications, including:</p>'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'cardboard') AND Lang = 'en'
  AND (IntroHtml IS NULL OR IntroHtml = N'');
UPDATE dbo.SolutionI18n SET SeoTitle = N'Packaging Paperboard — NTI Printing'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'cardboard') AND Lang = 'en'
  AND (SeoTitle IS NULL OR SeoTitle = N'' OR SeoTitle = N'Custom Packaging Paperboard');
UPDATE dbo.SolutionI18n SET SeoDescription = N'Custom cardboard packaging and printed cardboard boxes for retail and industrial use, including paper hang tags, blister back cards and multi-panel tags.'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'cardboard') AND Lang = 'en'
  AND (SeoDescription IS NULL OR SeoDescription = N'');

/* uv · zh */
UPDATE dbo.SolutionI18n SET H1 = N'UV 印刷'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'uv') AND Lang = 'zh'
  AND (H1 IS NULL OR H1 = N'' OR H1 = N'環保 UV 印刷');
UPDATE dbo.SolutionI18n SET Summary = N'特殊材質印刷、特殊光油、防偽等。'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'uv') AND Lang = 'zh'
  AND (Summary IS NULL OR Summary = N'');
UPDATE dbo.SolutionI18n SET IntroHtml = N'<p>UV 印刷能在塑膠、金屬箔、塗佈紙板等非吸收性材質上，呈現鮮豔而耐久的圖像。瞬間固化的製程加快生產、提升印刷品質，並支援高階加工、特殊塗層與防偽應用 —— 這也是 NTI Printing 成為台灣 UV 上光印刷可靠來源的原因之一。</p>'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'uv') AND Lang = 'zh'
  AND (IntroHtml IS NULL OR IntroHtml = N'');
UPDATE dbo.SolutionI18n SET SeoTitle = N'UV 印刷 —— NTI Printing'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'uv') AND Lang = 'zh'
  AND (SeoTitle IS NULL OR SeoTitle = N'' OR SeoTitle = N'環保 UV 印刷');
-- SeoDescription：字典沒有中文，不寫（前台顯示英文原文）

/* uv · en */
UPDATE dbo.SolutionI18n SET H1 = N'UV Printing'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'uv') AND Lang = 'en'
  AND (H1 IS NULL OR H1 = N'' OR H1 = N'Eco-Friendly UV Printing');
UPDATE dbo.SolutionI18n SET Summary = N'Printing on special materials, special varnish, anti-counterfeiting and more.'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'uv') AND Lang = 'en'
  AND (Summary IS NULL OR Summary = N'');
UPDATE dbo.SolutionI18n SET IntroHtml = N'<p>UV printing delivers vibrant, durable graphics on plastics, metal foils, coated paperboards, and other non-absorbent materials. Its instant curing process speeds up production, improves print quality, and supports premium finishes, specialty coatings, and anti-counterfeiting applications — one reason NTI Printing is a trusted source for UV coating printing in Taiwan.</p>'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'uv') AND Lang = 'en'
  AND (IntroHtml IS NULL OR IntroHtml = N'');
UPDATE dbo.SolutionI18n SET SeoTitle = N'UV Printing — NTI Printing'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'uv') AND Lang = 'en'
  AND (SeoTitle IS NULL OR SeoTitle = N'' OR SeoTitle = N'Eco-Friendly UV Printing');
UPDATE dbo.SolutionI18n SET SeoDescription = N'UV printing on plastics, metal foils and coated paperboards. Instant curing delivers vibrant, durable graphics on non-absorbent materials, faster.'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'uv') AND Lang = 'en'
  AND (SeoDescription IS NULL OR SeoDescription = N'');

/* other · zh */
UPDATE dbo.SolutionI18n SET H1 = N'其他印刷服務'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'other') AND Lang = 'zh'
  AND (H1 IS NULL OR H1 = N'' OR H1 = N'其他印刷服務');
UPDATE dbo.SolutionI18n SET Summary = N'桌曆、手提袋、紅包袋、滑鼠墊與說明書。'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'other') AND Lang = 'zh'
  AND (Summary IS NULL OR Summary = N'');
UPDATE dbo.SolutionI18n SET IntroHtml = N'<p>以燙金、壓凸、雷射光影與防偽等高階加工，讓包裝更出色。特殊印刷與客製化印後加工能增加視覺衝擊、強化品牌感受，並提升產品的防偽保護。</p><p>其他產品包括但不限於月曆、紙袋、提袋、滑鼠墊、說明書等。</p>'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'other') AND Lang = 'zh'
  AND (IntroHtml IS NULL OR IntroHtml = N'');
UPDATE dbo.SolutionI18n SET SeoTitle = N'其他印刷服務 —— NTI Printing'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'other') AND Lang = 'zh'
  AND (SeoTitle IS NULL OR SeoTitle = N'' OR SeoTitle = N'其他印刷服務');
-- SeoDescription：字典沒有中文，不寫（前台顯示英文原文）

/* other · en */
UPDATE dbo.SolutionI18n SET H1 = N'Other Printing Services'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'other') AND Lang = 'en'
  AND (H1 IS NULL OR H1 = N'' OR H1 = N'Other Printing Services');
UPDATE dbo.SolutionI18n SET Summary = N'Desk calendars, hand bags, red envelopes, mouse pads and manuals.'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'other') AND Lang = 'en'
  AND (Summary IS NULL OR Summary = N'');
UPDATE dbo.SolutionI18n SET IntroHtml = N'<p>Enhance your packaging with premium finishes including foil stamping, embossing, holographic effects, and anti-counterfeiting features. Our specialty printing and custom print finishing solutions add visual impact, strengthen brand perception, and provide enhanced product security.</p><p>Other products include, but are not limited to, calendars, envelopes, bags, mouse pads, manuals, etc.</p>'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'other') AND Lang = 'en'
  AND (IntroHtml IS NULL OR IntroHtml = N'');
UPDATE dbo.SolutionI18n SET SeoTitle = N'Other Printing Services — NTI Printing'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'other') AND Lang = 'en'
  AND (SeoTitle IS NULL OR SeoTitle = N'' OR SeoTitle = N'Other Printing Services');
UPDATE dbo.SolutionI18n SET SeoDescription = N'Specialty printing and custom print finishing from NTI — foil stamping, embossing, holographic and anti-counterfeiting effects, plus calendars and bags.'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'other') AND Lang = 'en'
  AND (SeoDescription IS NULL OR SeoDescription = N'');

COMMIT;
GO
