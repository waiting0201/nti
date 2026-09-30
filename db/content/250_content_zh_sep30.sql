/* =============================================================================
   250_content_zh_sep30.sql  —  客戶 2026-09-30 中文文案（SEO/GEO 關鍵字優化翻譯版）
   -----------------------------------------------------------------------------
   **由 tools/build-content-zh-sep30-sql.mjs 產生，請勿手改。** 取捨見該檔檔頭。

   - 頁面文字覆寫 250 段（PageText，zh；已存在的不動）
   - 固定頁 SEO 標題 17 頁、首頁 SEO 描述（只補空的／還是英文複本的）
   - 方案頁 SEO 標題與導言 4 頁、方案品項 8 筆（只換還是初稿的）
   - 認證說明 7 筆（只補空的）
   - FAQ 10 題草稿補中文（240 建的，以英文問題找；已有中文的不動）

   需先有 0010（PageText）；在 200／230／240 之後執行。重跑無副作用。
   ============================================================================= */
SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

/* ── 頁面文字 ── */
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '273ac414d72e70b9a9c819ad3ecf4ced171944078e23e5da55d13f17442d6718', N'Taiwan’s Sustainable Packaging & Printing Leader', N'台灣永續包裝與印刷領導品牌'
FROM dbo.Page p
WHERE p.PageKey = N'home'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '273ac414d72e70b9a9c819ad3ecf4ced171944078e23e5da55d13f17442d6718');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'c13201fab387879027f99f7f4501c9185bf7594de1c9ba9bdd2ae83332ad6531', N'The Courage to Print Green', N'勇於綠色印刷'
FROM dbo.Page p
WHERE p.PageKey = N'home'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'c13201fab387879027f99f7f4501c9185bf7594de1c9ba9bdd2ae83332ad6531');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'caf114e8605bc163088815126b3c1c44b952ba693d29e99cc4d5df1775cb8ca2', N'NTI Printing is Taiwan’s pioneer eco-friendly printing company and sustainable packaging manufacturer, combining uncompromising digital-first quality with measurable environmental responsibility.', N'南台彩藝是台灣綠色印刷解決方案的先驅者與永續包裝製造商，結合數位優先的極致品質與可量化的環境責任。南台彩藝持有 FSC 產銷監管鏈認證、G7 Master Printer 認證，以及 ISO 9001/14001 認證，是台灣認證數量最多的環保印刷廠之一。'
FROM dbo.Page p
WHERE p.PageKey = N'home'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'caf114e8605bc163088815126b3c1c44b952ba693d29e99cc4d5df1775cb8ca2');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '7d44c4337d66d7e718cfc69cedabebdca4e754cbc13b09dc4dba0abe51bb041b', N'Optimized packaging that reduces material use and waste.', N'優化包裝以減少材料使用與浪費。'
FROM dbo.Page p
WHERE p.PageKey = N'home'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '7d44c4337d66d7e718cfc69cedabebdca4e754cbc13b09dc4dba0abe51bb041b');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '12b6f490d7a43b8aba1337dedbe35bb2f08bcdf50cfd9108f9340a8595983b76', N'Energy-efficient production with lower waste and emissions.', N'節能生產，降低廢棄物與排放。'
FROM dbo.Page p
WHERE p.PageKey = N'home'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '12b6f490d7a43b8aba1337dedbe35bb2f08bcdf50cfd9108f9340a8595983b76');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '45d4a0f05124dd071737a410a705c5d18a0d81e1a6cef044aeca123888801835', N'Trusted by leading domestic and international brands.', N'深受國內外領導品牌信賴。'
FROM dbo.Page p
WHERE p.PageKey = N'home'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '45d4a0f05124dd071737a410a705c5d18a0d81e1a6cef044aeca123888801835');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '367f478dd522a20e28a059e18f95c713c6c65ac0e27fc4b5f24733a9dca20482', N'The NTI Difference — Where Sustainability Meets Uncompromising Quality', N'NTI差異優勢——永續與極致品質的交會點'
FROM dbo.Page p
WHERE p.PageKey = N'about-hub'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '367f478dd522a20e28a059e18f95c713c6c65ac0e27fc4b5f24733a9dca20482');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '6125aeddc52d65ed2558e6869636a2d66adab471f5e7c958d65918c61b87443b', N'The NTI Difference', N'NTI差異優勢'
FROM dbo.Page p
WHERE p.PageKey = N'about-hub'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '6125aeddc52d65ed2558e6869636a2d66adab471f5e7c958d65918c61b87443b');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '5bfb448d65324e0402eb4742c1bebb2c5044e2ad3c90246273633873bc07da50', N'Beyond Ink. A mindset of sustainability.', N'超越油墨，是一種永續思維。'
FROM dbo.Page p
WHERE p.PageKey = N'about-hub'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '5bfb448d65324e0402eb4742c1bebb2c5044e2ad3c90246273633873bc07da50');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '5489cce33bb12b93d82ef9ec16c06b18ae0c3a7e4c3823fc24523f155ab42c4d', N'Today, NTI Printing stands as one of Taiwan’s most certified eco-friendly printing companies and a trusted sustainable printing partner for global brands — proving that premium quality and environmental responsibility can thrive together. We deliver the sharpest prints, the richest colors, and the smallest footprint.', N'如今，南台彩藝已是台灣認證數量最多的環保印刷公司之一，提供環保包裝與綠色包裝解決方案，並以綠色印刷技術服務全球品牌——證明卓越品質與環境責任能夠並存。我們交付最銳利的印刷成果、最豐富的色彩，以及最小的環境足跡。'
FROM dbo.Page p
WHERE p.PageKey = N'about-hub'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '5489cce33bb12b93d82ef9ec16c06b18ae0c3a7e4c3823fc24523f155ab42c4d');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '3373270ad7bb13b7796093fa65f9ee579113cdadf9bf9b3e2a75bf28ceb73473', N'NTI. The Courage to Print Green.', N'南台彩藝。勇於綠色印刷。'
FROM dbo.Page p
WHERE p.PageKey = N'about-hub'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '3373270ad7bb13b7796093fa65f9ee579113cdadf9bf9b3e2a75bf28ceb73473');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '070b336f4b74ff9c5d4fdbf17e24a9fed9135648d846f63d44d7630bfc71836d', N'Since 1968', N'始於1968年'
FROM dbo.Page p
WHERE p.PageKey = N'about-hub'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '070b336f4b74ff9c5d4fdbf17e24a9fed9135648d846f63d44d7630bfc71836d');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'cc3154491506254c73c7c34e7e28c75b2a0095938de0dfe3b487cf17e9a4e75b', N'Benefits to Clients', N'對客戶的好處'
FROM dbo.Page p
WHERE p.PageKey = N'about-hub'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'cc3154491506254c73c7c34e7e28c75b2a0095938de0dfe3b487cf17e9a4e75b');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '43a59b7938b9f7ca6bfb146ca3733d06cc8fd69076be04ec0e64abbaaa808cd9', N'Why Global Brands Choose NTI', N'為何全球品牌選擇南台彩藝'
FROM dbo.Page p
WHERE p.PageKey = N'about-hub'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '43a59b7938b9f7ca6bfb146ca3733d06cc8fd69076be04ec0e64abbaaa808cd9');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '7a0dcf8964494d4792ebc6e667ea943bd659c1640d06aefde64515c42fe9d03d', N'NTI helps global brands create premium, sustainable packaging and custom packaging boxes that protect products, strengthen brand value, and reduce environmental impact. Combining world-class printing with advanced digital technology and responsible manufacturing, we support domestic and international clients with complete packaging solutions, efficient supply chain coordination, and direct global delivery.', N'作為客製化印刷夥伴與B2B包裝供應商，南台彩藝協助全球品牌打造能保護產品、強化品牌價值並降低環境衝擊的永續包裝與客製化包裝盒。結合世界級印刷技術、先進數位技術與負責任的製造流程，我們為國內外客戶提供完整的包裝解決方案、高效的供應鏈協調，以及直送全球的服務。'
FROM dbo.Page p
WHERE p.PageKey = N'about-hub'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '7a0dcf8964494d4792ebc6e667ea943bd659c1640d06aefde64515c42fe9d03d');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '20fa67dff8cb17e81d14d7b88656ae831f00aa80e36ac7f8ea7fd84bbe9085f3', N'Simplified coordination across Taiwan and Asia.', N'簡化台灣與亞洲間的協調流程。'
FROM dbo.Page p
WHERE p.PageKey = N'about-hub'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '20fa67dff8cb17e81d14d7b88656ae831f00aa80e36ac7f8ea7fd84bbe9085f3');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '9f985f4d786f7e9e30607ad4b26e21a53ccdda7a818b5bceb94fea32663c5439', N'Faster production and shorter supply chain lead times.', N'更快的生產速度與更短的供應鏈交期。'
FROM dbo.Page p
WHERE p.PageKey = N'about-hub'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '9f985f4d786f7e9e30607ad4b26e21a53ccdda7a818b5bceb94fea32663c5439');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'e2a74f33cc811dd018e9af7bb090517ca6cd2e336ae44cec74a74518b3f3612d', N'Premium print quality with reliable global logistics.', N'頂級印刷品質搭配可靠的全球物流。'
FROM dbo.Page p
WHERE p.PageKey = N'about-hub'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'e2a74f33cc811dd018e9af7bb090517ca6cd2e336ae44cec74a74518b3f3612d');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '396b8741fab344bc60263c963ec086b3d15663d2c9fd76b0cccf6043385a8178', N'One trusted partner from design to final delivery.', N'從設計到最終交付，始終如一的信賴夥伴。'
FROM dbo.Page p
WHERE p.PageKey = N'about-hub'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '396b8741fab344bc60263c963ec086b3d15663d2c9fd76b0cccf6043385a8178');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '4ed5c797bc1779f7975db6648d125d2c6b8191b68e0134f3f16f73d4c5a512a9', N'Certifications, Partnerships & Awards', N'認證、合作夥伴與獎項'
FROM dbo.Page p
WHERE p.PageKey = N'about-hub'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '4ed5c797bc1779f7975db6648d125d2c6b8191b68e0134f3f16f73d4c5a512a9');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '1d9fb79732de129e0ee83ff7f93375967574bc0aec4fa21fde1147d903f93d5d', N'Proving our promise through action', N'用行動證明我們的承諾'
FROM dbo.Page p
WHERE p.PageKey = N'about-hub'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '1d9fb79732de129e0ee83ff7f93375967574bc0aec4fa21fde1147d903f93d5d');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'e11683a69e9ecb464423182dfe4b1d390d72786ecbf5b7e15114806ee2035a53', N'NTI Printing holds FSC CoC certification, G7 Master Printer status, and ISO 9001/14001 certification, making it one of Taiwan’s most certified eco-friendly printing manufacturers.', N'南台彩藝持有 FSC 產銷監管鏈認證、G7 Master Printer 認證，以及 ISO 9001/14001 認證，是台灣認證數量最多的環保印刷廠之一。'
FROM dbo.Page p
WHERE p.PageKey = N'about-hub'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'e11683a69e9ecb464423182dfe4b1d390d72786ecbf5b7e15114806ee2035a53');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '76e814cad10d7c769ac5b238e34394b2ce2f6b48cc19337184bad0fd3d7feba7', N'Green printing is more than a process — it is the way we do business. Every decision, from the materials we select to the equipment we invest in, is guided by our commitment to sustainability. Through energy-efficient production, low-emission inks, wastewater recycling, solvent recovery, solar energy, and ongoing carbon footprint reduction, NTI proves that exceptional printing and environmental responsibility can thrive together.', N'綠色印刷不只是一套流程——它是我們的經營之道。從選用的材料到投資的設備，每個決策都以永續承諾為指引。透過節能生產、低排放油墨、廢水回收、溶劑回收、太陽能與持續的碳足跡減量，南台彩藝證明卓越印刷與環境責任可以並存。'
FROM dbo.Page p
WHERE p.PageKey = N'about-hub'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '76e814cad10d7c769ac5b238e34394b2ce2f6b48cc19337184bad0fd3d7feba7');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '478ea1a9b7d7eca9086d308842040a1dc07ef60a4d3188e749a81022b101e8af', N'That’s The Courage to Print Green.', N'這就是勇於綠色印刷。'
FROM dbo.Page p
WHERE p.PageKey = N'about-hub'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '478ea1a9b7d7eca9086d308842040a1dc07ef60a4d3188e749a81022b101e8af');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'bb7634ceedc9db1a8b7430706c3cddd5970f7aad724b490d2d6cebb5de087fee', N'At NTI Printing, ESG begins with people. Our state-of-the-art, fully air-conditioned facility is designed to provide a safe, comfortable, and inspiring workplace for every member of our team. From modern offices and efficient production floors to staff restaurants, library, dormitories, and shared spaces, we continually invest in the wellbeing of both our local and international employees. By creating an environment where people can thrive, we build a stronger culture, deliver better quality, and support a more sustainable future as a trusted sustainable packaging manufacturer in Taiwan.', N'在南台彩藝，ESG從「人」開始。我們先進、全空調的廠區，致力於為團隊每一位成員打造安全、舒適且充滿啟發的工作環境。從現代化辦公空間、高效生產樓層，到員工餐廳、圖書館、宿舍與共享空間，我們持續投資於本地與國際員工的福祉。透過打造一個讓人才能夠成長的環境，我們建立更堅實的企業文化、交付更好的品質，並作為台灣值得信賴的永續包裝製造商，支持更永續的未來。'
FROM dbo.Page p
WHERE p.PageKey = N'about-hub'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'bb7634ceedc9db1a8b7430706c3cddd5970f7aad724b490d2d6cebb5de087fee');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '6125aeddc52d65ed2558e6869636a2d66adab471f5e7c958d65918c61b87443b', N'The NTI Difference', N'NTI差異優勢'
FROM dbo.Page p
WHERE p.PageKey = N'about-difference'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '6125aeddc52d65ed2558e6869636a2d66adab471f5e7c958d65918c61b87443b');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '367f478dd522a20e28a059e18f95c713c6c65ac0e27fc4b5f24733a9dca20482', N'The NTI Difference — Where Sustainability Meets Uncompromising Quality', N'NTI差異優勢——永續與極致品質的交會點'
FROM dbo.Page p
WHERE p.PageKey = N'about-difference'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '367f478dd522a20e28a059e18f95c713c6c65ac0e27fc4b5f24733a9dca20482');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '5bfb448d65324e0402eb4742c1bebb2c5044e2ad3c90246273633873bc07da50', N'Beyond Ink. A mindset of sustainability.', N'超越油墨，是一種永續思維。'
FROM dbo.Page p
WHERE p.PageKey = N'about-difference'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '5bfb448d65324e0402eb4742c1bebb2c5044e2ad3c90246273633873bc07da50');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'cc3154491506254c73c7c34e7e28c75b2a0095938de0dfe3b487cf17e9a4e75b', N'Benefits to Clients', N'對客戶的好處'
FROM dbo.Page p
WHERE p.PageKey = N'about-difference'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'cc3154491506254c73c7c34e7e28c75b2a0095938de0dfe3b487cf17e9a4e75b');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '4ed5c797bc1779f7975db6648d125d2c6b8191b68e0134f3f16f73d4c5a512a9', N'Certifications, Partnerships & Awards', N'認證、合作夥伴與獎項'
FROM dbo.Page p
WHERE p.PageKey = N'about-difference'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '4ed5c797bc1779f7975db6648d125d2c6b8191b68e0134f3f16f73d4c5a512a9');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '5489cce33bb12b93d82ef9ec16c06b18ae0c3a7e4c3823fc24523f155ab42c4d', N'Today, NTI Printing stands as one of Taiwan’s most certified eco-friendly printing companies and a trusted sustainable printing partner for global brands — proving that premium quality and environmental responsibility can thrive together. We deliver the sharpest prints, the richest colors, and the smallest footprint.', N'如今，南台彩藝已是台灣認證數量最多的環保印刷公司之一，提供環保包裝與綠色包裝解決方案，並以綠色印刷技術服務全球品牌——證明卓越品質與環境責任能夠並存。我們交付最銳利的印刷成果、最豐富的色彩，以及最小的環境足跡。'
FROM dbo.Page p
WHERE p.PageKey = N'about-difference'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '5489cce33bb12b93d82ef9ec16c06b18ae0c3a7e4c3823fc24523f155ab42c4d');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '3373270ad7bb13b7796093fa65f9ee579113cdadf9bf9b3e2a75bf28ceb73473', N'NTI. The Courage to Print Green.', N'南台彩藝。勇於綠色印刷。'
FROM dbo.Page p
WHERE p.PageKey = N'about-difference'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '3373270ad7bb13b7796093fa65f9ee579113cdadf9bf9b3e2a75bf28ceb73473');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '070b336f4b74ff9c5d4fdbf17e24a9fed9135648d846f63d44d7630bfc71836d', N'Since 1968', N'始於1968年'
FROM dbo.Page p
WHERE p.PageKey = N'about-difference'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '070b336f4b74ff9c5d4fdbf17e24a9fed9135648d846f63d44d7630bfc71836d');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'cc3154491506254c73c7c34e7e28c75b2a0095938de0dfe3b487cf17e9a4e75b', N'Benefits to Clients', N'對客戶的好處'
FROM dbo.Page p
WHERE p.PageKey = N'about-benefits'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'cc3154491506254c73c7c34e7e28c75b2a0095938de0dfe3b487cf17e9a4e75b');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '43a59b7938b9f7ca6bfb146ca3733d06cc8fd69076be04ec0e64abbaaa808cd9', N'Why Global Brands Choose NTI', N'為何全球品牌選擇南台彩藝'
FROM dbo.Page p
WHERE p.PageKey = N'about-benefits'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '43a59b7938b9f7ca6bfb146ca3733d06cc8fd69076be04ec0e64abbaaa808cd9');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '6125aeddc52d65ed2558e6869636a2d66adab471f5e7c958d65918c61b87443b', N'The NTI Difference', N'NTI差異優勢'
FROM dbo.Page p
WHERE p.PageKey = N'about-benefits'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '6125aeddc52d65ed2558e6869636a2d66adab471f5e7c958d65918c61b87443b');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '4ed5c797bc1779f7975db6648d125d2c6b8191b68e0134f3f16f73d4c5a512a9', N'Certifications, Partnerships & Awards', N'認證、合作夥伴與獎項'
FROM dbo.Page p
WHERE p.PageKey = N'about-benefits'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '4ed5c797bc1779f7975db6648d125d2c6b8191b68e0134f3f16f73d4c5a512a9');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '7a0dcf8964494d4792ebc6e667ea943bd659c1640d06aefde64515c42fe9d03d', N'NTI helps global brands create premium, sustainable packaging and custom packaging boxes that protect products, strengthen brand value, and reduce environmental impact. Combining world-class printing with advanced digital technology and responsible manufacturing, we support domestic and international clients with complete packaging solutions, efficient supply chain coordination, and direct global delivery.', N'作為客製化印刷夥伴與B2B包裝供應商，南台彩藝協助全球品牌打造能保護產品、強化品牌價值並降低環境衝擊的永續包裝與客製化包裝盒。結合世界級印刷技術、先進數位技術與負責任的製造流程，我們為國內外客戶提供完整的包裝解決方案、高效的供應鏈協調，以及直送全球的服務。'
FROM dbo.Page p
WHERE p.PageKey = N'about-benefits'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '7a0dcf8964494d4792ebc6e667ea943bd659c1640d06aefde64515c42fe9d03d');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '935f990ee186fcf7cc1b34f9e655786ced82e5e4bc0c4676e331d4dc8d0fea70', N'Our Certifications — Proof of Quality & Sustainability', N'我們的認證——品質與永續的證明'
FROM dbo.Page p
WHERE p.PageKey = N'about-certifications'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '935f990ee186fcf7cc1b34f9e655786ced82e5e4bc0c4676e331d4dc8d0fea70');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '1d9fb79732de129e0ee83ff7f93375967574bc0aec4fa21fde1147d903f93d5d', N'Proving our promise through action', N'用行動證明我們的承諾'
FROM dbo.Page p
WHERE p.PageKey = N'about-certifications'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '1d9fb79732de129e0ee83ff7f93375967574bc0aec4fa21fde1147d903f93d5d');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '6125aeddc52d65ed2558e6869636a2d66adab471f5e7c958d65918c61b87443b', N'The NTI Difference', N'NTI差異優勢'
FROM dbo.Page p
WHERE p.PageKey = N'about-certifications'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '6125aeddc52d65ed2558e6869636a2d66adab471f5e7c958d65918c61b87443b');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'cc3154491506254c73c7c34e7e28c75b2a0095938de0dfe3b487cf17e9a4e75b', N'Benefits to Clients', N'對客戶的好處'
FROM dbo.Page p
WHERE p.PageKey = N'about-certifications'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'cc3154491506254c73c7c34e7e28c75b2a0095938de0dfe3b487cf17e9a4e75b');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '4ed5c797bc1779f7975db6648d125d2c6b8191b68e0134f3f16f73d4c5a512a9', N'Certifications, Partnerships & Awards', N'認證、合作夥伴與獎項'
FROM dbo.Page p
WHERE p.PageKey = N'about-certifications'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '4ed5c797bc1779f7975db6648d125d2c6b8191b68e0134f3f16f73d4c5a512a9');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '3bd6beecc1a0d2092a8644efe7848950eedf0dbcb2b80d43d3b933e56cd578b4', N'NTI has built its reputation on printing quality, and our clients hold us to it. We keep applying for further certification so that every customer gets the same assurance of product quality — audited by an outside body rather than asserted by us. Alongside the international standards below, we developed the NTI Green Printing Certificate, a mark our clients can display on their packaging as proof of an eco-conscious process.', N'南台彩藝持有FSC認證印刷資格與G7 Master Printer認證，並設立獨家的綠色印刷認證標章，加上曾榮獲APEC ESCI獎項的永續卓越表現肯定，是台灣認證數量最多的環保印刷製造商之一。NTI 的口碑建立在印刷品質上，客戶也以此標準要求我們。我們持續申請更多認證，讓每一位客戶都得到同樣的品質保證 —— 由外部機構稽核，而不是我們自己說了算。除了下列國際標準之外，我們也發展出 NTI 綠色印刷認證，客戶可將這個標章印在包裝上，作為環保製程的證明。'
FROM dbo.Page p
WHERE p.PageKey = N'about-certifications'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '3bd6beecc1a0d2092a8644efe7848950eedf0dbcb2b80d43d3b933e56cd578b4');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '4fcf999278d144227960e086ec16a3e2ea317bec66e1d7a27f6d56ed0b43ca01', N'Developed by Idealliance, a globally recognized colour calibration methodology based on ISO 12647-2, ensuring consistent, accurate colour reproduction across every print run.', N'由Idealliance開發、以ISO 12647-2為基礎的全球公認色彩校正方法，確保每一次印刷都能呈現一致且精準的色彩重現。'
FROM dbo.Page p
WHERE p.PageKey = N'about-certifications'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '4fcf999278d144227960e086ec16a3e2ea317bec66e1d7a27f6d56ed0b43ca01');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'b2b8aaf3410b50da08d619203e409299d9366aab40e23b2622426cf21c23a554', N'NTI is GMI certified, ensuring consistent, colour-accurate packaging that meets the quality standards of leading global retailers, including Target, Walgreens, Lowe’s, The Home Depot, Academy Sports + Outdoors, and CVS Pharmacy.', N'南台彩藝通過GMI認證，確保包裝色彩一致且符合Target、Walgreens、Lowe’s、The Home Depot、Academy Sports + Outdoors、CVS Pharmacy等全球零售商的品質標準。'
FROM dbo.Page p
WHERE p.PageKey = N'about-certifications'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'b2b8aaf3410b50da08d619203e409299d9366aab40e23b2622426cf21c23a554');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'b0c2e1dbea2cc30fc16fe785cb82988d0487922bac5d23f3b1cf17f1006fc903', N'FSC™-CoC Chain of Custody', N'FSC™產銷監管鏈認證'
FROM dbo.Page p
WHERE p.PageKey = N'about-certifications'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'b0c2e1dbea2cc30fc16fe785cb82988d0487922bac5d23f3b1cf17f1006fc903');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '9e2ccb391d163f8cf633e3c549770f246d8468114fd93fb9c3f0461470ec582c', N'Guarantees that certified paper materials are sourced from responsibly managed forests and verified throughout the supply chain.', N'確保通過認證的紙材來自負責任管理的森林，並在整個供應鏈中受到驗證。'
FROM dbo.Page p
WHERE p.PageKey = N'about-certifications'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '9e2ccb391d163f8cf633e3c549770f246d8468114fd93fb9c3f0461470ec582c');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'dc4ad3c1603ffcd11bc34c09b42de1b8b944615b0aa5a41ff82b357c3df39e33', N'ISO 14001 — Environmental Management', N'ISO 14001環境管理系統'
FROM dbo.Page p
WHERE p.PageKey = N'about-certifications'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'dc4ad3c1603ffcd11bc34c09b42de1b8b944615b0aa5a41ff82b357c3df39e33');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'd543219599035a4e63410752d0ecb174c5f6f068792a460765ea3a5b09954a06', N'Demonstrates NTI’s commitment to reducing environmental impact through responsible management across every stage of production and the product lifecycle.', N'展現南台彩藝在生產與產品生命週期各階段，透過負責任管理降低環境衝擊的承諾。'
FROM dbo.Page p
WHERE p.PageKey = N'about-certifications'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'd543219599035a4e63410752d0ecb174c5f6f068792a460765ea3a5b09954a06');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '95453cfbd2cb1f5bb6307fbcefc79c6d04315a72aa92e89029b4a4fe83c0e08f', N'ISO 9001 — Quality Management System', N'ISO 9001品質管理系統'
FROM dbo.Page p
WHERE p.PageKey = N'about-certifications'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '95453cfbd2cb1f5bb6307fbcefc79c6d04315a72aa92e89029b4a4fe83c0e08f');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '4745b09e892076b138aeb97ff736d1802a95af4d4970efe9321e008bc670622f', N'Demonstrates NTI’s commitment to consistent quality, continuous improvement, and customer satisfaction.', N'展現南台彩藝對一致品質、持續改善與客戶滿意度的承諾。'
FROM dbo.Page p
WHERE p.PageKey = N'about-certifications'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '4745b09e892076b138aeb97ff736d1802a95af4d4970efe9321e008bc670622f');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '56776eb5ac9164ad4be13d9da1f74c3aaf4831f2fe78fb105688f88a554b5f61', N'OHSAS 18001 — Occupational Health & Safety Management', N'OHSAS 18001職業健康與安全管理'
FROM dbo.Page p
WHERE p.PageKey = N'about-certifications'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '56776eb5ac9164ad4be13d9da1f74c3aaf4831f2fe78fb105688f88a554b5f61');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'd94a63f9c580ffa4012472aaef7e368bccd951db3d4a9235c59a5a6e7157015a', N'Certifies NTI’s commitment to maintaining a safe, healthy workplace through effective occupational health and safety management.', N'證明南台彩藝致力於透過有效的職業健康與安全管理，維持安全健康的工作環境。'
FROM dbo.Page p
WHERE p.PageKey = N'about-certifications'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'd94a63f9c580ffa4012472aaef7e368bccd951db3d4a9235c59a5a6e7157015a');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'b9327b5c3441e4f9b2112e05be0bbf3324699b7a4d8485e0238a07cf9dc92efc', N'MOF Certified', N'MOF環保認證'
FROM dbo.Page p
WHERE p.PageKey = N'about-certifications'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'b9327b5c3441e4f9b2112e05be0bbf3324699b7a4d8485e0238a07cf9dc92efc');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'f70435556c3cf94ab38801dc646adeb826cc64dad3037a379dc15f3ecc0bec95', N'NTI uses MOF-certified eco-friendly printing materials and inks, helping clients reduce environmental impact while meeting recognized sustainability and quality standards.', N'南台彩藝使用MOF認證的環保印刷材料與油墨，協助客戶在符合公認永續與品質標準的同時降低環境衝擊。'
FROM dbo.Page p
WHERE p.PageKey = N'about-certifications'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'f70435556c3cf94ab38801dc646adeb826cc64dad3037a379dc15f3ecc0bec95');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '669a46138d69d7c12f52f82ccde4385630ece1947fc7e3a382b371d4aed02f28', N'Awards', N'獲獎紀錄'
FROM dbo.Page p
WHERE p.PageKey = N'about-certifications'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '669a46138d69d7c12f52f82ccde4385630ece1947fc7e3a382b371d4aed02f28');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '7335a3b7e9fdaea63e852a5370f640849b52ace184d45bbbaa0e479c7baa6d33', N'The 13th National Brand Yushan Award for Outstanding Business Award.', N'第13屆國家品牌玉山獎傑出企業獎。'
FROM dbo.Page p
WHERE p.PageKey = N'about-certifications'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '7335a3b7e9fdaea63e852a5370f640849b52ace184d45bbbaa0e479c7baa6d33');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '8b8d204e58aa53e9659412c110a5eed24930c53419ff9487d5c5bb7a7c911fa8', N'Gold Award in the ‘Smart Buildings’ category at the 7th APEC ESCI (Energy Smart Communities Initiative) Best Practices Awards Program.', N'第7屆APEC ESCI（Energy Smart Communities Initiative）最佳實務獎「智慧建築」類別金獎。'
FROM dbo.Page p
WHERE p.PageKey = N'about-certifications'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '8b8d204e58aa53e9659412c110a5eed24930c53419ff9487d5c5bb7a7c911fa8');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'bf783e032180ec23dfc3d0393b17394e67b12ccc9d764c45e4908c84cc67e001', N'Where Technology Meets Sustainability', N'科技與永續的交會點'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'bf783e032180ec23dfc3d0393b17394e67b12ccc9d764c45e4908c84cc67e001');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'a80e03b390be8f8f07ead3549d69510eb7e44907b2335b7e15f5e0d02952cfa3', N'NTI Printing integrates advanced pre-press, printing, and post-press systems inside our G7 certified printing plant — a printing factory in Taiwan designed for precision, efficiency and sustainability. We use Heidelberg and Man Roland presses with in-line varnishing and carbon-balanced systems, reducing energy use and emissions.', N'南台彩藝在通過G7認證的印刷廠內，整合先進的數位印前、印刷與印後系統——這是一座專為精準、效率與永續設計的台灣印刷廠。我們使用海德堡與曼羅蘭印刷機，搭配連線上光與碳平衡系統，降低能源使用與排放。'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'a80e03b390be8f8f07ead3549d69510eb7e44907b2335b7e15f5e0d02952cfa3');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '6c97b2d956740ce96c1b0b4e4dea5050e1110d57ee271e51482ed515f384ee0c', N'Prepress Equipment', N'印前設備'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '6c97b2d956740ce96c1b0b4e4dea5050e1110d57ee271e51482ed515f384ee0c');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '80e6ea1fef589e23c24d37dfc7efce508441414fd171bb3c9c8e02034f1bdd38', N'Environmentally Friendly Printing', N'環保印刷流程'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '80e6ea1fef589e23c24d37dfc7efce508441414fd171bb3c9c8e02034f1bdd38');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'b5f25cdae9bad68ddd28b2308f7397582958375f74d1f7c0715b9f928a9a32a4', N'NTI Printing utilizes the world’s most advanced prepress output software, integrated with a CTP (Computer-to-Plate) direct plate-making system. Coupled with a precise plate production control process, this ensures that the printing dots are accurately rendered, achieving faithful color reproduction in the final print.', N'南台彩藝採用全球最先進的數位印前輸出軟體，結合CTP（電腦直接製版）系統。搭配精準的製版流程控管，確保網點精確呈現，達成最終印刷成品忠實的色彩重現。'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'b5f25cdae9bad68ddd28b2308f7397582958375f74d1f7c0715b9f928a9a32a4');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'af759193f865aff8f5537a9d903a6ce24467bc4ff22afcfdfb915e9be6bbd13a', N'In-house CTP system for faster turnaround and reduced transport.', N'內部CTP系統，縮短交期並降低運輸成本。'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'af759193f865aff8f5537a9d903a6ce24467bc4ff22afcfdfb915e9be6bbd13a');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'd4d6e0944b2d78bebc8add4466793d336da592407b9db2c787d33880a8ac4c65', N'Daily and weekly dot calibration for color precision.', N'每日與每週網點校正，確保色彩精準。'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'd4d6e0944b2d78bebc8add4466793d336da592407b9db2c787d33880a8ac4c65');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'ce924c72832e64d6f0c1aeed1c89f12074922c25aca4c101978878d8d66ed607', N'Eco-friendly production that minimizes heavy metals and wastewater.', N'環保生產流程，最小化重金屬與廢水產生。'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'ce924c72832e64d6f0c1aeed1c89f12074922c25aca4c101978878d8d66ed607');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '317ef608e4f5bfd9f928cbec920747801bf6d29fcb2281dde25c18341cf78172', N'In-house pre-press and CTP plate: short lead time, reducing the cost of transportation. Dot values controlled every day and dot value correction every week to ensure precise dot value. Environmental performance: reduced heavy metal and sewage during production.', N'內部印前與CTP製版：交期短，降低運輸成本。每日控管網點值、每週校正網點值，確保精準網點表現。環境表現：降低生產過程中的重金屬與廢水。'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '317ef608e4f5bfd9f928cbec920747801bf6d29fcb2281dde25c18341cf78172');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '7c29133da25310e6e83683bdedf2350dfeed40a6df577a9256e4e809dc5b0c5f', N'Heidelberg Prinect Color Proof Pro (digital color proof), Epson Pro9900 Image setter and ZÜND high-speed die cutting machine. NTI Printing can provide the box sample with imagesetter proof to save the cost and lead time for machine proofing.', N'海德堡Prinect Color Proof Pro（數位色彩打樣）、Epson Pro9900影像輸出機與ZÜND高速裁切機。南台彩藝可提供影像輸出打樣的紙盒樣品，節省機器打樣的成本與交期。'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '7c29133da25310e6e83683bdedf2350dfeed40a6df577a9256e4e809dc5b0c5f');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'ab215d9ba6ac33b6da73fd269047e67746f81e3e63b5bd0a8b7fdb4b70e04d09', N'Ink mixed system can mix up the spot colour precisely the same as the colour swatch book. Standard litho printing production procedure, meeting international printing standard ISO 12647-2.', N'油墨調配系統可精準調出與色卡完全一致的專色。標準平版印刷生產流程，符合ISO 12647-2國際印刷標準。'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'ab215d9ba6ac33b6da73fd269047e67746f81e3e63b5bd0a8b7fdb4b70e04d09');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'f7ce4a8eedc3b3af4b7535f7647a002ec3d3c0b6bcdbfc595c49f970f36b7e08', N'Heidelberg Press varnishing in line, to shorten the lead time and keep good quality at the same time. We also introduce an environmentally friendly system into the printing procedure.', N'海德堡印刷機連線上光，在縮短交期的同時維持優異品質。我們也持續導入綠色印刷技術與環保系統，落實於印刷流程的每個環節。'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'f7ce4a8eedc3b3af4b7535f7647a002ec3d3c0b6bcdbfc595c49f970f36b7e08');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'ce9026239ac0ce85ebfe040e456bd537946cdc3d210e1e3f8a51eb0486c1bc10', N'Presses in Use', N'先進印刷技術應用'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'ce9026239ac0ce85ebfe040e456bd537946cdc3d210e1e3f8a51eb0486c1bc10');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'e697dcc5461ae1a60d5cf880a76b32d4b725d26e262024e103299b660e22bee8', N'Heidelberg Speedmaster CD 102-6+LX 6-Colour Coater Press', N'海德堡Speedmaster CD 102-6+LX六色上光機'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'e697dcc5461ae1a60d5cf880a76b32d4b725d26e262024e103299b660e22bee8');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'f1a773925d71cf9c0fc43ba90f9d6d1378073c8fb40ffd49c5a8bed091634df4', N'Heidelberg Speedmaster CD 102-5+LX 5-Colour Carbon Balanced Coater Press', N'海德堡Speedmaster CD 102-5+LX五色碳平衡上光機'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'f1a773925d71cf9c0fc43ba90f9d6d1378073c8fb40ffd49c5a8bed091634df4');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '849461a239499d6f1fb9399888e247ac0a8d51f7ed52385f82ab06759aa428a0', N'Heidelberg Speedmaster CD 102-5+LX UV 5-Colour Coater Press', N'海德堡Speedmaster CD 102-5+LX UV五色上光機'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '849461a239499d6f1fb9399888e247ac0a8d51f7ed52385f82ab06759aa428a0');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'c22f6c03824e5a5ae05f3fa8baf69aee6aa8e583d07753c78d4cc37fb4b717a2', N'Man Roland D-6050 Offenbach Two-Colour Offset Press', N'曼羅蘭D-6050 Offenbach雙色平版印刷機'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'c22f6c03824e5a5ae05f3fa8baf69aee6aa8e583d07753c78d4cc37fb4b717a2');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '1d7e303e801a37a8cd8da8b795dc5d872866a810df71819c263d02b5565ba407', N'Heidelberg Image Control System', N'海德堡Image Control影像控制系統'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '1d7e303e801a37a8cd8da8b795dc5d872866a810df71819c263d02b5565ba407');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'e47c572369e824f6b60df18855b5040b77ba59bc95ca19d5ac2cad2943a8a402', N'Heidelberg Axis Control Colour Management System', N'海德堡Axis Control色彩管理系統'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'e47c572369e824f6b60df18855b5040b77ba59bc95ca19d5ac2cad2943a8a402');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'c4499499ce4589918bf31a12e3fdd76a60a11c21fdbb25ec3901bc6e6be87714', N'NTI Printing uses the most advanced die-cutting machines, automated gluing machines, and heat shrink film equipment to achieve high-efficiency production and deliver high-quality packaging products.', N'南台彩藝使用最先進的模切機、自動糊盒機與熱縮膠膜設備，達成高效率生產並交付高品質的包裝加工技術。'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'c4499499ce4589918bf31a12e3fdd76a60a11c21fdbb25ec3901bc6e6be87714');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '5d19972b1689c42752a15c94eae20a7cb3b753abd0082a7a0177428e46629cd5', N'Automated die-cutting, gluing, window patching, and lamination systems.', N'自動模切、糊盒、開窗貼膜與貼合系統。'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '5d19972b1689c42752a15c94eae20a7cb3b753abd0082a7a0177428e46629cd5');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '595d4235a4d95d7b47a0025d93682972c1d883199e9212c5d772d38b4b740901', N'BOPP film coating eliminates solvent use and meets EU and US eco standards.', N'BOPP膠膜塗層取代溶劑使用，符合歐美環保標準。'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '595d4235a4d95d7b47a0025d93682972c1d883199e9212c5d772d38b4b740901');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '55ddb6ab4c27597d5955a3014f722d1c5f761ca413f5404198dd3a003426d4e4', N'High-speed shrink wrapping and labeling for efficient, secure finishing.', N'高速收縮包膜與貼標，達成高效且穩固的成品加工。'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '55ddb6ab4c27597d5955a3014f722d1c5f761ca413f5404198dd3a003426d4e4');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '6b54bdc2c1c0381d43e1d4636979b93a54c0e59cab04d2f06e396367af84269b', N'Heidelberg Varimatrix 105 Die-Cutter', N'海德堡Varimatrix 105自動平台模切機'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '6b54bdc2c1c0381d43e1d4636979b93a54c0e59cab04d2f06e396367af84269b');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '95d700e8d2b774bd3af39c0b8cdad2b6a566e3622c223495ca0f5dc0af443944', N'High-performance automatic flat-bed die-cutting with non-stop feeder, German CITO creasing matrix, precise alignment, and clean waste stripping for straight, sturdy creases.', N'精準對位，乾淨準確地清除廢料，確保無誤差且整潔的收紙機制；採用德國CITO壓痕模，確保完美壓痕品質，讓紙盒更易摺疊與黏合，壓痕線更平整；不停機送紙裝置，提升連續作業效率，無須中斷生產。'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '95d700e8d2b774bd3af39c0b8cdad2b6a566e3622c223495ca0f5dc0af443944');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '7068977352822df3bc6ee1e6bbdc0782b5f9a57fe896bf34c41f2973260bbee7', N'SBL High-Speed Automatic Die-Cutter', N'SBL高速自動平台模切機'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '7068977352822df3bc6ee1e6bbdc0782b5f9a57fe896bf34c41f2973260bbee7');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '4788d75dc3c8614ccfa9723db1e33ea4d73dd3d536ee8e38c9f47c1efd22af3e', N'Non-stop operation across paper sizes from 400 × 370 mm to 1050 × 750 mm, up to 7,500 sheets per hour.', N'精準定位，適用不同紙張厚度，配備不停機裝置以維持連續生產。印刷紙張尺寸範圍400×370mm至1050×750mm，最高模切速度每小時7,500張。'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '4788d75dc3c8614ccfa9723db1e33ea4d73dd3d536ee8e38c9f47c1efd22af3e');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '287cfb869998b653f650b988c0ddce10d671ef339dd49c6c5ecb385a4124f9f8', N'High-Speed Intelligent Laminating Machine', N'高速自動貼合機'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '287cfb869998b653f650b988c0ddce10d671ef339dd49c6c5ecb385a4124f9f8');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '35da433db2a1c963cebed915348368dadffc875e07bc483bb00f19889c59c808', N'BOPP pre-coated film instead of traditional wet lamination — solvent-free, no drying, meeting European and American environmental standards.', N'採用BOPP預塗膜取代傳統貼合方式——無需使用溶劑，也無需烘乾，符合歐美環保標準。'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '35da433db2a1c963cebed915348368dadffc875e07bc483bb00f19889c59c808');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '8d1e6ea816cd74b117f12c7a349c6626b9412b60093b77d7fab225f98a467748', N'Digital Window Patching Machine', N'高精度數位開窗貼膜機'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '8d1e6ea816cd74b117f12c7a349c6626b9412b60093b77d7fab225f98a467748');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '1f9c9399c570bdb612b105fea85ee25800e5e3ee32cd056416d25665af8fffbd', N'Servo-controlled alignment, creasing, corner cutting, and splitting in a single pass.', N'採用數位系統，不同於傳統機械式開窗貼膜機，伺服馬達控制確保更精準的開窗貼膜——一次作業即可完成對位、壓痕、切角與分割。'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '1f9c9399c570bdb612b105fea85ee25800e5e3ee32cd056416d25665af8fffbd');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '46f29e62be152e8545ef735360c2ccd64aacc37b0fbb15b3ab6c3b8870c8313a', N'High-Speed Universal Folder-Gluer', N'高效能自動糊盒機'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '46f29e62be152e8545ef735360c2ccd64aacc37b0fbb15b3ab6c3b8870c8313a');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '007d75d3e4233d0823c88f4cff4d786ef44e19c70e50a347506bf784e845257e', N'Up to 200 metres per minute with optional cold or hot glue systems and plasma surface treatment for strong adhesion.', N'最高速度每分鐘200公尺，實現高速、經濟的生產。可依紙盒類型搭配自動冷膠或熱膠系統，並具備電漿表面處理，確保黏合牢固。'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '007d75d3e4233d0823c88f4cff4d786ef44e19c70e50a347506bf784e845257e');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '2e04181cfdc00e22ed3ecbcc798e002dbac670497e41918d4a12f5637f5b287e', N'Automatic Heat Shrink Wrap Machine', N'自動收縮包膜系統'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '2e04181cfdc00e22ed3ecbcc798e002dbac670497e41918d4a12f5637f5b287e');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '8163341ec5c9e47af131cb7abaa56a95ef76c8417ee59483114729d1047bf1d7', N'Complete wrapping protects finished goods from dust, moisture, and handling damage — no rope-bundling marks.', N'完整包膜可保護產品在儲存期間免受灰塵污染與濕氣損害，確保產品在客戶搬運過程中不因鬆散捆綁而散開或損壞，也防止捆綁過程中綁繩造成的產品表面損傷。'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '8163341ec5c9e47af131cb7abaa56a95ef76c8417ee59483114729d1047bf1d7');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '7fcbb7291a6fb2c6d6f90daa169d25464d070afe63f69317f5a8fe26f6685af3', N'Supporting Equipment', N'其他印後設備'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '7fcbb7291a6fb2c6d6f90daa169d25464d070afe63f69317f5a8fe26f6685af3');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'e0e360d1e66f23879fead9fda4e76dcb2f5666ee50e5f733fc513ac56ca23712', N'Automatic labeling machine, automatic box sealing machine, and two DATIEN guillotine cutters.', N'自動貼標機、自動封箱機、自動裝袋與收縮包膜系統，以及2台DATIEN高精度工業裁紙機。'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'e0e360d1e66f23879fead9fda4e76dcb2f5666ee50e5f733fc513ac56ca23712');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'a3e8e3271a989eee713f1a98d945b4104e2a3ce7524de8bf8e820b17b7d41e01', N'Quality You Can Measure', N'品質，可被量化'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'a3e8e3271a989eee713f1a98d945b4104e2a3ce7524de8bf8e820b17b7d41e01');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'a64fe161438fce45519e075e226db616fc44fdf313c75a397508a49998229a25', N'NTI conducts strict quality control throughout every production stage — from materials to finished goods. Each print is tested for accuracy, durability, and consistency using precision tools such as:', N'南台彩藝在每一個生產階段——從原料到成品——皆實施嚴格的印刷品管。每一張印刷成品都會透過精密工具進行準確度、耐久度與一致性測試，包括：'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'a64fe161438fce45519e075e226db616fc44fdf313c75a397508a49998229a25');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '7dfce230245f34989c8c48815ba689157e066ff6cc7f76ce1b5d7ab10b1b3492', N'Press-side color measurement with single-click operation — strict color-deviation control with less manual error.', N'高靈敏度，能滿足嚴格的色差標準，並可依使用者需求個別設定。一鍵操作即可提升產能並降低人為誤差——在提升色彩品質的同時節省時間並減少紙材浪費。'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '7dfce230245f34989c8c48815ba689157e066ff6cc7f76ce1b5d7ab10b1b3492');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'eee6458901f23efe3bdbacefbf6f69e385eaceb392bac09b887e14dbae6b7f92', N'Measures plate dot area percentage to verify and adjust dot specifications.', N'量測網點面積百分比，並分析數據以調整網點區域。'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'eee6458901f23efe3bdbacefbf6f69e385eaceb392bac09b887e14dbae6b7f92');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '8284b7651d662d8315cf9db733d587c195d3540ce83ae409278a8057b3fc1c43', N'Barcode Grade Scanner', N'條碼等級掃描儀'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '8284b7651d662d8315cf9db733d587c195d3540ce83ae409278a8057b3fc1c43');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '67ba1486cedc01e40dfea2327f32a35e3c2bed03e7180622cc6cd0100ca196df', N'Verifies every printed barcode meets grade compliance.', N'所有印製於商品上的條碼皆經過檢測以確認條碼等級。'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '67ba1486cedc01e40dfea2327f32a35e3c2bed03e7180622cc6cd0100ca196df');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'f70ae9cb05a43299b91e322b2f22344c5d272b5bd6c501fcbd64927d263f8595', N'Temperature & Humidity Chamber', N'溫濕度試驗箱'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'f70ae9cb05a43299b91e322b2f22344c5d272b5bd6c501fcbd64927d263f8595');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'd867e4f60805f19457fb207f490d1671391c55c669707286031b01ffddccc72f', N'High/low temperature simulation to catch issues from environmental fluctuation before shipment.', N'模擬高低溫環境，並預防因溫度變化可能造成的品質異變。'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'd867e4f60805f19457fb207f490d1671391c55c669707286031b01ffddccc72f');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '310c3db23d711d53e96e8c54da994f7bf90529bf5886c1ffffe741c75a935995', N'Ink Rub Tester', N'油墨磨擦測試儀'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '310c3db23d711d53e96e8c54da994f7bf90529bf5886c1ffffe741c75a935995');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '5713fdccb189b45dc95ae36afee59db001f967664cead8a542e3c453fa15f426', N'Confirms abrasion resistance of printed surfaces to customer requirements.', N'用於客戶要求耐磨測試時，確保印刷品符合客戶要求。'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '5713fdccb189b45dc95ae36afee59db001f967664cead8a542e3c453fa15f426');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'c4bf5556dd8e7f8b1d329ab0fa0bac988f9b6f79261713c34648b60dc275af9d', N'Blister Pack Strength Testing', N'泡殼強度測試機'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'c4bf5556dd8e7f8b1d329ab0fa0bac988f9b6f79261713c34648b60dc275af9d');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '7ba6766687807c2ffbd50ecb04688ee2b0df11029df305f0af2b39b02f4ed13e', N'Tests gluing strength for vacuum blister packaging components.', N'測試真空泡殼黏合部位的強度。'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '7ba6766687807c2ffbd50ecb04688ee2b0df11029df305f0af2b39b02f4ed13e');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '2be62155c028706ca7813b5252610d99dd373604f785c11c7353c55480d86f2a', N'Our goal: every print that leaves NTI meets international standards — and your expectations.', N'我們的目標：每一張離開南台彩藝的印刷品，都符合國際標準——以及您的期待。'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '2be62155c028706ca7813b5252610d99dd373604f785c11c7353c55480d86f2a');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '0e4d22494a3f55f63c7aca0b21a315a06dbe6f64d3cf44d33f3abce6f6362dd0', N'See Sustainability in Action', N'見證永續，身臨其境'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '0e4d22494a3f55f63c7aca0b21a315a06dbe6f64d3cf44d33f3abce6f6362dd0');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'dd6432efca3b193380656659bacc9d01d746cdc1debdc5514d22903dc2b98463', N'NTI’s factory is built around environmental care and employee well-being. Our modern, fully air-conditioned office and production facility has been designed to provide a safe, clean and inspiring workplace for every member of our team.', N'南台彩藝的廠房以環境關懷與員工福祉為核心打造。我們現代化、全空調的辦公與生產設施，致力為團隊每一位成員提供安全、潔淨且充滿啟發的工作環境。'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'dd6432efca3b193380656659bacc9d01d746cdc1debdc5514d22903dc2b98463');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'd2877f67493ac1df0da2857f8a9220f40fe5caa7c92c8311bd93a05e5612cdee', N'Visitors can explore our clean water treatment system, energy-efficient production lines, and green facilities designed for both people and the planet.', N'參訪者可實地了解我們的清水處理系統、節能生產線，以及兼顧人與環境的綠色設施。'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'd2877f67493ac1df0da2857f8a9220f40fe5caa7c92c8311bd93a05e5612cdee');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '40b8fa8cd64bac56bd3d6023ddcc475ac909bac42fbe9664e9c84a344d5c3934', N'Book a guided tour and experience how we bring ‘The Courage to Print Green’ to life.', N'預約印刷廠參觀行程，親身體驗我們如何將「勇於綠色印刷」落實於行動。'
FROM dbo.Page p
WHERE p.PageKey = N'facility'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '40b8fa8cd64bac56bd3d6023ddcc475ac909bac42fbe9664e9c84a344d5c3934');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '6c97b2d956740ce96c1b0b4e4dea5050e1110d57ee271e51482ed515f384ee0c', N'Prepress Equipment', N'印前設備'
FROM dbo.Page p
WHERE p.PageKey = N'facility-pre-press'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '6c97b2d956740ce96c1b0b4e4dea5050e1110d57ee271e51482ed515f384ee0c');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '80e6ea1fef589e23c24d37dfc7efce508441414fd171bb3c9c8e02034f1bdd38', N'Environmentally Friendly Printing', N'環保印刷流程'
FROM dbo.Page p
WHERE p.PageKey = N'facility-pre-press'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '80e6ea1fef589e23c24d37dfc7efce508441414fd171bb3c9c8e02034f1bdd38');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'b5f25cdae9bad68ddd28b2308f7397582958375f74d1f7c0715b9f928a9a32a4', N'NTI Printing utilizes the world’s most advanced prepress output software, integrated with a CTP (Computer-to-Plate) direct plate-making system. Coupled with a precise plate production control process, this ensures that the printing dots are accurately rendered, achieving faithful color reproduction in the final print.', N'南台彩藝採用全球最先進的數位印前輸出軟體，結合CTP（電腦直接製版）系統。搭配精準的製版流程控管，確保網點精確呈現，達成最終印刷成品忠實的色彩重現。'
FROM dbo.Page p
WHERE p.PageKey = N'facility-pre-press'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'b5f25cdae9bad68ddd28b2308f7397582958375f74d1f7c0715b9f928a9a32a4');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'af759193f865aff8f5537a9d903a6ce24467bc4ff22afcfdfb915e9be6bbd13a', N'In-house CTP system for faster turnaround and reduced transport.', N'內部CTP系統，縮短交期並降低運輸成本。'
FROM dbo.Page p
WHERE p.PageKey = N'facility-pre-press'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'af759193f865aff8f5537a9d903a6ce24467bc4ff22afcfdfb915e9be6bbd13a');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'd4d6e0944b2d78bebc8add4466793d336da592407b9db2c787d33880a8ac4c65', N'Daily and weekly dot calibration for color precision.', N'每日與每週網點校正，確保色彩精準。'
FROM dbo.Page p
WHERE p.PageKey = N'facility-pre-press'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'd4d6e0944b2d78bebc8add4466793d336da592407b9db2c787d33880a8ac4c65');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'ce924c72832e64d6f0c1aeed1c89f12074922c25aca4c101978878d8d66ed607', N'Eco-friendly production that minimizes heavy metals and wastewater.', N'環保生產流程，最小化重金屬與廢水產生。'
FROM dbo.Page p
WHERE p.PageKey = N'facility-pre-press'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'ce924c72832e64d6f0c1aeed1c89f12074922c25aca4c101978878d8d66ed607');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '80e6ea1fef589e23c24d37dfc7efce508441414fd171bb3c9c8e02034f1bdd38', N'Environmentally Friendly Printing', N'環保印刷流程'
FROM dbo.Page p
WHERE p.PageKey = N'facility-eco-printing'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '80e6ea1fef589e23c24d37dfc7efce508441414fd171bb3c9c8e02034f1bdd38');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '6c97b2d956740ce96c1b0b4e4dea5050e1110d57ee271e51482ed515f384ee0c', N'Prepress Equipment', N'印前設備'
FROM dbo.Page p
WHERE p.PageKey = N'facility-eco-printing'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '6c97b2d956740ce96c1b0b4e4dea5050e1110d57ee271e51482ed515f384ee0c');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'f7ce4a8eedc3b3af4b7535f7647a002ec3d3c0b6bcdbfc595c49f970f36b7e08', N'Heidelberg Press varnishing in line, to shorten the lead time and keep good quality at the same time. We also introduce an environmentally friendly system into the printing procedure.', N'海德堡印刷機連線上光，在縮短交期的同時維持優異品質。我們也持續導入綠色印刷技術與環保系統，落實於印刷流程的每個環節。'
FROM dbo.Page p
WHERE p.PageKey = N'facility-eco-printing'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'f7ce4a8eedc3b3af4b7535f7647a002ec3d3c0b6bcdbfc595c49f970f36b7e08');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'ce9026239ac0ce85ebfe040e456bd537946cdc3d210e1e3f8a51eb0486c1bc10', N'Presses in Use', N'先進印刷技術應用'
FROM dbo.Page p
WHERE p.PageKey = N'facility-eco-printing'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'ce9026239ac0ce85ebfe040e456bd537946cdc3d210e1e3f8a51eb0486c1bc10');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'e697dcc5461ae1a60d5cf880a76b32d4b725d26e262024e103299b660e22bee8', N'Heidelberg Speedmaster CD 102-6+LX 6-Colour Coater Press', N'海德堡Speedmaster CD 102-6+LX六色上光機'
FROM dbo.Page p
WHERE p.PageKey = N'facility-eco-printing'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'e697dcc5461ae1a60d5cf880a76b32d4b725d26e262024e103299b660e22bee8');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'f1a773925d71cf9c0fc43ba90f9d6d1378073c8fb40ffd49c5a8bed091634df4', N'Heidelberg Speedmaster CD 102-5+LX 5-Colour Carbon Balanced Coater Press', N'海德堡Speedmaster CD 102-5+LX五色碳平衡上光機'
FROM dbo.Page p
WHERE p.PageKey = N'facility-eco-printing'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'f1a773925d71cf9c0fc43ba90f9d6d1378073c8fb40ffd49c5a8bed091634df4');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '849461a239499d6f1fb9399888e247ac0a8d51f7ed52385f82ab06759aa428a0', N'Heidelberg Speedmaster CD 102-5+LX UV 5-Colour Coater Press', N'海德堡Speedmaster CD 102-5+LX UV五色上光機'
FROM dbo.Page p
WHERE p.PageKey = N'facility-eco-printing'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '849461a239499d6f1fb9399888e247ac0a8d51f7ed52385f82ab06759aa428a0');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'c22f6c03824e5a5ae05f3fa8baf69aee6aa8e583d07753c78d4cc37fb4b717a2', N'Man Roland D-6050 Offenbach Two-Colour Offset Press', N'曼羅蘭D-6050 Offenbach雙色平版印刷機'
FROM dbo.Page p
WHERE p.PageKey = N'facility-eco-printing'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'c22f6c03824e5a5ae05f3fa8baf69aee6aa8e583d07753c78d4cc37fb4b717a2');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '1d7e303e801a37a8cd8da8b795dc5d872866a810df71819c263d02b5565ba407', N'Heidelberg Image Control System', N'海德堡Image Control影像控制系統'
FROM dbo.Page p
WHERE p.PageKey = N'facility-eco-printing'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '1d7e303e801a37a8cd8da8b795dc5d872866a810df71819c263d02b5565ba407');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'e47c572369e824f6b60df18855b5040b77ba59bc95ca19d5ac2cad2943a8a402', N'Heidelberg Axis Control Colour Management System', N'海德堡Axis Control色彩管理系統'
FROM dbo.Page p
WHERE p.PageKey = N'facility-eco-printing'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'e47c572369e824f6b60df18855b5040b77ba59bc95ca19d5ac2cad2943a8a402');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '2c1e5b00b851db47955395d9eddae4b0eb2281ee2bc54e502bf73e2267fd147f', N'Axis Control System', N'海德堡Axis Control系統'
FROM dbo.Page p
WHERE p.PageKey = N'facility-eco-printing'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '2c1e5b00b851db47955395d9eddae4b0eb2281ee2bc54e502bf73e2267fd147f');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'a8e4b4483a6a96d837a2cf36dcde64ea46db0bc0452c76f783a24f9d4703d9b7', N'High-efficiency colour measurement, about 3 minutes faster per measurement cycle than comparable systems.', N'高效色彩量測系統。可辨識印刷導表，量測效率比其他量測設備快約3分鐘。'
FROM dbo.Page p
WHERE p.PageKey = N'facility-eco-printing'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'a8e4b4483a6a96d837a2cf36dcde64ea46db0bc0452c76f783a24f9d4703d9b7');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'b4cc5fa8a8034107272de9cca07e55d4b3df7650bcdda832e13df31ea85c4931', N'Image Control System', N'海德堡Image Control系統'
FROM dbo.Page p
WHERE p.PageKey = N'facility-eco-printing'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'b4cc5fa8a8034107272de9cca07e55d4b3df7650bcdda832e13df31ea85c4931');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '944033a3a6608cdbac7ac4dc70d4bb39fbdea77be15d61fbd24161c63ccf96e6', N'Spectrophotometer-based in-line monitoring with automatic adjustment — reduces colour variance and generates reference values for repeat jobs.', N'先進的光譜儀與控制系統，監控印刷流程。不僅能辨識印刷導表，更能辨識整張印刷影像並自動調整。Image Control可降低色差，印刷人員能將色值作為下一次生產的參考依據。'
FROM dbo.Page p
WHERE p.PageKey = N'facility-eco-printing'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '944033a3a6608cdbac7ac4dc70d4bb39fbdea77be15d61fbd24161c63ccf96e6');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '6c97b2d956740ce96c1b0b4e4dea5050e1110d57ee271e51482ed515f384ee0c', N'Prepress Equipment', N'印前設備'
FROM dbo.Page p
WHERE p.PageKey = N'facility-post-press'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '6c97b2d956740ce96c1b0b4e4dea5050e1110d57ee271e51482ed515f384ee0c');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '80e6ea1fef589e23c24d37dfc7efce508441414fd171bb3c9c8e02034f1bdd38', N'Environmentally Friendly Printing', N'環保印刷流程'
FROM dbo.Page p
WHERE p.PageKey = N'facility-post-press'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '80e6ea1fef589e23c24d37dfc7efce508441414fd171bb3c9c8e02034f1bdd38');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'c4499499ce4589918bf31a12e3fdd76a60a11c21fdbb25ec3901bc6e6be87714', N'NTI Printing uses the most advanced die-cutting machines, automated gluing machines, and heat shrink film equipment to achieve high-efficiency production and deliver high-quality packaging products.', N'南台彩藝使用最先進的模切機、自動糊盒機與熱縮膠膜設備，達成高效率生產並交付高品質的包裝加工技術。'
FROM dbo.Page p
WHERE p.PageKey = N'facility-post-press'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'c4499499ce4589918bf31a12e3fdd76a60a11c21fdbb25ec3901bc6e6be87714');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '5d19972b1689c42752a15c94eae20a7cb3b753abd0082a7a0177428e46629cd5', N'Automated die-cutting, gluing, window patching, and lamination systems.', N'自動模切、糊盒、開窗貼膜與貼合系統。'
FROM dbo.Page p
WHERE p.PageKey = N'facility-post-press'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '5d19972b1689c42752a15c94eae20a7cb3b753abd0082a7a0177428e46629cd5');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '595d4235a4d95d7b47a0025d93682972c1d883199e9212c5d772d38b4b740901', N'BOPP film coating eliminates solvent use and meets EU and US eco standards.', N'BOPP膠膜塗層取代溶劑使用，符合歐美環保標準。'
FROM dbo.Page p
WHERE p.PageKey = N'facility-post-press'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '595d4235a4d95d7b47a0025d93682972c1d883199e9212c5d772d38b4b740901');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '55ddb6ab4c27597d5955a3014f722d1c5f761ca413f5404198dd3a003426d4e4', N'High-speed shrink wrapping and labeling for efficient, secure finishing.', N'高速收縮包膜與貼標，達成高效且穩固的成品加工。'
FROM dbo.Page p
WHERE p.PageKey = N'facility-post-press'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '55ddb6ab4c27597d5955a3014f722d1c5f761ca413f5404198dd3a003426d4e4');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '6b54bdc2c1c0381d43e1d4636979b93a54c0e59cab04d2f06e396367af84269b', N'Heidelberg Varimatrix 105 Die-Cutter', N'海德堡Varimatrix 105自動平台模切機'
FROM dbo.Page p
WHERE p.PageKey = N'facility-post-press'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '6b54bdc2c1c0381d43e1d4636979b93a54c0e59cab04d2f06e396367af84269b');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '95d700e8d2b774bd3af39c0b8cdad2b6a566e3622c223495ca0f5dc0af443944', N'High-performance automatic flat-bed die-cutting with non-stop feeder, German CITO creasing matrix, precise alignment, and clean waste stripping for straight, sturdy creases.', N'精準對位，乾淨準確地清除廢料，確保無誤差且整潔的收紙機制；採用德國CITO壓痕模，確保完美壓痕品質，讓紙盒更易摺疊與黏合，壓痕線更平整；不停機送紙裝置，提升連續作業效率，無須中斷生產。'
FROM dbo.Page p
WHERE p.PageKey = N'facility-post-press'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '95d700e8d2b774bd3af39c0b8cdad2b6a566e3622c223495ca0f5dc0af443944');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '7068977352822df3bc6ee1e6bbdc0782b5f9a57fe896bf34c41f2973260bbee7', N'SBL High-Speed Automatic Die-Cutter', N'SBL高速自動平台模切機'
FROM dbo.Page p
WHERE p.PageKey = N'facility-post-press'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '7068977352822df3bc6ee1e6bbdc0782b5f9a57fe896bf34c41f2973260bbee7');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '4788d75dc3c8614ccfa9723db1e33ea4d73dd3d536ee8e38c9f47c1efd22af3e', N'Non-stop operation across paper sizes from 400 × 370 mm to 1050 × 750 mm, up to 7,500 sheets per hour.', N'精準定位，適用不同紙張厚度，配備不停機裝置以維持連續生產。印刷紙張尺寸範圍400×370mm至1050×750mm，最高模切速度每小時7,500張。'
FROM dbo.Page p
WHERE p.PageKey = N'facility-post-press'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '4788d75dc3c8614ccfa9723db1e33ea4d73dd3d536ee8e38c9f47c1efd22af3e');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '287cfb869998b653f650b988c0ddce10d671ef339dd49c6c5ecb385a4124f9f8', N'High-Speed Intelligent Laminating Machine', N'高速自動貼合機'
FROM dbo.Page p
WHERE p.PageKey = N'facility-post-press'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '287cfb869998b653f650b988c0ddce10d671ef339dd49c6c5ecb385a4124f9f8');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '35da433db2a1c963cebed915348368dadffc875e07bc483bb00f19889c59c808', N'BOPP pre-coated film instead of traditional wet lamination — solvent-free, no drying, meeting European and American environmental standards.', N'採用BOPP預塗膜取代傳統貼合方式——無需使用溶劑，也無需烘乾，符合歐美環保標準。'
FROM dbo.Page p
WHERE p.PageKey = N'facility-post-press'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '35da433db2a1c963cebed915348368dadffc875e07bc483bb00f19889c59c808');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '8d1e6ea816cd74b117f12c7a349c6626b9412b60093b77d7fab225f98a467748', N'Digital Window Patching Machine', N'高精度數位開窗貼膜機'
FROM dbo.Page p
WHERE p.PageKey = N'facility-post-press'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '8d1e6ea816cd74b117f12c7a349c6626b9412b60093b77d7fab225f98a467748');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '1f9c9399c570bdb612b105fea85ee25800e5e3ee32cd056416d25665af8fffbd', N'Servo-controlled alignment, creasing, corner cutting, and splitting in a single pass.', N'採用數位系統，不同於傳統機械式開窗貼膜機，伺服馬達控制確保更精準的開窗貼膜——一次作業即可完成對位、壓痕、切角與分割。'
FROM dbo.Page p
WHERE p.PageKey = N'facility-post-press'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '1f9c9399c570bdb612b105fea85ee25800e5e3ee32cd056416d25665af8fffbd');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '46f29e62be152e8545ef735360c2ccd64aacc37b0fbb15b3ab6c3b8870c8313a', N'High-Speed Universal Folder-Gluer', N'高效能自動糊盒機'
FROM dbo.Page p
WHERE p.PageKey = N'facility-post-press'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '46f29e62be152e8545ef735360c2ccd64aacc37b0fbb15b3ab6c3b8870c8313a');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '007d75d3e4233d0823c88f4cff4d786ef44e19c70e50a347506bf784e845257e', N'Up to 200 metres per minute with optional cold or hot glue systems and plasma surface treatment for strong adhesion.', N'最高速度每分鐘200公尺，實現高速、經濟的生產。可依紙盒類型搭配自動冷膠或熱膠系統，並具備電漿表面處理，確保黏合牢固。'
FROM dbo.Page p
WHERE p.PageKey = N'facility-post-press'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '007d75d3e4233d0823c88f4cff4d786ef44e19c70e50a347506bf784e845257e');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '2e04181cfdc00e22ed3ecbcc798e002dbac670497e41918d4a12f5637f5b287e', N'Automatic Heat Shrink Wrap Machine', N'自動收縮包膜系統'
FROM dbo.Page p
WHERE p.PageKey = N'facility-post-press'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '2e04181cfdc00e22ed3ecbcc798e002dbac670497e41918d4a12f5637f5b287e');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '8163341ec5c9e47af131cb7abaa56a95ef76c8417ee59483114729d1047bf1d7', N'Complete wrapping protects finished goods from dust, moisture, and handling damage — no rope-bundling marks.', N'完整包膜可保護產品在儲存期間免受灰塵污染與濕氣損害，確保產品在客戶搬運過程中不因鬆散捆綁而散開或損壞，也防止捆綁過程中綁繩造成的產品表面損傷。'
FROM dbo.Page p
WHERE p.PageKey = N'facility-post-press'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '8163341ec5c9e47af131cb7abaa56a95ef76c8417ee59483114729d1047bf1d7');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '7fcbb7291a6fb2c6d6f90daa169d25464d070afe63f69317f5a8fe26f6685af3', N'Supporting Equipment', N'其他印後設備'
FROM dbo.Page p
WHERE p.PageKey = N'facility-post-press'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '7fcbb7291a6fb2c6d6f90daa169d25464d070afe63f69317f5a8fe26f6685af3');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'e0e360d1e66f23879fead9fda4e76dcb2f5666ee50e5f733fc513ac56ca23712', N'Automatic labeling machine, automatic box sealing machine, and two DATIEN guillotine cutters.', N'自動貼標機、自動封箱機、自動裝袋與收縮包膜系統，以及2台DATIEN高精度工業裁紙機。'
FROM dbo.Page p
WHERE p.PageKey = N'facility-post-press'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'e0e360d1e66f23879fead9fda4e76dcb2f5666ee50e5f733fc513ac56ca23712');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'a3e8e3271a989eee713f1a98d945b4104e2a3ce7524de8bf8e820b17b7d41e01', N'Quality You Can Measure', N'品質，可被量化'
FROM dbo.Page p
WHERE p.PageKey = N'facility-quality'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'a3e8e3271a989eee713f1a98d945b4104e2a3ce7524de8bf8e820b17b7d41e01');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '6c97b2d956740ce96c1b0b4e4dea5050e1110d57ee271e51482ed515f384ee0c', N'Prepress Equipment', N'印前設備'
FROM dbo.Page p
WHERE p.PageKey = N'facility-quality'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '6c97b2d956740ce96c1b0b4e4dea5050e1110d57ee271e51482ed515f384ee0c');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '80e6ea1fef589e23c24d37dfc7efce508441414fd171bb3c9c8e02034f1bdd38', N'Environmentally Friendly Printing', N'環保印刷流程'
FROM dbo.Page p
WHERE p.PageKey = N'facility-quality'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '80e6ea1fef589e23c24d37dfc7efce508441414fd171bb3c9c8e02034f1bdd38');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'a64fe161438fce45519e075e226db616fc44fdf313c75a397508a49998229a25', N'NTI conducts strict quality control throughout every production stage — from materials to finished goods. Each print is tested for accuracy, durability, and consistency using precision tools such as:', N'南台彩藝在每一個生產階段——從原料到成品——皆實施嚴格的印刷品管。每一張印刷成品都會透過精密工具進行準確度、耐久度與一致性測試，包括：'
FROM dbo.Page p
WHERE p.PageKey = N'facility-quality'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'a64fe161438fce45519e075e226db616fc44fdf313c75a397508a49998229a25');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'eb76daccf8b84c6534ec0867a78a524566063dc90755d1cbf4f256062ef76915', N'Press-side colour measurement with single-click operation — strict colour-deviation control with less manual error.', N'高靈敏度，能滿足嚴格的色差標準，並可依使用者需求個別設定。一鍵操作即可提升產能並降低人為誤差——在提升色彩品質的同時節省時間並減少紙材浪費。'
FROM dbo.Page p
WHERE p.PageKey = N'facility-quality'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'eb76daccf8b84c6534ec0867a78a524566063dc90755d1cbf4f256062ef76915');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'eee6458901f23efe3bdbacefbf6f69e385eaceb392bac09b887e14dbae6b7f92', N'Measures plate dot area percentage to verify and adjust dot specifications.', N'量測網點面積百分比，並分析數據以調整網點區域。'
FROM dbo.Page p
WHERE p.PageKey = N'facility-quality'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'eee6458901f23efe3bdbacefbf6f69e385eaceb392bac09b887e14dbae6b7f92');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '8284b7651d662d8315cf9db733d587c195d3540ce83ae409278a8057b3fc1c43', N'Barcode Grade Scanner', N'條碼等級掃描儀'
FROM dbo.Page p
WHERE p.PageKey = N'facility-quality'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '8284b7651d662d8315cf9db733d587c195d3540ce83ae409278a8057b3fc1c43');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '67ba1486cedc01e40dfea2327f32a35e3c2bed03e7180622cc6cd0100ca196df', N'Verifies every printed barcode meets grade compliance.', N'所有印製於商品上的條碼皆經過檢測以確認條碼等級。'
FROM dbo.Page p
WHERE p.PageKey = N'facility-quality'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '67ba1486cedc01e40dfea2327f32a35e3c2bed03e7180622cc6cd0100ca196df');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'f70ae9cb05a43299b91e322b2f22344c5d272b5bd6c501fcbd64927d263f8595', N'Temperature & Humidity Chamber', N'溫濕度試驗箱'
FROM dbo.Page p
WHERE p.PageKey = N'facility-quality'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'f70ae9cb05a43299b91e322b2f22344c5d272b5bd6c501fcbd64927d263f8595');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'd867e4f60805f19457fb207f490d1671391c55c669707286031b01ffddccc72f', N'High/low temperature simulation to catch issues from environmental fluctuation before shipment.', N'模擬高低溫環境，並預防因溫度變化可能造成的品質異變。'
FROM dbo.Page p
WHERE p.PageKey = N'facility-quality'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'd867e4f60805f19457fb207f490d1671391c55c669707286031b01ffddccc72f');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '310c3db23d711d53e96e8c54da994f7bf90529bf5886c1ffffe741c75a935995', N'Ink Rub Tester', N'油墨磨擦測試儀'
FROM dbo.Page p
WHERE p.PageKey = N'facility-quality'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '310c3db23d711d53e96e8c54da994f7bf90529bf5886c1ffffe741c75a935995');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '5713fdccb189b45dc95ae36afee59db001f967664cead8a542e3c453fa15f426', N'Confirms abrasion resistance of printed surfaces to customer requirements.', N'用於客戶要求耐磨測試時，確保印刷品符合客戶要求。'
FROM dbo.Page p
WHERE p.PageKey = N'facility-quality'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '5713fdccb189b45dc95ae36afee59db001f967664cead8a542e3c453fa15f426');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'c4bf5556dd8e7f8b1d329ab0fa0bac988f9b6f79261713c34648b60dc275af9d', N'Blister Pack Strength Testing', N'泡殼強度測試機'
FROM dbo.Page p
WHERE p.PageKey = N'facility-quality'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'c4bf5556dd8e7f8b1d329ab0fa0bac988f9b6f79261713c34648b60dc275af9d');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '7ba6766687807c2ffbd50ecb04688ee2b0df11029df305f0af2b39b02f4ed13e', N'Tests gluing strength for vacuum blister packaging components.', N'測試真空泡殼黏合部位的強度。'
FROM dbo.Page p
WHERE p.PageKey = N'facility-quality'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '7ba6766687807c2ffbd50ecb04688ee2b0df11029df305f0af2b39b02f4ed13e');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'f8865111aaefb2bb9feb76e30bf1d96eda19d9b4a012969fed0f19d09fead719', N'Measurement & Test Equipment', N'檢測設備'
FROM dbo.Page p
WHERE p.PageKey = N'facility-quality'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'f8865111aaefb2bb9feb76e30bf1d96eda19d9b4a012969fed0f19d09fead719');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '6c97b2d956740ce96c1b0b4e4dea5050e1110d57ee271e51482ed515f384ee0c', N'Prepress Equipment', N'印前設備'
FROM dbo.Page p
WHERE p.PageKey = N'facility-tour'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '6c97b2d956740ce96c1b0b4e4dea5050e1110d57ee271e51482ed515f384ee0c');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '80e6ea1fef589e23c24d37dfc7efce508441414fd171bb3c9c8e02034f1bdd38', N'Environmentally Friendly Printing', N'環保印刷流程'
FROM dbo.Page p
WHERE p.PageKey = N'facility-tour'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '80e6ea1fef589e23c24d37dfc7efce508441414fd171bb3c9c8e02034f1bdd38');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'bb7634ceedc9db1a8b7430706c3cddd5970f7aad724b490d2d6cebb5de087fee', N'At NTI Printing, ESG begins with people. Our state-of-the-art, fully air-conditioned facility is designed to provide a safe, comfortable, and inspiring workplace for every member of our team. From modern offices and efficient production floors to staff restaurants, library, dormitories, and shared spaces, we continually invest in the wellbeing of both our local and international employees. By creating an environment where people can thrive, we build a stronger culture, deliver better quality, and support a more sustainable future as a trusted sustainable packaging manufacturer in Taiwan.', N'在南台彩藝，ESG從「人」開始。我們先進、全空調的廠區，致力於為團隊每一位成員打造安全、舒適且充滿啟發的工作環境。從現代化辦公空間、高效生產樓層，到員工餐廳、圖書館、宿舍與共享空間，我們持續投資於本地與國際員工的福祉。透過打造一個讓人才能夠成長的環境，我們建立更堅實的企業文化、交付更好的品質，並作為台灣值得信賴的永續包裝製造商，支持更永續的未來。'
FROM dbo.Page p
WHERE p.PageKey = N'facility-tour'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'bb7634ceedc9db1a8b7430706c3cddd5970f7aad724b490d2d6cebb5de087fee');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '03508157810bd48f7dee06790a7a75bc2b5f9f494df2c396d19dc7cdc102fd35', N'NTI provides complete custom packaging boxes and packaging printing solutions, from material recommendation and selection to structural design, printing techniques, finishing, and technical support. We help brands create custom boxes and packaging that perform beautifully, strengthen their brand, and support a more sustainable future.', N'南台彩藝提供從材料建議與選擇、結構設計、印刷技術、後加工到技術支援的完整客製化包裝盒與包裝印刷解決方案。我們協助品牌打造外觀出色、強化品牌形象，並支持更永續未來的客製化紙盒與包裝。'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '03508157810bd48f7dee06790a7a75bc2b5f9f494df2c396d19dc7cdc102fd35');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '7d44c4337d66d7e718cfc69cedabebdca4e754cbc13b09dc4dba0abe51bb041b', N'Optimized packaging that reduces material use and waste.', N'優化包裝以減少材料使用與浪費。'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '7d44c4337d66d7e718cfc69cedabebdca4e754cbc13b09dc4dba0abe51bb041b');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '1dbca9d57288fd29567a1a32756111577cadf0050429a1b5ae118d7ffa17c183', N'Pre-Press', N'印前'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '1dbca9d57288fd29567a1a32756111577cadf0050429a1b5ae118d7ffa17c183');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'bc9417fca7de68b6fbccf85eb740dfebe7184b6ca80a4621a29ce1cd71794053', N'Digital CTP technology improves quality while reducing pollution.', N'數位CTP技術在提升品質的同時降低污染。'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'bc9417fca7de68b6fbccf85eb740dfebe7184b6ca80a4621a29ce1cd71794053');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '12b6f490d7a43b8aba1337dedbe35bb2f08bcdf50cfd9108f9340a8595983b76', N'Energy-efficient production with lower waste and emissions.', N'節能生產，降低廢棄物與排放。'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '12b6f490d7a43b8aba1337dedbe35bb2f08bcdf50cfd9108f9340a8595983b76');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'ea8cb7b847b8512d974c626acd91f7e8fc9f9648f383c9ebb5abf25ae817e67f', N'Food | Electronics | Beauty | Medical | Luxury | Consumer Goods', N'食品｜電子｜美妝｜醫療｜精品｜消費性商品'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'ea8cb7b847b8512d974c626acd91f7e8fc9f9648f383c9ebb5abf25ae817e67f');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '04e2a9728af7584043c5d58ae29e7cd811883e8dab15fc6287675270669a3ada', N'Projects', N'專案案例'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '04e2a9728af7584043c5d58ae29e7cd811883e8dab15fc6287675270669a3ada');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '6a3bbf2d5585323e3dd35412989fdb8998c531bae9dc5ca343ef21ac543157c1', N'Real Projects. Real Impact.', N'真實專案，真實成果。'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '6a3bbf2d5585323e3dd35412989fdb8998c531bae9dc5ca343ef21ac543157c1');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '3f62f9d09c84bec000044cc3c493abf08d21d5e31461b44cd36dfb52655fef1c', N'From packaging to promotional materials, NTI collaborates with brands across industries to deliver sustainable, high-quality results — explore our custom box portfolio and packaging case study highlights below. Each project reflects our commitment to innovation, precision, and environmental responsibility.', N'從包裝到促銷材料，南台彩藝與各產業品牌合作，交付永續且高品質的成果——探索我們的印刷案例與包裝設計案例精選，見證每個專案背後的創新、精準與環境責任。'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '3f62f9d09c84bec000044cc3c493abf08d21d5e31461b44cd36dfb52655fef1c');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '7c4283972e8eea3585d9a6148c84e620983b92005fe3ea9b9b919ae74e4cf3e8', N'Industries / Applications', N'我們服務的產業'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '7c4283972e8eea3585d9a6148c84e620983b92005fe3ea9b9b919ae74e4cf3e8');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '7ae9c23d6592818270a3e5210b194d5d7f22ff2f23da777779041ebc1ab5a3cc', N'Electronics', N'電子產品'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '7ae9c23d6592818270a3e5210b194d5d7f22ff2f23da777779041ebc1ab5a3cc');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'ebcbb1b61af6edbe8ebc340c99ee7b3b575929a228e820a3bb7cd96af5b95509', N'Beauty & Skincare', N'美妝與保養品'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'ebcbb1b61af6edbe8ebc340c99ee7b3b575929a228e820a3bb7cd96af5b95509');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'adb4e80ab6007562a5124990600d75b7d29e3b4d60f1f0316cb0f5513a9cbaa9', N'Medical & Healthcare', N'醫療與健康照護'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'adb4e80ab6007562a5124990600d75b7d29e3b4d60f1f0316cb0f5513a9cbaa9');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '2d1a27702c5318c32977394054d514de229059e73013262604d2e5331d2c76b8', N'Luxury & Gift Packaging', N'精品與禮品包裝'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '2d1a27702c5318c32977394054d514de229059e73013262604d2e5331d2c76b8');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'c33ceffafc4244b8f775209654048ed3b97da2840ec083df31ecfb58cfa78024', N'Home & Lifestyle', N'居家與生活風格'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'c33ceffafc4244b8f775209654048ed3b97da2840ec083df31ecfb58cfa78024');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'e541527beebe92b6a152f3d11db063fe53acce2a4ed63db9d96a05dbf19c4161', N'Industrial & Consumer Goods', N'工業與消費性商品'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'e541527beebe92b6a152f3d11db063fe53acce2a4ed63db9d96a05dbf19c4161');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '3a6ab91faf26c778ab818b00ddb1aec65f620b86a58e2c5ddb662d4d8c238867', N'Explore how global brands trust NTI to print greener — without compromise.', N'探索全球品牌如何信賴南台彩藝——印得更綠，毫不妥協。'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '3a6ab91faf26c778ab818b00ddb1aec65f620b86a58e2c5ddb662d4d8c238867');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'bf783e032180ec23dfc3d0393b17394e67b12ccc9d764c45e4908c84cc67e001', N'Where Technology Meets Sustainability', N'科技與永續的交會點'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'bf783e032180ec23dfc3d0393b17394e67b12ccc9d764c45e4908c84cc67e001');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'a80e03b390be8f8f07ead3549d69510eb7e44907b2335b7e15f5e0d02952cfa3', N'NTI Printing integrates advanced pre-press, printing, and post-press systems inside our G7 certified printing plant — a printing factory in Taiwan designed for precision, efficiency and sustainability. We use Heidelberg and Man Roland presses with in-line varnishing and carbon-balanced systems, reducing energy use and emissions.', N'南台彩藝在通過G7認證的印刷廠內，整合先進的數位印前、印刷與印後系統——這是一座專為精準、效率與永續設計的台灣印刷廠。我們使用海德堡與曼羅蘭印刷機，搭配連線上光與碳平衡系統，降低能源使用與排放。'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'a80e03b390be8f8f07ead3549d69510eb7e44907b2335b7e15f5e0d02952cfa3');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '6c97b2d956740ce96c1b0b4e4dea5050e1110d57ee271e51482ed515f384ee0c', N'Prepress Equipment', N'印前設備'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '6c97b2d956740ce96c1b0b4e4dea5050e1110d57ee271e51482ed515f384ee0c');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'b5f25cdae9bad68ddd28b2308f7397582958375f74d1f7c0715b9f928a9a32a4', N'NTI Printing utilizes the world’s most advanced prepress output software, integrated with a CTP (Computer-to-Plate) direct plate-making system. Coupled with a precise plate production control process, this ensures that the printing dots are accurately rendered, achieving faithful color reproduction in the final print.', N'南台彩藝採用全球最先進的數位印前輸出軟體，結合CTP（電腦直接製版）系統。搭配精準的製版流程控管，確保網點精確呈現，達成最終印刷成品忠實的色彩重現。'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'b5f25cdae9bad68ddd28b2308f7397582958375f74d1f7c0715b9f928a9a32a4');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'af759193f865aff8f5537a9d903a6ce24467bc4ff22afcfdfb915e9be6bbd13a', N'In-house CTP system for faster turnaround and reduced transport.', N'內部CTP系統，縮短交期並降低運輸成本。'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'af759193f865aff8f5537a9d903a6ce24467bc4ff22afcfdfb915e9be6bbd13a');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'd4d6e0944b2d78bebc8add4466793d336da592407b9db2c787d33880a8ac4c65', N'Daily and weekly dot calibration for color precision.', N'每日與每週網點校正，確保色彩精準。'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'd4d6e0944b2d78bebc8add4466793d336da592407b9db2c787d33880a8ac4c65');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'ce924c72832e64d6f0c1aeed1c89f12074922c25aca4c101978878d8d66ed607', N'Eco-friendly production that minimizes heavy metals and wastewater.', N'環保生產流程，最小化重金屬與廢水產生。'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'ce924c72832e64d6f0c1aeed1c89f12074922c25aca4c101978878d8d66ed607');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '80e6ea1fef589e23c24d37dfc7efce508441414fd171bb3c9c8e02034f1bdd38', N'Environmentally Friendly Printing', N'環保印刷流程'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '80e6ea1fef589e23c24d37dfc7efce508441414fd171bb3c9c8e02034f1bdd38');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'f7ce4a8eedc3b3af4b7535f7647a002ec3d3c0b6bcdbfc595c49f970f36b7e08', N'Heidelberg Press varnishing in line, to shorten the lead time and keep good quality at the same time. We also introduce an environmentally friendly system into the printing procedure.', N'海德堡印刷機連線上光，在縮短交期的同時維持優異品質。我們也持續導入綠色印刷技術與環保系統，落實於印刷流程的每個環節。'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'f7ce4a8eedc3b3af4b7535f7647a002ec3d3c0b6bcdbfc595c49f970f36b7e08');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'e697dcc5461ae1a60d5cf880a76b32d4b725d26e262024e103299b660e22bee8', N'Heidelberg Speedmaster CD 102-6+LX 6-Colour Coater Press', N'海德堡Speedmaster CD 102-6+LX六色上光機'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'e697dcc5461ae1a60d5cf880a76b32d4b725d26e262024e103299b660e22bee8');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'f1a773925d71cf9c0fc43ba90f9d6d1378073c8fb40ffd49c5a8bed091634df4', N'Heidelberg Speedmaster CD 102-5+LX 5-Colour Carbon Balanced Coater Press', N'海德堡Speedmaster CD 102-5+LX五色碳平衡上光機'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'f1a773925d71cf9c0fc43ba90f9d6d1378073c8fb40ffd49c5a8bed091634df4');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '849461a239499d6f1fb9399888e247ac0a8d51f7ed52385f82ab06759aa428a0', N'Heidelberg Speedmaster CD 102-5+LX UV 5-Colour Coater Press', N'海德堡Speedmaster CD 102-5+LX UV五色上光機'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '849461a239499d6f1fb9399888e247ac0a8d51f7ed52385f82ab06759aa428a0');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'c22f6c03824e5a5ae05f3fa8baf69aee6aa8e583d07753c78d4cc37fb4b717a2', N'Man Roland D-6050 Offenbach Two-Colour Offset Press', N'曼羅蘭D-6050 Offenbach雙色平版印刷機'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'c22f6c03824e5a5ae05f3fa8baf69aee6aa8e583d07753c78d4cc37fb4b717a2');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '1d7e303e801a37a8cd8da8b795dc5d872866a810df71819c263d02b5565ba407', N'Heidelberg Image Control System', N'海德堡Image Control影像控制系統'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '1d7e303e801a37a8cd8da8b795dc5d872866a810df71819c263d02b5565ba407');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'e47c572369e824f6b60df18855b5040b77ba59bc95ca19d5ac2cad2943a8a402', N'Heidelberg Axis Control Colour Management System', N'海德堡Axis Control色彩管理系統'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'e47c572369e824f6b60df18855b5040b77ba59bc95ca19d5ac2cad2943a8a402');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'c4499499ce4589918bf31a12e3fdd76a60a11c21fdbb25ec3901bc6e6be87714', N'NTI Printing uses the most advanced die-cutting machines, automated gluing machines, and heat shrink film equipment to achieve high-efficiency production and deliver high-quality packaging products.', N'南台彩藝使用最先進的模切機、自動糊盒機與熱縮膠膜設備，達成高效率生產並交付高品質的包裝加工技術。'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'c4499499ce4589918bf31a12e3fdd76a60a11c21fdbb25ec3901bc6e6be87714');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '5d19972b1689c42752a15c94eae20a7cb3b753abd0082a7a0177428e46629cd5', N'Automated die-cutting, gluing, window patching, and lamination systems.', N'自動模切、糊盒、開窗貼膜與貼合系統。'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '5d19972b1689c42752a15c94eae20a7cb3b753abd0082a7a0177428e46629cd5');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '595d4235a4d95d7b47a0025d93682972c1d883199e9212c5d772d38b4b740901', N'BOPP film coating eliminates solvent use and meets EU and US eco standards.', N'BOPP膠膜塗層取代溶劑使用，符合歐美環保標準。'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '595d4235a4d95d7b47a0025d93682972c1d883199e9212c5d772d38b4b740901');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '55ddb6ab4c27597d5955a3014f722d1c5f761ca413f5404198dd3a003426d4e4', N'High-speed shrink wrapping and labeling for efficient, secure finishing.', N'高速收縮包膜與貼標，達成高效且穩固的成品加工。'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '55ddb6ab4c27597d5955a3014f722d1c5f761ca413f5404198dd3a003426d4e4');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'a3e8e3271a989eee713f1a98d945b4104e2a3ce7524de8bf8e820b17b7d41e01', N'Quality You Can Measure', N'品質，可被量化'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'a3e8e3271a989eee713f1a98d945b4104e2a3ce7524de8bf8e820b17b7d41e01');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'a64fe161438fce45519e075e226db616fc44fdf313c75a397508a49998229a25', N'NTI conducts strict quality control throughout every production stage — from materials to finished goods. Each print is tested for accuracy, durability, and consistency using precision tools such as:', N'南台彩藝在每一個生產階段——從原料到成品——皆實施嚴格的印刷品管。每一張印刷成品都會透過精密工具進行準確度、耐久度與一致性測試，包括：'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'a64fe161438fce45519e075e226db616fc44fdf313c75a397508a49998229a25');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '0dffadbed04ca6a6dbf46cb705196ee9ed45319d4ca1f2811c0c287284d15016', N'X-Rite i1iO & eXact spectrophotometers — spectrum colour control testing apparatus.', N'X-Rite i1iO與Exact光譜儀——光譜色彩控制檢測儀器。'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '0dffadbed04ca6a6dbf46cb705196ee9ed45319d4ca1f2811c0c287284d15016');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '17003d17caee93c4133f82ebad870ceae1814013dce303ae9ea47a132e04ae9c', N'IC Plate II plate checker — measures percentage dot area and analyzes the data to adjust dot areas.', N'IC Plate II版材檢測儀——量測網點面積百分比，並分析數據以調整網點區域。'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '17003d17caee93c4133f82ebad870ceae1814013dce303ae9ea47a132e04ae9c');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '1bd60a7908bf9ed6792ed253b3105bf5c7020ae45736b33472b3cd9f7d9957a3', N'Barcode grade scanner — all barcodes printed on goods are tested to check barcode grade.', N'條碼等級掃描儀——所有印製於商品上的條碼皆經過檢測以確認條碼等級。'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '1bd60a7908bf9ed6792ed253b3105bf5c7020ae45736b33472b3cd9f7d9957a3');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '0b17148cd8900c4b889e67611aa4c98e4f5a1177ea2d6ecd3576ead38f82b895', N'Ink rub and gloss testers — used whenever a customer requests abrasion resistance testing.', N'油墨磨擦與光澤度測試儀——用於客戶要求耐磨測試時，確保印刷品符合客戶要求。'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '0b17148cd8900c4b889e67611aa4c98e4f5a1177ea2d6ecd3576ead38f82b895');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '8fe4fb36c08e01904f5c082a0c3540048c4afc34432553df2936e7a4cb853e44', N'Temperature & humidity chambers — simulate high/low temperature conditions.', N'溫濕度試驗箱——模擬高低溫環境，並預防因溫度變化可能造成的品質異變。'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '8fe4fb36c08e01904f5c082a0c3540048c4afc34432553df2936e7a4cb853e44');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'd8dd1debbd494a7dc918d76c4c9fd9fdc47555b1a40c31a15cfc7b4c548ce348', N'Gloss-Meter — tests whether the brightness of the paper surface meets requirements.', N'光澤度計——測試紙張表面亮度是否符合要求。'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'd8dd1debbd494a7dc918d76c4c9fd9fdc47555b1a40c31a15cfc7b4c548ce348');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '53a4612e2b3f5b8bbfa17f940bb540e909afb8607fcda1c0a078726e77c83ffa', N'Blister Packing Machine — tests the strength of the gluing part of the vacuum blister.', N'泡殼強度測試機——測試真空泡殼黏合部位的強度。'
FROM dbo.Page p
WHERE p.PageKey = N'solutions'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '53a4612e2b3f5b8bbfa17f940bb540e909afb8607fcda1c0a078726e77c83ffa');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '04e2a9728af7584043c5d58ae29e7cd811883e8dab15fc6287675270669a3ada', N'Projects', N'專案案例'
FROM dbo.Page p
WHERE p.PageKey = N'projects'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '04e2a9728af7584043c5d58ae29e7cd811883e8dab15fc6287675270669a3ada');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '6a3bbf2d5585323e3dd35412989fdb8998c531bae9dc5ca343ef21ac543157c1', N'Real Projects. Real Impact.', N'真實專案，真實成果。'
FROM dbo.Page p
WHERE p.PageKey = N'projects'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '6a3bbf2d5585323e3dd35412989fdb8998c531bae9dc5ca343ef21ac543157c1');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '3f62f9d09c84bec000044cc3c493abf08d21d5e31461b44cd36dfb52655fef1c', N'From packaging to promotional materials, NTI collaborates with brands across industries to deliver sustainable, high-quality results — explore our custom box portfolio and packaging case study highlights below. Each project reflects our commitment to innovation, precision, and environmental responsibility.', N'從包裝到促銷材料，南台彩藝與各產業品牌合作，交付永續且高品質的成果——探索我們的印刷案例與包裝設計案例精選，見證每個專案背後的創新、精準與環境責任。'
FROM dbo.Page p
WHERE p.PageKey = N'projects'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '3f62f9d09c84bec000044cc3c493abf08d21d5e31461b44cd36dfb52655fef1c');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '7c4283972e8eea3585d9a6148c84e620983b92005fe3ea9b9b919ae74e4cf3e8', N'Industries / Applications', N'我們服務的產業'
FROM dbo.Page p
WHERE p.PageKey = N'projects'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '7c4283972e8eea3585d9a6148c84e620983b92005fe3ea9b9b919ae74e4cf3e8');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '7ae9c23d6592818270a3e5210b194d5d7f22ff2f23da777779041ebc1ab5a3cc', N'Electronics', N'電子產品'
FROM dbo.Page p
WHERE p.PageKey = N'projects'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '7ae9c23d6592818270a3e5210b194d5d7f22ff2f23da777779041ebc1ab5a3cc');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'ebcbb1b61af6edbe8ebc340c99ee7b3b575929a228e820a3bb7cd96af5b95509', N'Beauty & Skincare', N'美妝與保養品'
FROM dbo.Page p
WHERE p.PageKey = N'projects'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'ebcbb1b61af6edbe8ebc340c99ee7b3b575929a228e820a3bb7cd96af5b95509');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'adb4e80ab6007562a5124990600d75b7d29e3b4d60f1f0316cb0f5513a9cbaa9', N'Medical & Healthcare', N'醫療與健康照護'
FROM dbo.Page p
WHERE p.PageKey = N'projects'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'adb4e80ab6007562a5124990600d75b7d29e3b4d60f1f0316cb0f5513a9cbaa9');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '2d1a27702c5318c32977394054d514de229059e73013262604d2e5331d2c76b8', N'Luxury & Gift Packaging', N'精品與禮品包裝'
FROM dbo.Page p
WHERE p.PageKey = N'projects'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '2d1a27702c5318c32977394054d514de229059e73013262604d2e5331d2c76b8');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'e541527beebe92b6a152f3d11db063fe53acce2a4ed63db9d96a05dbf19c4161', N'Industrial & Consumer Goods', N'工業與消費性商品'
FROM dbo.Page p
WHERE p.PageKey = N'projects'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'e541527beebe92b6a152f3d11db063fe53acce2a4ed63db9d96a05dbf19c4161');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'c33ceffafc4244b8f775209654048ed3b97da2840ec083df31ecfb58cfa78024', N'Home & Lifestyle', N'居家與生活風格'
FROM dbo.Page p
WHERE p.PageKey = N'projects'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'c33ceffafc4244b8f775209654048ed3b97da2840ec083df31ecfb58cfa78024');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '3a6ab91faf26c778ab818b00ddb1aec65f620b86a58e2c5ddb662d4d8c238867', N'Explore how global brands trust NTI to print greener — without compromise.', N'探索全球品牌如何信賴南台彩藝——印得更綠，毫不妥協。'
FROM dbo.Page p
WHERE p.PageKey = N'projects'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '3a6ab91faf26c778ab818b00ddb1aec65f620b86a58e2c5ddb662d4d8c238867');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '2fe7be8ba6327f4a15ebfa06a079c947d7f1c8448f250de24a336e1f630f7324', N'Eco-Friendly Printing in Taiwan', N'台灣環保印刷'
FROM dbo.Page p
WHERE p.PageKey = N'sustainability-hub'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '2fe7be8ba6327f4a15ebfa06a079c947d7f1c8448f250de24a336e1f630f7324');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '7f86e7350f03f73b29596f0871c890bb041263e721ebd3b75dd0a0577ad289f9', N'NTI Printing is one of Taiwan’s most certified eco-friendly printing manufacturers, holding FSC CoC, G7 Master Printer, and ISO 14001 certifications.', N'南台彩藝是台灣認證數量最多的環保印刷廠之一，持有FSC產銷監管鏈認證、G7 Master Printer與ISO 14001認證。'
FROM dbo.Page p
WHERE p.PageKey = N'sustainability-hub'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '7f86e7350f03f73b29596f0871c890bb041263e721ebd3b75dd0a0577ad289f9');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'a4d2c8f9b3ea0ded41acf92b2a5d03b938a0b07ae306e4f45ca3a26d66e6ad44', N'Partnering with NTI Printing, a leading green printing company in Taiwan, means your brand doesn’t just look exceptional — it demonstrates a genuine commitment to sustainability. Through advanced green printing practices, carbon-conscious production, and internationally recognized eco-friendly materials, we help businesses strengthen their ESG performance and support the carbon reduction expectations of customers and global markets. By choosing NTI, you enhance your brand reputation, build consumer confidence, and show The Courage to Print Green.', N'與南台彩藝這家台灣領先的綠色印刷公司合作，不僅讓您的品牌外觀出色——更展現真正的永續承諾與具體的環保印刷承諾。透過先進的綠色印刷實務、以碳為核心的生產思維，以及國際認可的環保材料，我們協助企業強化ESG表現，並回應客戶與全球市場對減碳的期待。選擇南台彩藝，即是提升品牌聲譽、建立消費者信任，並展現勇於綠色印刷的態度。'
FROM dbo.Page p
WHERE p.PageKey = N'sustainability-hub'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'a4d2c8f9b3ea0ded41acf92b2a5d03b938a0b07ae306e4f45ca3a26d66e6ad44');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '2c6900f1bbf3a7db6b26ed2adfaa05969cd40b06448426b839848572f2cd279d', N'NTI Printing is committed to measurable carbon neutral printing and low carbon packaging production in Taiwan. We track our carbon footprint across printing cycles, invest in energy-efficient machines and adopt digital workflows that cut waste. Through the 4 Rs — Reduce, Reuse, Recover, Recycle — we lower raw-material use and emissions while maintaining premium print standards.', N'南台彩藝致力於在台灣實現可量化的碳中和與減碳印刷生產。我們追蹤每一次印刷週期的碳足跡，投資節能設備，並採用能降低浪費的數位化工作流程。透過4R原則——減量、再利用、回收再生、循環——我們在維持頂級印刷標準的同時，降低原料使用與排放。'
FROM dbo.Page p
WHERE p.PageKey = N'sustainability-hub'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '2c6900f1bbf3a7db6b26ed2adfaa05969cd40b06448426b839848572f2cd279d');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '586be92b60b569e2723e15a76e1614169dda31b9e2841878cc543e20b7177ec1', N'Our commitment to sustainable packaging materials begins with the materials we choose and the technology we invest in. From FSC paper printing and low-VOC eco friendly printing ink to RoHS-compliant materials, solvent recovery, and advanced wastewater recycling systems, every step of our production process is designed to reduce environmental impact. Combined with energy-efficient presses and finishing equipment, we deliver exceptional print quality while minimizing waste, emissions, and resource consumption.', N'我們對永續包裝材料的承諾，始於我們所選用的材料與所投資的技術。從FSC紙材印刷、低VOC環保油墨，到符合RoHS標準的材料、溶劑回收系統與先進廢水回收系統，生產流程的每一步都以降低環境衝擊為目標。結合節能印刷機與加工設備，我們在最小化浪費、排放與資源消耗的同時，交付卓越的印刷品質。'
FROM dbo.Page p
WHERE p.PageKey = N'sustainability-hub'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '586be92b60b569e2723e15a76e1614169dda31b9e2841878cc543e20b7177ec1');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'a633ff146bfd3d782471d10f2475279eb028a627e1d269accd52c1b427bd3d57', N'At NTI Printing, ESG begins with people. We believe a safe, clean, modern, and comfortable workplace is fundamental to building a sustainable business. Our fully air-conditioned offices and production facility, together with staff amenities including a restaurant, library, dormitories, and shared spaces, reflect our commitment to the wellbeing of both our local and international employees.', N'在南台彩藝，ESG從「人」出發。我們相信安全、潔淨、現代且舒適的工作環境，是打造永續企業的根本。我們全空調的辦公與生產設施，搭配員工餐廳、圖書館、宿舍與共享空間等福利設施，體現我們對本地與國際員工福祉的承諾。'
FROM dbo.Page p
WHERE p.PageKey = N'sustainability-hub'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'a633ff146bfd3d782471d10f2475279eb028a627e1d269accd52c1b427bd3d57');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '6e46c1695ed8e1e1664b7b8b36f495d416c0f38ff59bbadb04d98638bd28e9bf', N'As a sustainable packaging manufacturer committed to responsible printing, NTI Printing is aligning its ESG packaging roadmap with the UN Sustainable Development Goals (SDGs) and evaluating Science-Based Targets (SBTi) status.', N'作為致力於負責任印刷與ESG印刷實踐的永續包裝製造商，南台彩藝正將ESG包裝發展藍圖與永續發展目標，對齊聯合國永續發展目標（SDGs），並評估科學基礎減碳目標（SBTi）的適用狀態。'
FROM dbo.Page p
WHERE p.PageKey = N'sustainability-hub'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '6e46c1695ed8e1e1664b7b8b36f495d416c0f38ff59bbadb04d98638bd28e9bf');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '7f86e7350f03f73b29596f0871c890bb041263e721ebd3b75dd0a0577ad289f9', N'NTI Printing is one of Taiwan’s most certified eco-friendly printing manufacturers, holding FSC CoC, G7 Master Printer, and ISO 14001 certifications.', N'南台彩藝是台灣認證數量最多的環保印刷廠之一，持有FSC產銷監管鏈認證、G7 Master Printer與ISO 14001認證。'
FROM dbo.Page p
WHERE p.PageKey = N'green-our-advantage'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '7f86e7350f03f73b29596f0871c890bb041263e721ebd3b75dd0a0577ad289f9');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'a4d2c8f9b3ea0ded41acf92b2a5d03b938a0b07ae306e4f45ca3a26d66e6ad44', N'Partnering with NTI Printing, a leading green printing company in Taiwan, means your brand doesn’t just look exceptional — it demonstrates a genuine commitment to sustainability. Through advanced green printing practices, carbon-conscious production, and internationally recognized eco-friendly materials, we help businesses strengthen their ESG performance and support the carbon reduction expectations of customers and global markets. By choosing NTI, you enhance your brand reputation, build consumer confidence, and show The Courage to Print Green.', N'與南台彩藝這家台灣領先的綠色印刷公司合作，不僅讓您的品牌外觀出色——更展現真正的永續承諾與具體的環保印刷承諾。透過先進的綠色印刷實務、以碳為核心的生產思維，以及國際認可的環保材料，我們協助企業強化ESG表現，並回應客戶與全球市場對減碳的期待。選擇南台彩藝，即是提升品牌聲譽、建立消費者信任，並展現勇於綠色印刷的態度。'
FROM dbo.Page p
WHERE p.PageKey = N'green-our-advantage'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'a4d2c8f9b3ea0ded41acf92b2a5d03b938a0b07ae306e4f45ca3a26d66e6ad44');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '2c6900f1bbf3a7db6b26ed2adfaa05969cd40b06448426b839848572f2cd279d', N'NTI Printing is committed to measurable carbon neutral printing and low carbon packaging production in Taiwan. We track our carbon footprint across printing cycles, invest in energy-efficient machines and adopt digital workflows that cut waste. Through the 4 Rs — Reduce, Reuse, Recover, Recycle — we lower raw-material use and emissions while maintaining premium print standards.', N'南台彩藝致力於在台灣實現可量化的碳中和與減碳印刷生產。我們追蹤每一次印刷週期的碳足跡，投資節能設備，並採用能降低浪費的數位化工作流程。透過4R原則——減量、再利用、回收再生、循環——我們在維持頂級印刷標準的同時，降低原料使用與排放。'
FROM dbo.Page p
WHERE p.PageKey = N'green-carbon'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '2c6900f1bbf3a7db6b26ed2adfaa05969cd40b06448426b839848572f2cd279d');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '1dbca9d57288fd29567a1a32756111577cadf0050429a1b5ae118d7ffa17c183', N'Pre-Press', N'印前'
FROM dbo.Page p
WHERE p.PageKey = N'green-carbon'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '1dbca9d57288fd29567a1a32756111577cadf0050429a1b5ae118d7ffa17c183');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '586be92b60b569e2723e15a76e1614169dda31b9e2841878cc543e20b7177ec1', N'Our commitment to sustainable packaging materials begins with the materials we choose and the technology we invest in. From FSC paper printing and low-VOC eco friendly printing ink to RoHS-compliant materials, solvent recovery, and advanced wastewater recycling systems, every step of our production process is designed to reduce environmental impact. Combined with energy-efficient presses and finishing equipment, we deliver exceptional print quality while minimizing waste, emissions, and resource consumption.', N'我們對永續包裝材料的承諾，始於我們所選用的材料與所投資的技術。從FSC紙材印刷、低VOC環保油墨，到符合RoHS標準的材料、溶劑回收系統與先進廢水回收系統，生產流程的每一步都以降低環境衝擊為目標。結合節能印刷機與加工設備，我們在最小化浪費、排放與資源消耗的同時，交付卓越的印刷品質。'
FROM dbo.Page p
WHERE p.PageKey = N'green-materials'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '586be92b60b569e2723e15a76e1614169dda31b9e2841878cc543e20b7177ec1');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '95f22784501e301431b67fa11bc05c3f5292de29a15323864db25fa103f987c2', N'Our integrated production process improves efficiency while reducing environmental impact. By utilizing Computer-to-Plate (CTP) technology, we eliminate traditional plate-making processes, reducing heavy metal contamination, wastewater, material waste, and overall carbon emissions.', N'我們的整合生產流程在提升效率的同時降低環境衝擊。透過CTP（電腦直接製版）技術，我們免除傳統製版流程，減少重金屬污染、廢水、材料浪費與整體碳排放。'
FROM dbo.Page p
WHERE p.PageKey = N'green-materials'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '95f22784501e301431b67fa11bc05c3f5292de29a15323864db25fa103f987c2');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '8ca7453d5674c7c0fdada2640aa1f6626551a8ea2a64d0081a50b56ae0c7bbb7', N'NTI’s advanced printing equipment is designed to maximize production efficiency while minimizing energy consumption. Our eco-friendly printing systems reduce ink waste, solvent usage, and paper waste, delivering exceptional print quality with a lower environmental footprint.', N'南台彩藝的先進印刷設備專為在降低能源消耗的同時，最大化生產效率而設計。我們的環保印刷系統減少油墨浪費、溶劑用量與紙材浪費，以更低的環境足跡交付卓越印刷品質。'
FROM dbo.Page p
WHERE p.PageKey = N'green-materials'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '8ca7453d5674c7c0fdada2640aa1f6626551a8ea2a64d0081a50b56ae0c7bbb7');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'e16663066803450cdac30b635479f8e15d0ea33a6abb5b1f9e57ae1cf163e092', N'We use environmentally responsible eco friendly printing ink containing less than 1% VOC (Volatile Organic Compounds), together with solvent recovery systems that help reduce emissions and improve workplace safety while maintaining outstanding print performance.', N'我們使用VOC（揮發性有機化合物）含量低於1%的環保油墨，並搭配溶劑回收系統，在維持卓越印刷表現的同時，降低排放並提升工作環境安全性。'
FROM dbo.Page p
WHERE p.PageKey = N'green-materials'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'e16663066803450cdac30b635479f8e15d0ea33a6abb5b1f9e57ae1cf163e092');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '7396929b6e374420c0428def3fdd607d827a1c22850dc662e9ce7870b3e63196', N'Sewage Treatment', N'廢水處理'
FROM dbo.Page p
WHERE p.PageKey = N'green-materials'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '7396929b6e374420c0428def3fdd607d827a1c22850dc662e9ce7870b3e63196');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '870679a7495ee2efa3ec5bcdb58b3c0398ff46c27f502b4b48fb4b1fff71d915', N'Environmental responsibility extends beyond the printing press. NTI operates advanced wastewater treatment and recycling systems for both production and domestic water, ensuring discharged water consistently meets strict environmental standards. Together with our renewable solar energy infrastructure and ongoing carbon footprint reduction initiatives, we continue to build a cleaner and more sustainable future.', N'環境責任不只止於印刷機台。南台彩藝針對生產用水與生活用水，建置先進的廢水處理與回收系統，確保排放水質穩定符合嚴格的環保標準。搭配可再生太陽能基礎設施與持續進行的碳足跡減量計畫，我們持續打造更潔淨、更永續的未來。'
FROM dbo.Page p
WHERE p.PageKey = N'green-materials'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '870679a7495ee2efa3ec5bcdb58b3c0398ff46c27f502b4b48fb4b1fff71d915');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'a633ff146bfd3d782471d10f2475279eb028a627e1d269accd52c1b427bd3d57', N'At NTI Printing, ESG begins with people. We believe a safe, clean, modern, and comfortable workplace is fundamental to building a sustainable business. Our fully air-conditioned offices and production facility, together with staff amenities including a restaurant, library, dormitories, and shared spaces, reflect our commitment to the wellbeing of both our local and international employees.', N'在南台彩藝，ESG從「人」出發。我們相信安全、潔淨、現代且舒適的工作環境，是打造永續企業的根本。我們全空調的辦公與生產設施，搭配員工餐廳、圖書館、宿舍與共享空間等福利設施，體現我們對本地與國際員工福祉的承諾。'
FROM dbo.Page p
WHERE p.PageKey = N'green-esg'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'a633ff146bfd3d782471d10f2475279eb028a627e1d269accd52c1b427bd3d57');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '6e46c1695ed8e1e1664b7b8b36f495d416c0f38ff59bbadb04d98638bd28e9bf', N'As a sustainable packaging manufacturer committed to responsible printing, NTI Printing is aligning its ESG packaging roadmap with the UN Sustainable Development Goals (SDGs) and evaluating Science-Based Targets (SBTi) status.', N'作為致力於負責任印刷與ESG印刷實踐的永續包裝製造商，南台彩藝正將ESG包裝發展藍圖與永續發展目標，對齊聯合國永續發展目標（SDGs），並評估科學基礎減碳目標（SBTi）的適用狀態。'
FROM dbo.Page p
WHERE p.PageKey = N'green-esg'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '6e46c1695ed8e1e1664b7b8b36f495d416c0f38ff59bbadb04d98638bd28e9bf');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '21fcc8d3656aefe3dc59e1731669bb1ba513a5ef9579a68f49aa16fabbe584e7', N'Latest news & insights', N'最新消息與洞察'
FROM dbo.Page p
WHERE p.PageKey = N'news-list'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '21fcc8d3656aefe3dc59e1731669bb1ba513a5ef9579a68f49aa16fabbe584e7');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '523e00176c854617c890bd1510467e40707bfffed4b325bfa9904590b069959c', N'Stay connected with NTI Printing’s latest green printing innovations, sustainable packaging initiatives, company news, and industry achievements.', N'掌握南台彩藝最新的印刷產業新聞、公司最新消息、永續包裝計畫與綠色印刷創新動態。'
FROM dbo.Page p
WHERE p.PageKey = N'news-list'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '523e00176c854617c890bd1510467e40707bfffed4b325bfa9904590b069959c');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '4f434956683467db4f2af423a811e16a529284f835570d785471ca0b869287a6', N'Explore practical insights, industry trends, and sustainable packaging and eco friendly printing solutions that help brands build a greener future.', N'探索環保印刷知識、產業趨勢，以及能協助品牌打造更綠色未來的永續包裝設計與解決方案。'
FROM dbo.Page p
WHERE p.PageKey = N'green-vlog'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '4f434956683467db4f2af423a811e16a529284f835570d785471ca0b869287a6');
INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'c321ce4d36e6564df723b1e9622c3f81d135120be718781392604f7e8d1c8c05', N'Find answers to common questions about green printing, packaging, certifications, sustainability, and working with NTI.', N'南台彩藝為您解答關於綠色印刷、包裝、環保印刷認證，以及與我們合作的印刷常見問題。'
FROM dbo.Page p
WHERE p.PageKey = N'faq'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'c321ce4d36e6564df723b1e9622c3f81d135120be718781392604f7e8d1c8c05');

