---
name: seo-ecommerce
description: Use when optimizing e-commerce SEO. Covers product schema with AggregateRating, faceted navigation rules, category page intro, out-of-stock handling, internal search, marketplace SEO (Amazon, Etsy, eBay).
user-invocable: false
related-skills: seo, seo-schema, seo-content, seo-images
---

# E-commerce SEO

## Product Pages

- `Product` schema with `offers`, `aggregateRating`, `review`, `brand`
- `BreadcrumbList` schema
- Unique meta title/description per product
- Canonical to self (not category)
- Reviews above the fold (with schema)
- Out-of-stock: keep page, set `availability: OutOfStock`, link to alternatives

## Category Pages

- Intro paragraph 150-300 words (above products)
- H1 with category keyword
- Pagination: `rel="canonical"` on each paginated page (Google deprecated rel=next/prev)
- Filter URLs: see Faceted Navigation below

## Faceted Navigation Rules

| Filter combo | Action |
|--------------|--------|
| 1-2 filters (popular) | Index, unique meta, custom canonical |
| 3+ filters | `noindex, follow` |
| Sort params (?sort=) | Canonical to clean URL |
| Pagination | Canonical to self, no noindex |

## Internal Search

- Block `/search?q=*` in robots.txt (avoid index bloat)
- But optimize top searched terms as static pages

## Schema Templates

- `templates/json-ld/product.json`
- `templates/json-ld/breadcrumb.json`

## Marketplaces

- Amazon: A+ Content, backend keywords
- Etsy: tags, attributes, video listings
- eBay: item specifics, gallery photos
