---
name: seo-page
description: Use when analyzing a single URL or local file via /seo page — meta, schema, headers, GEO readiness.
user-invocable: false
related-skills: seo, seo-schema, seo-content, seo-geo
---

<objective>
Runs a single-page SEO analysis: fetches the page (URL or local file), extracts meta/OG/Twitter/canonical (`scripts/parse-meta.ts`), validates JSON-LD (`scripts/validate-schema.ts`), analyzes H1-H6 hierarchy, and scores LLM-readiness (`scripts/geo-score.ts`). Checklist covers title length/keyword, meta description length, single-H1 rule, heading hierarchy, canonical correctness, Open Graph/Twitter Card completeness, schema presence, and image alt/lazy/format compliance. For a full-site audit spanning multiple pages, use seo-audit instead.
</objective>

# Single-Page SEO Analysis

## Workflow

1. Fetch page (URL via WebFetch, or read local file)
2. Run `scripts/parse-meta.ts <input>` → extract title, description, OG, Twitter, canonical
3. Run `scripts/validate-schema.ts <input>` → JSON-LD validation
4. Analyze H1-H6 hierarchy
5. Run `scripts/geo-score.ts <input>` → LLM-readiness score
6. Output structured report

## Checks

| Element | Rule |
|---------|------|
| `<title>` | 50-60 chars, primary keyword, brand |
| `<meta description>` | 120-155 chars, hook + benefit + CTA |
| `<h1>` | Exactly one, contains primary keyword |
| `<h2>-<h6>` | Hierarchical, no skip |
| Canonical | Self-referencing or pointing to authoritative URL |
| Open Graph | og:title, og:description, og:image (1200x630), og:url |
| Twitter Cards | summary_large_image with og:image |
| Schema | At least one JSON-LD block, validates against schema.org |
| Images | All have alt, lazy-loaded, WebP/AVIF |

## References

- `skills/seo/02-onpage-seo/` (meta-tags, open-graph, twitter-cards, headers, alt-text)
- `skills/seo/09-checklists/pre-publication.md`
