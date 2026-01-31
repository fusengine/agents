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
# Core packages
bun add @prisma/client dotenv
bun add -d prisma

# Driver adapter (PostgreSQL example)
bun add @prisma/adapter-pg pg
bun add -d @types/pg
```

---

## Initialize Prisma

```bash
bunx prisma init
```

Creates:
- `prisma/schema.prisma` - Schema file
- `.env` - Environment variables

---

## Schema Configuration (v7 Required)

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client"           // NOT prisma-client-js (v7 change)
  output   = "../src/generated/prisma" // REQUIRED in v7 (output path)
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
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

## prisma.config.ts (v7 Required)

```typescript
// prisma.config.ts (project root)
import 'dotenv/config'
import { defineConfig } from 'prisma/config'

/**
 * Prisma configuration file (v7 required)
 * Defines schema location, migrations path, and CLI settings
 */
export default defineConfig({
  schema: 'prisma/schema.prisma',  // Path to schema definition

  migrations: {
    path: 'prisma/migrations',  // Path to migration history
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
prisma.config.ts                # Prisma configuration
```

---

## Version Requirements

| Dependency | Version |
|------------|---------|
| prisma | >= 7.0.0 |
| @prisma/client | >= 7.0.0 |
| Node.js | >= 20.19.0 |
| TypeScript | >= 5.4.0 |
