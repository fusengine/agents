---
name: crawlability
description: Crawlability and indexation guide
---

# Crawlability & Indexation

**Ensuring search engines can discover and index content.**

## Robots.txt

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/

Sitemap: https://example.com/sitemap.xml
```

---

## Sitemap.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/page</loc>
    <lastmod>2026-01-18</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

Submit to: Google Search Console, Bing Webmaster Tools

---

## Internal Linking

```markdown
- 3-5 internal links per 1000 words
- Descriptive anchor text
- Logical hierarchy (max 3 clicks from homepage)
```

---

## Canonical Tags

```html
<link rel="canonical" href="https://example.com/preferred-url">
```

Avoid duplicate content issues.
