---
name: seo-technical
description: Use when auditing technical SEO — robots.txt, sitemap.xml, Core Web Vitals, crawlability, indexability.
user-invocable: false
related-skills: seo, seo-sitemap, seo-redirects, seo-hreflang
---

<objective>
Runs a technical SEO audit: fetches and validates robots.txt (`scripts/parse-robots.ts`) and sitemap.xml (`scripts/parse-sitemap.ts`), measures Core Web Vitals via a local Lighthouse wrapper (`scripts/check-cwv.ts` — LCP <2.5s, INP <200ms, CLS <0.1), verifies mobile-first signals, and checks HTTPS/HSTS/redirect chains plus indexability (robots.txt not blocking critical paths, no stray `noindex`, canonical pointing to an indexable URL, no `nofollow` on internal navigation). Does not cover content quality (seo-content), schema (seo-schema), or local-specific signals (seo-local).
</objective>

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
