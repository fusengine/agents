---
title: "Select vs Include"
description: "Field selection, relation inclusion, performance optimization"
category: "Querying"
---

# Select vs Include

Optimize query performance by selecting only needed fields and relations.

## Select: Include Only Specific Fields

```typescript
// lib/types/userSelect.ts
import type { Prisma } from "@prisma/client";

/**
 * User safe for public display
 */
export interface UserPublicSelect {
  id: string;
  email: string;
  name: string;
}

/**
 * User select configuration
 */
export interface UserSelectConfig {
  includeEmail?: boolean;
  includePosts?: boolean;
}

/**
 * User with relations
 */
export interface UserWithPosts extends UserPublicSelect {
  posts: Array<{
    id: string;
    title: string;
  }>;
}

// lib/queries/selectQueries.ts
import type { UserPublicSelect, UserSelectConfig, UserWithPosts } from "@/lib/types/userSelect";

/**
 * Get user public profile (select specific fields)
 * @param userId - User ID
 * @returns User with public fields only
 */
async function getUserPublicProfile(userId: string): Promise<UserPublicSelect | null> {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true
    }
  });
}

/**
 * Get users without sensitive fields
 * @returns Users excluding password
 */
async function getUsersExcludeSensitive() {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true
    }
  });
}

/**
 * Get user with posts relations
 * @param userId - User ID
 * @returns User with nested post data
 */
async function getUserWithPosts(userId: string): Promise<UserWithPosts | null> {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      posts: {
        select: {
          id: true,
          title: true
        }
      }
    }
  });
}
```

## Include: Add Relations to Default Fields

```typescript
// lib/types/userInclude.ts
import type { Prisma } from "@prisma/client";

/**
 * Post summary for inclusion
 */
export interface PostSummary {
  id: string;
  title: string;
}

/**
 * User with posts included
 */
export interface UserWithPostsIncluded {
  id: string;
  email: string;
  name: string;
  posts: PostSummary[];
}

/**
 * Post with comments
 */
export interface PostWithComments {
  id: string;
  title: string;
  comments: any[];
}

/**
 * User with nested relations
 */
export interface UserWithNestedRelations {
  id: string;
  email: string;
  name: string;
  posts: PostWithComments[];
}

// lib/queries/includeQueries.ts
import type { UserWithPostsIncluded, UserWithNestedRelations } from "@/lib/types/userInclude";

/**
 * Get user with all posts included
 * @param userId - User ID
 * @returns User with posts relation
 */
async function getUserWithPosts(userId: string): Promise<UserWithPostsIncluded | null> {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      posts: true
    }
  });
}

/**
 * Get user with nested post comments
 * @param userId - User ID
 * @returns User with posts and comments
 */
async function getUserWithPostComments(userId: string): Promise<UserWithNestedRelations | null> {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      posts: {
        include: {
          comments: true
        }
      }
    }
  });
}

/**
 * Get user with filtered published posts
 * @param userId - User ID
 * @returns User with recent published posts only
 */
async function getUserWithRecentPublishedPosts(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      posts: {
        where: { published: true },
        orderBy: { createdAt: "desc" },
        take: 5
      }
    }
  });
}
```

## Comparison: Select vs Include

### Performance: Select (Better)
```typescript
// Optimal: Fetch only needed fields
const comments = await prisma.comment.findMany({
  select: {
    id: true,
    text: true,
    author: {
      select: {
        id: true,
        name: true
      }
    }
  },
  take: 20
});
// Lightweight response
```

### Performance: Include (Heavier)
```typescript
// Less optimal: Fetches all fields by default
const comments = await prisma.comment.findMany({
  include: {
    author: true
  },
  take: 20
});
// Larger payload with all user fields
```

## Advanced Patterns

### Conditional Selection
```typescript
async function getUserData(includePrivate: boolean) {
  const baseSelect = {
    id: true,
    email: true,
    name: true
  };

  return prisma.user.findUnique({
    where: { id: "123" },
    select: {
      ...baseSelect,
      ...(includePrivate && {
        password: true,
        twoFactorSecret: true
      })
    }
  });
}
```

### Computed Fields with Select
```typescript
const user = await prisma.user.findUnique({
  where: { id: "123" },
  select: {
    id: true,
    email: true,
    posts: {
      select: {
        id: true,
        title: true
      }
    },
    _count: {
      select: { posts: true }
    }
  }
});
```

### Deep Nesting with Pagination
```typescript
const author = await prisma.author.findUnique({
  where: { id: "123" },
  select: {
    id: true,
    name: true,
    posts: {
      select: {
        id: true,
        title: true,
        comments: {
          select: {
            id: true,
            text: true,
            author: { select: { name: true } }
          },
          take: 5,
          orderBy: { createdAt: "desc" }
        }
      },
      take: 10,
      orderBy: { createdAt: "desc" }
    }
  }
});
```

## Real-World Examples

### API Response Selection
```typescript
// pages/api/users/[id].ts
export default async function handler(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.query.id },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      posts: {
        select: { id: true, title: true },
        take: 5
      },
      _count: {
        select: { posts: true, followers: true }
      }
    }
  });

  res.json(user);
}
```

### List with Pagination
```typescript
async function getPostsList(page: number) {
  const pageSize = 20;
  const skip = (page - 1) * pageSize;

  const posts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      excerpt: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          name: true
        }
      }
    },
    skip,
    take: pageSize,
    orderBy: { createdAt: "desc" }
  });

  return posts;
}
```

### Related Data with Filters
```typescript
const post = await prisma.post.findUnique({
  where: { id: postId },
  select: {
    id: true,
    title: true,
    content: true,
    author: {
      select: {
        id: true,
        name: true,
        email: true
      }
    },
    comments: {
      where: { published: true },
      select: {
        id: true,
        text: true,
        author: {
          select: { name: true }
        }
      },
      take: 20,
      orderBy: { createdAt: "desc" }
    },
    _count: {
      select: {
        comments: {
          where: { published: true }
        }
      }
    }
  }
});
```

## Best Practices

1. **Use select by default** - More explicit and performant
2. **Avoid unnecessary relations** - Reduce payload size
3. **Nest selectively** - Only include needed related data
4. **Use _count** - For relation counts without fetching all
5. **Paginate deeply nested relations** - Prevent large payloads
6. **Hide sensitive fields** - Use select to exclude passwords, secrets
7. **Create reusable patterns** - Define select shapes as constants

### Reusable Select Patterns

```typescript
// lib/constants/selects.ts
import type { Prisma } from "@prisma/client";

/**
 * Reusable user select pattern
 */
export const userSelect = {
  id: true,
  name: true,
  email: true,
  avatar: true
} as const;

/**
 * Reusable post select pattern with nested author
 */
export const postSelect = {
  id: true,
  title: true,
  excerpt: true,
  createdAt: true,
  author: {
    select: userSelect
  }
} as const;

// lib/queries/reusableSelectQueries.ts
import { userSelect, postSelect } from "@/lib/constants/selects";

/**
 * Get post with reusable select pattern
 * @param postId - Post ID
 * @returns Post with author data
 */
async function getPostWithAuthor(postId: string) {
  return prisma.post.findUnique({
    where: { id: postId },
    select: postSelect
  });
}

/**
 * Get user profile with reusable pattern
 * @param userId - User ID
 * @returns User public profile
 */
async function getUserProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: userSelect
  });
}
```
