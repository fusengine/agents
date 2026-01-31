---
name: baselining
description: Baselining existing databases with Prisma 7
when-to-use: Starting Prisma with an existing database
keywords: baseline, introspect, db pull, existing database, schema generation
priority: high
requires: installation.md
related: shadow-database.md, migration-history.md
---

# Baselining Existing Databases

Importing existing database schemas into Prisma without losing migration history.

## Introspection

Pull schema from existing database:

```bash
# Generate schema from database
bunx prisma db pull

# Print to stdout instead of file
bunx prisma db pull --print

# Custom schema location
bunx prisma db pull --schema ./custom/schema.prisma
```

## Initial Migration

Create baseline migration after introspection:

```bash
# Manual baseline migration
bunx prisma migrate dev --name init

# Skips db push, uses introspected schema
# Creates _migrations table and baseline record
```

## prisma/schema.prisma (Introspected)

```prisma
// Module: prisma/schema.prisma
// Purpose: Auto-generated schema from existing database (SOLID: SRP)
// Auto-generated from database
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]

  @@map("users")
}

model Post {
  id     Int     @id @default(autoincrement())
  title  String
  userId Int
  user   User    @relation(fields: [userId], references: [id])

  @@map("posts")
}
```

## Reset Migrations Table

If baseline migration fails:

```bash
# Delete _prisma_migrations table
bunx prisma db execute --stdin
DROP TABLE IF EXISTS "_prisma_migrations";
-- Then rerun baseline

# Or via SQL client
psql -U user -d dbname -c "DROP TABLE IF EXISTS \"_prisma_migrations\";"
```

## Workflow

1. **Pull schema** from existing database
2. **Review** auto-generated schema.prisma
3. **Create baseline** migration (`migrate dev --name init`)
4. **Verify** `_prisma_migrations` table created
5. **Begin normal migrations** for new changes

## Best Practices

- Always backup database before introspection
- Review generated schema for accuracy
- Remove `@map` directives if not needed
- Update relations if auto-detected incorrectly
- Test baseline in dev environment first