/* ── 固定頁 SEO ── */
UPDATE i SET SeoTitle = N'南台彩藝｜台灣永續包裝與環保印刷領導品牌'
FROM dbo.PageI18n i JOIN dbo.Page p ON p.Id = i.PageId
WHERE p.PageKey = N'home' AND i.Lang = 'zh'
  AND (i.SeoTitle IS NULL OR i.SeoTitle = N'' OR i.SeoTitle = (SELECT e.SeoTitle FROM dbo.PageI18n e WHERE e.PageId = i.PageId AND e.Lang = 'en'));
UPDATE i SET SeoDescription = N'南台彩藝——台灣領先的永續包裝與環保印刷製造商。通過 FSC 產銷監管鏈、G7 Master Printer、ISO 9001/14001 認證。提供客製化彩盒、UV 印刷及環保包裝解決方案，服務全球品牌。'
FROM dbo.PageI18n i JOIN dbo.Page p ON p.Id = i.PageId
WHERE p.PageKey = N'home' AND i.Lang = 'zh'
  AND (i.SeoDescription IS NULL OR i.SeoDescription = N'' OR i.SeoDescription = (SELECT e.SeoDescription FROM dbo.PageI18n e WHERE e.PageId = i.PageId AND e.Lang = 'en'));
UPDATE i SET SeoTitle = N'為何選擇南台彩藝｜品質、永續與夥伴關係'
FROM dbo.PageI18n i JOIN dbo.Page p ON p.Id = i.PageId
WHERE p.PageKey = N'about-difference' AND i.Lang = 'zh'
  AND (i.SeoTitle IS NULL OR i.SeoTitle = N'' OR i.SeoTitle = (SELECT e.SeoTitle FROM dbo.PageI18n e WHERE e.PageId = i.PageId AND e.Lang = 'en'));
