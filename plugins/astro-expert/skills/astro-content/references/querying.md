---
name: querying
description: getCollection, getEntry, filtering, sorting content collection entries
when-to-use: fetching content in .astro pages or endpoints
keywords: getCollection, getEntry, filter, sort, query
priority: high
---

# Querying Content Collections

## When to Use

- Building blog listing pages
- Fetching a single post by slug
- Filtering drafts or by category

## getCollection()

Fetches all entries in a collection:

```astro
---
import { getCollection } from 'astro:content';

// All blog posts
const allPosts = await getCollection('blog');

// Filter out drafts
const publishedPosts = await getCollection('blog',
  ({ data }) => !data.draft
);

// Sort by date descending
const sortedPosts = publishedPosts.sort(
  (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
);
---
```

## getEntry()

Fetches a single entry by collection and ID:

```astro
---
import { getEntry } from 'astro:content';

const post = await getEntry('blog', 'my-post-slug');
if (!post) return Astro.redirect('/404');
---
```

## getStaticPaths() Integration

```astro
---
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
---
```

## Entry Structure

```typescript
// entry.id     — unique identifier (e.g., 'my-post-slug')
// entry.data   — typed frontmatter/data (validated by schema)
// entry.body   — raw content string (Markdown/MDX)
// entry.render — function to get rendered HTML + headings
```
