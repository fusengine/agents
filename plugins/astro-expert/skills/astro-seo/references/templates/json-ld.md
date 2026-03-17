---
name: json-ld-templates
description: Ready-to-use JSON-LD schema templates for BlogPosting, WebSite, Organization, FAQ
type: template
---

# JSON-LD Schema Templates

## BlogPosting Schema

```astro
---
// src/components/BlogPostSchema.astro
interface Props {
  title: string;
  description: string;
  image: string;
  pubDate: Date;
  author: string;
  slug: string;
}
const { title, description, image, pubDate, author, slug } = Astro.props;

const schema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": title,
  "description": description,
  "image": new URL(image, Astro.site).href,
  "author": { "@type": "Person", "name": author },
  "datePublished": pubDate.toISOString(),
  "publisher": {
    "@type": "Organization",
    "name": "My Site",
    "logo": { "@type": "ImageObject", "url": new URL('/logo.png', Astro.site).href },
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": new URL(`/blog/${slug}`, Astro.site).href,
  },
};
---
<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

## Organization Schema

```astro
---
const schema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "My Company",
  "url": Astro.site?.toString(),
  "logo": new URL('/logo.png', Astro.site).href,
  "sameAs": [
    "https://twitter.com/mycompany",
    "https://github.com/mycompany",
  ],
};
---
<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

## FAQ Schema

```astro
---
interface Props {
  faqs: Array<{ question: string; answer: string }>;
}
const { faqs } = Astro.props;

const schema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(({ question, answer }) => ({
    "@type": "Question",
    "name": question,
    "acceptedAnswer": { "@type": "Answer", "text": answer },
  })),
};
---
<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

## BreadcrumbList Schema

```astro
---
interface Props {
  items: Array<{ name: string; path: string }>;
}
const { items } = Astro.props;

const schema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map(({ name, path }, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "name": name,
    "item": new URL(path, Astro.site).href,
  })),
};
---
<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```
