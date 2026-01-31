---
name: prisma-config
description: Prisma 7 configuration with prisma.config.ts
when-to-use: Configuring Prisma CLI and studio settings
keywords: prisma.config.ts, configuration, studio, seed, generate
priority: medium
requires: installation.md
related: schema.md
---

# Prisma Configuration

Configuration file for Prisma 7 CLI.

## prisma.config.ts

```typescript
// prisma.config.ts (project root)
import { defineConfig } from 'prisma/config'

/**
 * Prisma 7 configuration file
 * Defines schema, migrations, and CLI settings
 */
export default defineConfig({
  // Database connection string
  datasource: {
    url: process.env.DATABASE_URL,
  },

  // Schema location relative to project root
  schema: './prisma/schema.prisma',

  // Generated client output path
  // Module path: modules/cores/db/generated
  generator: {
    output: './src/generated/prisma',
  },

  // Migrations history directory
  migrations: {
    directory: './prisma/migrations',
  },

  // Seed script configuration
  seed: {
    command: 'bun run prisma/seed.ts',
  },
})
```

---

## Environment-Specific Config

```typescript
// prisma.config.ts (project root)
import { defineConfig } from 'prisma/config'

/** Check if running in production environment */
const isProduction = process.env.NODE_ENV === 'production'

/**
 * Environment-aware Prisma configuration
 * Uses different database and settings for dev vs production
 */
export default defineConfig({
  datasource: {
    url: isProduction
      ? process.env.DATABASE_URL  // Production database
      : process.env.DATABASE_URL_DEV,  // Development database
  },

  studio: {
    port: isProduction ? 5555 : 5556,  // Different ports
  },
})
```

---

## Multiple Schemas

```typescript
// prisma.config.ts (project root)
import { defineConfig } from 'prisma/config'

/**
 * Multi-schema configuration for modular database design
 * Separates concerns into different schema files
 */
export default defineConfig({
  schema: [
    './prisma/schema/base.prisma',  // Base models
    './prisma/schema/user.prisma',  // User models
    './prisma/schema/post.prisma',  // Post models
  ],
})
```

---

## package.json Scripts

```json
{
  "scripts": {
    "db:generate": "bunx prisma generate",
    "db:push": "bunx prisma db push",
    "db:migrate": "bunx prisma migrate dev",
    "db:migrate:prod": "bunx prisma migrate deploy",
    "db:studio": "bunx prisma studio",
    "db:seed": "bunx prisma db seed",
    "db:reset": "bunx prisma migrate reset",
    "postinstall": "bunx prisma generate"
  },
  "prisma": {
    "seed": "bun run prisma/seed.ts"
  }
}
```

---

## Schema Generator Block

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"  // Module: modules/cores/db/generated

  // Enable preview/experimental features
  previewFeatures = ["fullTextSearchPostgres"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## CLI Commands

| Command | Description |
|---------|-------------|
| `bunx prisma generate` | Generate client |
| `bunx prisma db push` | Push schema (no migration) |
| `bunx prisma migrate dev` | Create + apply migration |
| `bunx prisma migrate deploy` | Apply migrations (prod) |
| `bunx prisma migrate reset` | Reset database |
| `bunx prisma studio` | Open visual editor |
| `bunx prisma db seed` | Run seed script |
| `bunx prisma format` | Format schema |
| `bunx prisma validate` | Validate schema |

---

## Best Practices

1. **Use prisma.config.ts** - Modern configuration
2. **Environment variables** - Never hardcode URLs
3. **Seed in package.json** - Standard location
4. **postinstall hook** - Auto-generate on install
5. **Format on save** - Keep schema clean
