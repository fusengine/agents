---
title: "Connection URLs"
description: "Database connection URL formats, parameters, and configuration"
tags: ["database", "connections", "urls", "configuration"]
---

# Connection URLs

Connection URLs define how Prisma connects to your database. Each database type uses a specific URL format with required parameters.

## URL Format Components

```
[protocol]://[username]:[password]@[host]:[port]/[database]?[parameters]
```

## PostgreSQL

### Basic Connection
```
postgresql://user:password@localhost:5432/mydb
```

### With Parameters
```
postgresql://user:password@localhost:5432/mydb?schema=public&sslmode=require
```

### Connection Pooling
```
postgresql://user:password@pooler:6543/mydb?pgbouncer=true
```

## MySQL

### Basic Connection
```
mysql://user:password@localhost:3306/mydb
```

### With SSL
```
mysql://user:password@localhost:3306/mydb?sslaccept=strict
```

### Connection Pool
```
mysql://user:password@pooler:3306/mydb
```

## SQLite

### File-based
```
file:./dev.db
```

### Memory Database
```
file:memdb?mode=memory&cache=shared
```

## MongoDB

### Replica Set
```
mongodb+srv://user:password@cluster.mongodb.net/mydb?retryWrites=true
```

### Connection Pool
```
mongodb://user:password@localhost:27017/mydb?maxPoolSize=20
```

## Common Parameters

| Parameter | Purpose | Example |
|-----------|---------|---------|
| `schema` | Database schema (PostgreSQL) | `?schema=public` |
| `sslmode` | SSL mode (PostgreSQL) | `?sslmode=require` |
| `sslaccept` | SSL acceptance (MySQL) | `?sslaccept=strict` |
| `pgbouncer` | Connection pooling | `?pgbouncer=true` |
| `maxPoolSize` | Max connections (MongoDB) | `?maxPoolSize=20` |
| `retryWrites` | Automatic retries (MongoDB) | `?retryWrites=true` |

## Environment Variable Pattern

```bash
# .env
DATABASE_URL="postgresql://user:pass@localhost:5432/mydb"
DIRECT_URL="postgresql://user:pass@localhost:5432/mydb"
```

## SOLID Architecture Integration

### Module Path
`app/lib/database/connection.ts`

### Type Definition
```typescript
/**
 * Database connection configuration
 * @module app/lib/database/types
 */

import type { PrismaClient } from '@prisma/client';

/**
 * Connection URL configuration with type safety
 */
export type DatabaseConfig = {
  /** Main connection URL for queries */
  databaseUrl: string;
  /** Direct connection URL for migrations */
  directUrl: string;
  /** SSL/TLS mode for connection */
  sslMode?: 'require' | 'verify-ca' | 'verify-full';
};
```

### Safe Implementation
```typescript
/**
 * Validate database connection URLs
 * @module app/lib/database/validation
 */

/**
 * Validates DATABASE_URL and DIRECT_URL environment variables
 * @throws {Error} If required URLs are missing
 * @returns {Object} Validated configuration
 */
export function validateDatabaseUrls() {
  const databaseUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  if (!directUrl) {
    throw new Error('DIRECT_URL environment variable is required');
  }

  return { databaseUrl, directUrl };
}
```

## Best Practices

- **Never hardcode credentials** - Use environment variables
- **Use connection pooling** - For production applications
- **Separate read/write URLs** - When applicable
- **Test URL format** - Verify connectivity before deployment
- **Mask sensitive data** - In logs and error messages
- **Use HTTPS/TLS** - For remote database connections
