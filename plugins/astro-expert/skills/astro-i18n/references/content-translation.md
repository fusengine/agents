# Content Translation with Astro i18n

## Overview

Organize translated content using Content Collections with locale-specific directories or a locale field in frontmatter.

## Approach 1: Locale Directories

```text
src/content/
└── blog/
    ├── en/
    │   ├── getting-started.mdx
    │   └── tutorial.mdx
    ├── fr/
    │   ├── getting-started.mdx
    │   └── tutorial.mdx
    └── es/
        └── getting-started.mdx
```

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    locale: z.enum(['en', 'fr', 'es']).optional()
  })
});

export const collections = { blog };
```

## Fetching Locale-Specific Content

```astro
---
// src/pages/[locale]/blog/index.astro
import { getCollection } from 'astro:content';

const { locale } = Astro.params;

// Filter posts by locale directory
const posts = await getCollection('blog', (entry) =>
  entry.id.startsWith(`${locale}/`)
);
---
```

## Approach 2: Translation Dictionary

For UI strings (navigation, labels, buttons):

```typescript
// src/lib/i18n/translations.ts
const translations = {
  en: {
    nav: { home: 'Home', about: 'About', blog: 'Blog' },
    hero: { title: 'Welcome', cta: 'Get Started' }
  },
  fr: {
    nav: { home: 'Accueil', about: 'À propos', blog: 'Blog' },
    hero: { title: 'Bienvenue', cta: 'Commencer' }
  }
} as const;

/**
 * Get translations for a given locale.
 * @param locale - The locale code
 * @returns Translation object for the locale
 */
export function useTranslations(locale: keyof typeof translations) {
  return translations[locale] ?? translations['en'];
}
```

```astro
---
import { useTranslations } from '../lib/i18n/translations';

const t = useTranslations(Astro.currentLocale ?? 'en');
---

<nav>
  <a href="/">{t.nav.home}</a>
  <a href="/about">{t.nav.about}</a>
</nav>
```

## Generating Static Routes

```astro
---
// src/pages/[locale]/blog/[slug].astro
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => {
    const [locale, ...slugParts] = post.id.split('/');
    return {
      params: { locale, slug: slugParts.join('/').replace(/\.mdx?$/, '') },
      props: { post }
    };
  });
}
---
```
