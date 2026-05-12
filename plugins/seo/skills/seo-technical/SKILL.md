---
name: seo-technical
description: Use when auditing technical SEO. Covers robots.txt, sitemap.xml, Core Web Vitals (LCP/INP/CLS), mobile-first indexing, crawlability, indexability, HTTPS, redirects chains.
user-invocable: false
related-skills: seo, seo-sitemap, seo-redirects, seo-hreflang
---

# Technical SEO

## Workflow

1. Fetch `/robots.txt` → `scripts/parse-robots.ts`
2. Fetch `/sitemap.xml` → `scripts/parse-sitemap.ts`
3. Run Lighthouse locally → `scripts/check-cwv.ts <url>`
4. Verify mobile-first signals (viewport, responsive images)
5. Check HTTPS, HSTS, redirects chains

## Core Web Vitals (2026)

- **LCP**: < 2.5s
- **INP**: < 200ms (replaced FID March 2024)
- **CLS**: < 0.1

## Indexability Checks

- `robots.txt` doesn't block critical paths
- `<meta name="robots">` not `noindex` on important pages
- Canonical points to indexable URL
- No `nofollow` on internal navigation

## References

- `skills/seo/05-technical-seo/` (core-web-vitals, crawlability, mobile-first, structured-data-testing)
