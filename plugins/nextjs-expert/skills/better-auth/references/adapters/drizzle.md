---
name: drizzle
description: Lightweight Drizzle ORM integration with Better Auth for edge runtime compatibility
when-to-use: lightweight ORM, edge functions, SQL-like syntax preference, existing drizzle setup
keywords: Drizzle, adapter, lightweight, edge-first, ORM, sql-like, typescript schema, migration
priority: high
requires: installation.md, server-config.md
related: adapters/prisma.md, adapters/mongodb.md, concepts/database.md
---

# Drizzle Adapter

## When to Use

- Lightweight ORM preference
- SQL-like syntax preferred
- Edge runtime compatibility
- Existing Drizzle setup

## Why Drizzle

| Prisma | Drizzle |
|--------|---------|
| Schema file | TypeScript schema |
| Heavy runtime | Lightweight |
| Query abstraction | SQL-like |
| Edge limitations | Edge-first |

## Installation

```bash
bun add drizzle-orm drizzle-kit
```

## Configuration

```typescript
// lib/auth.ts
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/server/db"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg" // or "mysql", "sqlite"
  })
})
```

## Schema Definition

```typescript
// server/db/schema.ts
import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core"

export const users = pgTable("user", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  image: text("image"),
  emailVerified: boolean("emailVerified").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow()
})

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow()
})

export const accounts = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
  providerId: text("providerId").notNull(),
  accountId: text("accountId").notNull(),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  expiresAt: timestamp("expiresAt")
})
```

## With Schema Mapping

```typescript
import { users, sessions, accounts } from "@/server/db/schema"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      users,
      sessions,
      accounts
    }
  })
})
```

## Database Client

```typescript
// server/db/index.ts
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

export const db = drizzle(pool, { schema })
```

## Generate Migrations

```bash
bunx drizzle-kit generate
bunx drizzle-kit migrate
```
