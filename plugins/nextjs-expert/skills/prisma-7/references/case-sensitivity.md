---
title: "Case-Sensitive and Case-Insensitive Queries"
description: "String matching modes, collation, and case handling"
category: "Querying"
---

# Case-Sensitive and Case-Insensitive Queries

Handle string matching with flexible case sensitivity options.

## Case-Sensitive Matching (Default)

```typescript
// lib/types/caseInsensitive.ts
import type { Prisma } from "@prisma/client";

/**
 * String search mode
 */
export type StringSearchMode = "default" | "insensitive";

/**
 * Case sensitivity configuration
 */
export interface CaseSensitivityConfig {
  caseSensitive: boolean;
}

/**
 * String filter with case options
 */
export interface StringFilterWithCase {
  text: string;
  caseSensitive: boolean;
  operator: "contains" | "startsWith" | "endsWith";
}

// lib/queries/caseSensitiveQueries.ts
import type { StringFilterWithCase } from "@/lib/types/caseInsensitive";

/**
 * Find user by exact email match (case-sensitive)
 * @param email - Exact email to match
 * @returns User or null
 */
async function findUserByExactEmail(email: string) {
  return prisma.user.findUnique({
    where: { email }
  });
}

/**
 * Find posts containing exact text (case-sensitive)
 * @param titleText - Text to find in title
 * @returns Posts matching text exactly
 */
async function findPostsByExactTitle(titleText: string) {
  return prisma.post.findMany({
    where: {
      title: { contains: titleText }
    }
  });
}

/**
 * Find users by email prefix (case-sensitive)
 * @param prefix - Email prefix
 * @returns Users with matching prefix
 */
async function findUsersByEmailPrefix(prefix: string) {
  return prisma.user.findMany({
    where: {
      email: { startsWith: prefix }
    }
  });
}

/**
 * Flexible string search with case options
 * @param filter - String filter configuration
 * @returns Filtered results
 */
async function searchPostsFlexible(filter: StringFilterWithCase) {
  const mode: Prisma.QueryMode = filter.caseSensitive ? "default" : "insensitive";

  const whereCondition = {
    [filter.operator]: {
      contains: filter.text,
      mode
    }
  };

  return prisma.post.findMany({
    where: { title: whereCondition }
  });
}
```

## Case-Insensitive Matching

```typescript
// lib/types/insensitiveSearch.ts
import type { Prisma } from "@prisma/client";

/**
 * Case-insensitive search filter
 */
export interface InsensitiveSearchFilter {
  text: string;
  operator: "contains" | "startsWith" | "endsWith";
}

/**
 * Search result for posts
 */
export interface PostSearchResult {
  id: string;
  title: string;
}

/**
 * User search result
 */
export interface UserSearchResult {
  id: string;
  email: string;
}

// lib/queries/insensitiveSearchQueries.ts
import type { InsensitiveSearchFilter, PostSearchResult, UserSearchResult } from "@/lib/types/insensitiveSearch";

/**
 * Find posts by title (case-insensitive)
 * @param searchTerm - Text to search
 * @returns Posts matching title
 */
async function findPostsByTitleInsensitive(searchTerm: string): Promise<PostSearchResult[]> {
  return prisma.post.findMany({
    where: {
      title: {
        contains: searchTerm,
        mode: "insensitive"
      }
    }
  });
}

/**
 * Find users by email prefix (case-insensitive)
 * @param prefix - Email prefix
 * @returns Users with matching prefix
 */
async function findUsersByEmailPrefixInsensitive(prefix: string): Promise<UserSearchResult[]> {
  return prisma.user.findMany({
    where: {
      email: {
        startsWith: prefix,
        mode: "insensitive"
      }
    }
  });
}

/**
 * Find users by email domain (case-insensitive)
 * @param domain - Email domain
 * @returns Users with matching domain
 */
async function findUsersByEmailDomain(domain: string): Promise<UserSearchResult[]> {
  return prisma.user.findMany({
    where: {
      email: {
        endsWith: domain,
        mode: "insensitive"
      }
    }
  });
}

/**
 * Find products by name (case-insensitive)
 * @param name - Product name search
 * @returns Products matching name
 */
async function findProductsByNameInsensitive(name: string) {
  return prisma.product.findMany({
    where: {
      name: {
        contains: name,
        mode: "insensitive"
      }
    }
  });
}

/**
 * Flexible case-insensitive search
 * @param filter - Search filter
 * @returns Filtered posts
 */
async function searchPostsInsensitive(filter: InsensitiveSearchFilter): Promise<PostSearchResult[]> {
  return prisma.post.findMany({
    where: {
      title: {
        [filter.operator]: filter.text,
        mode: "insensitive"
      }
    }
  });
}
```

## Complex String Matching

### Multiple Conditions
```typescript
const results = await prisma.article.findMany({
  where: {
    OR: [
      {
        title: {
          contains: "javascript",
          mode: "insensitive"
        }
      },
      {
        content: {
          contains: "typescript",
          mode: "insensitive"
        }
      }
    ]
  }
});
```

