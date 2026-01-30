# Better Auth Username Plugin

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
