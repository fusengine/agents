# Template: Astro Component with Props + JSDoc

Canonical SOLID-compliant Astro component (< 60 lines).

## src/components/blog/BlogCard.astro

```astro
---
import type { BlogCardProps } from '../../interfaces/component.interface';
import { formatDate } from '../../lib/utils';
import { getRelativeLocaleUrl } from 'astro:i18n';

type Props = BlogCardProps;

const {
  post,
  variant = 'default',
  locale = 'en'
} = Astro.props;

const { title, description, pubDate, author } = post.data;
const postUrl = getRelativeLocaleUrl(locale, `blog/${post.slug}`);
const formattedDate = formatDate(pubDate, locale);
---

<article class:list={['blog-card', `blog-card--${variant}`]}>
  <header class="blog-card__header">
    <time datetime={pubDate.toISOString()} class="blog-card__date">
      {formattedDate}
    </time>
    <span class="blog-card__author">{author}</span>
  </header>

  <h2 class="blog-card__title">
    <a href={postUrl}>{title}</a>
  </h2>

  <p class="blog-card__description">{description}</p>
</article>

<style>
  .blog-card {
    padding: var(--space-4);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }

  .blog-card--featured {
    border-color: var(--color-primary);
  }

  .blog-card__title a {
    color: var(--color-text);
    text-decoration: none;
  }

  .blog-card__description {
    color: var(--color-text-muted);
    margin-top: var(--space-2);
  }
</style>
```

## src/interfaces/component.interface.ts (extract)

```typescript
import type { CollectionEntry } from 'astro:content';

/**
 * Props for the BlogCard component.
 */
export interface BlogCardProps {
  /** The blog post collection entry */
  post: CollectionEntry<'blog'>;

  /** Visual variant affecting card appearance */
  variant?: 'default' | 'featured' | 'compact';

  /** Current locale for link generation */
  locale?: string;
}
```