UPDATE i SET SeoTitle = N'更聰明的全球B2B客製化印刷供應商｜南台彩藝'
FROM dbo.PageI18n i JOIN dbo.Page p ON p.Id = i.PageId
WHERE p.PageKey = N'about-benefits' AND i.Lang = 'zh'
  AND (i.SeoTitle IS NULL OR i.SeoTitle = N'' OR i.SeoTitle = (SELECT e.SeoTitle FROM dbo.PageI18n e WHERE e.PageId = i.PageId AND e.Lang = 'en'));
UPDATE i SET SeoTitle = N'南台彩藝認證｜FSC・G7・ISO 9001・ISO 14001'
FROM dbo.PageI18n i JOIN dbo.Page p ON p.Id = i.PageId
WHERE p.PageKey = N'about-certifications' AND i.Lang = 'zh'
  AND (i.SeoTitle IS NULL OR i.SeoTitle = N'' OR i.SeoTitle = (SELECT e.SeoTitle FROM dbo.PageI18n e WHERE e.PageId = i.PageId AND e.Lang = 'en'));
UPDATE i SET SeoTitle = N'工廠導覽｜南台彩藝'
FROM dbo.PageI18n i JOIN dbo.Page p ON p.Id = i.PageId
WHERE p.PageKey = N'facility-tour' AND i.Lang = 'zh'
  AND (i.SeoTitle IS NULL OR i.SeoTitle = N'' OR i.SeoTitle = (SELECT e.SeoTitle FROM dbo.PageI18n e WHERE e.PageId = i.PageId AND e.Lang = 'en'));
