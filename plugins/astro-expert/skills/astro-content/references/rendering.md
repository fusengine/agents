---
name: rendering
description: render() function for Markdown/MDX entries — Content component, headings, custom components
when-to-use: rendering blog posts or docs pages from collections
keywords: render, Content, headings, MDX, components
priority: high
---

# Rendering Content Entries

## When to Use

- Rendering a blog post or doc page from a collection entry
- Extracting headings for a table of contents
- Passing custom components to MDX

## render()

```astro
---
import { getEntry, render } from 'astro:content';

const post = await getEntry('blog', Astro.params.slug);
if (!post) return Astro.redirect('/404');

const { Content, headings } = await render(post);
---
<article>
  <h1>{post.data.title}</h1>

  <!-- Table of contents -->
  <nav>
    {headings.map(h => (
      <a href={`#${h.slug}`} style={`margin-left: ${(h.depth - 1) * 1}rem`}>
        {h.text}
      </a>
    ))}
  </nav>

  <!-- Rendered content -->
  <Content />
</article>
```

## Headings Structure

Each heading has: `{ depth: number, slug: string, text: string }`

## Custom Components in MDX

```astro
---
const { Content } = await render(post);
---
<Content
  components={{
    h1: MyH1Component,
    blockquote: Callout,
    pre: CodeBlock,
  }}
/>
```

## Complete Blog Post Page

```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map(post => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content, headings } = await render(post);
---
<BaseLayout title={post.data.title} description={post.data.description}>
  <Content />
</BaseLayout>
```
