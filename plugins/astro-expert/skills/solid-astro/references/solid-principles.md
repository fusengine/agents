# SOLID Principles for Astro

## S — Single Responsibility

One component = one purpose. One function = one task.

### Component Splitting

```astro
<!-- BAD: Page component doing too much (> 50 lines) -->
<!-- src/pages/blog.astro — contains data fetching, UI, AND layout logic -->

<!-- GOOD: Split responsibilities -->
<!-- src/pages/blog.astro — layout + composition only (< 50 lines) -->
<!-- src/components/BlogList.astro — renders post list -->
<!-- src/components/BlogCard.astro — renders single post card -->
<!-- src/lib/blog.ts — data fetching service -->
```

### File Size Limits

| File Type | Max Lines | Split at |
|-----------|-----------|---------|
| Page component | 50 | 40 |
| Layout component | 80 | 70 |
| UI component | 60 | 50 |
| Utility/service | 80 | 70 |
| Content schema | 50 | 40 |
| Interface file | 50 | 40 |

## O — Open/Closed

Extend via props and slots, not file modification.

```astro
<!-- GOOD: Open for extension via slots -->
<!-- src/components/Card.astro -->
---
interface Props {
  variant?: 'default' | 'featured';
}
---
<article class={`card card--${Astro.props.variant ?? 'default'}`}>
  <header><slot name="header" /></header>
  <div class="card__body"><slot /></div>
  <footer><slot name="footer" /></footer>
</article>
```

## I — Interface Segregation

Focused prop interfaces. No bloated types.

```typescript
// BAD: Bloated interface
interface CardProps {
  title: string;
  description: string;
  image: string;
  author: string;
  date: Date;
  tags: string[];
  readTime: number;
  // ...many more
}

// GOOD: Focused interfaces
interface CardBaseProps {
  title: string;
  description: string;
}

interface CardMediaProps extends CardBaseProps {
  image: string;
  imageAlt: string;
}
```

## D — Dependency Inversion

Abstract data fetching behind service functions.

```typescript
// src/lib/blog.ts — Service layer
export async function getBlogPosts(): Promise<BlogPost[]>
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null>

// Components depend on the abstraction (service), not the data source
```
