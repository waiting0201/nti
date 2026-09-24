/**
 * 後台「頁面文字」的清單：開放覆寫的固定頁上，每一段可改的文字。
 *
 * **由 `node apps/web/scripts/extract-page-texts.mjs` 產生，不要手改。**
 * `en` 是 mockup 的原文（也是覆寫的 key），`zh` 是 apps/web/src/lib/zh.ts 目前的譯文，
 * `count` 是同一段原文在該頁出現的次數——覆寫會一起改掉每一處。
 */
export type PageTextItem = {
  en: string
  zh: string | null
  kind: 'text' | 'alt'
  section: string
  count: number
}

export const PAGE_TEXTS: Record<string, { mockup: string; items: PageTextItem[] }> = {
  "home": {
    "mockup": "index.html",
    "items": [
      {
        "en": "Taiwan’s Sustainable Packaging & Printing Leader",
        "zh": "台灣永續包裝與印刷的領導者",
        "kind": "text",
        "section": "Taiwan’s Sustainable Packaging & Printing Leader",
        "count": 1
      },
      {
        "en": "The Courage to Print Green",
        "zh": "勇於印綠",
        "kind": "text",
        "section": "Taiwan’s Sustainable Packaging & Printing Leader",
        "count": 1
      },
      {
        "en": "NTI Printing is Taiwan’s pioneer eco-friendly printing company and sustainable packaging manufacturer, combining uncompromising digital-first quality with measurable environmental responsibility.",
        "zh": "NTI Printing 是台灣環保印刷的先行者與永續包裝製造商，把毫不妥協的數位優先品質，與可量測的環境責任結合在一起。",
        "kind": "text",
        "section": "Taiwan’s Sustainable Packaging & Printing Leader",
        "count": 1
      },
      {
        "en": "What We Do",
        "zh": "我們做什麼",
        "kind": "text",
        "section": "What We Do",
        "count": 1
      },
      {
        "en": "Step",
        "zh": "步驟",
        "kind": "text",
        "section": "What We Do",
        "count": 4
      },
      {
        "en": "Structural Design",
        "zh": "結構設計",
        "kind": "text",
        "section": "What We Do",
        "count": 1
      },
      {
        "en": "Optimized packaging that reduces material use and waste.",
        "zh": "最佳化的包裝設計，減少材料使用與廢棄。",
        "kind": "text",
        "section": "What We Do",
        "count": 1
      },
      {
        "en": "Pre-Press (CTP)",
        "zh": "製版（CTP）",
        "kind": "text",
        "section": "What We Do",
        "count": 1
      },
      {
        "en": "Digital plate-making improves quality while reducing pollution.",
        "zh": "數位製版提升品質，同時降低污染。",
        "kind": "text",
        "section": "What We Do",
        "count": 1
      },
      {
        "en": "Printing",
        "zh": "印刷",
        "kind": "text",
        "section": "What We Do",
        "count": 1
      },
      {
        "en": "Energy-efficient production with lower waste and emissions.",
        "zh": "節能生產，更少的廢棄與排放。",
        "kind": "text",
        "section": "What We Do",
        "count": 1
      },
      {
        "en": "Finishing",
        "zh": "加工",
        "kind": "text",
        "section": "What We Do",
        "count": 1
      },
      {
        "en": "Foil stamping, embossing and specialty coatings.",
        "zh": "燙金、壓凸與特殊塗層。",
        "kind": "text",
        "section": "What We Do",
        "count": 1
      },
      {
        "en": "Printing Solutions",
        "zh": "印刷解決方案",
        "kind": "text",
        "section": "Printing Solutions",
        "count": 1
      },
      {
        "en": "Paper box printing",
        "zh": "紙盒印刷",
        "kind": "alt",
        "section": "Printing Solutions",
        "count": 1
      },
      {
        "en": "Customize package",
        "zh": "客製化包裝",
        "kind": "text",
        "section": "Printing Solutions",
        "count": 1
      },
      {
        "en": "More details »",
        "zh": "更多細節 »",
        "kind": "text",
        "section": "Printing Solutions",
        "count": 4
      },
      {
        "en": "Packaging paperboard printing",
        "zh": "包裝紙板印刷",
        "kind": "alt",
        "section": "Printing Solutions",
        "count": 1
      },
      {
        "en": "Various packaging paperboards",
        "zh": "多樣的包裝紙板",
        "kind": "text",
        "section": "Printing Solutions",
        "count": 1
      },
      {
        "en": "UV printing",
        "zh": "UV 印刷",
        "kind": "alt",
        "section": "Printing Solutions",
        "count": 1
      },
      {
        "en": "Special printing",
        "zh": "特殊印刷",
        "kind": "text",
        "section": "Printing Solutions",
        "count": 1
      },
      {
        "en": "Other printing — hand bags, calendars, manuals",
        "zh": "其他印刷 —— 手提袋、月曆、說明書",
        "kind": "alt",
        "section": "Printing Solutions",
        "count": 1
      },
      {
        "en": "Beyond the box",
        "zh": "不只是盒子",
        "kind": "text",
        "section": "Printing Solutions",
        "count": 1
      },
      {
        "en": "A showcase of NTI's printed packaging work",
        "zh": "NTI 包裝印刷作品集",
        "kind": "alt",
        "section": "Printing Solutions",
        "count": 1
      },
      {
        "en": "Why global brands choose NTI?",
        "zh": "國際品牌為什麼選擇 NTI？",
        "kind": "text",
        "section": "Why global brands choose NTI?",
        "count": 1
      },
      {
        "en": "Direct Delivery",
        "zh": "直送交付",
        "kind": "text",
        "section": "Why global brands choose NTI?",
        "count": 1
      },
      {
        "en": "Straight to factories, suppliers, warehouses, or assembly plants.",
        "zh": "直達工廠、供應商、倉庫或組裝廠。",
        "kind": "text",
        "section": "Why global brands choose NTI?",
        "count": 1
      },
      {
        "en": "Simplified Coordination",
        "zh": "簡化協調",
        "kind": "text",
        "section": "Why global brands choose NTI?",
        "count": 1
      },
      {
        "en": "One trusted partner across Taiwan and Asia.",
        "zh": "橫跨台灣與亞洲，只需一個值得信賴的夥伴。",
        "kind": "text",
        "section": "Why global brands choose NTI?",
        "count": 1
      },
      {
        "en": "Faster Lead Times",
        "zh": "更短的交期",
        "kind": "text",
        "section": "Why global brands choose NTI?",
        "count": 1
      },
      {
        "en": "Shorter supply chains and quicker production cycles.",
        "zh": "更短的供應鏈與更快的生產週期。",
        "kind": "text",
        "section": "Why global brands choose NTI?",
        "count": 1
      },
      {
        "en": "Green Printing",
        "zh": "綠色印刷",
        "kind": "text",
        "section": "Why global brands choose NTI?",
        "count": 1
      },
      {
        "en": "Sustainable printing solutions and smart factory manufacturing.",
        "zh": "永續的印刷方案與智慧工廠製造。",
        "kind": "text",
        "section": "Why global brands choose NTI?",
        "count": 1
      },
      {
        "en": "Premium Quality",
        "zh": "頂級品質",
        "kind": "text",
        "section": "Why global brands choose NTI?",
        "count": 1
      },
      {
        "en": "Reliable global logistics without compromising print quality.",
        "zh": "可靠的全球物流，印刷品質不打折。",
        "kind": "text",
        "section": "Why global brands choose NTI?",
        "count": 1
      },
      {
        "en": "One Trusted Partner",
        "zh": "一個值得信賴的夥伴",
        "kind": "text",
        "section": "Why global brands choose NTI?",
        "count": 1
      },
      {
        "en": "From design and materials to final delivery.",
        "zh": "從設計、材料到最終交付。",
        "kind": "text",
        "section": "Why global brands choose NTI?",
        "count": 1
      },
      {
        "en": "Proof",
        "zh": "實證",
        "kind": "text",
        "section": "Proof",
        "count": 1
      },
      {
        "en": "Through action, not words.",
        "zh": "用行動，不是用說的。",
        "kind": "text",
        "section": "Proof",
        "count": 1
      },
      {
        "en": "Our Clients",
        "zh": "我們的客戶",
        "kind": "text",
        "section": "Our Clients",
        "count": 1
      },
      {
        "en": "Trusted by leading domestic and international brands.",
        "zh": "國內外領導品牌的信賴之選。",
        "kind": "text",
        "section": "Our Clients",
        "count": 1
      }
    ]
  },
  "about-hub": {
    "mockup": "differences.html",
    "items": [
      {
        "en": "Colorful NTI paper-craft animal packaging figures",
        "zh": "NTI 紙藝動物造型包裝",
        "kind": "alt",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Home",
        "zh": "首頁",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "About Us",
        "zh": "關於我們",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "The NTI Difference — Where Sustainability Meets Uncompromising Quality",
        "zh": "NTI 的與眾不同 —— 永續與極致品質的交會",
        "kind": "text",
        "section": "The NTI Difference — Where Sustainability Meets Uncompromising Quality",
        "count": 1
      },
      {
        "en": "What makes NTI different is not the machines. It is how we take your constraint — food safety, pharma compliance, carbon targets — and hand back a working solution.",
        "zh": "NTI 的不同不在機器，而在於我們如何接下您的限制條件 —— 食品安全、藥品法規、碳目標 —— 再交還一套可行的解決方案。",
        "kind": "text",
        "section": "The NTI Difference — Where Sustainability Meets Uncompromising Quality",
        "count": 1
      },
      {
        "en": "The NTI Difference",
        "zh": "NTI 的與眾不同",
        "kind": "text",
        "section": "The NTI Difference",
        "count": 1
      },
      {
        "en": "Beyond Ink. A mindset of sustainability.",
        "zh": "不只是油墨，而是一種永續的思維。",
        "kind": "text",
        "section": "Beyond Ink. A mindset of sustainability.",
        "count": 1
      },
      {
        "en": "Today, NTI Printing stands as one of Taiwan’s most certified eco-friendly printing companies and a trusted sustainable printing partner for global brands — proving that premium quality and environmental responsibility can thrive together. We deliver the sharpest prints, the richest colors, and the smallest footprint.",
        "zh": "今日的 NTI Printing 是台灣獲得最多環保認證的印刷廠之一，也是國際品牌信賴的永續印刷夥伴 —— 證明頂級品質與環境責任可以並存。我們交出最銳利的印紋、最飽滿的色彩，以及最小的環境足跡。",
        "kind": "text",
        "section": "Beyond Ink. A mindset of sustainability.",
        "count": 1
      },
      {
        "en": "NTI. The Courage to Print Green.",
        "zh": "NTI。勇於印綠。",
        "kind": "text",
        "section": "Beyond Ink. A mindset of sustainability.",
        "count": 1
      },
      {
        "en": "Since 1968",
        "zh": "自 1968 年",
        "kind": "text",
        "section": "Beyond Ink. A mindset of sustainability.",
        "count": 1
      },
      {
        "en": "More details ›",
        "zh": "更多細節 ›",
        "kind": "text",
        "section": "Beyond Ink. A mindset of sustainability.",
        "count": 3
      },
      {
        "en": "NTI leadership on the pressroom floor",
        "zh": "NTI 經營團隊於印刷廠區",
        "kind": "alt",
        "section": "Beyond Ink. A mindset of sustainability.",
        "count": 1
      },
      {
        "en": "Benefits to Clients",
        "zh": "客戶得到的效益",
        "kind": "text",
        "section": "Benefits to Clients",
        "count": 1
      },
      {
        "en": "A Smarter Global Packaging Partner",
        "zh": "更聰明的全球包裝夥伴",
        "kind": "text",
        "section": "A Smarter Global Packaging Partner",
        "count": 1
      },
      {
        "en": "Why Global Brands Choose NTI",
        "zh": "國際品牌為什麼選擇 NTI",
        "kind": "text",
        "section": "A Smarter Global Packaging Partner",
        "count": 1
      },
      {
        "en": "NTI helps global brands create premium, sustainable packaging and custom packaging boxes that protect products, strengthen brand value, and reduce environmental impact. Combining world-class printing with advanced digital technology and responsible manufacturing, we support domestic and international clients with complete packaging solutions, efficient supply chain coordination, and direct global delivery.",
        "zh": "NTI 協助國際品牌打造兼具質感與永續的包裝與客製化彩盒，保護產品、強化品牌價值，同時降低環境衝擊。我們以世界級印刷結合先進數位技術與負責任的生產方式，為國內外客戶提供完整的包裝解決方案、高效率的供應鏈協作，以及直送全球的交付服務。",
        "kind": "text",
        "section": "A Smarter Global Packaging Partner",
        "count": 1
      },
      {
        "en": "Sustainable packaging that meets international environmental standards.",
        "zh": "符合國際環保標準的永續包裝。",
        "kind": "text",
        "section": "A Smarter Global Packaging Partner",
        "count": 1
      },
      {
        "en": "Direct delivery to factories, suppliers, warehouses, or assembly plants.",
        "zh": "直送工廠、供應商、倉庫或組裝廠。",
        "kind": "text",
        "section": "A Smarter Global Packaging Partner",
        "count": 1
      },
      {
        "en": "Simplified coordination across Taiwan and Asia.",
        "zh": "簡化台灣與亞洲各據點之間的協調作業。",
        "kind": "text",
        "section": "A Smarter Global Packaging Partner",
        "count": 1
      },
      {
        "en": "Reduced handling, transportation, and packaging waste.",
        "zh": "減少搬運、運輸與包裝廢棄物。",
        "kind": "text",
        "section": "A Smarter Global Packaging Partner",
        "count": 1
      },
      {
        "en": "Faster production and shorter supply chain lead times.",
        "zh": "更快的生產速度與更短的供應鏈前置時間。",
        "kind": "text",
        "section": "A Smarter Global Packaging Partner",
        "count": 1
      },
      {
        "en": "Premium print quality with reliable global logistics.",
        "zh": "高階印刷品質，搭配可靠的全球物流。",
        "kind": "text",
        "section": "A Smarter Global Packaging Partner",
        "count": 1
      },
      {
        "en": "One trusted partner from design to final delivery.",
        "zh": "從設計到交付，只需一個值得信賴的夥伴。",
        "kind": "text",
        "section": "A Smarter Global Packaging Partner",
        "count": 1
      },
      {
        "en": "NTI Printing headquarters in Tainan, Taiwan",
        "zh": "NTI Printing 台南總部",
        "kind": "alt",
        "section": "A Smarter Global Packaging Partner",
        "count": 1
      },
      {
        "en": "Certifications, Partnerships & Awards",
        "zh": "認證、夥伴與獲獎",
        "kind": "text",
        "section": "Certifications, Partnerships & Awards",
        "count": 1
      },
      {
        "en": "Proving our promise through action",
        "zh": "以行動證明我們的承諾",
        "kind": "text",
        "section": "Proving our promise through action",
        "count": 1
      },
      {
        "en": "NTI Printing holds FSC CoC certification, G7 Master Printer status, and ISO 9001/14001 certification, making it one of Taiwan’s most certified eco-friendly printing manufacturers.",
        "zh": "NTI Printing 具備 FSC CoC 認證、G7 Master Printer 資格與 ISO 9001／14001 認證，是台灣獲得最多認證的環保印刷廠之一。",
        "kind": "text",
        "section": "Proving our promise through action",
        "count": 1
      },
      {
        "en": "Green printing is more than a process — it is the way we do business. Every decision, from the materials we select to the equipment we invest in, is guided by our commitment to sustainability. Through energy-efficient production, low-emission inks, wastewater recycling, solvent recovery, solar energy, and ongoing carbon footprint reduction, NTI proves that exceptional printing and environmental responsibility can thrive together.",
        "zh": "綠色印刷不只是一道製程，而是我們經營事業的方式。從選用的材料到投資的設備，每一個決定都以永續承諾為依歸。透過節能生產、低排放油墨、廢水回收、溶劑回收、太陽能與持續的碳足跡減量，NTI 證明了卓越印刷與環境責任可以並存。",
        "kind": "text",
        "section": "Proving our promise through action",
        "count": 1
      },
      {
        "en": "That’s The Courage to Print Green.",
        "zh": "這就是「勇於印綠」。",
        "kind": "text",
        "section": "Proving our promise through action",
        "count": 1
      },
      {
        "en": "Range of NTI sustainably printed pattern packaging",
        "zh": "NTI 永續印刷的多款圖樣包裝",
        "kind": "alt",
        "section": "Proving our promise through action",
        "count": 1
      },
      {
        "en": "Factory Tour",
        "zh": "工廠導覽",
        "kind": "text",
        "section": "Factory Tour",
        "count": 1
      },
      {
        "en": "People are part of our sustainability journey",
        "zh": "人，是我們永續旅程的一部分",
        "kind": "text",
        "section": "People are part of our sustainability journey",
        "count": 1
      },
      {
        "en": "At NTI Printing, ESG begins with people. Our state-of-the-art, fully air-conditioned facility is designed to provide a safe, comfortable, and inspiring workplace for every member of our team. From modern offices and efficient production floors to staff restaurants, library, dormitories, and shared spaces, we continually invest in the wellbeing of both our local and international employees. By creating an environment where people can thrive, we build a stronger culture, deliver better quality, and support a more sustainable future as a trusted sustainable packaging manufacturer in Taiwan.",
        "zh": "在 NTI Printing，ESG 從人開始。我們全廠空調的先進廠房，是為了給每一位同仁安全、舒適且能激發靈感的工作環境而設計。從現代化辦公室、高效率生產線，到員工餐廳、圖書室、宿舍與共用空間，我們持續投資本地與外籍同仁的福祉。營造讓人能夠發揮的環境，我們才能建立更強的文化、交出更好的品質，並以台灣值得信賴的永續包裝製造商的角色，支持更永續的未來。",
        "kind": "text",
        "section": "People are part of our sustainability journey",
        "count": 1
      },
      {
        "en": "Take a factory tour",
        "zh": "來一趟工廠導覽",
        "kind": "text",
        "section": "People are part of our sustainability journey",
        "count": 1
      },
      {
        "en": "NTI Green Printing",
        "zh": "NTI 綠色印刷",
        "kind": "alt",
        "section": "People are part of our sustainability journey",
        "count": 1
      },
      {
        "en": "FSC certified",
        "zh": "FSC 認證",
        "kind": "alt",
        "section": "People are part of our sustainability journey",
        "count": 1
      },
      {
        "en": "LEED Leadership in Energy and Environmental Design",
        "zh": "LEED 能源與環境設計領導認證",
        "kind": "alt",
        "section": "People are part of our sustainability journey",
        "count": 1
      },
      {
        "en": "Mineral Oil Free",
        "zh": "無礦物油",
        "kind": "alt",
        "section": "People are part of our sustainability journey",
        "count": 1
      }
    ]
  },
  "about-difference": {
    "mockup": "about-difference.html",
    "items": [
      {
        "en": "NTI leadership on the pressroom floor",
        "zh": "NTI 經營團隊於印刷廠區",
        "kind": "alt",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Home",
        "zh": "首頁",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "About Us",
        "zh": "關於我們",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "The NTI Difference",
        "zh": "NTI 的與眾不同",
        "kind": "text",
        "section": "頁首",
        "count": 2
      },
      {
        "en": "The NTI Difference — Where Sustainability Meets Uncompromising Quality",
        "zh": "NTI 的與眾不同 —— 永續與極致品質的交會",
        "kind": "text",
        "section": "The NTI Difference — Where Sustainability Meets Uncompromising Quality",
        "count": 1
      },
      {
        "en": "Beyond Ink. A mindset of sustainability.",
        "zh": "不只是油墨，而是一種永續的思維。",
        "kind": "text",
        "section": "The NTI Difference — Where Sustainability Meets Uncompromising Quality",
        "count": 1
      },
      {
        "en": "Benefits to Clients",
        "zh": "客戶得到的效益",
        "kind": "text",
        "section": "The NTI Difference — Where Sustainability Meets Uncompromising Quality",
        "count": 1
      },
      {
        "en": "Certifications, Partnerships & Awards",
        "zh": "認證、夥伴與獲獎",
        "kind": "text",
        "section": "The NTI Difference — Where Sustainability Meets Uncompromising Quality",
        "count": 1
      },
      {
        "en": "Factory Tour",
        "zh": "工廠導覽",
        "kind": "text",
        "section": "The NTI Difference — Where Sustainability Meets Uncompromising Quality",
        "count": 1
      },
      {
        "en": "Today, NTI Printing stands as one of Taiwan’s most certified eco-friendly printing companies and a trusted sustainable printing partner for global brands — proving that premium quality and environmental responsibility can thrive together. We deliver the sharpest prints, the richest colors, and the smallest footprint.",
        "zh": "今日的 NTI Printing 是台灣獲得最多環保認證的印刷廠之一，也是國際品牌信賴的永續印刷夥伴 —— 證明頂級品質與環境責任可以並存。我們交出最銳利的印紋、最飽滿的色彩，以及最小的環境足跡。",
        "kind": "text",
        "section": "The NTI Difference — Where Sustainability Meets Uncompromising Quality",
        "count": 1
      },
      {
        "en": "NTI. The Courage to Print Green.",
        "zh": "NTI。勇於印綠。",
        "kind": "text",
        "section": "The NTI Difference — Where Sustainability Meets Uncompromising Quality",
        "count": 1
      },
      {
        "en": "Since 1968",
        "zh": "自 1968 年",
        "kind": "text",
        "section": "The NTI Difference — Where Sustainability Meets Uncompromising Quality",
        "count": 1
      },
      {
        "en": "Sustainability First",
        "zh": "永續優先",
        "kind": "text",
        "section": "The NTI Difference — Where Sustainability Meets Uncompromising Quality",
        "count": 1
      },
      {
        "en": "We follow the 4 Rs — Reduce, Reuse, Recover, Recycle — to cut waste, save energy and keep material in circulation rather than in landfill.",
        "zh": "我們奉行 4R —— 減量、再利用、回收再生、循環再造 —— 減少廢棄、節省能源，讓材料留在循環中而不是進掩埋場。",
        "kind": "text",
        "section": "The NTI Difference — Where Sustainability Meets Uncompromising Quality",
        "count": 1
      },
      {
        "en": "Digital Green Printing",
        "zh": "數位綠色印刷",
        "kind": "text",
        "section": "The NTI Difference — Where Sustainability Meets Uncompromising Quality",
        "count": 1
      },
      {
        "en": "Digital pre-press and workflow automation remove make-ready sheets, cut ink consumption and shrink the carbon cost of every short run.",
        "zh": "數位製版與流程自動化省去試印調機的紙張、降低油墨用量，也縮小每一批少量印件的碳成本。",
        "kind": "text",
        "section": "The NTI Difference — Where Sustainability Meets Uncompromising Quality",
        "count": 1
      },
      {
        "en": "Future-Ready Thinking",
        "zh": "超前部署的思維",
        "kind": "text",
        "section": "The NTI Difference — Where Sustainability Meets Uncompromising Quality",
        "count": 1
      },
      {
        "en": "We invest in green technology before regulation forces it, so our clients are already compliant when the requirement arrives.",
        "zh": "我們在法規要求之前就投資綠色技術，因此當要求真的到來時，客戶早已符合規範。",
        "kind": "text",
        "section": "The NTI Difference — Where Sustainability Meets Uncompromising Quality",
        "count": 1
      },
      {
        "en": "Material Responsibility",
        "zh": "材料責任",
        "kind": "text",
        "section": "The NTI Difference — Where Sustainability Meets Uncompromising Quality",
        "count": 1
      },
      {
        "en": "FSC™-certified substrates, low-VOC eco-inks and RoHS-compliant formulations — safer for food contact, cleaner for the environment.",
        "zh": "FSC™ 認證紙材、低 VOC 環保油墨與符合 RoHS 的配方 —— 對食品接觸更安全，對環境更友善。",
        "kind": "text",
        "section": "The NTI Difference — Where Sustainability Meets Uncompromising Quality",
        "count": 1
      },
      {
        "en": "Integrated Innovation",
        "zh": "整合式創新",
        "kind": "text",
        "section": "The NTI Difference — Where Sustainability Meets Uncompromising Quality",
        "count": 1
      },
      {
        "en": "Colour management, in-line measurement and smart production systems raise precision and repeatability while removing rework.",
        "zh": "色彩管理、線上量測與智慧生產系統提升精準度與可重現性，同時免去重工。",
        "kind": "text",
        "section": "The NTI Difference — Where Sustainability Meets Uncompromising Quality",
        "count": 1
      },
      {
        "en": "NTI Printing headquarters in Tainan, Taiwan",
        "zh": "NTI Printing 台南總部",
        "kind": "alt",
        "section": "The NTI Difference — Where Sustainability Meets Uncompromising Quality",
        "count": 1
      },
      {
        "en": "Core values",
        "zh": "核心價值",
        "kind": "text",
        "section": "Core values",
        "count": 1
      },
      {
        "en": "Honesty and Integrity",
        "zh": "誠信正直",
        "kind": "text",
        "section": "Core values",
        "count": 1
      },
      {
        "en": "We respect intellectual property rights, and select and work with suppliers on an objective, impartial basis.",
        "zh": "我們尊重智慧財產權，並以客觀公正的原則挑選與往來供應商。",
        "kind": "text",
        "section": "Core values",
        "count": 1
      },
      {
        "en": "Keep Commitment",
        "zh": "信守承諾",
        "kind": "text",
        "section": "Core values",
        "count": 1
      },
      {
        "en": "We stay committed to shareholders, employees, suppliers and society, balancing and protecting the interests of each — and we ask the same of our partners.",
        "zh": "我們對股東、員工、供應商與社會信守承諾，兼顧並保障各方的利益 —— 也以同樣的標準要求合作夥伴。",
        "kind": "text",
        "section": "Core values",
        "count": 1
      },
      {
        "en": "Mutual Trust and Assistance",
        "zh": "互信互助",
        "kind": "text",
        "section": "Core values",
        "count": 1
      },
      {
        "en": "Long-term, win-win partnerships with customers and employees are built on mutual trust and practical support.",
        "zh": "與客戶及員工建立長期雙贏的夥伴關係，靠的是彼此信任與實際的支持。",
        "kind": "text",
        "section": "Core values",
        "count": 1
      },
      {
        "en": "Vision, mission and strategy",
        "zh": "願景、使命與策略",
        "kind": "text",
        "section": "Vision, mission and strategy",
        "count": 1
      },
      {
        "en": "Vision.",
        "zh": "願景。",
        "kind": "text",
        "section": "Vision, mission and strategy",
        "count": 1
      },
      {
        "en": "We place great significance in our employees, our product quality and the environment, working to be an outstanding printing company in the packaging field.",
        "zh": "我們高度重視員工、產品品質與環境，致力成為包裝領域中卓越的印刷企業。",
        "kind": "text",
        "section": "Vision, mission and strategy",
        "count": 1
      },
      {
        "en": "Mission.",
        "zh": "使命。",
        "kind": "text",
        "section": "Vision, mission and strategy",
        "count": 1
      },
      {
        "en": "Keep promoting green packaging and build the full concept of green supply-chain management for our customers — becoming a printing firm with genuine environmental awareness and a high sense of social responsibility.",
        "zh": "持續推廣綠色包裝，為客戶建構完整的綠色供應鏈管理概念 —— 成為真正具備環境意識與高度社會責任感的印刷企業。",
        "kind": "text",
        "section": "Vision, mission and strategy",
        "count": 1
      },
      {
        "en": "Strategy.",
        "zh": "策略。",
        "kind": "text",
        "section": "Vision, mission and strategy",
        "count": 1
      },
      {
        "en": "Serve customers with all-round service and high product quality to raise satisfaction; create value and profit to sustain the business; and keep developing new technology and certification to open up new opportunities.",
        "zh": "以全方位服務與高品質產品提升客戶滿意度；創造價值與利潤以永續經營；並持續開發新技術與認證，開拓新的機會。",
        "kind": "text",
        "section": "Vision, mission and strategy",
        "count": 1
      },
      {
        "en": "See our printing solutions",
        "zh": "看看我們的印刷解決方案",
        "kind": "text",
        "section": "Vision, mission and strategy",
        "count": 1
      },
      {
        "en": "Want this applied to your packaging? Send us the brief and we will come back with a spec and a quote.",
        "zh": "想把這套做法用在您的包裝上？把需求寄給我們，我們會回覆規格與報價。",
        "kind": "text",
        "section": "Vision, mission and strategy",
        "count": 1
      },
      {
        "en": "Get a Quote",
        "zh": "索取報價",
        "kind": "text",
        "section": "Vision, mission and strategy",
        "count": 1
      },
      {
        "en": "Next: Client Benefits",
        "zh": "下一頁：客戶效益",
        "kind": "text",
        "section": "Vision, mission and strategy",
        "count": 1
      }
    ]
  },
  "about-benefits": {
    "mockup": "about-benefits.html",
    "items": [
      {
        "en": "Range of NTI sustainably printed pattern packaging",
        "zh": "NTI 永續印刷的多款圖樣包裝",
        "kind": "alt",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Home",
        "zh": "首頁",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "About Us",
        "zh": "關於我們",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Benefits to Clients",
        "zh": "客戶得到的效益",
        "kind": "text",
        "section": "頁首",
        "count": 2
      },
      {
        "en": "A Smarter Global Packaging Partner",
        "zh": "更聰明的全球包裝夥伴",
        "kind": "text",
        "section": "A Smarter Global Packaging Partner",
        "count": 1
      },
      {
        "en": "Why Global Brands Choose NTI",
        "zh": "國際品牌為什麼選擇 NTI",
        "kind": "text",
        "section": "A Smarter Global Packaging Partner",
        "count": 1
      },
      {
        "en": "The NTI Difference",
        "zh": "NTI 的與眾不同",
        "kind": "text",
        "section": "A Smarter Global Packaging Partner",
        "count": 1
      },
      {
        "en": "Certifications, Partnerships & Awards",
        "zh": "認證、夥伴與獲獎",
        "kind": "text",
        "section": "A Smarter Global Packaging Partner",
        "count": 1
      },
      {
        "en": "Factory Tour",
        "zh": "工廠導覽",
        "kind": "text",
        "section": "A Smarter Global Packaging Partner",
        "count": 1
      },
      {
        "en": "NTI helps global brands create premium, sustainable packaging and custom packaging boxes that protect products, strengthen brand value, and reduce environmental impact. Combining world-class printing with advanced digital technology and responsible manufacturing, we support domestic and international clients with complete packaging solutions, efficient supply chain coordination, and direct global delivery.",
        "zh": "NTI 協助國際品牌打造兼具質感與永續的包裝與客製化彩盒，保護產品、強化品牌價值，同時降低環境衝擊。我們以世界級印刷結合先進數位技術與負責任的生產方式，為國內外客戶提供完整的包裝解決方案、高效率的供應鏈協作，以及直送全球的交付服務。",
        "kind": "text",
        "section": "A Smarter Global Packaging Partner",
        "count": 1
      },
      {
        "en": "Direct Delivery",
        "zh": "直送交付",
        "kind": "text",
        "section": "A Smarter Global Packaging Partner",
        "count": 1
      },
      {
        "en": "Straight to factories, suppliers, warehouses, or assembly plants.",
        "zh": "直達工廠、供應商、倉庫或組裝廠。",
        "kind": "text",
        "section": "A Smarter Global Packaging Partner",
        "count": 1
      },
      {
        "en": "Simplified Coordination",
        "zh": "簡化協調",
        "kind": "text",
        "section": "A Smarter Global Packaging Partner",
        "count": 1
      },
      {
        "en": "One trusted partner across Taiwan and Asia.",
        "zh": "橫跨台灣與亞洲，只需一個值得信賴的夥伴。",
        "kind": "text",
        "section": "A Smarter Global Packaging Partner",
        "count": 1
      },
      {
        "en": "Faster Lead Times",
        "zh": "更短的交期",
        "kind": "text",
        "section": "A Smarter Global Packaging Partner",
        "count": 1
      },
      {
        "en": "Shorter supply chains and quicker production cycles.",
        "zh": "更短的供應鏈與更快的生產週期。",
        "kind": "text",
        "section": "A Smarter Global Packaging Partner",
        "count": 1
      },
      {
        "en": "Green Printing",
        "zh": "綠色印刷",
        "kind": "text",
        "section": "A Smarter Global Packaging Partner",
        "count": 1
      },
      {
        "en": "Sustainable printing solutions and smart factory manufacturing.",
        "zh": "永續的印刷方案與智慧工廠製造。",
        "kind": "text",
        "section": "A Smarter Global Packaging Partner",
        "count": 1
      },
      {
        "en": "Premium Quality",
        "zh": "頂級品質",
        "kind": "text",
        "section": "A Smarter Global Packaging Partner",
        "count": 1
      },
      {
        "en": "Reliable global logistics without compromising print quality.",
        "zh": "可靠的全球物流，印刷品質不打折。",
        "kind": "text",
        "section": "A Smarter Global Packaging Partner",
        "count": 1
      },
      {
        "en": "One Trusted Partner",
        "zh": "一個值得信賴的夥伴",
        "kind": "text",
        "section": "A Smarter Global Packaging Partner",
        "count": 1
      },
      {
        "en": "From design and materials to final delivery.",
        "zh": "從設計、材料到最終交付。",
        "kind": "text",
        "section": "A Smarter Global Packaging Partner",
        "count": 1
      },
      {
        "en": "Colorful NTI paper-craft animal packaging figures",
        "zh": "NTI 紙藝動物造型包裝",
        "kind": "alt",
        "section": "A Smarter Global Packaging Partner",
        "count": 1
      },
      {
        "en": "Already audited by the buyers you sell to",
        "zh": "你的買家早就稽核過我們了",
        "kind": "text",
        "section": "Already audited by the buyers you sell to",
        "count": 1
      },
      {
        "en": "NTI has passed GMI certification — the packaging-supplier audit programme commissioned by Target — for Target, Walgreens, Lowe’s, The Home Depot, Academy Sports + Outdoors and CVS pharmacy. If you sell into those channels, the supplier check has already been done.",
        "zh": "NTI 已通過 GMI 認證 —— 由 Target 委託執行的包裝供應商稽核制度 —— 適用於 Target、Walgreens、Lowe’s、The Home Depot、Academy Sports + Outdoors 與 CVS pharmacy。若您供貨給這些通路，供應商查核這一關已經完成。",
        "kind": "text",
        "section": "Already audited by the buyers you sell to",
        "count": 1
      },
      {
        "en": "View certifications, partnerships & awards",
        "zh": "查看認證、夥伴與獲獎",
        "kind": "text",
        "section": "Already audited by the buyers you sell to",
        "count": 1
      },
      {
        "en": "Want this applied to your packaging? Send us the brief and we will come back with a spec and a quote.",
        "zh": "想把這套做法用在您的包裝上？把需求寄給我們，我們會回覆規格與報價。",
        "kind": "text",
        "section": "Already audited by the buyers you sell to",
        "count": 1
      },
      {
        "en": "Get a Quote",
        "zh": "索取報價",
        "kind": "text",
        "section": "Already audited by the buyers you sell to",
        "count": 1
      },
      {
        "en": "Next: Certifications, Partnerships & Awards",
        "zh": "下一頁：認證、夥伴與獲獎",
        "kind": "text",
        "section": "Already audited by the buyers you sell to",
        "count": 1
      }
    ]
  },
  "about-certifications": {
    "mockup": "about-certifications.html",
    "items": [
      {
        "en": "NTI Printing headquarters in Tainan, Taiwan",
        "zh": "NTI Printing 台南總部",
        "kind": "alt",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Home",
        "zh": "首頁",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "About Us",
        "zh": "關於我們",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Our Certifications",
        "zh": "我們的認證",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Our Certifications — Proof of Quality & Sustainability",
        "zh": "我們的認證 —— 品質與永續的實證",
        "kind": "text",
        "section": "Our Certifications — Proof of Quality & Sustainability",
        "count": 1
      },
      {
        "en": "Proving our promise through action",
        "zh": "以行動證明我們的承諾",
        "kind": "text",
        "section": "Our Certifications — Proof of Quality & Sustainability",
        "count": 1
      },
      {
        "en": "The NTI Difference",
        "zh": "NTI 的與眾不同",
        "kind": "text",
        "section": "Our Certifications — Proof of Quality & Sustainability",
        "count": 1
      },
      {
        "en": "Benefits to Clients",
        "zh": "客戶得到的效益",
        "kind": "text",
        "section": "Our Certifications — Proof of Quality & Sustainability",
        "count": 1
      },
      {
        "en": "Certifications, Partnerships & Awards",
        "zh": "認證、夥伴與獲獎",
        "kind": "text",
        "section": "Our Certifications — Proof of Quality & Sustainability",
        "count": 1
      },
      {
        "en": "Factory Tour",
        "zh": "工廠導覽",
        "kind": "text",
        "section": "Our Certifications — Proof of Quality & Sustainability",
        "count": 1
      },
      {
        "en": "Certifications",
        "zh": "認證",
        "kind": "text",
        "section": "Certifications",
        "count": 1
      },
      {
        "en": "NTI has built its reputation on printing quality, and our clients hold us to it. We keep applying for further certification so that every customer gets the same assurance of product quality — audited by an outside body rather than asserted by us. Alongside the international standards below, we developed the NTI Green Printing Certificate, a mark our clients can display on their packaging as proof of an eco-conscious process.",
        "zh": "NTI 的口碑建立在印刷品質上，客戶也以此標準要求我們。我們持續申請更多認證，讓每一位客戶都得到同樣的品質保證 —— 由外部機構稽核，而不是我們自己說了算。除了下列國際標準之外，我們也發展出 NTI 綠色印刷認證，客戶可將這個標章印在包裝上，作為環保製程的證明。",
        "kind": "text",
        "section": "Certifications",
        "count": 1
      },
      {
        "en": "Printing & Colour Standards",
        "zh": "印刷與色彩標準",
        "kind": "text",
        "section": "Printing & Colour Standards",
        "count": 1
      },
      {
        "en": "G7 Master Colorspace",
        "zh": "G7 Master Colorspace",
        "kind": "text",
        "section": "Printing & Colour Standards",
        "count": 1
      },
      {
        "en": "Developed by Idealliance, a globally recognized colour calibration methodology based on ISO 12647-2, ensuring consistent, accurate colour reproduction across every print run.",
        "zh": "由 Idealliance 發展、以 ISO 12647-2 為基礎的國際色彩校正方法，確保每一批印件都能重現一致而準確的色彩。",
        "kind": "text",
        "section": "Printing & Colour Standards",
        "count": 1
      },
      {
        "en": "ISO 12647-2",
        "zh": null,
        "kind": "text",
        "section": "Printing & Colour Standards",
        "count": 1
      },
      {
        "en": "The standard litho production procedure our colour management runs to, with spot colours matched to swatch under controlled viewing conditions.",
        "zh": "我們色彩管理所遵循的標準平版印刷程序，特別色在受控觀察條件下與色票比對。",
        "kind": "text",
        "section": "Printing & Colour Standards",
        "count": 1
      },
      {
        "en": "NTI leadership on the pressroom floor",
        "zh": "NTI 經營團隊於印刷廠區",
        "kind": "alt",
        "section": "Printing & Colour Standards",
        "count": 1
      },
      {
        "en": "GMI Professional Printing Certification",
        "zh": "GMI 專業印刷認證",
        "kind": "text",
        "section": "GMI Professional Printing Certification",
        "count": 1
      },
      {
        "en": "NTI is GMI certified, ensuring consistent, colour-accurate packaging that meets the quality standards of leading global retailers, including Target, Walgreens, Lowe’s, The Home Depot, Academy Sports + Outdoors, and CVS Pharmacy.",
        "zh": "NTI 已通過 GMI 認證，確保包裝色彩準確、品質一致，符合 Target、Walgreens、Lowe’s、The Home Depot、Academy Sports + Outdoors 與 CVS Pharmacy 等國際零售通路的品質要求。",
        "kind": "text",
        "section": "GMI Professional Printing Certification",
        "count": 1
      },
      {
        "en": "GMI (Graphic Measures International) is the body appointed by Target to verify packaging suppliers and inspect packaging samples. NTI has passed GMI certification for the following retail channels:",
        "zh": "GMI（Graphic Measures International）是 Target 指定用來查核包裝供應商與檢驗包裝樣品的機構。NTI 已通過下列零售通路的 GMI 認證：",
        "kind": "text",
        "section": "GMI Professional Printing Certification",
        "count": 1
      },
      {
        "en": "Target",
        "zh": null,
        "kind": "text",
        "section": "GMI Professional Printing Certification",
        "count": 1
      },
      {
        "en": "The retailer that commissioned the GMI audit programme.",
        "zh": "委託建立 GMI 稽核制度的零售通路。",
        "kind": "text",
        "section": "GMI Professional Printing Certification",
        "count": 1
      },
      {
        "en": "Walgreens",
        "zh": null,
        "kind": "text",
        "section": "GMI Professional Printing Certification",
        "count": 1
      },
      {
        "en": "Approved packaging supplier.",
        "zh": "認可的包裝供應商。",
        "kind": "text",
        "section": "GMI Professional Printing Certification",
        "count": 5
      },
      {
        "en": "Lowe’s",
        "zh": null,
        "kind": "text",
        "section": "GMI Professional Printing Certification",
        "count": 1
      },
      {
        "en": "The Home Depot (THD)",
        "zh": null,
        "kind": "text",
        "section": "GMI Professional Printing Certification",
        "count": 1
      },
      {
        "en": "Academy Sports + Outdoors",
        "zh": null,
        "kind": "text",
        "section": "GMI Professional Printing Certification",
        "count": 1
      },
      {
        "en": "CVS pharmacy",
        "zh": null,
        "kind": "text",
        "section": "GMI Professional Printing Certification",
        "count": 1
      },
      {
        "en": "Management System & Environmental Certification",
        "zh": "管理系統與環境認證",
        "kind": "text",
        "section": "Management System & Environmental Certification",
        "count": 1
      },
      {
        "en": "FSC™-CoC Chain of Custody",
        "zh": "FSC™-CoC 產銷監管鏈",
        "kind": "text",
        "section": "Management System & Environmental Certification",
        "count": 1
      },
      {
        "en": "Guarantees that certified paper materials are sourced from responsibly managed forests and verified throughout the supply chain.",
        "zh": "確保通過認證的紙材來自負責任經營的林場，並於整條供應鏈中受到查核。",
        "kind": "text",
        "section": "Management System & Environmental Certification",
        "count": 1
      },
      {
        "en": "ISO 14001 — Environmental Management",
        "zh": "ISO 14001 —— 環境管理",
        "kind": "text",
        "section": "Management System & Environmental Certification",
        "count": 1
      },
      {
        "en": "Demonstrates NTI’s commitment to reducing environmental impact through responsible management across every stage of production and the product lifecycle.",
        "zh": "展現 NTI 在生產各階段與產品生命週期中，以負責任的管理降低環境衝擊的承諾。",
        "kind": "text",
        "section": "Management System & Environmental Certification",
        "count": 1
      },
      {
        "en": "ISO 9001 — Quality Management System",
        "zh": "ISO 9001 —— 品質管理系統",
        "kind": "text",
        "section": "Management System & Environmental Certification",
        "count": 1
      },
      {
        "en": "Demonstrates NTI’s commitment to consistent quality, continuous improvement, and customer satisfaction.",
        "zh": "展現 NTI 對品質一致、持續改善與客戶滿意的承諾。",
        "kind": "text",
        "section": "Management System & Environmental Certification",
        "count": 1
      },
      {
        "en": "OHSAS 18001 — Occupational Health & Safety Management",
        "zh": "OHSAS 18001 —— 職業安全衛生管理",
        "kind": "text",
        "section": "Management System & Environmental Certification",
        "count": 1
      },
      {
        "en": "Certifies NTI’s commitment to maintaining a safe, healthy workplace through effective occupational health and safety management.",
        "zh": "證明 NTI 以有效的職業安全衛生管理，維持安全健康的工作環境。",
        "kind": "text",
        "section": "Management System & Environmental Certification",
        "count": 1
      },
      {
        "en": "MOF Certified",
        "zh": "MOF 認證",
        "kind": "text",
        "section": "Management System & Environmental Certification",
        "count": 1
      },
      {
        "en": "NTI uses MOF-certified eco-friendly printing materials and inks, helping clients reduce environmental impact while meeting recognized sustainability and quality standards.",
        "zh": "NTI 使用通過 MOF 認證的環保印刷材料與油墨，協助客戶降低環境衝擊，同時符合公認的永續與品質標準。",
        "kind": "text",
        "section": "Management System & Environmental Certification",
        "count": 1
      },
      {
        "en": "Awards",
        "zh": "獲獎肯定",
        "kind": "text",
        "section": "Awards",
        "count": 1
      },
      {
        "en": "Outstanding Business Award",
        "zh": "傑出企業獎",
        "kind": "text",
        "section": "Awards",
        "count": 1
      },
      {
        "en": "The 13th National Brand Yushan Award for Outstanding Business Award.",
        "zh": "第 13 屆國家品牌玉山獎傑出企業獎。",
        "kind": "text",
        "section": "Awards",
        "count": 1
      },
      {
        "en": "Smart Building Award",
        "zh": "智慧建築獎",
        "kind": "text",
        "section": "Awards",
        "count": 1
      },
      {
        "en": "Gold Award in the ‘Smart Buildings’ category at the 7th APEC ESCI (Energy Smart Communities Initiative) Best Practices Awards Program.",
        "zh": "第 7 屆 APEC ESCI（能源智慧社區倡議）最佳實務獎「智慧建築」類金獎。",
        "kind": "text",
        "section": "Awards",
        "count": 1
      },
      {
        "en": "Want this applied to your packaging? Send us the brief and we will come back with a spec and a quote.",
        "zh": "想把這套做法用在您的包裝上？把需求寄給我們，我們會回覆規格與報價。",
        "kind": "text",
        "section": "Awards",
        "count": 1
      },
      {
        "en": "Get a Quote",
        "zh": "索取報價",
        "kind": "text",
        "section": "Awards",
        "count": 1
      },
      {
        "en": "Next: Factory Tour",
        "zh": "下一頁：工廠導覽",
        "kind": "text",
        "section": "Awards",
        "count": 1
      }
    ]
  },
  "facility": {
    "mockup": "facility.html",
    "items": [
      {
        "en": "NTI printing facility — Heidelberg press line",
        "zh": "NTI 印刷廠 —— 海德堡印刷產線",
        "kind": "alt",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Home",
        "zh": "首頁",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "About Us",
        "zh": "關於我們",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Facilities & Equipment",
        "zh": "設備與廠房",
        "kind": "text",
        "section": "頁首",
        "count": 2
      },
      {
        "en": "Where Technology Meets Sustainability",
        "zh": "技術與永續的交會之處",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "NTI Printing integrates advanced pre-press, printing, and post-press systems inside our G7 certified printing plant — a printing factory in Taiwan designed for precision, efficiency and sustainability. We use Heidelberg and Man Roland presses with in-line varnishing and carbon-balanced systems, reducing energy use and emissions.",
        "zh": "NTI Printing 在通過 G7 認證的印刷廠內整合先進的製版、印刷與印後系統 —— 一座為精準、效率與永續而設計的台灣印刷廠。我們使用具備線上上光與碳平衡系統的海德堡與 Man Roland 印刷機，降低能源使用與排放。",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "Prepress Equipment",
        "zh": "製版設備",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 2
      },
      {
        "en": "Environmentally Friendly Printing",
        "zh": "環保印刷",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 2
      },
      {
        "en": "Post-Press Processing",
        "zh": "印後加工",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 2
      },
      {
        "en": "Quality Inspection",
        "zh": "品質檢驗",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 2
      },
      {
        "en": "Factory Tour",
        "zh": "工廠導覽",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 2
      },
      {
        "en": "Heidelberg Suprasetter 105 S CTP",
        "zh": "海德堡 Suprasetter 105 S CTP",
        "kind": "alt",
        "section": "Facilities & Equipment",
        "count": 3
      },
      {
        "en": "NTI Printing utilizes the world’s most advanced prepress output software, integrated with a CTP (Computer-to-Plate) direct plate-making system. Coupled with a precise plate production control process, this ensures that the printing dots are accurately rendered, achieving faithful color reproduction in the final print.",
        "zh": "NTI Printing 採用世界最先進的製版輸出軟體，整合 CTP（電腦直接製版）系統，搭配精準的製版控管流程，確保印刷網點準確重現，讓成品色彩忠實還原。",
        "kind": "text",
        "section": "Prepress Equipment",
        "count": 1
      },
      {
        "en": "In-house CTP system for faster turnaround and reduced transport.",
        "zh": "自廠 CTP 系統，交期更快、運輸更少。",
        "kind": "text",
        "section": "Prepress Equipment",
        "count": 1
      },
      {
        "en": "Daily and weekly dot calibration for color precision.",
        "zh": "每日與每週的網點校正，確保色彩精準。",
        "kind": "text",
        "section": "Prepress Equipment",
        "count": 1
      },
      {
        "en": "Eco-friendly production that minimizes heavy metals and wastewater.",
        "zh": "環保生產，將重金屬與廢水降到最低。",
        "kind": "text",
        "section": "Prepress Equipment",
        "count": 1
      },
      {
        "en": "Equipment Cards",
        "zh": "設備卡",
        "kind": "text",
        "section": "Equipment Cards",
        "count": 1
      },
      {
        "en": "In-house pre-press and CTP plate: short lead time, reducing the cost of transportation. Dot values controlled every day and dot value correction every week to ensure precise dot value. Environmental performance: reduced heavy metal and sewage during production.",
        "zh": "自廠製版與 CTP 直接製版：交期短，降低運輸成本。每日控管網點值、每週進行網點校正，確保網點精準。環境效益：生產過程中的重金屬與廢水都更少。",
        "kind": "text",
        "section": "Equipment Cards",
        "count": 1
      },
      {
        "en": "Prinect Color Toolbox",
        "zh": "Prinect Color Toolbox",
        "kind": "text",
        "section": "Equipment Cards",
        "count": 1
      },
      {
        "en": "Heidelberg Prinect Color Proof Pro (digital color proof), Epson Pro9900 Image setter and ZÜND high-speed die cutting machine. NTI Printing can provide the box sample with imagesetter proof to save the cost and lead time for machine proofing.",
        "zh": "海德堡 Prinect Color Proof Pro（數位色彩打樣）、Epson Pro9900 輸出設備與 ZÜND 高速模切機。NTI Printing 可提供搭配樣張的盒樣，省下上機打樣的成本與時間。",
        "kind": "text",
        "section": "Equipment Cards",
        "count": 1
      },
      {
        "en": "Jazzy Light / X-Rite Color Master",
        "zh": "Jazzy Light／X-Rite Color Master",
        "kind": "text",
        "section": "Equipment Cards",
        "count": 1
      },
      {
        "en": "Ink mixed system can mix up the spot colour precisely the same as the colour swatch book. Standard litho printing production procedure, meeting international printing standard ISO 12647-2.",
        "zh": "調墨系統能把特別色調得與色票完全一致。標準平版印刷生產程序，符合國際印刷標準 ISO 12647-2。",
        "kind": "text",
        "section": "Equipment Cards",
        "count": 1
      },
      {
        "en": "More details ›",
        "zh": "更多細節 ›",
        "kind": "text",
        "section": "Equipment Cards",
        "count": 5
      },
      {
        "en": "Heidelberg Press varnishing in line, to shorten the lead time and keep good quality at the same time. We also introduce an environmentally friendly system into the printing procedure.",
        "zh": "海德堡印刷機採線上上光，縮短交期同時維持良好品質。我們也在印刷流程中導入環保系統。",
        "kind": "text",
        "section": "Environmentally Friendly Printing",
        "count": 1
      },
      {
        "en": "Presses in Use",
        "zh": "使用中的印刷機",
        "kind": "text",
        "section": "Presses in Use",
        "count": 1
      },
      {
        "en": "Heidelberg Speedmaster CD 102-6+LX 6-Colour Coater Press",
        "zh": "海德堡 Speedmaster CD 102-6+LX 六色上光印刷機",
        "kind": "text",
        "section": "Presses in Use",
        "count": 1
      },
      {
        "en": "Heidelberg Speedmaster CD 102-5+LX 5-Colour Carbon Balanced Coater Press",
        "zh": "海德堡 Speedmaster CD 102-5+LX 五色碳平衡上光印刷機",
        "kind": "text",
        "section": "Presses in Use",
        "count": 1
      },
      {
        "en": "Heidelberg Speedmaster CD 102-5+LX UV 5-Colour Coater Press",
        "zh": "海德堡 Speedmaster CD 102-5+LX UV 五色上光印刷機",
        "kind": "text",
        "section": "Presses in Use",
        "count": 1
      },
      {
        "en": "Man Roland D-6050 Offenbach Two-Colour Offset Press",
        "zh": "Man Roland D-6050 Offenbach 雙色平版印刷機",
        "kind": "text",
        "section": "Presses in Use",
        "count": 1
      },
      {
        "en": "Heidelberg Image Control System",
        "zh": "海德堡 Image Control 系統",
        "kind": "text",
        "section": "Presses in Use",
        "count": 1
      },
      {
        "en": "Heidelberg Axis Control Colour Management System",
        "zh": "海德堡 Axis Control 色彩管理系統",
        "kind": "text",
        "section": "Presses in Use",
        "count": 1
      },
      {
        "en": "NTI Printing uses the most advanced die-cutting machines, automated gluing machines, and heat shrink film equipment to achieve high-efficiency production and deliver high-quality packaging products.",
        "zh": "NTI Printing 採用最先進的模切機、自動糊盒機與熱收縮膜設備，達成高效率生產，交出高品質的包裝產品。",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "Automated die-cutting, gluing, window patching, and lamination systems.",
        "zh": "自動化模切、糊盒、貼窗與貼合系統。",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "BOPP film coating eliminates solvent use and meets EU and US eco standards.",
        "zh": "BOPP 預塗膜免除溶劑使用，符合歐盟與美國環保標準。",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "High-speed shrink wrapping and labeling for efficient, secure finishing.",
        "zh": "高速收縮包膜與貼標，讓最後加工既有效率又穩妥。",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "Heidelberg Varimatrix 105 Die-Cutter",
        "zh": "海德堡 Varimatrix 105 模切機",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "High-performance automatic flat-bed die-cutting with non-stop feeder, German CITO creasing matrix, precise alignment, and clean waste stripping for straight, sturdy creases.",
        "zh": "高效能自動平壓模切，配備不停機給紙、德國 CITO 壓痕系統、精準對位與乾淨清廢，壓線平直而堅固。",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "SBL High-Speed Automatic Die-Cutter",
        "zh": "SBL 高速自動模切機",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "Non-stop operation across paper sizes from 400 × 370 mm to 1050 × 750 mm, up to 7,500 sheets per hour.",
        "zh": "紙張尺寸 400 × 370 mm 至 1050 × 750 mm 不停機作業，每小時最高 7,500 張。",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "High-Speed Intelligent Laminating Machine",
        "zh": "高速智慧型貼合機",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "BOPP pre-coated film instead of traditional wet lamination — solvent-free, no drying, meeting European and American environmental standards.",
        "zh": "以 BOPP 預塗膜取代傳統濕式貼合 —— 無溶劑、免烘乾，符合歐美環保標準。",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "Digital Window Patching Machine",
        "zh": "數位貼窗機",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "Servo-controlled alignment, creasing, corner cutting, and splitting in a single pass.",
        "zh": "伺服控制的對位、壓痕、切角與分條，一次完成。",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "High-Speed Universal Folder-Gluer",
        "zh": "高速萬用糊盒機",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "Up to 200 metres per minute with optional cold or hot glue systems and plasma surface treatment for strong adhesion.",
        "zh": "最高每分鐘 200 公尺，可選配冷膠或熱膠系統，並以電漿表面處理強化黏著。",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "Automatic Heat Shrink Wrap Machine",
        "zh": "自動熱收縮包裝機",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "Complete wrapping protects finished goods from dust, moisture, and handling damage — no rope-bundling marks.",
        "zh": "完整包膜保護成品不受灰塵、濕氣與搬運損傷 —— 也不會留下綑繩壓痕。",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "Supporting Equipment",
        "zh": "輔助設備",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "Automatic labeling machine, automatic box sealing machine, and two DATIEN guillotine cutters.",
        "zh": "自動貼標機、自動封箱機，以及兩台 DATIEN 裁紙機。",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "Quality You Can Measure",
        "zh": "看得見數據的品質",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "NTI conducts strict quality control throughout every production stage — from materials to finished goods. Each print is tested for accuracy, durability, and consistency using precision tools such as:",
        "zh": "NTI 在每一個生產階段都執行嚴格的品質管控 —— 從材料到成品。每一件印品都以精密儀器檢測準確度、耐久性與一致性，例如：",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "X-Rite i1iO",
        "zh": null,
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "Automated spectral color measurement for profiling and color control.",
        "zh": "自動化光譜色彩量測，用於建檔與色彩控制。",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "X-Rite eXact Spectrophotometer",
        "zh": "X-Rite eXact 分光光度計",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "Press-side color measurement with single-click operation — strict color-deviation control with less manual error.",
        "zh": "機邊色彩量測，單鍵操作 —— 嚴格控管色差，減少人為誤差。",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "X-Rite IC Plate II",
        "zh": null,
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "Measures plate dot area percentage to verify and adjust dot specifications.",
        "zh": "量測印版網點面積百分比，用以驗證與調整網點規格。",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "Barcode Grade Scanner",
        "zh": "條碼等級檢測儀",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "Verifies every printed barcode meets grade compliance.",
        "zh": "驗證每一個印出的條碼都符合等級規範。",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "Temperature & Humidity Chamber",
        "zh": "恆溫恆濕試驗機",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "High/low temperature simulation to catch issues from environmental fluctuation before shipment.",
        "zh": "高低溫模擬，在出貨前先攔下環境變化可能造成的問題。",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "Ink Rub Tester",
        "zh": "油墨耐磨試驗機",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "Confirms abrasion resistance of printed surfaces to customer requirements.",
        "zh": "確認印刷表面的耐磨程度符合客戶要求。",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "Gloss Meter & Cross-Hatch Adhesion Tester",
        "zh": "光澤度計與百格附著力試驗機",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "Verifies surface brightness and coating adhesion against specification.",
        "zh": "依規格驗證表面亮度與塗層附著力。",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "Blister Pack Strength Testing",
        "zh": "泡殼包裝強度測試",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "Tests gluing strength for vacuum blister packaging components.",
        "zh": "測試真空泡殼包裝元件的黏合強度。",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "Our goal: every print that leaves NTI meets international standards — and your expectations.",
        "zh": "我們的目標：每一件離開 NTI 的印品，都符合國際標準 —— 也符合您的期待。",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "See Sustainability in Action",
        "zh": "親眼看見永續如何運作",
        "kind": "text",
        "section": "Factory Tour",
        "count": 1
      },
      {
        "en": "NTI’s factory is built around environmental care and employee well-being. Our modern, fully air-conditioned office and production facility has been designed to provide a safe, clean and inspiring workplace for every member of our team.",
        "zh": "NTI 的廠房以環境照護與員工福祉為核心而建。現代化、全廠空調的辦公室與生產設施，是為了給每一位同仁安全、整潔且能激發靈感的工作環境而設計。",
        "kind": "text",
        "section": "Factory Tour",
        "count": 1
      },
      {
        "en": "Visitors can explore our clean water treatment system, energy-efficient production lines, and green facilities designed for both people and the planet.",
        "zh": "來訪者可以參觀我們的淨水處理系統、節能生產線，以及同時為人與地球著想的綠色設施。",
        "kind": "text",
        "section": "Factory Tour",
        "count": 1
      },
      {
        "en": "Book a guided tour and experience how we bring ‘The Courage to Print Green’ to life.",
        "zh": "預約導覽，親身體驗我們如何實踐「勇於印綠」。",
        "kind": "text",
        "section": "Factory Tour",
        "count": 1
      },
      {
        "en": "Inside the NTI factory floor — palletised packaging stock and clean production aisles",
        "zh": "NTI 廠內實景 —— 棧板化的包裝庫存與整潔的生產動線",
        "kind": "alt",
        "section": "Factory Tour",
        "count": 1
      }
    ]
  },
  "facility-pre-press": {
    "mockup": "facility-pre-press.html",
    "items": [
      {
        "en": "Heidelberg Suprasetter 105 S CTP plate-making system",
        "zh": "海德堡 Suprasetter 105 S CTP 直接製版系統",
        "kind": "alt",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Home",
        "zh": "首頁",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "About Us",
        "zh": "關於我們",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Facilities & Equipment",
        "zh": "設備與廠房",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Prepress Equipment",
        "zh": "製版設備",
        "kind": "text",
        "section": "頁首",
        "count": 3
      },
      {
        "en": "Accurate dot rendering and faithful colour, before ink hits paper",
        "zh": "在油墨落紙之前，就把網點與色彩做準",
        "kind": "text",
        "section": "Prepress Equipment",
        "count": 1
      },
      {
        "en": "Environmentally Friendly Printing",
        "zh": "環保印刷",
        "kind": "text",
        "section": "Prepress Equipment",
        "count": 1
      },
      {
        "en": "Post-Press Processing",
        "zh": "印後加工",
        "kind": "text",
        "section": "Prepress Equipment",
        "count": 1
      },
      {
        "en": "Quality Inspection",
        "zh": "品質檢驗",
        "kind": "text",
        "section": "Prepress Equipment",
        "count": 1
      },
      {
        "en": "Factory Tour",
        "zh": "工廠導覽",
        "kind": "text",
        "section": "Prepress Equipment",
        "count": 1
      },
      {
        "en": "NTI Printing utilizes the world’s most advanced prepress output software, integrated with a CTP (Computer-to-Plate) direct plate-making system. Coupled with a precise plate production control process, this ensures that the printing dots are accurately rendered, achieving faithful color reproduction in the final print.",
        "zh": "NTI Printing 採用世界最先進的製版輸出軟體，整合 CTP（電腦直接製版）系統，搭配精準的製版控管流程，確保印刷網點準確重現，讓成品色彩忠實還原。",
        "kind": "text",
        "section": "Prepress Equipment",
        "count": 1
      },
      {
        "en": "In-house CTP system for faster turnaround and reduced transport.",
        "zh": "自廠 CTP 系統，交期更快、運輸更少。",
        "kind": "text",
        "section": "Prepress Equipment",
        "count": 1
      },
      {
        "en": "Daily and weekly dot calibration for color precision.",
        "zh": "每日與每週的網點校正，確保色彩精準。",
        "kind": "text",
        "section": "Prepress Equipment",
        "count": 1
      },
      {
        "en": "Eco-friendly production that minimizes heavy metals and wastewater.",
        "zh": "環保生產，將重金屬與廢水降到最低。",
        "kind": "text",
        "section": "Prepress Equipment",
        "count": 1
      },
      {
        "en": "Heidelberg Suprasetter 105 S CTP",
        "zh": "海德堡 Suprasetter 105 S CTP",
        "kind": "text",
        "section": "Prepress Equipment",
        "count": 1
      },
      {
        "en": "In-house plate output for quick turnaround and reduced transport, while minimising heavy metals and wastewater.",
        "zh": "自廠出版，交期快、運輸少，同時把重金屬與廢水降到最低。",
        "kind": "text",
        "section": "Prepress Equipment",
        "count": 1
      },
      {
        "en": "Prinect Color Proof Pro + Epson Pro9900",
        "zh": "Prinect Color Proof Pro + Epson Pro9900",
        "kind": "text",
        "section": "Prepress Equipment",
        "count": 1
      },
      {
        "en": "Digital contract proofing; combined with imagesetter proofs and cut box samples to shorten lead times and cost.",
        "zh": "數位合約打樣；搭配樣張與裁切盒樣，縮短交期與成本。",
        "kind": "text",
        "section": "Prepress Equipment",
        "count": 1
      },
      {
        "en": "Jazzy Light Color Management System",
        "zh": "Jazzy Light 色彩管理系統",
        "kind": "text",
        "section": "Prepress Equipment",
        "count": 1
      },
      {
        "en": "X-Rite ColorMaster ink mixing with INTEKE colour assessment cabinets — spot colours matched to swatch under the ISO 12647-2 standard litho procedure.",
        "zh": "X-Rite ColorMaster 調墨系統搭配 INTEKE 標準光源對色箱 —— 特別色依 ISO 12647-2 標準平版程序與色票比對。",
        "kind": "text",
        "section": "Prepress Equipment",
        "count": 1
      },
      {
        "en": "ZÜND CCD High-Speed Cutter",
        "zh": "ZÜND CCD 高速切割機",
        "kind": "text",
        "section": "Prepress Equipment",
        "count": 1
      },
      {
        "en": "Optical auto-registration die cutting for precise, high-quality box samples and detailed work.",
        "zh": "光學自動對位模切，做出精準、高品質的盒樣與細節件。",
        "kind": "text",
        "section": "Prepress Equipment",
        "count": 1
      },
      {
        "en": "Equipment",
        "zh": "設備",
        "kind": "text",
        "section": "Equipment",
        "count": 1
      },
      {
        "en": "Want this applied to your packaging? Send us the brief and we will come back with a spec and a quote.",
        "zh": "想把這套做法用在您的包裝上？把需求寄給我們，我們會回覆規格與報價。",
        "kind": "text",
        "section": "Equipment",
        "count": 1
      },
      {
        "en": "Get a Quote",
        "zh": "索取報價",
        "kind": "text",
        "section": "Equipment",
        "count": 1
      },
      {
        "en": "Next: Environmentally Friendly Printing",
        "zh": "下一頁：環保印刷",
        "kind": "text",
        "section": "Equipment",
        "count": 1
      }
    ]
  },
  "facility-eco-printing": {
    "mockup": "facility-eco-printing.html",
    "items": [
      {
        "en": "NTI press room — production control",
        "zh": "NTI 印刷現場 —— 生產控管",
        "kind": "alt",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Home",
        "zh": "首頁",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "About Us",
        "zh": "關於我們",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Facilities & Equipment",
        "zh": "設備與廠房",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Environmentally Friendly Printing",
        "zh": "環保印刷",
        "kind": "text",
        "section": "頁首",
        "count": 3
      },
      {
        "en": "German presses with in-line varnishing — including a carbon-balanced line",
        "zh": "具備線上上光的德國印刷機 —— 其中一線為碳平衡機組",
        "kind": "text",
        "section": "Environmentally Friendly Printing",
        "count": 1
      },
      {
        "en": "Prepress Equipment",
        "zh": "製版設備",
        "kind": "text",
        "section": "Environmentally Friendly Printing",
        "count": 1
      },
      {
        "en": "Post-Press Processing",
        "zh": "印後加工",
        "kind": "text",
        "section": "Environmentally Friendly Printing",
        "count": 1
      },
      {
        "en": "Quality Inspection",
        "zh": "品質檢驗",
        "kind": "text",
        "section": "Environmentally Friendly Printing",
        "count": 1
      },
      {
        "en": "Factory Tour",
        "zh": "工廠導覽",
        "kind": "text",
        "section": "Environmentally Friendly Printing",
        "count": 1
      },
      {
        "en": "Heidelberg Press varnishing in line, to shorten the lead time and keep good quality at the same time. We also introduce an environmentally friendly system into the printing procedure.",
        "zh": "海德堡印刷機採線上上光，縮短交期同時維持良好品質。我們也在印刷流程中導入環保系統。",
        "kind": "text",
        "section": "Environmentally Friendly Printing",
        "count": 1
      },
      {
        "en": "Presses in Use",
        "zh": "使用中的印刷機",
        "kind": "text",
        "section": "Presses in Use",
        "count": 1
      },
      {
        "en": "Heidelberg Speedmaster CD 102-6+LX 6-Colour Coater Press",
        "zh": "海德堡 Speedmaster CD 102-6+LX 六色上光印刷機",
        "kind": "text",
        "section": "Presses in Use",
        "count": 1
      },
      {
        "en": "Heidelberg Speedmaster CD 102-5+LX 5-Colour Carbon Balanced Coater Press",
        "zh": "海德堡 Speedmaster CD 102-5+LX 五色碳平衡上光印刷機",
        "kind": "text",
        "section": "Presses in Use",
        "count": 1
      },
      {
        "en": "Heidelberg Speedmaster CD 102-5+LX UV 5-Colour Coater Press",
        "zh": "海德堡 Speedmaster CD 102-5+LX UV 五色上光印刷機",
        "kind": "text",
        "section": "Presses in Use",
        "count": 1
      },
      {
        "en": "Man Roland D-6050 Offenbach Two-Colour Offset Press",
        "zh": "Man Roland D-6050 Offenbach 雙色平版印刷機",
        "kind": "text",
        "section": "Presses in Use",
        "count": 1
      },
      {
        "en": "Heidelberg Image Control System",
        "zh": "海德堡 Image Control 系統",
        "kind": "text",
        "section": "Presses in Use",
        "count": 1
      },
      {
        "en": "Heidelberg Axis Control Colour Management System",
        "zh": "海德堡 Axis Control 色彩管理系統",
        "kind": "text",
        "section": "Presses in Use",
        "count": 1
      },
      {
        "en": "Heidelberg Speedmaster CD-102-6+LX",
        "zh": null,
        "kind": "text",
        "section": "Presses in Use",
        "count": 1
      },
      {
        "en": "6-colour press with in-line coater, delivering roughly 30% more efficiency than comparable presses.",
        "zh": "六色印刷機搭配線上上光，效率較同級機種高出約 30%。",
        "kind": "text",
        "section": "Presses in Use",
        "count": 1
      },
      {
        "en": "Heidelberg Speedmaster CD-102-5+LX",
        "zh": null,
        "kind": "text",
        "section": "Presses in Use",
        "count": 1
      },
      {
        "en": "5-colour press with in-line coater; also available as a UV printing configuration and a carbon-balanced model.",
        "zh": "五色印刷機搭配線上上光；另有 UV 印刷配置與碳平衡機型。",
        "kind": "text",
        "section": "Presses in Use",
        "count": 1
      },
      {
        "en": "Man Roland D-6050 Offenbach",
        "zh": null,
        "kind": "text",
        "section": "Presses in Use",
        "count": 1
      },
      {
        "en": "2-colour press for supporting work.",
        "zh": "輔助性作業用的雙色印刷機。",
        "kind": "text",
        "section": "Presses in Use",
        "count": 1
      },
      {
        "en": "Axis Control System",
        "zh": "Axis Control 系統",
        "kind": "text",
        "section": "Presses in Use",
        "count": 1
      },
      {
        "en": "High-efficiency colour measurement, about 3 minutes faster per measurement cycle than comparable systems.",
        "zh": "高效率色彩量測，每個量測循環較同級系統快約 3 分鐘。",
        "kind": "text",
        "section": "Presses in Use",
        "count": 1
      },
      {
        "en": "Image Control System",
        "zh": "Image Control 系統",
        "kind": "text",
        "section": "Presses in Use",
        "count": 1
      },
      {
        "en": "Spectrophotometer-based in-line monitoring with automatic adjustment — reduces colour variance and generates reference values for repeat jobs.",
        "zh": "以分光光度為基礎的線上監控與自動調整 —— 降低色差，並為重複訂單建立參考值。",
        "kind": "text",
        "section": "Presses in Use",
        "count": 1
      },
      {
        "en": "Equipment",
        "zh": "設備",
        "kind": "text",
        "section": "Equipment",
        "count": 1
      },
      {
        "en": "Want this applied to your packaging? Send us the brief and we will come back with a spec and a quote.",
        "zh": "想把這套做法用在您的包裝上？把需求寄給我們，我們會回覆規格與報價。",
        "kind": "text",
        "section": "Equipment",
        "count": 1
      },
      {
        "en": "Get a Quote",
        "zh": "索取報價",
        "kind": "text",
        "section": "Equipment",
        "count": 1
      },
      {
        "en": "Next: Post-Press Processing",
        "zh": "下一頁：印後加工",
        "kind": "text",
        "section": "Equipment",
        "count": 1
      }
    ]
  },
  "facility-post-press": {
    "mockup": "facility-post-press.html",
    "items": [
      {
        "en": "Heidelberg Varimatrix 105 die-cutter",
        "zh": "海德堡 Varimatrix 105 模切機",
        "kind": "alt",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Home",
        "zh": "首頁",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "About Us",
        "zh": "關於我們",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Facilities & Equipment",
        "zh": "設備與廠房",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Post-Press Processing",
        "zh": "印後加工",
        "kind": "text",
        "section": "頁首",
        "count": 3
      },
      {
        "en": "Die-cutting, gluing, window patching and wrapping — all in-house",
        "zh": "模切、糊盒、貼窗與包膜 —— 全部自廠完成",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "Prepress Equipment",
        "zh": "製版設備",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "Environmentally Friendly Printing",
        "zh": "環保印刷",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "Quality Inspection",
        "zh": "品質檢驗",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "Factory Tour",
        "zh": "工廠導覽",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "NTI Printing uses the most advanced die-cutting machines, automated gluing machines, and heat shrink film equipment to achieve high-efficiency production and deliver high-quality packaging products.",
        "zh": "NTI Printing 採用最先進的模切機、自動糊盒機與熱收縮膜設備，達成高效率生產，交出高品質的包裝產品。",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "Automated die-cutting, gluing, window patching, and lamination systems.",
        "zh": "自動化模切、糊盒、貼窗與貼合系統。",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "BOPP film coating eliminates solvent use and meets EU and US eco standards.",
        "zh": "BOPP 預塗膜免除溶劑使用，符合歐盟與美國環保標準。",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "High-speed shrink wrapping and labeling for efficient, secure finishing.",
        "zh": "高速收縮包膜與貼標，讓最後加工既有效率又穩妥。",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "Heidelberg Varimatrix 105 Die-Cutter",
        "zh": "海德堡 Varimatrix 105 模切機",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "High-performance automatic flat-bed die-cutting with non-stop feeder, German CITO creasing matrix, precise alignment, and clean waste stripping for straight, sturdy creases.",
        "zh": "高效能自動平壓模切，配備不停機給紙、德國 CITO 壓痕系統、精準對位與乾淨清廢，壓線平直而堅固。",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "SBL High-Speed Automatic Die-Cutter",
        "zh": "SBL 高速自動模切機",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "Non-stop operation across paper sizes from 400 × 370 mm to 1050 × 750 mm, up to 7,500 sheets per hour.",
        "zh": "紙張尺寸 400 × 370 mm 至 1050 × 750 mm 不停機作業，每小時最高 7,500 張。",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "High-Speed Intelligent Laminating Machine",
        "zh": "高速智慧型貼合機",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "BOPP pre-coated film instead of traditional wet lamination — solvent-free, no drying, meeting European and American environmental standards.",
        "zh": "以 BOPP 預塗膜取代傳統濕式貼合 —— 無溶劑、免烘乾，符合歐美環保標準。",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "Digital Window Patching Machine",
        "zh": "數位貼窗機",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "Servo-controlled alignment, creasing, corner cutting, and splitting in a single pass.",
        "zh": "伺服控制的對位、壓痕、切角與分條，一次完成。",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "High-Speed Universal Folder-Gluer",
        "zh": "高速萬用糊盒機",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "Up to 200 metres per minute with optional cold or hot glue systems and plasma surface treatment for strong adhesion.",
        "zh": "最高每分鐘 200 公尺，可選配冷膠或熱膠系統，並以電漿表面處理強化黏著。",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "Automatic Heat Shrink Wrap Machine",
        "zh": "自動熱收縮包裝機",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "Complete wrapping protects finished goods from dust, moisture, and handling damage — no rope-bundling marks.",
        "zh": "完整包膜保護成品不受灰塵、濕氣與搬運損傷 —— 也不會留下綑繩壓痕。",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "Supporting Equipment",
        "zh": "輔助設備",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "Automatic labeling machine, automatic box sealing machine, and two DATIEN guillotine cutters.",
        "zh": "自動貼標機、自動封箱機，以及兩台 DATIEN 裁紙機。",
        "kind": "text",
        "section": "Post-Press Processing",
        "count": 1
      },
      {
        "en": "Equipment",
        "zh": "設備",
        "kind": "text",
        "section": "Equipment",
        "count": 1
      },
      {
        "en": "Want this applied to your packaging? Send us the brief and we will come back with a spec and a quote.",
        "zh": "想把這套做法用在您的包裝上？把需求寄給我們，我們會回覆規格與報價。",
        "kind": "text",
        "section": "Equipment",
        "count": 1
      },
      {
        "en": "Get a Quote",
        "zh": "索取報價",
        "kind": "text",
        "section": "Equipment",
        "count": 1
      },
      {
        "en": "Next: Quality Inspection",
        "zh": "下一頁：品質檢驗",
        "kind": "text",
        "section": "Equipment",
        "count": 1
      }
    ]
  },
  "facility-quality": {
    "mockup": "facility-quality.html",
    "items": [
      {
        "en": "NTI press line — quality is measured at every stage",
        "zh": "NTI 印刷產線 —— 品質在每一個階段量測",
        "kind": "alt",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Home",
        "zh": "首頁",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "About Us",
        "zh": "關於我們",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Facilities & Equipment",
        "zh": "設備與廠房",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Quality Inspection",
        "zh": "品質檢驗",
        "kind": "text",
        "section": "頁首",
        "count": 3
      },
      {
        "en": "Quality You Can Measure",
        "zh": "看得見數據的品質",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "Prepress Equipment",
        "zh": "製版設備",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "Environmentally Friendly Printing",
        "zh": "環保印刷",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "Post-Press Processing",
        "zh": "印後加工",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "Factory Tour",
        "zh": "工廠導覽",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "NTI conducts strict quality control throughout every production stage — from materials to finished goods. Each print is tested for accuracy, durability, and consistency using precision tools such as:",
        "zh": "NTI 在每一個生產階段都執行嚴格的品質管控 —— 從材料到成品。每一件印品都以精密儀器檢測準確度、耐久性與一致性，例如：",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "X-Rite i1iO",
        "zh": null,
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "Automated spectral colour measurement for profiling and colour control.",
        "zh": "自動化光譜色彩量測，用於建檔與色彩控制。",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "X-Rite eXact Spectrophotometer",
        "zh": "X-Rite eXact 分光光度計",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "Press-side colour measurement with single-click operation — strict colour-deviation control with less manual error.",
        "zh": "機邊色彩量測，單鍵操作 —— 嚴格控管色差，減少人為誤差。",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "X-Rite IC Plate II",
        "zh": null,
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "Measures plate dot area percentage to verify and adjust dot specifications.",
        "zh": "量測印版網點面積百分比，用以驗證與調整網點規格。",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "Barcode Grade Scanner",
        "zh": "條碼等級檢測儀",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "Verifies every printed barcode meets grade compliance.",
        "zh": "驗證每一個印出的條碼都符合等級規範。",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "Temperature & Humidity Chamber",
        "zh": "恆溫恆濕試驗機",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "High/low temperature simulation to catch issues from environmental fluctuation before shipment.",
        "zh": "高低溫模擬，在出貨前先攔下環境變化可能造成的問題。",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "Ink Rub Tester",
        "zh": "油墨耐磨試驗機",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "Confirms abrasion resistance of printed surfaces to customer requirements.",
        "zh": "確認印刷表面的耐磨程度符合客戶要求。",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "Gloss Meter & Cross-Hatch Adhesion Tester",
        "zh": "光澤度計與百格附著力試驗機",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "Verifies surface brightness and coating adhesion against specification.",
        "zh": "依規格驗證表面亮度與塗層附著力。",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "Blister Pack Strength Testing",
        "zh": "泡殼包裝強度測試",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "Tests gluing strength for vacuum blister packaging components.",
        "zh": "測試真空泡殼包裝元件的黏合強度。",
        "kind": "text",
        "section": "Quality Inspection",
        "count": 1
      },
      {
        "en": "Measurement & Test Equipment",
        "zh": "量測與檢測設備",
        "kind": "text",
        "section": "Measurement & Test Equipment",
        "count": 1
      },
      {
        "en": "Want this applied to your packaging? Send us the brief and we will come back with a spec and a quote.",
        "zh": "想把這套做法用在您的包裝上？把需求寄給我們，我們會回覆規格與報價。",
        "kind": "text",
        "section": "Measurement & Test Equipment",
        "count": 1
      },
      {
        "en": "Get a Quote",
        "zh": "索取報價",
        "kind": "text",
        "section": "Measurement & Test Equipment",
        "count": 1
      },
      {
        "en": "Next: Factory Tour",
        "zh": "下一頁：工廠導覽",
        "kind": "text",
        "section": "Measurement & Test Equipment",
        "count": 1
      }
    ]
  },
  "facility-tour": {
    "mockup": "facility-tour.html",
    "items": [
      {
        "en": "Inside the NTI factory floor — palletised packaging stock and clean production aisles",
        "zh": "NTI 廠內實景 —— 棧板化的包裝庫存與整潔的生產動線",
        "kind": "alt",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Home",
        "zh": "首頁",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "About Us",
        "zh": "關於我們",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Facilities & Equipment",
        "zh": "設備與廠房",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Factory Tour",
        "zh": "工廠導覽",
        "kind": "text",
        "section": "頁首",
        "count": 3
      },
      {
        "en": "People are part of our sustainability journey",
        "zh": "人，是我們永續旅程的一部分",
        "kind": "text",
        "section": "Factory Tour",
        "count": 1
      },
      {
        "en": "Prepress Equipment",
        "zh": "製版設備",
        "kind": "text",
        "section": "Factory Tour",
        "count": 1
      },
      {
        "en": "Environmentally Friendly Printing",
        "zh": "環保印刷",
        "kind": "text",
        "section": "Factory Tour",
        "count": 1
      },
      {
        "en": "Post-Press Processing",
        "zh": "印後加工",
        "kind": "text",
        "section": "Factory Tour",
        "count": 1
      },
      {
        "en": "Quality Inspection",
        "zh": "品質檢驗",
        "kind": "text",
        "section": "Factory Tour",
        "count": 1
      },
      {
        "en": "At NTI Printing, ESG begins with people. Our state-of-the-art, fully air-conditioned facility is designed to provide a safe, comfortable, and inspiring workplace for every member of our team. From modern offices and efficient production floors to staff restaurants, library, dormitories, and shared spaces, we continually invest in the wellbeing of both our local and international employees. By creating an environment where people can thrive, we build a stronger culture, deliver better quality, and support a more sustainable future as a trusted sustainable packaging manufacturer in Taiwan.",
        "zh": "在 NTI Printing，ESG 從人開始。我們全廠空調的先進廠房，是為了給每一位同仁安全、舒適且能激發靈感的工作環境而設計。從現代化辦公室、高效率生產線，到員工餐廳、圖書室、宿舍與共用空間，我們持續投資本地與外籍同仁的福祉。營造讓人能夠發揮的環境，我們才能建立更強的文化、交出更好的品質，並以台灣值得信賴的永續包裝製造商的角色，支持更永續的未來。",
        "kind": "text",
        "section": "Factory Tour",
        "count": 1
      },
      {
        "en": "On the floor",
        "zh": "現場",
        "kind": "text",
        "section": "On the floor",
        "count": 1
      },
      {
        "en": "The plant runs on a well-planned production area with a dedicated wastewater treatment zone, supporting an environmentally friendly workplace. Alongside production there is an employee cafeteria, dormitories and training rooms — the site is built for the people running it, not only for the presses.",
        "zh": "廠區規劃完善的生產區搭配專屬廢水處理區，支撐環境友善的工作場所。生產區旁設有員工餐廳、宿舍與訓練教室 —— 這個廠是為了操作它的人而建，不只是為了機器。",
        "kind": "text",
        "section": "On the floor",
        "count": 1
      },
      {
        "en": "NTI factory floor — press hall lighting and overhead services",
        "zh": "NTI 廠區 —— 印刷廠房照明與上方管線",
        "kind": "alt",
        "section": "On the floor",
        "count": 1
      },
      {
        "en": "NTI production aisle — palletised stock between press and finishing",
        "zh": "NTI 生產動線 —— 印刷與加工之間的棧板庫存",
        "kind": "alt",
        "section": "On the floor",
        "count": 1
      },
      {
        "en": "Booking a visit",
        "zh": "預約參觀",
        "kind": "text",
        "section": "Booking a visit",
        "count": 1
      },
      {
        "en": "Factory visits run by appointment, Monday to Friday, 08:30–17:30 (GMT+8) at the Tainan plant. Tell us what you produce and we will shape the route around it.",
        "zh": "工廠導覽採預約制，週一至週五 08:30–17:30（GMT+8）於台南廠進行。告訴我們您生產的產品，我們會依此安排參觀路線。",
        "kind": "text",
        "section": "Booking a visit",
        "count": 1
      },
      {
        "en": "Arrange a visit",
        "zh": "安排參觀",
        "kind": "text",
        "section": "Booking a visit",
        "count": 1
      },
      {
        "en": "Want this applied to your packaging? Send us the brief and we will come back with a spec and a quote.",
        "zh": "想把這套做法用在您的包裝上？把需求寄給我們，我們會回覆規格與報價。",
        "kind": "text",
        "section": "Booking a visit",
        "count": 1
      },
      {
        "en": "Get a Quote",
        "zh": "索取報價",
        "kind": "text",
        "section": "Booking a visit",
        "count": 1
      },
      {
        "en": "Next: Prepress Equipment",
        "zh": "下一頁：製版設備",
        "kind": "text",
        "section": "Booking a visit",
        "count": 1
      }
    ]
  },
  "solutions": {
    "mockup": "solutions.html",
    "items": [
      {
        "en": "NTI custom printed packaging solutions",
        "zh": "NTI 客製化包裝解決方案",
        "kind": "alt",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Home",
        "zh": "首頁",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Solutions",
        "zh": "解決方案",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Custom Packaging & Printing Solutions",
        "zh": "客製化包裝與印刷解決方案",
        "kind": "text",
        "section": "Custom Packaging & Printing Solutions",
        "count": 1
      },
      {
        "en": "Tailored Printing. Sustainable Design.",
        "zh": "量身訂製的印刷，永續的設計。",
        "kind": "text",
        "section": "Custom Packaging & Printing Solutions",
        "count": 1
      },
      {
        "en": "NTI provides complete custom packaging boxes and packaging printing solutions, from material recommendation and selection to structural design, printing techniques, finishing, and technical support. We help brands create custom boxes and packaging that perform beautifully, strengthen their brand, and support a more sustainable future.",
        "zh": "NTI 提供完整的客製化包裝盒與包裝印刷解決方案，從材料建議與選用、結構設計、印刷技術、印後加工到技術支援。我們協助品牌打造表現出色、強化品牌，並支持更永續未來的客製盒型與包裝。",
        "kind": "text",
        "section": "Custom Packaging & Printing Solutions",
        "count": 1
      },
      {
        "en": "Structural Design",
        "zh": "結構設計",
        "kind": "text",
        "section": "Custom Packaging & Printing Solutions",
        "count": 1
      },
      {
        "en": "Optimized packaging that reduces material use and waste.",
        "zh": "最佳化的包裝設計，減少材料使用與廢棄。",
        "kind": "text",
        "section": "Custom Packaging & Printing Solutions",
        "count": 1
      },
      {
        "en": "Pre-Press",
        "zh": "製版",
        "kind": "text",
        "section": "Custom Packaging & Printing Solutions",
        "count": 1
      },
      {
        "en": "Digital CTP technology improves quality while reducing pollution.",
        "zh": "數位 CTP 技術提升品質，同時降低污染。",
        "kind": "text",
        "section": "Custom Packaging & Printing Solutions",
        "count": 1
      },
      {
        "en": "Printing",
        "zh": "印刷",
        "kind": "text",
        "section": "Custom Packaging & Printing Solutions",
        "count": 1
      },
      {
        "en": "Energy-efficient production with lower waste and emissions.",
        "zh": "節能生產，更少的廢棄與排放。",
        "kind": "text",
        "section": "Custom Packaging & Printing Solutions",
        "count": 1
      },
      {
        "en": "Products",
        "zh": "產品",
        "kind": "text",
        "section": "Custom Packaging & Printing Solutions",
        "count": 1
      },
      {
        "en": "Color Box Packaging",
        "zh": "彩盒包裝",
        "kind": "text",
        "section": "Custom Packaging & Printing Solutions",
        "count": 1
      },
      {
        "en": "Packaging Paperboard",
        "zh": "包裝紙板",
        "kind": "text",
        "section": "Custom Packaging & Printing Solutions",
        "count": 1
      },
      {
        "en": "UV Printing",
        "zh": "UV 印刷",
        "kind": "text",
        "section": "Custom Packaging & Printing Solutions",
        "count": 1
      },
      {
        "en": "Other Printing",
        "zh": "其他印刷",
        "kind": "text",
        "section": "Custom Packaging & Printing Solutions",
        "count": 1
      },
      {
        "en": "Applications",
        "zh": "應用領域",
        "kind": "text",
        "section": "Custom Packaging & Printing Solutions",
        "count": 1
      },
      {
        "en": "Food | Electronics | Beauty | Medical | Luxury | Consumer Goods",
        "zh": "食品 | 電子 | 美妝 | 醫療 | 精品 | 消費性產品",
        "kind": "text",
        "section": "Custom Packaging & Printing Solutions",
        "count": 1
      },
      {
        "en": "Gluing box",
        "zh": "糊盒",
        "kind": "alt",
        "section": "Custom Packaging & Printing Solutions",
        "count": 1
      },
      {
        "en": "Gluing Box",
        "zh": "糊盒",
        "kind": "text",
        "section": "Custom Packaging & Printing Solutions",
        "count": 1
      },
      {
        "en": "The most common box type — top and bottom open, easy to assemble, and suited to lighter products.",
        "zh": "最常見的盒型 —— 上下開口、容易組裝，適合較輕的產品。",
        "kind": "text",
        "section": "Custom Packaging & Printing Solutions",
        "count": 1
      },
      {
        "en": "Projects",
        "zh": "實績案例",
        "kind": "text",
        "section": "Projects",
        "count": 1
      },
      {
        "en": "Real Projects. Real Impact.",
        "zh": "真實的專案，真實的影響。",
        "kind": "text",
        "section": "Projects",
        "count": 1
      },
      {
        "en": "Range of NTI sustainably printed product packaging",
        "zh": "NTI 永續印刷的多款產品包裝",
        "kind": "alt",
        "section": "Projects",
        "count": 1
      },
      {
        "en": "From packaging to promotional materials, NTI collaborates with brands across industries to deliver sustainable, high-quality results — explore our custom box portfolio and packaging case study highlights below. Each project reflects our commitment to innovation, precision, and environmental responsibility.",
        "zh": "從包裝到宣傳品，NTI 與各產業品牌合作，交出永續而高品質的成果 —— 以下是我們的客製盒型作品與包裝案例精選。每一個專案都體現我們對創新、精準與環境責任的堅持。",
        "kind": "text",
        "section": "Projects",
        "count": 1
      },
      {
        "en": "Industries / Applications",
        "zh": "產業與應用",
        "kind": "text",
        "section": "Industries / Applications",
        "count": 1
      },
      {
        "en": "Food & Beverage",
        "zh": "食品與飲料",
        "kind": "text",
        "section": "Industries / Applications",
        "count": 1
      },
      {
        "en": "Electronics",
        "zh": "電子",
        "kind": "text",
        "section": "Industries / Applications",
        "count": 1
      },
      {
        "en": "Beauty & Skincare",
        "zh": "美妝與保養",
        "kind": "text",
        "section": "Industries / Applications",
        "count": 1
      },
      {
        "en": "Medical & Healthcare",
        "zh": "醫療與保健",
        "kind": "text",
        "section": "Industries / Applications",
        "count": 1
      },
      {
        "en": "Luxury & Gift Packaging",
        "zh": "精品與禮盒包裝",
        "kind": "text",
        "section": "Industries / Applications",
        "count": 1
      },
      {
        "en": "Hardware & Hand Tools",
        "zh": "五金與手工具",
        "kind": "text",
        "section": "Industries / Applications",
        "count": 1
      },
      {
        "en": "Automotive",
        "zh": "汽車",
        "kind": "text",
        "section": "Industries / Applications",
        "count": 1
      },
      {
        "en": "Publishing & Stationery",
        "zh": "出版與文具",
        "kind": "text",
        "section": "Industries / Applications",
        "count": 1
      },
      {
        "en": "Home & Lifestyle",
        "zh": "居家與生活",
        "kind": "text",
        "section": "Industries / Applications",
        "count": 1
      },
      {
        "en": "Industrial & Consumer Goods",
        "zh": "工業與消費性產品",
        "kind": "text",
        "section": "Industries / Applications",
        "count": 1
      },
      {
        "en": "Explore how global brands trust NTI to print greener — without compromise.",
        "zh": "看看國際品牌如何信賴 NTI 印得更綠 —— 而且不必妥協。",
        "kind": "text",
        "section": "Industries / Applications",
        "count": 1
      },
      {
        "en": "View more projects",
        "zh": "看更多案例",
        "kind": "text",
        "section": "Industries / Applications",
        "count": 1
      },
      {
        "en": "Facilities & Equipment",
        "zh": "設備與廠房",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "Where Technology Meets Sustainability",
        "zh": "技術與永續的交會之處",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "NTI Printing integrates advanced pre-press, printing, and post-press systems inside our G7 certified printing plant — a printing factory in Taiwan designed for precision, efficiency and sustainability. We use Heidelberg and Man Roland presses with in-line varnishing and carbon-balanced systems, reducing energy use and emissions.",
        "zh": "NTI Printing 在通過 G7 認證的印刷廠內整合先進的製版、印刷與印後系統 —— 一座為精準、效率與永續而設計的台灣印刷廠。我們使用具備線上上光與碳平衡系統的海德堡與 Man Roland 印刷機，降低能源使用與排放。",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "NTI technician handling freshly printed sheets",
        "zh": "NTI 技術人員處理剛印好的紙張",
        "kind": "alt",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "Prepress Equipment",
        "zh": "製版設備",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "Direct to plate, in house",
        "zh": "直接製版，自廠輸出",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "NTI Printing utilizes the world’s most advanced prepress output software, integrated with a CTP (Computer-to-Plate) direct plate-making system. Coupled with a precise plate production control process, this ensures that the printing dots are accurately rendered, achieving faithful color reproduction in the final print.",
        "zh": "NTI Printing 採用世界最先進的製版輸出軟體，整合 CTP（電腦直接製版）系統，搭配精準的製版控管流程，確保印刷網點準確重現，讓成品色彩忠實還原。",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "In-house CTP system for faster turnaround and reduced transport.",
        "zh": "自廠 CTP 系統，交期更快、運輸更少。",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "Daily and weekly dot calibration for color precision.",
        "zh": "每日與每週的網點校正，確保色彩精準。",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "Eco-friendly production that minimizes heavy metals and wastewater.",
        "zh": "環保生產，將重金屬與廢水降到最低。",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "Heidelberg offset press line",
        "zh": "海德堡平版印刷產線",
        "kind": "alt",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "Environmentally Friendly Printing",
        "zh": "環保印刷",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "German presses with in-line varnishing — including a carbon-balanced line",
        "zh": "具備線上上光的德國印刷機 —— 其中一線為碳平衡機組",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "Heidelberg Press varnishing in line, to shorten the lead time and keep good quality at the same time. We also introduce an environmentally friendly system into the printing procedure.",
        "zh": "海德堡印刷機採線上上光，縮短交期同時維持良好品質。我們也在印刷流程中導入環保系統。",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "Heidelberg Speedmaster CD 102-6+LX 6-Colour Coater Press",
        "zh": "海德堡 Speedmaster CD 102-6+LX 六色上光印刷機",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "Heidelberg Speedmaster CD 102-5+LX 5-Colour Carbon Balanced Coater Press",
        "zh": "海德堡 Speedmaster CD 102-5+LX 五色碳平衡上光印刷機",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "Heidelberg Speedmaster CD 102-5+LX UV 5-Colour Coater Press",
        "zh": "海德堡 Speedmaster CD 102-5+LX UV 五色上光印刷機",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "Man Roland D-6050 Offenbach Two-Colour Offset Press",
        "zh": "Man Roland D-6050 Offenbach 雙色平版印刷機",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "Heidelberg Image Control System",
        "zh": "海德堡 Image Control 系統",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "Heidelberg Axis Control Colour Management System",
        "zh": "海德堡 Axis Control 色彩管理系統",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "Cut and folded box sample",
        "zh": "裁切成型的盒樣",
        "kind": "alt",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "Post-Press Processing",
        "zh": "印後加工",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "Die-cutting, gluing, window patching and wrapping — all in-house",
        "zh": "模切、糊盒、貼窗與包膜 —— 全部自廠完成",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "NTI Printing uses the most advanced die-cutting machines, automated gluing machines, and heat shrink film equipment to achieve high-efficiency production and deliver high-quality packaging products.",
        "zh": "NTI Printing 採用最先進的模切機、自動糊盒機與熱收縮膜設備，達成高效率生產，交出高品質的包裝產品。",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "Automated die-cutting, gluing, window patching, and lamination systems.",
        "zh": "自動化模切、糊盒、貼窗與貼合系統。",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "BOPP film coating eliminates solvent use and meets EU and US eco standards.",
        "zh": "BOPP 預塗膜免除溶劑使用，符合歐盟與美國環保標準。",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "High-speed shrink wrapping and labeling for efficient, secure finishing.",
        "zh": "高速收縮包膜與貼標，讓最後加工既有效率又穩妥。",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "X-Rite eXact spectrophotometer used for press-side colour measurement",
        "zh": "用於機邊色彩量測的 X-Rite eXact 分光光度計",
        "kind": "alt",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "Quality Inspection",
        "zh": "品質檢驗",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "Quality You Can Measure",
        "zh": "看得見數據的品質",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "NTI conducts strict quality control throughout every production stage — from materials to finished goods. Each print is tested for accuracy, durability, and consistency using precision tools such as:",
        "zh": "NTI 在每一個生產階段都執行嚴格的品質管控 —— 從材料到成品。每一件印品都以精密儀器檢測準確度、耐久性與一致性，例如：",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "X-Rite i1iO & eXact spectrophotometers — spectrum colour control testing apparatus.",
        "zh": "X-Rite i1iO 與 eXact 分光光度計 —— 光譜色彩控制檢測儀器。",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "IC Plate II plate checker — measures percentage dot area and analyzes the data to adjust dot areas.",
        "zh": "IC Plate II 印版檢測儀 —— 量測網點面積百分比並分析數據以調整網點。",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "Barcode grade scanner — all barcodes printed on goods are tested to check barcode grade.",
        "zh": "條碼等級檢測儀 —— 產品上所有印出的條碼都會檢測條碼等級。",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "Ink rub and gloss testers — used whenever a customer requests abrasion resistance testing.",
        "zh": "油墨耐磨與光澤度試驗機 —— 客戶要求耐磨測試時使用。",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "Temperature & humidity chambers — simulate high/low temperature conditions.",
        "zh": "恆溫恆濕試驗機 —— 模擬高低溫環境條件。",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "Gloss-Meter — tests whether the brightness of the paper surface meets requirements.",
        "zh": "光澤度計 —— 檢測紙張表面亮度是否符合要求。",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "Blister Packing Machine — tests the strength of the gluing part of the vacuum blister.",
        "zh": "泡殼包裝試驗機 —— 測試真空泡殼黏合部位的強度。",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      },
      {
        "en": "Explore our facilities & equipment",
        "zh": "看看我們的設備與廠房",
        "kind": "text",
        "section": "Facilities & Equipment",
        "count": 1
      }
    ]
  },
  "projects": {
    "mockup": "projects.html",
    "items": [
      {
        "en": "Home",
        "zh": "首頁",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Projects",
        "zh": "實績案例",
        "kind": "text",
        "section": "頁首",
        "count": 2
      },
      {
        "en": "Real Projects. Real Impact.",
        "zh": "真實的專案，真實的影響。",
        "kind": "text",
        "section": "Projects",
        "count": 1
      },
      {
        "en": "From packaging to promotional materials, NTI collaborates with brands across industries to deliver sustainable, high-quality results — explore our custom box portfolio and packaging case study highlights below. Each project reflects our commitment to innovation, precision, and environmental responsibility.",
        "zh": "從包裝到宣傳品，NTI 與各產業品牌合作，交出永續而高品質的成果 —— 以下是我們的客製盒型作品與包裝案例精選。每一個專案都體現我們對創新、精準與環境責任的堅持。",
        "kind": "text",
        "section": "Projects",
        "count": 1
      },
      {
        "en": "Industries / Applications",
        "zh": "產業與應用",
        "kind": "text",
        "section": "Industries / Applications",
        "count": 1
      },
      {
        "en": "Food & Beverage",
        "zh": "食品與飲料",
        "kind": "text",
        "section": "Industries / Applications",
        "count": 1
      },
      {
        "en": "Electronics",
        "zh": "電子",
        "kind": "text",
        "section": "Industries / Applications",
        "count": 1
      },
      {
        "en": "Beauty & Skincare",
        "zh": "美妝與保養",
        "kind": "text",
        "section": "Industries / Applications",
        "count": 1
      },
      {
        "en": "Medical & Healthcare",
        "zh": "醫療與保健",
        "kind": "text",
        "section": "Industries / Applications",
        "count": 1
      },
      {
        "en": "Luxury & Gift Packaging",
        "zh": "精品與禮盒包裝",
        "kind": "text",
        "section": "Industries / Applications",
        "count": 1
      },
      {
        "en": "Hardware & Hand Tools",
        "zh": "五金與手工具",
        "kind": "text",
        "section": "Industries / Applications",
        "count": 1
      },
      {
        "en": "Publishing & Stationery",
        "zh": "出版與文具",
        "kind": "text",
        "section": "Industries / Applications",
        "count": 1
      },
      {
        "en": "Automotive",
        "zh": "汽車",
        "kind": "text",
        "section": "Industries / Applications",
        "count": 1
      },
      {
        "en": "Industrial & Consumer Goods",
        "zh": "工業與消費性產品",
        "kind": "text",
        "section": "Industries / Applications",
        "count": 1
      },
      {
        "en": "Home & Lifestyle",
        "zh": "居家與生活",
        "kind": "text",
        "section": "Industries / Applications",
        "count": 1
      },
      {
        "en": "Case Studies & Photos",
        "zh": "案例與實拍",
        "kind": "text",
        "section": "Case Studies & Photos",
        "count": 1
      },
      {
        "en": "Explore how global brands trust NTI to print greener — without compromise.",
        "zh": "看看國際品牌如何信賴 NTI 印得更綠 —— 而且不必妥協。",
        "kind": "text",
        "section": "Case Studies & Photos",
        "count": 1
      }
    ]
  },
  "sustainability-hub": {
    "mockup": "green-advantage.html",
    "items": [
      {
        "en": "The courage to print green — recovered print waste ready for recycling",
        "zh": "勇於印綠 —— 回收後準備再生的印刷廢料",
        "kind": "alt",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Home",
        "zh": "首頁",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Sustainability",
        "zh": "永續",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Eco-Friendly Printing in Taiwan",
        "zh": "台灣的環保印刷",
        "kind": "text",
        "section": "Eco-Friendly Printing in Taiwan",
        "count": 1
      },
      {
        "en": "Our Green Advantage",
        "zh": "我們的綠色優勢",
        "kind": "text",
        "section": "Eco-Friendly Printing in Taiwan",
        "count": 1
      },
      {
        "en": "NTI Printing is one of Taiwan’s most certified eco-friendly printing manufacturers, holding FSC CoC, G7 Master Printer, and ISO 14001 certifications.",
        "zh": "NTI Printing 是台灣獲得最多認證的環保印刷廠之一，具備 FSC CoC、G7 Master Printer 與 ISO 14001 認證。",
        "kind": "text",
        "section": "Eco-Friendly Printing in Taiwan",
        "count": 1
      },
      {
        "en": "Partnering with NTI Printing, a leading green printing company in Taiwan, means your brand doesn’t just look exceptional — it demonstrates a genuine commitment to sustainability. Through advanced green printing practices, carbon-conscious production, and internationally recognized eco-friendly materials, we help businesses strengthen their ESG performance and support the carbon reduction expectations of customers and global markets. By choosing NTI, you enhance your brand reputation, build consumer confidence, and show The Courage to Print Green.",
        "zh": "與台灣領先的綠色印刷廠 NTI Printing 合作，代表您的品牌不只看起來出色 —— 更展現對永續的真實承諾。透過先進的綠色印刷做法、重視碳排的生產方式，以及國際認可的環保材料，我們協助企業強化 ESG 表現，回應客戶與全球市場的減碳期待。選擇 NTI，您能提升品牌聲譽、建立消費者信心，並展現「勇於印綠」的態度。",
        "kind": "text",
        "section": "Eco-Friendly Printing in Taiwan",
        "count": 1
      },
      {
        "en": "More details ›",
        "zh": "更多細節 ›",
        "kind": "text",
        "section": "Eco-Friendly Printing in Taiwan",
        "count": 4
      },
      {
        "en": "FSC and NTI Green Printing marks on eco-friendly packaging",
        "zh": "環保包裝上的 FSC 與 NTI 綠色印刷標章",
        "kind": "alt",
        "section": "Eco-Friendly Printing in Taiwan",
        "count": 1
      },
      {
        "en": "Carbon Efficiency / Carbon Neutral Printing",
        "zh": "碳效率／碳中和印刷",
        "kind": "text",
        "section": "Eco-Friendly Printing in Taiwan",
        "count": 1
      },
      {
        "en": "NTI Printing is committed to measurable carbon neutral printing and low carbon packaging production in Taiwan. We track our carbon footprint across printing cycles, invest in energy-efficient machines and adopt digital workflows that cut waste. Through the 4 Rs — Reduce, Reuse, Recover, Recycle — we lower raw-material use and emissions while maintaining premium print standards.",
        "zh": "NTI Printing 致力於可量測的碳中和印刷與台灣低碳包裝生產。我們追蹤各印刷循環的碳足跡，投資節能機台，並導入減少浪費的數位流程。透過 4R —— 減量、再利用、回收再生、循環再造 —— 在維持頂級印刷水準的同時降低原料使用與排放。",
        "kind": "text",
        "section": "Eco-Friendly Printing in Taiwan",
        "count": 1
      },
      {
        "en": "Recovered paper and print waste sorted for recycling",
        "zh": "分類回收的紙材與印刷廢料",
        "kind": "alt",
        "section": "Eco-Friendly Printing in Taiwan",
        "count": 1
      },
      {
        "en": "ECO Materials / Sustainable Printing Materials",
        "zh": "環保材料／永續印刷材料",
        "kind": "text",
        "section": "Eco-Friendly Printing in Taiwan",
        "count": 1
      },
      {
        "en": "Our commitment to sustainable packaging materials begins with the materials we choose and the technology we invest in. From FSC paper printing and low-VOC eco friendly printing ink to RoHS-compliant materials, solvent recovery, and advanced wastewater recycling systems, every step of our production process is designed to reduce environmental impact. Combined with energy-efficient presses and finishing equipment, we deliver exceptional print quality while minimizing waste, emissions, and resource consumption.",
        "zh": "我們對永續包裝材料的承諾，從選用的材料與投資的技術開始。從 FSC 紙材印刷、低 VOC 環保油墨，到符合 RoHS 的材料、溶劑回收與先進的廢水回收系統，生產流程的每一步都以降低環境衝擊為目標。搭配節能的印刷與加工設備，我們在交出卓越印刷品質的同時，把廢棄、排放與資源消耗降到最低。",
        "kind": "text",
        "section": "Eco-Friendly Printing in Taiwan",
        "count": 1
      },
      {
        "en": "Low-VOC eco-inks used on NTI's presses",
        "zh": "NTI 印刷機使用的低 VOC 環保油墨",
        "kind": "alt",
        "section": "Eco-Friendly Printing in Taiwan",
        "count": 1
      },
      {
        "en": "ESG & Future Goals / ESG Printing Commitment",
        "zh": "ESG 與未來目標／ESG 印刷承諾",
        "kind": "text",
        "section": "Eco-Friendly Printing in Taiwan",
        "count": 1
      },
      {
        "en": "At NTI Printing, ESG begins with people. We believe a safe, clean, modern, and comfortable workplace is fundamental to building a sustainable business. Our fully air-conditioned offices and production facility, together with staff amenities including a restaurant, library, dormitories, and shared spaces, reflect our commitment to the wellbeing of both our local and international employees.",
        "zh": "在 NTI Printing，ESG 從人開始。我們相信安全、整潔、現代而舒適的工作場所，是建立永續事業的基礎。全廠空調的辦公室與生產設施，加上員工餐廳、圖書室、宿舍與共用空間等設施，體現我們對本地與外籍同仁福祉的重視。",
        "kind": "text",
        "section": "Eco-Friendly Printing in Taiwan",
        "count": 1
      },
      {
        "en": "As a sustainable packaging manufacturer committed to responsible printing, NTI Printing is aligning its ESG packaging roadmap with the UN Sustainable Development Goals (SDGs) and evaluating Science-Based Targets (SBTi) status.",
        "zh": "作為投入負責任印刷的永續包裝製造商，NTI Printing 正將 ESG 包裝路線圖對齊聯合國永續發展目標（SDGs），並評估科學基礎減量目標（SBTi）的申請狀態。",
        "kind": "text",
        "section": "Eco-Friendly Printing in Taiwan",
        "count": 1
      },
      {
        "en": "CO2-neutral Heidelberg Speedmaster press line",
        "zh": "碳中和的海德堡 Speedmaster 印刷產線",
        "kind": "alt",
        "section": "Eco-Friendly Printing in Taiwan",
        "count": 1
      },
      {
        "en": "NTI Green Printing",
        "zh": "NTI 綠色印刷",
        "kind": "alt",
        "section": "Eco-Friendly Printing in Taiwan",
        "count": 1
      },
      {
        "en": "FSC certified",
        "zh": "FSC 認證",
        "kind": "alt",
        "section": "Eco-Friendly Printing in Taiwan",
        "count": 1
      },
      {
        "en": "LEED Leadership in Energy and Environmental Design",
        "zh": "LEED 能源與環境設計領導認證",
        "kind": "alt",
        "section": "Eco-Friendly Printing in Taiwan",
        "count": 1
      },
      {
        "en": "Mineral Oil Free",
        "zh": "無礦物油",
        "kind": "alt",
        "section": "Eco-Friendly Printing in Taiwan",
        "count": 1
      },
      {
        "en": "ESG Environmental, Social, Governance",
        "zh": "ESG 環境、社會、公司治理",
        "kind": "alt",
        "section": "Eco-Friendly Printing in Taiwan",
        "count": 1
      }
    ]
  },
  "green-our-advantage": {
    "mockup": "green-our-advantage.html",
    "items": [
      {
        "en": "FSC and NTI Green Printing marks on eco-friendly packaging",
        "zh": "環保包裝上的 FSC 與 NTI 綠色印刷標章",
        "kind": "alt",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Home",
        "zh": "首頁",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Sustainability",
        "zh": "永續",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Our Green Advantages",
        "zh": "我們的綠色優勢",
        "kind": "text",
        "section": "頁首",
        "count": 3
      },
      {
        "en": "Sustainability built into every stage of the business",
        "zh": "把永續做進事業的每一個環節",
        "kind": "text",
        "section": "Our Green Advantages",
        "count": 1
      },
      {
        "en": "Carbon Efficiency",
        "zh": "碳效率",
        "kind": "text",
        "section": "Our Green Advantages",
        "count": 1
      },
      {
        "en": "ECO Materials",
        "zh": "環保材料",
        "kind": "text",
        "section": "Our Green Advantages",
        "count": 1
      },
      {
        "en": "ESG & Future Goals",
        "zh": "ESG 與未來目標",
        "kind": "text",
        "section": "Our Green Advantages",
        "count": 1
      },
      {
        "en": "Our Green Advantage",
        "zh": "我們的綠色優勢",
        "kind": "text",
        "section": "Our Green Advantage",
        "count": 1
      },
      {
        "en": "NTI Printing is one of Taiwan’s most certified eco-friendly printing manufacturers, holding FSC CoC, G7 Master Printer, and ISO 14001 certifications.",
        "zh": "NTI Printing 是台灣獲得最多認證的環保印刷廠之一，具備 FSC CoC、G7 Master Printer 與 ISO 14001 認證。",
        "kind": "text",
        "section": "Our Green Advantage",
        "count": 1
      },
      {
        "en": "Benefit to Clients from Green Printing",
        "zh": "綠色印刷帶給客戶的效益",
        "kind": "text",
        "section": "Benefit to Clients from Green Printing",
        "count": 1
      },
      {
        "en": "Partnering with NTI Printing, a leading green printing company in Taiwan, means your brand doesn’t just look exceptional — it demonstrates a genuine commitment to sustainability. Through advanced green printing practices, carbon-conscious production, and internationally recognized eco-friendly materials, we help businesses strengthen their ESG performance and support the carbon reduction expectations of customers and global markets. By choosing NTI, you enhance your brand reputation, build consumer confidence, and show The Courage to Print Green.",
        "zh": "與台灣領先的綠色印刷廠 NTI Printing 合作，代表您的品牌不只看起來出色 —— 更展現對永續的真實承諾。透過先進的綠色印刷做法、重視碳排的生產方式，以及國際認可的環保材料，我們協助企業強化 ESG 表現，回應客戶與全球市場的減碳期待。選擇 NTI，您能提升品牌聲譽、建立消費者信心，並展現「勇於印綠」的態度。",
        "kind": "text",
        "section": "Benefit to Clients from Green Printing",
        "count": 1
      },
      {
        "en": "What green printing means here",
        "zh": "在這裡，綠色印刷是什麼意思",
        "kind": "text",
        "section": "What green printing means here",
        "count": 1
      },
      {
        "en": "It is not a claim bolted onto the finished job. Every material, ink and solvent we run passes RoHS inspection standards, and the plant operates waste-oil recovery and wastewater recycling systems built to international environmental standards. The advantage shows up as fewer make-ready sheets on the floor, solvent-free lamination, an FSC™ claim you can print on the pack, and a supply chain your ESG team can actually evidence.",
        "zh": "它不是印完之後才貼上去的宣稱。我們使用的每一種材料、油墨與溶劑都通過 RoHS 檢驗標準，廠內也依國際環保標準建置廢油回收與廢水回收系統。這個優勢會具體反映在：現場更少的調機廢紙、無溶劑貼合、可以印在包裝上的 FSC™ 宣告，以及一條您的 ESG 團隊真的舉得出證據的供應鏈。",
        "kind": "text",
        "section": "What green printing means here",
        "count": 1
      },
      {
        "en": "CO2-neutral Heidelberg Speedmaster press line",
        "zh": "碳中和的海德堡 Speedmaster 印刷產線",
        "kind": "alt",
        "section": "What green printing means here",
        "count": 1
      },
      {
        "en": "Company mission",
        "zh": "公司使命",
        "kind": "text",
        "section": "Company mission",
        "count": 1
      },
      {
        "en": "Keep promoting green packaging and build the full concept of green supply-chain management for our customers — becoming a printing firm with genuine environmental awareness and a high sense of social responsibility.",
        "zh": "持續推廣綠色包裝，為客戶建構完整的綠色供應鏈管理概念 —— 成為真正具備環境意識與高度社會責任感的印刷企業。",
        "kind": "text",
        "section": "Company mission",
        "count": 1
      },
      {
        "en": "How we cut carbon",
        "zh": "我們如何減碳",
        "kind": "text",
        "section": "Company mission",
        "count": 1
      },
      {
        "en": "Want this applied to your packaging? Send us the brief and we will come back with a spec and a quote.",
        "zh": "想把這套做法用在您的包裝上？把需求寄給我們，我們會回覆規格與報價。",
        "kind": "text",
        "section": "Company mission",
        "count": 1
      },
      {
        "en": "Get a Quote",
        "zh": "索取報價",
        "kind": "text",
        "section": "Company mission",
        "count": 1
      },
      {
        "en": "Next: Carbon Efficiency",
        "zh": "下一頁：碳效率",
        "kind": "text",
        "section": "Company mission",
        "count": 1
      }
    ]
  },
  "green-carbon": {
    "mockup": "green-carbon.html",
    "items": [
      {
        "en": "Recovered paper and print waste sorted for recycling",
        "zh": "分類回收的紙材與印刷廢料",
        "kind": "alt",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Home",
        "zh": "首頁",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Sustainability",
        "zh": "永續",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Carbon Efficiency",
        "zh": "碳效率",
        "kind": "text",
        "section": "頁首",
        "count": 4
      },
      {
        "en": "Measured, tracked and reduced across every printing cycle",
        "zh": "在每一個印刷循環中量測、追蹤並降低",
        "kind": "text",
        "section": "Carbon Efficiency",
        "count": 1
      },
      {
        "en": "Our Green Advantages",
        "zh": "我們的綠色優勢",
        "kind": "text",
        "section": "Carbon Efficiency",
        "count": 1
      },
      {
        "en": "ECO Materials",
        "zh": "環保材料",
        "kind": "text",
        "section": "Carbon Efficiency",
        "count": 1
      },
      {
        "en": "ESG & Future Goals",
        "zh": "ESG 與未來目標",
        "kind": "text",
        "section": "Carbon Efficiency",
        "count": 1
      },
      {
        "en": "NTI Printing is committed to measurable carbon neutral printing and low carbon packaging production in Taiwan. We track our carbon footprint across printing cycles, invest in energy-efficient machines and adopt digital workflows that cut waste. Through the 4 Rs — Reduce, Reuse, Recover, Recycle — we lower raw-material use and emissions while maintaining premium print standards.",
        "zh": "NTI Printing 致力於可量測的碳中和印刷與台灣低碳包裝生產。我們追蹤各印刷循環的碳足跡，投資節能機台，並導入減少浪費的數位流程。透過 4R —— 減量、再利用、回收再生、循環再造 —— 在維持頂級印刷水準的同時降低原料使用與排放。",
        "kind": "text",
        "section": "Carbon Efficiency",
        "count": 1
      },
      {
        "en": "CO2-neutral Heidelberg Speedmaster press line",
        "zh": "碳中和的海德堡 Speedmaster 印刷產線",
        "kind": "alt",
        "section": "Carbon Efficiency",
        "count": 1
      },
      {
        "en": "One-stop process, lower carbon",
        "zh": "一站式製程，更低的碳",
        "kind": "text",
        "section": "One-stop process, lower carbon",
        "count": 1
      },
      {
        "en": "Design, pre-press, plate-making, printing, coating, die-cutting, folding/gluing and quality control all happen in house. That removes rounds of communication and, more to the point, removes transport between suppliers — the single largest avoidable emission in conventional packaging production.",
        "zh": "設計、製版、輸出、印刷、上光、模切、糊盒與品管全部在自廠完成。這省去了來回溝通，更重要的是省去供應商之間的運輸 —— 那是傳統包裝生產中最大的一項可避免排放。",
        "kind": "text",
        "section": "One-stop process, lower carbon",
        "count": 1
      },
      {
        "en": "Design",
        "zh": "設計",
        "kind": "text",
        "section": "One-stop process, lower carbon",
        "count": 1
      },
      {
        "en": "Structure design works for function first and to cut paper wastage — the cheapest carbon to remove is the material never used.",
        "zh": "結構設計以功能為先，同時減少紙材浪費 —— 最便宜的減碳，就是從一開始就沒用掉的材料。",
        "kind": "text",
        "section": "One-stop process, lower carbon",
        "count": 1
      },
      {
        "en": "Pre-Press",
        "zh": "製版",
        "kind": "text",
        "section": "One-stop process, lower carbon",
        "count": 1
      },
      {
        "en": "Computer-to-plate replaces traditional plate-making, reducing heavy metals and sewage while improving plate quality.",
        "zh": "以電腦直接製版取代傳統製版，在提升印版品質的同時減少重金屬與廢水。",
        "kind": "text",
        "section": "One-stop process, lower carbon",
        "count": 1
      },
      {
        "en": "Printing",
        "zh": "印刷",
        "kind": "text",
        "section": "One-stop process, lower carbon",
        "count": 1
      },
      {
        "en": "Energy-efficient presses plus an ink pre-release system reduce waste ink, solvent and paper at make-ready.",
        "zh": "節能印刷機搭配油墨預釋放系統，減少調機時的廢墨、溶劑與紙張。",
        "kind": "text",
        "section": "One-stop process, lower carbon",
        "count": 1
      },
      {
        "en": "The 4 Rs",
        "zh": "4R",
        "kind": "text",
        "section": "One-stop process, lower carbon",
        "count": 1
      },
      {
        "en": "Reduce, Reuse, Recover, Recycle — applied across materials, tooling, solvent and offcuts.",
        "zh": "減量、再利用、回收再生、循環再造 —— 落實在材料、模具、溶劑與裁切邊料上。",
        "kind": "text",
        "section": "One-stop process, lower carbon",
        "count": 1
      },
      {
        "en": "Water & solvent",
        "zh": "水與溶劑",
        "kind": "text",
        "section": "Water & solvent",
        "count": 1
      },
      {
        "en": "Waste-oil recovery and wastewater recycling systems run to international environmental standards. Treated water leaves at a COD value of 100–250 mg/L and pH 7–7.8; recovered solvent is separated and reused rather than discarded.",
        "zh": "廢油回收與廢水回收系統依國際環保標準運作。處理後的排放水 COD 值為 100–250 mg/L、pH 7–7.8；回收的溶劑經分離後再利用，而非丟棄。",
        "kind": "text",
        "section": "Water & solvent",
        "count": 1
      },
      {
        "en": "Want this applied to your packaging? Send us the brief and we will come back with a spec and a quote.",
        "zh": "想把這套做法用在您的包裝上？把需求寄給我們，我們會回覆規格與報價。",
        "kind": "text",
        "section": "Water & solvent",
        "count": 1
      },
      {
        "en": "Get a Quote",
        "zh": "索取報價",
        "kind": "text",
        "section": "Water & solvent",
        "count": 1
      },
      {
        "en": "Next: ECO Materials",
        "zh": "下一頁：環保材料",
        "kind": "text",
        "section": "Water & solvent",
        "count": 1
      }
    ]
  },
  "green-materials": {
    "mockup": "green-materials.html",
    "items": [
      {
        "en": "Low-VOC eco-inks used on NTI's presses",
        "zh": "NTI 印刷機使用的低 VOC 環保油墨",
        "kind": "alt",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Home",
        "zh": "首頁",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Sustainability",
        "zh": "永續",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "ECO Materials",
        "zh": "環保材料",
        "kind": "text",
        "section": "頁首",
        "count": 4
      },
      {
        "en": "Substrates, inks and equipment chosen for what they leave behind",
        "zh": "依「留下什麼」來挑選的紙材、油墨與設備",
        "kind": "text",
        "section": "ECO Materials",
        "count": 1
      },
      {
        "en": "Our Green Advantages",
        "zh": "我們的綠色優勢",
        "kind": "text",
        "section": "ECO Materials",
        "count": 1
      },
      {
        "en": "Carbon Efficiency",
        "zh": "碳效率",
        "kind": "text",
        "section": "ECO Materials",
        "count": 1
      },
      {
        "en": "ESG & Future Goals",
        "zh": "ESG 與未來目標",
        "kind": "text",
        "section": "ECO Materials",
        "count": 1
      },
      {
        "en": "Our commitment to sustainable packaging materials begins with the materials we choose and the technology we invest in. From FSC paper printing and low-VOC eco friendly printing ink to RoHS-compliant materials, solvent recovery, and advanced wastewater recycling systems, every step of our production process is designed to reduce environmental impact. Combined with energy-efficient presses and finishing equipment, we deliver exceptional print quality while minimizing waste, emissions, and resource consumption.",
        "zh": "我們對永續包裝材料的承諾，從選用的材料與投資的技術開始。從 FSC 紙材印刷、低 VOC 環保油墨，到符合 RoHS 的材料、溶劑回收與先進的廢水回收系統，生產流程的每一步都以降低環境衝擊為目標。搭配節能的印刷與加工設備，我們在交出卓越印刷品質的同時，把廢棄、排放與資源消耗降到最低。",
        "kind": "text",
        "section": "ECO Materials",
        "count": 1
      },
      {
        "en": "RoHS-Compliant Throughout",
        "zh": "全流程符合 RoHS",
        "kind": "text",
        "section": "ECO Materials",
        "count": 1
      },
      {
        "en": "Every material, ink and solvent used in production passes RoHS inspection standards.",
        "zh": "生產中使用的每一種材料、油墨與溶劑，都通過 RoHS 檢驗標準。",
        "kind": "text",
        "section": "ECO Materials",
        "count": 1
      },
      {
        "en": "Eco-Friendly Ink",
        "zh": "環保油墨",
        "kind": "text",
        "section": "ECO Materials",
        "count": 2
      },
      {
        "en": "Ink systems formulated to under 1% VOC, used with sewage treatment and solvent recovery on site.",
        "zh": "VOC 含量低於 1% 的油墨系統，並在廠內搭配污水處理與溶劑回收使用。",
        "kind": "text",
        "section": "ECO Materials",
        "count": 1
      },
      {
        "en": "FSC™ Chain of Custody",
        "zh": "FSC™ 產銷監管鏈",
        "kind": "text",
        "section": "ECO Materials",
        "count": 1
      },
      {
        "en": "Ink, varnish, lotions and solvents comply with RoHS and REACH; substrates carry FSC™ certified chain of custody from mill to finished carton.",
        "zh": "油墨、光油、藥水與溶劑符合 RoHS 與 REACH；紙材自紙廠到成品彩盒皆具備 FSC™ 產銷監管鏈認證。",
        "kind": "text",
        "section": "ECO Materials",
        "count": 1
      },
      {
        "en": "Solvent-Free Lamination",
        "zh": "無溶劑貼合",
        "kind": "text",
        "section": "ECO Materials",
        "count": 1
      },
      {
        "en": "BOPP pre-coated film replaces traditional wet lamination — no solvent, no drying oven, no emissions.",
        "zh": "以 BOPP 預塗膜取代傳統濕式貼合 —— 無溶劑、免烘乾、無排放。",
        "kind": "text",
        "section": "ECO Materials",
        "count": 1
      },
      {
        "en": "Waste Oil & Water Recovery",
        "zh": "廢油與廢水回收",
        "kind": "text",
        "section": "ECO Materials",
        "count": 1
      },
      {
        "en": "Waste-oil recovery equipment and a wastewater recycling system, both meeting international environmental protection standards.",
        "zh": "廢油回收設備與廢水回收系統，兩者皆符合國際環境保護標準。",
        "kind": "text",
        "section": "ECO Materials",
        "count": 1
      },
      {
        "en": "FSC and NTI Green Printing marks on eco-friendly packaging",
        "zh": "環保包裝上的 FSC 與 NTI 綠色印刷標章",
        "kind": "alt",
        "section": "ECO Materials",
        "count": 1
      },
      {
        "en": "Integrated Green Production",
        "zh": "整合式綠色生產",
        "kind": "text",
        "section": "Integrated Green Production",
        "count": 1
      },
      {
        "en": "Our integrated production process improves efficiency while reducing environmental impact. By utilizing Computer-to-Plate (CTP) technology, we eliminate traditional plate-making processes, reducing heavy metal contamination, wastewater, material waste, and overall carbon emissions.",
        "zh": "整合式生產流程在提升效率的同時降低環境衝擊。採用電腦直接製版（CTP）技術，我們省去傳統製版流程，減少重金屬污染、廢水、材料浪費與整體碳排放。",
        "kind": "text",
        "section": "Integrated Green Production",
        "count": 1
      },
      {
        "en": "Printing",
        "zh": "印刷",
        "kind": "text",
        "section": "Printing",
        "count": 1
      },
      {
        "en": "NTI’s advanced printing equipment is designed to maximize production efficiency while minimizing energy consumption. Our eco-friendly printing systems reduce ink waste, solvent usage, and paper waste, delivering exceptional print quality with a lower environmental footprint.",
        "zh": "NTI 的先進印刷設備以最大化生產效率、最小化能源消耗為設計目標。環保印刷系統減少廢墨、溶劑與紙張浪費，以更低的環境足跡交出卓越的印刷品質。",
        "kind": "text",
        "section": "Printing",
        "count": 1
      },
      {
        "en": "We use environmentally responsible eco friendly printing ink containing less than 1% VOC (Volatile Organic Compounds), together with solvent recovery systems that help reduce emissions and improve workplace safety while maintaining outstanding print performance.",
        "zh": "我們使用 VOC（揮發性有機化合物）含量低於 1% 的環保油墨，搭配溶劑回收系統，在維持優異印刷表現的同時降低排放、提升工作場所安全。",
        "kind": "text",
        "section": "Eco-Friendly Ink",
        "count": 1
      },
      {
        "en": "Sewage Treatment",
        "zh": "污水處理",
        "kind": "text",
        "section": "Sewage Treatment",
        "count": 1
      },
      {
        "en": "Environmental responsibility extends beyond the printing press. NTI operates advanced wastewater treatment and recycling systems for both production and domestic water, ensuring discharged water consistently meets strict environmental standards. Together with our renewable solar energy infrastructure and ongoing carbon footprint reduction initiatives, we continue to build a cleaner and more sustainable future.",
        "zh": "環境責任不只停在印刷機旁。NTI 為生產用水與生活用水都設有先進的廢水處理與回收系統，確保排放水持續符合嚴格的環保標準。搭配再生太陽能設施與持續的碳足跡減量行動，我們持續打造更乾淨、更永續的未來。",
        "kind": "text",
        "section": "Sewage Treatment",
        "count": 1
      },
      {
        "en": "Mono-material by default",
        "zh": "以單一材質為預設",
        "kind": "text",
        "section": "Mono-material by default",
        "count": 1
      },
      {
        "en": "Where a structure allows it, we redesign to a single recyclable material rather than a laminate — keeping shelf impact while making the pack straightforward for consumers to recycle.",
        "zh": "只要結構允許，我們就把設計改成單一可回收材質而非複合貼合 —— 保有貨架質感，同時讓消費者能輕鬆回收。",
        "kind": "text",
        "section": "Mono-material by default",
        "count": 1
      },
      {
        "en": "See a mono-material redesign",
        "zh": "看看單一材質的改版案例",
        "kind": "text",
        "section": "Mono-material by default",
        "count": 1
      },
      {
        "en": "Want this applied to your packaging? Send us the brief and we will come back with a spec and a quote.",
        "zh": "想把這套做法用在您的包裝上？把需求寄給我們，我們會回覆規格與報價。",
        "kind": "text",
        "section": "Mono-material by default",
        "count": 1
      },
      {
        "en": "Get a Quote",
        "zh": "索取報價",
        "kind": "text",
        "section": "Mono-material by default",
        "count": 1
      },
      {
        "en": "Next: ESG & Future Goals",
        "zh": "下一頁：ESG 與未來目標",
        "kind": "text",
        "section": "Mono-material by default",
        "count": 1
      }
    ]
  },
  "green-esg": {
    "mockup": "green-esg.html",
    "items": [
      {
        "en": "CO2-neutral Heidelberg Speedmaster press line",
        "zh": "碳中和的海德堡 Speedmaster 印刷產線",
        "kind": "alt",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Home",
        "zh": "首頁",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Sustainability",
        "zh": "永續",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "ESG & Future Goals",
        "zh": "ESG 與未來目標",
        "kind": "text",
        "section": "頁首",
        "count": 4
      },
      {
        "en": "Environmental, social and governance commitments — and what comes next",
        "zh": "環境、社會與公司治理的承諾 —— 以及接下來要做的事",
        "kind": "text",
        "section": "ESG & Future Goals",
        "count": 1
      },
      {
        "en": "Our Green Advantages",
        "zh": "我們的綠色優勢",
        "kind": "text",
        "section": "ESG & Future Goals",
        "count": 1
      },
      {
        "en": "Carbon Efficiency",
        "zh": "碳效率",
        "kind": "text",
        "section": "ESG & Future Goals",
        "count": 1
      },
      {
        "en": "ECO Materials",
        "zh": "環保材料",
        "kind": "text",
        "section": "ESG & Future Goals",
        "count": 1
      },
      {
        "en": "At NTI Printing, ESG begins with people. We believe a safe, clean, modern, and comfortable workplace is fundamental to building a sustainable business. Our fully air-conditioned offices and production facility, together with staff amenities including a restaurant, library, dormitories, and shared spaces, reflect our commitment to the wellbeing of both our local and international employees.",
        "zh": "在 NTI Printing，ESG 從人開始。我們相信安全、整潔、現代而舒適的工作場所，是建立永續事業的基礎。全廠空調的辦公室與生產設施，加上員工餐廳、圖書室、宿舍與共用空間等設施，體現我們對本地與外籍同仁福祉的重視。",
        "kind": "text",
        "section": "ESG & Future Goals",
        "count": 1
      },
      {
        "en": "As a sustainable packaging manufacturer committed to responsible printing, NTI Printing is aligning its ESG packaging roadmap with the UN Sustainable Development Goals (SDGs) and evaluating Science-Based Targets (SBTi) status.",
        "zh": "作為投入負責任印刷的永續包裝製造商，NTI Printing 正將 ESG 包裝路線圖對齊聯合國永續發展目標（SDGs），並評估科學基礎減量目標（SBTi）的申請狀態。",
        "kind": "text",
        "section": "ESG & Future Goals",
        "count": 1
      },
      {
        "en": "Corporate Social Responsibility",
        "zh": "企業社會責任",
        "kind": "text",
        "section": "Corporate Social Responsibility",
        "count": 1
      },
      {
        "en": "Corporate social responsibility is a continuing commitment to behave ethically and contribute to economic development, while improving the quality of life of the workforce and their families as well as the local community and society at large. NTI encourages its staff to take part in philanthropy, community volunteering and environmental clean-up work — the CSR programme is an extension of how the company already operates, not a separate initiative.",
        "zh": "企業社會責任是一份持續的承諾：以合乎倫理的方式經營、對經濟發展有所貢獻，同時改善員工與其家庭、在地社區乃至整體社會的生活品質。NTI 鼓勵同仁參與公益、社區志工與環境淨化工作 —— CSR 計畫是公司既有運作方式的延伸，而不是另外掛上去的專案。",
        "kind": "text",
        "section": "Corporate Social Responsibility",
        "count": 1
      },
      {
        "en": "Environmental Sustainability",
        "zh": "環境永續",
        "kind": "text",
        "section": "Environmental Sustainability",
        "count": 1
      },
      {
        "en": "Green printing is a direction the industry is moving in, so materials and equipment are purchased on the premise that they reduce pollution and energy consumption.",
        "zh": "綠色印刷是產業前進的方向，因此我們採購材料與設備時，都以能否減少污染與能源消耗為前提。",
        "kind": "text",
        "section": "Environmental Sustainability",
        "count": 1
      },
      {
        "en": "Eco-Friendly Material",
        "zh": "環保材料",
        "kind": "text",
        "section": "Environmental Sustainability",
        "count": 1
      },
      {
        "en": "Main materials — ink, varnish, lotions and solvents — comply with RoHS and REACH, and hold FSC™ Chain of Custody certification.",
        "zh": "主要材料 —— 油墨、光油、藥水與溶劑 —— 皆符合 RoHS 與 REACH，並取得 FSC™ 產銷監管鏈認證。",
        "kind": "text",
        "section": "Environmental Sustainability",
        "count": 1
      },
      {
        "en": "Waste Treatment",
        "zh": "廢棄物處理",
        "kind": "text",
        "section": "Environmental Sustainability",
        "count": 1
      },
      {
        "en": "Internal sewage treatment and a waste-solvent recovery system separate impurities and recycle what can be reused. Treated wastewater leaves at pH 7–7.8.",
        "zh": "廠內污水處理與廢溶劑回收系統會分離雜質，並回收可再利用的部分。處理後的廢水以 pH 7–7.8 排放。",
        "kind": "text",
        "section": "Environmental Sustainability",
        "count": 1
      },
      {
        "en": "Energy & Emissions",
        "zh": "能源與排放",
        "kind": "text",
        "section": "Environmental Sustainability",
        "count": 1
      },
      {
        "en": "Energy saving and carbon reduction are managed across the continuous production process rather than at a single stage.",
        "zh": "節能減碳是在整條連續生產流程中管理，而不是只在某一個階段。",
        "kind": "text",
        "section": "Environmental Sustainability",
        "count": 1
      },
      {
        "en": "Recovered paper and print waste sorted for recycling",
        "zh": "分類回收的紙材與印刷廢料",
        "kind": "alt",
        "section": "Environmental Sustainability",
        "count": 1
      },
      {
        "en": "Employee Development",
        "zh": "員工發展",
        "kind": "text",
        "section": "Employee Development",
        "count": 1
      },
      {
        "en": "To build both competitiveness and technical depth, NTI runs education and training for every department and supports staff attending outside lectures and exhibitions.",
        "zh": "為了同時建立競爭力與技術深度，NTI 為各部門舉辦教育訓練，並支持同仁參加外部講座與展覽。",
        "kind": "text",
        "section": "Employee Development",
        "count": 1
      },
      {
        "en": "EHS — Safety, Health, Environment",
        "zh": "EHS —— 安全、衛生、環境",
        "kind": "text",
        "section": "Employee Development",
        "count": 1
      },
      {
        "en": "Regular fire drills, escape-route and evacuation practice, AED first-aid training and occupational safety briefings.",
        "zh": "定期消防演練、逃生路線與疏散演習、AED 急救訓練與職業安全宣導。",
        "kind": "text",
        "section": "Employee Development",
        "count": 1
      },
      {
        "en": "NTI Academy",
        "zh": "NTI 學院",
        "kind": "text",
        "section": "Employee Development",
        "count": 1
      },
      {
        "en": "Education and training courses across departments, with support for staff attending industry lectures and exhibitions.",
        "zh": "跨部門的教育訓練課程，並支持同仁參與產業講座與展覽。",
        "kind": "text",
        "section": "Employee Development",
        "count": 1
      },
      {
        "en": "Committee of Employees’ Welfare",
        "zh": "職工福利委員會",
        "kind": "text",
        "section": "Employee Development",
        "count": 1
      },
      {
        "en": "Runs activities that build cohesion across the team and manages employee welfare.",
        "zh": "舉辦凝聚團隊向心力的活動，並管理員工福利事項。",
        "kind": "text",
        "section": "Employee Development",
        "count": 1
      },
      {
        "en": "Contribution to the Community",
        "zh": "回饋社區",
        "kind": "text",
        "section": "Contribution to the Community",
        "count": 1
      },
      {
        "en": "NTI takes part in public-welfare and environmental-protection activities, pushing community development forward and carrying out its mission through practical work rather than statements.",
        "zh": "NTI 參與公益與環境保護活動，推動社區發展，以實際行動而非口號履行使命。",
        "kind": "text",
        "section": "Contribution to the Community",
        "count": 1
      },
      {
        "en": "Charity Bazaar",
        "zh": "公益義賣",
        "kind": "text",
        "section": "Contribution to the Community",
        "count": 1
      },
      {
        "en": "Charity events held through the year, with proceeds donated to related public-interest groups.",
        "zh": "全年舉辦公益活動，所得捐贈相關公益團體。",
        "kind": "text",
        "section": "Contribution to the Community",
        "count": 1
      },
      {
        "en": "Beach Cleanup",
        "zh": "淨灘",
        "kind": "text",
        "section": "Contribution to the Community",
        "count": 1
      },
      {
        "en": "Coastal clean-up activity that keeps waste out of the ocean and raises awareness of marine debris in the community.",
        "zh": "海岸淨灘活動，減少流入海洋的廢棄物，也提升社區對海洋廢棄物的意識。",
        "kind": "text",
        "section": "Contribution to the Community",
        "count": 1
      },
      {
        "en": "NTI Green Printing",
        "zh": "NTI 綠色印刷",
        "kind": "alt",
        "section": "Contribution to the Community",
        "count": 1
      },
      {
        "en": "FSC certified",
        "zh": "FSC 認證",
        "kind": "alt",
        "section": "Contribution to the Community",
        "count": 1
      },
      {
        "en": "ESG Environmental, Social, Governance",
        "zh": "ESG 環境、社會、公司治理",
        "kind": "alt",
        "section": "Contribution to the Community",
        "count": 1
      },
      {
        "en": "Want this applied to your packaging? Send us the brief and we will come back with a spec and a quote.",
        "zh": "想把這套做法用在您的包裝上？把需求寄給我們，我們會回覆規格與報價。",
        "kind": "text",
        "section": "Contribution to the Community",
        "count": 1
      },
      {
        "en": "Get a Quote",
        "zh": "索取報價",
        "kind": "text",
        "section": "Contribution to the Community",
        "count": 1
      },
      {
        "en": "Next: Our Green Advantage",
        "zh": "下一頁：我們的綠色優勢",
        "kind": "text",
        "section": "Contribution to the Community",
        "count": 1
      }
    ]
  },
  "insights": {
    "mockup": "insights.html",
    "items": [
      {
        "en": "NTI Printing Insights — sustainable packaging knowledge hub",
        "zh": "NTI Printing 洞察 —— 永續包裝知識中心",
        "kind": "alt",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Home",
        "zh": "首頁",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Insights",
        "zh": "洞察",
        "kind": "text",
        "section": "頁首",
        "count": 2
      },
      {
        "en": "Knowledge hub",
        "zh": "知識中心",
        "kind": "text",
        "section": "Insights",
        "count": 1
      },
      {
        "en": "Company news, video stories, straight answers and the trends reshaping packaging — everything we learn about printing green, gathered in one place.",
        "zh": "公司消息、影像故事、直接的回答，以及正在重塑包裝的趨勢 —— 我們關於印綠所學到的一切，都收在這裡。",
        "kind": "text",
        "section": "Insights",
        "count": 1
      },
      {
        "en": "Latest News",
        "zh": "最新消息",
        "kind": "text",
        "section": "Insights",
        "count": 1
      },
      {
        "en": "Awards, partnerships and green printing milestones",
        "zh": "獲獎、合作夥伴與綠色印刷的里程碑",
        "kind": "text",
        "section": "Insights",
        "count": 1
      },
      {
        "en": "Green Vlog",
        "zh": "綠色 Vlog",
        "kind": "text",
        "section": "Insights",
        "count": 1
      },
      {
        "en": "Watch how low-carbon packaging is actually made",
        "zh": "看看低碳包裝實際上是怎麼做出來的",
        "kind": "text",
        "section": "Insights",
        "count": 1
      },
      {
        "en": "FAQ",
        "zh": "常見問題",
        "kind": "text",
        "section": "Insights",
        "count": 1
      },
      {
        "en": "Minimums, lead times, certifications — answered",
        "zh": "最小量、交期、認證 —— 都有答案",
        "kind": "text",
        "section": "Insights",
        "count": 1
      },
      {
        "en": "Industry Trends",
        "zh": "產業趨勢",
        "kind": "text",
        "section": "Insights",
        "count": 1
      },
      {
        "en": "Where sustainable packaging is heading next",
        "zh": "永續包裝接下來要往哪裡走",
        "kind": "text",
        "section": "Insights",
        "count": 1
      }
    ]
  },
  "news-list": {
    "mockup": "news.html",
    "items": [
      {
        "en": "NTI Printing news — sustainably printed packaging patterns",
        "zh": "NTI Printing 消息 —— 永續印刷的包裝圖樣",
        "kind": "alt",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Home",
        "zh": "首頁",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Insights",
        "zh": "洞察",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Latest News",
        "zh": "最新消息",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "News",
        "zh": "最新消息",
        "kind": "text",
        "section": "News",
        "count": 1
      },
      {
        "en": "Latest news & insights",
        "zh": "最新消息與觀點",
        "kind": "text",
        "section": "News",
        "count": 1
      },
      {
        "en": "Stay connected with NTI Printing’s latest green printing innovations, sustainable packaging initiatives, company news, and industry achievements.",
        "zh": "掌握 NTI Printing 最新的綠色印刷創新、永續包裝行動、公司消息與產業成果。",
        "kind": "text",
        "section": "News",
        "count": 1
      }
    ]
  },
  "green-vlog": {
    "mockup": "green-vlog.html",
    "items": [
      {
        "en": "Home",
        "zh": "首頁",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Insights",
        "zh": "洞察",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Green Vlog",
        "zh": "綠色 Vlog",
        "kind": "text",
        "section": "頁首",
        "count": 2
      },
      {
        "en": "Green knowledge hub",
        "zh": "綠色知識中心",
        "kind": "text",
        "section": "Green Vlog",
        "count": 1
      },
      {
        "en": "Explore practical insights, industry trends, and sustainable packaging and eco friendly printing solutions that help brands build a greener future.",
        "zh": "探索實用觀點、產業趨勢，以及協助品牌打造更永續未來的永續包裝與環保印刷方案。",
        "kind": "text",
        "section": "Green Vlog",
        "count": 1
      }
    ]
  },
  "faq": {
    "mockup": "faq.html",
    "items": [
      {
        "en": "Home",
        "zh": "首頁",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Insights",
        "zh": "洞察",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "FAQ",
        "zh": "常見問題",
        "kind": "text",
        "section": "頁首",
        "count": 2
      },
      {
        "en": "Your questions answered",
        "zh": "您的問題，我們來回答",
        "kind": "text",
        "section": "FAQ",
        "count": 1
      },
      {
        "en": "Find answers to common questions about green printing, packaging, certifications, sustainability, and working with NTI.",
        "zh": "關於綠色印刷、包裝、認證、永續，以及與 NTI 合作的常見問題解答。",
        "kind": "text",
        "section": "FAQ",
        "count": 1
      },
      {
        "en": "Didn’t find your answer?",
        "zh": "沒找到您的答案？",
        "kind": "text",
        "section": "FAQ",
        "count": 1
      },
      {
        "en": "Our team replies within one business day.",
        "zh": "我們的團隊會在一個工作日內回覆。",
        "kind": "text",
        "section": "FAQ",
        "count": 1
      },
      {
        "en": "Contact us",
        "zh": "聯絡我們",
        "kind": "text",
        "section": "FAQ",
        "count": 1
      }
    ]
  },
  "industry-trends": {
    "mockup": "industry-trends.html",
    "items": [
      {
        "en": "Sustainable packaging industry trends",
        "zh": "永續包裝產業趨勢",
        "kind": "alt",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Home",
        "zh": "首頁",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Insights",
        "zh": "洞察",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Industry Trends",
        "zh": "產業趨勢",
        "kind": "text",
        "section": "頁首",
        "count": 2
      },
      {
        "en": "Where packaging is heading",
        "zh": "包裝正在往哪裡走",
        "kind": "text",
        "section": "Industry Trends",
        "count": 1
      },
      {
        "en": "What brand owners are asking us for, and what the regulations, materials and machines are about to make standard.",
        "zh": "品牌客戶正在向我們要求什麼，以及法規、材料與機台即將把哪些事變成標配。",
        "kind": "text",
        "section": "Industry Trends",
        "count": 1
      },
      {
        "en": "We sit between brand owners and the pressroom, so we see requirement changes early — usually a year or two before they land in a tender document. These are the shifts our customers are planning around right now.",
        "zh": "我們位在品牌客戶與印刷現場之間，因此很早就看到需求的變化 —— 通常比它出現在標案文件上早一到兩年。以下是我們的客戶現在正在據以規劃的轉變。",
        "kind": "text",
        "section": "Industry Trends",
        "count": 1
      }
    ]
  },
  "careers": {
    "mockup": "careers.html",
    "items": [
      {
        "en": "Working at NTI Printing in Tainan, Taiwan",
        "zh": "在台灣台南的 NTI Printing 工作",
        "kind": "alt",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Home",
        "zh": "首頁",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Careers",
        "zh": "人才招募",
        "kind": "text",
        "section": "頁首",
        "count": 2
      },
      {
        "en": "Join the green print team",
        "zh": "加入綠色印刷團隊",
        "kind": "text",
        "section": "Careers",
        "count": 1
      },
      {
        "en": "We are building Taiwan’s most sustainable packaging plant. That takes press operators, engineers, designers and people who ask better questions.",
        "zh": "我們正在打造台灣最永續的包裝工廠。這需要印刷機操作員、工程師、設計師，以及願意提出更好問題的人。",
        "kind": "text",
        "section": "Careers",
        "count": 1
      },
      {
        "en": "NTI Printing has been printing in Tainan for over three decades, and reinvesting in low-carbon production for the last ten. If you want your work to show up in a measurable carbon number as well as on a shelf, this is a good place to do it.",
        "zh": "NTI Printing 在台南印刷已逾三十年，並在近十年持續投入低碳生產。如果你希望自己的工作不只出現在貨架上，也能反映在可量測的碳數字裡，這裡會是個好地方。",
        "kind": "text",
        "section": "Careers",
        "count": 1
      },
      {
        "en": "Why NTI",
        "zh": "為什麼選 NTI",
        "kind": "text",
        "section": "Why NTI",
        "count": 1
      },
      {
        "en": "Modern Heidelberg and HP lines, maintained properly",
        "zh": "妥善保養的海德堡與 HP 現代化產線",
        "kind": "text",
        "section": "Why NTI",
        "count": 1
      },
      {
        "en": "Training budget and certification support",
        "zh": "教育訓練預算與證照補助",
        "kind": "text",
        "section": "Why NTI",
        "count": 1
      },
      {
        "en": "Profit sharing and performance bonus",
        "zh": "盈餘分享與績效獎金",
        "kind": "text",
        "section": "Why NTI",
        "count": 1
      },
      {
        "en": "Group insurance above statutory cover",
        "zh": "優於法定的團體保險",
        "kind": "text",
        "section": "Why NTI",
        "count": 1
      },
      {
        "en": "Stable orders from international brands",
        "zh": "來自國際品牌的穩定訂單",
        "kind": "text",
        "section": "Why NTI",
        "count": 1
      },
      {
        "en": "A real, audited sustainability programme",
        "zh": "真正經過稽核的永續計畫",
        "kind": "text",
        "section": "Why NTI",
        "count": 1
      },
      {
        "en": "Open positions",
        "zh": "開放職缺",
        "kind": "text",
        "section": "Open positions",
        "count": 1
      },
      {
        "en": "Nothing matching your skills?",
        "zh": "沒有適合你專長的職缺？",
        "kind": "text",
        "section": "Open positions",
        "count": 1
      },
      {
        "en": "Send us your CV anyway — we hire ahead of the posting when someone is right.",
        "zh": "還是把履歷寄來 —— 遇到對的人，我們會在開缺之前就先錄用。",
        "kind": "text",
        "section": "Open positions",
        "count": 1
      },
      {
        "en": "Contact us",
        "zh": "聯絡我們",
        "kind": "text",
        "section": "Open positions",
        "count": 1
      }
    ]
  },
  "supplier-area": {
    "mockup": "supplier-area.html",
    "items": [
      {
        "en": "Home",
        "zh": "首頁",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Supplier Area",
        "zh": "供應商專區",
        "kind": "text",
        "section": "頁首",
        "count": 2
      },
      {
        "en": "Announcements, specifications and downloadable documents for NTI Printing’s supply partners.",
        "zh": "提供給 NTI Printing 供應夥伴的公告、規範與可下載文件。",
        "kind": "text",
        "section": "Supplier Area",
        "count": 1
      },
      {
        "en": "Supplier Announcements",
        "zh": "供應商公告",
        "kind": "text",
        "section": "Supplier Announcements",
        "count": 1
      },
      {
        "en": "Specifications & Requirements",
        "zh": "規範與要求",
        "kind": "text",
        "section": "Specifications & Requirements",
        "count": 1
      },
      {
        "en": "Download Area",
        "zh": "下載專區",
        "kind": "text",
        "section": "Download Area",
        "count": 1
      }
    ]
  },
  "contact": {
    "mockup": "contact.html",
    "items": [
      {
        "en": "Home",
        "zh": "首頁",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Contact Us",
        "zh": "聯絡我們",
        "kind": "text",
        "section": "頁首",
        "count": 2
      },
      {
        "en": "Tainan Plant & Office",
        "zh": "台南廠與辦公室",
        "kind": "text",
        "section": "Contact Us",
        "count": 1
      },
      {
        "en": "No. 29, Gongye 6th Rd., Annan Dist., Tainan City 709, Taiwan",
        "zh": "709 臺南市安南區媽祖宮里工業六路29號",
        "kind": "text",
        "section": "Contact Us",
        "count": 1
      },
      {
        "en": "Phone & Email",
        "zh": "電話與電子郵件",
        "kind": "text",
        "section": "Contact Us",
        "count": 1
      },
      {
        "en": "service@nti-printing.com",
        "zh": null,
        "kind": "text",
        "section": "Contact Us",
        "count": 1
      },
      {
        "en": "Business Hours",
        "zh": "營業時間",
        "kind": "text",
        "section": "Contact Us",
        "count": 1
      },
      {
        "en": "Mon–Fri 08:30–17:30 (GMT+8)",
        "zh": "週一至週五 08:30–17:30（GMT+8）",
        "kind": "text",
        "section": "Contact Us",
        "count": 1
      },
      {
        "en": "Factory visits by appointment",
        "zh": "參觀工廠請先預約",
        "kind": "text",
        "section": "Contact Us",
        "count": 1
      },
      {
        "en": "Message sent",
        "zh": "訊息已送出",
        "kind": "text",
        "section": "Contact Us",
        "count": 1
      },
      {
        "en": "Thank you — we will get back to you within one business day.",
        "zh": "感謝您 —— 我們會在一個工作日內回覆。",
        "kind": "text",
        "section": "Contact Us",
        "count": 1
      },
      {
        "en": "Send another message",
        "zh": "再寄一封訊息",
        "kind": "text",
        "section": "Contact Us",
        "count": 1
      },
      {
        "en": "Send us a message",
        "zh": "寄訊息給我們",
        "kind": "text",
        "section": "Send us a message",
        "count": 1
      },
      {
        "en": "Name *",
        "zh": "姓名 *",
        "kind": "text",
        "section": "Send us a message",
        "count": 1
      },
      {
        "en": "Email *",
        "zh": "電子郵件 *",
        "kind": "text",
        "section": "Send us a message",
        "count": 1
      },
      {
        "en": "Company",
        "zh": "公司",
        "kind": "text",
        "section": "Send us a message",
        "count": 1
      },
      {
        "en": "Phone",
        "zh": "電話",
        "kind": "text",
        "section": "Send us a message",
        "count": 1
      },
      {
        "en": "Message *",
        "zh": "訊息 *",
        "kind": "text",
        "section": "Send us a message",
        "count": 1
      },
      {
        "en": "I agree to the processing of my data per the",
        "zh": "我同意依",
        "kind": "text",
        "section": "Send us a message",
        "count": 1
      },
      {
        "en": "Privacy & Legal",
        "zh": "隱私權與法律聲明",
        "kind": "text",
        "section": "Send us a message",
        "count": 1
      },
      {
        "en": "policy.",
        "zh": "處理我的個人資料。",
        "kind": "text",
        "section": "Send us a message",
        "count": 1
      },
      {
        "en": "Send message",
        "zh": "送出訊息",
        "kind": "text",
        "section": "Send us a message",
        "count": 1
      }
    ]
  },
  "get-a-quote": {
    "mockup": "get-a-quote.html",
    "items": [
      {
        "en": "Home",
        "zh": "首頁",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Get a Quote",
        "zh": "索取報價",
        "kind": "text",
        "section": "頁首",
        "count": 2
      },
      {
        "en": "Tell us what the package must do. A packaging engineer — not a bot — replies within one business day with routes and rough numbers.",
        "zh": "告訴我們這個包裝必須做到什麼。回覆您的是包裝工程師，不是機器人，會在一個工作日內給出做法與初步數字。",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "Send the brief — dieline optional",
        "zh": "把需求寄來 —— 刀模圖非必要",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "We propose structure, material & process",
        "zh": "我們提出結構、材料與製程建議",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "Quote with carbon estimate included",
        "zh": "報價含碳排估算",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "Request received",
        "zh": "需求已收到",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "Thank you — our team will reply within one business day. A copy of your request has been sent to your email.",
        "zh": "感謝您 —— 我們的團隊會在一個工作日內回覆。需求副本已寄到您的信箱。",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "Submit another request",
        "zh": "再送出一筆需求",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "1 · Contact",
        "zh": "1 · 聯絡方式",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "Full name *",
        "zh": "姓名 *",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "Company *",
        "zh": "公司 *",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "Email *",
        "zh": "電子郵件 *",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "Phone",
        "zh": "電話",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "2 · Project",
        "zh": "2 · 專案",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "Product type *",
        "zh": "產品類型 *",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "Select…",
        "zh": "請選擇⋯",
        "kind": "text",
        "section": "Get a Quote",
        "count": 2
      },
      {
        "en": "Color Box Packaging",
        "zh": "彩盒包裝",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "Packaging Paperboard",
        "zh": "包裝紙板",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "UV Printing",
        "zh": "UV 印刷",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "Other Printing",
        "zh": "其他印刷",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "Industry",
        "zh": "產業",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "Food & Beverage",
        "zh": "食品與飲料",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "Electronics",
        "zh": "電子",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "Beauty & Skincare",
        "zh": "美妝與保養",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "Medical & Healthcare",
        "zh": "醫療與保健",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "Luxury & Gift Packaging",
        "zh": "精品與禮盒包裝",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "Hardware & Hand Tools",
        "zh": "五金與手工具",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "Automotive",
        "zh": "汽車",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "Publishing & Stationery",
        "zh": "出版與文具",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "Home & Lifestyle",
        "zh": "居家與生活",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "Industrial & Consumer Goods",
        "zh": "工業與消費性產品",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "Quantity *",
        "zh": "數量 *",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "Size (L×W×H mm)",
        "zh": "尺寸（長×寬×高 mm）",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "Material preference",
        "zh": "材料偏好",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "No preference — advise me",
        "zh": "沒有偏好 —— 請給建議",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "FSC™-certified board",
        "zh": "FSC™ 認證紙板",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "Recycled board",
        "zh": "再生紙板",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "Kraft",
        "zh": "牛皮紙",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "Specialty / metallized",
        "zh": "特殊／金屬鍍膜",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "Target date",
        "zh": "希望完成日期",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "Include a per-order carbon estimate",
        "zh": "附上這筆訂單的碳排估算",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "3 · Details",
        "zh": "3 · 細節",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "Describe the requirement *",
        "zh": "請描述需求 *",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "Attach files",
        "zh": "附加檔案",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "— dieline, artwork or reference photos (PDF/AI/PSD/JPG/PNG/ZIP, ≤ 20 MB each, up to 5 files)",
        "zh": "—— 刀模圖、完稿或參考照片（PDF／AI／PSD／JPG／PNG／ZIP，單檔 ≤ 20 MB，最多 5 個檔案）",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "I agree to the processing of my data per the",
        "zh": "我同意依",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "Privacy & Legal",
        "zh": "隱私權與法律聲明",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "policy.",
        "zh": "處理我的個人資料。",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      },
      {
        "en": "Submit request",
        "zh": "送出需求",
        "kind": "text",
        "section": "Get a Quote",
        "count": 1
      }
    ]
  },
  "privacy-legal": {
    "mockup": "privacy-legal.html",
    "items": [
      {
        "en": "Home",
        "zh": "首頁",
        "kind": "text",
        "section": "頁首",
        "count": 1
      },
      {
        "en": "Privacy & Legal",
        "zh": "隱私權與法律聲明",
        "kind": "text",
        "section": "頁首",
        "count": 2
      },
      {
        "en": "Last updated: July 2026 · Placeholder copy — final terms to be supplied by legal counsel",
        "zh": "最後更新：2026 年 7 月 · 暫定內容 —— 正式條款將由法律顧問提供",
        "kind": "text",
        "section": "Privacy & Legal",
        "count": 1
      },
      {
        "en": "1. Data We Collect",
        "zh": "一、我們蒐集的資料",
        "kind": "text",
        "section": "1. Data We Collect",
        "count": 1
      },
      {
        "en": "Placeholder copy — describes the personal data collected through quote requests, contact forms, member registration and supplier submissions: name, company, email, phone, and files you upload. Formal wording to be supplied by legal counsel.",
        "zh": "暫定內容 —— 說明透過報價需求、聯絡表單、會員註冊與供應商送件所蒐集的個人資料：姓名、公司、電子郵件、電話，以及您上傳的檔案。正式文字將由法律顧問提供。",
        "kind": "text",
        "section": "1. Data We Collect",
        "count": 1
      },
      {
        "en": "2. How We Use Your Data",
        "zh": "二、我們如何使用您的資料",
        "kind": "text",
        "section": "2. How We Use Your Data",
        "count": 1
      },
      {
        "en": "Placeholder copy — data is used to respond to enquiries, prepare quotations, fulfil orders, manage supplier relationships and, with consent, send service updates. It is never sold to third parties.",
        "zh": "暫定內容 —— 資料用於回覆詢問、製作報價、履行訂單、管理供應商關係，並在取得同意後寄送服務更新。絕不販售給第三方。",
        "kind": "text",
        "section": "2. How We Use Your Data",
        "count": 1
      },
      {
        "en": "3. Cookies & Analytics",
        "zh": "三、Cookie 與分析",
        "kind": "text",
        "section": "3. Cookies & Analytics",
        "count": 1
      },
      {
        "en": "Placeholder copy — the site uses essential cookies for language preference and session management, plus privacy-respecting analytics to improve content. You can disable non-essential cookies in your browser.",
        "zh": "暫定內容 —— 本站使用必要 Cookie 以記錄語言偏好與工作階段管理，並使用尊重隱私的分析工具改善內容。您可在瀏覽器中停用非必要 Cookie。",
        "kind": "text",
        "section": "3. Cookies & Analytics",
        "count": 1
      },
      {
        "en": "4. Data Retention & Security",
        "zh": "四、資料保存與安全",
        "kind": "text",
        "section": "4. Data Retention & Security",
        "count": 1
      },
      {
        "en": "Placeholder copy — personal data is retained only as long as needed for the stated purpose or as required by law, stored on access-controlled systems hosted in Azure with encryption in transit and at rest.",
        "zh": "暫定內容 —— 個人資料僅在達成所述目的所需期間或法令要求期間內保存，存放於 Azure 上具存取控管的系統，並於傳輸與靜態儲存時加密。",
        "kind": "text",
        "section": "4. Data Retention & Security",
        "count": 1
      },
      {
        "en": "5. Your Rights",
        "zh": "五、您的權利",
        "kind": "text",
        "section": "5. Your Rights",
        "count": 1
      },
      {
        "en": "Placeholder copy — under Taiwan’s Personal Data Protection Act you may request access, correction or deletion of your data at any time by contacting service@nti-printing.com.",
        "zh": "暫定內容 —— 依我國個人資料保護法，您可隨時來信 service@nti-printing.com 要求查閱、更正或刪除您的資料。",
        "kind": "text",
        "section": "5. Your Rights",
        "count": 1
      },
      {
        "en": "6. Legal Notices",
        "zh": "六、法律聲明",
        "kind": "text",
        "section": "6. Legal Notices",
        "count": 1
      },
      {
        "en": "Placeholder copy — all content, trademarks and brand imagery on this site belong to NTI Printing Co., Ltd. Reproduction without written permission is prohibited. Governing law: Republic of China (Taiwan).",
        "zh": "暫定內容 —— 本站所有內容、商標與品牌圖像均屬 NTI Printing Co., Ltd. 所有。未經書面同意不得重製。準據法：中華民國（台灣）法律。",
        "kind": "text",
        "section": "6. Legal Notices",
        "count": 1
      }
    ]
  }
}
