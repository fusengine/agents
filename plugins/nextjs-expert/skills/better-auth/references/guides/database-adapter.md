# Better Auth Custom Database Adapter

## Adapter Interface

```typescript
import { Adapter } from "better-auth"

export function myAdapter(db: MyDatabase): Adapter {
  return {
    id: "my-adapter",

    async create(data) {
      const { model, data: record } = data
      return db.insert(model, record)
    },

    async findOne(data) {
      const { model, where } = data
      return db.findFirst(model, where)
    },

    async findMany(data) {
      const { model, where, limit, offset, sortBy } = data
      return db.find(model, { where, limit, offset, orderBy: sortBy })
    },

    async update(data) {
      const { model, where, update } = data
      return db.update(model, where, update)
    },

    async delete(data) {
      const { model, where } = data
      return db.delete(model, where)
    },

    async deleteMany(data) {
      const { model, where } = data
      return db.deleteMany(model, where)
    }
  }
}
```

## Usage

```typescript
import { betterAuth } from "better-auth"
import { myAdapter } from "./my-adapter"

export const auth = betterAuth({
  database: myAdapter(myDatabaseInstance)
})
```

## Required Tables

```typescript
// Users
{ id, email, emailVerified, name, image, createdAt, updatedAt }

// Sessions
{ id, userId, token, expiresAt, createdAt, updatedAt }

// Accounts (OAuth)
{ id, userId, provider, providerAccountId, accessToken, refreshToken }

// Verifications
{ id, identifier, value, expiresAt, createdAt, updatedAt }
```

## Testing

```typescript
import { runAdapterTests } from "better-auth/test"

describe("My Adapter", () => {
  runAdapterTests(myAdapter(testDb))
})
```

## Publishing

```json
{
  "name": "better-auth-adapter-mydb",
  "peerDependencies": { "better-auth": "^1.0.0" }
}
```
