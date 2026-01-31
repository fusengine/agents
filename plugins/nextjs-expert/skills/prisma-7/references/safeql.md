---
name: safeql
description: SafeQL for type-safe SQL with Prisma and raw queries
when-to-use: Raw SQL validation, type safety for custom queries, SQL linting
keywords: safeql, sql-validation, type-safety, raw-queries, typescript
priority: high
requires: /plugins/nextjs-expert/skills/prisma-7/references/installation.md
related: /plugins/nextjs-expert/skills/prisma-7/references/typescript.md
---

# SafeQL - SQL Type Validation

VS Code extension providing real-time SQL validation with TypeScript type safety.

## Installation

```bash
# VS Code
code --install-extension RemiRousselet.safeql

# npm
npm install -D safeql
```

## Setup

Create `.safeqlrc.json`:

```json
{
  "connections": [
    {
      "name": "default",
      "connectionString": "postgresql://user:password@localhost:5432/mydb",
      "schema": "./prisma/schema.prisma"
    }
  ],
  "generate": {
    "onSave": true,
    "outputDir": "./src/generated/sql-types.ts"
  }
}
```

## Features

- **Real-time validation** - Check SQL syntax instantly
- **Type generation** - Generate TypeScript types from queries
- **Column detection** - Verify column names and types
- **Schema validation** - Check against Prisma schema
- **Auto-formatting** - Format SQL consistently
- **Error reporting** - Detailed SQL error messages

## Raw Query Validation

### Example: Type-Safe Raw Query

```typescript
import { $query } from 'safeql'

// ✅ SafeQL validates this query
const users = await prisma.$queryRaw<User[]>`
  SELECT id, email, name
  FROM "User"
  WHERE status = ${status}
`

// ❌ SafeQL catches errors:
// - Non-existent column: "invalid_column"
// - Type mismatch in WHERE clause
// - Missing required fields
```

## SQL Snippet Integration

```typescript
// Use SafeQL snippets for common patterns
// Command Palette → "SafeQL: Insert Query Template"

// Template provided:
const users = await prisma.$queryRaw`
  SELECT * FROM "User"
  WHERE id = ${id}
`
```

## Type Generation

Configure auto-generation:

```json
{
  "generate": {
    "onSave": true,
    "outputDir": "./src/types/generated",
    "language": "typescript",
    "strict": true
  }
}
```

## VS Code Commands

| Command | Purpose |
|---------|---------|
| SafeQL: Validate Current Query | Check active SQL |
| SafeQL: Format Query | Format SQL statement |
| SafeQL: Insert Query Template | Quick snippet |
| SafeQL: Generate Types | Create type definitions |

## Complex Query Example

```typescript
interface UserWithPosts {
  id: number
  email: string
  postCount: number
}

const users = await prisma.$queryRaw<UserWithPosts[]>`
  SELECT u.id, u.email, COUNT(p.id)::int as "postCount"
  FROM "User" u
  LEFT JOIN "Post" p ON p."authorId" = u.id
  WHERE u.status = ${status}
  GROUP BY u.id, u.email
  ORDER BY "postCount" DESC
  LIMIT 10
`
```

## Error Prevention

SafeQL detects at edit-time:

```typescript
// ❌ Column doesn't exist
const results = await prisma.$queryRaw`
  SELECT nonexistent_column FROM "User"
` // Error: Column "nonexistent_column" not found

// ❌ Type mismatch
const results = await prisma.$queryRaw`
  SELECT * FROM "User" WHERE id = ${'string-value'}
` // Error: Expected number, got string

// ✅ Correct
const results = await prisma.$queryRaw`
  SELECT * FROM "User" WHERE id = ${123}
`
```

## Configuration Options

```json
{
  "connections": [
    {
      "name": "default",
      "connectionString": "postgresql://...",
      "schema": "./prisma/schema.prisma",
      "disable": false
    }
  ],
  "generate": {
    "onSave": true,
    "outputDir": "./src/generated",
    "language": "typescript",
    "strict": true,
    "overwrite": true
  },
  "logging": {
    "level": "info"
  }
}
```

## Best Practices

1. **Validate before deploy** - Run SafeQL in CI/CD
2. **Keep schema updated** - Sync with Prisma schema
3. **Use typed results** - Define return type interfaces
4. **Test queries** - Write tests for raw queries
5. **Document complex SQL** - Add comments to queries

```typescript
/**
 * Get users with recent activity
 * @param days - Look back N days
 * @returns Users and post count
 */
const recentUsers = await prisma.$queryRaw<RecentUser[]>`
  SELECT u.id, u.email, COUNT(p.id)::int as posts
  FROM "User" u
  LEFT JOIN "Post" p ON p."authorId" = u.id
    AND p."createdAt" > NOW() - INTERVAL '${days} days'
  WHERE u.status = 'ACTIVE'
  GROUP BY u.id
`
```

## Troubleshooting

### Connection Issues

```bash
# Test database connection
safeql --test-connection

# Check credentials in .safeqlrc.json
```

### Schema Out of Sync

```bash
# Regenerate types
safeql --generate-types

# Re-validate all queries
safeql --validate-all
```

### CI/CD Integration

```bash
# Add to package.json
{
  "scripts": {
    "validate-sql": "safeql --validate-all",
    "generate-sql-types": "safeql --generate-types"
  }
}
```

Then in CI:

```yaml
- run: npm run validate-sql
- run: npm run generate-sql-types
```

---
