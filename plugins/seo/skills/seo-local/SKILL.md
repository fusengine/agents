---
name: seo-local
description: Use when optimizing local SEO. Covers Google Business Profile, NAP consistency, citations, reviews acquisition, Local Pack ranking, location pages, LocalBusiness schema.
user-invocable: false
related-skills: seo, seo-schema, seo-content
---

# Local SEO

## Workflow

1. Audit Google Business Profile (categories, hours, photos, posts, services)
2. Check NAP consistency across web (citations: Yelp, Bing, Apple Maps, industry directories)
3. Analyze reviews (volume, recency, response rate, sentiment)
4. Map ranking in Local Pack for target keywords + geo
5. Optimize location pages (one per service area, LocalBusiness schema)

## NAP Consistency

Must be **character-for-character identical** on the site, GBP, and every directory:
```
[Business Name]
[Street Number] [Street], [Suite]
[City], [Region] [Postal Code]
[+CC Phone]
```
- Abbreviations must match too: `Route` ≠ `Rte`, `Suite` ≠ `Ste`. One variation fractures the entity.

## GBP as an Entity Signal (2026)

- GBP is no longer just a local directory — AI engines cross-reference it as an **entity anchor**. ~42% of local AI citations originate from listings.
- A **complete** profile = ~2.7x more likely to rank in the Local Pack. Fill categories, hours, photos, posts, services.
- **Service areas = named cities / postal codes only (max ~20)**. Country- or state-wide service areas are no longer allowed (Google change, June 2025).

## Quality Gates

- **Warning** at 30+ location pages
- **Hard stop** at 50+ location pages (manual audit required)
- Each location page must have **unique content** (not template fill-in)

## LocalBusiness Schema (GEO-priority)

AI engines (ChatGPT, Perplexity, Gemini) parse LocalBusiness JSON-LD to answer "best [service] near me". Precise `geo` + `areaServed` = better entity resolution in local AI Overviews.

```json
{
  "@context": "https://schema.org",
  "@type": "[SpecificType]",
  "name": "[Business Name]",
  "address": { "@type": "PostalAddress", "streetAddress": "[Street]",
    "addressLocality": "[City]", "addressRegion": "[Region]",
    "postalCode": "[Postal Code]", "addressCountry": "[CC]" },
  "geo": { "@type": "GeoCoordinates", "latitude": "[lat]", "longitude": "[lng]" },
  "areaServed": { "@type": "GeoCircle",
    "geoMidpoint": { "@type": "GeoCoordinates", "latitude": "[lat]", "longitude": "[lng]" },
    "geoRadius": "[meters]" },
  "sameAs": ["[GBP URL]", "[directory URL]", "[social URL]"],
  "openingHoursSpecification": [{ "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday"], "opens": "[HH:MM]", "closes": "[HH:MM]" }],
  "aggregateRating": { "@type": "AggregateRating",
    "ratingValue": "[x.x]", "reviewCount": "[n]" }
}
```

- `@type`: use the **specific** subtype (`Plumber`, `Dentist`, `Restaurant`…), not generic `LocalBusiness` — better category matching.
- `geo` (GeoCoordinates): disambiguates the entity; coordinates must match the GBP pin and Apple Maps.
- `areaServed` as `GeoCircle` (geoMidpoint + geoRadius): drives "near me" matching for LLMs.
- `sameAs` array (GBP + directories + socials): confirms existence across authoritative sources.
- LLMs **do cite local businesses** when schema + GBP + reviews are solid.

## References

- `seo-schema` — LocalBusiness JSON-LD (`templates/json-ld/localbusiness.json`)
- `seo-entity` — declare the business entity via sameAs (Wikidata, GBP)
- `skills/seo/10-local-seo/` (gbp, nap-citations, reviews, local-pack, landing-pages, local-backlinks)
