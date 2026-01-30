# SOLID Principles for React 19

## S - Single Responsibility

1 component = 1 UI concern
1 hook = 1 logic concern

```typescript
// ❌ BAD - Mixed concerns
function UserProfile() {
  // fetching, formatting, validation, rendering...
}

// ✅ GOOD - Separated
function UserProfile({ user }: UserProfileProps) {
  return <UserCard user={user} />
}

function useUser(id: string) {
  // fetching logic only
}
```

---

## O - Open/Closed

Components extensible without modification

```typescript
// Extensible via props
interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

// New variants without modifying existing code
<Button variant="primary">Save</Button>
<Button variant="secondary">Cancel</Button>
```

---

## L - Liskov Substitution

All implementations respect contracts

```typescript
interface DataSource<T> {
  fetch(): Promise<T[]>
}

// Any DataSource can be swapped
const apiSource: DataSource<User> = new ApiDataSource()
const mockSource: DataSource<User> = new MockDataSource()
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
// src/services/user.service.ts
import type { HttpClient } from '../interfaces/http.interface'

export function createUserService(client: HttpClient) {
  return {
    async getUser(id: string) {
      return client.get(`/users/${id}`)
    }
  }
}
```
