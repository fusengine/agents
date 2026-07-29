---
name: seo-schema
description: Use when detecting, validating, or generating Schema.org JSON-LD markup for any page type.
user-invocable: false
related-skills: seo, seo-local, seo-ecommerce, seo-video
---

<objective>
Detects existing JSON-LD blocks, validates them offline against schema.org dumps (`scripts/validate-schema.ts`), and generates missing schema from templates (`templates/json-ld/`) for nine supported types: Article, Product, LocalBusiness, Organization, BreadcrumbList, FAQPage, VideoObject, Event, Recipe. Tracks 2025 deprecations (HowTo removed September 2023, FAQPage restricted to gov/health sites since August 2023, SpecialAnnouncement removed July 2025). For type-specific deep coverage, see seo-local (LocalBusiness), seo-ecommerce (Product), seo-video (VideoObject).
</objective>

# Schema.org JSON-LD

## Workflow

1. Detect existing JSON-LD blocks in HTML
2. Run `scripts/validate-schema.ts` → check against schema.org offline dumps
3. Identify missing schema types based on page type
4. Generate from templates in `templates/json-ld/`

## Supported Types

| Type | Use Case | Template |
|------|----------|----------|
| Article | Blog posts, news | `templates/json-ld/article.json` |
| Product | E-commerce | `templates/json-ld/product.json` |
| LocalBusiness | Local SEO | `templates/json-ld/localbusiness.json` |
| Organization | Brand/company pages | `templates/json-ld/organization.json` |
| BreadcrumbList | Navigation | `templates/json-ld/breadcrumb.json` |
| FAQPage | Q&A (gov/health only since Aug 2023) | `templates/json-ld/faq.json` |
| VideoObject | Video content | `templates/json-ld/video.json` |
| Event | Events | `templates/json-ld/event.json` |
| Recipe | Recipes | `templates/json-ld/recipe.json` |

## Deprecations (2025)

- **HowTo**: Deprecated September 2023
- **FAQ**: Restricted to government/health sites since August 2023
- **SpecialAnnouncement**: Deprecated July 2025

## References

- `skills/seo/03-schema-org/` (all 9 schema docs)
