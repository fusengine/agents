---
name: error-codes
description: Complete Prisma 7 error codes reference
when-to-use: Debugging errors, understanding error codes
keywords: error, P1000, P2000, P3000, codes, reference
priority: medium
requires: error-handling.md
related: client.md
---

# Error Codes Reference

Complete Prisma error codes.

## Common Errors (P1xxx)

| Code | Description |
|------|-------------|
| P1000 | Authentication failed |
| P1001 | Can't reach database server |
| P1002 | Database server timeout |
| P1003 | Database does not exist |
| P1008 | Operations timed out |
| P1009 | Database already exists |
| P1010 | User denied access |
| P1011 | Error opening TLS connection |
| P1012 | Schema validation error |
| P1013 | Invalid database string |
| P1014 | Model does not exist |
| P1015 | Schema using unsupported features |
| P1016 | Incorrect number of parameters |
| P1017 | Server closed connection |

---

## Query Errors (P2xxx)

| Code | Description |
|------|-------------|
| P2000 | Value too long for column |
| P2001 | Record not found |
| P2002 | **Unique constraint failed** |
| P2003 | **Foreign key constraint failed** |
| P2004 | Constraint failed on database |
| P2005 | Invalid value for field type |
| P2006 | Invalid value provided |
| P2007 | Data validation error |
| P2008 | Query parsing failed |
| P2009 | Query validation failed |
| P2010 | Raw query failed |
| P2011 | Null constraint violation |
| P2012 | Missing required value |
| P2013 | Missing required argument |
| P2014 | Required relation violation |
| P2015 | Related record not found |
| P2016 | Query interpretation error |
| P2017 | Records not connected |
| P2018 | Required connected records not found |
| P2019 | Input error |
| P2020 | Value out of range |
| P2021 | Table does not exist |
| P2022 | Column does not exist |
| P2023 | Inconsistent column data |
| P2024 | Connection pool timeout |
| P2025 | **Record not found (update/delete)** |
| P2026 | Database provider feature not supported |
| P2027 | Multiple errors during execution |
| P2028 | Transaction API error |
| P2030 | Cannot find fulltext index |
| P2031 | MongoDB replica set required |
| P2033 | Number too large |
| P2034 | **Transaction conflict (retry)** |
| P2035 | Database assertion violation |
| P2036 | External connector error |
| P2037 | Too many connections |

---

## Migration Errors (P3xxx)

| Code | Description |
|------|-------------|
| P3000 | Failed to create database |
| P3001 | Destructive migration detected |
| P3002 | Migration was rolled back |
| P3003 | Invalid migration format |
| P3004 | System database alteration |
| P3005 | Non-empty schema |
| P3006 | Migration failed to apply |
| P3007 | Preview features not allowed |
| P3008 | Migration already applied |
| P3009 | Failed migrations found |
| P3010 | Migration name too long |
| P3011 | Cannot roll back completed migration |
| P3012 | Cannot roll back to never applied |
| P3013 | Datasource provider mismatch |
| P3014 | Shadow database creation error |
| P3015 | Migration file not found |
| P3016 | Fallback database error |
| P3017 | Migration not found |
| P3018 | Migration failed to apply |
| P3019 | Datasource provider mismatch |
| P3020 | Shadow database disabled |
| P3021 | No foreign keys in database |
| P3022 | Direct DDL not allowed |

---

## Introspection Errors (P4xxx)

| Code | Description |
|------|-------------|
| P4000 | Introspection failed |
| P4001 | Introspected database empty |
| P4002 | Inconsistent schema |

---

## Prisma Accelerate (P6xxx)

| Code | Description |
|------|-------------|
| P6000 | Generic server error |
| P6001 | Rate limit exceeded |
| P6002 | Invalid project configuration |
| P6003 | Usage limit exceeded |
| P6004 | Query timeout |
| P6005 | Invalid parameters |
| P6006 | Version not supported |
| P6008 | Connection limit exceeded |
| P6009 | Response size exceeded |
| P6100 | Bad request |

---

## Handling Common Errors

```typescript
// modules/cores/db/error-handler.ts
import type { Prisma } from '../generated/prisma/client'

/**
 * Creates a user with comprehensive error handling
 * @param data - User creation payload
 * @returns Created user or throws specific error
 */
async function createUserWithErrorHandling(data: unknown) {
  try {
    return await prisma.user.create({ data })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          // Unique constraint violation
          const field = (error.meta?.target as string[])?.[0]
          throw new Error(`${field} already exists`)
        case 'P2003':
          // Foreign key constraint violation
          throw new Error('Invalid reference')
        case 'P2025':
          // Record not found
          throw new Error('Record not found')
        case 'P2034':
          // Serialization conflict - should retry
          throw new Error('Conflict detected, retry operation')
        default:
          throw error
      }
    }
    throw error
  }
}
```
