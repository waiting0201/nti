---
name: nti-tech-stack-frozen
description: NTI 官網已凍結的技術選型與本期範圍決策（Azure 棧、Dapper、Pacdora、AI 客服暫緩）
metadata:
  type: project
---

NTI 官網技術選型於 **2026-06-12 凍結**：

- **公開網站（前端）**：Next.js（React）**SSR + ISR**（內容頁 SSG+ISR、會員/個人化頁 SSR/CSR），host = **Azure Static Web Apps**（Free 起，SSR 撞限制則退 Container Apps）。需 SEO + GEO。
- **CMS 後台**：自建，**純 SPA（靜態）、不需 SEO、noindex**，與公開站分開部署。
- **API／後端**：**Azure Functions .NET 10（isolated）+ Dapper**（micro-ORM、手寫 SQL，**非 EF Core**），為唯一資料存取層；前端只呼叫 API、不直連 DB。
- **資料庫**：**Azure SQL Database — Basic 層**（客戶定案）。
- **媒體/檔案**：**Azure Blob Storage**（預簽章 URL）。
- **3D 包裝客製**：採 **Pacdora（pacdora.com）** 整合，走 P7「研究→PoC→關卡」，把「客製設計→報價」串成動線；adapter 包覆、授權/金鑰後端持有；備案＝樣板+人工報價（參考案例 riiqi 紙杯）。
- **AI 客服（Claude API/AI Agent 浮動按鈕）**：**本期不納入**，後續再評估。
- **月費估算**：約 $7–18（Azure East Asia）+ Pacdora 授權；成本地板為 SQL Basic（~$5）。
- **mockup 不受影響**：`nti-mockup`（Cloudflare direct upload）維持原樣，與正式站（Azure）兩條獨立部署。

**Why**：客戶為 .NET 班底、要求最省且 Azure；公開站 SEO/GEO 為硬需求故須 SSR/ISR，CMS 後台不需 SEO；資料存取選 Dapper 求效能與查詢可控。
**How to apply**：所有分項 harness 文件（docs/ 攤平：README + 01–07，無子資料夾）已對齊此決策；後續開發以此為準，變更走 CR 並更新各文件「變更紀錄」。唯一待驗證：公開站 SSR 在 SWA Free 額度是否足夠（上線前以實際流量驗）。
