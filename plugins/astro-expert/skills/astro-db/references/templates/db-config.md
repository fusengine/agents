---
name: db-config-template
description: Complete db/config.ts and db/seed.ts for a blog with posts and comments
type: template
---

# Astro DB Config + Seed Template

## db/config.ts

```ts
import { defineDb, defineTable, column } from 'astro:db';

export const Author = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
    email: column.text({ unique: true }),
    bio: column.text({ optional: true }),
    createdAt: column.date({ default: new Date() }),
  },
});

export const Post = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    slug: column.text({ unique: true }),
    title: column.text(),
    description: column.text(),
    body: column.text(),
    published: column.boolean({ default: false }),
    authorId: column.number({ references: () => Author.columns.id }),
    publishedAt: column.date({ optional: true }),
    createdAt: column.date({ default: new Date() }),
  },
});

export const Comment = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    postId: column.number({ references: () => Post.columns.id }),
    author: column.text(),
    email: column.text(),
    body: column.text(),
    approved: column.boolean({ default: false }),
    createdAt: column.date({ default: new Date() }),
  },
});

export default defineDb({ tables: { Author, Post, Comment } });
```

## db/seed.ts

```ts
import { db, Author, Post, Comment } from 'astro:db';

export default async function () {
  await db.insert(Author).values([
    { id: 1, name: 'Alice', email: 'alice@example.com', bio: 'Writer' },
  ]);

  await db.insert(Post).values([
    {
      id: 1,
      slug: 'getting-started',
      title: 'Getting Started with Astro DB',
      description: 'Learn how to use Astro DB in your project.',
      body: 'Content here...',
      published: true,
      authorId: 1,
      publishedAt: new Date('2025-01-01'),
    },
  ]);

  await db.insert(Comment).values([
    {
      postId: 1,
      author: 'Bob',
      email: 'bob@example.com',
      body: 'Great article!',
      approved: true,
    },
  ]);
}
```
