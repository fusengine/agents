---
name: crud-operations
description: CRUD operations with Astro DB — select, insert, update, delete, where, returning
when-to-use: Any data fetching or mutation in Astro pages or actions
keywords: select, insert, update, delete, where, eq, returning, db
priority: high
requires: schema-definition.md
---

# CRUD Operations

## When to Use

- Fetch data in Astro page frontmatter
- Insert/update/delete in Astro Actions or API routes
- Filter rows by conditions

## Import Pattern

```ts
import { db, Comment, Post, eq, and, desc } from 'astro:db';
```

Always import table references alongside `db`.

## SELECT

```ts
// All rows
const comments = await db.select().from(Comment);

// With WHERE clause
const { eq } = await import('astro:db');
const published = await db
  .select()
  .from(Post)
  .where(eq(Post.columns.published, true));

// With ORDER BY + LIMIT
const { desc } = await import('astro:db');
const recent = await db
  .select()
  .from(Post)
  .where(eq(Post.columns.published, true))
  .orderBy(desc(Post.columns.createdAt))
  .limit(10);
```

## INSERT

```ts
// Single row
await db.insert(Comment).values({
  postId: 1,
  author: 'Alice',
  email: 'alice@example.com',
  body: 'Great post!',
});

// Multiple rows
await db.insert(Comment).values([
  { postId: 1, author: 'Alice', email: 'a@b.com', body: 'First!' },
  { postId: 1, author: 'Bob', email: 'b@b.com', body: 'Nice!' },
]);

// Insert and return created rows
const created = await db.insert(Comment).values({ ... }).returning();
```

## UPDATE

```ts
const { eq } = await import('astro:db');

await db
  .update(Post)
  .set({ published: true })
  .where(eq(Post.columns.id, postId));

// Update and return
const updated = await db
  .update(Post)
  .set({ title: 'New Title' })
  .where(eq(Post.columns.id, postId))
  .returning();
```

## DELETE

```ts
await db
  .delete(Comment)
  .where(eq(Comment.columns.id, commentId));
```

## Operators

| Operator | Usage |
|----------|-------|
| `eq(col, val)` | Equality |
| `and(expr, expr)` | Multiple conditions |
| `or(expr, expr)` | OR condition |
| `desc(col)` | Descending order |
| `asc(col)` | Ascending order |
| `gt(col, val)` | Greater than |
| `lt(col, val)` | Less than |
