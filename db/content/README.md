# `db/content/` — 內容匯入

一次性的**編輯內容**匯入腳本，與 `db/seed/`（系統種子）分開：

|  | `db/seed/` | `db/content/` |
|---|---|---|
| 內容 | 角色、權限、分類、固定頁、方案骨架 | 客戶網站的實際內容 |
| 誰擁有 | schema（EF Migration 的 `HasData`） | **CMS**——匯入後由後台管 |
| 執行時機 | 每次建庫 | 一次；之後客戶自己在後台改 |

**不做成 EF 的 `HasData`** 是刻意的：那會讓客戶在後台改一個字之後，
下次部署被種子蓋回去。

## 200_mockup_content.sql

把 `mockup/` 的頁面內容（客戶已確認的設計版本）匯入 CMS，中英雙語。

```bash
node tools/build-content-sql.mjs        # 重新產生（請勿手改 .sql）
sqlcmd -S <server> -d NTI -I -b -i db/content/200_mockup_content.sql
```

冪等：主表以自然鍵（圖片路徑、日期、排序）判斷是否已存在，
i18n 有則更新、無則新增。重跑不會產生重複。

匯入 111 筆內容：

| 單元 | 筆數 | 單元 | 筆數 |
|---|---|---|---|
| 首頁 Banner | 3 | 認證 | 14 |
| 方案品項 | 15 | 客戶 logo | 6 |
| 案例 | 6 | 設備 | 24 |
| 消息 | 12 | 職缺 | 5 |
| 影片 | 4 | 供應商公告 | 5 |
| 常見問題 | 8 | 供應商規範 | 4 |
| 產業趨勢 | 5 | | |

另更新四筆固定方案的封面與文案，並**將它們上架**——種子刻意設為未上架
（「素材與文案到位後由後台上架」），這支腳本補的就是那兩樣。

## 210_legacy_redirects.sql

舊站 nti-printing.com 的 **227 條 301 對照**，匯入後台單元 16「舊網址轉址」。

```bash
node tools/build-redirect-sql.mjs       # 重新產生（請勿手改 .sql／.csv）
sqlcmd -S <server> -d NTI -I -b -i db/content/210_legacy_redirects.sql
```

來源是 `apps/web/src/lib/legacy-redirects.ts`——**前台 middleware 正在用的同一份**，
不是另抄一份。清單本身來自舊站自己的 sitemap（`tools/check-legacy-redirects.mjs` 抓）。
227 條中 156 條有專屬落點，71 條導回該語系首頁（客戶 2026-09-07 決定：舊連結進來不要撞 404）。
舊站 229 個網址扣掉 `/en` 與 `/en/contact` 兩條新舊相同、本來就免轉址的，就是這 227。

⚠ 導回首頁的 71 條 Google 會判成 soft 404，**權重傳不過去**；內容遷移做完要逐條補上
專屬落點（改 `legacy-redirects.ts` 的 `POSTS` 再重跑產生器）。

**冪等，而且已存在的 `FromPath` 一律不動。** 這點與 200 那支不同：轉址表客戶會在後台
編輯，「有就更新」等於重跑一次就把他調整過的落點默默改掉。要整批更新請走後台單元 16 的
**⬆ 匯入 CSV**（吃同目錄的 `210_legacy_redirects.csv`）——那條路徑才是覆蓋，而且會留操作紀錄。

> ⚠ 現階段前台的轉址是 middleware 讀編譯進去的對照表，**不讀這張表**。
> 也就是說客戶現在在後台改這一頁不會影響正式站。等 middleware 改讀 API
> （`RedirectConfiguration` 的覆蓋索引就是為此留的），DB 才成為權威。

## 220_site_setting.sql

**21 網站設定**的值（`SiteSetting`）。種子只建 15 個 key、值留 NULL，這支把專案裡
已經有依據的 11 個補上去。

```bash
pnpm --filter admin seed                # 先重產 apps/admin/src/api/settings.generated.ts
node tools/build-settings-sql.mjs       # 再產生 .sql（請勿手改）
sqlcmd -S <server> -d NTI -I -b -i db/content/220_site_setting.sql
```

