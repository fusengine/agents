# Better Auth SQL Adapters

## PostgreSQL

```bash
bun add pg
```

```typescript
import { betterAuth } from "better-auth"
import { Pool } from "pg"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export const auth = betterAuth({
  database: pool
})
```

### Custom Schema
```typescript
export const auth = betterAuth({
  database: pool,
  advanced: {
    database: { schema: "auth" }  // Use "auth" schema instead of public
  }
})
```

## MySQL

```bash
bun add mysql2
```

```typescript
import { betterAuth } from "better-auth"
import mysql from "mysql2/promise"

const pool = mysql.createPool(process.env.DATABASE_URL!)

export const auth = betterAuth({
  database: pool
})
```

## SQLite

```bash
bun add better-sqlite3
```

```typescript
import { betterAuth } from "better-auth"
import Database from "better-sqlite3"

const db = new Database("auth.db")

export const auth = betterAuth({
  database: db
})
```

## Kysely (Universal)

```bash
bun add kysely
```

```typescript
import { betterAuth } from "better-auth"
import { kyselyAdapter } from "better-auth/adapters/kysely"
import { Kysely, PostgresDialect } from "kysely"
import { Pool } from "pg"

const db = new Kysely({
  dialect: new PostgresDialect({ pool: new Pool({ connectionString: "..." }) })
})

export const auth = betterAuth({
  database: kyselyAdapter(db, { type: "postgres" })
})
```

Supported Kysely dialects: PostgreSQL, MySQL, SQLite, MS SQL Server.

## Environment Variables

```bash
# PostgreSQL
DATABASE_URL=postgresql://user:pass@localhost:5432/myapp

# MySQL
DATABASE_URL=mysql://user:pass@localhost:3306/myapp

# SQLite
DATABASE_URL=file:./auth.db
```
