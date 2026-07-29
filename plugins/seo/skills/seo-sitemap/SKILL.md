---
name: seo-sitemap
description: Use when analyzing or generating XML sitemaps and robots.txt. Not for redirect analysis (seo-redirects).
user-invocable: false
related-skills: seo, seo-technical, seo-redirects
---

<objective>
Fetches and validates `/sitemap.xml` (or sitemap index) via `scripts/parse-sitemap.ts`, cross-checks URL coverage against crawled pages to detect orphan URLs (in sitemap but not linked) and missing URLs (linked but not in sitemap), and covers the special sitemap types — sitemap-news.xml for publishers (last-48h articles only), sitemap-image.xml, sitemap-video.xml — plus best practices (50,000 URL / 50 MB cap per sitemap, real `<lastmod>` file dates, HTTPS absolute URLs, robots.txt sitemap reference). Templates in `templates/sitemap/` and `templates/robots/`.
</objective>

# Sitemap

## Workflow

1. Fetch `/sitemap.xml` (or sitemap index)
2. Run `scripts/parse-sitemap.ts` → validate structure
3. Cross-check URL coverage vs crawled pages
4. Detect orphan URLs (in sitemap but not linked)
5. Detect missing URLs (linked but not in sitemap)

## Best Practices

- Max 50,000 URLs or 50 MB per sitemap (use index if larger)
- `<lastmod>` actual file modification date (not generation date)
- `<priority>` and `<changefreq>` largely ignored by Google
- HTTPS only, absolute URLs
- Reference in `robots.txt`: `Sitemap: https://example.com/sitemap.xml`

## Special Sitemaps

- **News** (publishers): `sitemap-news.xml`, only articles from last 48h
- **Image**: `sitemap-image.xml` with `<image:image>` tags
- **Video**: `sitemap-video.xml` with `<video:video>` tags

## Templates

- `templates/sitemap/sitemap.xml`
- `templates/sitemap/sitemap-news.xml`
- `templates/sitemap/sitemap-image.xml`
- `templates/robots/robots-saas.txt`
- `templates/robots/robots-ecommerce.txt`