來源是 `apps/admin/src/api/settings.generated.ts`——由 `mockup/` 的 HTML 與
`apps/web/src/lib/zh.ts` 抽出，也就是**後台 demo 正在顯示的那一份**。兩邊同一份是重點：
先前 demo 上的設定是手寫的（還寫進了一組編出來的傳真號碼與一個沒人用過的 `sales@`
收件者），資料庫那 15 個 key 卻全是 NULL——客戶在 demo 驗收過的公司資訊，正式站一個字
都不會出現，而兩邊都不對、方向還相反。

**冪等，且已經填過的 key 一律不動**（`WHERE ValueZh IS NULL AND ValueEn IS NULL`）：
這張表客戶會在後台改，覆蓋等於把他填的值默默改掉。要重新匯入請先在後台清空該欄位。

留 NULL 的 4 個是**客戶還沒提供**，不是漏掉：

| key | 為什麼空著 |
|---|---|
| `company.fax` | 客戶未提供（[`STATUS.md`](../../STATUS.md) §八） |
| `social.linkedin`／`youtube` | mockup 的 footer 是 `href="#"`，也沒有其他出處 |
| `mail.bcc` | 沒有這個需求，客戶要再填 |

寫成空字串會讓後台分不出「客戶清空了」與「從來沒填」，所以一個字都不寫。
前台對社群的規則是「填了才顯示」，所以留 NULL 的後果就是那兩個圖示不出現。

`social.facebook` 不在留白之列：結構化資料的 `sameAs` 早就帶著粉專網址
（`apps/web/src/lib/jsonld.ts`，取自客戶現有官網）。那份對 Google 說「有粉專」、
footer 卻一個圖示都不顯示，是同一組事實在兩個地方講反話。公司中文法定名同理，
權威也在那支（`legalName`）。

> ⚠ `company.map_embed` 存的是**地圖網址**、不是整段 `<iframe>`（`ValueType='url'`）：
> 那段標記要進頁面就得走 `dangerouslySetInnerHTML`，等於開一條從後台注入任意 HTML 到
> 公開頁面的路。後台仍然可以整段貼上，`AdminSettingHandler` 存檔時只留 `src`，
> 抽完不是 http(s) 就擋下來。查詢字串目前是地址，不是客戶自己的 Google 商家嵌入碼——
> 客戶給了再換。

## 230_solution_copy.sql

四個固定方案的 **H1、首頁卡片短述、方案頁導言、SEO 標題與描述**，與 mockup 逐字相同（中文取自 zh.ts）。

```bash
node tools/build-solution-copy-sql.mjs   # 重新產生（請勿手改 .sql）
sqlcmd -S <server> -d NTI -I -b -i db/content/230_solution_copy.sql
```

2026-09-24 前台接上這幾個欄位（`/products-*` 四頁、首頁方案卡）之後，資料庫的值會直接出現在頁面上；
而 200 當初寫進去的是提案值（H1 與 mockup 不一致、SEO 標題少了「— NTI Printing」、短述與導言是 NULL）。
**正式庫在部署新版前台之前要先跑這支**，否則那四頁的標題會變。

每個欄位只在「還是空的」或「還是 200 寫進去的提案值」時才補——後台改過的不會被蓋掉，重跑無副作用。
字典還沒翻的 meta description 不寫，前台照舊顯示英文。

## 240_content_sep22.sql

客戶 2026-09-22《English Website Content Map — SEO/GEO Optimised Rewrite》的英文改寫（**只寫 en**）。
原始 docx 不進版控，對照後的文案在產生器裡。

```bash
node tools/build-content-sep22-sql.mjs   # 重新產生（請勿手改 .sql）
sqlcmd -S <server> -d NTI -I -b -i db/content/240_content_sep22.sql
```

- **頁面文字覆寫 10 段**（`PageText`）：文件大半紅字 mockup 早已吸收，逐段比對後真正有差的只剩這些。
  需要 0010 與「頁面文字擴大到所有固定頁」那一版前台。
- **SEO 標題 13 頁**（9 個固定頁＋4 個方案頁；只補空的／預設值）。
- **認證說明 7 筆**（只補空的）。
- **FAQ 10 題，未上架草稿、只有英文**；成本、MOQ、交期三題的答案是空的，待客戶補。

