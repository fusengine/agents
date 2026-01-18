# Article Schema (BlogPosting, NewsArticle)

**JSON-LD structured data for blog posts and news articles (Schema.org 16.0).**

## Why Article Schema Matters

- **Google Rich Results**: Enhanced SERP appearance
- **E-E-A-T Signals**: Author, publisher, dates
- **AI/GEO**: LLMs extract structured data
- **Featured Snippets**: Higher eligibility

---

## Basic Article Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "SEO Guide 2026: 47 Proven Techniques",
  "description": "Discover 2026 SEO best practices including E-E-A-T compliance, Core Web Vitals optimization, and AI search strategies.",
  "image": "https://example.com/images/seo-guide-featured.jpg",
  "author": {
    "@type": "Person",
    "name": "Jean Dupont",
    "url": "https://example.com/author/jean-dupont"
  },
  "publisher": {
    "@type": "Organization",
    "name": "AgencySEO",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.jpg"
    }
  },
  "datePublished": "2026-01-15T09:00:00+00:00",
  "dateModified": "2026-01-18T14:30:00+00:00"
}
```

---

## Complete Article Schema (Recommended 2026)

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Optimize Core Web Vitals in 2026",
  "alternativeHeadline": "Complete Guide to LCP, INP, and CLS Optimization",
  "description": "Learn how to improve Core Web Vitals in 2026. Includes 15 actionable techniques tested on 1000+ websites with proven results.",
  "image": [
    "https://example.com/images/cwv-featured-1x1.jpg",
    "https://example.com/images/cwv-featured-4x3.jpg",
    "https://example.com/images/cwv-featured-16x9.jpg"
  ],
  "author": {
    "@type": "Person",
    "name": "Jean Dupont",
    "url": "https://example.com/author/jean-dupont",
    "jobTitle": "Senior SEO Consultant",
    "worksFor": {
      "@type": "Organization",
      "name": "AgencySEO"
    }
  },
  "publisher": {
    "@type": "Organization",
    "name": "AgencySEO",
    "url": "https://example.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.jpg",
      "width": 600,
      "height": 60
    }
  },
  "datePublished": "2026-01-15T09:00:00+00:00",
  "dateModified": "2026-01-18T14:30:00+00:00",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://example.com/blog/core-web-vitals-2026"
  },
  "articleSection": "Technical SEO",
  "keywords": "Core Web Vitals, LCP, INP, CLS, page speed, SEO 2026",
  "wordCount": 2500,
  "timeRequired": "PT12M",
  "inLanguage": "fr-FR"
}
```

---

## Article @type Variations

| @type | Use Case |
|-------|----------|
| **Article** | General articles, guides |
| **BlogPosting** | Blog posts (most common) |
| **NewsArticle** | News content (<48h old) |
| **TechArticle** | Technical documentation |
| **ScholarlyArticle** | Academic research |

```json
{"@type": "BlogPosting"} // Most blog posts
{"@type": "NewsArticle"} // News sites only
{"@type": "TechArticle"} // Technical docs
```

---

## Required Properties

| Property | Required | Description |
|----------|----------|-------------|
| `headline` | **YES** | Article title (110 chars max) |
| `image` | **YES** | Featured image (1200x630px min) |
| `author` | **YES** | Author Person or Organization |
| `publisher` | **YES** | Publisher Organization with logo |
| `datePublished` | **YES** | ISO 8601 format |

---

## Image Requirements

```json
"image": [
  "https://example.com/images/article-1x1.jpg",   // 1:1 ratio (min 1200x1200)
  "https://example.com/images/article-4x3.jpg",   // 4:3 ratio (min 1200x900)
  "https://example.com/images/article-16x9.jpg"   // 16:9 ratio (min 1200x675)
]
```

**Best Practice**: Provide 3 aspect ratios for better Google compatibility.

---

## Author Schema (E-E-A-T Critical)

```json
"author": {
  "@type": "Person",
  "name": "Jean Dupont",
  "url": "https://example.com/author/jean-dupont",
  "image": "https://example.com/images/author-jean.jpg",
  "jobTitle": "Senior SEO Consultant",
  "worksFor": {
    "@type": "Organization",
    "name": "AgencySEO"
  },
  "sameAs": [
    "https://twitter.com/jeandupont",
    "https://linkedin.com/in/jeandupont"
  ]
}
```

---

## Testing

```bash
# Google Rich Results Test
https://search.google.com/test/rich-results

# Schema Markup Validator
https://validator.schema.org/
```

