# Local Business Schema

**JSON-LD for local businesses (critical for local SEO 2026).**

## Why LocalBusiness Schema Matters

- **Google Maps**: Enhanced map listing
- **Local Pack**: "Near me" search results
- **Hours/Contact**: Displayed in SERP
- **Reviews**: Star ratings in search

---

## Complete LocalBusiness Schema

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "AgencySEO Paris",
  "image": "https://example.com/images/office.jpg",
  "telephone": "+33-1-23-45-67-89",
  "email": "contact@example.com",
  "url": "https://example.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Rue de la Paix",
    "addressLocality": "Paris",
    "addressRegion": "Île-de-France",
    "postalCode": "75001",
    "addressCountry": "FR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 48.8566,
    "longitude": 2.3522
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  ],
  "priceRange": "€€",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "127"
  }
}
```
