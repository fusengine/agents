---
name: seo-ecommerce
description: Use when optimizing e-commerce SEO — product/category pages, faceted navigation, marketplace listings.
user-invocable: false
related-skills: seo, seo-schema, seo-content, seo-images
---

<objective>
Covers e-commerce-specific SEO: Product schema (offers/aggregateRating/review/brand) plus BreadcrumbList on product pages, category page structure (intro copy, H1, pagination canonicals), faceted-navigation indexing rules by filter-combo count, out-of-stock handling (keep the page, set availability, link to alternatives), internal search page blocking/optimization, and marketplace-specific tactics (Amazon A+ Content, Etsy tags, eBay item specifics). Schema templates live in `templates/json-ld/`.
</objective>

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