取捨（只收紅字、佔位符拿掉、不收的項目）見產生器檔頭與 [`STATUS.md`](../../STATUS.md)。
產生器會檢查每段原文都在該頁的頁面文字清單裡——mockup 改過字就會直接報錯，不會產出永遠不生效的覆寫。

## 250_content_zh_sep30.sql

客戶 2026-09-30《官網中文文案 — SEO / GEO 關鍵字優化翻譯版》（09-22 英文版的中文翻譯，**只寫 zh**）。
原始 docx 不進版控，對照後的文案在產生器裡。

```bash
node tools/build-content-zh-sep30-sql.mjs   # 重新產生（請勿手改 .sql）
sqlcmd -S <server> -d NTI -I -b -i db/content/250_content_zh_sep30.sql
```

- **頁面文字覆寫 250 段**（`PageText`，zh）：以英文原文為 key 的字典，套到每一個出現該原文的開放頁
  （表單、隱私、職缺、供應商頁除外）；字典已是同一譯法的不重寫。原文找不到會直接報錯。
- **SEO 標題 17 頁＋首頁描述**：只補空的，或 zh 列還是英文複本的。
- **方案頁**：中文 SEO 標題與導言、8 個品項名稱與說明——只換還是 200／230 初稿的值。
- **認證說明 7 筆**（只補空的）、**FAQ 10 題**替 240 的草稿補中文（以英文問題找，已有中文的不動）。

這份稿第一次給出公司中文名「南台彩藝」與口號「勇於綠色印刷」，但只有覆寫到的段落會換；
`zh.ts` 其餘地方仍是「NTI」「勇於印綠」。取捨與沒匯入的段落見產生器檔頭。

## ⚠ 中文是初稿

`tools/content-zh.mjs` 的繁體中文是**機器翻譯初稿，不是客戶核可的文案**。
客戶到目前為止沒有提供中文內容（[`STATUS.md`](../../STATUS.md) §八），
而 `/zh` 全站顯示英文佔位對驗收沒有幫助。**上線前必須由客戶校閱。**

兩個沒有憑據、刻意不編的專有名詞：

- **公司中文名**——repo 裡（mockup、reference、db/seed）都沒出現過，一律保留 `NTI`
- **董事長中文姓名**——英文稿寫 Cheng Chun-Ming，音譯有多種寫法，一律用「鄭董事長」

有公開依據的人名照實譯：行政院副院長鄭麗君、環境部長彭啓明、遠見創辦人高希均教授、文策院。

## 產生器會回報的兩件事

`node tools/build-content-sql.mjs` 會列出需要人決定的項目：

1. **SEO 標題超過 70 字元的消息**（目前 3 篇）——留空而不是截斷。
   截斷會把一句沒寫完的標題送進搜尋結果；NULL 的語意是「還沒填」，前台會沿用文章標題。
2. **mockup 標籤對不到 `db/seed` 分類**（目前 2 個）——`Project:esg`／`Project:retail`
   是設計稿的示範標籤，不在 docs/08 §6.2 定的專案分類裡，已對到最接近的既有分類。
   客戶若要保留原標籤，在後台新增分類後改 `CATEGORY_ALIAS`。

## 260_slug_rename.sql

客戶 2026-10-06「網頁優化」表的 8 個網址更名（`/solutions` → `/printing-solutions` 等，對照見 SQL 檔頭）。
手寫、冪等，只改**還是舊值**的列：

- `Redirect.ToPath`：210 寫入的舊落點（`/zh/solutions` → `/zh/printing-solutions`…）。210 對已存在的 FromPath 會跳過，所以已匯入的庫要靠這支。
- `HomeBanner.LinkUrl`：200 寫入的 `/solutions`。

```bash
sqlcmd -S <server> -d NTI -I -b -i db/content/260_slug_rename.sql
```

## 270_drop_zh_prefix.sql

客戶 2026-10-06 決定中文網址拿掉 `/zh`（中文在根目錄、英文 `/en/`）。手寫、冪等，只改**還是 `/zh` 開頭**的列：

- `Redirect.ToPath`：210 寫入的 `/zh`、`/zh/xxx` → `/`、`/xxx`。
- `Redirect.FromPath`：API 在消息改 slug 時建的 `/zh/news/xxx` → `/news/xxx`（同名已存在就不動）。
- 改完變成自己轉自己的（舊站 `/contact`）設為停用。

