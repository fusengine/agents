---
name: seo-redirects
description: Use when planning redirects or a site migration — status codes, link equity, redirect chains.
user-invocable: false
related-skills: seo, seo-technical, seo-sitemap
---

<objective>
Covers redirect and migration planning: the 301/302/307/308 status-code decision table and their SEO/link-equity impact, the full migration checklist (URL mapping CSV, implementing 301s, staging tests, updating internal links and sitemap, Search Console Change of Address, 90-day 404 monitoring), redirect-chain and redirect-loop detection and fixes, common redirect patterns (HTTP→HTTPS, www/non-www, trailing slash, slug changes), and anti-patterns (mass redirect-to-homepage, soft 404s, JS-based redirects, meta-refresh redirects).
</objective>

# Redirects & Migrations

## Status Codes

| Code | Use Case | SEO Impact |
|------|----------|------------|
| 301 | Permanent move | Passes ~99% link equity |
| 302 | Temporary (e.g. A/B test) | Does NOT pass equity long-term |
| 307 | Temporary, preserves HTTP method | Same as 302 for SEO |
| 308 | Permanent, preserves HTTP method | Same as 301 for SEO |

## Migration Plan

1. **Map old URLs → new URLs** (CSV: source, target, status)
2. **Implement 301s** for every old URL
3. **Test in staging** with `curl -I <old-url>` → expect `301 Location: <new>`
4. **Update internal links** to point directly to new URLs (avoid chain)
5. **Update sitemap.xml** with new URLs only
6. **Submit to Google Search Console** via Change of Address tool (if domain change)
7. **Monitor 404s** for 90 days post-launch

## Chain Detection

- **Chain**: A → B → C (loses ~10% equity per hop)
- **Loop**: A → B → A (infinite, broken)
- Fix: A → C directly

## Common Redirects

| From | To | Status |
|------|-----|--------|
| `http://` | `https://` | 301 |
| `www.` | `non-www` (or reverse, pick one) | 301 |
| `/page/` | `/page` (or reverse) | 301 |
| Old slug | New slug | 301 |

## Anti-Patterns

- ❌ Redirecting everything to homepage (mass 404 → 301 to /) → looks spammy
- ❌ Soft 404s (200 status on missing pages)
- ❌ JS-based redirects (Google may not follow)
- ❌ Meta refresh redirects > 0s (use server-side)
