---
name: service-template
description: Service template with dependency injection (< 40 lines)
---

# Service (< 40 lines)

## Basic Service

```typescript
// modules/users/src/services/user.service.ts
import type { User, CreateUserInput, UpdateUserInput } from '../interfaces/user.interface'

const API_URL = '/api/users'

/**
 * User service for API operations.
 */
export const userService = {
  /**
   * Get all users.
   */
  async getAll(): Promise<User[]> {
    const res = await fetch(API_URL)
    return res.json()
  },

  /**
   * Get user by ID.
   */
  async getById(id: string): Promise<User | null> {
    const res = await fetch(`${API_URL}/${id}`)
    if (!res.ok) return null
    return res.json()
  },

  /**
   * Create new user.
   */
  async create(data: CreateUserInput): Promise<User> {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return res.json()
  },

  /**
   * Update user.
   */
  async update(id: string, data: UpdateUserInput): Promise<User> {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return res.json()
  }
}
```

---

## Service with Dependency Injection

```typescript
// modules/users/src/services/user.service.ts
import type { HttpClient } from '../interfaces/http.interface'
import type { User, CreateUserInput, UpdateUserInput } from '../interfaces/user.interface'

/**
 * Create user service with injected HTTP client.
 *
 * @param client - HTTP client implementation
 */
export function createUserService(client: HttpClient) {
  return {
    getAll: () => client.get<User[]>('/users'),

    getById: (id: string) => client.get<User>(`/users/${id}`),

    create: (data: CreateUserInput) => client.post<User>('/users', data),

    update: (id: string, data: UpdateUserInput) =>
      client.patch<User>(`/users/${id}`, data),

    delete: (id: string) => client.delete(`/users/${id}`)
  }
}

// Usage
// const userService = createUserService(axiosClient)
// const mockService = createUserService(mockClient)
```

---

## Query/Command Separation

```typescript
// modules/users/src/services/user-query.service.ts
import type { User } from '../interfaces/user.interface'

/**
 * User query service (read operations).
 */
export const userQueryService = {
  getAll: () => fetch('/api/users').then((r) => r.json() as Promise<User[]>),
  getById: (id: string) => fetch(`/api/users/${id}`).then((r) => r.json() as Promise<User>),
  search: (q: string) => fetch(`/api/users/search?q=${q}`).then((r) => r.json() as Promise<User[]>)
}

// modules/users/src/services/user-command.service.ts
import type { User, CreateUserInput } from '../interfaces/user.interface'

/**
 * User command service (write operations).
 */
export const userCommandService = {
  create: (data: CreateUserInput) =>
    fetch('/api/users', { method: 'POST', body: JSON.stringify(data) }).then((r) => r.json() as Promise<User>),
  delete: (id: string) => fetch(`/api/users/${id}`, { method: 'DELETE' })
}
```

---

## Rules

- Max 40 lines
- Import types from `../interfaces/`
- Use dependency injection for testability
- JSDoc for all exports
- No state management (use hooks/stores)
