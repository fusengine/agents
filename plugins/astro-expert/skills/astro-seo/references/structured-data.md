---
name: structured-data
description: JSON-LD structured data and schema.org markup for rich snippets in Astro
when-to-use: Blog posts, products, organizations, breadcrumbs, FAQ pages
keywords: JSON-LD, schema.org, structured data, rich snippets, BlogPosting
priority: medium
requires: meta-tags.md
---

# JSON-LD Structured Data

## When to Use

- Blog posts need `BlogPosting` schema for rich snippets
- Organizations need `Organization` + `WebSite` schema
- Product pages need `Product` schema
- FAQ sections need `FAQPage` schema

## Critical: Use `set:html` Not Template Strings

```astro
<!-- CORRECT — prevents XSS -->
<script type="application/ld+json" set:html={JSON.stringify(schema)} />

<!-- WRONG — XSS vulnerability -->
<script type="application/ld+json">{JSON.stringify(schema)}</script>
```

## WebSite Schema (in layout)

```astro
---
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "My Site",
  "url": Astro.site?.toString(),
  "description": "Site description",
};
---
<script type="application/ld+json" set:html={JSON.stringify(websiteSchema)} />
```

## BlogPosting Schema

```astro
---
const { post } = Astro.props;
const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.data.title,
  "description": post.data.description,
  "image": new URL(post.data.image, Astro.site).href,
  "author": {
    "@type": "Person",
    "name": post.data.author,
  },
  "datePublished": post.data.pubDate.toISOString(),
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": new URL(Astro.url.pathname, Astro.site).href,
  },
};
---
<script type="application/ld+json" set:html={JSON.stringify(blogSchema)} />
```

## BreadcrumbList Schema

```astro
---
const breadcrumbs = [
  { name: "Home", url: Astro.site?.toString() },
  { name: "Blog", url: new URL('/blog', Astro.site).href },
  { name: post.data.title, url: new URL(Astro.url.pathname, Astro.site).href },
];
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((item, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "name": item.name,
    "item": item.url,
  })),
};
---
<script type="application/ld+json" set:html={JSON.stringify(breadcrumbSchema)} />
```
