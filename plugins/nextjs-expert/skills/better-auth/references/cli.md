# Better Auth CLI

## Overview
CLI tool for database migrations, schema generation, and utilities.

## Installation

```bash
bun add better-auth
```

## Commands

### Generate Schema
Generate database schema from auth configuration:

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
Push schema changes to database:

```bash
bunx @better-auth/cli migrate
```

### Generate Secret
Generate a secure secret for `BETTER_AUTH_SECRET`:

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

## Configuration File

The CLI auto-detects your auth configuration from:
- `auth.ts`
- `src/auth.ts`
- `lib/auth.ts`
- `modules/auth/src/services/auth.ts`

Or specify manually:
```bash
bunx @better-auth/cli generate --config ./modules/auth/src/services/auth.ts
```

## Environment

Ensure environment variables are set:
```bash
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your-secret
```