```bash
sqlcmd -S <server> -d NTI -I -b -i db/content/270_drop_zh_prefix.sql
```

## 280_menu_rename_oct21.sql

客戶 2026-10-21《NTI WEBSITE 調整》把「包裝紙板」改為「包裝紙卡」、「UV印刷」改為「UV 印刷與特殊加工」。
選單與麵包屑在前台程式裡，但這兩頁的 H1 來自 `SolutionI18n.H1`。手寫、冪等，只改**還是種子值或 230 寫入值**的列：

- `cardboard`：包裝紙板 → 包裝紙卡
- `uv`：UV 印刷 → UV 印刷與特殊加工

只改中文，英文維持原文（客戶確認）。方案名稱（`Name`）與 SEO 標題不動。

```bash
sqlcmd -S <server> -d NTI -I -b -i db/content/280_menu_rename_oct21.sql
```

## 300_keep_en_h1.sql

280 第一版連英文 H1 也改成 Packaging Cards／UV Printing & Special Finishes，且已在正式庫執行。
客戶確認英文維持原文，這支把**還是那兩個值**的英文 H1 改回 Packaging Paperboard／UV Printing。
新建的庫跑的是修正後的 280，這支對它沒有作用。

```bash
sqlcmd -S <server> -d NTI -I -b -i db/content/300_keep_en_h1.sql
```

## 310_cert_detail_list.sql

`about-certifications` 下方四個清單改由資料驅動（2026-10-22）。手寫、冪等；**須先套用 EF migration
`CertificationListItem`**（或參考版 `0016`）：

- 建 10 筆 `CertificationListItem`：色彩標準 2、GMI 通路 6、獎項 2。英文＝mockup 原文，中文＝客戶 09-30 稿
  （稿裡沒有的用 `apps/web/src/lib/zh.ts`）。某區塊已有任何一筆就整塊不動。
- 「管理系統與環境認證」依**英文名稱**勾選 FSC／ISO 14001／ISO 9001／ISO 45001／Mineral Oil Free 的
  `ShowInDetailList`（不靠 Id 也不靠 logo 檔名——正式庫的 MOF 已在後台重新上傳）；已有任何一筆勾選就不動。
  說明只補空的。最後列出對不到的名稱，要到後台手動勾。
- ⚠ 不處理這頁既有的「頁面文字」中文覆寫：區塊大標若被改成別的意思，要在後台清掉或改回。

```bash
sqlcmd -S <server> -d NTI -I -b -i db/content/310_cert_detail_list.sql
```

## 320_projects_hide_cases.sql

Projects 頁隱藏「案例分享」（客戶沒有案例資料，2026-10-25）。前台拿掉區塊與選單，導言刪掉
「…case study highlights below」。頁面文字以英文原文的 hash 為 key，這支用新原文的 hash 補一筆中文
（客戶 09-30 稿去掉「探索…案例精選」）；只動 `projects` 頁，Solutions 頁同一段沒改。冪等。

```bash
sqlcmd -S <server> -d NTI -I -b -i db/content/320_projects_hide_cases.sql
```

## 290_cert_proof_groups.sql

首頁 Proof 牆「品質管理／環境永續／社會責任與安全」三張卡改由後台 08 的「分組」驅動（2026-10-21）。
手寫、冪等；**須先套用 EF migration `CertificationShortName`**（`ShortName` 欄位）：

- 建三個 Certification 分組（code `quality`／`eco`／`safety`，中英名稱＝卡片標題）。
  不放進 EF 種子：`HasData` 要帶固定 Id，可能撞到客戶在正式站後台自建的分類。
  `verify*.sql` 的 Category 筆數斷言因此**整類排除 Certification**（41／82）：正式庫已刪掉種子的
  認證／夥伴／獎項，新建的庫則還有，兩邊都要能過。
- 14 張認證依 logo 檔名分進去——只動**還在原「認證」分組或未分組**的列。
- 補中英簡稱（只補 NULL）。最後列出對不上檔名、仍在原分組的認證（後台換過 logo 的），要在後台手動指定分組。

```bash
sqlcmd -S <server> -d NTI -I -b -i db/content/290_cert_proof_groups.sql
```

