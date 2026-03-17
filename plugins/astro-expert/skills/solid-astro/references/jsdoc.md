# JSDoc Standards for Astro

## Rule: JSDoc on ALL Exported Functions

Every exported function, type, and component interface MUST have JSDoc documentation.

## Function JSDoc Template

```typescript
/**
 * Brief description of what the function does.
 *
 * @param paramName - Description of the parameter
 * @param [optionalParam] - Optional parameter description
 * @returns Description of the return value
 * @throws {ErrorType} When this error occurs
 *
 * @example
 * const posts = await getBlogPosts({ locale: 'fr' });
 */
export async function getBlogPosts(options?: BlogQueryOptions): Promise<BlogPost[]>
```

## Interface JSDoc Template

```typescript
/**
 * Props for the BlogCard component.
 */
export interface BlogCardProps {
  /** The blog post data to display */
  post: BlogPost;

  /** Display variant affecting visual style */
  variant?: 'default' | 'featured' | 'compact';

  /** Current locale for link generation */
  locale: string;
}
```

## Real Examples

### Data Service

```typescript
// src/lib/blog.ts

/**
 * Fetch all published blog posts sorted by date descending.
 *
 * @param locale - Filter posts by locale (optional)
 * @returns Array of blog posts sorted by pubDate
 */
export async function getBlogPosts(locale?: string): Promise<BlogPost[]> {
  const posts = await getCollection('blog', (entry) =>
    locale ? entry.id.startsWith(`${locale}/`) : true
  );

  return posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
}

/**
 * Get a single blog post by slug.
 *
 * @param slug - The post slug (without locale prefix)
 * @param locale - The locale to search in (default: 'en')
 * @returns Blog post or undefined if not found
 */
export async function getBlogPostBySlug(
  slug: string,
  locale = 'en'
): Promise<BlogPost | undefined> {
  return getEntry('blog', `${locale}/${slug}`);
}
```

### Utility Function

```typescript
/**
 * Format a date for display using locale-aware formatting.
 *
 * @param date - The date to format
 * @param locale - BCP 47 locale string (default: 'en-US')
 * @returns Human-readable date string
 *
 * @example
 * formatDate(new Date('2026-01-15'), 'fr-FR') // '15 janvier 2026'
 */
export function formatDate(date: Date, locale = 'en-US'): string {
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
```

## When JSDoc is NOT Required

- Internal helper functions (not exported)
- Self-explanatory one-liners
- Test utilities