UPDATE i SET SeoTitle = N'客製化包裝與印刷解決方案｜南台彩藝台灣'
FROM dbo.PageI18n i JOIN dbo.Page p ON p.Id = i.PageId
WHERE p.PageKey = N'solutions' AND i.Lang = 'zh'
  AND (i.SeoTitle IS NULL OR i.SeoTitle = N'' OR i.SeoTitle = (SELECT e.SeoTitle FROM dbo.PageI18n e WHERE e.PageId = i.PageId AND e.Lang = 'en'));
UPDATE i SET SeoTitle = N'包裝印刷作品實績｜南台彩藝'
FROM dbo.PageI18n i JOIN dbo.Page p ON p.Id = i.PageId
WHERE p.PageKey = N'projects' AND i.Lang = 'zh'
  AND (i.SeoTitle IS NULL OR i.SeoTitle = N'' OR i.SeoTitle = (SELECT e.SeoTitle FROM dbo.PageI18n e WHERE e.PageId = i.PageId AND e.Lang = 'en'));
UPDATE i SET SeoTitle = N'頂尖印刷廠房｜南台彩藝'
FROM dbo.PageI18n i JOIN dbo.Page p ON p.Id = i.PageId
WHERE p.PageKey = N'facility' AND i.Lang = 'zh'
  AND (i.SeoTitle IS NULL OR i.SeoTitle = N'' OR i.SeoTitle = (SELECT e.SeoTitle FROM dbo.PageI18n e WHERE e.PageId = i.PageId AND e.Lang = 'en'));
