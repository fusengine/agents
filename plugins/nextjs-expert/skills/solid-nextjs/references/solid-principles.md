# SOLID Principles for Next.js

## S - Single Responsibility

1 module = 1 feature domain

```typescript
// ❌ BAD - Mixed concerns in page
export default function LoginPage() {
  // validation, API calls, formatting, rendering...
}

// ✅ GOOD - Page orchestrates modules
import { LoginForm } from '@/modules/auth/components/LoginForm'

export default function LoginPage() {
  return <LoginForm />
}
```

---

## O - Open/Closed

Modules extensible without modification

```typescript
// modules/auth/src/interfaces/provider.interface.ts
export interface AuthProvider {
  login(credentials: Credentials): Promise<Session>
  logout(): Promise<void>
}

// New providers without modifying existing code
// modules/auth/src/services/github.provider.ts
// modules/auth/src/services/google.provider.ts
```

---

## L - Liskov Substitution

All implementations respect contracts

```typescript
// Any AuthProvider can be swapped
const provider: AuthProvider = new GitHubProvider()
// or
const provider: AuthProvider = new GoogleProvider()
```

---

## I - Interface Segregation

Small, focused interfaces

```typescript
// ❌ BAD
interface UserModule {
  login(): void
  logout(): void
  updateProfile(): void
  sendEmail(): void
}

// ✅ GOOD - Separated
interface Authenticatable { login(): void; logout(): void }
interface Editable { updateProfile(): void }
```

---

## D - Dependency Inversion

Depend on interfaces, not implementations

```typescript
// modules/auth/src/services/auth.service.ts
import type { AuthProvider } from '../interfaces/provider.interface'

export function createAuthService(provider: AuthProvider) {
  return {
    async authenticate(credentials: Credentials) {
      return provider.login(credentials)
    }
  }
}
```
