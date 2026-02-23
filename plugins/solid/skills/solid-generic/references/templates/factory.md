---
name: factory-template
description: Factory pattern template with dependency injection (< 60 lines)
when-to-use: creating factories, object creation patterns, dependency resolution
keywords: factory, creation, builder, instantiation, pattern
priority: medium
related: dependency-inversion.md, open-closed.md
applies-to: "**/*factory*.ts, **/*Factory*.ts"
trigger-on-edit: "factories/"
level: template
---

# Factory (< 60 lines)

## HTTP Client Factory

```typescript
// modules/cores/lib/fetch-client.ts
import type { HttpClient } from '../interfaces/http.interface'

/**
 * Create HTTP client using fetch API.
 *
 * @param baseUrl - Base URL for all requests
 * @param headers - Default headers for all requests
 */
export function createFetchClient(
  baseUrl: string,
  headers: Record<string, string> = {}
): HttpClient {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...headers
  }

  return {
    async get<T>(url: string): Promise<T> {
      const res = await fetch(`${baseUrl}${url}`, { headers: defaultHeaders })
      return res.json() as T
    },

    async post<T>(url: string, data: unknown): Promise<T> {
      const res = await fetch(`${baseUrl}${url}`, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(data)
      })
      return res.json() as T
    },

    async patch<T>(url: string, data: unknown): Promise<T> {
      const res = await fetch(`${baseUrl}${url}`, {
        method: 'PATCH',
        headers: defaultHeaders,
        body: JSON.stringify(data)
      })
      return res.json() as T
    },

    async delete(url: string): Promise<void> {
      await fetch(`${baseUrl}${url}`, {
        method: 'DELETE',
        headers: defaultHeaders
      })
    }
  }
}
```

---

## Storage Factory (Strategy Pattern)

```typescript
// modules/cores/lib/memory-storage.ts
import type { Storage } from '../interfaces/storage.interface'

/** Create in-memory storage for testing. */
export function createMemoryStorage(): Storage {
  const store = new Map<string, string>()

  return {
    get: async (key) => store.get(key) ?? null,
    has: async (key) => store.has(key),
    set: async (key, value) => { store.set(key, value) },
    delete: async (key) => { store.delete(key) }
  }
}
```

```typescript
// modules/cores/lib/file-storage.ts
import type { Storage } from '../interfaces/storage.interface'

/** Create file-based storage for production. */
export function createFileStorage(dir: string): Storage {
  return {
    get: async (key) => {
      const file = Bun.file(`${dir}/${key}`)
      return (await file.exists()) ? file.text() : null
    },
    has: async (key) => Bun.file(`${dir}/${key}`).exists(),
    set: async (key, value) => { await Bun.write(`${dir}/${key}`, value) },
    delete: async (key) => {
      const { unlink } = await import('node:fs/promises')
      await unlink(`${dir}/${key}`).catch(() => {})
    }
  }
}
```

---

## Application Bootstrap Factory

```typescript
// modules/cores/lib/bootstrap.ts
import type { Config } from '../interfaces/config.interface'
import { createFetchClient } from './fetch-client'
import { createUserService } from '@/modules/users/src/services/user.service'

/** Bootstrap application with all dependencies. */
export function bootstrap(config: Config) {
  const client = createFetchClient(config.apiUrl)
  const userService = createUserService(client)

  return { userService }
}
```

---

## Rules

- Max 60 lines per factory
- Return interface type (not concrete)
- JSDoc with `@param` for all parameters
- One factory per file
- Location: `modules/cores/lib/` (shared infrastructure)