UPDATE i SET SeoTitle = N'品質檢驗｜南台彩藝'
FROM dbo.PageI18n i JOIN dbo.Page p ON p.Id = i.PageId
WHERE p.PageKey = N'facility-quality' AND i.Lang = 'zh'
  AND (i.SeoTitle IS NULL OR i.SeoTitle = N'' OR i.SeoTitle = (SELECT e.SeoTitle FROM dbo.PageI18n e WHERE e.PageId = i.PageId AND e.Lang = 'en'));
UPDATE i SET SeoTitle = N'台灣環保印刷｜南台彩藝的綠色優勢'
FROM dbo.PageI18n i JOIN dbo.Page p ON p.Id = i.PageId
WHERE p.PageKey = N'green-our-advantage' AND i.Lang = 'zh'
  AND (i.SeoTitle IS NULL OR i.SeoTitle = N'' OR i.SeoTitle = (SELECT e.SeoTitle FROM dbo.PageI18n e WHERE e.PageId = i.PageId AND e.Lang = 'en'));
UPDATE i SET SeoTitle = N'碳中和印刷｜南台彩藝的淨零承諾'
FROM dbo.PageI18n i JOIN dbo.Page p ON p.Id = i.PageId
WHERE p.PageKey = N'green-carbon' AND i.Lang = 'zh'
  AND (i.SeoTitle IS NULL OR i.SeoTitle = N'' OR i.SeoTitle = (SELECT e.SeoTitle FROM dbo.PageI18n e WHERE e.PageId = i.PageId AND e.Lang = 'en'));
