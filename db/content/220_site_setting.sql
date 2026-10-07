/* =============================================================================
   220_site_setting.sql  —  21 網站設定的值（11 個 key）
   =============================================================================
   由 tools/build-settings-sql.mjs 產生，**請勿手改**（重新產生：node tools/build-settings-sql.mjs）。

   來源：apps/admin/src/api/settings.generated.ts —— 由 mockup 的 HTML 與
   apps/web/src/lib/zh.ts 抽出，與後台 demo 顯示的是同一份值。

   db/seed/130_site_setting.sql（＝ EF 的 HasData）只建 key 與型別、值留 NULL；
   這支補上 mockup 已經有的那些值，客戶才不用把公司資訊重打一遍。

   ⚠ 仍待客戶提供、刻意留 NULL 的 4 個：company.fax、social.linkedin、social.youtube、mail.bcc
     （後台對社群網址的提示是「留空則前台不顯示該圖示」，所以留 NULL 是有意義的狀態，
      不是漏掉。）
   ⚠ 中文值是初稿：來源是 apps/web/src/lib/zh.ts，與 200_mockup_content.sql 同一個
     狀態——**上線前必須由客戶校閱**。公司中文名沒有客戶提供的依據，刻意不編，
     中英兩欄都放英文法定名稱。

   冪等，且**已經填過的 key 一律不動**：這張表客戶會在後台改，覆蓋等於把他填的值
   默默改掉。要重新匯入請先在後台清空該欄位，或直接在後台改。
   ============================================================================= */
SET NOCOUNT ON;
SET XACT_ABORT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

/* key 對不上就整支停下來：這支若默默跳過幾個 key，症狀是前台少一段公司資訊，
   而少的那段長得像「客戶還沒填」。 */
DECLARE @missing NVARCHAR(MAX) = (
    SELECT STRING_AGG(k.SettingKey, N'、')
    FROM (VALUES
        (N'company.name'),
        (N'company.address'),
        (N'company.hours'),
        (N'company.phone'),
        (N'company.email'),
        (N'company.map_embed'),
        (N'social.facebook'),
        (N'home.gallery_image'),
        (N'home.gallery_alt'),
        (N'mail.quote_notify_to'),
        (N'mail.contact_notify_to')
    ) k (SettingKey)
    WHERE NOT EXISTS (SELECT 1 FROM dbo.SiteSetting s WHERE s.SettingKey = k.SettingKey)
);
IF @missing IS NOT NULL
    THROW 50220, N'SiteSetting 沒有這些 key，請先跑 db/seed/130_site_setting.sql 或 EF Migration', 1;
GO

BEGIN TRAN;

UPDATE dbo.SiteSetting SET ValueZh = N'南台彩藝股份有限公司', ValueEn = N'NTI Printing Co., Ltd.', UpdatedAt = SYSUTCDATETIME()
 WHERE SettingKey = N'company.name' AND ValueZh IS NULL AND ValueEn IS NULL;
UPDATE dbo.SiteSetting SET ValueZh = N'709 臺南市安南區媽祖宮里工業六路29號', ValueEn = N'No. 29, Gongye 6th Rd., Annan Dist., Tainan City 709, Taiwan', UpdatedAt = SYSUTCDATETIME()
 WHERE SettingKey = N'company.address' AND ValueZh IS NULL AND ValueEn IS NULL;
UPDATE dbo.SiteSetting SET ValueZh = N'週一至週五 08:30–17:30（GMT+8）', ValueEn = N'Mon–Fri 08:30–17:30 (GMT+8)', UpdatedAt = SYSUTCDATETIME()
 WHERE SettingKey = N'company.hours' AND ValueZh IS NULL AND ValueEn IS NULL;
UPDATE dbo.SiteSetting SET ValueZh = N'+886 6 261 1358', ValueEn = N'+886 6 261 1358', UpdatedAt = SYSUTCDATETIME()
 WHERE SettingKey = N'company.phone' AND ValueZh IS NULL AND ValueEn IS NULL;
UPDATE dbo.SiteSetting SET ValueZh = N'service@nti-printing.com', ValueEn = N'service@nti-printing.com', UpdatedAt = SYSUTCDATETIME()
 WHERE SettingKey = N'company.email' AND ValueZh IS NULL AND ValueEn IS NULL;
UPDATE dbo.SiteSetting SET ValueZh = N'https://www.google.com/maps?q=No.+29,+Gongye+6th+Rd.,+Annan+Dist.,+Tainan+City+709,+Taiwan&output=embed', ValueEn = N'https://www.google.com/maps?q=No.+29,+Gongye+6th+Rd.,+Annan+Dist.,+Tainan+City+709,+Taiwan&output=embed', UpdatedAt = SYSUTCDATETIME()
 WHERE SettingKey = N'company.map_embed' AND ValueZh IS NULL AND ValueEn IS NULL;
UPDATE dbo.SiteSetting SET ValueZh = N'https://www.facebook.com/printingfarm', ValueEn = N'https://www.facebook.com/printingfarm', UpdatedAt = SYSUTCDATETIME()
 WHERE SettingKey = N'social.facebook' AND ValueZh IS NULL AND ValueEn IS NULL;
UPDATE dbo.SiteSetting SET ValueZh = N'assets/ref-home-mid1.webp', ValueEn = N'assets/ref-home-mid1.webp', UpdatedAt = SYSUTCDATETIME()
 WHERE SettingKey = N'home.gallery_image' AND ValueZh IS NULL AND ValueEn IS NULL;
UPDATE dbo.SiteSetting SET ValueZh = N'NTI 包裝印刷作品集', ValueEn = N'A showcase of NTI''s printed packaging work', UpdatedAt = SYSUTCDATETIME()
 WHERE SettingKey = N'home.gallery_alt' AND ValueZh IS NULL AND ValueEn IS NULL;
UPDATE dbo.SiteSetting SET ValueZh = N'service@nti-printing.com', ValueEn = N'service@nti-printing.com', UpdatedAt = SYSUTCDATETIME()
 WHERE SettingKey = N'mail.quote_notify_to' AND ValueZh IS NULL AND ValueEn IS NULL;
UPDATE dbo.SiteSetting SET ValueZh = N'service@nti-printing.com', ValueEn = N'service@nti-printing.com', UpdatedAt = SYSUTCDATETIME()
 WHERE SettingKey = N'mail.contact_notify_to' AND ValueZh IS NULL AND ValueEn IS NULL;

COMMIT;
GO

SELECT COUNT(*) AS 已填設定筆數 FROM dbo.SiteSetting WHERE ValueZh IS NOT NULL OR ValueEn IS NOT NULL;
GO
