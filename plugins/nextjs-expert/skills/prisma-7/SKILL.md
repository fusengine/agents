---
name: prisma-7
description: Expert Prisma 7 ORM with Rust-free client, 90% smaller bundles, 3x faster queries, TypedSQL, Omit API, and ESM-first architecture. Use when working with databases, Prisma schemas, queries, migrations, relations, or database optimization.
user-invocable: false
---

# Prisma 7 Expert

## Overview

Prisma 7 (released November 19, 2025) removes Rust dependency for ~90% smaller bundles, up to 3x faster queries, and ESM-first architecture.

## Quick Start

```bash
# Install dependencies
bun add @prisma/client dotenv
bun add -d prisma

# Initialize Prisma
bunx prisma init

# Generate client after schema changes
bunx prisma generate

# Run migrations
bunx prisma migrate dev --name init
```

## Key Features

### 1. Rust-Free Client
- ~90% smaller bundles
- Up to 3x faster queries
- ESM-first

### 2. Required Output Path
```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}
```

### 3. TypedSQL (Stable)
### 4. Omit API
### 5. Client Extensions

## Documentation Structure

- [100-getting-started](100-getting-started/) - Quick start guides
- [200-orm](200-orm/) - ORM reference (schema, client, queries, migrations)
- [250-postgres](250-postgres/) - PostgreSQL specific features
- [300-accelerate](300-accelerate/) - Prisma Accelerate
- [500-platform](500-platform/) - Prisma Platform
- [700-optimize](700-optimize/) - Query optimization
- [800-guides](800-guides/) - Guides (Next.js, Auth.js, etc.)
- [900-ai](900-ai/) - AI integration

## Version Requirements

| Requirement | Version |
|-------------|---------|
| Node.js | 18.18+ |
| TypeScript | 5.1+ |

## Instructions

1. Use `prisma-client` provider (NOT `prisma-client-js`)
2. **ALWAYS** set `output` path in generator
3. Import from generated path, not `@prisma/client`
4. Use singleton pattern in Next.js
5. Use TypedSQL for complex queries
6. Use Omit API for sensitive fields

## Documentation Reference

```
mcp__context7__get-library-docs with context7CompatibleLibraryID="/prisma/docs"
```

Official site: https://www.prisma.io/docs
