---
name: astro-db
description: Astro DB — defineDb, defineTable, column types, CRUD with db.select/insert/update/delete, db/config.ts, db/seed.ts, Turso for production, type-safety, integration with Astro Actions. Use for any database operation in an Astro project.
versions:
  astro: "6"
user-invocable: true
references: references/schema-definition.md, references/crud-operations.md, references/seed-data.md, references/turso-production.md, references/actions-integration.md, references/templates/db-config.md, references/templates/crud-example.md
related-skills: astro-6, astro-actions, astro-deployment
---

# Astro DB

Type-safe SQL database built into Astro, powered by libSQL/Turso. Use for structured data without external backend services.

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Check existing db/config.ts, tables, and Actions
2. **fuse-ai-pilot:research-expert** - Verify Astro DB API via Context7/Exa
3. **mcp__context7__query-docs** - Check Astro 6 DB docs for column types and CRUD

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

### When to Use

- Storing structured data (comments, users, posts, forms)
- Building full-stack Astro apps without external DB setup
- Combining with Astro Actions for type-safe form handling
- Deploying to production with Turso (libSQL cloud)
- Seeding development data for local testing

### Architecture

```
db/
├── config.ts   # Schema definition (defineDb, defineTable)
└── seed.ts     # Development data seeding
```

---

## Core Concepts

### Schema Definition

Define tables in `db/config.ts` using `defineDb` and `defineTable`. Export tables for use in pages and actions. Column types: `column.text()`, `column.number()`, `column.boolean()`, `column.date()`, `column.json()`.

### CRUD Operations

Import `db` and table from `astro:db`. All operations are async and type-safe based on your schema definition.

### Turso for Production

Set `ASTRO_DB_REMOTE_URL` and `ASTRO_DB_APP_TOKEN` environment variables. Run `astro db push` to sync schema to Turso. Use `astro db execute` to run seed scripts against remote DB.

### Actions Integration

Combine with `astro:actions` for end-to-end type safety: Zod input validation → DB operation → typed response.

---

## Reference Guide

### Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Schema Definition** | [schema-definition.md](references/schema-definition.md) | Table structure, column types |
| **CRUD Operations** | [crud-operations.md](references/crud-operations.md) | select, insert, update, delete |
| **Seed Data** | [seed-data.md](references/seed-data.md) | db/seed.ts, remote seeding |
| **Turso Production** | [turso-production.md](references/turso-production.md) | Deployment, env vars, push |
| **Actions Integration** | [actions-integration.md](references/actions-integration.md) | Type-safe form → DB flow |

### Templates

| Template | When to Use |
|----------|-------------|
| [db-config.md](references/templates/db-config.md) | Complete db/config.ts + seed.ts |
| [crud-example.md](references/templates/crud-example.md) | Full CRUD with Actions |

---

## Best Practices

1. **Export tables from config.ts** - Import in pages and actions
2. **Use Actions for mutations** - Type-safe with Zod validation
3. **`.returning()` after insert** - Get back inserted rows
4. **Push before deploy** - Run `astro db push` in CI/CD
5. **Turso free tier** - 500 databases, generous for production
