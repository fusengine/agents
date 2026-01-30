# Better Auth Client (React)

## Client Configuration

```typescript
// lib/auth-client.ts
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL // Optional
})
```

## useSession Hook

```typescript
"use client"
import { authClient } from "@/lib/auth-client"

export function UserProfile() {
  const { data: session, isPending, error } = authClient.useSession()

  if (isPending) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!session) return <div>Not logged in</div>

  return (
    <div>
      <p>{session.user.email}</p>
      <p>{session.user.name}</p>
    </div>
  )
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

  if (error) {
    console.error(error.message)
  }
}
```

## Sign Up

```typescript
const handleSignUp = async (email: string, password: string, name: string) => {
  const { data, error } = await authClient.signUp.email({
    email,
    password,
    name,
    callbackURL: "/dashboard"
  })
}
```

## Sign In OAuth

```typescript
// Google
await authClient.signIn.social({
  provider: "google",
  callbackURL: "/dashboard"
})

// GitHub
await authClient.signIn.social({
  provider: "github",
  callbackURL: "/dashboard"
})
```

## Sign Out

```typescript
const handleLogout = async () => {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        window.location.href = "/"
      }
    }
  })
}
```

## Available Methods

| Method | Description |
|--------|-------------|
| `useSession()` | React hook for session |
| `signIn.email()` | Email/password login |
| `signIn.social()` | OAuth login |
| `signUp.email()` | Registration |
| `signOut()` | Logout |
| `getSession()` | Get session (non-hook) |
