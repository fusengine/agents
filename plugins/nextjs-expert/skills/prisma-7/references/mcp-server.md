---
name: mcp-server
description: Prisma MCP Server for AI assistants and LLM integration
when-to-use: Claude integration, AI-powered query generation, schema exploration
keywords: mcp, ai-assistants, claude, llm-integration, server
priority: high
requires: /plugins/nextjs-expert/skills/prisma-7/references/installation.md
related: /plugins/nextjs-expert/skills/prisma-7/references/prisma-ai.md, /plugins/nextjs-expert/skills/prisma-7/references/github-copilot.md
---

# Prisma MCP Server

Model Context Protocol server for integrating Prisma with AI assistants like Claude.

## Installation

```bash
# NPM
npm install -D @prisma/mcp-server

# Yarn
yarn add -D @prisma/mcp-server

# PNPM
pnpm add -D @prisma/mcp-server
```

## Setup

### Configuration

Add to Claude configuration:

```json
// .claude/claude.json
{
  "mcpServers": {
    "prisma": {
      "command": "npx",
      "args": ["@prisma/mcp-server"],
      "env": {
        "DATABASE_URL": "postgresql://...",
        "PRISMA_SCHEMA_PATH": "./prisma/schema.prisma"
      }
    }
  }
}
```

Or configure in Claude desktop:

```json
// ~/Library/Application Support/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "prisma": {
      "command": "npx",
      "args": ["@prisma/mcp-server"],
      "env": {
        "DATABASE_URL": "postgresql://user:pass@localhost/db"
      }
    }
  }
}
```

## Features

- **Schema inspection** - Explore models and relations
- **Query generation** - Create type-safe queries from descriptions
- **Migration assistance** - Suggest schema changes
- **Type definitions** - Generate TypeScript types
- **Documentation** - Model documentation and examples
- **Error debugging** - Diagnose Prisma errors

## Usage with Claude

### Query Generation

```
User: "Create a Prisma query to find all published posts by a specific author"

Claude: "I'll use the Prisma MCP server to check your schema first."

Generated:
const posts = await prisma.post.findMany({
  where: {
    published: true,
    author: {
      id: authorId
    }
  },
  orderBy: { createdAt: 'desc' }
})
```

### Schema Exploration

```
User: "What relations does the Post model have?"

Claude uses MCP to query schema:

Response:
The Post model has:
- author (User): Back-reference to Post[]
- comments (Comment[]): One-to-many relation
- tags (Tag[]): Many-to-many relation
- likes (Like[]): One-to-many relation
```

### Migration Planning

```
User: "I need to add a status field to posts with default 'draft'"

Claude with MCP suggests:
1. Update schema
2. Generate migration
3. Verify no data loss
4. Create migration code

model Post {
  ...
  status String @default("draft")
}

Migration:
ALTER TABLE "Post" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'draft';
```

## API Methods

```typescript
// Available MCP methods:

// Get all models
getSchemaModels()

// Get model details
getModelDetails(modelName: string)

// Get relations
getModelRelations(modelName: string)

// Generate query
generateQuery(
  description: string,
  modelName: string
)

// Validate query
validateQuery(query: string)

// Get type definitions
generateTypes(modelName: string)

// Get migration suggestion
suggestMigration(changes: SchemaChange[])
```

## Example Integration

```typescript
// Your application can also use MCP programmatically
import { PrismaMCPServer } from '@prisma/mcp-server'

const mcp = new PrismaMCPServer({
  databaseUrl: process.env.DATABASE_URL,
  schemaPath: './prisma/schema.prisma'
})

// Query Claude with Prisma context
const response = await mcp.generateQuery({
  description: 'Find active users who commented in the last 7 days',
  modelName: 'User'
})

console.log(response.query)
// Returns type-safe Prisma query
```

## Configuration Options

```json
{
  "mcpServers": {
    "prisma": {
      "command": "npx",
      "args": ["@prisma/mcp-server"],
      "env": {
        "DATABASE_URL": "postgresql://...",
        "PRISMA_SCHEMA_PATH": "./prisma/schema.prisma",
        "LOG_LEVEL": "info",
        "ENABLE_QUERY_VALIDATION": "true",
        "CACHE_SCHEMA": "true"
      }
    }
  }
}
```

## Conversation Examples

### Complex Query with AI

```
User: "Get me the top 10 users by engagement (posts + comments)
       with their recent content and follower count"

Claude uses Prisma MCP:
1. Checks User, Post, Comment models
2. Verifies available fields
3. Generates optimized query

Result:
const topUsers = await prisma.user.findMany({
  include: {
    _count: {
      select: {
        posts: true,
        comments: true,
        followers: true
      }
    },
    posts: {
      take: 5,
      orderBy: { createdAt: 'desc' }
    },
    comments: {
      take: 5,
      orderBy: { createdAt: 'desc' }
    }
  },
  orderBy: {
    // AI learns to sort by engagement
    _count: { posts: 'desc' }
  },
  take: 10
})
```

### Schema Debugging

```
User: "Why is this relation not working?"

Claude with MCP:
1. Inspects relation definition
2. Checks foreign key configuration
3. Suggests fixes

Response:
The relation is missing @relation on the Post side.
Add: author User @relation("UserPosts", fields: [authorId], references: [id])
```

## Best Practices

1. **Keep schema updated** - MCP reads from schema file
2. **Use descriptive names** - AI understands better
3. **Document models** - Add /// comments to models
4. **Test generated code** - Always verify before deploying
5. **Combine with human review** - AI is assistant, not replacement

```prisma
/// User account in the system
model User {
  /// Unique identifier
  id    Int     @id @default(autoincrement())
  /// Email address (unique per user)
  email String  @unique
  /// User's display name
  name  String?
  /// User's published posts
  posts Post[]
}
```

## Troubleshooting

### MCP Server Not Connecting

```bash
# Test connection
npx @prisma/mcp-server --test

# Check environment variables
echo $DATABASE_URL
echo $PRISMA_SCHEMA_PATH
```

### Schema Changes Not Reflected

```bash
# Clear cache
rm -rf node_modules/.prisma
npx prisma generate
```

### Performance Issues

```json
{
  "env": {
    "CACHE_SCHEMA": "true",
    "CACHE_TTL": "3600"
  }
}
```

---
