---
name: service-template
description: Service template with dependency injection (< 60 lines)
when-to-use: creating services, API clients, data access layers
keywords: service, API, client, data access, dependency injection
priority: medium
related: single-responsibility.md, dependency-inversion.md
applies-to: "**/*service*.ts, **/*Service*.ts"
trigger-on-edit: "services/"
level: template
---

# Service (< 60 lines)

## Basic Service

```typescript
// modules/users/src/services/user.service.ts
import type { User, CreateUserInput } from '../interfaces/user.interface'

const API_URL = '/api/users'

/**
 * User service for API operations.
 */
export const userService = {
  /** Get all users. */
  async getAll(): Promise<User[]> {
    const res = await fetch(API_URL)
    return res.json()
  },

  /** Get user by ID. */
  async getById(id: string): Promise<User | null> {
    const res = await fetch(`${API_URL}/${id}`)
    if (!res.ok) return null
    return res.json()
  },

  /** Create new user. */
  async create(data: CreateUserInput): Promise<User> {
    const res = await fetch(API_URL, {
      method: 'POST',
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
import type { HttpClient } from '@/modules/cores/interfaces/http.interface'
import type { User, CreateUserInput } from '../interfaces/user.interface'

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
    delete: (id: string) => client.delete(`/users/${id}`)
  }
}

// Usage:
// const userService = createUserService(fetchClient)
// const mockService = createUserService(mockClient)
```

---

## File I/O Service (Bun)

```typescript
// modules/files/src/services/file.service.ts
import type { FileReader, FileWriter } from '@/modules/cores/interfaces/file.interface'

/**
 * Create file service for Bun runtime.
 *
 * @param basePath - Base directory for file operations
 */
export function createFileService(basePath: string): FileReader & FileWriter {
  return {
    async read(path: string): Promise<string> {
      const file = Bun.file(`${basePath}/${path}`)
      if (!(await file.exists())) return ''
      return file.text()
    },

    async write(path: string, content: string): Promise<void> {
      await Bun.write(`${basePath}/${path}`, content)
    },

    async readJson<T>(path: string): Promise<T | null> {
      const text = await this.read(path)
      if (!text) return null
      return JSON.parse(text) as T
    }
  }
}
```

---

## Rules

- Max 60 lines
- Import feature types from `../interfaces/`, shared from `@/modules/cores/interfaces/`
- Use dependency injection for testability
- JSDoc for all exports
- No state management in services
