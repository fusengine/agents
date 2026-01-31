---
name: composite-types
description: Prisma 7 composite types and embedded documents
when-to-use: Modeling nested objects, address data, metadata structures
keywords: composite, type, embedded, nested, struct, mongo
priority: medium
requires: schema.md
related: scalar-lists.md, data-modeling.md
---

# Composite Types

Embedded objects and composite types in Prisma 7.

## MongoDB Composite Types

```prisma
// prisma/schema.prisma
/// User model with embedded composite types
model User {
  id       Int     @id @default(autoincrement())
  email    String  @unique
  address  Address  // Embedded address object
  contacts Contact[]  // Array of contact objects
}

/// Address composite type (embedded in User)
/// Used for storing address information
type Address {
  street  String
  city    String
  postal  String
  country String
}

/// Contact composite type (array of contacts)
/// Stores multiple contact methods
type Contact {
  type  String // "phone", "fax", "email"
  value String
}
```

## PostgreSQL Custom Types

```prisma
// prisma/schema.prisma
/// Product model with composite types
model Product {
  id       Int     @id @default(autoincrement())
  name     String
  location GeoPoint  // Geographic coordinates
  metadata Meta  // Product metadata
}

/// GeoPoint composite type
/// Stores latitude and longitude coordinates
type GeoPoint {
  lat Float
  lng Float
}

/// Meta composite type
/// Stores product metadata and version info
type Meta {
  tags      String[]  // Array of tags
  version   Int  // Version number
  updated   DateTime  // Last update timestamp
}
```

## Querying Composites

```typescript
// modules/cores/db/operations.ts
import type { Prisma } from '../generated/prisma/client'

/**
 * Create user with nested address and contacts
 * Composite types are embedded in the document
 */
const createUserWithAddress = await prisma.user.create({
  data: {
    email: "test@example.com",
    address: {
      street: "123 Main",
      city: "New York",
      postal: "10001",
      country: "USA"
    },
    contacts: [
      { type: "phone", value: "555-1234" },
      { type: "email", value: "alt@example.com" }
    ]
  }
})

/**
 * Update nested composite field
 * Only specified fields are updated
 */
const updateCity = await prisma.user.update({
  where: { id: 1 },
  data: {
    address: {
      city: "Boston"  // Partial update
    }
  }
})

/**
 * Find users by composite field filter
 * Filter by nested object properties
 */
const usersInUSA = await prisma.user.findMany({
  where: {
    address: {
      country: "USA"
    }
  }
})
```

## Nested Filters

```typescript
// modules/cores/db/queries.ts
import type { Prisma } from '../generated/prisma/client'

/**
 * Search in composite array fields
 * Check if array within composite contains value
 */
const findFeaturedProducts = () => prisma.product.findMany({
  where: {
    metadata: {
      tags: {
        has: "featured"  // Search in nested array
      }
    }
  }
})

/**
 * Multiple conditions on composite fields
 * Combine multiple nested filters with AND
 */
const findUSAUsers = () => prisma.user.findMany({
  where: {
    AND: [
      { address: { country: "USA" } },  // Nested filter 1
      { address: { city: "NYC" } }  // Nested filter 2
    ]
  }
})
```

## Type Safety

```typescript
// modules/cores/db/types.ts
import type { Prisma } from '../generated/prisma/client'

/**
 * Type for User with address field selected
 * Generated automatically from schema
 */
type UserWithAddress = Prisma.UserGetPayload<{
  select: { address: true }
}>

/**
 * Type-safe user object with composite type
 * TypeScript ensures address structure matches schema
 */
const user: UserWithAddress = {
  address: {
    street: "123 Main",
    city: "New York",
    postal: "10001",
    country: "USA"
  }
}
```

## Best Practices

1. **Keep composites simple** - 2-5 fields per type
2. **MongoDB/PostgreSQL only** - Limited database support
3. **Use for value objects** - Address, location, metadata
4. **Avoid deep nesting** - 1-2 levels max
5. **Validate structure** - Use Zod/Yup for validation
