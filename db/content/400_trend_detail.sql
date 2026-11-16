/* =============================================================================
   400_trend_detail.sql  —  產業趨勢分清單頁／詳細頁（2026-11-16）
   -----------------------------------------------------------------------------
   /printing-trends 改成只列標題＋摘要，點進去是 /printing-trends/{slug} 的詳細頁。
   EF migration TrendDetailPage 加了 Slug／Summary／SEO 欄位，既有的趨勢暫時給了
   trend-{Id} 的 slug；這支把 mockup 那 5 筆補成正式的值：
     - Slug／SEO 標題／搜尋摘要（初稿，待客戶校閱）
     - 摘要＝原本的段落（清單卡片＋詳細頁導言）
     - 內文＝mockup 段落下的三點（<ul>）

   只動「還是預設值」的列：slug 還是 trend-{Id} 的才處理；摘要／SEO 只補空的；
   內文只在**仍是 200 當初匯入的那一段**時才換成三點，客戶在後台改過的不動。
   冪等，可重跑。新建的庫由 200 直接帶入同樣的值，這支跑了也不會改到任何列。

   ⚠ 部署順序：先跑 migration 與這支，再部署新版前台——否則清單卡片沒有摘要、
     連結會指向 trend-{Id}（點得進去，只是網址不好看）。
   ============================================================================= */
SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

DECLARE @v TABLE (
    SortOrder INT, Lang VARCHAR(5), Slug NVARCHAR(160), Summary NVARCHAR(500),
    BodyHtml NVARCHAR(MAX), OldBodyHtml NVARCHAR(MAX), SeoTitle NVARCHAR(70), SeoDescription NVARCHAR(180));