UPDATE i SET SeoTitle = N'永續印刷材料｜大豆油墨、FSC紙材與更多'
FROM dbo.PageI18n i JOIN dbo.Page p ON p.Id = i.PageId
WHERE p.PageKey = N'green-materials' AND i.Lang = 'zh'
  AND (i.SeoTitle IS NULL OR i.SeoTitle = N'' OR i.SeoTitle = (SELECT e.SeoTitle FROM dbo.PageI18n e WHERE e.PageId = i.PageId AND e.Lang = 'en'));
UPDATE i SET SeoTitle = N'ESG印刷承諾｜南台彩藝2030永續目標'
FROM dbo.PageI18n i JOIN dbo.Page p ON p.Id = i.PageId
WHERE p.PageKey = N'green-esg' AND i.Lang = 'zh'
  AND (i.SeoTitle IS NULL OR i.SeoTitle = N'' OR i.SeoTitle = (SELECT e.SeoTitle FROM dbo.PageI18n e WHERE e.PageId = i.PageId AND e.Lang = 'en'));
UPDATE i SET SeoTitle = N'最新消息與洞察｜南台彩藝'
FROM dbo.PageI18n i JOIN dbo.Page p ON p.Id = i.PageId
WHERE p.PageKey = N'news-list' AND i.Lang = 'zh'
  AND (i.SeoTitle IS NULL OR i.SeoTitle = N'' OR i.SeoTitle = (SELECT e.SeoTitle FROM dbo.PageI18n e WHERE e.PageId = i.PageId AND e.Lang = 'en'));
