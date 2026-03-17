---
name: canonical-hreflang
description: Canonical URLs and hreflang tags for international SEO in Astro
when-to-use: Multilingual sites, duplicate content prevention
keywords: canonical, hreflang, i18n, international SEO, x-default
priority: medium
related: meta-tags.md
---

# Canonical URLs & hreflang

## When to Use

- Prevent duplicate content penalties with canonical tags
- Multi-language sites need hreflang for locale signals
- Paginated content needs canonical to first page

## Canonical URL Construction

```astro
---
// Always use Astro.site — never hardcode domain
const canonical = new URL(Astro.url.pathname, Astro.site);
---
<link rel="canonical" href={canonical} />
```

## hreflang for Multilingual Sites

```astro
---
interface Props {
  locales: Array<{ lang: string; url: string }>;
}
const { locales } = Astro.props;
---
<!-- Add to <head> -->
{locales.map(({ lang, url }) => (
  <link rel="alternate" hreflang={lang} href={url} />
))}
<!-- x-default points to default/language-selector page -->
<link rel="alternate" hreflang="x-default" href={new URL('/', Astro.site)} />
```

## Usage in Layout

```astro
---
// In page file
const locales = [
  { lang: 'en', url: new URL('/en/about', Astro.site).href },
  { lang: 'fr', url: new URL('/fr/about', Astro.site).href },
  { lang: 'es', url: new URL('/es/about', Astro.site).href },
];
---
<Layout {locales}>
  <!-- content -->
</Layout>
```

## Paginated Content Canonical

For paginated blog (/blog, /blog/2, /blog/3):

```astro
---
const { page } = Astro.props;
// Point all pages to first page as canonical
const canonical = new URL('/blog', Astro.site);
---
<link rel="canonical" href={canonical} />
{page.url.prev && <link rel="prev" href={new URL(page.url.prev, Astro.site)} />}
{page.url.next && <link rel="next" href={new URL(page.url.next, Astro.site)} />}
```

## Key Rules

| Rule | Reason |
|------|--------|
| Always absolute URLs in hreflang | Relative URLs are invalid |
| Include x-default | Required for international SEO |
| Self-referencing hreflang | Each locale must include itself |
| Match canonical across locales | Prevents cross-language duplication |
