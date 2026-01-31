---
name: client
description: React client SDK for authentication with hooks, sign in/up, OAuth, and session management
when-to-use: client-side auth, react components, login forms, session state, useSession hook
keywords: createAuthClient, useSession, signIn, signUp, signOut, authClient, react hooks
priority: high
requires: server-config.md, basic-usage.md
related: hooks.md, server-actions.md
---

# Better Auth Client (React)

## When to Use

- Client-side authentication in React
- Login/logout forms
- Session state in components
- OAuth social login buttons

## Why Client SDK

| Feature | Benefit |
|---------|---------|
| `useSession()` | React hook with loading state |
| Type-safe | Full TypeScript support |
| Auto-refresh | Session refreshes automatically |
| Optimistic | UI updates before API response |

## Client Configuration

```typescript
// modules/auth/src/hooks/auth-client.ts
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL // Optional
})
```

## useSession Hook

```typescript
"use client"
import { authClient } from "@/modules/auth/src/hooks/auth-client"

export function UserProfile() {
  const { data: session, isPending, error } = authClient.useSession()

  if (isPending) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!session) return <div>Not logged in</div>

  return <p>{session.user.email}</p>
}
```

## Sign In Email/Password

```typescript
const handleLogin = async (email: string, password: string) => {
  const { data, error } = await authClient.signIn.email({
    email,
    password,
    callbackURL: "/dashboard"
  })
  if (error) console.error(error.message)
}
```

## Sign Up

```typescript
const { data, error } = await authClient.signUp.email({
  email,
  password,
  name,
  callbackURL: "/dashboard"
})
```

## Sign In OAuth

```typescript
await authClient.signIn.social({
  provider: "google", // or "github"
  callbackURL: "/dashboard"
})
```

## Sign Out

```typescript
await authClient.signOut({
  fetchOptions: { onSuccess: () => window.location.href = "/" }
})
```

## Available Methods

| Method | Description |
|--------|-------------|
| `useSession()` | React hook for session |
| `signIn.email()` | Email/password login |
| `signIn.social()` | OAuth login |
| `signUp.email()` | Registration |
| `signOut()` | Logout |
