---
name: seo-head-template
description: Complete reusable SEO Head component for Astro with OG, Twitter, JSON-LD
type: template
---

# SEO Head Component Template

## src/components/SEO.astro

```astro
---
interface Props {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
  pubDate?: Date;
  noindex?: boolean;
}

const {
  title,
  description,
  image = '/og-default.png',
  type = 'website',
  pubDate,
  noindex = false,
} = Astro.props;

const siteName = 'My Site';
const fullTitle = `${title} | ${siteName}`;
const canonical = new URL(Astro.url.pathname, Astro.site);
const ogImage = new URL(image, Astro.site);

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": siteName,
  "url": Astro.site?.toString(),
};
---

<!-- Primary -->
<title>{fullTitle}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonical} />
{noindex && <meta name="robots" content="noindex,nofollow" />}

<!-- Open Graph -->
<meta property="og:site_name" content={siteName} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonical} />
<meta property="og:image" content={ogImage} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:type" content={type} />
{type === 'article' && pubDate && (
  <meta property="article:published_time" content={pubDate.toISOString()} />
)}

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImage} />

<!-- Favicon -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="/manifest.json" />

<!-- Sitemap -->
<link rel="sitemap" href="/sitemap-index.xml" />

<!-- Structured Data -->
<script type="application/ld+json" set:html={JSON.stringify(websiteSchema)} />
```

## Usage in Layout

```astro
---
// src/layouts/Layout.astro
import SEO from '../components/SEO.astro';

interface Props {
  title: string;
  description: string;
  image?: string;
}
const { title, description, image } = Astro.props;
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <SEO {title} {description} {image} />
  </head>
  <body>
    <slot />
  </body>
</html>
```
