---
name: tabnine
description: Tabnine AI code completion for Prisma client and schema
when-to-use: Faster completions, offline support, team context
keywords: tabnine, ai-completion, offline, team-learning, suggestions
priority: medium
requires: /plugins/nextjs-expert/skills/prisma-7/references/installation.md
related: /plugins/nextjs-expert/skills/prisma-7/references/editor-setup.md, /plugins/nextjs-expert/skills/prisma-7/references/vscode.md, /plugins/nextjs-expert/skills/prisma-7/references/github-copilot.md
---

# Tabnine with Prisma

AI-powered code completion engine optimized for faster, context-aware suggestions.

## Installation

**VS Code:**

```bash
code --install-extension TabNine.tabnine-vscode
```

**Or:** Search "Tabnine" in Extensions, then restart VS Code.

## Setup

1. Install extension
2. Sign in with GitHub/email (optional, for Pro features)
3. Tabnine learns from your codebase immediately

## Features

- **Whole-line completion** - Completes entire statements
- **Local learning** - Adapts to your code patterns
- **Offline support** - Works without internet (Basic plan)
- **Team learning** - Share patterns across team (Pro)
- **Deep learning** - Understands context and intent
- **Fast response** - Optimized for low latency

## Prisma Query Completions

### Basic Query Pattern

```typescript
// Type 'const users' and Tabnine suggests:
const users = await prisma.user.findMany({
  where: { status: 'ACTIVE' },
  include: { posts: true }
})

// Type 'const post' and suggests:
const post = await prisma.post.findUnique({
  where: { id: postId },
  include: { author: true, comments: true }
})
```

### Smart Relation Completion

```typescript
// Based on your schema, Tabnine suggests:
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    // Suggests all relations: posts, comments, likes, profile
    posts: { include: { comments: true } },
    comments: true,
    _count: { select: { posts: true, comments: true } }
  }
})
```

## Schema Pattern Learning

After editing schema, Tabnine learns patterns:

```prisma
// Pattern 1: Standard model with timestamps
model Article {
  id        Int       @id @default(autoincrement())
  title     String
  slug      String    @unique
  content   String
  published Boolean   @default(false)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  // Tabnine suggests similar fields for next models
}

// Tabnine auto-suggests for new model:
model Comment {
  id        Int       @id @default(autoincrement())
  content   String
  published Boolean   @default(false)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  // Pattern recognized and auto-completed
}
```

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Accept suggestion | Tab |
| Dismiss | Escape |
| Next suggestion | Alt + ] |
| Open Tabnine menu | Alt + \ |

## Configuration

```json
// .vscode/settings.json
{
  "tabnine.experimentalAutoImports": true,
  "tabnine.debounceMs": 75,
  "tabnine.excludedLanguages": ["markdown"],
  "[prisma]": {
    "tabnine.enable": true
  }
}
```

## Learning from Patterns

Tabnine improves by analyzing your codebase:

```typescript
// Your common patterns:
async function getUser(id: number) {
  return prisma.user.findUnique({
    where: { id },
    include: { posts: true }
  })
}

// Tabnine learns this pattern and suggests it again:
async function getPost(id: number) {
  return prisma.post.findUnique({
    where: { id },
    include: { // auto-filled based on model
      comments: true,
      author: true
    }
  })
}
```

## Team Collaboration (Pro)

Share learned patterns across team:

```bash
# Enterprise features:
# - Team code analysis
# - Shared pattern learning
# - Custom models trained on team code
# - Code privacy controls
```

## Complex Query Assistance

```typescript
// Tabnine learns filtering patterns:
const filteredUsers = await prisma.user.findMany({
  where: {
    AND: [
      { status: 'ACTIVE' },
      { createdAt: { gte: new Date('2024-01-01') } },
      { posts: { some: { published: true } } }
    ]
  },
  orderBy: { createdAt: 'desc' },
  take: 10,
  skip: 0
  // Tabnine fills in pagination, includes, etc.
})
```

## Best Practices

1. **Be consistent** - Tabnine learns your patterns
2. **Use types** - Type hints improve suggestions
3. **Review code** - Don't blindly accept suggestions
4. **Train locally** - More private than cloud AI
5. **Update regularly** - Better models over time

## Troubleshooting

### Suggestions Not Appearing

```bash
# Restart Tabnine
# Command Palette → "Tabnine: Restart Engine"

# Or restart VS Code entirely
```

### Performance Issues

```json
// Increase debounce time
{
  "tabnine.debounceMs": 150
}
```

### Disable for Specific Languages

```json
{
  "tabnine.excludedLanguages": ["markdown", "text"]
}
```

### Privacy Concerns

```json
// Run local mode only (no cloud)
{
  "tabnine.local": true
}
```

---
