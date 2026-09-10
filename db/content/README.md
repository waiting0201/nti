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

**21 網站設定**的值（`SiteSetting`）。種子只建 15 個 key、值留 NULL，這支把 mockup
已經有的 10 個補上去。

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

留 NULL 的 5 個是**客戶還沒提供**，不是漏掉：

| key | 為什麼空著 |
|---|---|
| `company.fax` | 客戶未提供（[`STATUS.md`](../../STATUS.md) §八） |
| `social.facebook`／`linkedin`／`youtube` | mockup 的 footer 是 `href="#"`；後台提示寫明「留空則前台不顯示該圖示」 |
| `mail.bcc` | 沒有這個需求，客戶要再填 |

寫成空字串會讓後台分不出「客戶清空了」與「從來沒填」，所以一個字都不寫。

> ⚠ `company.map_embed` 存的是整段 `<iframe>`（後台那個欄位收的就是「分享 → 嵌入地圖」
> 貼過來的內容），查詢字串是地址，不是客戶自己的 Google 商家嵌入碼——客戶給了再換。
> 種子把這個 key 的 `ValueType` 標成 `url`，與實際存的內容不符，等前台真的要讀它時一併修
> （改 `ValueType` 要產新的 EF Migration）。

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
