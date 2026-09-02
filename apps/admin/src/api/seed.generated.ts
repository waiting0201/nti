/* 由 scripts/build-seed.mjs 自 db/seed/*.sql 與 mockup/*.html 產生 —— 請勿手改。
   重新產生：npm run seed
   筆數：category=44  page=29  solution=4  solution-item=15  home-banner=3  news=12  project=6  faq=8  job=5  trend=5  certification=14  client=6  facility=24  vlog=4  supplier-notice=5  supplier-spec=4 */
import type { Row } from './types'

export const SEED: Record<string, Row[]> = {
  "category": [
    {
      "id": "News:esg",
      "categoryType": "News",
      "code": "esg",
      "sortOrder": 10,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "ESG 永續"
        },
        "en": {
          "name": "ESG"
        }
      }
    },
    {
      "id": "News:awards",
      "categoryType": "News",
      "code": "awards",
      "sortOrder": 20,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "獲獎肯定"
        },
        "en": {
          "name": "Awards"
        }
      }
    },
    {
      "id": "News:partnership",
      "categoryType": "News",
      "code": "partnership",
      "sortOrder": 30,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "合作夥伴"
        },
        "en": {
          "name": "Partnership"
        }
      }
    },
    {
      "id": "News:sustainability",
      "categoryType": "News",
      "code": "sustainability",
      "sortOrder": 40,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "永續發展"
        },
        "en": {
          "name": "Sustainability"
        }
      }
    },
    {
      "id": "News:event",
      "categoryType": "News",
      "code": "event",
      "sortOrder": 50,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "活動訊息"
        },
        "en": {
          "name": "Events"
        }
      }
    },
    {
      "id": "Project:food",
      "categoryType": "Project",
      "code": "food",
      "sortOrder": 10,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "食品"
        },
        "en": {
          "name": "Food"
        }
      }
    },
    {
      "id": "Project:pharma",
      "categoryType": "Project",
      "code": "pharma",
      "sortOrder": 20,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "醫藥"
        },
        "en": {
          "name": "Pharmaceutical"
        }
      }
    },
    {
      "id": "Project:cosmetics",
      "categoryType": "Project",
      "code": "cosmetics",
      "sortOrder": 30,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "美妝"
        },
        "en": {
          "name": "Cosmetics"
        }
      }
    },
    {
      "id": "Project:electronics",
      "categoryType": "Project",
      "code": "electronics",
      "sortOrder": 40,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "電子"
        },
        "en": {
          "name": "Electronics"
        }
      }
    },
    {
      "id": "Project:gift",
      "categoryType": "Project",
      "code": "gift",
      "sortOrder": 50,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "禮品"
        },
        "en": {
          "name": "Gift"
        }
      }
    },
    {
      "id": "Project:other",
      "categoryType": "Project",
      "code": "other",
      "sortOrder": 60,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "其他"
        },
        "en": {
          "name": "Other"
        }
      }
    },
    {
      "id": "Vlog:sustainability",
      "categoryType": "Vlog",
      "code": "sustainability",
      "sortOrder": 10,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "永續"
        },
        "en": {
          "name": "Sustainability"
        }
      }
    },
    {
      "id": "Vlog:low-carbon",
      "categoryType": "Vlog",
      "code": "low-carbon",
      "sortOrder": 20,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "低碳"
        },
        "en": {
          "name": "Low Carbon"
        }
      }
    },
    {
      "id": "Vlog:awards",
      "categoryType": "Vlog",
      "code": "awards",
      "sortOrder": 30,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "獲獎"
        },
        "en": {
          "name": "Awards"
        }
      }
    },
    {
      "id": "Faq:general",
      "categoryType": "Faq",
      "code": "general",
      "sortOrder": 10,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "一般問題"
        },
        "en": {
          "name": "General"
        }
      }
    },
    {
      "id": "Faq:ordering",
      "categoryType": "Faq",
      "code": "ordering",
      "sortOrder": 20,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "訂購流程"
        },
        "en": {
          "name": "Ordering"
        }
      }
    },
    {
      "id": "Faq:materials",
      "categoryType": "Faq",
      "code": "materials",
      "sortOrder": 30,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "材質相關"
        },
        "en": {
          "name": "Materials"
        }
      }
    },
    {
      "id": "Faq:sustainability",
      "categoryType": "Faq",
      "code": "sustainability",
      "sortOrder": 40,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "永續相關"
        },
        "en": {
          "name": "Sustainability"
        }
      }
    },
    {
      "id": "Certification:certification",
      "categoryType": "Certification",
      "code": "certification",
      "sortOrder": 10,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "認證"
        },
        "en": {
          "name": "Certifications"
        }
      }
    },
    {
      "id": "Certification:partnership",
      "categoryType": "Certification",
      "code": "partnership",
      "sortOrder": 20,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "夥伴"
        },
        "en": {
          "name": "Partnerships"
        }
      }
    },
    {
      "id": "Certification:award",
      "categoryType": "Certification",
      "code": "award",
      "sortOrder": 30,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "獎項"
        },
        "en": {
          "name": "Awards"
        }
      }
    },
    {
      "id": "Facility:pre-press",
      "categoryType": "Facility",
      "code": "pre-press",
      "sortOrder": 10,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "印前作業"
        },
        "en": {
          "name": "Pre-Press"
        }
      }
    },
    {
      "id": "Facility:eco-printing",
      "categoryType": "Facility",
      "code": "eco-printing",
      "sortOrder": 20,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "環保印刷"
        },
        "en": {
          "name": "Eco Printing"
        }
      }
    },
    {
      "id": "Facility:post-press",
      "categoryType": "Facility",
      "code": "post-press",
      "sortOrder": 30,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "印後加工"
        },
        "en": {
          "name": "Post-Press"
        }
      }
    },
    {
      "id": "Facility:quality",
      "categoryType": "Facility",
      "code": "quality",
      "sortOrder": 40,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "品質檢驗"
        },
        "en": {
          "name": "Quality Control"
        }
      }
    },
    {
      "id": "Facility:tour",
      "categoryType": "Facility",
      "code": "tour",
      "sortOrder": 50,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "廠區導覽"
        },
        "en": {
          "name": "Plant Tour"
        }
      }
    },
    {
      "id": "SupplierNotice:policy",
      "categoryType": "SupplierNotice",
      "code": "policy",
      "sortOrder": 10,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "政策公告"
        },
        "en": {
          "name": "Policy"
        }
      }
    },
    {
      "id": "SupplierNotice:esg",
      "categoryType": "SupplierNotice",
      "code": "esg",
      "sortOrder": 20,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "ESG 規範"
        },
        "en": {
          "name": "ESG"
        }
      }
    },
    {
      "id": "SupplierNotice:quality",
      "categoryType": "SupplierNotice",
      "code": "quality",
      "sortOrder": 30,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "品質要求"
        },
        "en": {
          "name": "Quality"
        }
      }
    },
    {
      "id": "SupplierNotice:logistics",
      "categoryType": "SupplierNotice",
      "code": "logistics",
      "sortOrder": 40,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "物流配送"
        },
        "en": {
          "name": "Logistics"
        }
      }
    },
    {
      "id": "Industry:food-beverage",
      "categoryType": "Industry",
      "code": "food-beverage",
      "sortOrder": 10,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "食品飲料"
        },
        "en": {
          "name": "Food & Beverage"
        }
      }
    },
    {
      "id": "Industry:electronics",
      "categoryType": "Industry",
      "code": "electronics",
      "sortOrder": 20,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "電子產品"
        },
        "en": {
          "name": "Electronics"
        }
      }
    },
    {
      "id": "Industry:beauty",
      "categoryType": "Industry",
      "code": "beauty",
      "sortOrder": 30,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "美妝保養"
        },
        "en": {
          "name": "Beauty & Skincare"
        }
      }
    },
    {
      "id": "Industry:medical",
      "categoryType": "Industry",
      "code": "medical",
      "sortOrder": 40,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "醫療保健"
        },
        "en": {
          "name": "Medical & Healthcare"
        }
      }
    },
    {
      "id": "Industry:luxury-gift",
      "categoryType": "Industry",
      "code": "luxury-gift",
      "sortOrder": 50,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "精品禮盒"
        },
        "en": {
          "name": "Luxury & Gift Packaging"
        }
      }
    },
    {
      "id": "Industry:hardware",
      "categoryType": "Industry",
      "code": "hardware",
      "sortOrder": 60,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "五金手工具"
        },
        "en": {
          "name": "Hardware & Hand Tools"
        }
      }
    },
    {
      "id": "Industry:automotive",
      "categoryType": "Industry",
      "code": "automotive",
      "sortOrder": 70,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "汽車產業"
        },
        "en": {
          "name": "Automotive"
        }
      }
    },
    {
      "id": "Industry:publishing",
      "categoryType": "Industry",
      "code": "publishing",
      "sortOrder": 80,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "出版文具"
        },
        "en": {
          "name": "Publishing & Stationery"
        }
      }
    },
    {
      "id": "Industry:home-lifestyle",
      "categoryType": "Industry",
      "code": "home-lifestyle",
      "sortOrder": 90,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "居家生活"
        },
        "en": {
          "name": "Home & Lifestyle"
        }
      }
    },
    {
      "id": "Industry:industrial",
      "categoryType": "Industry",
      "code": "industrial",
      "sortOrder": 100,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "工業與消費品"
        },
        "en": {
          "name": "Industrial & Consumer Goods"
        }
      }
    },
    {
      "id": "QuoteMaterial:fsc",
      "categoryType": "QuoteMaterial",
      "code": "fsc",
      "sortOrder": 10,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "FSC™ 認證紙板"
        },
        "en": {
          "name": "FSC™-certified board"
        }
      }
    },
    {
      "id": "QuoteMaterial:recycled",
      "categoryType": "QuoteMaterial",
      "code": "recycled",
      "sortOrder": 20,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "再生紙板"
        },
        "en": {
          "name": "Recycled board"
        }
      }
    },
    {
      "id": "QuoteMaterial:kraft",
      "categoryType": "QuoteMaterial",
      "code": "kraft",
      "sortOrder": 30,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "牛皮紙"
        },
        "en": {
          "name": "Kraft"
        }
      }
    },
    {
      "id": "QuoteMaterial:specialty",
      "categoryType": "QuoteMaterial",
      "code": "specialty",
      "sortOrder": 40,
      "isActive": true,
      "i18n": {
        "zh": {
          "name": "特殊／金屬鍍膜紙材"
        },
        "en": {
          "name": "Specialty / metallized"
        }
      }
    }
  ],
  "page": [
    {
      "id": "1",
      "pageKey": "home",
      "path": "/{lang}",
      "hasRichBody": false,
      "isIndexable": true,
      "sortOrder": 1,
      "i18n": {
        "zh": {
          "slug": "home",
          "seoTitle": "",
          "metaDescription": ""
        },
        "en": {
          "slug": "home",
          "seoTitle": "",
          "metaDescription": ""
        }
      }
    },
    {
      "id": "2",
      "pageKey": "about-hub",
      "path": "/{lang}/about",
      "hasRichBody": false,
      "isIndexable": true,
      "sortOrder": 2,
      "i18n": {
        "zh": {
          "slug": "about",
          "seoTitle": "",
          "metaDescription": ""
        },
        "en": {
          "slug": "about",
          "seoTitle": "",
          "metaDescription": ""
        }
      }
    },
    {
      "id": "3",
      "pageKey": "about-difference",
      "path": "/{lang}/about/difference",
      "hasRichBody": false,
      "isIndexable": true,
      "sortOrder": 3,
      "i18n": {
        "zh": {
          "slug": "difference",
          "seoTitle": "",
          "metaDescription": ""
        },
        "en": {
          "slug": "difference",
          "seoTitle": "",
          "metaDescription": ""
        }
      }
    },
    {
      "id": "4",
      "pageKey": "about-benefits",
      "path": "/{lang}/about/benefits",
      "hasRichBody": false,
      "isIndexable": true,
      "sortOrder": 4,
      "i18n": {
        "zh": {
          "slug": "benefits",
          "seoTitle": "",
          "metaDescription": ""
        },
        "en": {
          "slug": "benefits",
          "seoTitle": "",
          "metaDescription": ""
        }
      }
    },
    {
      "id": "5",
      "pageKey": "about-certifications",
      "path": "/{lang}/about/certifications",
      "hasRichBody": false,
      "isIndexable": true,
      "sortOrder": 5,
      "i18n": {
        "zh": {
          "slug": "certifications",
          "seoTitle": "",
          "metaDescription": ""
        },
        "en": {
          "slug": "certifications",
          "seoTitle": "",
          "metaDescription": ""
        }
      }
    },
    {
      "id": "6",
      "pageKey": "facility",
      "path": "/{lang}/about/facility",
      "hasRichBody": false,
      "isIndexable": true,
      "sortOrder": 6,
      "i18n": {
        "zh": {
          "slug": "facility",
          "seoTitle": "",
          "metaDescription": ""
        },
        "en": {
          "slug": "facility",
          "seoTitle": "",
          "metaDescription": ""
        }
      }
    },
    {
      "id": "7",
      "pageKey": "facility-pre-press",
      "path": "/{lang}/about/facility/pre-press",
      "hasRichBody": false,
      "isIndexable": true,
      "sortOrder": 7,
      "i18n": {
        "zh": {
          "slug": "pre-press",
          "seoTitle": "",
          "metaDescription": ""
        },
        "en": {
          "slug": "pre-press",
          "seoTitle": "",
          "metaDescription": ""
        }
      }
    },
    {
      "id": "8",
      "pageKey": "facility-eco-printing",
      "path": "/{lang}/about/facility/eco-printing",
      "hasRichBody": false,
      "isIndexable": true,
      "sortOrder": 8,
      "i18n": {
        "zh": {
          "slug": "eco-printing",
          "seoTitle": "",
          "metaDescription": ""
        },
        "en": {
          "slug": "eco-printing",
          "seoTitle": "",
          "metaDescription": ""
        }
      }
    },
    {
      "id": "9",
      "pageKey": "facility-post-press",
      "path": "/{lang}/about/facility/post-press",
      "hasRichBody": false,
      "isIndexable": true,
      "sortOrder": 9,
      "i18n": {
        "zh": {
          "slug": "post-press",
          "seoTitle": "",
          "metaDescription": ""
        },
        "en": {
          "slug": "post-press",
          "seoTitle": "",
          "metaDescription": ""
        }
      }
    },
    {
      "id": "10",
      "pageKey": "facility-quality",
      "path": "/{lang}/about/facility/quality",
      "hasRichBody": false,
      "isIndexable": true,
      "sortOrder": 10,
      "i18n": {
        "zh": {
          "slug": "quality",
          "seoTitle": "",
          "metaDescription": ""
        },
        "en": {
          "slug": "quality",
          "seoTitle": "",
          "metaDescription": ""
        }
      }
    },
    {
      "id": "11",
      "pageKey": "facility-tour",
      "path": "/{lang}/about/facility/tour",
      "hasRichBody": false,
      "isIndexable": true,
      "sortOrder": 11,
      "i18n": {
        "zh": {
          "slug": "tour",
          "seoTitle": "",
          "metaDescription": ""
        },
        "en": {
          "slug": "tour",
          "seoTitle": "",
          "metaDescription": ""
        }
      }
    },
    {
      "id": "12",
      "pageKey": "solutions",
      "path": "/{lang}/solutions",
      "hasRichBody": false,
      "isIndexable": true,
      "sortOrder": 12,
      "i18n": {
        "zh": {
          "slug": "solutions",
          "seoTitle": "",
          "metaDescription": ""
        },
        "en": {
          "slug": "solutions",
          "seoTitle": "",
          "metaDescription": ""
        }
      }
    },
    {
      "id": "13",
      "pageKey": "projects",
      "path": "/{lang}/projects",
      "hasRichBody": false,
      "isIndexable": true,
      "sortOrder": 13,
      "i18n": {
        "zh": {
          "slug": "projects",
          "seoTitle": "",
          "metaDescription": ""
        },
        "en": {
          "slug": "projects",
          "seoTitle": "",
          "metaDescription": ""
        }
      }
    },
    {
      "id": "14",
      "pageKey": "sustainability-hub",
      "path": "/{lang}/sustainability",
      "hasRichBody": false,
      "isIndexable": true,
      "sortOrder": 14,
      "i18n": {
        "zh": {
          "slug": "sustainability",
          "seoTitle": "",
          "metaDescription": ""
        },
        "en": {
          "slug": "sustainability",
          "seoTitle": "",
          "metaDescription": ""
        }
      }
    },
    {
      "id": "15",
      "pageKey": "green-our-advantage",
      "path": "/{lang}/sustainability/our-advantage",
      "hasRichBody": false,
      "isIndexable": true,
      "sortOrder": 15,
      "i18n": {
        "zh": {
          "slug": "our-advantage",
          "seoTitle": "",
          "metaDescription": ""
        },
        "en": {
          "slug": "our-advantage",
          "seoTitle": "",
          "metaDescription": ""
        }
      }
    },
    {
      "id": "16",
      "pageKey": "green-carbon",
      "path": "/{lang}/sustainability/carbon-efficiency",
      "hasRichBody": false,
      "isIndexable": true,
      "sortOrder": 16,
      "i18n": {
        "zh": {
          "slug": "carbon-efficiency",
          "seoTitle": "",
          "metaDescription": ""
        },
        "en": {
          "slug": "carbon-efficiency",
          "seoTitle": "",
          "metaDescription": ""
        }
      }
    },
    {
      "id": "17",
      "pageKey": "green-materials",
      "path": "/{lang}/sustainability/eco-materials",
      "hasRichBody": false,
      "isIndexable": true,
      "sortOrder": 17,
      "i18n": {
        "zh": {
          "slug": "eco-materials",
          "seoTitle": "",
          "metaDescription": ""
        },
        "en": {
          "slug": "eco-materials",
          "seoTitle": "",
          "metaDescription": ""
        }
      }
    },
    {
      "id": "18",
      "pageKey": "green-esg",
      "path": "/{lang}/sustainability/esg",
      "hasRichBody": false,
      "isIndexable": true,
      "sortOrder": 18,
      "i18n": {
        "zh": {
          "slug": "esg",
          "seoTitle": "",
          "metaDescription": ""
        },
        "en": {
          "slug": "esg",
          "seoTitle": "",
          "metaDescription": ""
        }
      }
    },
    {
      "id": "19",
      "pageKey": "green-csr",
      "path": "/{lang}/sustainability/csr",
      "hasRichBody": true,
      "isIndexable": false,
      "sortOrder": 19,
      "i18n": {
        "zh": {
          "slug": "csr",
          "seoTitle": "",
          "metaDescription": ""
        },
        "en": {
          "slug": "csr",
          "seoTitle": "",
          "metaDescription": ""
        }
      }
    },
    {
      "id": "20",
      "pageKey": "insights",
      "path": "/{lang}/insights",
      "hasRichBody": false,
      "isIndexable": true,
      "sortOrder": 20,
      "i18n": {
        "zh": {
          "slug": "insights",
          "seoTitle": "",
          "metaDescription": ""
        },
        "en": {
          "slug": "insights",
          "seoTitle": "",
          "metaDescription": ""
        }
      }
    },
    {
      "id": "21",
      "pageKey": "news-list",
      "path": "/{lang}/insights/news",
      "hasRichBody": false,
      "isIndexable": true,
      "sortOrder": 21,
      "i18n": {
        "zh": {
          "slug": "news",
          "seoTitle": "",
          "metaDescription": ""
        },
        "en": {
          "slug": "news",
          "seoTitle": "",
          "metaDescription": ""
        }
      }
    },
    {
      "id": "22",
      "pageKey": "green-vlog",
      "path": "/{lang}/insights/green-vlog",
      "hasRichBody": false,
      "isIndexable": true,
      "sortOrder": 22,
      "i18n": {
        "zh": {
          "slug": "green-vlog",
          "seoTitle": "",
          "metaDescription": ""
        },
        "en": {
          "slug": "green-vlog",
          "seoTitle": "",
          "metaDescription": ""
        }
      }
    },
    {
      "id": "23",
      "pageKey": "faq",
      "path": "/{lang}/insights/faq",
      "hasRichBody": false,
      "isIndexable": true,
      "sortOrder": 23,
      "i18n": {
        "zh": {
          "slug": "faq",
          "seoTitle": "",
          "metaDescription": ""
        },
        "en": {
          "slug": "faq",
          "seoTitle": "",
          "metaDescription": ""
        }
      }
    },
    {
      "id": "24",
      "pageKey": "industry-trends",
      "path": "/{lang}/insights/industry-trends",
      "hasRichBody": false,
      "isIndexable": true,
      "sortOrder": 24,
      "i18n": {
        "zh": {
          "slug": "industry-trends",
          "seoTitle": "",
          "metaDescription": ""
        },
        "en": {
          "slug": "industry-trends",
          "seoTitle": "",
          "metaDescription": ""
        }
      }
    },
    {
      "id": "25",
      "pageKey": "careers",
      "path": "/{lang}/careers",
      "hasRichBody": false,
      "isIndexable": true,
      "sortOrder": 25,
      "i18n": {
        "zh": {
          "slug": "careers",
          "seoTitle": "",
          "metaDescription": ""
        },
        "en": {
          "slug": "careers",
          "seoTitle": "",
          "metaDescription": ""
        }
      }
    },
    {
      "id": "26",
      "pageKey": "supplier-area",
      "path": "/{lang}/supplier-area",
      "hasRichBody": false,
      "isIndexable": true,
      "sortOrder": 26,
      "i18n": {
        "zh": {
          "slug": "supplier-area",
          "seoTitle": "",
          "metaDescription": ""
        },
        "en": {
          "slug": "supplier-area",
          "seoTitle": "",
          "metaDescription": ""
        }
      }
    },
    {
      "id": "27",
      "pageKey": "contact",
      "path": "/{lang}/contact",
      "hasRichBody": false,
      "isIndexable": true,
      "sortOrder": 27,
      "i18n": {
        "zh": {
          "slug": "contact",
          "seoTitle": "",
          "metaDescription": ""
        },
        "en": {
          "slug": "contact",
          "seoTitle": "",
          "metaDescription": ""
        }
      }
    },
    {
      "id": "28",
      "pageKey": "get-a-quote",
      "path": "/{lang}/get-a-quote",
      "hasRichBody": false,
      "isIndexable": true,
      "sortOrder": 28,
      "i18n": {
        "zh": {
          "slug": "get-a-quote",
          "seoTitle": "",
          "metaDescription": ""
        },
        "en": {
          "slug": "get-a-quote",
          "seoTitle": "",
          "metaDescription": ""
        }
      }
    },
    {
      "id": "29",
      "pageKey": "privacy-legal",
      "path": "/{lang}/privacy-legal",
      "hasRichBody": true,
      "isIndexable": true,
      "sortOrder": 29,
      "i18n": {
        "zh": {
          "slug": "privacy-legal",
          "seoTitle": "",
          "metaDescription": ""
        },
        "en": {
          "slug": "privacy-legal",
          "seoTitle": "",
          "metaDescription": ""
        }
      }
    }
  ],
  "solution": [
    {
      "id": "1",
      "code": "boxes",
      "sortOrder": 10,
      "isPublished": true,
      "cover": "/assets/prod-box-gluing.jpg",
      "i18n": {
        "zh": {
          "slug": "color-box-packaging",
          "name": "彩盒包裝",
          "h1": "客製化彩盒包裝",
          "coverAlt": "NTI 客製化彩盒包裝成品",
          "seoTitle": "客製化彩盒包裝",
          "metaDescription": ""
        },
        "en": {
          "slug": "color-box-packaging",
          "name": "Color Box Packaging",
          "h1": "Custom Color Box Packaging",
          "coverAlt": "Custom color box packaging by NTI",
          "seoTitle": "Custom Color Box Packaging",
          "metaDescription": ""
        }
      }
    },
    {
      "id": "2",
      "code": "cardboard",
      "sortOrder": 20,
      "isPublished": true,
      "cover": "/assets/prod-card-hangtag.jpg",
      "i18n": {
        "zh": {
          "slug": "packaging-paperboard",
          "name": "包裝紙板",
          "h1": "客製化包裝紙板",
          "coverAlt": "NTI 客製化包裝紙板成品",
          "seoTitle": "客製化包裝紙板",
          "metaDescription": ""
        },
        "en": {
          "slug": "packaging-paperboard",
          "name": "Packaging Paperboard",
          "h1": "Custom Packaging Paperboard",
          "coverAlt": "Custom packaging paperboard by NTI",
          "seoTitle": "Custom Packaging Paperboard",
          "metaDescription": ""
        }
      }
    },
    {
      "id": "3",
      "code": "uv",
      "sortOrder": 30,
      "isPublished": true,
      "cover": "/assets/prod-uv-print.jpg",
      "i18n": {
        "zh": {
          "slug": "uv-printing",
          "name": "UV 印刷",
          "h1": "環保 UV 印刷",
          "coverAlt": "NTI 環保 UV 印刷成品",
          "seoTitle": "環保 UV 印刷",
          "metaDescription": ""
        },
        "en": {
          "slug": "uv-printing",
          "name": "UV Printing",
          "h1": "Eco-Friendly UV Printing",
          "coverAlt": "Eco-friendly UV printing by NTI",
          "seoTitle": "Eco-Friendly UV Printing",
          "metaDescription": ""
        }
      }
    },
    {
      "id": "4",
      "code": "other",
      "sortOrder": 40,
      "isPublished": true,
      "cover": "/assets/prod-other-bag.jpg",
      "i18n": {
        "zh": {
          "slug": "other-printing",
          "name": "其他印刷",
          "h1": "其他印刷服務",
          "coverAlt": "NTI 其他印刷服務成品",
          "seoTitle": "其他印刷服務",
          "metaDescription": ""
        },
        "en": {
          "slug": "other-printing",
          "name": "Other Printing",
          "h1": "Other Printing Services",
          "coverAlt": "Other printing services by NTI",
          "seoTitle": "Other Printing Services",
          "metaDescription": ""
        }
      }
    }
  ],
  "solution-item": [
    {
      "id": "boxes-10",
      "parentId": "1",
      "sortOrder": 10,
      "isPublished": true,
      "image": "/assets/prod-box-gluing.jpg",
      "i18n": {
        "zh": {
          "name": "Gluing Box",
          "description": "The most common box type — top and bottom open, easy to assemble, and suited to lighter products.",
          "alt": "Gluing Box"
        },
        "en": {
          "name": "Gluing Box",
          "description": "The most common box type — top and bottom open, easy to assemble, and suited to lighter products.",
          "alt": "Gluing Box"
        }
      }
    },
    {
      "id": "boxes-20",
      "parentId": "1",
      "sortOrder": 20,
      "isPublished": true,
      "image": "/assets/prod-box-bottom.jpg",
      "i18n": {
        "zh": {
          "name": "Bottom Gluing Box",
          "description": "Glued bottom carries more weight while staying easy to assemble — the choice for heavier products.",
          "alt": "Bottom Gluing Box"
        },
        "en": {
          "name": "Bottom Gluing Box",
          "description": "Glued bottom carries more weight while staying easy to assemble — the choice for heavier products.",
          "alt": "Bottom Gluing Box"
        }
      }
    },
    {
      "id": "boxes-30",
      "parentId": "1",
      "sortOrder": 30,
      "isPublished": true,
      "image": "/assets/prod-box-insert.jpg",
      "i18n": {
        "zh": {
          "name": "Insert Bottom Box",
          "description": "Four latches in a crossed structure add loading strength — easy to assemble and more economical.",
          "alt": "Insert Bottom Box"
        },
        "en": {
          "name": "Insert Bottom Box",
          "description": "Four latches in a crossed structure add loading strength — easy to assemble and more economical.",
          "alt": "Insert Bottom Box"
        }
      }
    },
    {
      "id": "boxes-40",
      "parentId": "1",
      "sortOrder": 40,
      "isPublished": true,
      "image": "/assets/prod-box-handcarry.jpg",
      "i18n": {
        "zh": {
          "name": "Hand-Carry Box",
          "description": "Glued or crossed bottom with a built-in handle — no extra carrier bag needed. Popular for gift boxes, cakes, and takeaway.",
          "alt": "Hand-Carry Box"
        },
        "en": {
          "name": "Hand-Carry Box",
          "description": "Glued or crossed bottom with a built-in handle — no extra carrier bag needed. Popular for gift boxes, cakes, and takeaway.",
          "alt": "Hand-Carry Box"
        }
      }
    },
    {
      "id": "boxes-50",
      "parentId": "1",
      "sortOrder": 50,
      "isPublished": true,
      "image": "/assets/prod-box-topbottom.jpg",
      "i18n": {
        "zh": {
          "name": "Top & Bottom Box",
          "description": "Separate lid and base — a more complex structure with an elegant, premium presentation.",
          "alt": "Top & Bottom Box"
        },
        "en": {
          "name": "Top & Bottom Box",
          "description": "Separate lid and base — a more complex structure with an elegant, premium presentation.",
          "alt": "Top & Bottom Box"
        }
      }
    },
    {
      "id": "boxes-60",
      "parentId": "1",
      "sortOrder": 60,
      "isPublished": true,
      "image": "/assets/prod-box-special.jpg",
      "i18n": {
        "zh": {
          "name": "Special Package",
          "description": "Customized structural design and material suggestions for shapes beyond the standard catalogue.",
          "alt": "Special Package"
        },
        "en": {
          "name": "Special Package",
          "description": "Customized structural design and material suggestions for shapes beyond the standard catalogue.",
          "alt": "Special Package"
        }
      }
    },
    {
      "id": "cardboard-10",
      "parentId": "2",
      "sortOrder": 10,
      "isPublished": true,
      "image": "/assets/prod-card-hangtag.jpg",
      "i18n": {
        "zh": {
          "name": "Paper Hang Tags & Blister Backcards",
          "description": "Backcards for blister vacuum packaging — hand tools, electronic spare parts, and automotive components.",
          "alt": "Paper Hang Tags & Blister Backcards"
        },
        "en": {
          "name": "Paper Hang Tags & Blister Backcards",
          "description": "Backcards for blister vacuum packaging — hand tools, electronic spare parts, and automotive components.",
          "alt": "Paper Hang Tags & Blister Backcards"
        }
      }
    },
    {
      "id": "cardboard-20",
      "parentId": "2",
      "sortOrder": 20,
      "isPublished": true,
      "image": "/assets/prod-card-blister.jpg",
      "i18n": {
        "zh": {
          "name": "Blister Cardboard",
          "description": "Two cardboards laminated with one blister — protective display packaging for retail products.",
          "alt": "Blister Cardboard"
        },
        "en": {
          "name": "Blister Cardboard",
          "description": "Two cardboards laminated with one blister — protective display packaging for retail products.",
          "alt": "Blister Cardboard"
        }
      }
    },
    {
      "id": "uv-10",
      "parentId": "3",
      "sortOrder": 10,
      "isPublished": true,
      "image": "/assets/prod-uv-print.jpg",
      "i18n": {
        "zh": {
          "name": "UV Printing",
          "description": "Litho printing on non-absorbent materials — instant ink curing means post-finishing can start immediately, with no backprint, shorter lead times, and lower cost.",
          "alt": "UV Printing"
        },
        "en": {
          "name": "UV Printing",
          "description": "Litho printing on non-absorbent materials — instant ink curing means post-finishing can start immediately, with no backprint, shorter lead times, and lower cost.",
          "alt": "UV Printing"
        }
      }
    },
    {
      "id": "uv-20",
      "parentId": "3",
      "sortOrder": 20,
      "isPublished": true,
      "image": "/assets/prod-uv-special.jpg",
      "i18n": {
        "zh": {
          "name": "Special Printing & Anti-Counterfeiting",
          "description": "Foil embossing and logical-light embossment — custom-developed finishes that protect and elevate your brand.",
          "alt": "Special Printing & Anti-Counterfeiting"
        },
        "en": {
          "name": "Special Printing & Anti-Counterfeiting",
          "description": "Foil embossing and logical-light embossment — custom-developed finishes that protect and elevate your brand.",
          "alt": "Special Printing & Anti-Counterfeiting"
        }
      }
    },
    {
      "id": "other-10",
      "parentId": "4",
      "sortOrder": 10,
      "isPublished": true,
      "image": "/assets/prod-other-bag.jpg",
      "i18n": {
        "zh": {
          "name": "Hand Bags",
          "description": "Paper, plastic, or textile carrier bags that promote products and strengthen brand image.",
          "alt": "Hand Bags"
        },
        "en": {
          "name": "Hand Bags",
          "description": "Paper, plastic, or textile carrier bags that promote products and strengthen brand image.",
          "alt": "Hand Bags"
        }
      }
    },
    {
      "id": "other-20",
      "parentId": "4",
      "sortOrder": 20,
      "isPublished": true,
      "image": "/assets/prod-other-redenvelope.jpg",
      "i18n": {
        "zh": {
          "name": "Red Envelopes",
          "description": "Strong seasonal impact through graphic design and heat-emboss finishing.",
          "alt": "Red Envelopes"
        },
        "en": {
          "name": "Red Envelopes",
          "description": "Strong seasonal impact through graphic design and heat-emboss finishing.",
          "alt": "Red Envelopes"
        }
      }
    },
    {
      "id": "other-30",
      "parentId": "4",
      "sortOrder": 30,
      "isPublished": true,
      "image": "/assets/prod-other-calendar.jpg",
      "i18n": {
        "zh": {
          "name": "Desk Calendars",
          "description": "A daily-use gift for festivals, corporate gifting, and advertising promotion.",
          "alt": "Desk Calendars"
        },
        "en": {
          "name": "Desk Calendars",
          "description": "A daily-use gift for festivals, corporate gifting, and advertising promotion.",
          "alt": "Desk Calendars"
        }
      }
    },
    {
      "id": "other-40",
      "parentId": "4",
      "sortOrder": 40,
      "isPublished": true,
      "image": "/assets/prod-other-mousepad.jpg",
      "i18n": {
        "zh": {
          "name": "Mouse Pads",
          "description": "UV-printed for color saturation and long-lasting fade resistance.",
          "alt": "Mouse Pads"
        },
        "en": {
          "name": "Mouse Pads",
          "description": "UV-printed for color saturation and long-lasting fade resistance.",
          "alt": "Mouse Pads"
        }
      }
    },
    {
      "id": "other-50",
      "parentId": "4",
      "sortOrder": 50,
      "isPublished": true,
      "image": "/assets/prod-other-manual.png",
      "i18n": {
        "zh": {
          "name": "Instructions & Catalogs",
          "description": "Product manuals and catalogs — functions, usage, instructions, and precautions.",
          "alt": "Instructions & Catalogs"
        },
        "en": {
          "name": "Instructions & Catalogs",
          "description": "Product manuals and catalogs — functions, usage, instructions, and precautions.",
          "alt": "Instructions & Catalogs"
        }
      }
    }
  ],
  "home-banner": [
    {
      "id": "10",
      "sortOrder": 10,
      "isPublished": true,
      "imageDesktop": "/assets/ref-home-banner1.png",
      "imageMobile": "",
      "linkUrl": "/green-advantage",
      "newWindow": false,
      "i18n": {
        "zh": {
          "alt": "The courage to print green? — NTI Printing"
        },
        "en": {
          "alt": "The courage to print green? — NTI Printing"
        }
      }
    },
    {
      "id": "20",
      "sortOrder": 20,
      "isPublished": true,
      "imageDesktop": "/assets/ref-home-banner2.png",
      "imageMobile": "",
      "linkUrl": "/solutions",
      "newWindow": false,
      "i18n": {
        "zh": {
          "alt": "NTI custom printed packaging solutions"
        },
        "en": {
          "alt": "NTI custom printed packaging solutions"
        }
      }
    },
    {
      "id": "30",
      "sortOrder": 30,
      "isPublished": true,
      "imageDesktop": "/assets/ref-home-mid2.png",
      "imageMobile": "",
      "linkUrl": "/differences",
      "newWindow": false,
      "i18n": {
        "zh": {
          "alt": "NTI printing facility — Heidelberg press line in Tainan"
        },
        "en": {
          "alt": "NTI printing facility — Heidelberg press line in Tainan"
        }
      }
    }
  ],
  "news": [
    {
      "id": "news-global-views-esg-award",
      "sortOrder": 10,
      "isPublished": true,
      "categoryId": "News:awards",
      "publishDate": "2026-06-30",
      "cover": "/assets/news/global-views-esg-award.jpg",
      "featured": true,
      "i18n": {
        "zh": {
          "title": "NTI wins a 2026 Global Views ESG Award for low-carbon operations",
          "summary": "The 22nd Global Views ESG Corporate Sustainability Awards were held on 7 May at the Shangri-La Far Eastern Plaza Hotel, Taipei. NTI took the Outstanding Project award in the Low-Carbon Operations, SME category.",
          "body": "<p>The ceremony was hosted by Global Views Magazine, with Minister of Environment Peng Chi-Ming among the guests, marking the progress Taiwanese companies have made on sustainable transition.</p><p>The Global Views ESG award is one of Taiwan’s longest-running and most representative sustainability prizes. This year 142 companies entered 239 projects; only 57 companies and 81 entries won. NTI was among the small number of winners also featured in an interview and in the ceremony film.</p><p>NTI has invested consistently in green printing, green packaging, smart logistics, low-carbon materials and printing technology. From a factory holding both LEED Gold and EEWH Diamond green building certification, through to green electricity, smart process management, low-carbon supply-chain collaboration and process-level carbon reduction, the aim has been to move sustainability out of the mission statement and into every process, every service and every pack.</p><p>Low carbon is not only a corporate responsibility — it is competitiveness. For packaging printing, sustainability is not just using less energy and emitting less carbon; it is integrating design, materials, process and management so clients get packaging that delivers on quality, efficiency and environmental value at the same time.</p><p>Alongside low-carbon operations, NTI has been building an ESG paper-craft cultural education programme, combining green printing with creative content partners on work that promotes ecological conservation, disaster-prevention education and marine conservation — extending sustainability from manufacturing into education, culture and public participation.</p><p>At the ceremony, Global Views founder Professor Charles Kao — on his 90th birthday — said that however ESG evolves, it comes down to one thing: doing things right. Driving ESG takes more than equipment and systems; it takes every colleague building on it in daily work.</p>",
          "coverAlt": "NTI wins a 2026 Global Views ESG Award for low-carbon operations",
          "slug": "global-views-esg-award",
          "seoTitle": "NTI wins a 2026 Global Views ESG Award for low-carbon operations",
          "metaDescription": "The 22nd Global Views ESG Corporate Sustainability Awards were held on 7 May at the Shangri-La Far Eastern Plaza Hotel, Taipei. NTI took the Outstanding Project",
          "ogImageAlt": "NTI wins a 2026 Global Views ESG Award for low-carbon operations"
        },
        "en": {
          "title": "NTI wins a 2026 Global Views ESG Award for low-carbon operations",
          "summary": "The 22nd Global Views ESG Corporate Sustainability Awards were held on 7 May at the Shangri-La Far Eastern Plaza Hotel, Taipei. NTI took the Outstanding Project award in the Low-Carbon Operations, SME category.",
          "body": "<p>The ceremony was hosted by Global Views Magazine, with Minister of Environment Peng Chi-Ming among the guests, marking the progress Taiwanese companies have made on sustainable transition.</p><p>The Global Views ESG award is one of Taiwan’s longest-running and most representative sustainability prizes. This year 142 companies entered 239 projects; only 57 companies and 81 entries won. NTI was among the small number of winners also featured in an interview and in the ceremony film.</p><p>NTI has invested consistently in green printing, green packaging, smart logistics, low-carbon materials and printing technology. From a factory holding both LEED Gold and EEWH Diamond green building certification, through to green electricity, smart process management, low-carbon supply-chain collaboration and process-level carbon reduction, the aim has been to move sustainability out of the mission statement and into every process, every service and every pack.</p><p>Low carbon is not only a corporate responsibility — it is competitiveness. For packaging printing, sustainability is not just using less energy and emitting less carbon; it is integrating design, materials, process and management so clients get packaging that delivers on quality, efficiency and environmental value at the same time.</p><p>Alongside low-carbon operations, NTI has been building an ESG paper-craft cultural education programme, combining green printing with creative content partners on work that promotes ecological conservation, disaster-prevention education and marine conservation — extending sustainability from manufacturing into education, culture and public participation.</p><p>At the ceremony, Global Views founder Professor Charles Kao — on his 90th birthday — said that however ESG evolves, it comes down to one thing: doing things right. Driving ESG takes more than equipment and systems; it takes every colleague building on it in daily work.</p>",
          "coverAlt": "NTI wins a 2026 Global Views ESG Award for low-carbon operations",
          "slug": "global-views-esg-award",
          "seoTitle": "NTI wins a 2026 Global Views ESG Award for low-carbon operations",
          "metaDescription": "The 22nd Global Views ESG Corporate Sustainability Awards were held on 7 May at the Shangri-La Far Eastern Plaza Hotel, Taipei. NTI took the Outstanding Project",
          "ogImageAlt": "NTI wins a 2026 Global Views ESG Award for low-carbon operations"
        }
      }
    },
    {
      "id": "news-firefighter-boardgame",
      "sortOrder": 20,
      "isPublished": true,
      "categoryId": "News:esg",
      "publishDate": "2026-03-13",
      "cover": "/assets/news/firefighter-boardgame.jpg",
      "featured": false,
      "i18n": {
        "zh": {
          "title": "NTI donates a paper-model board game promoting disaster-prevention education",
          "summary": "The game turns fire and rescue scenarios into experiential learning — converting firefighting knowledge into material families can work through together. It is produced on FSC-certified paper using a low-carbon printing process, so the object itself carries the message.",
          "body": "<p>The game turns fire and rescue scenarios into experiential learning — converting firefighting knowledge into material families can work through together. It is produced on FSC-certified paper using a low-carbon printing process, so the object itself carries the message.</p><p>Built around rescue scenarios, the game combines paper modelling with board-game play so that players absorb the safety content while assembling and playing rather than reading it.</p><p>Eco-certified paper stock and low-carbon printing reduce the environmental load of production, giving the finished product both educational value and environmental responsibility.</p><p>NTI has worked on green printing and sustainable manufacturing for years. This project is less a board game than a demonstration of what happens when a company answers a social need with its own core technical capability.</p>",
          "coverAlt": "NTI donates a paper-model board game promoting disaster-prevention education",
          "slug": "firefighter-boardgame",
          "seoTitle": "NTI donates a paper-model board game promoting disaster-prevention education",
          "metaDescription": "The game turns fire and rescue scenarios into experiential learning — converting firefighting knowledge into material families can work through together. It is ",
          "ogImageAlt": "NTI donates a paper-model board game promoting disaster-prevention education"
        },
        "en": {
          "title": "NTI donates a paper-model board game promoting disaster-prevention education",
          "summary": "The game turns fire and rescue scenarios into experiential learning — converting firefighting knowledge into material families can work through together. It is produced on FSC-certified paper using a low-carbon printing process, so the object itself carries the message.",
          "body": "<p>The game turns fire and rescue scenarios into experiential learning — converting firefighting knowledge into material families can work through together. It is produced on FSC-certified paper using a low-carbon printing process, so the object itself carries the message.</p><p>Built around rescue scenarios, the game combines paper modelling with board-game play so that players absorb the safety content while assembling and playing rather than reading it.</p><p>Eco-certified paper stock and low-carbon printing reduce the environmental load of production, giving the finished product both educational value and environmental responsibility.</p><p>NTI has worked on green printing and sustainable manufacturing for years. This project is less a board game than a demonstration of what happens when a company answers a social need with its own core technical capability.</p>",
          "coverAlt": "NTI donates a paper-model board game promoting disaster-prevention education",
          "slug": "firefighter-boardgame",
          "seoTitle": "NTI donates a paper-model board game promoting disaster-prevention education",
          "metaDescription": "The game turns fire and rescue scenarios into experiential learning — converting firefighting knowledge into material families can work through together. It is ",
          "ogImageAlt": "NTI donates a paper-model board game promoting disaster-prevention education"
        }
      }
    },
    {
      "id": "news-national-sustainable-development-award",
      "sortOrder": 30,
      "isPublished": true,
      "categoryId": "News:awards",
      "publishDate": "2026-03-09",
      "cover": "/assets/news/national-sustainable-development-award.jpg",
      "featured": false,
      "i18n": {
        "zh": {
          "title": "NTI receives the National Sustainable Development Award",
          "summary": "Chairman Cheng Chun-Ming attended in person to receive the gold trophy from Vice Premier Cheng Li-Chiun. The award recognises years of work on ESG and low-carbon processes, and belongs to the whole team.",
          "body": "<p>Chairman Cheng Chun-Ming attended in person to receive the gold trophy from Vice Premier Cheng Li-Chiun. The award recognises years of work on ESG and low-carbon processes, and belongs to the whole team.</p><p>As one of Taiwan’s significant packaging printers, NTI works to a core principle of green printing and sustainable packaging, driving low-carbon transition through equipment upgrades, process optimisation and adoption of international standards.</p><p>Energy-efficient buildings and low-carbon process. Energy and carbon reduction designed in from the factory building through to the production flow, with high-efficiency equipment and energy management lowering total emissions.</p><p>Innovative printing technology. Digital and innovative print processes raise output efficiency while cutting material and energy waste.</p><p>Resource circulation and waste reduction. Circular-economy practice applied to recovery and reuse, reducing process waste and improving material efficiency.</p><p>International certification and quality management. Continuing certification — including FSC® forest management and GMI international print quality — keeps product quality and sustainability management moving together, and strengthens NTI’s position in global supply chains.</p><p>NTI has extended green printing into ESG paper-craft cultural education, working with creative content partners using FSC-certified stock, plant-based eco inks and low-carbon printing on conservation, disaster-prevention and marine-conservation projects — so core technology creates cultural, educational and social value as well as product value.</p>",
          "coverAlt": "NTI receives the National Sustainable Development Award",
          "slug": "national-sustainable-development-award",
          "seoTitle": "NTI receives the National Sustainable Development Award",
          "metaDescription": "Chairman Cheng Chun-Ming attended in person to receive the gold trophy from Vice Premier Cheng Li-Chiun. The award recognises years of work on ESG and low-carbo",
          "ogImageAlt": "NTI receives the National Sustainable Development Award"
        },
        "en": {
          "title": "NTI receives the National Sustainable Development Award",
          "summary": "Chairman Cheng Chun-Ming attended in person to receive the gold trophy from Vice Premier Cheng Li-Chiun. The award recognises years of work on ESG and low-carbon processes, and belongs to the whole team.",
          "body": "<p>Chairman Cheng Chun-Ming attended in person to receive the gold trophy from Vice Premier Cheng Li-Chiun. The award recognises years of work on ESG and low-carbon processes, and belongs to the whole team.</p><p>As one of Taiwan’s significant packaging printers, NTI works to a core principle of green printing and sustainable packaging, driving low-carbon transition through equipment upgrades, process optimisation and adoption of international standards.</p><p>Energy-efficient buildings and low-carbon process. Energy and carbon reduction designed in from the factory building through to the production flow, with high-efficiency equipment and energy management lowering total emissions.</p><p>Innovative printing technology. Digital and innovative print processes raise output efficiency while cutting material and energy waste.</p><p>Resource circulation and waste reduction. Circular-economy practice applied to recovery and reuse, reducing process waste and improving material efficiency.</p><p>International certification and quality management. Continuing certification — including FSC® forest management and GMI international print quality — keeps product quality and sustainability management moving together, and strengthens NTI’s position in global supply chains.</p><p>NTI has extended green printing into ESG paper-craft cultural education, working with creative content partners using FSC-certified stock, plant-based eco inks and low-carbon printing on conservation, disaster-prevention and marine-conservation projects — so core technology creates cultural, educational and social value as well as product value.</p>",
          "coverAlt": "NTI receives the National Sustainable Development Award",
          "slug": "national-sustainable-development-award",
          "seoTitle": "NTI receives the National Sustainable Development Award",
          "metaDescription": "Chairman Cheng Chun-Ming attended in person to receive the gold trophy from Vice Premier Cheng Li-Chiun. The award recognises years of work on ESG and low-carbo",
          "ogImageAlt": "NTI receives the National Sustainable Development Award"
        }
      }
    },
    {
      "id": "news-taicca-partnership",
      "sortOrder": 40,
      "isPublished": true,
      "categoryId": "News:partnership",
      "publishDate": "2025-11-13",
      "cover": "/assets/news/taicca-partnership.jpg",
      "featured": false,
      "i18n": {
        "zh": {
          "title": "NTI signs an ESG for Culture letter of intent with TAICCA",
          "summary": "ESG for Culture is TAICCA’s cross-sector programme, pairing corporate sustainability strategy with creative energy to build collaborations that carry both social impact and brand value. The signing marks the printing industry formally entering that space, with NTI as one of the southern Taiwan partners.",
          "body": "<p>ESG for Culture is TAICCA’s cross-sector programme, pairing corporate sustainability strategy with creative energy to build collaborations that carry both social impact and brand value. The signing marks the printing industry formally entering that space, with NTI as one of the southern Taiwan partners.</p><p>Chairman Cheng Chun-Ming: “Printing is not only manufacturing — it is a carrier of culture and value. Through green technology and design thinking, we want every printed piece to convey a belief in sustainability and a warmth of culture. This partnership means corporate green transition is no longer only a technical upgrade, but an act of cultural co-creation.”</p><p>With TAICCA-supported studio 72 Design, NTI produced the Animals of Tomorrow touring exhibition. Its core idea is replacing plastic with paper, using low-carbon printing and eco-certified stock to make exhibits that are creative and sustainable at once.</p><p>The work draws on Taiwan’s native species — the Formosan black bear and the leopard cat among them — as conservation symbols. The tour has shown at Space Moor in Keelung and Gallery Biga in Kyoto, and moves to Tainan at the end of the year.</p><p>Founded in 1968, NTI is a leading Taiwanese printing brand and an international partner. In recent years the company built a new headquarters in the Tainan Technology Industrial Park combining smart manufacturing, integrated production and environmental sustainability — earning both LEED Gold (US) and EEWH Diamond (Taiwan) green building certification.</p><p>From process carbon reduction and energy management through to smart warehousing, NTI continues to expand FSC-certified stock, LED-UV energy-saving printing and plateless digital printing.</p>",
          "coverAlt": "NTI signs an ESG for Culture letter of intent with TAICCA",
          "slug": "taicca-partnership",
          "seoTitle": "NTI signs an ESG for Culture letter of intent with TAICCA",
          "metaDescription": "ESG for Culture is TAICCA’s cross-sector programme, pairing corporate sustainability strategy with creative energy to build collaborations that carry both socia",
          "ogImageAlt": "NTI signs an ESG for Culture letter of intent with TAICCA"
        },
        "en": {
          "title": "NTI signs an ESG for Culture letter of intent with TAICCA",
          "summary": "ESG for Culture is TAICCA’s cross-sector programme, pairing corporate sustainability strategy with creative energy to build collaborations that carry both social impact and brand value. The signing marks the printing industry formally entering that space, with NTI as one of the southern Taiwan partners.",
          "body": "<p>ESG for Culture is TAICCA’s cross-sector programme, pairing corporate sustainability strategy with creative energy to build collaborations that carry both social impact and brand value. The signing marks the printing industry formally entering that space, with NTI as one of the southern Taiwan partners.</p><p>Chairman Cheng Chun-Ming: “Printing is not only manufacturing — it is a carrier of culture and value. Through green technology and design thinking, we want every printed piece to convey a belief in sustainability and a warmth of culture. This partnership means corporate green transition is no longer only a technical upgrade, but an act of cultural co-creation.”</p><p>With TAICCA-supported studio 72 Design, NTI produced the Animals of Tomorrow touring exhibition. Its core idea is replacing plastic with paper, using low-carbon printing and eco-certified stock to make exhibits that are creative and sustainable at once.</p><p>The work draws on Taiwan’s native species — the Formosan black bear and the leopard cat among them — as conservation symbols. The tour has shown at Space Moor in Keelung and Gallery Biga in Kyoto, and moves to Tainan at the end of the year.</p><p>Founded in 1968, NTI is a leading Taiwanese printing brand and an international partner. In recent years the company built a new headquarters in the Tainan Technology Industrial Park combining smart manufacturing, integrated production and environmental sustainability — earning both LEED Gold (US) and EEWH Diamond (Taiwan) green building certification.</p><p>From process carbon reduction and energy management through to smart warehousing, NTI continues to expand FSC-certified stock, LED-UV energy-saving printing and plateless digital printing.</p>",
          "coverAlt": "NTI signs an ESG for Culture letter of intent with TAICCA",
          "slug": "taicca-partnership",
          "seoTitle": "NTI signs an ESG for Culture letter of intent with TAICCA",
          "metaDescription": "ESG for Culture is TAICCA’s cross-sector programme, pairing corporate sustainability strategy with creative energy to build collaborations that carry both socia",
          "ogImageAlt": "NTI signs an ESG for Culture letter of intent with TAICCA"
        }
      }
    },
    {
      "id": "news-green-printing-digital-innovation",
      "sortOrder": 50,
      "isPublished": true,
      "categoryId": "News:sustainability",
      "publishDate": "2025-09-16",
      "cover": "/assets/news/green-printing-digital-innovation.jpg",
      "featured": false,
      "i18n": {
        "zh": {
          "title": "Green printing and digital innovation at NTI Tainan",
          "summary": "For a business, green printing supports international ESG expectations and strengthens brand credibility by showing real responsibility. For the environment, it cuts pollution and reduces ecological load. As the global net-zero push accelerates, printing is moving towards low-carbon and digital production, and green printing has become a precondition for working with international brands.",
          "body": "<p>For a business, green printing supports international ESG expectations and strengthens brand credibility by showing real responsibility. For the environment, it cuts pollution and reduces ecological load. As the global net-zero push accelerates, printing is moving towards low-carbon and digital production, and green printing has become a precondition for working with international brands.</p><p>Low-carbon process and eco materials. FSC-certified stock across the board, with continuous process optimisation to reduce energy use and waste — meeting both client sustainability requirements and international supply-chain rules.</p><p>AI and digital printing. HP Indigo digital presses and an AI energy-monitoring system make production smarter, giving small-run customisation more flexibility while cutting proofing and consumable waste.</p><p>Energy management and the smart factory. Low-energy LED-UV printing equipment paired with AI energy analysis gives precise control, from raw-material storage through to finished-goods despatch.</p><p>Digital production responds to market demand quickly, shortens lead times and improves quality consistency. Variable data printing (VDP) makes every piece unique where the brief calls for it. ERP/MES integration connects design, printing and finishing so the whole chain moves faster.</p><p>NTI also runs open factory visits and exchange sessions, sharing practical experience of sustainable printing and AI-enabled manufacturing with other companies.</p>",
          "coverAlt": "Green printing and digital innovation at NTI Tainan",
          "slug": "green-printing-digital-innovation",
          "seoTitle": "Green printing and digital innovation at NTI Tainan",
          "metaDescription": "For a business, green printing supports international ESG expectations and strengthens brand credibility by showing real responsibility. For the environment, it",
          "ogImageAlt": "Green printing and digital innovation at NTI Tainan"
        },
        "en": {
          "title": "Green printing and digital innovation at NTI Tainan",
          "summary": "For a business, green printing supports international ESG expectations and strengthens brand credibility by showing real responsibility. For the environment, it cuts pollution and reduces ecological load. As the global net-zero push accelerates, printing is moving towards low-carbon and digital production, and green printing has become a precondition for working with international brands.",
          "body": "<p>For a business, green printing supports international ESG expectations and strengthens brand credibility by showing real responsibility. For the environment, it cuts pollution and reduces ecological load. As the global net-zero push accelerates, printing is moving towards low-carbon and digital production, and green printing has become a precondition for working with international brands.</p><p>Low-carbon process and eco materials. FSC-certified stock across the board, with continuous process optimisation to reduce energy use and waste — meeting both client sustainability requirements and international supply-chain rules.</p><p>AI and digital printing. HP Indigo digital presses and an AI energy-monitoring system make production smarter, giving small-run customisation more flexibility while cutting proofing and consumable waste.</p><p>Energy management and the smart factory. Low-energy LED-UV printing equipment paired with AI energy analysis gives precise control, from raw-material storage through to finished-goods despatch.</p><p>Digital production responds to market demand quickly, shortens lead times and improves quality consistency. Variable data printing (VDP) makes every piece unique where the brief calls for it. ERP/MES integration connects design, printing and finishing so the whole chain moves faster.</p><p>NTI also runs open factory visits and exchange sessions, sharing practical experience of sustainable printing and AI-enabled manufacturing with other companies.</p>",
          "coverAlt": "Green printing and digital innovation at NTI Tainan",
          "slug": "green-printing-digital-innovation",
          "seoTitle": "Green printing and digital innovation at NTI Tainan",
          "metaDescription": "For a business, green printing supports international ESG expectations and strengthens brand credibility by showing real responsibility. For the environment, it",
          "ogImageAlt": "Green printing and digital innovation at NTI Tainan"
        }
      }
    },
    {
      "id": "news-green-drive-seminar",
      "sortOrder": 60,
      "isPublished": true,
      "categoryId": "News:event",
      "publishDate": "2025-07-01",
      "cover": "/assets/news/green-drive-seminar.jpg",
      "featured": false,
      "i18n": {
        "zh": {
          "title": "Green Drive × Digital Innovation seminar wraps up",
          "summary": "HP’s Asia-Pacific brand manager on global trends in digital transformation.",
          "body": "<p>HP’s Asia-Pacific brand manager on global trends in digital transformation.</p><p>Practical application of green supply chains and digital packaging processes.</p><p>A live equipment tour with open discussion, connecting the design side with the brand side.</p><p>A networking dinner opening up cross-sector collaboration.</p><p>The seminar was less an information exchange than a working session on where the industry goes next. NTI will keep putting eco-friendly packaging into practice and accelerating its adoption of digital transformation technology, helping clients build sustainable brands with more resilience and more competitive edge.</p>",
          "coverAlt": "Green Drive × Digital Innovation seminar wraps up",
          "slug": "green-drive-seminar",
          "seoTitle": "Green Drive × Digital Innovation seminar wraps up",
          "metaDescription": "HP’s Asia-Pacific brand manager on global trends in digital transformation.",
          "ogImageAlt": "Green Drive × Digital Innovation seminar wraps up"
        },
        "en": {
          "title": "Green Drive × Digital Innovation seminar wraps up",
          "summary": "HP’s Asia-Pacific brand manager on global trends in digital transformation.",
          "body": "<p>HP’s Asia-Pacific brand manager on global trends in digital transformation.</p><p>Practical application of green supply chains and digital packaging processes.</p><p>A live equipment tour with open discussion, connecting the design side with the brand side.</p><p>A networking dinner opening up cross-sector collaboration.</p><p>The seminar was less an information exchange than a working session on where the industry goes next. NTI will keep putting eco-friendly packaging into practice and accelerating its adoption of digital transformation technology, helping clients build sustainable brands with more resilience and more competitive edge.</p>",
          "coverAlt": "Green Drive × Digital Innovation seminar wraps up",
          "slug": "green-drive-seminar",
          "seoTitle": "Green Drive × Digital Innovation seminar wraps up",
          "metaDescription": "HP’s Asia-Pacific brand manager on global trends in digital transformation.",
          "ogImageAlt": "Green Drive × Digital Innovation seminar wraps up"
        }
      }
    },
    {
      "id": "news-animals-of-tomorrow",
      "sortOrder": 70,
      "isPublished": true,
      "categoryId": "News:esg",
      "publishDate": "2025-05-09",
      "cover": "/assets/news/animals-of-tomorrow.jpg",
      "featured": false,
      "i18n": {
        "zh": {
          "title": "Speaking up for the leopard cat: NTI joins the Animals of Tomorrow exhibition",
          "summary": "The exhibition focuses on endangered species. NTI and 72 Design co-created interactive paper-model installations built around the Formosan black bear and the leopard cat, produced with variable printing and no plate-making — which in practice means a lower-carbon, lower-waste process, creative work that also teaches, and the flexibility of digital printing across small, varied runs.",
          "body": "<p>The exhibition focuses on endangered species. NTI and 72 Design co-created interactive paper-model installations built around the Formosan black bear and the leopard cat, produced with variable printing and no plate-making — which in practice means a lower-carbon, lower-waste process, creative work that also teaches, and the flexibility of digital printing across small, varied runs.</p><p>Venue. SPACE MOOR, Keelung.</p><p>Dates. Through 25 May 2025, 12:00–19:00, free entry.</p><p>The work was covered by Yahoo News, China Times, InTime and INNEWS, and an exhibition film is available on YouTube.</p>",
          "coverAlt": "Speaking up for the leopard cat: NTI joins the Animals of Tomorrow exhibition",
          "slug": "animals-of-tomorrow",
          "seoTitle": "Speaking up for the leopard cat: NTI joins the Animals of Tomorrow exhibition",
          "metaDescription": "The exhibition focuses on endangered species. NTI and 72 Design co-created interactive paper-model installations built around the Formosan black bear and the le",
          "ogImageAlt": "Speaking up for the leopard cat: NTI joins the Animals of Tomorrow exhibition"
        },
        "en": {
          "title": "Speaking up for the leopard cat: NTI joins the Animals of Tomorrow exhibition",
          "summary": "The exhibition focuses on endangered species. NTI and 72 Design co-created interactive paper-model installations built around the Formosan black bear and the leopard cat, produced with variable printing and no plate-making — which in practice means a lower-carbon, lower-waste process, creative work that also teaches, and the flexibility of digital printing across small, varied runs.",
          "body": "<p>The exhibition focuses on endangered species. NTI and 72 Design co-created interactive paper-model installations built around the Formosan black bear and the leopard cat, produced with variable printing and no plate-making — which in practice means a lower-carbon, lower-waste process, creative work that also teaches, and the flexibility of digital printing across small, varied runs.</p><p>Venue. SPACE MOOR, Keelung.</p><p>Dates. Through 25 May 2025, 12:00–19:00, free entry.</p><p>The work was covered by Yahoo News, China Times, InTime and INNEWS, and an exhibition film is available on YouTube.</p>",
          "coverAlt": "Speaking up for the leopard cat: NTI joins the Animals of Tomorrow exhibition",
          "slug": "animals-of-tomorrow",
          "seoTitle": "Speaking up for the leopard cat: NTI joins the Animals of Tomorrow exhibition",
          "metaDescription": "The exhibition focuses on endangered species. NTI and 72 Design co-created interactive paper-model installations built around the Formosan black bear and the le",
          "ogImageAlt": "Speaking up for the leopard cat: NTI joins the Animals of Tomorrow exhibition"
        }
      }
    },
    {
      "id": "news-gentle-wild-paper-bags",
      "sortOrder": 80,
      "isPublished": true,
      "categoryId": "News:esg",
      "publishDate": "2025-04-18",
      "cover": "/assets/news/gentle-wild-paper-bags.png",
      "featured": false,
      "i18n": {
        "zh": {
          "title": "Gentle Wild paper bags: a different animal on every bag",
          "summary": "The market is unforgiving: however good the product is, if the packaging does not catch the eye the customer may never look. Gentle Wild designed a full series of animal illustrations — each one reading like a miniature story with its own character and setting.",
          "body": "<p>The market is unforgiving: however good the product is, if the packaging does not catch the eye the customer may never look. Gentle Wild designed a full series of animal illustrations — each one reading like a miniature story with its own character and setting.</p><p>Paired with HP variable data printing, no two bags repeat, yet the range stays visually consistent: recognisable, but never dull.</p><p>No plate-making, so small runs are viable — fast and low cost, which matters when despatch has to stay flexible. And because NTI runs eco specifications from paper and ink through to the printing process itself, the brand can tell customers the packaging is kind to the environment as well as to the design.</p>",
          "coverAlt": "Gentle Wild paper bags: a different animal on every bag",
          "slug": "gentle-wild-paper-bags",
          "seoTitle": "Gentle Wild paper bags: a different animal on every bag",
          "metaDescription": "The market is unforgiving: however good the product is, if the packaging does not catch the eye the customer may never look. Gentle Wild designed a full series ",
          "ogImageAlt": "Gentle Wild paper bags: a different animal on every bag"
        },
        "en": {
          "title": "Gentle Wild paper bags: a different animal on every bag",
          "summary": "The market is unforgiving: however good the product is, if the packaging does not catch the eye the customer may never look. Gentle Wild designed a full series of animal illustrations — each one reading like a miniature story with its own character and setting.",
          "body": "<p>The market is unforgiving: however good the product is, if the packaging does not catch the eye the customer may never look. Gentle Wild designed a full series of animal illustrations — each one reading like a miniature story with its own character and setting.</p><p>Paired with HP variable data printing, no two bags repeat, yet the range stays visually consistent: recognisable, but never dull.</p><p>No plate-making, so small runs are viable — fast and low cost, which matters when despatch has to stay flexible. And because NTI runs eco specifications from paper and ink through to the printing process itself, the brand can tell customers the packaging is kind to the environment as well as to the design.</p>",
          "coverAlt": "Gentle Wild paper bags: a different animal on every bag",
          "slug": "gentle-wild-paper-bags",
          "seoTitle": "Gentle Wild paper bags: a different animal on every bag",
          "metaDescription": "The market is unforgiving: however good the product is, if the packaging does not catch the eye the customer may never look. Gentle Wild designed a full series ",
          "ogImageAlt": "Gentle Wild paper bags: a different animal on every bag"
        }
      }
    },
    {
      "id": "news-hp-variable-data-printing",
      "sortOrder": 90,
      "isPublished": true,
      "categoryId": "News:esg",
      "publishDate": "2025-03-21",
      "cover": "/assets/news/hp-variable-data-printing.jpg",
      "featured": false,
      "i18n": {
        "zh": {
          "title": "HP variable data printing: small runs that still stand out",
          "summary": "Variable data printing. Every printed piece can differ — name, serial number, barcode, artwork. One-off printing becomes possible; so does one design per box.",
          "body": "<p>Variable data printing. Every printed piece can differ — name, serial number, barcode, artwork. One-off printing becomes possible; so does one design per box.</p><p>Small runs, lower inventory risk. No large minimum order. Print to demand, with high flexibility and low risk — suited to pop-ups, limited blind-box products and custom services.</p><p>Fast delivery. No plate-making and a simplified workflow move a job from design to despatch faster, shortening time to market.</p><p>High-quality output. Advanced digital printing renders fine gradients and saturated colour, lifting product feel and brand image.</p><p>Flexible market testing. Test consumer reaction on a small run first, then adjust design or marketing — less waste, better efficiency.</p>",
          "coverAlt": "HP variable data printing: small runs that still stand out",
          "slug": "hp-variable-data-printing",
          "seoTitle": "HP variable data printing: small runs that still stand out",
          "metaDescription": "Variable data printing. Every printed piece can differ — name, serial number, barcode, artwork. One-off printing becomes possible; so does one design per box.",
          "ogImageAlt": "HP variable data printing: small runs that still stand out"
        },
        "en": {
          "title": "HP variable data printing: small runs that still stand out",
          "summary": "Variable data printing. Every printed piece can differ — name, serial number, barcode, artwork. One-off printing becomes possible; so does one design per box.",
          "body": "<p>Variable data printing. Every printed piece can differ — name, serial number, barcode, artwork. One-off printing becomes possible; so does one design per box.</p><p>Small runs, lower inventory risk. No large minimum order. Print to demand, with high flexibility and low risk — suited to pop-ups, limited blind-box products and custom services.</p><p>Fast delivery. No plate-making and a simplified workflow move a job from design to despatch faster, shortening time to market.</p><p>High-quality output. Advanced digital printing renders fine gradients and saturated colour, lifting product feel and brand image.</p><p>Flexible market testing. Test consumer reaction on a small run first, then adjust design or marketing — less waste, better efficiency.</p>",
          "coverAlt": "HP variable data printing: small runs that still stand out",
          "slug": "hp-variable-data-printing",
          "seoTitle": "HP variable data printing: small runs that still stand out",
          "metaDescription": "Variable data printing. Every printed piece can differ — name, serial number, barcode, artwork. One-off printing becomes possible; so does one design per box.",
          "ogImageAlt": "HP variable data printing: small runs that still stand out"
        }
      }
    },
    {
      "id": "news-sme-investment-benchmark",
      "sortOrder": 100,
      "isPublished": true,
      "categoryId": "News:awards",
      "publishDate": "2025-01-15",
      "cover": "/assets/news/sme-investment-benchmark.jpg",
      "featured": false,
      "i18n": {
        "zh": {
          "title": "Named a benchmark enterprise in the SME Accelerated Investment Programme",
          "summary": "2024 was a milestone year. In eco-friendly packaging printing NTI has held to a green and sustainable direction, earning client trust and then standing out in the SME Accelerated Investment Programme.",
          "body": "<p>2024 was a milestone year. In eco-friendly packaging printing NTI has held to a green and sustainable direction, earning client trust and then standing out in the SME Accelerated Investment Programme.</p><p>The recognition came from performance across operational management, core differentiating technology, automation and digital transformation, and sustainable business practice. It belongs to every colleague, and it is the reason to keep going.</p>",
          "coverAlt": "Named a benchmark enterprise in the SME Accelerated Investment Programme",
          "slug": "sme-investment-benchmark",
          "seoTitle": "Named a benchmark enterprise in the SME Accelerated Investment Programme",
          "metaDescription": "2024 was a milestone year. In eco-friendly packaging printing NTI has held to a green and sustainable direction, earning client trust and then standing out in t",
          "ogImageAlt": "Named a benchmark enterprise in the SME Accelerated Investment Programme"
        },
        "en": {
          "title": "Named a benchmark enterprise in the SME Accelerated Investment Programme",
          "summary": "2024 was a milestone year. In eco-friendly packaging printing NTI has held to a green and sustainable direction, earning client trust and then standing out in the SME Accelerated Investment Programme.",
          "body": "<p>2024 was a milestone year. In eco-friendly packaging printing NTI has held to a green and sustainable direction, earning client trust and then standing out in the SME Accelerated Investment Programme.</p><p>The recognition came from performance across operational management, core differentiating technology, automation and digital transformation, and sustainable business practice. It belongs to every colleague, and it is the reason to keep going.</p>",
          "coverAlt": "Named a benchmark enterprise in the SME Accelerated Investment Programme",
          "slug": "sme-investment-benchmark",
          "seoTitle": "Named a benchmark enterprise in the SME Accelerated Investment Programme",
          "metaDescription": "2024 was a milestone year. In eco-friendly packaging printing NTI has held to a green and sustainable direction, earning client trust and then standing out in t",
          "ogImageAlt": "Named a benchmark enterprise in the SME Accelerated Investment Programme"
        }
      }
    },
    {
      "id": "news-commonwealth-interview",
      "sortOrder": 110,
      "isPublished": true,
      "categoryId": "News:esg",
      "publishDate": "2024-11-11",
      "cover": "/assets/news/commonwealth-interview.jpg",
      "featured": false,
      "i18n": {
        "zh": {
          "title": "NTI interviewed by CommonWealth Magazine",
          "summary": "The conversation went into how NTI builds environmental thinking into every production detail — from material selection through to carbon reduction measures — and what it takes to be a green front-runner in this industry rather than a follower.",
          "body": "<p>The conversation went into how NTI builds environmental thinking into every production detail — from material selection through to carbon reduction measures — and what it takes to be a green front-runner in this industry rather than a follower.</p>",
          "coverAlt": "NTI interviewed by CommonWealth Magazine",
          "slug": "commonwealth-interview",
          "seoTitle": "NTI interviewed by CommonWealth Magazine",
          "metaDescription": "The conversation went into how NTI builds environmental thinking into every production detail — from material selection through to carbon reduction measures — a",
          "ogImageAlt": "NTI interviewed by CommonWealth Magazine"
        },
        "en": {
          "title": "NTI interviewed by CommonWealth Magazine",
          "summary": "The conversation went into how NTI builds environmental thinking into every production detail — from material selection through to carbon reduction measures — and what it takes to be a green front-runner in this industry rather than a follower.",
          "body": "<p>The conversation went into how NTI builds environmental thinking into every production detail — from material selection through to carbon reduction measures — and what it takes to be a green front-runner in this industry rather than a follower.</p>",
          "coverAlt": "NTI interviewed by CommonWealth Magazine",
          "slug": "commonwealth-interview",
          "seoTitle": "NTI interviewed by CommonWealth Magazine",
          "metaDescription": "The conversation went into how NTI builds environmental thinking into every production detail — from material selection through to carbon reduction measures — a",
          "ogImageAlt": "NTI interviewed by CommonWealth Magazine"
        }
      }
    },
    {
      "id": "news-low-carbon-production-film",
      "sortOrder": 120,
      "isPublished": true,
      "categoryId": "News:sustainability",
      "publishDate": "2024-08-09",
      "cover": "/assets/news/low-carbon-production-film.jpg",
      "featured": false,
      "i18n": {
        "zh": {
          "title": "Our integrated low-carbon production model — company film",
          "summary": "As a packaging printer focused on the environment, NTI works to supply products and services that meet the highest environmental standards. The dual green building certification recognises the work done so far — and sets the bar for what comes next.",
          "body": "<p>As a packaging printer focused on the environment, NTI works to supply products and services that meet the highest environmental standards. The dual green building certification recognises the work done so far — and sets the bar for what comes next.</p><p>Customers today care about the quality of a product and about how it was made. The film covers every stage — material selection, structural design, the printing process, finished packaging and logistics — each running under international energy-saving and emission-reduction standards. An energy management platform coordinates efficiency planning across the whole plant.</p><p>Our purpose is to supply refined, custom packaging solutions, because quality and environmental responsibility are not separate goals. Choosing NTI is a vote of confidence in us and a contribution to the environment.</p>",
          "coverAlt": "Our integrated low-carbon production model — company film",
          "slug": "low-carbon-production-film",
          "seoTitle": "Our integrated low-carbon production model — company film",
          "metaDescription": "As a packaging printer focused on the environment, NTI works to supply products and services that meet the highest environmental standards. The dual green build",
          "ogImageAlt": "Our integrated low-carbon production model — company film"
        },
        "en": {
          "title": "Our integrated low-carbon production model — company film",
          "summary": "As a packaging printer focused on the environment, NTI works to supply products and services that meet the highest environmental standards. The dual green building certification recognises the work done so far — and sets the bar for what comes next.",
          "body": "<p>As a packaging printer focused on the environment, NTI works to supply products and services that meet the highest environmental standards. The dual green building certification recognises the work done so far — and sets the bar for what comes next.</p><p>Customers today care about the quality of a product and about how it was made. The film covers every stage — material selection, structural design, the printing process, finished packaging and logistics — each running under international energy-saving and emission-reduction standards. An energy management platform coordinates efficiency planning across the whole plant.</p><p>Our purpose is to supply refined, custom packaging solutions, because quality and environmental responsibility are not separate goals. Choosing NTI is a vote of confidence in us and a contribution to the environment.</p>",
          "coverAlt": "Our integrated low-carbon production model — company film",
          "slug": "low-carbon-production-film",
          "seoTitle": "Our integrated low-carbon production model — company film",
          "metaDescription": "As a packaging printer focused on the environment, NTI works to supply products and services that meet the highest environmental standards. The dual green build",
          "ogImageAlt": "Our integrated low-carbon production model — company film"
        }
      }
    }
  ],
  "project": [
    {
      "id": "10",
      "sortOrder": 10,
      "isPublished": true,
      "categoryId": "Project:food",
      "image": "/assets/hp-prod0.jpg",
      "videoUrl": "",
      "statValue": "-32%",
      "i18n": {
        "zh": {
          "title": "Export snack carton — 32% less carbon per unit",
          "description": "Migration-safe inks, FSC board and a right-weighted structure for a brand scaling into Japan and the EU.",
          "alt": "Export snack carton — 32% less carbon per unit",
          "statLabel": "carbon / unit"
        },
        "en": {
          "title": "Export snack carton — 32% less carbon per unit",
          "description": "Migration-safe inks, FSC board and a right-weighted structure for a brand scaling into Japan and the EU.",
          "alt": "Export snack carton — 32% less carbon per unit",
          "statLabel": "carbon / unit"
        }
      }
    },
    {
      "id": "20",
      "sortOrder": 20,
      "isPublished": true,
      "categoryId": "Project:pharma",
      "image": "/assets/hp-prod1.jpg",
      "videoUrl": "",
      "statValue": "0",
      "i18n": {
        "zh": {
          "title": "Serialized pharma cartons, audit-ready",
          "description": "GMP-aligned inspection, batch traceability and tamper-evident structure for a regulated line.",
          "alt": "Serialized pharma cartons, audit-ready",
          "statLabel": "audit findings"
        },
        "en": {
          "title": "Serialized pharma cartons, audit-ready",
          "description": "GMP-aligned inspection, batch traceability and tamper-evident structure for a regulated line.",
          "alt": "Serialized pharma cartons, audit-ready",
          "statLabel": "audit findings"
        }
      }
    },
    {
      "id": "30",
      "sortOrder": 30,
      "isPublished": true,
      "categoryId": "Project:esg",
      "image": "/assets/diff-box.jpg",
      "videoUrl": "",
      "statValue": "100%",
      "i18n": {
        "zh": {
          "title": "Mono-material redesign kept the shelf wow",
          "description": "Replaced plastic lamination with a recyclable coating — same gloss, single recycling stream.",
          "alt": "Mono-material redesign kept the shelf wow",
          "statLabel": "recyclable"
        },
        "en": {
          "title": "Mono-material redesign kept the shelf wow",
          "description": "Replaced plastic lamination with a recyclable coating — same gloss, single recycling stream.",
          "alt": "Mono-material redesign kept the shelf wow",
          "statLabel": "recyclable"
        }
      }
    },
    {
      "id": "40",
      "sortOrder": 40,
      "isPublished": true,
      "categoryId": "Project:retail",
      "image": "/assets/hp-prod2.jpg",
      "videoUrl": "",
      "statValue": "ΔE≤2",
      "i18n": {
        "zh": {
          "title": "Holiday gift set with foil + emboss at volume",
          "description": "Hot foil and tactile coating across 400k units with color held to ΔE ≤ 2 through the run.",
          "alt": "Holiday gift set with foil + emboss at volume",
          "statLabel": "color tolerance"
        },
        "en": {
          "title": "Holiday gift set with foil + emboss at volume",
          "description": "Hot foil and tactile coating across 400k units with color held to ΔE ≤ 2 through the run.",
          "alt": "Holiday gift set with foil + emboss at volume",
          "statLabel": "color tolerance"
        }
      }
    },
    {
      "id": "50",
      "sortOrder": 50,
      "isPublished": true,
      "categoryId": "Project:food",
      "image": "/assets/ps-box1.jpg",
      "videoUrl": "",
      "statValue": "-18°C",
      "i18n": {
        "zh": {
          "title": "Frozen-food board that survives the cold chain",
          "description": "Moisture-resistant coating and flute selection validated with transit and freezer testing.",
          "alt": "Frozen-food board that survives the cold chain",
          "statLabel": "validated"
        },
        "en": {
          "title": "Frozen-food board that survives the cold chain",
          "description": "Moisture-resistant coating and flute selection validated with transit and freezer testing.",
          "alt": "Frozen-food board that survives the cold chain",
          "statLabel": "validated"
        }
      }
    },
    {
      "id": "60",
      "sortOrder": 60,
      "isPublished": true,
      "categoryId": "Project:esg",
      "image": "/assets/hp-casestudy.jpg",
      "videoUrl": "",
      "statValue": "96%",
      "i18n": {
        "zh": {
          "title": "Soy-ink corrugated shipper for a D2C brand",
          "description": "One-pass flexo on recycled kraft, printed inside and out for an unboxing moment.",
          "alt": "Soy-ink corrugated shipper for a D2C brand",
          "statLabel": "recycled fiber"
        },
        "en": {
          "title": "Soy-ink corrugated shipper for a D2C brand",
          "description": "One-pass flexo on recycled kraft, printed inside and out for an unboxing moment.",
          "alt": "Soy-ink corrugated shipper for a D2C brand",
          "statLabel": "recycled fiber"
        }
      }
    }
  ],
  "faq": [
    {
      "id": "10",
      "sortOrder": 10,
      "isPublished": true,
      "i18n": {
        "zh": {
          "question": "What is your minimum order quantity?",
          "answer": "<p>It depends on the process. Offset color boxes typically start around 1,000 units; short-run and pilot production can go lower on our digital and UV lines. Tell us the quantity you actually need — we will spec the most economical route rather than force a minimum.</p>"
        },
        "en": {
          "question": "What is your minimum order quantity?",
          "answer": "<p>It depends on the process. Offset color boxes typically start around 1,000 units; short-run and pilot production can go lower on our digital and UV lines. Tell us the quantity you actually need — we will spec the most economical route rather than force a minimum.</p>"
        }
      }
    },
    {
      "id": "20",
      "sortOrder": 20,
      "isPublished": true,
      "i18n": {
        "zh": {
          "question": "Can you handle food-grade and pharma packaging requirements?",
          "answer": "<p>Yes. We run migration-safe, low-odor ink systems for food contact, and GMP-aligned inspection with batch traceability for pharmaceutical cartons. Compliance documentation is prepared together with the job.</p>"
        },
        "en": {
          "question": "Can you handle food-grade and pharma packaging requirements?",
          "answer": "<p>Yes. We run migration-safe, low-odor ink systems for food contact, and GMP-aligned inspection with batch traceability for pharmaceutical cartons. Compliance documentation is prepared together with the job.</p>"
        }
      }
    },
    {
      "id": "30",
      "sortOrder": 30,
      "isPublished": true,
      "i18n": {
        "zh": {
          "question": "What files do you need to start a quote?",
          "answer": "<p>A dieline (AI/PDF) if you have one, artwork in PDF/X, and your target quantity, board and finish. No dieline yet? Send product dimensions and we will propose a structure.</p>"
        },
        "en": {
          "question": "What files do you need to start a quote?",
          "answer": "<p>A dieline (AI/PDF) if you have one, artwork in PDF/X, and your target quantity, board and finish. No dieline yet? Send product dimensions and we will propose a structure.</p>"
        }
      }
    },
    {
      "id": "40",
      "sortOrder": 40,
      "isPublished": true,
      "i18n": {
        "zh": {
          "question": "How do you calculate the carbon footprint of my order?",
          "answer": "<p>We meter energy, board, ink and waste at each production stage against our audited baseline, then allocate to your order by run. You receive a per-order figure your ESG team can cite, with methodology notes.</p>"
        },
        "en": {
          "question": "How do you calculate the carbon footprint of my order?",
          "answer": "<p>We meter energy, board, ink and waste at each production stage against our audited baseline, then allocate to your order by run. You receive a per-order figure your ESG team can cite, with methodology notes.</p>"
        }
      }
    },
    {
      "id": "50",
      "sortOrder": 50,
      "isPublished": true,
      "i18n": {
        "zh": {
          "question": "Which eco materials can you print on?",
          "answer": "<p>FSC™-certified virgin and recycled boards, kraft, and specialty recycled stocks. We replace plastic lamination with recyclable coatings wherever the spec allows.</p>"
        },
        "en": {
          "question": "Which eco materials can you print on?",
          "answer": "<p>FSC™-certified virgin and recycled boards, kraft, and specialty recycled stocks. We replace plastic lamination with recyclable coatings wherever the spec allows.</p>"
        }
      }
    },
    {
      "id": "60",
      "sortOrder": 60,
      "isPublished": true,
      "i18n": {
        "zh": {
          "question": "What are typical lead times?",
          "answer": "<p>Standard color box orders run 10–15 working days from artwork approval; repeat orders are faster. Complex finishing adds time — we commit dates from real machine capacity, and keep them.</p>"
        },
        "en": {
          "question": "What are typical lead times?",
          "answer": "<p>Standard color box orders run 10–15 working days from artwork approval; repeat orders are faster. Complex finishing adds time — we commit dates from real machine capacity, and keep them.</p>"
        }
      }
    },
    {
      "id": "70",
      "sortOrder": 70,
      "isPublished": true,
      "i18n": {
        "zh": {
          "question": "Do you support structural design and prototyping?",
          "answer": "<p>Yes. Our pre-press team provides dielines, white samples and printed mockups, plus drop and transit testing for shipping structures before mass production.</p>"
        },
        "en": {
          "question": "Do you support structural design and prototyping?",
          "answer": "<p>Yes. Our pre-press team provides dielines, white samples and printed mockups, plus drop and transit testing for shipping structures before mass production.</p>"
        }
      }
    },
    {
      "id": "80",
      "sortOrder": 80,
      "isPublished": true,
      "i18n": {
        "zh": {
          "question": "Can international clients work with you?",
          "answer": "<p>Absolutely — a large share of our output ships to Japan, the EU and North America. We handle export cartons, documentation and freight coordination from the Tainan plant.</p>"
        },
        "en": {
          "question": "Can international clients work with you?",
          "answer": "<p>Absolutely — a large share of our output ships to Japan, the EU and North America. We handle export cartons, documentation and freight coordination from the Tainan plant.</p>"
        }
      }
    }
  ],
  "job": [
    {
      "id": "10",
      "sortOrder": 10,
      "isPublished": true,
      "i18n": {
        "zh": {
          "title": "Offset Press Operator — Tainan plant",
          "body": "<p>Run and maintain sheet-fed offset presses to ISO 12647-2 colour standards. Experience on Heidelberg equipment preferred; we will train the right candidate on our colour management workflow. Shift allowance applies.</p>",
          "location": "台南廠"
        },
        "en": {
          "title": "Offset Press Operator — Tainan plant",
          "body": "<p>Run and maintain sheet-fed offset presses to ISO 12647-2 colour standards. Experience on Heidelberg equipment preferred; we will train the right candidate on our colour management workflow. Shift allowance applies.</p>",
          "location": "Tainan plant"
        }
      }
    },
    {
      "id": "20",
      "sortOrder": 20,
      "isPublished": true,
      "i18n": {
        "zh": {
          "title": "Prepress / Colour Management Engineer",
          "body": "<p>Own CTP output, proofing and dot calibration. You will work with the Jazzy colour system and X-Rite instruments, and be the last check before a job reaches the press.</p>",
          "location": "台南廠"
        },
        "en": {
          "title": "Prepress / Colour Management Engineer",
          "body": "<p>Own CTP output, proofing and dot calibration. You will work with the Jazzy colour system and X-Rite instruments, and be the last check before a job reaches the press.</p>",
          "location": "Tainan plant"
        }
      }
    },
    {
      "id": "30",
      "sortOrder": 30,
      "isPublished": true,
      "i18n": {
        "zh": {
          "title": "Structural Packaging Designer",
          "body": "<p>Turn product dimensions into dielines that survive transit and recycle cleanly. CAD plus hands-on sample making on our ZÜND cutter; close collaboration with brand-side design teams.</p>",
          "location": "台南廠"
        },
        "en": {
          "title": "Structural Packaging Designer",
          "body": "<p>Turn product dimensions into dielines that survive transit and recycle cleanly. CAD plus hands-on sample making on our ZÜND cutter; close collaboration with brand-side design teams.</p>",
          "location": "Tainan plant"
        }
      }
    },
    {
      "id": "40",
      "sortOrder": 40,
      "isPublished": true,
      "i18n": {
        "zh": {
          "title": "ESG & Sustainability Specialist",
          "body": "<p>Maintain our carbon accounting, certification evidence and customer ESG reporting. Suits someone comfortable with both a spreadsheet and a pressroom floor.</p>",
          "location": "台南廠"
        },
        "en": {
          "title": "ESG & Sustainability Specialist",
          "body": "<p>Maintain our carbon accounting, certification evidence and customer ESG reporting. Suits someone comfortable with both a spreadsheet and a pressroom floor.</p>",
          "location": "Tainan plant"
        }
      }
    },
    {
      "id": "50",
      "sortOrder": 50,
      "isPublished": true,
      "i18n": {
        "zh": {
          "title": "International Sales Representative",
          "body": "<p>Develop and service accounts in Japan, the EU and North America. Business-level English required; packaging or print background an advantage.</p>",
          "location": "台南廠"
        },
        "en": {
          "title": "International Sales Representative",
          "body": "<p>Develop and service accounts in Japan, the EU and North America. Business-level English required; packaging or print background an advantage.</p>",
          "location": "Tainan plant"
        }
      }
    }
  ],
  "trend": [
    {
      "id": "10",
      "sortOrder": 10,
      "isPublished": true,
      "i18n": {
        "zh": {
          "title": "Regulation is setting the pace",
          "body": "<p>Packaging rules in the EU, Japan and North America are converging on recyclability, recycled content and disclosure. Design decisions that used to be aesthetic — a laminate, a foil, a window — are now compliance decisions.</p>"
        },
        "en": {
          "title": "Regulation is setting the pace",
          "body": "<p>Packaging rules in the EU, Japan and North America are converging on recyclability, recycled content and disclosure. Design decisions that used to be aesthetic — a laminate, a foil, a window — are now compliance decisions.</p>"
        }
      }
    },
    {
      "id": "20",
      "sortOrder": 20,
      "isPublished": true,
      "i18n": {
        "zh": {
          "title": "Mono-material replaces the composite pack",
          "body": "<p>Composite structures print beautifully and recycle badly. The move is toward one board, one coating, one waste stream — which pushes the burden onto printing and finishing to deliver the same shelf impact without plastic lamination.</p>"
        },
        "en": {
          "title": "Mono-material replaces the composite pack",
          "body": "<p>Composite structures print beautifully and recycle badly. The move is toward one board, one coating, one waste stream — which pushes the burden onto printing and finishing to deliver the same shelf impact without plastic lamination.</p>"
        }
      }
    },
    {
      "id": "30",
      "sortOrder": 30,
      "isPublished": true,
      "i18n": {
        "zh": {
          "title": "Carbon data becomes a line item",
          "body": "<p>Scope 3 reporting has turned the printed carton into a data point. Brands increasingly need a per-order figure their ESG team can cite — measured against an audited baseline, not estimated from an industry average.</p>"
        },
        "en": {
          "title": "Carbon data becomes a line item",
          "body": "<p>Scope 3 reporting has turned the printed carton into a data point. Brands increasingly need a per-order figure their ESG team can cite — measured against an audited baseline, not estimated from an industry average.</p>"
        }
      }
    },
    {
      "id": "40",
      "sortOrder": 40,
      "isPublished": true,
      "i18n": {
        "zh": {
          "title": "Shorter runs, more versions",
          "body": "<p>Product ranges are fragmenting into regional, seasonal and campaign variants. The economic run length keeps falling, which favours digital and variable-data workflows alongside offset rather than instead of it.</p>"
        },
        "en": {
          "title": "Shorter runs, more versions",
          "body": "<p>Product ranges are fragmenting into regional, seasonal and campaign variants. The economic run length keeps falling, which favours digital and variable-data workflows alongside offset rather than instead of it.</p>"
        }
      }
    },
    {
      "id": "50",
      "sortOrder": 50,
      "isPublished": true,
      "i18n": {
        "zh": {
          "title": "Traceability from plate to pallet",
          "body": "<p>Food-contact and pharmaceutical work has raised the bar for everyone. Batch traceability, migration-safe ink systems and inspection records are moving from regulated categories into mainstream retail packaging.</p>"
        },
        "en": {
          "title": "Traceability from plate to pallet",
          "body": "<p>Food-contact and pharmaceutical work has raised the bar for everyone. Batch traceability, migration-safe ink systems and inspection records are moving from regulated categories into mainstream retail packaging.</p>"
        }
      }
    }
  ],
  "certification": [
    {
      "id": "10",
      "sortOrder": 10,
      "isPublished": true,
      "categoryId": "Certification:certification",
      "logo": "/assets/cert-g7.png",
      "linkUrl": "",
      "showOnHome": true,
      "i18n": {
        "zh": {
          "name": "G7 Master Qualified Facility",
          "alt": "G7 Master Qualified Facility",
          "description": ""
        },
        "en": {
          "name": "G7 Master Qualified Facility",
          "alt": "G7 Master Qualified Facility",
          "description": ""
        }
      }
    },
    {
      "id": "20",
      "sortOrder": 20,
      "isPublished": true,
      "categoryId": "Certification:certification",
      "logo": "/assets/cert-gmi.png",
      "linkUrl": "",
      "showOnHome": true,
      "i18n": {
        "zh": {
          "name": "GMI Certified Print Facility",
          "alt": "GMI Certified Print Facility",
          "description": ""
        },
        "en": {
          "name": "GMI Certified Print Facility",
          "alt": "GMI Certified Print Facility",
          "description": ""
        }
      }
    },
    {
      "id": "30",
      "sortOrder": 30,
      "isPublished": true,
      "categoryId": "Certification:certification",
      "logo": "/assets/cert-iso9001.png",
      "linkUrl": "",
      "showOnHome": true,
      "i18n": {
        "zh": {
          "name": "ISO 9001 Quality Assurance Management",
          "alt": "ISO 9001 Quality Assurance Management",
          "description": ""
        },
        "en": {
          "name": "ISO 9001 Quality Assurance Management",
          "alt": "ISO 9001 Quality Assurance Management",
          "description": ""
        }
      }
    },
    {
      "id": "40",
      "sortOrder": 40,
      "isPublished": true,
      "categoryId": "Certification:certification",
      "logo": "/assets/cert-iso14001.png",
      "linkUrl": "",
      "showOnHome": true,
      "i18n": {
        "zh": {
          "name": "ISO 14001 Environmental Management",
          "alt": "ISO 14001 Environmental Management",
          "description": ""
        },
        "en": {
          "name": "ISO 14001 Environmental Management",
          "alt": "ISO 14001 Environmental Management",
          "description": ""
        }
      }
    },
    {
      "id": "50",
      "sortOrder": 50,
      "isPublished": true,
      "categoryId": "Certification:certification",
      "logo": "/assets/cert-iso45001.png",
      "linkUrl": "",
      "showOnHome": true,
      "i18n": {
        "zh": {
          "name": "ISO 45001 Occupational Health & Safety",
          "alt": "ISO 45001 Occupational Health & Safety",
          "description": ""
        },
        "en": {
          "name": "ISO 45001 Occupational Health & Safety",
          "alt": "ISO 45001 Occupational Health & Safety",
          "description": ""
        }
      }
    },
    {
      "id": "60",
      "sortOrder": 60,
      "isPublished": true,
      "categoryId": "Certification:certification",
      "logo": "/assets/cert-fsc.png",
      "linkUrl": "",
      "showOnHome": true,
      "i18n": {
        "zh": {
          "name": "FSC certified",
          "alt": "FSC certified",
          "description": ""
        },
        "en": {
          "name": "FSC certified",
          "alt": "FSC certified",
          "description": ""
        }
      }
    },
    {
      "id": "70",
      "sortOrder": 70,
      "isPublished": true,
      "categoryId": "Certification:certification",
      "logo": "/assets/cert-leed-gold.png",
      "linkUrl": "",
      "showOnHome": true,
      "i18n": {
        "zh": {
          "name": "LEED Gold 2023",
          "alt": "LEED Gold 2023",
          "description": ""
        },
        "en": {
          "name": "LEED Gold 2023",
          "alt": "LEED Gold 2023",
          "description": ""
        }
      }
    },
    {
      "id": "80",
      "sortOrder": 80,
      "isPublished": true,
      "categoryId": "Certification:certification",
      "logo": "/assets/cert-greenbuilding.png",
      "linkUrl": "",
      "showOnHome": true,
      "i18n": {
        "zh": {
          "name": "Green Building Label — Diamond grade",
          "alt": "Green Building Label — Diamond grade",
          "description": ""
        },
        "en": {
          "name": "Green Building Label — Diamond grade",
          "alt": "Green Building Label — Diamond grade",
          "description": ""
        }
      }
    },
    {
      "id": "90",
      "sortOrder": 90,
      "isPublished": true,
      "categoryId": "Certification:certification",
      "logo": "/assets/cert-co2neutral.png",
      "linkUrl": "",
      "showOnHome": true,
      "i18n": {
        "zh": {
          "name": "CO2 Neutral",
          "alt": "CO2 Neutral",
          "description": ""
        },
        "en": {
          "name": "CO2 Neutral",
          "alt": "CO2 Neutral",
          "description": ""
        }
      }
    },
    {
      "id": "100",
      "sortOrder": 100,
      "isPublished": true,
      "categoryId": "Certification:certification",
      "logo": "/assets/cert-green.png",
      "linkUrl": "",
      "showOnHome": true,
      "i18n": {
        "zh": {
          "name": "Green Printing",
          "alt": "Green Printing",
          "description": ""
        },
        "en": {
          "name": "Green Printing",
          "alt": "Green Printing",
          "description": ""
        }
      }
    },
    {
      "id": "110",
      "sortOrder": 110,
      "isPublished": true,
      "categoryId": "Certification:certification",
      "logo": "/assets/cert-mof.png",
      "linkUrl": "",
      "showOnHome": true,
      "i18n": {
        "zh": {
          "name": "Mineral Oil Free",
          "alt": "Mineral Oil Free",
          "description": ""
        },
        "en": {
          "name": "Mineral Oil Free",
          "alt": "Mineral Oil Free",
          "description": ""
        }
      }
    },
    {
      "id": "120",
      "sortOrder": 120,
      "isPublished": true,
      "categoryId": "Certification:certification",
      "logo": "/assets/cert-esg.png",
      "linkUrl": "",
      "showOnHome": true,
      "i18n": {
        "zh": {
          "name": "ESG — Environmental, Social, Governance",
          "alt": "ESG — Environmental, Social, Governance",
          "description": ""
        },
        "en": {
          "name": "ESG — Environmental, Social, Governance",
          "alt": "ESG — Environmental, Social, Governance",
          "description": ""
        }
      }
    },
    {
      "id": "130",
      "sortOrder": 130,
      "isPublished": true,
      "categoryId": "Certification:certification",
      "logo": "/assets/cert-sedex.png",
      "linkUrl": "",
      "showOnHome": true,
      "i18n": {
        "zh": {
          "name": "Sedex Member",
          "alt": "Sedex Member",
          "description": ""
        },
        "en": {
          "name": "Sedex Member",
          "alt": "Sedex Member",
          "description": ""
        }
      }
    },
    {
      "id": "140",
      "sortOrder": 140,
      "isPublished": true,
      "categoryId": "Certification:certification",
      "logo": "/assets/cert-esci.png",
      "linkUrl": "",
      "showOnHome": true,
      "i18n": {
        "zh": {
          "name": "Energy Smart Communities Initiative",
          "alt": "Energy Smart Communities Initiative",
          "description": ""
        },
        "en": {
          "name": "Energy Smart Communities Initiative",
          "alt": "Energy Smart Communities Initiative",
          "description": ""
        }
      }
    }
  ],
  "client": [
    {
      "id": "10",
      "sortOrder": 10,
      "isPublished": true,
      "name": "Target",
      "logo": "/assets/client-target.png",
      "linkUrl": ""
    },
    {
      "id": "20",
      "sortOrder": 20,
      "isPublished": true,
      "name": "CVS pharmacy",
      "logo": "/assets/client-cvs.png",
      "linkUrl": ""
    },
    {
      "id": "30",
      "sortOrder": 30,
      "isPublished": true,
      "name": "Walgreens",
      "logo": "/assets/client-walgreens.png",
      "linkUrl": ""
    },
    {
      "id": "40",
      "sortOrder": 40,
      "isPublished": true,
      "name": "Lowe’s",
      "logo": "/assets/client-lowes.png",
      "linkUrl": ""
    },
    {
      "id": "50",
      "sortOrder": 50,
      "isPublished": true,
      "name": "Academy Sports + Outdoors",
      "logo": "/assets/client-academy.png",
      "linkUrl": ""
    },
    {
      "id": "60",
      "sortOrder": 60,
      "isPublished": true,
      "name": "The Home Depot",
      "logo": "/assets/client-homedepot.png",
      "linkUrl": ""
    }
  ],
  "facility": [
    {
      "id": "10",
      "sortOrder": 10,
      "isPublished": true,
      "categoryId": "Facility:pre-press",
      "image": "/assets/fac-pre-ctp.jpg",
      "i18n": {
        "zh": {
          "name": "Heidelberg Suprasetter 105 S CTP",
          "alt": "Heidelberg Suprasetter 105 S CTP",
          "description": ""
        },
        "en": {
          "name": "Heidelberg Suprasetter 105 S CTP",
          "alt": "Heidelberg Suprasetter 105 S CTP",
          "description": ""
        }
      }
    },
    {
      "id": "20",
      "sortOrder": 20,
      "isPublished": true,
      "categoryId": "Facility:pre-press",
      "image": "/assets/fac-pre-proof.jpg",
      "i18n": {
        "zh": {
          "name": "Prinect Color Proof Pro — digital proofing",
          "alt": "Prinect Color Proof Pro — digital proofing",
          "description": ""
        },
        "en": {
          "name": "Prinect Color Proof Pro — digital proofing",
          "alt": "Prinect Color Proof Pro — digital proofing",
          "description": ""
        }
      }
    },
    {
      "id": "30",
      "sortOrder": 30,
      "isPublished": true,
      "categoryId": "Facility:pre-press",
      "image": "/assets/fac-pre-jazzy.jpg",
      "i18n": {
        "zh": {
          "name": "Jazzy Light color management system",
          "alt": "Jazzy Light color management system",
          "description": ""
        },
        "en": {
          "name": "Jazzy Light color management system",
          "alt": "Jazzy Light color management system",
          "description": ""
        }
      }
    },
    {
      "id": "40",
      "sortOrder": 40,
      "isPublished": true,
      "categoryId": "Facility:pre-press",
      "image": "/assets/fac-pre-zund.jpg",
      "i18n": {
        "zh": {
          "name": "ZÜND CCD high-speed cutter",
          "alt": "ZÜND CCD high-speed cutter",
          "description": ""
        },
        "en": {
          "name": "ZÜND CCD high-speed cutter",
          "alt": "ZÜND CCD high-speed cutter",
          "description": ""
        }
      }
    },
    {
      "id": "50",
      "sortOrder": 50,
      "isPublished": true,
      "categoryId": "Facility:eco-printing",
      "image": "/assets/fac-eco-press.png",
      "i18n": {
        "zh": {
          "name": "Heidelberg Speedmaster CD-102 press line",
          "alt": "Heidelberg Speedmaster CD-102 press line",
          "description": ""
        },
        "en": {
          "name": "Heidelberg Speedmaster CD-102 press line",
          "alt": "Heidelberg Speedmaster CD-102 press line",
          "description": ""
        }
      }
    },
    {
      "id": "60",
      "sortOrder": 60,
      "isPublished": true,
      "categoryId": "Facility:eco-printing",
      "image": "/assets/fac-eco-pressroom.jpg",
      "i18n": {
        "zh": {
          "name": "Press room — production control",
          "alt": "Press room — production control",
          "description": ""
        },
        "en": {
          "name": "Press room — production control",
          "alt": "Press room — production control",
          "description": ""
        }
      }
    },
    {
      "id": "70",
      "sortOrder": 70,
      "isPublished": true,
      "categoryId": "Facility:eco-printing",
      "image": "/assets/fac-eco-axis.jpg",
      "i18n": {
        "zh": {
          "name": "Axis Control color measurement system",
          "alt": "Axis Control color measurement system",
          "description": ""
        },
        "en": {
          "name": "Axis Control color measurement system",
          "alt": "Axis Control color measurement system",
          "description": ""
        }
      }
    },
    {
      "id": "80",
      "sortOrder": 80,
      "isPublished": true,
      "categoryId": "Facility:eco-printing",
      "image": "/assets/fac-eco-imagecontrol.jpg",
      "i18n": {
        "zh": {
          "name": "Image Control spectral measurement",
          "alt": "Image Control spectral measurement",
          "description": ""
        },
        "en": {
          "name": "Image Control spectral measurement",
          "alt": "Image Control spectral measurement",
          "description": ""
        }
      }
    },
    {
      "id": "90",
      "sortOrder": 90,
      "isPublished": true,
      "categoryId": "Facility:post-press",
      "image": "/assets/fac-post-diecut.jpg",
      "i18n": {
        "zh": {
          "name": "Heidelberg Varimatrix 105 die-cutter",
          "alt": "Heidelberg Varimatrix 105 die-cutter",
          "description": ""
        },
        "en": {
          "name": "Heidelberg Varimatrix 105 die-cutter",
          "alt": "Heidelberg Varimatrix 105 die-cutter",
          "description": ""
        }
      }
    },
    {
      "id": "100",
      "sortOrder": 100,
      "isPublished": true,
      "categoryId": "Facility:post-press",
      "image": "/assets/fac-post-laminate.jpg",
      "i18n": {
        "zh": {
          "name": "High-speed intelligent laminating machine",
          "alt": "High-speed intelligent laminating machine",
          "description": ""
        },
        "en": {
          "name": "High-speed intelligent laminating machine",
          "alt": "High-speed intelligent laminating machine",
          "description": ""
        }
      }
    },
    {
      "id": "110",
      "sortOrder": 110,
      "isPublished": true,
      "categoryId": "Facility:post-press",
      "image": "/assets/fac-post-window.jpg",
      "i18n": {
        "zh": {
          "name": "Digital window patching machine",
          "alt": "Digital window patching machine",
          "description": ""
        },
        "en": {
          "name": "Digital window patching machine",
          "alt": "Digital window patching machine",
          "description": ""
        }
      }
    },
    {
      "id": "120",
      "sortOrder": 120,
      "isPublished": true,
      "categoryId": "Facility:post-press",
      "image": "/assets/fac-post-gluer.jpg",
      "i18n": {
        "zh": {
          "name": "High-speed universal folder-gluer",
          "alt": "High-speed universal folder-gluer",
          "description": ""
        },
        "en": {
          "name": "High-speed universal folder-gluer",
          "alt": "High-speed universal folder-gluer",
          "description": ""
        }
      }
    },
    {
      "id": "130",
      "sortOrder": 130,
      "isPublished": true,
      "categoryId": "Facility:post-press",
      "image": "/assets/fac-post-shrink.jpg",
      "i18n": {
        "zh": {
          "name": "Automatic heat shrink wrap machine",
          "alt": "Automatic heat shrink wrap machine",
          "description": ""
        },
        "en": {
          "name": "Automatic heat shrink wrap machine",
          "alt": "Automatic heat shrink wrap machine",
          "description": ""
        }
      }
    },
    {
      "id": "140",
      "sortOrder": 140,
      "isPublished": true,
      "categoryId": "Facility:quality",
      "image": "/assets/fac-qc-i1io.png",
      "i18n": {
        "zh": {
          "name": "X-Rite i1iO spectral color measurement",
          "alt": "X-Rite i1iO spectral color measurement",
          "description": ""
        },
        "en": {
          "name": "X-Rite i1iO spectral color measurement",
          "alt": "X-Rite i1iO spectral color measurement",
          "description": ""
        }
      }
    },
    {
      "id": "150",
      "sortOrder": 150,
      "isPublished": true,
      "categoryId": "Facility:quality",
      "image": "/assets/fac-qc-exact.png",
      "i18n": {
        "zh": {
          "name": "X-Rite eXact spectrophotometer",
          "alt": "X-Rite eXact spectrophotometer",
          "description": ""
        },
        "en": {
          "name": "X-Rite eXact spectrophotometer",
          "alt": "X-Rite eXact spectrophotometer",
          "description": ""
        }
      }
    },
    {
      "id": "160",
      "sortOrder": 160,
      "isPublished": true,
      "categoryId": "Facility:quality",
      "image": "/assets/fac-qc-icplate.png",
      "i18n": {
        "zh": {
          "name": "X-Rite IC Plate II dot measurement",
          "alt": "X-Rite IC Plate II dot measurement",
          "description": ""
        },
        "en": {
          "name": "X-Rite IC Plate II dot measurement",
          "alt": "X-Rite IC Plate II dot measurement",
          "description": ""
        }
      }
    },
    {
      "id": "170",
      "sortOrder": 170,
      "isPublished": true,
      "categoryId": "Facility:quality",
      "image": "/assets/fac-qc-barcode.png",
      "i18n": {
        "zh": {
          "name": "Barcode grade scanner",
          "alt": "Barcode grade scanner",
          "description": ""
        },
        "en": {
          "name": "Barcode grade scanner",
          "alt": "Barcode grade scanner",
          "description": ""
        }
      }
    },
    {
      "id": "180",
      "sortOrder": 180,
      "isPublished": true,
      "categoryId": "Facility:quality",
      "image": "/assets/fac-qc-chamber.png",
      "i18n": {
        "zh": {
          "name": "Temperature & humidity chamber",
          "alt": "Temperature & humidity chamber",
          "description": ""
        },
        "en": {
          "name": "Temperature & humidity chamber",
          "alt": "Temperature & humidity chamber",
          "description": ""
        }
      }
    },
    {
      "id": "190",
      "sortOrder": 190,
      "isPublished": true,
      "categoryId": "Facility:quality",
      "image": "/assets/fac-qc-rub.png",
      "i18n": {
        "zh": {
          "name": "Ink rub tester",
          "alt": "Ink rub tester",
          "description": ""
        },
        "en": {
          "name": "Ink rub tester",
          "alt": "Ink rub tester",
          "description": ""
        }
      }
    },
    {
      "id": "200",
      "sortOrder": 200,
      "isPublished": true,
      "categoryId": "Facility:quality",
      "image": "/assets/fac-qc-gloss.png",
      "i18n": {
        "zh": {
          "name": "Gloss meter — Elcometer 406",
          "alt": "Gloss meter — Elcometer 406",
          "description": ""
        },
        "en": {
          "name": "Gloss meter — Elcometer 406",
          "alt": "Gloss meter — Elcometer 406",
          "description": ""
        }
      }
    },
    {
      "id": "210",
      "sortOrder": 210,
      "isPublished": true,
      "categoryId": "Facility:quality",
      "image": "/assets/fac-qc-blister.png",
      "i18n": {
        "zh": {
          "name": "Blister packing strength tester",
          "alt": "Blister packing strength tester",
          "description": ""
        },
        "en": {
          "name": "Blister packing strength tester",
          "alt": "Blister packing strength tester",
          "description": ""
        }
      }
    },
    {
      "id": "220",
      "sortOrder": 220,
      "isPublished": true,
      "categoryId": "Facility:tour",
      "image": "/assets/fac-tour1.jpg",
      "i18n": {
        "zh": {
          "name": "Factory floor",
          "alt": "Factory floor",
          "description": ""
        },
        "en": {
          "name": "Factory floor",
          "alt": "Factory floor",
          "description": ""
        }
      }
    },
    {
      "id": "230",
      "sortOrder": 230,
      "isPublished": true,
      "categoryId": "Facility:tour",
      "image": "/assets/fac-tour2.jpg",
      "i18n": {
        "zh": {
          "name": "Production aisle",
          "alt": "Production aisle",
          "description": ""
        },
        "en": {
          "name": "Production aisle",
          "alt": "Production aisle",
          "description": ""
        }
      }
    },
    {
      "id": "240",
      "sortOrder": 240,
      "isPublished": true,
      "categoryId": "Facility:tour",
      "image": "/assets/fac-tour-main.jpg",
      "i18n": {
        "zh": {
          "name": "Packaging stock & logistics",
          "alt": "Packaging stock & logistics",
          "description": ""
        },
        "en": {
          "name": "Packaging stock & logistics",
          "alt": "Packaging stock & logistics",
          "description": ""
        }
      }
    }
  ],
  "vlog": [
    {
      "id": "plgjH8Jw8pE",
      "sortOrder": 10,
      "isPublished": true,
      "youtubeId": "plgjH8Jw8pE",
      "categoryId": "Vlog:sustainability",
      "thumbOverride": "",
      "isHero": true,
      "i18n": {
        "zh": {
          "title": "The Perfect Partner for Packaging Printing — NTI Printing",
          "description": "Sustainability",
          "thumbAlt": "The Perfect Partner for Packaging Printing — NTI Printing"
        },
        "en": {
          "title": "The Perfect Partner for Packaging Printing — NTI Printing",
          "description": "Sustainability",
          "thumbAlt": "The Perfect Partner for Packaging Printing — NTI Printing"
        }
      }
    },
    {
      "id": "XbpMQ6oZV88",
      "sortOrder": 20,
      "isPublished": true,
      "youtubeId": "XbpMQ6oZV88",
      "categoryId": "Vlog:sustainability",
      "thumbOverride": "",
      "isHero": false,
      "i18n": {
        "zh": {
          "title": "Nature and Sustainability",
          "description": "Sustainability",
          "thumbAlt": "Nature and Sustainability"
        },
        "en": {
          "title": "Nature and Sustainability",
          "description": "Sustainability",
          "thumbAlt": "Nature and Sustainability"
        }
      }
    },
    {
      "id": "vECuYIiFSSM",
      "sortOrder": 30,
      "isPublished": true,
      "youtubeId": "vECuYIiFSSM",
      "categoryId": "Vlog:low-carbon",
      "thumbOverride": "",
      "isHero": false,
      "i18n": {
        "zh": {
          "title": "Integrated Low-Carbon Production",
          "description": "Low-carbon production",
          "thumbAlt": "Integrated Low-Carbon Production"
        },
        "en": {
          "title": "Integrated Low-Carbon Production",
          "description": "Low-carbon production",
          "thumbAlt": "Integrated Low-Carbon Production"
        }
      }
    },
    {
      "id": "Hc_WJwWZQSo",
      "sortOrder": 40,
      "isPublished": true,
      "youtubeId": "Hc_WJwWZQSo",
      "categoryId": "Vlog:awards",
      "thumbOverride": "",
      "isHero": false,
      "i18n": {
        "zh": {
          "title": "2024 SME Benchmark Enterprise Award",
          "description": "Awards",
          "thumbAlt": "2024 SME Benchmark Enterprise Award"
        },
        "en": {
          "title": "2024 SME Benchmark Enterprise Award",
          "description": "Awards",
          "thumbAlt": "2024 SME Benchmark Enterprise Award"
        }
      }
    }
  ],
  "supplier-notice": [
    {
      "id": "10",
      "sortOrder": 10,
      "isPublished": true,
      "noticeDate": "2026-06-20",
      "categoryId": "SupplierNotice:policy",
      "attachment": "",
      "i18n": {
        "zh": {
          "title": "Updated incoming board moisture tolerance — effective August 1",
          "body": "<p>Updated incoming board moisture tolerance — effective August 1</p>"
        },
        "en": {
          "title": "Updated incoming board moisture tolerance — effective August 1",
          "body": "<p>Updated incoming board moisture tolerance — effective August 1</p>"
        }
      }
    },
    {
      "id": "20",
      "sortOrder": 20,
      "isPublished": true,
      "noticeDate": "2026-05-30",
      "categoryId": "SupplierNotice:esg",
      "attachment": "",
      "i18n": {
        "zh": {
          "title": "Carbon data request: 2026 H1 upstream footprint submission opens",
          "body": "<p>Carbon data request: 2026 H1 upstream footprint submission opens</p>"
        },
        "en": {
          "title": "Carbon data request: 2026 H1 upstream footprint submission opens",
          "body": "<p>Carbon data request: 2026 H1 upstream footprint submission opens</p>"
        }
      }
    },
    {
      "id": "30",
      "sortOrder": 30,
      "isPublished": true,
      "noticeDate": "2026-05-12",
      "categoryId": "SupplierNotice:quality",
      "attachment": "",
      "i18n": {
        "zh": {
          "title": "Revised IQC sampling plan for ink and coating deliveries",
          "body": "<p>Revised IQC sampling plan for ink and coating deliveries</p>"
        },
        "en": {
          "title": "Revised IQC sampling plan for ink and coating deliveries",
          "body": "<p>Revised IQC sampling plan for ink and coating deliveries</p>"
        }
      }
    },
    {
      "id": "40",
      "sortOrder": 40,
      "isPublished": true,
      "noticeDate": "2026-04-08",
      "categoryId": "SupplierNotice:logistics",
      "attachment": "",
      "i18n": {
        "zh": {
          "title": "New dock scheduling system goes live — booking guide inside",
          "body": "<p>New dock scheduling system goes live — booking guide inside</p>"
        },
        "en": {
          "title": "New dock scheduling system goes live — booking guide inside",
          "body": "<p>New dock scheduling system goes live — booking guide inside</p>"
        }
      }
    },
    {
      "id": "50",
      "sortOrder": 50,
      "isPublished": true,
      "noticeDate": "2026-03-15",
      "categoryId": "SupplierNotice:policy",
      "attachment": "",
      "i18n": {
        "zh": {
          "title": "Annual supplier evaluation criteria for 2026 published",
          "body": "<p>Annual supplier evaluation criteria for 2026 published</p>"
        },
        "en": {
          "title": "Annual supplier evaluation criteria for 2026 published",
          "body": "<p>Annual supplier evaluation criteria for 2026 published</p>"
        }
      }
    }
  ],
  "supplier-spec": [
    {
      "id": "10",
      "sortOrder": 10,
      "isPublished": true,
      "i18n": {
        "zh": {
          "title": "Board & Paper Specifications",
          "description": "Grammage tolerance, moisture range, FSC™ documentation and pallet requirements."
        },
        "en": {
          "title": "Board & Paper Specifications",
          "description": "Grammage tolerance, moisture range, FSC™ documentation and pallet requirements."
        }
      }
    },
    {
      "id": "20",
      "sortOrder": 20,
      "isPublished": true,
      "i18n": {
        "zh": {
          "title": "Ink & Coating Requirements",
          "description": "Low-VOC thresholds, food-contact compliance certificates and batch COA format."
        },
        "en": {
          "title": "Ink & Coating Requirements",
          "description": "Low-VOC thresholds, food-contact compliance certificates and batch COA format."
        }
      }
    },
    {
      "id": "30",
      "sortOrder": 30,
      "isPublished": true,
      "i18n": {
        "zh": {
          "title": "Delivery & Packaging Rules",
          "description": "Labeling, palletization, dock booking and lead-time commitments."
        },
        "en": {
          "title": "Delivery & Packaging Rules",
          "description": "Labeling, palletization, dock booking and lead-time commitments."
        }
      }
    },
    {
      "id": "40",
      "sortOrder": 40,
      "isPublished": true,
      "i18n": {
        "zh": {
          "title": "ESG Data Reporting",
          "description": "Upstream carbon data format and submission schedule for supply partners."
        },
        "en": {
          "title": "ESG Data Reporting",
          "description": "Upstream carbon data format and submission schedule for supply partners."
        }
      }
    }
  ]
} as unknown as Record<string, Row[]>
