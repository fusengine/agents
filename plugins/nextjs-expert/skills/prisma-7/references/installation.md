---
name: installation
description: Prisma 7 installation and initial setup for Next.js 16
when-to-use: Starting with Prisma in a Next.js project
keywords: install, setup, bun, init, generate, prisma.config.ts
priority: high
requires: null
related: schema.md, client.md
---

# Prisma 7 Installation

## Install Dependencies

```bash
# Core packages — pin @7: the npm `latest` tag of `prisma` points to the 8.0 RC
bun add @prisma/client@7 dotenv
bun add -d prisma@7

# Driver adapter (PostgreSQL example)
bun add @prisma/adapter-pg@7 pg
bun add -d @types/pg
```

---

## Initialize Prisma

```bash
bunx prisma init
```

Creates:
- `prisma/schema.prisma` - Schema file (`prisma-client` generator with `output`)
- `.env` - Environment variables
- The config file — **7.10+: `prisma7.config.ts`**; 7.0–7.9: `prisma.config.ts`

**Config file lookup (7.10+)**, without `--config`: root `prisma7.config.*` → `.config/prisma7.*` → `prisma.config.*` (backward-compatible fallback). If a `prisma7.config.ts` exists, a hand-written `prisma.config.ts` is ignored without error (the CLI only logs `Loaded Prisma config from prisma7.config.ts.`) — always edit the file `init` created. Existing projects with only `prisma.config.*` keep working unchanged. Extensions: `.js .ts .mjs .cjs .mts .cts`.

---

## Schema Configuration (v7 Required)

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client"           // NOT prisma-client-js (v7 change)
  output   = "../src/generated/prisma" // REQUIRED in v7 (output path)
}

datasource db {
  provider = "postgresql"  // url moved to prisma.config.ts in v7
}

/// User account model
/// Stores user profile data with timestamps
model User {
  id        String   @id @default(cuid())  // Unique identifier
  email     String   @unique  // Email must be unique
  name      String?  // Optional name field
  createdAt DateTime @default(now())  // Auto-set creation time
  updatedAt DateTime @updatedAt  // Auto-updated on changes
}
```

---

## Prisma Config File (v7 Required)

Edit the file created by `init`: `prisma7.config.ts` on 7.10+, `prisma.config.ts` on 7.0–7.9. Same content either way; with the plain `prisma` package the import stays `prisma/config` (`@prisma/prisma7/config` only when using the `@prisma/prisma7` side-by-side package next to Prisma 8).

```typescript
// prisma7.config.ts (7.10+) or prisma.config.ts (7.0–7.9) — project root
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

/**
 * Prisma configuration file (v7 required)
 * Defines schema location, migrations path, and CLI settings
 */
export default defineConfig({
  schema: 'prisma/schema.prisma',  // Path to schema definition

  migrations: {
    path: 'prisma/migrations',  // Path to migration history
  },

  datasource: {
    url: env('DATABASE_URL'),  // Used by the CLI (migrate, introspect)
  },
})
```

---

## Generate Client

```bash
# After schema changes
bunx prisma generate

# Run migrations
bunx prisma migrate dev --name init

# Open Prisma Studio
bunx prisma studio
```

---

## Environment Variables

```bash
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
```

---

## Project Structure (SOLID)

```
modules/
└── cores/
    └── db/
        ├── prisma.ts           # Singleton client
        └── generated/          # Generated client
            └── prisma/
prisma/
├── schema.prisma               # Schema definition
├── migrations/                 # Migration history
└── seed.ts                     # Seeding script
prisma7.config.ts               # Prisma configuration (7.0–7.9: prisma.config.ts)
```

---

## Version Requirements

| Dependency | Version |
|------------|---------|
| prisma | 7.x (latest stable 7.10.0) |
| @prisma/client | 7.x (latest stable 7.10.0) |
| Node.js | ^20.19.0, ^22.12.0 or >= 24.0.0 |
| TypeScript | >= 5.4.0 (peer range; skill pins 6.x — no Prisma doc/release note confirms TypeScript 7 support yet) |