### Combined with Other Filters
```typescript
const users = await prisma.user.findMany({
  where: {
    AND: [
      {
        email: {
          contains: "admin",
          mode: "insensitive"
        }
      },
      {
        status: "active"
      }
    ]
  }
});
```

## Database Collation

### PostgreSQL Collation
```typescript
// In schema.prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @db.VarChar(255)
  name  String

  @@map("user")
}

// Use specific collation in queries
async function searchUsers(query: string) {
  return prisma.$queryRaw`
    SELECT * FROM user
    WHERE LOWER(name) LIKE LOWER(${query + "%"})
  `;
}
```

### MySQL Collation
```typescript
// In schema.prisma - case insensitive by default
model Product {
  id   Int     @id @default(autoincrement())
  name String  @db.VarChar(255) @map("product_name")

  @@map("products")
}

// MySQL is case-insensitive by default for VARCHAR
```

## Real-World Examples

```typescript
// lib/types/searchExamples.ts
import type { Prisma } from "@prisma/client";

/**
 * User search result
 */
export interface UserSearchResult {
  id: string;
  name: string;
  email: string;
}

/**
 * Post search result
 */
export interface PostSearchResult {
  id: string;
  title: string;
}

/**
 * Product search result
 */
export interface ProductSearchResult {
  id: string;
  name: string;
}

/**
 * Global search results
 */
export interface GlobalSearchResults {
  users: UserSearchResult[];
  posts: PostSearchResult[];
  products: ProductSearchResult[];
}

/**
 * Tag search result
 */
export interface TagSearchResult {
  id: string;
  name: string;
}

// lib/queries/searchExampleQueries.ts
import type { GlobalSearchResults, TagSearchResult } from "@/lib/types/searchExamples";

/**
 * Find user by email (case-insensitive)
 * @param email - Email address
 * @returns User or null
 */
async function findUserByEmailInsensitive(email: string) {
  return prisma.user.findFirst({
    where: {
      email: {
        equals: email,
        mode: "insensitive"
      }
    }
  });
}

/**
 * Search products by name and description
 * @param query - Search query
 * @returns Array of matching products
 */
async function searchProducts(query: string) {
  return prisma.product.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query,
            mode: "insensitive"
          }
        },
        {
          description: {
            contains: query,
            mode: "insensitive"
          }
        }
      ]
    },
    take: 10
  });
}

/**
 * Find tag by name with normalization
 * @param name - Tag name
 * @returns Tag or null
 */
async function findTagByName(name: string): Promise<TagSearchResult | null> {
  return prisma.tag.findFirst({
    where: {
      name: {
        equals: name.toLowerCase(),
        mode: "insensitive"
      }
    }
  });
}

/**
 * Check if username is already taken
 * @param username - Username to check
 * @returns Whether username exists
 */
async function isUsernameTaken(username: string): Promise<boolean> {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive"
      }
    },
    select: { id: true }
  });

  return user !== null;
}

/**
 * Global search across multiple entities
 * @param query - Search query
 * @returns Results from users, posts, and products
 */
async function globalSearch(query: string): Promise<GlobalSearchResults> {
  const [users, posts, products] = await Promise.all([
    prisma.user.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive"
        }
      },
      take: 5,
      select: { id: true, name: true, email: true }
    }),
    prisma.post.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive"
        }
      },
      take: 5,
      select: { id: true, title: true }
    }),
    prisma.product.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive"
        }
      },
      take: 5,
      select: { id: true, name: true }
    })
  ]);

  return { users, posts, products };
}
```

## Performance Considerations

### Index Strategy
```typescript
// In schema.prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String

  @@index([email])  // Index email for fast lookups
}

// For case-insensitive searches, use LOWER() in index
// CREATE INDEX idx_user_email_lower ON User(LOWER(email))
```

### Query Optimization
```typescript
// Good: Case-insensitive with indexed field
const user = await prisma.user.findFirst({
  where: {
    email: {
      equals: email,
      mode: "insensitive"
    }
  }
});

// Good: Direct unique lookup (fastest)
const user = await prisma.user.findUnique({
  where: { email: email }  // Requires exact case
});
```

### Raw SQL for Complex Matching
```typescript
// PostgreSQL - complex pattern matching
async function advancedSearch(pattern: string) {
  return prisma.$queryRaw`
    SELECT * FROM "Post"
    WHERE "title" ILIKE ${pattern}  -- Case insensitive
    OR "content" ILIKE ${pattern}
    LIMIT 20
  `;
}
```

## Best Practices

1. **Use mode: "insensitive"** for user searches and emails
2. **Keep case-sensitive for IDs** - Always case-sensitive
3. **Normalize input** - Trim and lowercase before comparison
4. **Index searchable fields** - For performance
5. **Use appropriate database collation** - Set in schema
6. **Validate input length** - Prevent expensive queries
7. **Combine filters** - Narrow results before search

### Input Validation
```typescript
async function validateAndSearch(query: string) {
  // Validate
  const normalizedQuery = query?.trim().substring(0, 100);

  if (!normalizedQuery || normalizedQuery.length < 2) {
    return [];
  }

  return prisma.post.findMany({
    where: {
      title: {
        contains: normalizedQuery,
        mode: "insensitive"
      }
    },
    take: 20
  });
}
```
