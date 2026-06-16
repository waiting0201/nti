# 01 · 設計 Design — Harness 作業書

| 欄位 | 內容 |
|------|------|
| **主責 Agent** | `visual-design-architect` |
| **協作 Agent** | `frontend-architect`（切版可行性回饋）、`software-architect-blueprint`（範圍）、`system-analyst`（SEO 對版型約束） |
| **搭配 Skills** | `frontend-design`、`run`／`verify`（原型實機檢視） |
| **對應階段** | P2（UI/UX 設計 + 原型）／關卡 **G2 設計定稿簽核** |
| **核心定位** | **「轉譯既有視覺 → 設計系統 + RWD」，非從零發想**。設計稿（PSD）與品牌規範已存在。 |

---

## 1. 上游輸入

| 來源 | 路徑 | 用途 |
|------|------|------|
| 設計稿 PSD（5 頁） | `planning/reference/WebsiteDesign/*.psd`（Homepage、NTIdifferences、PrintingSolutions、GreenAdvantage、Facility-Equipment） | 視覺基準，需轉成設計系統 |
| 既有切版稿 mockup | [`mockup/`](../mockup/)（5 頁靜態 HTML + assets） | 已落地的版型現況，設計 token 抽取起點 |
| 品牌規範 CIS | `planning/reference/CISGuideBook/南台彩藝CIS完稿規範.pdf`、`BrandImage/`（中英、橫直式 logo、AI 原檔） | logo 用法、配色、字級的硬約束 |
| 競品分析 | 本檔 [§8 競品設計分析](#8-競品設計分析)（原 reference-website-analysis.md 已併入） | 配色／Hero／數據區／logo 矩陣的設計方向 |
| 規劃書版型需求 | [`planning/NTI_Printing_官網規劃書.md`](../planning/NTI_Printing_官網規劃書.md) §1 前端規劃 | 每頁區塊清單 |

---

## 2. 範圍（對應 sitemap）

需交付設計系統與 RWD 版型的頁面／區塊：

- **共用**：Header（多層下拉、語系切換、會員入口）、Footer、Floating Button（Get a Quote／Contact Us；AI Agent 本期不做）、Cookie/隱私 banner。
- **首頁**：Banner/Videos、COURAGE 品牌精神、Printing 服務、Project 案例卡、Clients 輪播。
- **內容頁**：NTI Difference、Printing Solution（含 4 子方案）、Projects（總覽 + 詳細）、Facility & Equipment、Advantages（綠色優勢，含數據統計區）、NEWS、Green Vlog、Supplier Area、Privacy & Legal。
- **功能頁**：Get a Quote 表單、Contact Us、Member（登入/註冊/會員中心）。

---

## 3. 工作分解

1. **Design Tokens**：自 PSD/CIS 抽出色彩（白底＋深藏青/炭灰文字＋**綠色點綴**）、字體階層、間距、圓角、陰影、斷點（桌機/平板/手機三斷點）。
2. **元件庫（Design System）**：按鈕、卡片、表單元件、導覽、下拉、麵包屑、分頁、tag、數據統計區塊、logo 矩陣、輪播。
3. **頁面版型**：每頁三斷點 RWD 設計稿，標註間距與行為。
4. **可點擊原型**：以 `frontend-design` 產出互動原型供客戶「先看得到再開發」。
5. **設計交付規格**：標註 SEO/無障礙約束（見 §5），交付給 `frontend-architect`。

---

## 4. 設計決策（已定／待定）

- **配色**：白底＋深色文字為底，**綠色作點綴**呼應「Print Green」、與競品（多用藏青/橘）區隔。（已定，來源：競品分析）
- **Hero**：全幅影片 + 永續標語 + CTA（學 Amcor）。
- **綠色優勢**：大數字＋圖示的數據統計區（學 CCL）。
- **認證夥伴**：整齊 logo tile 網格（學 LSC）。
- **導覽**：sticky 頂部 + 多層下拉、語系切換右上（學 Toppan）。
- **待定**：影片來源/規格。

---

## 5. DoD（設計交付驗收條件）

- [ ] Design tokens 與元件庫齊備，命名一致、可被前端直接對應。
- [ ] 每頁交付**桌機／平板／手機**三斷點稿。
- [ ] 標註**避免文字圖片化**（SEO/無障礙）、重要資訊不依賴 JS。
- [ ] 圖片標註預期格式（WebP）、尺寸與壓縮目標（300–500K），利於前端達 Lighthouse 行動版 ≥ 90。
- [ ] i18n：中／英文版型皆檢視（英文較長字串不破版）。
- [ ] logo／配色符合 CIS 完稿規範。
- [ ] 可點擊原型經 `verify` 實機檢視，並通過 **G2 客戶書面簽核**。

---

## 6. 與其他 Agent 的介面

- → `frontend-architect`：交付 design tokens + 元件規格 + 各頁標註稿，作為切版契約。
- ← `frontend-architect`：回饋切版可行性（動畫成本、互動限制）。
- ← `system-analyst`：接收 SEO 對版型的硬約束（H1 唯一、麵包屑、可檢索結構）。

---

## 7. 風險與對策

| 風險 | 對策 |
|------|------|
| 客戶對設計反覆改 | 原型先行 + G2 書面簽核，凍結後走 CR 流程 |
| PSD 與 mockup 不一致 | 以 PSD 為視覺基準，mockup 僅作 token 抽取參考，差異列表給客戶確認 |
| 文字圖片化破壞 SEO | 設計階段即標註「可選取文字」，禁止把標題做成圖 |

---

## 8. 競品設計分析

> 來源：[planning/reference/世界大廠網站.txt](../planning/reference/世界大廠網站.txt)｜分析日期：2026-05-22
> （原 `docs/reference-website-analysis.md`，2026-06-12 併入本設計作業書）

針對 NTI Printing 官網規劃，研究 5 個國際包裝印刷大廠的官網，整理可借鏡的設計方向。

### 8.1 各網站分析

| 網站 | 定位 | 配色 | 視覺主軸 | 風格關鍵 |
|------|------|------|----------|----------|
| [DNP 大日本印刷](https://www.dnp.co.jp/) | 日本印刷綜合大廠 | 白底＋深藏青文字，灰階輔助 | 全幅 hero 影片輪播 | 極簡、企業可信賴、未來感標語 |
| [Toppan 凸版印刷](https://www.holdings.toppan.com/) | 日本印刷綜合大廠 | 白底＋深藏青／黑，灰階分隔線 | 全幅圖片 banner＋強烈標語 CTA | 大膽標語（TOPPA!!!）、多層下拉、三語切換 |
| [LSC Communications](https://www.lsccom.com/) | 美國 B2B 印刷集團 | 深藏青／炭灰＋**橘色點綴** | Logo 矩陣（旗下品牌）為主，少用大圖 | 純 B2B、功能導向、極簡 |
| [CCL Industries](https://www.cclind.com/) | 全球標籤包裝龍頭 | 白底為主，深色文字，靠留白建立層次 | 9 張 hero 輪播說故事＋圖示卡片 | 攝影敘事、數據統計區塊 |
| [Amcor](https://www.amcor.com/) | 全球包裝龍頭 | 中性白底＋深色，極少點綴色 | 全幅產品大圖＋永續標題 | 永續主打、產品攝影、投資人取向、無障礙設計 |

### 8.2 共通模式（5 家一致的做法）

1. **白底＋深藏青/炭灰文字**是此產業的「企業標準色」，靠**大量留白**而非鮮豔色彩建立高級感。
2. **全幅 hero**（影片或大圖輪播）+ 標語 + CTA 是統一開場。
3. **卡片式模組**統一比例與間距，建立節奏感。
4. **sticky 頂部導覽 + 多層下拉**，多語切換放右上角。
5. 偏好**真實攝影／產品照**敘事，少用裝飾性動畫——傳達穩定、可信賴。

### 8.3 對 NTI 官網的具體建議

1. **配色 — 在產業標準上做出 NTI 差異**：其他家都是「白＋藏青」的安全牌。NTI 核心是 **"The Courage to Print Green 永續 All In!"**：主色維持白底＋深色文字（專業可信），**點綴色用「綠」**（呼應永續主軸），手法類似 LSC 用橘色點綴，但換成代表環保的綠，立即與競品區隔，又強化品牌精神。
2. **Hero 區 — 學 Amcor 的永續主打**：首頁 Banner/Videos 與 COURAGE 區塊，採 **全幅影片 + 永續標語 + CTA**（Get a Quote／Contact），首屏即講清「Print Green」精神。
3. **Advantages 綠色優勢 — 學 CCL 的數據統計區塊**：「碳效率、環保材料、ESG」做成 **大數字＋圖示**統計區塊（碳排減量 %、回收材料佔比），把抽象永續變成可信數據。
4. **Certifications & Partnerships — 學 LSC 的 Logo 矩陣**：FSC、ISO 認證與合作夥伴，用**整齊 logo tile 網格**呈現，乾淨且有公信力。
5. **多語與導覽 — 學 Toppan**：中／英雙語需求，採「右上角語系切換＋多層下拉選單」；Printing Solution 子選單照此設計。

---

## 變更紀錄

| 日期 | 修改者 | 摘要 |
|------|--------|------|
| 2026-06-12 | Tim（Claude Code） | 初版：定義設計領域 harness 作業書 |
| 2026-06-12 | Tim（Claude Code） | Floating Button 移除 AI Agent；新增 Pacdora 3D 嵌入版位與報價動線設計需求 |
| 2026-06-12 | Tim（Claude Code） | 併入競品設計分析（原 reference-website-analysis.md）為 §8；移至 docs/ 頂層 |
| 2026-06-16 | Tim（Claude Code） | Pacdora／3D 包裝客製本期不納入（廠商不提供技術崁入服務）；移除 3D 嵌入版位與「客製設計→報價」設計需求 |

*最後更新：2026-06-16*
