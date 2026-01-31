---
name: multi-schema
description: Multiple schema support for PostgreSQL multi-tenancy and organization models
when-to-use: Implementing multi-tenant applications or schema isolation
keywords: multi-schema, tenant, isolation, migration, schema-search-path
priority: medium
requires: null
related: multi-database.md, deployment.md
---

# Prisma 7 Multi-Schema Support

## PostgreSQL Schema Configuration

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Shared schema (public tenants)
model Organization {
  id    String @id @default(cuid())
  name  String
  schema String @unique // e.g., "org_123"
  users User[]

  @@map("organizations")
}

model User {
  id             String @id @default(cuid())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])

  @@map("users")
}
```

---

## Tenant-Specific Schema

```typescript
// modules/cores/db/src/interfaces/tenantContext.ts
import type { PrismaClient } from '@prisma/client'

/**
 * Tenant context with schema and Prisma client
 * @module modules/cores/db/src/interfaces
 */
export interface TenantContext {
  tenantId: string
  schema: string
  prisma: PrismaClient
}
```

```typescript
// modules/cores/db/src/tenant.ts
import { PrismaClient } from '@prisma/client'
import type { TenantContext } from './src/interfaces/tenantContext'

/**
 * Create Prisma client for specific tenant schema
 * Isolates tenant data via PostgreSQL schema separation
 * @module modules/cores/db/src
 * @param tenantSchema Schema name (e.g., 'tenant_org_123')
 */
export function getTenantPrisma(tenantSchema: string): PrismaClient {
  const databaseUrl = new URL(process.env.DATABASE_URL!)

  // Route queries to tenant-specific schema
  databaseUrl.searchParams.set('schema', tenantSchema)

  return new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl.toString(),
      },
    },
  })
}

/**
 * Create tenant context with schema and client
 * @module modules/cores/db/src
 */
export function createTenantContext(
  tenantId: string,
  schemaPrefix: string = 'tenant_'
): TenantContext {
  const schema = `${schemaPrefix}${tenantId}`

  return {
    tenantId,
    schema,
    prisma: getTenantPrisma(schema),
  }
}
```

---

## Middleware for Automatic Tenant Routing

```typescript
// modules/cores/middleware/src/tenantMiddleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { getTenantPrisma } from '@/modules/cores/db/src/tenant'
import type { TenantContext } from '@/modules/cores/db/src/interfaces/tenantContext'

/**
 * Extract tenant ID from request headers or subdomain
 * @module modules/cores/middleware/src
 */
function extractTenantId(req: NextRequest): string {
  // Check X-Tenant-ID header first
  const headerId = req.headers.get('x-tenant-id')
  if (headerId) return headerId

  // Fallback to subdomain (e.g., tenant.example.com)
  const url = new URL(req.url)
  const subdomain = url.hostname.split('.')[0]

  if (subdomain && subdomain !== 'www') {
    return subdomain
  }

  throw new Error('Unable to determine tenant ID from request')
}

/**
 * Middleware for automatic tenant routing
 * Attaches tenant context to request for handlers
 * @module modules/cores/middleware/src
 */
export function tenantMiddleware(req: NextRequest) {
  try {
    const tenantId = extractTenantId(req)
    const schema = `tenant_${tenantId}`

    // Create tenant context
    const tenantContext: TenantContext = {
      tenantId,
      schema,
      prisma: getTenantPrisma(schema),
    }

    // Attach to request for handler use
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-tenant-id', tenantId)
    requestHeaders.set('x-tenant-schema', schema)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (err) {
    console.error('Tenant middleware error:', err)
    return NextResponse.json(
      { error: 'Tenant identification failed' },
      { status: 400 }
    )
  }
}
```

---

## Migration Across Schemas

```bash
#!/bin/bash
# scripts/migrate-all-tenants.sh

TENANTS=("org_001" "org_002" "org_003")

for TENANT in "${TENANTS[@]}"; do
  echo "Migrating $TENANT..."

  DATABASE_URL="postgresql://user:pass@localhost/db?schema=$TENANT" \
  bunx prisma migrate deploy
done
```

---

## Tenant Context in Request

```typescript
// modules/cores/db/src/tenantContext.ts
import { headers } from 'next/headers'
import { getTenantPrisma, createTenantContext } from './tenant'
import type { TenantContext } from './src/interfaces/tenantContext'

/**
 * Extract tenant context from request headers
 * Used in Server Components and API routes
 * @module modules/cores/db/src
 */
export async function getTenantContextFromRequest(): Promise<TenantContext> {
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  if (!tenantId) {
    throw new Error('Tenant ID not found in request headers')
  }

  return createTenantContext(tenantId)
}
```

```typescript
// app/api/users/route.ts
import { getTenantContextFromRequest } from '@/modules/cores/db/src/tenantContext'

/**
 * GET /api/users - Fetch tenant's users
 * Automatically isolated to tenant schema
 * @module app/api/users
 */
export async function GET() {
  const { prisma } = await getTenantContextFromRequest()

  const users = await prisma.user.findMany()
  return Response.json(users)
}
```

---

## Schema Search Path

```typescript
// modules/cores/db/src/utils/schemaConfig.ts
import type { PrismaClient } from '@prisma/client'

/**
 * Configure PostgreSQL search_path for schema resolution
 * Allows queries to find objects in multiple schemas
 * @module modules/cores/db/src/utils
 * @param prisma Prisma client instance
 * @param schemas Array of schema names in search order
 */
export async function setSchemaSearchPath(
  prisma: PrismaClient,
  schemas: string[]
): Promise<void> {
  const searchPath = schemas.join(',')

  await prisma.$executeRaw`
    SET search_path TO ${searchPath}
  `
}

/**
 * Usage example with tenant context
 */
export async function setupTenantSchema(
  context: { schema: string; prisma: PrismaClient }
) {
  // Set search path to tenant schema first, then public
  await setSchemaSearchPath(context.prisma, [context.schema, 'public'])
}
```

---

## Cross-Tenant Query Prevention

```typescript
// modules/users/src/queries/tenantSafeQueries.ts
import { headers } from 'next/headers'
import { getTenantContextFromRequest } from '@/modules/cores/db/src/tenantContext'

/**
 * Extract tenant ID from request headers
 * @module modules/users/src/queries
 */
async function getRequestTenantId(): Promise<string> {
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  if (!tenantId) {
    throw new Error('Tenant ID not found in request')
  }

  return tenantId
}

/**
 * Fetch users for tenant with security validation
 * Prevents cross-tenant data access
 * @module modules/users/src/queries
 * @param tenantId Tenant ID to fetch users for
 */
export async function getTenantUsers(tenantId: string) {
  // Get tenant context from request
  const context = await getTenantContextFromRequest()
  const requestTenantId = await getRequestTenantId()

  // Validate tenant access
  if (tenantId !== requestTenantId || tenantId !== context.tenantId) {
    throw new Error(
      `Unauthorized: Requested tenant ${tenantId} does not match authenticated tenant ${requestTenantId}`
    )
  }

  // Safe to query - tenant isolation enforced
  return context.prisma.user.findMany({
    where: { tenantId },
  })
}
```
