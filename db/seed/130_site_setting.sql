/* =============================================================================
   130_site_setting.sql  —  全站設定的固定 key（docs/08 §6.3、docs/09 §21）
   =============================================================================
   只建立 key 與其型別／多語旗標，實際值 (ValueZh/ValueEn) 留 NULL 由後台填。
   後台以此清單渲染表單，不允許自行新增 key。

   ⚠ 待客戶提供（docs/09 §21、IA §7）：
     company.address 目前 contact.html 用的是台中暫代地址，上線前須換成台南實際
     廠址；company.phone / company.email / company.map_embed 同樣待客戶確認。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

;WITH src (SettingKey, GroupName, ValueType, IsLocalized, SortOrder) AS (
    SELECT * FROM (VALUES
        ('company.name',            'Company', 'text',      1, 10),
        ('company.address',         'Company', 'multiline', 1, 20),   -- ⚠ 台中暫代，待換台南廠址
        ('company.hours',           'Company', 'multiline', 1, 30),
        ('company.phone',           'Company', 'text',      0, 40),
        ('company.fax',             'Company', 'text',      0, 50),
        ('company.email',           'Company', 'email',     0, 60),
        ('company.map_embed',       'Company', 'url',       0, 70),
        ('social.facebook',         'Social',  'url',       0, 10),
        ('social.linkedin',         'Social',  'url',       0, 20),
        ('social.youtube',          'Social',  'url',       0, 30),
        ('home.gallery_image',      'Home',    'image',     0, 10),   -- 首頁形象圖帶
        ('home.gallery_alt',        'Home',    'text',      1, 20),
        ('mail.quote_notify_to',    'Mail',    'email',     0, 10),   -- 逗號分隔多組，儲存時驗格式
        ('mail.contact_notify_to',  'Mail',    'email',     0, 20),
        ('mail.bcc',                'Mail',    'email',     0, 30)
    ) v (SettingKey, GroupName, ValueType, IsLocalized, SortOrder)
)
INSERT dbo.SiteSetting (SettingKey, GroupName, ValueType, IsLocalized, SortOrder)
SELECT s.SettingKey, s.GroupName, s.ValueType, s.IsLocalized, s.SortOrder
FROM src s
WHERE NOT EXISTS (SELECT 1 FROM dbo.SiteSetting t WHERE t.SettingKey = s.SettingKey);
GO
