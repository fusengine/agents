---
name: cli-reference
description: Prisma 7 CLI commands reference
when-to-use: Running Prisma CLI commands
keywords: CLI, prisma, migrate, generate, db, studio, push
priority: medium
requires: installation.md
related: migrations.md, prisma-config.md
---

# CLI Reference

Prisma CLI commands for Prisma 7.

## Generate

```bash
# Generate Prisma Client from schema
# Output: src/generated/prisma (defined in schema.prisma)
bunx prisma generate

# Watch mode: regenerate on schema changes
# Useful for development workflow
bunx prisma generate --watch

# Custom schema location
bunx prisma generate --schema ./custom/schema.prisma
```

---

## Migrate

```bash
# Create migration from schema changes and apply it (development)
# Stores in: prisma/migrations/[timestamp]_add_users/migration.sql
bunx prisma migrate dev --name add_users

# Create migration only without applying (for review)
# Review before running in production
bunx prisma migrate dev --create-only

# Apply all pending migrations (production safe)
# Reads from: prisma/migrations/
bunx prisma migrate deploy

# Reset database: drop + migrate + seed
# WARNING: Destructive - development only
bunx prisma migrate reset

# Check migration status and pending migrations
bunx prisma migrate status

# Mark migration as applied/rolled back (for recovery)
bunx prisma migrate resolve --applied "20240101000000_init"
bunx prisma migrate resolve --rolled-back "20240101000000_init"

# Generate SQL diff between schemas
bunx prisma migrate diff \
  --from-schema-datamodel ./prisma/schema.prisma \
  --to-schema-datasource ./prisma/schema.prisma \
  --script
```

---

## Database

```bash
# Push schema without migration
bunx prisma db push

# Skip generate after push
bunx prisma db push --skip-generate

# Accept data loss
bunx prisma db push --accept-data-loss

# Pull schema from database
bunx prisma db pull

# Run seed script
bunx prisma db seed

# Execute SQL
bunx prisma db execute --file ./script.sql
```

---

## Studio

```bash
# Open Prisma Studio
bunx prisma studio

# Custom port
bunx prisma studio --port 5556

# Custom browser
bunx prisma studio --browser firefox
```

---

## Schema

```bash
# Format schema
bunx prisma format

# Validate schema
bunx prisma validate
```

---

## Introspect

```bash
# Generate schema from existing database
bunx prisma db pull

# Print to stdout
bunx prisma db pull --print
```

---

## Version

```bash
# Check version
bunx prisma version
bunx prisma -v

# JSON output
bunx prisma version --json
```

---

## Common Options

| Option | Description |
|--------|-------------|
| `--schema` | Custom schema path |
| `--skip-generate` | Skip client generation |
| `--skip-seed` | Skip seeding after reset |

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Database connection string |
| `DIRECT_URL` | Direct connection (bypass pooler) |
| `PRISMA_SCHEMA_ENGINE_BINARY` | Custom schema engine |
| `PRISMA_QUERY_ENGINE_BINARY` | Custom query engine |
| `DEBUG` | Enable debug logging |

---

## package.json Scripts

```json
{
  "scripts": {
    "db:generate": "bunx prisma generate",
    "db:push": "bunx prisma db push",
    "db:migrate": "bunx prisma migrate dev",
    "db:deploy": "bunx prisma migrate deploy",
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
