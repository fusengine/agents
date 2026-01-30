# Client Better Auth (React)

## Configuration Client

```typescript
// lib/auth-client.ts
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL // Optionnel
})
```

## Hook useSession

```typescript
"use client"
import { authClient } from "@/lib/auth-client"

export function UserProfile() {
  const { data: session, isPending, error } = authClient.useSession()

  if (isPending) return <div>Chargement...</div>
  if (error) return <div>Erreur: {error.message}</div>
  if (!session) return <div>Non connecté</div>

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

## Méthodes Disponibles

| Méthode | Description |
|---------|-------------|
| `useSession()` | Hook React pour session |
| `signIn.email()` | Login email/password |
| `signIn.social()` | Login OAuth |
| `signUp.email()` | Inscription |
| `signOut()` | Déconnexion |
| `getSession()` | Récupérer session (non-hook) |
