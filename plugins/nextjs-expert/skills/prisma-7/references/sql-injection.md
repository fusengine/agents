---
title: "SQL Injection Prevention"
description: "SQL injection prevention, parameterized queries, and safe practices"
tags: ["security", "sql-injection", "prevention", "parameterized-queries"]
---

# SQL Injection Prevention

SQL injection is a critical security vulnerability. Prisma prevents it through parameterized queries and type safety.

## Vulnerable Pattern (Never Do This)

```typescript
// DANGEROUS - Never concatenate user input
const email = userInput;
const user = await prisma.$queryRaw(`SELECT * FROM users WHERE email = '${email}'`);
```

An attacker could input: `' OR '1'='1` to bypass authentication.

## Safe Pattern: Parameterized Queries

```typescript
// SAFE - Using parameterized queries
const user = await prisma.$queryRaw`
  SELECT * FROM users WHERE email = ${email}
`;
```

Prisma automatically escapes and parameterizes the value.

## Prisma Best Practices

### Use Prisma Client Methods

```typescript
// ✅ SAFE - Type-safe and SQL injection protected
const user = await prisma.user.findUnique({
  where: { email: userEmail }
});

const users = await prisma.user.findMany({
  where: {
    status: userStatus,
    role: { in: userRoles }
  }
});
```

### Raw Queries with Parameters

```typescript
// ✅ SAFE - Raw SQL with parameterization
const users = await prisma.$queryRaw`
  SELECT * FROM users
  WHERE email = ${email}
  AND status = ${status}
`;
```

### Multiple Parameters

```typescript
// ✅ SAFE - Multiple parameterized values
const results = await prisma.$queryRaw`
  SELECT * FROM orders
  WHERE user_id = ${userId}
  AND created_at > ${startDate}
  AND amount > ${minAmount}
`;
```

## Input Validation

Always validate user input before querying:

```typescript
import { z } from 'zod';

// Define schema
const userSchema = z.object({
  email: z.string().email(),
  status: z.enum(['active', 'inactive', 'suspended'])
});

// Validate and use
const validated = userSchema.parse(userInput);
const user = await prisma.user.findUnique({
  where: { email: validated.email }
});
```

## Type Safety Protection

```typescript
// TypeScript type safety prevents many injection attacks
type UserFilter = {
  email?: string;
  status?: 'active' | 'inactive';
};

const filter: UserFilter = {
  email: userEmail,
  status: 'active'
};

// This will fail at compile time if types don't match
const users = await prisma.user.findMany({ where: filter });
```

## Advanced Parameterization

```typescript
// Using executeRaw for DDL statements
await prisma.$executeRaw`
  CREATE TABLE users (
    id INT PRIMARY KEY,
    email VARCHAR(255)
  )
`;

// With parameters for safer dynamic operations
const tableName = 'users'; // Cannot be parameterized in DDL
const columnName = 'email'; // Would need identifier escaping
```

## Security Checklist

- ✅ Always use Prisma methods instead of string concatenation
- ✅ Use parameterized queries for raw SQL
- ✅ Validate all user input with schemas
- ✅ Avoid dynamic table/column names when possible
- ✅ Use TypeScript for compile-time type safety
- ✅ Escape identifiers if necessary for DDL

## SOLID Architecture Integration

### Module Path
`app/lib/security/query-validator.ts`

### Type Definition
```typescript
/**
 * Query validation and security types
 * @module app/lib/security/types
 */

import type { z } from 'zod';

/**
 * Safe query filter with type safety
 */
export type SafeQueryFilter<T = any> = {
  [K in keyof T]?: T[K] | { in: T[K][] } | { gte: T[K]; lte: T[K] };
};

/**
 * Validated user input
 */
export type ValidatedInput<T> = {
  isValid: boolean;
  data?: T;
  errors?: string[];
};
```

### Safe Implementation
```typescript
/**
 * Validate user input before database queries
 * @module app/lib/security/input-validation
 */

import type { ValidatedInput, SafeQueryFilter } from './types';
import { z } from 'zod';

/**
 * Validates email input with strong type safety
 * @param input - Raw user input
 * @returns {ValidatedInput} Validation result with typed data
 */
export function validateEmailInput(
  input: unknown
): ValidatedInput<string> {
  const schema = z.string().email().min(5).max(255);

  try {
    const email = schema.parse(input);
    return { isValid: true, data: email };
  } catch (error) {
    return {
      isValid: false,
      errors: error instanceof z.ZodError
        ? error.errors.map(e => e.message)
        : ['Invalid email format']
    };
  }
}

/**
 * Build safe query filters from validated input
 * @module app/lib/database/safe-queries
 */

/**
 * Creates type-safe query filter that prevents injection
 * @param validatedEmail - Pre-validated email address
 * @returns {SafeQueryFilter} Safe filter object for Prisma
 */
export function buildSafeEmailFilter(
  validatedEmail: string
): SafeQueryFilter {
  return {
    email: validatedEmail
  };
}

/**
 * Execute safe user search with parameterized query
 * @param email - Pre-validated email
 * @returns {Promise} User matching email
 */
export async function findUserByEmail(email: string) {
  const validation = validateEmailInput(email);

  if (!validation.isValid) {
    throw new Error('Invalid email input');
  }

  // Safe parameterized query (no SQL injection possible)
  const user = await prisma.$queryRaw`
    SELECT * FROM users
    WHERE email = ${validation.data}
  `;

  return user;
}
```
