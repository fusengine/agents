---
name: github-copilot
description: GitHub Copilot integration with Prisma for query and schema generation
when-to-use: Query suggestions, schema generation, migration hints
keywords: copilot, ai-completion, suggestions, schema-generation, queries
priority: medium
requires: /plugins/nextjs-expert/skills/prisma-7/references/installation.md
related: /plugins/nextjs-expert/skills/prisma-7/references/editor-setup.md, /plugins/nextjs-expert/skills/prisma-7/references/vscode.md, /plugins/nextjs-expert/skills/prisma-7/references/mcp-server.md
---

# GitHub Copilot with Prisma

AI-powered code completion for Prisma client queries and schema design.

## Setup

1. Install Copilot extension (VS Code)
2. Sign in with GitHub account
3. Start using in `.ts`, `.tsx`, `.js` files

```bash
# Extension ID
code --install-extension GitHub.Copilot
code --install-extension GitHub.Copilot-Chat
```

## Query Suggestions

### Example: User Queries

```typescript
// Copilot suggests based on context:
const prisma = new PrismaClient()

// ✅ Suggestion: Get all users with posts
const users = await prisma.user.findMany({
  include: {
    posts: true
  }
})

// ✅ Suggestion: Find active users with count
const activeUsers = await prisma.user.findMany({
  where: { status: 'ACTIVE' },
  include: { _count: { select: { posts: true } } }
})
```

## Schema Generation Prompts

Use Copilot Chat for schema suggestions:

```
/explain What does this Prisma schema do?
/generate Create a User-Post-Comment schema

Prompt:
"Generate a Prisma schema for a blog with users, posts, comments,
tags, and likes. Include proper relations and constraints."

Result:
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  posts Post[]
  comments Comment[]
  likes Like[]
}

model Post {
  id    Int     @id @default(autoincrement())
  title String
  author User @relation(fields: [authorId], references: [id])
  authorId Int
  comments Comment[]
  tags Tag[]
  likes Like[]
}
```

## Complex Query Assistance

```typescript
// Prompt: "Find users who commented but didn't post"
const usersCommentedNotPosted = await prisma.user.findMany({
  where: {
    comments: { some: {} },
    posts: { none: {} }
  },
  select: {
    id: true,
    email: true,
    _count: { select: { comments: true } }
  }
})
```

## Migration Hints

Type schema change, Copilot suggests migration:

```prisma
// Before
model User {
  id String @id
  email String
}

// After
model User {
  id String @id
  email String @unique
  phone String?
}

// Copilot suggests migration:
// ALTER TABLE "User" ADD CONSTRAINT "User_email_key" UNIQUE ("email");
// ALTER TABLE "User" ADD COLUMN "phone" TEXT;
```

## Best Practices with Copilot

1. **Provide context** - Comment intent before query
2. **Use types** - Define return types to guide suggestions
3. **Review suggestions** - Always verify generated code
4. **Commit often** - Easy to revert bad suggestions
5. **Combine with tests** - Verify suggestions work

```typescript
/**
 * Get all published posts by a user with engagement metrics
 * @param userId - The user ID
 * @returns Posts with likes and comments count
 */
async function getUserPublishedPosts(userId: string) {
  // Copilot provides better suggestions with JSDoc context
  return prisma.post.findMany({
    where: {
      authorId: userId,
      published: true
    },
    include: {
      _count: { select: { likes: true, comments: true } }
    }
  })
}
```

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Accept suggestion | Tab |
| Reject suggestion | Escape |
| Next suggestion | Alt + ] |
| Previous suggestion | Alt + [ |
| Open Chat | Ctrl + Shift + I |

## Common Patterns

### Pagination

```typescript
// Copilot auto-completes:
const page = 1
const pageSize = 10
const posts = await prisma.post.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize
})
```

### Filtering with Search

```typescript
// Search and filter
const searchResults = await prisma.user.findMany({
  where: {
    OR: [
      { email: { contains: query } },
      { name: { contains: query } }
    ]
  }
})
```

### Soft Delete Pattern

```typescript
// Copilot suggests soft delete implementation:
const activeUsers = await prisma.user.findMany({
  where: { deletedAt: null }
})
```

## Troubleshooting

### Suggestions Not Appearing

```bash
# Check Copilot status in VS Code
# Bottom right corner should show Copilot icon
# If disabled, click to enable

# Restart VS Code if needed
```

### Disabling Copilot for Schema Files

```json
// .vscode/settings.json
{
  "[prisma]": {
    "github.copilot.enable": false
  }
}
```

---
