# Better Auth Sessions Concept

## How Sessions Work

```typescript
// Session stored in database + cookie
interface Session {
  id: string
  userId: string
  token: string           // Stored in cookie
  expiresAt: Date
  ipAddress?: string
  userAgent?: string
  createdAt: Date
  updatedAt: Date
}
```

## Session Lifecycle

```
1. User signs in → Session created → Token in cookie
2. Request arrives → Cookie extracted → Session validated
3. Session expired → User logged out → Cookie cleared
4. User signs out → Session deleted → Cookie cleared
```

## Session Storage

```typescript
// Database (default)
export const auth = betterAuth({
  database: prismaAdapter(prisma)
})

// Redis (secondary storage)
export const auth = betterAuth({
  secondaryStorage: {
    get: (key) => redis.get(key),
    set: (key, value, ttl) => redis.setEx(key, ttl, value),
    delete: (key) => redis.del(key)
  },
  session: { storage: "secondary-storage" }
})
```

## Session Validation

```typescript
// Server-side
const session = await auth.api.getSession({ headers: request.headers })
if (!session) return redirect("/login")

// Client-side
const { data: session } = await authClient.getSession()
```

## Session Configuration

```typescript
export const auth = betterAuth({
  session: {
    expiresIn: 60 * 60 * 24 * 7,    // 7 days
    updateAge: 60 * 60 * 24,         // Refresh daily
    cookieCache: { enabled: true, maxAge: 60 * 5 }  // 5 min cache
  }
})
```
