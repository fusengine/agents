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

## NAP Format

Must be **byte-identical** everywhere:
```
ACME Corp
123 Main St, Suite 4
Springfield, IL 62701
+1-555-123-4567
```

## Quality Gates

- **Warning** at 30+ location pages
- **Hard stop** at 50+ location pages (manual audit required)
- Each location page must have **unique content** (not template fill-in)

## Local Schema

`templates/json-ld/localbusiness.json` includes:
- `@type`: LocalBusiness (or specific subtype)
- `address` (PostalAddress)
- `geo` (lat/lng)
- `openingHoursSpecification`
- `aggregateRating`
- `priceRange`

## References

- `skills/seo/10-local-seo/` (gbp, nap-citations, reviews, local-pack, landing-pages, local-backlinks)
