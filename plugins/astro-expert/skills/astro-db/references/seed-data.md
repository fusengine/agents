---
name: seed-data
description: Seeding Astro DB with db/seed.ts for local dev and astro db execute for remote
when-to-use: Initial data setup for development or production database
keywords: seed, db/seed.ts, astro db execute, development data
priority: medium
requires: schema-definition.md, crud-operations.md
---

# Seed Data

## When to Use

- Populate development database with test data
- Initialize production database with required records
- Reset dev database to a known state

## db/seed.ts (Local Dev — Auto-runs on `astro dev`)

```ts
// db/seed.ts
import { db, Post, Comment } from 'astro:db';

export default async function () {
  // Seed posts
  await db.insert(Post).values([
    {
      id: 1,
      slug: 'hello-world',
      title: 'Hello World',
      body: 'My first post!',
      published: true,
      createdAt: new Date('2025-01-01'),
    },
    {
      id: 2,
      slug: 'draft-post',
      title: 'Draft Post',
      body: 'Work in progress...',
      published: false,
      createdAt: new Date('2025-01-15'),
    },
  ]);

  // Seed related comments
  await db.insert(Comment).values([
    {
      postId: 1,
      author: 'Alice',
      email: 'alice@example.com',
      body: 'Great post!',
      createdAt: new Date('2025-01-02'),
    },
  ]);
}
```

## Run Seed Against Remote (Turso)

```bash
# Push schema first
npx astro db push

# Then execute seed script against remote
npx astro db execute db/seed.ts --remote
```

## Separate Seed Files by Environment

```ts
// db/seed.ts — always runs in dev
import { db, Post } from 'astro:db';
export default async function () {
  if (import.meta.env.PROD) return; // Safety guard
  await db.insert(Post).values([...]);
}
```

## Key Rules

| Rule | Reason |
|------|--------|
| `seed.ts` auto-runs on `astro dev` | Dev DB resets on each start |
| `--remote` flag for Turso | Without it, runs against local |
| Insert in dependency order | FK constraints — insert parent first |
| Guard with `PROD` check | Prevent accidental prod data wipe |
