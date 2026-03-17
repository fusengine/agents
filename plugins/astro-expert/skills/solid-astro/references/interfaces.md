# TypeScript Interfaces in Astro

## Rule: All Types in src/interfaces/

TypeScript interfaces and types MUST live in `src/interfaces/`. Never define types in component files.

## Directory Structure

```text
src/interfaces/
├── content.interface.ts    # Content collection types
├── component.interface.ts  # Component prop types
├── api.interface.ts        # External API response types
└── common.interface.ts     # Shared/utility types
```

## Naming Convention

- Files: `[domain].interface.ts`
- Interfaces: PascalCase with `Props` suffix for component props
- Types: PascalCase, no prefix

```typescript
// src/interfaces/content.interface.ts
export interface BlogPost {
  title: string;
  description: string;
  pubDate: Date;
  author: string;
  slug: string;
  tags: string[];
}

// src/interfaces/component.interface.ts
export interface CardProps {
  title: string;
  description: string;
  variant?: 'default' | 'featured';
}

export interface BlogCardProps extends CardProps {
  post: BlogPost;
  locale: string;
}
```

## Using in Astro Components

```astro
---
// src/components/BlogCard.astro
import type { BlogCardProps } from '../interfaces/component.interface';

type Props = BlogCardProps;

const { post, variant = 'default', locale } = Astro.props;
---
```

## Using in TypeScript Files

```typescript
// src/lib/blog.ts
import type { BlogPost } from '../interfaces/content.interface';

/**
 * Fetch all blog posts sorted by date.
 * @returns Sorted array of blog posts
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  // ...
}
```

## What NOT to Do

```astro
<!-- BAD: Types defined inside component file -->
---
interface Props {  // ← WRONG: should be in src/interfaces/
  title: string;
  description: string;
}
---
```

```typescript
// BAD: Inline type in service file
export async function getPost(): Promise<{ title: string; date: Date }> {
  // ← WRONG: extract to interface file
}
```
