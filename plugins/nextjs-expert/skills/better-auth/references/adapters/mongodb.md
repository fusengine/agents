---
name: mongodb
description: Document database integration with MongoDB for flexible schema authentication
when-to-use: document database, flexible schema, MongoDB Atlas, existing mongodb infrastructure
keywords: MongoDB, NoSQL, adapter, document database, collections, flexible schema, atlas
priority: high
requires: installation.md, server-config.md
related: adapters/prisma.md, adapters/drizzle.md, concepts/database.md
---

# Better Auth MongoDB Adapter

## When to Use

- Document database requirements
- Flexible schema needed
- MongoDB Atlas deployment
- Existing MongoDB infrastructure

## Why MongoDB

| SQL | MongoDB |
|-----|---------|
| Fixed schema | Flexible documents |
| Relations required | Embedded data |
| Strict types | Schema-less |
| Vertical scaling | Horizontal scaling |

## Installation

```bash
bun add mongodb
```

## Configuration

```typescript
// modules/auth/src/services/auth.ts
import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)
const db = client.db("myapp")

export const auth = betterAuth({
  database: mongodbAdapter(db)
})
```

## Connection Management

```typescript
// modules/cores/database/mongodb.ts
import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI!
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export { clientPromise }
```

## Collections Created

Better Auth creates these collections:
- `users` - User accounts
- `sessions` - Active sessions
- `accounts` - OAuth accounts
- `verifications` - Email verifications

## Experimental Joins (v1.4.0+)

```typescript
mongodbAdapter(db, {
  experimentalJoins: true  // Enable for better query performance
})
```

## Environment Variables

```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/myapp
```

## Indexes (Recommended)

```javascript
db.users.createIndex({ email: 1 }, { unique: true })
db.sessions.createIndex({ token: 1 }, { unique: true })
db.sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
```
