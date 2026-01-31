---
title: "Row-Level Security"
description: "PostgreSQL RLS policies, multi-tenancy, and tenant isolation"
tags: ["security", "rls", "postgresql", "multi-tenant", "policies"]
---

# Row-Level Security (RLS)

Row-Level Security enforces fine-grained access control at the database level, ideal for multi-tenant applications.

## Enable RLS on Table

```sql
-- Create table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255),
  tenant_id INT NOT NULL
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

## Create Policies

### Tenant Isolation Policy

```sql
-- Allow users to see only their tenant's data
CREATE POLICY users_tenant_policy ON users
  FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id')::int);
```

### Insert Policy

```sql
CREATE POLICY users_insert_policy ON users
  FOR INSERT
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id')::int);
```

### Update Policy

```sql
CREATE POLICY users_update_policy ON users
  FOR UPDATE
  USING (tenant_id = current_setting('app.current_tenant_id')::int)
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id')::int);
```

## Prisma with RLS

### Set Session Variable

```typescript
// Before query, set the current tenant
await prisma.$executeRaw`SELECT set_config('app.current_tenant_id', '${tenantId}', false)`;

// Now queries are automatically filtered by RLS
const users = await prisma.user.findMany();
// Only returns users where tenant_id matches current_tenant_id
```

### Wrapper Function

```typescript
/**
 * Execute query with tenant context
 */
async function withTenant<T>(
  tenantId: number,
  callback: () => Promise<T>
): Promise<T> {
  await prisma.$executeRaw`
    SELECT set_config('app.current_tenant_id', ${tenantId}, false)
  `;
  return callback();
}

// Usage
const users = await withTenant(tenantId, () =>
  prisma.user.findMany()
);
```

## Multi-Tenant Schema

```prisma
// schema.prisma
model User {
  id        Int     @id @default(autoincrement())
  email     String  @unique
  tenantId  Int     @map("tenant_id")
  tenant    Tenant  @relation(fields: [tenantId], references: [id])
}

model Tenant {
  id    Int     @id @default(autoincrement())
  name  String
  users User[]
}
```

## RLS with Roles

```sql
-- Create roles
CREATE ROLE tenant_user;
CREATE ROLE tenant_admin;

-- Grant permissions
GRANT SELECT ON users TO tenant_user;
GRANT SELECT, INSERT, UPDATE ON users TO tenant_admin;

-- Create policy for admin override
CREATE POLICY admin_bypass ON users
  FOR ALL
  TO tenant_admin
  USING (true)
  WITH CHECK (true);
```

## Security Considerations

- **Always set session variables** - Before any tenant query
- **Test isolation** - Verify policies work correctly
- **Use roles** - Different permissions per role type
- **Monitor access** - Log policy violations
- **Default deny** - Use restrictive policies by default

## SOLID Architecture Integration

### Module Path
`app/lib/security/tenant-context.ts`

### Type Definition
```typescript
/**
 * Multi-tenant RLS types
 * @module app/lib/security/types
 */

/**
 * Current tenant context for RLS
 */
export type TenantContext = {
  /** Tenant ID from session */
  tenantId: number;
  /** User ID making the request */
  userId: string;
  /** User role in tenant */
  role: 'viewer' | 'editor' | 'admin';
};

/**
 * RLS policy execution result
 */
export type RLSResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
```

### Safe Implementation
```typescript
/**
 * Tenant context management for RLS
 * @module app/lib/security/tenant-manager
 */

import type { TenantContext, RLSResult } from './types';

/**
 * Execute query within tenant context with RLS
 * @param tenantContext - Current tenant context
 * @param callback - Query function to execute
 * @returns {Promise} Query result with RLS applied
 * @throws {Error} If tenant context is invalid
 */
export async function withTenantContext<T>(
  tenantContext: TenantContext,
  callback: () => Promise<T>
): Promise<RLSResult<T>> {
  try {
    // Set PostgreSQL session variable for RLS
    await prisma.$executeRaw`
      SELECT set_config(
        'app.current_tenant_id',
        ${tenantContext.tenantId.toString()},
        false
      )
    `;

    // Execute callback within tenant context
    const data = await callback();

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Validate tenant context from session
 * @module app/lib/security/context-validation
 */

/**
 * Validates and extracts tenant context from request
 * @param sessionTenantId - Tenant ID from session
 * @param sessionUserId - User ID from session
 * @returns {TenantContext} Validated tenant context
 * @throws {Error} If context is invalid
 */
export function validateTenantContext(
  sessionTenantId: unknown,
  sessionUserId: unknown
): TenantContext {
  if (!sessionTenantId || typeof sessionTenantId !== 'number') {
    throw new Error('Invalid tenant ID in session');
  }

  if (!sessionUserId || typeof sessionUserId !== 'string') {
    throw new Error('Invalid user ID in session');
  }

  return {
    tenantId: sessionTenantId,
    userId: sessionUserId,
    role: 'viewer' // Determine from actual session/auth
  };
}
```
