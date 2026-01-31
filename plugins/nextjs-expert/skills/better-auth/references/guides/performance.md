# Better Auth Performance Guide

## Session Caching

```typescript
export const auth = betterAuth({
  session: {
    cookieCache: { enabled: true, maxAge: 60 * 5 }  // 5 min cache
  }
})
```

## Secondary Storage (Redis)

```typescript
import { createClient } from "redis"
const redis = createClient({ url: process.env.REDIS_URL })

export const auth = betterAuth({
  secondaryStorage: {
    get: (key) => redis.get(key),
    set: (key, value, ttl) => redis.setEx(key, ttl, value),
    delete: (key) => redis.del(key)
  },
  session: { storage: "secondary-storage" },
  rateLimit: { storage: "secondary-storage" }
})
```

## Database Optimization

```typescript
// Connection pooling
const prisma = new PrismaClient()
// Pool in URL: postgresql://...?pool_size=10
```

```sql
-- Indexes
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_users_email ON users(email);
```

## Edge Runtime

```typescript
export const auth = betterAuth({
  advanced: { runtime: "edge" }
})
```

## Lazy Loading Plugins

```typescript
const plugins = []
if (process.env.ENABLE_2FA) plugins.push(twoFactor())
export const auth = betterAuth({ plugins })
```

## Monitoring

```typescript
hooks: {
  after: [{
    matcher: () => true,
    handler: async (ctx) => {
      metrics.track("auth_request", { path: ctx.path })
      return { response: ctx.response }
    }
  }]
}
```
