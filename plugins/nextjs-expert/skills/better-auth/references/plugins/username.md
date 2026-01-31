---
name: username
description: Username-based authentication with email fallback
when-to-use: username login, alternative to email login, community features
keywords: username, usernames, login, alternative auth, community
priority: low
requires: server-config.md
related: basic-usage.md
---

# Better Auth Username Plugin

## When to Use

- Gaming or social platforms
- Public profiles with @handles
- Email-optional applications
- Community-based products

## Why Username Auth

| Email only | With username |
|------------|---------------|
| Long identifier | Short @handle |
| Private by default | Public identity |
| Formal | Casual/gaming |
| No uniqueness display | Visible uniqueness |

## Overview
Enable username-based authentication alongside or instead of email.

## Installation

```typescript
// modules/auth/src/services/auth.ts
import { betterAuth } from "better-auth"
import { username } from "better-auth/plugins"

export const auth = betterAuth({
  plugins: [username()]
})
```

## Client Setup

```typescript
import { createAuthClient } from "better-auth/react"
import { usernameClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [usernameClient()]
})
```

## Usage

### Sign Up with Username
```typescript
const { signUp } = authClient

await signUp.email({
  email: "user@example.com",
  password: "password123",
  username: "johndoe",
  name: "John Doe"
})
```

### Sign In with Username
```typescript
const { signIn } = authClient

await signIn.username({
  username: "johndoe",
  password: "password123"
})
```

## Configuration

```typescript
username({
  minLength: 3,           // Minimum username length
  maxLength: 20,          // Maximum username length
  // Validation regex (alphanumeric + underscore)
  pattern: /^[a-zA-Z0-9_]+$/
})
```

## Custom Validation

```typescript
username({
  validateUsername: async (username) => {
    // Check reserved words
    const reserved = ["admin", "root", "system"]
    if (reserved.includes(username.toLowerCase())) {
      return { valid: false, message: "Username is reserved" }
    }
    // Check profanity, etc.
    return { valid: true }
  }
})
```

## Check Username Availability

```typescript
const { username: usernamePlugin } = authClient

const isAvailable = await usernamePlugin.checkAvailability({
  username: "johndoe"
})
// { available: true } or { available: false }
```

## Update Username

```typescript
await authClient.updateUser({
  username: "newusername"
})
```
