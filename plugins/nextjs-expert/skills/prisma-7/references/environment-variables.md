---
title: "Environment Variables"
description: "DATABASE_URL, DIRECT_URL, and environment management for Prisma"
tags: ["environment", "variables", "configuration", "deployment"]
---

# Environment Variables

Prisma relies on environment variables to manage database connections across different environments.

## Core Variables

### DATABASE_URL

The main connection string for your database.

```bash
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
```

Used by Prisma Client and migrations.

### DIRECT_URL

Direct connection URL bypassing connection pooler (required for migrations with Prisma Cloud).

```bash
# .env
DIRECT_URL="postgresql://user:password@db.direct:5432/mydb"
DATABASE_URL="postgresql://user:password@pool.proxy:5432/mydb?schema=prisma"
```

## Environment Setup

### Development (.env.local)

```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/dev_db"
DIRECT_URL="postgresql://postgres:password@localhost:5432/dev_db"
```

### Production (.env.production)

```bash
DATABASE_URL="postgresql://user:$DB_PASSWORD@prod-db:5432/prod_db"
DIRECT_URL="postgresql://user:$DB_PASSWORD@prod-db-direct:5432/prod_db"
```

### Testing (.env.test)

```bash
DATABASE_URL="postgresql://test:password@localhost:5432/test_db"
```

## Variable Management

### Using dotenv

```typescript
// Load environment variables
import { config } from 'dotenv';
config();

const databaseUrl = process.env.DATABASE_URL;
```

### Next.js Specific

```bash
# .env.local (local development)
# .env.development (next dev)
# .env.production (next build/start)
```

### Vercel Deployment

Set in Vercel Dashboard:
1. Project Settings → Environment Variables
2. Add `DATABASE_URL` and `DIRECT_URL`
3. Specify environments (Production, Preview, Development)

## Security Best Practices

- **Never commit .env files** - Add to .gitignore
- **Use strong passwords** - Minimum 16 characters
- **Rotate credentials** - Regularly update passwords
- **Use secrets management** - Vault, AWS Secrets Manager
- **Mask in logs** - Never log connection strings
- **Separate by environment** - Different credentials per env

## Validation

### SOLID Architecture Integration

#### Module Path
`app/lib/config/env-validation.ts`

#### Type Definition
```typescript
/**
 * Environment variable schema
 * @module app/lib/config/types
 */

import type { z } from 'zod';

/**
 * Validated environment variables with type safety
 */
export type EnvironmentVariables = {
  /** Database connection URL */
  databaseUrl: string;
  /** Direct database URL for migrations */
  directUrl: string;
  /** Current environment */
  nodeEnv: 'development' | 'production' | 'test';
};
```

#### Safe Implementation
```typescript
/**
 * Validate required environment variables
 * @module app/lib/config/env-validation
 */

import type { EnvironmentVariables } from './types';

/**
 * Validates all required environment variables at startup
 * @throws {Error} If required variables are missing
 * @returns {EnvironmentVariables} Validated environment
 */
export function validateEnvironment(): EnvironmentVariables {
  const requiredVars: (keyof EnvironmentVariables)[] = [
    'databaseUrl',
    'directUrl'
  ];

  const env: Partial<EnvironmentVariables> = {
    databaseUrl: process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_URL,
    nodeEnv: (process.env.NODE_ENV as any) || 'development'
  };

  const missing = requiredVars.filter(key => !env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }

  return env as EnvironmentVariables;
}
```

## Troubleshooting

- **"DATABASE_URL is not set"** - Check .env.local file exists
- **Connection refused** - Verify host and port in URL
- **Authentication failed** - Confirm username and password
- **SSL/TLS errors** - Check sslmode parameter in URL
