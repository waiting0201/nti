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
  }
}
