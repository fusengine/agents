---
name: cli
description: Command-line interface for generating schema, secrets, and database migrations
when-to-use: generate schema, create migrations, generate secrets, database setup, integration setup
keywords: CLI, generate, migrate, secret, schema generation, database setup, bunx
priority: high
requires: installation.md, server-config.md
related: installation.md, adapters/prisma.md, adapters/drizzle.md
---

# Better Auth CLI

## When to Use

- Generate database schema from auth config
- Push schema changes to database
- Generate secure secrets
- Integrate with Prisma/Drizzle migrations

## Why Use CLI

| Task | Command |
|------|---------|
| Initial setup | `generate` |
| Schema changes | `migrate` |
| New secret | `secret` |

## Commands

### Generate Schema

```bash
bunx @better-auth/cli generate
```

Options:
```bash
--config <path>    # Path to auth config (default: auto-detect)
--output <path>    # Output directory for schema
--dialect <type>   # Database dialect (postgresql, mysql, sqlite)
```

### Push Schema

```bash
bunx @better-auth/cli migrate
```

### Generate Secret

```bash
bunx @better-auth/cli secret
```

Output:
```
BETTER_AUTH_SECRET=a1b2c3d4e5f6...
```

## Prisma Integration

```bash
# Generate Prisma schema additions
bunx @better-auth/cli generate --output prisma/schema.prisma

# Then run Prisma migrate
bunx prisma migrate dev
```

## Drizzle Integration

```bash
# Generate Drizzle schema
bunx @better-auth/cli generate --output src/db/auth-schema.ts

# Then run Drizzle push
bunx drizzle-kit push
```

## Config Auto-Detection

The CLI auto-detects your auth config from:
- `auth.ts`
- `src/auth.ts`
- `lib/auth.ts`
- `modules/auth/src/services/auth.ts`

Or specify manually:
```bash
bunx @better-auth/cli generate --config ./modules/auth/src/services/auth.ts
```

## Environment

```bash
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your-secret
```