UPDATE i SET SeoTitle = N'綠色知識中心｜南台彩藝'
FROM dbo.PageI18n i JOIN dbo.Page p ON p.Id = i.PageId
WHERE p.PageKey = N'green-vlog' AND i.Lang = 'zh'
  AND (i.SeoTitle IS NULL OR i.SeoTitle = N'' OR i.SeoTitle = (SELECT e.SeoTitle FROM dbo.PageI18n e WHERE e.PageId = i.PageId AND e.Lang = 'en'));
UPDATE i SET SeoTitle = N'印刷常見問題｜南台彩藝'
FROM dbo.PageI18n i JOIN dbo.Page p ON p.Id = i.PageId
WHERE p.PageKey = N'faq' AND i.Lang = 'zh'
  AND (i.SeoTitle IS NULL OR i.SeoTitle = N'' OR i.SeoTitle = (SELECT e.SeoTitle FROM dbo.PageI18n e WHERE e.PageId = i.PageId AND e.Lang = 'en'));
UPDATE i SET SeoTitle = N'聯絡我們｜南台彩藝'
FROM dbo.PageI18n i JOIN dbo.Page p ON p.Id = i.PageId
WHERE p.PageKey = N'contact' AND i.Lang = 'zh'
  AND (i.SeoTitle IS NULL OR i.SeoTitle = N'' OR i.SeoTitle = (SELECT e.SeoTitle FROM dbo.PageI18n e WHERE e.PageId = i.PageId AND e.Lang = 'en'));

