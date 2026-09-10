/* 由 scripts/build-seed.mjs 自 mockup/*.html 與 apps/web/src/lib/zh.ts 產生 —— 請勿手改。
   重新產生：npm run seed

   固定 15 個 key 的值。key 與多語旗標的權威在 Api/Data/Seed/SeedData.cs，
   scripts/check-units.mjs 會比對兩邊；空字串代表「mockup 沒有、客戶還沒給」。

   同一份值也是 db/content/220_site_setting.sql 的來源
   （node tools/build-settings-sql.mjs），demo 看到的設定與匯進資料庫的是同一份。 */

export const SETTING_VALUES: Record<string, string | { zh: string; en: string }> = {
  "company.name": {
    "zh": "NTI Printing Co., Ltd.",
    "en": "NTI Printing Co., Ltd."
  },
  "company.address": {
    "zh": "709 臺南市安南區媽祖宮里工業六路29號",
    "en": "No. 29, Gongye 6th Rd., Annan Dist., Tainan City 709, Taiwan"
  },
  "company.hours": {
    "zh": "週一至週五 08:30–17:30（GMT+8）",
    "en": "Mon–Fri 08:30–17:30 (GMT+8)"
  },
  "company.phone": "+886 6 261 1358",
  "company.fax": "",
  "company.email": "service@nti-printing.com",
  "company.map_embed": "<iframe src=\"https://www.google.com/maps?q=No.+29,+Gongye+6th+Rd.,+Annan+Dist.,+Tainan+City+709,+Taiwan&output=embed\" title=\"NTI Printing — Tainan plant location\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\"></iframe>",
  "social.facebook": "",
  "social.linkedin": "",
  "social.youtube": "",
  "home.gallery_image": "/assets/ref-home-mid1.webp",
  "home.gallery_alt": {
    "zh": "NTI 包裝印刷作品集",
    "en": "A showcase of NTI's printed packaging work"
  },
  "mail.quote_notify_to": "service@nti-printing.com",
  "mail.contact_notify_to": "service@nti-printing.com",
  "mail.bcc": ""
}
