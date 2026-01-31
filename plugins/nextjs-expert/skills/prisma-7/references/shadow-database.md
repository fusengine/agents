---
name: shadow-database
description: Shadow database for safe migration testing in Prisma 7
when-to-use: Testing migrations without affecting production
keywords: shadow database, testing, migration validation, safety
priority: high
requires: installation.md, migrations.md
related: zero-downtime.md, hotfixing.md
---

# Shadow Database

Test migrations safely before applying to production using a shadow database.

## .env Configuration

```env
# Main database
DATABASE_URL="postgresql://user:password@localhost:5432/myapp"

# Shadow database (for testing migrations)
SHADOW_DATABASE_URL="postgresql://user:password@localhost:5432/myapp_shadow"
```

## prisma/schema.prisma

```prisma
// Module: prisma/schema.prisma
// Purpose: Main configuration with shadow database for safe testing (SOLID: SRP)
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

## Migration Workflow

```bash
# 1. Test migration against shadow database
bunx prisma migrate dev --name add_status_field

# Prisma will:
# - Apply migration to shadow database
# - Verify schema changes
# - Apply to main database if successful

# 2. Check migration status
bunx prisma migrate status

# 3. Deploy to production
bunx prisma migrate deploy
```

## Creating Shadow Database

```bash
# PostgreSQL
createdb myapp_shadow

# MySQL
mysql -u root -p -e "CREATE DATABASE myapp_shadow;"

# SQLite (auto-created)
# No action needed, .shadow.db created automatically
```

## Benefits

- Verify migrations before production
- Catch schema conflicts early
- Test data transformations safely
- Rollback shadow only if needed
- Zero impact on main database

## Common Issues

**Shadow database already exists**
```bash
psql -U user -d postgres -c "DROP DATABASE myapp_shadow;"
```

**Connection pool limits**
```env
SHADOW_DATABASE_URL="postgresql://...?directUrl=true"
```
