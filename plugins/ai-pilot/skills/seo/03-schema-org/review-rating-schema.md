# Review & Rating Schema

**JSON-LD for product/service reviews (trust signals).**

## Review Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Review",
  "itemReviewed": {
    "@type": "Product",
    "name": "SEO Pro Tool"
  },
  "author": {
    "@type": "Person",
    "name": "Marie Dubois"
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "5",
    "bestRating": "5",
    "worstRating": "1"
  },
  "datePublished": "2026-01-10",
  "reviewBody": "Best SEO tool I've used. Keyword tracking is accurate and interface is intuitive. Worth every euro.",
  "publisher": {
    "@type": "Organization",
    "name": "TrustPilot"
  }
}
```

## AggregateRating Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "SEO Pro Tool",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "1250",
    "bestRating": "5",
    "worstRating": "1"
  }
}
```
