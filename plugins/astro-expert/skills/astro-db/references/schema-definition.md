---
name: schema-definition
description: Astro DB schema with defineDb, defineTable, column types, primary keys, references
when-to-use: Setting up database tables and relationships in Astro
keywords: defineDb, defineTable, column, primaryKey, references, schema
priority: high
---

# Schema Definition

## When to Use

- Initial database setup in `db/config.ts`
- Adding new tables to existing schema
- Defining foreign key relationships

## Basic Schema

```ts
// db/config.ts
import { defineDb, defineTable, column } from 'astro:db';

export const Post = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    slug: column.text({ unique: true }),
    title: column.text(),
    body: column.text(),
    published: column.boolean({ default: false }),
    createdAt: column.date({ default: new Date() }),
    metadata: column.json({ optional: true }),
  },
});

export const Comment = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    postId: column.number({ references: () => Post.columns.id }),
    author: column.text(),
    email: column.text(),
    body: column.text(),
    createdAt: column.date({ default: new Date() }),
  },
});

export default defineDb({ tables: { Post, Comment } });
```

## Column Types Reference

| Type | Usage | Options |
|------|-------|---------|
| `column.text()` | Strings | `optional`, `unique`, `default` |
| `column.number()` | Integers/floats | `primaryKey`, `optional`, `default` |
| `column.boolean()` | True/false | `optional`, `default` |
| `column.date()` | Date objects | `optional`, `default` |
| `column.json()` | Arbitrary JSON | `optional` |

## Column Options

```ts
column.text({
  optional: true,     // allows NULL
  unique: true,       // unique constraint
  default: 'draft',   // default value
})

column.number({
  primaryKey: true,   // auto-increment PK
  references: () => OtherTable.columns.id,  // foreign key
})
```

## Key Rules

- Always export tables from `db/config.ts`
- Use `column.number({ primaryKey: true })` for auto-increment IDs
- Foreign keys use `references: () => Table.columns.column`
- `defineDb` must receive all tables to register them
