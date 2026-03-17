# Template: TypeScript Interface File

SOLID-compliant interface file in src/interfaces/ (< 50 lines per file).

## src/interfaces/content.interface.ts

```typescript
/**
 * Represents a blog post with all metadata.
 */
export interface BlogPost {
  /** Unique post identifier */
  id: string;

  /** Post title for display and SEO */
  title: string;

  /** Short description for cards and meta tags */
  description: string;

  /** Publication date */
  pubDate: Date;

  /** Last update date (if different from pubDate) */
  updatedDate?: Date;

  /** Author display name */
  author: string;

  /** URL slug (without locale prefix) */
  slug: string;

  /** Taxonomy tags */
  tags: string[];

  /** Hero image path relative to public/ */
  heroImage?: string;
}

/**
 * Options for querying blog posts from collection.
 */
export interface BlogQueryOptions {
  /** Filter posts by locale directory prefix */
  locale?: string;

  /** Filter posts containing this tag */
  tag?: string;

  /** Maximum number of posts to return */
  limit?: number;
}
```

## src/interfaces/component.interface.ts

```typescript
import type { CollectionEntry } from 'astro:content';

/**
 * Base props shared across layout components.
 */
export interface BaseLayoutProps {
  /** Page title for <title> and og:title */
  title: string;

  /** Meta description */
  description?: string;

  /** BCP 47 locale for html[lang] */
  locale?: string;
}

/**
 * Props for blog card display component.
 */
export interface BlogCardProps {
  /** Blog post collection entry */
  post: CollectionEntry<'blog'>;

  /** Visual variant */
  variant?: 'default' | 'featured' | 'compact';

  /** Current locale for URL generation */
  locale?: string;
}
```