/* ── 方案頁 SEO 標題與導言 ── */
UPDATE dbo.SolutionI18n SET SeoTitle = N'客製化彩盒印刷｜南台彩藝台灣'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'boxes') AND Lang = 'zh'
  AND (SeoTitle IS NULL OR SeoTitle = N'' OR SeoTitle IN (N'客製化彩盒包裝', N'客製化彩盒包裝 —— NTI Printing'));
UPDATE dbo.SolutionI18n SET IntroHtml = N'<p>探索南台彩藝完整的客製化彩盒包裝與彩盒印刷選項：</p>'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'boxes') AND Lang = 'zh'
  AND (IntroHtml IS NULL OR IntroHtml = N'' OR IntroHtml = N'<p>探索 NTI 完整的客製化彩盒包裝與彩盒印刷選項：</p>');
UPDATE dbo.SolutionI18n SET SeoTitle = N'客製化紙板印刷｜南台彩藝'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'cardboard') AND Lang = 'zh'
  AND (SeoTitle IS NULL OR SeoTitle = N'' OR SeoTitle IN (N'客製化包裝紙板', N'包裝紙板 —— NTI Printing'));
UPDATE dbo.SolutionI18n SET IntroHtml = N'<p>南台彩藝為零售、工業與消費性應用生產客製化包裝紙板與紙盒包裝製造服務，涵蓋以下產品：</p>'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'cardboard') AND Lang = 'zh'
  AND (IntroHtml IS NULL OR IntroHtml = N'' OR IntroHtml = N'<p>NTI Printing 生產零售、工業與消費性應用的客製化紙板包裝與印刷紙盒，包括：</p>');
UPDATE dbo.SolutionI18n SET SeoTitle = N'台灣UV印刷服務｜南台彩藝'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'uv') AND Lang = 'zh'
  AND (SeoTitle IS NULL OR SeoTitle = N'' OR SeoTitle IN (N'環保 UV 印刷', N'UV 印刷 —— NTI Printing'));
UPDATE dbo.SolutionI18n SET IntroHtml = N'<p>UV印刷能在塑膠、金屬箔、塗佈紙板及其他不吸水材質上，呈現鮮豔且耐久的圖像效果。其瞬間固化的特性可加快生產速度、提升印刷品質，並支援頂級加工、特殊塗層與防偽應用——這正是南台彩藝成為台灣值得信賴的UV印刷技術供應商的原因之一。</p>'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'uv') AND Lang = 'zh'
  AND (IntroHtml IS NULL OR IntroHtml = N'' OR IntroHtml = N'<p>UV 印刷能在塑膠、金屬箔、塗佈紙板等非吸收性材質上，呈現鮮豔而耐久的圖像。瞬間固化的製程加快生產、提升印刷品質，並支援高階加工、特殊塗層與防偽應用 —— 這也是 NTI Printing 成為台灣 UV 上光印刷可靠來源的原因之一。</p>');
UPDATE dbo.SolutionI18n SET SeoTitle = N'台灣特殊印刷服務｜南台彩藝'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'other') AND Lang = 'zh'
  AND (SeoTitle IS NULL OR SeoTitle = N'' OR SeoTitle IN (N'其他印刷服務', N'其他印刷服務 —— NTI Printing'));
UPDATE dbo.SolutionI18n SET IntroHtml = N'<p>以燙金、壓紋、全息效果與防偽特徵等頂級加工，提升您的包裝質感。我們的特殊印刷與印刷加工服務能增添視覺衝擊力、強化品牌形象，並提升產品安全性。</p><p>其他產品包括（但不限於）桌曆、信封、提袋、滑鼠墊、產品說明書等。</p>'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'other') AND Lang = 'zh'
  AND (IntroHtml IS NULL OR IntroHtml = N'' OR IntroHtml = N'<p>以燙金、壓凸、雷射光影與防偽等高階加工，讓包裝更出色。特殊印刷與客製化印後加工能增加視覺衝擊、強化品牌感受，並提升產品的防偽保護。</p><p>其他產品包括但不限於月曆、紙袋、提袋、滑鼠墊、說明書等。</p>');

/* ── 方案品項 ── */
UPDATE z SET Name = N'摺蓋盒', Description = N'簡單的上下開口設計，易於組裝，適合輕量產品。'
FROM dbo.SolutionItemI18n z
JOIN dbo.SolutionItemI18n e ON e.SolutionItemId = z.SolutionItemId AND e.Lang = 'en'
JOIN dbo.SolutionItem si ON si.Id = z.SolutionItemId AND si.IsDeleted = 0
WHERE z.Lang = 'zh' AND e.Name = N'Gluing Box' AND z.Name = N'糊盒';
UPDATE z SET Name = N'黏合底盒', Description = N'加強底部設計，適合較重物品，堅固耐用。'
FROM dbo.SolutionItemI18n z
JOIN dbo.SolutionItemI18n e ON e.SolutionItemId = z.SolutionItemId AND e.Lang = 'en'
JOIN dbo.SolutionItem si ON si.Id = z.SolutionItemId AND si.IsDeleted = 0
WHERE z.Lang = 'zh' AND e.Name = N'Bottom Gluing Box' AND z.Name = N'糊底盒';
UPDATE z SET Name = N'插入式底盒', Description = N'四扣角交叉結構，兼具耐用性與組裝便利性。'
FROM dbo.SolutionItemI18n z
JOIN dbo.SolutionItemI18n e ON e.SolutionItemId = z.SolutionItemId AND e.Lang = 'en'
JOIN dbo.SolutionItem si ON si.Id = z.SolutionItemId AND si.IsDeleted = 0
WHERE z.Lang = 'zh' AND e.Name = N'Insert Bottom Box' AND z.Name = N'插底盒';
UPDATE z SET Name = N'手提盒', Description = N'內建把手，方便提取並減少額外提袋使用。'
FROM dbo.SolutionItemI18n z
JOIN dbo.SolutionItemI18n e ON e.SolutionItemId = z.SolutionItemId AND e.Lang = 'en'
JOIN dbo.SolutionItem si ON si.Id = z.SolutionItemId AND si.IsDeleted = 0
WHERE z.Lang = 'zh' AND e.Name = N'Hand-Carry Box' AND z.Name = N'手提盒';
UPDATE z SET Name = N'天地蓋盒', Description = N'頂級雙件式盒型，優雅大方，適合禮品包裝。'
FROM dbo.SolutionItemI18n z
JOIN dbo.SolutionItemI18n e ON e.SolutionItemId = z.SolutionItemId AND e.Lang = 'en'
JOIN dbo.SolutionItem si ON si.Id = z.SolutionItemId AND si.IsDeleted = 0
WHERE z.Lang = 'zh' AND e.Name = N'Top & Bottom Box' AND z.Name = N'天地盒';
UPDATE z SET Name = N'特殊包裝', Description = N'依獨特需求提供全客製化設計與材料建議。'
FROM dbo.SolutionItemI18n z
JOIN dbo.SolutionItemI18n e ON e.SolutionItemId = z.SolutionItemId AND e.Lang = 'en'
JOIN dbo.SolutionItem si ON si.Id = z.SolutionItemId AND si.IsDeleted = 0
WHERE z.Lang = 'zh' AND e.Name = N'Special Package' AND z.Name = N'特殊盒型';
UPDATE z SET Name = N'紙吊卡與泡殼卡紙', Description = N'客製印刷的紙吊卡與泡殼背卡，在提供清晰產品資訊與強烈零售視覺效果的同時，提升產品陳列質感。適用於手工具、五金零件、電子元件、汽車零件及各類消費性產品。'
FROM dbo.SolutionItemI18n z
JOIN dbo.SolutionItemI18n e ON e.SolutionItemId = z.SolutionItemId AND e.Lang = 'en'
JOIN dbo.SolutionItem si ON si.Id = z.SolutionItemId AND si.IsDeleted = 0
WHERE z.Lang = 'zh' AND e.Name = N'Paper Hang Tags & Blister Backcards' AND z.Name = N'紙卡與吊卡底板';
UPDATE z SET Name = N'泡殼卡紙包裝', Description = N'泡殼卡紙包裝結合兩層印刷紙板與透明塑膠泡殼，提供牢固的產品保護、優異的可視性，以及強烈的零售陳列效果。'
FROM dbo.SolutionItemI18n z
JOIN dbo.SolutionItemI18n e ON e.SolutionItemId = z.SolutionItemId AND e.Lang = 'en'
JOIN dbo.SolutionItem si ON si.Id = z.SolutionItemId AND si.IsDeleted = 0
WHERE z.Lang = 'zh' AND e.Name = N'Blister Cardboard' AND z.Name = N'泡殼卡紙';

/* ── 認證說明 ── */
UPDATE dbo.CertificationI18n SET Description = N'由Idealliance開發、以ISO 12647-2為基礎的全球公認色彩校正方法，確保每一次印刷都能呈現一致且精準的色彩重現。'
WHERE CertificationId = 4 AND Lang = 'zh' AND (Description IS NULL OR Description = N'');
UPDATE dbo.CertificationI18n SET Description = N'南台彩藝通過GMI認證，確保包裝色彩一致且符合Target、Walgreens、Lowe’s、The Home Depot、Academy Sports + Outdoors、CVS Pharmacy等全球零售商的品質標準。'
WHERE CertificationId = 5 AND Lang = 'zh' AND (Description IS NULL OR Description = N'');
UPDATE dbo.CertificationI18n SET Description = N'展現南台彩藝對一致品質、持續改善與客戶滿意度的承諾。'
WHERE CertificationId = 6 AND Lang = 'zh' AND (Description IS NULL OR Description = N'');
UPDATE dbo.CertificationI18n SET Description = N'展現南台彩藝在生產與產品生命週期各階段，透過負責任管理降低環境衝擊的承諾。'
WHERE CertificationId = 7 AND Lang = 'zh' AND (Description IS NULL OR Description = N'');
UPDATE dbo.CertificationI18n SET Description = N'證明南台彩藝致力於透過有效的職業健康與安全管理，維持安全健康的工作環境。'
WHERE CertificationId = 8 AND Lang = 'zh' AND (Description IS NULL OR Description = N'');
UPDATE dbo.CertificationI18n SET Description = N'確保通過認證的紙材來自負責任管理的森林，並在整個供應鏈中受到驗證。'
WHERE CertificationId = 9 AND Lang = 'zh' AND (Description IS NULL OR Description = N'');
UPDATE dbo.CertificationI18n SET Description = N'南台彩藝使用MOF認證的環保印刷材料與油墨，協助客戶在符合公認永續與品質標準的同時降低環境衝擊。'
WHERE CertificationId = 14 AND Lang = 'zh' AND (Description IS NULL OR Description = N'');

/* ── FAQ 草稿補中文 ── */
INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
SELECT i.FaqId, 'zh', N'南台彩藝持有哪些認證？', N'<p>南台彩藝持有G7 Master Colorspace、GMI專業印刷認證、ISO 14001、ISO 9001、OHSAS 18001、FSC™產銷監管鏈認證，以及MOF認證環保印刷材料。</p>'
FROM dbo.FaqI18n i JOIN dbo.Faq f ON f.Id = i.FaqId
WHERE f.IsDeleted = 0 AND i.Lang = 'en' AND i.Question = N'What certifications does NTI Printing hold?'
  AND NOT EXISTS (SELECT 1 FROM dbo.FaqI18n z WHERE z.FaqId = i.FaqId AND z.Lang = 'zh');
INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
SELECT i.FaqId, 'zh', N'FSC CoC認證對我的包裝意味著什麼？', N'<p>FSC™產銷監管鏈（Chain of Custody）認證，確保通過認證的紙材來自負責任管理的森林，並在整個供應鏈中——從南台彩藝到您的成品包裝——都經過驗證。</p>'
FROM dbo.FaqI18n i JOIN dbo.Faq f ON f.Id = i.FaqId
WHERE f.IsDeleted = 0 AND i.Lang = 'en' AND i.Question = N'What does FSC CoC certification mean for my packaging?'
  AND NOT EXISTS (SELECT 1 FROM dbo.FaqI18n z WHERE z.FaqId = i.FaqId AND z.Lang = 'zh');
INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
SELECT i.FaqId, 'zh', N'什麼是G7 Master Printer認證？', N'<p>G7 Master Colorspace由Idealliance開發，以ISO 12647-2為基礎，是全球公認的色彩校正方法，確保南台彩藝每一次印刷都能呈現一致且精準的色彩重現。</p>'
FROM dbo.FaqI18n i JOIN dbo.Faq f ON f.Id = i.FaqId
WHERE f.IsDeleted = 0 AND i.Lang = 'en' AND i.Question = N'What is G7 Master Printer certification?'
  AND NOT EXISTS (SELECT 1 FROM dbo.FaqI18n z WHERE z.FaqId = i.FaqId AND z.Lang = 'zh');
INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
SELECT i.FaqId, 'zh', N'南台彩藝的印刷是碳中和的嗎？', N'<p>南台彩藝正透過4R原則（減量、再利用、回收再生、循環）、碳平衡海德堡印刷機、太陽能，以及持續的碳足跡追蹤，朝淨零目標邁進。</p>'
FROM dbo.FaqI18n i JOIN dbo.Faq f ON f.Id = i.FaqId
WHERE f.IsDeleted = 0 AND i.Lang = 'en' AND i.Question = N'Is NTI’s printing carbon neutral?'
  AND NOT EXISTS (SELECT 1 FROM dbo.FaqI18n z WHERE z.FaqId = i.FaqId AND z.Lang = 'zh');
INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
SELECT i.FaqId, 'zh', N'南台彩藝使用哪些環保材料？', N'<p>南台彩藝在生產過程中使用FSC認證紙材、低VOC（低於1%）環保油墨、符合RoHS標準的材料，以及溶劑回收系統。</p>'
FROM dbo.FaqI18n i JOIN dbo.Faq f ON f.Id = i.FaqId
WHERE f.IsDeleted = 0 AND i.Lang = 'en' AND i.Question = N'What eco-friendly materials does NTI use?'
  AND NOT EXISTS (SELECT 1 FROM dbo.FaqI18n z WHERE z.FaqId = i.FaqId AND z.Lang = 'zh');
INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
SELECT i.FaqId, 'zh', N'環保印刷會比較貴嗎？', N''
FROM dbo.FaqI18n i JOIN dbo.Faq f ON f.Id = i.FaqId
WHERE f.IsDeleted = 0 AND i.Lang = 'en' AND i.Question = N'Does eco-friendly printing cost more?'
  AND NOT EXISTS (SELECT 1 FROM dbo.FaqI18n z WHERE z.FaqId = i.FaqId AND z.Lang = 'zh');
INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
SELECT i.FaqId, 'zh', N'南台彩藝能處理國際訂單與出口業務嗎？', N'<p>可以。南台彩藝為國內外客戶提供直送工廠、供應商、倉庫或組裝廠的服務，涵蓋台灣與亞洲地區，並簡化跨境協調流程。</p>'
FROM dbo.FaqI18n i JOIN dbo.Faq f ON f.Id = i.FaqId
WHERE f.IsDeleted = 0 AND i.Lang = 'en' AND i.Question = N'Can NTI handle international orders and export?'
  AND NOT EXISTS (SELECT 1 FROM dbo.FaqI18n z WHERE z.FaqId = i.FaqId AND z.Lang = 'zh');
INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
SELECT i.FaqId, 'zh', N'南台彩藝能生產哪些類型的客製化包裝？', N'<p>南台彩藝生產客製化彩盒包裝、包裝紙板、UV印刷加工品，以及特殊印刷（燙金、壓紋、全息效果）——完整產品範圍請參閱「印刷解決方案」頁面。</p>'
FROM dbo.FaqI18n i JOIN dbo.Faq f ON f.Id = i.FaqId
WHERE f.IsDeleted = 0 AND i.Lang = 'en' AND i.Question = N'What types of custom packaging can NTI produce?'
  AND NOT EXISTS (SELECT 1 FROM dbo.FaqI18n z WHERE z.FaqId = i.FaqId AND z.Lang = 'zh');
INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
SELECT i.FaqId, 'zh', N'南台彩藝的最小訂購量（MOQ）是多少？', N''
FROM dbo.FaqI18n i JOIN dbo.Faq f ON f.Id = i.FaqId
WHERE f.IsDeleted = 0 AND i.Lang = 'en' AND i.Question = N'What is NTI’s minimum order quantity (MOQ)?'
  AND NOT EXISTS (SELECT 1 FROM dbo.FaqI18n z WHERE z.FaqId = i.FaqId AND z.Lang = 'zh');
INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
SELECT i.FaqId, 'zh', N'客製化包裝的一般交期是多久？', N''
FROM dbo.FaqI18n i JOIN dbo.Faq f ON f.Id = i.FaqId
WHERE f.IsDeleted = 0 AND i.Lang = 'en' AND i.Question = N'What is the typical lead time for custom packaging?'
  AND NOT EXISTS (SELECT 1 FROM dbo.FaqI18n z WHERE z.FaqId = i.FaqId AND z.Lang = 'zh');

COMMIT;
GO
