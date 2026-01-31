---
name: factory-template
description: Factory pattern templates for dependency injection (< 40 lines)
---

# Factory Pattern (< 40 lines)

## Service Factory

```typescript
// modules/cores/factories/service.factory.ts
import type { HttpClient } from '../interfaces/http.interface'
import type { User, CreateUserInput, UpdateUserInput } from '@/modules/users/src/interfaces/user.interface'

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

export type UserService = ReturnType<typeof createUserService>
```

---

## Storage Factory

```typescript
// modules/cores/factories/storage.factory.ts

interface Storage {
  get<T>(key: string): T | null
  set<T>(key: string, value: T): void
  remove(key: string): void
}

type StorageType = 'local' | 'session' | 'memory'

/**
 * Create storage implementation.
 *
 * @param type - Storage type
 */
export function createStorage(type: StorageType): Storage {
  switch (type) {
    case 'local':
      return {
        get: (key) => JSON.parse(localStorage.getItem(key) ?? 'null'),
        set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
        remove: (key) => localStorage.removeItem(key)
      }
    case 'session':
      return {
        get: (key) => JSON.parse(sessionStorage.getItem(key) ?? 'null'),
        set: (key, value) => sessionStorage.setItem(key, JSON.stringify(value)),
        remove: (key) => sessionStorage.removeItem(key)
      }
    case 'memory': {
      const store = new Map<string, unknown>()
      return {
        get: (key) => (store.get(key) as unknown) ?? null,
        set: (key, value) => store.set(key, value),
        remove: (key) => store.delete(key)
      }
    }
  }
}
```

---

## HTTP Client Factory

```typescript
// modules/cores/factories/http.factory.ts
import type { HttpClient } from '../interfaces/http.interface'

interface HttpClientOptions {
  baseUrl: string
  headers?: Record<string, string>
}

/**
 * Create HTTP client with base configuration.
 *
 * @param options - Client options
 */
export function createHttpClient(options: HttpClientOptions): HttpClient {
  const { baseUrl, headers = {} } = options

  async function request<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${baseUrl}${url}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...headers, ...init?.headers }
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  }

  return {
    get: <T>(url: string) => request<T>(url),
    post: <T>(url: string, data: unknown) =>
      request<T>(url, { method: 'POST', body: JSON.stringify(data) }),
    patch: <T>(url: string, data: unknown) =>
      request<T>(url, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (url: string) => request<void>(url, { method: 'DELETE' })
  }
}
```

---

## Rules

- Max 40 lines
- Location: `modules/cores/factories/` or `modules/[feature]/src/factories/`
- Export factory function AND return type
- JSDoc for all exports
- Use for dependency injection
