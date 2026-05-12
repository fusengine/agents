---
name: seo-hreflang
description: Use when auditing or generating hreflang for i18n SEO. Covers HTML link tags, HTTP headers, XML sitemap hreflang, self-referencing, return tags, x-default, ISO 639-1 + ISO 3166-1 code validation.
user-invocable: false
related-skills: seo, seo-technical, seo-sitemap
---

# Hreflang / i18n SEO

## Workflow

1. Detect hreflang tags (HTML `<link>`, HTTP header, or XML sitemap)
2. Run `scripts/parse-hreflang.ts` → validate
3. Check self-referencing, return tags, x-default
4. Verify language/region codes (ISO 639-1 + ISO 3166-1)

## Common Mistakes

- ❌ Missing self-reference (`<link rel="alternate" hreflang="fr" href="/fr/">` from `/fr/`)
- ❌ Missing return tags (A → B but not B → A)
- ❌ Invalid codes (`en-UK` instead of `en-GB`)
- ❌ HTTP/HTTPS mismatch between alternates
- ❌ Mixing trailing slashes

## Implementation Options

1. **HTML head**: `<link rel="alternate" hreflang="fr-FR" href="https://example.com/fr/">`
2. **HTTP Header**: `Link: <https://example.com/fr/>; rel="alternate"; hreflang="fr-FR"`
3. **XML Sitemap**: `<xhtml:link rel="alternate" hreflang="fr-FR" href="https://example.com/fr/"/>`

## x-default

Required for international landing/locale selector pages:
```html
<link rel="alternate" hreflang="x-default" href="https://example.com/">
```
