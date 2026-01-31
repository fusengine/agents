---
name: mongodb
description: MongoDB support status in Prisma 7, deprecation path, and migration alternatives
when-to-use: Understanding MongoDB support, migration planning, evaluating alternatives
keywords: MongoDB, deprecation, unsupported, migration, alternatives
priority: high
requires: schema.md, schema.types.md
related: driver-adapters.md, deployment.md, typedsql.md
---

# MongoDB in Prisma 7

Type definitions in `/plugins/nextjs-expert/skills/prisma-7/references/interfaces/schema.types.md`.

MongoDB support status and migration guidance for Prisma 7.

## Support Status

**MongoDB is NOT supported in Prisma 7.0 - 7.3**

- Prisma v6 and earlier: Full MongoDB support ✅
- Prisma v7.0 - v7.3: Removed ❌
- Future versions: Under evaluation

---

## Why MongoDB Support Was Removed

1. **Architectural differences** - MongoDB's document model differs from SQL schemas
2. **Type safety challenges** - Schema validation conflicts with flexibility
3. **Performance issues** - Join operations less efficient
4. **Maintenance burden** - Required separate code path

---

## Migration Paths

### Option 1: Stay on Prisma v6

```bash
# Pin to Prisma v6
npm install prisma@6 @prisma/client@6
```

**Pros**: No migration needed
**Cons**: No v7 features, limited support window

### Option 2: Migrate to PostgreSQL/MySQL

Most reliable migration path.

```typescript
/**
 * Schema migration from MongoDB to PostgreSQL.
 * See `GeneratorConfig` and `ModelDefinition` in /plugins/nextjs-expert/skills/prisma-7/references/interfaces/schema.types.md
 * @typedef {Object} PostModel
 * @property {string} id - Primary key (CUID for PostgreSQL instead of ObjectId)
 * @property {string} title - Post title
 * @property {string} content - Post content
 * @property {Author | null} author - Related author
 * @module modules/database/src/services/posts
 */
type PostModel = {
  id: string;
  title: string;
  content: string;
  author: Author | null;
}

/**
 * Migration helper to transform MongoDB Post to PostgreSQL Post.
 * @param {object} mongoPost - Post from MongoDB
 * @returns {PostModel} Transformed post for PostgreSQL
 * @module modules/database/src/migrations/mongo-to-postgres
 */
function migratePost(mongoPost: any): PostModel {
  return {
    id: mongoPost._id.toString(), // Convert ObjectId to string, or use cuid()
    title: mongoPost.title,
    content: mongoPost.content,
    author: mongoPost.author || null,
  }
}
```

### Option 3: Use Native MongoDB Drivers

```typescript
/**
 * Native MongoDB driver initialization.
 * No type safety - requires manual type definitions.
 * @module modules/database/src/services/mongo
 */
import { MongoClient } from 'mongodb'
import type { Db, Collection } from 'mongodb'

/**
 * MongoDB database connection factory.
 * @returns {Promise<Db>} MongoDB database instance
 * @module modules/database/src/services/mongo
 */
async function getMongoDb(): Promise<Db> {
  const client = new MongoClient(process.env.DATABASE_URL!)
  const db = client.db('myapp')
  return db
}

/**
 * Find user by ID with manual type assertion.
 * @param {string} userId - User identifier
 * @returns {Promise<any>} User document (untyped)
 * @module modules/database/src/services/users-mongo
 */
async function getUserById(userId: string) {
  const db = await getMongoDb()
  const user = await db.collection('users').findOne({ _id: userId })
  return user // Manual queries - no type safety
}
```

---

## Direct MongoDB Libraries

Use these instead of Prisma for MongoDB:

| Library | Type-Safety | Features |
|---------|------------|----------|
| **mongodb** | Manual | Official driver, minimal |
| **mongoose** | Plugins | ODM with validation |
| **typegoose** | TSDoc | TypeScript + Mongoose |
| **drizzle** | ✅ | Experimental MongoDB support |

---

## Recommended: Switch to PostgreSQL

```typescript
/**
 * Recommended MongoDB to PostgreSQL migration workflow.
 * See `MigrationDevOptions` in /plugins/nextjs-expert/skills/prisma-7/references/interfaces/migrations.types.md
 * @module modules/database/src/migrations/mongodb-to-postgres
 */

/**
 * Export MongoDB collection to JSON format.
 * @param {string} collectionName - Collection name to export
 * @returns {Promise<void>}
 * @module modules/database/src/scripts/export-mongo
 */
async function exportMongoCollection(collectionName: string): Promise<void> {
  // Use MongoDB's export tools or third-party services
  console.log(`Exporting ${collectionName} from MongoDB...`)
}

/**
 * Execute Prisma migration after data import.
 * @returns {Promise<void>}
 * @module modules/database/src/scripts/migrate-to-postgres
 */
async function migrateToPostgres(): Promise<void> {
  // npm install prisma@latest @prisma/client@latest
  // npx prisma migrate dev --name init
  console.log('Migration complete')
}
```

---

## Drizzle ORM (Alternative)

Drizzle ORM has experimental MongoDB support:

```typescript
/**
 * Drizzle ORM with experimental MongoDB support.
 * See `DatabaseType` in /plugins/nextjs-expert/skills/prisma-7/references/interfaces/field-attributes.types.md
 * @module modules/database/src/services/drizzle-mongo
 */
import { drizzle } from 'drizzle-orm/mongodb'
import { MongoClient } from 'mongodb'
import type { Db } from 'mongodb'

/**
 * Initialize Drizzle ORM with MongoDB.
 * @returns {Promise<any>} Drizzle DB instance
 * @module modules/database/src/services/drizzle-mongo
 */
async function initDrizzleDB() {
  const client = new MongoClient(process.env.DATABASE_URL!)
  const db: Db = client.db('myapp')
  return drizzle(db)
}

/**
 * Query users using Drizzle with MongoDB.
 * @returns {Promise<any[]>} List of users
 * @module modules/database/src/services/users-drizzle
 */
async function getUsers() {
  const db = await initDrizzleDB()
  // const users = await db.select().from(usersTable)
  return []
}
```

---

## Timeline

- **Prisma v6**: MongoDB fully supported
- **Prisma v7.0** (2024): MongoDB removed
- **Future**: Under evaluation

Check [Prisma Roadmap](https://github.com/prisma/prisma/discussions) for updates.

---

## Migration Support Resources

1. Export MongoDB collections
2. Use ETL tools (Airbyte, Talend)
3. Leverage PostgreSQL's JSON fields for flexibility
4. Gradually refactor queries
