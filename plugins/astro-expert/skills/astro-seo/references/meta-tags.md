---
name: meta-tags
description: Meta tags, Open Graph, Twitter Cards, and favicon configuration for Astro
when-to-use: Any page needing SEO metadata or social sharing previews
keywords: meta, og:title, og:image, twitter:card, favicon, description
priority: high
requires: astro-6.md
related: structured-data.md, canonical-hreflang.md
---

# Meta Tags & Open Graph

## When to Use

- Every page needs title, description, and OG tags
- Social sharing requires og:title, og:image, og:description
- Twitter Cards need twitter:card and twitter:image

## Head Component Pattern

Create a reusable `src/components/SEO.astro`:

```astro
---
interface Props {
  title: string;
  description: string;
  image?: string;
  noindex?: boolean;
}
const { title, description, image, noindex = false } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site);
const ogImage = image
  ? new URL(image, Astro.site)
  : new URL('/og-default.png', Astro.site);
---
<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonical} />
{noindex && <meta name="robots" content="noindex,nofollow" />}

<!-- Open Graph -->
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonical} />
<meta property="og:image" content={ogImage} />
<meta property="og:type" content="website" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImage} />

<!-- Favicon -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

## Key Rules

| Rule | Reason |
|------|--------|
| Always use `Astro.site` for absolute URLs | OG images must be absolute |
| `og:image` recommended size: 1200x630 | Optimal for all platforms |
| `twitter:card: summary_large_image` | Shows large image preview |
| Set `noindex` on admin/private pages | Prevent unwanted indexing |

## Title Template Pattern

```astro
---
const { title, siteName = 'My Site' } = Astro.props;
const fullTitle = title ? `${title} | ${siteName}` : siteName;
---
<title>{fullTitle}</title>
```
