# Product Schema (E-commerce)

**JSON-LD structured data for product pages (critical for e-commerce SEO 2026).**

## Why Product Schema Matters

- **Rich Snippets**: Price, availability, reviews in SERP
- **Google Shopping**: Product feed eligibility
- **Conversion**: Higher CTR with rich results
- **AI/GEO**: LLMs extract product data

---

## Basic Product Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "SEO Pro Tool - Professional SEO Suite",
  "image": "https://example.com/images/seo-pro-tool.jpg",
  "description": "All-in-one SEO platform. Keyword tracking, backlink analysis, competitor research. Trusted by 10K+ agencies.",
  "brand": {
    "@type": "Brand",
    "name": "AgencySEO"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/products/seo-pro-tool",
    "priceCurrency": "EUR",
    "price": "99.00",
    "priceValidUntil": "2026-12-31",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "AgencySEO"
    }
  }
}
```

---

## Complete Product with Reviews

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "SEO Pro Tool",
  "image": [
    "https://example.com/images/product-1.jpg",
    "https://example.com/images/product-2.jpg"
  ],
  "description": "Professional SEO suite with keyword tracking, backlink analysis, and competitor research.",
  "sku": "SEO-PRO-001",
  "mpn": "925872",
  "brand": {
    "@type": "Brand",
    "name": "AgencySEO"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/products/seo-pro-tool",
    "priceCurrency": "EUR",
    "price": "99.00",
    "priceValidUntil": "2026-12-31",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "1250"
  },
  "review": {
    "@type": "Review",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "5",
      "bestRating": "5"
    },
    "author": {
      "@type": "Person",
      "name": "Marie Dubois"
    },
    "datePublished": "2026-01-10",
    "reviewBody": "Best SEO tool I've used. Keyword tracking is accurate and interface is intuitive."
  }
}
```

---

## Availability Values

```json
"availability": "https://schema.org/InStock"
"availability": "https://schema.org/OutOfStock"
"availability": "https://schema.org/PreOrder"
"availability": "https://schema.org/LimitedAvailability"
```
