# Template: Data Fetching Service

SOLID-compliant service in src/lib/ with full JSDoc (< 80 lines).

## src/lib/blog.ts

```typescript
import { getCollection, getEntry } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { BlogQueryOptions } from '../interfaces/content.interface';

type BlogPost = CollectionEntry<'blog'>;

/**
 * Fetch all published blog posts sorted by date descending.
 *
 * @param options - Optional query filters
 * @param options.locale - Filter posts by locale prefix
 * @param options.tag - Filter posts by tag
 * @param options.limit - Maximum number of posts to return
 * @returns Sorted array of blog posts
 */
export async function getBlogPosts(options: BlogQueryOptions = {}): Promise<BlogPost[]> {
  const { locale, tag, limit } = options;

  const posts = await getCollection('blog', (entry) => {
    if (locale && !entry.id.startsWith(`${locale}/`)) return false;
    if (tag && !entry.data.tags?.includes(tag)) return false;
    return true;
  });

  const sorted = posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  return limit ? sorted.slice(0, limit) : sorted;
}

/**
 * Get a single blog post by slug.
 *
 * @param slug - The post slug (without locale prefix)
 * @param locale - Locale directory prefix (default: 'en')
 * @returns Blog post entry or undefined if not found
 */
export async function getBlogPostBySlug(
  slug: string,
  locale = 'en'
): Promise<BlogPost | undefined> {
  return getEntry('blog', `${locale}/${slug}`);
}
```

## src/interfaces/content.interface.ts (extract)

```typescript
/**
 * Options for querying blog posts.
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