INSERT @v VALUES
        (10, 'zh', N'regulation-sets-the-pace', N'歐盟、日本與北美的包裝法規，正朝可回收性、再生料含量與資訊揭露收斂。過去屬於美感範疇的設計決定 —— 貼合膜、燙金、開窗 —— 現在都成了合規決定。', N'<ul><li>可回收性以「整個包裝」評估，而不是以單一材料評估。</li><li>再生料含量門檻被寫進採購規格。</li><li>碳與材料數據在報價階段就要提供，而不是交貨之後才補。</li></ul>', N'<p>歐盟、日本與北美的包裝法規正朝可回收性、再生成分與資訊揭露收斂。過去屬於美感的設計決定 —— 淋膜、燙金、開窗 —— 現在都成了合規決定。</p>', N'包裝法規正在定調節奏｜NTI Printing', N'歐盟、日本與北美的包裝法規正朝可回收性、再生料含量與資訊揭露收斂，貼合膜、燙金、開窗等設計決定，現在都成了合規決定。'),
        (10, 'en', N'regulation-sets-the-pace', N'Packaging rules in the EU, Japan and North America are converging on recyclability, recycled content and disclosure. Design decisions that used to be aesthetic — a laminate, a foil, a window — are now compliance decisions.', N'<ul><li>Recyclability assessed at the pack level, not the material level.</li><li>Recycled-content thresholds written into purchase specifications.</li><li>Carbon and material data requested as part of the quote, not after delivery.</li></ul>', N'<p>Packaging rules in the EU, Japan and North America are converging on recyclability, recycled content and disclosure. Design decisions that used to be aesthetic — a laminate, a foil, a window — are now compliance decisions.</p>', N'Packaging Regulation Is Setting the Pace | NTI Printing', N'EU, Japan and North American packaging rules are converging on recyclability, recycled content and disclosure — design choices are now compliance choices.'),
        (20, 'zh', N'mono-material-packaging', N'複合結構印起來漂亮，回收起來麻煩。趨勢是走向一種紙、一種塗層、一條廢棄物流 —— 這把壓力推回印刷與加工端：不靠塑膠貼合，也要做出同樣的貨架效果。', N'<ul><li>以可回收的水性塗層取代 PET／OPP 貼合。</li><li>結構強度改由刀模設計來達成，而不是額外加膜。</li><li>FSC™ 原生紙板與再生紙板並列在同一個產品系列的規格中。</li></ul>', N'<p>複合結構印起來漂亮、回收起來麻煩。趨勢是走向單一紙材、單一塗層、單一廢棄流 —— 這把壓力推回印刷與加工端：要在不用塑膠淋膜的前提下，做出同樣的貨架效果。</p>', N'單一材質取代複合結構包裝｜NTI Printing', N'一種紙、一種塗層、一條廢棄物流：不靠塑膠貼合，印刷與加工端如何做出同樣的貨架效果。'),
        (20, 'en', N'mono-material-packaging', N'Composite structures print beautifully and recycle badly. The move is toward one board, one coating, one waste stream — which pushes the burden onto printing and finishing to deliver the same shelf impact without plastic lamination.', N'<ul><li>Recyclable water-based coatings in place of PET/OPP lamination.</li><li>Structural strength engineered through the dieline rather than added film.</li><li>FSC™ virgin and recycled boards specified side by side in one range.</li></ul>', N'<p>Composite structures print beautifully and recycle badly. The move is toward one board, one coating, one waste stream — which pushes the burden onto printing and finishing to deliver the same shelf impact without plastic lamination.</p>', N'Mono-Material Replaces the Composite Pack | NTI Printing', N'One board, one coating, one waste stream: how printing and finishing deliver shelf impact without plastic lamination.'),
        (30, 'zh', N'carbon-data-line-item', N'範疇三（Scope 3）盤查讓印刷彩盒變成一個數據點。品牌愈來愈需要一份 ESG 團隊能引用的每單數字 —— 對照經稽核的基準線量測，而不是用產業平均值推估。', N'<ul><li>每筆訂單的碳足跡回報，並附方法說明。</li><li>能源、紙材、油墨與廢棄物依生產階段計量。</li><li>供應商的碳表現被納入廠商評選的權重。</li></ul>', N'<p>範疇三盤查讓一只印刷紙盒變成一個數據點。品牌愈來愈需要一個 ESG 團隊能引用的單筆訂單數字 —— 對照通過查證的基線量測而來，不是拿產業平均值估的。</p>', N'碳數據成為報價的一個項目｜NTI Printing', N'範疇三盤查讓印刷彩盒變成數據點，品牌需要對照經稽核基準線量測的每單碳足跡，而不是產業平均推估值。'),
        (30, 'en', N'carbon-data-line-item', N'Scope 3 reporting has turned the printed carton into a data point. Brands increasingly need a per-order figure their ESG team can cite — measured against an audited baseline, not estimated from an industry average.', N'<ul><li>Per-order footprint reported with methodology notes.</li><li>Energy, board, ink and waste metered by production stage.</li><li>Supplier carbon performance weighted in vendor selection.</li></ul>', N'<p>Scope 3 reporting has turned the printed carton into a data point. Brands increasingly need a per-order figure their ESG team can cite — measured against an audited baseline, not estimated from an industry average.</p>', N'Carbon Data Becomes a Line Item | NTI Printing', N'Scope 3 reporting turns the printed carton into a data point. Brands need a per-order carbon figure measured against an audited baseline.'),
        (40, 'zh', N'shorter-runs-more-versions', N'產品線正在分化成區域版、季節版與活動版。經濟批量持續下降，這讓數位與可變資料流程與平版並存，而不是取代平版。', N'<ul><li>可變資料與多版本處理，不必重新製版。</li><li>混合路徑 —— 同一份完稿可分別以平版、數位或 UV 報價。</li><li>依實際需求備貨，而不是為了拿到價格級距而超印。</li></ul>', N'<p>產品線正碎片化成區域版、季節版與活動版。經濟印量持續下降，這讓數位與可變資料流程成為平版的搭配，而不是取代。</p>', N'印刷批量更小、版本更多｜NTI Printing', N'區域版、季節版與活動版讓經濟批量持續下降，數位與可變資料印刷與平版並存，而不是取代平版。'),
        (40, 'en', N'shorter-runs-more-versions', N'Product ranges are fragmenting into regional, seasonal and campaign variants. The economic run length keeps falling, which favours digital and variable-data workflows alongside offset rather than instead of it.', N'<ul><li>Variable data and versioning handled without new plates.</li><li>Hybrid routing — the same artwork quoted offset, digital or UV.</li><li>Right-weighted inventory instead of over-printing to hit a price break.</li></ul>', N'<p>Product ranges are fragmenting into regional, seasonal and campaign variants. The economic run length keeps falling, which favours digital and variable-data workflows alongside offset rather than instead of it.</p>', N'Shorter Print Runs, More Versions | NTI Printing', N'Regional, seasonal and campaign variants keep shrinking run lengths — favouring digital and variable-data printing alongside offset.'),
        (50, 'zh', N'traceability-plate-to-pallet', N'食品接觸與醫藥類的要求把所有人的門檻都拉高了。批次追溯、低遷移油墨系統與檢驗紀錄，正從受管制的品類擴散到一般零售包裝。', N'<ul><li>批次紀錄串起紙材批號、油墨組與印刷批次。</li><li>低遷移、低氣味油墨成為預設，而不是加價選項。</li><li>條碼、色彩與耐磨測試逐單留存紀錄。</li></ul>', N'<p>食品接觸與藥品業務把所有人的標準都拉高了。批次追溯、低遷移油墨系統與檢驗紀錄，正從受管制的類別擴散到一般零售包裝。</p>', N'包裝從印版到棧板的可追溯性｜NTI Printing', N'批次追溯、低遷移油墨與檢驗紀錄，正從食品與醫藥包裝擴散到一般零售包裝。'),
        (50, 'en', N'traceability-plate-to-pallet', N'Food-contact and pharmaceutical work has raised the bar for everyone. Batch traceability, migration-safe ink systems and inspection records are moving from regulated categories into mainstream retail packaging.', N'<ul><li>Batch records linking board lot, ink set and press run.</li><li>Low-migration, low-odour inks as a default rather than an upgrade.</li><li>Barcode, colour and rub testing logged per job.</li></ul>', N'<p>Food-contact and pharmaceutical work has raised the bar for everyone. Batch traceability, migration-safe ink systems and inspection records are moving from regulated categories into mainstream retail packaging.</p>', N'Packaging Traceability from Plate to Pallet | NTI Printing', N'Batch traceability, low-migration inks and inspection records are moving from food and pharma into mainstream retail packaging.');

UPDATE i
SET    i.Slug           = v.Slug,
       i.Summary        = COALESCE(i.Summary, v.Summary),
       i.SeoTitle       = COALESCE(i.SeoTitle, v.SeoTitle),
       i.SeoDescription = COALESCE(i.SeoDescription, v.SeoDescription),
       i.BodyHtml       = CASE WHEN i.BodyHtml = v.OldBodyHtml THEN v.BodyHtml ELSE i.BodyHtml END
FROM   dbo.IndustryTrendI18n i
JOIN   dbo.IndustryTrend t ON t.Id = i.IndustryTrendId AND t.IsDeleted = 0
JOIN   @v v ON v.SortOrder = t.SortOrder AND v.Lang = i.Lang
WHERE  i.Slug = CONCAT('trend-', i.IndustryTrendId)
  -- 同語系已經有人用掉這個 slug（例如客戶自己建了一篇）就跳過，留給後台處理
  AND  NOT EXISTS (SELECT 1 FROM dbo.IndustryTrendI18n x WHERE x.Lang = i.Lang AND x.Slug = v.Slug);

PRINT CONCAT(N'產業趨勢補上正式 slug／摘要／SEO：', @@ROWCOUNT, N' 筆');

COMMIT;
GO
